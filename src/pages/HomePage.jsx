import { useState } from "react";
import JobList from "../components/JobList";
import { jobQuery } from "../lib/graphql/query";
import { useQuery } from "@apollo/client";
import PaginationBar from "../components/PaginationBar";

const JOBS_PER_PAGE = 5;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  // const [mutate] = useMutation();
  const { data, error } = useQuery(jobQuery, {
    variables: {
      limit: JOBS_PER_PAGE,
      // get previous page from current and multiply with limit
      offset: (currentPage - 1) * JOBS_PER_PAGE,
    },
  });
  const { items, totalCount } = data?.jobs ?? [];
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  if (error) return <h2 className="has-text-danger">{error.message}</h2>;
  if (items?.length > 0)
    return (
      <div>
        <h1 className="title">Job Board</h1>
        {/* <div>
          <button
            className="button is-success "
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span className="button is-static">{`${currentPage} of ${totalPages}`}</span>
          <button
            disabled={currentPage === totalPages}
            className="button is-success "
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div> */}
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <JobList jobs={items} />
      </div>
    );
}

export default HomePage;
