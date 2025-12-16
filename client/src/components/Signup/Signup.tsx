import React, { useCallback, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Collapse,
  Alert,
  TextField,
  InputAdornment,
  Button,
  Link,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";

import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import { registersUser } from "../../redux/actions/userActions";
const COLORS = {
  cardBg: "#231433",
  accentColor: "#b794f4",
  textMuted: "#9ca3af",
} as const; // as count - объект полностью неизменяем

type RegisterInputs = {
  login: string;
  password: string;
  username?: string;
  avatar?: string | null;
};

export default function Signup() {
  // --------------------------------------------------------------------------------------
  // Состояние формы и загрузки
  const [inputs, setInputs] = useState<RegisterInputs>({
    login: "",
    password: "",
    username: "",
    avatar: null,
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useAppSelector((store) => store.user);

  const inputsUsersHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputs((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const signupSubmitHandler = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const response = await dispatch(registersUser(inputs));
      if (response) {
        navigate("/");
      }
    },
    [dispatch, inputs, navigate]
  );
  console.log("userName", userName);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 800px at 0% -20%, #3b1d5e 0%, transparent 60%), radial-gradient(1100px 700px at 110% 0%, #4c1d95 0%, transparent 55%), linear-gradient(135deg, #0b0615 0%, #1d102f 45%, #0f172a 100%)",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            backgroundColor: COLORS.cardBg,
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 18px 40px rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          {/* Заголовок */}
          <Typography
            sx={{
              fontSize: "1.3rem",
              textAlign: "center",
              marginBottom: 1,
              letterSpacing: 2,
              color: COLORS.accentColor,
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            Вход
          </Typography>

          {/* Форма */}
          <Box
            component="form"
            onSubmit={signupSubmitHandler}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            {/* Логин */}
            <TextField
              name="login"
              value={inputs.login || ""}
              onChange={inputsUsersHandler}
              variant="outlined"
              placeholder="Введите логин"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOpenIcon
                      sx={{ color: COLORS.textMuted, fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  color: "#e5e7eb",
                  fontSize: "0.95rem",
                },
              }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  backgroundColor: "#1f112f",
                  border: "1px solid rgba(148,163,184,0.35)",
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
                  paddingY: 1.3,
                  paddingX: 1.5,
                },
              }}
            />

            {/* Пароль */}
            <TextField
              name="password"
              value={inputs.password || ""}
              onChange={inputsUsersHandler}
              type="password"
              variant="outlined"
              placeholder="Введите пароль"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon sx={{ color: COLORS.textMuted, fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  color: "#e5e7eb",
                  fontSize: "0.95rem",
                },
              }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  backgroundColor: "#1f112f",
                  border: "1px solid rgba(148,163,184,0.35)",
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
                  paddingY: 1.3,
                  paddingX: 1.5,
                },
              }}
            />

            <TextField
              name="username"
              value={inputs.username || ""}
              onChange={inputsUsersHandler}
              variant="outlined"
              placeholder="Введите имя"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon
                      sx={{ color: COLORS.textMuted, fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  color: "#e5e7eb",
                  fontSize: "0.95rem",
                },
              }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  backgroundColor: "#1f112f",
                  border: "1px solid rgba(148,163,184,0.35)",
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
                  paddingY: 1.3,
                  paddingX: 1.5,
                },
              }}
            />
            {/* Кнопка входа */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 999,
                py: 1.2,
                background:
                  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)",
                color: "#0b0615",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.9)",
                },
              }}
            >
              Войти
            </Button>
          </Box>

          {/* Ссылка «Зарегистрироваться» */}
          <Link
            component={NavLink}
            to="/signup"
            sx={{
              textDecoration: "none",
              textTransform: "uppercase",
              marginTop: 1,
              fontSize: "0.8rem",
              letterSpacing: 1,
              color: COLORS.textMuted,
              "&:hover": {
                color: COLORS.accentColor,
              },
            }}
          >
            Зарегистрироваться
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
