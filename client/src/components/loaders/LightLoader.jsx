import React from "react";

const LightLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
        <div className="absolute inset-0">
          <ul className="m-0 p-0 list-none">
            {[...Array(12)].map((_, index) => (
              <li
                key={index}
                className="absolute w-1 h-8 rounded left-1/2 top-[10px] -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `rotate(${index * 30}deg)`,
                }}
              >
                <div
                  className="absolute bottom-0 left-0 w-1 rounded bg-white/50"
                  style={{
                    animation: "pulse 6s normal infinite",
                    animationDelay: `${(index + 1) * 100}ms`,
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            height: 0%;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
          }
          20% {
            background: rgba(255, 255, 255, 0.7);
            height: 100%;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0);
          }
          50% {
            background: rgba(17, 217, 255, 1);
            box-shadow: 0 0 8px rgba(17, 217, 255, 0.8);
          }
          80% {
            background: rgba(255, 255, 255, 0.7);
            height: 100%;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0);
          }
          100% {
            height: 0%;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
          }
        }

        li::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.03) 0%,
            rgba(255, 255, 255, 0.03) 49%,
            rgba(255, 255, 255, 0.02) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
        }

        li:nth-of-type(1) {
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        li:nth-of-type(7) {
          box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.1);
        }
        li:nth-of-type(8),
        li:nth-of-type(9),
        li:nth-of-type(10),
        li:nth-of-type(11),
        li:nth-of-type(12) {
          box-shadow: -1px 0 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default LightLoader;
