import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { paymentSuccess } from "../../../Redux Toolkit/Customer/OrderSlice";
import { fetchUserCart } from "../../../Redux Toolkit/Customer/CartSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const PaymentSuccessHandler = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = useParams();

    const getQueryParam = (key: string): string | null => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };

    const paymentId = getQueryParam("razorpay_payment_id");
    const paymentLinkId = getQueryParam("razorpay_payment_link_id");
    const paymentMethod = getQueryParam("payment_method");
    const orderIdParam = getQueryParam("order_id") || orderId;
    const isCod = paymentMethod === "COD" || paymentId?.startsWith("cod_");

    useEffect(() => {
        const jwt = localStorage.getItem("jwt") || "";
        if (paymentId) {
            dispatch(
                paymentSuccess({
                    paymentId,
                    paymentLinkId: paymentLinkId || "",
                    jwt,
                })
            );
        }
        // Refresh cart to show 0 items after successful order
        if (jwt) {
            dispatch(fetchUserCart(jwt));
        }
    }, [paymentId, dispatch]);

    return (
        <div className="min-h-[85vh] flex justify-center items-center px-4 py-12">
            <div className="bg-[#121217] border border-white/10 p-8 sm:p-10 max-w-lg w-full rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-6 animate-fadeIn">
                {/* Checkmark Badge */}
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <CheckCircleIcon sx={{ fontSize: 44, color: "#10B981" }} />
                </div>
                
                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059] px-3 py-1 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/20">
                        {isCod ? "Cash on Delivery Confirmed" : "Payment Verified"}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F7] pt-1">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                        {isCod 
                            ? "Thank you! Your order has been placed with Cash on Delivery. You can pay with cash or UPI upon package arrival."
                            : "Thank you for your purchase! Your payment has been received and your order is being prepared for dispatch."
                        }
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-left space-y-2 text-xs text-zinc-300">
                    {orderIdParam && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-zinc-400">Order Reference</span>
                            <span className="font-bold text-[#F5F5F7] tracking-wide">#ORD-{orderIdParam}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-zinc-400">Payment Mode</span>
                        <span className="font-medium text-[#DFBA73]">
                            {isCod ? "Cash on Delivery (COD)" : "Online Payment (Paid)"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Estimated Delivery</span>
                        <span className="font-medium text-emerald-400">Within 3 - 5 business days</span>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="w-full space-y-3 pt-2">
                    <Button 
                        onClick={() => navigate("/account/orders")} 
                        fullWidth
                        variant="contained"
                        startIcon={<LocalShippingIcon />}
                        sx={{
                            bgcolor: "#C5A059",
                            color: "#0B0B0E",
                            fontWeight: 700,
                            py: 1.3,
                            borderRadius: "0.75rem",
                            textTransform: "none",
                            fontSize: "1rem",
                            boxShadow: "0 10px 25px -5px rgba(197, 160, 89, 0.3)",
                            '&:hover': { bgcolor: "#D4AF37" }
                        }}
                    >
                        Track Order Now
                    </Button>
                    <Button 
                        onClick={() => navigate("/")} 
                        fullWidth
                        variant="outlined"
                        startIcon={<ShoppingBagIcon />}
                        sx={{
                            borderColor: "rgba(255,255,255,0.2)",
                            color: "#F5F5F7",
                            fontWeight: 600,
                            py: 1.2,
                            borderRadius: "0.75rem",
                            textTransform: "none",
                            fontSize: "0.95rem",
                            '&:hover': { borderColor: "#C5A059", color: "#C5A059", bgcolor: "rgba(197, 160, 89, 0.05)" }
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
