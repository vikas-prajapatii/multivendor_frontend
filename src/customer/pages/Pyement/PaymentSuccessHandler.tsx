import { Backdrop, Button, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import store, { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { paymentSuccess } from "../../../Redux Toolkit/Customer/OrderSlice";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccessHandler = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { orders } = useAppSelector(store => store)
    const navigate=useNavigate();

    const getQueryParam = (key: string): string | null => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };
    const paymentId = getQueryParam("razorpay_payment_id");
    const paymentLinkId = getQueryParam("razorpay_payment_link_id");
    // const paymentId="cs_test_a1eU8pFuXZJlg3tiahN153QykvQl6LI5hLgSnUUh01alidIPrMU8KyDx67"

    useEffect(() => {
        if (paymentId) {
            dispatch(
                paymentSuccess({
                    paymentId,
                    paymentLinkId: paymentLinkId || "",
                    jwt: localStorage.getItem("jwt") || "",
                })
            );
        }
    }, [paymentId]);


    return (
        <div className="min-h-[85vh] flex justify-center items-center px-4">
            <div className="bg-[#121217] border border-white/10 p-8 sm:p-10 max-w-md w-full rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F7]">
                        Payment Successful!
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Thank you for your purchase. Your order has been placed and is being prepared for dispatch.
                    </p>
                </div>

                <div className="w-full space-y-3 pt-2">
                    <Button 
                        onClick={() => navigate("/account/orders")} 
                        fullWidth
                        variant="contained"
                        sx={{
                            bgcolor: "#C5A059",
                            color: "#0B0B0E",
                            fontWeight: 700,
                            py: 1.2,
                            borderRadius: "0.75rem",
                            textTransform: "none",
                            fontSize: "1rem",
                            '&:hover': { bgcolor: "#D4AF37" }
                        }}
                    >
                        View My Orders
                    </Button>
                    <Button 
                        onClick={() => navigate("/")} 
                        fullWidth
                        variant="outlined"
                        sx={{
                            borderColor: "rgba(255,255,255,0.2)",
                            color: "#F5F5F7",
                            fontWeight: 600,
                            py: 1.2,
                            borderRadius: "0.75rem",
                            textTransform: "none",
                            fontSize: "1rem",
                            '&:hover': { borderColor: "#C5A059", color: "#C5A059" }
                        }}
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessHandler;
