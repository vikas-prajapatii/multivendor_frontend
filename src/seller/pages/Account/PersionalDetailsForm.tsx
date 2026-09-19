import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import type { UpdateDetailsFormProps } from "./BussinessDetailsForm";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";

const PersonalDetailsForm = ({ onClose }: UpdateDetailsFormProps) => {
    const { sellers } = useAppSelector(store => store)
    const dispatch=useAppDispatch();

    const formik = useFormik({
        initialValues: {
            sellerName: '',
            email: '',
            mobile: '',
        },
        validationSchema: Yup.object({
            sellerName: Yup.string().required("Seller Name is required"),
            email: Yup.string().email("Invalid email address").required("Email is required"),
            mobile: Yup.string().required("Mobile number is required"),
        }),
        onSubmit: (values) => {
            
            console.log("data ----- ",values);
            dispatch(updateSeller(values))
            onClose()
        },
    });

    useEffect(() => {
        if (sellers.profile) {
            formik.setValues({
                sellerName: sellers.profile?.sellerName || '',
                email: sellers.profile?.email || '',
                mobile: sellers.profile?.mobile || '',
            })
        }
    }, [sellers.profile])

    return (
        <>
            <h1 className="text-xl pb-5 text-center font-serif font-bold text-[#F5F5F7]">
                Personal Details
            </h1>
            <form className="space-y-5" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="sellerName"
                    name="sellerName"
                    label="Seller Name"
                    value={formik.values.sellerName}
                    onChange={formik.handleChange}
                    error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
                    helperText={formik.touched.sellerName && formik.errors.sellerName}
                />
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Seller Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    fullWidth
                    id="mobile"
                    name="mobile"
                    label="Seller Mobile"
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
                        }
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

export default PersonalDetailsForm;
