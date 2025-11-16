import { useState } from 'react';
import { UserData, Friend } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type HomeProps = {
  userData: UserData;
  friends: Friend[];
  updateUserData: (updates: Partial<UserData>) => void;
  updateFriends: (friends: Friend[]) => void;
};

export default function Home({ userData, friends, updateUserData, updateFriends }: HomeProps) {
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoalHours, setTempGoalHours] = useState(userData.sleepGoalHours.toString());
  const [tempBedtime, setTempBedtime] = useState(userData.bedtime);
  const [tempWakeTime, setTempWakeTime] = useState(userData.wakeTime);

  // Calculate time until bedtime
  const getTimeUntilBedtime = () => {
    const now = new Date();
    const [hours, minutes] = userData.bedtime.split(':').map(Number);
    const bedtime = new Date();
    bedtime.setHours(hours, minutes, 0, 0);
    
    if (bedtime < now) {
      bedtime.setDate(bedtime.getDate() + 1);
    }
    
    const diff = bedtime.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}h ${minutesLeft}m`;
  };

  const saveGoal = () => {
    updateUserData({
      sleepGoalHours: parseFloat(tempGoalHours),
      bedtime: tempBedtime,
      wakeTime: tempWakeTime,
    });
    setEditingGoal(false);
  };

  // Sleep data for the last 7 days
  const sleepData = [
    { day: 'Mon', hours: 7.2, points: 72 },
    { day: 'Tue', hours: 8.1, points: 81 },
    { day: 'Wed', hours: 7.5, points: 75 },
    { day: 'Thu', hours: 6.8, points: 68 },
    { day: 'Fri', hours: 8.5, points: 85 },
    { day: 'Sat', hours: 7.9, points: 79 },
    { day: 'Sun', hours: userData.lastNightHours, points: Math.round(userData.lastNightHours * 10) },
  ];

  return (
    <div className="relative min-h-screen pb-[160px] px-[55px] pt-[43px]">
      {/* Welcome Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-white text-[48px]">Hello, {userData.username}!</h1>
          <p className="text-[#c6c6c6] text-[32px]">Time until bedtime: {getTimeUntilBedtime()}</p>
        </div>
        
        <div className="bg-[#394082] rounded-[40px] px-8 py-4">
          <p className="text-white text-[36px]">🔥 Streak: {userData.streak} days</p>
        </div>
      </div>

      {/* PRIMARY SECTION - Sleep Progress & Goal Center */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Sleep Progress Chart - LEFT */}
        <div className="bg-[rgba(0,0,0,0.25)] rounded-[40px] p-8">
          <h2 className="text-white text-[42px] mb-6 text-center">Sleep Progress</h2>
          <div className="bg-[#272c59] rounded-[30px] p-6 mb-6">
            <p className="text-[#c6c6c6] text-[28px] mb-2">Last Night</p>
            <p className="text-white text-[56px]">{userData.lastNightHours} hours</p>
            <p className="text-[#4ade80] text-[32px]">+{Math.round(userData.lastNightHours * 10)} points</p>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#394082" />
                <XAxis dataKey="day" stroke="#c6c6c6" />
                <YAxis stroke="#c6c6c6" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#272c59', border: 'none', borderRadius: '10px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="hours" fill="#447c9a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Center - RIGHT */}
        <div className="bg-[rgba(0,0,0,0.25)] rounded-[40px] p-8">
          <h2 className="text-white text-[42px] mb-6 text-center">Goal Center</h2>
          {!editingGoal ? (
            <div className="space-y-4">
              <div className="bg-[#394082] rounded-[30px] px-8 py-6">
                <p className="text-[#c6c6c6] text-[24px]">Goal Sleep Hours</p>
                <p className="text-white text-[48px]">{userData.sleepGoalHours} hours</p>
              </div>
              <div className="bg-[#394082] rounded-[30px] px-8 py-6">
                <p className="text-[#c6c6c6] text-[24px]">Bedtime</p>
                <p className="text-white text-[48px]">{userData.bedtime}</p>
              </div>
              <div className="bg-[#394082] rounded-[30px] px-8 py-6">
                <p className="text-[#c6c6c6] text-[24px]">Wake Time</p>
                <p className="text-white text-[48px]">{userData.wakeTime}</p>
              </div>
              <button
                onClick={() => setEditingGoal(true)}
                className="w-full bg-[#447c9a] hover:bg-[#5a9ab8] rounded-[30px] px-8 py-4 text-white text-[28px] transition-colors"
              >
                Edit Goal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#394082] rounded-[30px] px-8 py-6">
                <label className="text-[#c6c6c6] text-[24px] block mb-3">Goal Sleep Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={tempGoalHours}
                  onChange={(e) => setTempGoalHours(e.target.value)}
                  className="w-full bg-[#272c59] text-white text-[32px] rounded-[20px] px-6 py-3 outline-none"
                />
              </div>
              <div className="bg-[#394082] rounded-[30px] px-8 py-6">
                <label className="text-[#c6c6c6] text-[24px] block mb-3">Bedtime</label>
                <input
                  type="time"
                  value={tempBedtime}
                  onChange={(e) => setTempBedtime(e.target.value)}
                  className="w-full bg-[#272c59] text-white text-[32px] rounded-[20px] px-6 py-3 outline-none"
                />
              </div>
              <div className="bg-[#394082] rounded-[30px] px-8 py-6">
                <label className="text-[#c6c6c6] text-[24px] block mb-3">Wake Time</label>
                <input
                  type="time"
                  value={tempWakeTime}
                  onChange={(e) => setTempWakeTime(e.target.value)}
                  className="w-full bg-[#272c59] text-white text-[32px] rounded-[20px] px-6 py-3 outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={saveGoal}
                  className="flex-1 bg-[#379A4C] hover:bg-[#4ab85f] rounded-[30px] px-8 py-4 text-white text-[28px] transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingGoal(false)}
                  className="flex-1 bg-[#8b5cf6] hover:bg-[#a78bfa] rounded-[30px] px-8 py-4 text-white text-[28px] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECONDARY SECTION - Betting & Social */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Friends Bets on You */}
          <div className="bg-[rgba(0,0,0,0.25)] rounded-[40px] p-6">
            <h3 className="text-white text-[28px] mb-4">Friends Betting On You</h3>
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex justify-between items-center bg-[#394082] rounded-[30px] px-6 py-3">
                  <span className="text-white text-[22px]">{friend.name}</span>
                  <span className="text-[#4ade80] text-[22px]">{friend.betOnYou} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Current Bets */}
          <div className="bg-[rgba(0,0,0,0.25)] rounded-[40px] p-6">
            <h3 className="text-white text-[28px] mb-4">Your Bets on Friends</h3>
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex justify-between items-center bg-[#394082] rounded-[30px] px-6 py-3">
                  <span className="text-white text-[22px]">{friend.name}</span>
                  <span className="text-[#fbbf24] text-[22px]">{friend.betOnThem} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}