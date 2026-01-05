"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserCog, Activity } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface Stats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  guestUsers: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    guestUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/users/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: UserCog,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Regular Users",
      value: stats.regularUsers,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Guest Users",
      value: stats.guestUsers,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Welcome Section */}
      <div className="relative">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {session?.user?.name}!
        </h1>
        <p className="text-slate-400 mt-2">
          Here's what's happening with your user management system today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {card.title}
                </CardTitle>
                <div className={`${card.bgColor} p-2 rounded-lg bg-opacity-20`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loading ? (
                    <div className="h-8 w-16 bg-slate-700 animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {card.title.toLowerCase()} in the system
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/users"
              className="flex items-center gap-3 p-4 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
            >
              <Users className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-white">Manage Users</p>
                <p className="text-sm text-slate-400">
                  View and edit users
                </p>
              </div>
            </a>

            <a
              href="/users"
              className="flex items-center gap-3 p-4 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer"
            >
              <UserCog className="h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-white">Add New User</p>
                <p className="text-sm text-slate-400">
                  Create user account
                </p>
              </div>
            </a>

            <a
              href="/dashboard/settings"
              className="flex items-center gap-3 p-4 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 hover:border-green-500/50 transition-all duration-300 group cursor-pointer"
            >
              <Activity className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-medium text-white">System Settings</p>
                <p className="text-sm text-slate-400">
                  Configure system
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}