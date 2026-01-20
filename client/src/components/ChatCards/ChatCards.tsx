import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Tooltip,
  IconButton,
  Avatar,
  Stack,
} from "@mui/material";

// Иконки
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";

// Colors
const COLORS = {
  accentColor: "#7c3aed",
  accentLight: "#a78bfa",
  dangerColor: "#ef4444",
  bgPrimary: "rgba(17, 24, 39, 0.8)",
  bgSecondary: "rgba(31, 41, 55, 0.6)",
  borderColor: "rgba(107, 114, 128, 0.2)",
  textPrimary: "#f9fafb",
  textSecondary: "#9ca3af",
};

// react hooks
import { useParams } from "react-router-dom";

// redux hoooks
import { useAppSelector, useAppDispatch } from "../../redux/store/hooks";
import { useDispatch } from "react-redux";

// redux thunk
import { getRoomById } from "../../redux/actions/roomActions";

export default function ChatCards() {
  const { id } = useParams(); // id комнаты из useParams
  const dispatch = useAppDispatch();
  // ------------------ Room ------------------
  // Забираем из store  комнату текущую комнату
  const { currentRoom } = useAppSelector((store) => store.room);

  // загружаем комнату при рендере
  useEffect(() => {
    if (id) {
      dispatch(getRoomById(id));
    }
  }, [id, dispatch]);

  // состояние для отображения
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);

  // const handleOpenPostModal = ()  => {

  // }

  console.log("currentRoom", currentRoom);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mt: { xs: 1, sm: 2 },
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Хедер комнаты */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
            p: 2,
            bgcolor: COLORS.bgPrimary,
            borderRadius: 2,
            border: `1px solid ${COLORS.borderColor}`,
          }}
        >
          <Box>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#4f46e5",
                border: `2px solid ${COLORS.accentLight}`,
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: COLORS.textPrimary,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {currentRoom?.nameRoom}
              </Typography>

              {currentRoom?.owner?.username && (
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.textSecondary, fontSize: "0.875rem" }}
                >
                  Владелец:
                  {currentRoom.owner?.username}
                </Typography>
              )}
            </Box>
          </Box>

          <Button
            variant="contained"
            disabled={isPostModalOpen}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: COLORS.accentColor,
              color: "white",
              borderRadius: 2,
              px: 2,
              py: 1,
              fontWeight: 600,
              "&:hover": {
                bgcolor: COLORS.accentLight,
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(124, 58, 237, 0.5)",
              },
            }}
          >
            Добавить пост
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
