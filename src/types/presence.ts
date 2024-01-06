import { User } from "./user"
import { Event } from "./event"

export type Presence ={
    user:User,
    event:Event,
    create_at:string,
}