import React, { useState } from "react";
import { useStore } from "../store/useStore";
import PostCard from "../components/PostCard";

export default function Admin() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [editSuggestionContent, setEditSuggestionContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  const user = useStore((state) => state.user);
  const posts = useStore((state) => state.posts) || [];
  const flaggedContent = useStore((state) => state.flaggedContent) || [];
  const removeFlagged = useStore((state) => state.removeFlagged);
  const removePost = useStore((state) => state.removePost);
  const users = useStore((state) => state.users) || [];
  const removeUser = useStore((state) => state.removeUser);
  const suggestions = useStore((state) => state.suggestions) || [];
  const approveSuggestion = useStore((state) => state.approveSuggestion);
  const rejectSuggestion = useStore((state) => state.rejectSuggestion);
  const toggleAdminAccess = useStore((state) => state.toggleAdminAccess);

  const handleAdminToggle = (targetUser) => {
    const isCurrentlyAdmin = targetUser.is_admin;
    const newStatus = !isCurrentlyAdmin;
    if (newStatus) {
      const confirmAction = window.confirm(
        "CAUTION: Are you sure you want to grant this user access to the Admin Portal? They will have full permission to modify content and manage users.",
      );
      if (!confirmAction) return;
    } else {
      const confirmAction = window.confirm(
        "Are you sure you want to revoke Admin access from this user?",
      );
      if (!confirmAction) return;
    }
    toggleAdminAccess(targetUser.id, newStatus);
    setSelectedUser({ ...targetUser, is_admin: newStatus });
  };

  const pinnedPosts = posts.filter((p) => p.isPinned);

  // Calculate real stats
  const engagementStats =
    posts.reduce(
      (acc, post) => acc + (post.likes || 0) + (post.comments?.length || 0),
      0,
    ) + posts.length;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users?.slice(indexOfFirstUser, indexOfLastUser) || [];
  const totalPages = Math.ceil((users?.length || 0) / usersPerPage);

  if (!user.isAdmin) {
    return (
      <main className="pt-20 px-4 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <p className="text-xl text-on-surface-variant font-bold">
          You do not have permission to view this page.
        </p>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-primary mb-xs">
          Admin Insights
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          System performance and moderation overview for Today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-xl">
        <div className="md:col-span-2 bg-white p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[180px] border border-surface-container">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Engagement Stats
              </span>
              <h2 className="font-display-md text-display-md text-primary mt-1">
                {engagementStats}
              </h2>
            </div>
            <div className="bg-surface-container-low px-2 py-1 rounded text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                trending_flat
              </span>
              <span className="font-label-sm text-label-sm">Live</span>
            </div>
          </div>
          <div className="h-16 flex items-end gap-1 mt-4">
            <div className="flex-1 bg-primary h-[10%] rounded-t-sm opacity-20"></div>
            <div className="flex-1 bg-primary h-[20%] rounded-t-sm opacity-40"></div>
            <div className="flex-1 bg-primary h-[15%] rounded-t-sm opacity-20"></div>
            <div className="flex-1 bg-primary h-[30%] rounded-t-sm opacity-60"></div>
            <div className="flex-1 bg-primary h-[25%] rounded-t-sm opacity-40"></div>
            <div className="flex-1 bg-primary h-[40%] rounded-t-sm opacity-100"></div>
            <div className="flex-1 bg-primary h-[35%] rounded-t-sm opacity-80"></div>
          </div>
        </div>

        <div className="md:col-span-1 bg-white p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md block">
            Trending Hashtags
          </span>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-on-surface-variant italic font-body-sm">
              Waiting for activity...
            </li>
          </ul>
        </div>

        <div className="md:col-span-1 bg-white p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md block">
            Most Active Users
          </span>
          {users && users.length > 0 ? (
            <>
              <div className="flex -space-x-3 mb-md">
                {users.slice(0, 3).map((u) => (
                  <img
                    key={u.id}
                    alt={u.name}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src={u.avatar || "https://via.placeholder.com/150"}
                  />
                ))}
                {users.length > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant flex items-center justify-center text-primary font-label-sm">
                    +{users.length - 3}
                  </div>
                )}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Top contributors average 14 actions/day.
              </p>
            </>
          ) : (
            <p className="font-body-md text-body-md text-on-surface-variant italic">
              No user activity recorded yet.
            </p>
          )}
        </div>
      </div>

      <div className="mb-xl">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-sm text-headline-sm text-primary">
            Pinned Posts
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pinnedPosts.length === 0 ? (
            <p className="text-on-surface-variant italic">No pinned posts.</p>
          ) : (
            pinnedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-md rounded-xl shadow-sm border border-surface-container flex gap-md"
              >
                <div className="w-16 h-16 rounded-lg bg-surface-container-low flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {post.type === "announcement" ? "campaign" : "push_pin"}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-body-lg text-body-lg font-bold text-on-background line-clamp-1">
                    {post.author.name}
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">
                    {post.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-xl">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-sm text-headline-sm text-primary">
            Flagged Content
          </h3>
          <div className="bg-error-container text-on-error-container px-3 py-1 rounded-full font-label-md text-label-md">
            {flaggedContent.length} Pending Review
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-surface-container overflow-hidden">
          <div className="divide-y divide-gray-100">
            {flaggedContent.length === 0 ? (
              <p className="p-md text-on-surface-variant italic">
                No flagged content.
              </p>
            ) : (
              flaggedContent.map((item) => (
                <div
                  key={item.id}
                  className="p-md hover:bg-surface-container-lowest transition-colors"
                >
                  <div className="flex justify-between items-start mb-sm">
                    <div className="flex items-center gap-3">
                      <img
                        alt="User"
                        className="w-10 h-10 rounded-full"
                        src={item.avatar}
                      />
                      <div>
                        <p className="font-body-md text-body-md font-bold text-on-background">
                          {item.author}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          Flagged: {item.reason}
                        </p>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md bg-surface-bright p-sm rounded-lg italic">
                    {item.content}
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => removeFlagged(item.id)}
                      className="border border-outline text-on-surface-variant font-label-sm text-label-sm py-1.5 px-3 rounded-md flex items-center gap-1 hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                      Dismiss
                    </button>
                    <button
                      onClick={() => removeFlagged(item.id)}
                      className="bg-primary text-white font-label-sm text-label-sm py-1.5 px-3 rounded-md flex items-center gap-1 hover:bg-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mb-xl">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-sm text-headline-sm text-primary">
            Anonymous Suggestions
          </h3>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md">
            {suggestions?.length || 0} Pending
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-surface-container overflow-hidden">
          <div className="divide-y divide-gray-100">
            {!suggestions || suggestions.length === 0 ? (
              <p className="p-md text-on-surface-variant italic">
                No pending suggestions.
              </p>
            ) : (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-md hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedSuggestion(suggestion);
                    setEditSuggestionContent(suggestion.content);
                  }}
                >
                  <div className="flex justify-between items-start mb-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">
                          mark_email_unread
                        </span>
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-bold text-on-background">
                          Anonymous Employee
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          Suggestion
                        </p>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {suggestion.timestamp}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md bg-surface-bright p-sm rounded-lg italic">
                    {suggestion.content}
                  </p>
                  <div
                    className="flex gap-2 justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => rejectSuggestion(suggestion.id)}
                      className="border border-outline text-on-surface-variant font-label-sm text-label-sm py-1.5 px-3 rounded-md flex items-center gap-1 hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        approveSuggestion(suggestion.id, suggestion.content)
                      }
                      className="bg-primary text-white font-label-sm text-label-sm py-1.5 px-3 rounded-md flex items-center gap-1 hover:bg-primary-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                      Approve & Post
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mb-xl">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-sm text-headline-sm text-primary">
            Manage Users
          </h3>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md">
            {users?.length || 0} Total Users
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-surface-container overflow-hidden">
          <div className="divide-y divide-gray-100">
            {!currentUsers || currentUsers.length === 0 ? (
              <p className="p-md text-on-surface-variant italic">
                No users found.
              </p>
            ) : (
              currentUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-md hover:bg-surface-container-lowest transition-colors flex justify-between items-center cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                      src={u.avatar}
                    />
                    <div>
                      <p className="font-body-md text-body-md font-bold text-on-background">
                        {u.name}
                      </p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {u.role}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="text-primary hover:bg-surface-container p-2 rounded-full transition-colors flex items-center justify-center"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        removeUser(u.id);
                        if (selectedUser?.id === u.id) setSelectedUser(null);
                      }}
                      className="text-error hover:bg-error-container p-2 rounded-full transition-colors flex items-center justify-center"
                      title="Remove User"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        person_remove
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-md border-t border-surface-container bg-surface-container-lowest">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-primary font-label-md px-4 py-2 rounded-lg hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="font-label-md text-on-surface-variant">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="text-primary font-label-md px-4 py-2 rounded-lg hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-lg flex justify-between items-start border-b border-surface-container">
              <h2 className="font-headline-sm text-headline-sm text-primary">
                User Details
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-lg">
              <div className="flex items-center gap-4 mb-lg">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-surface-container"
                />
                <div>
                  <p className="font-display-md text-display-md text-on-background">
                    {selectedUser.name}
                  </p>
                  <p className="font-body-md text-body-md text-primary">
                    {selectedUser.role}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Department
                  </p>
                  <p className="font-body-md text-body-md text-on-background flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      corporate_fare
                    </span>
                    {selectedUser.department}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Work Email
                  </p>
                  <p className="font-body-md text-body-md text-on-background flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      mail
                    </span>
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Contact Number
                  </p>
                  <p className="font-body-md text-body-md text-on-background flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      call
                    </span>
                    {selectedUser.contact}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Country
                  </p>
                  <p className="font-body-md text-body-md text-on-background flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      location_on
                    </span>
                    {selectedUser.country || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Gender
                  </p>
                  <p className="font-body-md text-body-md text-on-background flex items-center gap-2 mt-1">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      person
                    </span>
                    {selectedUser.gender || "Not specified"}
                  </p>
                </div>
                <div className="pt-4 border-t border-surface-container">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                    Admin Portal Access
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-on-background">
                        Grant Admin Privileges
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        Allow user to manage content & users
                      </p>
                    </div>
                    <div
                      className={`relative inline-block w-10 h-5 rounded-full cursor-pointer transition-colors ${selectedUser.is_admin ? "bg-primary" : "bg-surface-container-highest border border-outline-variant"}`}
                      onClick={() => handleAdminToggle(selectedUser)}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${selectedUser.is_admin ? "left-5 bg-white" : "left-0.5 bg-on-surface-variant"}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedSuggestion && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedSuggestion(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-lg flex justify-between items-start border-b border-surface-container">
              <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">
                  mark_email_unread
                </span>
                Review Suggestion
              </h2>
              <button
                onClick={() => setSelectedSuggestion(null)}
                className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-lg space-y-4">
              <div>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                  Submitted By Anonymous Employee
                </p>
                <textarea
                  className="w-full h-32 border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary font-body-md"
                  value={editSuggestionContent}
                  onChange={(e) => setEditSuggestionContent(e.target.value)}
                  placeholder="Edit suggestion before posting..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    rejectSuggestion(selectedSuggestion.id);
                    setSelectedSuggestion(null);
                  }}
                  className="border border-outline text-on-surface-variant font-label-md px-4 py-2 rounded-lg hover:bg-surface-container transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    approveSuggestion(
                      selectedSuggestion.id,
                      editSuggestionContent,
                    );
                    setSelectedSuggestion(null);
                  }}
                  className="bg-primary text-white font-label-md px-4 py-2 rounded-lg hover:bg-primary-container transition-colors"
                >
                  Approve & Post to Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
