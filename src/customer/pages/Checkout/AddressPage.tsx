import React, { useState, useEffect } from 'react'
import { Box, Button, CircularProgress, Divider, Modal, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddressForm from './AddresssForm'
import AddIcon from '@mui/icons-material/Add'
import LockIcon from '@mui/icons-material/Lock'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import PaymentsIcon from '@mui/icons-material/Payments'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import SecurityIcon from '@mui/icons-material/Security'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import StorefrontIcon from '@mui/icons-material/Storefront'
import { createOrder } from '../../../Redux Toolkit/Customer/OrderSlice'
import { fetchUserCart } from '../../../Redux Toolkit/Customer/CartSlice'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import type { Address } from '../../../types/userTypes'
import type { CartItem } from '../../../types/cartTypes'
import { sumCartItemMrpPrice, sumCartItemSellingPrice } from '../../../util/cartCalculator'

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: "92%", sm: 540 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#121217',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '1.25rem',
    boxShadow: 24,
    p: { xs: 2.5, sm: 4 },
    outline: 'none',
};

const AddressPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, orders, auth, cart } = useAppSelector(store => store);

    const jwt = localStorage.getItem('jwt') || auth.jwt;
    const savedAddresses = user.user?.addresses || [];

    const [customAddresses, setCustomAddresses] = useState<Address[]>([]);
    const allAddresses = [...savedAddresses, ...customAddresses];

    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [step, setStep] = useState(jwt ? 2 : 1);
    const [paymentGateway, setPaymentGateway] = useState("COD");
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (jwt) {
            dispatch(fetchUserCart(jwt));
        }
    }, [jwt, dispatch]);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleAddressAdded = (newAddress: Address) => {
        setCustomAddresses(prev => [...prev, newAddress]);
        setSelectedAddressIndex(allAddresses.length);
        setStep(2);
    };

    const selectedAddress = allAddresses[selectedAddressIndex] || allAddresses[0];

    const handleCreateOrder = () => {
        if (!jwt) {
            navigate('/login');
            return;
        }

        if (!selectedAddress) {
            handleOpenModal();
            return;
        }

        dispatch(createOrder({
            paymentGateway,
            address: selectedAddress,
            jwt
        }));
    };

    const cartItems = cart.cart?.cartItems || [];
    const totalMrp = sumCartItemMrpPrice(cartItems);
    const totalSelling = sumCartItemSellingPrice(cartItems);
    const totalDiscount = Math.max(0, totalMrp - totalSelling);

    if (cartItems.length === 0 && !orders.loading) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
                <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-4">
                    <ShoppingBagIcon sx={{ color: "#C5A059", fontSize: 32 }} />
                </div>
                <h1 className="text-2xl font-serif font-bold text-[#F5F5F7] mb-2">
                    Your Shopping Bag is Empty
                </h1>
                <p className="text-zinc-400 text-sm max-w-sm mb-6">
                    Add handcrafted sarees, kurtas, or luxury essentials to your bag to proceed with checkout.
                </p>
                <Button
                    onClick={() => navigate('/')}
                    variant="contained"
                    sx={{
                        bgcolor: "#C5A059",
                        color: "#0B0B0E",
                        fontWeight: 700,
                        px: 4,
                        py: 1.2,
                        borderRadius: "0.75rem",
                        textTransform: "none",
                        '&:hover': { bgcolor: "#D4AF37" }
                    }}
                >
                    Explore Products
                </Button>
            </div>
        );
    }

    return (
        <div className='pt-6 pb-20 px-4 sm:px-8 md:px-16 lg:px-28 xl:px-44 min-h-screen max-w-7xl mx-auto'>
            {/* Top Stepper Breadcrumb / Header */}
            <div className='mb-6'>
                <p className='text-xs font-bold uppercase tracking-widest text-[#C5A059]'>Flipkart Checkout</p>
                <h1 className='text-2xl sm:text-3xl font-serif font-bold text-[#F5F5F7] mt-1'>
                    Complete Your Order
                </h1>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                {/* Left Column: Flipkart-Style Accordion Flow (Steps 1 to 4) */}
                <div className='lg:col-span-2 space-y-4'>

                    {/* ================= STEP 1: LOGIN ================= */}
                    <div className='bg-[#121217] border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all'>
                        <div className={`p-4 sm:p-5 flex items-center justify-between ${step === 1 ? 'border-b border-white/10' : ''}`}>
                            <div className='flex items-center gap-3.5'>
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    jwt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-[#C5A059] text-black'
                                }`}>
                                    {jwt ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : '1'}
                                </span>
                                <div>
                                    <h3 className='font-bold text-sm sm:text-base text-[#F5F5F7] tracking-wide uppercase'>
                                        1. Login & Account
                                    </h3>
                                    {jwt && (
                                        <p className='text-xs text-zinc-400 mt-0.5'>
                                            {user.user?.fullName || auth.user?.fullName || "Valued Customer"} • {user.user?.email || auth.user?.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {jwt ? (
                                <span className='text-xs text-emerald-400 font-bold flex items-center gap-1'>
                                    Verified
                                </span>
                            ) : (
                                <Button
                                    onClick={() => navigate('/login')}
                                    size='small'
                                    variant='outlined'
                                    sx={{
                                        color: '#C5A059',
                                        borderColor: '#C5A059',
                                        borderRadius: '0.5rem',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Login
                                </Button>
                            )}
                        </div>

                        {!jwt && (
                            <div className='p-6 text-center space-y-3 bg-black/20'>
                                <p className='text-sm text-zinc-300'>
                                    Please log in to load your saved delivery addresses and secure your checkout.
                                </p>
                                <Button
                                    onClick={() => navigate('/login')}
                                    variant='contained'
                                    sx={{
                                        bgcolor: '#C5A059',
                                        color: '#0B0B0E',
                                        fontWeight: 700,
                                        px: 4,
                                        borderRadius: '0.75rem',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#D4AF37' }
                                    }}
                                >
                                    Log In / Register
                                </Button>
                            </div>
                        )}
                    </div>


                    {/* ================= STEP 2: DELIVERY ADDRESS ================= */}
                    <div className='bg-[#121217] border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all'>
                        <div className={`p-4 sm:p-5 flex items-center justify-between ${step === 2 ? 'border-b border-white/10' : ''}`}>
                            <div className='flex items-center gap-3.5'>
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    step > 2 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : step === 2 ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/10 text-zinc-500'
                                }`}>
                                    {step > 2 ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : '2'}
                                </span>
                                <div>
                                    <h3 className={`font-bold text-sm sm:text-base tracking-wide uppercase ${
                                        step >= 2 ? 'text-[#F5F5F7]' : 'text-zinc-500'
                                    }`}>
                                        2. Delivery Address
                                    </h3>
                                    {step > 2 && selectedAddress && (
                                        <p className='text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-md'>
                                            {selectedAddress.name} - {selectedAddress.address}, {selectedAddress.city} ({selectedAddress.mobile})
                                        </p>
                                    )}
                                </div>
                            </div>
                            {step > 2 ? (
                                <Button
                                    onClick={() => setStep(2)}
                                    size='small'
                                    sx={{
                                        color: '#C5A059',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        '&:hover': { bgcolor: 'rgba(197, 160, 89, 0.08)' }
                                    }}
                                >
                                    Change
                                </Button>
                            ) : step === 2 && jwt && (
                                <Button
                                    onClick={handleOpenModal}
                                    startIcon={<AddIcon />}
                                    size='small'
                                    sx={{
                                        color: '#C5A059',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        '&:hover': { bgcolor: 'rgba(197, 160, 89, 0.08)' }
                                    }}
                                >
                                    Add New
                                </Button>
                            )}
                        </div>

                        {step === 2 && (
                            <div className='p-4 sm:p-6 space-y-4'>
                                {allAddresses.length === 0 ? (
                                    <div className='p-6 rounded-xl border border-dashed border-white/15 text-center space-y-3'>
                                        <LocationOnIcon sx={{ color: "#C5A059", fontSize: 32 }} />
                                        <p className='text-zinc-300 text-sm'>
                                            You do not have any saved delivery address yet.
                                        </p>
                                        <Button
                                            onClick={handleOpenModal}
                                            variant='contained'
                                            startIcon={<AddIcon />}
                                            sx={{
                                                bgcolor: '#C5A059',
                                                color: '#0B0B0E',
                                                fontWeight: 700,
                                                borderRadius: '0.75rem',
                                                textTransform: 'none',
                                                '&:hover': { bgcolor: '#D4AF37' }
                                            }}
                                        >
                                            Add Delivery Address
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='space-y-3'>
                                        {allAddresses.map((addr, idx) => {
                                            const isSelected = selectedAddressIndex === idx;
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => setSelectedAddressIndex(idx)}
                                                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-[#16161D] border-[#C5A059] shadow-md shadow-[#C5A059]/10'
                                                            : 'bg-black/20 border-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className='flex items-start gap-3'>
                                                        <Radio
                                                            checked={isSelected}
                                                            onChange={() => setSelectedAddressIndex(idx)}
                                                            size='small'
                                                            sx={{
                                                                color: 'rgba(255,255,255,0.3)',
                                                                '&.Mui-checked': { color: '#C5A059' },
                                                                p: 0,
                                                                mt: 0.5
                                                            }}
                                                        />
                                                        <div className='space-y-1 text-sm flex-1'>
                                                            <div className='flex items-center gap-2'>
                                                                <span className='font-bold text-[#F5F5F7]'>{addr.name}</span>
                                                                <span className='text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10'>
                                                                    {addr.locality || 'HOME'}
                                                                </span>
                                                                <span className='text-xs text-zinc-400 font-medium ml-auto'>
                                                                    {addr.mobile}
                                                                </span>
                                                            </div>
                                                            <p className='text-zinc-300 text-xs leading-relaxed'>
                                                                {addr.address}, {addr.city}, {addr.state} - <strong className='text-zinc-200'>{addr.pinCode}</strong>
                                                            </p>

                                                            {isSelected && (
                                                                <div className='pt-3'>
                                                                    <Button
                                                                        onClick={() => setStep(3)}
                                                                        variant='contained'
                                                                        sx={{
                                                                            bgcolor: '#C5A059',
                                                                            color: '#0B0B0E',
                                                                            fontWeight: 700,
                                                                            px: 3.5,
                                                                            py: 1,
                                                                            borderRadius: '0.5rem',
                                                                            textTransform: 'none',
                                                                            fontSize: '0.875rem',
                                                                            '&:hover': { bgcolor: '#D4AF37' }
                                                                        }}
                                                                    >
                                                                        Deliver Here
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    {/* ================= STEP 3: ORDER SUMMARY ================= */}
                    <div className='bg-[#121217] border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all'>
                        <div className={`p-4 sm:p-5 flex items-center justify-between ${step === 3 ? 'border-b border-white/10' : ''}`}>
                            <div className='flex items-center gap-3.5'>
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    step > 3 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : step === 3 ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/10 text-zinc-500'
                                }`}>
                                    {step > 3 ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : '3'}
                                </span>
                                <div>
                                    <h3 className={`font-bold text-sm sm:text-base tracking-wide uppercase ${
                                        step >= 3 ? 'text-[#F5F5F7]' : 'text-zinc-500'
                                    }`}>
                                        3. Order Summary
                                    </h3>
                                    {step > 3 && (
                                        <p className='text-xs text-zinc-400 mt-0.5'>
                                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} • Total Payable: ₹{totalSelling}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {step > 3 && (
                                <Button
                                    onClick={() => setStep(3)}
                                    size='small'
                                    sx={{
                                        color: '#C5A059',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        '&:hover': { bgcolor: 'rgba(197, 160, 89, 0.08)' }
                                    }}
                                >
                                    Change
                                </Button>
                            )}
                        </div>

                        {step === 3 && (
                            <div className='p-4 sm:p-6 space-y-4'>
                                <div className='space-y-3 max-h-96 overflow-y-auto pr-1'>
                                    {cartItems.map((item: CartItem) => (
                                        <div 
                                            key={item.id} 
                                            className='p-3.5 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between gap-4'
                                        >
                                            <div className='flex items-center gap-3.5'>
                                                <img 
                                                    className='w-16 h-20 object-cover rounded-lg border border-white/10'
                                                    src={item.product?.images?.[0] || ""} 
                                                    alt={item.product?.title || "Product"} 
                                                />
                                                <div className='space-y-0.5 text-xs'>
                                                    <h4 className='font-bold text-sm text-[#F5F5F7] line-clamp-1'>
                                                        {item.product?.title}
                                                    </h4>
                                                    <p className='text-zinc-400'>
                                                        Seller: <span className='text-zinc-300'>{item.product?.seller?.businessDetails?.businessName || item.product?.seller?.sellerName || "Exclusive"}</span>
                                                    </p>
                                                    <p className='text-zinc-400'>
                                                        Quantity: <strong className='text-[#F5F5F7]'>{item.quantity}</strong> • Size: <strong className='text-[#F5F5F7]'>{item.size || "FREE"}</strong>
                                                    </p>
                                                    <div className='pt-1 flex items-center gap-2'>
                                                        <span className='font-bold text-sm text-[#F5F5F7]'>₹{item.sellingPrice}</span>
                                                        {item.mrpPrice > item.sellingPrice && (
                                                            <span className='text-zinc-500 line-through text-xs'>₹{item.mrpPrice}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='text-right text-xs text-zinc-400 hidden sm:block'>
                                                <span className='text-emerald-400 font-medium block'>Delivery by 3-5 Days</span>
                                                <span>Free Delivery</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className='p-3 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl flex items-center justify-between text-xs text-zinc-300'>
                                    <span>Order confirmation will be sent to <strong>{user.user?.email || auth.user?.email}</strong></span>
                                    <LocalShippingIcon sx={{ color: "#C5A059", fontSize: 18 }} />
                                </div>

                                <div className='pt-2 flex justify-between items-center'>
                                    <Button
                                        onClick={() => setStep(2)}
                                        variant='text'
                                        sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none' }}
                                    >
                                        ← Back to Address
                                    </Button>

                                    <Button
                                        onClick={() => setStep(4)}
                                        variant='contained'
                                        sx={{
                                            bgcolor: '#C5A059',
                                            color: '#0B0B0E',
                                            fontWeight: 700,
                                            px: 4,
                                            py: 1.1,
                                            borderRadius: '0.5rem',
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            '&:hover': { bgcolor: '#D4AF37' }
                                        }}
                                    >
                                        Continue to Payment →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* ================= STEP 4: PAYMENT OPTIONS ================= */}
                    <div className='bg-[#121217] border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all'>
                        <div className={`p-4 sm:p-5 flex items-center justify-between ${step === 4 ? 'border-b border-white/10' : ''}`}>
                            <div className='flex items-center gap-3.5'>
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    step === 4 ? 'bg-[#C5A059] text-black font-bold' : 'bg-white/10 text-zinc-500'
                                }`}>
                                    4
                                </span>
                                <div>
                                    <h3 className={`font-bold text-sm sm:text-base tracking-wide uppercase ${
                                        step === 4 ? 'text-[#F5F5F7]' : 'text-zinc-500'
                                    }`}>
                                        4. Payment Options
                                    </h3>
                                    {step === 4 && (
                                        <p className='text-xs text-zinc-400 mt-0.5'>
                                            Choose your preferred payment method to complete this order
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {step === 4 && (
                            <div className='p-4 sm:p-6 space-y-4'>
                                <RadioGroup
                                    value={paymentGateway}
                                    onChange={(e) => setPaymentGateway(e.target.value)}
                                    className='space-y-3'
                                >
                                    {/* Option 1: Cash on Delivery (COD) */}
                                    <div 
                                        onClick={() => setPaymentGateway("COD")}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                            paymentGateway === "COD"
                                                ? "bg-[#16161D] border-[#C5A059] shadow-md shadow-[#C5A059]/10"
                                                : "bg-black/20 border-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <div className='flex items-start gap-3'>
                                            <Radio
                                                checked={paymentGateway === "COD"}
                                                value="COD"
                                                size="small"
                                                sx={{
                                                    color: "rgba(255,255,255,0.3)",
                                                    '&.Mui-checked': { color: '#C5A059' },
                                                    p: 0,
                                                    mt: 0.5
                                                }}
                                            />
                                            <div className='flex-1 space-y-1 text-sm'>
                                                <div className='flex items-center gap-2'>
                                                    <PaymentsIcon sx={{ color: "#C5A059", fontSize: 20 }} />
                                                    <span className='font-bold text-[#F5F5F7]'>Cash on Delivery (COD)</span>
                                                    <span className='text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400'>
                                                        Most Popular
                                                    </span>
                                                </div>
                                                <p className='text-zinc-400 text-xs'>
                                                    Pay in cash or via UPI when the courier delivers your package. Safe & convenient.
                                                </p>

                                                {paymentGateway === "COD" && (
                                                    <div className='pt-3'>
                                                        <Button
                                                            onClick={handleCreateOrder}
                                                            disabled={orders.loading}
                                                            variant='contained'
                                                            fullWidth
                                                            sx={{
                                                                bgcolor: '#C5A059',
                                                                color: '#0B0B0E',
                                                                fontWeight: 700,
                                                                py: 1.2,
                                                                borderRadius: '0.6rem',
                                                                textTransform: 'none',
                                                                fontSize: '0.95rem',
                                                                '&:hover': { bgcolor: '#D4AF37' }
                                                            }}
                                                        >
                                                            {orders.loading ? <CircularProgress size={22} sx={{ color: "#0B0B0E" }} /> : "Confirm Order (Cash on Delivery)"}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option 2: Razorpay (Online Payment) */}
                                    <div 
                                        onClick={() => setPaymentGateway("RAZORPAY")}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                            paymentGateway === "RAZORPAY"
                                                ? "bg-[#16161D] border-[#C5A059] shadow-md shadow-[#C5A059]/10"
                                                : "bg-black/20 border-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <div className='flex items-start gap-3'>
                                            <Radio
                                                checked={paymentGateway === "RAZORPAY"}
                                                value="RAZORPAY"
                                                size="small"
                                                sx={{
                                                    color: "rgba(255,255,255,0.3)",
                                                    '&.Mui-checked': { color: '#C5A059' },
                                                    p: 0,
                                                    mt: 0.5
                                                }}
                                            />
                                            <div className='flex-1 space-y-1 text-sm'>
                                                <div className='flex items-center gap-2'>
                                                    <img 
                                                        src="https://razorpay.com/newsroom-content/uploads/2020/12/output-onlinepngtools-1-1.png" 
                                                        alt="Razorpay" 
                                                        className='h-5 object-contain'
                                                    />
                                                    <span className='font-bold text-[#F5F5F7]'>Razorpay (UPI, Cards, NetBanking)</span>
                                                </div>
                                                <p className='text-zinc-400 text-xs'>
                                                    Instant secure checkout via Google Pay, PhonePe, Paytm, Debit/Credit Card, and UPI.
                                                </p>

                                                {paymentGateway === "RAZORPAY" && (
                                                    <div className='pt-3'>
                                                        <Button
                                                            onClick={handleCreateOrder}
                                                            disabled={orders.loading}
                                                            variant='contained'
                                                            fullWidth
                                                            sx={{
                                                                bgcolor: '#C5A059',
                                                                color: '#0B0B0E',
                                                                fontWeight: 700,
                                                                py: 1.2,
                                                                borderRadius: '0.6rem',
                                                                textTransform: 'none',
                                                                fontSize: '0.95rem',
                                                                '&:hover': { bgcolor: '#D4AF37' }
                                                            }}
                                                        >
                                                            {orders.loading ? <CircularProgress size={22} sx={{ color: "#0B0B0E" }} /> : `Pay ₹${totalSelling} via Razorpay`}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Option 3: Stripe (International Cards) */}
                                    <div 
                                        onClick={() => setPaymentGateway("STRIPE")}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                            paymentGateway === "STRIPE"
                                                ? "bg-[#16161D] border-[#C5A059] shadow-md shadow-[#C5A059]/10"
                                                : "bg-black/20 border-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <div className='flex items-start gap-3'>
                                            <Radio
                                                checked={paymentGateway === "STRIPE"}
                                                value="STRIPE"
                                                size="small"
                                                sx={{
                                                    color: "rgba(255,255,255,0.3)",
                                                    '&.Mui-checked': { color: '#C5A059' },
                                                    p: 0,
                                                    mt: 0.5
                                                }}
                                            />
                                            <div className='flex-1 space-y-1 text-sm'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-bold text-[#F5F5F7]'>Stripe (International Cards)</span>
                                                </div>
                                                <p className='text-zinc-400 text-xs'>
                                                    Pay securely with Visa, MasterCard, AMEX, or international debit cards.
                                                </p>

                                                {paymentGateway === "STRIPE" && (
                                                    <div className='pt-3'>
                                                        <Button
                                                            onClick={handleCreateOrder}
                                                            disabled={orders.loading}
                                                            variant='contained'
                                                            fullWidth
                                                            sx={{
                                                                bgcolor: '#C5A059',
                                                                color: '#0B0B0E',
                                                                fontWeight: 700,
                                                                py: 1.2,
                                                                borderRadius: '0.6rem',
                                                                textTransform: 'none',
                                                                fontSize: '0.95rem',
                                                                '&:hover': { bgcolor: '#D4AF37' }
                                                            }}
                                                        >
                                                            {orders.loading ? <CircularProgress size={22} sx={{ color: "#0B0B0E" }} /> : `Pay ₹${totalSelling} via Stripe`}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}
                    </div>

                </div>


                {/* Right Column: Sticky Flipkart Price Details & Assurance */}
                <div className='lg:col-span-1 space-y-4'>
                    <div className='bg-[#121217] border border-white/10 rounded-2xl shadow-xl p-5 sticky top-24 space-y-4'>
                        <h2 className='font-serif font-bold text-base text-[#C5A059] tracking-wider uppercase border-b border-white/10 pb-3'>
                            Price Details
                        </h2>

                        <div className='space-y-3 text-sm text-zinc-300'>
                            <div className='flex justify-between'>
                                <span className='text-zinc-400'>Price ({cartItems.length} items)</span>
                                <span className='font-semibold text-[#F5F5F7]'>₹{totalMrp}</span>
                            </div>

                            {totalDiscount > 0 && (
                                <div className='flex justify-between text-emerald-400'>
                                    <span>Discount</span>
                                    <span className='font-semibold'>- ₹{totalDiscount}</span>
                                </div>
                            )}

                            <div className='flex justify-between'>
                                <span className='text-zinc-400'>Delivery Charges</span>
                                <div>
                                    <span className='text-zinc-500 line-through text-xs mr-1.5'>₹40</span>
                                    <span className='text-emerald-400 font-bold'>FREE</span>
                                </div>
                            </div>

                            <div className='flex justify-between'>
                                <span className='text-zinc-400'>Platform Fee</span>
                                <span className='text-emerald-400 font-bold'>FREE</span>
                            </div>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                            <div className='flex justify-between items-center text-base font-bold text-[#F5F5F7] pt-1'>
                                <span>Total Amount</span>
                                <span className='text-xl text-[#C5A059]'>₹{totalSelling}</span>
                            </div>

                            {totalDiscount > 0 && (
                                <div className='p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-400 font-semibold'>
                                    You will save ₹{totalDiscount} on this order
                                </div>
                            )}
                        </div>

                        {/* Security Assurance Footer */}
                        <div className='pt-3 border-t border-white/5 space-y-2 text-[11px] text-zinc-400'>
                            <div className='flex items-center gap-2'>
                                <SecurityIcon sx={{ color: "#C5A059", fontSize: 16 }} />
                                <span>Safe and Secure Payments. Easy cancellations.</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <StorefrontIcon sx={{ color: "#C5A059", fontSize: 16 }} />
                                <span>100% Authentic products from verified sellers.</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal for adding address */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="address-form-modal"
                aria-describedby="add-delivery-address-form"
            >
                <Box sx={modalStyle}>
                    <AddressForm 
                        paymentGateway={paymentGateway} 
                        handleClose={handleCloseModal} 
                        onAddressAdded={handleAddressAdded}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default AddressPage;