import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    AfterUpdate
} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @AfterUpdate()
    afterUpdate(obj) {
        console.log('After updated', {obj, this: this});
    }
}
