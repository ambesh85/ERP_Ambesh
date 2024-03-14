import { useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import React from "react";
import axios from "axios";
import { Modal, Button, Row, CloseButton, Stack } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  ListGroup,
  Badge,
  Col,
  Table,
  Tabs,
  Tab,
} from "react-bootstrap";
import EmployeeNav from "./EmployeeNav";
import { Stars, EmojiSmileFill } from "react-bootstrap-icons";
import { userAction } from "../../Redux/userData-slice";
export default function Employee() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showAddMoneyModal, setShowAddMoneyModal] = useState();
  const [increAmount, setIncreAmount] = useState("");
  const [increAmountErr, setIncreAmountErr] = useState("");
  //const [showItemsOfTheDay, setShowItemsOfTheDay] = useState(false);
  const [itemsOfTheDay, setItemsOfTheDay] = useState([]);
  //const [showTotalItems, setShowTotalItems] = useState(false);
  const [totalItems, setTotalItems] = useState([]);
  //const [showTransactions, setShowTransactions] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showMakePurchaseModal, setShowMakePurchaseModal] = useState(false);
  const [decreAmount, setDecreAmount] = useState(0);
  const [decreAmountErr, setDecreAmountErr] = useState("");
  const [key, setKey] = useState("transactions");

  useEffect(() => {
    if (!userData.name) {
      navigate("/");
    } else if (userData.name) {
      if (userData.type === "Admin") {
        navigate("/Admin/EmployeePortal");
      } else if (userData.type === "Employee") {
        getItemsOfTheDay();
        getTransactions();
        getItems();
      }
    }
  }, []);

  useEffect(() => {
    if (!userData.name) {
      navigate("/");
    } else if (userData.name) {
      if (userData.type === "Admin") {
        navigate("/Admin/EmployeePortal");
      } else if (userData.type === "Employee") {
        getItemsOfTheDay();
        getTransactions();
        getItems();
      }
    }
  }, [userData]);

  // useEffect(() => {
  //   if (showItemsOfTheDay) {
  //     getItemsOfTheDay();
  //   }
  // }, [showItemsOfTheDay]);

  // useEffect(() => {
  //   if (showTransactions) {
  //     getTransactions();
  //   }
  // }, [showTransactions]);

  // useEffect(() => {
  //   getItems();
  // }, [showTotalItems, showMakePurchaseModal]);

  function handleAddMoneyModalOpen() {
    setShowAddMoneyModal(true);
  }

  function handleMakePurchaseModalOpen() {
    setShowMakePurchaseModal(true);
  }

  function handleAddMoneyModalClose() {
    setShowAddMoneyModal(false);
    setIncreAmount("");
    setIncreAmountErr("");
  }

  function handleMakePurchaseModalClose() {
    setShowMakePurchaseModal(false);
    setDecreAmountErr("");
    setDecreAmount("");
  }

  function addAmount() {
    if (increAmount == "") {
      setIncreAmountErr("Please increase the amount");
    } else if (increAmount <= 0) {
      setIncreAmountErr("Amount cannot be less than or equal to 0");
    } else {
      const id = userData.id;
      axios
        .get("http://localhost:5000/users?id=" + id)
        .then((res) => {
          return res.data[0];
        })
        .then((user) => {
          let updatedemp = {
            ...user,
            amount: parseInt(user.amount) + parseInt(increAmount),
          };

          axios
            .put("http://localhost:5000/users/" + user.id, updatedemp)
            .then((res) => {
              if (res.status === 200) {
                let payload = {
                  ...userData,
                  amount: res.data.amount,
                };
                dispatch(userAction.setUser(payload));
              }
            })
            .catch((err) => console.log(err));
          setShowAddMoneyModal(false);
        })
        .catch((err) => console.log(err));

      setIncreAmount(0);
    }
  }

  function getItemsOfTheDay() {
    axios
      .get("http://localhost:5000/itemsOfTheDay")
      .then((res) => {
        if (res.status === 200) {
          let items = res.data.filter((item) => item.quantity >= 1);
          setItemsOfTheDay([...items]);
        }
      })
      .catch((err) => console.log(err));
  }

  function getItems() {
    axios
      .get("http://localhost:5000/totalItems")
      .then((res) => {
        if (res.status === 200) {
          let data = res.data;
          data.map((item) => (item.purchaseQuantity = 0));
          setTotalItems([...data]);
        }
      })
      .catch((err) => console.log(err));
  }

  function getTransactions() {
    setTransactions(userData.transactions);
  }

  function increPurchaseQuantity(itemId, itemName, quantity, purchaseQuantity) {
    setDecreAmountErr("");

    if (quantity === purchaseQuantity) {
      setDecreAmountErr("You cannot purchase more ", itemName);
    } else {
      let updatedCanteenItems = totalItems.map((item) => {
        if (item.id === itemId) {
          item.purchaseQuantity += 1;
        }
        return item;
      });
      setTotalItems(updatedCanteenItems);
    }
  }

  function decrePurchaseQuantity(itemId, itemName, quantity, purchaseQuantity) {
    setDecreAmountErr("");
    if (purchaseQuantity === 0) {
      setDecreAmountErr("You cannot deduct the quantity of " + itemName);
    } else if (quantity === 0) {
      setDecreAmountErr(itemName + " is out of stock");
    } else {
      let updatedCanteenItems = totalItems.map((item) => {
        if (item.id === itemId) {
          item.purchaseQuantity -= 1;
        }
        return item;
      });
      setTotalItems(updatedCanteenItems);
    }
  }

  function deductAmount() {
    let id = userData.id;
    let amount = 0;
    let items = [];
    let itemsToPurchase = totalItems.filter(
      (item) => item.purchaseQuantity > 0
    );
    console.log(itemsToPurchase);
    if (itemsToPurchase.length == 0) {
      console.log("No items for purchase");
    } else {
      itemsToPurchase.map((item) => {
        items.push(item.name + "-" + item.purchaseQuantity);
        amount += item.purchaseQuantity * item.price;

        axios
          .get("http://localhost:5000/totalItems/" + item.id)
          .then((res) => res.data)
          .then((currentItem) => {
            let updatedCurrentItem = {
              ...currentItem,
              quantity: currentItem.quantity - parseInt(item.purchaseQuantity),
            };
            axios
              .put(
                "http://localhost:5000/totalItems/" + item.id,
                updatedCurrentItem
              )
              .then((res) => console.log("resp from updating item", res))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      });
      console.log(items);
      setTotalItems(items);
      setDecreAmount(amount);
      console.log(decreAmount);
      axios
        .get("http://localhost:5000/users?id=" + id)
        .then((res) => {
          return res.data[0];
        })
        .then((user) => {
          if (user.amount < amount) {
            setDecreAmountErr("Insufficient Balance");
          } else {
            let updatedemp = {
              ...user,
              amount: parseInt(user.amount) - parseInt(amount),
              transactions: [
                ...user.transactions,
                {
                  items,
                  BillAmount: amount,
                  Source: "Employee",
                },
              ],
            };
            dispatch(userAction.setUser(updatedemp));
            axios
              .put("http://localhost:5000/users/" + user.id, updatedemp)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => console.log(err));
            setShowMakePurchaseModal(false);
            setDecreAmount(0);
            setTotalItems([]);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <Container fluid id="EmployeeCont">
      <EmployeeNav
        openAddMoneyModal={handleAddMoneyModalOpen}
        openMakeMoneyModal={handleMakePurchaseModalOpen}
      />
      <h1
        style={{
          backgroundColor: "lightblue",
          padding: "10px",
          color: "grey",
        }}
      >
        Hi {userData.name}. Enjoy your meal.
        <EmojiSmileFill color="orange" />
      </h1>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3" fill>
        <Tab eventKey="transactions" title="Transactions">
          <Container>
            <Col
              xs={10}
              md={8}
              style={{
                padding: "20px 10px",
                borderRadius: "5px",
                margin: "15px auto",
                background: "#E5E4E2",
              }}
            >
              <Row className="text-center justify-content-center">
                <Col xs={10} md={10}>
                  <h3>Recent Transactions</h3>
                  <ListGroup>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <>
                          <ListGroup.Item
                            style={{
                              margin: "10px 0px",
                              border: "4px solid black",
                            }}
                          >
                            <h3>
                              {transaction.items.map((item) => {
                                let indexOfDash = item.search("-");
                                let quantity = item.slice(
                                  indexOfDash + 1,
                                  item.length
                                );

                                return (
                                  <div style={{ margin: "5px 0px" }}>
                                    {item.slice(0, indexOfDash)}
                                    {" - "}
                                    <Badge>{quantity}</Badge>
                                  </div>
                                );
                              })}
                            </h3>
                            <hr />
                            Source : {transaction.Source}
                            <br />
                            Price : {transaction.BillAmount}
                          </ListGroup.Item>
                        </>
                      ))
                    ) : (
                      <ListGroup.Item>No Transactions Found</ListGroup.Item>
                    )}
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Container>
        </Tab>
        <Tab eventKey="itemsOfTheDay" title="Items Of The Day">
          <Container>
            <Col
              xs={10}
              md={8}
              style={{
                background: "#EAFFD9",
                padding: "20px 10px",
                borderRadius: "5px",
                margin: "15px auto",
              }}
            >
              <Row className="text-center justify-content-center">
                <Col xs={10}>
                  <h3>
                    {" "}
                    <Stars color="yellow" />
                    ITEMS OF THE DAY
                  </h3>
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th style={{ width: "70%" }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsOfTheDay.length > 0 ? (
                        itemsOfTheDay.map((item) => {
                          return (
                            <tr>
                              <td>
                                <h4>{item.name}</h4>
                              </td>
                              <td>
                                <Badge bg="success">{item.quantity}</Badge>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={2}>No ITEMS OF THE DAY</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Col>
          </Container>
        </Tab>
        <Tab eventKey="totalItems" title="Canteen Items">
          <Container>
            <Col
              xs={10}
              md={8}
              style={{
                background: "#EAFFD9",
                padding: "20px 10px",
                borderRadius: "5px",
                margin: "15px auto",
              }}
            >
              <Row className="text-center justify-content-center">
                <Col xs={10}>
                  <h3>CANTEEN ITEMS</h3>

                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th style={{ width: "70%" }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totalItems.length > 0 ? (
                        totalItems.map((item) => {
                          return (
                            <tr>
                              <td>
                                <h4>{item.name}</h4>
                              </td>
                              <td>
                                <Badge bg="success">{item.price}</Badge>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <td>No Items</td>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Col>
          </Container>
        </Tab>
      </Tabs>

      <Modal
        show={showAddMoneyModal}
        onHide={handleAddMoneyModalClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Amount for Increment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="number"
            placeholder="Amount"
            style={{ border: "1px solid green" }}
            value={increAmount}
            onChange={(e) => setIncreAmount(parseInt(e.target.value))}
          />
          {increAmountErr && <p style={{ color: "red" }}>{increAmountErr}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddMoneyModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addAmount();
            }}
          >
            Increase
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showMakePurchaseModal}
        onHide={handleMakePurchaseModalClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>SELECT ITEMS TO PURCHASE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center align-items-center">
            <Col xs={12}>
              {decreAmountErr && (
                <p style={{ color: "red", textAlign: "center" }}>
                  {decreAmountErr}
                </p>
              )}
            </Col>
          </Row>
          <Row className="justify-content-center align-items-center">
            <Col xs={12} className=" align-items-center">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ width: "65%" }}>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {totalItems.map((item) => {
                    return (
                      <tr>
                        <td>
                          <h5>{item.name}</h5>
                        </td>
                        <td colSpan="2">
                          <Button
                            onClick={() =>
                              increPurchaseQuantity(
                                item.id,
                                item.name,
                                item.quantity,
                                item.purchaseQuantity
                              )
                            }
                          >
                            {" "}
                            +{" "}
                          </Button>
                          &ensp;{item.purchaseQuantity}&ensp;
                          <Button
                            onClick={() =>
                              decrePurchaseQuantity(
                                item.id,
                                item.name,
                                item.quantity,
                                item.purchaseQuantity
                              )
                            }
                          >
                            {" "}
                            -{" "}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleMakePurchaseModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              deductAmount();
            }}
          >
            Purchase
          </Button>
        </Modal.Footer>
      </Modal>
      <Outlet />
    </Container>
  );
}
