<h3 align="center">Reservoir Market v2</h3>
  <p align="center">
An open source NFT marketplace built on Reservoir.

<!-- ABOUT THE PROJECT -->

## About The Project

Reservoir Market v2 is an open source marketplace built with Reservoir APIs that enables access to instant liquidity aggregated from major marketplace. We encourage developers to use this project as a reference for their own implementation or even fork the project and make their own meaningful changes. The project is lightly configurable refer to the configuration variables below. If you're looking for a no-code solution check out our [v1 marketplace](https://github.com/reservoirprotocol/marketplace-v1).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started (Self-Hosted)

### Prerequisites

1. Install [Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install)
3. Request free [Reservoir API key](https://reservoir.tools/request-api-key)

### Built With

- [ReservoirKit](https://docs.reservoir.tools/docs/reservoir-kit)
- [Reservoir Protocol and API](https://reservoirprotocol.github.io/)
- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [Ethers.io](https://ethers.io/)
- [WAGMI](https://wagmi.sh/)
- [Stitches](https://stitches.dev/docs/variants)

### Installation

Fork this repo and follow these instructions to install dependancies.

With yarn:

```bash
$ yarn install
```

With NPM:

```bash
$ npm install
```

### Configuration

Reservoir Market v2 is lightly configurable with the configurations below. You can either add these to a `.env.production` and `.env.development` or add env variables to a deployment platform like [vercel](https://vercel.com/).

**Environment Variables**
| Environment Variable | Required | Description | Example |
|--------------------------------|----------|-------------------------------------------------------------------------------------|---------------------|
| NEXT_PUBLIC_HOST_URL | `true` | The domain that the deployed project is hosted on. | http://localhost:3000 |
| ETH_RESERVOIR_API_KEY | `false` | Ethereum Reservoir API key provided by the Reservoir Protocol. [Get your own API key](https://reservoir.tools/request-api-key). | 123e4567-e89b-12d3-a456-426614174000 |
| GOERLI_RESERVOIR_API_KEY | `false` | Goerli Reservoir API key provided by the Reservoir Protocol. [Get your own API key](https://reservoir.tools/request-api-key). | 123e4567-e89b-12d3-a456-426614174000 |
| POLYGON_RESERVOIR_API_KEY | `false` | Polygon Reservoir API key provided by the Reservoir Protocol. [Get your own API key](https://reservoir.tools/request-api-key). | 123e4567-e89b-12d3-a456-426614174000 |
| NEXT_PUBLIC_ALCHEMY_ID | `true` | Alchemy API key required for removing rate limiting restrictions. [Get your own API key here](https://docs.alchemy.com/alchemy/introduction/getting-started#1.create-an-alchemy-key). | 123e4567-e89b-12d3-a456-426614174000 |
| NEXT_PUBLIC_ETH_COLLECTION_SET_ID | `false` | Use this to configure a community marketplace. This will only impact the mainnet network. Generate your collection set ID [here](https://docs.reservoir.tools/reference/postcollectionssetsv1). | f566ba09c14f56aedeed3f77e3ae7f5ff28b9177714d3827a87b7a182f8f90ff |
| NEXT_PUBLIC_POLYGON_COLLECTION_SET_ID | `false` | Use this to configure a community marketplace. This will only impact the polygon network. Generate your collection set ID [here](https://docs.reservoir.tools/reference/postcollectionssetsv1). | f566ba09c14f56aedeed3f77e3ae7f5ff28b9177714d3827a87b7a182f8f90ff |
| NEXT_PUBLIC_GOERLI_COLLECTION_SET_ID | `false` | Use this to configure a community marketplace. This will only impact the goerli network. Generate your collection set ID [here](https://docs.reservoir.tools/reference/postcollectionssetsv1). | f566ba09c14f56aedeed3f77e3ae7f5ff28b9177714d3827a87b7a182f8f90ff |
| NEXT_PUBLIC_ETH_COMMUNITY | `false` | Use this to configure a community marketplace. Note: Community IDs are only available for certain communities. This will only impact the mainnet network. | artblocks |
| NEXT_PUBLIC_POLYGON_COMMUNITY | `false` | Use this to configure a community marketplace. Note: Community IDs are only available for certain communities. This will only impact the polygon network | artblocks |
| NEXT_PUBLIC_GOERLI_COMMUNITY | `false` | Use this to configure a community marketplace. Note: Community IDs are only available for certain communities. This will only impact the goerli network | artblocks |
| NEXT_PUBLIC_NORMALIZE_ROYALTIES | `false` | Enables royalty normalization. Refer to [docs](https://docs.reservoir.tools/docs/normalized-royalties) for more info. | true/false |
| NEXT_PUBLIC_DATADOG_CLIENT_TOKEN | `false` | Datadog client token for configuring analytics. | pubdaddswww4dad449dadas12ada123bae |
| NEXT_PUBLIC_DATADOG_APPLICATION_ID | `false` | Datadog application id for configuring analytics. | 123cccbb-1234-1111-4411-abc12345612afgds |
| NEXT_PUBLIC_MARKETPLACE_SOURCE | `false` | Marketplace source, used to attribute a source to orders. Must be a valid domain | reservoir.tools |

In addition to the configuration above we've also added comments prefixed with `CONFIGURABLE:` throughout the app pointing out some pieces of code where you could customize functionality. After cloning the app make sure to search the repo for the aforementioned prefix.

### Run the App

Once you have your setup ready, run:

With yarn:

    $ yarn dev

With npm:

    $ npm run dev

### Deploy with Vercel

This is a Next.js app that can be easily deployed using [Vercel](https://vercel.com/). For more information on how to deploy your Github repository with Vercel visit their [docs](https://vercel.com/docs/concepts/projects/overview).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Twitter: [@reservoir0x](https://twitter.com/reservoir0x)
Project Link: [Reservoir](https://reservoirprotocol.github.io/)

<p align="right">(<a href="#top">back to top</a>)</p>
