// src/pages/QuizLogin.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient";

const QuizLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [flyingObjects, setFlyingObjects] = useState<Array<{id: number, x: number, y: number, type: string}>>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate flying objects
  useEffect(() => {
    const objects = [];
    const types = ['math', 'science', 'physics', 'chemistry', 'biology'];
    
    for (let i = 0; i < (isMobile ? 8 : 12); i++) {
      objects.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
    
    setFlyingObjects(objects);

    // Show welcome message after a short delay
    setTimeout(() => {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 8000);
    }, 1000);
  }, [isMobile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !data) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Invalid Credentials",
          text: "Please check your email or password",
          background: '#0a0a0a',
          color: '#fff'
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Access Granted",
        text: "Redirecting to quiz entry...",
        timer: 1500,
        showConfirmButton: false,
        background: '#0a0a0a',
        color: '#fff'
      });

      setTimeout(() => {
        navigate("/quiz-link", {
          state: {
            participant: data,
          },
          replace: true
        });
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An error occurred during login",
        background: '#0a0a0a',
        color: '#fff'
      });
    }
  };

  const handleSocialLogin = async (provider: string) => {
    const loadingSwal = Swal.fire({
      title: `Connecting to ${provider}`,
      text: "Initializing secure authentication...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#0a0a0a',
      color: '#fff'
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    await loadingSwal;
    
    Swal.fire({
      icon: "warning",
      title: "Account Not Found",
      html: `
        <div class="text-center">
          <p class="mb-4">You have not registered with ${provider} on this platform.</p>
          <div class="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 mt-3">
            <p class="text-yellow-200 text-sm">
              Please use your BrainPro Olympiad email and password, or contact support.
            </p>
          </div>
        </div>
      `,
      confirmButtonText: "Use Email Login",
      background: '#0a0a0a',
      color: '#fff',
      confirmButtonColor: '#8b5cf6'
    });
  };

  const getFlyingObjectIcon = (type: string) => {
    switch(type) {
      case 'math': return '∫';
      case 'science': return '⚛';
      case 'physics': return 'Φ';
      case 'chemistry': return '⚗';
      case 'biology': return '🧬';
      default: return '★';
    }
  };

  const SocialIcon = ({ provider }: { provider: string }) => {
    switch(provider.toLowerCase()) {
      case 'google':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'microsoft':
        return (
          <svg className="w-5 h-5" viewBox="0 0 23 23">
            <path fill="#f1511b" d="M0 0h11v11H0z"/>
            <path fill="#80cc28" d="M12 0h11v11H12z"/>
            <path fill="#00adef" d="M0 12h11v11H0z"/>
            <path fill="#fbca00" d="M12 12h11v11H12z"/>
          </svg>
        );
      case 'apple':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        );
      case 'institution':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Sliding Welcome Message */}
      {showWelcome && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 z-50 animate-slideIn">
          <div className="container mx-auto text-center px-4">
            <p className="font-semibold text-sm md:text-base">
              Welcome to BrainPro Olympiad - Secure Proctored Assessment Platform
            </p>
            <p className="text-xs opacity-90 mt-1 hidden sm:block">
              Admin Message: Ensure stable internet connection and prepare your workspace
            </p>
          </div>
        </div>
      )}

      {/* Flying Objects Background */}
      <div className="absolute inset-0 overflow-hidden">
        {flyingObjects.map((obj) => (
          <div
            key={obj.id}
            className={`absolute text-lg md:text-xl opacity-20 md:opacity-30 font-bold animate-float-${obj.id % 3}`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              animationDelay: `${obj.id * 0.7}s`,
              animationDuration: `${18 + (obj.id % 12)}s`,
              color: obj.type === 'math' ? '#8b5cf6' : 
                     obj.type === 'science' ? '#06b6d4' : 
                     obj.type === 'physics' ? '#ef4444' : 
                     obj.type === 'chemistry' ? '#10b981' : '#f59e0b'
            }}
          >
            {getFlyingObjectIcon(obj.type)}
          </div>
        ))}
      </div>

      {/* Main Login Card */}
      <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-6xl p-6 md:p-8 border border-gray-700/50 animate-fadeIn min-h-[500px] flex flex-col lg:flex-row">
        {/* Left Section - Branding & Proctoring Info */}
        <div className="flex-1 lg:pr-8 lg:border-r lg:border-gray-700/50 flex flex-col justify-between mb-6 lg:mb-0">
          <div>
            {/* Logo & Title */}
            <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  BrainPro Olympiad
                </h1>
                <p className="text-gray-400 text-xs md:text-sm">Elite Academic Challenge Platform</p>
              </div>
            </div>

            {/* Proctoring Features */}
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold text-white">
                <span className="text-red-400">Proctoring Active</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                <div className="flex items-center text-gray-300 bg-gray-700/30 p-2 rounded-lg">
                  <span className="text-green-400 mr-2 font-bold">Camera</span>
                  <span>Live Monitoring</span>
                </div>
                <div className="flex items-center text-gray-300 bg-gray-700/30 p-2 rounded-lg">
                  <span className="text-yellow-400 mr-2 font-bold">Screen</span>
                  <span>Recording Active</span>
                </div>
                <div className="flex items-center text-gray-300 bg-gray-700/30 p-2 rounded-lg">
                  <span className="text-blue-400 mr-2 font-bold">Audio</span>
                  <span>Environment Scan</span>
                </div>
                <div className="flex items-center text-gray-300 bg-gray-700/30 p-2 rounded-lg">
                  <span className="text-purple-400 mr-2 font-bold">AI</span>
                  <span>Behavior Analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-700/40 rounded-xl p-3 md:p-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 font-bold text-base md:text-lg">✓</span>
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-sm md:text-base">Secure Session</p>
                  <p className="text-green-300 text-xs">Military-grade encryption</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex-1 lg:pl-8 flex flex-col justify-center">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Secure Authentication</h2>
            <p className="text-gray-400 text-xs md:text-sm">
              Access your BrainPro Olympiad account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-gray-300 mb-1 md:mb-2 font-medium text-xs md:text-sm">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="participant@brainpro.org"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 md:mb-2 font-medium text-xs md:text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your secure password"
                className="w-full px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 md:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center space-x-2 text-sm md:text-base"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Initializing Proctoring...</span>
                </>
              ) : (
                <>
                  <span className="font-bold">→</span>
                  <span>Begin Olympiad Challenge</span>
                </>
              )}
            </button>
          </form>

          {/* Social Login Options */}
          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-700/50">
            <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-3 text-center">Or continue with</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {['Google', 'Microsoft', 'Apple', 'Institution'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleSocialLogin(provider)}
                  className="flex items-center justify-center space-x-1 md:space-x-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-xl py-2 md:py-2.5 transition-all group"
                >
                  <div className={`w-4 h-4 md:w-5 md:h-5 ${
                    provider === 'Google' ? 'text-blue-400' :
                    provider === 'Microsoft' ? 'text-green-400' :
                    provider === 'Apple' ? 'text-gray-300' : 'text-purple-400'
                  }`}>
                    <SocialIcon provider={provider} />
                  </div>
                  <span className="text-white font-semibold text-xs md:text-sm group-hover:scale-105 transition-transform">
                    {provider}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Help */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-3 md:mt-4 space-y-2 sm:space-y-0 text-xs">
            <button
              onClick={() => Swal.fire({
                title: "Technical Support",
                html: "<div class='text-left text-sm'><p class='mb-2'><strong>Email:</strong> support@brainpro.org</p><p class='mb-2'><strong>Hotline:</strong> +1-800-BRAINPRO</p><p><strong>Hours:</strong> 24/7 during Olympiad</p></div>",
                icon: "info",
                background: '#0a0a0a',
                color: '#fff',
                confirmButtonColor: '#8b5cf6'
              })}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Technical Support
            </button>
            
            <button
              onClick={() => Swal.fire({
                title: "System Requirements",
                html: "<div class='text-left text-sm'><p class='mb-1'>✓ Stable internet connection</p><p class='mb-1'>✓ Webcam & microphone</p><p class='mb-1'>✓ Latest browser version</p><p>✓ Minimum 4GB RAM</p></div>",
                icon: "warning",
                background: '#0a0a0a',
                color: '#fff',
                confirmButtonColor: '#8b5cf6'
              })}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
            >
              Requirements
            </button>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-10px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(5px) rotate(240deg) scale(0.9); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          50% { transform: translateX(15px) translateY(-20px) rotate(180deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(-20px) scale(1.2) rotate(360deg); }
        }
        .animate-float-0 { animation: float1 20s ease-in-out infinite; }
        .animate-float-1 { animation: float2 25s ease-in-out infinite; }
        .animate-float-2 { animation: float3 15s ease-in-out infinite; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        
        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.8s ease-out; }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-float-0, .animate-float-1, .animate-float-2 {
            animation-duration: 12s !important;
          }
        }

        /* Hide scrollbars */
        ::-webkit-scrollbar { display: none; }
        body { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default QuizLogin;