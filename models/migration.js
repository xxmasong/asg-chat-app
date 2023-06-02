const mongoose = require('mongoose');
const { mongoURI } = require('../config/keys');
const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');

mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        // Drop existing collections if they exist

        return Promise.all([
            User.deleteMany(),
            Conversation.deleteMany(),
            Message.deleteMany(),
        ]);
    })
    .then(() => {
        // Migrate User schema
        const users = [
            { name: 'John Doe', username: 'johndoe', password: 'password1' },
            { name: 'Jane Smith', username: 'janesmith', password: 'password2' },
            // SAMPLE DATA, to add more ... users as needed
        ];

        return User.insertMany(users).then((createdUsers) => {
            console.log('Users migrated:', createdUsers);
            return createdUsers;
        });
    })
    .then((createdUsers) => {
        // Migrate Conversation schema
        const conversations = [
            { recipients: [createdUsers[0]._id, createdUsers[1]._id], lastMessage: 'Hello' },
            // SAMPLE DATA, to add more ... conversations as needed
        ];

        return Conversation.insertMany(conversations).then((createdConversations) => {
            console.log('Conversations migrated:', createdConversations);
            return { createdUsers, createdConversations };
        });
    })
    .then(({ createdUsers, createdConversations }) => {
        // Migrate Message schema
        const messages = [
            { conversation: createdConversations[0]._id, to: createdUsers[1]._id, from: createdUsers[0]._id, body: 'Hello' },
            // SAMPLE DATA, to add more ... messages as needed
        ];

        return Message.insertMany(messages).then((createdMessages) => {
            console.log('Messages migrated:', createdMessages);
            return createdMessages;
        });
    })
    .then((createdMessages) => {
        // Migration completed
        mongoose.disconnect();
        console.log('Migration completed. Disconnected from MongoDB.');
    })
    .catch((error) => {
        console.error('Error:', error);
    });