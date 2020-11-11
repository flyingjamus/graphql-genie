import { GraphQLArgument, GraphQLInputObjectType, GraphQLNamedType, GraphQLOutputType, GraphQLResolveInfo, GraphQLSchema, GraphQLType, IntrospectionObjectType, IntrospectionType } from 'graphql';
import { DataResolver } from './GraphQLGenieInterfaces';
export declare class Relation {
    type0: string;
    field0: string;
    field0isList: boolean;
    type1: string;
    field1: string;
    field1isList: boolean;
    constructor($type: string, $field: string, $field0isList: boolean);
    setRelative(relation: Relation): void;
    isValidRelative(relation: Relation): boolean;
    isSameRelation(relation: Relation): boolean;
    isCurrentRelation(relation: Relation): boolean;
    getInverse(type: string, field: string, inverseType?: string): string;
    getInverseTuple(type: string, field: string, inverseType?: string): [string, string];
}
export declare class Relations {
    relations: Map<string, Relation>;
    constructor();
    getRelation(name: string): Relation;
    getInverseWithoutName(type: string, field: string, inverseType: string): string;
    getInverse(name: string, type: string, field: string): string;
    setRelation(name: string, type: string, field: string, fieldIsList: boolean): void;
    setSelfRelation(name: string, type: string, field: string, fieldIsList: boolean): void;
    private throwError;
}
export declare const computeRelations: (schemaInfo: IntrospectionType[], typeNameResolver?: (name: string) => string) => Relations;
export declare enum Mutation {
    Create = 0,
    Update = 1,
    Delete = 2,
    Upsert = 3
}
export declare const clean: (obj: any) => any;
export declare const createResolver: (dataResolver: DataResolver) => (currRecord: any, _args: {
    [key: string]: any;
}, _context: any, _info: GraphQLResolveInfo, index?: number, key?: string, returnType?: GraphQLOutputType) => Promise<any[] | {
    data: any;
    clientMutationId: any;
    unalteredData: any;
}>;
export declare const updateResolver: (dataResolver: DataResolver) => (currRecord: any, _args: {
    [key: string]: any;
}, _context: any, _info: GraphQLResolveInfo, index?: number, key?: string, returnType?: GraphQLOutputType) => Promise<any[] | {
    data: any;
    clientMutationId: any;
    unalteredData: any;
}>;
export declare const upsertResolver: (dataResolver: DataResolver) => (currRecord: any, _args: {
    [key: string]: any;
}, _context: any, _info: GraphQLResolveInfo, index?: number, key?: string, returnType?: GraphQLOutputType) => Promise<any[] | {
    data: any;
    clientMutationId: any;
    unalteredData: any;
}>;
export declare const deleteResolver: (dataResolver: DataResolver) => (currRecord: any, _args: {
    [key: string]: any;
}, _context: any, _info: GraphQLResolveInfo, index?: number, key?: string, returnType?: GraphQLOutputType) => Promise<any[] | {
    data: any;
    clientMutationId: any;
    unalteredData: any;
}>;
export declare const getTypeResolver: (dataResolver: DataResolver, schema: GraphQLSchema, field: any, returnConnection?: boolean) => any;
export declare const getAllResolver: (dataResolver: DataResolver, schema: GraphQLSchema, type: IntrospectionObjectType, returnConnection?: boolean) => (_root: any, _args: {
    [key: string]: any;
}, _context: any, _info: GraphQLResolveInfo) => Promise<any>;
export declare const queryArgs: Object;
export declare const fortuneFilters: string[];
export declare const getRootMatchFields: (matchInput: GraphQLInputObjectType) => {
    [key: string]: GraphQLArgument;
};
export declare const moveArgsIntoWhere: (args: object) => object;
export declare const parseFilter: (filter: object, type: GraphQLNamedType) => object;
export declare const filterNested: (filter: object, orderBy: object, type: GraphQLNamedType, fortuneReturn: any[], cache: Map<string, object>, dataResolver: DataResolver, _context: any, _info: any) => Promise<Set<string>>;
export declare const getPayloadTypeName: (typeName: string) => string;
export declare const getPayloadTypeDef: (typeName: string) => string;
export declare const capFirst: (val: string) => string;
export declare const isConnectionType: (type: GraphQLType) => boolean;
export declare const getRecordFromResolverReturn: (record: any) => any;
export declare const meetsConditions: (conditionsArgs: any, returnTypeName: any, returnType: any, currRecord: any, dataResolver: any, _context: any, _info: any) => Promise<boolean>;
//# sourceMappingURL=TypeGeneratorUtilities.d.ts.map