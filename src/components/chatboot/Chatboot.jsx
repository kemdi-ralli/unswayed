'use client'
import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    Avatar,
} from "@mui/material";
import TextInput from "@/components/input/TextInput";
import apiInstance from "@/services/apiService/apiServiceInstance";
import BackButtonWithTitle from "../applicant/dashboard/BackButtonWithTitle";

const Chatboot = () => {
    const [newMessage, setNewMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const messagesEndRef = useRef(null);

    const onSendMessage = async () => {
        if (!newMessage.trim()) return;

        const userMessage = { sender: "user", text: newMessage };
        setConversation(prev => [...prev, userMessage]);

        const formData = new FormData();
        formData.append("question", newMessage);

        try {
            const response = await apiInstance.post(`/ai/assistant`, formData);
            if (response.status === 200 || response.status === 201) {
                const data = response?.data?.data?.answer;
                const botReply = { sender: "bot", text: data };
                setConversation(prev => [...prev, botReply]);
            }
        } catch (error) {
            console.log(error);
            const errorReply = { sender: "bot", text: "Something went wrong. Please try again." };
            setConversation(prev => [...prev, errorReply]);
        }

        setNewMessage("");
    };
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation]);

    return (
        <>
            <BackButtonWithTitle label="Lexi AI" />
            <Box sx={{
                minHeight: "800px",
                maxHeight: "800px",
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 3px #00000040",
                px: 2,
                py: 2,
                my: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    pb: 1,
                    px: 1,
                    borderBottom: "1px solid #ccc",
                }}>
                    <Avatar
                        alt="Profile Picture"
                        src={'/assets/images/AIChat.png'}
                        sx={{
                            width: { xs: 40, lg: 50 },
                            height: { xs: 40, lg: 50 },
                            backgroundColor: "#FFFF",
                        }}
                    />
                    <Typography sx={{
                        fontSize: { xs: "14px", sm: "16px" },
                        fontWeight: 600,
                        lineHeight: { xs: "20px", sm: "22px", md: "26px" },
                        color: "#111111",
                        py: 1,
                        px: 1,

                    }}>
                        Lexi AI
                    </Typography>
                </Box>
                <Box sx={{
                    overflowY: "auto",
                    flexGrow: 1,
                    mb: 2,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },

                }}>
                    {conversation.map((msg, index) => (
                        <Box key={index} sx={{
                            display: "flex",
                            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                            mb: 1,
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: "center",
                                maxWidth: "70%",
                                p: 1.5,
                                borderRadius: "10px",
                                backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#F1F0F0",
                            }}>
                                {msg?.sender !== "user" && (
                                    <Avatar
                                        alt="Profile Picture"
                                        src={'/assets/images/supportAI.png'}
                                        sx={{
                                            width: { xs: 40, lg: 50 },
                                            height: { xs: 40, lg: 50 },
                                            backgroundColor: "#FFFF",
                                        }}
                                    />
                                )
                                }<Typography variant="body1" sx={{ px: 1, }}>{msg.text}</Typography>
                            </Box>
                            <div ref={messagesEndRef} />
                        </Box>
                    ))}
                </Box>

                <TextInput
                    placeholder="Write Message (Click Shift + Enter for a new line)"
                    type="send"
                    value={newMessage}
                    setValue={setNewMessage}
                    onSend={onSendMessage}
                />
            </Box>
        </>
    )
};

export default Chatboot;
