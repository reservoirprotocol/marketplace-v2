import { useState, FC } from 'react'
import { styled, CSS } from "@stitches/react";
import * as Radix from "@radix-ui/react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

const Wrapper = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%"
});

const SelTrigger = styled("button", {
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  boxSizing: "border-box",
  padding: 16,
  fontSize: 16,
  border: '1px solid $gray8',
  borderRadius: 8,
  outline: "none",
});

const Dropdown = styled(Radix.Content, {
  position: "relative",
  boxSizing: "border-box",
  padding: "16px 8px",
  fontSize: 16,
  background: "$gray2",
  borderRadius: 8,
  pointerEvents: "all",
  zIndex: 99,
  marginTop: 6,
});

const Viewport = styled(Radix.Viewport, {
  display: "flex",
  flexDirection: "column",
  rowGap: 8,
});

const Item = styled(Radix.Item, {
  padding: "8px",
  outline: "none",
  transition: "background ease 300ms",
  borderBottom: '1px solid $gray5',
  '&:last-child': {
    borderBottom: 'none',
  },
  "&:focus": {
    background: "$primary10",
    color: 'black'
  }
});

type optionType = {
  label: string,
  value: string
}

type SelectProps = {
  options: optionType[],
  placeholder?: string,
  value: string | undefined,
  onChange: (val: string) => void,
  containerCss?: CSS
}

const Select: FC<SelectProps> = ({ options, placeholder, value, onChange, containerCss }) => {
  const [toggled, setToggled] = useState("closed");

  return (
    <Wrapper css={{ ...containerCss }}>
      <Radix.Root
        dir="ltr"
        value={value}
        onValueChange={onChange}
        onOpenChange={(e) => setToggled(e === true ? "open" : "closed")}>
        <Radix.Trigger asChild data-state={toggled}>
          <SelTrigger>
            <span>
              <Radix.Value placeholder={placeholder} />
            </span>
            <Radix.Icon asChild>
            <FontAwesomeIcon
              icon={faChevronDown}
              width={16}
              height={16}
            />
            </Radix.Icon>
          </SelTrigger>
        </Radix.Trigger>
        <Radix.Portal>
          <Dropdown>
            <Radix.ScrollUpButton>
              <FontAwesomeIcon
                icon={faChevronUp}
                width={16}
                height={16}
              />
            </Radix.ScrollUpButton>
            <Viewport>
              {options.map((opt, i) => (
                <Item key={i} value={opt.value}>
                  <Radix.ItemText>{opt.label}</Radix.ItemText>
                </Item>
              ))}
            </Viewport>
            <Radix.ScrollDownButton>
              <FontAwesomeIcon
                icon={faChevronDown}
                width={16}
                height={16}
              />
            </Radix.ScrollDownButton>
          </Dropdown>
        </Radix.Portal>
      </Radix.Root>
    </Wrapper>
  )
}

export default Select;
