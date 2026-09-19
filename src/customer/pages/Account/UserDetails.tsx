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
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ProfileFildCard from "../../../seller/pages/Account/ProfileFildCard";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { updateUserProfile } from "../../../Redux Toolkit/Customer/UserSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";

const modalStyle = {
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

const UserDetails = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store);
  const [openModal, setOpenModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    mobile: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user.user) {
      setFormData({
        fullName: user.user.fullName || "",
        mobile: user.user.mobile || "",
      });
    }
  }, [user.user]);

  const handleOpenModal = () => {
    setFormData({
      fullName: user.user?.fullName || "",
      mobile: user.user?.mobile || "",
    });
    setFormErrors({ fullName: "", mobile: "" });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const jwt = localStorage.getItem("jwt");

    if (file && jwt) {
      setUploadingImage(true);
      try {
        const url = await uploadToCloudinary(file);
        if (url) {
          await dispatch(updateUserProfile({ jwt, user: { profileImage: url } })).unwrap();
          setSnackbarMessage("Profile picture updated successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      } catch (err: any) {
        console.error("Failed to upload profile picture:", err);
        setSnackbarMessage(err?.message || "Failed to upload profile picture");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setUploadingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");

    if (!jwt) {
      setSnackbarMessage("Please log in to update your profile");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!formData.fullName.trim()) {
      setFormErrors((prev) => ({ ...prev, fullName: "Full name is required" }));
      return;
    }

    try {
      await dispatch(
        updateUserProfile({
          jwt,
          user: {
            fullName: formData.fullName.trim(),
            mobile: formData.mobile.trim(),
          },
        })
      ).unwrap();

      setSnackbarMessage("Profile details updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenModal(false);
    } catch (err: any) {
      console.error("Failed to update profile details:", err);
      setSnackbarMessage(err?.message || "Failed to update profile details");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="w-full lg:w-[75%] space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#F5F5F7]">
              My Profile
            </h1>
            <p className="text-sm text-[#A0A0A9] mt-1">
              Manage your personal information and profile picture
            </p>
          </div>
          <Button
            onClick={handleOpenModal}
            startIcon={<EditIcon sx={{ fontSize: 18 }} />}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7D3B 100%)",
              color: "#070708",
              fontWeight: 700,
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: "10px",
              boxShadow: "0 4px 14px rgba(197, 160, 89, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #E8C885 0%, #D4AF37 50%, #B88E3E 100%)",
              },
            }}
          >
            Edit Profile
          </Button>
        </div>

        {/* PROFILE PICTURE & SUMMARY CARD */}
        <div className="p-6 lg:p-8 rounded-2xl border border-white/10 shadow-xl bg-[#16161D] flex flex-col sm:flex-row items-center gap-6">
          {/* AVATAR WITH UPLOAD TRIGGER */}
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
              className="relative cursor-pointer rounded-full overflow-hidden w-28 h-28 lg:w-32 lg:h-32 group"
              title="Click to change profile picture"
            >
              <Avatar
                sx={{
                  width: "100%",
                  height: "100%",
                  border: "2.5px solid #C5A059",
                  bgcolor: "#24242F",
                  color: "#DFBA73",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                  transition: "all 0.3s ease",
                }}
                src={user.user?.profileImage || undefined}
              >
                {user.user?.fullName?.[0]?.toUpperCase() || "U"}
              </Avatar>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                <CameraAltIcon sx={{ fontSize: 26, color: "#DFBA73" }} />
                <span className="text-[10px] font-bold mt-1 tracking-wider text-[#F5F5F7]">
                  CHANGE
                </span>
              </div>

              {/* Upload spinner */}
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-10">
                  <CircularProgress size={28} sx={{ color: "#C5A059" }} />
                </div>
              )}
            </div>

            {/* Camera Floating Button */}
            <IconButton
              onClick={handleProfilePicClick}
              size="small"
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                background: "linear-gradient(135deg, #DFBA73 0%, #C5A059 100%)",
                color: "#070708",
                boxShadow: "0 2px 10px rgba(0,0,0,0.7)",
                "&:hover": {
                  background: "linear-gradient(135deg, #E8C885 0%, #D4AF37 100%)",
                },
                width: 32,
                height: 32,
              }}
              title="Upload profile picture"
            >
              <CameraAltIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </div>

          {/* User basic info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl lg:text-2xl font-bold text-[#F5F5F7]">
                {user.user?.fullName || "Valued Customer"}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C5A059]/15 text-[#DFBA73] border border-[#C5A059]/30 self-center sm:self-auto">
                Customer
              </span>
            </div>
            <p className="text-sm text-[#A0A0A9]">{user.user?.email}</p>
            <p className="text-xs text-[#71717A]">
              Click the photo or camera icon to upload a high-resolution profile picture.
            </p>
          </div>
        </div>

        {/* DETAILED INFORMATION CARDS */}
        <div className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-[#F5F5F7] px-1">
            Personal Information
          </h2>
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-[#16161D]">
            <ProfileFildCard keys={"Full Name"} value={user.user?.fullName} />
            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
            <div className="p-4 lg:p-5 flex items-center justify-between bg-[#16161D] hover:bg-[#1C1C24] transition-colors">
              <div className="flex items-center flex-1">
                <p className="w-28 sm:w-36 lg:w-48 pr-4 text-[#A0A0A9] text-sm lg:text-base font-medium tracking-wide shrink-0">
                  Email Address
                </p>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
                <p className="pl-4 lg:pl-8 font-semibold text-sm sm:text-base lg:text-lg text-[#F5F5F7] tracking-wide break-all">
                  {user.user?.email}
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <CheckCircleIcon sx={{ fontSize: 13 }} /> Verified
              </span>
            </div>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
            <ProfileFildCard
              keys={"Mobile Number"}
              value={user.user?.mobile ? user.user.mobile : undefined}
            />
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-profile-modal"
      >
        <Box sx={modalStyle}>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <h2 className="text-xl font-serif font-bold text-[#F5F5F7]">
              Edit Profile Details
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-[#A0A0A9] hover:text-white transition-colors text-xl font-bold px-1"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" });
                }}
                error={Boolean(formErrors.fullName)}
                helperText={formErrors.fullName}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#F5F5F7",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    "&:hover fieldset": { borderColor: "#C5A059" },
                    "&.Mui-focused fieldset": { borderColor: "#DFBA73" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#A0A0A9",
                    "&.Mui-focused": { color: "#DFBA73" },
                  },
                }}
              />
            </div>

            <div>
              <TextField
                fullWidth
                disabled
                label="Email Address"
                value={user.user?.email || ""}
                helperText="Email cannot be changed (used for login)"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#71717A",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.08)" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#71717A",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#71717A",
                  },
                }}
              />
            </div>

            <div>
              <TextField
                fullWidth
                label="Mobile Number"
                placeholder="e.g. 9876543210"
                value={formData.mobile}
                onChange={(e) => {
                  setFormData({ ...formData, mobile: e.target.value });
                  if (formErrors.mobile) setFormErrors({ ...formErrors, mobile: "" });
                }}
                error={Boolean(formErrors.mobile)}
                helperText={formErrors.mobile}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#F5F5F7",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    "&:hover fieldset": { borderColor: "#C5A059" },
                    "&.Mui-focused fieldset": { borderColor: "#DFBA73" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#A0A0A9",
                    "&.Mui-focused": { color: "#DFBA73" },
                  },
                }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outlined"
                fullWidth
                onClick={handleCloseModal}
                sx={{
                  color: "#A0A0A9",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  textTransform: "none",
                  py: 1.2,
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "#F5F5F7",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={user.loading}
                sx={{
                  background: "linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7D3B 100%)",
                  color: "#070708",
                  fontWeight: 700,
                  textTransform: "none",
                  py: 1.2,
                  borderRadius: "8px",
                  boxShadow: "0 4px 14px rgba(197, 160, 89, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #E8C885 0%, #D4AF37 50%, #B88E3E 100%)",
                  },
                }}
              >
                {user.loading ? (
                  <CircularProgress size={22} sx={{ color: "#070708" }} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* FEEDBACK SNACKBAR */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserDetails;
