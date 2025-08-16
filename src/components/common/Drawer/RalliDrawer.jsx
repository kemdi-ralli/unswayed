'use client';
import * as React from 'react';
import { Drawer, Box, Divider } from '@mui/material';
import MessageItems from '@/components/applicant/chatComponent/MessageItems';

export default function RalliDrawer({ setChatUser, chatId, open, onClose }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
        sx={{ width: 250 }}
      >
        <Box
          sx={{
            minHeight: '800px',
            maxHeight: '800px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 1px 3px #00000040',
            px: 2,
            py: 2,
            my: 2,
          }}
        >
          <MessageItems setChatUser={setChatUser} chatId={chatId} />
        </Box>
        <Divider />
      </Box>
    </Drawer>
  );
}
