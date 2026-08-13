"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  youtubeUrl: string;
  order: number;
};

export function LessonRow({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/teacher", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "lesson",
        data: {
          id: lesson.id,
          title: String(form.get("title")),
          description: String(form.get("description") || ""),
          youtubeUrl: String(form.get("youtubeUrl")),
          order: Number(form.get("order") || 0),
        },
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Não foi possível salvar a aula");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function onDelete() {
    const ok = window.confirm(`Excluir a aula "${lesson.title}"?`);
    if (!ok) return;

    setLoading(true);
    setError("");

    const res = await fetch("/api/teacher", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { id: lesson.id } }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Não foi possível excluir a aula");
      return;
    }

    router.refresh();
  }

  if (editing) {
    return (
      <li className="card p-4">
        <form onSubmit={onSave} className="space-y-3">
          <input
            name="title"
            required
            defaultValue={lesson.title}
            className="field"
            aria-label="Título"
          />
          <textarea
            name="description"
            rows={2}
            defaultValue={lesson.description ?? ""}
            className="field"
            aria-label="Descrição"
          />
          <input
            name="youtubeUrl"
            type="url"
            required
            defaultValue={lesson.youtubeUrl}
            className="field"
            aria-label="URL do YouTube"
          />
          <input
            name="order"
            type="number"
            min="0"
            defaultValue={lesson.order}
            className="field"
            aria-label="Ordem"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn btn-primary py-2">
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="text-sm text-[var(--muted)]"
              onClick={() => setEditing(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="card flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium">
          {lesson.order}. {lesson.title}
        </p>
        <p className="truncate text-sm text-[var(--muted)]">{lesson.youtubeUrl}</p>
        {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
      </div>
      <div className="flex gap-3 text-sm">
        <button
          type="button"
          className="text-[var(--accent)]"
          onClick={() => setEditing(true)}
          disabled={loading}
        >
          Editar
        </button>
        <button
          type="button"
          className="text-red-700"
          onClick={onDelete}
          disabled={loading}
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
