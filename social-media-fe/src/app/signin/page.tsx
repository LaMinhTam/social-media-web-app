"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LayoutAuthentication from "@/layout/LayoutAuthentication";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SOCIAL_MEDIA_API } from "@/apis/constants";
import { saveAccessToken, saveRefreshToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import saveUserInfoToCookie from "@/utils/auth/saveUserInfoToCookie";
import { fetchingMe } from "@/services/profile.service";
import axios from "@/apis/axios";
import { AxiosResponse } from "axios";
import apiRoutes from "@/apis";
import { Member } from "@/types/conversationType";

const schema = yup.object({
    email: yup
        .string()
        .email()
        .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
            message: "Email is not valid",
        })
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
            }
        )
        .required("Password is required"),
});

export default function SignInPage() {
    const route = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: yupResolver(schema),
    });
    const handleSignIn = handleSubmit(async (data) => {
        if (!data) return;
        try {
            const response = await SOCIAL_MEDIA_API.AUTH.login(
                data.email,
                data.password
            );
            if (response.status === 200) {
                const meResponse: AxiosResponse<Member> = await axios.get(
                    apiRoutes.user.getMe,
                    {
                        headers: {
                            Authorization: `Bearer ${response.data.accessToken}`,
                        },
                    }
                );
                if (meResponse.status === 200) {
                    saveAccessToken(response.data.accessToken);
                    saveRefreshToken(response.data.refreshToken);
                    saveUserInfoToCookie(
                        meResponse.data,
                        response.data.accessToken
                    );
                    route.push("/");
                    toast.success("Sign in successfully");
                }
            }
        } catch (error) {
            toast.error("Username or password is incorrect");
            console.error(error);
        }
    });

    return (
        <LayoutAuthentication
            header="Sign In"
            title="Or sign in with email or phone number"
        >
            <Box
                component="form"
                noValidate
                onSubmit={handleSignIn}
                sx={{ mt: 1 }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email address or phone number"
                    {...register("email")}
                    autoFocus
                />
                {errors.email?.message && (
                    <span className="error-input">{errors.email.message}</span>
                )}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password")}
                    id="password"
                />
                <div>
                    {errors.password?.message && (
                        <span className="error-input">
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ mt: 3, mb: 2, px: 6, py: 2 }}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </LayoutAuthentication>
    );
}
