import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState } from "react";
import { brands } from "../../../data/Filter/brand";
import { teal } from "@mui/material/colors";
import { colors } from "../../../data/Filter/color";
import { price } from "../../../data/Filter/price";
import { discount } from "../../../data/Filter/discount";
import { useSearchParams } from "react-router-dom";

const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false);
  const [expendBrand, setExpendBrand] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleExpendBrand = () => {
    setExpendBrand(!expendBrand);
  };
  const handleExpendColor = () => {
    setExpendColor(!expendColor);
  };

  const updateFilterParams = (e: any) => {
    const { value, name } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    console.log("clearAllFilters",searchParams)
    searchParams.forEach((value: any, key: any) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-5 bg-[#121217] border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between h-[40px] px-2 pb-2">
        <p className="text-lg font-serif font-bold text-[#F5F5F7]">Filters</p>
        <Button
          onClick={clearAllFilters}
          size="small"
          sx={{
            color: "#C5A059",
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "11px",
            letterSpacing: "0.05em",
            "&:hover": { color: "#DFBA73" },
          }}
        >
          clear all
        </Button>
      </div>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />
      <div className="px-2 space-y-6">
        <section>
          <FormControl sx={{ zIndex: 0, width: "100%" }}>
            <FormLabel
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                pb: "10px",
                color: "#C5A059 !important",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              id="color"
            >
              Color
            </FormLabel>
            <RadioGroup
              onChange={updateFilterParams}
              aria-labelledby="color"
              defaultValue=""
              name="color"
            >
              {colors
                .slice(0, expendColor ? colors.length : 5)
                .map((item) => (
                  <FormControlLabel
                    sx={{
                      fontSize: "13px",
                      color: "#E4E4E7",
                      "&:hover": { color: "#FFFFFF" },
                    }}
                    key={item.name}
                    value={item.name}
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: "rgba(255, 255, 255, 0.3)",
                          "&.Mui-checked": { color: "#C5A059" },
                        }}
                      />
                    }
                    label={
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span
                          style={{ backgroundColor: item.hex }}
                          className={`h-4 w-4 rounded-full ${
                            item.name === "White"
                              ? "border border-white/50"
                              : "border border-white/20"
                          }`}
                        ></span>
                      </div>
                    }
                  />
                ))}
            </RadioGroup>
          </FormControl>
          <div>
            <button
              onClick={handleExpendColor}
              className="text-[#C5A059] hover:text-[#DFBA73] text-xs font-semibold cursor-pointer flex items-center pt-2 tracking-wide"
            >
              {expendColor ? "hide" : `+ ${colors.length - 5} more`}
            </button>
          </div>
        </section>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

        <section>
          <FormControl sx={{ width: "100%" }}>
            <FormLabel
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                pb: "10px",
                color: "#C5A059 !important",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              id="price"
            >
              Price
            </FormLabel>
            <RadioGroup
              name="price"
              onChange={updateFilterParams}
              aria-labelledby="price"
              defaultValue=""
            >
              {price.map((item) => (
                <FormControlLabel
                  sx={{
                    fontSize: "13px",
                    color: "#E4E4E7",
                    "&:hover": { color: "#FFFFFF" },
                  }}
                  key={item.name}
                  value={item.value}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "rgba(255, 255, 255, 0.3)",
                        "&.Mui-checked": { color: "#C5A059" },
                      }}
                    />
                  }
                  label={<span className="text-sm font-medium">{item.name}</span>}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

        <section>
          <FormControl sx={{ width: "100%" }}>
            <FormLabel
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                pb: "10px",
                color: "#C5A059 !important",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
              id="discount"
            >
              Discount
            </FormLabel>
            <RadioGroup
              name="discount"
              onChange={updateFilterParams}
              aria-labelledby="discount"
              defaultValue=""
            >
              {discount.map((item) => (
                <FormControlLabel
                  sx={{
                    fontSize: "13px",
                    color: "#E4E4E7",
                    "&:hover": { color: "#FFFFFF" },
                  }}
                  key={item.name}
                  value={item.value}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "rgba(255, 255, 255, 0.3)",
                        "&.Mui-checked": { color: "#C5A059" },
                      }}
                    />
                  }
                  label={<span className="text-sm font-medium">{item.name}</span>}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
      </div>
    </div>
  );
};

export default FilterSection;
