// "use client";

// import { useEffect, useState } from "react";
// import Head from "next/head";
// import AdminLayout from "@/app/components/AdminLayout";
// import { useAuth } from "@/app/context/Authcontext";

// interface Attendance {
//   id: string;
//   clockInTime: string;
//   clockOutTime?: string | null;
//   location?: string | null;
//   totalOrders: number;
//   totalSales: number;
//   user: {
//     id: string;
//     name: string;
//     email?: string | null;
//   };
// }

// export default function AttendanceOverviewPage() {
//   const { fetchWithAuth } = useAuth();
//   const [attendances, setAttendances] = useState<Attendance[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filtered, setFiltered] = useState<Attendance[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetchWithAuth("/api/admin/attendance");
//         const data = await res.json();
//         setAttendances(data);
//         setFiltered(data);
//       } catch (err) {
//         console.error("Fetch attendance error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!search) {
//       setFiltered(attendances);
//     } else {
//       const q = search.toLowerCase();
//       setFiltered(
//         attendances.filter((a) =>
//           a.user.name.toLowerCase().includes(q)
//         )
//       );
//     }
//   }, [search, attendances]);

//   const getDuration = (clockIn: string, clockOut?: string | null) => {
//     if (!clockOut) return "Active";
//     const start = new Date(clockIn);
//     const end = new Date(clockOut);
//     const diffMs = end.getTime() - start.getTime();
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     return `${hours}h ${mins}m`;
//   };

//   const isActive = (clockOut?: string | null) => !clockOut;

//   return (
//     <AdminLayout title="Attendance Overview">
//       <Head>
//         <title>Attendance | Admin Dashboard</title>
//       </Head>

//       <div className="p-1">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Attendance Overview</h1>
//         </div>

//         {/* Search */}
//         <div className="mb-4 flex justify-between items-center">
//           <input
//             type="text"
//             placeholder="Search Salesman..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded w-64 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto bg-white rounded-lg shadow">
//           {loading ? (
//             <p className="p-6 text-gray-500">Loading attendance...</p>
//           ) : filtered.length === 0 ? (
//             <p className="p-6 text-gray-500 text-center">No attendance records found today.</p>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Salesman</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Clock In</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Clock Out</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Duration</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Orders</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Sales</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Location</th>
//                   <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Status</th>
//                 </tr>
//               </thead>

//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filtered.map((a) => (
//                   <tr key={a.id} className="hover:bg-gray-50 transition">
//                     <td className="px-6 py-4 font-semibold">{a.user.name}</td>
//                     <td className="px-6 py-4">{new Date(a.clockInTime).toLocaleTimeString()}</td>
//                     <td className="px-6 py-4">
//                       {a.clockOutTime
//                         ? new Date(a.clockOutTime).toLocaleTimeString()
//                         : "—"}
//                     </td>
//                     <td className="px-6 py-4">{getDuration(a.clockInTime, a.clockOutTime)}</td>
//                     <td className="px-6 py-4 text-center">{a.totalOrders}</td>
//                     <td className="px-6 py-4 font-medium text-green-700">
//                       ₹{a.totalSales.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 text-gray-500 text-sm">
//                       {a.location || "N/A"}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           isActive(a.clockOutTime)
//                             ? "bg-green-100 text-green-700"
//                             : "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {isActive(a.clockOutTime) ? "Active" : "Completed"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/app/components/AdminLayout";
import { useAuth } from "@/app/context/Authcontext";

interface Attendance {
  id: string;
  clockInTime: string;
  clockOutTime?: string | null;
  breakStart?: string | null;
  breakEnd?: string | null;
  isOnBreak: boolean;
  breakDuration?: string | null;
  location?: string | null;
  totalOrders: number;
  totalSales: number;
  user: {
    id: string;
    name: string;
    email?: string | null;
  };
}

