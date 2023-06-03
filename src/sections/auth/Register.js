import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Typography, Link } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <LoginLayout title="Manage the job more effectively with Minimal">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Comienza totalmente gratis</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Ya tienes una cuenta? </Typography>

          <Link component={RouterLink} to={PATH_AUTH.login} variant="subtitle2">
            Iniciar Sesion
          </Link>
        </Stack>
        <AuthRegisterForm />
      </Stack>


        
      

      {/* <Typography
        component="div"
        sx={{ color: 'text.secondary', mt: 3, typography: 'caption', textAlign: 'center' }}
      >
        {'By signing up, I agree to '}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>
        {' and '}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
        .
      </Typography> */}
    </LoginLayout>
  );
}
