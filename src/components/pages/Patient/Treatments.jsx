
// import TreatmentTable from "../../tables/TreatmentTable";
import ReferPatient from "../../modals/ReferPatient";
import { useEffect, useState } from "react";
// import AddTreatment from "../../modals/AddCost";
import { get } from "../../../utility/fetch";
import toast from "react-hot-toast";

function Treatments({ visit, id }) {
  const [showModal, setShowModal] = useState(false);
  const [treatmentModal, setTreatmentModal] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisit, setLastVisit] = useState(null)

  const toggleModal = () => {

    if (visit === null) {
      toast("A visit has to exist before you can add treatment")
      return
    }
    setShowModal(!showModal);

  }

  const toggleTreatmentModal = () => {

    if (visit === null) {
      toast("A visit has to exist before you can add treatment")
      return
    }
    setTreatmentModal(!treatmentModal);
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await get(`/patients/${id}/treatmentrecord`)

      setData(response)

    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }


  const fetchVisit = async () => {
    setIsLoading(true)
    try {
      const response = await get(`/patients/${id}/visitrecord`);
      setLastVisit(response[response.length - 1]);

    } catch (e) {
      console.log(e);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    fetchData()
    fetchVisit()
  }, [])
  return (
    <div className="w-100">
      <div className="flex flex-h-end w-100 gap-10"><button className="rounded-btn" onClick={toggleModal}>+ Refer Patient</button><button className="rounded-btn" onClick={toggleTreatmentModal}>+ Add Treatment</button></div>
      {/* <TreatmentTable patientId={id} data={data} isloading={isLoading} visit={visit} /> */}
      {
        showModal && <ReferPatient closeModal={toggleModal} visit={lastVisit} id={id} />
      }
      {/* {
        treatmentModal && <AddTreatment closeModal={toggleTreatmentModal} visit={lastVisit} id={id} fetchData={() => fetchData()} />
      } */}

    </div>
  );
}

export default Treatments;
