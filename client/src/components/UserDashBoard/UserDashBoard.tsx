import React, { useEffect, useState } from "react";
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

// xs: 0      - Extra small (мобильные телефоны)
// sm: 600    - Small (планшеты, крупные телефоны)
// md: 900    - Medium (небольшие ноутбуки, планшеты в альбомной)
// lg: 1200   - Large (ноутбуки, десктопы)
// xl: 1536   - Extra large (большие мониторы)

// Redux
import { useAppSelector, useAppDispatch } from "../../redux/store/hooks";
import { fetchUserRooms } from "../../redux/actions/roomActions";

export default function UserDashBoard() {
  // ------------------  Табы --------------------
  // состояние для табов
  const [tabIndex, setTabIndex] = useState<number>(0);

  // Функция для переключания  табов
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // ------------------ Данные из store ------------------
  // Забираем данные из store
  const { userId, userAvatar, userName } = useAppSelector(
    (store) => store.user
  );

  const dispatch = useAppDispatch();
  //  забираем все комнаты пользователя
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserRooms());
    }
  }, [userId]);

  const { userRooms } = useAppSelector((store) => store.room);

  const theme = useTheme();
  //  ЭКРАНЫ МЕНЬШЕ lg (1200px)
  const isSmall = useMediaQuery(theme.breakpoints.down("lg"));

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
          <Box>
            <Grid container>
              {userRooms.length < 0 ? (
                <Typography sx={{ mt: 1, color: COLORS.textMuted }}>
                  У вас пока нет комнат.
                </Typography>
              ) : (
                userRooms.map((room) => (
                  <Grid item>
                    <Box>
                      <Typography>{room.nameRoom}</Typography>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </TabPanel>
      </Box>
    </div>
  );
}
