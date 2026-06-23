type PetalLayer = 'outer' | 'middle' | 'inner';

type Petal = {
  layer: PetalLayer;
  angle: number;
  radius: number;
};

function createPetals(layer: PetalLayer, count: number, radius: number): Petal[] {
  return Array.from({ length: count }, (_, index) => ({
    layer,
    angle: (360 / count) * index,
    radius,
  }));
}

const petals = [
  ...createPetals('outer', 12, 156),
  ...createPetals('middle', 10, 114),
  ...createPetals('inner', 8, 78),
];

export default function CSSPetals() {
  return (
    <div className="flower-petals">
      {petals.map((petal, index) => (
        <span
          key={`${petal.layer}-${index}`}
          className={`flower-petal petal-${petal.layer}`}
          style={{
            ['--angle' as string]: `${petal.angle}deg`,
            ['--radius' as string]: `${petal.radius}px`,
          }}
        />
      ))}
    </div>
  );
}
