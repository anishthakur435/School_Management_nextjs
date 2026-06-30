import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function ReusableModal({ open, onClose, children }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Modal>
  );
}
