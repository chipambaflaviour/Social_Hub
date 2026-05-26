import { create } from "zustand";
import { supabase } from "../lib/supabase";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
  if (diff < 172800000) return "Yesterday";
  return Math.floor(diff / 86400000) + "d ago";
};

const mapPost = (p) => ({
  ...p,
  timestamp: formatTimeAgo(p.created_at),
});

const mapSuggestion = (s) => ({
  ...s,
  timestamp: formatTimeAgo(s.created_at),
});

const mapFlagged = (f) => ({
  ...f,
  timestamp: formatTimeAgo(f.created_at),
});

export const useStore = create((set, get) => ({
  posts: [],
  users: [],
  user: {
    name: "Alex Sterling",
    role: "Senior Director, Strategy & Ops",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDahWWM14DYAWB9zffH945GXDscRxLnYxzqKmaUOR4lqR1N6lpiu4gFP1rF9vkFBChSIvNhbeJ5K9evefxNPY0F6ZZRhLuZ3uv5dvMjrErT2P9lFR7DF3f3h-s43u1oVZwyuW2T2-EZYET7rduylNOf_xdMJ5E9d5tVlC-ntUQbuRg6CX8pvlkEIecX6c4UT0HIEftU8lHza93HUIqP_maNVC0ZeBiXXQYxc68apickIukk211034kz0_fmdmZBh1e8VKYQ-KFHbD0",
    isAdmin: true,
  },
  flaggedContent: [],
  suggestions: [],
  events: [],
  groups: [],
  isInitialized: false,
  darkMode: false,

  toggleDarkMode: () => {
    const { darkMode } = get();
    const newDarkMode = !darkMode;
    set({ darkMode: newDarkMode });
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  initializeData: async () => {
    // Check for an active session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    let currentUserProfile = null;

    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (profile) {
        currentUserProfile = {
          ...profile,
          email: session.user.email,
          isAdmin: profile.is_admin || false,
        };
      }
    }

    const [
      { data: posts },
      { data: users },
      { data: suggestions },
      { data: flagged },
      { data: events },
      { data: groups },
    ] = await Promise.all([
      supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabase.from("profiles").select("*").limit(500),
      supabase
        .from("suggestions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("flagged_content")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("events")
        .select("*")
        .order("start_time", { ascending: true })
        .limit(50),
      supabase
        .from("social_groups")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    const finalState = {
      posts: (posts || []).map(mapPost),
      users: users || [],
      suggestions: (suggestions || []).map(mapSuggestion),
      flaggedContent: (flagged || []).map(mapFlagged),
      events: events || [],
      groups: groups || [],
      isInitialized: true,
    };

    if (currentUserProfile) {
      finalState.user = currentUserProfile;
    }

    set(finalState);
  },
  addEvent: async (eventData) => {
    const { data } = await supabase
      .from("events")
      .insert([eventData])
      .select()
      .single();
    if (data) {
      set((state) => ({
        events: [...state.events, data].sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time),
        ),
      }));
    }
  },

  addGroup: async (groupData) => {
    const { data } = await supabase
      .from("social_groups")
      .insert([groupData])
      .select()
      .single();
    if (data) {
      set((state) => ({ groups: [data, ...state.groups] }));
    }
  },

  addPost: async (
    content,
    isAnnouncement = false,
    image = null,
    pollOptions = null,
  ) => {
    const state = get();

    let imageUrl = null;
    if (image instanceof File) {
      imageUrl = await get().uploadImage(image);
    } else if (typeof image === "string") {
      imageUrl = image;
    }

    const newPost = {
      type: isAnnouncement ? "announcement" : "post",
      author: {
        name: state.user.name,
        role: state.user.role,
        avatar: state.user.avatar,
      },
      content,
      image: imageUrl,
      likes: 0,
      liked_by: [],
      reactions: { "👍": 0, "❤️": 0, "😂": 0, "👏": 0 },
      comments: [],
      shares: 0,
      is_pinned: false,
    };
    if (pollOptions && pollOptions.length > 0) {
      newPost.poll = {
        options: pollOptions.map((opt) => ({ text: opt, votes: 0 })),
        votedBy: [],
      };
    }
    const { data } = await supabase
      .from("posts")
      .insert([newPost])
      .select()
      .single();
    if (data) set({ posts: [mapPost(data), ...get().posts] });
  },

  votePoll: async (postId, optionIndex) => {
    const state = get();
    const post = state.posts.find((p) => p.id === postId);
    if (!post || !post.poll || post.poll.votedBy.includes(state.user.name))
      return;

    const newOptions = [...post.poll.options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      votes: newOptions[optionIndex].votes + 1,
    };

    const updatedPoll = {
      ...post.poll,
      options: newOptions,
      votedBy: [...post.poll.votedBy, state.user.name],
    };

    set({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, poll: updatedPoll } : p,
      ),
    });

    await supabase.from("posts").update({ poll: updatedPoll }).eq("id", postId);
  },

  toggleLike: async (postId) => {
    const state = get();
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;

    // Simulate local isLiked without DB since we added liked_by text[]
    const isLiked = post.liked_by.includes(state.user.name);
    const newLikedBy = isLiked
      ? post.liked_by.filter((n) => n !== state.user.name)
      : [...post.liked_by, state.user.name];
    const newLikes = newLikedBy.length;

    const newReactions = { ...post.reactions };
    if (isLiked) {
      newReactions["👍"] = Math.max(0, (newReactions["👍"] || 1) - 1);
    } else {
      newReactions["👍"] = (newReactions["👍"] || 0) + 1;
    }

    set({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked_by: newLikedBy,
              likes: newLikes,
              reactions: newReactions,
              isLiked: !isLiked,
            }
          : p,
      ),
    });

    await supabase
      .from("posts")
      .update({
        liked_by: newLikedBy,
        likes: newLikes,
        reactions: newReactions,
      })
      .eq("id", postId);
  },

  addReaction: async (postId, emoji) => {
    const state = get();
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;

    const newReactions = {
      ...post.reactions,
      [emoji]: (post.reactions[emoji] || 0) + 1,
    };
    set({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, reactions: newReactions } : p,
      ),
    });

    await supabase
      .from("posts")
      .update({ reactions: newReactions })
      .eq("id", postId);
  },

  addComment: async (postId, comment) => {
    const state = get();
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;

    const newComment = {
      id: Date.now(),
      author: state.user.name,
      content: comment,
      replies: [],
    };
    const newComments = [...post.comments, newComment];

    set({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comments: newComments } : p,
      ),
    });

    await supabase
      .from("posts")
      .update({ comments: newComments })
      .eq("id", postId);
  },

  addReply: async (postId, commentId, reply) => {
    const state = get();
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;

    const newReply = {
      id: Date.now(),
      author: state.user.name,
      content: reply,
    };
    const newComments = post.comments.map((c) =>
      c.id === commentId
        ? { ...c, replies: [...(c.replies || []), newReply] }
        : c,
    );

    set({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comments: newComments } : p,
      ),
    });

    await supabase
      .from("posts")
      .update({ comments: newComments })
      .eq("id", postId);
  },

  pinPost: async (postId) => {
    const state = get();
    const post = state.posts.find((p) => p.id === postId);
    if (!post) return;

    set({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, is_pinned: !post.is_pinned } : p,
      ),
    });

    await supabase
      .from("posts")
      .update({ is_pinned: !post.is_pinned })
      .eq("id", postId);
  },

  editPost: async (postId, newContent) => {
    const state = get();
    set({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, content: newContent } : p,
      ),
    });
    await supabase
      .from("posts")
      .update({ content: newContent })
      .eq("id", postId);
  },

  removePost: async (postId) => {
    const state = get();
    set({
      posts: state.posts.filter((p) => p.id !== postId),
    });
    await supabase.from("posts").delete().eq("id", postId);
  },

  removeFlagged: async (flaggedId) => {
    const state = get();
    set({
      flaggedContent: state.flaggedContent.filter((f) => f.id !== flaggedId),
    });
    await supabase.from("flagged_content").delete().eq("id", flaggedId);
  },

  addSuggestion: async (content) => {
    const state = get();
    const newSuggestion = { content, status: "pending" };
    const { data } = await supabase
      .from("suggestions")
      .insert([newSuggestion])
      .select()
      .single();
    if (data) {
      set({ suggestions: [mapSuggestion(data), ...state.suggestions] });
    }
  },

  approveSuggestion: async (id, finalContent) => {
    const state = get();
    const suggestion = state.suggestions.find((s) => s.id === id);
    if (!suggestion) return;

    const newPost = {
      type: "post",
      author: {
        name: state.user.name,
        role: state.user.role,
        avatar: state.user.avatar,
      },
      content: finalContent || suggestion.content,
      likes: 0,
      liked_by: [],
      reactions: { "👍": 0, "❤️": 0, "👏": 0 },
      comments: [],
      shares: 0,
      is_pinned: false,
    };

    set({ suggestions: state.suggestions.filter((s) => s.id !== id) });
    await supabase.from("suggestions").delete().eq("id", id);

    const { data } = await supabase
      .from("posts")
      .insert([newPost])
      .select()
      .single();
    if (data) {
      set({ posts: [mapPost(data), ...get().posts] });
    }
  },

  rejectSuggestion: async (id) => {
    const state = get();
    set({ suggestions: state.suggestions.filter((s) => s.id !== id) });
    await supabase.from("suggestions").delete().eq("id", id);
  },

  removeUser: async (id) => {
    // Actually deleting users might be dangerous, just hide them from UI for prototype
    set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
    await supabase.from("profiles").delete().eq("id", id);
  },

  toggleAdminAccess: async (userId, isAdmin) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: isAdmin })
      .eq("id", userId);
    if (!error) {
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, is_admin: isAdmin } : u,
        ),
      }));
    } else {
      console.error("Failed to update admin access", error);
    }
  },

  uploadImage: async (file) => {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);
    if (uploadError) {
      console.error("Error uploading image: ", uploadError);
      return null;
    }
    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    return data.publicUrl;
  },

  updateAvatar: async (fileOrUrl) => {
    const state = get();
    let avatarUrl = fileOrUrl;
    if (fileOrUrl instanceof File) {
      avatarUrl = await get().uploadImage(fileOrUrl);
      if (!avatarUrl) return;
    }

    set({
      user: { ...state.user, avatar: avatarUrl },
      posts: state.posts.map((p) =>
        p.author.name === state.user.name
          ? {
              ...p,
              author: { ...p.author, avatar: avatarUrl },
            }
          : p,
      ),
    });

    await supabase
      .from("profiles")
      .update({ avatar: avatarUrl })
      .eq("name", state.user.name);

    const userPosts = state.posts.filter(
      (p) => p.author.name === state.user.name,
    );
    for (const post of userPosts) {
      await supabase
        .from("posts")
        .update({ author: { ...post.author, avatar: avatarUrl } })
        .eq("id", post.id);
    }
  },

  updateCoverPhoto: async (fileOrUrl) => {
    const state = get();
    let coverUrl = fileOrUrl;
    if (fileOrUrl instanceof File) {
      coverUrl = await get().uploadImage(fileOrUrl);
      if (!coverUrl) return;
    }

    set({
      user: { ...state.user, cover_photo: coverUrl },
    });

    await supabase
      .from("profiles")
      .update({ cover_photo: coverUrl })
      .eq("name", state.user.name);
  },

  updateProfile: async (newProfileData) => {
    const state = get();

    // Handle empty date strings to avoid Postgres type errors
    if (newProfileData.birth_date === "") {
      newProfileData.birth_date = null;
    }

    const updatedUser = { ...state.user, ...newProfileData };

    set({
      user: updatedUser,
      posts: state.posts.map((p) =>
        p.author.name === state.user.name
          ? {
              ...p,
              author: { ...p.author, ...newProfileData },
            }
          : p,
      ),
    });

    await supabase
      .from("profiles")
      .update(newProfileData)
      .eq("name", state.user.name);

    const userPosts = state.posts.filter(
      (p) => p.author.name === state.user.name,
    );
    for (const post of userPosts) {
      await supabase
        .from("posts")
        .update({ author: { ...post.author, ...newProfileData } })
        .eq("id", post.id);
    }
  },

  deleteAccount: async () => {
    const state = get();
    if (!state.user || !state.user.id) return;

    // Call RPC function to safely delete user from auth.users and public.profiles
    await supabase.rpc("delete_user_account");

    // Sign out from Supabase Auth
    await supabase.auth.signOut();

    // Clear local state
    set({ user: null });
  },
}));
