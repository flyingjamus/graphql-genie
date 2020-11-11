import { IntrospectionType } from 'graphql';
import { Connection, DataResolver, DataResolverInputHook, DataResolverOutputHook, Features, FortuneOptions, FortuneRecordTypeDefinitions } from './GraphQLGenieInterfaces';
interface FortuneUpdate {
    id: string;
    push?: object;
    replace?: object;
    pull?: object;
}
export default class FortuneGraph implements DataResolver {
    private fortuneOptions;
    fortuneTypeNames: Map<string, string>;
    private uniqueIndexes;
    private schemaInfo;
    private inputHooks;
    private outputHooks;
    private store;
    private transaction;
    private dataLoaders;
    constructor(fortuneOptions: FortuneOptions, schemaInfo: IntrospectionType[], fortuneRecordTypeDefinitions?: FortuneRecordTypeDefinitions);
    computeId: (graphType: string, id?: string) => string;
    getTypeFromId: (inputId: string) => string;
    getOriginalIdFromObjectId: (inputId: string) => string;
    getValueByUnique: (returnTypeName: string, args: any, meta: any) => Promise<Object>;
    canAdd: (graphQLTypeName: string, inputRecords: object[], meta: any) => Promise<boolean>;
    getConnection: (allEdges: any[], before: string, after: string, first: number, last: number) => Connection;
    private edgesToReturn;
    private applyCursorsToEdges;
    private getDataTypeName;
    create: (graphQLTypeName: string, records: any, meta?: any) => Promise<any>;
    find: (graphQLTypeName: string, ids?: string[], options?: any, meta?: any) => Promise<any[]>;
    update: (graphQLTypeName: string, records: any, meta?: any, options?: object) => Promise<any>;
    delete: (graphQLTypeName: string, ids?: string[], meta?: any) => Promise<boolean>;
    generateUpdates: (record: any, options?: object) => FortuneUpdate;
    getLink: (graphQLTypeName: string, field: string) => string;
    getStore: () => any;
    private computeFortuneTypeNames;
    private getStoreName;
    getFortuneTypeName: (name: string) => string;
    private buildFortune;
    private inputHook;
    private outputHook;
    getFeatures(): Features;
    private generateOptions;
    applyOptions(graphQLTypeName: string, records: any, options: any, meta?: any): any;
    addOutputHook(graphQLTypeName: string, hook: DataResolverOutputHook): void;
    addInputHook(graphQLTypeName: string, hook: DataResolverInputHook): void;
    beginTransaction: () => Promise<void>;
    endTransaction: () => Promise<void>;
    clearCache: () => void;
}
export {};
//# sourceMappingURL=FortuneGraph.d.ts.map