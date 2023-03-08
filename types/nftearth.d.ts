export enum OrderType {
  FULL_OPEN,
  PARTIAL_OPEN,
  FULL_RESTRICTED,
  PARTIAL_RESTRICTED,
}
export enum ItemType {
  NATIVE,
  ERC20,
  ERC721,
  ERC1155,
  ERC721_WITH_CRITERIA,
  ERC1155_WITH_CRITERIA,
}
type OrderKind = "contract-wide" | "single-token" | "token-list" | "bundle-ask";
export type ConsiderationItem = {
  itemType: ItemType;
  token: string;
  identifierOrCriteria: string;
  startAmount: string;
  endAmount: string;
  recipient: string;
};
export type OfferItem = {
  itemType: ItemType;
  token: string;
  identifierOrCriteria: string;
  startAmount: string;
  endAmount: string;
};
type OrderComponents = {
  kind?: OrderKind;
  offerer: string;
  zone: string;
  offer: OfferItem[];
  consideration: ConsiderationItem[];
  orderType: OrderType;
  startTime: number;
  endTime: number;
  zoneHash: string;
  salt: string;
  conduitKey: string;
  counter: string;
  signature?: string;
};

type CollectionCriteria = {
  slug: string
}
type Criteria = {
  collection: CollectionCriteria
}
export type Orders = {
  parameters: OrderComponents
  chainId: number
  signature: string
  criteria?: Criteria
}