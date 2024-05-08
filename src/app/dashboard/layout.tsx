import { checkUserRole } from "@/lib/auth";
import Nav from "../(community)/components/Nav";

export default function Layout({
  user,
  admin,
  analytics,
  children,
}: {
  user: React.ReactNode;
  admin: React.ReactNode;
  analytics: React.ReactNode;
  children: React.ReactNode;
}) {
  const role = checkUserRole();
  return (
    <>
      <Nav />
      {role === "admin" ? admin : user}
      {analytics}
      {children}
    </>
  );
}
