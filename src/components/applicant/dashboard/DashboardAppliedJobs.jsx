"use client";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Select,
  Typography,
  TablePagination,
  CircularProgress,
  Stack,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { useRouter } from "next/navigation";
import { encode } from "@/helper/GeneralHelpers";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { MY_APPLICATIONS } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useEffect } from "react";

const DashboardAppliedJobs = () => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  }));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [applications, setApplications] = useState([]);
  const [type, setType] = useState("unarchived");
  const [archive, setIsArchive] = useState("");
  const [id, setId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleMenuClose = () => setAnchorEl(null);

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setType(selectedType);
    getMyApplications(selectedType);
  };
  const handleArchived = async (id) => {
    handleMenuClose();
    try {
      const response = await apiInstance.post(`/application/${id}/archive`);
      console.log(response, "api res");
      if (response.status === 200) {
        Toast("success", response?.data?.message);
        getMyApplications(type);
      }
    } catch (error) {
      console.error("Error updating archive status", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const router = useRouter();

  const handleRowClick = (id) => {
    var encodeId = encode(id);
    router.push(`/applicant/dashboard/application/${encodeId}`);
  };

  const getMyApplications = async (appType = "unarchived") => {
    setLoading(true);
    const url = `${MY_APPLICATIONS}?limit=1000&type=${appType}`;
    try {
      const response = await apiInstance?.get(url);
      setApplications(response?.data?.data?.applications);
    } catch (error) {
      // setErrors({
      //   email: error?.response?.data?.message || "Failed to load activities",
      // });
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyApplications(type);
  }, [type]);

  const visibleRows = applications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event, id, application) => {
    setIsArchive(application?.is_archived);
    setId(id);
    setAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          handleArchived(id);
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "18px",
            color: "#111111",
            px: "10px",
          }}
        >
          {archive ? "Unarchive" : "Archive"}
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <Box sx={{ width: "100%", py: 3 }}>
        <Select
          value={type}
          onChange={handleTypeChange}
          displayEmpty
          fullWidth
          sx={{
            boxShadow: "0px 0px 3px 0.4px #00000040",
            width: "100%",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 400,
            color: "#222222",
            backgroundColor: "#FFFFFF",
            height: "60px",
            display: "flex",
            alignItems: "center",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              paddingTop: "0px !important",
              paddingBottom: "0px !important",
            },
          }}
        >
          <MenuItem value="unarchived">Unarchived</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </Select>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="My Applications">
          <TableHead>
            <TableRow>
              <StyledTableCell
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  fontWeight: 400,
                  color: "#222222",
                }}
              >
                Jobs Applied For
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  fontWeight: 400,
                  color: "#222222",
                }}
              >
                Contacted From Employer?
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  fontWeight: 400,
                  color: "#222222",
                }}
              >
                Interview?
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  fontWeight: 400,
                  color: "#222222",
                }}
              >
                Received Job Offer?
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  fontWeight: 400,
                  color: "#222222",
                }}
              >
                Archive unarchived
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Stack alignItems="center" py={2}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading Applications...
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((application, index) => (
                <StyledTableRow
                  key={index}
                  onClick={() => handleRowClick(application?.id)}
                >
                  <StyledTableCell
                    sx={{
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      fontWeight: 400,
                      color: "#222222",
                    }}
                  >
                    {application?.job_title}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      fontWeight: 400,
                      color: "#222222",
                    }}
                  >
                    {application?.contacted_with_employer?.toUpperCase()}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      fontWeight: 400,
                      color: "#222222",
                    }}
                  >
                    {application?.is_interview?.toUpperCase()}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      fontWeight: 400,
                      color: "#222222",
                    }}
                  >
                    {application?.received_job_offer?.toUpperCase()}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      fontWeight: 400,
                      color: "#222222",
                    }}
                  >
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="options"
                      aria-controls={menuId}
                      aria-haspopup="true"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleMenuOpen(event, application?.id, application);
                      }}
                      color="inherit"
                    >
                      <MoreVertRoundedIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper sx={{ marginTop: "6px" }}>
        <TablePagination
          component="div"
          count={applications?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          // rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
      {renderMenu}
    </Box>
  );
};

export default DashboardAppliedJobs;
