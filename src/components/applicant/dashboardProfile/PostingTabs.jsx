"use client";
import React, { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
const PostingSection = lazy(() => import("./PostingSection"));
const ReelsPosting = lazy(() => import("./ReelsPosting"));
const MyPosting = lazy(() => import("./MyPosting"));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PostingTabs = ({
  data,
  onLike,
  onCommentClick,
  handleSendModal,
  isShareModalOpen,
  setIsShareModalOpen,
  getPosts,
  value,
  handleChange,
  getReels,
  getMyPostsReels,
  postNotInterested,
  anchorEl,
  setAnchorEl,
  handleMenuClose,
  reportPost,
  handleFollowUnfollow,
  isFollowing,
  handleDeletePost,
  handleEditPost,
  selectItem,
  setSelectItem,
  handleSend,
  handleClose,
  loading,
}) => {
  return (
    <Box
      sx={{
        maxWidth: "1260px",
        margin: "25px auto",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Posts" {...a11yProps(0)} sx={tabStyles} />
          <Tab label="Reels" {...a11yProps(1)} sx={tabStyles} />
          <Tab label="My Post" {...a11yProps(2)} sx={tabStyles} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Suspense fallback={<Loader />}>
          <PostingSection
            data={data}
            onLike={onLike}
            onCommentClick={onCommentClick}
            handleSendModal={handleSendModal}
            setIsShareModalOpen={setIsShareModalOpen}
            isShareModalOpen={isShareModalOpen}
            getPosts={getPosts}
            postNotInterested={postNotInterested}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleMenuClose={handleMenuClose}
            reportPost={reportPost}
            handleFollowUnfollow={handleFollowUnfollow}
            isFollowing={isFollowing}
            selectItem={selectItem}
            setSelectItem={setSelectItem}
            handleSend={handleSend}
            handleClose={handleClose}
            loading={loading}
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
          />
        </Suspense>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Suspense fallback={<Loader />}>
          <ReelsPosting
            data={data}
            onLike={onLike}
            onCommentClick={onCommentClick}
            handleSendModal={handleSendModal}
            setIsShareModalOpen={setIsShareModalOpen}
            isShareModalOpen={isShareModalOpen}
            getReels={getReels}
            postNotInterested={postNotInterested}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleMenuClose={handleMenuClose}
            reportPost={reportPost}
            handleFollowUnfollow={handleFollowUnfollow}
            isFollowing={isFollowing}
            selectItem={selectItem}
            setSelectItem={setSelectItem}
            handleSend={handleSend}
            handleClose={handleClose}
            loading={loading}
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
          />
        </Suspense>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <Suspense fallback={<Loader />}>
          <MyPosting
            data={getMyPostsReels}
            onLike={onLike}
            onCommentClick={onCommentClick}
            handleSendModal={handleSendModal}
            setIsShareModalOpen={setIsShareModalOpen}
            isShareModalOpen={isShareModalOpen}
            handleDeletePost={handleDeletePost}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleMenuClose={handleMenuClose}
            handleEditPost={handleEditPost}
            selectItem={selectItem}
            setSelectItem={setSelectItem}
            handleSend={handleSend}
            handleClose={handleClose}
            loading={loading}
          />
        </Suspense>
      </CustomTabPanel>
    </Box>
  );
};
const Loader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Image
      src={"/icons/bootsplash_logo.png"}
      width={70}
      height={70}
      alt="resume"
    />
    <CircularProgress />
  </Box>
);

const tabStyles = {
  maxWidth: { xs: "33%", sm: "33%" },
  width: "100%",
  fontSize: { xs: "9px", sm: "14px", md: "16px", lg: "26px" },
  lineHeight: "18px",
  fontWeight: 600,
  color: "#222222",
  "@media (max-width: 340px)": {
    minWidth: "77.5px",
  },
};

export default PostingTabs;
