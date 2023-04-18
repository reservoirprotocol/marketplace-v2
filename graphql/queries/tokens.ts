import { gql } from "__generated__";

export const GET_NONCE = gql(/* GraphQL */`
query GetNonce($signer: String!) {
    nonce(signer: $signer) {
      nonce
    }
  }
`);

export const GET_TOKEN_BY_ID = gql(/* GraphQL */`
query GetTokenById($id: ID!) {
    token(id: $id) {
      id
      tokenID
      tokenURI
      collection {
        id
        name
        totalTokens
      }
      owner {
        id
      }
    }
  }
`);