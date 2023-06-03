import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  alpha,
} from '@mui/material';
import { Navigate } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useCallback } from 'react';
import { PhoneNumberUtil } from 'google-libphonenumber';
import EmailSuccess from '../../animation/email-succes/EmailSuccess';
import { RHFTextField } from '../../components/hook-form';
import { Upload } from '../../components/upload';

export default function VerticalRegisterForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const dispatch = useDispatch();

  const [businessRegistration, setbusinessRegistration] = useState('');
  const [identificationCard, setidentificationCard] = useState('');
  const [camaraComercio, setcamaraComercio] = useState('');
  const phoneUtil = PhoneNumberUtil.getInstance();

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
    phoneNumber: Yup.string()
      .required('El número de teléfono es requerido')
      .test('is-valid-phone', 'El número de teléfono no es válido', (value) => {
        try {
          const number = phoneUtil.parseAndKeepRawInput(value, 'CO');
          return phoneUtil.isValidNumber(number);
        } catch (err) {
          return false;
        }
      }),
    identificationCard: Yup.mixed().test(
      'fileSize',
      'El tamaño máximo de la imagen es de 60MB',
      (value) => {
        if (!value) return false;
        return value.size <= 60 * 1024 * 1024;
      }
    ),
    businessRegistration: Yup.mixed().test(
      'fileSize',
      'El tamaño máximo de la imagen es de 60MB',
      (value) => {
        if (!value) return false;
        return value.size <= 60 * 1024 * 1024;
      }
    ),
    camaraComercio: Yup.mixed().test(
      'fileSize',
      'El tamaño máximo de la imagen es de 60MB',
      (value) => {
        if (!value) return false;
        return value.size <= 60 * 1024 * 1024;
      }
    ),
  });

  const handleNext = async () => {
    const currentStepFields = stepFields[activeStep];

    // Ejecuta la validación de todos los campos en el paso actual
    const isFormValid = await methods.trigger(currentStepFields);

    // Si la validación falla, no avanza al siguiente paso
    if (!isFormValid) {
      return;
    }

    // Verifica si los campos que representan archivos están vacíos
    const emptyFileFields = currentStepFields.filter(
      (field) => stepFields.includes(field) && !methods.getValues(field)
    );

    // Verifica si los campos de texto están vacíos
    const emptyTextFields = currentStepFields.filter(
      (field) =>
        !stepFields.includes(field) &&
        (typeof methods.getValues(field) === 'string'
          ? methods.getValues(field).trim() === ''
          : !methods.getValues(field))
    );

    if (emptyFileFields.length === 0 && emptyTextFields.length === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(RegisterSchema),
  });

  const camaraComercioRender = useCallback(
    (acceptedFiles) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        setcamaraComercio(
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        );
        methods.setValue('camaraComercio', newFile, { shouldValidate: true });
      }
    },
    [methods]
  );

  const businessRegistrationRender = useCallback(
    (acceptedFiles) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        setbusinessRegistration(
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        );
        methods.setValue('businessRegistration', newFile, { shouldValidate: true });
      }
    },
    [methods]
  );

  const indentificationCardRender = useCallback(
    (acceptedFiles) => {
      const newFile = acceptedFiles[0];
      if (newFile) {
        setidentificationCard(
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        );
        methods.setValue('identificationCard', newFile, { shouldValidate: true });
      }
    },
    [methods]
  );

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      formData.append('businessRegistration', businessRegistration);
      formData.append('identificationCard', identificationCard);
      formData.append('camaraComercio', camaraComercio);

      const res = await axios.post('http://localhost:4001/api/v1/customers/register', data, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      console.log(res.data);
    } catch (error) {
      console.error(error);
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
          <Card sx={{ maxWidth: '300px' }}>
            <CardHeader title="Cédula de Identidad" />
            <CardContent sx={{ maxHeight: '400px' }}>
              {errors.identificationCard ? (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                  <AlertTitle>Informacion</AlertTitle>
                  <strong>Sube un archivo valido, por ambas caras en un solo archivo!</strong>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ marginBottom: 2 }}>
                  <AlertTitle>Informacion</AlertTitle>
                  <strong>NO olvides subir la cedula por ambas caras en un solo archivo!</strong>
                </Alert>
              )}
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
              {errors.camaraComercio ? (
                <Alert severity="error" sx={{ marginBottom: 5 }}>
                  <AlertTitle>Informacion</AlertTitle>
                  <strong>Sube un archivo válido!</strong>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ marginBottom: 2 }}>
                  <AlertTitle>Informacion</AlertTitle>
                  Notificación — <strong>Sube el archivo de la Cámara de Comercio</strong>
                </Alert>
              )}
              <Upload
                file={camaraComercio}
                onDrop={camaraComercioRender}
                onDelete={() => setcamaraComercio(null)}
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
              {errors.businessRegistration ? (
                <Alert severity="error" sx={{ marginBottom: 5 }}>
                  <AlertTitle>Informacion</AlertTitle>
                  <strong>Sube un archivo de registro válido.</strong>
                </Alert>
              ) : (
                <Alert severity="info" sx={{ marginBottom: 2 }}>
                  <AlertTitle>Informacion</AlertTitle>
                  Notificación — <strong>Sube el archivo de registro</strong>
                </Alert>
              )}
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

  const stepFields = [
    ['firstName', 'lastName', 'email', 'phoneNumber'], // paso 1
    ['companyName', 'address'], // paso 2
    ['identificationCard'], // paso 3
    ['camaraComercio'], // paso 4
    ['businessRegistration'], // paso 5
    ['password', 'confirmPassword'], // paso 6
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
