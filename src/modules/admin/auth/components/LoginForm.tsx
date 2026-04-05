"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

/** Validation schema for the login form. */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
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

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <Card sx={{ width: "100%", maxWidth: 400 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom textAlign="center">
          Portfolio Admin
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            size="large"
            sx={{ mt: 1 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
