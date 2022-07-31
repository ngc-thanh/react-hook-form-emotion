import styled from "@emotion/styled";
import { useForm } from "react-hook-form";
import { GET_TODOS, CREATE_TODO, DELETE_TODO } from "../graphql-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <InputContainer
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Required email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && <Error>Email is required</Error>}
        <InputContainer
          type="password"
          placeholder="Password"
          {...register("password", { required: "Required password" })}
        />
        {errors.password && <Error>Password is required</Error>}
        <Button type="submit">Login</Button>
        <p>
          Not registered? <a href="#">Create an account</a>
        </p>
      </FormContainer>
      <Todos />
    </Container>
  );
}

const Todos = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    mutations.mutate({ title: title });
    setTitle("");
  };
  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const handleDelete = (e) => {
    mutation.mutate({ id: e.target.value });
  };

  const { data, status, error, isFetching, refetch } = useQuery(
    ["todos"],
    GET_TODOS,
    { enabled: false }
  );

  const mutations = useMutation(CREATE_TODO, {
    onSuccess: () => {
      // queryClient.invalidateQueries(["todos"]);
      refetch();
    },
  });

  const mutation = useMutation(DELETE_TODO, {
    onSuccess: () => {
      // queryClient.invalidateQueries(["todos"]);
      refetch();
    },
  });

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <InputContainer
          type="text"
          placeholder="Your todo..."
          value={title}
          onChange={handleOnChange}
        />
        <Button type="submit">Add Todo</Button>
      </FormContainer>
      <div>
        <Button
          style={{ marginBottom: "10px", backgroundColor: "#4c8caf" }}
          onClick={refetch}
        >
          GET TODOS
        </Button>
        {isFetching && <h2>Fetching data...</h2>}
        {status === "success" && data.todos.length === 0 ? (
          <h2>Do not have todo</h2>
        ) : (
          data &&
          data?.todos.map((todo) => (
            <div
              key={todo.id}
              id={todo.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              {" "}
              <p>{todo.title}</p>
              <Button
                style={{
                  backgroundColor: "#f53d3de6",
                  width: "100px",
                }}
                value={todo.id}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

const Container = styled.div`
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
`;

const FormContainer = styled.form`
  position: relative;
  z-index: 1;
  background: #ffffff;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
`;

const InputContainer = styled.input`
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
`;

const Button = styled.button`
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #4caf50;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
`;

const Error = styled.div`
  color: red;
  margin-bottom: 10px;
  text-align: left;
`;
