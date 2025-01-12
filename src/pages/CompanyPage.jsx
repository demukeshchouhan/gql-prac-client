import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCompanyById } from "../lib/graphql/query";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [companyData, setCompanyData] = useState({
    company: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const company = await getCompanyById(companyId);
        setCompanyData({
          company,
          loading: false,
          error: false,
        });
      } catch {
        setCompanyData({
          company: null,
          loading: false,
          error: true,
        });
      }
    })();
  }, [companyId]);
  const { company, loading, error } = companyData;
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
