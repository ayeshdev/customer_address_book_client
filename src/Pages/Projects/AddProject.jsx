import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function AddProject() {
    const navigate = useNavigate();
    const { token } = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [availableCustomers, setAvailableCustomers] = useState([]); // For the dropdown
    const [searchQuery, setSearchQuery] = useState(""); // For searching customers
    const [errors, setErrors] = useState({});
    const [isOpen, setIsOpen] = useState(false); // Dropdown state
    const [selectedCustomers, setSelectedCustomers] = useState([]); // Selected customer checkboxes

    // Fetch all available customers for the dropdown
    async function fetchAvailableCustomers() {
        const res = await fetch('/api/customers', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();

        if (res.ok) {
            setAvailableCustomers(data.data); // Set available customers for the dropdown
        } else {
            console.error('Error fetching customers:', data.errors); // Handle errors if any
        }
    }

    // Handle form submission for adding a new project
    async function handleAdd(e) {
        e.preventDefault();

        console.log(formData);
        console.log(selectedCustomers);
        
        

        const res = await fetch('/api/projects', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formData,
                customer_ids: selectedCustomers, // Add selected customer IDs to the request body
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
        fetchAvailableCustomers(); // Fetch available customers on mount
    }, []);

    // Filter available customers based on search query
    const filteredCustomers = availableCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="title">Add New Project</h1>

            <form onSubmit={handleAdd} className="w-1/2 mx-auto space-y-6">
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
                                    onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state
                                />
                            </div>

                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <label key={customer.id} className="checkbox-wrapper mt-2">
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

                <button className="primary-btn">Add Project</button>
            </form>
        </>
    );
}
