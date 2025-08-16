import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Close } from '@mui/icons-material';
import { Typography } from '@mui/material';
import RalliButton from '../button/RalliButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '790px',
    width: { xs: '90%' },
    maxHeight: '700px',
    bgcolor: '#FFFFFF',
    boxShadow: "0px 1px 5px #00000040",
    boxShadow: 24,
    p: 4,
    borderRadius: '15px'
};
const ConfirmModal = ({ open = false, title = '', onClose = () => {}, onConfirm = () => {}, onCancle = () => {} }) => {
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
                        top: -10,
                        right: 5,
                        }}
                        onClick={() => onClose()}
                    />
                </Box>
                <Box sx={{display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent: "center" }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography
                      sx={{ fontWeight: 600, fontSize: "22px",lineHeight:"22px", color: "#00305B", padding: '10px' }}
                    >
                      {title ?? "Are You Sure ?"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, width:'70%' }}>
                    <RalliButton label="Yes" onClick={onConfirm} />
                    <RalliButton label="No" bg="#00305B" onClick={onCancle} />
                  </Box>
                </Box>
            </Box>
        </Modal>
    );
}
export default ConfirmModal