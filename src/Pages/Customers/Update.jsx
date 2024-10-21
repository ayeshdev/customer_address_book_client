import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Update() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        contact: "",
        country: "",
        addresses: [
            { id: null, no: "", street: "", city: "", state: "" } // Initial empty address
        ],
    });

    const [errors, setErrors] = useState({});

    // Fetch the customer details including addresses
    async function getCustomer() {
        const res = await fetch(`/api/customers/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        console.log(data);


        if (res.ok) {
            setFormData({
                name: data.customer.name,
                email: data.customer.email,
                company: data.customer.company,
                contact: data.customer.contact,
                country: data.customer.country,
                addresses: data.addresses // Assuming the API returns customer addresses here
            });
        } else {
            setErrors(data.errors);
        }
    }

    // Handle form submission for updating customer and addresses
    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(`/api/customers/${id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.errors || !res.ok) {
            setErrors(data.errors);
        } else {
            navigate("/customers");
        }
    }

    // Add a new empty address field
    function addAddress() {
        setFormData({
            ...formData,
            addresses: [...formData.addresses, { id: null, no: "", street: "", city: "", state: "" }]
        });
    }

    // Remove an address by index
    function removeAddress(index) {
        const newAddresses = formData.addresses.filter((_, i) => i !== index);
        setFormData({ ...formData, addresses: newAddresses });
    }

    // Handle change for form fields and dynamic addresses
    function handleChange(e, index = null, field = null) {
        if (index !== null && field !== null) {
            // Update specific address
            const newAddresses = [...formData.addresses];
            newAddresses[index][field] = e.target.value;
            setFormData({ ...formData, addresses: newAddresses });
        } else {
            // Update main form fields
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }

    // Delete an address
    async function addressDelete(addressId) {
        const res = await fetch(`/api/addresses/${addressId}`, {
            method: 'delete',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (res.ok) {
            // Remove the address from the formData after successful deletion
            setFormData((prev) => ({
                ...prev,
                addresses: prev.addresses.filter((address) => address.id !== addressId),
            }));
        }
    }

    console.log(formData);


    useEffect(() => {
        getCustomer();
    }, []);

    return (
        <>
            <h1 className="title">Update Customer</h1>

            <form onSubmit={handleUpdate} className="w-1/2 mx-auto space-y-6">

                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error">{errors.name[0]}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email[0]}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={formData.company}
                        onChange={handleChange}
                    />
                    {errors.company && <p className="error">{errors.company[0]}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="contact"
                        placeholder="Contact"
                        value={formData.contact}
                        onChange={handleChange}
                    />
                    {errors.contact && <p className="error">{errors.contact[0]}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                    />
                    {errors.country && <p className="error">{errors.country[0]}</p>}
                </div>

                <div className="space-y-4">
                <h3 className="title-3">Addresses</h3>
                    {formData.addresses.map((address, index) => (
                        <div key={index} className="space-y-2">
                            <div>
                                <input
                                    type="text"
                                    placeholder="No"
                                    value={address.no}
                                    onChange={(e) => handleChange(e, index, 'no')}
                                />
                                {errors[`addresses.${index}.no`] && <p className="error">{errors[`addresses.${index}.no`][0]}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Street"
                                    value={address.street}
                                    onChange={(e) => handleChange(e, index, 'street')}
                                />
                                {errors[`addresses.${index}.street`] && <p className="error">{errors[`addresses.${index}.street`][0]}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={address.city}
                                    onChange={(e) => handleChange(e, index, 'city')}
                                />
                                {errors[`addresses.${index}.city`] && <p className="error">{errors[`addresses.${index}.city`][0]}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={address.state}
                                    onChange={(e) => handleChange(e, index, 'state')}
                                />
                                {errors[`addresses.${index}.state`] && <p className="error">{errors[`addresses.${index}.state`][0]}</p>}
                            </div>
                            {address.id && (
                                <button
                                    type="button"
                                    className="danger-btn"
                                    onClick={() => addressDelete(address.id)}
                                >
                                    Delete
                                </button>
                            )}
                            <button type="button" className="warning-btn" onClick={() => removeAddress(index)}>
                                Remove Address
                            </button>
                        </div>
                    ))}

                    <button type="button" className="secondary-btn" onClick={addAddress}>
                        Add Another Address
                    </button>
                </div>

                <button className="primary-btn">Update</button>
            </form>
        </>
    );
}
