import React, { useEffect, useMemo, useState } from "react";
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
import { NavLink, useNavigate } from "react-router-dom";

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
      {value === index && children}
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
  const navigate = useNavigate();
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

  // ------------- При меньших размерах экрана ----------------
  //  ЭКРАНЫ МЕНЬШЕ lg (1200px)
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  // ------------------ Данные из user store ------------------
  // Забираем данные  User из store
  const { userId, avatar, username } = useAppSelector((store) => store.user);

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

  // объеденяем все запросы
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
    background: "rgba(35, 20, 51, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    border: "1px solid rgba(183, 148, 244, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "rgba(183, 148, 244, 0.3)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
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

  const tabsMeta = [
    {
      id: "dash-tab-0",
      controls: "dash-tabpanel-0",
      icon: <MeetingRoomIcon />,
      label: "Мои комнаты",
      value: userRooms?.length ?? 0,
    },
    {
      id: "dash-tab-1",
      controls: "dash-tabpanel-1",
      icon: <MailOutlineIcon />,
      label: "Запросы",
      value: allRequests.length,
    },
    {
      id: "dash-tab-2",
      controls: "dash-tabpanel-2",
      icon: <ForumOutlinedIcon />,
      label: "Ответы",
      value: 0,
    },
  ];

  // ------------- Переход к редактированию профиля --------------
  const goToProfileEditor = () => {
    navigate(`/profileeditor`);
  };

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
      }}
    >
      <Grid
        container
        sx={{
          maxWidth: 800 /* Максимальная ширина контента */,
          mx: "auto" /* Автоматические отступы по горизонтали (центрирование) */,
          px: {
            xs: 2,
            sm: 2.5,
            md: 3,
          } /* Горизонтальные отступы (padding-left/right) */,
          py: {
            xs: 2,
            sm: 2.5,
            md: 3,
          } /* Вертикальные отступы (padding-top/bottom) */,
        }}
      >
        {/* Profile / Tabs / Content - все в одной колонке */}
        <Grid item xs={12}>
          <Stack spacing={2}>
            {/* Profile card */}
            <Paper elevation={0} sx={GlassCardSx}>
              <Box
                sx={{
                  p: 2,
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
              </Box>

              <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {avatar ? (
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        background: "rgba(183,148,244,0.1)",
                        border: "2px solid rgba(183,148,244,0.3)",
                      }}
                      src={`${import.meta.env.VITE_API_URL}${avatar}`}
                      alt="user"
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        background: "rgba(183,148,244,0.1)",
                        border: "2px solid rgba(183,148,244,0.3)",
                        color: "#e5e7eb",
                      }}
                    >
                      <AccountCircleIcon sx={{ fontSize: 38 }} />
                    </Avatar>
                  )}

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily:
                          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                        background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "1.05rem",
                        mb: 0.25,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {username}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ px: 2, pb: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={goToProfileEditor}
                  sx={{
                    borderRadius: "14px",
                    textTransform: "none",
                    py: 1.1,
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
                  Редактировать
                </Button>
              </Box>
            </Paper>

            {/* Tabs card */}
            <Paper elevation={0} sx={GlassCardSx}>
              <Box
                sx={{
                  p: 2,
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

              <Box sx={{ p: 1.5 }}>
                <Tabs
                  value={tabIndex}
                  onChange={handleChangeTabs}
                  variant="fullWidth"
                  sx={{
                    minHeight: 48,
                    "& .MuiTabs-indicator": {
                      height: 2,
                      backgroundColor: COLORS.accentColor,
                      borderRadius: 1,
                    },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: COLORS.textMuted,
                      minHeight: 48,
                      fontSize: "0.875rem",
                      justifyContent: "flex-start",
                      px: 1.5,
                    },
                    "& .Mui-selected": {
                      color: COLORS.accentColor,
                    },
                  }}
                >
                  {tabsMeta.map((tab) => (
                    <Tab
                      key={tab.id}
                      id={tab.id}
                      aria-controls={tab.controls}
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            gap: 1.5,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ minWidth: 0 }}
                          >
                            {tab.icon}
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.875rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {tab.label}
                            </Typography>
                          </Stack>
                          <Chip
                            size="small"
                            label={tab.value}
                            sx={{
                              height: 22,
                              px: 0.75,
                              bgcolor: "rgba(255,255,255,0.04)",
                              color: COLORS.textMuted,
                              border: "1px solid rgba(255,255,255,0.08)",
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                      }
                    />
                  ))}
                </Tabs>
              </Box>
            </Paper>
          </Stack>

          {/* Content Panels */}
          <Box>
            <TabPanel value={tabIndex} index={0}>
            <Paper elevation={0} sx={GlassCardSx}>
              <Box
                sx={{
                  p: 2,
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

              <Box sx={{ p: 2 }}>
                {!userRooms || userRooms.length === 0 ? (
                  <Typography
                    sx={{
                      color: COLORS.textMuted,
                      fontFamily: "'Inter', sans-serif",
                      textAlign: "center",
                      py: 4,
                    }}
                  >
                    Пока пусто. Вы ещё не состоите ни в одной комнате
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {userRooms.map((room: any, index: number) => (
                      <Box
                        component={NavLink}
                        to={`/chatcards/${room.id}`}
                        sx={{ textDecoration: "none" }}
                        key={room.id}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
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
                              transform: "translateX(4px)",
                              background: "rgba(183,148,244,0.08)",
                              borderColor: "rgba(183,148,244,0.3)",
                              boxShadow: "0 4px 20px rgba(183,148,244,0.15)",
                              "&::before": { opacity: 1 },
                            },
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
                                borderRadius: "10px",
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
                                    fontWeight: 500,
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "0.875rem",
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
                                  fontFamily: "'Inter', sans-serif",
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
                  p: 2,
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

              <Box sx={{ p: 2 }}>
                {error && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      mb: 2,
                      borderRadius: "12px",
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#fca5a5",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {error}
                  </Paper>
                )}

                {allRequests.length === 0 ? (
                  <Typography
                    sx={{
                      color: COLORS.textMuted,
                      fontFamily: "'Inter', sans-serif",
                      textAlign: "center",
                      py: 4,
                    }}
                  >
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
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                transition: "all 0.3s ease",
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
                                  opacity: 0.7,
                                },
                                "&:hover": {
                                  transform: "translateX(4px)",
                                  background: "rgba(183,148,244,0.08)",
                                  borderColor: "rgba(183,148,244,0.3)",
                                  boxShadow: "0 4px 20px rgba(183,148,244,0.15)",
                                },
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
                    p: 2,
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

                <Box sx={{ p: 2 }}>
                  <Typography
                    sx={{
                      color: COLORS.textMuted,
                      fontFamily: "'Inter', sans-serif",
                      textAlign: "center",
                      py: 4,
                    }}
                  >
                    Скоро будет. Здесь появятся ответы на ваши комментарии и посты
                  </Typography>
                </Box>
              </Paper>
            </TabPanel>
          </Box>
          </Grid>
        </Grid>
    </Box>
  );
}
