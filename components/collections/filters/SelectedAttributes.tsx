import { toggleOffAttribute, clearAllAttributes } from 'utils/router'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { Button, Flex, Text } from 'components/primitives'

type Attribute = {
  key: string
  value: string
}[]

const SelectedAttributes: FC = () => {
  const router = useRouter()

  const [filters, setFilters] = useState<Attribute>([])

  useEffect(() => {
    let filters = Object.keys({ ...router.query }).filter(
      (key) =>
        key.startsWith('attributes[') &&
        key.endsWith(']') &&
        router.query[key] !== ''
    )

    console.log(filters)

    setFilters(
      // Convert the queries into the tokens format
      filters.map((key) => {
        return {
          key: key.slice(11, -1),
          value: `${router.query[key]}`,
        }
      })
    )
  }, [router.query])

  console.log(filters)

  if (filters.length === 0) return null

  return (
    <Flex css={{ mb: '24px' }}>
      {filters.map(({ key, value }) => (
        <Button
          key={key}
          onClick={() => toggleOffAttribute(router, key)}
          color="gray4"
          css={{ mr: '$4' }}
        >
          <Text css={{ color: '$primary11' }}>{key}:</Text>
          <Text style="subtitle1">{value}</Text>
        </Button>
      ))}

      {filters.length > 1 && (
        <Button
          onClick={() => clearAllAttributes(router)}
          color="ghost"
          css={{ color: '$primary11', fontWeight: 500 }}
        >
          Clear all
        </Button>
      )}
    </Flex>
  )
}

export default SelectedAttributes
