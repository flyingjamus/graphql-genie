var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { atob, btoa } from 'abab';
import fortune from 'fortune';
import { each, find, findIndex, forOwn, get, has, isArray, isEmpty, isEqual, isPlainObject, isString, keys, merge, set, toString } from 'lodash';
import * as fortuneCommon from 'fortune/lib/adapter/adapters/common';
import { Connection } from './GraphQLGenieInterfaces';
import { computeRelations } from './TypeGeneratorUtilities';
import DataLoader from 'dataloader';
export default class FortuneGraph {
    constructor(fortuneOptions, schemaInfo, fortuneRecordTypeDefinitions) {
        this.dataLoaders = new Map();
        this.computeId = (graphType, id) => {
            id = id || fortuneCommon.generateId();
            return btoa(`${id}:${graphType}`);
        };
        this.getTypeFromId = (inputId) => {
            let result;
            try {
                result = atob(inputId).split(':')[1];
            }
            catch (e) {
                result = inputId;
            }
            return result;
        };
        this.getOriginalIdFromObjectId = (inputId) => {
            let result;
            try {
                result = atob(inputId).split(':')[0];
            }
            catch (e) {
                result = inputId;
            }
            return result;
        };
        this.getValueByUnique = (returnTypeName, args, meta) => __awaiter(this, void 0, void 0, function* () {
            let currValue;
            // tslint:disable-next-line:prefer-conditional-expression
            if (args.id) {
                currValue = yield this.find(returnTypeName, [args.id], undefined, meta);
            }
            else {
                currValue = yield this.find(returnTypeName, undefined, { match: args }, meta);
            }
            return isArray(currValue) ? currValue[0] : currValue;
        });
        this.canAdd = (graphQLTypeName, inputRecords, meta) => __awaiter(this, void 0, void 0, function* () {
            let canAdd = true;
            if (inputRecords && this.uniqueIndexes.has(graphQLTypeName)) {
                yield Promise.all(this.uniqueIndexes.get(graphQLTypeName).map((fieldName) => __awaiter(this, void 0, void 0, function* () {
                    yield Promise.all(inputRecords.map((inputRecord) => __awaiter(this, void 0, void 0, function* () {
                        if (canAdd && inputRecord[fieldName]) {
                            const dbRecord = yield this.getValueByUnique(graphQLTypeName, { [fieldName]: inputRecord[fieldName] }, meta);
                            if (dbRecord) {
                                canAdd = false;
                            }
                        }
                    })));
                })));
            }
            return canAdd;
        });
        this.getConnection = (allEdges, before, after, first, last) => {
            const connection = new Connection();
            const edgesWithCursorApplied = this.applyCursorsToEdges(allEdges, before, after);
            connection.aggregate.count = allEdges.length;
            connection.edges = this.edgesToReturn(edgesWithCursorApplied, first, last);
            if (typeof last !== 'undefined') {
                if (edgesWithCursorApplied.length > last) {
                    connection.pageInfo.hasPreviousPage = true;
                }
            }
            else if (typeof after !== 'undefined' && get(allEdges, '[0].id', 'id0') !== get(edgesWithCursorApplied, '[0].id', 'id1')) {
                connection.pageInfo.hasPreviousPage = true;
            }
            if (typeof first !== 'undefined') {
                if (edgesWithCursorApplied.length > first) {
                    connection.pageInfo.hasNextPage = true;
                }
            }
            else if (typeof before !== 'undefined' && get(allEdges, `[${allEdges.length - 1}].id`, 'id0') !== get(edgesWithCursorApplied, `[${edgesWithCursorApplied.length - 1}].id`, 'id1')) {
                connection.pageInfo.hasNextPage = true;
            }
            connection.pageInfo.startCursor = get(connection.edges, '[0].id');
            connection.pageInfo.endCursor = get(connection.edges, `[${connection.edges.length - 1}].id`);
            return connection;
        };
        this.edgesToReturn = (edgesWithCursorApplied, first, last) => {
            if (typeof first !== 'undefined') {
                if (first < 0) {
                    throw new Error('first must be greater than 0');
                }
                else if (edgesWithCursorApplied.length > first) {
                    edgesWithCursorApplied = edgesWithCursorApplied.slice(0, first);
                }
            }
            if (typeof last !== 'undefined') {
                if (last < 0) {
                    throw new Error('first must be greater than 0');
                }
                else if (edgesWithCursorApplied.length > last) {
                    edgesWithCursorApplied = edgesWithCursorApplied.slice(edgesWithCursorApplied.length - last, edgesWithCursorApplied.length);
                }
            }
            return edgesWithCursorApplied;
        };
        this.applyCursorsToEdges = (allEdges, before, after) => {
            let edges = allEdges;
            if (after) {
                const afterEdgeIndex = findIndex(edges, ['id', after]);
                if (afterEdgeIndex > -1) {
                    edges = edges.slice(afterEdgeIndex + 1, edges.length);
                }
            }
            if (before) {
                const beforeEdgeIndex = findIndex(edges, ['id', before]);
                if (beforeEdgeIndex > -1) {
                    edges = edges.slice(0, beforeEdgeIndex);
                }
            }
            return edges;
        };
        this.create = (graphQLTypeName, records, meta) => __awaiter(this, void 0, void 0, function* () {
            const fortuneType = this.getFortuneTypeName(graphQLTypeName);
            records['__typename'] = graphQLTypeName;
            if (!records['id']) {
                records['id'] = this.computeId(graphQLTypeName);
            }
            let results = this.transaction ? yield this.transaction.create(fortuneType, records, undefined, meta) : yield this.store.create(fortuneType, records, undefined, meta);
            results = results.payload.records;
            return isArray(records) ? results : results[0];
        });
        this.find = (graphQLTypeName, ids, options, meta) => __awaiter(this, void 0, void 0, function* () {
            let graphReturn;
            let fortuneType;
            if (graphQLTypeName === 'Node') {
                fortuneType = this.getFortuneTypeName(this.getTypeFromId(ids[0]));
                const results = this.transaction ? yield this.transaction.find(fortuneType, ids[0], options, undefined, meta) : yield this.store.find(fortuneType, ids[0], options, undefined, meta);
                graphReturn = get(results, 'payload.records');
            }
            else {
                fortuneType = this.getFortuneTypeName(graphQLTypeName);
                // pull the id out of the match options
                if (get(options, 'match.id')) {
                    ids = get(options, 'match.id');
                    delete options.match.id;
                }
                if (ids) {
                    ids = isArray(ids) ? ids : [ids];
                }
                options = this.generateOptions(options, graphQLTypeName, ids);
                if (Object.keys(options).length) {
                    const results = this.transaction
                        ? yield this.transaction.find(fortuneType, ids, options, undefined, meta)
                        : yield this.store.find(fortuneType, ids, options, undefined, meta);
                    graphReturn = get(results, 'payload.records');
                }
                else {
                    if (!this.dataLoaders.has(fortuneType)) {
                        this.dataLoaders.set(fortuneType, new DataLoader((ids) => {
                            return (this.transaction
                                ? this.transaction.find(fortuneType, ids, options, undefined, meta)
                                : this.store.find(fortuneType, ids, options, undefined, meta)).then((results => get(results, 'payload.records')));
                        }));
                    }
                    graphReturn = yield this.dataLoaders.get(fortuneType).loadMany(ids);
                    console.log('return', graphReturn);
                }
            }
            if (graphReturn) {
                graphReturn = graphReturn.map((element) => {
                    element.id = isString(element.id) ? element.id : toString(element.id);
                    return element;
                });
                if (!get(options, 'sort')) {
                    // to support relay plural identifying root fields results should be in the order in which they were requested,
                    // with null being returned by failed finds
                    if (ids) {
                        const newReturn = [];
                        ids.forEach((value) => {
                            const foundResult = find(graphReturn, ['id', value]);
                            if (foundResult) {
                                newReturn.push(foundResult);
                            }
                            else {
                                newReturn.push(null);
                            }
                        });
                        graphReturn = newReturn;
                    }
                    else if (this.uniqueIndexes.has(graphQLTypeName)) {
                        const matches = options.match;
                        if (matches['__typename']) {
                            delete matches['__typename'];
                        }
                        const matchesKeys = Object.keys(matches);
                        if (matchesKeys.length === 1) {
                            const key = matchesKeys[0];
                            if (this.uniqueIndexes.get(graphQLTypeName).includes(key)) {
                                const theMatch = isArray(matches[key]) ? matches[key] : [matches[key]];
                                const newReturn = [];
                                theMatch.forEach((value) => {
                                    const foundResult = find(graphReturn, [key, value]);
                                    if (foundResult) {
                                        newReturn.push(foundResult);
                                    }
                                    else {
                                        newReturn.push(null);
                                    }
                                });
                                graphReturn = newReturn;
                            }
                        }
                    }
                }
                // if one id sent in we just want to return the value not an array
                graphReturn = ids && ids.length === 1 ? graphReturn[0] : graphReturn;
            }
            if (!graphReturn) {
                // console.log('Nothing Found ' + graphQLTypeName + ' ' + JSON.stringify(ids) + ' ' + JSON.stringify(options));
            }
            return graphReturn;
        });
        this.update = (graphQLTypeName, records, meta, options) => __awaiter(this, void 0, void 0, function* () {
            const fortuneType = this.getFortuneTypeName(graphQLTypeName);
            let updates = records;
            if (!options || !options['fortuneFormatted']) {
                updates = isArray(records) ? records.map(value => this.generateUpdates(value, options)) : this.generateUpdates(records, options);
            }
            let results = this.transaction ? yield this.transaction.update(fortuneType, updates, undefined, meta) : yield this.store.update(fortuneType, updates, undefined, meta);
            results = results.payload.records;
            return isArray(records) ? results : results[0];
        });
        this.delete = (graphQLTypeName, ids, meta) => __awaiter(this, void 0, void 0, function* () {
            const fortuneType = this.getFortuneTypeName(graphQLTypeName);
            if (ids.length > 0) {
                this.transaction ? yield this.transaction.delete(fortuneType, ids, undefined, meta) : yield this.store.delete(fortuneType, ids, undefined, meta);
            }
            return true;
        });
        this.generateUpdates = (record, options = {}) => {
            const updates = { id: record['id'] };
            for (const argName in record) {
                const arg = record[argName];
                if (argName !== 'id') {
                    if (isArray(arg)) {
                        if (options['pull']) {
                            updates.pull = updates.pull || {};
                            updates.pull[argName] = arg;
                        }
                        else {
                            updates.push = updates.push || {};
                            updates.push[argName] = arg;
                        }
                    }
                    else if (isPlainObject(arg)) {
                        if (arg.push) {
                            updates.push = updates.push || {};
                            updates.push[argName] = arg.push;
                        }
                        if (arg.pull) {
                            updates.pull = updates.pull || {};
                            updates.pull[argName] = arg.pull;
                        }
                        if (arg.set) {
                            updates.replace = updates.replace || {};
                            updates.replace[argName] = arg.set;
                        }
                    }
                    else {
                        updates.replace = updates.replace || {};
                        updates.replace[argName] = arg;
                    }
                }
            }
            return updates;
        };
        this.getLink = (graphQLTypeName, field) => {
            const fortuneType = this.getFortuneTypeName(graphQLTypeName);
            return get(this.store, `recordTypes.${fortuneType}.${field}.link`);
        };
        this.getStore = () => {
            if (!this.store) {
                this.store = this.buildFortune();
            }
            return this.store;
        };
        this.computeFortuneTypeNames = () => {
            this.fortuneTypeNames = new Map();
            each(keys(this.schemaInfo), (typeName) => {
                if (typeName !== 'Node' && !this.fortuneTypeNames.has(typeName)) {
                    const type = this.schemaInfo[typeName];
                    let storeObj = this.getStoreName(type, null, null);
                    let storeName = storeObj.storeName;
                    let storeTypeName = storeObj.typeName;
                    if (!isEmpty(type.possibleTypes)) {
                        const possibleTypes = [type.name];
                        each(type.possibleTypes, possibleType => {
                            if (possibleTypes.indexOf(possibleType.name) < 0) {
                                possibleTypes.push(possibleType.name);
                            }
                            possibleType = this.schemaInfo[possibleType.name];
                            storeObj = this.getStoreName(possibleType, storeName, storeTypeName);
                            storeName = storeObj.storeName;
                            storeTypeName = storeObj.typeName;
                            each(possibleType['interfaces'], currInterface => {
                                currInterface = this.schemaInfo[currInterface.name];
                                if (currInterface.name !== 'Node' && currInterface.name !== storeTypeName) {
                                    storeObj = this.getStoreName(currInterface, storeName, storeTypeName);
                                    storeName = storeObj.storeName;
                                    storeTypeName = storeObj.typeName;
                                    if (possibleTypes.indexOf(currInterface.name) < 0) {
                                        possibleTypes.push(currInterface.name);
                                    }
                                    if (!isEmpty(currInterface.possibleTypes)) {
                                        each(currInterface.possibleTypes, currInterfacePossibleType => {
                                            if (possibleTypes.indexOf(currInterfacePossibleType.name) < 0) {
                                                currInterfacePossibleType = this.schemaInfo[currInterfacePossibleType.name];
                                                storeObj = this.getStoreName(currInterfacePossibleType, storeName, storeTypeName);
                                                storeName = storeObj.storeName;
                                                storeTypeName = storeObj.typeName;
                                                possibleTypes.push(currInterfacePossibleType.name);
                                            }
                                        });
                                    }
                                }
                            });
                            each(possibleType['unions'], currUnion => {
                                currUnion = this.schemaInfo[currUnion.name];
                                if (currUnion.name !== storeTypeName) {
                                    if (possibleTypes.indexOf(currUnion.name) < 0) {
                                        storeObj = this.getStoreName(currUnion, storeName, storeTypeName);
                                        storeName = storeObj.storeName;
                                        storeTypeName = storeObj.typeName;
                                        possibleTypes.push(currUnion.name);
                                    }
                                    if (!isEmpty(currUnion.possibleTypes)) {
                                        each(currUnion.possibleTypes, currUnionPossibleType => {
                                            if (possibleTypes.indexOf(currUnionPossibleType.name) < 0) {
                                                currUnionPossibleType = this.schemaInfo[currUnionPossibleType.name];
                                                storeObj = this.getStoreName(currUnionPossibleType, storeName, storeTypeName);
                                                storeName = storeObj.storeName;
                                                storeTypeName = storeObj.typeName;
                                                possibleTypes.push(currUnionPossibleType.name);
                                            }
                                        });
                                    }
                                }
                            });
                        });
                        const fortuneTypeName = storeName || (possibleTypes.sort() && possibleTypes.join('_'));
                        each(possibleTypes, currTypeName => {
                            this.fortuneTypeNames.set(currTypeName, fortuneTypeName);
                        });
                    }
                    else if (!isEmpty(storeName)) {
                        this.fortuneTypeNames.set(typeName, storeName);
                    }
                }
            });
            return this.fortuneTypeNames;
        };
        this.getStoreName = (type, currStoreName, currTypeName) => {
            let storeName = get(type, 'metadata.storeName', null);
            let typeName = type.name;
            if (!isEmpty(storeName) && currStoreName && currStoreName !== storeName) {
                throw new Error(`Conflictiing store names which need to be the same
			${storeName} on ${typeName}
			does not match
			${currStoreName} on ${currTypeName}
		`);
            }
            typeName = !isEmpty(storeName) ? typeName : currTypeName;
            storeName = !isEmpty(storeName) ? storeName : currStoreName;
            return {
                storeName,
                typeName
            };
        };
        this.getFortuneTypeName = (name) => {
            name = this.getDataTypeName(name);
            return this.fortuneTypeNames.has(name) ? this.fortuneTypeNames.get(name) : name;
        };
        this.buildFortune = (fortuneRecordTypeDefinitions) => {
            this.computeFortuneTypeNames();
            const relations = computeRelations(this.schemaInfo, this.getFortuneTypeName);
            const fortuneConfig = {};
            forOwn(this.schemaInfo, (type, name) => {
                if (type.kind === 'OBJECT' && name !== 'Query' && name !== 'Mutation' && name !== 'Subscription') {
                    const fields = {};
                    forOwn(type.fields, (field) => {
                        if (field.name !== 'id') {
                            let currType = field.type;
                            let isArray = false;
                            while (currType.kind === 'NON_NULL' || currType.kind === 'LIST') {
                                if (currType.kind === 'LIST') {
                                    isArray = true;
                                }
                                currType = currType.ofType;
                            }
                            if (get(field, 'metadata.unique') === true) {
                                if (isArray) {
                                    console.error('Unique may not work on list types', name, field.name);
                                }
                                if (!this.uniqueIndexes.has(name)) {
                                    this.uniqueIndexes.set(name, []);
                                }
                                this.uniqueIndexes.get(name).push(field.name);
                            }
                            if (get(field, 'metadata.createdTimestamp') === true) {
                                this.addInputHook(name, (context, record) => {
                                    switch (context.request.method) {
                                        case 'create':
                                            if (!record.hasOwnProperty(field.name)) {
                                                record[field.name] = new Date();
                                            }
                                            return record;
                                    }
                                });
                            }
                            if (get(field, 'metadata.updatedTimestamp') === true) {
                                this.addInputHook(name, (context, _record, update) => {
                                    switch (context.request.method) {
                                        case 'update':
                                            if (!('replace' in update))
                                                update.replace = {};
                                            if (!update.replace.hasOwnProperty(field.name)) {
                                                update.replace[field.name] = new Date();
                                            }
                                            return update;
                                    }
                                });
                            }
                            const currKind = currType.kind;
                            currType = currType.kind === 'ENUM' ? 'String' : currType.name;
                            if (currType === 'ID' || currType === 'String') {
                                currType = String;
                            }
                            else if (currType === 'Int' || currType === 'Float') {
                                currType = Number;
                            }
                            else if (currType === 'Boolean') {
                                currType = Boolean;
                            }
                            else if (currType === 'JSON') {
                                currType = Object;
                            }
                            else if (currType === 'Date' || currType === 'Time' || currType === 'DateTime') {
                                currType = Date;
                            }
                            else if (currKind === 'SCALAR') {
                                currType = Object;
                            }
                            let inverse;
                            if (isString(currType)) {
                                currType = this.getFortuneTypeName(currType);
                                inverse = relations.getInverseWithoutName(currType, field.name, this.getFortuneTypeName(type.name));
                            }
                            currType = isArray ? Array(currType) : currType;
                            if (inverse) {
                                currType = [currType, inverse];
                            }
                            fields[field.name] = currType;
                        }
                        fields.__typename = String;
                    });
                    const fortuneName = this.getFortuneTypeName(name);
                    const fortuneConfigForName = fortuneConfig[fortuneName] ? fortuneConfig[fortuneName] : {};
                    each(keys(fields), (fieldName) => {
                        const currType = fortuneConfigForName[fieldName];
                        const newType = fields[fieldName];
                        if (!currType) {
                            fortuneConfigForName[fieldName] = newType;
                        }
                        else {
                            let badSchema = typeof newType !== typeof currType;
                            badSchema = badSchema ? badSchema : !isEqual(fortuneConfigForName[fieldName], fields[fieldName]);
                            if (badSchema) {
                                console.error('Bad schema. Types that share unions/interfaces have fields of the same name but different types. This is not allowed\n', 'fortune type', fortuneName, '\n', 'field name', fieldName, '\n', 'currType', fortuneConfigForName[fieldName], '\n', 'newType', fields[fieldName]);
                            }
                        }
                    });
                    fortuneConfig[fortuneName] = fortuneConfigForName;
                    if (!this.fortuneOptions.hooks[fortuneName]) {
                        this.fortuneOptions.hooks[fortuneName] = [this.inputHook(fortuneName), this.outputHook(fortuneName)];
                    }
                }
            });
            if (fortuneRecordTypeDefinitions) {
                merge(fortuneConfig, fortuneRecordTypeDefinitions);
            }
            const store = fortune(fortuneConfig, this.fortuneOptions);
            return store;
        };
        this.generateOptions = (options, graphQLTypeName, ids) => {
            options = options ? Object.assign({}, options) : {};
            // if no ids we need to make sure we only get the necessary typename so that this works with interfaces/unions
            if (graphQLTypeName && (!ids || ids.length < 1)) {
                set(options, 'match.__typename', this.getDataTypeName(graphQLTypeName));
            }
            if (has(options, 'exists.id')) {
                delete options.exists.id;
            }
            // make sure sort is boolean rather than enum
            if (options.orderBy) {
                const sort = {};
                for (const fieldName in options.orderBy) {
                    if (options.orderBy[fieldName] === 'ASCENDING' || options.orderBy[fieldName] === 'ASC') {
                        sort[fieldName] = true;
                    }
                    else if (options.orderBy[fieldName] === 'DESCENDING' || options.orderBy[fieldName] === 'DESC') {
                        sort[fieldName] = false;
                    }
                }
                options.sort = sort;
                delete options.orderBy;
            }
            return options;
        };
        this.beginTransaction = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.transaction && this.store.beginTransaction) {
                this.transaction = yield this.store.beginTransaction();
            }
        });
        this.endTransaction = () => __awaiter(this, void 0, void 0, function* () {
            if (this.transaction && this.store.endTransaction) {
                yield this.store.endTransaction();
            }
            this.transaction = null;
        });
        this.fortuneOptions = fortuneOptions;
        if (!this.fortuneOptions || !this.fortuneOptions.hooks) {
            set(this.fortuneOptions, 'hooks', {});
        }
        this.schemaInfo = schemaInfo;
        this.uniqueIndexes = new Map();
        this.inputHooks = new Map();
        this.outputHooks = new Map();
        this.store = this.buildFortune(fortuneRecordTypeDefinitions);
        console.log('CONTSTRUCTED');
    }
    getDataTypeName(graphQLTypeName) {
        graphQLTypeName = graphQLTypeName.endsWith('Connection') ? graphQLTypeName.replace(/Connection$/g, '') : graphQLTypeName;
        graphQLTypeName = graphQLTypeName.endsWith('Edge') ? graphQLTypeName.replace(/Edge$/g, '') : graphQLTypeName;
        return graphQLTypeName;
    }
    inputHook(_fortuneType) {
        return (context, record, update) => {
            const promises = [];
            if (record['__typename'] && this.inputHooks.has(record['__typename'])) {
                this.inputHooks.get(record['__typename']).forEach(hook => {
                    const returnVal = hook(context, record, update);
                    if (returnVal instanceof Promise) {
                        promises.push(returnVal);
                    }
                });
            }
            return new Promise((resolve, reject) => {
                Promise.all(promises).then(() => {
                    switch (context.request.method) {
                        // If it's a create request, return the record.
                        case 'create':
                            resolve(record);
                            break;
                        // If it's an update request, return the update.
                        case 'update':
                            resolve(update);
                            break;
                        // If it's a delete request, the return value doesn't matter.
                        case 'delete':
                            resolve(null);
                            break;
                    }
                }).catch(reason => {
                    reject(reason);
                });
            });
        };
    }
    outputHook(_fortuneType) {
        return (context, record) => {
            if (record['__typename'] && this.outputHooks.has(record['__typename'])) {
                const promises = [];
                this.outputHooks.get(record['__typename']).forEach(hook => {
                    const returnVal = hook(context, record);
                    if (returnVal instanceof Promise) {
                        promises.push(returnVal);
                    }
                });
                return new Promise((resolve, reject) => {
                    Promise.all(promises).then(() => {
                        resolve(record);
                    }).catch(reason => {
                        reject(reason);
                    });
                });
            }
        };
    }
    getFeatures() {
        return this.store.adapter.features || {};
    }
    applyOptions(graphQLTypeName, records, options, meta) {
        records = isArray(records) ? records : [records];
        options = this.generateOptions(options);
        const fortuneType = this.getFortuneTypeName(graphQLTypeName);
        return fortuneCommon.applyOptions(this.store.recordTypes[fortuneType], records, options, meta);
    }
    addOutputHook(graphQLTypeName, hook) {
        if (!this.outputHooks.has(graphQLTypeName)) {
            this.outputHooks.set(graphQLTypeName, [hook]);
        }
        else {
            this.outputHooks.get(graphQLTypeName).push(hook);
        }
    }
    addInputHook(graphQLTypeName, hook) {
        if (!this.inputHooks.has(graphQLTypeName)) {
            this.inputHooks.set(graphQLTypeName, [hook]);
        }
        else {
            this.inputHooks.get(graphQLTypeName).push(hook);
        }
    }
}
