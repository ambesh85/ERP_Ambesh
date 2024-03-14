import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import AdminNav from "./AdminNav";
import { useSelector } from "react-redux";
export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("Login"));
  const navigate = useNavigate();
  let userData = useSelector((state) => state.user);
  useEffect(() => {
    if (!userData.name) {
      navigate("/");
    } else if (userData.type === "Employee") {
      navigate("/Employee");
    }
  }, []);

  useEffect(() => {
    if (!userData.name) {
      navigate("/");
    } else if (userData.type === "Employee") {
      navigate("/Employee");
    }
  }, [userData]);

  return (
    <Container fluid id="AdminCont">
      <AdminNav setToken={setToken} token={token} />
      <h1
        style={{
          backgroundColor: "lightblue",
          padding: "10px",
          color: "grey",
        }}
      >
        Welcome to Admin Page
      </h1>
      <Outlet />
    </Container>
  );
}
