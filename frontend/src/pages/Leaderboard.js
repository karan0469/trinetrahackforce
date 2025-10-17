import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Trophy, Award, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await userAPI.getLeaderboard(50);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getRankBg = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
        <p className="mt-2 text-gray-600">Top reporters making a difference in their communities</p>
      </div>

      {/* Top 3 */}
      {leaderboard.length >= 3 && (
        <div className="mb-12 grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white mb-3">
              2
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 w-full text-center">
              <p className="font-bold text-lg truncate">{leaderboard[1].name}</p>
              <p className="text-2xl font-bold text-gray-600">{leaderboard[1].points}</p>
              <p className="text-sm text-gray-500">points</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Trophy className="absolute -top-8 left-1/2 transform -translate-x-1/2 h-12 w-12 text-yellow-500" />
              <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-white mb-3 border-4 border-yellow-300 shadow-lg">
                1
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-4 w-full text-center border-2 border-yellow-400">
              <p className="font-bold text-xl truncate">{leaderboard[0].name}</p>
              <p className="text-3xl font-bold text-yellow-600">{leaderboard[0].points}</p>
              <p className="text-sm text-gray-500">points</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="w-20 h-20 rounded-full bg-orange-400 flex items-center justify-center text-3xl font-bold text-white mb-3">
              3
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 w-full text-center">
              <p className="font-bold text-lg truncate">{leaderboard[2].name}</p>
              <p className="text-2xl font-bold text-orange-600">{leaderboard[2].points}</p>
              <p className="text-sm text-gray-500">points</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-primary-600 text-white">
          <h2 className="text-xl font-bold">All Rankings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {leaderboard.map((item) => (
            <div
              key={item.id}
              className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition ${
                item.id === user?.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  item.rank <= 3 ? 'text-white' : 'bg-gray-100 text-gray-600'
                } ${getRankBg(item.rank)}`}>
                  {item.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>{item.name}</span>
                    {item.id === user?.id && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded-full">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{item.verifiedReports} verified reports</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <Award className={`h-6 w-6 ${getRankColor(item.rank)}`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{item.points}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Rank (if not in top 50) */}
      {!leaderboard.find(item => item.id === user?.id) && (
        <div className="mt-6 bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
          <p className="text-center text-primary-800 font-medium">
            Keep reporting to climb up the leaderboard! Your current rank is not in the top 50.
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
