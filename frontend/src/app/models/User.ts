import { Deserializable } from './deserializable';

export class User implements Deserializable
{
    id?: number;
    userName?: string;
    password?: string;
    active?: boolean;
    roles?: string;
    name?: string;
    surname?: string;
    age?: string;

    deserialize(input: any) {
		Object.assign(this, input);
		return this;
	}
}