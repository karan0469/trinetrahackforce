import React, { useState, useEffect } from 'react';
import { rewardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Gift, Award, ShoppingBag, Heart, Ticket, Loader } from 'lucide-react';

const REWARD_ICONS = {
  'Coupon': ShoppingBag,
  'Discount': Ticket,
  'Donation': Heart,
  'Gift Card': Gift
};

const Rewards = () => {
  const { user, updateUserPoints } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rewardsRes, redemptionsRes] = await Promise.all([
        rewardAPI.getAvailable(),
        rewardAPI.getMyRedemptions()
      ]);
      setRewards(rewardsRes.data.rewards);
      setRedemptions(redemptionsRes.data.redemptions);
    } catch (error) {
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId) => {
    setRedeeming(rewardId);
    try {
      const response = await rewardAPI.redeem(rewardId);
      toast.success(`🎉 ${response.data.message}`);
      updateUserPoints(response.data.remainingPoints);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to redeem reward');
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Gift className="h-8 w-8 text-primary-600" />
              <span>Rewards</span>
            </h1>
            <p className="mt-2 text-gray-600">Redeem your points for exciting rewards</p>
          </div>
          <div className="bg-white rounded-xl shadow-md px-6 py-4 text-center">
            <p className="text-sm text-gray-600">Your Points</p>
            <p className="text-3xl font-bold text-primary-600">{user?.points || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'available'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Available Rewards
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'history'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Redemptions
        </button>
      </div>

      {/* Available Rewards */}
      {activeTab === 'available' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const Icon = REWARD_ICONS[reward.type] || Gift;
            return (
              <div
                key={reward.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                    {reward.value}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {reward.description}
                </h3>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Points Required</span>
                    <span className="font-bold text-primary-600">{reward.pointsRequired}</span>
                  </div>
                  {!reward.canRedeem && (
                    <p className="text-xs text-red-600">
                      Need {reward.pointsRequired - (user?.points || 0)} more points
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleRedeem(reward.id)}
                  disabled={!reward.canRedeem || redeeming === reward.id}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    reward.canRedeem
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {redeeming === reward.id ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Redeeming...
                    </span>
                  ) : reward.canRedeem ? (
                    'Redeem Now'
                  ) : (
                    'Insufficient Points'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Redemption History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {redemptions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-900">No redemptions yet</p>
              <p className="text-gray-600 mt-2">Start redeeming rewards to see them here</p>
            </div>
          ) : (
            redemptions.map((redemption) => (
              <div
                key={redemption._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full">
                        {redemption.rewardType}
                      </span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        redemption.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : redemption.status === 'Used'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {redemption.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {redemption.rewardDescription}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Redeemed on {new Date(redemption.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Code:</span>{' '}
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {redemption.rewardCode}
                      </span>
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {redemption.rewardValue}
                    </p>
                    <p className="text-sm text-gray-600">
                      {redemption.pointsUsed} points used
                    </p>
                    {redemption.status === 'Active' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(redemption.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Rewards;
