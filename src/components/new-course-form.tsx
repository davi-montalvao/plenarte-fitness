"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function NewCourseForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const price = Number(form.get("price"));

    const res = await fetch("/api/teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "course",
        data: {
          title: String(form.get("title")),
          slug: String(form.get("slug")),
          description: String(form.get("description")),
          priceCents: Math.round(price * 100),
          published: form.get("published") === "on",
        },
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError("Não foi possível criar o curso");
      return;
    }

    router.push(`/professora/cursos/${data.course.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          className="field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm" htmlFor="slug">
          Slug (url)
        </label>
        <input
          id="slug"
          name="slug"
          required
          pattern="[a-z0-9-]+"
          placeholder="ballet-fitness-fundamentos"
          className="field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm" htmlFor="price">
          Preço (R$)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="1"
          step="0.01"
          required
          className="field"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" />
        Publicar agora
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Salvando..." : "Criar curso"}
      </button>
    </form>
  );
}
