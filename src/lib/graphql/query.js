import { getAccessToken } from "../auth";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  gql,
  concat,
} from "@apollo/client";

const URI = "http://localhost:9000/graphql";
const httpLink = createHttpLink({ uri: URI });

const customLink = new ApolloLink((operation, forward) => {
  console.log({ operation });
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({ Authorization: `Bearer ${accessToken}` });
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(customLink, httpLink),
  cache: new InMemoryCache(),
});

export async function getJobs() {
  const query = gql`
    query GetJobs {
      jobs {
        id
        description
        title
        date
        company {
          id
          name
          description
        }
      }
    }
  `;
  const { data } = await apolloClient.query({ query });
  return data.jobs;
}

export async function getJobById(id) {
  const query = gql`
    query GetJobById($id: ID!) {
      job(id: $id) {
        id
        date
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.job;
}

export async function getCompanyById(id) {
  const query = gql`
    query GetComapnyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
          description
        }
      }
    }
  `;
  const { data } = await apolloClient.query({ query, variables: { id } });
  return data.company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;
  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
  });
  return data.job;
}
