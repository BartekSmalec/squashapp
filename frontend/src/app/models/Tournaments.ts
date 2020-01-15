import { Deserializable } from "./deserializable";
import { Match } from "./Match";
import { Tournament } from "./Tournament";

export class Tournaments implements Deserializable {
  tournament?: Tournament[];

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
