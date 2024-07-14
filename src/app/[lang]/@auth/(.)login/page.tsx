"use client";

import Login from "@/components/client/Login";
import Modal from "@/components/client/Modal";
import { useRouter } from "next/navigation";
// import { login } from "../action";
import { useState } from "react";

export default function ModalPage() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  function afterLogin() {
    setIsOpen(false);
    setTimeout(() => {
      // router.back();
      // window.location.replace("/");
      history.replaceState(null, "", "/");
      location.reload();
    }, 0);
  }
  return (
    // <>登录框</>
    <Modal isOpen={isOpen}>
      <Login afterLogin={afterLogin} />
    </Modal>
  );
}
