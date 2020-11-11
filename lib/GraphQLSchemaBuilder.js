import { getNamedType, GraphQLNonNull, isEnumType, isInputObjectType, isInputType, isInterfaceType, isListType, isNonNullType, isObjectType, isScalarType, isSpecifiedDirective, isUnionType, print } from 'graphql';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import { addResolversToSchema, buildSchemaFromTypeDefinitions, makeExecutableSchema, SchemaDirectiveVisitor } from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';
import { camelCase, each, find, has, isEmpty, set, values } from 'lodash';
import pluralize from 'pluralize';
import { getReturnType, typeIsList } from './GraphQLUtils';
import { getRootMatchFields, queryArgs } from './TypeGeneratorUtilities';
export class GraphQLSchemaBuilder {
    constructor(typeDefs = '', $config) {
        this.printSchemaWithDirectives = () => {
            const str = Object
                .keys(this.schema.getTypeMap())
                .filter(k => !k.match(/^__/))
                .reduce((accum, name) => {
                const type = this.schema.getType(name);
                return !isScalarType(type)
                    ? accum += `${print(type.astNode)}\n`
                    : accum;
            }, '');
            return this.schema
                .getDirectives()
                .reduce((accum, d) => {
                return !isSpecifiedDirective(d)
                    ? accum += `${print(d.astNode)}\n`
                    : accum;
            }, str + `${this.schema.astNode ? print(this.schema.astNode) : ''}\n`);
        };
        this.addTypeDefsToSchema = ($typeDefs = '') => {
            if ($typeDefs) {
                this.typeDefs += (typeof $typeDefs === 'string' ? $typeDefs : print($typeDefs));
            }
            if (this.typeDefs.includes('@model') && !this.typeDefs.includes('directive @model')) {
                this.typeDefs = '\ndirective @model on OBJECT' + this.typeDefs;
            }
            if (this.typeDefs.includes('@connection') && !this.typeDefs.includes('directive @connection')) {
                this.typeDefs = '\ndirective @connection on FIELD_DEFINITION' + this.typeDefs;
            }
            if ((this.config.generateGetAll || this.config.generateConnections) && !this.typeDefs.includes('enum ORDER_BY_OPTIONS')) {
                this.typeDefs += `
			enum ORDER_BY_OPTIONS {
				ASCENDING
				DESCENDING
				ASC
				DESC
			}
			`;
            }
            if (this.typeDefs.includes('type Query') && (this.config.generateDelete || this.config.generateUpdate) && !this.typeDefs.includes('type BatchPayload')) {
                this.typeDefs += `
				type BatchPayload {
					"""
					The number of nodes that have been affected by the Batch operation.
					"""
					count: Int!
					clientMutationId: String
				}
			`;
            }
            let newTypeDefs = this.typeDefs;
            if (!this.typeDefs.includes('type Query')) {
                newTypeDefs += 'type Query {noop:Int}';
            }
            // let's make sure we have a valid schema
            try {
                buildSchemaFromTypeDefinitions(newTypeDefs);
            }
            catch (e) {
                // let's see if it errored due to unknown directive, which is something we can fake past and assume the directive will be added later
                let match;
                let hasMatch = false;
                const re = /Unknown directive\s*"(.*)"/g;
                let directiveTypeDefs = newTypeDefs;
                while ((match = re.exec(e.message)) != null) {
                    hasMatch = true;
                    if (match[1] && !directiveTypeDefs.includes(`directive @${match[1]}`)) {
                        directiveTypeDefs += `
						directive @${match[1]} on SCHEMA | SCALAR | OBJECT | FIELD_DEFINITION | ARGUMENT_DEFINITION | INTERFACE | UNION | ENUM | ENUM_VALUE | INPUT_OBJECT | INPUT_FIELD_DEFINITION
					`;
                    }
                }
                if (hasMatch) {
                    try {
                        buildSchemaFromTypeDefinitions(directiveTypeDefs);
                        newTypeDefs = directiveTypeDefs;
                    }
                    catch (e) {
                        // we added the directive but still error, let's add the arguments
                        hasMatch = false;
                        const re = /Unknown argument\s*"(.*)"\s*on directive\s*"@(.*)"/g;
                        const directives = {};
                        while ((match = re.exec(e.message)) != null) {
                            hasMatch = true;
                            directives[match[2]] = directives[match[2]] ? directives[match[2]] : [];
                            const field = match[1] + ': JSON';
                            if (!directives[match[2]].includes(field)) {
                                directives[match[2]].push(field);
                            }
                        }
                        if (hasMatch) {
                            directiveTypeDefs = newTypeDefs;
                            each(directives, (fields, directive) => {
                                directiveTypeDefs += `
								directive @${directive} (
									${fields.join('\n')}
								) on SCHEMA | SCALAR | OBJECT | FIELD_DEFINITION | ARGUMENT_DEFINITION | INTERFACE | UNION | ENUM | ENUM_VALUE | INPUT_OBJECT | INPUT_FIELD_DEFINITION
						`;
                            });
                            newTypeDefs = directiveTypeDefs;
                        }
                    }
                }
            }
            this.schema = makeExecutableSchema({
                typeDefs: newTypeDefs,
                resolvers: this.resolveFunctions,
                schemaDirectives: {
                    relation: RelationDirective,
                    default: DefaultDirective,
                    unique: UniqueDirective,
                    createdTimestamp: CreatedTimestampDirective,
                    updatedTimestamp: UpdatedTimestampDirective,
                    storeName: StoreNameDirective
                },
                resolverValidationOptions: {
                    requireResolversForResolveType: 'ignore'
                }
            });
            const typeMap = this.schema.getTypeMap();
            if (this.typeDefs.includes('@model')) {
                SchemaDirectiveVisitor.visitSchemaDirectives(this.schema, {
                    model: ModelDirective
                });
            }
            else {
                Object.keys(typeMap).forEach(name => {
                    const type = typeMap[name];
                    if (this.isUserType(type) && isObjectType(type)) {
                        type['_interfaces'].push(typeMap.Node);
                        if (!type.getFields()['id']) {
                            throw new Error('every object type must have an ID if you are not using the model directive');
                        }
                        has(this.schema, '_implementations.Node') ? this.schema['_implementations'].Node.push(type) : set(this.schema, '_implementations.Node', [type]);
                    }
                });
            }
            // add args to type fields
            const queryTypeFields = this.schema.getType('Query').getFields();
            let visitUnique = false;
            const uniqueDirective = { arguments: [], kind: 'Directive', name: { kind: 'Name', value: 'unique' } };
            Object.keys(typeMap).forEach(name => {
                const type = typeMap[name];
                if (this.isUserType(type)) {
                    const fieldMap = type.getFields();
                    Object.keys(fieldMap).forEach(fieldName => {
                        const graphQLfield = fieldMap[fieldName];
                        const returnType = getNamedType(graphQLfield.type);
                        if (!isScalarType(returnType) && !isEnumType(returnType)) { // scalars don't have filters
                            if (isInterfaceType(returnType) || isUnionType(returnType)) { // can't grab args from existing query type
                                const where = this.schema.getType(returnType.name + 'WhereInput');
                                if (typeIsList(graphQLfield.type)) {
                                    const orderBy = this.schema.getType(returnType.name + 'OrderByInput');
                                    const queryField = queryTypeFields[Object.keys(queryTypeFields)[0]];
                                    const fullArgs = queryField ? queryField.args : [];
                                    if (!isEmpty(fullArgs)) {
                                        const interfaceQueryArgs = fullArgs.filter(({ name }) => {
                                            return Object.keys(queryArgs).includes(name);
                                        });
                                        if (interfaceQueryArgs && !isEmpty(interfaceQueryArgs)) {
                                            graphQLfield.args.push(...interfaceQueryArgs);
                                        }
                                    }
                                    if (orderBy && isInputType(orderBy)) {
                                        graphQLfield.args.push({ name: 'orderBy', type: orderBy });
                                    }
                                }
                                if (where && isInputObjectType(where)) {
                                    graphQLfield.args.push({ name: 'where', type: where });
                                    const matchField = where.getFields()['match'];
                                    if (matchField && isInputObjectType(matchField.type)) {
                                        const rootMatchFields = getRootMatchFields(matchField.type);
                                        if (!isEmpty(rootMatchFields)) {
                                            graphQLfield.args.push(...values(rootMatchFields));
                                        }
                                    }
                                }
                            }
                            else { // if an object type grab from existing query type
                                let queryFieldName = `${camelCase(pluralize(returnType.name))}`;
                                if (returnType.name.endsWith('Connection')) {
                                    queryFieldName = `${camelCase(pluralize(returnType.name.replace('Connection', '')))}Connection`;
                                }
                                const queryField = queryTypeFields[queryFieldName];
                                const fullArgs = queryField ? queryField.args : [];
                                if (!isEmpty(fullArgs)) {
                                    const filterArg = find(fullArgs, ['name', 'where']);
                                    graphQLfield.args = graphQLfield.args ? graphQLfield.args : [];
                                    if (typeIsList(graphQLfield.type)) {
                                        graphQLfield.args = graphQLfield.args.concat(fullArgs);
                                    }
                                    else {
                                        graphQLfield.args.push(filterArg);
                                    }
                                }
                            }
                        }
                        else if (fieldName === 'id') { // make sure id field has unique directive
                            const directives = graphQLfield.astNode.directives;
                            const hasUnique = directives.findIndex((directive) => {
                                return directive.name.value === 'unique';
                            }) > -1;
                            if (!hasUnique) {
                                visitUnique = true;
                                directives.push(uniqueDirective);
                            }
                        }
                    });
                }
            });
            if (this.typeDefs.includes('@connection')) {
                if (!this.config.generateConnections) {
                    throw new Error('Generate Connections must be true to use connection directive');
                }
                // don't want to attempt this if we didn't create the necessary types yet
                if (this.typeDefs.includes('Connection') && this.typeDefs.includes('Edge') && this.typeDefs.includes('PageInfo')) {
                    SchemaDirectiveVisitor.visitSchemaDirectives(this.schema, {
                        connection: ConnectionDirective
                    });
                }
            }
            if (visitUnique) {
                SchemaDirectiveVisitor.visitSchemaDirectives(this.schema, {
                    unique: UniqueDirective
                });
            }
            return this.schema;
        };
        this.getSchema = () => {
            if (!this.schema) {
                this.schema = this.addTypeDefsToSchema();
            }
            return this.schema;
        };
        this.setResolvers = (typeName, fieldResolvers) => {
            const resolverMap = {};
            resolverMap[typeName] = {};
            this.resolveFunctions[typeName] = this.resolveFunctions[typeName] ? this.resolveFunctions[typeName] : {};
            fieldResolvers.forEach((resolveFn, name) => {
                resolverMap[typeName][name] = resolveFn;
                this.resolveFunctions[typeName][name] = resolveFn; // save in case type defs changed
            });
            this.schema = addResolversToSchema({
                schema: this.schema,
                resolvers: resolverMap,
                resolverValidationOptions: {
                    requireResolversForResolveType: 'ignore'
                }
            });
            return this.schema;
        };
        this.setIResolvers = (iResolvers) => {
            this.resolveFunctions = Object.assign(this.resolveFunctions, iResolvers);
            this.schema = addResolversToSchema({
                schema: this.schema,
                resolvers: iResolvers,
                resolverValidationOptions: {
                    requireResolversForResolveType: 'ignore'
                }
            });
            return this.schema;
        };
        this.typeDefs = `
		scalar JSON
		scalar Date
		scalar Time
		scalar DateTime

		directive @relation(
			name: String!
		) on FIELD_DEFINITION

		directive @default(
			value: String!
		) on FIELD_DEFINITION

		directive @storeName(
			value: String!
		) on OBJECT | INTERFACE | UNION

		directive @unique on FIELD_DEFINITION

		directive @updatedTimestamp(allowManual: Boolean = false) on FIELD_DEFINITION

		directive @createdTimestamp(allowManual: Boolean = false) on FIELD_DEFINITION

		"""
		An object with an ID
		"""
		interface Node {
			"""
			The id of the object.
			"""
			id: ID! @unique
		}
		` + (typeof typeDefs === 'string' ? typeDefs : print(typeDefs));
        this.resolveFunctions = {
            JSON: GraphQLJSON,
            Date: GraphQLDate,
            Time: GraphQLTime,
            DateTime: GraphQLDateTime,
        };
        this.config = $config;
    }
    isUserType(type) {
        let isUserType = false;
        if (isObjectType(type) && this.isUserTypeByName(type.name)) {
            isUserType = true;
        }
        return isUserType;
    }
    isUserTypeByName(typeName) {
        let isUserType = false;
        if (typeName !== 'PageInfo' && !typeName.includes('__') && !typeName.endsWith('Aggregate') && !typeName.endsWith('Connection') && !typeName.endsWith('Edge') && !typeName.endsWith('Payload') && !typeName.endsWith('PreviousValues') && !(typeName.toLowerCase() === 'query') && !(typeName.toLowerCase() === 'mutation') && !(typeName.toLowerCase() === 'subscription')) {
            isUserType = true;
        }
        return isUserType;
    }
}
// class DisplayDirective extends SchemaDirectiveVisitor {
// 	public visitFieldDefinition(field) {
// 		this.setDisplay(field);
// 	}
// 	public visitEnumValue(value) {
// 		this.setDisplay(value);
// 	}
// 	public visitObject(object) {
// 		this.setDisplay(object);
// 	}
// 	private setDisplay(field: any) {
// 		field.display = {};
// 		if (this.args.name) {
// 			field.display.name = this.args.name;
// 		}
// 	}
// }
class RelationDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        this.setRelation(field);
    }
    setRelation(field) {
        field.relation = {};
        if (this.args.name) {
            field.relation.name = this.args.name;
        }
        let type = field.type;
        while (isListType(type) || isNonNullType(type)) {
            type = type.ofType;
        }
        field.relation.outputType = type.name;
    }
}
class DefaultDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const type = getNamedType(field.type);
        if (!isInputType(type)) {
            throw new Error('Can not set default on non input (scalar, enum, input) type which was attempted on ' + field.name);
        }
        if (this.args.value) {
            const currType = type.name;
            let value = this.args.value;
            if (currType === 'Int') {
                value = Number.parseInt(value, 10);
            }
            else if (currType === 'Float') {
                value = Number.parseFloat(value);
            }
            else if (currType === 'Boolean') {
                value = value.toLowerCase();
                if (value !== 'true' && value !== 'false') {
                    throw new Error('Default on field ' + field.name + ' which is of type Boolean must be "true" or "false"');
                }
                value = value === 'true';
            }
            field.defaultValue = value;
        }
    }
}
class ModelDirective extends SchemaDirectiveVisitor {
    visitObject(object) {
        if (!object.getFields()['id']) {
            throw new Error('every model type must have an ID');
        }
        object._interfaces.push(this.schema.getTypeMap().Node);
        has(this.schema, '_implementations.Node') ? this.schema['_implementations'].Node.push(object) : set(this.schema, '_implementations.Node', [object]);
    }
}
class StoreNameDirective extends SchemaDirectiveVisitor {
    visitObject(object) {
        this.setStoreName(object);
    }
    visitUnion(union) {
        this.setStoreName(union);
    }
    visitInterface(iface) {
        this.setStoreName(iface);
    }
    setStoreName(type) {
        type.storeName = this.args.value;
    }
}
class UniqueDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        field.unique = true;
    }
}
class UpdatedTimestampDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const type = field.type;
        if (type.name === 'DateTime') {
            field['updatedTimestamp'] = true;
            if (this.args && this.args.allowManual) {
                field['updatedTimestampAllowManual'] = true;
            }
        }
    }
}
class CreatedTimestampDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const type = field.type;
        if (type.name === 'DateTime') {
            field.createdTimestamp = true;
            if (this.args && this.args.allowManual) {
                field['createdTimestampAllowManual'] = true;
            }
        }
    }
}
class ConnectionDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const fieldType = field.type;
        if (typeIsList(fieldType)) {
            const connectionName = getReturnType(fieldType) + 'Connection';
            let connectionType = this.schema.getType(connectionName);
            if (!connectionType) {
                throw new Error('Connections must be enabled and output type must be part of model');
            }
            if (isNonNullType(fieldType)) {
                connectionType = new GraphQLNonNull(connectionType);
            }
            field.type = connectionType;
        }
        else {
            throw new Error('Can\'t make connection on non list field');
        }
    }
}
