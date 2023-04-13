import { useQuery } from "@apollo/client";
import { gql } from "__generated__/gql";

const QUERY = gql(/* GraphQL */`
  query GetCollections {
    collections {
      id
    }
  }
`);

export default () => {
  return useQuery(QUERY)
}
