import React, { useMemo, useState } from "react";
import { Divider, Typography, Box, Stack } from "@mui/material";

// redux commenttypes
import type { Comment } from "../../redux/types/commentTypes";

// redux posttypes
import type { Post } from "../../redux/types/postTypes";

// Компонент CommentEditor для отображения формы создания/изменения комментария
import CommentEditor from "../CommentEditor";

// компонент CommentNode  для рекурсивного отображения комментариев
import CommentNode from "../CommentNode";

// функция удаления комментария (redux actions)
import { deleteCommentActions } from "../../redux/actions/commentActions";

import { useAppDispatch } from "../../redux/store/hooks";

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

// Тип для дерева
// CommentTree наследует все свойства Comment
// Добавляет свойство replies - массив таких же CommentTree
type CommentTree = Comment & { replies: CommentTree[] };

export default function CommentsCard({
  comments,
  expandedComment,
  toggleExpanded,
  post,
  userId,
}: CommentsCardProps) {
  // Если пока нет комментариев
  const isEmpty = !Array.isArray(comments) || comments.length === 0;

  const dispatch = useAppDispatch();

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

  // функуция для древовидного хранения коммнетриев
  function buildTreeComments(comments: Comment[]): CommentTree[] {
    const map = new Map<string, CommentTree>();
    const roots: CommentTree[] = [];

    for (const c of comments) map.set(c.id, { ...c, replies: [] });

    for (const c of comments) {
      const node = map.get(c.id)!;

      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) parent.replies.push(node);
        else roots.push(node); // защита от битых данных
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  // древовидная структура комментариев
  const tree = buildTreeComments(comments);

  // Для вычсиления рордителя комментария. Для UI понять на какой комментарий был дан ответ
  const commentMap = useMemo(() => {
    const map = new Map<string, Comment>();
    for (const comment of comments) map.set(comment.id, comment);
    return map;
  }, [comments]);

  // ------------------------ Рендер CommentEditor ---------------------
  // если открыт editor — скрываем все комментарии и показываем только форму
  if (editor) {
    return (
      <Box sx={{ p: 1 }}>
        <Box sx={{ mt: 1.5 }}>
          <CommentEditor
            postId={post.id}
            editComment={editor.mode === "edit" ? editor.editComment : null}
            parentId={editor.mode === "create" ? editor.parentId : null}
            onCancel={closeEditor}
          />
        </Box>
      </Box>
    );
  }

  // ------------------------ Рендер Списка комментариев ---------------------
  // иначе — обычный рендер списка
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
          {tree.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              expandedComment={expandedComment}
              toggleExpanded={toggleExpanded}
              post={post}
              userId={userId}
              dispatch={dispatch}
              editor={editor}
              openReply={openReply}
              openEdit={openEdit}
              closeEditor={closeEditor}
              deleteCommentActions={deleteCommentActions}
              commentMap={commentMap}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
