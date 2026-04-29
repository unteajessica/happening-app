import type { EventItem } from "./event";

export type OfflineOperation =
    | {
          type: "create";
          payload: Omit<EventItem, "id">;
      }
    | {
          type: "update";
          payload: EventItem;
      }
    | {
          type: "delete";
          id: number;
      };