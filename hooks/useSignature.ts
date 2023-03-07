import {useEffect, useState} from "react";

type Props = {
  id: string
  chain: number
  address: string
}

function useSignature({ id, chain, address } : Props) {
  const [error, setError] = useState();
  const [data, setData] = useState();

  const mutate = () => {
    setError(undefined);
    return fetch( `/api/launchpad/signature?id=${id}&chain=${chain}&address=${address}`)
      .then(res => res.json())
      .then(res => setData(res.result))
      .catch(e => {
        setError(e.message);
      })
  }

  useEffect(() => {
    if (address) {
      mutate();
    }
  }, [address]);

  return {
    data: error ? null : data,
    mutate
  };
}

export default useSignature;
