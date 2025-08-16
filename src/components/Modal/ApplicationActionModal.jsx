import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Close } from '@mui/icons-material';
import { employerApplicationAction } from '@/helper/ApplicationActionHelper';
import CandidateReject from '../employer/dashboard/CandidateReject';
import InterviewInvite from '../employer/dashboard/InterviewInvite';
import OfferLetter from '../employer/dashboard/OfferLetter';

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
const ApplicationActionModal = ({ ucn = '', open, onClose, actionType = '', applicationId = null}) => {
    
    const onAction = async (payload) => {
        const response = await employerApplicationAction(applicationId, payload);
        if(response?.data?.status === 'success'){
            onClose();
            window.location.href = window.location.href;
        }
    }
    
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
                    {actionType === "Reject" && <CandidateReject onAction={onAction} onClose={onClose} />}
                    {actionType === "Interview" && <InterviewInvite ucn={ucn} onAction={onAction} />}
                    {(actionType === "OfferLetter" || actionType === "CounterOfferLetter") && <OfferLetter ucn={ucn} type={actionType} onAction={onAction} />}
                </Box>
            </Box>
        </Modal>
    );
}
export default ApplicationActionModal