import { gql, GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

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
  const data = await client.request(query);
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
  const data = await client.request(query, { id });
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
  const data = await client.request(query, { id });
  return data.company;
}