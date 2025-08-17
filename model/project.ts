import type { Proyect } from "@prisma/client";
import type { IEntity } from "./entity";

export type IProject = Proyect & {
    entities: IEntity[];
};
    