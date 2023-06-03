import Lottie from 'lottie-react';
import React from 'react';
import { Stack } from '@mui/material';
import Email from '../../assets/animation/email-sent.json'


function EmailSuccess() {
  return (
    <Stack sx={{ backgroundColor: "#00092c",  }}>
      <Lottie animationData={Email} />
    </Stack>
  );
}

export default EmailSuccess;
