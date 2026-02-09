import React, { useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
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

// redux commenttypes
import type { Comment } from "../../redux/types/commentTypes";

// redux posttypes
import type { Post } from "../../redux/types/postTypes";

// компонент CommentEditor  для кнопок  ответить/редактировать комментарии
import CommentEditor from "../CommentEditor/CommentEditor";

// Цветовая палитра в стиле PostCard / ChatCards
const COLORS = {
  accentColor: "#b794f4",
  accentLight: "#a78bfa",
  dangerColor: "#ef4444",
  bgSecondary: "rgba(35, 20, 51, 0.7)",
  borderColor: "rgba(255, 255, 255, 0.08)",
  textPrimary: "#e5e7eb",
  textSecondary: "#9ca3af",
};

//  тип для CommentsCard пропсов
type CommentsCardProps = {
  comments: Comment[];
  expandedComment: Set<string>;
  toggleExpanded: (type: "post" | "comment", ids: string) => void;
  post: Post;
  userId: string | null;
};

// данные для backend
type EditorState = {
  mode: "create" | "edit";
  anchorCommentId: string | null; // где показать редактор
  parentId: string | null; // что отправить в backend
  editComment: Comment | null; // что редактируем
};

export default function CommentsCard({
  comments,
  expandedComment,
  toggleExpanded,
  post,
  userId,
}: CommentsCardProps) {
  // Если пока нет комментариев
  const isEmpty = !Array.isArray(comments) || comments.length === 0;

  // Состояние для ответа на коммнетрий/редактирования комментария
  const [editor, setEditor] = useState<EditorState | null>(null);

  // Ответить на конкретный комментарий
  const openReply = (comment: Comment) => {
    setEditor({
      mode: "create",
      anchorCommentId: comment.id,
      parentId: comment.id,
      editComment: null,
    });
  };

  // Редактировать конкретный комментарий
  const openEdit = (comment: Comment) => {
    setEditor({
      mode: "edit",
      anchorCommentId: comment.id,
      parentId: null,
      editComment: comment,
    });
  };

  // Закрытие формы
  const closeEditor = () => setEditor(null);

  return (
    <Box sx={{ p: 1 }}>
      {isEmpty ? (
        <Typography
          variant="body2"
          sx={{
            color: COLORS.textSecondary,
            fontStyle: "italic",
            fontFamily: "'Inter', sans-serif",
            textAlign: "center",
            py: 1,
          }}
        >
          Пока нет комментариев.
        </Typography>
      ) : (
        // Stack ->  каждый комментарий
        <Stack
          divider={<Divider sx={{ bgcolor: COLORS.borderColor }} />}
          spacing={1.5}
        >
          {comments.map((comment) => {
            const name = comment?.user?.username; // имя пользователя  написавшего комментарий
            const avatarUrl = comment?.user?.avatar; //  аватар пользователя
            const dataCreate = new Date(comment.createdAt).toLocaleString(); // дата и время создания
            const isExpandedComment = expandedComment.has(comment.id); // развернуть/свернуть комментарий
            const isAuthor = comment?.user?.username ?? "Пользователь";

            return (
              <Box
                key={comment.id}
                sx={{
                  display: "flex",
                  gap: 1.25,
                  p: 1.5,
                  borderRadius: "16px",
                  background: "rgba(35, 20, 51, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${COLORS.borderColor}`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3px",
                    background: "linear-gradient(180deg, #b794f4, transparent)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    transform: "translateX(4px)",
                    background: "rgba(183,148,244,0.08)",
                    borderColor: "rgba(183,148,244,0.3)",
                    boxShadow: "0 4px 20px rgba(183,148,244,0.15)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                  transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                }}
              >
                {/* Отображение аватара пользователя */}
                {!avatarUrl ? (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background: "rgba(183,148,244,0.1)",
                      border: "1px solid rgba(183,148,244,0.2)",
                    }}
                  />
                ) : (
                  <Avatar
                    // src={`${process.env.REACT_APP_BASEURL}${avatarUrl}`}
                    // alt={name}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: avatarUrl ? undefined : COLORS.accentColor,
                      border: `1px solid ${COLORS.accentLight}`,
                      color: COLORS.textPrimary,
                    }}
                  />
                )}

                {/* Основной кард: комментарий и реакции  */}
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Шапка: автор + дата (всегда сверху) */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Владелец комментария */}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: COLORS.textPrimary,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {name}
                    </Typography>

                    {/* Когда был создан */}
                    {dataCreate && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: COLORS.textSecondary,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {dataCreate}
                      </Typography>
                    )}
                  </Box>

                  {/* Текст комментария (всегда под шапкой) */}
                  <Typography
                    sx={{
                      mt: 0.75,
                      color: COLORS.textPrimary,
                      lineHeight: 1.6,
                      fontSize: "0.9rem",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
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
                              : `${fullComment.slice(0, 50)}`}
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
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {isExpandedComment ? "Свернуть" : "Читать далее"}
                          </Button>
                        </>
                      );
                    })()}
                  </Typography>

                  {/* Реакции (всегда снизу) */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                      mt: 1.25,
                      pt: 1,
                      borderTop: `1px solid ${COLORS.borderColor}`,
                    }}
                  >
                    {/* like */}
                    <Button
                      size="small"
                      startIcon={<ThumbUpIcon />}
                      sx={{
                        color: COLORS.textSecondary,
                        minWidth: "auto",
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.8rem",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontFamily: "'Inter', sans-serif",
                        background: "rgba(255,255,255,0.02)",
                        "&:hover": {
                          background: "rgba(183,148,244,0.1)",
                          color: COLORS.accentColor,
                        },
                        "& .MuiButton-startIcon": { mr: 0.5 },
                      }}
                    >
                      0
                    </Button>

                    {/* dislike */}
                    <Button
                      size="small"
                      startIcon={<ThumbDownIcon />}
                      sx={{
                        color: COLORS.textSecondary,
                        minWidth: "auto",
                        px: 1.5,
                        py: 0.5,
                        fontSize: "0.8rem",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontFamily: "'Inter', sans-serif",
                        background: "rgba(255,255,255,0.02)",
                        "&:hover": {
                          background: "rgba(239,68,68,0.1)",
                          color: COLORS.dangerColor,
                        },
                        "& .MuiButton-startIcon": { mr: 0.5 },
                      }}
                    >
                      0
                    </Button>

                    {comment?.parentId === null ? (
                      <Typography
                        variant="caption"
                        sx={{
                          color: COLORS.textSecondary,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                        }}
                      >
                        {`${isAuthor} ответил  ${post?.user?.username}`}
                      </Typography>
                    ) : (
                      ""
                    )}
                    {userId !== comment.userId ? (
                      <Box sx={{ ml: "auto" }}>
                        <Tooltip title="Ответить">
                          <Button
                            size="small"
                            startIcon={<SendIcon />}
                            onClick={() => openReply(comment)}
                            sx={{
                              color: COLORS.accentColor,
                              minWidth: "auto",
                              px: 1.5,
                              py: 0.5,
                              fontSize: "0.8rem",
                              borderRadius: "10px",
                              textTransform: "none",
                              fontFamily: "'Inter', sans-serif",
                              background: "rgba(183,148,244,0.1)",
                              "&:hover": {
                                background: "rgba(183,148,244,0.2)",
                                transform: "translateY(-1px)",
                              },
                              "& .MuiButton-startIcon": { mr: 0.5 },
                            }}
                          >
                            Ответить
                          </Button>
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          ml: "auto",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Редактировать">
                          <IconButton
                            size="small"
                            onClick={() => openEdit(comment)}
                            sx={{
                              color: COLORS.accentColor,
                              background: "rgba(183,148,244,0.1)",
                              "&:hover": {
                                background: "rgba(183,148,244,0.2)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Удалить">
                          <IconButton
                            size="small"
                            sx={{
                              color: COLORS.dangerColor,
                              background: "rgba(239,68,68,0.1)",
                              "&:hover": {
                                background: "rgba(239,68,68,0.2)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                  {editor?.anchorCommentId === comment.id && (
                    <Box sx={{ mt: 1.5 }}>
                      <CommentEditor
                        postId={post.id}
                        editComment={
                          editor.mode === "edit" ? editor.editComment : null
                        }
                        parentId={
                          editor.mode === "create" ? editor.parentId : null
                        }
                        onCancel={closeEditor}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
