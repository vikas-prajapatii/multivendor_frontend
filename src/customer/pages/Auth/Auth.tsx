import React, { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Alert, Snackbar } from '@mui/material';
import { useAppSelector } from '../../../Redux Toolkit/Store';

const Auth = () => {
    const [isLoginPage, setIsLoginPage] = useState(true);
    const { auth } = useAppSelector((store) => store);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleCloseSnackbar = () => setSnackbarOpen(false);

    useEffect(() => {
        if (auth.otpSent || auth.error) {
            setSnackbarOpen(true);
        }
    }, [auth.otpSent, auth.error]);

    return (
        <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden bg-[#070708]">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-yellow-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* Auth Card */}
            <div className="max-w-md w-full relative z-10 bg-[#141419]/90 backdrop-blur-2xl border border-amber-500/20 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/80">
                {/* Brand Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/10 mb-3 shadow-inner shadow-amber-500/20">
                        <span className="font-serif text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            NB
                        </span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold tracking-wider bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                        NOIR BAZAAR
                    </h1>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-amber-500/70 mt-1 font-medium">
                        Haute Couture & Bespoke Luxury
                    </p>
                </div>

                {/* Segmented Tab Switcher */}
                <div className="grid grid-cols-2 p-1 bg-[#0A0A0D] border border-white/5 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setIsLoginPage(true)}
                        className={`py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                            isLoginPage
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
                                : 'text-[#A0A0A9] hover:text-white'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLoginPage(false)}
                        className={`py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                            !isLoginPage
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
                                : 'text-[#A0A0A9] hover:text-white'
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                {/* Form Container */}
                <div>
                    {isLoginPage ? <LoginForm /> : <SignupForm />}
                </div>

                {/* Bottom Switch Footer */}
                <div className="mt-8 pt-5 border-t border-white/5 text-center text-xs text-[#A0A0A9]">
                    <span>{isLoginPage ? "Don't have a Noir Bazaar account? " : 'Already registered with us? '}</span>
                    <button
                        type="button"
                        onClick={() => setIsLoginPage(!isLoginPage)}
                        className="text-[#C5A059] hover:text-[#E8C885] font-semibold hover:underline cursor-pointer ml-1"
                    >
                        {isLoginPage ? 'Create account' : 'Sign in'}
                    </button>
                </div>
            </div>

            {/* Notification Snackbar */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={auth.error ? 'error' : 'success'}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '10px',
                        backgroundColor: auth.error ? '#DC2626' : '#059669',
                    }}
                >
                    {auth.error ? auth.error : 'OTP code sent to your email address!'}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Auth;