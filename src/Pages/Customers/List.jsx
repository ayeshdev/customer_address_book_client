import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function List() {
    const [customers, setCustomers] = useState([]);
    const [expandedCustomer, setExpandedCustomer] = useState(null); // Track which customer is expanded
    const { token } = useContext(AppContext);

    // Fetch customers from the API
    async function getCustomers() {
        const res = await fetch('/api/customers', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = await res.json();

        if (res.ok) {
            console.log(result); // Check if data is correctly fetched
            setCustomers(result.data); // Use the 'data' key from Laravel's resource
        }
    }

    useEffect(() => {
        getCustomers();
    }, []);

    // Toggle the expanded customer row
    const handleToggle = (customerId) => {
        setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
    };

    // Delete customer
    const handleDeleteCustomer = async (customerId) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            // Call your delete API
            console.log(`Deleting customer with ID: ${customerId}`);
            // After deleting, refresh the customer list
            await fetch(`/api/customers/${customerId}`, {  
                
                method: 'DELETE' ,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            getCustomers(); // Refresh the customer list
        }
    };

    // Edit address
    // const handleEditAddress = (addressId) => {
    //     // Redirect to edit page or open modal with address info
    //     console.log(`Edit address with ID: ${addressId}`);
    // };

    // Delete address
    const handleDeleteAddress = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            // Call your delete API
            console.log(`Deleting address with ID: ${addressId}`);
            // After deleting, refresh the customer list or specific customer
            await fetch(`/api/addresses/${addressId}`, { method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
             });
            getCustomers(); // Refresh the customer list
        }
    };

    return (
        <div>
            <h1 className="title">Customer List</h1>

            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <React.Fragment key={customer.id}>
                                {/* Main row for the customer */}
                                <tr
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleToggle(customer.id)}
                                >
                                    <td className="border border-gray-300 p-2">{customer.name}</td>
                                    <td className="border border-gray-300 p-2">{customer.email}</td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <Link to={`/customers/update/${customer.id}`} className="bg-green-500 text-white text-sm rounded-md px-3 py-1">Edit</Link>
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteCustomer(customer.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                        <span className="ml-2">{expandedCustomer === customer.id ? "▲" : "▼"}</span>
                                    </td>
                                </tr>

                                {/* Expandable row for the additional customer details */}
                                {expandedCustomer === customer.id && (
                                    <tr>
                                        <td colSpan="3" className="border border-gray-300 p-2 bg-gray-50">
                                            <div className="ml-4">
                                                <p><strong>Company:</strong> {customer.company}</p>
                                                <p><strong>Contact:</strong> {customer.contact}</p>
                                                <p><strong>Country:</strong> {customer.country}</p>

                                                {/* Show customer's addresses */}
                                                <h3 className="font-bold text-md">Addresses:</h3>
                                                {customer.addresses && customer.addresses.length > 0 ? (
                                                    <ul className="list-disc ml-5">
                                                        {customer.addresses.map((address, index) => (
                                                            <li key={index} className="text-sm">
                                                                {address.street}, {address.city}, {address.state}
                                                                
                                                                <div className="mt-1">
                                                                    {/* <button
                                                                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                                        onClick={() => handleEditAddress(address.id)}
                                                                    >
                                                                        Edit
                                                                    </button> */}
                                                                    <button
                                                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                                                        onClick={() => handleDeleteAddress(address.id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>No addresses available.</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center p-4">No customers available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
