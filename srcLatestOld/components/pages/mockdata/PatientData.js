import { MdMedication } from "react-icons/md";
import { RiGroup2Fill, RiHotelBedFill, RiMicroscopeFill, RiUser2Fill } from "react-icons/ri";
import wallet from '../../../assets/images/Payment.png'
import patient from '../../../assets/images/Patient.png'
import group from '../../../assets/images/group.png'
export const PatientData = [
    {
        id: 'HS8980',
        firstName: "John",
        lastName: "Doe",
        weight: 80,
        age: 32,
        gender: "Male",
        height: 180,
        bloodGroup: "O+",
        temp: 36.5,
        bloodPressure: "120/80",
        heartRate: 80,
        respiratoryRate: 20,
        assignedNurse: "Dr. Smith",
        dateCreated: "2022-01-01",
    },

    {
        id: 'HS8981',
        firstName: "Jane",
        lastName: "Doe",
        weight: 60,
        age: 28,
        gender: "Female",
        height: 160,
        bloodGroup: "A+",
        temp: 36.5,
        bloodPressure: "120/80",
        heartRate: 80,
        respiratoryRate: 20,
        assignedNurse: "Dr. Smith",
        dateCreated: "2022-01-01",
    },

    {
        id: 'HS8982',
        firstName: "Bob",
        lastName: "Doe",
        weight: 80,
        age: 32,
        gender: "Male",
        height: 180,
        bloodGroup: "O+",
        temp: 36.5,
        bloodPressure: "120/80",
        heartRate: 80,
        respiratoryRate: 20,
        assignedNurse: "Dr. Smith",
        dateCreated: "2022-01-01",
    }


]


export const stats = [
    {
        number: "2,890",
        title: "Total Patients",
        icon: <RiHotelBedFill className="icon" size={28} />,
    },
    {
        number: "10,000",
        title: "Patients with outstanding",
        icon: <RiHotelBedFill className="icon" size={28} />,
    },
    {
        number: "1,000",
        title: "Direct Revenue",
        icon: <img src={wallet} className='icon' />,
    },
    {
        number: "6,080",
        title: "HMO Contribution",
        icon: <img src={wallet} className='icon' />,
    },
    {
        number: "3,700",
        title: "Patients with HMO",
        icon: <img src={group} className='icon' />,
    },
]
export const costStats = [
    {
        number: "2,890",
        title: "Lab Services Profiled",
        icon: <RiMicroscopeFill className="icon" size={32} />,
    },
    {
        number: "10,000",
        title: "Pharmacy Products Profiled",
        icon: <MdMedication className="icon" size={32} />,
    },
    {
        number: "1,000",
        title: "Clinical Services Profiled",
        icon: <RiHotelBedFill className="icon" size={32} />,
    },
    {
        number: "6,080",
        title: "Consultation Services Profiled",
        icon: <RiHotelBedFill className="icon" size={32} />,
    },

]

export const patientBreakdown = [
    {
        name: "Cardiology",
        value: 189,
    },
    {
        name: "Orthopedics",
        value: 120,
    },
    {
        name: "Gastroenterology",
        value: 80,
    },
    {
        name: "Neurology",
        value: 60,
    },
]