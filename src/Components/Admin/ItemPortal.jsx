import axios from "axios";
import { useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";
import React from "react";
import {
  Col,
  Container,
  ListGroup,
  Row,
  Table,
  td,
  tr,
  th,
  tbody,
  thead,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import { StarFill, Star } from "react-bootstrap-icons";

export default function ItemPortal() {
  const [items, setItems] = useState([]);
  const [itemsOfTheDay, setItemsOfTheDay] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isAddToItemsOfTheDay, setIsAddToItemsOfTheDay] = useState(false);
  const [addErr, setAddErr] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editErr, setEditErr] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = React.useMemo(
    () => [
      {
        Header: "Item Name",
        accessor: "name",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
    ],
    []
  );

  useEffect(() => {
    getItems();
    getItemsOfTheDay();
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({ columns: columns, data: items }, useSortBy);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setId(item.id);
    setName(item.name);
    setPrice(item.price);
    setQuantity(item.quantity);
    setIsAddToItemsOfTheDay(item.itemOfTheDay);
    setShowEditModal(true);
  };

  const openDeleteModal = (item) => {
    setId(item.id);
    setIsAddToItemsOfTheDay(item.itemOfTheDay);
    setShowDeleteModal(true);
  };

  const closeAddModal = () => {
    setId("");
    setShowAddModal(false);
    setName("");
    setPrice("");
    setQuantity("");
    setAddErr("");
    setIsAddToItemsOfTheDay(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setName("");
    setPrice("");
    setQuantity("");
    setEditErr("");
    setIsAddToItemsOfTheDay(false);
  };

  const closeDeleteModal = () => {
    setId("");
    setDeleteErr("");
    setShowDeleteModal(false);
  };

  const getItems = () => {
    axios
      .get(" http://localhost:5000/totalItems")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const getItemsOfTheDay = () => {
    axios
      .get("http://localhost:5000/itemsOfTheDay")
      .then((res) => setItemsOfTheDay(res.data))
      .catch((err) => console.log(err));
  };

  const addItem = () => {
    let item = { name, price, quantity, itemOfTheDay: isAddToItemsOfTheDay };
    console.log(name, price, quantity, isAddToItemsOfTheDay);
    if (!name || !price || !quantity) {
      setAddErr("Please provide data");
    } else {
      axios
        .get("http://localhost:5000/totalItems?name=" + name)
        .then((res) => {
          if (res.data.length) {
            setAddErr("Item already present");
          } else {
            axios
              .post("http://localhost:5000/totalItems", item)
              .then((res) => {
                console.log(res);
                if (isAddToItemsOfTheDay) {
                  let itemOfTheDay = {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                  };
                  axios
                    .post("http://localhost:5000/itemsOfTheDay", itemOfTheDay)
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((err) => console.log(err));
                }
                setShowAddModal(false);
                setAddErr("");
                setName("");
                setPrice("");
                setQuantity("");
                getItems();
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const updateItem = () => {
    console.log(name, price, quantity, isAddToItemsOfTheDay);
    axios.get("http://localhost:5000/totalItems?id=" + id).then((res) => {
      if (
        res.data[0].name == name &&
        res.data[0].price == price &&
        res.data[0].quantity == quantity &&
        res.data[0].itemOfTheDay == isAddToItemsOfTheDay
      ) {
        setEditErr("Please modify some data to update");
      } else if (!name || !price || !quantity) {
        setEditErr("Please provide all the details");
      } else {
        let updateditem = {
          id,
          name,
          price,
          quantity,
          itemOfTheDay: isAddToItemsOfTheDay,
        };
        if (res.data[0].itemOfTheDay && isAddToItemsOfTheDay) {
          axios
            .get("http://localhost:5000/itemsOfTheDay?name=" + res.data[0].name)
            .then((res) => {
              let updatedItemOfTheDay = {
                id: res.data[0].id,
                name,
                price,
                quantity,
              };
              axios
                .put(
                  "http://localhost:5000/itemsOfTheDay/" + res.data[0].id,
                  updatedItemOfTheDay
                )
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        } else if (!res.data[0].itemOfTheDay && isAddToItemsOfTheDay) {
          let itemOfTheDay = {
            name: res.data[0].name,
            price: res.data[0].price,
            quantity: res.data[0].quantity,
          };
          axios
            .post("http://localhost:5000/itemsOfTheDay", itemOfTheDay)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => console.log(err));
        } else if (res.data[0].itemOfTheDay && !isAddToItemsOfTheDay) {
          axios
            .get("http://localhost:5000/itemsOfTheDay?name=" + res.data[0].name)
            .then((res) => {
              axios
                .delete("http://localhost:5000/itemsOfTheDay/" + res.data[0].id)
                .then((res) => {
                  console.log(res);
                  getItems();
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
        axios
          .put("http://localhost:5000/totalItems/" + id, updateditem)
          .then((res) => {
            console.log(res);
            setName("");
            setPrice("");
            setQuantity("");
            setEditErr("");
            setShowEditModal(false);
            setId("");
            getItems();
          });
      }
    });
  };

  const deleteItem = () => {
    if (isAddToItemsOfTheDay) {
      setDeleteErr("You cannot delete the Item when its in 'Items of the Day'");
    } else {
      axios
        .delete("http://localhost:5000/totalItems/" + id)
        .then((res) => {
          console.log(res);
          setId("");
          setShowDeleteModal(false);
          getItems();
        })
        .catch((err) => console.log(err));
    }
  };

  const addItemOfTheDay = (item) => {
    let itemOfTheDay = {
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    };
    if (item.itemOfTheDay) {
      let updatedItem = { ...item, itemOfTheDay: false };
      axios
        .put("http://localhost:5000/totalItems/" + item.id, updatedItem)
        .then((res) => {
          console.log(res);
          axios
            .get("http://localhost:5000/itemsOfTheDay?name=" + item.name)
            .then((res) => {
              axios
                .delete("http://localhost:5000/itemsOfTheDay/" + res.data[0].id)
                .then((res) => {
                  console.log(res);
                  getItems();
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        });
    } else {
      axios
        .post("http://localhost:5000/itemsOfTheDay", itemOfTheDay)
        .then((res) => {
          console.log(res);
          let updatedItem = { ...item, itemOfTheDay: true };
          axios
            .put("http://localhost:5000/totalItems/" + item.id, updatedItem)
            .then((res) => {
              console.log(res);
              getItems();
            })
            .catch((err) => console.log(err));
        });
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col xs={10}>
          <Row
            className="justify-content-end"
            style={{ height: "fit-content" }}
          >
            <Col xs="auto">
              <Button onClick={() => openAddModal()}>Add New Item</Button>
            </Col>
          </Row>
        </Col>
        <Col xs="auto">
          <Table hover responsive {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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
                    <Spinner animation="border" variant="primary" role="status">
                      <h3 className="visually-hidden">Loading...</h3>
                    </Spinner>
                  </td>
                </tr>
              )}
              {!items.length && !loading && (
                <tr>
                  <td colSpan={visibleColumns.length + 1}>
                    <h3 style={{ color: "red" }}>No User Found</h3>
                  </td>
                </tr>
              )}
              {items &&
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
                          className="m-1"
                          onClick={() => addItemOfTheDay(row.original)}
                        >
                          {row.original.itemOfTheDay ? (
                            <StarFill color="yellow" />
                          ) : (
                            <Star color="yellow" />
                          )}
                        </Button>

                        <Button
                          style={{ backgroundColor: "darkcyan" }}
                          className="m-1"
                          onClick={() => openEditModal(row.original)}
                        >
                          Edit
                        </Button>

                        <Button
                          style={{ backgroundColor: "darkcyan" }}
                          className="m-1"
                          onClick={() => openDeleteModal(row.original)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal for Adding new item in itemlist */}

      <Modal show={showAddModal} onHide={closeAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center align-items-center mb-3">
            {addErr && (
              <p style={{ color: "red", textAlign: "center" }}>{addErr}</p>
            )}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="justify-content-center align-items-center mb-3">
            <Col xs={2}>
              <label>Price</label>
            </Col>
            <Col xs={7}>
              <input
                type="number"
                placeholder="Price"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={2}>
              <label>Quantity</label>
            </Col>
            <Col xs={7}>
              <input
                type="number"
                placeholder="Quantity"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </Col>
          </Row>
          <Row className="justify-content-center mt-3">
            <Col xs={1}>
              <input
                type="checkbox"
                onChange={(e) => setIsAddToItemsOfTheDay(e.target.checked)}
              />
            </Col>
            <Col xs={7}>
              <label>Add Item to Items of the Day</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addItem();
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for updating item */}

      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center align-items-center mb-3">
            {editErr && (
              <p style={{ color: "red", textAlign: "center" }}>{editErr}</p>
            )}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="justify-content-center align-items-center mb-3">
            <Col xs={2}>
              <label>Price</label>
            </Col>
            <Col xs={7}>
              <input
                type="number"
                placeholder="Price"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={2}>
              <label>Quantity</label>
            </Col>
            <Col xs={7}>
              <input
                type="number"
                placeholder="Quantity"
                style={{
                  border: "none",
                  borderBottom: "1px solid grey",
                  textAlign: "center",
                }}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </Col>
          </Row>
          <Row className="justify-content-center mt-3">
            <Col xs={1}>
              <input
                type="checkbox"
                checked={isAddToItemsOfTheDay}
                onChange={(e) => setIsAddToItemsOfTheDay(e.target.checked)}
              />
            </Col>
            <Col xs={7}>
              <label>Add Item to Items of the Day</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              updateItem();
            }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteErr && (
            <p style={{ color: "red", textAlign: "center" }}>{deleteErr}</p>
          )}
          <p>Do you want to delete Item ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            No
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              deleteItem();
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
