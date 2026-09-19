import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Snackbar,
} from "@mui/material";
import ProfileFildCard from "./ProfileFildCard";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonalDetailsForm from "./PersionalDetailsForm";
import BusinessDetailsForm from "./BussinessDetailsForm";
import PickupAddressForm from "./PickupAddressForm";
import BankDetailsForm from "./BankDetailsForm";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { updateSeller } from "../../../Redux Toolkit/Seller/sellerSlice";

export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 460,
  maxWidth: "92vw",
  bgcolor: "#16161D",
  color: "#F5F5F7",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: "16px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
  p: 4,
  outline: "none",
};

const Profile = () => {
  const dispatch = useAppDispatch();
  const { sellers } = useAppSelector((store) => store);
  const [open, setOpen] = React.useState(false);
  const [selectedForm, setSelectedForm] = useState("personalDetails");
  const handleClose = () => setOpen(false);
  const [snackbarOpen, setOpenSnackbar] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      try {
        const url = await uploadToCloudinary(file);
        if (url) {
          dispatch(updateSeller({ profileImage: url }));
        }
      } catch (err) {
        console.error("Failed to upload profile picture:", err);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleOpen = (formName: string) => {
    setOpen(true);
    setSelectedForm(formName);
  };

  const renderSelectedForm = () => {
    switch (selectedForm) {
      case "personalDetails":
        return <PersonalDetailsForm onClose={handleClose} />;
      case "businessDetails":
        return <BusinessDetailsForm onClose={handleClose} />;
      case "pickupAddress":
        return <PickupAddressForm onClose={handleClose} />;
      case "bankDetails":
        return <BankDetailsForm onClose={handleClose} />;
      default:
        return null;
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (sellers.profileUpdated || sellers.error) {
      setOpenSnackbar(true);
    }
  }, [sellers.profileUpdated]);

  const editButtonSx = {
    borderRadius: "50%",
    minWidth: "46px",
    width: "46px",
    height: "46px",
    background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7D3B 100%)',
    color: '#070708',
    boxShadow: '0 4px 14px rgba(197, 160, 89, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #E8C885 0%, #D4AF37 50%, #B88E3E 100%)',
    },
  };

  return (
    <div className="lg:p-10 space-y-12">
      {/* PERSONAL DETAILS SECTION */}
      <div className="w-full lg:w-[75%]">
        <div className="flex items-center pb-4 justify-between border-b border-white/10 mb-6">
          <h1 className="text-2xl font-serif font-bold text-[#F5F5F7]">
            Personal Details
          </h1>
          <Button
            onClick={() => handleOpen("personalDetails")}
            size="small"
            sx={editButtonSx}
            variant="contained"
          >
            <EditIcon fontSize="small" />
          </Button>
        </div>
        <div className="space-y-6">
          {/* PROFILE PICTURE WITH UPLOAD TRIGGER */}
          <div className="relative inline-block group">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <div
              onClick={handleProfilePicClick}
              className="relative cursor-pointer rounded-full overflow-hidden w-32 h-32"
              title="Click to change profile picture"
            >
              <Avatar
                sx={{
                  width: "100%",
                  height: "100%",
                  border: "2.5px solid #C5A059",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  transition: "all 0.3s ease",
                }}
                src={
                  sellers.profile?.profileImage ||
                  sellers.profile?.businessDetails?.logo ||
                  "https://cdn.pixabay.com/photo/2014/11/29/19/33/bald-eagle-550804_640.jpg"
                }
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <CameraAltIcon sx={{ fontSize: 28, color: "#DFBA73" }} />
                <span className="text-[11px] font-semibold mt-1 tracking-wider text-[#F5F5F7]">CHANGE</span>
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <CircularProgress size={30} sx={{ color: "#C5A059" }} />
                </div>
              )}
            </div>

            <IconButton
              onClick={handleProfilePicClick}
              size="small"
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                background: "linear-gradient(135deg, #DFBA73 0%, #C5A059 100%)",
                color: "#070708",
                boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
                "&:hover": {
                  background: "linear-gradient(135deg, #E8C885 0%, #D4AF37 100%)",
                },
                width: 34,
                height: 34,
              }}
              title="Upload new profile picture"
            >
              <CameraAltIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#16161D]">
            <ProfileFildCard
              keys={"Seller Name"}
              value={sellers.profile?.sellerName}
            />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <ProfileFildCard
              keys={"Seller Email"}
              value={sellers.profile?.email}
            />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            <ProfileFildCard
              keys={"Seller Mobile"}
              value={sellers.profile?.mobile}
            />
          </div>
        </div>
      </div>

      {/* BUSINESS DETAILS SECTION */}
      <div className="w-full lg:w-[75%]">
        <div className="flex items-center pb-4 justify-between border-b border-white/10 mb-6">
          <h1 className="text-2xl font-serif font-bold text-[#F5F5F7]">
            Business Details
          </h1>
          <Button
            onClick={() => handleOpen("businessDetails")}
            size="small"
            sx={editButtonSx}
            variant="contained"
          >
            <EditIcon fontSize="small" />
          </Button>
        </div>

        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#16161D]">
          <ProfileFildCard
            keys={"Business / Brand"}
            value={sellers.profile?.businessDetails?.businessName}
          />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <ProfileFildCard
            keys={"GSTIN"}
            value={sellers.profile?.gstin || "not provided"}
          />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <ProfileFildCard
            keys={"Account Status"}
            value={sellers.profile?.accountStatus}
          />
        </div>
      </div>

      {/* PICKUP ADDRESS SECTION */}
      <div className="w-full lg:w-[75%]">
        <div className="flex items-center pb-4 justify-between border-b border-white/10 mb-6">
          <h1 className="text-2xl font-serif font-bold text-[#F5F5F7]">
            Pickup Address
          </h1>
          <Button
            onClick={() => handleOpen("pickupAddress")}
            size="small"
            sx={editButtonSx}
            variant="contained"
          >
            <EditIcon fontSize="small" />
          </Button>
        </div>
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#16161D]">
          <ProfileFildCard
            keys={"Address"}
            value={sellers.profile?.pickupAddress?.address}
          />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <ProfileFildCard
            keys={"City"}
            value={sellers.profile?.pickupAddress?.city || "not provided"}
          />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <ProfileFildCard
            keys={"State"}
            value={sellers.profile?.pickupAddress?.state}
          />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <ProfileFildCard
            keys={"Mobile"}
            value={sellers.profile?.pickupAddress?.mobile}
          />
        </div>
      </div>

      {/* BANK DETAILS SECTION */}
      <div className="w-full lg:w-[75%]">
        <div className="flex items-center pb-4 justify-between border-b border-white/10 mb-6">
          <h1 className="text-2xl font-serif font-bold text-[#F5F5F7]">
            Bank Details
          </h1>
          <Button
            onClick={() => handleOpen("bankDetails")}
            size="small"
            sx={editButtonSx}
            variant="contained"
          >
            <EditIcon fontSize="small" />
          </Button>
        </div>
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#16161D]">
          <ProfileFildCard
            keys={"Account Holder"}
            value={sellers.profile?.bankDetails?.accountHolderName}
          />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <ProfileFildCard
            keys={"Account Number"}
            value={
              sellers.profile?.bankDetails?.accountNumber || "not provided"
            }
          />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <ProfileFildCard
            keys={"IFSC Code"}
            value={sellers.profile?.bankDetails?.ifscCode}
          />
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>{renderSelectedForm()}</Box>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={sellers.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {sellers.error ? sellers.error : "Profile Updated Successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
