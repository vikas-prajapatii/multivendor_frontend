import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import { teal } from '@mui/material/colors';
import { Box, Button, Divider, Grid, IconButton, LinearProgress, Modal, Rating } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Wallet } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SmilarProduct from '../SimilarProduct/SmilarProduct';
import ZoomableImage from './ZoomableImage';
import { useAppDispatch, useAppSelector } from '../../../../Redux Toolkit/Store';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, getAllProducts } from '../../../../Redux Toolkit/Customer/ProductSlice';
import { addItemToCart } from '../../../../Redux Toolkit/Customer/CartSlice';
import ProductReviewCard from '../../Review/ProductReviewCard';
import RatingCard from '../../Review/RatingCard';
import { fetchReviewsByProductId } from '../../../../Redux Toolkit/Customer/ReviewSlice';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    height: "100%",
    // bgcolor: 'background.paper',
    boxShadow: 24,
    outline: "none",
};


const ProductDetails = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const dispatch = useAppDispatch();
    const { products, review } = useAppSelector(store => store)
    const navigate = useNavigate()
    const { productId,categoryId } = useParams()
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1)


    useEffect(() => {

        if (productId) {
            dispatch(fetchProductById(Number(productId)))
            dispatch(fetchReviewsByProductId({ productId: Number(productId) }))
        }
        dispatch(getAllProducts({ category: categoryId}));

    }, [productId])

    const handleAddCart = () => {
        dispatch(addItemToCart({
            jwt: localStorage.getItem('jwt'),
            request: { productId: Number(productId), size: "FREE", quantity }

        }))
    }

 


    return (
        <div className='px-5 lg:px-20 pt-8 pb-16 max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>

                <section className='flex flex-col lg:flex-row gap-5'>
                    <div className='w-full lg:w-[18%] flex flex-wrap lg:flex-col gap-3'>
                        {products.product?.images?.map((item, index) => (
                            <img 
                                key={index}
                                onClick={() => setSelectedImage(index)} 
                                className={`lg:w-full w-[60px] h-[75px] object-cover cursor-pointer rounded-xl border-2 transition-all ${
                                    selectedImage === index ? "border-[#C5A059] shadow-md shadow-[#C5A059]/20" : "border-white/10 hover:border-white/30"
                                }`} 
                                src={item} 
                                alt="" 
                            />
                        ))}
                    </div>
                    <div className='w-full lg:w-[82%] bg-[#121217] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[420px] shadow-xl'>
                        {products.product?.images && products.product.images.length > 0 ? (
                            <img 
                                onClick={handleOpen} 
                                className='w-full max-h-[580px] object-cover rounded-xl cursor-zoom-out' 
                                src={products.product.images[selectedImage] || products.product.images[0]} 
                                alt="" 
                            />
                        ) : (
                            <div className='text-zinc-500'>No image available</div>
                        )}
                    </div>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <ZoomableImage src={products.product?.images?.[selectedImage] || ""} alt="" />
                        </Box>
                    </Modal>

                </section>

                <section className="space-y-5">
                    <div>
                        <h1 className='font-bold text-sm text-[#C5A059] tracking-widest uppercase'>
                            {products.product?.seller?.businessDetails?.businessName || products.product?.seller?.sellerName || "Exclusive Collection"}
                        </h1>
                        <h2 className='text-2xl lg:text-3xl font-serif font-bold text-[#F5F5F7] tracking-tight mt-1'>
                            {products.product?.title}
                        </h2>
                    </div>

                    <div className='flex justify-between items-center py-1.5 border border-white/10 rounded-xl bg-[#121217] w-[180px] px-3 text-[#F5F5F7]'>
                        <div className='flex gap-1.5 items-center'>
                            <span className="font-semibold text-sm">4.5</span>
                            <StarIcon sx={{ color: "#C5A059", fontSize: "18px" }} />
                        </div>
                        <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
                        <span className="text-xs text-zinc-400">
                            {review.reviews.length || 0} Ratings
                        </span>
                    </div>

                    <div className='space-y-1.5 pt-1'>
                        <div className='price flex items-center gap-3 text-xl'>
                            <span className='font-bold text-2xl text-[#F5F5F7]' >
                                ₹{products.product?.sellingPrice}
                            </span>
                            {products.product && products.product.mrpPrice > products.product.sellingPrice && (
                                <span className='text-base thin-line-through text-zinc-500'>
                                    ₹{products.product?.mrpPrice}
                                </span>
                            )}
                            {products.product && products.product.discountPercent > 0 && (
                                <span className='text-[#C5A059] font-bold text-sm px-2 py-0.5 rounded bg-[#C5A059]/10'>
                                    {products.product?.discountPercent}% off
                                </span>
                            )}
                        </div>
                        <p className='text-xs text-zinc-400'>Inclusive of all taxes. Free Shipping on orders over ₹1500.</p>
                    </div>

                    <div className='pt-2 space-y-3 text-zinc-300 border-t border-b border-white/5 py-4'>
                        <div className='flex items-center gap-3.5 text-sm'>
                            <ShieldIcon sx={{ color: "#C5A059", fontSize: 20 }} />
                            <p>Authentic & Quality Assured Guarantee</p>
                        </div>
                        <div className='flex items-center gap-3.5 text-sm'>
                            <WorkspacePremiumIcon sx={{ color: "#C5A059", fontSize: 20 }} />
                            <p>100% Genuine Handcrafted Silk & Fabrics</p>
                        </div>
                        <div className='flex items-center gap-3.5 text-sm'>
                            <LocalShippingIcon sx={{ color: "#C5A059", fontSize: 20 }} />
                            <p>Express Dispatch & Safe Delivery</p>
                        </div>
                        <div className='flex items-center gap-3.5 text-sm'>
                            <Wallet sx={{ color: "#C5A059", fontSize: 20 }} />
                            <p>Pay on Delivery & Multiple Payment Options</p>
                        </div>
                    </div>

                    <div className='space-y-2 pt-1'>
                        <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400'>QUANTITY:</h3>
                        <div className='flex items-center gap-3 w-[150px] justify-between bg-[#121217] border border-white/10 p-1.5 rounded-xl'>
                            <Button 
                                size="small"
                                disabled={quantity === 1} 
                                onClick={() => setQuantity(quantity - 1)} 
                                sx={{ minWidth: 32, height: 32, p: 0, color: "#F5F5F7", '&.Mui-disabled': { color: "rgba(255,255,255,0.2)" } }}
                            >
                                <RemoveIcon fontSize="small" />
                            </Button>
                            <span className='px-3 text-base font-bold text-[#F5F5F7]'>
                                {quantity}
                            </span>
                            <Button 
                                size="small"
                                onClick={() => setQuantity(quantity + 1)} 
                                sx={{ minWidth: 32, height: 32, p: 0, color: "#C5A059" }}
                            >
                                <AddIcon fontSize="small" />
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <Button
                            onClick={handleAddCart}
                            sx={{ 
                                py: "0.85rem", 
                                bgcolor: "#C5A059", 
                                color: "#0B0B0E", 
                                fontWeight: "bold",
                                borderRadius: "0.75rem",
                                '&:hover': { bgcolor: "#D4AF37" },
                                textTransform: "none",
                                fontSize: "1rem"
                            }}
                            variant='contained' 
                            fullWidth 
                            startIcon={<AddShoppingCartIcon />}
                        >
                            Add To Bag
                        </Button>
                        <Button
                            sx={{ 
                                py: "0.85rem", 
                                borderColor: "rgba(255,255,255,0.2)", 
                                color: "#F5F5F7",
                                borderRadius: "0.75rem",
                                '&:hover': { borderColor: "#C5A059", color: "#C5A059", bgcolor: "rgba(197,160,89,0.08)" },
                                textTransform: "none",
                                fontSize: "1rem"
                            }}
                            variant='outlined' 
                            fullWidth 
                            startIcon={<FavoriteBorderIcon />}
                        >
                            Wishlist
                        </Button>
                    </div>

                    {products.product?.description && (
                        <div className='pt-4'>
                            <h3 className='text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1'>Description:</h3>
                            <p className='text-zinc-300 text-sm leading-relaxed whitespace-pre-line'>
                                {products.product.description}
                            </p>
                        </div>
                    )}

                    <div className="ratings w-full pt-8">
                        <h2 className="font-serif font-bold text-xl text-[#F5F5F7] pb-4">
                            Customer Reviews & Ratings
                        </h2>

                        <RatingCard totalReview={review.reviews.length} />
                        <div className='mt-8'>
                            <div className="space-y-4">
                                {review.reviews.map((item, i) => (
                                    <div key={item.id || i} className='space-y-4'>
                                        <ProductReviewCard item={item} />
                                        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                                    </div>
                                ))}
                                <Button 
                                    onClick={() => navigate(`/reviews/${productId}`)}
                                    sx={{ color: "#C5A059", textTransform: "none", fontWeight: 600 }}
                                >
                                    View All {review.reviews.length} Reviews &rarr;
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            <section className='mt-24 pt-10 border-t border-white/10'>
                <h2 className='text-2xl font-serif font-bold text-[#F5F5F7]'>
                    Similar Products
                </h2>
                <div className='pt-6'>
                    <SmilarProduct />
                </div>
            </section>
        </div>
    )
}

export default ProductDetails