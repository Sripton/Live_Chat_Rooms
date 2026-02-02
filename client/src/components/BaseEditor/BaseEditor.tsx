import { Box, Button, TextField, Paper, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Slide } from "@mui/material";

type BaseEditorProps = {
  initialValues: string;
  onCancel?: () => void;
  onSubmit: (value: string) => void | Promise<void>;
};
export default function BaseEditor({
  initialValues, // изменить/создать постonCancel
  onCancel, // закрытие формы
  onSubmit, // функция создания поста
}: BaseEditorProps) {
  // при изменении режима экрана
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // состояние ввода данных в форму
  const [value, setValue] = useState(initialValues);

  // синхронизация при смене initialValue (редактирование другого поста)
  useEffect(() => {
    if (initialValues) {
      setValue(initialValues || "");
    }
  }, [initialValues]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    // блокируем поведение браузера
    if (e) e.preventDefault();

    // проверка (внесены ли строки)
    const trimmed = (value || "").trim();
    // если нет закрываем форму
    if (!trimmed) return onCancel?.();

    // создаем пост
    onSubmit(trimmed);
  };


  return (
    <Slide in={true} direction="up" timeout={300}>
      <Paper
        elevation={0}
        component="form"
        onSubmit={submit}
        sx={{
          p: isMobile ? 2 : 2.5,
          borderRadius: "16px",
          background: "rgba(35, 20, 51, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(183, 148, 244, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "rgba(183, 148, 244, 0.3)",
          },
          "&:focus-within": {
            borderColor: "rgba(183, 148, 244, 0.4)",
            boxShadow:
              "0 0 0 4px rgba(183, 148, 244, 0.1), 0 8px 32px rgba(0,0,0,0.3)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
            position: "relative",
          }}
        >
          <TextField
            multiline
            fullWidth
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            placeholder="Напишите ваш пост..."
            sx={{
              flex: 1,
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
                fontFamily: "'Inter', sans-serif",
                color: "#e5e7eb",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: isMobile ? "0.9rem" : "0.95rem",
                "&::placeholder": {
                  color: "rgba(156, 163, 175, 0.6)",
                  opacity: 1,
                },
              },
            }}
          />
          <Button
            type="submit"
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              background: "linear-gradient(135deg, #b794f4 0%, #8b5cf6 100%)",
              color: "#1f2933",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
              transition: "all 0.3s ease",
              minWidth: { xs: "100%", sm: "auto" },
              "&:hover": {
                background: "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)",
                boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "rgba(183,148,244,0.3)",
                color: "rgba(156, 163, 175, 0.5)",
                boxShadow: "none",
              },
            }}
          >
            Отправить
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
}
