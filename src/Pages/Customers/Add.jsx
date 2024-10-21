import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Add() {

    const { setToken } = useContext(AppContext);
    const navigate = useNavigate();
    const { token } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        contact: "",
        country: "",
        addresses: [
            { no: "", street: "", city: "", state: "" } // Initial empty address
        ],
    });

    const [errors, setErrors] = useState({});

    async function handleRegister(e) {
        e.preventDefault();

        const res = await fetch('/api/customers', {
            method: 'post',
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
            // localStorage.setItem('token', data.token);
            // setToken(data.token);
            navigate("/customers");
        }
    }

    // Add a new empty address field
    function addAddress() {
        setFormData({
            ...formData,
            addresses: [...formData.addresses, { no: "", street: "", city: "", state: "" }]
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

    return (
        <>
            <h1 className="title">Register a New Customer</h1>

            <form onSubmit={handleRegister} className="w-1/2 mx-auto space-y-2">

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

                <div className="space-y-6">
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
                            <button type="button" className="danger-btn" onClick={() => removeAddress(index)}>
                                Remove Address
                            </button>
                        </div>
                    ))}

                    <button type="button" className="secondary-btn" onClick={addAddress}>
                        Add Another Address
                    </button>
                </div>

                <button className="primary-btn">Register</button>
            </form>
        </>
    );
}
