import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users and their socket IDs
const userSocketMap = {}; // {userId: socketId}
const typingUsers = new Set(); // Set of userIds currently typing
const userStatuses = new Map(); // Map of userId -> status data

io.on("connection", (socket) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("A user connected", socket.id);
  }

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    
    // Join user to their own room for personal events
    socket.join(userId);
    
    // Emit user online status
    io.emit("user:status", { userId, status: "online" });
  }

  // Send current online users and statuses
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.emit("status:list", Array.from(userStatuses.values()));

  // ==================== CHAT MESSAGING ===================
  socket.on("message:send", async (data) => {
    try {
      // Save message to database (would integrate with message model)
      const message = {
        _id: Date.now().toString(),
        chatId: data.chatId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        type: data.type || "text",
        createdAt: data.createdAt || Date.now(),
        seen: false,
        delivered: true
      };

      // Save to DB (placeholder - would use actual DB save)
      if (process.env.NODE_ENV !== "production") {
        console.log("Saving message:", message);
      }

      // Send to receiver's room
      const receiverSocketId = getReceiverSocketId(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message:new", message);
      }

      // Send back to sender for their own chat
      socket.emit("message:new", message);

    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // ==================== TYPING INDICATOR ===================
  socket.on("typing:start", (data) => {
    typingUsers.add(data.userId);
    
    // Broadcast to other users in the chat
    socket.broadcast.emit("typing:update", {
      userId: data.userId,
      isTyping: true
    });
  });

  socket.on("typing:stop", (data) => {
    typingUsers.delete(data.userId);
    
    // Broadcast to other users in the chat
    socket.broadcast.emit("typing:update", {
      userId: data.userId,
      isTyping: false
    });
  });

  // ==================== STATUS MANAGEMENT ===================
  socket.on("status:upload", (data) => {
    const status = {
      userId: data.userId,
      mediaUrl: data.mediaUrl,
      type: data.type || "image",
      expiresAt: data.expiresAt || Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      createdAt: Date.now()
    };

    userStatuses.set(data.userId, status);
    
    // Broadcast updated status list
    io.emit("status:list", Array.from(userStatuses.values()));
    
    if (process.env.NODE_ENV !== "production") {
      console.log("Status uploaded:", status);
    }
  });

  // ==================== VOICE MESSAGING ===================
  socket.on("voice:send", async (data) => {
    try {
      const voiceMessage = {
        _id: Date.now().toString(),
        chatId: data.chatId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        audioUrl: data.audioUrl,
        duration: data.duration,
        type: "voice",
        createdAt: data.createdAt || Date.now(),
        seen: false,
        delivered: true
      };

      if (process.env.NODE_ENV !== "production") {
        console.log("Saving voice message:", voiceMessage);
      }

      // Send to receiver
      const receiverSocketId = getReceiverSocketId(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message:new", voiceMessage);
      }

      // Send back to sender
      socket.emit("message:new", voiceMessage);

    } catch (error) {
      console.error("Error sending voice message:", error);
      socket.emit("error", { message: "Failed to send voice message" });
    }
  });

  // ==================== CALL SIGNALING ===================
  socket.on("call:start", (data) => {
    const receiverSocketId = getReceiverSocketId(data.to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:incoming", {
        from: data.from,
        chatId: data.chatId
      });
    }
  });

  socket.on("call:accept", (data) => {
    const receiverSocketId = getReceiverSocketId(data.from);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:accepted", { chatId: data.chatId });
    }
  });

  socket.on("call:reject", (data) => {
    const receiverSocketId = getReceiverSocketId(data.from);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:rejected", { chatId: data.chatId });
    }
  });

  // ==================== DISCONNECT ===================
  socket.on("disconnect", () => {
    if (process.env.NODE_ENV !== "production") {
      console.log("A user disconnected", socket.id);
    }
    
    if (userId) {
      delete userSocketMap[userId];
      typingUsers.delete(userId);
      
      // Emit user offline status
      io.emit("user:status", { userId, status: "offline" });
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
