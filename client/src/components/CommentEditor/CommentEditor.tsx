import React from "react";
import BaseEditor from "../BaseEditor/BaseEditor";

// commentTypes
import type { Comment } from "../../redux/types/commentTypes";

// commentActions
import {
  createCommentActions,
  editCommentActions,
} from "../../redux/actions/commentActions";

// store/hooks
import { useAppDispatch } from "../../redux/store/hooks";

// тип для пропсов CommentEditor
type CommentEditorProps = {
  postId: string;
  editComment: Comment | null;
  parentId: string | null;
  onCancel: () => void;
};
export default function CommentEditor({
  postId,
  editComment,
  parentId,
  onCancel,
}: CommentEditorProps) {
  const dispatch = useAppDispatch();
  console.log("editComment", editComment);
  return (
    <BaseEditor
      initialValues={editComment?.commentTitle ?? ""}
      onSubmit={async (value: string) => {
        if (editComment) {
          // РЕДАКТИРОВАНИЕ
          dispatch(editCommentActions(editComment.id, value));
        } else {
          // СОЗДАНИЕ
          dispatch(
            createCommentActions(postId, {
              commentTitle: value,
              parentId: parentId,
            }),
          );
        }

        onCancel();
      }}
    />
  );
}
