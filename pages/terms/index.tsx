import { useEffect, useState } from 'react';
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import type { NextPage } from 'next'
import ReactMarkdown from 'react-markdown';

const Terms: NextPage = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    try {
      fetch("/markdown/terms.md")
        .then((res) => res.text())
        .then((text) => setContent(text))
    } catch (err) {
      console.error(err)
    }
  }, []);

  return (
    <Layout>
      <Flex
        direction="column"
        align="center"
        css={{ py: '200px', px: '$3', textAlign: 'center' }}
      >
        <Box css={{ color: '$gray11', mb: '30px' }}>
          <FontAwesomeIcon icon={faFolderOpen} size="2xl" />
        </Box>
        <Text style="body1" color="subtle" css={{ mb: '$1' }}>
        Terms
        </Text>
        <Text style="body1" color="subtle">
        <ReactMarkdown className="markdown-support" linkTarget="_blank">
          {content}
        </ReactMarkdown>
        </Text>
      </Flex>
    </Layout>
  )
}

export default Terms