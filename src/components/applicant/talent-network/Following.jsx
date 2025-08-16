import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import { usePathname, useRouter } from "next/navigation";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { FOLLOW_USER } from "@/services/apiService/apiEndPoints";
import { encode } from "@/helper/GeneralHelpers";

const Following = ({ data }) => {
  const [FollowData, setFollowData] = useState();
  const path = usePathname();
  const router = useRouter();
  const handleLoadMore = () => {
    router.push("/applicant/talent-network/my-connections");
  };
  const onClickNetwork = (id) => {
    const encodedId = encode(id);
    router.push(`/profile/${encodedId}`);
  };

  useEffect(() => {
    setFollowData(data);
  }, [data]);

  const onFollow = async (id) => {
    const formData = new FormData();
    formData.append("following_user_id", id);
    if (formData) {
      const response = await apiInstance.post(FOLLOW_USER, formData);
      console.log(response);
      if (response.status === 200 || 201) {
        setFollowData((prevData) =>
          prevData.map((el) =>
            el.id === id ? { ...el, isFollowed: !el.isFollowed } : el
          )
        );
      }
    }
  };

  return (
    <Box>
      {FollowData?.map((item, index) => (
        <Box
          key={index}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 0,
            padding: 0,
            margin: "auto",
            borderBottom: "1px solid #0000004D",
            outline: "none",
            my: 2,
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              px: { xs: 1, lg: 2 },
              py: 2,
            }}
          >
            <Box
              onClick={() => onClickNetwork(item.id)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <Avatar
                alt="Profile Picture"
                src={item?.photo ? item.photo : ""}
                sx={{
                  width: { xs: 50, lg: 68 },
                  height: { xs: 50, lg: 68 },
                }}
              />
              <Box sx={{ px: { xs: 1, lg: 1.5 } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", lg: "16px" },
                    lineHeight: "18px",
                    fontWeight: 500,
                    color: "#00305B",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  {item?.first_name +
                    " " +
                    item?.middle_name +
                    " " +
                    item?.last_name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "10px", lg: "12px" },
                    lineHeight: "17px",
                    fontWeight: 300,
                    py: 0.5,
                    pb: 1,
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  {item?.username}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              sx={{
                backgroundColor: !item.isFollowed && "#FE4D82",
                minWidth: "151.16px",
                height: "46px",
                margin: "0px auto",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: !item.isFollowed ? "#FE4D82" : "#00305B",
                boxShadow: "0px 1px 3px #00000033",
                color: !item.isFollowed ? "#FFFFFF" : "#00305B",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                mb: 1,
                fontSize: "14px",
                fontWeight: 700,
                lineHeight: "21px",
                "@media (max-width: 340px)": {
                  minWidth: "111.16px",
                },
              }}
              onClick={() => onFollow(item?.id)}
            >
              {item.isFollowed ? "UnFollow" : "Follow"}
            </Button>
          </Box>
        </Box>
      ))}
      {data?.length >= 5 && path === "/applicant/profile" && (
        <RalliButton label="Load More" onClick={handleLoadMore} />
      )}
    </Box>
  );
};

export default Following;
