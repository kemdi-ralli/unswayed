"use client";
import { Box, Rating, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Search from "../searchField/Search";
import Container from "../common/Container";
import BackButtonWithTitle from "../applicant/dashboard/BackButtonWithTitle";
import Image from "next/image";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_POPULAR_COMPANIES } from "@/services/apiService/apiEndPoints";
import { useSelector } from "react-redux";
import Link from "next/link";
import { encode } from "@/helper/GeneralHelpers";
import FormTitle from "../applicant/dashboard/FormTitle";

const Feedback = ({ data }) => {
  const [PopularCompanies, setPopularCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const { user: { id = null, type = null } = {} } = useSelector(
    (state) => state?.auth?.userData || {}
  );
  const Stars = [5, 4, 3, 2, 1];

  const getPopularCompanies = async () => {
    const response = await apiInstance.get(
      `${GET_POPULAR_COMPANIES}?limit=20&page=1`
    );
    if (response.status === 200 || response.status === 201) {
      setPopularCompanies(response.data.data.employers);
    }
  };

  const onSearch = async () => {
    try {
      const response = await apiInstance.get(
        `${GET_POPULAR_COMPANIES}?search=${search}&limit=20&page=1`
      );
      if (response.status === 200 || response.status === 201) {
        setPopularCompanies(response.data.data.employers);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (search === "") {
      getPopularCompanies();
    }
  }, [search]);

  useEffect(() => {
    getPopularCompanies();
  }, []);



  return (
    <Container>
      <BackButtonWithTitle label="Feedback" />
      <Search onChange={setSearch} onClick={onSearch} />
      <FormTitle label="Industry Leaders" />
      {PopularCompanies?.map((item, index) => {
        const encodeId = encode(item.id);
        return (
          <Box key={index} sx={styles.contentContainer}>
            <Box sx={styles.userDetail}>
              <Image
                src={item?.photo ? item.photo : "/assets/images/profile.png"}
                width={50}
                height={50}
                alt="feedback"
                style={styles.avatar}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={styles.name}>
                  {item?.first_name +
                    " " +
                    item.middle_name +
                    " " +
                    item.last_name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "10px",
                      md: "12px",
                      lg: "12px",
                    },
                    fontWeight: 600,
                    color: "#00305B",
                    textDecoration: "underline",
                  }}
                >
                  {item?.reviews_count} reviews
                </Typography>
                <Box sx={styles.starContainer}>
                  <Rating
                    name="company-rating"
                    value={item?.averageRating || 0}
                    precision={0.5}
                    readOnly
                    sx={{
                      fontSize: '16px'
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Typography sx={styles.about}>
              {item?.about?.slice(0, 250)}{item?.about?.length > 250 ? "..." : ""}
            </Typography>

            <Link href={`/profile/${encodeId}`} key={index}>
              <Typography sx={styles.link}>View Details</Typography>
            </Link>
          </Box>
        );
      })}
    </Container>
  );
};

const styles = {
  contentContainer: {
    borderRadius: "10px",
    boxShadow: "0px 1px 3px #00000040",
    p: 2,
    mb: 2,
  },
  userDetail: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  avatar: {
    borderRadius: "50px",
    border: "2px solid",
    borderColor: "black",
    objectFit: "contain",
    "& img": {
      objectFit: "contain",
    },
  },
  name: {
    fontSize: {
      xs: "10px",
      sm: "12px",
      md: "14px",
      lg: "14px",
    },
    fontWeight: 400,
    color: "#111111",
  },
  username: {
    fontSize: {
      xs: "8px",
      sm: "10px",
      md: "12px",
      lg: "12px",
    },
    fontWeight: 400,
    color: "#111111",
  },
  about: {
    fontSize: { xs: "14px", sm: "16px" },
    fontWeight: 400,
    lineHeight: { xs: "20px", sm: "22px", md: "26px" },
    color: "#111111",
    py: 1,
  },
  link: {
    textDecorationLine: "underline",
    color: "#FE4D82",
    fontSize: {
      xs: "10px",
      sm: "12px",
      md: "14px",
      lg: "16px",
    },
    fontWeight: "600",
  },
};

export default Feedback;
