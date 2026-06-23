const floatingPetals = Array.from({ length: 22 }, (_, index) => ({
  left: `${(index * 37) % 96}%`,
  top: `${8 + ((index * 19) % 74)}%`,
  delay: `${index * -0.37}s`,
  scale: 0.54 + (index % 5) * 0.12,
  driftX: -120 + (index % 7) * 46,
  driftY: -220 - (index % 6) * 34,
  spin: -160 + (index % 9) * 48,
  opacity: 0.36 + (index % 4) * 0.12,
}));

export default function FloatingPetals() {
  return (
    <div className="floating-petals" aria-hidden="true">
      {floatingPetals.map((petal, index) => (
        <span
          key={index}
          className="floating-petal"
          data-x={petal.driftX}
          data-y={petal.driftY}
          data-r={petal.spin}
          style={{
            left: petal.left,
            top: petal.top,
            opacity: petal.opacity,
            animationDelay: petal.delay,
            transform: `scale(${petal.scale})`,
          }}
        />
      ))}
    </div>
  );
}
