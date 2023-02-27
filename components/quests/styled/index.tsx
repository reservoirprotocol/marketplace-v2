import { styled } from "@stitches/react";
import { Box, Button, Text } from "components/primitives";

export const QuestFooter = styled(Box, {
    width: '100%',
    height: '48px',
    display: 'flex',
    justifyContent: 'between',
})

export const QuestContent = styled(Box, {
    marginTop: '18px',
    marginBottom: '24px',
    lineHeight: '21px',
    height: '150px',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    overflow: 'hidden',
})

export const QuestGridheaderText = styled(Text, {
   marginBottom: '15px',
   marginLeft: '5px'
})

export const QuestXPButton = styled(Box, {
    background: '$gray6',
    border: '2px solid #6BE481',
    borderRadius: '10px',
    padding: '10px 30px',
})

export const QuestJoinButton = styled(Box, {
    background: '#6BE481',
    borderRadius: '10px',
    padding: '10px 30px',
    transition: '0.5s',
    '&:hover': {
        opacity: '0.6',
    }
})