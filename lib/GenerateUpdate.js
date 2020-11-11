var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GraphQLError, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import pluralize from 'pluralize';
import { InputGenerator } from './InputGenerator';
import { getPayloadTypeDef, getPayloadTypeName, parseFilter, updateResolver } from './TypeGeneratorUtilities';
import { find, get } from 'lodash';
export class GenerateUpdate {
    constructor(dataResolver, objectName, types, $config, currInputObjectTypes, currOutputObjectTypeDefs, schemaInfo, schema, $relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.config = $config;
        this.currInputObjectTypes = currInputObjectTypes;
        this.currOutputObjectTypeDefs = currOutputObjectTypeDefs;
        this.schema = schema;
        this.schemaInfo = schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const args = {};
            const schemaType = this.schema.getType(type.name);
            const generator = new InputGenerator(schemaType, this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const updateInputName = `Update${type.name}MutationInput`;
            const updateInput = new GraphQLInputObjectType({
                name: updateInputName,
                fields: {
                    data: { type: new GraphQLNonNull(generator.generateUpdateInput()) },
                    where: { type: new GraphQLNonNull(generator.generateWhereUniqueInput()) },
                    conditions: { type: generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators), description: 'Update will only be performed if these conditions are met' },
                    clientMutationId: { type: GraphQLString }
                }
            });
            this.currInputObjectTypes.set(updateInputName, updateInput);
            args['input'] = {
                type: new GraphQLNonNull(updateInput)
            };
            const outputTypeName = getPayloadTypeName(type.name);
            this.fields[`update${type.name}`] = {
                type: outputTypeName,
                args: args
            };
            this.currOutputObjectTypeDefs.add(getPayloadTypeDef(type.name));
            this.resolvers.set(`update${type.name}`, updateResolver(this.dataResolver));
            // UPDATE MANY
            const updateManyInputName = `UpdateMany${pluralize(type.name)}MutationInput`;
            const updateManyInput = new GraphQLInputObjectType({
                name: updateManyInputName,
                fields: {
                    data: { type: new GraphQLNonNull(generator.generateUpdateInput()) },
                    where: Object.assign({ type: new GraphQLNonNull(generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators)) }),
                    clientMutationId: { type: GraphQLString }
                }
            });
            this.currInputObjectTypes.set(updateManyInputName, updateManyInput);
            const manyArgs = {};
            manyArgs['input'] = {
                type: new GraphQLNonNull(updateManyInput)
            };
            this.fields[`updateMany${pluralize(type.name)}`] = {
                type: 'BatchPayload',
                args: manyArgs
            };
            this.resolvers.set(`updateMany${pluralize(type.name)}`, (_root, _args, _context, _info) => __awaiter(this, void 0, void 0, function* () {
                let count = 0;
                const clientMutationId = _args.input && _args.input.clientMutationId ? _args.input.clientMutationId : '';
                const filter = _args.input && _args.input.where ? _args.input.where : '';
                const updateArgs = _args.input && _args.input.data ? _args.input.data : '';
                if (filter && updateArgs) {
                    const options = parseFilter(filter, schemaType);
                    let fortuneReturn = yield this.dataResolver.find(type.name, null, options, { context: _context, info: _info });
                    fortuneReturn = fortuneReturn.filter(element => element !== null && element !== undefined);
                    count = fortuneReturn.length;
                    if (count > 1) {
                        Object.keys(updateArgs).forEach(fieldName => {
                            const fields = get(this.schemaInfo, [type.name, 'fields']);
                            if (fields) {
                                const field = find(fields, { name: fieldName });
                                if (get(field, ['metadata', 'unique']) === true) {
                                    throw new GraphQLError('Can\'t update multiple values on unique field ' + fieldName);
                                }
                            }
                        });
                    }
                    yield Promise.all(fortuneReturn.map((fortuneRecord) => __awaiter(this, void 0, void 0, function* () {
                        return yield updateResolver(this.dataResolver)(fortuneRecord, { update: updateArgs, where: true }, _context, _info, null, null, schemaType);
                    })));
                }
                return {
                    count,
                    clientMutationId
                };
            }));
        });
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers]]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
}
