'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Newspaper, 
  Megaphone,
  GalleryHorizontal,
  Plus,
  UserCircle
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "News/Articles", path: "/news", icon: Newspaper },
    { name: "Announcements", path: "/announcements", icon: Megaphone },
    { name: "Carousel", path: "/carousel", icon: GalleryHorizontal },
  ];

  const getPageInfo = () => {
    const current = navItems.find(item => item.path === pathname);
    if (!current) {
       if (pathname === "/student-life") return { name: "Student Life", action: "Add Section" };
       if (pathname === "/programs") return { name: "Programs", action: "Add Program" };
       return { name: "Dashboard", action: "New Report" };
    }
    
    const actions: Record<string, string> = {
      "/": "New Report",
      "/news": "Create New Article",
      "/announcements": "Post Announcement",
      "/carousel": "Add Slide",
    };

    return {
      name: current.name,
      action: actions[current.path] || "Global Action"
    };
  };

  const { name: pageTitle, action: globalAction } = getPageInfo();

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Fixed Sidebar (Navy Blue) */}
      <aside className="w-72 bg-[#0A192F] text-white flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-black text-white italic">E</div>
            <h1 className="text-xl font-black tracking-tight uppercase">Command <span className="text-orange-500 text-sm">Center</span></h1>
          </div>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">University Engineering</p>
        </div>
        
        <nav className="flex-1 py-4">
          <div className="px-4 mb-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Management</div>
          <ul className="space-y-1.5 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    pathname === item.path
                      ? "bg-white/10 text-white shadow-lg ring-1 ring-white/20" 
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === item.path ? "text-orange-500" : "")} />
                  <span className="text-sm font-bold tracking-tight">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-4 mt-8 mb-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Student Portal</div>
          <ul className="space-y-1.5 px-3">
             <li>
                <Link href="/student-life" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-bold text-sm", pathname === "/student-life" && "bg-white/10 text-white")}>
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] border border-white/20 rounded">SL</span>
                  Student Life
                </Link>
             </li>
             <li>
                <Link href="/programs" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-bold text-sm", pathname === "/programs" && "bg-white/10 text-white")}>
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] border border-white/20 rounded">AP</span>
                  Programs
                </Link>
             </li>
          </ul>
        </nav>

        {/* User Profile (Bottom-aligned) */}
        <div className="p-6 mt-auto bg-black/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center border-2 border-white/10">
                <UserCircle className="w-8 h-8 text-white/80" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#0A192F] rounded-full"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black truncate">Dr. Elizabeth Grant</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded uppercase font-black">Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* White Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{pageTitle}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connected to main server</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="h-10 w-px bg-gray-100 mx-4"></div>
             <button className="flex items-center gap-2 px-6 py-3 bg-[#0A192F] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#112240] transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              <Plus className="w-4 h-4 text-orange-500" />
              {globalAction}
            </button>
          </div>
        </header>

        {/* Scrollable Content Container (Light Gray Canvas) */}
        <section className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
