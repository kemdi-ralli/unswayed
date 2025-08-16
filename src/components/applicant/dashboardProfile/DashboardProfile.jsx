"use client";
import { Box, Grid } from "@mui/material";
import React from "react";
import { POSTING_ITEM } from "@/constant/applicant/feed";
import AboutSection from "./AboutSection";
import PostingTabs from "./PostingTabs";

const DashboardProfile = ({
  data,
  value,
  setValue,
  handleChange,
  getPosts,
  getReels,
  getMyPostsReels,
  authUser,
  postNotInterested,
  anchorEl,
  setAnchorEl,
  handleMenuClose,
  reportPost,
  handleFollowUnfollow,
  isFollowing,
  handleDeletePost,
  handleEditPost,
  handleLike,
  handleSendModal,
  setIsShareModalOpen,
  isShareModalOpen,
  selectItem,
  setSelectItem,
  handleSend,
  handleClose,
  handleCommentClick,
  loading
}) => {


  return (
    <Box sx={{ px: "25px", maxWidth: "1260px", margin: "25px auto" }}>
      <Grid container spacing={2}>
        <Grid
          item
          md={4}
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <AboutSection data={data} authUser={authUser} />
        </Grid>
        <Grid item xs={12} md={8}>
          <PostingTabs
            data={POSTING_ITEM}
            onLike={handleLike}
            onCommentClick={handleCommentClick}
            handleSendModal={handleSendModal}
            setIsShareModalOpen={setIsShareModalOpen}
            isShareModalOpen={isShareModalOpen}
            setValue={setValue}
            value={value}
            handleChange={handleChange}
            getPosts={getPosts}
            getReels={getReels}
            getMyPostsReels={getMyPostsReels}
            postNotInterested={postNotInterested}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleMenuClose={handleMenuClose}
            reportPost={reportPost}
            handleFollowUnfollow={handleFollowUnfollow}
            isFollowing={isFollowing}
            handleDeletePost={handleDeletePost}
            handleEditPost={handleEditPost}
            selectItem={selectItem}
            setSelectItem={setSelectItem}
            handleSend={handleSend}
            handleClose={handleClose}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardProfile;
