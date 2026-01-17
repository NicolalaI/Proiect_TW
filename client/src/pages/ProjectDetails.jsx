import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [bugs, setBugs] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [userRole, setUserRole] = useState(null); // 'MP' or 'TST'
    const [loading, setLoading] = useState(true);

    // Form states
    const [showBugModal, setShowBugModal] = useState(false);
    const [newBug, setNewBug] = useState({ subject: '', desc: '', severity: 'Low', priority: 'Low', commitLink: '' });

    const fetchProjectData = async () => {
        try {
            const res = await axios.get(`/projects/${id}`);
            setProject(res.data);

            // Verificam daca userul curent e membru
            // Presupunand ca backend-ul returneaza Members in res.data
            // Daca nu, ar trebui sa facem call separat sau sa se ocupe backend-ul
            if (res.data.Members) {
                const member = res.data.Members.find(m => m.UserId === user.userId);
                if (member) {
                    setIsMember(true);
                    setUserRole(member.ProjectMember.Role); // Sequelize pune datele din tabelul de legatura in ProjectMember
                }
            }

            // Fetch bugs
            // Presupunand ca avem un endpoint sau sunt inclusi in project
            // Daca sunt multi, ar trebui endpoint separat: /api/bugs?projectId=...
            // Momentan presupunem ca sunt in res.data.Bugs sau facem call separat
            if (res.data.Bugs) {
                setBugs(res.data.Bugs);
            } else {
                // Fallback fetch bugs check endpoint
                // const bugsRes = await axios.get(`/bugs?projectId=${id}`);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const handleJoin = async () => {
        try {
            await axios.post(`/projects/${id}/members`, { userId: user.userId, role: 'TST' });
            setIsMember(true);
            setUserRole('TST');
            fetchProjectData(); // Refresh to get updated member list if needed
        } catch (err) {
            alert("Eroare la alaturare proiect: " + err.response?.data?.message);
        }
    };

    const handleAddBug = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/bugs', {
                Subject: newBug.subject,
                Descriere: newBug.desc,
                Severity: newBug.severity,
                Priority: newBug.priority,
                CommitLink: newBug.commitLink,
                ProjectId: id,
                ReporterId: user.userId,
                Status: 'Open'
            });
            setShowBugModal(false);
            setNewBug({ subject: '', desc: '', severity: 'Low', priority: 'Low', commitLink: '' });
            fetchProjectData(); // Refresh bugs
        } catch (err) {
            alert("Eroare la adaugare bug");
        }
    };

    const handleAssign = async (bugId) => {
        try {
            await axios.put(`/bugs/${bugId}`, { AssigneeId: user.userId, Status: 'In Progress' });
            fetchProjectData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleResolve = async (bugId) => {
        const link = prompt("Introduce link-ul catre commit-ul de rezolvare:");
        if (!link) return;

        try {
            await axios.put(`/bugs/${bugId}`, { Status: 'Resolved', ResolutionCommitLink: link });
            fetchProjectData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-white text-xl font-bold">Incarcare date proiect...</div>;
    if (!project) return <div className="p-8 text-center text-white text-xl font-bold">Proiectul nu a fost gasit.</div>;

    return (
        <div className="container mx-auto px-4 py-6 pb-20">
            <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50 mb-10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-gray-900 mb-4 drop-shadow-sm">{project.NumeProiect}</h1>
                        <p className="text-gray-700 text-xl mb-6 max-w-3xl font-medium leading-relaxed">{project.Descriere}</p>
                        <a href={project.Repository} target="_blank" rel="noreferrer" className="inline-flex items-center text-indigo-700 hover:text-indigo-900 transition bg-indigo-50 px-4 py-2 rounded-full text-base font-semibold border border-indigo-100">
                            <span className="mr-2">🔗</span> {project.Repository}
                        </a>
                    </div>
                    <div>
                        {!isMember ? (
                            <button
                                onClick={handleJoin}
                                className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-10 py-4 rounded-2xl shadow-xl transition transform hover:-translate-y-1 text-lg"
                            >
                                DEVINO TESTER
                            </button>
                        ) : (
                            <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold border border-indigo-500 shadow-lg text-lg">
                                Membru: {userRole}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-extrabold text-white drop-shadow-md">
                    Bug-uri Raportate ({bugs.length})
                </h2>
                {isMember && (
                    <button
                        onClick={() => setShowBugModal(true)}
                        className="bg-white text-pink-600 font-extrabold px-8 py-3 rounded-full shadow-xl transition transform hover:-translate-y-1 hover:bg-gray-50 border-2 border-transparent hover:border-pink-200"
                    >
                        + Raporteaza Bug
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {bugs.map(bug => (
                    <div key={bug.BugId} className={`relative bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-3 ${bug.Status === 'Resolved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="flex flex-col md:flex-row justify-between gap-6 pl-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <h3 className="text-2xl font-black text-gray-900">{bug.Subject}</h3>
                                    <span className="text-sm font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full border border-gray-300">#{bug.BugId}</span>
                                </div>
                                <p className="text-gray-800 mb-6 text-lg font-medium leading-relaxed">{bug.Descriere}</p>
                                <div className="flex flex-wrap gap-4 text-base">
                                    <span className={`px-4 py-1.5 rounded-full font-bold border-2 ${bug.Severity === 'High' || bug.Severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        Severitate: {bug.Severity}
                                    </span>
                                    <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full border-2 border-gray-200 font-bold">Prioritate: {bug.Priority}</span>
                                    <span className={`px-4 py-1.5 rounded-full font-bold border-2 ${bug.Status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                        {bug.Status}
                                    </span>
                                </div>
                                {bug.CommitLink && (
                                    <div className="mt-4 text-base font-medium text-gray-600">
                                        Cauzat de: <a href={bug.CommitLink} className="text-indigo-600 hover:text-indigo-800 underline decoration-2" target="_blank" rel="noreferrer">Commit</a>
                                    </div>
                                )}
                                {bug.Status === 'Resolved' && bug.ResolutionCommitLink && (
                                    <div className="mt-2 text-base font-medium text-green-700">
                                        Rezolvat prin: <a href={bug.ResolutionCommitLink} className="underline decoration-2 hover:text-green-900" target="_blank" rel="noreferrer">Commit</a>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end space-y-3 min-w-[180px]">
                                {userRole === 'MP' && bug.Status === 'Open' && (
                                    <button
                                        onClick={() => handleAssign(bug.BugId)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md w-full transition"
                                    >
                                        Aloca-mi-l
                                    </button>
                                )}
                                {userRole === 'MP' && bug.Status === 'In Progress' && bug.AssigneeId === user.userId && (
                                    <button
                                        onClick={() => handleResolve(bug.BugId)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-md w-full transition"
                                    >
                                        Rezolva
                                    </button>
                                )}
                                {bug.Assignee && (
                                    <div className="text-sm font-semibold text-indigo-800 mt-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                        Alocat lui: {bug.Assignee.Nume || bug.AssigneeId}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {bugs.length === 0 && (
                    <div className="text-center py-20 bg-white/95 rounded-[2rem] border-2 border-dashed border-white/30 backdrop-blur-sm">
                        <p className="text-black text-2xl font-bold mb-2">Niciun bug raportat.</p>
                        <p className="text-gray-800 text-lg">Totul pare curat... poate prea curat! 🤔</p>
                    </div>
                )}
            </div>

            {showBugModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Raporteaza Bug Nou</h2>
                        <form onSubmit={handleAddBug}>
                            <div className="mb-5">
                                <label className="block text-gray-800 text-lg font-bold mb-2">Subiect</label>
                                <input
                                    className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-medium text-lg text-gray-900"
                                    placeholder="Scurta descriere a problemei"
                                    value={newBug.subject}
                                    onChange={e => setNewBug({ ...newBug, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6 mb-5">
                                <div>
                                    <label className="block text-gray-800 text-lg font-bold mb-2">Severitate</label>
                                    <select
                                        className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-medium text-lg bg-white text-gray-900"
                                        value={newBug.severity}
                                        onChange={e => setNewBug({ ...newBug, severity: e.target.value })}
                                    >
                                        <option value="Low">Mica</option>
                                        <option value="Medium">Medie</option>
                                        <option value="High">Mare</option>
                                        <option value="Critical">Critica</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-800 text-lg font-bold mb-2">Prioritate</label>
                                    <select
                                        className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-medium text-lg bg-white text-gray-900"
                                        value={newBug.priority}
                                        onChange={e => setNewBug({ ...newBug, priority: e.target.value })}
                                    >
                                        <option value="Low">Scazuta</option>
                                        <option value="Medium">Medie</option>
                                        <option value="High">Ridicata</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-800 text-lg font-bold mb-2">Link Commit (Cauza)</label>
                                <input
                                    className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all font-medium text-lg text-gray-900"
                                    placeholder="http://github.com/..."
                                    value={newBug.commitLink}
                                    onChange={e => setNewBug({ ...newBug, commitLink: e.target.value })}
                                />
                            </div>
                            <div className="mb-8">
                                <label className="block text-gray-800 text-lg font-bold mb-2">Descriere Detaliata</label>
                                <textarea
                                    className="w-full border-2 border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none resize-none h-32 font-medium text-lg text-gray-900"
                                    placeholder="Pasii de reproducere..."
                                    value={newBug.desc}
                                    onChange={e => setNewBug({ ...newBug, desc: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowBugModal(false)}
                                    className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition border-2 border-transparent"
                                >
                                    Renunta
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 shadow-lg border-2 border-pink-500 hover:border-pink-400 transition transform hover:-translate-y-1"
                                >
                                    TRIMITE BUG
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
