import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, Container, Stack, alpha } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useCallback } from 'react';
import { RHFTextField } from '../../components/hook-form';
import { useAuthContext } from '../../auth/useAuthContext';
import { Upload } from '../../components/upload';
import { userRegister } from '../../store/slice/users/users.thunk';

export default function VerticalRegisterForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const { register } = useAuthContext();
  const dispatch = useDispatch();

  const [businessRegistration, setbusinessRegistration] = useState('');
  const [identificationCard, setidentificationCard] = useState('');
  const [businessChamber, setbusinessChamber] = useState('');

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('El nombre es obligatorio'),
    lastName: Yup.string().required('Los apellidos son obligatorios'),
    email: Yup.string().required('El correo es obligatorio').email('Correo electrónico inválido'),
    password: Yup.string().required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
      .required('La confirmación de la contraseña es obligatoria')
      .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),
    companyName: Yup.string().required('El nombre de la empresa es obligatorio'),
    address: Yup.string().required('La dirección es obligatoria'),
    identificationCard: Yup.mixed().test(
      'fileSize',
      'El tamaño máximo de la imagen es de 60MB',
      (value) => {
        if (!value) return true;
        return value.size <= 60 * 1024 * 1024;
      }
    ),
    businessRegistration: Yup.mixed().test(
      'fileSize',
      'El tamaño máximo de la imagen es de 60MB',
      (value) => {
        if (!value) return true;
        return value.size <= 60 * 1024 * 1024;
      }
    ),
    businessChamber: Yup.mixed().test(
      'fileSize',
      'El tamaño máximo de la imagen es de 60MB',
      (value) => {
        if (!value) return true;
        return value.size <= 60 * 1024 * 1024;
      }
    ),
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  const businessChamberRender = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setbusinessChamber(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);

  const businessRegistrationRender = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setbusinessRegistration(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);

  const indentificationCardRender = React.useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setidentificationCard(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        })
      );
    }
  }, []);

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      formData.append('businessRegistration', businessRegistration);
      formData.append('identificationCard', identificationCard);
      formData.append('camaraComercio', businessChamber);
      dispatch(userRegister(formData));
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  const steps = [
    {
      label: 'Información personal',
      description: (
        <Stack spacing={2.5}>
          <Typography>Introduzca su información personal:</Typography>
          <RHFTextField name="firstName" label="Nombre" autoComplete="off" />
          <RHFTextField name="lastName" label="Apellidos" />
          <RHFTextField name="email" label="Correo electrónico" />
          <RHFTextField name="phoneNumber" label="Número de teléfono" />
        </Stack>
      ),
    },
    {
      label: 'Información de la empresa',
      description: (
        <Stack spacing={2.5}>
          <Typography>Introduzca la información de su empresa:</Typography>
          <RHFTextField name="companyName" label="Nombre de la empresa" />
          <RHFTextField name="address" label="Dirección" />
        </Stack>
      ),
    },
    {
      label: 'Cedula de Identidad',
      description: (
        <Stack>
          <Typography>Introduzca la documentación de su empresa:</Typography>
          <Card sx={{ maxWidth: '300px' }}>
            <CardHeader title="Cédula de Identidad" />
            <CardContent sx={{ maxHeight: '400px' }}>
              <Upload
                file={identificationCard}
                onDrop={indentificationCardRender}
                onDelete={() => setidentificationCard(null)}
              />
            </CardContent>
          </Card>
        </Stack>
      ),
    },
    {
      label: 'Cámara de Comercio',
      description: (
        <Stack>
          <Card sx={{ maxWidth: '300px' }}>
            <CardHeader title="Cámara de Comercio" />
            <CardContent sx={{ maxHeight: '400px' }}>
              <Upload
                file={businessChamber}
                onDrop={businessChamberRender}
                onDelete={() => setbusinessChamber(null)}
              />
            </CardContent>
          </Card>
        </Stack>
      ),
    },
    {
      label: 'Registro',
      description: (
        <Stack>
          <Card sx={{ maxWidth: '300px' }}>
            <CardHeader title="Registro" />
            <CardContent sx={{ maxHeight: '400px' }}>
              <Upload
                file={businessRegistration}
                onDrop={businessRegistrationRender}
                onDelete={() => setbusinessRegistration(null)}
              />
            </CardContent>
          </Card>
        </Stack>
      ),
    },
    {
      label: 'Contraseña',
      description: (
        <Stack spacing={2.5}>
          <Typography>Establezca su contraseña:</Typography>
          <RHFTextField name="password" label="Contraseña" type="password" />
          <RHFTextField name="confirmPassword" label="Confirmar contraseña" type="password" />
        </Stack>
      ),
    },
  ];

  return (
    <FormProvider {...methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="sm">
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                optional={
                  index === 5 ? <Typography variant="caption">Último paso</Typography> : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                {step.description}
                <Box sx={{ mt: 3 }}>
                  {index === steps.length - 1 ? (
                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                      Finalizar
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleNext}>
                      Continuar
                    </Button>
                  )}
                  <Button disabled={index === 0} onClick={handleBack}>
                    Atrás
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper sx={{ p: 3, mt: 3, bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12) }}>
            <Typography paragraph>Todos los pasos completados - ha terminado</Typography>
            <Button onClick={handleReset}>Reiniciar</Button>
          </Paper>
        )}
      </Container>
    </FormProvider>
  );
}
