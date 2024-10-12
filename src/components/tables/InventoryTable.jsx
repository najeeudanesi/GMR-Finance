import React from "react";
import { BsBank } from "react-icons/bs";

function InventoryTable() {

    const data = [
        {
            item:'Panadol',
            inventoryId:'1',
            manufacturer: 'Hamza',
            storedQuantity: 2,
            availableQuantity: 1,
            supplier: 'Khadijah',
            lastRestock: '12:3:4'

        },
        {
            item:'Panadol',
            inventoryId:'1',
            manufacturer: 'Hamza',
            storedQuantity: 2,
            availableQuantity: 1,
            supplier: 'Khadijah',
            lastRestock: '12:3:4'

        },
        {
            item:'Panadol',
            inventoryId:'1',
            manufacturer: 'Hamza',
            storedQuantity: 2,
            availableQuantity: 1,
            supplier: 'Khadijah',
            lastRestock: '12:3:4'

        }
    ]

    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th>Item</th>
                            <th>Inventory Id</th>
                            <th>Manufacturer</th>
                            <th>Stored Quantity</th>
                            <th>Available Quantity</th>
                            <th>Supplier</th>
                            <th>Last Restock</th>
                            <th>Action</th>

                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data?.map((row, index) => {
                            return (
                                <tr key={index}>
                                    <td>{row.item}</td>
                                    <td>{row.inventoryId}</td>
                                    <td>{row.manufacturer}</td>
                                    <td>NGN {row.storedQuantity}</td>
                                    <td>{row.availableQuantity}</td>
                                    <td>{row.supplier}</td>
                                    <td>{row.lastRestock}</td>
                                    <td>{BsBank}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryTable;
