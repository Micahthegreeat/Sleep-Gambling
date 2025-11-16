import { useState, useEffect } from 'react';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import Shop from './components/Shop';
import Login from './components/Login';

export type Friend = {
  id: string;
  name: string;
  streak: number;
  weeklyPoints: number;
  betOnThem: number;
  betOnYou: number;
};

export type UserData = {
  username: string;
  points: number;
  streak: number;
  weeklyPoints: number;
  selfBet: number;
  sleepGoalHours: number;
  bedtime: string;
  wakeTime: string;
  lastNightHours: number;
  items: {
    streakFreeze: number;
    rewindStreak: number;
    encouragement: number;
  };
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'leaderboard' | 'shop'>('home');
  
  const [userData, setUserData] = useState<UserData>(() => {
    const currentUser = localStorage.getItem('currentUser');
    const saved = currentUser ? localStorage.getItem(`sleepAppUserData_${currentUser}`) : null;
    return saved ? JSON.parse(saved) : {
      username: 'SleepChamp',
      points: 1500,
      streak: 12,
      weeklyPoints: 420,
      selfBet: 50,
      sleepGoalHours: 8,
      bedtime: '23:00',
      wakeTime: '07:00',
      lastNightHours: 7.5,
      items: {
        streakFreeze: 2,
        rewindStreak: 1,
        encouragement: 3,
      },
    };
  });

  const [friends, setFriends] = useState<Friend[]>(() => {
    const currentUser = localStorage.getItem('currentUser');
    const saved = currentUser ? localStorage.getItem(`sleepAppFriends_${currentUser}`) : null;
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Alex', streak: 15, weeklyPoints: 480, betOnThem: 100, betOnYou: 75 },
      { id: '2', name: 'Jordan', streak: 8, weeklyPoints: 320, betOnThem: 50, betOnYou: 100 },
      { id: '3', name: 'Sam', streak: 20, weeklyPoints: 600, betOnThem: 150, betOnYou: 50 },
      { id: '4', name: 'Taylor', streak: 5, weeklyPoints: 200, betOnThem: 25, betOnYou: 125 },
    ];
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && isLoggedIn) {
      localStorage.setItem(`sleepAppUserData_${currentUser}`, JSON.stringify(userData));
    }
  }, [userData, isLoggedIn]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && isLoggedIn) {
      localStorage.setItem(`sleepAppFriends_${currentUser}`, JSON.stringify(friends));
    }
  }, [friends, isLoggedIn]);

  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const updateFriends = (updatedFriends: Friend[]) => {
    setFriends(updatedFriends);
  };

  const handleLogin = (username: string) => {
    // Load user data for this specific user
    const saved = localStorage.getItem(`sleepAppUserData_${username}`);
    if (saved) {
      setUserData(JSON.parse(saved));
    } else {
      // Create new user data
      setUserData({
        username: username,
        points: 1500,
        streak: 0,
        weeklyPoints: 0,
        selfBet: 0,
        sleepGoalHours: 8,
        bedtime: '23:00',
        wakeTime: '07:00',
        lastNightHours: 0,
        items: {
          streakFreeze: 0,
          rewindStreak: 0,
          encouragement: 0,
        },
      });
    }

    // Load friends data
    const friendsSaved = localStorage.getItem(`sleepAppFriends_${username}`);
    if (friendsSaved) {
      setFriends(JSON.parse(friendsSaved));
    } else {
      setFriends([
        { id: '1', name: 'Alex', streak: 15, weeklyPoints: 480, betOnThem: 0, betOnYou: 0 },
        { id: '2', name: 'Jordan', streak: 8, weeklyPoints: 320, betOnThem: 0, betOnYou: 0 },
        { id: '3', name: 'Sam', streak: 20, weeklyPoints: 600, betOnThem: 0, betOnYou: 0 },
        { id: '4', name: 'Taylor', streak: 5, weeklyPoints: 200, betOnThem: 0, betOnYou: 0 },
      ]);
    }

    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-[#181a37] relative min-h-screen">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="fixed top-[20px] right-[20px] bg-[#394082] hover:bg-[#4a5299] text-white px-6 py-2 rounded-[30px] z-50 transition-colors"
      >
        Logout
      </button>

      {currentPage === 'home' && (
        <Home userData={userData} friends={friends} updateUserData={updateUserData} updateFriends={updateFriends} />
      )}
      {currentPage === 'leaderboard' && (
        <Leaderboard userData={userData} friends={friends} updateUserData={updateUserData} updateFriends={updateFriends} />
      )}
      {currentPage === 'shop' && (
        <Shop userData={userData} updateUserData={updateUserData} />
      )}
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.25)] h-[131px] flex items-center justify-center gap-[210px]">
        <button
          onClick={() => setCurrentPage('home')}
          className="size-[75px] transition-opacity hover:opacity-80"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75 76">
            <g filter="url(#filter0_d_home)">
              <path d="M37.5004 18.9583L16.6671 35.875V60.25C16.6671 61.4103 17.1281 62.5231 17.9438 63.3389C18.7596 64.1546 19.8724 64.6156 21.0327 64.6156H31.2494V48.1573H43.751V64.6156H53.9677C55.128 64.6156 56.2408 64.1546 57.0566 63.3389C57.8723 62.5231 58.3333 61.4103 58.3333 60.25V35.875L37.5004 18.9583Z" stroke={currentPage === 'home' ? '#5A5A5A' : '#757575'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <filter id="filter0_d_home" x="-4" y="0" width="83" height="83" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_home" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_home" result="shape" />
              </filter>
            </defs>
          </svg>
        </button>
        
        <button
          onClick={() => setCurrentPage('leaderboard')}
          className="size-[75px] transition-opacity hover:opacity-80"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 75 75">
            <g filter="url(#filter0_d_leaderboard)">
              {/* Podium - 2nd place (left) */}
              <rect x="10" y="32" width="18" height="30" stroke={currentPage === 'leaderboard' ? '#5A5A5A' : '#757575'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" rx="2" />
              <text x="19" y="50" fill={currentPage === 'leaderboard' ? '#5A5A5A' : '#757575'} fontSize="16" fontWeight="bold" textAnchor="middle">2</text>
              
              {/* Podium - 1st place (center, tallest) */}
              <rect x="28.5" y="20" width="18" height="42" stroke={currentPage === 'leaderboard' ? '#5A5A5A' : '#757575'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" rx="2" />
              <text x="37.5" y="45" fill={currentPage === 'leaderboard' ? '#5A5A5A' : '#757575'} fontSize="16" fontWeight="bold" textAnchor="middle">1</text>
              
              {/* Podium - 3rd place (right) */}
              <rect x="47" y="38" width="18" height="24" stroke={currentPage === 'leaderboard' ? '#5A5A5A' : '#757575'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" rx="2" />
              <text x="56" y="53" fill={currentPage === 'leaderboard' ? '#5A5A5A' : '#757575'} fontSize="16" fontWeight="bold" textAnchor="middle">3</text>
            </g>
            <defs>
              <filter id="filter0_d_leaderboard" x="-4" y="0" width="83" height="83" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_leaderboard" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_leaderboard" result="shape" />
              </filter>
            </defs>
          </svg>
        </button>
        
        <button
          onClick={() => setCurrentPage('shop')}
          className="size-[75px] transition-opacity hover:opacity-80"
        >
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 81 79">
            <g filter="url(#filter0_d_shop)">
              <path d="M27.75 71C29.8211 71 31.5 69.3211 31.5 67.25C31.5 65.1789 29.8211 63.5 27.75 63.5C25.6789 63.5 24 65.1789 24 67.25C24 69.3211 25.6789 71 27.75 71Z" stroke={currentPage === 'shop' ? '#F3F3F3' : '#757575'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M63.75 71C65.8211 71 67.5 69.3211 67.5 67.25C67.5 65.1789 65.8211 63.5 63.75 63.5C61.6789 63.5 60 65.1789 60 67.25C60 69.3211 61.6789 71 63.75 71Z" stroke={currentPage === 'shop' ? '#F3F3F3' : '#757575'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0.875 0.875H12.125L20.0875 45.5913C20.4059 47.2444 21.2734 48.7347 22.5414 49.8095C23.8094 50.8842 25.3984 51.4765 27.0425 51.485H61.8125C63.4566 51.4765 65.0456 50.8842 66.3136 49.8095C67.5816 48.7347 68.4491 47.2444 68.7675 45.5913L73.625 18.875H15.875" stroke={currentPage === 'shop' ? '#F3F3F3' : '#757575'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <filter id="filter0_d_shop" x="-1.125" y="0" width="83" height="83" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_shop" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_shop" result="shape" />
              </filter>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
}