import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Product from "../components/Product.tsx";

import { useGetProductsQuery } from "../slices/productsApiSlice.ts";

import Loader from "../components/Loader.tsx";
import Message from "../components/Message.tsx";
import Paginate from "../components/Paginate.tsx";

const HomeScreen = () => {
  const { pageNumber } = useParams<{ pageNumber?: string }>();
  const { data, isLoading, error } = useGetProductsQuery({ pageNumber });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {data?.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={data?.pages} page={data?.page} />
        </>
      )}
    </>
  );
};

export default HomeScreen;
