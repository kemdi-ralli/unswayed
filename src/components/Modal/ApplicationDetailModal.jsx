import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import RalliButton from '../button/RalliButton';
import EmployerApplicationDetails from '../employer/applicationPage/EmployerApplicationDetails';
import { Close } from '@mui/icons-material';

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
const ApplicationDetailModal = ({ open, onClose, title , buttonLabel, data = {}, onClick}) => {
    const [contentLoading, setContentLoading] = React.useState(true);
    const handleClose = () => onClose();

    React.useEffect(() => {
        if (open) {
            setContentLoading(true);
            const t = setTimeout(() => setContentLoading(false), 350);
            return () => clearTimeout(t);
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
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
                <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', py: 4.5, minHeight: 200 }}>
                    {contentLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
                            <CircularProgress sx={{ color: '#189e33ff' }} />
                        </Box>
                    ) : (
                        <>
                            {title && (
                                <Typography id="modal-modal-title" variant="h6" component="h2"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '12px', sm: '16px', md: '20px', lg: '26px' },
                                        lineHeight: { xs: '12px', sm: '16px', md: '20px', lg: '18px' },
                                        color: '#222222',
                                        py: 2
                                    }}>
                                    {title}
                                </Typography>
                            )}
                            <EmployerApplicationDetails data={data}/>
                        </>
                    )}
                </Box>
            </Box>
        </Modal>
    );
}
export default ApplicationDetailModal