import React from "react";
import { toast } from "react-toastify";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";

import Loader from "../../components/Loader.tsx";
import Message from "../../components/Message.tsx";
import Paginate from "../../components/Paginate.tsx";

import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice.ts";

const CreateProduct = ({ refetch }: { refetch: () => void }) => {
  const [createProduct] = useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct({});
        refetch();
      } catch (err: any) {
        toast.error(err.data?.message || err.error);
      }
    }
  };
  return (
    <Row className="align-items-center">
      <Col>
        <h1>Products</h1>
      </Col>
      <Col className="text-end">
        <Button className="btn-sm m-3" onClick={createProductHandler}>
          <FaEdit /> Create Product
        </Button>
      </Col>
    </Row>
  );
};

const ProductsTable = ({
  data,
  refetch,
}: {
  data: any[];
  refetch: () => void;
}) => {
  const [deleteProduct] = useDeleteProductMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        refetch();
      } catch (err: any) {
        toast.error(err.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <CreateProduct refetch={refetch} />

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
          {data?.products.map((product) => (
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
      <Paginate pages={data?.pages} page={data?.page} isAdmin={true} />
    </>
  );
};

const ProductListScreen = () => {
  const { pageNumber } = useParams<{ pageNumber?: string }>();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  }

  return <ProductsTable data={data} refetch={refetch} />;
};

export default ProductListScreen;
