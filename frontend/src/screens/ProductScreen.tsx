import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Meta from "../components/Meta.tsx";
import Rating from "../components/Rating.tsx";
import Loader from "../components/Loader.tsx";
import Message from "../components/Message.tsx";

import { addToCart } from "../slices/cartSlice.ts";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice.ts";

const ProductScreen = () => {
  const { id: productId } = useParams<{ id: string }>();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId!);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createReview({
        productId: productId!,
        rating,
        comment,
      }).unwrap();

      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const Products = () => (
    <>
      <Meta title={product?.name} />
      <Row>
        <Col md={5}>
          <Image src={product?.image} alt={product?.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product?.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product ? product.rating : 0}
                text={`${product ? product.numReviews : 0} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product?.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product?.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product && product.countInStock > 0
                      ? "In Stock"
                      : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product && product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...new Array(product.countInStock).keys()].map(
                          (x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          )
                        )}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={!(product && product.countInStock > 0)}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className="review">
        <Col md={6}>
          <h2>Reviews</h2>
          {product?.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant="flush">
            {product?.reviews.map((review: any) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h2>Write a Customer Review</h2>
              {loadingProductReview && <Loader />}
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="rating" className="my-2">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      required
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment" className="my-2">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button
                    disabled={loadingProductReview}
                    type="submit"
                    variant="primary"
                  >
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to="/login">sign in</Link> to write a review
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <Message variant="danger">
          {(error as any)?.data?.message || (error as any).error}
        </Message>
      );
    }
    return <Products />;
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {renderContent()}
    </>
  );
};

export default ProductScreen;
