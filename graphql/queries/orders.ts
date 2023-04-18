import { gql } from "__generated__";

export const CREATE_ORDER = gql(/* GraphQL */`
  mutation CreateOrder(
    $createOrderInput: CreateOrderInput!
  ) {
    createOrder(
      createOrderInput: $createOrderInput
    ) {
      hash
    }
  }
`);

