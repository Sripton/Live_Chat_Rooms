import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Avatar,
  Stack,
  Grow,
  Zoom,
  Slide,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { motion, AnimatePresence } from "framer-motion";

// Иконки
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";

// Анимация
// containerVariants - для контейнера, который содержит список постов. Он задает анимацию появления всего контейнера и его детей (детей - это отдельные посты).
const containerVariants = {
  hidden: { opacity: 0 }, // начальное состояние (невидимо, opacity: 0)
  visible: {
    // конечное состояние (видимо, opacity: 1)
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.1 },
  },
};

// Colors - в стиле ChatRooms
const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
  gradient: "linear-gradient(135deg, #2a183d 0%, #1d102f 100%)",
  dangerColor: "#ef4444",
  accentLight: "#a78bfa",
};

// react hooks
import { useNavigate, useParams } from "react-router-dom";

// redux hoooks
import { useAppSelector, useAppDispatch } from "../../redux/store/hooks";

// redux thunk
// функция передачи одной комнаты по id
import { getRoomById } from "../../redux/actions/roomActions";

// функция передачи всех постов по id комнаты
import { fetchPosts } from "../../redux/actions/postActions";

// redux types
import { CLEAR_ROOM_POSTS } from "../../redux/types/postTypes";
import type { Post } from "../../redux/types/postTypes";

import PostEditor from "../PostEditor";
import PostCard from "../PostCard";

