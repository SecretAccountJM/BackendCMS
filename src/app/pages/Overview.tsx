'use client'

import React, { useEffect, useState } from "react";
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
import { TrendingUp, Users, Eye, FileText, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { apiFetch } from "../lib/api";

interface AnalyticsData {
  total_page_views: number;
  total_articles: number;
  student_engagement: number;
  active_admins: number;
  traffic_overview: Array<{ name: string; views: number }>;
  post_frequency: Array<{ name: string; posts: number }>;
  last_updated: string;
}

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="ceit-card p-4 transition-shadow">
    <div className="flex justify-between items-start">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <div className="mt-3">
      <h3 className="text-xs font-medium text-gray-500">{title}</h3>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

export function Overview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<AnalyticsData>("/articles/admin/analytics")
      .then(setAnalytics)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-600">Failed to load analytics: {error}</p>
      </div>
    );
  }

  const chartData = analytics.traffic_overview.map((t, i) => ({
    name: t.name,
    views: t.views,
    posts: analytics.post_frequency[i]?.posts ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Page Views"
          value={analytics.total_page_views.toLocaleString()}
          icon={Eye}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Articles"
          value={analytics.total_articles.toLocaleString()}
          icon={FileText}
          color="bg-purple-500"
        />
        <StatCard
          title="Student Engagement"
          value={`${analytics.student_engagement}%`}
          icon={Users}
          color="bg-orange-500"
        />
        <StatCard
          title="Active Admins"
          value={analytics.active_admins.toLocaleString()}
          icon={TrendingUp}
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ceit-card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Traffic Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
              <BarChart data={chartData}>
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
