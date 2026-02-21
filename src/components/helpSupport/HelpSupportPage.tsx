"use client"

import React, { useState } from "react"
import { Box, Typography, TextField, Button, Grid, Accordion, AccordionSummary, AccordionDetails, Card, CardContent } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import PaymentIcon from '@mui/icons-material/Payment'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import BusinessIcon from '@mui/icons-material/Business'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import { Header } from "../LandingPageComponents/header"
import { FooterSection } from "../LandingPageComponents/footer-section"
import { Toast } from "@/components/Toast/Toast"

export default function HelpSupportPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [ticketForm, setTicketForm] = useState({ name: "", email: "", subject: "", message: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleTicketChange = (e) => {
        setTicketForm({ ...ticketForm, [e.target.name]: e.target.value })
    }

    const handleSubmitTicket = async (e) => {
        e.preventDefault()
        if (!ticketForm.name || !ticketForm.email || !ticketForm.subject || !ticketForm.message) {
            Toast("error", "Please fill in all fields.")
            return
        }

        setIsSubmitting(true)
        // Simulate API call for now, since endpoint isn't live yet
        setTimeout(() => {
            Toast("success", "Support ticket submitted successfully. We will get back to you soon.")
            setTicketForm({ name: "", email: "", subject: "", message: "" })
            setIsSubmitting(false)
        }, 1500)
    }

    const supportCategories = [
        { title: "Account Settings", icon: <SettingsIcon fontSize="large" sx={{ color: "#00305B" }} />, desc: "Manage your profile, password, and preferences." },
        { title: "Billing & Payments", icon: <PaymentIcon fontSize="large" sx={{ color: "#00305B" }} />, desc: "View invoices, update payment methods, and subscriptions." },
        { title: "Job Applications", icon: <WorkOutlineIcon fontSize="large" sx={{ color: "#00305B" }} />, desc: "Track your applications, resume builder help, and interviewing." },
        { title: "Employer Tools", icon: <BusinessIcon fontSize="large" sx={{ color: "#00305B" }} />, desc: "Manage job postings, applicant tracking, and offer letters." },
    ]

    const faqs = [
        { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot Password'. You will receive an email instruction to reset it." },
        { q: "Is Ralli Web free for applicants?", a: "Yes! Creating an applicant profile and applying to jobs is completely free." },
        { q: "How do I edit my generated Resume?", a: "Navigate to your Applicant Dashboard, click 'Profile', and then select 'Edit Resume'. Ensure to save your changes." },
        { q: "What should I include in the job description?", a: "We strongly recommend employers disclose salary ranges and comprehensive benefits to align with state pay transparency laws and build trust." },
    ]

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafc", display: "flex", flexDirection: "column" }}>
            {/* <Header /> */}

            {/* Hero Section */}
            <Box sx={{
                bgcolor: "#00305B",
                color: "white",
                pt: { xs: 12, md: 16 },
                pb: { xs: 8, md: 12 },
                px: 2,
                textAlign: "center",
                backgroundImage: "radial-gradient(circle at 10% 20%, rgb(0, 52, 102) 0%, rgb(0, 36, 71) 90.2%)",
                borderBottom: "4px solid #189e33"
            }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: "2.5rem", md: "3.5rem" } }}>
                    How can we help you?
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 300, mb: 5, opacity: 0.9, maxWidth: "600px", mx: "auto" }}>
                    Search our knowledge base or get in touch with our clinical support team.
                </Typography>

                <Box sx={{ maxWidth: "600px", mx: "auto", position: "relative" }}>
                    <TextField
                        fullWidth
                        placeholder="Search for articles, questions, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        sx={{
                            bgcolor: "white",
                            borderRadius: 2,
                            "& fieldset": { border: "none" },
                            "& input": { py: 2, px: 3, fontSize: "1.1rem" }
                        }}
                        InputProps={{
                            endAdornment: (
                                <Button variant="contained" sx={{ bgcolor: "#189e33", color: "white", height: "100%", borderRadius: "0 8px 8px 0", px: 3, "&:hover": { bgcolor: "#138029" } }}>
                                    <SearchIcon />
                                </Button>
                            )
                        }}
                    />
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, maxWidth: "1200px", mx: "auto", w: "100%", px: { xs: 2, md: 4 }, py: 8 }}>

                {/* Categories */}
                <Box sx={{ mb: 10 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#111", mb: 4, textAlign: "center" }}>
                        Browse by Category
                    </Typography>
                    <Grid container spacing={4}>
                        {supportCategories.map((cat, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <Card sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                                    cursor: "pointer",
                                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 30px rgba(0,48,91,0.15)" }
                                }}>
                                    <CardContent sx={{ textAlign: "center", p: 4 }}>
                                        <Box sx={{ bgcolor: "#f0f4f8", width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                                            {cat.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#00305B", mb: 2 }}>{cat.title}</Typography>
                                        <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>{cat.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* FAQs */}
                <Box sx={{ mb: 10, maxWidth: "800px", mx: "auto" }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "#111", mb: 4, textAlign: "center" }}>
                        Frequently Asked Questions
                    </Typography>
                    <Box sx={{ bgcolor: "white", borderRadius: 3, p: { xs: 2, md: 4 }, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        {faqs.map((faq, idx) => (
                            <Accordion key={idx} elevation={0} sx={{ "&:before": { display: "none" }, borderBottom: idx === faqs.length - 1 ? "none" : "1px solid #eee" }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#00305B" }} />} sx={{ py: 1 }}>
                                    <Typography sx={{ fontWeight: 500, color: "#222", fontSize: "1.05rem" }}>{faq.q}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ color: "#555", lineHeight: 1.7 }}>{faq.a}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Box>

                {/* Contact Support Form */}
                <Box sx={{ maxWidth: "800px", mx: "auto" }}>
                    <Card sx={{ borderRadius: 4, boxShadow: "0 10px 40px rgba(0,48,91,0.08)", overflow: "hidden" }}>
                        <Grid container>
                            <Grid item xs={12} md={5} sx={{ bgcolor: "#00305B", color: "white", p: 5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <ContactSupportIcon sx={{ fontSize: 60, mb: 3, opacity: 0.9 }} />
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Still need help?</Typography>
                                <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                                    Our clinical support team is ready to securely assist you with any advanced issues regarding your account, applications, or billing.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 6 } }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: "#111", mb: 4 }}>Submit a Ticket</Typography>
                                <Box component="form" onSubmit={handleSubmitTicket}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Your Name" name="name" value={ticketForm.name} onChange={handleTicketChange} required variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField fullWidth label="Email Address" type="email" name="email" value={ticketForm.email} onChange={handleTicketChange} required variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth label="Subject or Issue Type" name="subject" value={ticketForm.subject} onChange={handleTicketChange} required variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth label="How can we help?" name="message" value={ticketForm.message} onChange={handleTicketChange} required variant="outlined" multiline rows={4} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: "#189e33", color: "white", py: 1.5, px: 4, fontSize: "1rem", fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: "#138029" } }}>
                                                {isSubmitting ? "Submitting..." : "Send Message"}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                </Box>

            </Box>

            {/* <FooterSection /> */}
        </Box>
    )
}
