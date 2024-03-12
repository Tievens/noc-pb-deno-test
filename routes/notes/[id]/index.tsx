// routes/notes/[id]/index.tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State, Note } from "$/shared/types.ts";

type NoteDetailData = {
  note: Note;
};

export default function NoteDetail({ data }: PageProps<NoteDetailData, State>) {
  const { note } = data;

  return (
    <>
      <Head>
        <title>{note.title}</title>
      </Head>
      <main>
        <article>
          <h1>{note.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: note.body }}></div>
        </article>
        <h2>🔗 Linked notes</h2>
        {(note.expand?.links.length ?? 0) === 0 ? (
          <p class="note">You don't have any links for this note.</p>
        ) : (
          <ul>
            {note.expand?.links.map((link) => (
              <li key={link.id}>
                <a href={`/notes/${link.id}`}>{note.title}</a>
              </li>
            ))}
          </ul>
        )}
        <footer>
          <form action={`/notes/${note.id}/edit`}>
            <button type="submit">Edit</button>
          </form>
        </footer>
      </main>
    </>
  );
}

export const handler: Handlers<NoteDetailData, State> = {
  GET: async (_req, ctx) => {
    const note = await ctx.state.pb
      .collection("notes")
      .getOne<Note>(ctx.params.id, {
        expand: "links",
      });

    if (!note) {
      return ctx.renderNotFound();
    }

    return ctx.render({
      note,
    });
  },
};