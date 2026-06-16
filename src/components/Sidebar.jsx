import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  ViewColumnsIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export function Sidebar({ isMobile = false, onNavClick }) {
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: HomeIcon,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Eisenhower Matrix",
      href: "/matrix",
      icon: ViewColumnsIcon,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Pomodoro Timer",
      href: "/timer",
      icon: ClockIcon,
      gradient: "from-red-500 to-pink-500",
    },
  ];

  const handleNavClick = () => {
    if (onNavClick) {
      onNavClick();
    }
  };

  if (isMobile) {
    return (
      <nav className="py-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center px-6 py-4 text-base font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white border-l-4 border-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <div
              className={`p-2 rounded-xl bg-gradient-to-r ${item.gradient} mr-4 shadow-lg`}
            >
              <item.icon className="h-5 w-5 text-white" />
            </div>
            {item.name}
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-purple-600 via-purple-700 to-indigo-800 shadow-2xl h-screen">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white">StudyBudy</h1>
        </div>
      </div>

      <nav className="px-6 space-y-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-6 py-4 text-base font-semibold rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <div
              className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} mr-4 shadow-lg`}
            >
              <item.icon className="h-6 w-6 text-white" />
            </div>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
