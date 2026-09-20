import React, { useState } from 'react'
import Banner from './Banner/Banner'
import HomeCategory from './HomeCategory/HomeCategory'
import TopBrand from './TopBrands/Grid'
import ElectronicCategory from './Electronic Category/ElectronicCategory'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Button, LinearProgress } from '@mui/material'
import ChatBot from '../ChatBot/ChatBot'
import { useNavigate } from 'react-router-dom'
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAppSelector } from '../../../Redux Toolkit/Store'
import DealSlider from './Deals/Deals'

const Home = () => {
    const [showChatBot, setShowChatBot] = useState(false)
    const { homePage } = useAppSelector(store => store)
    const navigate = useNavigate();

    const handleShowChatBot = () => {
        setShowChatBot(!showChatBot)
    }
    const handleCloseChatBot = () => {
        setShowChatBot(false)
    }
    const becomeSellerClick = () => {
        navigate("/become-seller")
    }
    return (
        <>
        {homePage.loading && (
            <LinearProgress
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    height: 3,
                    bgcolor: 'rgba(197, 160, 89, 0.2)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#C5A059' }
                }}
            />
        )}
        <div className='space-y-5 lg:space-y-10 relative'>
            <ElectronicCategory />
            {/* <Banner /> */}

            <section>
                <TopBrand />
            </section>

            {homePage.homePageData?.deals && homePage.homePageData.deals.length > 0 && (
                <section className='pt-10'>
                    <h1 className='text-center text-lg lg:text-4xl font-bold text-[#C5A059] pb-5 lg:pb-10'>Today's Deals</h1>
                    <DealSlider/>
                </section>
            )}

            <section className='flex flex-col justify-center items-center py-20 px-5 lg:px-20'>
                <h1 className='text-lg lg:text-4xl font-bold text-[#C5A059] pb-5 lg:pb-20'>SHOP BY CATEGORY</h1>
                <HomeCategory />
            </section>

            <section className='lg:px-20 relative h-[200px] lg:h-[450px] object-cover'>
                <img className='w-full h-full' src={"/seller_banner_image.jpg"} alt="" />
                <div className='absolute top-1/2 left-4 lg:left-[15rem] transform -translate-y-1/2 font-semibold lg:text-4xl space-y-3'>
                    <h1 className=''>
                        Sell Your Product
                    </h1>
                    <p className='text-lg md:text-2xl'>With <strong className='logo text-3xl md:text-5xl pl-2'>noir bazar</strong></p>

                    <div className='pt-6 flex justify-center'>
                        <Button
                            onClick={becomeSellerClick}
                            startIcon={<StorefrontIcon />}
                            variant="contained"
                        >
                            Become Seller
                        </Button>
                    </div>
                </div>
            </section>

            <section className='fixed bottom-10 right-10 z-40'>
                {showChatBot ? <ChatBot handleClose={handleCloseChatBot} /> : <Button onClick={handleShowChatBot} sx={{ borderRadius: "2rem" }} variant='contained' className='h-16 w-16 flex justify-center items-center rounded-full'>
                    <ChatBubbleIcon sx={{ color: "white", fontSize: "2rem" }} />
                </Button>}
            </section>
        </div>
        </>
    )
}

export default Home