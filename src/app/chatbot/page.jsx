import React from 'react'
import { Box } from '@mui/material'
import Chatboot from '@/components/chatboot/Chatboot'

const Page = () => {
    return (
        <Box sx={{
            px: "25px",
            maxWidth: "1260px",
            margin: "25px auto",
        }}>
            <Chatboot />
        </Box>
    )
}

export default Page