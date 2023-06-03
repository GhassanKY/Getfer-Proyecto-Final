import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, Typography, Link} from '@mui/material';

// routes
import { PATH_AUTH } from '../../routes/paths';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';


// ----------------------------------------------------------------------

export default function Login() {


  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Iniciar Sesion</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Nuevo Usuario?</Typography>

          <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.register}>
            Crear una cuenta
          </Link>
        </Stack>

        {/* <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
          />
        </Tooltip> */}
      </Stack>

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
      </Alert> */}

      <AuthLoginForm />

      {/* <AuthWithSocial /> */}
    </LoginLayout>
  );
}
