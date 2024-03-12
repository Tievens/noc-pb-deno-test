// routes/notes/index.tsx
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State, Note } from "$/shared/types.ts";

type NotesData = {
  notes: Note[];
};

export default function Notes({ data }: PageProps<NotesData, State>) {
  const { notes } = data;

  return (
    <>
      <Head>
        <title>Notes</title>
        <meta
          name="description"
          content="Here is the collection of your notes."
        />
      </Head>
      <main>
        <h1>Notes</h1>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <a href={`/notes/${note.id}`}>
                <article>
                  <h2>{note.title}</h2>
                  <p>
                    {note.body.length > 100
                      ? note.body.slice(0, 100) + "..."
                      : note.body}
                  </p>
                  <address>
                    <time dateTime={note.created} title="Created at">
                      {note.created}
                    </time>
                    <time dateTime={note.updated}>
                      Last modified: {note.updated}
                    </time>
                  </address>
                </article>
              </a>
            </li>
          ))}
        </ul>
        <form action="/api/notes/create" method="POST">
          <button type="submit" title="Create new note">
            +
          </button>
        </form>
      </main>
    </>
  );
}

export const handler: Handlers<NotesData, State> = {
  GET: async (_req, ctx) => {
    const notes = await ctx.state.pb.collection("notes").getFullList<Note>({
      expand: "links",
    });

    return ctx.render({
      notes,
    });
  },
};