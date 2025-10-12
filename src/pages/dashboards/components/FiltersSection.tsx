// src/pages/dashboards/components/FiltersSection.tsx
import React from "react";
import type { Filters } from "../types/adminTypes";

interface FiltersSectionProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  uniqueClassLevels: string[];
  uniqueCourses: string[];
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  setFilters,
  uniqueClassLevels,
  uniqueCourses
}) => {
  return (
    <div className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-3">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search name or email..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={filters.classLevel}
          onChange={(e) => setFilters({...filters, classLevel: e.target.value})}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Classes</option>
          {uniqueClassLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        
        <select
          value={filters.course}
          onChange={(e) => setFilters({...filters, course: e.target.value})}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Courses</option>
          {uniqueCourses.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
        
        <select
          value={filters.paymentStatus}
          onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        
        <select
          value={filters.hasQuizLink}
          onChange={(e) => setFilters({...filters, hasQuizLink: e.target.value})}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Quiz Links</option>
          <option value="has_link">Has Link</option>
          <option value="no_link">No Link</option>
        </select>
      </div>
    </div>
  );
};

export default FiltersSection;