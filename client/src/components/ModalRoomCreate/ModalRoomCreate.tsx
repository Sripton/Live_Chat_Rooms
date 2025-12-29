import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Fade,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import ReactDOM from "react-dom";

import CloseIcon from "@mui/icons-material/Close";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LockIcon from "@mui/icons-material/Lock";

import { useAppDispatch } from "../../redux/store/hooks";
import { createRoomsSubmit } from "../../redux/actions/roomActions";
const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
};

type RoomCreate = {
  nameRoom: string;
  isPrivate: boolean;
};

export default function ModalRoomCreate({ open, onClose }) {
  const initialInputs: RoomCreate = {
    nameRoom: "",
    isPrivate: false,
  };
  const [inputs, setInputs] = useState<RoomCreate>(initialInputs);
  const dispatch = useAppDispatch();
  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; // одно текстовое поле
    // предотвращает ввод двух и более пробелов подряд прямо во время ввода
    const cleaned = raw.replace(/[^\S\r\n]{2,}/g, " "); // Любой пробельный символ, кроме \r и \n"
    setInputs((prev) => ({ ...prev, nameRoom: cleaned }));
  };

  const handlePrivateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, isPrivate: e.target.checked }));
  };

  const normalizeSpaces = (str = "", { preserveNewlines = true } = {}) => {
    // защита от нестроковых значений
    if (typeof str !== "string") return str;
    // удаление BOM и тримминг
    let out = str.replace(/^\uFEFF/, "").trim();

    if (preserveNewlines) {
      // Любой пробельный символ, кроме \r и \n"
      out = out.replace(/[^\S\r\n]{2,}/gim, " ");
      // Удаляет пробелы/табы в конце КАЖДОЙ строки
      out = out.replace(/[ \t]+\r?$/gim, "");
    } else {
      // замена любой последовательности пробельных символов на один пробел
      out = out.replace(/\s+/g, " ");
    }
    return out.trim();
  };

  // финальная нормазация при завершении ввода
  const handleNameBlur = () => setInputs((value) => normalizeSpaces(value));

  // функция создания комнаты
  const roomSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nameRoom: normalizeSpaces(inputs.nameRoom),
      isPrivate: !!inputs.isPrivate,
    };
    await dispatch(createRoomsSubmit(payload));
    onClose();
  };

  return ReactDOM.createPortal(
    <Fade in={open}>
      <Box
        sx={{
          zIndex: 10001,
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(3, 1, 14, 0.75)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 2,
        }}
        onClick={onClose}
      >
        {/* Контейнер модалки */}
        <Box
          // чтобы модальное окно не закрывалась на оверлее
          onClick={(e) => e.stopPropagation()}
          sx={{
            minWidth: { xs: "90vw", sm: 380, md: 440 },
            maxWidth: 520,
            width: "100%",
            bgcolor: COLORS.cardBg,
            boxShadow: "0 22px 50px rgba(0,0,0,0.95)",
            p: { xs: 2.5, sm: 3.5 },
            pb: 2.5,
            position: "relative",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#e5e7eb",
          }}
        >
          {/* Кнопка закрытия */}
          <Button
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              p: 0.7,
              color: "#0b0615",
              background:
                "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
              borderRadius: "50%",
              minWidth: 0,
              boxShadow: "0 10px 24px rgba(0,0,0,0.9)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%)",
                boxShadow: "0 14px 32px rgba(0,0,0,1)",
              },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </Button>
          {/* Заголовок */}
          <Typography
            sx={{
              mb: 2,
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: "uppercase",
              color: COLORS.accentColor,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Создать комнату
          </Typography>

          {/* Форма создания комнаты */}
          <form
            onSubmit={roomSubmitHandler}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* Поле "Название комнаты" */}
            <TextField
              name="nameRoom"
              value={inputs.nameRoom}
              onChange={handleRoomChange}
              onBlur={handleNameBlur}
              label="Название комнаты"
              variant="outlined"
              required
              // autoFocus
              fullWidth
              InputLabelProps={{
                sx: {
                  color: COLORS.textMuted,
                  "&.Mui-focused": {
                    color: COLORS.accentColor,
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: "#e5e7eb",
                  fontSize: "0.95rem",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: COLORS.cardBg,
                  border: "1px solid rgba(148,163,184,0.4)",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover": {
                    borderColor: COLORS.accentColor,
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 1px rgba(183,148,244,0.7)",
                  },
                },
                "& .MuiInputBase-input": {
                  paddingY: 1.2,
                  paddingX: 1.5,
                  fontWeight: 500,
                },
              }}
            ></TextField>
            {/* Чекбокс приватности */}
            <Fade in timeout={450}>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isPrivate"
                      checked={inputs.isPrivate}
                      onChange={handlePrivateChange}
                      icon={
                        <MeetingRoomIcon
                          sx={{ color: COLORS.textMuted, fontSize: 22 }}
                        />
                      }
                      checkedIcon={
                        <LockIcon
                          sx={{ color: COLORS.accentColor, fontSize: 22 }}
                        />
                      }
                      sx={{
                        mr: 1,
                        "&.Mui-checked": { color: COLORS.accentColor },
                      }}
                    ></Checkbox>
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: COLORS.textMuted,
                        fontFamily:
                          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      }}
                    >
                      Сделать комнату приватной
                    </Typography>
                  }
                ></FormControlLabel>
              </Box>
            </Fade>
            {/* Кнопка "Создать" */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                  color: "#0b0615",
                  fontWeight: 600,
                  borderRadius: 999,
                  minWidth: 140,
                  px: 3,
                  py: 1.1,
                  boxShadow: "0 10px 26px rgba(0,0,0,0.9)",
                  fontSize: 15,
                  letterSpacing: 0.5,
                  textTransform: "none",
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
                Создать
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Fade>,
    document.getElementById("modal-root") || document.body
  );
}
