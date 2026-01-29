import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
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
    const [contentLoading, setContentLoading] = React.useState(true);
    const interviewTypes = new Set(["interview_invite", "interview_decline", "interview_accept"]);
    const offerTypes = new Set(["offer_letter_sent", "counter_offer_letter_sent", "offer_decline", "offer_accept"]);
    const hasContent = interviewTypes.has(historyData?.type) || offerTypes.has(historyData?.type);

    React.useEffect(() => {
        if (open && hasContent) {
            setContentLoading(true);
            const t = setTimeout(() => setContentLoading(false), 400);
            return () => clearTimeout(t);
        } else if (!open) {
            setContentLoading(true);
        } else {
            setContentLoading(false);
        }
    }, [open, historyData?.type, hasContent]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={{ position: "relative" }}>
                    <Close
                        sx={{ position: "absolute", cursor: "pointer", color: "red", top: 5, right: 5 }}
                        onClick={() => onClose()}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', py: 4.5, minHeight: 200 }}>
                    {contentLoading && hasContent ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
                            <CircularProgress sx={{ color: '#189e33ff' }} />
                        </Box>
                    ) : (
                        <>
                            {interviewTypes.has(historyData?.type) && (
                                <InterviewDetails requisitionNumber={requisitionNumber} userType={userType} historyData={historyData} />
                            )}
                            {offerTypes.has(historyData?.type) && (
                                <OfferLetterDetails requisitionNumber={requisitionNumber} userType={userType} historyData={historyData} />
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Modal>
    );
}
export default ApplicationActionDetailModal