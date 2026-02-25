import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { supabase } from "../supabaseClient";

interface Winner {
  id: number;
  year: string;
  name: string;
  position: string;
  school: string;
  state: string;
  photo: string;
}

interface Finalist {
  id: number;
  year: string;
  name: string;
  school: string;
  state: string;
}

const Alumni: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [finalists, setFinalists] = useState<Finalist[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: winnersData, error: winnersError } = await supabase
        .from("alumni_winners")
        .select("*")
        .order("year", { ascending: false });

      const { data: finalistsData, error: finalistsError } = await supabase
        .from("alumni_finalists")
        .select("*")
        .order("year", { ascending: false });

      if (winnersError) console.error("Winners fetch error:", winnersError);
      if (finalistsError) console.error("Finalists fetch error:", finalistsError);

      if (winnersData) {
        setWinners(winnersData);
        const uniqueYears = Array.from(
          new Set(winnersData.map((w) => w.year))
        ).sort((a, b) => parseInt(b) - parseInt(a));
        setYears(uniqueYears);
        setSelectedYear(uniqueYears[0]);
      }
      if (finalistsData) setFinalists(finalistsData);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-gray-100">
      <Navbar />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center py-24 px-6 md:px-16 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <h1 className="text-5xl md:text-6xl font-extralight text-gray-800 mb-4 tracking-tight">
          Distinguished Alumni
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Celebrating champions and finalists who illuminated the BrainPro Olympiad — the trailblazers of tomorrow.
        </p>
      </motion.section>

      {/* Year Filter */}
      <div className="flex justify-center gap-4 mt-10 mb-10 flex-wrap">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-5 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${
              selectedYear === year
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Winners Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <h2 className="text-center text-2xl font-light text-gray-700 mb-12">
          Medal Winners — {selectedYear}
        </h2>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence>
            {winners
              .filter((w) => w.year === selectedYear)
              .map((winner, index) => (
                <motion.div
                  key={winner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    boxShadow:
                      "0 15px 25px rgba(0,0,0,0.1), 0 0 20px rgba(59,130,246,0.15)",
                  }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center"
                >
                  <div
                    className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-5 ${
                      winner.position.includes("1st")
                        ? "bg-yellow-100"
                        : winner.position.includes("2nd")
                        ? "bg-gray-100"
                        : "bg-amber-100"
                    }`}
                  >
                    {winner.position}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {winner.name}
                  </h3>
                  <p className="text-sm text-gray-600">{winner.school}</p>
                  <p className="text-xs text-blue-600 mt-1">{winner.state} STATE</p>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Finalists Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <h2 className="text-center text-2xl font-light text-gray-700 mb-10">
          Distinguished Finalists — {selectedYear}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {finalists
            .filter((f) => f.year === selectedYear)
            .map((f, index) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#f8fafc",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                }}
                className="bg-white rounded-xl border border-gray-100 p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  {f.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h4 className="text-gray-800 text-base font-medium">{f.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{f.school}</p>
                <p className="text-xs text-blue-600 mt-1">{f.state}</p>
              </motion.div>
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Alumni;
