import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, removeChat } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId, model }) {
        try {
            dispatch(setLoading(true))
            const data = await sendMessage({ message, chatId, model })
            const { chat, aiMessage } = data
            
            const targetChatId = chatId || chat?._id
            
            if (!chatId && chat) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
            }
            
            dispatch(addNewMessage({
                chatId: targetChatId,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: targetChatId,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
            dispatch(setCurrentChatId(targetChatId))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to send message"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true))
            const data = await getChats()
            const { chats } = data
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }
                return acc
            }, {})))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to retrieve chats"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            if (chats[chatId]?.messages.length === 0) {
                const data = await getMessages(chatId)
                const { messages } = data

                const formattedMessages = messages.map(msg => ({
                    content: msg.content,
                    role: msg.role,
                    time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }))

                dispatch(addMessages({
                    chatId,
                    messages: formattedMessages,
                }))
            }
            dispatch(setCurrentChatId(chatId))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch messages"))
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            dispatch(setLoading(true))
            await deleteChat(chatId)
            dispatch(removeChat(chatId))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to delete chat"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat
    }

}
