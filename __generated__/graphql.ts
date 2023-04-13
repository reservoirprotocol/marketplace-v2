/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any;
};

export type Collection = {
  __typename?: 'Collection';
  createdAt: Scalars['BigInt'];
  id: Scalars['ID'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalTokens: Scalars['BigInt'];
  totalTransactions: Scalars['BigInt'];
  updatedAt: Scalars['BigInt'];
};

export enum Collection_OrderBy {
  Block = 'Block',
  CreatedAt = 'CreatedAt',
  Id = 'Id',
  Name = 'Name',
  Symbol = 'Symbol',
  Tokens = 'Tokens',
  TotalTokens = 'TotalTokens',
  TotalTransactions = 'TotalTransactions',
  Transactions = 'Transactions',
  UpdatedAt = 'UpdatedAt'
}

export enum OrderDirection {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type Query = {
  __typename?: 'Query';
  collection: Collection;
  collections: Array<Collection>;
  token: Token;
  tokens: Array<Token>;
  user: User;
};


export type QueryCollectionArgs = {
  id: Scalars['ID'];
};


export type QueryCollectionsArgs = {
  collection_orderBy?: InputMaybe<Collection_OrderBy>;
  first?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryTokenArgs = {
  id: Scalars['ID'];
};


export type QueryTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  token_OrderBy?: InputMaybe<Token_OrderBy>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Token = {
  __typename?: 'Token';
  burned: Scalars['Boolean'];
  collection: Collection;
  createdAt: Scalars['BigInt'];
  id: Scalars['ID'];
  minter: User;
  owner: User;
  tokenID: Scalars['BigInt'];
  tokenURI?: Maybe<Scalars['String']>;
  totalTransactions: Scalars['BigInt'];
  updatedAt: Scalars['BigInt'];
};

export enum Token_OrderBy {
  Block = 'Block',
  Burned = 'Burned',
  Collection = 'Collection',
  CreatedAt = 'CreatedAt',
  Id = 'Id',
  Minter = 'Minter',
  Owner = 'Owner',
  TokenId = 'TokenId',
  TokenUri = 'TokenUri',
  TotalTransactions = 'TotalTransactions',
  Transactions = 'Transactions',
  UpdatedAt = 'UpdatedAt'
}

export type User = {
  __typename?: 'User';
  createdAt: Scalars['BigInt'];
  id: Scalars['ID'];
  tokens: Array<Token>;
  totalTokens: Scalars['BigInt'];
  totalTokensMinted: Scalars['BigInt'];
  totalTransactions: Scalars['BigInt'];
  updatedAt: Scalars['BigInt'];
};

export type GetCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: string }> };


export const GetCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetCollectionsQuery, GetCollectionsQueryVariables>;