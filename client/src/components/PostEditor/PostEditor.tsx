import React from "react";
import BaseEditor from "../BaseEditor/BaseEditor";
import { createPostSubmit } from "../../redux/actions/postActions";
import { useAppDispatch } from "../../redux/store/hooks";

// тип для переключения создать/изменить пост
type PostEditorMode = "create" | "edit";

// тип для пропсов PostEditor
type PostEditorProps = {
  setIsPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: PostEditorMode;
  postEditor: { postTitle?: string } | null;
  roomId: string;
  onCancel: () => void;
};

export default function PostEditor({
  setIsPostModalOpen,
  mode, // пропс для переключения создать/изменить пост
  postEditor, //  изменение поста
  roomId, // id текущей комнаты
  onCancel, // закрытие формы
}: PostEditorProps) {
  const dispatch = useAppDispatch();
  return (
    <BaseEditor
      initialValues={mode === "edit" ? (postEditor?.postTitle ?? "") : ""} // изменить/создать пост
      // функция создания поста
      onSubmit={async (value: string) => {
        dispatch(createPostSubmit(roomId, { postTitle: value }));
        setIsPostModalOpen(false);
      }}
      onCancel={onCancel} // закрытие формы
    />
  );
}
