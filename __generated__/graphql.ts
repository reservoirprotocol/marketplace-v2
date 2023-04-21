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

export type Collection_FilterArgs = {
  owner?: InputMaybe<Scalars['ID']>;
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

export type CreateOrderInput = {
  /** The amount of tokens to sell/purchase. It's 1 for ERC-721 and >= 1 for ERC-1155. */
  amount: Scalars['Int'];
  /** The address of the collection. */
  collectionAddress: Scalars['String'];
  /** The currency address. See Addresses | LooksRare SDK for the possible values. */
  currencyAddress: Scalars['String'];
  /** End time timestamp in seconds (when the order becomes invalid). */
  endTime: Scalars['Int'];
  /** If true, the order is a sell order (listing). If false, the order is a buy order (offer). */
  isOrderAsk: Scalars['Boolean'];
  /** The minPercentageToAsk represents the minimum percentage required to be transferred to the ask or the trade is rejected (e.g., 9800 = 98% of the trade price). It protects the ask user from an unexpected increase in fees. */
  minPercentageToAsk: Scalars['Int'];
  /** The order nonce. It's meant to be unique expect for conditional orders. Once executed, the order nonce becomes invalid rendering all the orders with the same nonce invalid. */
  nonce: Scalars['String'];
  /** The order params are used for more advanced orders. For example to define the maximum price for a Dutch auction or recipient address for a private sale. Not used for standard orders. */
  params: Scalars['String'];
  /** The price in WEI. */
  price: Scalars['String'];
  /** The full EIP-712 signature. */
  signature: Scalars['String'];
  /** The address of the MakerOrder signer. */
  signer: Scalars['String'];
  /** Start time timestamp in seconds (when the order starts to be valid). */
  startTime: Scalars['Int'];
  /** The strategy address. See Addresses | LooksRare SDK for the possible values. */
  strategy: Scalars['String'];
  /** The id of the asset. If the order is a collection offer, this field will be null. */
  tokenId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrder: Order;
};


export type MutationCreateOrderArgs = {
  createOrderInput: CreateOrderInput;
};

export type Nonce = {
  __typename?: 'Nonce';
  /** The order nonce. It's meant to be unique expect for conditional orders. Once executed, the order nonce becomes invalid rendering all the orders with the same nonce invalid. */
  nonce: Scalars['String'];
  /** The address of the MakerOrder signer. */
  signer: Scalars['String'];
};

export type Order = {
  __typename?: 'Order';
  /** The amount of tokens to sell/purchase. It's 1 for ERC-721 and >= 1 for ERC-1155. */
  amount: Scalars['Int'];
  /** The address of the collection. */
  collectionAddress: Scalars['String'];
  createdAt: Scalars['Int'];
  /** The currency address. See Addresses | LooksRare SDK for the possible values. */
  currencyAddress: Scalars['String'];
  /** End time timestamp in seconds (when the order becomes invalid). */
  endTime: Scalars['Int'];
  /** The order hash is a unique hash which identifies the order. */
  hash: Scalars['String'];
  /** If true, the order is a sell order (listing). If false, the order is a buy order (offer). */
  isOrderAsk: Scalars['Boolean'];
  /** The minPercentageToAsk represents the minimum percentage required to be transferred to the ask or the trade is rejected (e.g., 9800 = 98% of the trade price). It protects the ask user from an unexpected increase in fees. */
  minPercentageToAsk: Scalars['Int'];
  /** The order nonce. It's meant to be unique expect for conditional orders. Once executed, the order nonce becomes invalid rendering all the orders with the same nonce invalid. */
  nonce: Scalars['String'];
  /** The order params are used for more advanced orders. For example to define the maximum price for a Dutch auction or recipient address for a private sale. Not used for standard orders. */
  params: Scalars['String'];
  /** The price in WEI. */
  price: Scalars['String'];
  /** The r parameter of the EIP-712 signature. */
  r: Scalars['String'];
  /** The s parameter of the EIP-712 signature. */
  s: Scalars['String'];
  /** The full EIP-712 signature. */
  signature: Scalars['String'];
  /** The address of the MakerOrder signer. */
  signer: Scalars['String'];
  /** Start time timestamp in seconds (when the order starts to be valid). */
  startTime: Scalars['Int'];
  /** The order status. Only VALID orders can be matched with a TakerOrder. */
  status: OrderStatus;
  /** The strategy address. See Addresses | LooksRare SDK for the possible values. */
  strategy: Scalars['String'];
  /** The id of the asset. If the order is a collection offer, this field will be null. */
  tokenId: Scalars['String'];
  updatedAt: Scalars['Int'];
  /** The v parameter of the EIP-712 signature. */
  v: Scalars['String'];
};

export enum OrderDirection {
  Asc = 'Asc',
  Desc = 'Desc'
}

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Erc20Approval = 'ERC20_APPROVAL',
  ErcApproval = 'ERC_APPROVAL',
  Executed = 'EXECUTED',
  Expired = 'EXPIRED',
  InvalidOwner = 'INVALID_OWNER',
  Valid = 'VALID'
}

export type Order_FilterArgs = {
  collectionAddress?: InputMaybe<Scalars['String']>;
  isOrderAsk?: InputMaybe<Scalars['Boolean']>;
  signer?: InputMaybe<Scalars['String']>;
  tokenId?: InputMaybe<Scalars['String']>;
};

export enum Order_OrderBy {
  CreatedAt = 'CreatedAt'
}

export type Query = {
  __typename?: 'Query';
  collection: Collection;
  collections: Array<Collection>;
  nonce: Nonce;
  order: Order;
  orders: Array<Order>;
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
  where?: InputMaybe<Collection_FilterArgs>;
};


