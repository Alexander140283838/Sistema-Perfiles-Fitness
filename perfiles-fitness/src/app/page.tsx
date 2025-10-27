"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // ✅ Si hay sesión, redirige al dashboard de inicio
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn === "true") {
      router.replace("/inicio");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      Redirigiendo...
    </div>
  );
}
