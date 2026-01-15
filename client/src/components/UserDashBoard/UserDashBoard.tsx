import React, { use, useEffect, useState } from "react";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Иконки
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  fetchUserRequestsStatus,
  updateRoomRequestStatus,
} from "../../redux/actions/roomRequestStatusActions";

// Тип для TabPanel
interface TabPanelProps {
  index: number;
  value: number;
  children?: React.ReactNode;
}

// TabPanel компонент:
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

//  Спинер запроса
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
// Цвета для фона
const COLORS = {
  mainColor: "#11071c",
  pageBg: "#1d102f",
  cardBg: "#231433",
  cardSoftBg: "#2b183c",
  accentColor: "#b794f4",
  accentColorStrong: "#c4b5fd",
  textMuted: "#9ca3af",
};

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

// xs: 0      - Extra small (мобильные телефоны)
// sm: 600    - Small (планшеты, крупные телефоны)
// md: 900    - Medium (небольшие ноутбуки, планшеты в альбомной)
// lg: 1200   - Large (ноутбуки, десктопы)
// xl: 1536   - Extra large (большие мониторы)

// Redux
import { useAppSelector, useAppDispatch } from "../../redux/store/hooks";
import { fetchUserRooms } from "../../redux/actions/roomActions";
import { NavLink } from "react-router-dom";

