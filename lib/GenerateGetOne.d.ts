import { GraphQLFieldResolver, GraphQLInputType, GraphQLSchema, IntrospectionObjectType, IntrospectionType } from 'graphql';
import { DataResolver, TypeGenerator } from './GraphQLGenieInterfaces';
import { Relations } from './TypeGeneratorUtilities';
import { GenerateGetAll } from './GenerateGetAll';
export declare class GenerateGetOne implements TypeGenerator {
    private objectName;
    private types;
    private schema;
    private dataResolver;
    private fields;
    private resolvers;
    private currInputObjectTypes;
    private schemaInfo;
    private relations;
    private getAllResolvers;
    constructor(dataResolver: DataResolver, objectName: string, types: IntrospectionObjectType[], $schema: GraphQLSchema, $currInputObjectTypes: Map<string, GraphQLInputType>, $schemaInfo: IntrospectionType[], $relations: Relations, $getAll: GenerateGetAll);
    generate(): void;
    getResolvers(): Map<string, Map<string, GraphQLFieldResolver<any, any>>>;
    getFieldsOnObject(): Map<string, object>;
}
//# sourceMappingURL=GenerateGetOne.d.ts.map