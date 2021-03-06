import "reflect-metadata";
import { createConnection } from "typeorm";
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { User } from './entity/User';


createConnection().then(async connection => {
    const userRepository = connection.getRepository(User);

    const typeDefs = `
        type User {
            id: ID!
            firstName: String!
            lastName: String!
            age: Int!
        }

        type Query {
            users: [User!]!
            hello(name: String): String!
        }

        input createUserInput {
            firstName: String!
            lastName: String!
            age: Int!
        }

        input updateUserInput {
            id: ID!
            firstName: String
            lastName: String
            age: Int
        }

        type Mutation {
            createUser(input: createUserInput!): User
            updateUser(input: updateUserInput!): User
        }

        type Counter {
            count: Int!
        }

        type Subscription {
            counter: Counter!
        }
    `;

    const resolvers = {
        Query: {
            users: async parent => userRepository.find(),
            hello: (_, { name }) => `Hello ${name || 'world'}.`
        },

        Mutation: {
            createUser: async (_, { input }) => {
                const user = userRepository.create(input);
                return userRepository.save(user);
            },
            updateUser: async (_, { input }) => {
                const { id, ...newInfo } = input;
                const user = await userRepository.findOne( id );

                if (! user ) {
                    throw new Error("User not found");
                }

                Object.keys(newInfo).map(key => user[key] = newInfo[key]);

                return userRepository.save(user);
            }
        },
        Subscription: {
            counter: {
                subscribe: (_, args, { pubsub }) => {
                    const channel = Math.random().toString(36).substring(2, 15);
                    let counter = 0;
                    setInterval(() => pubsub.publish(channel, { counter: { count: counter++ } }), 2000);
                    console.log({ channel, counter });
                    return pubsub.asyncIterator(channel);
                }
            }
        }
    };

    const pubsub = new PubSub();
    const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
    server.start(() => console.log('Server is running on http://localhost:4000'))
}).catch(error => console.log(error));
