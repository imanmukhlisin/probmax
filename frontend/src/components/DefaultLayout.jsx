import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { useEffect, useState } from "react";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const location = useLocation();

  // Fetch user data on mount
  useEffect(() => {
    if (token && !user.id) {
      axiosClient.get('/user')
        .then(({ data }) => {
          setUser(data);
        })
        .catch(() => {
          // If user fetch fails, logout
          setToken(null);
        });
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
      setIsOpen(false);
  }, [location]);

  if (!token) {
    return <Navigate to="/home" />
  }

  // Show loading state while user data is being fetched
  if (!user || !user.username) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat...</p>
        </div>
      </div>
    );
  }

  const onLogout = (ev) => {
    ev.preventDefault()

    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  const navLinks = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Cek Harian', path: '/daily-check', role: 3 }, // User only
      { name: 'PMC Game', path: '/pmc-game', role: 3 }, // User only
      { name: 'LiveChat AI', path: '/chat-ai' },
      { name: 'Janji Konseling', path: '/appointments', role: 3 },
      { name: 'Jadwal Konsultan', path: '/schedules', role: 3 },
      { name: 'Kelola User', path: '/user-management', role: 1 },
  ];

  return (
    <div id="defaultLayout" className="min-h-screen bg-background font-sans">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20">
                  {/* Logo / Brand */}
                  <div className="flex items-center">
                      <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2 group">
                          <span className="text-3xl group-hover:scale-110 transition-transform duration-200">🌿</span>
                          <span className="text-primary-dark font-bold text-xl tracking-tight">ProbmaxCare</span>
                      </Link>
                      {/* Desktop Menu */}
                      <div className="hidden md:ml-10 md:flex md:space-x-2">
                          {navLinks.map(link => (
                              (!link.role || link.role === user.role_id) && (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        location.pathname === link.path 
                                        ? 'bg-primary text-white shadow-md shadow-primary/30' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                              )
                          ))}
                      </div>
                  </div>

                  {/* Right Side (Profile & Mobile Toggle) */}
                  <div className="flex items-center">
                      <div className="hidden md:flex items-center space-x-6">
                          <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium group">
                              <div className="w-8 h-8 rounded-full bg-secondary-light text-secondary flex items-center justify-center font-bold text-sm group-hover:bg-secondary group-hover:text-white transition-colors">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <span className="group-hover:translate-x-1 transition-transform">{user.username || 'User'}</span>
                          </Link>
                          <button onClick={onLogout} className="text-gray-400 hover:text-accent-red font-medium text-sm transition-colors transform hover:scale-105">
                              Logout
                          </button>
                      </div>
                      
                      {/* Mobile menu button */}
                      <div className="md:hidden flex items-center">
                          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-primary focus:outline-none p-2 rounded-lg hover:bg-gray-50 transition-colors">
                              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  {isOpen ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                  )}
                              </svg>
                          </button>
                      </div>
                  </div>
              </div>
          </div>

          {/* Mobile Menu (Drawer) */}
          <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
              {/* Backdrop */}
              <div 
                className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setIsOpen(false)}
              ></div>
              
              {/* Drawer Content */}
              <div className={`absolute top-0 right-0 w-72 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out p-6 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                  <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-2">
                          <span className="text-2xl">🌿</span>
                          <span className="text-primary-dark font-bold">ProbmaxCare</span>
                      </div>
                      <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                  </div>

                  <div className="space-y-4">
                      {navLinks.map(link => (
                           (!link.role || link.role === user.role_id) && (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                                    location.pathname === link.path 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                }`}
                            >
                                <span>{link.name}</span>
                            </Link>
                          )
                      ))}
                      <div className="border-t border-gray-100 mt-6 pt-6">
                            <div className="flex items-center gap-3 px-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-secondary-light text-secondary flex items-center justify-center font-bold text-sm">
                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="truncate">
                                    <div className="font-bold text-gray-800 leading-tight">{user.username}</div>
                                    <div className="text-xs text-gray-400">{user.email}</div>
                                </div>
                            </div>

                          <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50 hover:text-primary mb-2">
                              Profil Saya
                          </Link>
                          <button onClick={onLogout} className="w-full text-left block px-4 py-3 rounded-xl text-base font-bold text-accent-red hover:bg-red-50 transition-colors">
                              Keluar Aplikasi
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 px-4">
        {notification && (
            <div className="bg-green-100 border-l-4 border-accent-green text-green-800 p-4 mb-6 shadow-sm rounded-r-lg flex items-center justify-between animate-fade-in-down">
                <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {notification}
                </span>
            </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
