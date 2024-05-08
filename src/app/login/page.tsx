"use client"

import Login from "@/components/client/Login";
import { login } from "../@auth/action";

export default function Page() {
  function afterLogin() {
    setTimeout(() => {
      // router.back();
      // window.location.replace("/");
      history.replaceState(null, "", "/");
      location.reload();
    }, 0);
  }

  return <Login afterLogin={afterLogin} />;
}
