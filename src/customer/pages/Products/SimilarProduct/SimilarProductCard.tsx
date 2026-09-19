import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { teal } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../../../types/productTypes';

const SimilarProductCard = ({ product }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorite((prev) => !prev);
    };

    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "";
    const sellerName = product.seller?.businessDetails?.businessName || product.seller?.sellerName || "Exclusive";

    return (
        <div
            onClick={() => navigate(
                `/product-details/${product.category?.categoryId || "all"}/${encodeURIComponent(product.title || "product")}/${product.id}`
            )} 
            className="group cursor-pointer rounded-2xl bg-[#121217] border border-white/10 hover:border-[#C5A059]/50 transition-all duration-300 p-3 shadow-lg hover:shadow-2xl overflow-hidden"
        >
            <div className="relative h-[260px] rounded-xl overflow-hidden bg-black/40">
                {imageUrl ? (
                    <img
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        src={imageUrl}
                        alt={product.title || "product-similar"}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900">
                        No Image
                    </div>
                )}
            </div>
            <div className="details pt-3 space-y-1">
                <div className="name space-y-0.5">
                    <h1 className="font-semibold text-xs text-zinc-400 uppercase tracking-wider truncate">
                        {sellerName}
                    </h1>
                    <p className="text-zinc-100 text-sm font-medium line-clamp-1">
                        {product.title}
                    </p>
                </div>
                <div className="price flex items-center gap-2 pt-1">
                    <span className="font-bold text-sm text-[#F5F5F7]">
                        ₹{product.sellingPrice}
                    </span>
                    {product.mrpPrice > product.sellingPrice && (
                        <span className="text-xs thin-line-through text-zinc-500">
                            ₹{product.mrpPrice}
                        </span>
                    )}
                    {product.discountPercent > 0 && (
                        <span className="text-[#C5A059] text-xs font-semibold px-1 py-0.5 rounded bg-[#C5A059]/10">
                            {product.discountPercent}% off
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimilarProductCard;
