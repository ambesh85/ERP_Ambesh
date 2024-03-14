import axios from "axios";
import { useEffect, useState } from "react";
import { PersonPlus, ArrowClockwise } from "react-bootstrap-icons";
import { useTable, useSortBy } from "react-table";
import React from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Alert,
  Badge,
  Form,
  ListGroup,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
export default function EmployeePortal() {
  const [inputData, setInputData] = useState("");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDecre, setShowDecre] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showPurhaseHistory, setShowPurchaseHistory] = useState(false);
  const [PurchaseHistory, setPurchaseHistory] = useState("");
  const [increAmount, setIncreAmount] = useState("");
  const [decreAmount, setDecreAmount] = useState(0);
  const [items, setItems] = useState("");
  const [increAmountErr, setIncreAmountErr] = useState("");
  const [decreAmountErr, setDecreAmountErr] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [id, setId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");
  const [updateErr, setUpdateErr] = useState("");
  const [addErr, setAddErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [canteenItems, setCanteenItems] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => console.log(filteredEmployees), [filteredEmployees]);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({ columns: columns, data: filteredEmployees }, useSortBy);

  const getData = () => {
    axios
      .get("http://localhost:5000/users?type=Employee&_sort=id")
      .then((res) => {
        console.log(res.data.length);

        setEmployees(res.data);
        setFilteredEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const getCanteenItems = () => {
    axios
      .get(" http://localhost:5000/totalItems")
      .then((res) => {
        console.log(res.data);
        let data = res.data;
        data.map((item) => (item.purchaseQuantity = 0));
        console.log(data);
        setCanteenItems(data);
      })
      .catch((err) => console.log(err));
  };

  const onClick = (data) => {
    setFilteredEmployees(
      employees.filter(
        (emp) => emp.id == data || emp.name.includes(data.toLocaleUpperCase())
      )
    );
  };

  const refresh = () => {
    setInputData("");
    getData();
  };

  const refreshSingleData = () => {
    axios
      .get("http://localhost:5000/users?id=" + id)
      .then((res) => {
        setFilteredEmployees(res.data);
      })
      .catch((err) => console.log(err));
  };
  const handleClose = () => {
    setId("");
    setShowModal(false);
    setIncreAmountErr("");
    setIncreAmount("");
  };

  const handleDecreClose = () => {
    setId("");
    setItems([]);
    setShowDecre(false);
    setDecreAmountErr("");
    setDecreAmount("");
  };

  const handleUpdateClose = () => {
    setId("");
    setShowUpdate(false);
    setUpdateAmount("");
    setUpdateName("");
    setUpdateErr("");
  };

  const handleDeleteClose = () => {
    setId("");
    setShowDelete(false);
  };
  const handleAddClose = () => {
    setShowAdd(false);
    setId("");
    setUpdateAmount("");
    setUpdateName("");
    setAddErr("");
  };

  const handlePurchaseHistoryClose = () => {
    setShowPurchaseHistory(false);
    setPurchaseHistory("");
  };

  const handleOpen = (emp) => {
    setId(emp.id);
    setShowModal(true);
  };

  const handleDecreOpen = (emp) => {
    setId(emp.id);
    setShowDecre(true);
  };

  const increPurchaseQuantity = (
    itemId,
    itemName,
    quantity,
    purchaseQuantity
  ) => {
    setDecreAmountErr("");

    if (quantity === purchaseQuantity) {
      setDecreAmountErr("You cannot purchase more ", itemName);
    } else {
      let updatedCanteenItems = canteenItems.map((item) => {
        if (item.id === itemId) {
          item.purchaseQuantity += 1;
        }
        return item;
      });
      setCanteenItems(updatedCanteenItems);
    }
  };

  const decrePurchaseQuantity = (
    itemId,
    itemName,
    quantity,
    purchaseQuantity
  ) => {
    setDecreAmountErr("");
    if (purchaseQuantity === 0) {
      setDecreAmountErr("You cannot deduct the quantity of " + itemName);
    } else if (quantity === 0) {
      setDecreAmountErr(itemName + " is out of stock");
    } else {
      let updatedCanteenItems = canteenItems.map((item) => {
        if (item.id === itemId) {
          item.purchaseQuantity -= 1;
        }
        return item;
      });
      setCanteenItems(updatedCanteenItems);
    }
  };

  const handleUpdateOpen = (emp) => {
    setId(emp.id);
    setShowUpdate(true);
    setUpdateAmount(emp.amount);
    setUpdateName(emp.name);
  };

  const handleDeleteOpen = (emp) => {
    setId(emp.id);
    setShowDelete(true);
  };

  const handleAddOpen = () => {
    setShowAdd(true);
  };

  const handlePurchaseHistoryOpen = (emp) => {
    getPurchaseHistory(emp.id);
    setShowPurchaseHistory(true);
  };
  const addAmount = () => {
    if (increAmount == "") {
      setIncreAmountErr("Please increase the amount");
    } else if (increAmount <= 0) {
      setIncreAmountErr("Amount cannot be less than or equal to 0");
    } else {
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
              if (inputData) {
                refreshSingleData();
              } else {
                refresh();
              }
            })
            .catch((err) => console.log(err));
          setShowModal(false);
        })
        .catch((err) => console.log(err));

      setIncreAmount(0);
    }
  };

  const deductAmount = () => {
    let amount = 0;
    let items = [];
    let itemsToPurchase = canteenItems.filter(
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
      setItems(items);
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
                  Source: "Admin",
                },
              ],
            };
            setOrderDetails({ items, Amount: amount });
            setTimeout(() => {
              setOrderDetails(null);
            }, 5000);

            axios
              .put("http://localhost:5000/users/" + user.id, updatedemp)
              .then((res) => {
                if (inputData) {
                  refreshSingleData();
                } else {
                  refresh();
                }
              })
              .catch((err) => console.log(err));
            setShowDecre(false);
            setDecreAmount(0);
            setItems(null);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const updateDetails = () => {
    if (updateAmount <= 0) {
      setUpdateErr("The Amount cannot be less than or equal to 0");
    } else {
      axios
        .get("http://localhost:5000/users?id=" + id)
        .then((res) => res.data[0])
        .then((user) => {
          if (user.name == updateName && user.amount == updateAmount) {
            setUpdateErr("Please modify the data before updation");
          } else if (!updateName || !updateAmount) {
            setUpdateErr("Please provide Input");
          } else {
            setUpdateErr("");
            let updatedUser = {
              ...user,
              name: updateName,
              amount: updateAmount,
            };
            axios
              .put("http://localhost:5000/users/" + id, updatedUser)
              .then((res) => {
                if (inputData) {
                  refreshSingleData();
                } else {
                  refresh();
                }
              })
              .catch((err) => console.log(err));
            setShowUpdate(false);
          }
        });
    }
  };

  const deleteEmployee = () => {
    axios
      .delete("http://localhost:5000/users/" + id)
      .then((res) => {
        console.log(res);
        setId("");
        setShowDelete(false);
        refresh();
      })
      .catch((err) => console.log(err));
  };

  const addEmployee = () => {
    console.log(id, updateAmount, updateName);
    if (!id || !updateAmount || !updateName) {
      setAddErr("Please provide all the data");
    } else if (id <= 0 || updateAmount <= 0) {
      setAddErr("Id or Amount cannot be less than or equal to 0");
    } else {
      axios
        .get("http://localhost:5000/users?id=" + id)
        .then((res) => {
          if (res.data.length) {
            setAddErr("User with this ID already registered");
          } else {
            let newuser = {
              id,
              name: updateName,
              amount: updateAmount,
              type: "Employee",
              transactions: [],
            };
            axios
              .post("http://localhost:5000/users/", newuser)
              .then((res) => {
                console.log(res);
                if (inputData) {
                  refreshSingleData();
                } else {
                  refresh();
                }
                setShowAdd(false);
                setId("");
                setUpdateAmount("");
                setUpdateName("");
                setAddErr("");
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const getPurchaseHistory = (id) => {
    axios
      .get("http://localhost:5000/users?id=" + id)
      .then((res) => {
        console.log(res);
        if (!res.data[0].transactions.length) {
          setPurchaseHistory("");
        } else setPurchaseHistory(res.data[0].transactions);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container fluid>
      <Row className="justify-content-center  ">
        <Col xs={12}>
          <Row
            style={{ height: "fit-content" }}
            className="justify-content-end align-items-start"
          >
            <Col xs="auto">
              <input
                type="text"
                placeholder="Employee Id or Name"
                value={inputData}
                onChange={(e) => {
                  setInputData(e.target.value);
                  onClick(e.target.value);
                }}
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  marginRight: "10px",
                }}
              />
            </Col>

            <Col xs="auto">
              <Button
                variant="outline-secondary"
                onClick={(e) => {
                  refresh();
                  e.target.blur();
                }}
              >
                <ArrowClockwise />
              </Button>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-success"
                onClick={(e) => {
                  handleAddOpen();
                  e.target.blur();
                }}
              >
                <PersonPlus />
              </Button>
            </Col>
          </Row>
          <Row className="mt-1 justify-content-center">
            {orderDetails && (
              <Alert variant="success">
                <Alert.Heading>Order Details</Alert.Heading>
                <p>Items Bought: {orderDetails.items}</p>
                <hr />
                <p className="mb-0">Bill: {orderDetails.Amount}</p>
              </Alert>
            )}

            {/* <div
              style={{
                overflow: "auto",
                height: filteredEmployees.length == 0 ? "50px" : "fit-content",
              }}
            >
              <Table responsive bordered hover variant="dark" xs="auto">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => {
                    return (
                      <tr key={emp.id}>
                        <td>{emp.id}</td>
                        <td>{emp.name}</td>
                        <td>{emp.amount}</td>
                        <td>
                          <Button
                            variant="outline-light"
                            className="m-1 "
                            onClick={(e) => {
                              handleOpen(emp);
                              e.target.blur();
                            }}
                          >
                            Add Money
                          </Button>

                          <Button
                            variant="outline-light"
                            className="m-1 "
                            onClick={(e) => {
                              handleDecreOpen(emp);
                              e.target.blur();
                            }}
                          >
                            Make Purchase
                          </Button>

                          <Button
                            variant="outline-light"
                            className="m-1 "
                            onClick={(e) => {
                              handleUpdateOpen(emp);
                              e.target.blur();
                            }}
                          >
                            Update
                          </Button>

                          <Button
                            variant="outline-light"
                            className="m-1"
                            onClick={(e) => {
                              handleDeleteOpen(emp);
                              e.target.blur();
                            }}
                          >
                            Delete
                          </Button>

                          <Button
                            variant="outline-light"
                            className="m-1"
                            onClick={(e) => {
                              handlePurchaseHistoryOpen(emp);
                              e.target.blur();
                            }}
                          >
                            View Purchase History
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div> */}
            {/* {filteredEmployees && filteredEmployees.length == 0 && (
              <h3 style={{ color: "Red" }}>No User Found</h3>
            )} */}
            <Col xs="auto">
              <Table {...getTableProps()} hover responsive>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => {
                        const { isSorted, isSortedDesc, getSortByToggleProps } =
                          column;
                        const extraClass = isSorted
                          ? isSortedDesc
                            ? "desc"
                            : "asc"
                          : "";

                        return (
                          <th
                            className={extraClass}
                            {...column.getHeaderProps(getSortByToggleProps())}
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          </th>
                        );
                      })}
                      <th>Actions</th>
                    </tr>
                  ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                  {loading && (
                    <tr className="tr">
                      <td colSpan={visibleColumns.length + 1}>
                        <Spinner
                          animation="border"
                          variant="primary"
                          role="status"
                        >
                          <h3 className="visually-hidden">Loading...</h3>
                        </Spinner>
                      </td>
                    </tr>
                  )}
                  {!filteredEmployees.length && !loading && (
                    <tr>
                      <td colSpan={visibleColumns.length + 1}>
                        <h3 style={{ color: "red" }}>No User Found</h3>
                      </td>
                    </tr>
                  )}
                  {filteredEmployees &&
                    rows.map((row, i) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            return (
                              <>
                                <td {...cell.getCellProps()}>
                                  {cell.render("Cell")}
                                </td>
                              </>
                            );
                          })}
                          <td>
                            <Button
                              style={{ backgroundColor: "darkcyan" }}
                              className="m-1 "
                              onClick={(e) => {
                                handleOpen(row.original);
                                e.target.blur();
                              }}
                            >
                              Add Money
                            </Button>

                            <Button
                              style={{ backgroundColor: "darkcyan" }}
                              className="m-1 "
                              onClick={(e) => {
                                handleDecreOpen(row.original);
                                getCanteenItems();
                                e.target.blur();
                              }}
                            >
                              Make Purchase
                            </Button>

                            <Button
                              style={{ backgroundColor: "darkcyan" }}
                              className="m-1 "
                              onClick={(e) => {
                                handleUpdateOpen(row.original);
                                e.target.blur();
                              }}
                            >
                              Update
                            </Button>

                            <Button
                              style={{ backgroundColor: "darkcyan" }}
                              className="m-1"
                              onClick={(e) => {
                                handleDeleteOpen(row.original);
                                e.target.blur();
                              }}
                            >
                              Delete
                            </Button>

                            <Button
                              style={{ backgroundColor: "darkcyan" }}
                              className="m-1"
                              onClick={(e) => {
                                handlePurchaseHistoryOpen(row.original);
                                e.target.blur();
                              }}
                            >
                              View Purchase History
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Modal for Adding Amount in Employee Wallet */}

      <Modal show={showModal} onHide={handleClose} centered>
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
          <Button variant="secondary" onClick={handleClose}>
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

      {/* Modal for Making Purchase */}

      <Modal show={showDecre} onHide={handleDecreClose} centered>
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
          <Row>
            <Col xs={12} className=" align-items-center">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ width: "65%" }}>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {canteenItems.map((item) => {
                    return (
                      <tr>
                        <td>
                          <h5>{item.name}</h5>
                        </td>
                        <td
                          colSpan="2"
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                          }}
                        >
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
                          <p style={{ fontWeight: "bolder" }}>
                            {item.purchaseQuantity}
                          </p>
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
          <Button variant="secondary" onClick={handleDecreClose}>
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

      {/* Modal for Updating Employee Details */}

      <Modal show={showUpdate} onHide={handleUpdateClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center align-items-center mb-3">
            {updateErr && (
              <p style={{ color: "red", textAlign: "center" }}>{updateErr}</p>
            )}
            <Col xs={2}>
              <label>Id</label>
            </Col>
            <Col xs={7}>
              <input
                type="number"
                placeholder="Id"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={id}
                readOnly
                disabled
              />
            </Col>
          </Row>
          <Row className="justify-content-center align-items-center mb-3">
            <Col xs={2}>
              <label>Name</label>
            </Col>
            <Col xs={7}>
              <input
                type="text"
                placeholder="Name"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={updateName}
                onChange={(e) =>
                  setUpdateName(e.target.value.toLocaleUpperCase())
                }
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={2}>
              <label>Amount</label>
            </Col>
            <Col xs={7}>
              <input
                type="number"
                placeholder="Amount"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={updateAmount}
                onChange={(e) => setUpdateAmount(parseInt(e.target.value))}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUpdateClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              updateDetails();
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Showing Delete Confirmation */}

      <Modal show={showDelete} onHide={handleDeleteClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to delete Employee details ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            No
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              deleteEmployee();
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding new Employee */}
      <Modal show={showAdd} onHide={handleAddClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center align-items-center mb-3">
            {addErr && (
              <p style={{ color: "red", textAlign: "center" }}>{addErr}</p>
            )}
            <Col xs={2}>
              <label>Id</label>
            </Col>
            <Col xs={7}>
              <input
                type="number"
                placeholder="Id"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={id}
                onChange={(e) => setId(parseInt(e.target.value))}
              />
            </Col>
          </Row>
          <Row className="justify-content-center align-items-center mb-3">
            <Col xs={2}>
              <label>Name</label>
            </Col>
            <Col xs={7}>
              <input
                type="text"
                placeholder="Name"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={updateName}
                onChange={(e) =>
                  setUpdateName(e.target.value.toLocaleUpperCase())
                }
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={2}>
              <label>Amount</label>
            </Col>
            <Col xs={7}>
              <input
                type="number"
                placeholder="Amount"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={updateAmount}
                onChange={(e) => setUpdateAmount(parseInt(e.target.value))}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              addEmployee();
              e.target.blur();
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for showing Purchase history */}

      <Modal
        show={showPurhaseHistory}
        onHide={handlePurchaseHistoryClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Purchase History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {PurchaseHistory &&
              PurchaseHistory.map((record, index) => {
                return (
                  <ListGroupItem
                    key={index}
                    style={{ margin: "10px 0px", border: "4px solid black" }}
                  >
                    <h3 style={{ textAlign: "center" }}>
                      <div>
                        {record.items.map((item) => {
                          let indexOfDash = item.search("-");
                          let quantity = item.slice(
                            indexOfDash + 1,
                            item.length
                          );
                          return (
                            <div>
                              {item.slice(0, indexOfDash)}
                              {" - "}
                              <Badge>{quantity}</Badge>
                            </div>
                          );
                        })}
                      </div>
                    </h3>
                    <hr />
                    Source: {record.Source}
                    <br />
                    Price : {record.BillAmount}
                  </ListGroupItem>
                );
              })}
            {!PurchaseHistory && (
              <ListGroupItem>
                <h3 style={{ color: "red" }}>No Record</h3>
              </ListGroupItem>
            )}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
