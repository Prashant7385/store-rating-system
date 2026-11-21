
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

function NotFound() {
    return (
        <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <h1 className="text-8xl font-bold text-[#647D68]">
                    404
                </h1>

                <h2 className="text-2xl font-semibold text-gray-900 mt-4">
                    Page not found
                </h2>

                <p className="text-gray-500 mt-3">
                    The page you are looking for does not exist or may have been moved.
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-lg bg-[#647D68] text-white hover:bg-[#526A56] transition"
                >
                    <Home size={18} />
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default NotFound
