import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children }: { children: ReactNode }) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    const el = elRef.current;

    if (!modalRoot || !el) {
      return;
    }

    modalRoot.appendChild(el);

    return () => {
      if (modalRoot.contains(el)) {
        modalRoot.removeChild(el);
      }
    };
  }, []);

  return createPortal(
    <div className="rounded-[30px] bg-background p-3.75 text-center">
      {children}
    </div>,
    elRef.current,
  );
};

export default Modal;