import { GraphQLSchema, IntrospectionQuery, IntrospectionType } from 'graphql';
import { DataResolver, GenericObject, GeniePlugin, GraphQLGenieOptions } from './GraphQLGenieInterfaces';
import { GraphQLSchemaBuilder } from './GraphQLSchemaBuilder';
export declare class GraphQLGenie {
    private fortuneOptions;
    private fortuneRecordTypeDefinitions;
    private config;
    private generators;
    private schema;
    private schemaBuilder;
    private schemaInfo;
    private schemaInfoBuilder;
    private relations;
    private graphQLFortune;
    private plugins;
    constructor(options: GraphQLGenieOptions);
    private validate;
    private init;
    private buildResolvers;
    private buildQueries;
    use: (plugin: GeniePlugin) => GraphQLGenie;
    useAsync: (plugin: GeniePlugin) => Promise<GraphQLGenie>;
    getSchema: () => GraphQLSchema;
    getDataResolver: () => DataResolver;
    getSchemaBuilder: () => GraphQLSchemaBuilder;
    printSchema: () => string;
    private mapIdsToCreatedIds;
    importRawData: (data: any[], merge?: boolean, defaultTypename?: string, context?: any, conditions?: {
        id: string | string[];
        conditions: GenericObject;
    }[]) => Promise<{
        data: GenericObject[];
        unalteredData: GenericObject[];
        missingData: GenericObject[];
    }>;
    getUserTypes: () => string[];
    getModelTypes: () => IntrospectionType[];
    getRawData: (types?: any[], context?: any) => Promise<any[]>;
    getFragmentTypes: () => IntrospectionQuery;
    /**
     * This method does not need to be called manually, it is automatically called upon the first request if it is not connected already.
     * However, it may be useful if manually reconnect is needed.
     * The resolved value is the instance itself.
     * @returns Promise<GraphQLGenie>
     */
    connect: () => Promise<GraphQLGenie>;
    /**
     * Close adapter connection, and reset connection state.
     * The resolved value is the instance itself.
     * @returns Promise<GraphQLGenie>
     */
    disconnect: () => Promise<GraphQLGenie>;
}
//# sourceMappingURL=GraphQLGenie.d.ts.map