import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <div className="max-w-md">
        <img src="/notfound.png" alt="notfound" className="w-full h-auto mb-6" />
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          RETURN TO HOME PAGE
        </Link>
      </div>
    </section>
  )
}

export default NotFound
