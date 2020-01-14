import { Deserializable } from './deserializable';
import { User } from './User';

export class Comment implements Deserializable
{
    id?: number;
    content?: string;
    author?: User;
    date?: string;

    deserialize(input: any) {
		Object.assign(this, input);
		return this;
	}
}