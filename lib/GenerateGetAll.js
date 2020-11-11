var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pluralize from 'pluralize';
import { InputGenerator } from './InputGenerator';
import { getAllResolver, getRootMatchFields, queryArgs } from './TypeGeneratorUtilities';
import { camelCase } from 'lodash';
export class GenerateGetAll {
    constructor(dataResolver, objectName, types, $schema, $currInputObjectTypes, $schemaInfo, $relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.schema = $schema;
        this.currInputObjectTypes = $currInputObjectTypes;
        this.schemaInfo = $schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const schemaType = this.schema.getType(type.name);
            const generator = new InputGenerator(schemaType, null, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const args = Object.assign({
                where: { type: generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators) },
                orderBy: { type: generator.generateOrderByInput() }
            }, queryArgs, getRootMatchFields(this.currInputObjectTypes.get(`${type.name}MatchInput`)));
            const fieldName = `${camelCase(pluralize(type.name))}`;
            this.fields[fieldName] = {
                type: `[${type.name}]`,
                args
            };
            this.resolvers.set(fieldName, getAllResolver(this.dataResolver, this.schema, type));
        });
        // basic node query
        this.fields['node'] = {
            description: 'Fetches an object given its ID',
            type: 'Node',
            args: {
                id: {
                    description: 'The ID of an object',
                    type: 'ID!'
                }
            }
        };
        this.resolvers.set('node', (_root, _args, _context, _info) => __awaiter(this, void 0, void 0, function* () {
            const id = _args.id;
            const fortuneReturn = yield this.dataResolver.find('Node', [id], undefined, { context: _context, info: _info });
            if (fortuneReturn) {
                const cache = new Map();
                cache.set(id, fortuneReturn);
                return {
                    fortuneReturn: fortuneReturn,
                    cache: cache,
                    __typename: fortuneReturn.__typename
                };
            }
            else {
                return null;
            }
        }));
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers]]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
}
