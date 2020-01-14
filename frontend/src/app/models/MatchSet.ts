import { Deserializable } from './deserializable';
import { User } from './User';

export class MatchSet implements Deserializable
{
    id?: number;
    firstPerson?: number;
    secondPerson?: String;
    winner?: User;
   

    deserialize(input: any) {
		Object.assign(this, input);
		return this;
	}
}