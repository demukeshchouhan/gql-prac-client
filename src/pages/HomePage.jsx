import JobList from "../components/JobList";
import { jobQuery } from "../lib/graphql/query";
import { useQuery } from "@apollo/client";

function HomePage() {
  const { data } = useQuery(jobQuery);
  const { jobs } = data ?? [];

  if (jobs?.length > 0)
    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
}

export default HomePage;
