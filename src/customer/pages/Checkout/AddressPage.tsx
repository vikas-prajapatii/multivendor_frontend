import React, { useState } from 'react'
import PricingCard from '../Cart/PricingCard'
import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddressForm from './AddresssForm'
import AddressCard from './AddressCard'
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { createOrder } from '../../../Redux Toolkit/Customer/OrderSlice'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: "90%", sm: 520 },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#121217',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '1.25rem',
    boxShadow: 24,
    p: { xs: 2.5, sm: 4 },
    outline: 'none',
};

const paymentGatwayList = [
    {
        value: "RAZORPAY",
        image: "https://razorpay.com/newsroom-content/uploads/2020/12/output-onlinepngtools-1-1.png",
        label: "Razorpay"
    },
    {
        value: "STRIPE",
        image: "/stripe_logo.png",
        label: "Stripe"
    }
]

const AddressPage = () => {
    const navigate = useNavigate()
    const [value, setValue] = React.useState(0);
    const dispatch = useAppDispatch();
    const { user, orders, auth } = useAppSelector(store => store)
    const [paymentGateway, setPaymentGateway] = useState(paymentGatwayList[0].value);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event: any) => {
        setValue(Number(event.target.value));
    };

    const jwt = localStorage.getItem('jwt') || auth.jwt;
    const addresses = user.user?.addresses || [];

    const handleCreateOrder = () => {
        if (!jwt) {
            navigate('/login');
            return;
        }

        if (addresses.length === 0) {
            handleOpen();
            return;
        }

        const selectedAddress = addresses[value] || addresses[0];
        if (!selectedAddress) {
            handleOpen();
            return;
        }

        dispatch(createOrder({
            paymentGateway,
            address: selectedAddress,
            jwt
        }));
    };

    const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentGateway((event.target as HTMLInputElement).value);
    };

    return (
        <div className='pt-8 pb-16 px-5 sm:px-10 md:px-24 lg:px-44 min-h-screen max-w-7xl mx-auto'>
            <div className='space-y-8 lg:space-y-0 lg:grid grid-cols-3 lg:gap-10'>

                <div className="col-span-2 space-y-6">
                    <div className='flex justify-between items-center pb-2 border-b border-white/10'>
                        <h1 className='font-serif text-2xl font-bold text-[#F5F5F7] flex items-center gap-2'>
                            <LocationOnIcon sx={{ color: "#C5A059" }} />
                            Select Delivery Address
                        </h1>
                        {jwt && (
                            <Button 
                                onClick={handleOpen} 
                                variant='outlined'
                                sx={{
                                    borderColor: "rgba(255,255,255,0.2)",
                                    color: "#F5F5F7",
                                    borderRadius: "0.75rem",
                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                    '&:hover': { borderColor: "#C5A059", color: "#C5A059" }
                                }}
                            >
                                + Add Address
                            </Button>
                        )}
                    </div>

                    {!jwt ? (
                        <div className='p-8 rounded-2xl bg-[#121217] border border-white/10 text-center space-y-4 shadow-xl'>
                            <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                                <LockIcon sx={{ color: "#C5A059", fontSize: 28 }} />
                            </div>
                            <h2 className='text-xl font-serif font-bold text-[#F5F5F7]'>
                                Sign In Required for Checkout
                            </h2>
                            <p className='text-zinc-400 text-sm max-w-md mx-auto'>
                                Please sign in or create an account to view your saved addresses and proceed to payment.
                            </p>
                            <Button 
                                onClick={() => navigate('/login')}
                                variant="contained"
                                sx={{
                                    bgcolor: "#C5A059",
                                    color: "#0B0B0E",
                                    fontWeight: 700,
                                    px: 4,
                                    py: 1.2,
                                    borderRadius: "0.75rem",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    '&:hover': { bgcolor: "#D4AF37" }
                                }}
                            >
                                Log In / Sign Up
                            </Button>
                        </div>
                    ) : addresses.length === 0 ? (
                        <div className='p-8 rounded-2xl bg-[#121217] border border-white/10 text-center space-y-4 shadow-xl'>
                            <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A059]/10 flex items-center justify-center">
                                <LocationOnIcon sx={{ color: "#C5A059", fontSize: 28 }} />
                            </div>
                            <h2 className='text-xl font-serif font-bold text-[#F5F5F7]'>
                                No Delivery Address Found
                            </h2>
                            <p className='text-zinc-400 text-sm max-w-md mx-auto'>
                                You don't have any saved delivery address yet. Please add one below to complete your order.
                            </p>
                            <Button 
                                onClick={handleOpen}
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{
                                    bgcolor: "#C5A059",
                                    color: "#0B0B0E",
                                    fontWeight: 700,
                                    px: 3.5,
                                    py: 1.2,
                                    borderRadius: "0.75rem",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    '&:hover': { bgcolor: "#D4AF37" }
                                }}
                            >
                                Add Delivery Address
                            </Button>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <p className='text-xs font-semibold uppercase tracking-wider text-zinc-400'>Saved Addresses</p>
                            <div className='space-y-3'>
                                {addresses.map((item, index) => (
                                    <AddressCard
                                        key={item.id || index}
                                        item={item}
                                        selectedValue={value} 
                                        value={index}
                                        handleChange={handleChange} 
                                    />
                                ))}
                            </div>
                            <div className='pt-3'>
                                <Button 
                                    onClick={handleOpen} 
                                    startIcon={<AddIcon />}
                                    sx={{ 
                                        color: "#C5A059", 
                                        textTransform: "none", 
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: "rgba(197, 160, 89, 0.08)" }
                                    }}
                                >
                                    Add Another Address
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-span-1 text-sm space-y-6">
                    <section className='space-y-4 bg-[#121217] border border-white/10 p-5 rounded-2xl shadow-xl'>
                        <h2 className='font-serif font-bold text-base text-[#C5A059] tracking-wide text-center uppercase'>
                            Choose Payment Gateway
                        </h2>

                        <RadioGroup
                            row
                            aria-labelledby="payment-gateways"
                            name="payment-gateways"
                            className='flex justify-between gap-3'
                            onChange={handlePaymentChange}
                            value={paymentGateway}
                        >
                            {paymentGatwayList.map((item) => {
                                const isSelected = paymentGateway === item.value;
                                return (
                                    <FormControlLabel 
                                        key={item.value}
                                        className={`flex-1 m-0 p-3 rounded-xl border transition-all cursor-pointer flex justify-center items-center ${
                                            isSelected 
                                                ? "border-[#C5A059] bg-[#C5A059]/10 shadow-md shadow-[#C5A059]/10" 
                                                : "border-white/10 bg-black/30 hover:border-white/20"
                                        }`}
                                        value={item.value} 
                                        control={
                                            <Radio 
                                                size="small"
                                                sx={{
                                                    color: "rgba(255,255,255,0.4)",
                                                    '&.Mui-checked': { color: '#C5A059' }
                                                }}
                                            />
                                        } 
                                        label={
                                            <div className="flex items-center justify-center pl-1">
                                                <img
                                                    className="h-6 object-contain"
                                                    src={item.image}
                                                    alt={item.label}
                                                />
                                            </div>
                                        } 
                                    />
                                );
                            })}
                        </RadioGroup>
                    </section>

                    <section className='bg-[#121217] border border-white/10 rounded-2xl shadow-xl overflow-hidden'>
                        <PricingCard />
                        <div className='p-5 pt-2'>
                            <Button
                                onClick={handleCreateOrder} 
                                disabled={orders.loading}
                                sx={{ 
                                    py: "13px", 
                                    bgcolor: "#C5A059", 
                                    color: "#0B0B0E", 
                                    fontWeight: 700, 
                                    fontSize: "1rem",
                                    borderRadius: "0.75rem",
                                    textTransform: "none",
                                    '&:hover': { bgcolor: "#D4AF37" },
                                    '&.Mui-disabled': { bgcolor: "rgba(197, 160, 89, 0.3)", color: "#71717A" }
                                }}
                                variant='contained' 
                                fullWidth
                            >
                                {orders.loading ? "Processing Order..." : !jwt ? "Sign In to Checkout \u2192" : "Proceed to Payment \u2192"}
                            </Button>
                        </div>
                    </section>
                </div>

            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="address-form-modal"
                aria-describedby="add-delivery-address-form"
            >
                <Box sx={style}>
                    <AddressForm paymentGateway={paymentGateway} handleClose={handleClose} />
                </Box>
            </Modal>
        </div>
    )
}

export default AddressPage