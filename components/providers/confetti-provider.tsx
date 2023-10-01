"use client"

import { useConfettiStore } from "@/hooks/use-confetti-store";
import ReactConfetti from "react-confetti";

export const ConfettiProvider = () => {

  const confettit = useConfettiStore();

  if(!confettit.isOpen) return null;

  return (
    <ReactConfetti
      numberOfPieces={100}
      recycle={false}
      className="pointer-events-none absolute inset-0 z-50"
      onConfettiComplete={() => confettit.onClose()}
    />
  );
}
