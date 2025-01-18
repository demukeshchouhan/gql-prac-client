import { useParams } from "react-router";
import { useQuery } from "@apollo/client";
import { companyByIdQuery } from "../lib/graphql/query";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id: companyId },
  });

  const { company } = data ?? {};
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 className="has-text-danger">Data Unavailable</h2>;
  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
