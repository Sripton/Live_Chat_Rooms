import React, { useEffect, useMemo, useState } from "react";
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

// postTypes
import type { Post } from "../../redux/types/postTypes";

import { deletepost } from "../../redux/actions/postActions";

// компонент для открытия формы для создания/изменения комментриев
import CommentEditor from "../CommentEditor/CommentEditor";

// компонент отображения комментриев
import CommentsCard from "../CommentsCard/CommentsCard";

// redux postReaction
import {
  createPostReaction, // actions создания создания/изменения комментариев
  getPostReactions, // actions полчучения всех комментариев
} from "../../redux/actions/postReactionActions";

// redux comment
import { getComments } from "../../redux/actions/commentActions";

// redux hooks
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";

// selector postReactions counts
import { makeSelectReactionCountsByPostId } from "../../redux/selectors/postReactionsSelectors";

import { useNavigate } from "react-router-dom";

// Тип для PostCard пропсов
type PostCardProps = {
  handleOpenPostModal: (post: Post | null) => void;
  replyToPostId: string | null;
  // setReplyToPostId: (value: string | null) => void; (функция принимает string | null) (функция ничего не возвращает)
  setReplyToPostId: React.Dispatch<React.SetStateAction<string | null>>;
  isMobile: boolean;
  post: Post;
  index: number;
  COLORS: any;
  userId: string;
  toggleFocus: (postId: string) => void;
  setIsPostModalOpen: (value: boolean) => void; // ожидаем функцию для изменения состояния, а не само состояние.
};

const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  (
    {
      handleOpenPostModal,
      replyToPostId,
      setReplyToPostId,
      isMobile,
      post,
      index,
      COLORS,
      userId,
      toggleFocus,
      setIsPostModalOpen,
    },
    ref, // ref  - <Grow> (как и Slide, Collapse, Zoom) вешает ref на своего ребёнка, чтобы мерить размеры/делать reflow.
  ) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // состояние для отображения комментариeв
    const [showComments, setShowComments] = useState<string | null>(null);

    // состояние для свернуть/развернуть  текст поста
    const [expandedPost, setExpandedPost] = useState<Set<string>>(new Set());

    // состояние для свернуть/развернуть  текст комменатрия
    const [expandedComment, setExpandedComment] = useState<Set<string>>(
      new Set(),
    );

    // функция скрыть/показать полный текст поста/комменатрия
    const toggleExpanded = (type: "post" | "comment", id: string) => {
      const toggle = (prev: Set<string>) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      };

      if (type === "post") setExpandedPost(toggle);
      if (type === "comment") setExpandedComment(toggle);
    };

    // функция для  открытия формы создания комментария к посту
    const handleReplyToPost = (postId: string | null) => {
      // если пользоаватель не зарегистрирвоан
      if (!userId) {
        navigate("/signin");
        return;
      }
      //  меняем состояние  reply при нажатии на кнопку "ответить" под постом
      // обязательнго нужно использовтаь SetState
      setReplyToPostId((prev) => (prev === postId ? null : postId));

      // если была открыта форма для создания поста, закрываем ее
      setIsPostModalOpen(false);
    };

    // для состояния разворачивания/сворачивания текста поста
    const isExpandedPost = expandedPost.has(post.id);

    // данные из redux store
    const { byPostId, countsByPostId } = useAppSelector(
      (store) => store.comment,
    );

    // Комментарии
    const comments = byPostId[post.id] ?? [];

    // количество реакций под каждым постом
    // Проблема - каждый раз рендерится хотя данные те же  при открытии комнаты
    // const counts = useAppSelector(
    //   (state) => selectReactionCountsByPostId(state, post.id), // селектор вызывается много раз
    // );

    // количество реакций под каждым постом
    const selectCounts = useMemo(
      () =>
        // useMemo вызывает 1 раз при маунте PostCard
        makeSelectReactionCountsByPostId(), // функция, которая создаёт селектор
      [],
    );
    // решение перерендера через selector
    const counts = useAppSelector((state) => selectCounts(state, post.id)); //  один и тот же селектор,  для конкретного PostCard

    // для определения реакций пользователя
    const { myReactionByPostId } = useAppSelector(
      (store) => store.postReaction,
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

    // функция переключатель открыть/закрыть комментарии
    const toggleComments = (postId: string) => {
      // проверяем текущее состояние showComments
      setShowComments((prev) => {
        // null  !== postId -> next = postId
        const next = prev === postId ? null : postId;
        return next;
      });
    };

    // Рендер всех реакций каждого поста по id при закгрузке страницы
    useEffect(() => {
      dispatch(getPostReactions(post.id, userId)); // диспатчим реакции на посты
    }, [dispatch, post.id, userId]); // зависимости

    // Рендер всех коммнетриев каждого поста по id при закгрузке страницы
    useEffect(() => {
      dispatch(getComments(post.id)); // диспатчим все комментарии поста
    }, [dispatch, post.id]); // зависимости

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
            {post.postTitle && (
              <>
                {post.postTitle.length < 200 ? (
                  post.postTitle
                ) : (
                  <>
                    {expandedPost.has(post.id)
                      ? post.postTitle
                      : `${post.postTitle.substring(0, 200)}...`}

                    <Button
                      size="small"
                      onClick={() => toggleExpanded("post", post.id)}
                      sx={{
                        ml: 0.5,
                        minWidth: "auto",
                        p: 0,
                        color: COLORS.accentLight,
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        textTransform: "none",
                      }}
                    >
                      {isExpandedPost ? "Свернуть" : "Читать далее"}
                    </Button>
                  </>
                )}
              </>
            )}
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
              // если стоит моя реакция то подсвечиваем красным
              color:
                myReactionByPostId[post.id] === "LIKE"
                  ? COLORS.dangerColor
                  : COLORS.textMuted,
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
              // если стоит моя реакция то подсвечиваем красным
              color:
                myReactionByPostId[post.id] === "DISLIKE"
                  ? COLORS.dangerColor
                  : COLORS.textMuted,
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
            onClick={() => {
              toggleComments(post.id); // раскрытиые коммнетриев
              toggleFocus(post.id); // отображение только одного поста с коммнетриями
            }}
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
            {`${countsByPostId[post.id]}`}
          </Button>

          {/* Ответить */}
          <Button
            size="small"
            startIcon={<ReplyIcon />}
            onClick={() => {
              handleReplyToPost(post.id);
              setIsPostModalOpen(false);
            }}
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

        {/* Форма ответа для комментариев оставляемых к постам */}
        {replyToPostId === post.id && (
          <Box sx={{ mt: 2 }}>
            <CommentEditor
              postId={post.id}
              parentId={null}
              onCancel={() => setReplyToPostId(null)}
            />
          </Box>
        )}

        {/* Отображение комментариев */}
        {showComments && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: `1px solid ${COLORS.borderColor}`,
            }}
          >
            <CommentsCard
              comments={comments}
              expandedComment={expandedComment}
              toggleExpanded={toggleExpanded}
              post={post}
              userId={userId}
            />
          </Box>
        )}
      </Paper>
    );
  },
);

PostCard.displayName = "PostCard";

export default PostCard;
