"use client"
import { Box, Typography, Button } from "@mui/material";
import BackButton from "@/components/common/BackButton/BackButton";

const privacyPolicyContent = {
  heading: "Privacy Policy",
  lastUpdated: "Last updated: October 17, 2025",
  sections: [
    {
      title: null,
      description:
        "This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.",
    },

    // Interpretation and Definitions
    {
      title: "Interpretation and Definitions",
      variant: "h3",
      color: "#189e33ff",
    },
    {
      title: "Interpretation",
      variant: "h6",
      color: "#00305B",
      description:
        "The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.",
    },
    {
      title: "Definitions",
      variant: "h6",
      color: "#00305B",
      description: "For the purposes of this Privacy Policy:",
    },

    // Definitions list (each as its own entry for rendering)
    {
      title: "Account",
      variant: "h6",
      color: "#00305B",
      description:
        '"Account" means a unique account created for You to access our Service or parts of our Service.',
    },
    {
      title: "Affiliate",
      variant: "h6",
      color: "#00305B",
      description:
        'Affiliate means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
    },
    {
      title: "Application",
      variant: "h6",
      color: "#00305B",
      description:
        '"Application" refers to Unswayed, the software program provided by the Company.',
    },
    {
      title: "Business (CCPA/CPRA)",
      variant: "h6",
      color: "#00305B",
      description:
        '"Business," for the purpose of CCPA/CPRA, refers to the Company as the legal entity that collects consumers\' personal information and determines the purposes and means of processing consumers\' personal information, or on behalf of which such information is collected and that alone, or jointly with others, determines the purposes and means of the processing of consumers\' personal information, that does business in the State of California.',
    },
    {
      title: "CCPA / CPRA",
      variant: "h6",
      color: "#00305B",
      description:
        '"CCPA" and/or "CPRA" refers to the California Consumer Privacy Act (the "CCPA") as amended by the California Privacy Rights Act of 2020 (the "CPRA").',
    },
    {
      title: "Company",
      variant: "h6",
      color: "#00305B",
      description:
        '"Company" (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Ralli Technologies LLC, 6824 19th ST W PMB 468. For the purpose of the GDPR, the Company is the Data Controller.',
    },
    {
      title: "Consumer (CCPA)",
      variant: "h6",
      color: "#00305B",
      description:
        '"Consumer," for the purpose of the CCPA/CPRA, means a natural person who is a California resident. A resident, as defined in the law, includes (1) every individual who is in the USA for other than a temporary or transitory purpose, and (2) every individual who is domiciled in the USA who is outside the USA for a temporary or transitory purpose.',
    },
    {
      title: "Cookies",
      variant: "h6",
      color: "#00305B",
      description:
        "Cookies are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
    },
    {
      title: "Country",
      variant: "h6",
      color: "#00305B",
      description: "Country refers to: Washington, United States.",
    },
    {
      title: "Data Controller (GDPR)",
      variant: "h6",
      color: "#00305B",
      description:
        "For the purposes of the GDPR, the Company is the Data Controller: the legal person which alone or jointly with others determines the purposes and means of the processing of Personal Data.",
    },
    {
      title: "Device",
      variant: "h6",
      color: "#00305B",
      description:
        "Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
    },
    {
      title: "Do Not Track (DNT)",
      variant: "h6",
      color: "#00305B",
      description:
        "Do Not Track (DNT) is a concept that has been promoted by US regulatory authorities, in particular the U.S. Federal Trade Commission (FTC), for the Internet industry to develop and implement a mechanism for allowing internet users to control the tracking of their online activities across websites.",
    },
    {
      title: "GDPR",
      variant: "h6",
      color: "#00305B",
      description: "GDPR refers to EU General Data Protection Regulation.",
    },
    {
      title: "Personal Data",
      variant: "h6",
      color: "#00305B",
      description:
        "Personal Data is any information that relates to an identified or identifiable individual. For the purposes of GDPR, Personal Data means any information relating to You such as a name, an identification number, location data, online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity.",
    },
    {
      title: "Service",
      variant: "h6",
      color: "#00305B",
      description: "Service refers to the Application or the Website or both.",
    },
    {
      title: "Service Provider",
      variant: "h6",
      color: "#00305B",
      description:
        "Service Provider means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used. For the purpose of the GDPR, Service Providers are considered Data Processors.",
    },
    {
      title: "Third-party Social Media Service",
      variant: "h6",
      color: "#00305B",
      description:
        "Third-party Social Media Service refers to any website or any social network website through which a User can log in or create an account to use the Service.",
    },
    {
      title: "Usage Data",
      variant: "h6",
      color: "#00305B",
      description:
        "Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).",
    },
    {
      title: "Website",
      variant: "h6",
      color: "#00305B",
      description: 'Website refers to Ralli Technologies, accessible from https://www.rallitechnologies.com/',
    },
    {
      title: "You",
      variant: "h6",
      color: "#00305B",
      description:
        "You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable. Under GDPR, You can be referred to as the Data Subject or as the User as you are the individual using the Service.",
    },

    // Collecting and Using Your Personal Data
    {
      title: "Collecting and Using Your Personal Data",
      variant: "h3",
      color: "#189e33ff",
    },
    {
      title: "Types of Data Collected",
      variant: "h6",
      color: "#00305B",
      description:
        "Personal Data: While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to: Email address; First name and last name; Phone number; Address, State, Province, ZIP/Postal code, City.",
    },
    {
      title: "Usage Data",
      variant: "h6",
      color: "#00305B",
      description:
        "Usage Data is collected automatically when using the Service. Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data. When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data. We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.",
    },
    {
      title: "Information from Third-Party Social Media Services",
      variant: "h6",
      color: "#00305B",
      description:
        "The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services: Google; Facebook; Instagram; Twitter; LinkedIn. If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service's account, such as Your name, Your email address, Your activities or Your contact list associated with that account. You may also have the option of sharing additional information with the Company through Your Third-Party Social Media Service's account. If You choose to provide such information and Personal Data, during registration or otherwise, You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy.",
    },

    // Tracking Technologies and Cookies
    {
      title: "Tracking Technologies and Cookies",
      variant: "h6",
      color: "#00305B",
      description:
        "We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include: Cookies or Browser Cookies; Web Beacons. Cookies can be 'Persistent' or 'Session' Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.",
    },
    {
      title: "Cookies We Use & Purposes",
      variant: "h6",
      color: "#00305B",
      description:
        "We use both Session and Persistent Cookies for the purposes set out below: \n\nNecessary / Essential Cookies — Type: Session Cookies — Administered by: Us — Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services. \n\nCookies Policy / Notice Acceptance Cookies — Type: Persistent Cookies — Administered by: Us — Purpose: These Cookies identify if users have accepted the use of cookies on the Website. \n\nFunctionality Cookies — Type: Persistent Cookies — Administered by: Us — Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.",
    },

    // Use of Your Personal Data
    {
      title: "Use of Your Personal Data",
      variant: "h6",
      color: "#00305B",
      description:
        "The Company may use Personal Data for the following purposes: To provide and maintain our Service, including to monitor the usage of our Service. To manage Your Account: to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user. For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service. To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation. To provide You with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information. To manage Your requests: To attend and manage Your requests to Us. For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred. For other purposes: We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.",
    },

    // Sharing / Disclosure
    {
      title: "Disclosure of Your Personal Data",
      variant: "h6",
      color: "#00305B",
      description:
        "We may share Your personal information in the following situations: With Service Providers: We may share Your personal information with Service Providers to monitor and analyze the use of our Service, for payment processing, to contact You. For business transfers: We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company. With Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us. With business partners: We may share Your information with Our business partners to offer You certain products, services or promotions. With other users: when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside. If You interact with other users or register through a Third-Party Social Media Service, Your contacts on the Third-Party Social Media Service may see Your name, profile, pictures and description of Your activity. Similarly, other users will be able to view descriptions of Your activity, communicate with You and view Your profile. With Your consent: We may disclose Your personal information for any other purpose with Your consent.",
    },

    {
      title: "Business Transactions",
      variant: "h6",
      color: "#00305B",
      description:
        "If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.",
    },
    {
      title: "Law enforcement and Legal Requirements",
      variant: "h6",
      color: "#00305B",
      description:
        "Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency). The Company may disclose Your Personal Data in the good faith belief that such action is necessary to: comply with a legal obligation; protect and defend the rights or property of the Company; prevent or investigate possible wrongdoing in connection with the Service; protect the personal safety of Users of the Service or the public; protect against legal liability.",
    },

    // Retention, Transfer, Deletion
    {
      title: "Retention of Your Personal Data",
      variant: "h6",
      color: "#00305B",
      description:
        "The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies. The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.",
    },
    {
      title: "Transfer of Your Personal Data",
      variant: "h6",
      color: "#00305B",
      description:
        "Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction. Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer. The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.",
    },
    {
      title: "Delete Your Personal Data",
      variant: "h6",
      color: "#00305B",
      description:
        "You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. Our Service may give You the ability to delete certain information about You from within the Service. You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us. Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.",
    },

    // Security
    {
      title: "Security of Your Personal Data",
      variant: "h6",
      color: "#00305B",
      description:
        "The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.",
    },

    // Processing Details & Payments
    {
      title: "Detailed Information on the Processing of Your Personal Data",
      variant: "h6",
      color: "#00305B",
      description:
        "The Service Providers We use may have access to Your Personal Data. These third-party vendors collect, store, use, process and transfer information about Your activity on Our Service in accordance with their Privacy Policies. They act as Service Providers or Data Processors and are contractually required to maintain confidentiality and security.",
    },
    {
      title: "Payments",
      variant: "h6",
      color: "#00305B",
      description:
        "We may provide paid products and/or services within the Service. In that case, we may use third-party services for payment processing (e.g. payment processors). We will not store or collect Your payment card details. That information is provided directly to Our third-party payment processors whose use of Your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS to help ensure the secure handling of payment information.",
    },
    {
      title: "Payment Provider Policies",
      variant: "h6",
      color: "#00305B",
      description:
        "Apple Store In-App Payments — Their Privacy Policy can be viewed at https://www.apple.com/legal/privacy/en-ww/; Google Play In-App Payments — https://www.google.com/policies/privacy/; PayPal — https://www.paypal.com/webapps/mpp/ua/privacy-full; Square — https://squareup.com/legal/privacy-no-account; Verifone — https://www.verifone.com/en/us/legal.",
    },

    // GDPR Section
    {
      title: "GDPR Privacy",
      variant: "h3",
      color: "#189e33ff",
    },
    {
      title: "Legal Basis for Processing Personal Data under GDPR",
      variant: "h6",
      color: "#00305B",
      description:
        "We may process Personal Data under the following conditions: Consent: You have given Your consent for processing Personal Data for one or more specific purposes. Performance of a contract: Provision of Personal Data is necessary for the performance of an agreement with You and/or for any pre-contractual obligations thereof. Legal obligations: Processing Personal Data is necessary for compliance with a legal obligation to which the Company is subject. Vital interests: Processing Personal Data is necessary in order to protect Your vital interests or of another natural person. Public interests: Processing Personal Data is related to a task that is carried out in the public interest or in the exercise of official authority vested in the Company. Legitimate interests: Processing Personal Data is necessary for the purposes of the legitimate interests pursued by the Company.",
    },
    {
      title: "Your Rights under the GDPR",
      variant: "h6",
      color: "#00305B",
      description:
        "The Company undertakes to respect the confidentiality of Your Personal Data and to guarantee You can exercise Your rights. You have the right to: Request access to Your Personal Data; Request correction of the Personal Data that We hold about You; Object to processing of Your Personal Data; Request erasure of Your Personal Data; Request the transfer of Your Personal Data; Withdraw Your consent. The Company will help clarify the legal basis that applies to processing and whether the provision of Personal Data is statutory, contractual, or necessary to enter into a contract.",
    },
    {
      title: "Exercising of Your GDPR Data Protection Rights",
      variant: "h6",
      color: "#00305B",
      description:
        "You may exercise Your rights of access, rectification, cancellation and opposition by contacting Us. We may ask You to verify Your identity before responding to such requests. If You make a request, We will try our best to respond to You as soon as possible. You have the right to complain to a Data Protection Authority about Our collection and use of Your Personal Data. For more information, if You are in the EEA, please contact Your local data protection authority in the EEA.",
    },

    // CCPA/CPRA Section
    {
      title: "CCPA/CPRA Privacy Notice (California Privacy Rights)",
      variant: "h3",
      color: "#189e33ff",
    },
    {
      title: "Categories of Personal Information Collected",
      variant: "h6",
      color: "#00305B",
      description:
        "We collect categories of personal information defined under the CCPA/CPRA. The categories that may have been collected in the last 12 months include: Category A (Identifiers) — e.g., name, alias, postal address, email, IP address; Category B (California Customer Records) — e.g., name, signature, Social Security number, financial information (may be collected if provided); Category D (Commercial information) — e.g., records and history of products or services purchased or considered; Category F (Internet or other similar network activity) — e.g., interactions with the Service or advertisements. Categories C, E, G, H, I, J, K, L are identified in the policy but noted as 'Collected: No' where applicable; Category L (Sensitive personal information) — Collected: Yes (account login and password information, geolocation data to the extent applicable).",
    },
    {
      title: "Sources of Personal Information",
      variant: "h6",
      color: "#00305B",
      description:
        "We obtain categories of personal information from: Directly from You (forms, preferences, purchases); Indirectly from You (observing activity); Automatically from You (cookies and tracking); From Service Providers (payment processors and third-party vendors).",
    },
    {
      title: "Use of Personal Information under CCPA/CPRA",
      variant: "h6",
      color: "#00305B",
      description:
        "We may use or disclose personal information for business or commercial purposes, including operating our Service, providing support, fulfilling transactions, responding to law enforcement requests, performing internal administrative and auditing purposes, detecting security incidents, and other one-time uses. If We decide to collect additional categories or use data for materially different purposes, We will update this Privacy Policy.",
    },
    {
      title: "Disclosure and Sharing (CCPA/CPRA)",
      variant: "h6",
      color: "#00305B",
      description:
        "We may share personal information with: Service Providers; Payment processors; Our affiliates; Our business partners; Third-party vendors authorized by You. When We disclose personal information for a business or commercial purpose, We enter a contract that describes the purpose and requires the recipient to both keep the personal information confidential and not use it for any purpose except performing the contract.",
    },
    {
      title: "Sale of Personal Information",
      variant: "h6",
      color: "#00305B",
      description:
        "As defined by the CCPA/CPRA, 'sell' is broadly defined. We do not sell personal information as commonly understood; however, We allow Service Providers to use Your personal information for the business purposes described in Our Privacy Policy, and these uses may be deemed a sale under CCPA/CPRA. We may have sold certain categories in the last 12 months including Identifiers and Commercial information as defined by law. You have the right to opt-out of the sale of Your personal information.",
    },
    {
      title: "Sale of Minors' Personal Information",
      variant: "h6",
      color: "#00305B",
      description:
        "We do not knowingly collect personal information from minors under 16. We do not sell the personal information of Consumers We actually know are less than 16 years of age, unless we receive affirmative authorization (opt-in) from the consumer (13–16) or parent/guardian (under 13).",
    },
    {
      title: "CCPA/CPRA Rights",
      variant: "h6",
      color: "#00305B",
      description:
        "California residents have the right to notice, the right to know/access, the right to say no to the sale or sharing of personal data (opt-out), the right to correct Personal Data, the right to limit use and disclosure of sensitive personal data, the right to delete Personal Data, and the right not to be discriminated against for exercising these rights. Verifiable requests must provide sufficient information that allows Us to reasonably verify identity and relate the request to the person's data. We will respond within 45 days (may extend once by 45 days) and disclosures cover the 12-month period preceding the request.",
    },
    {
      title: "How to Exercise CCPA/CPRA Rights",
      variant: "h6",
      color: "#00305B",
      description:
        "To exercise rights, California residents can contact Us by email: contact@rallitechnologies.online; by visiting: https://www.rallitechnologies.com/contact; or by phone: +1 (888) 832-7448. Only You or an authorized agent may make a verifiable request. Requests must include sufficient information to verify identity and describe the request in detail.",
    },

    // Do Not Track & California notices
    {
      title: "Do Not Track (DNT) Policy",
      variant: "h6",
      color: "#00305B",
      description:
        "Our Service does not respond to Do Not Track signals. However, some third party websites do keep track of your browsing activities. You can set your browser preferences to indicate you do not want to be tracked.",
    },
    {
      title: "Your California Privacy Rights (Shine the Light)",
      variant: "h6",
      color: "#00305B",
      description:
        "Under California Civil Code Section 1798 (Shine the Light), California residents with an established business relationship with us can request information once a year about sharing their Personal Data with third parties for the third parties' direct marketing purposes. To request information under Shine the Light, contact Us using the contact information below.",
    },

    // Children's privacy
    {
      title: "Children's Privacy",
      variant: "h6",
      color: "#00305B",
      description:
        "Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You become aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We will take steps to remove that information from Our servers. If a country requires parental consent prior to collecting Personal Data from minors, we will request such consent where applicable.",
    },

    // Links
    {
      title: "Links to Other Websites",
      variant: "h6",
      color: "#00305B",
      description:
        "Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.",
    },

    // Changes
    {
      title: "Changes to this Privacy Policy",
      variant: "h6",
      color: "#00305B",
      description:
        "We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page. We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the 'Last updated' date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
    },

    // Contact
    {
      title: "Contact Us",
      variant: "h6",
      color: "#00305B",
      description:
        "If you have any questions about this Privacy Policy, You can contact us: By email: contact@rallitechnologies.online; By visiting this page on our website: https://www.rallitechnologies.com/contact; By phone number: +1 (888) 832-7448.",
    },
  ],
};

export default function PrivacyPolicy() {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "768px" }}>
        <Box sx={{ width: "100%", maxWidth: "768px" }}>
          <BackButton/>
        {/* Heading */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mt: 2,
            color: "text.primary",
          }}
        >
          {privacyPolicyContent.heading}
        </Typography>
        </Box>
        

        {/* Last Updated */}
        <Typography
          variant="body2"
          sx={{
            color: "primary.dark",
            textDecoration: "underline",
            mt: 1,
          }}
        >
          {privacyPolicyContent.lastUpdated}
        </Typography>

        {/* Sections */}
        {privacyPolicyContent.sections.map((section, index) => (
          <Box key={index} sx={{ mt: 3 }}>
            {section.title && (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: section.color || "text.secondary",
                }}
              >
                {section.title}
              </Typography>
            )}

            {section.description && (
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                {section.description}
              </Typography>
            )}
          </Box>
        ))}

        {/* Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.open("/privacy-policy.docx", "_blank")}
          sx={{ mt: 5, mb: 10, textTransform: "none", fontSize: "0.9rem" }}
        >
          See All
        </Button>
      </Box>
    </Box>
  );
}

