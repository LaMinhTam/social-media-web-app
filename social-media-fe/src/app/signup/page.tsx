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
import { useRouter } from "next/navigation";
import { saveAccessToken, saveRefreshToken } from "@/utils/auth";
import { toast } from "react-toastify";
import { fetchingMe } from "@/services/profile.service";
import saveUserInfoToCookie from "@/utils/auth/saveUserInfoToCookie";
import axios from "@/apis/axios";
import { AxiosResponse } from "axios";
import apiRoutes from "@/apis";
import { Member } from "@/types/conversationType";

const schema = yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
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
    term: yup.bool().oneOf([true], "You must accept the terms and conditions"),
});

export default function SignUpPage() {
    const route = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            term: false,
        },
        resolver: yupResolver(schema),
    });
    const handleSignUp = handleSubmit(async (data) => {
        console.log("Running handleSignUp");
        if (!data) return;
        try {
            const response = await SOCIAL_MEDIA_API.AUTH.createUser(
                data.firstName + " " + data.lastName,
                data.email,
                data.password
            );
            console.log("handleSignUp ~ response:", response);
            if (response.status === 201) {
                const loginResponse = await SOCIAL_MEDIA_API.AUTH.login(
                    data.email,
                    data.password
                );
                if (loginResponse.status === 200) {
                    const meResponse: AxiosResponse<Member> = await axios.get(
                        apiRoutes.user.getMe,
                        {
                            headers: {
                                Authorization: `Bearer ${loginResponse.data.accessToken}`,
                            },
                        }
                    );
                    console.log("handleSignUp ~ meResponse:", meResponse);
                    if (meResponse.status === 200) {
                        saveAccessToken(loginResponse.data.accessToken);
                        saveRefreshToken(loginResponse.data.refreshToken);
                        saveUserInfoToCookie(
                            meResponse.data,
                            loginResponse.data.accessToken
                        );
                        route.push("/");
                        toast.success("Sign up successfully");
                    }
                }
            } else {
                console.error("Failed to sign up", response.data.message);
            }
        } catch (error) {
            console.error("Failed to sign up", error);
        }
    });

    return (
        <LayoutAuthentication
            header="Sign Up"
            title="Or sign up with email or phone number"
        >
            <Box
                component="form"
                noValidate
                onSubmit={handleSignUp}
                sx={{ mt: 3 }}
            >
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            gap: 1,
                        }}
                    >
                        <TextField
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            {...register("firstName")}
                            autoFocus
                        />
                        {errors.firstName?.message && (
                            <span className="error-input">
                                {errors.firstName.message}
                            </span>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            gap: 1,
                        }}
                    >
                        <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            {...register("lastName")}
                        />
                        {errors.lastName?.message && (
                            <span className="error-input">
                                {errors.lastName.message}
                            </span>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            gap: 1,
                        }}
                    >
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email address or phone number"
                            {...register("email")}
                            autoComplete="email"
                        />
                        {errors.email?.message && (
                            <span className="error-input">
                                {errors.email.message}
                            </span>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            gap: 1,
                        }}
                    >
                        <TextField
                            required
                            fullWidth
                            {...register("password")}
                            label="Password"
                            type="password"
                            id="password"
                        />
                        {errors.password?.message && (
                            <span className="error-input">
                                {errors.password.message}
                            </span>
                        )}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            gap: 1,
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={watch("term")}
                                    onChange={(e) =>
                                        setValue("term", e.target.checked)
                                    }
                                    color="primary"
                                />
                            }
                            label="I agree to the terms and conditions."
                        />
                        {errors.term?.message && (
                            <span className="error-input">
                                {errors.term.message}
                            </span>
                        )}
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ mt: 3, mb: 2, px: 6, py: 2 }}
                >
                    Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/signin" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </LayoutAuthentication>
    );
}
