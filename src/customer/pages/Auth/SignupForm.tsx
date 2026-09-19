/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
    Button,
    CircularProgress,
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signup } from '../../../Redux Toolkit/Customer/AuthSlice';
import OTPInput from '../../components/OtpFild/OTPInput';

const SignupForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((store) => store);

    // Mode: 'direct' (Name + Email + Password) vs 'otp' (Verify with OTP)
    const [signupMode, setSignupMode] = useState<'direct' | 'otp'>('direct');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

    // Direct registration formik
    const directFormik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .min(2, 'Name must be at least 2 characters')
                .required('Full Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: (values) => {
            dispatch(
                signup({
                    fullName: values.fullName.trim(),
                    email: values.email.trim(),
                    password: values.password,
                    navigate,
                })
            );
        },
    });

    // OTP-assisted registration formik
    const otpFormik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .min(2, 'Name must be at least 2 characters')
                .required('Full Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            if (!otp || otp.length < 6) {
                alert('Please enter a valid 6-digit OTP code');
                return;
            }
            dispatch(
                signup({
                    fullName: values.fullName.trim(),
                    email: values.email.trim(),
                    password: values.password,
                    otp,
                    navigate,
                })
            );
        },
    });

    const handleSendOTP = () => {
        if (!otpFormik.values.email || otpFormik.errors.email) {
            otpFormik.setFieldTouched('email', true);
            return;
        }
        dispatch(sendLoginSignupOtp({ email: otpFormik.values.email.trim() }));
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleOtpChange = (val: string) => {
        setOtp(val);
    };

    useEffect(() => {
        let interval: any;
        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive]);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#F5F5F7] tracking-wide">
                    Create Account
                </h2>
                <p className="text-sm text-[#A0A0A9] mt-1">
                    Join Noir Bazaar for bespoke luxury & exclusive privileges
                </p>
            </div>

            {/* DIRECT REGISTRATION MODE (NAME + EMAIL + PASSWORD) */}
            {signupMode === 'direct' && (
                <form onSubmit={directFormik.handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        id="signup-name"
                        name="fullName"
                        type="text"
                        label="Full Name"
                        placeholder="Alexander Vance"
                        value={directFormik.values.fullName}
                        onChange={directFormik.handleChange}
                        onBlur={directFormik.handleBlur}
                        error={directFormik.touched.fullName && Boolean(directFormik.errors.fullName)}
                        helperText={directFormik.touched.fullName ? directFormik.errors.fullName : undefined}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon sx={{ color: '#C5A059' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="signup-email"
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="yourname@example.com"
                        value={directFormik.values.email}
                        onChange={directFormik.handleChange}
                        onBlur={directFormik.handleBlur}
                        error={directFormik.touched.email && Boolean(directFormik.errors.email)}
                        helperText={directFormik.touched.email ? directFormik.errors.email : undefined}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: '#C5A059' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="signup-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        placeholder="At least 6 characters"
                        value={directFormik.values.password}
                        onChange={directFormik.handleChange}
                        onBlur={directFormik.handleBlur}
                        error={directFormik.touched.password && Boolean(directFormik.errors.password)}
                        helperText={directFormik.touched.password ? directFormik.errors.password : undefined}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: '#C5A059' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                            sx={{ color: '#A0A0A9' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        placeholder="Re-enter password"
                        value={directFormik.values.confirmPassword}
                        onChange={directFormik.handleChange}
                        onBlur={directFormik.handleBlur}
                        error={directFormik.touched.confirmPassword && Boolean(directFormik.errors.confirmPassword)}
                        helperText={directFormik.touched.confirmPassword ? directFormik.errors.confirmPassword : undefined}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: '#C5A059' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            size="small"
                                            sx={{ color: '#A0A0A9' }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        disabled={auth.loading}
                        fullWidth
                        variant="contained"
                        sx={{
                            py: '12px',
                            background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7D3B 100%)',
                            color: '#070708',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            letterSpacing: '0.05em',
                            borderRadius: '10px',
                            boxShadow: '0 4px 14px rgba(197, 160, 89, 0.25)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #E8C885 0%, #D4AF37 50%, #B88E3E 100%)',
                                boxShadow: '0 6px 20px rgba(197, 160, 89, 0.35)',
                            },
                        }}
                    >
                        {auth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Create Account'}
                    </Button>

                    <div className="pt-1 text-center">
                        <button
                            type="button"
                            onClick={() => setSignupMode('otp')}
                            className="text-xs text-[#A0A0A9] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <KeyOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Or verify email with OTP before sign up</span>
                        </button>
                    </div>
                </form>
            )}

            {/* OTP VERIFICATION MODE */}
            {signupMode === 'otp' && (
                <form onSubmit={otpFormik.handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        id="otp-signup-name"
                        name="fullName"
                        type="text"
                        label="Full Name"
                        placeholder="Alexander Vance"
                        value={otpFormik.values.fullName}
                        onChange={otpFormik.handleChange}
                        onBlur={otpFormik.handleBlur}
                        error={otpFormik.touched.fullName && Boolean(otpFormik.errors.fullName)}
                        helperText={otpFormik.touched.fullName ? otpFormik.errors.fullName : undefined}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon sx={{ color: '#C5A059' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="otp-signup-email"
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="yourname@example.com"
                        value={otpFormik.values.email}
                        onChange={otpFormik.handleChange}
                        onBlur={otpFormik.handleBlur}
                        error={otpFormik.touched.email && Boolean(otpFormik.errors.email)}
                        helperText={otpFormik.touched.email ? otpFormik.errors.email : undefined}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: '#C5A059' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        id="otp-signup-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Create Password"
                        placeholder="At least 6 characters"
                        value={otpFormik.values.password}
                        onChange={otpFormik.handleChange}
                        onBlur={otpFormik.handleBlur}
                        error={otpFormik.touched.password && Boolean(otpFormik.errors.password)}
                        helperText={otpFormik.touched.password ? otpFormik.errors.password : undefined}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: '#C5A059' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                            sx={{ color: '#A0A0A9' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {auth.otpSent && (
                        <div className="space-y-3 pt-1">
                            <p className="font-medium text-xs text-[#A0A0A9]">
                                Enter the 6-digit OTP sent to your email:
                            </p>
                            <OTPInput length={6} onChange={handleOtpChange} error={false} />
                            <div className="text-xs text-[#A0A0A9] flex items-center justify-between">
                                <span>
                                    {isTimerActive
                                        ? `Resend available in ${timer}s`
                                        : "Didn't receive code?"}
                                </span>
                                {!isTimerActive && (
                                    <span
                                        onClick={handleSendOTP}
                                        className="text-[#C5A059] cursor-pointer hover:underline font-semibold"
                                    >
                                        Resend Code
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {!auth.otpSent ? (
                        <Button
                            type="button"
                            disabled={auth.loading}
                            onClick={handleSendOTP}
                            fullWidth
                            variant="contained"
                            sx={{
                                py: '12px',
                                background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7D3B 100%)',
                                color: '#070708',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                            }}
                        >
                            {auth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Send Verification OTP'}
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={auth.loading || otp.length < 6}
                            fullWidth
                            variant="contained"
                            sx={{
                                py: '12px',
                                background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7D3B 100%)',
                                color: '#070708',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                            }}
                        >
                            {auth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Verify & Complete Registration'}
                        </Button>
                    )}

                    <div className="pt-1 text-center">
                        <button
                            type="button"
                            onClick={() => setSignupMode('direct')}
                            className="text-xs text-[#A0A0A9] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <PersonOutlineIcon sx={{ fontSize: 16 }} />
                            <span>Switch back to standard sign up</span>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SignupForm;