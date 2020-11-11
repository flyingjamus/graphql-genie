var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { atob } from 'abab';
import { GenerateUpsert } from './GenerateUpsert';
import { GenerateUpdate } from './GenerateUpdate';
import FortuneGraph from './FortuneGraph';
import { GenerateConnections } from './GenerateConnections';
import { GenerateCreate } from './GenerateCreate';
import { GenerateDelete } from './GenerateDelete';
import { GenerateGetAll } from './GenerateGetAll';
import { assign, forOwn, get, isArray, isEmpty, isFunction, isNumber, isPlainObject, isString, set } from 'lodash';
import { GraphQLObjectType, getNamedType, getNullableType, introspectionFromSchema, isEnumType, isListType, isObjectType, isScalarType, printType } from 'graphql';
import { GraphQLSchemaBuilder } from './GraphQLSchemaBuilder';
import { getReturnType } from './GraphQLUtils';
import SchemaInfoBuilder from './SchemaInfoBuilder';
import { computeRelations, getTypeResolver, meetsConditions } from './TypeGeneratorUtilities';
import { GenerateGetOne } from './GenerateGetOne';
import { GenerateMigrations } from './GenerateMigrations';
export class GraphQLGenie {
    constructor(options) {
        this.config = {
            generateGetOne: true,
            generateGetAll: true,
            generateCreate: true,
            generateUpdate: true,
            generateDelete: true,
            generateUpsert: true,
            generateConnections: true,
            generateMigrations: true
        };
        this.validate = () => {
            const typeMap = this.schema.getTypeMap();
            Object.keys(typeMap).forEach(name => {
                const type = typeMap[name];
                if (isObjectType(type) && !type.name.includes('__') && !(type.name.toLowerCase() === 'query') && !(type.name.toLowerCase() === 'mutation') && !(type.name.toLowerCase() === 'subscription')) {
                    if (type.name.endsWith('Connection')) {
                        throw new Error(`${type.name} is invalid because it ends with Connection which could intefere with necessary generated types and genie logic`);
                    }
                    else if (type.name.endsWith('Edge')) {
                        throw new Error(`${type.name} is invalid because it ends with Edge which could intefere with necessary generated types and genie logic`);
                    }
                    else if (this.config.generateConnections && type.name === 'PageInfo') {
                        throw new Error(`${type.name} is invalid. PageInfo type is auto generated for connections`);
                    }
                }
            });
        };
        this.init = () => {
            this.generators = [];
            this.schemaInfoBuilder = new SchemaInfoBuilder(this.schema);
            this.schemaInfo = this.schemaInfoBuilder.getSchemaInfo();
            this.relations = computeRelations(this.schemaInfo);
            this.graphQLFortune = new FortuneGraph(this.fortuneOptions, this.schemaInfo, this.fortuneRecordTypeDefinitions);
            this.buildQueries();
            this.buildResolvers();
            this.plugins.forEach(plugin => {
                const pluginResult = plugin(this);
                if (pluginResult && isFunction(pluginResult.then)) {
                    throw new Error('You must use call .useAsync for plugins that are asynchronous');
                }
            });
            this.schema = this.schemaBuilder.getSchema();
        };
        this.buildResolvers = () => {
            forOwn(this.schemaInfo, (type, name) => {
                const fieldResolvers = new Map();
                const schemaType = this.schema.getType(type.name);
                if (isObjectType(schemaType) && name !== 'Query' && name !== 'Mutation' && name !== 'Subscription') {
                    const fieldMap = schemaType.getFields();
                    forOwn(type.fields, (field) => {
                        const graphQLfield = fieldMap[field.name];
                        const returnConnection = getReturnType(graphQLfield.type).endsWith('Connection');
                        fieldResolvers.set(field.name, getTypeResolver(this.graphQLFortune, this.schema, field, returnConnection));
                    });
                    this.schema = this.schemaBuilder.setResolvers(name, fieldResolvers);
                }
            });
        };
        this.buildQueries = () => {
            const nodeNames = this.getModelTypes();
            const nodeTypes = [];
            nodeNames.forEach(result => {
                nodeTypes.push(this.schemaInfo[result.name]);
            });
            const currInputObjectTypes = new Map();
            const currOutputObjectTypeDefs = new Set();
            let getAll;
            if (this.config.generateGetAll) {
                getAll = new GenerateGetAll(this.graphQLFortune, 'Query', nodeTypes, this.schema, currInputObjectTypes, this.schemaInfo, this.relations);
                this.generators.push(getAll);
            }
            if (this.config.generateGetOne) {
                this.generators.push(new GenerateGetOne(this.graphQLFortune, 'Query', nodeTypes, this.schema, currInputObjectTypes, this.schemaInfo, this.relations, getAll));
            }
            if (this.config.generateConnections) {
                this.generators.push(new GenerateConnections(this.graphQLFortune, 'Query', nodeTypes, this.schema, currOutputObjectTypeDefs, currInputObjectTypes, this.schemaInfo, this.relations));
            }
            if (this.config.generateCreate) {
                this.generators.push(new GenerateCreate(this.graphQLFortune, 'Mutation', nodeTypes, this.config, currInputObjectTypes, currOutputObjectTypeDefs, this.schemaInfo, this.schema, this.relations));
            }
            if (this.config.generateUpdate) {
                this.generators.push(new GenerateUpdate(this.graphQLFortune, 'Mutation', nodeTypes, this.config, currInputObjectTypes, currOutputObjectTypeDefs, this.schemaInfo, this.schema, this.relations));
            }
            if (this.config.generateUpsert) {
                this.generators.push(new GenerateUpsert(this.graphQLFortune, 'Mutation', nodeTypes, this.config, currInputObjectTypes, currOutputObjectTypeDefs, this.schemaInfo, this.schema, this.relations));
            }
            if (this.config.generateDelete) {
                this.generators.push(new GenerateDelete(this.graphQLFortune, 'Mutation', nodeTypes, this.config, currInputObjectTypes, currOutputObjectTypeDefs, this.schemaInfo, this.schema, this.relations));
            }
            if (this.config.generateMigrations) {
                this.generators.push(new GenerateMigrations(this, currOutputObjectTypeDefs));
            }
            let newTypes = '';
            currInputObjectTypes.forEach(inputObjectType => {
                // console.log(printType(inputObjectType));
                newTypes += printType(inputObjectType) + '\n';
            });
            currOutputObjectTypeDefs.forEach(newType => {
                newTypes += newType + '\n';
            });
            const fieldsOnObject = new Map();
            const resolvers = new Map();
            // merge maps and compute new input types
            this.generators.forEach(generator => {
                generator.getFieldsOnObject().forEach((fields, objectName) => {
                    fieldsOnObject.set(objectName, assign({}, fieldsOnObject.get(objectName), fields));
                });
                const generatorResolvers = generator.getResolvers();
                generatorResolvers.forEach((resolver, name) => {
                    if (!resolvers.has(name)) {
                        resolvers.set(name, new Map());
                    }
                    resolvers.set(name, new Map([...resolvers.get(name), ...resolver]));
                });
            });
            fieldsOnObject.forEach((fields, objName) => {
                newTypes += printType(new GraphQLObjectType({ name: objName, fields: fields })) + '\n';
            });
            // console.log(newTypes);
            this.schema = this.schemaBuilder.addTypeDefsToSchema(newTypes);
            resolvers.forEach((resolverMap, name) => {
                this.schemaBuilder.setResolvers(name, resolverMap);
            });
            this.schema = this.schemaBuilder.getSchema();
        };
        this.use = (plugin) => {
            const pluginResult = plugin(this);
            if (pluginResult && isFunction(pluginResult.then)) {
                throw new Error('You must use call .useAsync for plugins that are asynchronous');
            }
            this.schema = this.schemaBuilder.getSchema();
            return this;
        };
        this.useAsync = (plugin) => __awaiter(this, void 0, void 0, function* () {
            const pluginResult = plugin(this);
            if (pluginResult && isFunction(pluginResult.then)) {
                yield pluginResult;
            }
            this.schema = this.schemaBuilder.getSchema();
            return this;
        });
        this.getSchema = () => {
            return this.schemaBuilder.getSchema();
        };
        this.getDataResolver = () => {
            return this.graphQLFortune;
        };
        this.getSchemaBuilder = () => {
            return this.schemaBuilder;
        };
        this.printSchema = () => {
            return this.schemaBuilder.printSchemaWithDirectives();
        };
        this.mapIdsToCreatedIds = (currIDs, objectsMap) => {
            if (currIDs) {
                // tslint:disable-next-line:prefer-conditional-expression
                if (isArray(currIDs)) {
                    if (isPlainObject(currIDs[0])) {
                        currIDs = currIDs.map(element => element && element.id ? element.id : element);
                    }
                    currIDs = currIDs.map(currID => objectsMap.has(currID) && objectsMap.get(currID)['id'] ? objectsMap.get(currID)['id'] : currID);
                }
                else {
                    // handle in case it's the full object not just id
                    if (isPlainObject(currIDs) && currIDs.id) {
                        currIDs = currIDs.id;
                    }
                    currIDs = objectsMap.has(currIDs) && objectsMap.get(currIDs)['id'] ? objectsMap.get(currIDs)['id'] : currIDs;
                }
            }
            return currIDs;
        };
        this.importRawData = (data, merge = false, defaultTypename, context, conditions) => __awaiter(this, void 0, void 0, function* () {
            const meta = context ? { context } : undefined;
            conditions = conditions && merge ? conditions : [];
            // altered data
            const alteredData = new Map();
            // there is a condition but nothing with this id even exists
            const missingIds = [];
            const missingData = [];
            // didn't meet the condition
            const unalteredData = [];
            const userTypes = this.getUserTypes();
            const conditionsMap = new Map();
            conditions.forEach(condition => {
                if (!isEmpty(condition.conditions)) {
                    const ids = isArray(condition.id) ? condition.id : [condition.id];
                    ids.forEach(id => {
                        if (!conditionsMap.has(id)) {
                            conditionsMap.set(id, []);
                        }
                        conditionsMap.get(id).push(condition.conditions);
                    });
                }
            });
            const createPromises = [];
            let createData = data;
            const objectsMap = new Map();
            data = data.map((object, index) => {
                if (isEmpty(object)) {
                    throw new Error('Data has a null or empty object at index ' + index);
                }
                let typeName = object.__typename;
                let idTypename;
                if (!typeName && isString(object.id)) {
                    try {
                        idTypename = atob(object.id).split(':')[1];
                    }
                    catch (e) {
                        // empty by design
                    }
                }
                typeName = idTypename && !typeName ? idTypename : typeName;
                typeName = typeName ? typeName : defaultTypename;
                if (!typeName) {
                    throw new Error('Every object must have a __typename or defaultTypeName must be provided');
                }
                else if (!userTypes.includes(typeName)) {
                    throw new Error(`Bad typename in data, ${typeName} does not exist in schema`);
                }
                object.__typename = typeName;
                object.id = object.id || this.graphQLFortune.computeId(typeName);
                // make sure we parse the values
                const schemaType = this.schema.getType(typeName);
                const fieldMap = schemaType.getFields();
                const objectFields = Object.keys(object);
                objectFields.forEach(fieldName => {
                    const schemaField = fieldMap[fieldName];
                    if (schemaField) {
                        const namedType = getNamedType(schemaField.type);
                        if (isScalarType(namedType)) {
                            let currVal = object[fieldName];
                            const scalarType = this.schema.getType(namedType.name);
                            if (isArray(currVal) && !isEmpty(currVal)) {
                                currVal = currVal.map((val) => {
                                    if (val && isString(val)) {
                                        val = scalarType.parseValue(val);
                                    }
                                    return val;
                                });
                            }
                            else if (isString(currVal)) {
                                currVal = scalarType.parseValue(currVal);
                            }
                            object[fieldName] = currVal;
                        }
                    }
                });
                return object;
            });
            if (merge) {
                createData = [];
                const findPromises = [];
                data.forEach(object => {
                    const typeName = object.__typename;
                    findPromises.push(this.graphQLFortune.find(typeName, object.id));
                });
                const findResults = yield Promise.all(findPromises);
                findResults.forEach((result, index) => {
                    if (isEmpty(result)) {
                        if (conditionsMap.has(data[index].id)) {
                            missingIds.push(data[index].id);
                            missingData.push(data[index]);
                        }
                        else {
                            createData.push(data[index]);
                        }
                    }
                    else {
                        objectsMap.set(result.id, result);
                    }
                });
            }
            createData.forEach(object => {
                const typeName = object.__typename;
                const schemaType = this.schema.getType(typeName);
                const fieldMap = schemaType.getFields();
                const objectFields = Object.keys(object);
                const record = {};
                if (merge && object.id) {
                    record.id = object.id;
                }
                objectFields.forEach(fieldName => {
                    const schemaField = fieldMap[fieldName];
                    const currVal = object[fieldName];
                    // only add if truthy and not empty
                    let addToRecord = false;
                    if (isArray(currVal) && !isEmpty(currVal)) {
                        addToRecord = true;
                    }
                    else if (currVal !== undefined && currVal !== null) {
                        addToRecord = true;
                    }
                    if (addToRecord && fieldName !== 'id' && schemaField) {
                        const schemaFieldType = getNamedType(schemaField.type);
                        if (isScalarType(schemaFieldType)) {
                            record[fieldName] = currVal;
                        }
                    }
                });
                createPromises.push(new Promise((resolve, reject) => {
                    this.graphQLFortune.create(typeName, record, meta).then(createdObj => {
                        objectsMap.set(object.id, createdObj);
                        alteredData.set(object.id, createdObj);
                        resolve(createdObj);
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            });
            yield Promise.all(createPromises);
            const updatePromies = [];
            // do the updates
            yield Promise.all(data.map((object) => __awaiter(this, void 0, void 0, function* () {
                if (missingIds.includes(object.id)) {
                    return;
                }
                const typeName = object.__typename;
                const schemaType = this.schema.getType(typeName);
                const existingData = objectsMap.get(object.id);
                let objMeetsConditions = true;
                if (conditionsMap.has(object.id)) {
                    const allConditions = yield Promise.all(conditionsMap.get(object.id).map((condition) => __awaiter(this, void 0, void 0, function* () {
                        return yield meetsConditions(condition, typeName, schemaType, existingData, this.graphQLFortune, get(context, 'context', context), get(context, 'info'));
                    })));
                    objMeetsConditions = !allConditions.includes(false);
                }
                if (!objMeetsConditions) {
                    unalteredData.push(existingData);
                }
                else {
                    let update = {};
                    const objectFields = Object.keys(object);
                    const fieldMap = schemaType.getFields();
                    objectFields.forEach(fieldName => {
                        const schemaField = fieldMap[fieldName];
                        if (schemaField) {
                            const schemaFieldType = getNamedType(schemaField.type);
                            if (merge || (!isScalarType(schemaFieldType) && !isEnumType(schemaFieldType))) {
                                let currValue = object[fieldName];
                                if (!isEmpty(currValue)) {
                                    if (!isScalarType(schemaFieldType) && !isEnumType(schemaFieldType)) {
                                        if (isArray(currValue)) {
                                            // if it's an array then set
                                            // use new ids if found
                                            currValue = this.mapIdsToCreatedIds(currValue, objectsMap);
                                            update[fieldName] = { set: currValue };
                                        }
                                        else {
                                            // if not an array we need to handle scalars vs objects with push/pull/set
                                            // handle in case it's the full object not just id
                                            if (isPlainObject(currValue) && currValue.id) {
                                                currValue = currValue.id;
                                            }
                                            // if it's not an object than it's just an id so we should set it
                                            // tslint:disable-next-line:prefer-conditional-expression
                                            if (!isPlainObject(currValue)) {
                                                // use the new object id
                                                update[fieldName] = this.mapIdsToCreatedIds(currValue, objectsMap);
                                            }
                                            else {
                                                // it's an object so it is push/pull/set
                                                if (currValue.push) {
                                                    currValue.push = this.mapIdsToCreatedIds(currValue.push, objectsMap);
                                                }
                                                if (currValue.pull) {
                                                    currValue.pull = this.mapIdsToCreatedIds(currValue.pull, objectsMap);
                                                }
                                                if (currValue.set) {
                                                    currValue.set = this.mapIdsToCreatedIds(currValue.set, objectsMap);
                                                }
                                                update[fieldName] = currValue;
                                            }
                                        }
                                    }
                                    else if (!isPlainObject(currValue)) {
                                        currValue = this.mapIdsToCreatedIds(currValue, objectsMap);
                                        // not an object and a scalar but lets check if it's an array
                                        update[fieldName] = isArray(currValue) ? { set: currValue } : currValue;
                                    }
                                    else {
                                        // it's an object so it is push/pull/set
                                        if (currValue.push) {
                                            currValue.push = this.mapIdsToCreatedIds(currValue.push, objectsMap);
                                        }
                                        if (currValue.pull) {
                                            currValue.pull = this.mapIdsToCreatedIds(currValue.pull, objectsMap);
                                        }
                                        if (currValue.set) {
                                            currValue.set = this.mapIdsToCreatedIds(currValue.set, objectsMap);
                                        }
                                        update[fieldName] = currValue;
                                    }
                                }
                                else {
                                    update[fieldName] = isListType(getNullableType(schemaField.type)) ? { set: currValue } : currValue;
                                }
                            }
                        }
                    });
                    if (!isEmpty(update)) {
                        update.id = objectsMap.get(object.id).id;
                        update = this.graphQLFortune.generateUpdates(update);
                        updatePromies.push(new Promise((resolve, reject) => {
                            this.graphQLFortune.update(typeName, update, meta, { fortuneFormatted: true }).then(updatedObj => {
                                alteredData.set(object.id, updatedObj);
                                resolve(updatedObj);
                            }).catch(reason => {
                                reject(reason);
                            });
                        }));
                    }
                }
            })));
            yield Promise.all(updatePromies);
            return {
                data: [...alteredData.values()],
                unalteredData,
                missingData
            };
        });
        this.getUserTypes = () => {
            const introspection = introspectionFromSchema(this.schema, { descriptions: false });
            const types = introspection.__schema.types;
            const typeNames = types.filter(type => type.kind === 'OBJECT' && this.schemaBuilder.isUserTypeByName(type.name)).map(type => type.name);
            return typeNames;
        };
        this.getModelTypes = () => {
            return introspectionFromSchema(this.schema, { descriptions: false }).__schema.types.filter(v => { var _a; return ((_a = v.interfaces) === null || _a === void 0 ? void 0 : _a.some(v => v.name === 'Node')) && v.name !== 'Node'; });
        };
        this.getRawData = (types = [], context) => __awaiter(this, void 0, void 0, function* () {
            const meta = context ? { context } : undefined;
            let nodes = [];
            if (isEmpty(types)) {
                types = this.getUserTypes();
            }
            if (types) {
                const promises = [];
                types.forEach(typeName => {
                    promises.push(new Promise((resolve, reject) => {
                        this.graphQLFortune.find(typeName, undefined, undefined, meta).then(fortuneData => {
                            // make sure we serialize the values
                            const schemaType = this.getSchema().getType(typeName);
                            const fieldMap = schemaType.getFields();
                            if (isEmpty(fortuneData)) {
                                resolve(fortuneData);
                                return;
                            }
                            fortuneData = fortuneData.map((record) => {
                                const objectFields = Object.keys(record);
                                objectFields.forEach(fieldName => {
                                    const schemaField = fieldMap[fieldName];
                                    if (schemaField) {
                                        const namedType = getNamedType(schemaField.type);
                                        let currVal = record[fieldName];
                                        if (isScalarType(namedType)) {
                                            const scalarType = this.getSchema().getType(namedType.name);
                                            if (isArray(currVal)) {
                                                currVal = currVal.map((val) => {
                                                    if (val && !isString(val) && !isNumber(val)) {
                                                        val = scalarType.serialize(val);
                                                    }
                                                    return val;
                                                });
                                            }
                                            else if (currVal && !isString(currVal) && !isNumber(currVal)) {
                                                currVal = scalarType.serialize(currVal);
                                            }
                                            record[fieldName] = currVal;
                                        }
                                    }
                                });
                                return record;
                            });
                            resolve(fortuneData);
                        }).catch(reason => { reject(reason); });
                    }));
                });
                const allData = yield Promise.all(promises);
                nodes = [].concat.apply([], allData); // flatten
            }
            return nodes;
        });
        this.getFragmentTypes = () => {
            const introspection = introspectionFromSchema(this.schema, { descriptions: false });
            const types = introspection.__schema.types;
            // here we're filtering out any type information unrelated to unions or interfaces
            if (types) {
                const filteredData = types.filter(type => {
                    return type['possibleTypes'] !== null;
                });
                set(introspection, '__schema.types', filteredData);
            }
            return introspection;
        };
        /**
         * This method does not need to be called manually, it is automatically called upon the first request if it is not connected already.
         * However, it may be useful if manually reconnect is needed.
         * The resolved value is the instance itself.
         * @returns Promise<GraphQLGenie>
         */
        this.connect = () => __awaiter(this, void 0, void 0, function* () {
            yield this.graphQLFortune.getStore().connect();
            return this;
        });
        /**
         * Close adapter connection, and reset connection state.
         * The resolved value is the instance itself.
         * @returns Promise<GraphQLGenie>
         */
        this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
            yield this.graphQLFortune.getStore().disconnect();
            return this;
        });
        this.fortuneOptions = options.fortuneOptions ? options.fortuneOptions : {};
        this.fortuneOptions.settings = this.fortuneOptions.settings ? this.fortuneOptions.settings : {};
        if (!this.fortuneOptions.settings.hasOwnProperty('enforceLinks')) {
            this.fortuneOptions.settings.enforceLinks = true;
        }
        this.fortuneRecordTypeDefinitions = options.fortuneRecordTypeDefinitions;
        if (options.generatorOptions) {
            this.config = Object.assign(this.config, options.generatorOptions);
        }
        if (options.schemaBuilder) {
            this.schemaBuilder = options.schemaBuilder;
        }
        else if (options.typeDefs) {
            this.schemaBuilder = new GraphQLSchemaBuilder(options.typeDefs, this.config);
        }
        else {
            throw new Error('Need a schemaBuilder or typeDefs');
        }
        this.plugins = isArray(options.plugins) ? options.plugins : options.plugins ? [options.plugins] : [];
        this.schema = this.schemaBuilder.getSchema();
        this.validate();
        this.init();
    }
}
