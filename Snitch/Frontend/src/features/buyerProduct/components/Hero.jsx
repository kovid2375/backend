import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-white to-[#004d30]"></div>

      {/* Blur Circles */}
      <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl"></div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 lg:flex-row lg:justify-between lg:px-8">
        {/* Left */}
        <div className="max-w-xl">
          <span className="mb-4 inline-flex rounded-full bg-violet-100 px-4 py-1 text-sm font-medium text-[#004d30]">
            ✨ New Collection 2026
          </span>

          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 lg:text-6xl">
            Discover Products
            <span className="block text-[#004d30]">
              You'll Love
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explore premium products created by verified sellers from all over
            the world. Quality products with fast delivery and secure payments.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="flex items-center gap-2 rounded-full bg-[#004d30] px-7 py-3 font-semibold text-white transition hover:bg-[#004d28]">
              Shop Now
              <ArrowRight size={18} />
            </button>

            <button className="rounded-full border border-gray-300 px-7 py-3 font-medium transition hover:bg-gray-100">
              Explore
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="mt-16 lg:mt-0">
          <div className="overflow-hidden rounded-[40px] bg-white p-4 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900"
              alt="Hero"
              className="h-[500px] w-[420px] rounded-3xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}