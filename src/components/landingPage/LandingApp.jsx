import { HeroSection } from "../LandingPageComponents/hero-section"
import { DashboardPreview } from "../LandingPageComponents/dashboard-preview"
import { SocialProof } from "../LandingPageComponents/social-proof"
import { BentoSection } from "../LandingPageComponents/bento-section"
import { LargeTestimonial } from "../LandingPageComponents/large-testimonial"
import { PricingSection } from "../LandingPageComponents/pricing-section"
import { TestimonialGridSection } from "../LandingPageComponents/testimonial-grid-section"
import { FAQSection } from "../LandingPageComponents/faq-section"
import { CTASection } from "../LandingPageComponents/cta-section"
import { FooterSection } from "../LandingPageComponents/footer-section"
import { AnimatedSection } from "../LandingPageComponents/animated-section"
import { Box } from "@mui/material"

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", position: "relative", overflow: "hidden", pb: 0, }}>
      {/* Background gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom right, white, white, rgba(32, 190, 87, 0.2)",
        }}
      />
      {/* Top right blur gradient circle */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "24rem", // w-96
          height: "24rem", // h-96
          background: "linear-gradient(to bottom left, rgba(32, 190, 87, 0.2), transparent)",
          borderRadius: "50%",
          filter: "blur(48px)", // blur-3xl
        }}
      />
      {/* Bottom left blur gradient circle */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "20rem", // w-80
          height: "20rem", // h-80
          background: "linear-gradient(to top right, rgba(32, 190, 87, 0.2), transparent)",
          borderRadius: "50%",
          filter: "blur(32px)", // blur-2xl
        }}
      />

      <Box sx={{ position: "relative", zIndex: 10 }}>
        <Box component="main" sx={{ maxWidth: "1320px", mx: "auto", position: "relative" }}>
          <HeroSection />

          {/* Dashboard Preview Wrapper */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: "-400px", md: "-500px" },
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
            }}
          >
            <AnimatedSection>
              <DashboardPreview />
            </AnimatedSection>
          </Box>
        </Box>

        <AnimatedSection
          delay={0.1}
          sx={{
            position: "relative",
            zIndex: 10,
            maxWidth: "1320px",
            mx: "auto",
            px: 6,
            mt: { xs: "411px", md: "400px" },
          }}
        >
          {/* <SocialProof /> */}
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection
          id="features-section"
          delay={0.2}
          sx={{ position: "relative", zIndex: 10, maxWidth: "1320px", mx: "auto", mt: 16 }}
        >
          <BentoSection />
        </AnimatedSection>

        {/* Large Testimonial */}
        <AnimatedSection
          delay={0.2}
          sx={{ position: "relative", zIndex: 10, maxWidth: "1320px", mx: "auto", mt: { xs: 8, md: 16 } }}
        >
          <LargeTestimonial />
        </AnimatedSection>

        {/* Pricing Section */}
        <AnimatedSection
          id="pricing-section"
          delay={0.2}
          sx={{ position: "relative", zIndex: 10, maxWidth: "1320px", mx: "auto", mt: { xs: 8, md: 16 } }}
        >
          <PricingSection />
        </AnimatedSection>

        {/* Testimonial Grid */}
        <AnimatedSection
          id="testimonials-section"
          delay={0.2}
          sx={{ position: "relative", zIndex: 10, maxWidth: "1320px", mx: "auto", mt: { xs: 8, md: 16 } }}
        >
          <TestimonialGridSection />
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection
          id="faq-section"
          delay={0.2}
          sx={{ position: "relative", zIndex: 10, maxWidth: "1320px", mx: "auto", mt: { xs: 8, md: 16 } }}
        >
          <FAQSection />
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection
          delay={0.2}
          sx={{ position: "relative", zIndex: 10, maxWidth: "1320px", mx: "auto", mt: { xs: 8, md: 16 } }}
        >
          <CTASection />
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection
          delay={0.2}
          sx={{ position: "relative", zIndex: 10, maxWidth: "1320px", mx: "auto", mt: { xs: 8, md: 16 } }}
        >
          <FooterSection />
        </AnimatedSection>
      </Box>
    </Box>
  )
}
