import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../../../Redux Toolkit/Store';
import { createOrder } from '../../../Redux Toolkit/Customer/OrderSlice';
import type { Address } from '../../../types/userTypes';

// Validation schema
const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    .required('Required'),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, 'Invalid pincode')
    .required('Required'),
  address: Yup.string().required('Required'),
  locality: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
});

interface AddressFormProp {
  handleClose: () => void;
  paymentGateway:string
}

const AddressForm:React.FC<AddressFormProp> = ({handleClose,paymentGateway}) => {
  const dispatch=useAppDispatch()
  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: '',
      pinCode: '',
      address: '',
      locality: '',
      city: '',
      state: '',
    },
    validationSchema: ContactSchema,
    onSubmit: (values) => {
      console.log("form submited", values);
      handleCreateOrder(values as Address);
      handleClose();
    },
  });

  const handleCreateOrder=(address:Address)=>{
    dispatch(createOrder({address,jwt:localStorage.getItem('jwt')|| "",paymentGateway}))
  }

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#F5F5F7",
      backgroundColor: "rgba(255,255,255,0.03)",
      borderRadius: "0.5rem",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.15)" },
      "&:hover fieldset": { borderColor: "#C5A059" },
      "&.Mui-focused fieldset": { borderColor: "#C5A059" },
    },
    "& .MuiInputLabel-root": { color: "#A0A0A9" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#C5A059" },
    "& .MuiFormHelperText-root": { color: "#EF4444" }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 1 }}>
      <p className='text-2xl font-serif font-bold text-center pb-6 text-[#F5F5F7]'>
        Delivery & Contact Details
      </p>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="mobile"
              label="Mobile Number (10 digits)"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="pinCode"
              label="Pin Code (6 digits)"
              value={formik.values.pinCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
              helperText={formik.touched.pinCode && formik.errors.pinCode}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              label="Address (House No, Building, Street)"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="locality"
              label="Locality / Landmark"
              value={formik.values.locality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.locality && Boolean(formik.errors.locality)}
              helperText={formik.touched.locality && formik.errors.locality}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="city"
              label="City"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="state"
              label="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
              sx={textFieldSx}
            />
          </Grid>
          <Grid item xs={12} className="pt-2">
            <Button 
              sx={{
                py: "14px",
                bgcolor: "#C5A059",
                color: "#0B0B0E",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "0.75rem",
                textTransform: "none",
                '&:hover': { bgcolor: "#D4AF37" }
              }} 
              type="submit" 
              variant="contained" 
              fullWidth
            >
              Save Address & Continue
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddressForm;
