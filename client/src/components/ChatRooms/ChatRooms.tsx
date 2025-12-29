import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  IconButton,
  Divider,
  InputBase,
  Stack,
  useMediaQuery,
  Fab,
} from "@mui/material";

// импортируем иконки
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

// импортируем react-hooks для наивгации
import { useNavigate } from "react-router-dom";

// импортируем hooks из store/hooks
import { useAppSelector } from "../../redux/store/hooks";

// импортируем компоненент модальное окно ModalRoomCreate
import ModalRoomCreate from "../ModalRoomCreate";

const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
};
export default function ChatRooms() {
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

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: COLORS.mainColor,
        color: "#e5e7eb",
      }}
    >
      <Grid container sx={{ width: "100%", height: "100%" }}>
        {/* Левая колонка */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            pt: 2,
            pr: 2,
            pb: { xs: 0, md: 2 }, // на мобиле убираем нижний паддинг
            pl: 2,
            borderRight: { md: "1px solid rgba(255,255,255,0.06)" },
            bgcolor: COLORS.mainColor,
          }}
        >
          <Stack spacing={3}>
            {/* Открытые (desktop) */}
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: COLORS.accentSoft,
                    "&:hover": { bgcolor: COLORS.accentSoft },
                  }}
                >
                  <ListAltIcon
                    sx={{ color: COLORS.accentColor, fontSize: 20 }}
                  />
                </IconButton>
                <Typography
                  variant="subtitle1"
                  sx={{
                    flexGrow: 1,
                    color: COLORS.textMuted,
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    letterSpacing: 0.5,
                  }}
                >
                  Открытые комнаты
                </Typography>
                <Typography
                  sx={{ fontSize: 14, color: "#e5e7eb", opacity: 0.8 }}
                >
                  10
                </Typography>
              </Stack>
              <Divider
                sx={{
                  mb: 1.5,
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              />
            </Box>
            {/* Приватные (desktop) */}
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: COLORS.accentSoft,
                    "&:hover": { bgcolor: COLORS.accentSoft },
                  }}
                >
                  <ListAltIcon
                    sx={{ color: COLORS.accentColor, fontSize: 20 }}
                  />
                </IconButton>
                <Typography
                  variant="subtitle1"
                  sx={{
                    flexGrow: 1,
                    color: COLORS.textMuted,
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    letterSpacing: 0.5,
                  }}
                >
                  Приватные комнаты
                </Typography>
                <Typography
                  sx={{ fontSize: 14, color: "#e5e7eb", opacity: 0.8 }}
                >
                  10
                </Typography>
              </Stack>
              <Divider
                sx={{
                  mb: 1.5,
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              />
            </Box>
          </Stack>
        </Grid>

        {/* Правая колонка поиск */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            pt: { xs: 0, md: 2 },
            pr: 2,
            pb: 2,
            pl: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            bgcolor: { xs: "transparent", md: "transparent" },
          }}
        >
          <Stack
            sx={{
              width: "100%",
              maxWidth: 720,
              mx: "auto",
              flex: 1,
              minHeight: 0,
            }}
          >
            {/* Поисковая строка */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  bgcolor: "transparent",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <IconButton sx={{ ml: 0.5, color: COLORS.textMuted }}>
                  <SearchIcon />
                </IconButton>
                <InputBase
                  placeholder="Поиск комнаты…"
                  sx={{
                    flex: 1,
                    px: 1,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    color: "#e5e7eb",
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                />
                <Button
                  sx={{
                    bgcolor: COLORS.accentSoft,
                    mr: 0.5,
                    borderRadius: 999,
                    textTransform: "none",
                    px: 2.5,
                    color: COLORS.accentColor,
                    fontFamily:
                      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "rgba(183,148,244,0.25)",
                    },
                  }}
                >
                  Найти
                </Button>
              </Paper>
            </Box>
            {/* Результаты поиска */}
          </Stack>
        </Grid>
        {/* FAB — создание комнаты */}

        <Fab
          color="primary"
          onClick={handleCreateRoomClick}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 32,
            bgcolor: COLORS.accentColor,
            color: "#1f2933",
            "&:hover": { bgcolor: "#c4b5fd" },
            boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
            animation: "pulse 1.5s infinite",
            "@keyframes pulse": {
              "0%": {
                boxShadow: "0 0 0 0 rgba(183,148,244,0.65)",
              },
              "50%": {
                boxShadow: "0 0 0 18px rgba(183,148,244,0)",
              },
              "100%": {
                boxShadow: "0 0 0 0 rgba(183,148,244,0)",
              },
            },
          }}
        >
          {" "}
          <AddIcon />
        </Fab>
      </Grid>
     {/* открываем модальное окно для оздания комнаты */}
      {openModalRoomCreate && (
        <ModalRoomCreate
          open={openModalRoomCreate} // пропс для открытия модального окна 
          onClose={() => setOpenModalRoomCreate(false)} // пропс для закрытия модального окна 
        />
      )}
    </Box>
  );
}
