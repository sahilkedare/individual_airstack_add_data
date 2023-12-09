import { useQuery } from "@airstack/airstack-react";

const GET_VITALIK_LENS_FARCASTER_ENS = `
query MyQuery {
  Wallet(input: {identity: "vitalik.eth", blockchain: ethereum}) {
    socials {
      dappName
      profileName
    }
    addresses
  }
}
`;

const Component = () => {

  const address = `["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]`;
  const eth_address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

  const XMTP_QUERY = `
    query BulkFetchPrimaryENSandXMTP {
        XMTPs(input: {blockchain: ALL, filter: {owner: {_in: ${address}}}}) {
        XMTP {
            isXMTPEnabled
            owner {
            addresses
            primaryDomain {
                name
            }
            }
        }
        }
    }
    `;

  const LENS_QUERY = `
    query GetAllSocials {
        Socials(
        input: {filter: {userAssociatedAddresses: {_eq: "0xd27a8a44a2Ab3507C0949dFAf58bd9CF599E1D52"}, dappName: {_eq: lens}}, blockchain: ethereum}
        ) {
        Social {
            blockchain
            dappName
            profileName
            userAssociatedAddresses
            followerCount
        }
        }
    }
    `;

  const FARCASTER_QUERY = `
    query GetAllSocials {
        Socials(
        input: {filter: {userAssociatedAddresses: {_eq: "0xB59Aa5Bb9270d44be3fA9b6D67520a2d28CF80AB"}, dappName: {_eq: farcaster}}, blockchain: ethereum}
        ) {
        Social {
            blockchain
            dappName
            profileName
            userAssociatedAddresses
            followerCount
        }
        }
    }
    `;

    

  const TOKEN_QUERY = ` 
query tokens {
    erc20: TokenBalances(
      input: {filter: {owner: {_in: ${address}}, tokenType: {_in: [ERC20]}}, limit: 10, blockchain: ethereum}
    ) {
      data:TokenBalance {
        amount
        formattedAmount
        chainId
        id
        tokenAddress
        tokenId
        tokenType
        token {
          name
          symbol
        }
      }
    }
erc1155: TokenBalances(
    input: {filter: {owner: {_in: ${address}}, tokenType: {_in: [ERC721]}, tokenAddress: {_nin: ["0x22C1f6050E56d2876009903609a2cC3fEf83B415"]}}, limit: 10, blockchain: ethereum}
  ) {
    data:TokenBalance {
      amount
      formattedAmount
      id
      tokenAddress
      tokenType
      token {
        name
        symbol
      }
      tokenNfts {
        tokenId
        metaData {
          name
        }
        contentValue {
          image {
            medium
          }
        }
      }
    }
  }
erc6551: TokenBalances(
    input: {filter: {owner: {_in: ${address}}, tokenType: {_in: [ERC721]}, tokenAddress: {_nin: ["0x22C1f6050E56d2876009903609a2cC3fEf83B415"]}}, limit: 10, blockchain: ethereum}
  ) {
    data:TokenBalance {
      amount
      formattedAmount
      id
      tokenAddress
      tokenType
      token {
        name
        symbol
      }
      tokenNfts {
        tokenId
        metaData {
          name
        }
        contentValue {
          image {
            medium
          }
        }
      }
    }
  }
    erc721: TokenBalances(
      input: {filter: {owner:  {_in: ${address}}, tokenType: {_in: [ERC721]}, tokenAddress: {_nin: ["0x22C1f6050E56d2876009903609a2cC3fEf83B415"]}}, limit: 10, blockchain: ethereum}
    ) {
      data:TokenBalance {
        amount
        formattedAmount
        id
        tokenAddress
        tokenType
        token {
          name
          symbol
        }
        tokenNfts {
          tokenId
          metaData {
            name
          }
          contentValue {
            image {
              medium
            }
          }
        }
      }
    }

    poap: TokenBalances(
        input: {filter: {owner:  {_in: ${address}}}, limit: 10, blockchain: ethereum}
      ) {
      data:TokenBalance {
        amount
        id
        tokenAddress
        tokenType
        formattedAmount
        token {
          name
          symbol
        }
        tokenNfts {
          metaData {
            name
          }
          tokenURI
        }
      }
    }
  }`;


  const { data, loading, error } = useQuery(TOKEN_QUERY, { cache: false });

  const { data: xmtp_data, loading: xmtp_loading, error: xmtp_error } = useQuery(XMTP_QUERY, { cache: false });

  const { data: lens_data, loading: lens_loading, error: lens_error } = useQuery(LENS_QUERY, { cache: false });

  const { data: farcaster_data, loading: farcaster_loading, error: farcaster_error } = useQuery(FARCASTER_QUERY, { cache: false });


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const submit = () => {
    console.log(data, "nft_dataa");
    console.log(xmtp_data, "xmtp_dataa");
    console.log(lens_data, "lens_dataa");
    console.log(farcaster_data, "farcaster_dataa");

    let totatScore = 0; 

    // check if xmtp enabled
    const isXMTPEnabled = data.XMTPs?.XMTP[0].isXMTPEnabled;

    // check lens follower
    const lensFollowers = data.Socials?.Social[0].followerCount;

    // check farcaster follower
    const FarcasterFollowers = data.Socials?.Social[0].followerCount;

    // check token data
    const erc20 = data.erc20.data.reduce((sum, item) => sum + item.formattedAmount, 0);

    const erc1155 = data.erc1155.data.reduce((sum, item) => sum + parseInt(item.formattedAmount), 0);

    const erc721 = data.erc721.data.reduce((sum, item) => sum + parseInt(item.formattedAmount), 0);

    const erc6551 = data.erc6551.data.reduce((sum, item) => sum + parseInt(item.formattedAmount), 0);

    const poap = data.poap.data.reduce((sum, item) => sum + parseFloat(item.amount), 0); 

    if(isXMTPEnabled) {
      totatScore+=1;
    }
    totatScore = lensFollowers+ FarcasterFollowers+ erc20+ erc721+ erc1155+erc6551 +poap;
    totatScore = totatScore/8;
   
  }

  return (
    <div>
      <button onClick={submit}>GET DATA</button>
    </div>
  )

  // console.log(data, "dataa");

  // if (xmtp_loading) {
  //   return <p>Loading...</p>;
  // }

  // if (xmtp_error) {
  //   return <p>Error: {error.message}</p>;
  // }

  // console.log(xmtp_data, "xmtp_dataa");

  // if (lens_loading) {
  //   return <p>Loading...</p>;
  // }

  // if (lens_error) {
  //   return <p>Error: {error.message}</p>;
  // }

  // console.log(lens_data, "dataa");

  // if (farcaster_loading) {
  //   return <p>Loading...</p>;
  // }

  // if (farcaster_error) {
  //   return <p>Error: {error.message}</p>;
  // }

  // Render your component using the data returned by the query
  // console.log(farcaster_data, "dataa");
  
};

export default Component;