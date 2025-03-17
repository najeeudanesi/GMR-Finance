import { useEffect, useState } from "react";
import LabsTable from "../../tables/LabsTble";
import { get } from "../../../utility/fetch";

function Labs({ id }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await get(`/patients/${id}/lab_reports`);

      setData(response);

    }
    catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div>
      {
        !isLoading ? (<LabsTable data={data} id={id} />) : (<div>Loading...</div>)
      }

    </div>
  );
}

export default Labs;
