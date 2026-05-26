import React, { useState } from "react";
import { useStore } from "../store/useStore";
import CommentSection from "./CommentSection";

export default function PostCard({ post }) {
  const toggleLike = useStore((state) => state.toggleLike);
  const addReaction = useStore((state) => state.addReaction);
  const pinPost = useStore((state) => state.pinPost);
  const removePost = useStore((state) => state.removePost);
  const editPost = useStore((state) => state.editPost);
  const votePoll = useStore((state) => state.votePoll);
  const user = useStore((state) => state.user);

  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const handleReaction = (emoji) => {
    addReaction(post.id, emoji);
    setShowReactions(false);
  };

  const handleEditSubmit = () => {
    if (editContent.trim()) {
      editPost(post.id, editContent);
      setIsEditing(false);
    }
  };

  const renderMenu = () => {
    const isAuthor = post.author.name === user.name;
    if (!user.isAdmin && !isAuthor) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-on-surface-variant p-1 rounded-full hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">more_vert</span>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-surface-container py-2 z-10">
            {isAuthor && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-surface-container text-sm flex items-center gap-2 text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">
                  edit
                </span>
                Edit Post
              </button>
            )}
            {user.isAdmin && (
              <button
                onClick={() => {
                  pinPost(post.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-surface-container text-sm flex items-center gap-2 text-secondary"
              >
                <span className="material-symbols-outlined text-[18px]">
                  push_pin
                </span>
                {post.isPinned ? "Unpin Post" : "Pin Post"}
              </button>
            )}
            {(user.isAdmin || isAuthor) && (
              <button
                onClick={() => {
                  removePost(post.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-surface-container text-sm flex items-center gap-2 text-error"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
                Remove Post
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPostText = () => {
    if (isEditing) {
      return (
        <div className="mb-md">
          <textarea
            className="w-full border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary"
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 rounded text-on-surface-variant hover:bg-surface-container font-label-md"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-1.5 rounded bg-primary text-white hover:bg-primary-container font-label-md"
            >
              Save
            </button>
          </div>
        </div>
      );
    }
    return (
      <p className="font-body-md text-on-surface leading-relaxed mb-md whitespace-pre-wrap">
        {post.content}
      </p>
    );
  };

  const renderPoll = () => {
    if (!post.poll) return null;
    const totalVotes = post.poll.options.reduce(
      (acc, opt) => acc + opt.votes,
      0,
    );
    const hasVoted = post.poll.votedBy.includes(user.name);

    return (
      <div className="mt-md space-y-2 border border-surface-container rounded-xl p-4 bg-surface-container-lowest">
        {post.poll.options.map((opt, idx) => {
          const percentage =
            totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
          return (
            <div key={idx} className="relative">
              {hasVoted ? (
                <div className="relative h-10 w-full bg-surface-container-low rounded-lg overflow-hidden flex items-center px-3 border border-outline-variant">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary/20 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <div className="relative z-10 flex justify-between w-full font-body-md text-on-surface">
                    <span>{opt.text}</span>
                    <span className="font-bold">{percentage}%</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => votePoll(post.id, idx)}
                  className="w-full text-left h-10 px-4 rounded-lg border border-outline hover:border-primary hover:bg-primary-container/20 transition-colors font-body-md text-on-surface flex justify-between items-center group"
                >
                  <span>{opt.text}</span>
                </button>
              )}
            </div>
          );
        })}
        <div className="text-right text-on-surface-variant font-label-sm mt-2">
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (post.type === "announcement") {
      return (
        <article className="bg-surface-container-lowest rounded-xl border-2 border-primary shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden mb-md">
          <div className="bg-primary px-md py-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.isPinned && (
                <span className="material-symbols-outlined text-white text-sm">
                  push_pin
                </span>
              )}
              <span className="text-white font-label-sm uppercase tracking-widest">
                HR Announcement
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-white text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                campaign
              </span>
              {renderMenu()}
            </div>
          </div>
          <div className="p-md space-y-sm">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">
                  {post.author.icon || "corporate_fare"}
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface leading-tight">
                  Announcement from {post.author.name}
                </h3>
                <p className="text-on-surface-variant font-label-md">
                  Posted • {post.timestamp}
                </p>
              </div>
            </div>
            {renderPostText()}
            {renderPoll()}
            {post.image && (
              <div className="mt-2 rounded-lg overflow-hidden border border-outline-variant">
                <img
                  alt="Post content"
                  className="w-full max-h-80 object-cover"
                  src={post.image}
                />
              </div>
            )}
          </div>
        </article>
      );
    }

    if (post.type === "recognition") {
      return (
        <article className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-md border-l-4 border-secondary mb-md">
          <div className="flex items-start gap-md">
            <div className="relative">
              <img
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-secondary"
                src={post.author.avatar}
              />
              <div className="absolute -bottom-1 -right-1 bg-secondary text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  military_tech
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-headline-sm text-on-surface">
                  Congratulations, {post.author.name}!
                </h4>
                <div className="flex items-center gap-2">
                  {post.isPinned && (
                    <span className="material-symbols-outlined text-secondary text-[16px]">
                      push_pin
                    </span>
                  )}
                  <span className="text-on-surface-variant font-label-sm">
                    {post.timestamp}
                  </span>
                  {renderMenu()}
                </div>
              </div>
              {renderPostText()}
              {renderPoll()}
              {post.tags && (
                <div className="mt-md flex gap-sm">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-full font-label-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      );
    }

    // Default post
    const totalReactions = Object.values(post.reactions || {}).reduce(
      (acc, val) => acc + val,
      0,
    );

    return (
      <article className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] mb-md overflow-hidden border border-surface-container-highest">
        <div className="p-md flex items-center justify-between">
          <div className="flex items-center gap-sm">
            {post.author.avatar ? (
              <img
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                src={post.author.avatar}
              />
            ) : post.author.icon ? (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined">
                  {post.author.icon}
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-label-md text-on-surface">
                  {post.author.name}
                </h3>
                {post.isPinned && (
                  <span className="material-symbols-outlined text-secondary text-[14px]">
                    push_pin
                  </span>
                )}
              </div>
              <p className="text-on-surface-variant font-label-sm">
                {post.author.role} • {post.timestamp}
              </p>
            </div>
          </div>
          {renderMenu()}
        </div>
        <div className="px-md pb-sm">
          {renderPostText()}
          {renderPoll()}
        </div>
        {post.image && (
          <div className="relative w-full aspect-video bg-surface-container overflow-hidden">
            <img
              alt="Post content"
              className="w-full h-full object-cover"
              src={post.image}
            />
          </div>
        )}
        <div className="p-md pb-2">
          <div className="flex items-center justify-between pb-sm border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {post.reactions?.["❤️"] > 0 && (
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center border-2 border-white z-20">
                    <span className="text-[10px]">❤️</span>
                  </div>
                )}
                {post.reactions?.["👍"] > 0 && (
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white z-10">
                    <span className="text-[10px]">👍</span>
                  </div>
                )}
                {post.reactions?.["😂"] > 0 && (
                  <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center border-2 border-white z-0">
                    <span className="text-[10px]">😂</span>
                  </div>
                )}
                {post.reactions?.["👏"] > 0 && (
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center border-2 border-white z-0">
                    <span className="text-[10px]">👏</span>
                  </div>
                )}
              </div>
              <span className="text-on-surface-variant font-label-sm">
                {totalReactions} reactions
              </span>
            </div>
            <span className="text-on-surface-variant font-label-sm">
              {post.comments.length} comments • {post.shares} shares
            </span>
          </div>
          <div className="flex justify-around pt-sm relative">
            <div
              className="relative group"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-surface-container p-1 flex gap-1 z-20 animate-fade-in-up">
                  {["👍", "❤️", "😂", "👏"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="w-8 h-8 flex items-center justify-center hover:scale-125 transition-transform hover:bg-surface-container rounded-full text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 font-label-md px-md py-xs hover:bg-surface-container rounded-lg transition-colors ${post.isLiked ? "text-primary" : "text-on-surface-variant"}`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{
                    fontVariationSettings: post.isLiked
                      ? "'FILL' 1"
                      : "'FILL' 0",
                  }}
                >
                  thumb_up
                </span>
                Like
              </button>
            </div>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-on-surface-variant font-label-md px-md py-xs hover:bg-surface-container rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                chat_bubble
              </span>
              Comment
            </button>
            <button className="flex items-center gap-2 text-on-surface-variant font-label-md px-md py-xs hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                share
              </span>
              Share
            </button>
          </div>
        </div>
        {showComments && <CommentSection post={post} />}
      </article>
    );
  };

  return renderContent();
}
