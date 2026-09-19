import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
  styled,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import {
  fetchSellerProducts,
  updateProductStock,
  createProductsBulk,
} from '../../../Redux Toolkit/Seller/sellerProductSlice';
import EditIcon from '@mui/icons-material/Edit';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import sampleCatalog from '../../../data/sampleCatalog.json';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#16161D',
    color: '#DFBA73',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#F5F5F7',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#0F0F14',
  '&:nth-of-type(odd)': {
    backgroundColor: '#14141B',
  },
  '&:hover': {
    backgroundColor: '#1C1C24',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProductTable() {
  const { sellerProduct } = useAppSelector((store) => store);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loadingBulk, setLoadingBulk] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    dispatch(fetchSellerProducts(localStorage.getItem('jwt')));
  }, []);

  const handleUpdateStack = (id: number | undefined) => () => {
    dispatch(updateProductStock(id));
  };

  const handleQuickSeed = async () => {
    const jwt = localStorage.getItem('jwt');
    setLoadingBulk(true);
    try {
      await dispatch(createProductsBulk({ requests: sampleCatalog, jwt })).unwrap();
      await dispatch(fetchSellerProducts(jwt));
      setSnackbarMessage(`Successfully seeded ${sampleCatalog.length} test products into your catalog!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error('Failed to seed catalog:', err);
      setSnackbarMessage(err?.message || 'Failed to seed sample catalog');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoadingBulk(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const productsArray = JSON.parse(text);

        if (!Array.isArray(productsArray)) {
          throw new Error('JSON file must contain an array of product objects.');
        }

        const jwt = localStorage.getItem('jwt');
        setLoadingBulk(true);
        await dispatch(createProductsBulk({ requests: productsArray, jwt })).unwrap();
        await dispatch(fetchSellerProducts(jwt));
        setSnackbarMessage(`Successfully uploaded ${productsArray.length} products in bulk!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (err: any) {
        console.error('Failed to parse or upload JSON:', err);
        setSnackbarMessage(err?.message || 'Invalid JSON product catalog file');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoadingBulk(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const jsonStr = JSON.stringify(sampleCatalog, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_catalog_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & BULK ACTIONS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#16161D] border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif font-bold text-2xl lg:text-3xl text-[#F5F5F7]">
              Product Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C5A059]/20 text-[#DFBA73] border border-[#C5A059]/30">
              {sellerProduct.products.length} Items
            </span>
          </div>
          <p className="text-xs text-[#A0A0A9] mt-1">
            Manage your store catalog or bulk seed test data in one click
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Seed Button */}
          <Button
            onClick={handleQuickSeed}
            disabled={loadingBulk}
            startIcon={loadingBulk ? <CircularProgress size={16} sx={{ color: '#070708' }} /> : <FlashOnIcon />}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7D3B 100%)',
              color: '#070708',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              px: 2.5,
              py: 0.9,
              boxShadow: '0 4px 14px rgba(197, 160, 89, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E8C885 0%, #D4AF37 50%, #B88E3E 100%)',
              },
            }}
          >
            {loadingBulk ? 'Seeding Catalog...' : '⚡ Quick Seed (24+ Products)'}
          </Button>

          {/* Bulk Upload JSON Button */}
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={loadingBulk}
            startIcon={<UploadFileIcon />}
            variant="outlined"
            sx={{
              color: '#DFBA73',
              borderColor: 'rgba(197, 160, 89, 0.4)',
              textTransform: 'none',
              borderRadius: '10px',
              px: 2,
              py: 0.9,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#DFBA73',
                backgroundColor: 'rgba(197, 160, 89, 0.08)',
              },
            }}
          >
            Upload JSON
          </Button>

          {/* Download JSON Template Button */}
          <Tooltip title="Download sample JSON file template for bulk upload">
            <IconButton
              onClick={handleDownloadTemplate}
              sx={{
                color: '#A0A0A9',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                p: 1,
                '&:hover': {
                  color: '#F5F5F7',
                  borderColor: 'rgba(255,255,255,0.25)',
                },
              }}
            >
              <FileDownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Add Single Product Button */}
          <Button
            onClick={() => navigate('/seller/add-product')}
            startIcon={<AddIcon />}
            variant="contained"
            sx={{
              backgroundColor: '#24242F',
              color: '#F5F5F7',
              textTransform: 'none',
              borderRadius: '10px',
              px: 2,
              py: 0.9,
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.12)',
              '&:hover': {
                backgroundColor: '#2D2D3B',
              },
            }}
          >
            Add Single
          </Button>
        </div>
      </div>

      {/* PRODUCT TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: '#121217',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Product</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell align="right">MRP</StyledTableCell>
              <StyledTableCell align="right">Selling Price</StyledTableCell>
              <StyledTableCell align="right">Color</StyledTableCell>
              <StyledTableCell align="right">Stock Status</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellerProduct.products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8, color: '#71717A' }}>
                  No products in your catalog yet. Click <strong>"⚡ Quick Seed (24+ Products)"</strong> to populate instantly!
                </TableCell>
              </TableRow>
            ) : (
              sellerProduct.products.map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell component="th" scope="row">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1A1A24] border border-white/10 shrink-0 flex items-center justify-center">
                        {item.images?.[0] ? (
                          <img
                            className="w-full h-full object-cover"
                            src={item.images[0]}
                            alt={item.title}
                          />
                        ) : (
                          <span className="text-xs text-gray-500">No Img</span>
                        )}
                      </div>
                      <div className="max-w-[240px]">
                        <p className="font-semibold text-sm text-[#F5F5F7] truncate">{item.title}</p>
                        <p className="text-xs text-[#A0A0A9]">{item.brand || 'Exclusive'}</p>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                      {item.category?.categoryId || 'General'}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="right" sx={{ color: '#71717A', textDecoration: 'line-through' }}>
                    ₹{item.mrpPrice}
                  </StyledTableCell>
                  <StyledTableCell align="right" sx={{ color: '#DFBA73', fontWeight: 700 }}>
                    ₹{item.sellingPrice}
                  </StyledTableCell>
                  <StyledTableCell align="right">{item.color || '-'}</StyledTableCell>
                  <StyledTableCell align="right">
                    <Button
                      onClick={handleUpdateStack(item.id)}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 1.5,
                        py: 0.3,
                        borderRadius: '6px',
                        backgroundColor: item.in_stock ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: item.in_stock ? '#4ade80' : '#f87171',
                        border: item.in_stock ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        '&:hover': {
                          backgroundColor: item.in_stock ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                        },
                      }}
                    >
                      {item.in_stock ? 'In Stock' : 'Out of Stock'}
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      onClick={() => navigate('/seller/update-product/' + item.id)}
                      size="small"
                      sx={{
                        color: '#C5A059',
                        '&:hover': { backgroundColor: 'rgba(197,160,89,0.1)' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* SNACKBAR NOTIFICATION */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

