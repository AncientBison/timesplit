import LoginButton from "@components/loginButton";
import Link from "next/link";
import { Button } from "@ui/button";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  console.log("Session:", session);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold">TimeSplit</div>
        <div className="flex items-center gap-4">
          {session ? (
            <Button size="sm" asChild>
              <Link href="/planner" className="text-sm">Go to Planner</Link>
            </Button>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            TimeSplit
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl">
            Schedule your time efficiently with intelligent automatic planning
          </p>
          <p className="text-lg text-gray-400 max-w-2xl">
            Simply input how long you expect tasks to take, and TimeSplit automatically organizes your schedule for maximum productivity.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {!session ? (
            <LoginButton />
          ) : (
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/planner" className="text-xl px-8 py-3">Continue to Planner →</Link>
            </Button>
          )}
        </div>

        {/* Demo Calendar Preview */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div key={day} className={`text-center text-sm font-medium p-2 ${idx < 3 ? 'block' : 'hidden md:block'}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
            {/* Demo task blocks */}
            <div className="h-20 bg-gray-400/20 rounded"></div>
            <div className="h-20 bg-gray-400/20 rounded"></div>
            <div className="h-20 bg-blue-500/80 rounded flex flex-col justify-center items-center text-xs">
              <div className="font-medium">Math Hw</div>
              <div className="text-blue-200">00:40</div>
            </div>
            <div className="h-20 bg-green-500/80 rounded flex flex-col justify-center items-center text-xs">
              <div className="font-medium">Physics Hw</div>
              <div className="text-green-200">00:30</div>
            </div>
            <div className="h-20 bg-yellow-500/80 rounded flex flex-col justify-center items-center text-xs">
              <div className="font-medium">Essay</div>
              <div className="text-yellow-900">00:50</div>
            </div>
            <div className="h-20 bg-yellow-500/80 rounded flex flex-col justify-center items-center text-xs">
              <div className="font-medium">Essay</div>
              <div className="text-yellow-900">00:50</div>
            </div>
            <div className="h-20 bg-yellow-500/80 rounded flex flex-col justify-center items-center text-xs">
              <div className="font-medium">Essay</div>
              <div className="text-yellow-900">01:00</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Input Your Tasks</h3>
            <p className="text-gray-400">Add your tasks and estimate how long each one will take to complete.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Automatic Planning</h3>
            <p className="text-gray-400">Our intelligent system automatically organizes your schedule for optimal productivity.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Stay Organized</h3>
            <p className="text-gray-400">View your perfectly planned schedule and track your progress throughout the week.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose TimeSplit?</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold mb-2">Intelligent Scheduling</h3>
                    <p className="text-gray-400">Advanced algorithms optimize your schedule based on task duration and priorities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold mb-2">Visual Planning</h3>
                    <p className="text-gray-400">Color-coded calendar view makes it easy to see your week at a glance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="font-semibold mb-2">Time Management</h3>
                    <p className="text-gray-400">Break down large tasks and distribute them across multiple days automatically.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-4">Ready to get organized?</h3>
              <p className="text-gray-300 mb-6">
                Transform your productivity today with TimeSplit's intelligent scheduling.
              </p>
              {!session ? (
                <LoginButton />
              ) : (
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Link href="/planner">Open Your Planner →</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4">TimeSplit</div>
          <p className="text-gray-400">Efficient time management made simple.</p>
        </div>
      </footer>
    </main>
  );
}