export function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header>Creator OS</header>
      <main>{children}</main>
    </div>
  );
}