export default function AttendanceOverviewPage() {
  const { fetchWithAuth } = useAuth();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [filtered, setFiltered] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState({
    totalActive: 0,
    totalOnBreak: 0,
    totalBreakMinutes: 0,
  });

  // 🗓️ Date range filters
  const [fromDate, setFromDate] = useState<string>(
    new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0]
  );
  const [toDate, setToDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // ✅ Fetch Attendance Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithAuth("/api/admin/attendance");
        const data = await res.json();
        setAttendances(data);
      } catch (err) {
        console.error("Fetch attendance error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter by search and date range
  useEffect(() => {
    const filteredByDate = attendances.filter((a) => {
      const date = new Date(a.clockInTime);
      return date >= new Date(fromDate) && date <= new Date(toDate + "T23:59:59");
    });

    const filteredByName = search
      ? filteredByDate.filter((a) =>
          a.user.name.toLowerCase().includes(search.toLowerCase())
        )
      : filteredByDate;

    setFiltered(filteredByName);
    recalcSummary(filteredByName);
  }, [fromDate, toDate, search, attendances]);

  // ✅ Summary computation
  const recalcSummary = (data: Attendance[]) => {
    const totalActive = data.filter((a) => !a.clockOutTime).length;
    const totalOnBreak = data.filter((a) => a.isOnBreak).length;

    let totalBreakMinutes = 0;
    data.forEach((a) => {
      if (a.breakStart && a.breakEnd) {
        const diffMs =
          new Date(a.breakEnd).getTime() - new Date(a.breakStart).getTime();
        totalBreakMinutes += Math.floor(diffMs / 60000);
      }
    });

    setSummary({ totalActive, totalOnBreak, totalBreakMinutes });
  };

  const getDuration = (clockIn: string, clockOut?: string | null) => {
    if (!clockOut) return "Active";
    const diffMs = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  const formatTotalBreakTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
console.log(attendances,'resss')
  return (
    <AdminLayout title="Attendance Overview">
      <Head>
        <title>Attendance | Admin Dashboard</title>
      </Head>

      <div className="p-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Attendance Overview
          </h1>
        </div>

        {/* 🔹 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 text-green-800 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Active Salesmen</h3>
            <p className="text-2xl font-bold mt-2">{summary.totalActive}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">On Break</h3>
            <p className="text-2xl font-bold mt-2">{summary.totalOnBreak}</p>
          </div>
          <div className="bg-blue-100 text-blue-800 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">Total Break Time</h3>
            <p className="text-2xl font-bold mt-2">
              {formatTotalBreakTime(summary.totalBreakMinutes)}
            </p>
          </div>
        </div>

        {/* 🔹 Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-grow" />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Search Salesman
            </label>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 🔹 Attendance Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {loading ? (
            <p className="p-6 text-gray-500">Loading attendance...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">
              No attendance records for selected dates.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                    Salesman
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                    Break
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((a) => {
                  const isActive = !a.clockOutTime;
                  const isOnBreak = a.isOnBreak;

                  return (
                    <tr key={a.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold">{a.user.name}</td>
                      <td className="px-6 py-4">
                        {new Date(a.clockInTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {a.clockOutTime
                          ? new Date(a.clockOutTime).toLocaleString()
                          : "—"}
                      </td>

                      {/* Break Info */}
                      <td className="px-6 py-4 text-center">
                        {isOnBreak ? (
                          <span className="text-yellow-700 font-semibold bg-yellow-100 px-2 py-1 rounded">
                            On Break
                          </span>
                        ) : a.breakDuration ? (
                          <span className="text-gray-600">
                            {a.breakDuration}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {getDuration(a.clockInTime, a.clockOutTime)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {a.totalOrders}
                      </td>
                      <td className="px-6 py-4 font-medium text-green-700">
                        ₹{a.totalSales.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            isOnBreak
                              ? "bg-yellow-100 text-yellow-800"
                              : isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isOnBreak
                            ? "On Break"
                            : isActive
                            ? "Active"
                            : "Completed"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
