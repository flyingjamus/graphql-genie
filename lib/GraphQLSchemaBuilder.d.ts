import { DocumentNode, GraphQLFieldResolver, GraphQLSchema, GraphQLType } from 'graphql';
import { IResolvers } from '@graphql-tools/utils';
import { GenerateConfig } from './GraphQLGenieInterfaces';
export declare class GraphQLSchemaBuilder {
    private schema;
    private typeDefs;
    private config;
    private resolveFunctions;
    constructor(typeDefs: string | DocumentNode, $config: GenerateConfig);
    printSchemaWithDirectives: () => string;
    addTypeDefsToSchema: ($typeDefs?: string | DocumentNode) => GraphQLSchema;
    getSchema: () => GraphQLSchema;
    setResolvers: (typeName: string, fieldResolvers: Map<string, GraphQLFieldResolver<any, any>>) => GraphQLSchema;
    setIResolvers: (iResolvers: IResolvers) => GraphQLSchema;
    isUserType(type: GraphQLType): boolean;
    isUserTypeByName(typeName: string): boolean;
}
//# sourceMappingURL=GraphQLSchemaBuilder.d.ts.map