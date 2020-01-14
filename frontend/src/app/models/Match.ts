import { Deserializable } from './deserializable';
import { User } from './User';
import { MatchSet } from './MatchSet';

export class Match implements Deserializable
{
    matchId?: number;
    firstPerson?: User;
    secondPerson?: User;
    winner?: User;
    matchSet?: MatchSet[];
    date?: string;
    round?: number;

    deserialize(input: any) {
		Object.assign(this, input);
		return this;
	}
}