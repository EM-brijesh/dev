//import React, { ReactNode } from "react";
import { Calendar, MapPin, Users } from 'lucide-react';
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  desc: string;
  time: string;
  location: string;
  count: string;
}

const Card: React.FC<CardProps> = ({ title, desc, time, location, count }) => {
  return (
    <motion.div
      className="flex items-center justify-center h-72 w-54 bg-blue-800 rounded-2xl shadow-lg"
      initial={{ x: -4 }}
      animate={{ x: 4, y: [-4, 4, -4] }}
      transition={{ duration: 1, yoyo: Infinity, ease: "linear" }}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
        <p className="text-gray-400 mb-6">{desc}</p>
        <div className="flex items-center text-gray-400 mb-6">
          <Calendar className="mr-2" />
          <span>{time}</span>
        </div>
        <div className="flex items-center text-gray-400 mb-6">
          <MapPin className="mr-2" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-gray-400 mb-6">
          <Users className="mr-2" />
          <span>{count}</span>
        </div>
        <button className="bg-white text-blue-600 rounded-md px-4 py-2">
          Join Event
        </button>
      </div>
    </motion.div>
  );
};

export default Card;