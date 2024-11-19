import React from 'react';

function Intro({ name, image, fullTitle, role, specialty, expertise }) {
    return (
        <div className="py-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-white via-[var(--malibu--100)] to-white rounded-xl shadow-xl p-6 sm:p-12 backdrop-blur-sm border border-[var(--malibu--300)]/30">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--malibu--200)] rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--malibu--300)] rounded-full opacity-20 animate-pulse" />
            </div>
  
            <div className="relative flex flex-col lg:flex-row items-center gap-12">
              {/* Profile Image Section */}
              <div className="flex-shrink-0 w-48 h-48 lg:w-64 lg:h-64 relative group">
                <div className="absolute inset-0 bg-[var(--teal--600)] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover rounded-full shadow-2xl ring-8 ring-white/80 transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--teal--700)] to-[var(--purple--500)] rounded-full opacity-20 blur group-hover:opacity-30 transition-opacity duration-300" />
              </div>
  
              {/* Content Container */}
              <div className="flex-1 flex flex-col xl:flex-row gap-6 w-full">
                {/* Primary Info */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-3 text-center lg:text-left">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--brand--tiber)] via-[var(--blue--800)] to-[var(--purple--700)] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                      {name}
                    </h2>
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      <span className="bg-[var(--teal--100)] p-1.5 rounded-full text-[var(--teal--700)] animate-bounce">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <p className="text-[var(--blue--700)] font-semibold hover:text-[var(--blue--800)] transition-colors duration-300">{role}</p>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-xl shadow-md transition-all duration-300 p-6 hover:bg-white/90">
                    <p className="font-bold text-[var(--grey--900)] mb-3">Full Title</p>
                    <p className="text-[var(--grey--800)] leading-relaxed">{fullTitle}</p>
                  </div>
                </div>
  
                {/* Secondary Info */}
                <div className="flex-1 space-y-6">
                  <div className="bg-white/70 rounded-xl shadow-md transition-all duration-300 p-6 hover:bg-white/90">
                    <p className="font-bold text-[var(--grey--900)] mb-3">Specialty</p>
                    <p className="text-[var(--grey--800)] leading-relaxed">{specialty}</p>
                  </div>
                  {expertise && (
                    <div className="bg-white/70 rounded-xl shadow-md transition-all duration-300 p-6 hover:bg-white/90">
                      <p className="font-bold text-[var(--grey--900)] mb-3">Expertise</p>
                      <div className="space-y-2">
                        {expertise.map((exp, index) => (
                          <div
                            key={index}
                            className="text-[var(--grey--800)] italic bg-white/80 p-3 rounded-xl text-sm shadow-sm cursor-pointer"
                          >
                            "{exp}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Intro;