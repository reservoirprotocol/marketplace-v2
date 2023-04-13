/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetCollectionById($id: ID!) {\n      collection(id: $id) {\n        id\n        name\n        totalTokens\n      }\n    }\n  ": types.GetCollectionByIdDocument,
    "\n  query GetUserCollections($first: Int, $skip: Int $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy, $where: Collection_FilterArgs) {\n    collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy, where: $where) {\n      id\n      name\n      totalTokens\n    }\n  }\n": types.GetUserCollectionsDocument,
    "\n  query GetUserTokens($first: Int, $skip: Int, $orderDirection: OrderDirection, $token_OrderBy: Token_OrderBy, $where: Token_FilterArgs) {\n    tokens(first: $first, skip: $skip, orderDirection: $orderDirection, token_OrderBy: $token_OrderBy, where: $where) {\n      id\n      tokenID\n      tokenURI\n      collection {\n        id\n        name\n        totalTokens\n      }\n    }\n  }\n": types.GetUserTokensDocument,
    "\n  query GetCollections($first: Int, $skip: Int, $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy) {\n    collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy) {\n      id\n      name\n    }\n  }\n": types.GetCollectionsDocument,
    "\n  query GetTokensByCollection($first: Int, $skip: Int, $orderDirection: OrderDirection, $token_OrderBy: Token_OrderBy, $where: Token_FilterArgs) {\n    tokens(first: $first, skip: $skip, orderDirection: $orderDirection, token_OrderBy: $token_OrderBy, where: $where) {\n      id\n      tokenID\n      tokenURI\n      collection {\n        id\n        name\n        totalTokens\n      }\n      owner {\n        id\n      }\n    }\n  }\n  ": types.GetTokensByCollectionDocument,
    "\n    query GetCollectionById($id: ID!) {\n        collection(id: $id) {\n          id\n          name\n          totalTokens\n        }\n      }\n  ": types.GetCollectionByIdDocument,
    "\n    query GetTokenById($id: ID!) {\n        token(id: $id) {\n          id\n          tokenID\n          tokenURI\n          collection {\n            id\n            name\n            totalTokens\n          }\n          owner {\n            id\n          }\n        }\n      }\n  ": types.GetTokenByIdDocument,
    "\n    query GetTopCollections($first: Int, $skip: Int, $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy) {\n      collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy) {\n        id\n        name\n      }\n    }\n  ": types.GetTopCollectionsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetCollectionById($id: ID!) {\n      collection(id: $id) {\n        id\n        name\n        totalTokens\n      }\n    }\n  "): (typeof documents)["\n  query GetCollectionById($id: ID!) {\n      collection(id: $id) {\n        id\n        name\n        totalTokens\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserCollections($first: Int, $skip: Int $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy, $where: Collection_FilterArgs) {\n    collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy, where: $where) {\n      id\n      name\n      totalTokens\n    }\n  }\n"): (typeof documents)["\n  query GetUserCollections($first: Int, $skip: Int $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy, $where: Collection_FilterArgs) {\n    collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy, where: $where) {\n      id\n      name\n      totalTokens\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserTokens($first: Int, $skip: Int, $orderDirection: OrderDirection, $token_OrderBy: Token_OrderBy, $where: Token_FilterArgs) {\n    tokens(first: $first, skip: $skip, orderDirection: $orderDirection, token_OrderBy: $token_OrderBy, where: $where) {\n      id\n      tokenID\n      tokenURI\n      collection {\n        id\n        name\n        totalTokens\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserTokens($first: Int, $skip: Int, $orderDirection: OrderDirection, $token_OrderBy: Token_OrderBy, $where: Token_FilterArgs) {\n    tokens(first: $first, skip: $skip, orderDirection: $orderDirection, token_OrderBy: $token_OrderBy, where: $where) {\n      id\n      tokenID\n      tokenURI\n      collection {\n        id\n        name\n        totalTokens\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetCollections($first: Int, $skip: Int, $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy) {\n    collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetCollections($first: Int, $skip: Int, $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy) {\n    collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTokensByCollection($first: Int, $skip: Int, $orderDirection: OrderDirection, $token_OrderBy: Token_OrderBy, $where: Token_FilterArgs) {\n    tokens(first: $first, skip: $skip, orderDirection: $orderDirection, token_OrderBy: $token_OrderBy, where: $where) {\n      id\n      tokenID\n      tokenURI\n      collection {\n        id\n        name\n        totalTokens\n      }\n      owner {\n        id\n      }\n    }\n  }\n  "): (typeof documents)["\n  query GetTokensByCollection($first: Int, $skip: Int, $orderDirection: OrderDirection, $token_OrderBy: Token_OrderBy, $where: Token_FilterArgs) {\n    tokens(first: $first, skip: $skip, orderDirection: $orderDirection, token_OrderBy: $token_OrderBy, where: $where) {\n      id\n      tokenID\n      tokenURI\n      collection {\n        id\n        name\n        totalTokens\n      }\n      owner {\n        id\n      }\n    }\n  }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetCollectionById($id: ID!) {\n        collection(id: $id) {\n          id\n          name\n          totalTokens\n        }\n      }\n  "): (typeof documents)["\n    query GetCollectionById($id: ID!) {\n        collection(id: $id) {\n          id\n          name\n          totalTokens\n        }\n      }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetTokenById($id: ID!) {\n        token(id: $id) {\n          id\n          tokenID\n          tokenURI\n          collection {\n            id\n            name\n            totalTokens\n          }\n          owner {\n            id\n          }\n        }\n      }\n  "): (typeof documents)["\n    query GetTokenById($id: ID!) {\n        token(id: $id) {\n          id\n          tokenID\n          tokenURI\n          collection {\n            id\n            name\n            totalTokens\n          }\n          owner {\n            id\n          }\n        }\n      }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query GetTopCollections($first: Int, $skip: Int, $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy) {\n      collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy) {\n        id\n        name\n      }\n    }\n  "): (typeof documents)["\n    query GetTopCollections($first: Int, $skip: Int, $orderDirection: OrderDirection, $collection_orderBy: Collection_orderBy) {\n      collections(first: $first, skip: $skip, orderDirection: $orderDirection, collection_orderBy: $collection_orderBy) {\n        id\n        name\n      }\n    }\n  "];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;