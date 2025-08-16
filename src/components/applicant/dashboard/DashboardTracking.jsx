'use client'
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { encode } from "@/helper/GeneralHelpers";
import apiInstance from "@/services/apiService/apiServiceInstance";
import Search from "@/components/searchField/Search";
import { APPLICATION_TRACKING } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

const DashboardTracking = () => {
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

  const [search, setSearch] = React.useState('');
  const [application, setApplication] = React.useState(null);

  const router = useRouter();

  const handleRowClick = (id) => {
    var encodeId = encode(id);
    router.push(`/applicant/dashboard/application/${encodeId}`);
  };

  const onChangeSearch = (text) => {
    setSearch(text);
    if(text === ''){
      setApplication(null);
    }
  }

  const onClickSearch = () => {
    if(search === ''){
      return;
    }
    getTracking(search);
  }
  
  const getTracking = async (req_num = '') => {
    if (!req_num) return;
    try {
      const formData = new FormData();
      formData.append("requisition_number", req_num);
      const response = await apiInstance?.post(APPLICATION_TRACKING, formData);
      const application = response?.data?.data?.application;
      if (application) {
        Toast("success", response?.data?.message);
        setApplication(application);
      } else {
        setApplication(null);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An error occurred while fetching the application.";
      Toast("error", errorMessage);
      setApplication(null);
    }
  };  

  return (
    <Box>
      <Search placeholder="Requisition Number" onChange={onChangeSearch} onClick={onClickSearch} />
      {application && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="My Applications">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#222222" }}>
                  Jobs Applied For
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#222222" }}>
                  Contacted From Employer?
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#222222" }}>
                  Interview?
                </StyledTableCell>
                <StyledTableCell sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#222222" }}>
                  Received Job Offer?
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <StyledTableRow key={application?.id} onClick={() => handleRowClick(application?.id)}>
                  <StyledTableCell sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#222222" }}>
                    {application?.job_title}
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#222222" }}>
                    {application?.contacted_with_employer?.toUpperCase()}
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#222222" }}>
                    {application?.is_interview?.toUpperCase()}
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: { xs: "12px", sm: "14px", md: "16px" }, fontWeight: 400, color: "#222222" }}>
                    {application?.received_job_offer?.toUpperCase()}
                  </StyledTableCell>
                </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DashboardTracking;
