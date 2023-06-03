// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// redux
import { useSelector } from 'react-redux';

// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useSelector((state) => state.user);
  const { firstName, role } = JSON.parse(localStorage.getItem('user'));

  console.log(firstName);

  return (
    <StyledRoot>
      <CustomAvatar src={user?.photoURL} alt={firstName} name={firstName} />

      <Box sx={{ ml: 2, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {firstName}
        </Typography>

        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
          {role === 'customer' ? 'Cliente' : 'Administrador'}
        </Typography>
      </Box>
    </StyledRoot>
  );
}
