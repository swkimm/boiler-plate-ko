import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from './hoc/auth';

function App() {
  // 각 페이지에 대한 Auth HOC 적용 및 옵션 설정
  const AuthLandingPage = Auth(LandingPage, null); // 예: 아무나 접근 가능
  const AuthLoginPage = Auth(LoginPage, false); // 예: 로그인하지 않은 사용자만 접근 가능
  const AuthRegisterPage = Auth(RegisterPage, false); // 예: 로그인하지 않은 사용자만 접근 가능

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<AuthLandingPage />} />
        <Route exact path="/login" element={<AuthLoginPage />} />
        <Route exact path="/register" element={<AuthRegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
