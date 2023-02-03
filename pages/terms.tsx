import Layout from 'components/Layout'
import { Footer } from 'components/Footer'
import {Box, Flex, Text} from "../components/primitives";

const TermsPage = () => {
  return (
    <Layout>
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <Flex css={{ my: '$6', mb: '$6', gap: 65 }} direction="column">
          <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          >
            <Text style="h2" as="h2">
              Terms of Use
            </Text>
            <strong className='dark:text-white mx-3'>Last updated on January 15, 2023</strong>
          </Flex>

          <Flex css={{ my: '$6', gap: 20 }} direction="column">
            <p>
              {`These Terms of Service govern your use of the website located at nftearth.exchange any related services provided by Layer2DAO., doing business as NFTEarth (“NFTEarth,“ “we,“ “us,“ or “our“).`}
            </p>
            <p>
              {`By accessing nftearth.exchange, you agree to abide by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with these Terms of Service, you are prohibited from using or accessing this website or using any other services provided by NFTEarth.`}
            </p>
            <p>
              {`We, NFTEarth, reserve the right to review and amend any of these Terms of Service at our sole discretion. Upon doing so, we will update this page. Any changes to these Terms of Service will take effect immediately from the date of publication.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">Limitations of Use</h4>
            <p>
              {`By using this website, you warrant on behalf of yourself, your users, and other parties you represent that you will not:`}
            </p>
            <p>
              {`modify, copy, prepare derivative works of, decompile, or reverse engineer any materials and software contained on this website;\n
        remove any copyright or other proprietary notations from any materials and software on this website;\n
        transfer the materials to another person or “mirror” the materials on any other server;\n
        knowingly or negligently use this website or any of its associated services in a way that abuses or disrupts our networks or any other service NFTEarth provides;\n
        use this website or its associated services to transmit or publish any harassing, indecent, obscene, fraudulent, or unlawful material;\n
        use this website or its associated services in violation of any applicable laws or regulations;\n
        use this website in conjunction with sending unauthorized advertising or spam;\n
        harvest, collect, or gather user data without the user’s consent; or\n
        use this website or its associated services in such a way that may infringe the privacy, intellectual property rights, or other rights of third parties.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">Intellectual Property</h4>
            <p>
              {`The intellectual property in the materials contained in this website are owned by or licensed to NFTEarth and are protected by applicable copyright and trademark law. We grant our users permission to download one copy of the materials for personal, non-commercial transitory use.`}
            </p>
            <p>
              {`This constitutes the grant of a license, not a transfer of title. This license shall automatically terminate if you violate any of these restrictions or the Terms of Service, and may be terminated byNFTEarth at any time.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">User-Generated Content</h4>
            <p>
              {`You retain your intellectual property ownership rights over content you submit to us for publication on our website. We will never claim ownership of your content, but we do require a license from you in order to use it.`}
            </p>
            <p>
              {`When you use our website or its associated services to post, upload, share, or otherwise transmit content covered by intellectual property rights, you grant to us a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to use, distribute, modify, run, copy, publicly display, translate, or otherwise create derivative works of your content in a manner that is consistent with your privacy preferences and our Privacy Policy.`}
            </p>
            <p>
              {`The license you grant us can be terminated at any time by deleting your content. However, to the extent that we (or our partners) have used your content in connection with commercial or sponsored content, the license will continue until the relevant commercial or post has been discontinued by us.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">Liability</h4>
            <p>
              {`Our website and the materials on our website are provided on an ‘as is‘ basis. To the extent permitted by law, NFTEarthmakes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property, or other violation of rights.`}
            </p>
            <p>
              {`In no event shall NFTEarth or its suppliers be liable for any consequential loss suffered or incurred by you or any third party arising from the use or inability to use this website or the materials on this website, even if NFTEarth or an authorized representative has been notified, orally or in writing, of the possibility of such damage.`}
            </p>
            <p>
              {`In the context of this agreement, “consequential loss” includes any consequential loss, indirect loss, real or anticipated loss of profit, loss of benefit, loss of revenue, loss of business, loss of goodwill, loss of opportunity, loss of savings, loss of reputation, loss of use and/or loss or corruption of data, whether under statute, contract, equity, tort (including negligence), indemnity, or otherwise.`}
            </p>
            <p>
              {`Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">Accuracy of Materials</h4>
            <p>
              {`The materials appearing on our website are not comprehensive and are for general information purposes only. NFTEarth does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on this website, or otherwise relating to such materials or on any resources linked to this website.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">Links</h4>
            <p>
              {`NFTEarth has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement, approval, or control by NFTEarth of the site. Use of any such linked site is at your own risk and we strongly advise you make your own investigations with respect to the suitability of those sites.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">Right to Terminate</h4>
            <p>
              {`We may suspend or terminate your right to use our website and terminate these Terms of Service immediately upon written notice to you for any breach of these Terms of Service.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">Severance</h4>
            <p>
              {`Any term of these Terms of Service which is wholly or partially void or unenforceable is severed to the extent that it is void or unenforceable. The validity of the remainder of these Terms of Service is not affected.`}
            </p>

            <h4 className="reservoir-h4 pb-3 pt-6">Governing Law</h4>
            <p>
              {`These Terms of Service are governed by and construed in accordance with the laws of California. You irrevocably submit to the exclusive jurisdiction of the courts in that State or location.`}
            </p>
          </Flex>
        </Flex>
        <Footer />
      </Box>
    </Layout>
  )
}

export default TermsPage