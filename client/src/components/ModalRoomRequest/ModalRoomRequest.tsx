import React from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";

// ReactDOM: Первый аргумент: React-элемент для рендеринга
// ReactDOM: Второй аргумент: DOM-элемент (контейнер)
import ReactDOM from "react-dom";
const COLORS = {
  cardBg: "#231433",
  cardSoftBg: "#2b183c",
  accentColor: "#b794f4",
  accentColorStrong: "#c4b5fd",
};
import { useAppSelector } from "../../redux/store/hooks";

export default function ModalRoomRequest({ openRequestModal }) {
  const { request, error } = useAppSelector((store) => store.roomRequest);
  return ReactDOM.createPortal(
    <>
      {openRequestModal && (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            zIndex: 10030,
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(3,1,14,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
          }}
        >
          {/* Карточка модалки */}
          <Box
            sx={{
              backgroundColor: COLORS.cardBg,
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              maxWidth: 420,
              width: "100%",
              position: "relative",
              boxShadow: "0 22px 50px rgba(0,0,0,0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#e5e7eb",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  backgroundColor: COLORS.cardSoftBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.9)",
                }}
              >
                <KeyIcon
                  sx={{ color: COLORS.accentColorStrong, fontSize: 22 }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 0.4,
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              >
                Запрос на доступ к комнате
              </Typography>
            </Box>

            {/* Текст-пояснение  */}
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: "#9ca3af",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              Мы отправим владельцу комнаты запрос на доступ. После одобрения вы
              сможете войти в приватную комнату.
            </Typography>

            {/* Форма с кнопками */}
            <Box
              component="form"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 2.5,
                  py: 0.9,
                  borderColor: "rgba(148,163,184,0.7)",
                  color: "#e5e7eb",
                  fontSize: "0.9rem",
                  "&:hover": {
                    borderColor: COLORS.accentColorStrong,
                    backgroundColor: "rgba(148,163,184,0.12)",
                  },
                }}
              >
                Отмена
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 3,
                  py: 0.9,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                  color: "#0b0615",
                  boxShadow: "0 10px 26px rgba(0,0,0,0.9)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%)",
                    boxShadow: "0 14px 32px rgba(0,0,0,1)",
                    transform: "translateY(-1px)",
                  },
                  transition:
                    "all .2s cubic-bezier(0.3, 1.4, 0.3, 1), transform .2s ease",
                }}
              >
                Отправить запрос
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Snackbar при успешном запросе */}
      {request && <Snackbar></Snackbar>}

      {/* Snackbar при ошибке */}
      {error && <Snackbar></Snackbar>}
    </>,

    document.getElementById("modal-request") || document.body
  );
}