export default function UserDashBoard() {
  // ------------------  Табы --------------------
  // состояние для табов
  const [tabIndex, setTabIndex] = useState<number>(0);

  // Функция для переключания  табов
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // ------------------ Данные из store ------------------
  // Забираем данные  User из store
  const { userId, userAvatar, userName } = useAppSelector(
    (store) => store.user
  );

  // Забираем данные  RoomRequestStatus из store
  const { updatingById } = useAppSelector((store) => store.roomRequestStatus);
  const dispatch = useAppDispatch();
  //  забираем все комнаты пользователя
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserRooms());
    }
  }, [userId]);

  // Забираем комнаты пользователя из store
  const { userRooms } = useAppSelector((store) => store.room);

  const theme = useTheme();
  //  ЭКРАНЫ МЕНЬШЕ lg (1200px)
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

  // ---------------- Загрузка запрсов -----------
  // Забираем входящие и исходяшие запросы из store
  const { incoming, outgoing } = useAppSelector(
    (store) => store.roomRequestStatus
  );
  // зашружаем запросы
  useEffect(() => {
    // только для текущего пользователя
    if (userId) {
      dispatch(fetchUserRequestsStatus());
    }
  }, [userId, dispatch]); // зависимости

  // объеденям все запросы
  const allRequests = [
    ...incoming.map((r) => ({ ...r, kind: "incoming" as const })),
    ...outgoing.map((r) => ({ ...r, kind: "outgoing" as const })),
  ];

  console.log("updatingById", updatingById);

  console.log("allRequests", allRequests);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background:
          "radial-gradient(1200px 800px at 0% -20%, #3b1d5e 0%, transparent 60%), radial-gradient(1100px 700px at 110% 0%, #4c1d95 0%, transparent 55%), linear-gradient(135deg, #0b0615 0%, #1d102f 45%, #0f172a 100%)",
        // overflow: arrowRequest ? "auto" : "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          p: 3,
          color: "#e5e7eb",
        }}
      >
        {/* Header: имя и кнопка редактирования */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {userAvatar ? (
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  p: 0.5,
                  background:
                    "linear-gradient(135deg, #b794f4 0%, #7c3aed 50%, #4c1d95 100%)",
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
                  width: 72,
                  height: 72,
                  bgcolor: "#3b0764",
                  color: "#e5e7eb",
                }}
              >
                <AccountCircleIcon sx={{ fontSize: 40 }} />
              </Avatar>
            )}

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  color: COLORS.accentColorStrong,
                  letterSpacing: 0.4,
                }}
              >
                {userName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: COLORS.textMuted, fontSize: "0.75rem" }}
              >
                Личный кабинет
              </Typography>
            </Box>
          </Box>

          {isSmall ? (
            <Fab
              color="primary"
              sx={{
                position: "fixed",
                bottom: 24,
                right: 32,
                bgcolor: COLORS.accentColor,
                color: "#0b0615",
                "&:hover": { bgcolor: COLORS.accentColorStrong },
                boxShadow: "0 14px 32px rgba(0,0,0,0.9)",
                animation: "pulse 1.5s infinite",
                "@keyframes pulse": {
                  "0%": {
                    boxShadow: "0 0 0 0 rgba(183,148,244, 0.7)",
                  },
                  "50%": {
                    boxShadow: "0 0 0 20px rgba(183,148,244, 0)",
                  },
                  "100%": {
                    boxShadow: "0 0 0 0 rgba(183,148,244, 0)",
                  },
                },
              }}
            >
              <BorderColorIcon />
            </Fab>
          ) : (
            <Button
              variant="contained"
              sx={{
                background:
                  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                color: "#0b0615",
                fontWeight: 600,
                borderRadius: 999,
                px: 2.8,
                height: 40,
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.9)",
                },
              }}
            >
              Редактировать профиль
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          // Функция  переключания  табов
          onChange={handleChangeTabs}
          sx={{
            mb: 3,
            borderBottom: "1px solid rgba(148,163,184,0.35)",
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "0.9rem",
              color: COLORS.textMuted,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              minHeight: 40,
            },
            "& .Mui-selected": {
              color: COLORS.accentColor,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: COLORS.accentColor,
              height: 3,
            },
          }}
        >
          <Tab label="Мои комнаты" />
          <Tab label="Запросы" />
          <Tab label="Ответы к комментариям" />
        </Tabs>

        {/* Panel: Мои комнаты */}
        <TabPanel value={tabIndex} index={0}>
          <Box sx={commonPanelBoxSx}>
            <Grid container spacing={2} mb={2}>
              {userRooms.length < 0 ? (
                <Typography sx={{ mt: 1, color: COLORS.textMuted }}>
                  У вас пока нет комнат.
                </Typography>
              ) : (
                userRooms.map((room) => (
                  <Grid key={room.id} item xs={12}>
                    <Box
                      component={NavLink}
                      to={`/chatcards/${room.id}`}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      mb={1}
                      sx={{
                        textDecoration: "none",
                        cursor: "pointer",
                        backgroundColor: COLORS.cardSoftBg,
                        p: 2,
                        borderRadius: 3,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.7)",
                        border: "1px solid rgba(148,163,184,0.35)",
                        transition:
                          "transform .2s ease, box-shadow .2s ease, border-color .2s ease, background-color .2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 14px 30px rgba(0,0,0,0.95)",
                          borderColor: "rgba(183,148,244,0.7)",
                          backgroundColor: "#311b43",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          textDecoration: "none",
                          color: COLORS.accentColor,
                          "&:hover": {
                            color: COLORS.accentColorStrong,
                          },
                        }}
                      >
                        {room.isPrivate ? "🔒" : "🌐"} {room.nameRoom}
                      </Typography>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </TabPanel>

        {/* Panel: Запросы */}
        <TabPanel value={tabIndex} index={1}>
          <Box
            sx={{
              ...commonPanelBoxSx,
              maxHeight: "60vh",
            }}
          >
            <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {allRequests.map((request) => {
                const isPending = request.status === "PENDING";

                //  исходящие запросы пользователя
                const isOutgoing = request.kind === "outgoing";

                const isUpdating = updatingById[request.id];
                console.log("isUpdating", isUpdating);

                const altText = isOutgoing
                  ? "Вы отправили запрос"
                  : `${request?.requester?.username}` || "Пользователь";

                const primaryText = isOutgoing
                  ? `${request?.room?.nameRoom}`
                  : `${request?.requester?.username}  отправил вам запрос, ${request?.room?.nameRoom}`;

                return (
                  <ListItem
                    key={request.id}
                    sx={{
                      backgroundColor: COLORS.cardSoftBg,
                      cursor: "pointer",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.85)",
                      borderRadius: 3,
                      border: "1px solid rgba(148,163,184,0.35)",
                      "&:hover": {
                        boxShadow: "0 16px 34px rgba(0,0,0,1)",
                        transform: "translateY(-2px)",
                        transition: "0.2s",
                        borderColor: "rgba(183,148,244,0.7)",
                        backgroundColor: "#331c47",
                      },
                    }}
                    secondaryAction={
                      // Проверяем, идёт ли обновление этого конкретного запроса isUpdating
                      // Если именно этот запрос сейчас обновляется
                      // если пользователь нажал «Принять / Отклонить»
                      // показываем спинер, остальное ишнорируется
                      isUpdating ? (
                        <ActionSpinner intent={updatingById[request.id]} />
                      ) : // Если запрос исходящий isOutgoing
                      // У исходящих запросов нет кнопок, пользователь не  может их принять/отклонить
                      isOutgoing ? (
                        request.status === "APPROVED" ? (
                          <CheckCircleIcon sx={{ color: "#22c55e" }} />
                        ) : request.status === "REJECTED" ? (
                          <CancelIcon sx={{ color: "#f97373" }} />
                        ) : (
                          <HourglassEmptyIcon />
                        )
                      ) : //Если запрос входящий И он в статусе PENDING
                      // пользователь может принять или отклонить
                      isPending ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            // Вызов экшен
                            onClick={() =>
                              dispatch(
                                updateRoomRequestStatus(request.id, "APPROVED")
                              )
                            }
                            variant="contained"
                            sx={{
                              backgroundColor: "#22c55e",
                              color: "#0f172a",
                              textTransform: "none",
                              "&:hover": {
                                backgroundColor: "#4ade80",
                              },
                            }}
                          >
                            Принять
                          </Button>
                          <Button
                            variant="outlined"
                            sx={{
                              color: "#f97373",
                              borderColor: "#f97373",
                              textTransform: "none",
                              "&:hover": {
                                borderColor: "#fca5a5",
                                backgroundColor: "rgba(248,113,113,0.08)",
                              },
                            }}
                            // Вызов экшен
                            onClick={() =>
                              dispatch(
                                updateRoomRequestStatus(request.id, "REJECTED")
                              )
                            }
                          >
                            Отклонить
                          </Button>
                        </Box>
                      ) : request.status === "APPROVED" ? (
                        <CheckCircleIcon sx={{ color: "#22c55e" }} />
                      ) : request.status === "REJECTED" ? (
                        <CancelIcon sx={{ color: "#f97373" }} />
                      ) : (
                        <HourglassEmptyIcon sx={{ color: "#eab308" }} />
                      )
                    }
                  >
                    {(() => {
                      return (
                        <ListItemButton
                          disableRipple
                          disableTouchRipple
                          sx={{
                            bgcolor: "transparent",
                            "&:hover": { bgcolor: "transparent" },
                            "&.Mui-focusVisible": { bgcolor: "transparent" },
                            "&.Mui-selected": { bgcolor: "transparent" },
                            "&.Mui-selected:hover": { bgcolor: "transparent" },
                            transition: "none",
                            p: 0,
                            cursor: "pointer",
                          }}
                        >
                          {/* Аватар пользовтаеля */}
                          <ListItemAvatar>
                            <Avatar alt={altText} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={altText}
                            primaryTypographyProps={{
                              sx: {
                                color: COLORS.accentColorStrong,
                                fontSize: "0.95rem",
                                fontFamily:
                                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                              },
                            }}
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                  fontFamily:
                                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                  color: COLORS.textMuted,
                                  fontSize: "0.85rem",
                                }}
                              >
                                {primaryText}
                              </Typography>
                            }
                          >
                            {request?.requester?.username}
                          </ListItemText>
                        </ListItemButton>
                      );
                    })()}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </TabPanel>

        {/* Panel: Ответы на комментарии */}
        <TabPanel value={tabIndex} index={2}>
          <Box
            sx={{
              ...commonPanelBoxSx,
            }}
          >
            Ответы на ваши комментарии и посты
          </Box>
        </TabPanel>
      </Box>
    </div>
  );
}
