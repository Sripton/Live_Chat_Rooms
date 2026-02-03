import React from "react";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Box,
  Stack,
} from "@mui/material";

// Иконки MUI
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

// redux types
import type { Comment } from "../../redux/types/commentTypes";

const COLORS = {
  accent: "#7a1a50", // бордовый
  accentSoft: "rgba(161,19,74,0.08)",
  cardBg: "rgba(255, 238, 244, 0.85)", // светло-розово-бордовый фон
  accentLight: "#a78bfa",
};

//  тип для CommentsCard пропсов
type CommentsCardProps = {
  comments: Comment[];
  expandedComment: Set<string>;
  toggleExpanded: (type: string, ids: string) => void;
};

export default function CommentsCard({
  comments,
  expandedComment,
  toggleExpanded,
}: CommentsCardProps) {
  console.log("comments", comments);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: COLORS.cardBg,
        border: `1px solid ${COLORS.accentSoft}`,
        boxShadow:
          "0 10px 30px rgba(161,19,74,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        overflow: "hidden",
      }}
    >
      {comments.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ color: "rgba(122,26,80,0.6)", fontStyle: "italic" }}
        >
          Пока нет комментариев.
        </Typography>
      ) : (
        // Stack ->  каждый комментарий
        <Stack
          divider={<Divider sx={{ borderColor: COLORS.accentSoft }} />}
          spacing={1.5}
        >
          {comments.map((comment) => {
            const name = comment?.user?.username; // имя пользователя  написавшего комментарий
            const avatarUrl = comment?.user?.avatar; //  аватар пользователя
            const dataCreate = new Date(comment.createdAt).toLocaleString(); // дата и время создания
            const isExpandedComment = expandedComment.has(comment.id);
            return (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.25,
                  // Подсчетка по parent_id
                  outlineOffset: 2,
                  borderRadius: 2,
                  transition:
                    "outline-color .2s ease, box-shadow .2s ease, background .2s ease",
                  boxShadow: "0 0 0 4px rgba(161,19,74,0.15)",
                  background: "rgba(161,19,74,0.06)",
                  // на какой комментарий был дан ответ
                  // boxShadow:
                  //   comment.id === COLORS.highlightId
                  //     ? "0 0 0 4px rgba(161,19,74,0.15)"
                  //     : "none",
                  // background:
                  //   comment.id === COLORS.highlightId
                  //     ? "rgba(161,19,74,0.06)"
                  //     : "transparent",
                }}
              >
                {/* Отображение аватара пользователя */}
                {!avatarUrl ? (
                  <Avatar />
                ) : (
                  <Avatar
                    // src={`${process.env.REACT_APP_BASEURL}${avatarUrl}`}
                    // alt={name}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: avatarUrl ? undefined : "rgba(161,19,74,0.15)",
                      color: COLORS.accent,
                      border: `1px solid ${COLORS.accentSoft}`,
                      fontWeight: 700,
                    }}
                  />
                )}

                {/* Основной кард: комментарий и реакции  */}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box
                  // sx={{ display: "flex", alignItems: "baseline", gap: 1 }}
                  >
                    {/* Владелец комментрия */}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: COLORS.accent,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        maxWidth: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={name}
                    >
                      {name}
                    </Typography>

                    {/* Когда был создан */}
                    {dataCreate && (
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(122,26,80,0.65)" }}
                      >
                        {dataCreate}
                      </Typography>
                    )}

                    {/* Сам комментарий */}
                    <Typography>
                      {(() => {
                        const fullComment = comment?.commentTitle;
                        const isLongComment = fullComment?.length > 150;

                        if (!isLongComment) {
                          return <span>{comment.commentTitle}</span>;
                        }
                        return (
                          <>
                            <span>
                              {isExpandedComment
                                ? fullComment
                                : `${fullComment.slice(0, 50)}...`}
                            </span>
                            <Button
                              size="small"
                              onClick={() =>
                                toggleExpanded("comment", comment.id)
                              }
                              sx={{
                                ml: 0.5,
                                minWidth: "auto",
                                p: 0,
                                color: COLORS.accentLight,
                                fontSize: "0.85rem",
                                fontWeight: 500,
                                textTransform: "none",
                              }}
                            >
                              {isExpandedComment ? "Свернуть" : "Читать далее"}
                            </Button>
                          </>
                        );
                      })()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}
