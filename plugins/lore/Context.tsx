import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type Context = {
  squadId: string;
  token: string;
}

export const LoreContext = createContext<Context>({
  squadId: '',
  token: '',
});

type Props = {
  children: ReactNode;
}

export const Provider = ({children}: Props) => {
  const [values, setValues] = useLocalStorage<Context>("lore", {
    squadId: '',
    token: '',
  });
  const router = useRouter();
  useEffect(() => {
    if (router.query.squadId && router.query.token) {
      setValues({
        squadId: router.query.squadId as string,
        token: router.query.token as string,
      })
    }
  }, [router.query]);

  if (!values.token || !values.squadId) {
    return null
  }
  
  return (
    <LoreContext.Provider value={values}>
      {children}
    </LoreContext.Provider>
  )
} 
