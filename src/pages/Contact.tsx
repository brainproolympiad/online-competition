// src/pages/Contact.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../supabaseClient"; 
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

const Contact: React.FC = () => {
  // 🧠 Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // 🧠 Handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧠 Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.message) {
      Swal.fire("Oops!", "Please fill in all required fields!", "warning");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("messages").insert([
      {
        full_name: formData.full_name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Insert error:", error);
      Swal.fire("Error", "Something went wrong. Try again!", "error");
    } else {
      Swal.fire(
        "Success!",
        "Your message has been sent successfully. We will get back to you soon.",
        "success"
      );
      setFormData({ full_name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 md:px-16 bg-gradient-to-r from-blue-50 to-indigo-50 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl font-light text-gray-800 mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-600 text-lg font-light">
            We’d love to hear from you! Whether you have a question about our
            programs, support, or partnership opportunities — our team is here
            to help.
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: <FaMapMarkerAlt />,
            title: "Address",
            info: "678 Trans-Amadi Layout, Port Harcourt",
            color: "from-blue-500 to-blue-600",
          },
          {
            icon: <FaEnvelope />,
            title: "Email",
            info: "info@brainproolympiad.gmail",
            color: "from-indigo-500 to-indigo-600",
          },
          {
            icon: <FaPhoneAlt />,
            title: "Phone",
            info: "+234 706 995 8609",
            color: "from-cyan-500 to-cyan-600",
          },
          {
            icon: <FaClock />,
            title: "Office Hours",
            info: "Mon - Fri: 9:00 AM - 4:00 PM",
            color: "from-purple-500 to-purple-600",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{
              y: -6,
              scale: 1.02,
              boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
            }}
            className="bg-white rounded-xl p-8 text-center border border-gray-100 transition-all duration-500"
          >
            <div
              className={`mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white text-xl shadow-md mb-5`}
            >
              {item.icon}
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm">{item.info}</p>
          </motion.div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="max-w-5xl mx-auto px-6 md:px-16 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 md:p-16"
        >
          <h2 className="text-3xl font-light text-center text-gray-800 mb-6">
            Send Us a Message
          </h2>
          <p className="text-center text-gray-500 mb-12 font-light">
            Fill the form below and we’ll get back to you shortly.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div>
              <label className="text-sm text-gray-600 block mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Email Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Your message subject"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                type="submit"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-medium shadow hover:shadow-lg transition-all duration-300 text-sm disabled:opacity-50"
              >
                <FaPaperPlane className="text-xs" />
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </section>

      {/* Google Map */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="rounded-2xl overflow-hidden shadow-md border border-gray-100"
        >
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.701574053427!2d7.020525674925813!3d4.817802040686284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cdbf4f2d8f31%3A0x40b09b7758b7ac54!2sTrans-Amadi%20Industrial%20Layout%2C%20Port%20Harcourt!5e0!3m2!1sen!2sng!4v1698774123456!5m2!1sen!2sng"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
