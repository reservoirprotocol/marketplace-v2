import { NextRouter } from 'next/router'

/**
   * Adds a param to the URL string. Multiple params with the same name
   * and different values can be added.
   * @param router Next router
   * @param name The name of the param.
   * @param value The value of the param.
   */
 const addParam = (router: NextRouter, name: string, value: string ) => {
  const { [name]: param, ...rest } = router.query;

  let newQuery;
  if (!param) {
    newQuery = { ...rest, [name]: value };
  } else if (Array.isArray(param)) {
    if (param.indexOf(encodeURIComponent(value)) > -1) return;
    newQuery = { ...rest, [name]: [...param, (value)] };
  } else {
    if (param === encodeURIComponent(value)) return;
    newQuery = { ...rest, [name]: [param, (value)] };
  }

  router.push(
    {
      query: newQuery,
    },
    undefined,
    { shallow: true }
  );
};

/**
   * Removes the provided params with a specific value from the URL.
   * @param router Next router
   * @param name The name of the param.
   * @param value The value of the param.
   */
 const removeParam = (
  router: NextRouter,
  name: string,
  value?: string | number | boolean | string[] | number[] | boolean[]
) => {
  const { [name]: param, ...rest } = router.query;

  if (!param) {
    return;
  }

  let newQuery;
  if (value && Array.isArray(param) && !Array.isArray(value)) {
    newQuery = {
      ...rest,
      [name]: param.filter(
        (element) => element !== (value)
      ),
    };
  } else {
    newQuery = { ...rest };
  }

  router.push(
    {
      query: newQuery,
    },
    undefined,
    { shallow: true }
  );
};

  /**
   * Checks whether a param is exposed in the URL string or not.
   * @param router Next router
   * @param name The name of the param.
   * @param value Optional, the param must have the specified value.
   * @returns true/false depending on the presence of the param.
   */
   const hasParam = (router: NextRouter, name: string, value?: string | number | boolean) => {
    const { [name]: param } = router.query;
    if (!value) {
      return !!param;
    }
    if (!param) {
      return false;
    } else if (Array.isArray(param)) {
      return param.indexOf((value).toString()) > -1;
    } else {
      return param === (value);
    }
  };


/**
   * Deletes all 'attribute' params from the URL string
  */
function clearAllAttributes(router: NextRouter) {
  Object.keys(router.query).find((key) => {
    if (
      key.startsWith('attributes[') &&
      key.endsWith(']') &&
      router.query[key] !== ''
    ) {
      delete router.query[key]
    }
  })

  router.push(
    {
      query: { ...router.query },
    },
    undefined,
    {
      shallow: true,
    }
  )
}


export { addParam, removeParam, hasParam, clearAllAttributes }
