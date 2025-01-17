import { useMutation } from "@apollo/client";
import { createJobMutation, jobByIdQuery } from "../lib/graphql/query";

export function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async ({ title, description }) => {
    const {
      data: { job },
    } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    return job;
  };

  return {
    loading,
    createJob,
  };
}
