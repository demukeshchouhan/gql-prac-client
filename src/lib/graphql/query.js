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
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(customLink, httpLink),
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

export async function getJobs() {
  const query = gql`
    query GetJobs {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
  });
  return data.jobs;
}

const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${jobDetailFragment}
`;
export async function getJobById(id) {
  const { data } = await apolloClient.query({
    query: jobByIdQuery,
    variables: { id },
  });
  return data.job;
}

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
export async function getCompanyById(id) {
  const { data } = await apolloClient.query({
    query: companyByIdQuery,
    variables: { id },
  });
  return data.company;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetails
      }
    }
    ${jobDetailFragment}
  `;
  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
    update: (cache, { data: updatedData }) => {
      console.log({ updatedData });
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: updatedData.job.id },
        data: updatedData,
      });
    },
  });
  return data.job;
}
