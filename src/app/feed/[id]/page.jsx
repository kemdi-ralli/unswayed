"use client";
import React, { use, useEffect, useState } from "react";
import { Box } from "@mui/material";
import apiInstance from "@/services/apiService/apiServiceInstance";
import CommentsPage from "@/components/applicant/dashboardProfile/CommentsPage";
import { echo } from "@/helper/webSockets";
import { Toast } from "@/components/Toast/Toast";
import CreatePostModal from "@/components/applicant/dashboardProfile/CreatePostModal";
import {
  FOLLOW_USER,
  NOT_INTERESTED,
  REPORT_POST,
} from "@/services/apiService/apiEndPoints";
import { useSelector } from "react-redux";
import { decode } from "@/helper/GeneralHelpers";

const CommentScreen = ({ params }) => {
  const encodedId = params.id;
  const id = decode(encodedId);
  const [data, setData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorCommentEl, setAnchorCommentEl] = useState(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setAnchorCommentEl(null);
  };
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postId, setPostId] = useState();
  const [selectItem, setSelectItem] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  //edit
  const isPostType = ["post", "reel"];
  const [dropdownStates, setDropdownStates] = useState({
    postType: "",
  });
  const [mediaType, setMediaType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [EditComment, setEditComment] = useState(null);
  const [likedPostIds, setLikedPostIds] = useState(null);
  const [isLiked, setIsLiked] = useState();
  const authUser = useSelector((state) => state?.auth?.userData?.user);
  // reply work
  const [replyState, setReplyState] = useState({});
  const handleReplyChange = (commentId, value) => {
    setReplyState((prevState) => ({
      ...prevState,
      [commentId]: {
        ...prevState[commentId],
        replyText: value,
      },
    }));
  };
  const handleReply = async (item) => {
    setReplyState((prevState) => ({
      ...prevState,
      [item.id]: !prevState[item.id],
    }));
  };

  const handleReplySubmit = async (item) => {
    const formData = new FormData();
    formData.append("post_id", item.post_id);
    formData.append("parent_id", item.id);
    formData.append("comment", replyState[item.id]?.replyText || "");

    try {
      const response = await apiInstance.post(`/comments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.status === 200 || response?.status === 201) {
        Toast("success", response?.data?.message);
        setReplyState((prevState) => ({
          ...prevState,
          [item.id]: {
            ...prevState[item.id],
            replyText: "",
          },
        }));
      }
    } catch (err) {
      console.error(err.message);
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
  // reposrt
  const [isReport, setIsReport] = useState(false);
  const handeSubmitReport = async () => {
    setOpenModal(false);
    const formData = new FormData();
    formData.append("report_type", selectedOption);
    formData.append("description", description);
    try {
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
      if (error.response) {
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
  const reportPost = (id) => {
    handleMenuClose();
    setOpenModal(true);
    setIsReport(true);
  };

  const postNotInterested = async (id) => {
    handleMenuClose();
    const response = await apiInstance.post(`${NOT_INTERESTED}/${id}`);
    if (response?.status === 200 || response?.status === 201) {
      Toast("success", response?.data?.message);
    }
  };

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

  const handleClose = () => {
    setOpenModal(false);
    setIsCreatePost(false), setIsEdit(false);
    setIsShareModalOpen(false);
    setSelectItem([]);
  };

  const getPostDetails = async (id) => {
    try {
      const response = await apiInstance.get(`/posts/${id}`);
      if (response?.status === 200 || response?.status === 201) {
        setData(response?.data?.data?.post);
        getPostComments(response?.data?.data?.post.id);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getPostComments = async (id) => {
    try {
      const response = await apiInstance.get(
        `/posts/${id}/comments?limit=10&page=1`
      );
      if (response?.status === 200 || response?.status === 201) {
        setComments(response?.data?.data?.comments);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleSubmit = async (id) => {
    if (!commentText?.trim()) return;

    if (isEdit) {
      console.log(isEdit);
      const finalComment = {
        comment: commentText,
      };
      try {
        const response = await apiInstance.patch(
          `comments/${EditComment?.id}`,
          finalComment
        );
        console.log(response, "res");
        if (response?.status === 200 || response?.status === 201) {
          Toast("success", response?.data?.message);
          setIsEdit(false);
          setCommentText("");
        }
      } catch (err) {
        if (err.response) {
          Toast("error", err.response.data?.message || "Failed to unfollow.");
        } else {
          Toast("error", "An unexpected error occurred.");
        }
      }
    } else {
      const formData = new FormData();
      formData.append("post_id", id);
      formData.append("comment", commentText);
      try {
        const response = await apiInstance.post(`/comments`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response, "resposnsss");
        if (response?.status === 200 || response?.status === 201) {
          Toast("success", response?.data?.message);
          setCommentText("");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  // Delete my post work
  const handleDeletePost = async (id) => {
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
  const getReplies = async (id) => {
    try {
      const CommentReplies = await apiInstance.get(
        `/comments/${id}/replies?limit=1000&page=1`
      );
      if (CommentReplies.data.data.replies.length > 0) {
        setComments((prevComments) => {
          const addRepliesToComment = (comments) => {
            return comments.map((comment) => {
              if (comment.id === id) {
                const updatedReplies = comment.replies
                  ? updateReplies(
                    comment.replies,
                    CommentReplies.data.data.replies
                  )
                  : CommentReplies;

                return {
                  ...comment,
                  replies: updatedReplies,
                };
              }

              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addRepliesToComment(comment.replies),
                };
              }
              return comment;
            });
          };

          const updateReplies = (existingReplies, newReplies) => {
            const existingRepliesMap = new Map(
              existingReplies.map((reply) => [reply.id, reply])
            );
            const mergedReplies = [
              ...existingReplies.filter(
                (reply) => !existingRepliesMap.has(reply.id)
              ),
              ...newReplies.filter(
                (newReply) => !existingRepliesMap.has(newReply.id)
              ),
            ];

            return mergedReplies;
          };
          const updatedComments = addRepliesToComment(prevComments);

          return updatedComments;
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // edit my post work
  const handleEditPost = async (id) => {
    handleMenuClose();
    setIsEdit(true);
    setIsCreatePost(false);
    setOpenModal(true);
    if (media) {
      setMedia(data?.media);
    } else {
      setMedia();
    }

    setMediaPreview(data?.media);
    setMediaType(data?.media_type || "");
    setInputValue(data?.content);
  };
  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const isReels = dropdownStates.postType === "reel";
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
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

    if (
      dropdownStates.postType === "reel" &&
      media &&
      !media.type.startsWith("video/")
    ) {
      Toast("warning", "For Reels, only videos are allowed.");
      return;
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
          postType: "",
        }));
        setOpenModal(false);
      } catch (error) {
        console.error("Error creating post:", error.message);
        Toast("error", "Failed to create post. Please try again.");
      }
    } else {
      try {
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
          postType: "",
        }));
        setOpenModal(false);
      } catch (error) {
        console.error("Error creating post:", error.message);
        Toast("error", "Failed to create post. Please try again.");
      }
    }
  };
  const addReplyToComment = (_comments, newComment) => {
    const traverseAndAddReply = (__comments) => {
      return __comments.map((_comment) => {
        if (_comment.id === newComment.parent_id) {
          var abc = {
            ..._comment,
            total_replies: _comment.total_replies + 1,
            replies: [newComment, ...(_comment?.replies || [])],
          };
          return abc;
        } else if (_comment.replies) {
          return {
            ..._comment,
            replies: traverseAndAddReply(_comment.replies),
          };
        }
        return _comment;
      });
    };

    return traverseAndAddReply(_comments);
  };

  const updateCommentEvent = (_comments, updatedComment) => {
    const traverseAndUpdate = (__comments) => {
      return __comments.map((_comment) => {
        if (_comment.id === updatedComment.id) {
          return updatedComment;
        } else if (_comment.replies) {
          return {
            ..._comment,
            replies: traverseAndUpdate(_comment.replies),
          };
        }
        return _comment;
      });
    };

    return traverseAndUpdate(_comments);
  };

  const deleteCommentEvent = (_comments, commentIdToDelete) => {
    const traverseAndDelete = (__comments) => {
      return __comments.filter((_comment) => {
        if (_comment.id === commentIdToDelete) {
          if (_comment.parent_id) {
            const parentComment = findCommentById(
              _comments,
              _comment.parent_id
            );
            if (parentComment) {
              parentComment.total_replies = Math.max(
                0,
                (parentComment.total_replies || 0) - 1
              );
            }
          }
          return false;
        } else if (_comment.replies) {
          _comment.replies = traverseAndDelete(_comment.replies);
        }
        return true;
      });
    };

    const findCommentById = (comments, commentId) => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          return comment;
        } else if (comment.replies) {
          const result = findCommentById(comment.replies, commentId);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };

    return traverseAndDelete(_comments);
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
        setLikedPostIds(postId);
        setIsLiked(response?.data?.message);
      } else {
        console.error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      Toast("error", error?.response?.data || error.message || "Unknown error");
    }
  };

  const handleEditComments = async (item) => {
    setEditComment(item);
    handleMenuClose();
    setCommentText(item?.comment);
    setIsEdit(true);
  };

  const handleEditCancel = () => {
    console.log("console.edit click");
    setCommentText("");
    setIsEdit(false);
    setEditComment(null);
  }

  const handleDeleteComments = async (id) => {
    handleMenuClose();
    try {
      const response = await apiInstance.delete(`comments/${id}`);
      if (response?.status === 200 || response?.status === 201) {
        Toast("success", response?.data?.message);
      }
    } catch (err) {
      if (err.response) {
        Toast("error", err.response.data?.message || "Failed to unfollow.");
      } else {
        Toast("error", "An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    const channel = echo.channel(`ralli.comment.${data?.id}`);
    channel.listen("CommentReceived", (event) => {
      const { comment, type } = event;
      if (type === "new") {
        if (comment.parent_id) {
          setComments((prevComment) => {
            const commentReply = addReplyToComment(prevComment, comment);
            return commentReply;
          });
        } else {
          setComments((prevMessages) => [...prevMessages, comment]);
        }
        setData((prevData) => ({
          ...prevData,
          total_comments: (prevData?.total_comments || 0) + 1,
        }));
      } else if (type === "update") {
        setComments((prevComment) => updateCommentEvent(prevComment, comment));
      }  else if (type === "delete") {
        setComments((prevComment) =>
          deleteCommentEvent(prevComment, comment.id)
        );
  
        setData((prevData) => ({
          ...prevData,
          total_comments: Math.max((prevData?.total_comments || 1) - 1, 0),
        }));
      }
    })

    return () => {
      echo.leaveChannel(`ralli.comment.${data.id}`);
    };
  }, [data]);

  useEffect(() => {
    const encodedId = params.id;
    const id = decode(encodedId);
    getPostDetails(id);
  }, [params.id]);
  
  useEffect(() => {
    if (isLiked) { 
      getPostDetails(likedPostIds);
    }
  }, [likedPostIds, isLiked]);
  const getType = useSelector((state) => state?.auth?.userData?.user?.type);

  return (
    <Box>
      <CommentsPage
        data={data}
        comments={comments}
        commentText={commentText}
        onCommentChange={handleChange}
        onCommentSubmit={handleSubmit}
        onLike={handleLike}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        handleMenuClose={handleMenuClose}
        handleDeletePost={handleDeletePost}
        handleEditPost={handleEditPost}
        reportPost={reportPost}
        postNotInterested={postNotInterested}
        handleFollowUnfollow={handleFollowUnfollow}
        isFollowing={isFollowing}
        getReplies={getReplies}
        authUser={authUser}
        setAnchorCommentEl={setAnchorCommentEl}
        anchorCommentEl={anchorCommentEl}
        handleDeleteComments={handleDeleteComments}
        handleEditComments={handleEditComments}
        isEdit={isEdit}
        handleReply={handleReply}
        setReplyState={setReplyState}
        replyState={replyState}
        handleReplyChange={handleReplyChange}
        handleReplySubmit={handleReplySubmit}
        handleSendModal={handleSendModal}
        selectItem={selectItem}
        setSelectItem={setSelectItem}
        setIsShareModalOpen={setIsShareModalOpen}
        isShareModalOpen={isShareModalOpen}
        handleSend={handleSend}
        handleClose={handleClose}
        handleEditCancel={handleEditCancel}
      />
      <CreatePostModal
        open={openModal}
        onClose={handleClose}
        isPostType={isPostType}
        dropdownStates={dropdownStates}
        setDropdownStates={setDropdownStates}
        inputValue={inputValue}
        setInputValue={setInputValue}
        mediaPreview={mediaPreview}
        mediaType={mediaType}
        handleMediaChange={handleMediaChange}
        handlePost={handlePost}
        media={media}
        description={description}
        setDescription={setDescription}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        isEdit={isEdit}
        isReportModal={isReport}
        handeSubmitReport={handeSubmitReport}
      />
    </Box>
  );
};

export default CommentScreen;
