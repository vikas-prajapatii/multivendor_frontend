/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CircularProgress, TextField, InputAdornment, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import OTPInput from '../../components/OtpFild/OTPInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { sendLoginOtp, verifyLoginOtp } from '../../../Redux Toolkit/Seller/sellerAuthenticationSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SellerLoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { sellerAuth } = useAppSelector((store) => store);

    // Mode: 'password' (default) or 'otp'
    const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState<number>(30);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

    // Password-based Formik
    const passwordFormik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
            dispatch(verifyLoginOtp({ email: values.email.trim(), password: values.password, navigate }));
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
            dispatch(verifyLoginOtp({ email: values.email.trim(), otp, navigate }));
        },
    });

    const handleOtpChange = (otpVal: string) => {
        setOtp(otpVal);
    };

    const handleSendOTP = () => {
        if (!otpFormik.values.email || otpFormik.errors.email) {
            otpFormik.setFieldTouched('email', true);
            return;
        }
        dispatch(sendLoginOtp(otpFormik.values.email.trim()));
        setTimer(30);
        setIsTimerActive(true);
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
            <div className="text-center mb-6">
                <h1 className="font-serif font-bold text-2xl text-[#F5F5F7]">
                    {loginMode === 'password' ? 'Seller Portal Login' : 'Login With OTP'}
                </h1>
                <p className="text-xs text-[#A0A0A9] mt-1">
                    {loginMode === 'password'
                        ? 'Enter your seller credentials to access your merchant dashboard'
                        : 'Enter your registered seller email to receive a secure code'}
                </p>
            </div>

            {/* PASSWORD LOGIN MODE (DEFAULT) */}
            {loginMode === 'password' && (
                <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        id="seller-login-email"
                        name="email"
                        type="email"
                        label="Seller Email"
                        placeholder="merchant@domain.com"
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
                        id="seller-login-password"
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

                    <Button
                        type="submit"
                        disabled={sellerAuth.loading}
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
                            },
                        }}
                    >
                        {sellerAuth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Login to Dashboard'}
                    </Button>

                    <div className="pt-2 text-center">
                        <button
                            type="button"
                            onClick={() => setLoginMode('otp')}
                            className="text-xs text-[#A0A0A9] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <KeyOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Or log in using email OTP</span>
                        </button>
                    </div>
                </form>
            )}

            {/* OTP LOGIN MODE */}
            {loginMode === 'otp' && (
                <form onSubmit={otpFormik.handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        id="seller-otp-email"
                        name="email"
                        type="email"
                        label="Seller Email"
                        placeholder="merchant@domain.com"
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

                    {sellerAuth.otpSent && (
                        <div className="space-y-3 pt-1">
                            <p className="font-medium text-xs text-[#A0A0A9]">
                                * Enter the 6-digit OTP code sent to your email:
                            </p>
                            <OTPInput length={6} onChange={handleOtpChange} error={false} />
                            <div className="text-xs text-[#A0A0A9] flex items-center justify-between">
                                <span>
                                    {isTimerActive ? `Resend in ${timer}s` : "Didn't receive code?"}
                                </span>
                                {!isTimerActive && (
                                    <span
                                        onClick={handleSendOTP}
                                        className="text-[#C5A059] cursor-pointer hover:underline font-semibold"
                                    >
                                        Resend OTP
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {!sellerAuth.otpSent ? (
                        <Button
                            type="button"
                            disabled={sellerAuth.loading}
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
                            {sellerAuth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Send OTP'}
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            disabled={sellerAuth.loading || otp.length < 6}
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
                            {sellerAuth.loading ? <CircularProgress size={24} sx={{ color: '#070708' }} /> : 'Verify & Login'}
                        </Button>
                    )}

                    <div className="pt-2 text-center">
                        <button
                            type="button"
                            onClick={() => setLoginMode('password')}
                            className="text-xs text-[#A0A0A9] hover:text-[#C5A059] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <LockOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Switch back to password login</span>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SellerLoginForm;