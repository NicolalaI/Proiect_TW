import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [repo, setRepo] = useState('');
    const [desc, setDesc] = useState('');
    const [showModal, setShowModal] = useState(false);

    const { user } = useAuth(); // Import user from AuthContext

    const fetchProjects = async () => {
        try {
            const res = await axios.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/projects', {
                NumeProiect: title,
                Repository: repo,
                Descriere: desc,
                CreatorId: user.userId // Pass the creator ID
            });
            setShowModal(false);
            setTitle('');
            setRepo('');
            setDesc('');
            fetchProjects(); // Refresh list
        } catch (err) {
            console.error("Error creating project:", err);
            alert("Eroare la crearea proiectului");
        }
    };

    return (
        <div className="container mx-auto px-4 pb-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-white drop-shadow-md">Proiecte Disponibile</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-white text-indigo-700 font-bold px-6 py-2 rounded-full hover:bg-gray-100 transition shadow-xl transform hover:-translate-y-0.5 border-2 border-transparent hover:border-indigo-200"
                >
                    + Adauga Proiect
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-white text-xl font-medium">Se incarca proiectele...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((proj) => (
                        <div key={proj.ProjectId} className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between min-h-[220px]">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">{proj.NumeProiect}</h3>
                                <p className="text-gray-700 mb-4 line-clamp-3 font-medium">{proj.Descriere || "Fara descriere"}</p>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 mb-4 font-mono bg-gray-100 p-2 rounded truncate border border-gray-200">
                                    {proj.Repository || "No Repo"}
                                </div>
                                <Link
                                    to={`/projects/${proj.ProjectId}`}
                                    className="block text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-xl transition shadow-md"
                                >
                                    Vezi Detalii
                                </Link>
                            </div>
                        </div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full text-center py-20 text-white/80 bg-white/10 rounded-3xl border-2 border-dashed border-white/30 backdrop-blur-sm">
                            <p className="text-2xl font-bold">Nu exista proiecte inregistrate.</p>
                            <p className="text-lg">Fii primul care adauga unul!</p>
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Proiect Nou</h2>
                        <form onSubmit={handleCreateProject}>
                            <div className="mb-5">
                                <label className="block text-gray-800 text-lg font-bold mb-2">Nume Proiect</label>
                                <input
                                    className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all font-medium text-lg text-gray-900"
                                    placeholder="ex: Website E-commerce"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-800 text-lg font-bold mb-2">Repository URL</label>
                                <input
                                    className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none transition-all font-medium text-lg text-gray-900"
                                    placeholder="https://github.com/..."
                                    value={repo}
                                    onChange={e => setRepo(e.target.value)}
                                />
                            </div>
                            <div className="mb-8">
                                <label className="block text-gray-800 text-lg font-bold mb-2">Descriere</label>
                                <textarea
                                    className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none resize-none h-32 font-medium text-lg text-gray-900"
                                    placeholder="Despre ce este proiectul..."
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition border-2 border-transparent"
                                >
                                    Renunta
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg border-2 border-indigo-500 hover:border-indigo-400 transition transform hover:-translate-y-1"
                                >
                                    SALVEAZA PROIECT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
