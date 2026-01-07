import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Fade,
  Slide,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";

import KeyIcon from "@mui/icons-material/Key";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

// ReactDOM: Первый аргумент: React-элемент для рендеринга
// ReactDOM: Второй аргумент: DOM-элемент (контейнер)
import ReactDOM from "react-dom";
const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  cardSoftBg: "#2b183c",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  accentColorStrong: "#c4b5fd",
  textMuted: "#9ca3af",
  gradient: "linear-gradient(135deg, #2a183d 0%, #1d102f 100%)",
  success: "#10b981",
  error: "#ef4444",
};

import { useAppSelector, useAppDispatch } from "../../redux/store/hooks";
import { sendRoomRequest } from "../../redux/actions/requestActions";
import { CLEAR_ROOM_REQUEST_STATE } from "../../redux/types/requestTypes";
export default function ModalRoomRequest({
  openRequestCreate, // пропс состояния открытия модалки для  создания запроса
  onCloseRequestCreate, // пропс состяния закрытия модалки для  создания запроса
  roomId, // id комнаты к которой идет запрос
}) {
  const { request, error, status } = useAppSelector(
    (store) => store.roomRequest
  );
  const dispatch = useAppDispatch();

  // Отправка запроса
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(sendRoomRequest(roomId));
    // onCloseRequestCreate();
  };

  // Закрытие модалки
  const handleClose = () => {
    onCloseRequestCreate();
  };

  // Сброс состояния запроса при открытии модалки
  useEffect(() => {
    if (openRequestCreate) {
      dispatch({ type: CLEAR_ROOM_REQUEST_STATE });
    }
  }, [openRequestCreate]);

  // ----------------- Snackbar -----------------------
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const isSuccess = request !== null;
  const isError = error !== null;
  const show = isSuccess || isError;

  useEffect(() => {
    if (show) {
      setOpenSnackbar((prev) => !prev);
    }
  }, [show]);

  console.log("isSuccess", isSuccess);
  console.log("isError", isError);
  console.log("status", status);
  return ReactDOM.createPortal(
    <Fade in={openRequestCreate} timeout={300}>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          zIndex: 10030,
          position: "fixed",
          inset: 0,
          background: "rgba(3, 1, 14, 0.85)",
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          overflow: "hidden",
        }}
        onClick={handleClose}
      >
        {/* Карточка модалки */}
        <Slide in={openRequestCreate} direction="up" timeout={400}>
          <Box
            sx={{
              maxWidth: 480,
              width: "100%",
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(183, 148, 244, 0.1)",
              animation: "float 6s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-8px)" },
              },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Градиентный верхний бар */}
            <Box
              sx={{
                height: "4px",
                background: "linear-gradient(90deg, #b794f4, #8b5cf6, #a855f7)",
                width: "100%",
              }}
            />
            {/* Контент модалки */}
            <Paper
              elevation={0}
              sx={{
                background: COLORS.cardBg,
                p: { xs: 3, sm: 4, md: 4.5 },
                borderRadius: "0 0 24px 24px",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(183, 148, 244, 0.3), transparent)",
                },
              }}
            >
              {/* Кнопка закрытия */}
              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: COLORS.textMuted,
                  background: "rgba(255, 255, 255, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(183, 148, 244, 0.1)",
                    color: COLORS.accentColor,
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
              {/* Заголовок с иконкой */}
              <Stack>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    background: "rgba(183, 148, 244, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(183, 148, 244, 0.2)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <KeyIcon
                    sx={{
                      fontSize: 28,
                      color: COLORS.accentColor,
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                      background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5,
                    }}
                  >
                    Запрос доступа
                  </Typography>
                </Box>
              </Stack>
              {/* Описание */}{" "}
              <Typography
                variant="body1"
                sx={{
                  mb: 3.5,
                  color: "#e5e7eb",
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6,
                  fontSize: "1rem",
                }}
              >
                Вы запрашиваете доступ к приватной комнате. Владелец комнаты
                получит уведомление и сможет одобрить или отклонить ваш запрос.
              </Typography>
              {/* Детали запроса */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 4,
                  borderRadius: "16px",
                  background: "rgba(35, 20, 51, 0.6)",
                  border: "1px solid rgba(183, 148, 244, 0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: "rgba(239, 68, 68, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LockIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: "#e5e7eb",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.95rem",
                      }}
                    >
                      Приватный доступ
                    </Typography>
                    <Typography
                      sx={{
                        color: COLORS.textMuted,
                        fontSize: "0.85rem",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Только по приглашению владельца
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              {/* Форма с кнопками */}
              <Stack
                component="form"
                onSubmit={handleSubmitRequest}
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    textTransform: "none",
                    borderRadius: "14px",
                    px: 3,
                    py: 1.2,
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: COLORS.textMuted,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: COLORS.accentColor,
                      color: COLORS.accentColor,
                      background: "rgba(183, 148, 244, 0.05)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Отмена
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<SendIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: "14px",
                    px: 3.5,
                    py: 1.2,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    background:
                      "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
                    color: "#0b0615",
                    boxShadow: "0 8px 32px rgba(139, 92, 246, 0.4)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
                      boxShadow: "0 12px 40px rgba(139, 92, 246, 0.6)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Отправить запрос
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Slide>
        {/* Snackbar при успешном запросе */}
        {request && (
          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            TransitionComponent={(props) => <Slide {...props} direction="up" />}
            sx={{
              "& .MuiSnackbarContent-root": {
                minWidth: "300px",
                maxWidth: "500px",
              },
            }}
          >
            <Paper
              elevation={8}
              sx={{
                width: "100%",
                borderRadius: "16px",
                background: COLORS.cardBg,
                border: "1px solid rgba(183, 148, 244, 0.2)",
                backdropFilter: "blur(10px)",
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  background:
                    "linear-gradient(90deg, rgba(183, 148, 244, 0.1) 0%, rgba(183, 148, 244, 0.05) 100%)",
                  borderLeft: "4px solid #10b981",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleIcon sx={{ color: "#10b981", fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: COLORS.textMuted,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.85rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {status || "Владелец комнаты получит уведомление"}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  // onClick={() => setOpenSnackbar(false)}
                  sx={{
                    color: COLORS.textMuted,
                    "&:hover": {
                      color: COLORS.accentColor,
                      background: "rgba(183, 148, 244, 0.1)",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          </Snackbar>
        )}
        {/* Snackbar при ошибке */}
        {error && (
          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            TransitionComponent={(props) => (
              <Slide {...props} direction="up"></Slide>
            )}
            sx={{
              "& .MuiSnackbarContent-root": {
                minWidth: "300px",
                maxWidth: "500px",
              },
            }}
          >
            <Paper
              elevation={8}
              sx={{
                width: "100%",
                borderRadius: "16px",
                background: COLORS.cardBg,
                border: "1px solid rgba(239, 68, 68, 0.2)",
                backdropFilter: "blur(10px)",
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0, 0, 0, 0.5)",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  background:
                    "linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                  borderLeft: "4px solid #ef4444",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background: "rgba(239, 68, 68, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <ErrorIcon sx={{ color: "#ef4444", fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                      color: "#e5e7eb",
                      fontSize: "0.95rem",
                      mb: 0.5,
                    }}
                  >
                    Ошибка отправки
                  </Typography>
                  <Typography
                    sx={{
                      color: COLORS.textMuted,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.85rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {error || "Не удалось отправить запрос. Попробуйте позже."}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  // onClick={() => setOpenSnackbarError(false)}
                  sx={{
                    color: COLORS.textMuted,
                    "&:hover": {
                      color: "#ef4444",
                      background: "rgba(239, 68, 68, 0.1)",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          </Snackbar>
        )}
      </Box>
    </Fade>,

    document.getElementById("modal-request") || document.body
  );
}
