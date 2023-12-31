import React, { useEffect } from "react";
import { Layout } from "antd";
import SideMenu from "../partials/SideMenu";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Components from "../pages/Components";
import ComponentCategories from "../pages/ComponentCategories";
import LearningNodes from "../pages/LearningNodes";
import RefImages from "../pages/RefImages";
import RefImagesCategories from "../pages/RefImagesCategories";
import Users from "../pages/Users";
import SiteSettings from "../pages/SiteSettings";

const { Content } = Layout;

const Dashboard = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");

  // If not logged in, redirect to login page
  useEffect(() => {
    // Define the effect to monitor changes in localStorage
    const handleStorageChange = () => {
      const updatedIsLogged = window.localStorage.getItem("LoggedIn");
      if (!updatedIsLogged) {
        // If not logged in, redirect to login page
        window.location.href = "/login";
      }
    };

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [500]);

  if (isLogged == "false") {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SideMenu />
      <Layout>
        <Content style={{ padding: "50px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/components" element={<Components />} />
            <Route path="/componentCategories" element={<ComponentCategories />} />
            <Route path="/learningNodes" element={<LearningNodes />} /> 
            <Route path="/refImages" element={<RefImages />} /> 
            <Route path="/refImagesCategories" element={<RefImagesCategories />} /> 
            <Route path="/users" element={<Users />} /> 
            <Route path="/siteSettings" element={<SiteSettings />} /> 
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
