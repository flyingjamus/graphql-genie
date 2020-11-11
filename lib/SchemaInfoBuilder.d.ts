import { GraphQLSchema, IntrospectionType } from 'graphql';
export default class SchemaInfoBuilder {
    private schema;
    private schemaInfo;
    constructor(schema: GraphQLSchema);
    getSchemaInfo(): IntrospectionType[];
    private addDirectiveFromAST;
    private buildSchemaInfo;
}
//# sourceMappingURL=SchemaInfoBuilder.d.ts.map