import InputField from "../../UI/InputField";
import SelectField from "../../UI/SelectField";
import TextField from "../../UI/TextField";
import DateInput from "../../UI/DateInput";
import ToggleButton from "../../layouts/ToggleButton";
import PackageDetailsTable from "../../tables/PackageDetailsTable";

const Membership = ()=> {
    return(
        <div className="flex w-full">
        <div className="w-2/5 ">
            <ToggleButton />
            <SelectField name='Select Hmo Provider' options={[]}/>
            <SelectField name='Select Package' options={[]}/>
            <InputField label={'Patient HMO ID'}/>
            <DateInput label={'Membership Warranty '}/>
            <TextField label={'Notes'}/>
            <div className="flex justify-between items-center w-100% mt-5">
                <a href="http://" className="font-sans text-red-500 underline" > Patient.pdf</a>
                <button className="p-2 bg-white border rounded-xl hover:bg-slate-200">Attach Document</button>
            </div>
            <button className="p-3 border rounded-xl mt-3 bg-green-600 text-white w-full"> Add Record</button>
        </div>
        <div className="w-3/5 ml-3.5">
            <p className="mb-3">Axa Mansuard Gold Package</p>
            <PackageDetailsTable />
        </div>
    </div>
    )
}

export default Membership;