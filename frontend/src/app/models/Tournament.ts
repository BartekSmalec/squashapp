import { Deserializable } from './deserializable';
import { Match } from './Match';
import { User } from './User';

export class Tournament implements Deserializable
{
    tournamentId?: number;
    tournamentName?: string;
    date?: String;
    city?: String;
    country?: string;
    name?: string;
    surname?: string;
    age?: string;
    sportFacility? : string;
    category? : string;
    men?: boolean;
    woman?: boolean;
    prize?: number;
    numOfSets?: number;
    typeOfCountingResult?: boolean;
    matches?: Match[];
    comments?: Comment[];
    participants?: User[];


    deserialize(input: any) {
		Object.assign(this, input);
		return this;
	}
}