import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Tab } from "react-bootstrap";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";

import Message from "../../components/Message.tsx";
import Loader from "../../components/Loader.tsx";

import { useGetProductsQuery } from "../../slices/productsApiSlice.ts";

const ProductsTable = ({ products }: { products: any[] }) => {
  const deleteHandler = (id: string) => {
    console.log("delete", id);
  };

  return (
    <Table striped bordered hover responsive className="table-sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>PRICE</th>
          <th>CATEGORY</th>
          <th>BRAND</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>{product._id}</td>
            <td>{product.name}</td>
            <td>${product.price}</td>
            <td>{product.category}</td>
            <td>{product.brand}</td>
            <td>
              <LinkContainer to={`/admin/product/${product._id}/edit`}>
                <Button variant="light" className="btn-sm mx-2">
                  <FaEdit />
                </Button>
              </LinkContainer>
              <Button
                variant="danger"
                className="btn-sm"
                onClick={() => deleteHandler(product._id)}
              >
                <FaTrash style={{ color: "white" }} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const ProductListScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery({});

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  }

  return <ProductsTable products={products} />;
};

export default ProductListScreen;
