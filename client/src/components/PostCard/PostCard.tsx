import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

// Иконки
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { Post } from "../../redux/types/postTypes";

import { deletepost } from "../../redux/actions/postActions";

import {
  createPostReaction,
  getPostReactions,
} from "../../redux/actions/postReactionActions";

import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";

import { selectReactionCountsByPostId } from "../../redux/selectors/postReactionsSelectors";

type PostCardProps = {
  handleOpenPostModal: (post: any) => void;
  isMobile: boolean;
  post: Post;
  index: number;
  COLORS: any;
  userId: string | null;
};

const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  (
    { handleOpenPostModal, isMobile, post, index, COLORS, userId },
    ref, // ref  - <Grow> (как и Slide, Collapse, Zoom) вешает ref на своего ребёнка, чтобы мерить размеры/делать reflow.
  ) => {
    const dispatch = useAppDispatch();
    const counts = useAppSelector((state) =>
      selectReactionCountsByPostId(state, post.id),
    );
    // Анимация появления элементов
    const styleAnimation = (index: number) => ({
      animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
      "@keyframes fadeInUp": {
        "0%": {
          opacity: 0,
          transform: "translateY(10px)",
        },
        "100%": {
          opacity: 1,
          transform: "translateY(0)",
        },
      },
    });

    useEffect(() => {
      dispatch(getPostReactions(post.id));
    }, [dispatch, post.id]);

    console.log("post", post);
    return (
      <Paper
        ref={ref}
        elevation={0}
        sx={{
          p: isMobile ? 2 : 2.5,
          borderRadius: "16px",
          background: "rgba(35, 20, 51, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(183, 148, 244, 0.1)",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "3px",
            background: "linear-gradient(180deg, #b794f4, transparent)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover": {
            transform: "translateX(4px)",
            background: "rgba(183,148,244,0.08)",
            borderColor: "rgba(183,148,244,0.3)",
            boxShadow: "0 4px 20px rgba(183,148,244,0.15)",
            "&::before": {
              opacity: 1,
            },
          },
          ...styleAnimation(index),
        }}
      >
        {/* Заголовок и автор */}
        <Box sx={{ mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: "rgba(183,148,244,0.1)",
                border: "1px solid rgba(183,148,244,0.2)",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: isMobile ? "0.875rem" : "0.95rem",
                  color: "#e5e7eb",
                  lineHeight: 1.2,
                }}
              >
                {post?.user?.username || "Аноним"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.textMuted,
                  fontSize: "0.75rem",
                  fontFamily: "'Inter', sans-serif",
                  mt: 0.25,
                }}
              >
                {new Date(Date.parse(post.createdAt)).toLocaleDateString(
                  "ru-RU",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )}
              </Typography>
            </Box>
          </Box>

          {/* Текст поста */}
          <Typography
            sx={{
              color: "#e5e7eb",
              lineHeight: 1.6,
              fontSize: isMobile ? "0.9rem" : "0.95rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {post.postTitle}
          </Typography>
        </Box>

        {/* Панель действий */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            pt: 1.5,
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* like */}
          <Button
            size="small"
            startIcon={<ThumbUpIcon />}
            onClick={() => dispatch(createPostReaction(post.id, "LIKE"))}
            sx={{
              color: COLORS.textMuted,
              minWidth: "auto",
              px: 1.5,
              py: 0.5,
              fontSize: "0.8rem",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              background: "rgba(255,255,255,0.02)",
              "&:hover": {
                background: "rgba(183,148,244,0.1)",
                color: COLORS.accentColor,
              },
              "& .MuiButton-startIcon": { mr: 0.5 },
            }}
          >
            {`${counts.like}`}
          </Button>
          {/* dislike */}
          <Button
            size="small"
            startIcon={<ThumbDownIcon />}
            onClick={() => dispatch(createPostReaction(post.id, "DISLIKE"))}
            sx={{
              color: COLORS.textMuted,
              minWidth: "auto",
              px: 1.5,
              py: 0.5,
              fontSize: "0.8rem",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              background: "rgba(255,255,255,0.02)",
              "&:hover": {
                background: "rgba(239,68,68,0.1)",
                color: COLORS.dangerColor,
              },
              "& .MuiButton-startIcon": { mr: 0.5 },
            }}
          >
            {`${counts.dislike}`}
          </Button>

          {/* Комментарии */}
          <Button
            size="small"
            startIcon={<CommentIcon />}
            sx={{
              color: COLORS.textMuted,
              minWidth: "auto",
              px: 1.5,
              py: 0.5,
              fontSize: "0.8rem",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              background: "rgba(255,255,255,0.02)",
              "&:hover": {
                background: "rgba(183,148,244,0.1)",
                color: COLORS.accentColor,
              },
              "& .MuiButton-startIcon": { mr: 0.5 },
            }}
          >
            0
          </Button>

          {/* Ответить */}
          <Button
            size="small"
            startIcon={<ReplyIcon />}
            sx={{
              color: COLORS.accentColor,
              minWidth: "auto",
              px: 1.5,
              py: 0.5,
              fontSize: "0.8rem",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              background: "rgba(183,148,244,0.1)",
              "&:hover": {
                background: "rgba(183,148,244,0.2)",
                transform: "translateY(-1px)",
              },
              "& .MuiButton-startIcon": { mr: 0.5 },
            }}
          >
            Ответить
          </Button>

          {/* Действия автора */}
          {userId === post?.user?.id && (
            <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
              {/* изменние поста */}
              <IconButton
                size="small"
                onClick={() => handleOpenPostModal(post)} // передаем сам пост
                sx={{
                  color: COLORS.accentColor,
                  background: "rgba(183,148,244,0.1)",
                  "&:hover": {
                    background: "rgba(183,148,244,0.2)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>

              {/* удаление поста */}
              <IconButton
                size="small"
                onClick={() => dispatch(deletepost(post.id))}
                sx={{
                  color: COLORS.dangerColor,
                  background: "rgba(239,68,68,0.1)",
                  "&:hover": {
                    background: "rgba(239,68,68,0.2)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Paper>
    );
  },
);

PostCard.displayName = "PostCard";

export default PostCard;
