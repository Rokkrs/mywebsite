const vineBranches = [
  'top',
  'topMirror',
  'topCenter',
  'left',
  'right',
  'bottom',
  'bottomMirror',
  'middle',
  'middleMirror',
  'lowCenter',
] as const;

export default function GardenVines() {
  return (
    <div className="garden-vines" aria-hidden="true">
      {vineBranches.map((branch) => (
        <img
          className={`garden-branch garden-branch-${branch}`}
          key={branch}
          src="/vera/vine-branch.png"
          alt=""
          loading="eager"
        />
      ))}
    </div>
  );
}
