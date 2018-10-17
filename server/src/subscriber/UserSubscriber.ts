import {EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent} from "typeorm";
import { User } from '../entity/User';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    /**
     * Called before entity insertion.
     */
    beforeInsert(event: InsertEvent<User>) {
        console.log(`BEFORE ENTITY INSERTED: `, event.entity);
    }

    afterInsert(event: InsertEvent<User>) {
        console.log(`AFTER ENTITY INSERTED: `, event.entity);
    }

     /**
     * Called before entity insertion.
     */
    beforeUpdate(event: UpdateEvent<User>) {
        console.log(`before ENTITY updated: `, event.entity);
    }

    /**
     * Called before entity insertion.
     */
    afterUpdate(event: UpdateEvent<User>) {
        console.log(`after ENTITY updated: `, event.entity);
    }
}