export default function ChatCards() {
  const { id } = useParams(); // id комнаты из useParams
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  //состояние для открытия формы для создания поста
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  // состояние для создания/изменения поста
  const [postEditor, setPostEditor] = useState<Post | null>(null);

  // состояние для открытия формы ответа на посты/комментарии
  const [replyToPostId, setReplyToPostId] = useState<string | null>(null);

  // ------------------ Store ------------------
  // Забираем из store  комнату текущую комнату
  const { currentRoom } = useAppSelector((store) => store.room);

  // Забираем из store данные user
  const { userId } = useAppSelector((store) => store.user);

  // ------------------- Posts ----------------------
  // режим фокуса на одном посте. когда жмёшь «Комментарии» у поста,
  // на странице остаётся только этот пост + его комментарии, а остальные посты скрываются.
  // Повторное нажатие — возвращает список всех постов.
  const [focusedPostId, setFocusedPostId] = useState<string | null>(null);

  // Забираем все поты из store
  const { posts } = useAppSelector((store) => store.post);

  // загружаем комнату при рендере
  useEffect(() => {
    if (!id) return;
    dispatch({ type: CLEAR_ROOM_POSTS }); // очищаем посты при смене комнаты
    dispatch(getRoomById(id)); // загрудаем комнату по id
    dispatch(fetchPosts(String(id))); // загружаем все посты данной клмнаты
  }, [id, dispatch]);

  // функция для открытия формы создания поста
  const handleOpenPostModal = (post?: Post | null) => {
    // если пользоаватель не зарегистрирвоан
    if (!userId) {
      navigate("/signin");
      return;
    }

    // переключаем postEditor edit/create
    setPostEditor(post || null);

    //открываем форму для создания поста
    setIsPostModalOpen(true);

    // сбрасываем состояние добавления комментариев к постам
    setReplyToPostId(null);

    // сбрасываем режим фокуса
    setFocusedPostId(null);
  };

  // Функция  для фокусирования на одном посте и спратять другие посты
  const toggleFocus = (postId: string) => {
    setFocusedPostId((prev) => (prev === postId ? null : postId));
  };

  // переменная состояния для отображения только фокусированного  поста
  const visiblePosts = focusedPostId
    ? posts.filter((post) => post.id === focusedPostId)
    : posts;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: { xs: "auto", md: "100vh" },
        overflowY: { xs: "auto", sm: "auto", md: "auto" },
        overflowX: "hidden",
        bgcolor: COLORS.mainColor,
        color: "#e5e7eb",
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mt: { xs: 1, sm: 2 },
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Хедер комнаты */}
        <Slide in={true} direction="down" timeout={300}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              mb: 4,
              p: isMobile ? 2 : 2.5,
              background: "rgba(35, 20, 51, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: "1px solid rgba(183, 148, 244, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "rgba(183, 148, 244, 0.3)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: "rgba(183,148,244,0.1)",
                  border: `2px solid rgba(183,148,244,0.3)`,
                }}
              >
                {currentRoom?.isPrivate ? "🔒" : "🌐"}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontFamily:
                      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {currentRoom?.nameRoom}
                </Typography>

                {currentRoom?.owner?.username && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: COLORS.textMuted,
                      fontSize: "0.875rem",
                      fontFamily: "'Inter', sans-serif",
                      mt: 0.25,
                    }}
                  >
                    Владелец: {currentRoom.owner?.username}
                  </Typography>
                )}
              </Box>
            </Box>

            <Button
              variant="contained"
              disabled={isPostModalOpen}
              onClick={() => handleOpenPostModal(null)} // явно передаем null
              startIcon={<AddIcon />}
              sx={{
                borderRadius: "14px",
                textTransform: "none",
                px: 3,
                py: 1,
                background: "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
                color: "#1f2933",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                },
                "&.Mui-disabled": {
                  background: "rgba(183,148,244,0.3)",
                  color: "rgba(156, 163, 175, 0.5)",
                },
              }}
            >
              Добавить пост
            </Button>
          </Paper>
        </Slide>

        {isPostModalOpen ? (
          <Slide in={isPostModalOpen} direction="up" timeout={300}>
            <Box sx={{ mb: 3 }}>
              {postEditor ? (
                // Если меняем пост
                <PostEditor
                  setIsPostModalOpen={setIsPostModalOpen}
                  mode={"edit"} // пропс для переклдчения создать/изменить пост
                  postEditor={postEditor} //  изменение поста
                  roomId={String(id)} // id текущей комнаты
                  onCancel={() => setIsPostModalOpen(false)} // закрытие формы
                />
              ) : (
                // Если создаем пост
                <PostEditor
                  setIsPostModalOpen={setIsPostModalOpen}
                  mode={"create"} // пропс для переклдчения создать/изменить пост
                  postEditor={null} //  создание поста
                  roomId={String(id)} // id текущей комнаты
                  onCancel={() => setIsPostModalOpen(false)} // закрытие формы
                />
              )}
            </Box>
          </Slide>
        ) : (
          <>
            <Divider
              sx={{
                border: "1px solid rgba(255,255,255,0.05)",
                mb: 3,
                opacity: 0.3,
              }}
            />
            {/* Список постов */}
            {Array.isArray(posts) && posts.length > 0 ? (
              <Box
                component={motion.div}
                variants={containerVariants} // применяем варианты контейнера
                initial="hidden" // начальное состояние
                animate="visible" // конечное состояние
              >
                <AnimatePresence>
                  <Stack spacing={2}>
                    {visiblePosts.map((post, index) => {
                      return (
                        <Grow in={true} timeout={index * 100} key={post.id}>
                          {/* Grow вешает  ref на свой дочерний элемент. 
                      PostCard - дочерний жлемент. Не MUI компонент, нужен ref */}
                          <PostCard
                            handleOpenPostModal={handleOpenPostModal}
                            replyToPostId={replyToPostId}
                            setReplyToPostId={setReplyToPostId}
                            isMobile={isMobile}
                            post={post}
                            index={index}
                            COLORS={COLORS}
                            userId={userId}
                            toggleFocus={toggleFocus}
                            setIsPostModalOpen={setIsPostModalOpen}
                          />
                        </Grow>
                      );
                    })}
                  </Stack>
                </AnimatePresence>
              </Box>
            ) : (
              <Zoom in={true} timeout={500}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    color: COLORS.textMuted,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: isMobile ? "0.95rem" : "1rem",
                    }}
                  >
                    Пока нет постов. Будьте первым!
                  </Typography>
                </Box>
              </Zoom>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
