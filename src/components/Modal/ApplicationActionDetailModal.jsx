import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Close } from '@mui/icons-material';
import InterviewDetails from '../applicant/dashboard/InterviewDetails';
import OfferLetterDetails from '../applicant/dashboard/OfferLetterDetails';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '790px',
    width: { xs: '90%' },
    maxHeight: '700px',
    overflowY: 'scroll',
    // scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
        // display: 'none',
    },
    bgcolor: '#FFFFFF',
    boxShadow: "0px 1px 5px #00000040",
    boxShadow: 24,
    p: 4,
    borderRadius: '15px'
};
const ApplicationActionDetailModal = ({ requisitionNumber = '', userType = '', historyData = {}, open, onClose, applicationId = null }) => {
    const interviewTypes = new Set(["interview_invite", "interview_decline", "interview_accept"]);
    const offerTypes = new Set(["offer_letter_sent", "counter_offer_letter_sent", "offer_decline", "offer_accept"]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <Close
                        sx={{
                            position: "absolute",
                            cursor: "pointer",
                            color: "red",
                            top: 5,
                            right: 5,
                        }}
                        onClick={() => onClose()}
                    />
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    py: 4.5
                }}>
                    {
                        interviewTypes.has(historyData?.type) && (
                            <InterviewDetails requisitionNumber={requisitionNumber} userType={userType} historyData={historyData} />
                        )
                    }

                    {
                        offerTypes.has(historyData?.type) && (
                            <OfferLetterDetails requisitionNumber={requisitionNumber} userType={userType} historyData={historyData} />
                        )
                    }
                </Box>
            </Box>
        </Modal>
    );
}
export default ApplicationActionDetailModal