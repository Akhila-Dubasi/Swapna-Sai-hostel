"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { LayoutDashboard, Users, BedDouble, Image as ImageIcon, BarChart3, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalVisits: 0, totalEnquiries: 0, newEnquiries: 0, contacted: 0 });

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [enqRes, statsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/enquiries`, config),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/analytics`, config)
        ]);
        setEnquiries(enqRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching admin data", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          router.push("/admin/login");
        }
      }
    };

    fetchData();
  }, [token, router, logout]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/enquiries/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "enquiries", label: "Enquiries", icon: Users },
    { id: "rooms", label: "Rooms", icon: BedDouble },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  if (!token) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#181818] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-accent">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id ? "bg-accent text-white" : "text-muted hover:bg-white/5"
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#181818] p-6 rounded-2xl border border-white/5">
                <p className="text-muted text-sm font-medium mb-2">Total Enquiries</p>
                <p className="text-4xl font-bold">{stats.totalEnquiries}</p>
              </div>
              <div className="bg-[#181818] p-6 rounded-2xl border border-accent/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Users size={64} />
                </div>
                <p className="text-accent text-sm font-medium mb-2">New (Unread)</p>
                <p className="text-4xl font-bold text-accent">{stats.newEnquiries}</p>
              </div>
              <div className="bg-[#181818] p-6 rounded-2xl border border-white/5">
                <p className="text-muted text-sm font-medium mb-2">Contacted</p>
                <p className="text-4xl font-bold">{stats.contacted}</p>
              </div>
            </div>

            {/* Recent Enquiries Table snippet */}
            <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Enquiries</h2>
                <button onClick={() => setActiveTab("enquiries")} className="text-sm text-accent hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0f0f0f] border-b border-white/5">
                      <th className="p-4 text-sm font-medium text-muted">Name</th>
                      <th className="p-4 text-sm font-medium text-muted">Phone</th>
                      <th className="p-4 text-sm font-medium text-muted">Budget</th>
                      <th className="p-4 text-sm font-medium text-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.slice(0, 5).map(enq => (
                      <tr key={enq.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4">
                          <p className="font-medium text-white">{enq.name}</p>
                          <p className="text-xs text-muted">{enq.college}</p>
                        </td>
                        <td className="p-4 text-sm">{enq.phone}</td>
                        <td className="p-4 text-sm">{enq.budget}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            enq.status === 'New' ? 'bg-red-500/20 text-red-400' :
                            enq.status === 'Contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {enq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "enquiries" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-6">Manage Enquiries</h1>
            <div className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0f0f0f] border-b border-white/5">
                      <th className="p-4 text-sm font-medium text-muted">Date</th>
                      <th className="p-4 text-sm font-medium text-muted">Name / College</th>
                      <th className="p-4 text-sm font-medium text-muted">Phone</th>
                      <th className="p-4 text-sm font-medium text-muted">Message</th>
                      <th className="p-4 text-sm font-medium text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(enq => (
                      <tr key={enq.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4 text-sm text-muted">{new Date(enq.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <p className="font-medium text-white">{enq.name}</p>
                          <p className="text-xs text-muted">{enq.college}</p>
                        </td>
                        <td className="p-4 text-sm">{enq.phone}</td>
                        <td className="p-4 text-sm max-w-xs truncate">{enq.message || "-"}</td>
                        <td className="p-4">
                          <select 
                            value={enq.status}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                            className="bg-[#0f0f0f] border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-accent"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "rooms" || activeTab === "gallery" || activeTab === "analytics") && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-2xl font-bold mb-2 capitalize">{activeTab} Management</p>
              <p className="text-muted">This module is part of the full dashboard expansion.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
