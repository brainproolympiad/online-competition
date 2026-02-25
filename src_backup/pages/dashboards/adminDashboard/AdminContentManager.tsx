// src/pages/dashboards/adminDashboard/AdminContentManager.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Swal from "sweetalert2";

interface AlumniWinner {
  id: number;
  year: string;
  name: string;
  position: string;
  school: string;
  state: string;
  photo: string;
}

interface AlumniFinalist {
  id: number;
  year: string;
  name: string;
  school: string;
  state: string;
  photo: string;
}

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const AdminContentManager: React.FC = () => {
  const [winners, setWinners] = useState<AlumniWinner[]>([]);
  const [finalists, setFinalists] = useState<AlumniFinalist[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState("winners");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Load all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    console.log("Fetching all content from Supabase...");

    try {
      const [wRes, fRes, sRes, mRes] = await Promise.all([
        supabase.from("alumni_winners").select("*").order("year", { ascending: false }),
        supabase.from("alumni_finalists").select("*").order("year", { ascending: false }),
        supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
        supabase.from("messages").select("*").order("created_at", { ascending: false }),
      ]);

      if (wRes.error) console.error("Error loading winners:", wRes.error);
      if (fRes.error) console.error("Error loading finalists:", fRes.error);
      if (sRes.error) console.error("Error loading subscribers:", sRes.error);
      if (mRes.error) console.error("Error loading messages:", mRes.error);

      setWinners(wRes.data || []);
      setFinalists(fRes.data || []);
      setSubscribers(sRes.data || []);
      setMessages(mRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table: string, id: number, name: string = "record") => {
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `You are about to delete <strong>${name}</strong>. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire("Deleted!", "Record has been removed successfully.", "success");
      fetchAllData();
    }
  };

  const viewMessage = (message: Message) => {
    Swal.fire({
      title: `Message from ${message.name}`,
      html: `
        <div class="text-left">
          <p><strong>Email:</strong> ${message.email}</p>
          <p><strong>Date:</strong> ${new Date(message.created_at).toLocaleString()}</p>
          <hr class="my-4">
          <p class="mt-4 whitespace-pre-wrap">${message.message}</p>
        </div>
      `,
      width: isMobile ? "90%" : 600,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      Swal.fire("Info", "No data to export", "info");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const csvData = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(",")
    ).join("\n");

    const csv = `${headers}\n${csvData}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFilteredData = () => {
    const data = {
      winners,
      finalists,
      subscribers,
      messages
    }[activeTab];

    if (!searchTerm) return data;

    return data.filter((item: any) => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const StatsCard = ({ title, count, color, icon }: { title: string; count: number; color: string; icon: string }) => (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="text-lg md:text-xl">{icon}</div>
      </div>
    </div>
  );

  const TabButton = ({ tab, label, icon }: { tab: string; label: string; icon: string }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setSearchTerm("");
      }}
      className={`flex items-center px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium transition-all flex-1 min-w-0 ${
        activeTab === tab
          ? "bg-blue-600 text-white shadow-md"
          : "bg-white text-gray-700 hover:bg-gray-50 border"
      }`}
    >
      <span className="mr-2 text-sm md:text-lg">{icon}</span>
      <span className="text-xs md:text-sm truncate">{label}</span>
    </button>
  );

  // Mobile Card Views
  const WinnerCard = ({ winner }: { winner: AlumniWinner }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-3">
      <div className="flex items-start space-x-3">
        <img src={winner.photo} alt={winner.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{winner.name}</h3>
          <p className="text-sm text-gray-600">{winner.year} • {winner.position}</p>
          <p className="text-sm text-gray-600 truncate">{winner.school}, {winner.state}</p>
        </div>
        <button
          onClick={() => handleDelete("alumni_winners", winner.id, winner.name)}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex-shrink-0"
        >
          Delete
        </button>
      </div>
    </div>
  );

  const FinalistCard = ({ finalist }: { finalist: AlumniFinalist }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-3">
      <div className="flex items-start space-x-3">
        <img src={finalist.photo} alt={finalist.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{finalist.name}</h3>
          <p className="text-sm text-gray-600">{finalist.year}</p>
          <p className="text-sm text-gray-600 truncate">{finalist.school}, {finalist.state}</p>
        </div>
        <button
          onClick={() => handleDelete("alumni_finalists", finalist.id, finalist.name)}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex-shrink-0"
        >
          Delete
        </button>
      </div>
    </div>
  );

  const SubscriberCard = ({ subscriber }: { subscriber: Subscriber }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-3">
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{subscriber.email}</p>
          <p className="text-sm text-gray-600">
            {new Date(subscriber.subscribed_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => handleDelete("newsletter_subscribers", subscriber.id, subscriber.email)}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex-shrink-0 ml-2"
        >
          Delete
        </button>
      </div>
    </div>
  );

  const MessageCard = ({ message }: { message: Message }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{message.name}</h3>
          <p className="text-sm text-gray-600 truncate">{message.email}</p>
          <p className="text-xs text-gray-500">
            {new Date(message.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{message.message}</p>
      <div className="flex space-x-2">
        <button
          onClick={() => viewMessage(message)}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors flex-1"
        >
          View Message
        </button>
        <button
          onClick={() => handleDelete("messages", message.id, `message from ${message.name}`)}
          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex-1"
        >
          Delete
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Content Manager</h1>
        <p className="text-gray-600 text-sm md:text-base">Manage alumni data, subscribers, and messages</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <StatsCard title="Winners" count={winners.length} color="border-green-500" icon="🏆" />
        <StatsCard title="Finalists" count={finalists.length} color="border-purple-500" icon="🎓" />
        <StatsCard title="Subscribers" count={subscribers.length} color="border-blue-500" icon="📧" />
        <StatsCard title="Messages" count={messages.length} color="border-red-500" icon="💬" />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-1 md:space-x-2 p-3 md:p-4 overflow-x-auto">
            <TabButton tab="winners" label="Winners" icon="🏆" />
            <TabButton tab="finalists" label="Finalists" icon="🎓" />
            <TabButton tab="subscribers" label="Subscribers" icon="📧" />
            <TabButton tab="messages" label="Messages" icon="💬" />
          </div>
        </div>

        {/* Search and Actions */}
        <div className="p-3 md:p-4 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:max-w-md">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
          <button
            onClick={() => exportToCSV(getFilteredData(), activeTab)}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm mt-2 sm:mt-0"
          >
            <span className="mr-2">📥</span>
            Export CSV
          </button>
        </div>

        {/* Content Area */}
        <div className="p-3 md:p-4">
          {isMobile ? (
            /* Mobile Card View */
            <div>
              {activeTab === "winners" && (
                <div>
                  {getFilteredData().map((winner: AlumniWinner) => (
                    <WinnerCard key={winner.id} winner={winner} />
                  ))}
                  {getFilteredData().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? "No matching winners found." : "No winners data available."}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "finalists" && (
                <div>
                  {getFilteredData().map((finalist: AlumniFinalist) => (
                    <FinalistCard key={finalist.id} finalist={finalist} />
                  ))}
                  {getFilteredData().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? "No matching finalists found." : "No finalists data available."}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "subscribers" && (
                <div>
                  {getFilteredData().map((subscriber: Subscriber) => (
                    <SubscriberCard key={subscriber.id} subscriber={subscriber} />
                  ))}
                  {getFilteredData().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? "No matching subscribers found." : "No subscribers data available."}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "messages" && (
                <div>
                  {getFilteredData().map((message: Message) => (
                    <MessageCard key={message.id} message={message} />
                  ))}
                  {getFilteredData().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? "No matching messages found." : "No messages available."}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="overflow-x-auto">
              {activeTab === "winners" && (
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Photo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">School</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">State</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getFilteredData().map((winner: AlumniWinner) => (
                      <tr key={winner.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <img src={winner.photo} alt={winner.name} className="w-10 h-10 rounded-full object-cover" />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{winner.name}</td>
                        <td className="px-4 py-3 text-gray-600">{winner.year}</td>
                        <td className="px-4 py-3 text-gray-600">{winner.position}</td>
                        <td className="px-4 py-3 text-gray-600">{winner.school}</td>
                        <td className="px-4 py-3 text-gray-600">{winner.state}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete("alumni_winners", winner.id, winner.name)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "finalists" && (
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Photo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">School</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">State</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getFilteredData().map((finalist: AlumniFinalist) => (
                      <tr key={finalist.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <img src={finalist.photo} alt={finalist.name} className="w-10 h-10 rounded-full object-cover" />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{finalist.name}</td>
                        <td className="px-4 py-3 text-gray-600">{finalist.year}</td>
                        <td className="px-4 py-3 text-gray-600">{finalist.school}</td>
                        <td className="px-4 py-3 text-gray-600">{finalist.state}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete("alumni_finalists", finalist.id, finalist.name)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "subscribers" && (
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subscribed Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getFilteredData().map((subscriber: Subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{subscriber.email}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete("newsletter_subscribers", subscriber.id, subscriber.email)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "messages" && (
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">From</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Preview</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getFilteredData().map((message: Message) => (
                      <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{message.name}</td>
                        <td className="px-4 py-3 text-gray-600">{message.email}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(message.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs">
                          <div className="truncate">{message.message}</div>
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <button
                            onClick={() => viewMessage(message)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete("messages", message.id, `message from ${message.name}`)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {getFilteredData().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No matching records found." : `No ${activeTab} data available.`}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContentManager;