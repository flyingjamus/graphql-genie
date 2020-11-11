import { DocumentNode, GraphQLFieldResolver } from 'graphql';
import { GraphQLGenie } from '.';
import { GraphQLSchemaBuilder } from './GraphQLSchemaBuilder';
export interface TypeGenerator {
    getResolvers(): Map<string, Map<string, GraphQLFieldResolver<any, any>>>;
    getFieldsOnObject(): Map<string, object>;
}
export interface Aggregate {
    count: number;
}
export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}
export declare class Connection {
    edges: any[];
    aggregate: Aggregate;
    pageInfo: PageInfo;
    constructor();
}
export interface Features {
    logicalOperators: boolean;
}
export interface DataResolver {
    create(graphQLTypeName: string, records: any, meta?: any): Promise<any>;
    find(graphQLTypeName: string, ids?: string[], options?: any, meta?: any): Promise<any>;
    update(graphQLTypeName: string, updates: object, meta?: any, options?: object): Promise<any>;
    delete(graphQLTypeName: string, ids?: string[], meta?: any): Promise<any>;
    addOutputHook(graphQLTypeName: string, hook: DataResolverOutputHook): any;
    addInputHook(graphQLTypeName: string, hook: DataResolverInputHook): any;
    getValueByUnique(returnTypeName: string, args: any, meta: any): Promise<Object>;
    canAdd(graphQLTypeName: string, records: Object, meta: any): Promise<boolean>;
    getConnection(allEdges: any[], before: string, after: string, first: number, last: number): Connection;
    getFeatures(): Features;
    applyOptions(graphQLTypeName: string, records: any, options: any, meta?: any): any;
    getStore(): any;
    beginTransaction(): Promise<void>;
    endTransaction(): Promise<void>;
    computeId(graphType: string, id?: string): string;
    getTypeFromId(inputId: string): string;
    getOriginalIdFromObjectId(inputId: string): string;
    getLink(graphQLTypeName: string, field: string): string;
}
export interface GenerateConfig {
    generateGetOne?: boolean;
    generateGetAll?: boolean;
    generateCreate?: boolean;
    generateUpdate?: boolean;
    generateDelete?: boolean;
    generateUpsert?: boolean;
    generateConnections?: boolean;
    generateMigrations?: boolean;
}
export interface GraphQLGenieOptions {
    schemaBuilder?: GraphQLSchemaBuilder;
    typeDefs?: string | DocumentNode;
    generatorOptions?: GenerateConfig;
    fortuneOptions?: FortuneOptions;
    fortuneRecordTypeDefinitions?: FortuneRecordTypeDefinitions;
    plugins?: GeniePlugin[] | GeniePlugin;
}
export interface FortuneSettings {
    enforceLinks?: boolean;
    name?: string;
    description?: string;
}
export interface FortuneOptions {
    adapter?: any;
    hooks?: object;
    documentation?: object;
    settings?: FortuneSettings;
}
export interface FortuneRecordTypeDefinitions {
    [key: string]: {
        [property: string]: any;
    };
}
export interface GeniePlugin {
    (genie: GraphQLGenie): any;
}
export interface DataResolverInputHook {
    (context?: any, record?: any, update?: any): any;
}
export interface DataResolverOutputHook {
    (context?: any, record?: any): any;
}
export declare type GenericObject = {
    [key: string]: any;
};
//# sourceMappingURL=GraphQLGenieInterfaces.d.ts.map