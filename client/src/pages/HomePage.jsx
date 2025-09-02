import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const images = [
        "https://images.unsplash.com/photo-1633074374540-bc2d0e0257eb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1591439660227-44a57e34b090?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1596526131083-e8c633c3c6ce?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const preloadImages = () => {
            images.forEach((image) => {
                const img = new Image();
                img.src = image;
            });
        };

        preloadImages();
        setLoaded(true);

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
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ backgroundImage: `url('${image}')` }}
                />
            ))}

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

            <div className="relative z-20 text-center text-white px-6 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Welcome to <span className="text-amber-400">Prayagraj</span>
                </h1>
                <p className="text-xl md:text-3xl mb-8 font-light">
                    Discover the holy city with our exclusive Tourist Transport Planner
                </p>
                <button onClick={() => navigate("/explore")}
                    className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white text-xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                    Start Exploring Now
                </button>

                <div className="flex justify-center mt-12 space-x-3">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-amber-500 scale-125" : "bg-white/50"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <button
                onClick={goToPrev}
                className="absolute left-4 z-20 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 hidden md:block"
                aria-label="Previous image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 z-20 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 hidden md:block"
                aria-label="Next image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm z-20">
                Prayagraj Tourist Transport Planner © {new Date().getFullYear()}
            </div>
        </div>
    );
}