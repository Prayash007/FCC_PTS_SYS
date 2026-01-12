import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();
  const requestRef = useRef();
  const dotRef = useRef(null);
  const cursorRef = useRef(null);
  const targetPosition = useRef({ x: -100, y: -100 });
  const currentCursorPosition = useRef({ x: -100, y: -100 });

  // Dynamic color based on route
  const getCursorColor = () => {
    const path = location.pathname;
    if (path.includes("earn") || path.includes("store")) return "bg-emerald-400";
    if (path.includes("profile") || path.includes("leaderboard")) return "bg-amber-400";
    if (path.includes("admin")) return "bg-red-400";
    return "bg-blue-400";
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
      
      // Update dot position immediately via direct DOM manipulation
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const animate = () => {
      const dx = targetPosition.current.x - currentCursorPosition.current.x;
      const dy = targetPosition.current.y - currentCursorPosition.current.y;
      
      // Smooth lagging effect for main cursor
      currentCursorPosition.current.x += dx * 0.15;
      currentCursorPosition.current.y += dy * 0.15;
      
      // Update cursor position via direct DOM manipulation
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentCursorPosition.current.x}px, ${currentCursorPosition.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.classList.contains("hoverable") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor pointer-events-none fixed z-[9999] ${getCursorColor()} rounded-full transition-all duration-200 ease-out`}
        style={{
          left: 0,
          top: 0,
          width: isHovering ? "48px" : "24px",
          height: isHovering ? "48px" : "24px",
          opacity: isHovering ? 0.3 : 0.6,
          mixBlendMode: "difference",
        }}
      />
      {/* Cursor trail dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot pointer-events-none fixed z-[9998] bg-white rounded-full"
        style={{
          left: 0,
          top: 0,
          width: "4px",
          height: "4px",
          opacity: 0.8,
        }}
      />
    </>
  );
}
