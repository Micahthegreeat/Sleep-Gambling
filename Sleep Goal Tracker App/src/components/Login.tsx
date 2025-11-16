import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

type LoginProps = {
  onLogin: (username: string) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Get existing users from localStorage
    const usersData = localStorage.getItem('sleepAppUsers');
    const users: { [key: string]: string } = usersData ? JSON.parse(usersData) : {};

    if (isSignUp) {
      // Sign up logic
      if (users[username]) {
        setError('Username already exists');
        return;
      }
      users[username] = password;
      localStorage.setItem('sleepAppUsers', JSON.stringify(users));
      localStorage.setItem('currentUser', username);
      onLogin(username);
    } else {
      // Login logic
      if (!users[username]) {
        setError('Username does not exist');
        return;
      }
      if (users[username] !== password) {
        setError('Incorrect password');
        return;
      }
      localStorage.setItem('currentUser', username);
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen bg-[#181a37] flex items-center justify-center px-4">
      <div className="bg-[rgba(0,0,0,0.25)] rounded-[40px] p-12 w-full max-w-[500px]">
        <div className="text-center mb-8">
          <h1 className="text-white text-[56px] mb-2">😴 SleepQuest</h1>
          <p className="text-[#c6c6c6] text-[24px]">
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-white text-[20px] mb-2 block">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#394082] border-none text-white text-[20px] h-[60px] rounded-[30px] px-6"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white text-[20px] mb-2 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#394082] border-none text-white text-[20px] h-[60px] rounded-[30px] px-6"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border-2 border-red-500 rounded-[30px] px-6 py-3">
              <p className="text-red-300 text-[18px] text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#447c9a] hover:bg-[#5a9ab8] text-white text-[24px] h-[60px] rounded-[30px]"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-[#c6c6c6] text-[18px] hover:text-white transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Login'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#394082]">
          <p className="text-[#888] text-[14px] text-center">
            Demo: Use any username/password to sign up, or use existing credentials to login
          </p>
        </div>
      </div>
    </div>
  );
}
