import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [expandedProject, setExpandedProject] = useState(null); // Track which project is expanded
    const navigate = useNavigate();
    const { token } = useContext(AppContext);

    async function getProjects() {

        if (token != null || token != undefined) {
            const res = await fetch('/api/projects', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await res.json();

            if (res.ok) {
                console.log(result); // Check if data is correctly fetched
                setProjects(result.data); // Use the 'data' key from Laravel's resource
            }
        } else {
            navigate('/login');
        }

    }

    useEffect(() => {
        getProjects();
    }, []);

    // Toggle the expanded project on click
    const handleToggle = (projectId) => {
        setExpandedProject(expandedProject === projectId ? null : projectId);
    };

    // Navigate to edit project page
    const handleEditProject = (projectId) => {
        navigate(`/projects/${projectId}/edit`);
    };

    // Delete project
    const handleDeleteProject = async (projectId) => {
        const res = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            // After deleting, refresh the projects list to reflect changes
            getProjects();
        }
    };

    return (
        <>
            <h1 className="title">Projects</h1>

            {projects.length > 0 ? projects.map(project => (
                <div key={project.id} className="mb-4 p-4 border rounded-md border-dashed border-slate-400">
                    <div className="mb-2 flex items-start justify-between">
                        <div>
                            <h2 className="font-bold text-2xl">{project.name}</h2>
                            <small className="text-xs text-slate-600">
                                {project.created_at}
                            </small>
                        </div>
                        {/* Edit and Delete buttons for the project */}
                        <div>
                            <Link to={`/projects/update/${project.id}`} className="bg-green-500 text-white text-sm rounded-md px-3 py-1">Edit</Link>
                            <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-red-500 text-sm text-white rounded px-3 py-1 ml-2 rounded-md" 
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <p>{project.description}</p>

                    {/* If this project is expanded, show the customers */}
                    {expandedProject === project.id && (
                        <div className="mt-2 ml-4">
                            <h3 className="text-lg font-bold">Customers:</h3>
                            {project.customers.length > 0 ? (
                                <ul className="list-disc ml-5">
                                    {project.customers.map(customer => (
                                        <li key={customer.id} className="text-sm">
                                            {customer.name} - {customer.email}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No customers linked to this project.</p>
                            )}
                        </div>
                    )}

                    <div className="mt-3">
                        <button
                            onClick={() => handleToggle(project.id)}
                            className="bg-gray-200 text-sm text-blue-500 rounded px-3 py-1"
                        >
                            {expandedProject === project.id ? "Hide Customers" : "Show Customers"}
                        </button>
                    </div>
                </div>
            )) : <p>There are no projects</p>}
        </>
    );
}
