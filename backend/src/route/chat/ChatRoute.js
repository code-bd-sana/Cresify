import { Router } from "express";
import { myChatList, providerChatList, sellerChatList } from "../../controller/chat/ChatListController.js";
import { getConversations, getMessages, openConversation, sendMessage } from "../../controller/chat/ChatController.js";

const router = Router();
router.get('/chatList/:id', myChatList);
router.get('/chatList/provider/:id', providerChatList);
router.get('/chatList/seller/:id', sellerChatList);
router.post("/openConversation", openConversation);
router.get("/conversations/:userId", getConversations);
router.post("/sendMessage", sendMessage);
router.get("/messages/:conversationId", getMessages);

export default router;