import { NextRouter } from 'next/router'

function toggleOnItem(router: NextRouter, item: string, value: string) {
  router.push(
    {
      query: { ...router.query, [`${item}`]: value },
    },
    undefined,
    {
      shallow: true,
    }
  )
}

function toggleOffItem(router: NextRouter, item: string) {
  let query = router.query

  delete query[`${item}`]

  router.push(
    {
      query,
    },
    undefined,
    {
      shallow: true,
    }
  )
}


function toggleOnAttributeKey(router: NextRouter, item: string, value: string) {
  let query = router.query

  // Delete all attribute filters
  Object.keys(query).find((key) => {
    if (
      key.startsWith('attributes[') &&
      key.endsWith(']') &&
      query[key] !== ''
    ) {
      delete query[key]
    }
  })

  router.push(
    {
      query: { ...router.query, [`${item}`]: value },
    },
    undefined,
    {
      shallow: true,
    }
  )
}

function toggleOnAttribute(
  router: NextRouter,
  attribute: string,
  value: string
) {
  router.push(
    {
      query: { ...router.query, [`attributes[${attribute}]`]: value },
    },
    undefined,
    {
      shallow: true,
      scroll: false,
    }
  )
}

function toggleOffAttribute(router: NextRouter, attribute: string) {
  let query = router.query

  delete query[`attributes[${attribute}]`]

  router.push(
    {
      query,
    },
    undefined,
    {
      shallow: true,
      scroll: false,
    }
  )
} 

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


/**
   * Adds a query param to the URL string. Multiple params with the same name
   * and different values can be added.
   * @param name The name of the param.
   * @param value The value of the param.
   */
 const addParam = (router: NextRouter, name: string, value: string | boolean | number) => {
  const { [name]: param, ...rest } = router.query;

  let newQuery;
  if (!param) {
    newQuery = { ...rest, [name]: encodeURIComponent(value) };
  } else if (Array.isArray(param)) {
    if (param.indexOf(encodeURIComponent(value)) > -1) return;
    newQuery = { ...rest, [name]: [...param, encodeURIComponent(value)] };
  } else {
    if (param === encodeURIComponent(value)) return;
    newQuery = { ...rest, [name]: [param, encodeURIComponent(value)] };
  }

  // router.reload()
  router.push(
    {
      // router.pathname,
      query: newQuery,
    },
    undefined,
    { shallow: true }
  );
};


export { toggleOffItem, toggleOnItem, toggleOnAttributeKey, toggleOffAttribute, toggleOnAttribute, clearAllAttributes, addParam }
