import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";

export interface UpdateDetailsFormProps {
  onClose: () => void;
}
const BusinessDetailsForm = ({ onClose }: UpdateDetailsFormProps) => {
  const dispatch = useAppDispatch();
  const { sellers } = useAppSelector((store) => store);
  const formik = useFormik({
    initialValues: {
      businessName: "",
      gstin: "",
      accountStatus: "",
    },
    validationSchema: Yup.object({
      businessName: Yup.string().required("Business Name is required"),
      gstin: Yup.string().required("GSTIN is required"),
      accountStatus: Yup.string().required("Account Status is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      dispatch(
        updateSeller({
          ...values,
          businessDetails: { businessName: values.businessName },
        })
      );
      onClose();
    },
  });

  useEffect(() => {
    if (sellers.profile) {
      formik.setValues({
        businessName: sellers.profile?.businessDetails?.businessName || "",
        gstin: sellers.profile?.gstin || "",
        accountStatus: sellers.profile?.accountStatus || "",
      });
    }
  }, [sellers.profile]);

  return (
    <>
      <h1 className="text-xl pb-5 text-center font-serif font-bold text-[#F5F5F7]">
        Business Details
      </h1>
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="businessName"
          name="businessName"
          label="Business Name"
          value={formik.values.businessName}
          onChange={formik.handleChange}
          error={
            formik.touched.businessName && Boolean(formik.errors.businessName)
          }
          helperText={formik.touched.businessName && formik.errors.businessName}
        />
        <TextField
          fullWidth
          id="gstin"
          name="gstin"
          label="GSTIN"
          value={formik.values.gstin}
          onChange={formik.handleChange}
          error={formik.touched.gstin && Boolean(formik.errors.gstin)}
          helperText={formik.touched.gstin && formik.errors.gstin}
        />
        <TextField
          fullWidth
          id="accountStatus"
          name="accountStatus"
          label="Account Status"
          value={formik.values.accountStatus}
          onChange={formik.handleChange}
          error={
            formik.touched.accountStatus && Boolean(formik.errors.accountStatus)
          }
          helperText={
            formik.touched.accountStatus && formik.errors.accountStatus
          }
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

export default BusinessDetailsForm;
