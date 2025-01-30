import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPg({showFooter}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 to-orange-100">
      {/* Hero Section */}
      <section className="text-center p-10">
        <h1 className="text-5xl font-bold mb-4 text-orange-700">Welcome to ShareSphere!</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover, share, and borrow books from fellow readers in your community.
          Join us to build a thriving network of book lovers!
        </p>
        <div className="mt-6 space-x-4">
          <Link
            to="/register"
            className="px-5 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-5 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-orange-600">Discover Books</h3>
          <p className="text-gray-600">
            Explore a vast collection of books shared by our community.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-orange-600">Share Your Library</h3>
          <p className="text-gray-600">
            Lend your favorite books and connect with readers around you.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-orange-600">Borrow for Free</h3>
          <p className="text-gray-600">
            Borrow books from other readers without any fees.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mt-16 text-center p-10 bg-orange-50 w-full">
        <h2 className="text-3xl font-bold mb-4 text-orange-700">Join Our Community</h2>
        <p className="text-lg text-gray-600 mb-6">
          Be a part of a passionate community that loves reading and sharing books.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
        >
          Sign Up Now
        </Link>
      </section>

      {/* Footer Section */}
      <footer className="mt-12 bg-gray-800 text-white p-6 w-full">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2025 BookShare. All rights reserved.</p>
         
        </div>
      </footer>
    </div>
  );
}
