// shared/types.ts
import Pocketbase from "pocketbase";

export type User = {
  id: string;
  avatar: string; // File name
  email: string;
  username: string;
  name: string;
  avatarUrl: string;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  created: string;
  updated: string;
  expand?: {
    links: Note[];
  };
};

export type State = {
  pb: Pocketbase;
  user?: User;
};

export enum AuthCookie {
  Name = "auth",
  MaxAge = 60 * 60 * 24 * 30,
  SameSite = "Strict",
}