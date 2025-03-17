import React, { useEffect, useState } from "react";
import { stats } from "./mockdata/PatientData";
import StatCard from "../UI/StatCard";
import PatientsBreakdown from "../UI/PatientsBreakdown";
import PatientAdmission from "../UI/PatientAdmission";

import GenderDistribution from "../UI/GenderDistribution";
import OutAndInpatientGraph from "../UI/OutAndInpatientGraph";
import { get } from "../../utility/fetch";

function Dashboard() {
  const user = localStorage.getItem("name")
  const [totalPatients, settotalPatients] = useState(0)
  const [outStandingPatients, setoutStandingPatients] = useState(0)
  const [directRevenue, setdirectRevenue] = useState(0)
  const [hmoContribution, sethmoContribution] = useState(0)
  const [hmoPatients, setHmoPatients] = useState(0)
  const [gender, setGender] = useState({})
  const [summary, setSummary] = useState([0, 0, 0, 0, 0])
  const [graph, setGraph] = useState({
    "inPatientPercentage": 0,
    "outPatientPercentage": 0,
    "dailyAverageCount": [
      {
        "date": "Mar 21",
        "inPatientCount": 0,
        "outPatientCount": 0
      },]
  })
  const [loading, setLoading] = useState(false)

  //done
  const getGraphDetails = async () => {
    try {
      const response = await fetch("https://edogoverp.com/medicals/api/dashboard/AllOutPatientAndInPatientCount");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      setGraph(data);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getGender = async () => {
    try {
      const data = await get(
        `/dashboard/patients-percentage-by-gender`
      )
      setGender(data)


    } catch (e) {
      console.log("Error: ", e)

    }

  }
  const getAssigned = async () => {
    try {
      const data = await get(
        `/dashboard/total-patients`
      )
      settotalPatients(data)


    } catch (e) {
      console.log("Error: ", e)

    }

  }

  const getOutStandingPatients = async () => {
    try {
      const data = await get(
        `/dashboard/patients-with-outstanding`
      )

      setoutStandingPatients(data);



    } catch (e) {
      console.log("Error: ", e)

    }

  }

  const getDirectRevenue = async () => {
    try {
      const data = await get(
        `/dashboard/direct-revenue`
      )

      setdirectRevenue(data);


    } catch (e) {
      console.log("Error: ", e)

    }

  }
  const getHmoContribution = async () => {
    try {
      const data = await get(
        `/dashboard/hmo-contributing`,
      )

      sethmoContribution(data);


    } catch (e) {
      console.log("Error: ", e)

    }

  }

  //done
  const getHmoPatients = async () => {
    try {
      const data = await get(
        `/dashboard/patients-with-hmo`
      )

      setHmoPatients(data);


    } catch (e) {
      console.log("Error: ", e)

    }

  }



  const fetchData = async () => {
    setLoading(true);
    await getAssigned();
    await getHmoContribution();
    await getHmoPatients();
    await getOutStandingPatients();
    await getDirectRevenue();
    await getGraphDetails();
    await getGender();
    setLoading(false)

  }

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    setSummary([totalPatients, outStandingPatients, directRevenue, hmoContribution, hmoPatients])
  }, [totalPatients, outStandingPatients, directRevenue, hmoContribution, hmoPatients])





  return (
    <div className="w-100 m-t-80">
      {loading ? (<div className="loader">loading ...</div>) : (
        <div className="m-t-20">
          <div>Good Day</div>
          <p className="m-t-10 text-xl font-semibold mb-4">{user}</p>
          <div className="flex w-98 gap-8 space-between m-t-10">
            {" "}
            {stats.map((stat, index) => (
              <div className="w-20" key={index}>
                <StatCard data={stat} number={summary[index]} icon={stat.icon} />
              </div>
            ))}
          </div>
          <div className="w-98 gap-16 flex">
            <div className="w-80 m-t-40">
              <OutAndInpatientGraph propdata={graph} />
              <div className="flex m-t-20 w-100">

              </div>
            </div>
            <div className="w-20 m-t-40 m-r-20">
              <GenderDistribution propData={gender} />
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Dashboard;
