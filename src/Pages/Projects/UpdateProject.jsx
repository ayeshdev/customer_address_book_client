import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function UpdateProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [availableCustomers, setAvailableCustomers] = useState([]); // For the dropdown
    const [selectedCustomers, setSelectedCustomers] = useState([]); // Selected customer checkboxes
    const [searchQuery, setSearchQuery] = useState(""); // For searching customers
    const [errors, setErrors] = useState({});
    const [isOpen, setIsOpen] = useState(false); // Dropdown state

    // Fetch project and customers when the component mounts
    async function getProject() {
        const res = await fetch(`/api/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();

        if (res.ok) {
            setFormData({
                name: data.project.name,
                description: data.project.description,
            });
            setSelectedCustomers(data.project.customers.map(c => c.id)); // Set selected customers
            fetchAvailableCustomers(data.project.customers); // Fetch available customers for the dropdown
        } else {
            setErrors(data.errors);
        }
    }

    // Fetch all available customers for the dropdown
    async function fetchAvailableCustomers(linkedCustomers) {
        const res = await fetch('/api/customers', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();

        if (res.ok) {
            const linkedCustomerIds = linkedCustomers.map(customer => customer.id);
            const unlinkedCustomers = data.data.filter(customer => !linkedCustomerIds.includes(customer.id));
            setAvailableCustomers(unlinkedCustomers); // Set only unlinked customers for the dropdown
        } else {
            console.error('Error fetching customers:', data.errors); // Handle errors if any
        }
    }

    // Handle form submission for updating project
    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(`/api/projects/${id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formData,
                customer_ids: selectedCustomers, // Pass the selected customer IDs
            }),
        });

        const data = await res.json();

        if (data.errors || !res.ok) {
            setErrors(data.errors);
        } else {
            navigate("/");
        }
    }

    useEffect(() => {
        getProject(); // Fetch the project details with customers on mount
    }, []);

    // Filter available customers based on search query
    const filteredCustomers = (availableCustomers || []).filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Dropdown toggle function
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Handle checkbox changes for selected customers
    const handleCheckboxChange = (customer) => {
        if (selectedCustomers.includes(customer.id)) {
            setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id));
        } else {
            setSelectedCustomers([...selectedCustomers, customer.id]);
        }
    };

    return (
        <>
            <h1 className="title">Update Project</h1>

            <form onSubmit={handleUpdate} className="w-1/2 mx-auto space-y-6">
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Project Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <p className="error">{errors.name[0]}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {errors.description && <p className="error">{errors.description[0]}</p>}
                </div>

                {/* Dropdown */}
                <div className="dropdown-container">
                    <button
                        type="button"
                        className="dropdown-toggle"
                        onClick={toggleDropdown}
                    >
                        {isOpen ? "Close" : "Show"} Customers
                    </button>

                    {isOpen && (
                        <div className="dropdown mt-3">
                            <div className="search-wrapper mb-4">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search Customers"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <label key={customer.id} className="checkbox-wrapper  mt-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox-input"
                                            value={customer.id}
                                            checked={selectedCustomers.includes(customer.id)}
                                            onChange={() => handleCheckboxChange(customer)}
                                        />
                                        <span className="checkbox-label">
                                            {customer.name} ({customer.email})
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <p>No available customers</p>
                            )}
                        </div>
                    )}
                </div>

                <button className="primary-btn">Update</button>
            </form>

            {/* Customer list section */}
            <div className="customer-list mt-6">
                <h2 className="title-2">Selected Customers</h2>
                {selectedCustomers.length > 0 ? (
                    <ul>
                        {selectedCustomers.map(customerId => {
                            const customer = availableCustomers.find(c => c.id === customerId);
                            return customer && (
                                <li key={customer.id} className="space-y-2">
                                    <span>{customer.name} ({customer.email})</span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No customers found</p>
                )}
            </div>
        </>
    );
}
