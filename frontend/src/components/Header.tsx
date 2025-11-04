import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { RootState, AppDispatch } from "../store";
import { fetchNotifications } from "../services/memberApi";
import type { Notification } from "./interfaces/commonInterface";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        if (!user?.role) return;
        const data = await fetchNotifications(user?.role);
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadNotifications();
  }, [user]);

  const handleToggleDropdown = async () => {
    const willShow = !showDropdown;
    setShowDropdown(willShow);
    if (willShow && notifications.length === 0) {
      if (!user?.role) return;
      await fetchNotifications(user?.role);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <header className="h-[10vh] flex justify-end items-center p-4 bg-gray-100 shadow gap-6 pr-8 relative">
      {/* 🔔 Notification Bell */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleToggleDropdown}
          className="relative cursor-pointer hover:scale-105 transition"
        >
          <Bell className="w-6 h-6 text-gray-700" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            <div className="p-3 border-b font-semibold text-gray-700">
              Notifications
            </div>
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Loading...
                </p>
              ) : notifications.length > 0 ? (
                notifications.map((note) => (
                  <div
                    key={note._id}
                    className="p-3 text-sm hover:bg-gray-50 transition border-b last:border-b-0"
                  >
                    <p className="text-gray-800">{note.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No notifications
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🚪 Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
