import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Navbar.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { mainCategory } from "../../../data/category/mainCategory";
import CategorySheet from "./CategorySheet";
import DrawerList from "./DrawerList";
import { useNavigate, useSearchParams } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { FavoriteBorder } from "@mui/icons-material";


const Navbar = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("men");
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const dispatch = useAppDispatch();
  const { user, auth, cart, sellers } = useAppSelector((store) => store);
  const navigate = useNavigate();
  

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };



  const becomeSellerClick = () => {
    if (sellers.profile?.id) {
      navigate("/seller")
    } else navigate("/become-seller")
  }

 

  return (
    <Box
      sx={{ zIndex: 100 }}
      className="sticky top-0 left-0 right-0 bg-[#070708]/80 backdrop-blur-md border-b border-white/5 text-white"
    >
      <div className="flex items-center justify-between px-5 lg:px-20 h-[75px]">
        <div className="flex items-center gap-9">
          <div className="flex items-center gap-2">
            {!isLarge && (
              <IconButton onClick={() => toggleDrawer(true)()}>
                <MenuIcon className="text-gray-300" sx={{ fontSize: 29 }} />
              </IconButton>
            )}
            <h1
              onClick={() => navigate("/")}
              className="logo cursor-pointer text-lg md:text-3xl font-bold tracking-widest uppercase gold-gradient-text"
            >
              Noir Bazar
            </h1>
          </div>

          {isLarge && (
            <ul
              className="flex items-center font-medium text-gray-200"
            >
              {mainCategory.map((item) => (
                <li
                  onMouseLeave={() => {
                    setShowSheet(false);
                  }}
                  onMouseEnter={() => {
                    setSelectedCategory(item.categoryId);
                    setShowSheet(true);
                  }}
                  className="mainCategory hover:text-[#C5A059] cursor-pointer hover:border-b-2 h-[70px] px-4 border-[#C5A059] flex items-center transition-colors duration-200"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-1 lg:gap-6 items-center">
          <IconButton onClick={()=>navigate("/search-products")}>
            <SearchIcon className="text-gray-300" sx={{ fontSize: 29 }} />
          </IconButton>

          {user.user ? (
            <Button
              onClick={() => navigate("/account/orders")}
              className="flex items-center gap-2"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  border: "1.5px solid #C5A059",
                  bgcolor: "#1E1E26",
                  color: "#DFBA73",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
                src={user.user?.profileImage || undefined}
              >
                {user.user?.fullName?.[0]?.toUpperCase()}
              </Avatar>
              <h1 className="font-semibold hidden lg:block">
                {user.user?.fullName?.split(" ")[0]}
              </h1>
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<AccountCircleIcon sx={{ fontSize: "12px" }} />}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}

          <IconButton onClick={()=>navigate("/wishlist")}>
            <FavoriteBorder sx={{ fontSize: 29 }}
                className="text-gray-300 hover:text-[#C5A059] transition-colors" />
          </IconButton>

          <IconButton onClick={() => navigate("/cart")}>
            <Badge badgeContent={cart.cart?.cartItems.length} color="primary">
              <AddShoppingCartIcon
                sx={{ fontSize: 29 }}
                className="text-gray-300 hover:text-[#C5A059] transition-colors"
              />
            </Badge>
          </IconButton>

          {isLarge && (
            <Button
              onClick={becomeSellerClick}
              startIcon={<StorefrontIcon />}
              variant="outlined"
            >
              Become Seller
            </Button>
          )}
        </div>
      </div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {<DrawerList toggleDrawer={toggleDrawer} />}
      </Drawer>
      {showSheet && selectedCategory && (
        <div
          onMouseLeave={() => setShowSheet(false)}
          onMouseEnter={() => setShowSheet(true)}
          className="categorySheet absolute top-[4.41rem] left-20 right-20 "
        >
          <CategorySheet
            setShowSheet={setShowSheet}
            selectedCategory={selectedCategory}
          />
        </div>
      )}
    </Box>
  );
};

export default Navbar;
