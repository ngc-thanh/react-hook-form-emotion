import { GraphQLClient, gql } from "graphql-request";

const endpoint = process.env.MONGO_URL;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: "Bearer MY_TOKEN",
  },
});

const CREATE_TODO = async (variables) => {
  const mutation = gql`
    mutation createTodo($title: String!) {
      createTodo(title: $title) {
        id
        title
      }
    }
  `;

  const data = await graphQLClient.request(mutation, variables);

  return data;
};

const DELETE_TODO = async (variables) => {
  const mutation = gql`
    mutation deleteTodo($id: ID!) {
      deleteTodo(id: $id) {
        status
        message
      }
    }
  `;

  const data = await graphQLClient.request(mutation, variables);

  return data;
};

const GET_TODOS = async () => {
  const getTodos = gql`
    query getTodos {
      todos {
        id
        title
      }
    }
  `;

  const data = await graphQLClient.request(getTodos);

  return data;
};

export { GET_TODOS, CREATE_TODO, DELETE_TODO };
