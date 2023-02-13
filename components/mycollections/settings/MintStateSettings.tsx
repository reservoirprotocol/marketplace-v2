import { useState, useEffect, FC, SyntheticEvent } from 'react'
import { Text, Flex, Box, Input, Button, TextArea, Select } from 'components/primitives'
import { StyledInput } from "components/primitives/Input";

type Props = {
  activeTab: string | null
}

const MintStateSettings:FC<Props> = ({ activeTab }) => {
  
  const resetState = () => {
   
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // TODO: Fetch to API
  }

  useEffect(() => {
    if (activeTab !== 'royalities') resetState();
  }, [activeTab])

  return (
    <Box
      css={{
        width: '100%',
        '@md': {
          marginLeft: 4,
          width: '60%'
        },
        '@lg': {
          marginLeft: 4,
          width: '50%'
        }
      }}>
      <Box 
        css={{ 
          marginBottom: 18
        }}>
        <Text style='h4'>
          Mint State Settings
        </Text>
      </Box>
      <Box css={{ marginBottom: 32 }}>
        
      </Box>
    </Box>
  )
}

export default MintStateSettings