import { Navbar, Nav, Container, Button } from "react-bootstrap";
import React from "react";
import { Wallet2, CashCoin } from "react-bootstrap-icons";
import { userAction } from "../../Redux/userData-slice";
import { useSelector, useDispatch } from "react-redux";
export default function EmployeeNav(props) {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  const logOut = () => {
    dispatch(userAction.reset());
    localStorage.clear("persist:root");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container fluid>
        <Navbar.Brand>{userData.name}</Navbar.Brand>
        <div
          style={{
            backgroundColor: "lightblue",
            color: "#7393B3",
            padding: "5px",
            border: "2px solid #7393B3",
            borderRadius: "5px",
          }}
        >
          Balance :{" "}
          <span style={{ color: "green", fontWeight: "bolder" }}>
            {userData.amount} &#8377;
          </span>
        </div>
        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end" variant="pills">
          <Nav
            variant="pills"
            className="justify-content-end"
            activeKey={window.location.pathname}
          >
            <Nav.Link onClick={props.openAddMoneyModal}>Add Money</Nav.Link>
            <Nav.Link onClick={props.openMakeMoneyModal}>
              Make Purchase
            </Nav.Link>
            <Nav.Link onClick={logOut}>LogOut</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <h4></h4>
      </Container>
    </Navbar>
  );
}
