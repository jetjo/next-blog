"use client";

import React, { useEffect, useRef, useState } from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  // onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen }: ModalProps) => {
  const $dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if ($dialog.current && isOpen) {
      $dialog.current.showModal();
    } else if ($dialog.current) {
      $dialog.current.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={$dialog} className={`backdrop:transparent rounded shadow `}>
      {children}
    </dialog>
  );
};

export default Modal;
