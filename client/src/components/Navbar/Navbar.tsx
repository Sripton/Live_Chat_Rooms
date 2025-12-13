import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import "./navbar.css";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";

const COLORS = {
  main: "#1d102f",
  mainLight: "#3a214f",
  accent: "#b794f4",
  text: "#f5f5f5",
  textLight: "#e5e7eb",
} as const; // as count - объект полностью неизменяем

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<boolean>(false); // явная типизация

  const menuItems: string[] = ["Главная", "Мой профиль", "Войти", "Выход"];

  const getStartIcon = (menu: string) => {
    switch (menu) {
      case "Главная":
        return <HomeRoundedIcon />;
      case "Мой профиль":
        return <AccountBoxIcon />;
      case "Выход":
        return <LogoutIcon />;
      case "Войти":
        return <AppRegistrationRoundedIcon />;
      default:
        return;
    }
  };
  return (
    <>
      <CssBaseline />
      {/* Верхняя панель навигации */}
      <Container
        maxWidth={false} // контейнер растягивается на всю доступную ширину своего родителя
        disableGutters // убирает внутренние горизонтальные отступы (padding) у контейнера.
      >
        <Box
          sx={{
            background: COLORS.main,
            width: "100%",
            height: "64px",
            zIndex: 1201,
            position: "fixed",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
          }}
        >
          {/* Иконка-гамбургер */}
          <div
            className={`menu-icon ${openMenu ? "iconActive" : ""}`}
            onClick={() => setOpenMenu((prev) => !prev)}
          >
            <span />
          </div>

          {/* Блок с именем пользователя и аватаром */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              ml: "auto",
            }}
          >
            <Typography
              sx={{
                color: "#f5f5f5",
                fontFamily: "monospace",
                fontSize: "0.95rem",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                maxWidth: "220px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "right",
              }}
            >
              userName
            </Typography>
            <Avatar />
          </Box>
        </Box>
        {/* Боковая панель меню */}
        <Drawer
          anchor="left"
          open={openMenu}
          onClose={() => setOpenMenu((prev) => !prev)}
          PaperProps={{
            sx: {
              backgroundColor: COLORS.main,
              color: "#e5e7eb",
              width: 280,
              pt: 8,
              px: 2,
              borderRight: "1px solid rgba(255,255,255,0.06)",
            },
          }}
        >
          <List sx={{ mt: 1 }}>
            {menuItems.map((menu) => {
              return (
                <ListItem key={menu}>
                  <Button
                    startIcon={getStartIcon(menu)}
                    sx={{
                      fontSize: "0.95rem",
                      fontFamily: "monospace",
                      textTransform: "uppercase",
                      justifyContent: "flex-start",
                      width: "100%",
                      borderRadius: "10px",
                      px: 1.5,
                      py: 1,
                      color: "#e5e7eb",
                      backgroundColor: "transparent",
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.2rem",
                      },
                      "&:hover": {
                        backgroundColor: COLORS.mainLight,
                        color: COLORS.accent,
                      },
                    }}
                  >
                    {menu}
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      </Container>
    </>
  );
}
