import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Camera, Award, Users, MapPin, CheckCircle } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <ShieldCheck className="h-20 w-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Be a Good Citizen
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Report civic violations, help authorities take action, and earn rewards for making your community better
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create-report"
                    className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg"
                  >
                    Create Report
                  </Link>
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition border-2 border-white"
                  >
                    View Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition border-2 border-white"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Capture</h3>
              <p className="text-gray-600">
                Take a photo of any civic violation with your phone
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Report</h3>
              <p className="text-gray-600">
                Add location, category, and description to your report
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Verify</h3>
              <p className="text-gray-600">
                Moderators review and forward to authorities
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Earn</h3>
              <p className="text-gray-600">
                Get 10 points for each verified report
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <ShieldCheck className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Anonymous</h3>
              <p className="text-gray-600">
                Your identity is protected. Report safely and anonymously.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Award className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
              <p className="text-gray-600">
                Redeem points for coupons, discounts, and donate to NGOs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Users className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Join thousands of citizens making a difference together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join our community of responsible citizens today
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition shadow-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-lg font-semibold">Good Citizen</span>
          </div>
          <p className="text-gray-400">
            Making our communities better, one report at a time.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            © 2025 Good Citizen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
