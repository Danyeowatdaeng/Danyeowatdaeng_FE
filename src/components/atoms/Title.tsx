export default function Title({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1 className={`text-xl font-bold text-gray-900 ${className}`}>
      {children}
    </h1>
  );
}
