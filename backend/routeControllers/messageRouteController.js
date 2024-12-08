import Conversation from "../Models/conversationModel.js";
import Message from "../Models/messageSchema.js";

export const sendMessage = async (req, res) => {
    try {
        // Extract data from the request body
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Check if the message is valid (non-empty)
        if (!message || message.trim() === "") {
            return res.status(400).send({
                success: false,
                message: "Message cannot be empty"
            });
        }

        console.log("Sender ID:", senderId, "Receiver ID:", receiverId);
        console.log("Message content:", message);

        // Check if conversation exists
        let chats = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // If no conversation, create a new one
        if (!chats) {
            console.log("No conversation found. Creating a new one...");
            chats = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [], // Initialize the messages array explicitly
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message: message,
            conversationId: chats._id
        });

        // Add the new message ID to the conversation
        chats.messages.push(newMessage._id);

        // Save both the message and the conversation
        await newMessage.save();
        await chats.save(); // Save the updated conversation with the new message

        console.log("Message sent successfully:", newMessage);

        // Respond with the new message
        res.status(200).send({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
    } catch (error) {
        console.error("Error sending message:", error);

        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }

    
};
export const getMessages=async(req,res)=>{
try {
    const {id:reciverId} = req.params;
    const senderId = req.user._id;

    const chats = await Conversation.findOne({
        participants:{$all:[senderId , reciverId]}
    }).populate("messages")

    if(!chats)  return res.status(200).send([]);
    const message = chats.messages;
    res.status(200).send(message)
} catch (error) {
    res.status(500).send({
        success: false,
        message: error
    })
    console.log(`error in getMessage ${error}`);
}
}


