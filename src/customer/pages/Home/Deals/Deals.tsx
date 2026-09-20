import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DealCard from "./DealCard";
import { useAppSelector } from "../../../../Redux Toolkit/Store";
import type { Deal } from "../../../../types/dealTypes";

export default function DealSlider() {
    const { homePage } = useAppSelector(store => store)
    const deals = homePage.homePageData?.deals;

    if (!deals || deals.length === 0) {
        return null;
    }

    var settings = {
        dots: true,
        infinite: deals.length > 6,
        slidesToShow: Math.min(6, deals.length),
        slidesToScroll: 1,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        responsive: [
            {
              breakpoint: 1024, // Large screen
              settings: {
                slidesToShow: Math.min(4, deals.length),
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 768, // Tablet
              settings: {
                slidesToShow: Math.min(2, deals.length),
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 480, // Mobile
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],

    };
    return (
        <div className=" py-5 lg:px-20">
            <div className="slide-container  ">
                <Slider {...settings}>
                    {deals.map((item: Deal, idx: number) => (
                        <div key={item.id || idx} className="border flex flex-col items-center justify-center">
                            <DealCard deal={item}/>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>

    );
}