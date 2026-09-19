/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard";
import FilterSection from "./FilterSection";
import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { getAllProducts } from "../../../Redux Toolkit/Customer/ProductSlice";



const Products = () => {
  const [sort, setSort] = React.useState("");
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showFilter, setShowFilter] = useState(false);
  const { categoryId } = useParams();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);
  const [searchParams] = useSearchParams();
  const [page,setPage]=useState(1)
  

  const handleSortProduct = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const handleShowFilter = () => {
    setShowFilter((prev) => !prev);
    console.log("showFilter   ", showFilter);
  };

  const handlePageChange = (value: any) => {
    setPage(value)
    console.log("page nummmberr ", value);
  };

  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const newFilters = {
      brand: searchParams.get("brand") || "",
      color: searchParams.get("color") || "",
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      pageNumber:page-1,
      minDiscount: searchParams.get("discount")
        ? Number(searchParams.get("discount"))
        : undefined,
    };

    dispatch(getAllProducts({ category: categoryId, sort, ...newFilters }));
  }, [searchParams, categoryId, sort,page]);


  // console.log(" store ", products)
  return (
    <div className="-z-10 mt-8 mb-16">
      <div className="text-center py-4">
        <h1 className="text-3xl font-serif font-bold text-[#F5F5F7] tracking-wider pb-3 px-9 uppercase space-x-2">
          {categoryId?.split("_").map((item, idx) => (
            <span key={idx} className="gold-gradient-text mr-2">{item}</span>
          ))}
        </h1>
        <p className="text-xs text-[#A0A0A9] uppercase tracking-widest">
          Curated Luxury Collection
        </p>
      </div>
      <div className="lg:flex gap-6 px-4 lg:px-8">
        <section className="hidden lg:block w-[240px] shrink-0">
          <FilterSection />
        </section>
        <div className="w-full space-y-6">
          <div className="flex justify-between items-center px-4 h-[40px]">
            <div className="relative w-[50%]">
              {!isLarge && (
                <IconButton onClick={handleShowFilter} sx={{ color: "#C5A059" }}>
                  <FilterAltIcon />
                </IconButton>
              )}
              {showFilter && !isLarge && (
                <Box sx={{ zIndex: 10 }} className="absolute top-[60px] left-0 w-80">
                  <FilterSection />
                </Box>
              )}
            </div>
            <FormControl size="small" sx={{ width: "200px" }}>
              <InputLabel id="sort" sx={{ color: "#A0A0A9", "&.Mui-focused": { color: "#C5A059" } }}>Sort</InputLabel>
              <Select
                labelId="sort"
                id="sort"
                value={sort}
                label="Sort"
                onChange={handleSortProduct}
                sx={{
                  color: "#F5F5F7",
                  bgcolor: "#121217",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.12)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C5A059" },
                }}
              >
                <MenuItem value={"price_low"}>Price : Low - High</MenuItem>
                <MenuItem value={"price_high"}>Price : High - Low</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

          {products.products?.length > 0 ? (
            <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 justify-center">
              {products.products.map((item: any, index: number) => (
                <div key={item.id || index * 9} className="">
                  <ProductCard item={item} />
                </div>
              ))}
            </section>
          ) : (
            <section className="items-center flex flex-col gap-6 justify-center h-[55vh] border border-white/10 rounded-2xl bg-[#121217]/50 p-8 shadow-inner">
              <img
                className="w-64 opacity-85"
                src="https://cdn.pixabay.com/photo/2022/05/28/10/45/oops-7227010_960_720.png"
                alt=""
              />
              <h1 className="font-serif font-bold text-xl text-center flex flex-wrap items-center justify-center gap-2 text-[#F5F5F7]">
                Product Not Found For{" "}
                <span className="text-[#C5A059] uppercase tracking-wider">
                  {categoryId?.split("_").join(" ")}
                </span>
              </h1>
            </section>
          )}
          <div className="flex justify-center pt-10">
            <Pagination
              page={page}
              onChange={(_, value) => handlePageChange(value)}
              count={products?.totalPages || 1}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#A0A0A9",
                  borderColor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(197, 160, 89, 0.15)",
                    color: "#C5A059",
                  },
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#C5A059 !important",
                  color: "#0B0B0E !important",
                  fontWeight: 700,
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
