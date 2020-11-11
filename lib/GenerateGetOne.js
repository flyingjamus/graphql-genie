var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GraphQLError } from 'graphql';
import pluralize from 'pluralize';
import { InputGenerator } from './InputGenerator';
import { getAllResolver, getRootMatchFields } from './TypeGeneratorUtilities';
import { camelCase, isArray, isEmpty } from 'lodash';
export class GenerateGetOne {
    constructor(dataResolver, objectName, types, $schema, $currInputObjectTypes, $schemaInfo, $relations, $getAll) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.schema = $schema;
        this.currInputObjectTypes = $currInputObjectTypes;
        this.schemaInfo = $schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.getAllResolvers = $getAll && $getAll.resolvers ? $getAll.resolvers : new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const schemaType = this.schema.getType(type.name);
            const generator = new InputGenerator(schemaType, null, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const args = Object.assign({
                where: { type: generator.generateWhereUniqueInput() }
            }, getRootMatchFields(generator.generateWhereUniqueInput()));
            const fieldName = `${camelCase(type.name)}`;
            const allFieldName = `${camelCase(pluralize(type.name))}`;
            this.fields[fieldName] = {
                type: `${type.name}`,
                args
            };
            const allResolver = this.getAllResolvers.get(allFieldName) || getAllResolver(this.dataResolver, this.schema, type);
            this.resolvers.set(fieldName, (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
                if (isEmpty(args)) {
                    throw new GraphQLError('Singular queries must have an argument');
                }
                let resolveResult = yield allResolver.apply(this, [root, args, context, info]);
                if (isArray(resolveResult)) {
                    resolveResult = resolveResult.length > 0 ? resolveResult[0] : null;
                }
                return resolveResult;
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
