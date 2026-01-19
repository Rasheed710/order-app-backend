"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/app/components/AdminLayout";
import { useAuth } from "@/app/context/Authcontext";

export default function NotificationsPage() {
  const { fetchWithAuth } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [meta, setMeta] = useState({ totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(false);

  // Send form states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Filter states
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [senderId, setSenderId] = useState("");

  // ✅ Load users & notification history
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, historyRes] = await Promise.all([
          fetchWithAuth("/api/admin/users"),
          fetchWithAuth(`/api/admin/notifications/history?page=1&limit=10`),
        ]);
        const usersData = await usersRes.json();
        const historyData = await historyRes.json();
        setUsers(Array.isArray(usersData) ? usersData : usersData?.data || []);
        setHistory(historyData?.data || []);
        setMeta(historyData?.meta || { totalPages: 1, page: 1 });
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  // ✅ Fetch history with filters
  const fetchHistory = async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
      search,
      date,
      senderId,
    });
    const res = await fetchWithAuth(`/api/admin/notifications/history?${params}`);
    const data = await res.json();
    setHistory(data.data);
    setMeta(data.meta);
    setLoading(false);
  };

  // ✅ Send notification
  const handleSend = async () => {
    if (!title || !body) return alert("Please fill out all fields");
    setLoading(true);

    const payload: any = { title, body };
    if (sendToAll) payload.sendToAll = true;
    else payload.userIds = selectedUsers;

    const res = await fetchWithAuth("/api/admin/notifications/send", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("✅ Notification sent!");
      setTitle("");
      setBody("");
      fetchHistory(1);
    } else {
      alert("❌ Failed to send notification");
    }
    setLoading(false);
  };

  const filteredUsers =
    roleFilter === "ALL" ? users : users.filter((u) => u.role === roleFilter);

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  return (
    <AdminLayout title="Notifications">
      <Head>
        <title>Notifications | Admin Dashboard</title>
      </Head>

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🔔 Notifications</h1>

        {/* Send Notification Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <input
            spellCheck={false}
            className="w-full p-2 border rounded mb-3"
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            spellCheck={false}
            className="w-full p-2 border rounded mb-3 h-24"
            placeholder="Message Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={sendToAll}
              onChange={() => setSendToAll(!sendToAll)}
              className="mr-2"
            />
            <label className="text-gray-700">Send to all users</label>
          </div>

          {!sendToAll && (
            <>
              <div className="flex items-center mb-3 space-x-2">
                <label className="text-sm text-gray-600">Filter by role:</label>
                <select
                  className="border p-1 rounded text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">All</option>
                  <option value="SALESMAN">Salesman</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="max-h-64 overflow-y-auto border rounded-lg">
                {Array.isArray(filteredUsers) &&
                  filteredUsers.map((u) => (
                    <label
                      key={u.id}
                      className="flex items-center justify-between p-2 border-b hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(u.id)}
                        onChange={() => toggleUserSelection(u.id)}
                      />
                    </label>
                  ))}
              </div>
            </>
          )}

          <button
            disabled={loading}
            onClick={handleSend}
            className={`mt-5 w-full py-2 rounded text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>

        {/* Notification History */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📜 Notification History</h2>

            {/* Filters */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search title or message"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-1 rounded text-sm"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-1 rounded text-sm"
              />
              <select
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                className="border p-1 rounded text-sm"
              >
                <option value="">All Senders</option>
                {users
                  .filter((u) => u.role === "ADMIN")
                  .map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name}
                    </option>
                  ))}
              </select>
              <button
                onClick={() => fetchHistory(1)}
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded"
              >
                Filter
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500">No notifications found.</p>
          ) : (
            <>
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Message</th>
                    <th className="px-4 py-2 text-left">Recipients</th>
                    <th className="px-4 py-2 text-left">Sender</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((n) => (
                    <tr key={n.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold">{n.title}</td>
                      <td className="px-4 py-2">{n.body}</td>
                      <td className="px-4 py-2">
                        {n.sendToAll
                          ? "All Users"
                          : `${n.recipientIds?.split(",").length || 0} Users`}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {n.sender?.name || "—"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {new Date(n.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => fetchHistory(meta.page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => fetchHistory(meta.page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
