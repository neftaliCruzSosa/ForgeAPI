import type { Entity,Field,Protect } from "@prisma/client";
export type IEntity = Entity & {
    fields: Field[];
    protect: Protect[];
};
    