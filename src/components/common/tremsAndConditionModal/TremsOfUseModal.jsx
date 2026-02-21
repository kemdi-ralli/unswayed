import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const PRELOADER_DELAY_MS = 300;

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "16px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "18px",
  },
  fontWeight: "bold",
  color: "#189e33ff",
  paddingBottom: theme.spacing(1),
}));

const StyledSectionHeading = styled(Typography)(({ theme }) => ({
  fontSize: { xs: "12px", sm: "14px", md: "16px" },
  fontWeight: "bold",
  color: "#189e33ff",
  marginTop: theme.spacing(2),
  [theme.breakpoints.up("xs")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "16px",
  },
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "16px",
  },

  color: "#444",
  marginBottom: theme.spacing(2),
}));


const TermsOfUseModal = ({ open, onClose, handleAgree, variant }) => {
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setContentReady(false);
      return;
    }
    const t = setTimeout(() => setContentReady(true), PRELOADER_DELAY_MS);
    return () => clearTimeout(t);
  }, [open]);

  const applicantContent = (
    <>
      <StyledDialogTitle>TERMS OF USE FOR APPLICANTS</StyledDialogTitle>
      <DialogContent>
        {!contentReady ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280, py: 4 }}>
            <CircularProgress size={40} sx={{ color: "#189e33ff" }} />
          </Box>
        ) : (
          <>
            <StyledDescription>
              Effective Date: [Insert Date]
            </StyledDescription>
            <StyledDescription>
              Welcome to Unswayed (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;), operated by RALLI TECHNOLOGIES, LLC. By accessing or using our website, platform, or services (collectively, the &ldquo;Site&rdquo;) to search for jobs, create a profile, or submit applications, you (&ldquo;Applicant,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;).
            </StyledDescription>
            <StyledDescription>
              If you do not agree to these Terms, please do not use this Site.
            </StyledDescription>

            <StyledSectionHeading>1. Eligibility and Usage</StyledSectionHeading>
            <StyledDescription>
              Age Requirement: You must be at least 18 years old or the age of majority in your jurisdiction to use this Site.
            </StyledDescription>
            <StyledDescription>
              Purpose: The Site is to be used solely for personal, non-commercial purposes to search for employment opportunities and to submit applications to employers.
            </StyledDescription>
            <StyledDescription>
              Accuracy of Information: You represent that all information you submit, including resumes, profiles, and contact details, is truthful, accurate, and current.
            </StyledDescription>

            <StyledSectionHeading>2. User Content and Privacy</StyledSectionHeading>
            <StyledDescription>
              Responsibility for Content: You are solely responsible for the content of your resume, profile, and any other material you submit to the Site.
            </StyledDescription>
            <StyledDescription>
              Prohibited Content: You agree not to upload or submit any content that is unlawful, harassing, defamatory, abusive, threatening, harmful, vulgar, obscene, or violates any third-party intellectual property or privacy rights.
            </StyledDescription>
            <StyledDescription>
              No Confidential Information: Do not submit confidential, proprietary, or highly sensitive information (e.g., social security numbers, specific financial account details) in your profile or resume.
            </StyledDescription>
            <StyledDescription>
              Privacy Policy: Your submission of personal information is also governed by our Privacy Policy, which is incorporated into these Terms.
            </StyledDescription>

            <StyledSectionHeading>3. Prohibited Conduct</StyledSectionHeading>
            <StyledDescription>
              You agree that you will not:
            </StyledDescription>
            <StyledDescription>
              &bull; Use the Site to send unsolicited, commercial messages, or junk mail.
            </StyledDescription>
            <StyledDescription>
              &bull; Use any robot, spider, or other automatic device to scrape or copy data from the Site.
            </StyledDescription>
            <StyledDescription>
              &bull; Impersonate any person or entity, or misrepresent your affiliation with any person or entity.
            </StyledDescription>
            <StyledDescription>
              &bull; Attempt to gain unauthorized access to the Site, other accounts, or computer systems.
            </StyledDescription>

            <StyledSectionHeading>4. No Employment Guarantee</StyledSectionHeading>
            <StyledDescription>
              Unswayed is an intermediary platform connecting job seekers with employers. We do not guarantee that you will receive interviews, job offers, or employment, nor do we guarantee the accuracy of listings provided by employers.
            </StyledDescription>
            <StyledDescription>
              All hiring decisions are made exclusively by the employer. We are not acting as an agent for you or any employer.
            </StyledDescription>

            <StyledSectionHeading>5. Termination of Access</StyledSectionHeading>
            <StyledDescription>
              We reserve the right to suspend or terminate your account and your access to the Site at any time, without notice, for any violation of these Terms or for behavior that we deem harmful to the community.
            </StyledDescription>

            <StyledSectionHeading>6. Limitation of Liability</StyledSectionHeading>
            <StyledDescription>
              To the maximum extent permitted by law, RALLI TECHNOLOGIES LLC, shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use of the Site.
            </StyledDescription>

            <StyledSectionHeading>7. Indemnification</StyledSectionHeading>
            <StyledDescription>
              You agree to indemnify and hold harmless RALLI TECHNOLOGIES LLC, and its officers, directors, and employees from any claims, losses, damages, liabilities, and expenses (including legal fees) arising out of your use of the Site, your violation of these Terms, or your submission of inaccurate information.
            </StyledDescription>

            <StyledSectionHeading>8. Changes to Terms</StyledSectionHeading>
            <StyledDescription>
              We reserve the right to update these Terms at any time. Any changes will be effective immediately upon posting to the Site. Your continued use of the Site constitutes your acceptance of the revised Terms.
            </StyledDescription>

            <StyledSectionHeading>9. Governing Law</StyledSectionHeading>
            <StyledDescription>
              These Terms are governed by the laws of the State of [State Name], without regard to its conflict of laws principles.
            </StyledDescription>

            <StyledSectionHeading>10. Contact Information</StyledSectionHeading>
            <StyledDescription>
              If you have any questions about these Terms, please contact us at:
            </StyledDescription>
            <StyledDescription>
              RALLI TECHNOLOGIES LLC,{" "}
              Contact@rallitechnologies.online{" "}
              1-888-832-7448
            </StyledDescription>
          </>
        )}
      </DialogContent>
    </>
  );

  const employerContent = (
    <>
      <StyledDialogTitle>RALLi Terms of Use</StyledDialogTitle>
      <DialogContent>
        {!contentReady ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280, py: 4 }}>
            <CircularProgress size={40} sx={{ color: "#189e33ff" }} />
          </Box>
        ) : (
          <>
            <StyledDescription>
              Terms of Use for Employers Posting Jobs on UNSWAYED, RALLi
              Technologies, LLC Effective Date: January 1, 2025
            </StyledDescription>
            <StyledDescription>
              Welcome to UNSWAYED, RALLi Technologies, LLC. By posting a job on this
              platform, you (the Employer or You) agree to abide by the
              following terms and conditions. Please read these Terms of Use
              carefully before posting any job listings. If you do not agree to
              these terms, you should not use the Site to post job openings.
            </StyledDescription>
            <StyledSectionHeading>1. Eligibility</StyledSectionHeading>
            <StyledDescription>
              To post jobs on the Site, you must be a legitimate business,
              organization, or individual authorized to hire candidates. By using
              this service, you confirm that you have the legal capacity to enter
              into agreements and employ individuals in compliance with applicable
              employment laws.
            </StyledDescription>
            <StyledSectionHeading>2. Job Posting Guidelines</StyledSectionHeading>
            <StyledDescription>
              When posting job listings, you agree to the following: Accuracy: You
              must provide accurate and truthful information about the job position,
              including but not limited to job title, description, responsibilities,
              qualifications, and compensation details. Non-Discrimination: Your job
              postings must comply with applicable anti-discrimination laws and
              should not contain content that discriminates based on race, color,
              national origin, sex, disability, age, sexual orientation, religion,
              or any other protected characteristic. Prohibited Content: You may not
              post any job listings or content that is unlawful, offensive,
              fraudulent, misleading, discriminatory, or violates any intellectual
              property rights. Compliance with Laws: Your job posting must adhere to
              all applicable local, state, and federal employment laws, including
              wage and hour laws, anti-discrimination laws, and employment contract
              requirements. Applicant Contact: Employer agrees to solely contact
              candidates through Unswayed application and not through any external
              entities.
            </StyledDescription>
            <StyledSectionHeading>3. Job Postings and Applications</StyledSectionHeading>
            <StyledDescription>
              Moderation: UNSWAYED, RALLi Technologies, LLC reserves the right to
              review, approve, or remove job listings at its discretion and may
              refuse to post job ads that do not comply with these Terms of Use or
              any applicable laws. Job Listing Duration: Job listings may remain
              posted for a specified period as per the Sites policy. Employers can
              renew or edit job postings within the allowed timeframe. No Guarantee
              of Applicants: Posting a job does not guarantee you will receive
              applications, responses, or hires. Terms of Use for Employers Posting
              Jobs on UNSWAYED, RALLi Technologies, LLC
            </StyledDescription>
            <StyledSectionHeading>4. Payment Terms (If Applicable)</StyledSectionHeading>
            <StyledDescription>
              If your job posting requires a payment, you agree to pay all
              applicable fees for the services you use on the Site. Fees and payment
              terms will be outlined at the time of posting. UNSWAYED, RALLi
              Technologies, LLC reserves the right to change pricing or services at
              any time, with notice to users.
            </StyledDescription>
            <StyledSectionHeading>5. User Data and Privacy</StyledSectionHeading>
            <StyledDescription>
              As an Employer, you are responsible for handling applicants personal
              information in accordance with applicable privacy laws. UNSWAYED,
              RALLi Technologies, LLC will not be held liable for any misuse or
              breaches of privacy in the hiring process. You agree not to misuse,
              disclose, or share applicant information without consent.
            </StyledDescription>
            <StyledSectionHeading>6. Intellectual Property</StyledSectionHeading>
            <StyledDescription>
              You retain ownership of the job descriptions, content, and materials
              you post on the Site, but by posting, you grant UNSWAYED, RALLi
              Technologies, LLC a non-exclusive, worldwide, royalty-free license to
              use, display, and distribute your content for the purpose of operating
              and promoting the platform.
            </StyledDescription>
            <StyledSectionHeading>7. Indemnification</StyledSectionHeading>
            <StyledDescription>
              You agree to indemnify, defend, and hold harmless UNSWAYED, RALLi
              Technologies, LLC and its affiliates, employees, and agents from any
              claims, liabilities, or damages arising from your use{" "}
            </StyledDescription>
            <StyledSectionHeading>8. Termination</StyledSectionHeading>
            <StyledDescription>
              UNSWAYED, RALLi Technologies, LLC reserves the right to terminate or
              suspend your access to the Site at any time, for any reason, without
              notice, if you violate these Terms of Use. Termination will not affect
              any rights or obligations accrued prior to termination.
            </StyledDescription>
            <StyledSectionHeading>9. Limitation of Liability</StyledSectionHeading>
            <StyledDescription>
              UNSWAYED, RALLi Technologies, LLC will not be liable for any indirect,
              incidental, or consequential damages resulting from your use of the
              Site or the failure to hire through job postings. The Site's liability
              will be limited to the fees you paid for the specific service.
            </StyledDescription>
            <StyledSectionHeading>10. Changes to Terms</StyledSectionHeading>
            <StyledDescription>
              UNSWAYED, RALLi Technologies, LLC reserves the right to modify or
              update these Terms of Use at any time, and such changes will become
              effective upon posting on the Site. Your continued use of the Site
              after changes are posted constitutes your acceptance of the modified
              terms.
            </StyledDescription>
            <StyledSectionHeading>11. Governing Law</StyledSectionHeading>
            <StyledDescription>
              These Terms of Use are governed by the laws as defined in the Privacy
              Policy Terms and Conditions. Any disputes arising from the use of the
              Site will be subject to the exclusive jurisdiction of the courts in
              [Insert Jurisdiction].
            </StyledDescription>
            <StyledSectionHeading>12. Contact Information</StyledSectionHeading>
            <StyledDescription>
              If you have any questions or concerns regarding these Terms of Use,
              please contact us at: UNSWAYED, RALLi Technologies, LLC 1-888-832-7448
              (1-888-TEC-RGHT) Email: Contact@rallitechnologies.online By posting a
              job listing UNSWAYED, RALLi Technologies, LLC, you acknowledge that
              you have read, understood, and agree to comply with these Terms of
              Use.
            </StyledDescription>
          </>
        )}
      </DialogContent>
    </>
  );

  return (
    <Dialog open={open} onClose={onClose}>
      {variant === "applicant" ? applicantContent : employerContent}
      <DialogActions>
        <Button onClick={handleAgree} color="primary">
          Agree & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsOfUseModal;
