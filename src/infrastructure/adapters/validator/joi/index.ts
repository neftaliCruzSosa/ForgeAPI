import type { AdapterModule } from "types";
import Generator from "./generator.js";
import preset from "./preset.js";

const mod: AdapterModule = {
  default: Generator,
  preset,
};

export default mod;
