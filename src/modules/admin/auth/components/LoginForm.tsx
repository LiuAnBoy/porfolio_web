'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/** Validation schema for the login form. */
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/** Form values derived from the login schema. */
type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Admin login form component.
 * Handles credential-based authentication via NextAuth and redirects
 * to the admin dashboard on success.
 */
export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Submits login credentials to NextAuth.
   *
   * @param values - Email and password entered by the user.
   */
  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        setServerError('Invalid email or password');
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setServerError(
        'Network error. Please check your connection and try again.',
      );
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        px: { xs: 3, sm: 0 },
      }}
    >
      {/* Logo mark */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.hover',
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        </Box>
      </Box>

      {/* Heading */}
      <Typography
        variant="h5"
        fontWeight={600}
        textAlign="center"
        letterSpacing="-0.5px"
        gutterBottom
        sx={{ fontFamily: "'Fira Code', monospace" }}
      >
        Portfolio Admin
      </Typography>
      <Divider sx={{ mb: 4, mt: 3, borderColor: 'divider' }} />

      {/* Error alert */}
      {serverError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            bgcolor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#fca5a5',
            '& .MuiAlert-icon': { color: '#ef4444' },
          }}
        >
          {serverError}
        </Alert>
      )}

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          variant="outlined"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'text.secondary' },
            },
          }}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          fullWidth
          variant="outlined"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'divider' },
              '&:hover fieldset': { borderColor: 'text.secondary' },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          size="large"
          sx={{
            mt: 1,
            py: 1.5,
            fontWeight: 600,
            letterSpacing: '0.5px',
            transition: 'opacity 150ms ease',
            '&:hover': { opacity: 0.88 },
            cursor: 'pointer',
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Sign In'
          )}
        </Button>
      </Box>
    </Box>
  );
}
