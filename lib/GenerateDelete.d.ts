import { GraphQLFieldResolver, GraphQLInputType, GraphQLSchema, IntrospectionObjectType, IntrospectionType } from 'graphql';
import { DataResolver, GenerateConfig, TypeGenerator } from './GraphQLGenieInterfaces';
import { Relations } from './TypeGeneratorUtilities';
export declare class GenerateDelete implements TypeGenerator {
    private objectName;
    private types;
    private config;
    private dataResolver;
    private schema;
    private fields;
    private resolvers;
    private currInputObjectTypes;
    private currOutputObjectTypeDefs;
    private schemaInfo;
    private relations;
    constructor(dataResolver: DataResolver, objectName: string, types: IntrospectionObjectType[], $config: GenerateConfig, currInputObjectTypes: Map<string, GraphQLInputType>, currOutputObjectTypeDefs: Set<string>, schemaInfo: IntrospectionType[], schema: GraphQLSchema, $relations: Relations);
    generate(): void;
    getResolvers(): Map<string, Map<string, GraphQLFieldResolver<any, any>>>;
    getFieldsOnObject(): Map<string, object>;
}
//# sourceMappingURL=GenerateDelete.d.ts.map