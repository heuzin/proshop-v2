import React from "react";
import { Alert } from "react-bootstrap";

const Message = ({
  variant,
  children,
}: {
  variant: string;
  children: React.ReactNode;
}) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
