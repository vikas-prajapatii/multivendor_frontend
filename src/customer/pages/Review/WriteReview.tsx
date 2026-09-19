import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../../Redux Toolkit/Customer/ProductSlice';
import { Box, Grid, LinearProgress, Rating } from '@mui/material';
import ProductReviewCard from './ProductReviewCard';
import ReviewForm from './ReviewForm';

const WriteReviews = () => {
    const dispatch = useAppDispatch();
    const { products, review } = useAppSelector(store => store)

    const { productId } = useParams()

    useEffect(() => {

        if (productId) {
            dispatch(fetchProductById(Number(productId)))
        }

    }, [productId])

    return (
        <div className='p-5 lg:p-20 flex flex-col lg:flex-row gap-10'>
            <div className='w-full md:w-1/2 lg:w-[30%] space-y-3 bg-[#121217] p-5 rounded-2xl border border-white/10 h-fit'>
                <img className='w-full max-h-[380px] object-cover rounded-xl border border-white/10' src={
                    products.product?.images?.[0] || ""
                } alt="" />
                <div>
                    <div>
                        <p className='font-bold text-lg text-[#C5A059] uppercase tracking-wider'>
                            {products.product?.seller?.businessDetails?.businessName || products.product?.seller?.sellerName || "Exclusive Store"}
                        </p>
                        <p className='text-lg font-serif text-[#F5F5F7]'>{products.product?.title}</p>
                    </div>

                    <div className='price flex items-center gap-3 mt-5 text-lg'>
                        <span className='font-semibold text-gray-200' > ₹{products.product?.sellingPrice}</span>
                        <span className='text thin-line-through text-gray-400 '>₹{products.product?.mrpPrice}</span>
                        <span className='text-[#C5A059] font-semibold'>{products.product?.discountPercent}% off</span>
                    </div>

                </div>
            </div>
            <section className="w-full md:w-1/2 lg:w-[70%]">
                <h1 className="font-semibold text-2xl pb-4 text-gray-300">
                    Write Your Review & Give Ratings
                </h1>
                <ReviewForm />

            </section>
        </div>
    )
}

export default WriteReviews