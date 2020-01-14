import { Deserializable } from './deserializable';

export class LoginDetails implements Deserializable
{
    username?: number;
    password?: string;

    deserialize(input: any) {
		Object.assign(this, input);
		return this;
	}
}