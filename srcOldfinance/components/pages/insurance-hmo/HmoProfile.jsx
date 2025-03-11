import React, { useEffect, useState } from "react";
import InputField from "../../UI/InputField";
import edit from "../../../assets/svg/edit.svg";
import { get, put } from "../../../utility/fetch";
import toast from "react-hot-toast";
import SelectField from "../../UI/SelectField";

function HmoProfile({ data, next, id }) {
    const [formData, setFormdata] = useState({
        contactPerson: "",
        rcNumber: "",
        taxIdentityNumber: "",
        officeAddress: "",
        countryId: 0,
        stateId: 0,
        city: "",
        lga: "",
        phoneNumber: "",
        altPhoneNumber: "",
        email: ""
    });

    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        console.log(formData);
        setLoading(true);

        try {
            const response = await put(`/hmo/hmo/${id}/add-hmo-detail`, formData);
            toast.success("Profile Updated Successfully");
            console.log(response);
        } catch (e) {
            setLoading(false);
            const errMessage = await e.response?.json();
            console.log(errMessage);
            toast.error(errMessage?.errorData[0] || "Something went wrong");
        }

        setLoading(false);
    };

    useEffect(() => {
        if (data) {
            setFormdata({
                contactPerson: data.contactPerson || "",
                rcNumber: data.rcNumber || "",
                taxIdentityNumber: data.taxIdentityNumber || "",
                officeAddress: data.officeAddress || "",
                countryId: data.country?.id || 0,
                stateId: data.state?.id || 0,
                city: data.city || "",
                lga: data.lga || "",
                phoneNumber: data.phoneNumber || "",
                altPhoneNumber: data.altPhoneNumber || "",
                email: data.email || ""
            });
        }
    }, [data]);

    useEffect(() => {
        const fetchCountryOptions = async () => {
            try {
                const response = await get("/hmo/nationality/list");
                const op = response.resultList;
                const options = op.map(country => ({
                    value: country.id,
                    label: country.name
                }));
                console.log(response);
                setCountryOptions(options);
            } catch (e) {
                toast.error("Failed to fetch country options");
                console.log(e);
            }
        };

        fetchCountryOptions();
    }, []);

    useEffect(() => {
        if (formData.countryId) {
            const fetchStateOptions = async () => {
                try {
                    const response = await get(`/hmo/state/list?countryId=${formData.countryId}`);
                    const op = response.resultList;
                    const options = op.map(state => ({
                        value: state.id,
                        label: state.name
                    }));
                    console.log(response);
                    setStateOptions(options);
                } catch (e) {
                    toast.error("Failed to fetch state options");
                    console.log(e);
                }
            };

            fetchStateOptions();
        }
    }, [formData.countryId]);

    return (
        <div className="w-40">
            <div className="m-t-40"></div>
            <div className="w-100 flex space-between">
                <div className="bold-text text-sm m-b-20 text-green">{data?.vendorName}</div>
                <div className="underline">
                    <img src={edit} alt="" onClick={() => setDisabled(!disabled)} className="pointer" />
                </div>
            </div>

            <InputField
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => setFormdata({ ...formData, contactPerson: e.target.value })}
                disabled={disabled}
            />
            <InputField
                label="RC Number"
                value={formData.rcNumber}
                onChange={(e) => setFormdata({ ...formData, rcNumber: e.target.value })}
                disabled={disabled}
            />
            <InputField
                label="Tax Identity No"
                value={formData.taxIdentityNumber}
                onChange={(e) => setFormdata({ ...formData, taxIdentityNumber: e.target.value })}
                disabled={disabled}
            />
            <InputField
                label="Office Address"
                value={formData.officeAddress}
                onChange={(e) => setFormdata({ ...formData, officeAddress: e.target.value })}
                disabled={disabled}
            />
            <SelectField
                name="Country"
                disabled={disabled}
                options={countryOptions}
                value={formData.countryId}
                onChange={(e) => setFormdata({ ...formData, countryId: parseInt(e.target.value) })}
            />
            <SelectField
                name="State"
                disabled={disabled}
                options={stateOptions}
                value={formData.stateId}
                onChange={(e) => setFormdata({ ...formData, stateId: parseInt(e.target.value) })}
            />
            <InputField
                label="City"
                value={formData.city}
                onChange={(e) => setFormdata({ ...formData, city: e.target.value })}
                disabled={disabled}
            />
            <InputField
                label="LGA"
                value={formData.lga}
                onChange={(e) => setFormdata({ ...formData, lga: e.target.value })}
                disabled={disabled}
            />
            <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormdata({ ...formData, phoneNumber: e.target.value })}
                disabled={disabled}
            />
            <InputField
                label="Alt Phone"
                value={formData.altPhoneNumber}
                onChange={(e) => setFormdata({ ...formData, altPhoneNumber: e.target.value })}
                disabled={disabled}
            />
            <InputField
                label="Email"
                value={formData.email}
                onChange={(e) => setFormdata({ ...formData, email: e.target.value })}
                disabled={disabled}
            />
            <button className="btn m-t-20 w-100" onClick={handleSubmit} disabled={disabled || loading}>Submit</button>
        </div>
    );
}

export default HmoProfile;
