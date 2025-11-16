import { useState } from 'react';
import { UserData } from '../App';
import svgPaths from '../imports/svg-gbfs5xs8h2';

type ShopProps = {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
};

function CloudSnow() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
      <g clipPath="url(#clip0_shop_snow)">
        <path d={svgPaths.p3d922c00} stroke="#0088FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      </g>
      <defs>
        <clipPath id="clip0_shop_snow">
          <rect fill="white" height="48" width="48" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
      <path d={svgPaths.p11b7a7c0} stroke="#CC9AB9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function BookOpen() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
      <path d={svgPaths.p34ed2100} stroke="#379A4C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

export default function Shop({ userData, updateUserData }: ShopProps) {
  const [encouragementVisible, setEncouragementVisible] = useState(false);
  const [encouragementText, setEncouragementText] = useState('');

  const encouragementMessages = [
    "You're doing amazing! Keep it up! 🌟",
    "Every good sleep brings you closer to your goals! 💪",
    "Your body thanks you for the rest! 😴",
    "Consistency is key - you've got this! 🔥",
    "Sleep warriors never give up! ⚡",
  ];

  const buyItem = (item: 'streakFreeze' | 'rewindStreak' | 'encouragement', cost: number) => {
    if (userData.points >= cost) {
      const newItems = { ...userData.items };
      newItems[item]++;
      
      updateUserData({
        points: userData.points - cost,
        items: newItems,
      });

      if (item === 'encouragement') {
        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        setEncouragementText(randomMessage);
        setEncouragementVisible(true);
        setTimeout(() => {
          setEncouragementVisible(false);
        }, 10000);
      }
    }
  };

  return (
    <div className="bg-[#181a37] relative min-h-screen pb-[160px]">
      {/* Encouragement Popup */}
      {encouragementVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#379A4C] text-white text-[36px] px-12 py-8 rounded-[40px] shadow-2xl animate-bounce">
            {encouragementText}
          </div>
        </div>
      )}

      <div className="relative size-full">
        {/* Protection Section */}
        <div className="absolute bg-[rgba(0,0,0,0.25)] h-[335px] left-[55px] rounded-[40px] top-[43px] w-[1133px]" />
        <div className="absolute bg-[#272c59] h-[60px] left-[399px] rounded-[40px] top-[38px] w-[442px]" />
        <p className="absolute left-[620px] text-[48px] text-center text-nowrap text-white top-[39px] translate-x-[-50%] whitespace-pre">Protection</p>
        
        {/* Streak Freeze */}
        <div className="absolute left-[103px] size-[48px] top-[115px]">
          <CloudSnow />
        </div>
        <p className="absolute left-[302px] text-[36px] text-center text-nowrap text-white top-[114px] translate-x-[-50%] whitespace-pre">Streak Freeze:</p>
        <div className="absolute bg-[#394082] h-[61px] left-[179px] rounded-[40px] top-[166px] w-[398px]" />
        <p className="absolute left-[379px] text-[24px] text-center text-nowrap text-white top-[182px] translate-x-[-50%] whitespace-pre">Prevent your streak from dying</p>
        <div className="absolute bg-[#447c9a] h-[67px] left-[720px] rounded-[40px] top-[132px] w-[234px]" />
        <button
          onClick={() => buyItem('streakFreeze', 200)}
          className="absolute left-[837.5px] text-[36px] text-center text-nowrap text-white top-[144px] translate-x-[-50%] whitespace-pre hover:opacity-80 transition-opacity"
        >
          200 pts
        </button>

        {/* Rewind Streak */}
        <div className="absolute left-[103px] size-[48px] top-[265px]">
          <ArrowLeft />
        </div>
        <p className="absolute left-[301.5px] text-[36px] text-center text-nowrap text-white top-[264px] translate-x-[-50%] whitespace-pre">Rewind Streak:</p>
        <div className="absolute bg-[#394082] h-[44px] left-[179px] rounded-[40px] top-[325px] w-[250px]" />
        <p className="absolute left-[308.5px] text-[24px] text-center text-nowrap text-white top-[332px] translate-x-[-50%] whitespace-pre">Revive your streak</p>
        <div className="absolute bg-[#447c9a] h-[67px] left-[720px] rounded-[40px] top-[280px] w-[234px]" />
        <button
          onClick={() => buyItem('rewindStreak', 500)}
          className="absolute left-[837.5px] text-[36px] text-center text-nowrap text-white top-[292px] translate-x-[-50%] whitespace-pre hover:opacity-80 transition-opacity"
        >
          500 pts
        </button>

        {/* Divider */}
        <div className="absolute bg-black h-[14px] left-[18px] top-[427px] w-[1440px]" />

        {/* Other Section */}
        <div className="absolute bg-[rgba(0,0,0,0.25)] h-[335px] left-[55px] rounded-[40px] top-[481px] w-[1133px]" />
        <div className="absolute bg-[#272c59] h-[67px] left-[505px] rounded-[40px] top-[482px] w-[234px]" />
        <p className="absolute left-[621.5px] text-[48px] text-center text-nowrap text-white top-[491px] translate-x-[-50%] whitespace-pre">Other</p>

        {/* Words of Encouragement */}
        <div className="absolute left-[103px] size-[48px] top-[621px]">
          <BookOpen />
        </div>
        <p className="absolute left-[399.5px] text-[36px] text-center text-nowrap text-white top-[618px] translate-x-[-50%] whitespace-pre">Words of Encouragement:</p>
        <div className="absolute bg-[#394082] h-[61px] left-[179px] rounded-[40px] top-[679px] w-[375px]" />
        <p className="absolute left-[365px] text-[36px] text-center text-nowrap text-white top-[684px] translate-x-[-50%] whitespace-pre">No thanks needed!</p>
        <div className="absolute bg-[#447c9a] h-[67px] left-[720px] rounded-[40px] top-[645px] w-[234px]" />
        <button
          onClick={() => buyItem('encouragement', 50)}
          className="absolute left-[837.5px] text-[36px] text-center text-nowrap text-white top-[653px] translate-x-[-50%] whitespace-pre hover:opacity-80 transition-opacity"
        >
          50 pts
        </button>

        {/* Points Display */}
        <div className="absolute bg-[#394082] h-[44px] left-[1204px] rounded-[40px] top-[37px] w-[194px]" />
        <p className="absolute h-[61px] left-[1304px] text-[36px] text-center text-white top-[37px] translate-x-[-50%] w-[390px]">{userData.points} pts</p>

        {/* Items Inventory */}
        <div className="absolute bg-[rgba(0,0,0,0.25)] h-[337px] left-[1219px] rounded-[40px] top-[479px] w-[194px]" />
        <p className="absolute h-[35px] leading-[normal] left-[1316.5px] text-[#c6c6c6] text-[36px] text-center top-[513px] translate-x-[-50%] w-[89px]">Items</p>
        
        <div className="absolute left-[1243px] size-[48px] top-[581px]">
          <CloudSnow />
        </div>
        <p className="absolute left-[1341px] size-[48px] text-[36px] text-center text-white top-[586px] translate-x-[-50%]">{userData.items.streakFreeze}</p>

        <div className="absolute left-[1243px] size-[48px] top-[669px]">
          <ArrowLeft />
        </div>
        <p className="absolute left-[1341px] size-[48px] text-[36px] text-center text-white top-[660px] translate-x-[-50%]">{userData.items.rewindStreak}</p>

        <div className="absolute left-[1243px] size-[48px] top-[742px]">
          <BookOpen />
        </div>
        <p className="absolute left-[1341px] size-[48px] text-[36px] text-center text-white top-[740px] translate-x-[-50%]">{userData.items.encouragement}</p>
      </div>
      
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}
