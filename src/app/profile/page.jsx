import { signOut } from "@/lib/auth/auth.ts";

export default function Profile() {
  return (
    <>
      Profile Page
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  );
}
