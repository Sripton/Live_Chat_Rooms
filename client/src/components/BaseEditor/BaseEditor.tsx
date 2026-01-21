import { Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

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

  const [value, setValue] = useState(initialValues);
  useEffect(() => {
    if (initialValues) {
      setValue(initialValues || "");
    }
  }, [initialValues]);

  const submit = (e) => {
    if (e) e.preventDefault();

    const trimmed = (value || "").trim();
    if (!trimmed) return onCancel?.();
    onSubmit(trimmed);
  };

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        display: "flex",
        gap: 2,
        mt: 1,
        alignItems: "center",
        position: "relative",
      }}
    >
      <TextField
        multiline
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{
          width: "clamp(280px, 70vw, 720px)",

          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            background: "rgba(255, 240, 244, 0.6)",
            "& fieldset": { borderColor: "rgba(194, 24, 91, 0.3)" },
            "&:hover fieldset": { borderColor: "rgba(194, 24, 91, 0.6)" },
            "&.Mui-focused fieldset": {
              borderColor: "#ad1457",
              borderWidth: 2,
            },
          },
          "& .MuiInputBase-input": {
            fontFamily: "'JetBrains Mono', monospace",
            color: "#7a1a50",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          },
        }}
      />
      <Button
        type="submit"
        sx={{
          px: 2.5,
          borderRadius: 3,
          fontWeight: 700,
          background:
            "linear-gradient(180deg,rgb(165, 241, 161),rgb(143, 178, 145))",
          boxShadow: "0 4px 12px rgba(173,20,87,0.35)",
          textTransform: "none",
          transition: "all .25s ease",
          color: "#fff",
          "&:hover": {
            background:
              "linear-gradient(180deg,rgb(26, 84, 50),rgb(21, 109, 54))",
            boxShadow: "0 6px 18px rgba(136,14,79,0.4)",
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            background: "rgba(194, 24, 91, 0.2)",
            color: "rgba(194, 24, 91, 0.5)",
          },
        }}
      >
        Отправить
      </Button>
    </Box>
  );
}
