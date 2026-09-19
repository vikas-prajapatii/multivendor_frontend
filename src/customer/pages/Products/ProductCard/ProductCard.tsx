import React, { useState, useEffect, MouseEvent } from "react";
import "./ProductCard.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { teal } from "@mui/material/colors";
import { Box, Button, IconButton, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/productTypes";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../Redux Toolkit/Store";
import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { isWishlisted } from "../../../../util/isWishlisted";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ChatBot from "../../ChatBot/ChatBot";

interface ProductCardProps {
    // images: string[];
    // categoryId: string | undefined;
    item: Product;
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    borderRadius: ".5rem",
    boxShadow: 24,

};

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const { wishlist } = useAppSelector((store) => store);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showChatBot, setShowChatBot] = useState(false)

    const handleAddWishlist = (event: MouseEvent) => {
        event.stopPropagation();
        setIsFavorite((prev) => !prev);
        if (item.id) dispatch(addProductToWishlist({ productId: item.id }));
    };

    useEffect(() => {
        let interval: any;
        if (isHovered) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % item.images.length);
            }, 1000); // Change image every 1 second
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isHovered, item.images.length]);

    const handleShowChatBot = (event: MouseEvent) => {
        event.stopPropagation();
        setShowChatBot(true)
    }
    const handleCloseChatBot = (e: MouseEvent) => {
        e.stopPropagation();
        setShowChatBot(false)
    }

    return (
        <>
            <div
                onClick={() =>
                    navigate(
                        `/product-details/${item.category?.categoryId}/${encodeURIComponent(item.title)}/${item.id}`
                    )
                }
                className="group p-3 relative rounded-2xl bg-[#121217] border border-white/10 hover:border-[#C5A059]/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/60 cursor-pointer overflow-hidden"
            >
                <div
                    className="card rounded-xl overflow-hidden bg-black/40"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {item.images && item.images.length > 0 ? (
                        item.images.map((image: any, index: number) => (
                            <img
                                key={index}
                                className="card-media object-cover object-top"
                                src={image}
                                alt={`product-${index}`}
                                style={{
                                    transform: `translateX(${(index - currentImage) * 100}%)`,
                                }}
                            />
                        ))
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-900">
                            No Image
                        </div>
                    )}
                    {isHovered && (
                        <div className="indicator flex flex-col items-center space-y-2">
                            {item.images && item.images.length > 1 && (
                                <div className="flex gap-2">
                                    {item.images.map((_: any, index: number) => (
                                        <button
                                            key={index}
                                            className={`indicator-button ${index === currentImage ? "active" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentImage(index);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                {wishlist.wishlist && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ 
                                            backgroundColor: "rgba(18, 18, 23, 0.85)", 
                                            backdropFilter: "blur(8px)",
                                            minWidth: "36px", 
                                            height: "36px", 
                                            p: 0, 
                                            borderRadius: "50%",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            '&:hover': { backgroundColor: "rgba(30, 30, 38, 0.95)" } 
                                        }}
                                        onClick={handleAddWishlist}
                                    >
                                        {isWishlisted(wishlist.wishlist, item) ? (
                                            <FavoriteIcon sx={{ color: "#E11D48", fontSize: "1.1rem" }} />
                                        ) : (
                                            <FavoriteBorderIcon sx={{ color: "#E4E4E7", fontSize: "1.1rem" }} />
                                        )}
                                    </Button>
                                )}
                                <Button 
                                    onClick={handleShowChatBot} 
                                    size="small"
                                    sx={{ 
                                        backgroundColor: "rgba(18, 18, 23, 0.85)", 
                                        backdropFilter: "blur(8px)",
                                        minWidth: "36px", 
                                        height: "36px", 
                                        p: 0, 
                                        borderRadius: "50%",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        '&:hover': { backgroundColor: "rgba(30, 30, 38, 0.95)" } 
                                    }}
                                >
                                    <ModeCommentIcon sx={{ color: "#C5A059", fontSize: "1.1rem" }} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="details pt-3 space-y-1">
                    <div className="name space-y-0.5">
                        <h1 className="font-semibold text-sm text-zinc-300 uppercase tracking-wider truncate">
                            {item.seller?.businessDetails?.businessName || item.seller?.sellerName || "Exclusive"}
                        </h1>
                        <p className="text-zinc-100 text-sm font-medium line-clamp-1">{item.title}</p>
                    </div>
                    <div className="price flex items-center gap-2 pt-1">
                        <span className="font-bold text-base text-[#F5F5F7]">
                            ₹{item.sellingPrice}
                        </span>
                        {item.mrpPrice > item.sellingPrice && (
                            <span className="text-xs thin-line-through text-zinc-500">
                                ₹{item.mrpPrice}
                            </span>
                        )}
                        {item.discountPercent > 0 && (
                            <span className="text-[#C5A059] text-xs font-semibold px-1.5 py-0.5 rounded bg-[#C5A059]/10">
                                {item.discountPercent}% off
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {showChatBot && <section className="absolute left-16 top-0">
                <Modal
                    open={true}
                    onClose={handleCloseChatBot}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <ChatBot handleClose={handleCloseChatBot} productId={item.id} />
                    </Box>
                </Modal>

            </section>}
        </>
    );
};

export default ProductCard;
