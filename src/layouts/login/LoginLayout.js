import PropTypes from 'prop-types';
// @mui
import { Typography, Stack } from '@mui/material';
// components
import Logo from '../../components/logo';
import Image from '../../components/image';
//
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';


// ----------------------------------------------------------------------

LoginLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  illustration: PropTypes.string,
  logoStatus: PropTypes.string,
};

export default function LoginLayout({ children, illustration, title, logoStatus }) {
  return (
    <StyledRoot>
      <Logo
        sx={{
          zIndex: 9,
          position: 'absolute',
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
          display: logoStatus ? 'flex' : 'none'
        }}
      />

      <StyledSection sx={{ backgroundColor: "#00092c",  }}>
         <Image
          disabledEffect
          visibleByDefault
          alt="auth"
          src={illustration || '/assets/illustrations/illustration_dashboard.svg'}
          sx={{
            maxWidth: 720,
            filter: "drop-shadow(0px 0px 6px white)",
            mt: 10
          }}
        /> 

       

        <Typography variant="h3" sx={{ mt: 10, maxWidth: 700, textAlign: 'center', color: "white", textShadow: "0px 0px 15px rgba(255,255,255,0.5)" }}>
          {title || 'Hola, Bienvenido de nuevo!'}
        </Typography>

        <StyledSectionBg />
      </StyledSection>

      <StyledContent sx={{ padding: "0px !important", marginLeft: 5, marginRight: 5 }}>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
