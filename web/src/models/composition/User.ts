import { AxiosError, AxiosResponse } from "axios";
import { Attributes } from "./Attributes";
import { Eventing } from "./Eventing";
import { Sync } from "./Sync";

export interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

const rootURL = 'http://localhost:3000/users'

export class User {
  // only accept props into constructor
  // hard code dependencies as class properties
  public events: Eventing = new Eventing();
  public sync: Sync<UserProps> = new Sync<UserProps>(rootURL);

  // has to be initialized by the constructor
  public attributes: Attributes<UserProps>;

  constructor(attrs: UserProps) {
    this.attributes = new Attributes<UserProps>(attrs);
  }
  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  set(update: UserProps): void {
    this.attributes.set(update);
    this.trigger('change');
  }

  fetch(): void {
    const id = this.attributes.get('id');
    if(typeof id !== 'number') {
      throw new Error('Cannot fetch without an id')
    }

    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data)
    })
  }

  save(): void {
    this.sync.save(this.attributes.getAll()).then((response: AxiosResponse): void => {
      this.events.trigger('save');
    }).catch((error: AxiosError): void => {
      this.events.trigger('error');
    })
  }
}
