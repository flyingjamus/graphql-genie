var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
export class GenerateMigrations {
    constructor($genie, $currOutputObjectTypeDefs) {
        this.resolvers = new Map();
        this.fieldsOnObject = new Map();
        this.genie = $genie;
        this.currOutputObjectTypeDefs = $currOutputObjectTypeDefs;
        this.generate();
    }
    generate() {
        this.fieldsOnObject.set('Query', {
            'exportData': {
                description: 'Returns data in the database which can be sent to importData',
                type: GraphQLJSON,
                args: {
                    types: {
                        description: 'List of the GraphQL Object Types you want data for. If null or blank all data will be returned',
                        type: new GraphQLList(GraphQLString)
                    }
                }
            }
        });
        const exportDataResolver = new Map();
        exportDataResolver.set('exportData', (_root, args, context, _info) => __awaiter(this, void 0, void 0, function* () {
            return yield this.genie.getRawData(args.types || [], context);
        }));
        this.resolvers.set('Query', exportDataResolver);
        this.currOutputObjectTypeDefs.add(`
			type ImportDataPayload {
				data: JSON,
				unalteredData: JSON,
				missingData: JSON
			}
		`);
        this.currOutputObjectTypeDefs.add(`
			input ConditionsInput {
				id: [String]!,
				conditions: JSON!
			}
		`);
        this.fieldsOnObject.set('Mutation', {
            'importData': {
                type: 'ImportDataPayload',
                args: {
                    data: {
                        type: new GraphQLNonNull(new GraphQLList(GraphQLJSON))
                    },
                    merge: {
                        type: GraphQLBoolean,
                        description: `If false every object will create a new object, the id won't be preserved from the current data but relationships will still be built as they were in the provided data.
						If true data will be merged based on ID, with new entries only being created if the given id does not exist already. Provided id will be used for creating data as well.
						Note when merging list fields by default the array in the provided data will replace the existing data array. If you don't want to do that instead of providing an array you can provide an object with fields for push and pull or set. `
                    },
                    defaultTypename: {
                        type: GraphQLString,
                        descriptions: 'Must be provided if every object in data does not have a `__typename` property or ids with the typename encoded'
                    },
                    conditions: {
                        type: '[ConditionsInput]',
                        descriptions: 'Conditions can be used to only update records if they are met'
                    }
                }
            }
        });
        const importDataResolver = new Map();
        importDataResolver.set('importData', (_root, args, context, _info) => __awaiter(this, void 0, void 0, function* () {
            return yield this.genie.importRawData(args.data, args.merge, args.defaultTypename, context, args.conditions);
        }));
        this.resolvers.set('Mutation', importDataResolver);
    }
    getResolvers() {
        return this.resolvers;
    }
    getFieldsOnObject() {
        return this.fieldsOnObject;
    }
}
