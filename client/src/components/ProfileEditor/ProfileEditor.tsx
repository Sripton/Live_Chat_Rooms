import React, { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
  Paper,
  Slide,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// иконки
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";

// redux hooks
import { useAppSelector, useAppDispatch } from "../../redux/store/hooks";
import { useNavigate } from "react-router-dom";

// redux actions
import { editUserProfile } from "../../redux/actions/userActions";

// Colors - в стиле ChatCards/ChatRooms
const COLORS = {
  mainColor: "#1d102f",
  mainColorLight: "#2a183d",
  cardBg: "#231433",
  accentColor: "#b794f4",
  accentSoft: "rgba(183,148,244,0.15)",
  textMuted: "#9ca3af",
  gradient: "linear-gradient(135deg, #2a183d 0%, #1d102f 100%)",
  dangerColor: "#ef4444",
  accentLight: "#a78bfa",
};

export default function ProfileEditor() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // redux user
  const { username, avatar } = useAppSelector((store) => store.user);

  // состояние для редактирования имени пользователя
  const [editName, setEditName] = useState<string | null>(null);

  // состояние для   превью аватара
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(
    avatar ? `${import.meta.env.VITE_API_URL}${avatar}` : null,
  );

  // выбранный файл
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // фкнкция ?
  const editUserAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null; // берем один файл
    setAvatarFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setEditAvatarPreview(url);
    } else {
      setEditAvatarPreview(null);
    }
  };

  // функция submit
  const editProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (editName?.trim()) formData.append("username", editName.trim());
    if (avatarFile) formData.append("avatar", avatarFile);
    await dispatch(editUserProfile(formData));
  };

  console.log("avatar", avatar);

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
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="sm" sx={{ mt: { xs: 1, sm: 2 } }}>
        <Slide in={true} direction="down" timeout={300}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              p: isMobile ? 3 : 4,
              background: "rgba(35, 20, 51, 0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(183, 148, 244, 0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "rgba(183, 148, 244, 0.3)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            {/* Заголовок */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                background: "linear-gradient(45deg, #e5e7eb, #b794f4)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
                fontSize: isMobile ? "1.1rem" : "1.25rem",
              }}
            >
              Изменение профиля
            </Typography>

            {/* Аватар + превью */}
            <Zoom in={true} timeout={500}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                {editAvatarPreview ? (
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      p: 0.5,
                      background:
                        "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
                      mb: 0.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                      },
                    }}
                  >
                    <img
                      src={editAvatarPreview}
                      onLoad={() => console.log("IMG loaded")}
                      onError={(e) => console.log("IMG error", e)}
                      alt="avatar"
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
                      width: 96,
                      height: 96,
                      background: "rgba(183,148,244,0.1)",
                      border: "2px solid rgba(183,148,244,0.3)",
                      color: "#e5e7eb",
                      mb: 0.5,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 42 }} />
                  </Avatar>
                )}

                {/* Кнопка для загрузки аватара */}
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{
                    textTransform: "none",
                    borderRadius: "14px",
                    fontSize: "0.875rem",
                    px: 2.5,
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
                  Загрузить аватар
                  <input
                    name="avatar"
                    // загружаем новый аватар
                    onChange={editUserAvatar}
                    type="file"
                    hidden
                    accept="image/*"
                  />
                </Button>
              </Box>
            </Zoom>

            {/* Форма */}
            <Box
              component="form"
              onSubmit={editProfileSubmit}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                mt: 1,
              }}
            >
              <TextField
                name="username"
                // редактируем имя пользователя
                onChange={(e) => setEditName(e.target.value)}
                variant="outlined"
                placeholder="Имя"
                defaultValue={username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{ color: COLORS.textMuted, fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: "rgba(183, 148, 244, 0.1)",
                    },
                    "&:hover": {
                      background: "rgba(255,255,255,0.04)",
                      "& fieldset": {
                        borderColor: "rgba(183, 148, 244, 0.3)",
                      },
                    },
                    "&.Mui-focused": {
                      background: "rgba(255,255,255,0.05)",
                      "& fieldset": {
                        borderColor: "rgba(183, 148, 244, 0.5)",
                        borderWidth: 2,
                      },
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#e5e7eb",
                    fontSize: isMobile ? "0.9rem" : "0.95rem",
                    fontFamily: "'Inter', sans-serif",
                    paddingY: 1.3,
                    paddingX: 1.5,
                    "&::placeholder": {
                      color: "rgba(156, 163, 175, 0.6)",
                      opacity: 1,
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "14px",
                  py: 1.2,
                  background:
                    "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
                  color: "#1f2933",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                  },
                }}
              >
                Сохранить изменения
              </Button>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
}
