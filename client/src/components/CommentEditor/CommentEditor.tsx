import React from "react";
import BaseEditor from "../BaseEditor/BaseEditor";

// commentTypes
import type { Comment, CreateCommentDTO } from "../../redux/types/commentTypes";

// commentActions
import { createComment } from "../../redux/actions/commentActions";

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
  return (
    <BaseEditor
      initialValues={editComment?.commentTitle ?? ""}
      onSubmit={async (value: string) => {
        const dtoComment: CreateCommentDTO = {
          commentTitle: value,
          parentId,
        };
        dispatch(createComment(postId, dtoComment));
        onCancel();
      }}
    />
  );
}
