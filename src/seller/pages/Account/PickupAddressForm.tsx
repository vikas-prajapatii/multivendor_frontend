import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import type { UpdateDetailsFormProps } from "./BussinessDetailsForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";

const PickupAddressForm = ({ onClose }: UpdateDetailsFormProps) => {
  const { sellers } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      address: "",
      city: "",
      state: "",
      mobile: "",
    },
    validationSchema: Yup.object({
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      mobile: Yup.string().required("Mobile number is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      dispatch(
        updateSeller({
          pickupAddress: values,
         
        })
      );
      onClose();
    },
  });

  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        address: sellers.profile?.pickupAddress?.address || "",
        city: sellers.profile?.pickupAddress?.city || "",
        state: sellers.profile?.pickupAddress?.state || "",
        mobile: sellers.profile?.pickupAddress?.mobile || "",
      });
    }
  }, [sellers.profile]);

  return (
    <>
      <h1 className="text-xl pb-5 text-center font-serif font-bold text-[#F5F5F7]">
        Pickup Address
      </h1>
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="address"
          name="address"
          label="Address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        <TextField
          fullWidth
          id="city"
          name="city"
          label="City"
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
        />
        <TextField
          fullWidth
          id="state"
          name="state"
          label="State"
          value={formik.values.state}
          onChange={formik.handleChange}
          error={formik.touched.state && Boolean(formik.errors.state)}
          helperText={formik.touched.state && formik.errors.state}
        />
        <TextField
          fullWidth
          id="mobile"
          name="mobile"
          label="Mobile"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />
        <Button
          sx={{
            py: ".9rem",
            background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7D3B 100%)',
            color: '#070708',
            fontWeight: 'bold',
            borderRadius: '8px',
            '&:hover': {
              background: 'linear-gradient(135deg, #E8C885 0%, #D4AF37 50%, #B88E3E 100%)',
            },
          }}
          variant="contained"
          fullWidth
          type="submit"
        >
          Save Changes
        </Button>
      </form>
    </>
  );
};

export default PickupAddressForm;
