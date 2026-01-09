import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Dialog,
  useMediaQuery, // хук который отслеживает соответствие медиа-запросам
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  InputBase,
  Paper,
  Tabs,
  Tab,
  Chip,
  Button,
  Stack,
  Collapse,
  Grow,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import { useAppSelector } from "../../redux/store/hooks";

const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
  gradient: "linear-gradient(135deg, #2a183d 0%, #1d102f 100%)",
};

// Тип для пропсов компонента
interface ModalRoomListProps {
  openAll: boolean;
  view: "open" | "private";
  onCloseRoomList: () => void;
  isSmall: boolean;
}
export default function ModalRoomList({
  openAll,
  view,
  onCloseRoomList,
  isSmall,
}: ModalRoomListProps) {
  // ----------------- Для создания адаптивного диалогового окна ------------
  // Добавляем тип Theme
  const theme = useTheme();
  // применяем стили, когда ширина экрана меньше или равна sm брейкпоинту
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // ------------------ Статусы комнат ---------------
  // локальные состояния для переключения комнат по статусу открытые/приватные
  const [tab, setTab] = useState<number>(view === "private" ? 1 : 0);

  // При каждом открытии модального окна сбрасываем таб в соответствии с view
  useEffect(() => {
    if (openAll) {
      const newTab = view === "private" ? 1 : 0;
      setTab(newTab);
    }
  }, [openAll, view]); // зависимости

  // ----------------- Данные из store ------------------
  const { allRooms } = useAppSelector((store) => store.room);
  const openRooms = allRooms.filter((room) => room.isPrivate === false);
  const privateRooms = allRooms.filter((room) => room.isPrivate === true);
  const currentList = tab === 0 ? openRooms : privateRooms;

  // Длина списка комнат
  const currentCount = currentList.length;

  // ----------------- для мобильных устройств ------------------
  const [controlsOpen, setControlsOpen] = useState<boolean>(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setControlsOpen(false);
    } else {
      setControlsOpen(true);
    }
  }, [isMobile, openAll]);

  return (
    <Dialog
      open={Boolean(openAll)}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : "20px",
          bgcolor: COLORS.mainColor,
          color: "#e5e7eb",
          boxShadow: "0 18px 40px rgba(0,0,0,0.9)",
          border: fullScreen ? "none" : "1px solid rgba(183,148,244,0.12)",
          overflow: "hidden",
          backgroundImage: COLORS.gradient,
          backgroundBlendMode: "overlay",
        },
      }}
    >
      {/* Top AppBar */}
      <AppBar
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "rgba(35, 20, 51, 0.75)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.55)",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            onClick={onCloseRoomList}
            edge="start"
            aria-label="close"
            sx={{
              color: "#e5e7eb",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
              "&:hover": {
                background: "rgba(183,148,244,0.15)",
                borderColor: "rgba(183,148,244,0.3)",
                transform: "translateY(-1px)",
              },
              transition: "all .25s ease",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* <Typography
            sx={{
              ml: 2,
              flex: 1,
              fontSize: "1rem",
              fontWeight: 500,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
            component="div"
          >
            {tab ? "Открытые комнаты" : "Приватные комнаты"}
          </Typography> */}
          <Box sx={{ flex: 1, minWidth: 0, pl: 0.5 }}>
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 700,
                fontFamily:
                  "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              component="div"
            >
              {tab === 0 ? "Открытые комнаты" : "Приватные комнаты"}
            </Typography>
            <Typography
              sx={{
                mt: 0.25,
                fontSize: "0.8rem",
                color: COLORS.textMuted,
                fontFamily:
                  "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {tab === 0
                ? "Свободный вход • выбирайте комнату"
                : "Требуется доступ • отправьте запрос"}
            </Typography>
          </Box>

          {/* Сортировка комнат */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              sx={{
                color: COLORS.accentColor,
                background: COLORS.accentSoft,
                border: "1px solid rgba(183,148,244,0.2)",
                borderRadius: "12px",
                "&:hover": {
                  background: "rgba(183,148,244,0.25)",
                  transform: "translateY(-1px)",
                },
                transition: "all .25s ease",
              }}
              aria-label="sort"
            >
              <SwapVertIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <Chip
              label={currentCount}
              size="small"
              sx={{
                bgcolor: "rgba(183,148,244,0.12)",
                color: COLORS.accentColor,
                fontWeight: 700,
                fontSize: "0.75rem",
                border: "1px solid rgba(183,148,244,0.18)",
              }}
            />
          </Stack>
        </Toolbar>

        {/* Контролы: поиск + табы */}
        {/* <Box sx={{ px: 2, pb: 1.5 }}>
          <Paper
            component="form"
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1,
              py: 0.5,
              borderRadius: 999,
              bgcolor: COLORS.mainColor,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <SearchIcon sx={{ color: COLORS.textMuted, fontSize: 20 }} />
            <InputBase
              placeholder="Поиск комнаты"
              sx={{
                flex: 1,
                fontSize: { xs: "0.9rem", md: "0.95rem" },
                color: "#e5e7eb",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            />
            <Button
              sx={{
                textTransform: "none",
                fontSize: "0.8rem",
                px: 2,
                borderRadius: 999,
                bgcolor: COLORS.accentSoft,
                color: COLORS.accentColor,
                "&:hover": {
                  bgcolor: "rgba(183,148,244,0.25)",
                },
              }}
            >
              Искать
            </Button>
          </Paper>

          <Tabs
            value={tab}
            variant="fullWidth"
            sx={{
              mt: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "0.85rem",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                minHeight: 40,
                color: COLORS.textMuted,
              },
              "& .Mui-selected": {
                color: COLORS.accentColor,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: COLORS.accentColor,
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PublicIcon fontSize="small" />
                  Открытые
                </Box>
              }
            ></Tab>
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LockIcon fontSize="small" />
                  Приватные
                </Box>
              }
            ></Tab>
          </Tabs>
        </Box> */}
        {/* Controls: search + tabs */}
        <Collapse in={controlsOpen} timeout={250}>
          <Box sx={{ px: 2, pb: 1.75 }}>
            <Paper
              elevation={0}
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.25,
                py: 0.75,
                borderRadius: "18px",
                background: "rgba(29, 16, 47, 0.65)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(183, 148, 244, 0.15)",
                transition: "all 0.25s ease",
                "&:focus-within": {
                  borderColor: "rgba(183,148,244,0.4)",
                  boxShadow:
                    "0 0 0 4px rgba(183, 148, 244, 0.1), 0 10px 30px rgba(0,0,0,0.35)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <IconButton
                sx={{
                  color: COLORS.accentColor,
                  "&:hover": { transform: "scale(1.06)" },
                  transition: "transform .2s ease",
                }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Поиск по названию…"
                sx={{
                  flex: 1,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  color: "#e5e7eb",
                  fontFamily:
                    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  "&::placeholder": { color: "rgba(156, 163, 175, 0.6)" },
                }}
              />
              <Button
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  px: 2,
                  borderRadius: "14px",
                  bgcolor: COLORS.accentSoft,
                  color: COLORS.accentColor,
                  "&:hover": { bgcolor: "rgba(183,148,244,0.25)" },
                  "&.Mui-disabled": {
                    opacity: 0.45,
                    color: COLORS.textMuted,
                  },
                }}
              >
                Очистить
              </Button>
            </Paper>

            <Tabs
              value={tab}
              variant="fullWidth"
              sx={{
                mt: 1.25,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "0.9rem",
                  fontFamily:
                    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  minHeight: 44,
                  color: COLORS.textMuted,
                },
                "& .Mui-selected": { color: COLORS.accentColor },
                "& .MuiTabs-indicator": { backgroundColor: COLORS.accentColor },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PublicIcon fontSize="small" />
                    Открытые
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LockIcon fontSize="small" />
                    Приватные
                  </Box>
                }
              />
            </Tabs>
          </Box>
        </Collapse>
      </AppBar>

      {/* Список */}
      <Box
        sx={{
          px: 2,
          py: 2,
          maxHeight: isSmall ? "90vh" : "70vh",
          overflowY: "auto",
          bgcolor: "rgba(29, 16, 47, 0.35)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255,255,255,0.05)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(183,148,244,0.3)",
            borderRadius: "3px",
            "&:hover": { background: "rgba(183,148,244,0.5)" },
          },
        }}
      >
        <List dense disablePadding>
          {currentList.map((room, index) => (
            <Grow in={true} timeout={index * 70} key={room.id}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  sx={{
                    borderRadius: "16px",
                    p: 2,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 10px 26px rgba(0,0,0,0.55)",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
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
                      transition: "opacity 0.25s ease",
                    },
                    "&:hover": {
                      transform: "translateX(6px)",
                      background: "rgba(183,148,244,0.08)",
                      borderColor: "rgba(183,148,244,0.28)",
                      boxShadow: "0 14px 34px rgba(0,0,0,0.7)",
                      "&::before": { opacity: 1 },
                    },
                    transition:
                      "transform .25s ease, background-color .25s ease, border-color .25s ease, box-shadow .25s ease",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "12px",
                        background: room.isPrivate
                          ? "rgba(239,68,68,0.12)"
                          : "rgba(183,148,244,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {room.isPrivate ? (
                        <LockIcon
                          sx={{ color: COLORS.accentColor, fontSize: 20 }}
                        />
                      ) : (
                        <PublicIcon
                          sx={{ color: COLORS.accentColor, fontSize: 20 }}
                        />
                      )}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily:
                            "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#e5e7eb",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {room.nameRoom}
                      </Typography>
                    }
                    secondary={
                      room.isPrivate ? (
                        <Typography
                          sx={{
                            fontSize: "0.78rem",
                            color: COLORS.textMuted,
                            mt: 0.25,
                            fontFamily:
                              "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          }}
                        >
                          Приватная комната
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: COLORS.textMuted,
                            mt: 0.25,
                          }}
                        >
                          Открытая комната
                        </Typography>
                      )
                    }
                  />
                  <Chip
                    size="small"
                    label={room.isPrivate ? "Доступ" : "Войти"}
                    sx={{
                      ml: 1.5,
                      height: 26,
                      borderRadius: "12px",
                      bgcolor: room.isPrivate
                        ? "rgba(239,68,68,0.10)"
                        : "rgba(183,148,244,0.12)",
                      color: room.isPrivate ? "#fca5a5" : COLORS.accentColor,
                      border: "1px solid rgba(255,255,255,0.06)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Grow>
          ))}

          {currentList.length === 0 && (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                color: COLORS.textMuted,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontFamily:
                    "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  fontSize: "1.05rem",
                }}
              >
                Комнаты не найдены.
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Dialog>
  );
}
