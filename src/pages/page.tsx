import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Component() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("google")}>Sign in</button>
    </>
  );
}
