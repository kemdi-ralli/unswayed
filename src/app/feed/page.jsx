"use client";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { useSelector } from "react-redux";

import { USER_PROFILE } from "@/constant/applicant/feed/index";

import apiInstance from "@/services/apiService/apiServiceInstance";
import { Box, Button, CircularProgress } from "@mui/material";
import { Toast } from "@/components/Toast/Toast";
import {
  EMPLOYER_GET_PROFILE,
  FOLLOW_USER,
  GET_PROFILE,
  NOT_INTERESTED,
  REPORT_POST,
} from "@/services/apiService/apiEndPoints";
import { useRouter } from "next/navigation";
import { reportValidationSchema } from "@/schemas/reportValidationSchema"
import { encode } from "@/helper/GeneralHelpers";

const DashboardProfile = lazy(() =>
  import("@/components/applicant/dashboardProfile/DashboardProfile")
);
const CreatePostModal = lazy(() =>
  import("@/components/applicant/dashboardProfile/CreatePostModal")
);
const Container = lazy(() => import("@/components/common/Container"));

const Page = () => {
  const [getPosts, setGetPosts] = useState([]);
  const [getReels, setGetReels] = useState([]);
  const [getMyPostsReels, setGetMyPostsReels] = useState([]);
  const [value, setValue] = useState(0);
  const [getTab, setGetTab] = useState("post");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  //create post work
  const isPostType = ["post", "reel"];
  const [dropdownStates, setDropdownStates] = useState({
    postType: "post",
  });
  const [mediaType, setMediaType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const fileInputRef = React.useRef(null);

  //report work
  const [isReport, setIsReport] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [id, setId] = useState();
  const [reportError, setReportError] = useState("");
  // Unfollow work
  const [isFollowing, setIsFollowing] = useState(false);

  // delete my post work
  const [isDelete, setIsDelete] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectItem, setSelectItem] = useState([]);
  const [postId, setPostId] = useState();
  const router = useRouter();

  // Unfollow work
  const handleFollowUnfollow = async (userId) => {
    handleMenuClose();
    const formData = new FormData();
    formData.append("following_user_id", userId);
    try {
      const response = await apiInstance.post(FOLLOW_USER, formData);
      if (response.status === 200 || 201) {
        Toast("success", response?.data?.message);
        setIsFollowing((prevState) => !prevState);
      }
    } catch (err) {
      if (err.response) {
        Toast("error", err.response.data?.message || "Failed to unfollow.");
      }
    }
  };

  //like post work
  const handleLike = async (postId) => {
    const formData = new FormData();
    formData.append("post_id", postId);
    try {
      const response = await apiInstance?.post("/post/like", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.status === 200 || response?.status === 201) {
        Toast("success", response?.data?.message || "Post liked successfully");
        setLikedPostIds(response?.data?.message);
      } else {
        console.error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      Toast("error", error?.response?.data || error.message || "Unknown error");
    }
  };

  // share post work
  const handleModalRalliOpen = () => {
    setIsShareModalOpen(true);
  };

  const handleSendModal = async (postId) => {
    setPostId(postId);
    handleModalRalliOpen();
  };

  const userArray = {
    receivers: selectItem,
  };

  const handleSend = async () => {
    setIsShareModalOpen(false);
    setSelectItem([]);
    try {
      const response = await apiInstance.post(
        `/post/share/${postId}`,
        userArray
      );
      if (response?.status === 200 || response?.status === 201) {
        Toast("success", response?.data?.message || "Post shared successfully");
      }
    } catch (error) {
      Toast("error", error.message || "Unknown error");
    }
  };

  //report work
  const reportPost = (id) => {
    setId(id);
    handleMenuClose();
    setOpenModal(true);
    setIsReport(true);
  };
  const handeSubmitReport = async () => {
    try {
      await reportValidationSchema.validate(
        { report_type: selectedOption },
        { abortEarly: false }
      );
      setReportError("");

      setOpenModal(false);
      const formData = new FormData();
      formData.append("report_type", selectedOption);
      formData.append("description", description);

      const response = await apiInstance.post(
        `${REPORT_POST}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.status === 200 || response?.status === 201) {
        Toast(
          "success",
          response?.data?.message || "Report submitted successfully!!!"
        );
        setSelectedOption("");
        setDescription("");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        setReportError(error.message);
        Toast("error", error.message);
      } else if (error.response) {
        Toast(
          "error",
          error.response.data?.message ||
          "Failed to submit report due to server error."
        );
        setSelectedOption("");
        setDescription("");
      }
    }
  };


  // Delete my post work
  const handleDeletePost = async (id) => {
    setIsDelete(true);
    handleMenuClose();
    try {
      const response = await apiInstance.delete(`posts/${id}`);
      if (response.status === 200 || response.status === 201) {
        Toast("success", response?.data?.message || "Action successful!");
      }
    } catch (err) {
      if (err.response) {
        Toast("error", err.response.data?.message || "Failed to unfollow.");
      } else {
        Toast("error", "An unexpected error occurred.");
      }
    }
  };

  // edit my post work
  // const imageUrlToBlob = async (url) => {
  //   return fetch(url)
  //     .then(response => response.blob())  // Fetch the image and convert it to a Blob
  //     .then(blob => {
  //       // Now you have the image as a Blob object
  //       console.log(blob);
  //       return blob;
  //     })
  //     .catch(error => {
  //       console.error("Error fetching the image: ", error);
  //     });
  // }
  const handleEditPost = async (id) => {
    handleMenuClose();
    const selectedPost = getMyPostsReels?.find((item) => item.id === id);
    setIsEdit(true);
    setIsCreatePost(false);
    setOpenModal(true);
    if (selectedPost?.media) {
      // const blob = await imageUrlToBlob(selectedPost?.media).then(blob => {
      //   // You can use the blob here, for example, create an Object URL
      //   const objectURL = URL.createObjectURL(blob);
      //   console.log(objectURL);
      //   return blob;
      // });
      // setMedia(blob);
      setMedia(selectedPost?.media);
    } else {
      setMedia();
    }

    setMediaPreview(selectedPost?.media);
    setMediaType(selectedPost?.media_type || "");
    setInputValue(selectedPost?.content);
    setId(id);
    setDropdownStates((prev) => ({
      ...prev,
      postType: selectedPost?.type || "post",
    }));
  };
  useEffect(() => {
    if (!isEdit) {
      setMediaPreview();
      setMedia(null);
      setMediaType("");
      setInputValue("");
    }
  }, [dropdownStates.postType])
  //Not Ineresting post and reels api work
  const [notInterest, setNotInterest] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuClose = () => setAnchorEl(null);

  const postNotInterested = async (id) => {
    handleMenuClose();
    const response = await apiInstance.post(`${NOT_INTERESTED}/${id}`);
    if (response?.status === 200 || response?.status === 201) {
      Toast("success", response?.data?.message);
      setNotInterest(true);
    }
  };

  // create post & reels work
  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    
    const isVideo = file?.type.startsWith("video/");
    if (dropdownStates.postType === "post" && isVideo) {
      Toast('error', 'Invalid file type. for post take only images')
      return;
    }
    if (file) {
      const isReels = dropdownStates.postType === "reel";
      const isVideo = file?.type.startsWith("video/");
      const isImage = file?.type.startsWith("image/");
      if (dropdownStates.postType === "reel") {
        setMediaType("video");
      } else {
        setMediaType("image");
      }
      if (isReels && isVideo) {
        setMedia(file);
        setMediaPreview(URL.createObjectURL(file));
      } else if (!isReels && (isImage || isVideo)) {
        setMedia(file);
        setMediaPreview(URL.createObjectURL(file));
      } else {
        Toast("error", "Invalid file type. Please upload a video for Reels.");
      }
    }
  };
  const handlePost = async () => {
    if (!dropdownStates.postType) {
      Toast("warning", "Please select a post type.");
      return;
    }

    if (dropdownStates.postType === "reel" && inputValue && !media) {
      Toast("warning", "For Reels, a video is required.");
      return;
    }
    if (!isEdit) {
      if (
        dropdownStates.postType === "reel" &&
        media &&
        !media?.type?.startsWith("video/")
      ) {
        Toast("warning", "For Reels, only videos are allowed.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("type", dropdownStates.postType);
    formData.append("content", inputValue);
    if (media) {
      formData.append("media", media);
    }
    formData.append("media_type", mediaType);

    if (isCreatePost) {
      try {
        setLoading(true);
        const response = await apiInstance.post("posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Toast("success", response?.data?.message);
        setInputValue("");
        setMedia(null);
        setMediaPreview(null);
        setMediaType("");
        setDropdownStates((prev) => ({
          ...prev,
          postType: "post",
        }));
        setOpenModal(false);
        setLoading(false);
      } catch (error) {
        console.error("Error creating post:", error.message);
        Toast("error", "Failed to create post. Please try again.");
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await apiInstance.post(`posts/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Toast("success", response?.data?.message);
        setInputValue("");
        setMedia(null);
        setMediaPreview(null);
        setMediaType("");
        setDropdownStates((prev) => ({
          ...prev,
          postType: "post",
        }));

        setOpenModal(false);
        getMyPostAndReels();
        setLoading(false);
      } catch (error) {
        console.error("Error creating post:", error.message);
        Toast("error", "Failed to create post. Please try again.");
        setLoading(false);
      }
    }
  };

  // get post & reels work
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      setGetTab("post");
    } else if (newValue === 1) {
      setGetTab("reel");
    }
  };

  const getPostAndReels = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get(
        `/feeds?type=${getTab}&limit=10&page=1`
      );
      const finalData = response?.data?.data?.feed;
      if (getTab === "post") {
        setGetPosts(finalData);
      } else if (getTab === "reel") {
        setGetReels(finalData);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMyPostAndReels = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get(`/posts?limit=10&page=1`);
      const finalData = response?.data?.data;
      setGetMyPostsReels(finalData?.posts);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCommentClick = (id) => {
    var encodeId = encode(id);
    router.push(`/feed/${encodeId}`);
  };

  const handleOpen = () => {
    setOpenModal(true);
    if (isEdit) {
      setIsCreatePost(false);
    } else {
      setIsCreatePost(true);
    }
  };
  const handleClose = () => {
    setOpenModal(false);
    setIsCreatePost(false),
      setIsEdit(false);
    setIsShareModalOpen(false);
    setDropdownStates((prev) => ({
      ...prev,
      postType: "post",
    }));
    setInputValue("")
    setMedia(null);
    setMediaPreview(null);
  };

  useEffect(() => {
    if (value === 0 || value === 1 || likedPostIds) {
      getPostAndReels();
    }
    if (value === 2 || isDelete || isEdit) {
      getMyPostAndReels();
      setIsDelete(false);
    }
  }, [getTab, value, isDelete, isEdit, likedPostIds]);

  useEffect(() => {
    if (notInterest) {
      getMyPostAndReels();
      getPostAndReels();
      setNotInterest(false);
    }
  }, [notInterest]);

  const getType = useSelector((state) => state?.auth?.userData?.user?.type);
  const authUser = useSelector((state) => state?.auth?.userData?.user);
  const fetchProfile = async () => {
    try {
      const url = getType === 'applicant' ? GET_PROFILE : EMPLOYER_GET_PROFILE
      const response = await apiInstance.get(url);
      if (response.status === 200 || response.status === 201) {
        setProfile(response.data.data.user);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      }
    >
      <Box
        sx={{
          px: "25px",
          maxWidth: "1260px",
          margin: "25px auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            mt: 2,
          }}
        >
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Create Post
          </Button>
        </Box>
      </Box>
      <Suspense
        fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <CircularProgress />
          </Box>
        }
      >
        <DashboardProfile
          data={USER_PROFILE}
          setValue={setValue}
          value={value}
          handleChange={handleChange}
          getPosts={getPosts}
          getReels={getReels}
          getMyPostsReels={getMyPostsReels}
          handleOpen={handleOpen}
          openModal={openModal}
          setOpenModal={setOpenModal}
          authUser={profile}
          postNotInterested={postNotInterested}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          handleMenuClose={handleMenuClose}
          reportPost={reportPost}
          handleFollowUnfollow={handleFollowUnfollow}
          isFollowing={isFollowing}
          handleDeletePost={handleDeletePost}
          handleEditPost={handleEditPost}
          handleLike={handleLike}
          handleSendModal={handleSendModal}
          setIsShareModalOpen={setIsShareModalOpen}
          isShareModalOpen={isShareModalOpen}
          selectItem={selectItem}
          setSelectItem={setSelectItem}
          handleSend={handleSend}
          handleClose={handleClose}
          handleCommentClick={handleCommentClick}
          loading={loading}
        />
      </Suspense>
      {openModal && (
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100vh"
            >
              <CircularProgress />
            </Box>
          }
        >
          <CreatePostModal
            open={openModal}
            onClose={handleClose}
            user={authUser}
            isPostType={isPostType}
            isReportModal={isReport}
            reportError={reportError}
            dropdownStates={dropdownStates}
            setDropdownStates={setDropdownStates}
            inputValue={inputValue}
            setInputValue={setInputValue}
            mediaPreview={mediaPreview}
            mediaType={mediaType}
            handleMediaChange={handleMediaChange}
            handlePost={handlePost}
            media={media}
            setMedia={setMedia}
            fileInputRef={fileInputRef}
            setMediaPreview={setMediaPreview}
            description={description}
            setDescription={setDescription}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            handeSubmitReport={handeSubmitReport}
            isDelete={isDelete}
            isEdit={isEdit}
            isCreatePost={isCreatePost}
            loading={loading}
          />
        </Suspense>
      )}
    </Suspense>
  );
};

export default Page;
