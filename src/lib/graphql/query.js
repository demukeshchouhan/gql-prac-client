import { getMainDefinition } from "@apollo/client/utilities";
import { getAccessToken } from "../auth";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  gql,
  concat,
  split,
} from "@apollo/client";
import { Kind, OperationTypeNode } from "graphql";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWsClient } from "graphql-ws";

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

function isSubscriptions(operation) {
  const definition = getMainDefinition(operation.query);
  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
}

const wsLink = new GraphQLWsLink(
  createWsClient({
    url: "ws://localhost:9000/graphql",
    connectionParams: () => ({
      accessToken: getAccessToken(),
    }),
  })
);

const URI = "http://localhost:9000/graphql";
const httpLink = concat(authLink, createHttpLink({ uri: URI }));

export const apolloClient = new ApolloClient({
  link: split(isSubscriptions, wsLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   },
  // },
});

const jobDetailFragment = gql`
  fragment JobDetails on Job {
    id
    date
    title
    description
    company {
      id
      name
    }
  }
`;

export const companyByIdQuery = gql`
  query GetComapnyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;

export const jobQuery = gql`
  query GetJobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        date
        title
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${jobDetailFragment}
`;

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${jobDetailFragment}
`;

export const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      user
      text
    }
  }
`;

export const addMessageMutation = gql`
  mutation AddMessageMutation($text: String!) {
    message: addMessage(text: $text) {
      id
      user
      text
    }
  }
`;

export const messageAddedSubscription = gql`
  subscription MessageAddedSubscription {
    message: messageAdded {
      id
      user
      text
    }
  }
`;
