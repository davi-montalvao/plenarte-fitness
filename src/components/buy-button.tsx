"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BuyButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        setError(data.error ?? "Erro ao iniciar pagamento");
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleBuy}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Redirecionando..." : "Comprar agora"}
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
