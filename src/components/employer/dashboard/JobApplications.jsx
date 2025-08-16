import Search from "@/components/searchField/Search";
import { DASHBOARD_APPLICATIONS } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Application from "./Application";
import { encode } from "@/helper/GeneralHelpers";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { Toast } from "@/components/Toast/Toast";

const JobApplications = ({ jobId = null }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [applications, setApplications] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [type, setType] = useState("unarchived");
  const [id, setId] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClose = () => setAnchorEl(null);

  const handleArchived = async (id, isArchived) => {
    handleMenuClose();
    try {
      const response = await apiInstance.post(`/application/${id}/archive`);
      if (response.status === 200) {
        Toast("success", response?.data?.message);
        fetchJobApplications(search, sortOrder, type);
      }
    } catch (error) {
      console.error("Error updating archive status", error);
    }
  };

  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    setSortOrder(selectedSort);
    fetchJobApplications(search, selectedSort, type);
  };

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setType(selectedType);
    fetchJobApplications(search, sortOrder, selectedType);
  };

  const fetchJobApplications = async (
    text = "",
    sort = "desc",
    appType = "unarchived"
  ) => {
    const url = `${DASHBOARD_APPLICATIONS}${
      jobId ? `/${jobId}` : ""
    }?page=1&limit=100&search=${text}&sort=${sort}&type=${appType}`;

    try {
      const response = await apiInstance.get(url);
      if (response?.status === 200 || response?.status === 201) {
        setApplications(response?.data?.data?.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchJobApplications(search, sortOrder, type);
  }, [sortOrder, type]);

  const onChangeSearch = (text) => {
    setSearch(text);
    if (text === "") {
      fetchJobApplications(text, sortOrder, type);
    }
  };

  const onSearchClick = () => {
    if (search === "") {
      return;
    }
    fetchJobApplications(search, sortOrder, type);
  };

  useEffect(() => {
    fetchJobApplications();
  }, []);

  const handleFurtherDetails = (id) => {
    var encodeId = encode(id);
    router.push(`/employer/dashboard/application/${encodeId}`);
  };

  const renderItems = (data) => {
    return data.map((item) => (
      <Application
        key={item.id}
        item={item}
        onDetailClick={handleFurtherDetails}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        handleMenuClose={handleMenuClose}
        handleArchived={handleArchived}
        setId={setId}
        id={id}
      />
    ));
  };

  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", flexWrap:'wrap' }}
      >
        <Box sx={{ flex: 1 }}>
          <Search
            placeholder="Search UCN"
            onChange={onChangeSearch}
            onClick={onSearchClick}
          />
        </Box>

        <Box 
         sx={{
          width: "200px",
          flexBasis: "200px", 
          flexGrow: 0,
          minWidth: 0,
          "@media (max-width: 750px)": {
            width: "100%",
            flexBasis: "100%",
          },
        }}
        >
          <Select
            value={sortOrder}
            onChange={handleSortChange}
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
              height: { xs: "45px", sm: "53px", md: '60.58px' },
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
            <MenuItem value="desc">Newest</MenuItem>
            <MenuItem value="asc">Oldest</MenuItem>
          </Select>
        </Box>

        <Box 
         sx={{
          width: "200px",
          flexBasis: "200px",
          flexGrow: 0,
          minWidth: 0,
          "@media (max-width: 750px)": {
            width: "100%",
            flexBasis: "100%",
          },
        }}
        >
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
              height: { xs: "45px", sm: "53px", md: '60.58px' },
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
      </Box>

      <Box sx={{ textAlign: "center", paddingY: "10px" }}>
        <Typography
          sx={{
            fontSize: { xs: "22px", sm: "26px", md: "30px" },
            lineHeight: { xs: "20px", md: "18px" },
            fontWeight: 600,
            color: "#00305B",
            textTransform: "capitalize",
          }}
        >
          Applications
        </Typography>
        <Box
          sx={{
            width: "60px",
            height: "2px",
            backgroundColor: "#FE4D82",
            margin: "10px auto 0",
          }}
        />
      </Box>

      {applications.length > 0 ? (
        renderItems(applications)
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh", 
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 500,
              color: "#777",
            }}
          >
            No data found.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default JobApplications;
