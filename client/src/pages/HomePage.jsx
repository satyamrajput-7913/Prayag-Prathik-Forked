import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const images = [
    "https://images.unsplash.com/photo-1633074374540-bc2d0e0257eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1591439660227-44a57e34b090?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1596526131083-e8c633c3c6ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 text-gray-800">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${image}')` }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

      <div className="relative z-20 text-center px-4 max-w-md bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-6 space-y-4 border border-emerald-200">
        <h1 className="text-2xl font-semibold text-emerald-700">
          Welcome to <span className="text-emerald-600">Prayagraj</span>
        </h1>
        <p className="text-sm text-gray-600">
          Explore the holy city with our optimized Tourist Transport Planner.
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-full shadow-sm transition-transform transform hover:scale-105 border border-emerald-300"
        >
          Start Exploring
        </button>

        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-emerald-600 scale-110"
                  : "bg-gray-400/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-300 hidden md:block"
        aria-label="Previous image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-300 hidden md:block"
        aria-label="Next image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-xs z-20">
        © {new Date().getFullYear()} Prayagraj Tourist Transport Planner
      </div>
    </div>
  );
}
