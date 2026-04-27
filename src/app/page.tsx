import { MeshGradient } from "@/components/mesh-gradient";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MeshGradient />
      
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="text-center space-y-8 px-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 animate-pulse">
              Crazy Modern UI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of web design with animated mesh gradients and stunning visual effects
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white font-semibold px-8 py-6 text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25"
            >
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-cyan-400">∞</div>
              <div className="text-sm text-gray-300 mt-1">Infinite</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-purple-400">⚡</div>
              <div className="text-sm text-gray-300 mt-1">Lightning</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-pink-400">🚀</div>
              <div className="text-sm text-gray-300 mt-1">Rocket</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
