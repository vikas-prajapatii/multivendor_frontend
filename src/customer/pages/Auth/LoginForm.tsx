/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
    Button,
    CircularProgress,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signin, resetPasswordRequest } from '../../../Redux Toolkit/Customer/AuthSlice';
import OTPInput from '../../components/OtpFild/OTPInput';

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector((store) => store);

    // Mode: 'password' (default) or 'otp'
    const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

    // Forgot Password modal state
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotStatus, setForgotStatus] = useState<string | null>(null);

    // Password-based Formik
    const passwordFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
        }),
        onSubmit: (values) => {
            dispatch(signin({ email: values.email.trim(), password: values.password, navigate }));
        },
    });

    // OTP-based Formik
    const otpFormik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: (values) => {
            if (!otp || otp.length < 6) {
                alert('Please enter a valid 6-digit OTP');
                return;
            }
            dispatch(signin({ email: values.email.trim(), otp, navigate }));
        },
    });

    const handleSendOTP = () => {
        if (!otpFormik.values.email || otpFormik.errors.email) {
            otpFormik.setFieldTouched('email', true);
            return;
        }
        dispatch(sendLoginSignupOtp({ email: 'signing_' + otpFormik.values.email.trim() }));
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleOtpChange = (val: string) => {
        setOtp(val);
    };

    // OTP timer countdown
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

    const handleSendResetLink = () => {
        if (!forgotEmail) return;
        dispatch(resetPasswordRequest({ email: forgotEmail }));
        setForgotStatus('Password reset link has been dispatched to your email.');
        setTimeout(() => {
            setForgotPasswordOpen(false);
            setForgotStatus(null);
            setForgotEmail('');
        }, 3000);
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#F5F5F7] tracking-wide">
                    {loginMode === 'password' ? 'Welcome Back' : 'OTP Sign In'}
                </h2>
                <p className="text-sm text-[#A0A0A9] mt-1">
                    {loginMode === 'password'
                        ? 'Enter your credentials to access your account'
                        : 'Enter your email to receive a secure login code'}
                </p>
            </div>

            {/* PASSWORD LOGIN MODE (DEFAULT) */}
            {loginMode === 'password' && (
                <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        id="login-email"
                        name="email"
                        type="email"
                        label="Email Address"
                        placeholder="yourname@example.com"
                        value={passwordFormik.values.email}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        error={passwordFormik.touched.email && Boolean(passwordFormik.errors.email)}
                        helperText={passwordFormik.touched.email ? passwordFormik.errors.email : undefined}
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
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        placeholder="••••••••"
                        value={passwordFormik.values.password}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        error={passwordFormik.touched.password && Boolean(passwordFormik.errors.password)}
                        helperText={passwordFormik.touched.password ? passwordFormik.errors.password : undefined}
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

                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setForgotPasswordOpen(true)}
                            className="text-xs text-[#C5A059] hover:text-[#E8C885] transition-colors font-medium cursor-pointer"
                        >
                            Forgot Password?
                        </button>
                    </div>

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
                        {auth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Sign In'}
                    </Button>

                    <div className="pt-2 text-center">
                        <button
                            type="button"
                            onClick={() => setLoginMode('otp')}
                            className="text-xs text-[#A0A0A9] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <KeyOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Or sign in using email OTP</span>
                        </button>
                    </div>
                </form>
            )}

            {/* OTP LOGIN MODE (FALLBACK) */}
            {loginMode === 'otp' && (
                <form onSubmit={otpFormik.handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        id="otp-email"
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
                            {auth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Send OTP Code'}
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
                            {auth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Verify & Sign In'}
                        </Button>
                    )}

                    <div className="pt-2 text-center">
                        <button
                            type="button"
                            onClick={() => setLoginMode('password')}
                            className="text-xs text-[#A0A0A9] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <LockOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Switch back to password sign in</span>
                        </button>
                    </div>
                </form>
            )}

            {/* FORGOT PASSWORD DIALOG */}
            <Dialog
                open={forgotPasswordOpen}
                onClose={() => setForgotPasswordOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: '#16161D',
                        border: '1px solid rgba(197, 160, 89, 0.2)',
                        borderRadius: '16px',
                        p: 1,
                    },
                }}
            >
                <DialogTitle sx={{ color: '#F5F5F7', fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem' }}>
                    Reset Password
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#A0A0A9', mb: 2 }}>
                        Enter your registered email address below. We will dispatch a password reset link to your inbox.
                    </Typography>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        sx={{ mt: 1 }}
                    />
                    {forgotStatus && (
                        <Typography variant="caption" sx={{ color: '#10B981', mt: 1.5, display: 'block' }}>
                            {forgotStatus}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setForgotPasswordOpen(false)} sx={{ color: '#A0A0A9' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSendResetLink}
                        variant="contained"
                        disabled={!forgotEmail || auth.loading}
                        sx={{
                            background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 100%)',
                            color: '#070708',
                            fontWeight: 'bold',
                        }}
                    >
                        Send Reset Link
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LoginForm;