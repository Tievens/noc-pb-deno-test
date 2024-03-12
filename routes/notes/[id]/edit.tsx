import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps, FreshContext } from "$fresh/server.ts";
import { redirect } from "$/shared/helpers.ts";
import { State, Note } from "$/shared/types.ts";

type NoteEditData = {
  note: Note;
  notes: Note[];
  errorMessage?: string;
};

export default function NoteEdit({ data }: PageProps<NoteEditData>) {
  const { note, notes } = data;

  return (
    <>
      <Head>
        <title>Edit Note</title>
      </Head>
      <main>
        <h1>Edit Note</h1>
        <form id="edit" method="POST">
          <input
            name="title"
            type="text"
            aria-label="Title"
            value={note.title}
            placeholder="Enter the title of the note"
            required
          />
          <textarea
            name="body"
            aria-label="Body"
            value={note.body}
            placeholder="Enter the body of the note"
          ></textarea>
          <fieldset>
            <legend>Select notes that you want to link to this note</legend>
            <select name="links" multiple>
              {notes.map((option) => {
                const selected = note.expand?.links.some(
                  (linked) => linked.id === option.id
                );

                const prefix = selected ? "🔗 " : "";
                const suffix = selected ? " (linked)" : "";

                const truncatedTitle = option.title.slice(
                  0,
                  selected ? 12 : 20
                );

                return (
                  <option key={option.id} value={option.id} selected={selected}>
                    {`${prefix} ${truncatedTitle} ${suffix}...`}
                  </option>
                );
              })}
            </select>
          </fieldset>
        </form>
        <footer>
          <form method="GET" action={`/notes/${note.id}`}>
            <button type="submit">Cancel</button>
          </form>
          {(note.expand?.links.length ?? 0) > 0 && (
            <form method="POST" action={`/api/notes/${note.id}/unlink`}>
              <button type="submit">Unlink all notes</button>
            </form>
          )}
          <form method="POST" action={`/api/notes/${note.id}/delete`}>
            <button type="submit">Delete</button>
          </form>
          <button form="edit" type="submit">
            Save
          </button>
        </footer>
        {data?.errorMessage && <p>{data.errorMessage}</p>}
      </main>
    </>
  );
}

async function renderNotes(
  ctx: FreshContext<State>,
  props?: Partial<NoteEditData>
) {
  const note = await ctx.state.pb
    .collection("notes")
    .getOne<Note>(ctx.params.id, {
      expand: "links",
    });

  const notes = await ctx.state.pb.collection("notes").getFullList<Note>({
    expand: "links",
  });

  if (!note) {
    return ctx.renderNotFound();
  }

  return ctx.render({
    note,
    notes: notes.filter((n) => n.id !== note.id),
    ...props,
  });
}

export const handler: Handlers<NoteEditData, State> = {
  GET: async (_req, ctx) => {
    return await renderNotes(ctx);
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const body = formData.get("body")?.toString();
    const links = formData.getAll("links");

    if (!title) {
      return await renderNotes(ctx, {
        errorMessage: "Title is required",
      });
    }

    const { id } = ctx.params;

    await ctx.state.pb.collection("notes").update(id, {
      title,
      body,
      links,
    });

    return redirect(`/notes/${id}`);
  },
};