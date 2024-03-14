import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Col, Row, Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userAction } from "../../Redux/userData-slice";
import { useSelector, useDispatch } from "react-redux";

export default function Login() {
  const [empid, setEmpid] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  let navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(userData);
    if (userData.name) {
      if (userData.type === "Employee") {
        navigate("/Employee");
      } else if (userData.userType === "Admin") {
        navigate("/Admin");
      }
    }
  }, []);

  useEffect(() => {
    console.log(userData);
    if (userData.name) {
      if (userData.type === "Admin") {
        navigate("/Admin/EmployeePortal");
      } else if (userData.type === "Employee") {
        navigate("/Employee");
      }
    }
  }, [userData.token]);

  const login = async (e) => {
    e.preventDefault();
    console.log("loclastorage", localStorage.getItem("Token"));
    console.log(empid, password);

    await axios
      .get(
        "http://localhost:5000/users?" + "id=" + empid + "&password=" + password
      )
      .then((userres) => {
        console.log(userres);
        if (userres.data.length) {
          let payload = {};
          if (userres.data[0].type === "Admin") {
            payload = {
              id: userres.data[0].id,
              name: userres.data[0].name,

              type: userres.data[0].type,
              amount: 0,
              transactions: {},
            };
            dispatch(userAction.setUser(payload));

            navigate("/Admin/EmployeePortal");
          } else if (userres.data[0].type === "Employee") {
            payload = {
              id: userres.data[0].id,
              name: userres.data[0].name,

              type: userres.data[0].type,
              amount: userres.data[0].amount,
              transactions: userres.data[0].transactions,
            };
            dispatch(userAction.setUser(payload));

            navigate("/Employee");
          }
        } else setErr("Invalid Employee Id or Password");
      })
      .catch((err) =>
        setErr(`${err.message}. Please try again after some time.`)
      );
  };
  return (
    <Container fluid className="login-page p-4">
      <Row className="justify-content-center m-4">
        <Col xs={10} sm={8} md={6} className="col">
          <Row className="align-items-center" style={{ height: "100vh" }}>
            <Form className="p-4" onSubmit={login}>
              <h3 className="login-title">LOGIN</h3>
              {err && <p style={{ color: "red" }}>{err}</p>}
              <Form.Control
                type="number"
                placeholder="Employee Id"
                className="mb-3 mt-2"
                value={empid}
                onChange={(e) => setEmpid(e.target.value)}
                required
              />

              <Form.Control
                type="password"
                placeholder="Password"
                className="mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />

              <Button
                size="lg"
                type="submit"
                className="login-btn"
                disabled={!empid || !password.length}
              >
                Login
              </Button>
            </Form>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
