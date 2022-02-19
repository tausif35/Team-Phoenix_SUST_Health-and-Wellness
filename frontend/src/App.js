import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import UpdateProfile from "./components/profile/UpdateProfile";
import UpdatePassword from "./components/profile/UpdatePassword";
import AppointmentPage from "./pages/AppointmentPage";
import QueAnsPage from "./pages/QueAnsPage";
import BlogsPage from "./pages/BlogsPage";
import SingleQnAPage from "./pages/SingleQnAPage";
import BlogCreatePage from "./pages/BlogCreatePage";
import SingleBlogPage from "./pages/SingleBlogPage";
import SmartDetectPage from "./pages/SmartDetect";
import PrescriptionDownloadPage from "./pages/PrescriptionDownloadPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/appointments/chat" element={<ChatPage />} />

        <Route path="/q-a" element={<QueAnsPage />} />
        <Route path="/q-a/:questionId" element={<SingleQnAPage />} />

        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:blogId" element={<SingleBlogPage />} />
        <Route path="/blogs/create" element={<BlogCreatePage />} />

        <Route path="/detect" element={<SmartDetectPage />} />

        <Route path="/sign-up" element={<RegisterPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />}>
          <Route path="account" element={<UpdateProfile />} />
          <Route path="change-password" element={<UpdatePassword />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
