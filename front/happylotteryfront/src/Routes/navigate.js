import { lazy } from "react";
import { Login } from "../components/Login/Login";
import { Register } from "../components/Register/Register";
import { ForgotPassword } from "../components/ForgotPassword/ForgotPassword";

const Home = lazy(() => import("../components/Home/Home"));
const Profile = lazy(() => import("../components/Profile/Profile"))
const ProfileAdmin = lazy(() => import("../components/ProfileAdmin/ProfileAdmin"))

export const navigation = [
  {
    id: 0,
    path: "/",
    Element: Home,
  },
  {
    id: 1,
    path: "/home",
    Element: Home,
  },
  {
    id: 2,
    path: "/login",
    Element: Login,
  },
  {
    id: 3,
    path: "/register",
    Element: Register,
  },
  {
    id: 4,
    path: "/profile",
    Element: Profile,
  },
  {
    id: 5,
    path: "/forgotPassword",
    Element: ForgotPassword,
  },
  {
    id: 6,
    path: "/profileAdmin",
    Element: ProfileAdmin,
  }
];