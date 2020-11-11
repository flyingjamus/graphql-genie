import { GraphQLFieldResolver } from 'graphql';
import { TypeGenerator } from './GraphQLGenieInterfaces';
import { GraphQLGenie } from './GraphQLGenie';
export declare class GenerateMigrations implements TypeGenerator {
    private genie;
    private resolvers;
    private fieldsOnObject;
    private currOutputObjectTypeDefs;
    constructor($genie: GraphQLGenie, $currOutputObjectTypeDefs: Set<string>);
    generate(): void;
    getResolvers(): Map<string, Map<string, GraphQLFieldResolver<any, any>>>;
    getFieldsOnObject(): Map<string, object>;
}
//# sourceMappingURL=GenerateMigrations.d.ts.map