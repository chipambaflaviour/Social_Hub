import React, { useState } from "react";
import { useStore } from "../store/useStore";

export default function CommentSection({ post }) {
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const addComment = useStore((state) => state.addComment);
  const addReply = useStore((state) => state.addReply);
  const user = useStore((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText("");
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addReply(post.id, commentId, replyText);
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="p-md pt-0 mt-2">
      {post.comments.map((c) => (
        <div key={c.id} className="mb-3 text-sm">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0">
              <span className="flex items-center justify-center h-full w-full bg-primary text-white font-bold text-xs">
                {c.author.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="bg-surface-container-low px-3 py-2 rounded-xl rounded-tl-none inline-block">
                <span className="font-bold block text-on-surface">
                  {c.author}
                </span>
                <span className="text-on-surface-variant">{c.content}</span>
              </div>
              <div className="text-xs text-on-surface-variant mt-1 ml-2 flex gap-3 font-medium">
                <button className="hover:text-primary transition-colors">
                  Like
                </button>
                <button
                  className="hover:text-primary transition-colors"
                  onClick={() =>
                    setReplyingTo(replyingTo === c.id ? null : c.id)
                  }
                >
                  Reply
                </button>
                <span>Just now</span>
              </div>
            </div>
          </div>

          {/* Replies */}
          {c.replies?.length > 0 && (
            <div className="ml-10 mt-2 space-y-2 border-l-2 border-surface-container-highest pl-3">
              {c.replies.map((r) => (
                <div key={r.id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container overflow-hidden shrink-0">
                    <span className="flex items-center justify-center h-full w-full bg-secondary text-white font-bold text-[10px]">
                      {r.author.charAt(0)}
                    </span>
                  </div>
                  <div className="bg-surface-container-low px-3 py-1.5 rounded-xl rounded-tl-none inline-block text-xs">
                    <span className="font-bold block text-on-surface">
                      {r.author}
                    </span>
                    <span className="text-on-surface-variant">{r.content}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Input */}
          {replyingTo === c.id && (
            <form
              onSubmit={(e) => handleReplySubmit(e, c.id)}
              className="flex gap-2 mt-2 ml-10 items-center"
            >
              <img
                alt="Avatar"
                className="w-6 h-6 rounded-full object-cover"
                src={user.avatar}
              />
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                autoFocus
                className="flex-1 bg-surface-container px-3 py-1 rounded-full text-xs border-none focus:ring-0"
              />
            </form>
          )}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mt-3 items-center pt-2 border-t border-surface-container-lowest"
      >
        <img
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover shrink-0"
          src={user.avatar}
        />
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-surface-container px-3 py-1.5 rounded-full text-sm border-none focus:ring-0"
        />
      </form>
    </div>
  );
}
