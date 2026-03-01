'use client'

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { TrendingUp, Users, Eye, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react";

const data = [
  { name: "Mon", views: 400, posts: 24 },
  { name: "Tue", views: 300, posts: 13 },
  { name: "Wed", views: 200, posts: 98 },
  { name: "Thu", views: 278, posts: 39 },
  { name: "Fri", views: 189, posts: 48 },
  { name: "Sat", views: 239, posts: 38 },
  { name: "Sun", views: 349, posts: 43 },
];

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <div className="ceit-card p-4 transition-shadow">
    <div className="flex justify-between items-start">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className={`flex items-center gap-0.5 text-xs font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
        {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <div className="mt-3">
      <h3 className="text-xs font-medium text-gray-500">{title}</h3>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

export function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Page Views" 
          value="12,482" 
          change="12.5%" 
          trend="up" 
          icon={Eye} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Articles" 
          value="156" 
          change="8.2%" 
          trend="up" 
          icon={FileText} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Student Engagement" 
          value="84%" 
          change="3.1%" 
          trend="down" 
          icon={Users} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Active Admins" 
          value="12" 
          change="0%" 
          trend="up" 
          icon={TrendingUp} 
          color="bg-green-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ceit-card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Traffic Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 11}} />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ceit-card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Post Frequency</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 11}} />
                <Tooltip />
                <Bar dataKey="posts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
