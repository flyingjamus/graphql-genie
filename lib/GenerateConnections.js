import { isInterfaceType, isUnionType } from 'graphql';
import pluralize from 'pluralize';
import { InputGenerator } from './InputGenerator';
import { getAllResolver, getRootMatchFields, queryArgs } from './TypeGeneratorUtilities';
import { camelCase } from 'lodash';
export class GenerateConnections {
    constructor(dataResolver, objectName, types, $schema, $currOutputObjectTypeDefs, $currInputObjectTypes, $schemaInfo, $relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.schema = $schema;
        this.currOutputObjectTypeDefs = $currOutputObjectTypeDefs;
        this.currInputObjectTypes = $currInputObjectTypes;
        this.schemaInfo = $schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.edgeResolvers = new Map();
        this.currOutputObjectTypeDefs.add(`
			"""
			Information about pagination in a connection.
			"""
			type PageInfo {
				"""
				When paginating forwards, are there more items?
				"""
				hasNextPage: Boolean!
				"""
				When paginating backwards, are there more items?
				"""
				hasPreviousPage: Boolean!
				"""
				When paginating backwards, the cursor to continue.
				"""
				startCursor: String
				"""
				When paginating forwards, the cursor to continue.
				"""
				endCursor: String
			}
		`);
        this.generate();
    }
    generate() {
        Object.keys(this.schema.getTypeMap()).forEach(typeName => {
            const type = this.schema.getType(typeName);
            if (isInterfaceType(type) || isUnionType(type)) {
                this.createNewTypes(typeName);
                const edgeFieldResolvers = new Map();
                edgeFieldResolvers.set('node', (root) => {
                    return root;
                });
                edgeFieldResolvers.set('cursor', (root) => {
                    const fortuneReturn = root && root.fortuneReturn ? root.fortuneReturn : root;
                    return fortuneReturn.id;
                });
                this.edgeResolvers.set(`${typeName}Edge`, edgeFieldResolvers);
            }
        });
        this.types.forEach(type => {
            const fieldName = `${camelCase(pluralize(type.name))}Connection`;
            this.createNewTypes(type.name);
            const schemaType = this.schema.getType(type.name);
            const generator = new InputGenerator(schemaType, null, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const args = Object.assign({
                where: { type: generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators) },
                orderBy: { type: generator.generateOrderByInput() }
            }, queryArgs, getRootMatchFields(this.currInputObjectTypes.get(`${type.name}MatchInput`)));
            this.fields[fieldName] = {
                type: `${type.name}Connection`,
                args
            };
            this.resolvers.set(fieldName, getAllResolver(this.dataResolver, this.schema, type, true));
            const edgeFieldResolvers = new Map();
            edgeFieldResolvers.set('node', (root) => {
                return root;
            });
            edgeFieldResolvers.set('cursor', (root) => {
                const fortuneReturn = root && root.fortuneReturn ? root.fortuneReturn : root;
                return fortuneReturn.id;
            });
            this.edgeResolvers.set(`${type.name}Edge`, edgeFieldResolvers);
        });
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers], ...this.edgeResolvers]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
    createNewTypes(typeName) {
        this.currOutputObjectTypeDefs.add(`
		"""
		A connection to a list of items.
		"""
		type ${typeName}Connection {
			"""
			A list of edges.
			"""
			edges: [${typeName}Edge]
			"""
			Information to aid in pagination.
			"""
			pageInfo: PageInfo
			"""
			Meta information
			"""
			aggregate: ${typeName}Aggregate
		}
	`);
        this.currOutputObjectTypeDefs.add(`
		type ${typeName}Aggregate {
			"""
			The total number that match the where clause
			"""
			count: Int!
		}
	`);
        this.currOutputObjectTypeDefs.add(`
		type ${typeName}Edge {
			node: ${typeName}!
			cursor: String!
		}
	`);
    }
}
