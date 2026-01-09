import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  IconButton,
  InputBase,
  Stack,
  useMediaQuery,
  Fab,
  Collapse,
  Grow,
  Zoom,
  Slide,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { NavLink } from "react-router-dom";
// импортируем иконки
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// импортируем react-hooks для наивгации
import { useNavigate } from "react-router-dom";

// импортируем hooks из store/hooks
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";

import { fetchAllRooms } from "../../redux/actions/roomActions";

// импортируем компоненент модальное окно ModalRoomCreate для создания комнаты
import ModalRoomCreate from "../ModalRoomCreate";

// импортируем компоненент модальное окно ModalRoomRequest для создания запроса
import ModalRoomRequest from "../ModalRoomRequest";

// импортируем компоненент модальное окно ModalRoomList для отображения всех комнат
import ModalRoomList from "../ModalRoomList";

const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
  gradient: "linear-gradient(135deg, #2a183d 0%, #1d102f 100%)",
};
export default function ChatRooms() {
  // ----------------- Модальное окно для создания комнаты -----------------
  // состояние для модального окна создающего комнату
  const [openModalRoomCreate, setOpenModalRoomCreate] =
    useState<boolean>(false);
  // хук для навигации
  const navigate = useNavigate();
  // забираем id пользователя из store
  const userId = useAppSelector((store) => store.user.userId);
  // функция для обработки создания комнаты
  const handleCreateRoomClick = () => {
    // если пользователь ни зарегистрирован
    if (!userId) {
      // перенаправляем пользователя для регистарции
      navigate("/signin"); //не останавливаем выполнение функции.
      return;
    }
    // открываем моадальное окно
    setOpenModalRoomCreate(true);
  };

  // ------------------------ Комнаты с сервера ------------------
  // забираем комнаты из store
  const allRooms = useAppSelector((store) => store.room.allRooms);
  const dispatch = useAppDispatch();

  // обновление комнат
  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);

  // сортировка открытых комнат
  const openRooms = allRooms.filter((room) => room.isPrivate === false);
  const privateRooms = allRooms.filter((room) => room.isPrivate === true);

  // ------------------- MUI styles -------------------------------
  // Брейкпойнты для разных устройств
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isIPad = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600..899
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // ≥ 900px
  const isMid = useMediaQuery("(min-width:1000px) and (max-width:1100px)");
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg")); // ≥ 1200px
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

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

  // ------------------- Видимость комнат под разные экраны ----------------------
  // Состояния для мобильного сворачивания (инициализируем как свернутое на мобильных)
  const [mobileOpenRoomsExpanded, setMobileOpenRoomsExpanded] = useState(false);
  const [mobilePrivateRoomsExpanded, setMobilePrivateRoomsExpanded] =
    useState(false);

  // При изменении isMobile сбрасываем состояния
  useEffect(() => {
    // При переходе на мобильный - сворачиваем
    if (isMobile) {
      setMobileOpenRoomsExpanded(false);
      setMobilePrivateRoomsExpanded(false);
    }
  }, [isMobile]);

  //  Вычисляем видимость открытых комнат
  const showOpenRooms = useMemo(() => {
    return isMobile ? mobileOpenRoomsExpanded : true;
  }, [isMobile, mobileOpenRoomsExpanded]);

  //  Вычисляем видимость приватных комнат
  const showPrivateRooms = useMemo(() => {
    return isMobile ? mobilePrivateRoomsExpanded : true;
  }, [isMobile, mobilePrivateRoomsExpanded]);

  // Обработчики кликов на открытые комнаты
  const handleOpenRoomsClick = () => {
    if (isMobile) {
      setMobileOpenRoomsExpanded((prev) => !prev); // true
    }
  };

  // Обработчики кликов на приватные комнаты
  const handlePrivateRoomsClick = () => {
    if (isMobile) {
      setMobilePrivateRoomsExpanded((prev) => !prev);
    }
  };

  // --------------------- Поиск комнат --------------------
  const [searchRooms, setSearchRooms] = useState("");
  const query = searchRooms.trim().toLowerCase();
  const filteredSearchRooms = !query
    ? []
    : allRooms
        .filter((room) => (room.nameRoom || "").toLowerCase().includes(query))
        .sort((a, b) => (a?.nameRoom || "").localeCompare(b?.nameRoom || ""));

  // ---------------- Запросы к приватным комнатам -------------------
  // состоятние для открытия/закрытия модального окна
  const [openRequestModal, setOpenRequestModal] = useState<boolean>(false);

  // Состояние для id комнаты к которой делается запрос
  const [roomId, setRoomId] = useState<string>("");

  // ---------------- Модальное окно отображения всехъ комнат --------------
  const [openModalRoomList, setOpenModalRoomList] = useState<boolean>(false);

  // состояние для переключения  статуса открытых/приватных комнат
  const [roomsView, setRoomsView] = useState<string>("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: { xs: "auto", md: "100vh" },
        overflowY: { xs: "auto", sm: "auto", md: "auto" }, // 👈 важно sm
        overflowX: "hidden",
        bgcolor: COLORS.mainColor,
        color: "#e5e7eb",
        position: "relative",
      }}
    >
      <Grid
        container
        alignItems="stretch"
        sx={{
          minHeight: "100vh",
          height: { xs: "auto", md: "100%" },
          overflow: { xs: "visible", sm: "visible", md: "visible" },
        }}
      >
        {/* Левая колонка - Списки комнат */}
        <Grid
          item
          xs={12}
          sm={4}
          md={isMid ? 3 : 4}
          lg={3}
          sx={{
            height: { xs: "auto", md: "100%" },
            overflow: { xs: "visible", md: "hidden" },
            display: "flex",
            flexDirection: "column",
            p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
          }}
        >
          <Stack
            spacing={isMobile ? 2 : 3}
            sx={{
              height: { xs: "auto", md: "100%" },
              overflowY: { xs: "visible", md: "auto" },
              transition: "all 0.3s ease",

              pt: 1, //буфер сверху
              pb: 2, // буфер снизу (и можно больше если перекрывает что-то)
              pr: 1,
              "&::-webkit-scrollbar": {
                // ДОБАВИТЬ - стилизация скроллбара
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(255,255,255,0.05)",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(183,148,244,0.3)",
                borderRadius: "3px",
                "&:hover": {
                  background: "rgba(183,148,244,0.5)",
                },
              },
            }}
          >
            {/* Открытые (desktop) */}
            <Paper
              elevation={0}
              sx={{
                background: "rgba(35, 20, 51, 0.7)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: "1px solid rgba(183, 148, 244, 0.1)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(183, 148, 244, 0.3)",
                  transform: isDesktop ? "translateY(-2px)" : "none",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                },
                flexShrink: 0, // предотвращает сжатие
              }}
            >
              {/* Заголовок с возможностью сворачивания на мобильных */}
              <Box
                onClick={handleOpenRoomsClick}
                sx={{
                  p: isMobile ? 2 : 2.5,
                  cursor: isMobile ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background:
                    "linear-gradient(90deg, rgba(183,148,244,0.1) 0%, transparent 100%)",
                  borderBottom: showOpenRooms
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconButton
                    size="small"
                    sx={{
                      background: COLORS.accentSoft,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(183,148,244,0.3)",
                        transform: "rotate(15deg)",
                      },
                    }}
                  >
                    <ListAltIcon
                      sx={{ color: COLORS.accentColor, fontSize: 20 }}
                    />
                  </IconButton>
                  <Typography
                    variant="subtitle1"
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
                    Открытые комнаты
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.accentColor,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "12px",
                      background: "rgba(183,148,244,0.1)",
                    }}
                  >
                    {openRooms.length}
                  </Typography>
                  {isMobile && (
                    <IconButton size="small">
                      {showOpenRooms ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  )}
                </Stack>
              </Box>

              {/* Список открытых комнат */}
              <Collapse in={!isMobile || showOpenRooms}>
                <Box sx={{ p: isMobile ? 2 : 2.5 }}>
                  <Stack spacing={1}>
                    {openRooms
                      .slice(0, isMobile ? 3 : isLargeDesktop ? 8 : 6)
                      .map((room, index) => (
                        <Grow in={true} timeout={index * 100} key={room.id}>
                          <Box
                            component={NavLink}
                            // перейти в открытую комнату может любой пользователь
                            to={`/chatcards/${room.id}`}
                            sx={{ textDecoration: "none" }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                cursor: "pointer",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                position: "relative",
                                overflow: "hidden",
                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: "3px",
                                  background:
                                    "linear-gradient(180deg, #b794f4, transparent)",
                                  opacity: 0,
                                  transition: "opacity 0.3s ease",
                                },
                                "&:hover": {
                                  transform: "translateX(4px)",
                                  background: "rgba(183,148,244,0.08)",
                                  borderColor: "rgba(183,148,244,0.3)",
                                  boxShadow:
                                    "0 4px 20px rgba(183,148,244,0.15)",
                                  "&::before": {
                                    opacity: 1,
                                  },
                                },
                                ...styleAnimation(index),
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                              >
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "10px",
                                    background: "rgba(183,148,244,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  🌐
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      fontFamily: "'Inter', sans-serif",
                                      fontSize: isMobile
                                        ? "0.875rem"
                                        : "0.95rem",
                                      color: "#e5e7eb",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {room.nameRoom}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      color: COLORS.textMuted,
                                      mt: 0.25,
                                    }}
                                  >
                                    {" "}
                                    Участников: {0}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          </Box>
                        </Grow>
                      ))}

                    {openRooms.length >
                      (isMobile ? 3 : isLargeDesktop ? 7 : 5) && (
                      <Zoom in={true} timeout={500}>
                        <Button
                          fullWidth
                          onClick={() => {
                            setOpenModalRoomList(true);
                            setRoomsView("open");
                          }}
                          sx={{
                            mt: 1,
                            textTransform: "none",
                            borderRadius: "12px",
                            py: 1.5,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: COLORS.textMuted,
                            fontWeight: 500,
                            fontFamily: "'Inter', sans-serif",
                            "&:hover": {
                              background: "rgba(183,148,244,0.1)",
                              color: COLORS.accentColor,
                              borderColor: "rgba(183,148,244,0.3)",
                              transform: "translateY(-1px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Показать все ({openRooms.length})
                        </Button>
                      </Zoom>
                    )}
                  </Stack>
                </Box>
              </Collapse>
            </Paper>

            {/* Приватные комнаты */}
            <Paper
              elevation={0}
              sx={{
                background: "rgba(35, 20, 51, 0.7)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: "1px solid rgba(183, 148, 244, 0.1)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "rgba(183, 148, 244, 0.3)",
                  transform: isDesktop ? "translateY(-2px)" : "none",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                },
                flexShrink: 0, // ДОБАВИТЬ - предотвращает сжатие
              }}
            >
              {/* Заголовок с возможностью сворачивания на мобильных */}
              <Box
                onClick={handlePrivateRoomsClick}
                sx={{
                  p: isMobile ? 2 : 2.5,
                  cursor: isMobile ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background:
                    "linear-gradient(90deg, rgba(183,148,244,0.1) 0%, transparent 100%)",
                  borderBottom: showPrivateRooms
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconButton
                    size="small"
                    sx={{
                      background: COLORS.accentSoft,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(183,148,244,0.3)",
                        transform: "rotate(15deg)",
                      },
                    }}
                  >
                    <ListAltIcon
                      sx={{ color: COLORS.accentColor, fontSize: 20 }}
                    />
                  </IconButton>
                  <Typography
                    variant="subtitle1"
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
                    Закрытые комнаты
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.accentColor,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "12px",
                      background: "rgba(183,148,244,0.1)",
                    }}
                  >
                    {privateRooms.length}
                  </Typography>
                  {isMobile && (
                    <IconButton size="small">
                      {showPrivateRooms ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  )}
                </Stack>
              </Box>

              {/* Список приватных комнат */}
              <Collapse in={!isMobile || showPrivateRooms}>
                <Box sx={{ p: isMobile ? 2 : 2.5 }}>
                  <Stack spacing={1}>
                    {privateRooms
                      .slice(0, isMobile ? 3 : isLargeDesktop ? 6 : 8)
                      .map((room, index) => (
                        <Grow in={true} timeout={index * 100} key={room.id}>
                          <Box
                            component={NavLink}
                            sx={{ textDecoration: "none" }}
                            onClick={() => {
                              setOpenRequestModal((prev) => !prev);
                              setRoomId(room.id);
                            }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                cursor: "pointer",
                                transition:
                                  "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                position: "relative",
                                overflow: "hidden",
                                "&::before": {
                                  content: '""',
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                  bottom: 0,
                                  width: "3px",
                                  background:
                                    "linear-gradient(180deg, #b794f4, transparent)",
                                  opacity: 0,
                                  transition: "opacity 0.3s ease",
                                },
                                "&:hover": {
                                  transform: "translateX(4px)",
                                  background: "rgba(183,148,244,0.08)",
                                  borderColor: "rgba(183,148,244,0.3)",
                                  boxShadow:
                                    "0 4px 20px rgba(183,148,244,0.15)",
                                  "&::before": {
                                    opacity: 1,
                                  },
                                },
                                ...styleAnimation(index),
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                              >
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "10px",
                                    background: "rgba(183,148,244,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  🔒
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      fontFamily: "'Inter', sans-serif",
                                      fontSize: isMobile
                                        ? "0.875rem"
                                        : "0.95rem",
                                      color: "#e5e7eb",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {room.nameRoom}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      color: COLORS.textMuted,
                                      mt: 0.25,
                                    }}
                                  >
                                    {" "}
                                    Требуется доступ
                                  </Typography>
                                </Box>
                              </Stack>
                            </Paper>
                          </Box>
                        </Grow>
                      ))}
                    {privateRooms.length >
                      (isMobile ? 3 : isLargeDesktop ? 7 : 5) && (
                      <Zoom in={true} timeout={500}>
                        <Button
                          fullWidth
                          onClick={() => {
                            setOpenModalRoomList(true);
                            setRoomsView("private");
                          }}
                          sx={{
                            mt: 1,
                            textTransform: "none",
                            borderRadius: "12px",
                            py: 1.5,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: COLORS.textMuted,
                            fontWeight: 500,
                            fontFamily: "'Inter', sans-serif",
                            "&:hover": {
                              background: "rgba(183,148,244,0.1)",
                              color: COLORS.accentColor,
                              borderColor: "rgba(183,148,244,0.3)",
                              transform: "translateY(-1px)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          Показать все ({privateRooms.length})
                        </Button>
                      </Zoom>
                    )}
                  </Stack>
                </Box>
              </Collapse>
            </Paper>
          </Stack>

          {/* Информационная панель для десктопа */}
          {/* {isDesktop && (
            <Fade in={true} timeout={1000}>
              <Paper
                elevation={0}
                sx={{
                  mt: "auto",
                  p: 2.5,
                  borderRadius: "16px",
                  background: "rgba(183, 148, 244, 0.05)",
                  border: "1px solid rgba(183, 148, 244, 0.1)",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: COLORS.textMuted,
                    mb: 1,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Всего комнат
                </Typography>
                <Typography
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 700,
                    background: "linear-gradient(45deg, #b794f4, #8b5cf6)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {allRooms.length}
                </Typography>
              </Paper>
            </Fade>
          )} */}
        </Grid>

        {/* Правая колонка - Поиск и результаты */}
        <Grid
          item
          xs={12}
          sm={8}
          md={isMid ? 9 : 8}
          lg={9}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
            height: { xs: "auto", md: "100%" },
            minHeight: { xs: "auto", md: 0 },
            overflow: { xs: "visible", md: "visible" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "600px", md: "100%", lg: "1000px" },
              // mx: "auto",
              display: "flex",
              flexDirection: "column",
              minHeight: { xs: "auto", md: 0 },
              flex: 1,
            }}
          >
            {/* Заголовок */}
            <Slide in={true} direction="down" timeout={300}>
              <Box
                sx={{
                  mb: isMobile ? 2 : 3,
                  flexShrink: 0, // НЕ СЖИМАЕТСЯ
                }}
              >
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 800,
                    fontFamily: "'Inter', sans-serif",
                    background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  Найди свою комнату
                </Typography>
                <Typography
                  sx={{
                    color: COLORS.textMuted,
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Присоединяйтесь к открытым или запрашивайте доступ к приватным
                  комнатам
                </Typography>
              </Box>
            </Slide>

            {/* Поисковая строка */}
            {/*Поиск сверху: на mobile и desktop */}
            {!isIPad && (
              <Slide in={true} direction="up" timeout={500}>
                <Paper
                  elevation={0}
                  sx={{
                    p: isMobile ? 1.5 : 2,
                    borderRadius: "20px",
                    background: "rgba(35, 20, 51, 0.7)",
                    backdropFilter: "blur(10px)",
                    border: "2px solid rgba(183, 148, 244, 0.15)",
                    transition: "all 0.3s ease",
                    mb: 3,
                    flexShrink: 0,
                    "&:focus-within": {
                      borderColor: "rgba(183, 148, 244, 0.4)",
                      boxShadow:
                        "0 0 0 4px rgba(183, 148, 244, 0.1), 0 8px 32px rgba(0,0,0,0.3)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={isMobile ? 1.5 : 0}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        width: "100%",
                      }}
                    >
                      <IconButton
                        sx={{
                          ml: 0.5,
                          color: COLORS.accentColor,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                      <InputBase
                        value={searchRooms}
                        onChange={(e) => setSearchRooms(e.target.value)}
                        placeholder="Поиск по названию, теме или участникам…"
                        sx={{
                          flex: 1,
                          px: 2,
                          fontSize: {
                            xs: "0.95rem",
                            sm: "1rem",
                            md: "1.05rem",
                          },
                          color: "#e5e7eb",
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                          "&::placeholder": {
                            color: "rgba(156, 163, 175, 0.6)",
                          },
                        }}
                      />
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        width: isMobile ? "100%" : "auto",
                        justifyContent: isMobile ? "space-between" : "flex-end",
                      }}
                    >
                      <Button
                        sx={{
                          borderRadius: "14px",
                          textTransform: "none",
                          px: 3,
                          py: 1,
                          background:
                            "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
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
                        }}
                      >
                        Найти
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Slide>
            )}
            {/* Результаты поиска - Горизонтальный слайдер */}
            <Box
              sx={{
                flex: { xs: "unset", md: 1 },
                overflowY: { xs: "visible", md: "auto" },
                overflowX: "hidden",
                borderRadius: "20px",
                background: "rgba(35, 20, 51, 0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(5px)",
                minHeight: { xs: "auto", md: 0 },
                px: 3,
                pt: 3,
                pb: isIPad ? 16 : 10, // 👈 чтобы sticky search не перекрывал
              }}
            >
              {/* Контент результатов */}
              <Box
                sx={{
                  // minHeight: 0,  // убрал для внутреннно скролла поиска результатов
                  // display: "flex", // убрал для внутреннно скролла поиска результатов
                  // flexDirection: "column", // убрал для внутреннно скролла поиска результатов
                  p: 3,
                  // position: "relative", // убрал для внутреннно скролла поиска результатов
                  // zIndex: 1, // убрал для внутреннно скролла поиска результатов
                }}
              >
                {/* Заголовок */}
                {filteredSearchRooms.length > 0 ? (
                  <Box>
                    <Stack spacing={2}>
                      {filteredSearchRooms.map((room, index) => (
                        <Grow in={true} timeout={index * 100} key={room.id}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2.5,
                              borderRadius: "16px",
                              background: "rgba(35, 20, 51, 0.7)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(183, 148, 244, 0.1)",
                              cursor: "pointer",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              position: "relative",
                              overflow: "hidden",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: "4px",
                                background: room.isPrivate
                                  ? "linear-gradient(180deg, #ef4444, transparent)"
                                  : "linear-gradient(180deg, #b794f4, transparent)",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                              },
                              "&:hover": {
                                transform: "translateX(8px)",
                                background: "rgba(183,148,244,0.1)",
                                borderColor: "rgba(183,148,244,0.3)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                                "&::before": {
                                  opacity: 1,
                                },
                              },
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "12px",
                                  background: room.isPrivate
                                    ? "rgba(239,68,68,0.1)"
                                    : "rgba(183,148,244,0.1)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1.5rem",
                                  flexShrink: 0,
                                }}
                              >
                                {room.isPrivate ? "🔒" : "🌐"}
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  spacing={2}
                                >
                                  <Box>
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "1.1rem",
                                        color: "#e5e7eb",
                                        mb: 0.5,
                                      }}
                                    >
                                      {room.nameRoom}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "0.875rem",
                                        color: COLORS.textMuted,
                                      }}
                                    >
                                      {room.isPrivate
                                        ? "🔒 Приватная комната • Требуется доступ"
                                        : "🌐 Открытая комната "}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grow>
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  <Box sx={{ mb: 3, textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                      }}
                    >
                      Тренды недели
                    </Typography>
                    <Typography
                      sx={{
                        color: COLORS.textMuted,
                        fontSize: "0.9rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Самые обсуждаемые темы
                    </Typography>
                    {/* Горизонтальная лента трендов */}
                    <Box
                      sx={{
                        flex: 1,
                        overflowX: "auto",
                        overflowY: "hidden",
                        display: "flex",
                        alignItems: "center",
                        py: 2,
                        "&::-webkit-scrollbar": {
                          height: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "3px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "rgba(183,148,244,0.3)",
                          borderRadius: "3px",
                          "&:hover": {
                            background: "rgba(183,148,244,0.5)",
                          },
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={3}
                        sx={{
                          px: 2,
                          minWidth: "max-content",
                        }}
                      >
                        {[
                          {
                            title: "Новые технологии",
                            icon: "🚀",
                            users: "245",
                            trend: "+12%",
                            color: "#8b5cf6",
                          },
                          {
                            title: "Киберспорт",
                            icon: "🎮",
                            users: "189",
                            trend: "+24%",
                            color: "#ef4444",
                          },
                          {
                            title: "Искусственный интеллект",
                            icon: "🧠",
                            users: "312",
                            trend: "+18%",
                            color: "#3b82f6",
                          },
                          {
                            title: "Дизайн интерфейсов",
                            icon: "🎨",
                            users: "156",
                            trend: "+8%",
                            color: "#10b981",
                          },
                          {
                            title: "Web3 & Крипто",
                            icon: "⛓️",
                            users: "278",
                            trend: "+15%",
                            color: "#f59e0b",
                          },
                          {
                            title: "Мобильная разработка",
                            icon: "📱",
                            users: "204",
                            trend: "+10%",
                            color: "#ec4899",
                          },
                        ].map((trend, index) => (
                          <Zoom
                            in={true}
                            timeout={index * 100}
                            key={trend.title}
                          >
                            <Paper
                              sx={{
                                minWidth: "200px",
                                p: 3,
                                borderRadius: "20px",
                                background: "rgba(255,255,255,0.03)",
                                border: `1px solid ${trend.color}20`,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-8px)",
                                  boxShadow: `0 15px 30px ${trend.color}40`,
                                  borderColor: `${trend.color}60`,
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "12px",
                                    background: `${trend.color}20`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.5rem",
                                    mr: 2,
                                  }}
                                >
                                  {trend.icon}
                                </Box>
                                <Box>
                                  <Typography
                                    sx={{
                                      fontWeight: 600,
                                      color: "#e5e7eb",
                                      fontFamily: "'Inter', sans-serif",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {trend.title}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "0.8rem",
                                      color: COLORS.textMuted,
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    {trend.users} участников
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mt: 2,
                                  pt: 2,
                                  borderTop: "1px solid rgba(255,255,255,0.05)",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.85rem",
                                    color: trend.color,
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 600,
                                  }}
                                >
                                  {trend.trend}
                                </Typography>
                                <Button
                                  size="small"
                                  sx={{
                                    borderRadius: "12px",
                                    textTransform: "none",
                                    fontSize: "0.8rem",
                                    px: 2,
                                    py: 0.5,
                                    background: `${trend.color}15`,
                                    color: trend.color,
                                    "&:hover": {
                                      background: `${trend.color}30`,
                                    },
                                  }}
                                >
                                  Присоединиться
                                </Button>
                              </Box>
                            </Paper>
                          </Zoom>
                        ))}
                      </Stack>
                    </Box>
                    {/* Подсказка внизу */}
                    <Box sx={{ mt: 3, textAlign: "center", flexShrink: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          color: COLORS.textMuted,
                          fontFamily: "'Inter', sans-serif",
                          opacity: 0.7,
                        }}
                      >
                        ← Прокрутите для просмотра всех трендов →
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            {isIPad && (
              <Box
                sx={{
                  position: "sticky",
                  bottom: 0,
                  zIndex: 10,
                  mt: 2,
                  pt: 2,
                  flexShrink: 0,
                  background:
                    "linear-gradient(180deg, rgba(29,16,47,0) 0%, rgba(29,16,47,0.85) 40%, rgba(29,16,47,1) 100%)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Slide in={true} direction="up" timeout={500}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: isMobile ? 1.5 : 2,
                      borderRadius: "20px",
                      background: "rgba(35, 20, 51, 0.7)",
                      backdropFilter: "blur(10px)",
                      border: "2px solid rgba(183, 148, 244, 0.15)",
                      transition: "all 0.3s ease",
                      mb: 3,
                      flexShrink: 0,
                      "&:focus-within": {
                        borderColor: "rgba(183, 148, 244, 0.4)",
                        boxShadow:
                          "0 0 0 4px rgba(183, 148, 244, 0.1), 0 8px 32px rgba(0,0,0,0.3)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Stack
                      direction={isMobile ? "column" : "row"}
                      spacing={isMobile ? 1.5 : 0}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                          width: "100%",
                        }}
                      >
                        <IconButton
                          sx={{
                            ml: 0.5,
                            color: COLORS.accentColor,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                        <InputBase
                          value={searchRooms}
                          onChange={(e) => setSearchRooms(e.target.value)}
                          placeholder="Поиск по названию, теме или участникам…"
                          sx={{
                            flex: 1,
                            px: 2,
                            fontSize: {
                              xs: "0.95rem",
                              sm: "1rem",
                              md: "1.05rem",
                            },
                            color: "#e5e7eb",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            "&::placeholder": {
                              color: "rgba(156, 163, 175, 0.6)",
                            },
                          }}
                        />
                      </Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          width: isMobile ? "100%" : "auto",
                          justifyContent: isMobile
                            ? "space-between"
                            : "flex-end",
                        }}
                      >
                        <Button
                          sx={{
                            borderRadius: "14px",
                            textTransform: "none",
                            px: 3,
                            py: 1,
                            background:
                              "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
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
                          }}
                        >
                          Найти
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                </Slide>
              </Box>
            )}
          </Box>
        </Grid>

        {/* FAB для создания комнаты */}
        <Zoom in={true} timeout={1000}>
          <Fab
            onClick={handleCreateRoomClick}
            sx={{
              position: "fixed",
              bottom: {
                xs: 20,
                sm: 24,
                md: 32,
              },
              right: {
                xs: 20,
                sm: 24,
                md: 32,
              },
              width: {
                xs: 56,
                sm: 64,
                md: 72,
              },
              height: {
                xs: 56,
                sm: 64,
                md: 72,
              },
              background: "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
              color: "#1f2933",
              "&:hover": {
                background: "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
                transform: "scale(1.05)",
              },
              boxShadow: "0 12px 40px rgba(139, 92, 246, 0.4)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: "float 3s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": {
                  transform: "translateY(0)",
                },
                "50%": {
                  transform: "translateY(-8px)",
                },
              },
            }}
          >
            <AddIcon sx={{ fontSize: { xs: 28, sm: 30, md: 32 } }} />
          </Fab>
        </Zoom>
      </Grid>

      {/*Открытие  Модального окна для создания комнаты */}
      {openModalRoomCreate && (
        <ModalRoomCreate
          openRoomCreate={openModalRoomCreate}
          onCloseRoomCreate={() => setOpenModalRoomCreate(false)}
        />
      )}

      {/*Открытие  Модального окна для создания запроса к приватной комнате */}
      {openRequestModal && (
        <ModalRoomRequest
          openRequestCreate={openRequestModal}
          onCloseRequestCreate={() => setOpenRequestModal(false)}
          roomId={roomId}
        />
      )}
      {/*Открытие  Модального окна для отображения всех комнат */}
      {openModalRoomList && (
        <ModalRoomList
          openAll={openModalRoomList}
          view={roomsView}
          onCloseRoomList={() => setOpenModalRoomList(false)}
          isSmall={isSmall}
        />
      )}
    </Box>
  );
}
