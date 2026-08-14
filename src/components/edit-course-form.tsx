"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceCents: number;
  coverUrl: string | null;
  published: boolean;
};

export function EditCourseForm({ course }: { course: Course }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const price = Number(form.get("price"));
    const coverUrl = String(form.get("coverUrl") || "").trim();

    const res = await fetch("/api/teacher", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "course",
        data: {
          id: course.id,
          title: String(form.get("title")),
          slug: String(form.get("slug")),
          description: String(form.get("description")),
          priceCents: Math.round(price * 100),
          coverUrl: coverUrl || null,
          published: form.get("published") === "on",
        },
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Não foi possível salvar o curso");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <div className="card space-y-4 p-4 sm:p-6">
      <div>
        <p className="text-sm text-[var(--muted)]">Título</p>
        <p className="font-medium">{course.title}</p>
      </div>

      <div className="border-t border-[var(--line)] pt-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm"
          onClick={() => {
            setOpen((value) => !value);
            setError("");
          }}
          aria-expanded={open}
        >
          <span className="text-[var(--muted)]">Editar curso</span>
          <span className="inline-flex items-center gap-1.5 text-[var(--accent)]">
            {open ? "Fechar" : "Abrir"}
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className={`h-3.5 w-3.5 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            >
              <path
                d="M3.5 6L8 10.5L12.5 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>

      {open && (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={course.title}
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
              defaultValue={course.slug}
              className="field"
            />
            <p className="mt-1 text-xs text-[var(--muted)]">
              Aparece em /cursos/seu-slug
            </p>
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
              defaultValue={course.description}
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
              min="0.01"
              step="0.01"
              required
              defaultValue={(course.priceCents / 100).toFixed(2)}
              className="field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm" htmlFor="coverUrl">
              Capa (caminho da imagem)
            </label>
            <input
              id="coverUrl"
              name="coverUrl"
              defaultValue={course.coverUrl ?? ""}
              placeholder="/images/curso-capa-v2.png"
              className="field"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={course.published}
            />
            Publicado
          </label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full sm:w-auto"
          >
            {loading ? "Salvando..." : "Salvar curso"}
          </button>
        </form>
      )}
    </div>
  );
}
