import { GraphQLError } from 'graphql';
export declare const typeIsList: (type: any) => boolean;
export declare const getReturnType: (type: any) => string;
export declare class FindByUniqueError extends Error implements GraphQLError {
    extensions: Record<string, any>;
    readonly name: any;
    readonly locations: any;
    readonly path: any;
    readonly source: any;
    readonly positions: any;
    readonly nodes: any;
    readonly arg: any;
    readonly typename: any;
    originalError: any;
    [key: string]: any;
    constructor(message: string, code?: string, properties?: Record<string, any>);
}
//# sourceMappingURL=GraphQLUtils.d.ts.map