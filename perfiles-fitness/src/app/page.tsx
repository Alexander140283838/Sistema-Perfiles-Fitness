"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn === "true") {
      router.replace("/inicio");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-2">Redirigiendo...</h1>
      <p className="text-gray-400">Por favor espera un momento.</p>
    </div>
  );
}