export type QueryNonceArgs = {
  signer: Scalars['String'];
};


export type QueryOrderArgs = {
  hash: Scalars['ID'];
};


export type QueryOrdersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  order_OrderBy?: InputMaybe<Order_OrderBy>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Order_FilterArgs>;
};


export type QueryTokenArgs = {
  id: Scalars['ID'];
};


export type QueryTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  token_OrderBy?: InputMaybe<Token_OrderBy>;
  where?: InputMaybe<Token_FilterArgs>;
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

export type Token_FilterArgs = {
  collection?: InputMaybe<Scalars['ID']>;
  owner?: InputMaybe<Scalars['ID']>;
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

export type GetCollectionByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCollectionByIdQuery = { __typename?: 'Query', collection: { __typename?: 'Collection', id: string, name: string, totalTokens: any } };

export type GetUserCollectionsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  collection_orderBy?: InputMaybe<Collection_OrderBy>;
  where?: InputMaybe<Collection_FilterArgs>;
}>;


export type GetUserCollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: string, name: string, totalTokens: any }> };

export type GetUserTokensQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  token_OrderBy?: InputMaybe<Token_OrderBy>;
  where?: InputMaybe<Token_FilterArgs>;
}>;


export type GetUserTokensQuery = { __typename?: 'Query', tokens: Array<{ __typename?: 'Token', id: string, tokenID: any, tokenURI?: string | null, collection: { __typename?: 'Collection', id: string, name: string, totalTokens: any } }> };

export type CreateOrderMutationVariables = Exact<{
  createOrderInput: CreateOrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'Order', hash: string } };

export type GetOrderListingsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  order_OrderBy?: InputMaybe<Order_OrderBy>;
  where?: InputMaybe<Order_FilterArgs>;
}>;


export type GetOrderListingsQuery = { __typename?: 'Query', orders: Array<{ __typename?: 'Order', hash: string, collectionAddress: string, tokenId: string, price: string, startTime: number, endTime: number }> };

export type GetNonceQueryVariables = Exact<{
  signer: Scalars['String'];
}>;


export type GetNonceQuery = { __typename?: 'Query', nonce: { __typename?: 'Nonce', nonce: string } };

export type GetTokenByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTokenByIdQuery = { __typename?: 'Query', token: { __typename?: 'Token', id: string, tokenID: any, tokenURI?: string | null, collection: { __typename?: 'Collection', id: string, name: string, totalTokens: any }, owner: { __typename?: 'User', id: string } } };

export type GetCollectionsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  collection_orderBy?: InputMaybe<Collection_OrderBy>;
}>;


export type GetCollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: string, name: string }> };

export type GetTokensByCollectionQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  token_OrderBy?: InputMaybe<Token_OrderBy>;
  where?: InputMaybe<Token_FilterArgs>;
}>;


export type GetTokensByCollectionQuery = { __typename?: 'Query', tokens: Array<{ __typename?: 'Token', id: string, tokenID: any, tokenURI?: string | null, collection: { __typename?: 'Collection', id: string, name: string, totalTokens: any }, owner: { __typename?: 'User', id: string } }> };

export type GetTopCollectionsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderDirection?: InputMaybe<OrderDirection>;
  collection_orderBy?: InputMaybe<Collection_OrderBy>;
}>;


export type GetTopCollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: string, name: string }> };


export const GetCollectionByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalTokens"}}]}}]}}]} as unknown as DocumentNode<GetCollectionByIdQuery, GetCollectionByIdQueryVariables>;
export const GetUserCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserCollections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Collection_orderBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Collection_FilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalTokens"}}]}}]}}]} as unknown as DocumentNode<GetUserCollectionsQuery, GetUserCollectionsQueryVariables>;
export const GetUserTokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserTokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token_OrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Token_OrderBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Token_FilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"token_OrderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token_OrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenID"}},{"kind":"Field","name":{"kind":"Name","value":"tokenURI"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalTokens"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserTokensQuery, GetUserTokensQueryVariables>;
export const CreateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createOrderInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"createOrderInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createOrderInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hash"}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;
export const GetOrderListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order_OrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Order_OrderBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Order_FilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_OrderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order_OrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hash"}},{"kind":"Field","name":{"kind":"Name","value":"collectionAddress"}},{"kind":"Field","name":{"kind":"Name","value":"tokenId"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}}]} as unknown as DocumentNode<GetOrderListingsQuery, GetOrderListingsQueryVariables>;
export const GetNonceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNonce"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nonce"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"signer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nonce"}}]}}]}}]} as unknown as DocumentNode<GetNonceQuery, GetNonceQueryVariables>;
export const GetTokenByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTokenById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenID"}},{"kind":"Field","name":{"kind":"Name","value":"tokenURI"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalTokens"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetTokenByIdQuery, GetTokenByIdQueryVariables>;
export const GetCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Collection_orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCollectionsQuery, GetCollectionsQueryVariables>;
export const GetTokensByCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTokensByCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token_OrderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Token_OrderBy"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Token_FilterArgs"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"token_OrderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token_OrderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tokenID"}},{"kind":"Field","name":{"kind":"Name","value":"tokenURI"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalTokens"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetTokensByCollectionQuery, GetTokensByCollectionQueryVariables>;
export const GetTopCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTopCollections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"skip"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderDirection"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_orderBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Collection_orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"Variable","name":{"kind":"Name","value":"skip"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"collection_orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetTopCollectionsQuery, GetTopCollectionsQueryVariables>;