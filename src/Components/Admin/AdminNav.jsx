import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { userAction } from "../../Redux/userData-slice";
import React from "react";
export default function AdminNav(props) {
  let userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  function logOut() {
    dispatch(userAction.reset());
    localStorage.clear();
  }

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container fluid>
        <Navbar.Brand>{userData.name}</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end" variant="pills">
          <Nav
            variant="pills"
            className="justify-content-end"
            activeKey={window.location.pathname}
          >
            <Nav.Link href="/Admin/EmployeePortal">Employee</Nav.Link>
            <Nav.Link href="/Admin/ItemsPortal">Canteen Items</Nav.Link>
            <Nav.Link onClick={logOut}>LogOut</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
