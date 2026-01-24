import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

/**
 * CandidateReject Component
 * 
 * This component displays a confirmation screen before rejecting a candidate.
 * The rejection reason is now passed from the parent (RejectionReasonModal -> ApplicationDetail -> ApplicationActionModal)
 * 
 * @param {Function} onAction - Callback function to execute the rejection action
 * @param {Function} onClose - Callback function to close the modal
 * @param {string} rejectionReason - The reason for rejection (passed from parent)
 */
const CandidateReject = ({ onAction, onClose, rejectionReason = '' }) => {
    const [loading, setLoading] = useState(false);

    const handleReject = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('type', 'reject');
            // Note: The reason is appended in ApplicationActionModal's onAction
            // But we can also append it here for safety
            if (rejectionReason && !formData.has('reason')) {
                formData.append('reason', rejectionReason);
            }
            await onAction(formData);
        } catch (error) {
            console.error('Error rejecting candidate:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                py: 2,
            }}
        >
            <Typography
                sx={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#00305B',
                    mb: 2,
                }}
            >
                Reject Candidate
            </Typography>
            
            <Typography
                sx={{
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#555555',
                    mb: 3,
                    maxWidth: '500px',
                }}
            >
                Are you sure you want to reject this candidate? This action cannot be undone.
            </Typography>

            {/* Display the selected rejection reason */}
            {rejectionReason && (
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '500px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        p: 2,
                        mb: 3,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#00305B',
                            mb: 1,
                        }}
                    >
                        Rejection Reason:
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#333333',
                            textAlign: 'left',
                        }}
                    >
                        {rejectionReason}
                    </Typography>
                </Box>
            )}

            <Typography
                sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#777777',
                    mb: 4,
                    fontStyle: 'italic',
                }}
            >
                The candidate will be notified of this decision along with the reason provided.
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        color: '#00305B',
                        borderColor: '#00305B',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                            borderColor: '#00305B',
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleReject}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#d32f2f',
                        color: '#ffffff',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#b71c1c',
                        },
                        '&:disabled': {
                            backgroundColor: '#cccccc',
                        },
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                    ) : (
                        'Confirm Rejection'
                    )}
                </Button>
            </Box>
        </Box>
    );
};

export default CandidateReject;