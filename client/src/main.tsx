import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ChatRooms from "./components/ChatRooms/ChatRooms.tsx";
import Signup from "./components/Signup/Signup.tsx";
import Signin from "./components/Signin/Signin.tsx";
import UserDashBoard from "./components/UserDashBoard/UserDashBoard.tsx";
import ChatCards from "./components/ChatCards/ChatCards.tsx";
import ProfileEditor from "./components/ProfileEditor/ProfileEditor.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.ts";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <ChatRooms /> },
      { path: "signup", element: <Signup /> },
      { path: "signin", element: <Signin /> },
      { path: "chatcards/:id", element: <ChatCards /> },
      { path: "profile", element: <UserDashBoard /> },
      { path: "profileeditor", element: <ProfileEditor /> },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </StrictMode>,
);
