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

export { toggleOffItem, toggleOnItem, toggleOnAttributeKey, toggleOffAttribute, toggleOnAttribute, clearAllAttributes }
