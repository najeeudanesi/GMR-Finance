import FileInput from "../../UI/FileInput";
import InputField from "../../UI/InputField";
import TextField from "../../UI/TextField";
const UpdateInventory = () => {
    return(
        <div className='w-100'>
            <div className="flex justify-between">
                <div>
                <InputField label='Product Name' name='product' type='text'/>
                <InputField label='Quantity' name='quantity' type='text'/>
                <div className="flex justify-between space-x-2">
                <InputField label='Inventory Id' name='InventoryId' type='text'/>
                <InputField label='Manufacturer' name='manufacturer' type='text'/>
                </div>
                <InputField label='Best Before' name='BestBefore' type='text'/>
                <div className="flex justify-between space-x-2">
                <InputField label='Cost Price' name='costPrice' type='text'/>
                <InputField label='Selling Price' name='SellingPrice' type='text'/>
                </div>
                <TextField label='Product Description Overview' name='description' type='textarea'/>
                </div>


                <div className="flex justify-between flex-col m-5">
                    <FileInput type='file' accept="jpg,png,jpeg" />
                    <FileInput type='file' accept="jpg,png,jpeg"/>
                </div>
            </div>
        
        </div>
    )
}

export default UpdateInventory;