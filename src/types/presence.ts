import { User } from "./user"
import { Event } from "./event"

export type Presence ={
    user:User,
    event:Event,
    created_at:string,
}

export type CreatePresence ={
    event_id: string,
    user_id?:string|null,
    user?:User|null,
}