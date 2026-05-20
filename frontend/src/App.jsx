import Login from "./Login";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";import { useEffect, useState } from "react";
import axios from "axios";


function App() {
  const [retailers, setRetailers] = useState([]);
  const [priorityRetailers, setPriorityRetailers] = useState([]);
  const [weatherRisk, setWeatherRisk] = useState([]);
  const [salesPrediction, setSalesPrediction] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("loggedIn") === "true"
);
  const [messages, setMessages] = useState([
  {
    sender: "bot",
    text: "Hello 👋 I am Agri AI Assistant. Ask me about sales, weather risk, or retailers."
  }
]);

const [input, setInput] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [darkMode, setDarkMode] = useState(true);
const [showAlert, setShowAlert] = useState(true);
 useEffect(() => {

  axios
    .get("http://127.0.0.1:8000/priority-retailers")
    .then((response) => {
      setPriorityRetailers(response.data);
    })
    .catch((error) => {
      console.error(error);
    });

  axios
    .get("http://127.0.0.1:8000/retailers")
    .then((response) => {
      setRetailers(response.data);
    })
    .catch((error) => {
      console.error(error);
    });

  // ADD HERE
  axios
    .get("http://127.0.0.1:8000/weather-risk")
    .then((response) => {
      setWeatherRisk(response.data);
    })
    .catch((error) => {
      console.error(error);
    });


  axios
    .get("http://127.0.0.1:8000/sales-prediction")
    .then((response) => {
      setSalesPrediction(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);
const pieData = [
  { name: "High Risk", value: 12 },
  { name: "Medium Risk", value: 8 },
  { name: "Low Risk", value: 20 }
];
if (!isLoggedIn) {
  return <Login onLogin={() => setIsLoggedIn(true)} />;
}
const sendMessage = () => {

  if (!input.trim()) return;

  const userMessage = {
    sender: "user",
    text: input
  };
  // SHOW USER MESSAGE IMMEDIATELY
  setMessages((prev) => [
    ...prev,
    userMessage
  ]);
axios.post("http://127.0.0.1:8000/chatbot", {
  message: input
})

.then((response) => {

  const botMessage = {
    sender: "bot",
    text: response.data.reply
  };

  setMessages((prev) => [
    ...prev,
    botMessage
  ]);

})



.catch((error) => {
  console.error(error);
});

setInput(""); 
};const chartData = [
  { name: "High", score: 95 },
  { name: "Medium", score: 70 },
  { name: "Low", score: 40 }
];
const predictionChartData = salesPrediction.map((item) => ({
  week: `Week ${item.future_week}`,
  sales: item.predicted_sales
}));
const filteredRetailers = retailers.filter((retailer) =>
  Object.values(retailer)
    .join(" ")
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);
const downloadCSV = () => {

  const rows = [
    ["Retailer", "Priority Score"],

    ...priorityRetailers.map((r) => [
      r.retailer_id,
      r.priority_score
    ])
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);

  const link = document.createElement("a");

  link.setAttribute("href", encodedUri);

  link.setAttribute(
    "download",
    "agri_ai_report.csv"
  );

  document.body.appendChild(link);

  link.click();
};
const startVoiceRecognition = () => {

  const recognition =
    new window.webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    setInput(transcript);
  };

  recognition.start();
};
  return (
   <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('/background.png')"
  }}
>

      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-green-400">
          Agri AI Intelligence Dashboard 🌾
        </h1>
        <button
  onClick={() => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
  }}
  className="mt-4 bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-bold"
>
  Logout
</button>
    <p className="text-gray-400 mt-3">
  Real-time agricultural sales intelligence system
</p>

<div className="flex gap-4 mt-4">

  <button
    onClick={() => setDarkMode(!darkMode)}
    className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl font-bold"
  >
    Toggle Theme
  </button>

  <button
    onClick={() => window.print()}
    className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-bold"
  >
    Export AI Report
  </button>

  <button
    onClick={downloadCSV}
    className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-xl font-bold text-black"
  >
    Download CSV
  </button>

</div>   
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400">Total Retailers</h2>
          <p className="text-4xl font-bold text-green-400 mt-2">
            {retailers.length}
          </p>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400">High Priority</h2>
          <p className="text-4xl font-bold text-red-400 mt-2">
            12
          </p>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400">Risk Districts</h2>
          <p className="text-4xl font-bold text-yellow-400 mt-2">
            5
          </p>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-2xl shadow-lg">
          <h2 className="text-gray-400">Demand Growth</h2>
          <p className="text-4xl font-bold text-blue-400 mt-2">
            +18%
          </p>
        </div>

      </div>

      {/* AI ALERT BOX */}
      <div className="bg-red-500/20 border border-red-500 p-5 rounded-2xl mb-10">
        <h2 className="text-2xl font-bold text-red-400">
          ⚠ AI Alert
        </h2>

        <p className="mt-2 text-gray-300">
          AI detected high fungicide demand surge in rainfall-heavy districts.
        </p>
        <p className="text-yellow-300 mt-2">
            Live ML prediction confidence: 92.4%
        </p>
      </div>
      {/* ANALYTICS SECTION */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

  {/* BAR CHART */}

  <div className="bg-[#1E293B] p-6 rounded-2xl">

    <h2 className="text-2xl font-bold mb-5 text-cyan-400">
      📈 Priority Retailer Analytics
    </h2>

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={chartData}>

        <XAxis dataKey="name" stroke="#ffffff" />
        <YAxis stroke="#ffffff" />
        <Tooltip />

        <Bar dataKey="score" fill="#22c55e" radius={[10,10,0,0]} />

      </BarChart>

    </ResponsiveContainer>

  </div>

  {/* PIE CHART */}

  <div className="bg-[#1E293B] p-6 rounded-2xl">

    <h2 className="text-2xl font-bold mb-5 text-pink-400">
      🧠 Risk Distribution
    </h2>

    <ResponsiveContainer width="100%" height={300}>

      <PieChart>

        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
          label
        >

          <Cell fill="#ef4444" />
          <Cell fill="#facc15" />
          <Cell fill="#22c55e" />

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>
<div className="mt-10">
  <h2 className="text-3xl font-bold text-yellow-400 mb-6">
    Weather Risk Districts
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {weatherRisk.map((item, index) => (
      <div
        key={index}
        className="bg-[#1E293B] p-6 rounded-2xl shadow-lg"
      >
        <h3 className="text-2xl font-bold text-white mb-2">
          {item.district}
        </h3>

        <p className="text-blue-300">
          Rainfall: {item.rainfall_mm?.toFixed(2)}
        </p>

        <p className="text-green-300">
          Temperature: {item.temperature_c?.toFixed(2)}
        </p>

        <p className="text-pink-300">
          Humidity: {item.humidity_percent?.toFixed(2)}
        </p>
      </div>
    ))}

  </div>
</div>
{/* WEATHER RISK DISTRICTS */}

<div className="mb-10">
  <h2 className="text-3xl font-bold text-yellow-400 mb-6">
    🌧️ Weather Risk Districts
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {weatherRisk.map((district, index) => (
      <div
        key={index}
        className="bg-[#1E293B] rounded-2xl p-6 border border-yellow-500"
      >
        <h3 className="text-2xl font-bold text-yellow-300 mb-3">
          {district.district}
        </h3>

        <p className="text-gray-300">
          Rainfall:
          <span className="text-blue-400 font-bold ml-2">
            {district.rainfall_mm?.toFixed(1)} mm
          </span>
        </p>

        <p className="text-gray-300 mt-2">
          Humidity:
          <span className="text-cyan-400 font-bold ml-2">
            {district.humidity_percent?.toFixed(1)} %
          </span>
        </p>

        <p className="text-gray-300 mt-2">
          Temperature:
          <span className="text-orange-400 font-bold ml-2">
            {district.temperature_c?.toFixed(1)} °C
          </span>
        </p>
      </div>
    ))}

  </div>
</div>
{/* ML SALES PREDICTION */}

<div className="bg-[#1E293B] p-6 rounded-2xl mb-10">

  <h2 className="text-3xl font-bold text-green-400 mb-6">
    🤖 AI Sales Forecast
  </h2>

  <ResponsiveContainer width="100%" height={300}>

    <BarChart data={predictionChartData}>

      <XAxis dataKey="week" stroke="#ffffff" />

      <YAxis stroke="#ffffff" />

      <Tooltip />

      <Bar
        dataKey="sales"
        fill="#22c55e"
        radius={[10,10,0,0]}
      />

    </BarChart>

  </ResponsiveContainer>

</div>
<input
  type="text"
  placeholder="Search retailers..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="mb-5 p-3 rounded-xl bg-gray-800 text-white w-full"
/>
      {/* RETAILER TABLE */}{/* PRIORITY RETAILERS */}

<div className="mb-10">

  <h2 className="text-3xl font-bold mb-5 text-red-400">
    🔥 High Priority Retailers
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    {priorityRetailers.slice(0, 6).map((retailer, index) => (

      <div
        key={index}
        className="bg-[#1E293B] p-5 rounded-2xl border border-red-500 shadow-lg"
      >

        <h3 className="text-xl font-bold text-green-400">
          {retailer.retailer_id}
        </h3>

        <p className="mt-2">
          Priority Score:
          <span className="text-yellow-400 font-bold ml-2">
            {Math.round(retailer.priority_score)}
          </span>
        </p>

        <p className="mt-2">
          Inventory:
          <span className="ml-2">
            {Math.round(retailer.inventory_stock)}
          </span>
        </p>

        <p className="mt-2">
          Sales:
          <span className="ml-2">
            {Math.round(retailer.total_sales)}
          </span>
        </p>

        <div className="mt-4">

          <span className="
            bg-red-500
            px-3
            py-1
            rounded-full
            text-sm
            font-bold
          ">
            {retailer.priority_level}
          </span>

        </div>

      </div>

    ))}

  </div>

</div>
      <div className="bg-[#1E293B] rounded-2xl shadow-lg overflow-auto">

        <div className="p-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold">
            Retailer Intelligence
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-green-700">
            <tr>
              {retailers[0] &&
                Object.keys(retailers[0]).map((key) => (
                  <th
                    key={key}
                    className="p-3 border border-gray-700 text-left"
                  >
                    {key}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {filteredRetailers.map((retailer, index) => (
              <tr
                key={index}
                className="hover:bg-[#334155]"
              >
                {Object.values(retailer).map((value, i) => (
                  <td
                    key={i}
                    className="p-3 border border-gray-700"
                  >
                    {String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      {/* CHATBOT */}

<div className="bg-[#1E293B] p-6 rounded-2xl mt-10">

  <h2 className="text-3xl font-bold text-green-400 mb-5">
    🤖 Agri AI Chatbot
  </h2>

  <div className="h-72 overflow-y-auto bg-[#0B1120] p-4 rounded-xl mb-4">

    {messages.map((msg, index) => (

      <div
        key={index}
        className={`mb-3 ${
          msg.sender === "user"
            ? "text-right"
            : "text-left"
        }`}
      >

        <span
          className={`inline-block px-4 py-2 rounded-xl ${
            msg.sender === "user"
              ? "bg-green-500 text-black"
              : "bg-gray-700 text-white"
          }`}
        >
          {msg.text}
        </span>

      </div>  

    ))}

  </div>
  <div className="flex gap-3">

    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Ask Agri AI..."
      className="flex-1 p-3 rounded-xl bg-gray-800 text-white outline-none"
    />

    <button
  onClick={sendMessage}
  className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl font-bold text-black"
>
  Send
</button>

<button
  type="button"
  onClick={startVoiceRecognition}
  className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-xl font-bold"
>
  🎤
</button>

  </div>

</div>  
    </div>
  );
}

export default App;
