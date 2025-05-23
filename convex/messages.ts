import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const SHOW_COMMENTS = true;

export const list = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    try {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
        .order("asc")
        .collect();

      if (SHOW_COMMENTS) {
        console.log("📜 Retrieved messages:", { chatId: args.chatId, count: messages.length });
      }

      return messages;
    } catch (error) {
      console.error(`Error retrieving messages for chat ${args.chatId}:`, error);
      throw new Error(`Failed to retrieve messages: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

export const send = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    if (SHOW_COMMENTS) {
      console.log("📤 Sending message to chat:", args.chatId);
    }

    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity) {
    //   throw new Error("Not authenticated");
    // }

    try {
      // Verify the chat exists before trying to add a message
      const chat = await ctx.db.get(args.chatId);
      if (!chat) {
        console.error(`Chat not found: ${args.chatId}`);
        throw new Error(`Chat not found: ${args.chatId}`);
      }

      // Save the user message with preserved newlines
      const messageId = await ctx.db.insert("messages", {
        chatId: args.chatId,
        content: args.content.replace(/\n/g, "\\n"),
        role: "user",
        createdAt: Date.now(),
      });

      if (SHOW_COMMENTS) {
        console.log("✅ Saved user message:", { messageId, chatId: args.chatId });
      }

      return messageId;
    } catch (error) {
      console.error(`Error sending message to chat ${args.chatId}:`, error);
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

export const store = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  },
  handler: async (ctx, args) => {
    if (SHOW_COMMENTS) {
      console.log("💾 Storing message for chat:", args.chatId);
    }

    try {
      // Verify the chat exists before trying to add a message
      const chat = await ctx.db.get(args.chatId);
      if (!chat) {
        console.error(`Chat not found: ${args.chatId}`);
        throw new Error(`Chat not found: ${args.chatId}`);
      }

      // Store message with preserved newlines and HTML
      const messageId = await ctx.db.insert("messages", {
        chatId: args.chatId,
        content: args.content
          .replace(/\n/g, "\\n")
          // Don't escape HTML - we'll trust the content since it's generated by our system
          .replace(/\\/g, "\\\\"), // Only escape backslashes
        role: args.role,
        createdAt: Date.now(),
      });

      if (SHOW_COMMENTS) {
        console.log("✅ Stored message:", { messageId, chatId: args.chatId });
      }

      return messageId;
    } catch (error) {
      console.error(`Error storing message for chat ${args.chatId}:`, error);
      throw new Error(`Failed to store message: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

export const getLastMessage = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const chat = await ctx.db.get(args.chatId);
    if (!chat || chat.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .first();

    return messages;
  },
});
