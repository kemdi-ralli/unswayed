import React from 'react'
import { Box } from '@mui/material'
import { FEEDBACK_DATA } from '@/constant/applicant/feedback'
import Feedback from '@/components/feedback/Feedback'

const page = () => {
  return (
    <Box>
        <Feedback data={FEEDBACK_DATA}/>
    </Box>
  )
}

export default page
