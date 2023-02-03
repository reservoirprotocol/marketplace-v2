import Layout from 'components/Layout'
import { Footer } from 'components/Footer'
import {Box, Flex, Text} from "../components/primitives";

const PrivacyPage = () => {
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
              Privacy Policy
            </Text>
            <strong className='dark:text-white mx-3'>Last updated on January 15, 2023</strong>
          </Flex>

          <Flex css={{ my: '$6', gap: 20 }} direction="column">
            {`Thank you for being part of our community at Layer2NFTs, doing business as NFTEarth (“NFTEarth,“ “we,“ “us,“ or “our“). Your privacy is important to us. It is NFTEarth's policy to respect your privacy and comply with any applicable law and regulation regarding any personal information we may collect about you, including across our website, qx.app, and other sites we own and operate.`}
            <br/><br/>
            {`Personal information is any information about you which can be used to identify you. This includes information about you as a person (such as name, address, and date of birth), your devices, payment details, and even information about how you use a website or online service.`}
            <br/><br/>
            {`In the event our site contains links to third-party sites and services, please be aware that those sites and services have their own privacy policies. After following a link to any third-party content, you should read their posted privacy policy information about how they collect and use personal information. This Privacy Policy does not apply to any of your activities after you leave our site.`}
            <br/><br/>
            {`This policy is effective as of 15 January 2023.`}

            <h4 className="reservoir-h4 pb-3 pt-6">Information We Collect</h4>
            {`Information we collect includes both information you knowingly and actively provide us when using or participating in any of our services and promotions, and any information automatically sent by your devices in the course of accessing our products and services.`}

            <h5 className="reservoir-h5 pb-3 pt-6">Log Data</h5>
            {`When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your device’s Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details about your visit.`}
            <br/><br/>
            {`Additionally, if you encounter certain errors while using the site, we may automatically collect data about the error and the circumstances surrounding its occurrence. This data may include technical details about your device, what you were trying to do when the error happened, and other technical information relating to the problem. You may or may not receive notice of such errors, even in the moment they occur, that they have occurred, or what the nature of the error is.`}
            <br/><br/>
            {`Please be aware that while this information may not be personally identifying by itself, it may be possible to combine it with other data to personally identify individual persons.`}

            <h5 className="reservoir-h5 pb-3 pt-6">Device Data</h5>
            {`When you visit our website or interact with our services, we may automatically collect data about your device, such as:`}
            <br/><br/>
            <ul>
              <li>Device Type</li>
              <li>Operating System</li>
              <li>Geo-location data</li>
            </ul>
            <br/>
            {`Data we collect can depend on the individual settings of your device and software. We recommend checking the policies of your device manufacturer or software provider to learn what information they make available to us.`}

            <h5 className="reservoir-h5 pb-3 pt-6">Personal Information</h5>
            {`We may ask for personal information which may include one or more of the following:`}
            <br/><br/>
            <ul>
              <li>Email</li>
              <li>Social media profiles</li>
            </ul>
            <h5 className="reservoir-h5 pb-3 pt-6">User-Generated Content</h5>
            {`We consider “user-generated content” to be materials voluntarily supplied to us by our users for the purpose of publication on our website and/or social media channels. All user-generated content is associated with the account or email address used to submit the materials.`}
            <br/><br/>
            {`Please be aware that any content you submit for the purpose of publication will be public after posting (and subsequent review or vetting process). Once published, it may be accessible to third parties not covered under this privacy policy.`}
            <br/><br/>
            <h5 className="reservoir-h5 pb-3 pt-6">Legitimate Reasons for Processing Your Personal Information</h5>
            {`We only collect and use your personal information when we have a legitimate reason for doing so. In which instance, we only collect personal information that is reasonably necessary to provide our services to you.`}

            <h5 className="reservoir-h5 pb-3 pt-6">Collection and Use of Information</h5>
            {`We may collect personal information from you when you do any of the following on our website:`}
            <br/><br/>
            <ul>
              <li>Sign up to receive updates from us via email or social media channels</li>
              <li>Use a mobile device or web browser to access our content</li>
              <li>Contact us via email, social media, or on any similar technologies</li>
              <li>When you mention us on social media</li>
            </ul>
            {`We may collect, hold, use, and disclose information for the following purposes, and personal information will not be further processed in a manner that is incompatible with these purposes:`}
            <br/><br/>
            <ul>
              <li>{`to provide you with our platform‘s core features and services`}</li>
              <li>{`to enable you to customize or personalize your experience of our website`}</li>
              <li>{`to contact and communicate with you`}</li>
            </ul>
            {`Please be aware that we may combine information we collect about you with general information or research data we receive from other trusted sources.`}

            <h5 className="reservoir-h5 pb-3 pt-6">Security of Your Personal Information</h5>
            {`When we collect and process personal information, and while we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.`}
            <br/><br/>
            {`Although we will do our best to protect the personal information you provide to us, we advise that no method of electronic transmission or storage is 100% secure, and no one can guarantee absolute data security. We will comply with laws applicable to us in respect of any data breach.`}
            <br/><br/>
            {`You are responsible for selecting any password and its overall security strength, ensuring the security of your own information within the bounds of our services.`}

            <h5 className="reservoir-h5 pb-3 pt-6">How Long We Keep Your Personal Information</h5>
            {`We keep your personal information only for as long as we need to. This time period may depend on what we are using your information for, in accordance with this privacy policy. If your personal information is no longer required, we will delete it or make it anonymous by removing all details that identify you.`}
            <br/><br/>
            {`However, if necessary, we may retain your personal information for our compliance with a legal, accounting, or reporting obligation or for archiving purposes in the public interest, scientific, or historical research purposes or statistical purposes.`}

            <h4 className="reservoir-h4 pb-3 pt-6">{`Children’s Privacy`}</h4>
            {`We do not aim any of our products or services directly at children under the age of 13, and we do not knowingly collect personal information about children under 13.`}

            <h4 className="reservoir-h4 pb-3 pt-6">Disclosure of Personal Information to Third Parties</h4>
            {`We may disclose personal information to:`}
            <br/><br/>
            <ul>
              <li>a parent, subsidiary, or affiliate of our company</li>
              <li>third party service providers for the purpose of enabling them to provide their services, for example, IT service providers, data storage, hosting and server providers, advertisers, or analytics platforms</li>
              <li>our employees, contractors, and/or related entities</li>
              <li>our existing or potential agents or business partners</li>
              <li>courts, tribunals, regulatory authorities, and law enforcement officers, as required by law, in connection with any actual or prospective legal proceedings, or in order to establish, exercise, or defend our legal rights</li>
              <li>third parties, including agents or sub-contractors, who assist us in providing information, products, services, or direct marketing to you</li>
              <li>third parties to collect and process data</li>
            </ul>

            <h4 className="reservoir-h4 pb-3 pt-6">Your Rights and Controlling Your Personal Information</h4>
            {`You always retain the right to withhold personal information from us, with the understanding that your experience of our website may be affected. We will not discriminate against you for exercising any of your rights over your personal information. If you do provide us with personal information you understand that we will collect, hold, use and disclose it in accordance with this privacy policy. You retain the right to request details of any personal information we hold about you.`}
            <br/><br/>
            {`If we receive personal information about you from a third party, we will protect it as set out in this privacy policy. If you are a third party providing personal information about somebody else, you represent and warrant that you have such person’s consent to provide the personal information to us.`}
            <br/><br/>
            {`If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time. We will provide you with the ability to unsubscribe from our email-database or opt out of communications. Please be aware we may need to request specific information from you to help us confirm your identity.`}
            <br/><br/>
            {`If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant, or misleading, please contact us using the details provided in this privacy policy. We will take reasonable steps to correct any information found to be inaccurate, incomplete, misleading, or out of date.`}
            <br/><br/>
            {`If you believe that we have breached a relevant data protection law and wish to make a complaint, please contact us using the details below and provide us with full details of the alleged breach. We will promptly investigate your complaint and respond to you, in writing, setting out the outcome of our investigation and the steps we will take to deal with your complaint. You also have the right to contact a regulatory body or data protection authority in relation to your complaint.`}

            <h4 className="reservoir-h4 pb-3 pt-6">Use of Cookies</h4>
            {`We use “cookies” to collect information about you and your activity across our site. A cookie is a small piece of data that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site. This helps us serve you content based on preferences you have specified.`}
            <br/><br/>
            {`Please refer to our Cookie Policy for more information.`}

            <h4 className="reservoir-h4 pb-3 pt-6">Limits of Our Policy</h4>
            {`Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices.`}

            <h4 className="reservoir-h4 pb-3 pt-6">Changes to This Policy</h4>
            {`At our discretion, we may change our privacy policy to reflect updates to our business processes, current acceptable practices, or legislative or regulatory changes. If we decide to change this privacy policy, we will post the changes here at the same link by which you are accessing this privacy policy.`}
            <br/><br/>
            {`If required by law, we will get your permission or give you the opportunity to opt in to or opt out of, as applicable, any new uses of your personal information.`}

            <h4 className="reservoir-h4 pb-3 pt-6">Contact Us</h4>
            <p>
              {`For any questions or concerns regarding your privacy, you may contact us using the following details:`}
            </p>
            <br/>
            <p>
              NFTEarth<br/>
              <a href="https://twitter.com/NFTEarth_L2" target="_blank" rel="noreferrer noopener">@NFTEarth_L2</a>
            </p>
          </Flex>
        </Flex>
        <Footer />
      </Box>
    </Layout>
  )
}

export default PrivacyPage