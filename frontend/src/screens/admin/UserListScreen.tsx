import React from "react";
import { toast } from "react-toastify";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";

import Message from "../../components/Message.tsx";
import Loader from "../../components/Loader.tsx";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice.ts";

const TableItems = ({ users, refetch }: { users: any; refetch: any }) => {
  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error((err as any).data?.message || (err as any).error);
      }
    }
  };

  return (
    <Table striped hover responsive className="table-sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>ADMIN</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user: any) => (
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </td>
            <td>
              {user.isAdmin ? (
                <FaCheck style={{ color: "green" }} />
              ) : (
                <FaTimes style={{ color: "red" }} />
              )}
            </td>
            <td>
              <LinkContainer to={`/admin/user/${user._id}/edit`}>
                <Button variant="light" className="btn-sm">
                  <FaEdit />
                </Button>
              </LinkContainer>
              <Button variant="danger" className="btn-sm">
                <FaTrash
                  style={{ color: "white" }}
                  onClick={() => deleteHandler(user._id)}
                />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery({});

  if (isLoading) return <Loader />;

  if (error)
    return (
      <Message variant="danger">
        {(error as any).data?.message || (error as any).error}
      </Message>
    );
  return (
    <>
      <h1>Users</h1>
      <TableItems users={users} refetch={refetch} />
    </>
  );
};

export default UserListScreen;
