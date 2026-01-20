import React, { use, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  ListItemButton,
  useMediaQuery,
  Fab,
  Stack,
  Paper,
  IconButton,
  Grow,
  Chip,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

// Иконки
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";

// Redux
import {
  fetchUserRequestsStatus,
  updateRoomRequestStatus,
} from "../../redux/actions/roomRequestStatusActions";
import { useAppSelector, useAppDispatch } from "../../redux/store/hooks";
import { fetchUserRooms } from "../../redux/actions/roomActions";

// ---------- UI Colors (как в ChatRooms) ----------
const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
  gradient: "linear-gradient(135deg, #2a183d 0%, #1d102f 100%)",
};

// Тип для TabPanel
interface TabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

// TabPanel компонент
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`} // Уникальный идентификатор для каждой панели контента
      aria-labelledby={`simple-tab-${index}`} // Связь панели с соответствующей вкладкой
      {...other} // распаковка оставшихся пропсов
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
// Стили для TabPanel
const commonPanelBoxSx = {
  p: 2,
  backgroundColor: COLORS.cardBg,
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.06)",
  maxHeight: "65vh",
  overflowY: "hidden",
  pr: 1,
  boxShadow: "0 14px 30px rgba(0,0,0,0.85)",
};

// Спинер действия (approve/reject)
function ActionSpinner({ intent }) {
  const isApproved = intent === "APPROVED";
  const Icon = isApproved ? CheckCircleIcon : CancelIcon;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
      }}
    >
      {/* Крутящийся loader в момент изменения статуса */}
      <CircularProgress
        size={32}
        thickness={4}
        sx={{
          color: isApproved ? "success.main" : "error.main",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Иконка которая появляется в момент прокрутки показывая статус запроса */}
        <Icon
          sx={{
            fontSize: 20,
            color: isApproved ? "success.main" : "error.main",
            opacity: 0.9,
          }}
        />
      </Box>
    </Box>
  );
}

export default function UserDashBoard() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Breakpoints (похоже на ChatRooms)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600
  const isIPad = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600..899
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // ≥900
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg")); // ≥1200

  // ------------------  Табы --------------------
  // состояние для табов
  const [tabIndex, setTabIndex] = useState<number>(0);

  // Функция для переключания  табов
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // ------------- При меньших размераз экрана ----------------
  //  ЭКРАНЫ МЕНЬШЕ lg (1200px)
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  // ------------------ Данные из user store ------------------
  // Забираем данные  User из store
  const { userId, userAvatar, userName } = useAppSelector(
    (store) => store.user,
  );

  //  забираем все комнаты пользователя
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserRooms());
    }
  }, [userId]);

  // Забираем комнаты пользователя из store
  const { userRooms } = useAppSelector((store) => store.room);

  // ---------------- Данные из request store -----------
  // Забираем входящие и исходяшие запросы из store
  const { incoming, outgoing, updatingById, error } = useAppSelector(
    (store) => store.roomRequestStatus,
  );
  // загружаем запросы
  useEffect(() => {
    // только для текущего пользователя
    if (userId) {
      dispatch(fetchUserRequestsStatus());
    }
  }, [userId, dispatch]); // зависимости

  // объеденям все запросы
  const allRequests = useMemo(() => {
    return [
      ...incoming.map((r) => ({ ...r, kind: "incoming" as const })),
      ...outgoing.map((r) => ({ ...r, kind: "outgoing" as const })),
    ];
  }, [incoming, outgoing]);

  // Анимация (как в ChatRooms)
  const styleAnimation = (index: number) => ({
    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
    "@keyframes fadeInUp": {
      "0%": { opacity: 0, transform: "translateY(10px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  });
  const GlassCardSx = {
    background: "rgba(35, 20, 51, 0.4)",
    backdropFilter: "blur(16px) saturate(180%)",
    WebkitBackdropFilter: "blur(16px) saturate(180%)",
    borderRadius: "24px",
    border: "1px solid rgba(183, 148, 244, 0.12)",
    boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2)
  `,
    overflow: "hidden",
    position: "relative",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "1px",
      background:
        "linear-gradient(90deg, transparent, rgba(183,148,244,0.4), transparent)",
      zIndex: 1,
    },
    "&:hover": {
      borderColor: "rgba(183, 148, 244, 0.3)",
      transform: isDesktop
        ? "translateY(-6px) scale(1.01)"
        : "translateY(-2px)",
      boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(183, 148, 244, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.15)
    `,
    },
  } as const;

  const SectionTitleSx = {
    fontWeight: 800,
    fontFamily: "'Inter', sans-serif",
    background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as const;

  // Новый стиль для статусных индикаторов
  const StatusPulseSx = {
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      borderRadius: "inherit",
      background: "linear-gradient(45deg, #b794f4, #8b5cf6, #7c3aed, #b794f4)",
      backgroundSize: "400% 400%",
      animation: "gradientPulse 3s ease infinite",
      zIndex: -1,
      opacity: 0.6,
    },
    "@keyframes gradientPulse": {
      "0%, 100%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
    },
  };

  // ------------- Паралакс эффект --------------
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.mainColor,
        color: "#e5e7eb",
        backgroundImage: `
      radial-gradient(
        1200px 800px at 
        calc(50% + ${mousePosition.x}px) 
        calc(20% + ${mousePosition.y}px), 
        rgba(139, 92, 246, 0.15) 0%, 
        transparent 50%
      ),
      radial-gradient(
        1000px 600px at 
        calc(80% - ${mousePosition.x}px) 
        calc(80% - ${mousePosition.y}px), 
        rgba(124, 58, 237, 0.1) 0%, 
        transparent 45%
      ),
      linear-gradient(135deg, #0b0615 0%, #1d102f 45%, #0f172a 100%)
    `,
        backgroundAttachment: "fixed",
        transition: "background-position 0.3s ease-out",
        overflowX: "hidden",
      }}
    >
      <Grid
        container
        // spacing={isMobile ? 2 : 3}
        sx={{
          maxWidth: 1300 /* Максимальная ширина контента */,
          mx: "auto" /* Автоматические отступы по горизонтали (центрирование) */,
          px: {
            xs: 2,
            sm: 2.5,
            md: 3,
            lg: 3.5,
          } /* Горизонтальные отступы (padding-left/right) */,
          py: {
            xs: 2,
            sm: 2.5,
            md: 3,
          } /* Вертикальные отступы (padding-top/bottom) */,
        }}
      >
        {/* LEFT: Profile / Tabs */}
        <Grid
          item
          xs={12} /* На очень маленьких экранах */
          md={4} /* На средних экранах (medium) */
          lg={3} /* На больших экранах (large) */
        >
          <Stack
          // spacing={isMobile ? 2 : 3}
          >
            {/* Profile card */}
            <Paper elevation={0} sx={GlassCardSx}>
              <Box
                sx={{
                  p: isMobile ? 2 : 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  background:
                    "linear-gradient(90deg, rgba(183,148,244,0.1) 0%, transparent 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IconButton>
                    <DashboardIcon sx={{ color: COLORS.accentColor }} />
                  </IconButton>
                  <Box>
                    <Typography sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                      Профиль
                    </Typography>
                    <Typography sx={{ color: COLORS.textMuted, fontSize: 12 }}>
                      Личный кабинет
                    </Typography>
                  </Box>
                </Stack>
                {!isMobile && (
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 2,
                      py: 0.9,
                      position: "relative", // ← добавить
                      overflow: "hidden", // ← добавить
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        borderRadius: "14px",
                        background:
                          "linear-gradient(45deg, #b794f4, #8b5cf6, #7c3aed, #b794f4)",
                        backgroundSize: "400% 400%",
                        animation: "gradientPulse 3s ease infinite",
                        zIndex: 0,
                      },
                      "& .MuiButton-label": {
                        position: "relative",
                        zIndex: 1,
                      },

                      background:
                        "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",

                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 8px 25px rgba(139, 92, 246, 0.35)",
                      },
                      transition: "all 0.25s ease",
                    }}
                  >
                    <Typography sx={{ zIndex: 2, color: "#1f2933" }}>
                      Редактировать
                    </Typography>
                  </Button>
                )}
              </Box>

              <Box sx={{ p: isMobile ? 2 : 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {userAvatar ? (
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        p: 0.5,
                        // ДОБАВЬТЕ ЭТО:
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: -2,
                          left: -2,
                          right: -2,
                          bottom: -2,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(45deg, #b794f4, #8b5cf6, #7c3aed, #b794f4)",
                          backgroundSize: "400% 400%",
                          animation: "gradientPulse 3s ease infinite",
                          zIndex: -1,
                          opacity: 0.6,
                        },
                        // Стили внутри остаются:
                        background:
                          "linear-gradient(135deg, #b794f4 0%, #7c3aed 50%, #4c1d95 100%)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${userAvatar}`}
                        alt="user"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  ) : (
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "rgba(183,148,244,0.15)",
                        color: "#e5e7eb",
                        border: "1px solid rgba(183,148,244,0.25)",
                      }}
                    >
                      <AccountCircleIcon sx={{ fontSize: 38 }} />
                    </Avatar>
                  )}

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        ...SectionTitleSx,
                        fontSize: isMobile ? "1.05rem" : "1.1rem",
                        mb: 0.25,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {userName}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {isMobile && (
                <Box sx={{ px: 2, pb: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      py: 1.1,
                      background:
                        "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
                      color: "#1f2933",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
                      },
                    }}
                  >
                    Редактировать профиль
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Tabs card */}
            <Paper elevation={0} sx={GlassCardSx}>
              <Box
                sx={{
                  p: isMobile ? 2 : 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background:
                    "linear-gradient(90deg, rgba(183,148,244,0.1) 0%, transparent 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconButton>
                    <ForumOutlinedIcon sx={{ color: COLORS.accentColor }} />
                  </IconButton>
                  <Typography sx={{ fontWeight: 700 }}>Разделы</Typography>
                </Stack>
              </Box>

              <Box sx={{ p: isMobile ? 1.25 : 1.5 }}>
                <Tabs
                  value={tabIndex}
                  onChange={handleChangeTabs}
                  variant="fullWidth"
                  sx={{
                    minHeight: 42,
                    "& .MuiTabs-indicator": {
                      height: 3,
                      backgroundColor: COLORS.accentColor,
                      borderRadius: 2,
                    },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: COLORS.textMuted,
                      minHeight: 42,
                      borderRadius: "12px",
                    },
                    "& .Mui-selected": {
                      color: COLORS.accentColor,
                    },
                  }}
                >
                  <Tab
                    id="dash-tab-0"
                    aria-controls="dash-tabpanel-0"
                    icon={<MeetingRoomIcon />}
                    iconPosition="start"
                    label="Мои комнаты"
                  />
                  <Tab
                    id="dash-tab-1"
                    aria-controls="dash-tabpanel-1"
                    icon={<MailOutlineIcon />}
                    iconPosition="start"
                    label="Запросы"
                  />
                  <Tab
                    id="dash-tab-2"
                    aria-controls="dash-tabpanel-2"
                    icon={<ForumOutlinedIcon />}
                    iconPosition="start"
                    label="Ответы"
                  />
                </Tabs>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT: Content */}
        <Grid item xs={12} md={8} lg={9}>
          {/* Panels */}
          <TabPanel value={tabIndex} index={0}>
            <Paper elevation={0} sx={GlassCardSx}>
              <Box
                sx={{
                  p: isMobile ? 2 : 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IconButton>🌐</IconButton>
                  <Typography sx={{ fontWeight: 700 }}>Мои комнаты</Typography>
                </Stack>

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: COLORS.accentColor,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "12px",
                    background: "rgba(183,148,244,0.1)",
                  }}
                >
                  {userRooms?.length ?? 0}
                </Typography>
              </Box>

              <Box>
                {!userRooms || userRooms.length === 0 ? (
                  <Typography>
                    Пока пусто. Вы ещё не состоите ни в одной комнате
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {userRooms.map((room: any, index: number) => (
                      <Grow in={true} timeout={index * 90} key={room.id}>
                        <Box
                          component={NavLink}
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
                                background: room.isPrivate
                                  ? "linear-gradient(180deg, #ef4444, transparent)"
                                  : "linear-gradient(180deg, #b794f4, transparent)",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                              },
                              "&:hover": {
                                transform: "translateX(6px)",
                                background: "rgba(183,148,244,0.08)",
                                borderColor: "rgba(183,148,244,0.3)",
                                boxShadow: "0 4px 20px rgba(183,148,244,0.15)",
                                "&::before": { opacity: 1 },
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
                                  width: 36,
                                  height: 36,
                                  borderRadius: "12px",
                                  background: "rgba(183,148,244,0.1)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                {room.isPrivate ? "🔒" : "🌐"}
                              </Box>

                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 600,
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: isMobile ? "0.95rem" : "1rem",
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
                                    fontSize: "0.8rem",
                                    color: COLORS.textMuted,
                                    mt: 0.25,
                                  }}
                                >
                                  {room.isPrivate
                                    ? "Приватная • доступ по запросу"
                                    : "Открытая • доступна всем"}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Box>
                      </Grow>
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <Paper elevation={0} sx={GlassCardSx}>
              <Box
                sx={{
                  p: isMobile ? 2 : 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IconButton>📨</IconButton>
                  <Typography sx={{ fontWeight: 700 }}>
                    Запросы доступа
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    label={`Всего: ${allRequests.length}`}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.03)",
                      color: COLORS.textMuted,
                      border: "1px solid rgba(255,255,255,0.08)",
                      fontWeight: 700,
                    }}
                  />
                </Stack>
              </Box>

              <Box>
                {error && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      mb: 2,
                      borderRadius: "14px",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      color: "#fca5a5",
                    }}
                  >
                    {error}
                  </Paper>
                )}

                {allRequests.length === 0 ? (
                  <Typography>
                    Нет запросов. Здесь появятся входящие и исходящие запросы
                  </Typography>
                ) : (
                  <List
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      p: 0,
                    }}
                  >
                    {allRequests.map((request: any, index: number) => {
                      const isPending = request.status === "PENDING";
                      const isOutgoing = request.kind === "outgoing";
                      const isUpdating = Boolean(updatingById[request.id]);

                      const altText = isOutgoing
                        ? "Вы отправили запрос"
                        : request?.requester?.username || "Пользователь";

                      const secondaryText = isOutgoing
                        ? `${request?.room?.nameRoom}`
                        : `${request?.requester?.username} отправил вам запрос • ${request?.room?.nameRoom}`;

                      const leftIcon =
                        request.status === "APPROVED"
                          ? "✅"
                          : request.status === "REJECTED"
                            ? "⛔"
                            : "⏳";

                      return (
                        <Grow in={true} timeout={index * 80} key={request.id}>
                          <ListItem
                            disableGutters
                            sx={{
                              p: 0,
                            }}
                            secondaryAction={
                              isUpdating ? (
                                <ActionSpinner
                                  intent={updatingById[request.id]}
                                />
                              ) : isOutgoing ? (
                                request.status === "APPROVED" ? (
                                  <CheckCircleIcon sx={{ color: "#22c55e" }} />
                                ) : request.status === "REJECTED" ? (
                                  <CancelIcon sx={{ color: "#f97373" }} />
                                ) : (
                                  <HourglassEmptyIcon
                                    sx={{ color: "#eab308" }}
                                  />
                                )
                              ) : request.status === "APPROVED" ? (
                                <CheckCircleIcon sx={{ color: "#22c55e" }} />
                              ) : request.status === "REJECTED" ? (
                                <CancelIcon sx={{ color: "#f97373" }} />
                              ) : (
                                <HourglassEmptyIcon sx={{ color: "#eab308" }} />
                              )
                            }
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                width: "100%",
                                p: 2,
                                borderRadius: "16px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
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
                                    request.status === "APPROVED"
                                      ? "linear-gradient(180deg, #22c55e, transparent)"
                                      : request.status === "REJECTED"
                                        ? "linear-gradient(180deg, #ef4444, transparent)"
                                        : "linear-gradient(180deg, #eab308, transparent)",
                                  opacity: 0.9,
                                },
                                "&:hover": {
                                  transform: isDesktop
                                    ? "translateX(6px)"
                                    : "none",
                                  background: "rgba(183,148,244,0.06)",
                                  borderColor: "rgba(183,148,244,0.25)",
                                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                                },
                                ...styleAnimation(index),
                              }}
                            >
                              <ListItemButton
                                disableRipple
                                disableTouchRipple
                                sx={{
                                  p: 0,
                                  bgcolor: "transparent",
                                  "&:hover": { bgcolor: "transparent" },
                                }}
                              >
                                <ListItemAvatar sx={{ minWidth: 52 }}>
                                  <Avatar
                                    alt={altText}
                                    sx={{
                                      bgcolor: "rgba(183,148,244,0.15)",
                                      border:
                                        "1px solid rgba(183,148,244,0.25)",
                                    }}
                                  >
                                    {leftIcon}
                                  </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                  primary={
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                      justifyContent="space-between"
                                    >
                                      <Typography
                                        sx={{
                                          color: COLORS.accentColor,
                                          fontWeight: 800,
                                          fontFamily: "'Inter', sans-serif",
                                          fontSize: "0.95rem",
                                        }}
                                      >
                                        {altText}
                                      </Typography>
                                    </Stack>
                                  }
                                  secondary={
                                    <Typography
                                      component="span"
                                      sx={{
                                        display: "block",
                                        mt: 0.5,
                                        color: COLORS.textMuted,
                                        fontSize: "0.85rem",
                                        fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      {secondaryText}
                                    </Typography>
                                  }
                                />
                              </ListItemButton>

                              {/* 👉 КНОПКИ СНИЗУ */}
                              {!isOutgoing && isPending && (
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                >
                                  <IconButton
                                    size="small"
                                    // клик на иконку принять
                                    onClick={(e) => {
                                      // при клике по иконке не срабатывал клик по карточке
                                      e.stopPropagation();
                                      dispatch(
                                        updateRoomRequestStatus(
                                          request.id,
                                          "APPROVED",
                                        ),
                                      );
                                    }}
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: "12px",
                                      bgcolor: "rgba(34,197,94,0.14)",
                                      border: "1px solid rgba(34,197,94,0.25)",
                                      "&:hover": {
                                        bgcolor: "rgba(34,197,94,0.22)",
                                        transform: "translateY(-1px)",
                                      },
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <CheckCircleIcon
                                      sx={{ color: "#22c55e" }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    // клик на иконку отклонить
                                    onClick={(e) => {
                                      // при клике по иконке не срабатывал клик по карточке
                                      e.stopPropagation();
                                      dispatch(
                                        updateRoomRequestStatus(
                                          request.id,
                                          "REJECTED",
                                        ),
                                      );
                                    }}
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: "12px",
                                      bgcolor: "rgba(239,68,68,0.14)",
                                      border: "1px solid rgba(239,68,68,0.25)",
                                      "&:hover": {
                                        bgcolor: "rgba(239,68,68,0.22)",
                                        transform: "translateY(-1px)",
                                      },
                                      transition: "all 0.2s ease",
                                    }}
                                  >
                                    <CancelIcon sx={{ color: "#ef4444" }} />
                                  </IconButton>
                                </Stack>
                              )}

                              {!isOutgoing && isPending && (
                                <>
                                  <Divider
                                    sx={{
                                      mt: 1.5,
                                      borderColor: "rgba(255,255,255,0.06)",
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      mt: 1.25,
                                      fontSize: "0.78rem",
                                      color: "rgba(156,163,175,0.8)",
                                      fontFamily: "'Inter', sans-serif",
                                    }}
                                  >
                                    Примите запрос, чтобы открыть доступ к
                                    комнате.
                                  </Typography>
                                </>
                              )}
                            </Paper>
                          </ListItem>
                        </Grow>
                      );
                    })}
                  </List>
                )}
              </Box>
            </Paper>
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            <Paper elevation={0} sx={GlassCardSx}>
              <Box
                sx={{
                  p: isMobile ? 2 : 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IconButton>💬</IconButton>
                  <Typography sx={{ fontWeight: 700 }}>
                    Ответы к комментариям
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ p: isMobile ? 2 : 2.5 }}>
                <Typography>
                  Скоро будет. Здесь появятся ответы на ваши комментарии и посты
                </Typography>
              </Box>
            </Paper>
          </TabPanel>
        </Grid>
      </Grid>
    </Box>
  );
}
