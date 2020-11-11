import { GraphQLFieldResolver, GraphQLInputType, GraphQLSchema, IntrospectionObjectType, IntrospectionType } from 'graphql';
import { DataResolver, TypeGenerator } from './GraphQLGenieInterfaces';
import { Relations } from './TypeGeneratorUtilities';
export declare class GenerateGetAll implements TypeGenerator {
    private objectName;
    private types;
    private schema;
    private dataResolver;
    private fields;
    resolvers: Map<string, GraphQLFieldResolver<any, any>>;
    private currInputObjectTypes;
    private schemaInfo;
    private relations;
    constructor(dataResolver: DataResolver, objectName: string, types: IntrospectionObjectType[], $schema: GraphQLSchema, $currInputObjectTypes: Map<string, GraphQLInputType>, $schemaInfo: IntrospectionType[], $relations: Relations);
    generate(): void;
    getResolvers(): Map<string, Map<string, GraphQLFieldResolver<any, any>>>;
    getFieldsOnObject(): Map<string, object>;
}
//# sourceMappingURL=GenerateGetAll.d.ts.map