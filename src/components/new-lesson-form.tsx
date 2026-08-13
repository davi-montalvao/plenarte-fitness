"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function NewLessonForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.target as HTMLFormElement);

    const res = await fetch("/api/teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "lesson",
        data: {
          courseId,
          title: String(form.get("title")),
          description: String(form.get("description") || ""),
          youtubeUrl: String(form.get("youtubeUrl")),
          order: Number(form.get("order") || 0),
        },
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Não foi possível adicionar a aula");
      return;
    }

    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="max-w-xl space-y-4 border-t border-[var(--line)] pt-6"
    >
      <h2 className="font-display text-2xl">Nova aula</h2>
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
        <label className="mb-1 block text-sm" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          className="field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm" htmlFor="youtubeUrl">
          URL do YouTube (unlisted)
        </label>
        <input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          required
          placeholder="https://www.youtube.com/watch?v=..."
          className="field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm" htmlFor="order">
          Ordem
        </label>
        <input
          id="order"
          name="order"
          type="number"
          min="0"
          defaultValue={0}
          className="field"
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Salvando..." : "Adicionar aula"}
      </button>
    </form>
  );
}
