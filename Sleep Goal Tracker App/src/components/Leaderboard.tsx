import { useState } from 'react';
import { UserData, Friend } from '../App';

type LeaderboardProps = {
  userData: UserData;
  friends: Friend[];
  updateUserData: (updates: Partial<UserData>) => void;
  updateFriends: (friends: Friend[]) => void;
};

export default function Leaderboard({ userData, friends, updateUserData, updateFriends }: LeaderboardProps) {
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({});
  const [selfBetAmount, setSelfBetAmount] = useState(userData.selfBet.toString());

  const placeBet = (friendId: string) => {
    const amount = parseInt(betAmounts[friendId] || '0');
    if (amount > 0 && amount <= userData.points) {
      const updatedFriends = friends.map(friend => 
        friend.id === friendId 
          ? { ...friend, betOnThem: friend.betOnThem + amount }
          : friend
      );
      updateFriends(updatedFriends);
      updateUserData({ points: userData.points - amount });
      setBetAmounts({ ...betAmounts, [friendId]: '' });
    }
  };

  const updateSelfBet = () => {
    const amount = parseInt(selfBetAmount);
    if (amount >= 0) {
      updateUserData({ selfBet: amount });
    }
  };

  const sortedFriends = [...friends].sort((a, b) => b.weeklyPoints - a.weeklyPoints);

  return (
    <div className="relative min-h-screen pb-[160px] px-[55px] pt-[43px]">
      <div className="bg-[rgba(0,0,0,0.25)] rounded-[40px] p-8 mb-8">
        <h1 className="text-white text-[48px] mb-8 text-center">Leaderboard</h1>
        
        {/* Friends List */}
        <div className="space-y-4 mb-8">
          {sortedFriends.map((friend, index) => (
            <div key={friend.id} className="bg-[#272c59] rounded-[40px] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <div className="bg-[#394082] rounded-full size-[60px] flex items-center justify-center">
                    <span className="text-white text-[28px]">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white text-[32px]">{friend.name}</h3>
                    <div className="flex gap-6 mt-1">
                      <span className="text-[#fbbf24] text-[20px]">🔥 {friend.streak} days</span>
                      <span className="text-[#4ade80] text-[20px]">{friend.weeklyPoints} pts this week</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Bet amount"
                    value={betAmounts[friend.id] || ''}
                    onChange={(e) => setBetAmounts({ ...betAmounts, [friend.id]: e.target.value })}
                    className="bg-[#394082] text-white text-[20px] rounded-[30px] px-4 py-2 w-[140px] outline-none"
                  />
                  <button
                    onClick={() => placeBet(friend.id)}
                    className="bg-[#447c9a] hover:bg-[#5a9ab8] rounded-[30px] px-6 py-2 text-white text-[20px] transition-colors"
                  >
                    Bet
                  </button>
                </div>
              </div>
              
              <div className="bg-[#394082] rounded-[30px] px-6 py-3">
                <p className="text-[#c6c6c6] text-[18px]">Your current bet: <span className="text-white">{friend.betOnThem} pts</span></p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-[2px] bg-[#394082] my-8" />

        {/* Personal Stats */}
        <div className="bg-[#272c59] rounded-[40px] p-8">
          <h2 className="text-white text-[36px] mb-6">Your Stats</h2>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-[#394082] rounded-[30px] px-6 py-4">
              <p className="text-[#c6c6c6] text-[20px]">Streak</p>
              <p className="text-white text-[36px]">🔥 {userData.streak} days</p>
            </div>
            
            <div className="bg-[#394082] rounded-[30px] px-6 py-4">
              <p className="text-[#c6c6c6] text-[20px]">Weekly Points</p>
              <p className="text-[#4ade80] text-[36px]">{userData.weeklyPoints} pts</p>
            </div>
            
            <div className="bg-[#394082] rounded-[30px] px-6 py-4">
              <p className="text-[#c6c6c6] text-[20px]">Total Points</p>
              <p className="text-[#fbbf24] text-[36px]">{userData.points} pts</p>
            </div>
          </div>

          {/* Self Bet */}
          <div className="bg-[#394082] rounded-[30px] p-6">
            <h3 className="text-white text-[28px] mb-4">Bet on Yourself</h3>
            <p className="text-[#c6c6c6] text-[18px] mb-4">Set how many points you want to bet on maintaining your streak. If you succeed, you'll earn double!</p>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={selfBetAmount}
                onChange={(e) => setSelfBetAmount(e.target.value)}
                className="bg-[#272c59] text-white text-[24px] rounded-[30px] px-6 py-3 flex-1 outline-none"
                placeholder="Enter amount"
              />
              <button
                onClick={updateSelfBet}
                className="bg-[#379A4C] hover:bg-[#4ab85f] rounded-[30px] px-8 py-3 text-white text-[24px] transition-colors"
              >
                Set Bet
              </button>
            </div>
            <p className="text-[#4ade80] text-[20px] mt-4">Current self-bet: {userData.selfBet} pts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
