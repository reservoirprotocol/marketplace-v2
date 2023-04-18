import { Flex, Switch, Text } from 'components/primitives'
import { FC } from 'react'

type Props = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const OnlyUserOrdersToggle: FC<Props> = ({
  checked,
  onCheckedChange,
}) => {
  return (
    <Flex
      align="center"
      justify="between"
      css={{
        width: '100%',
        backgroundColor: '$gray2',
        borderRadius: 4,
        py: '$3',
        px: '$4',
        gap: '$3',
      }}
    >
      <Text style="subtitle2" color="subtle">
        Only Mine
      </Text>
      <Switch
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked)}
      />
    </Flex>
  )
}
