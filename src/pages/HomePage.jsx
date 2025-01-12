import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/query";

function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  console.log(jobs);
  if (jobs.length > 0)
    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
}

export default HomePage;
