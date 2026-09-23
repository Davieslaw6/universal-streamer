export function Spinner({
  size = 20,
  label = 'Loading',
}: {
  size?: number;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-block animate-spin rounded-full border-2 border-border border-t-accent"
      style={{ width: size, height: size }}
    />
  );
}
