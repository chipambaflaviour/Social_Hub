import React, { useState, useRef } from "react";
import { useStore } from "../store/useStore";

export default function CreatePost() {
  const user = useStore((state) => state.user);
  const addPost = useStore((state) => state.addPost);
  const [content, setContent] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPoll, setIsPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const addSuggestion = useStore((state) => state.addSuggestion);
  const fileInputRef = useRef(null);

  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validPollOptions = isPoll
      ? pollOptions.filter((opt) => opt.trim() !== "")
      : null;

    if (
      !content.trim() &&
      !selectedImage &&
      (!isPoll || validPollOptions.length < 2)
    )
      return;

    if (isAnonymous) {
      addSuggestion(content);
    } else {
      addPost(content, isAnnouncement, selectedImage, validPollOptions);
    }

    setContent("");
    setIsAnnouncement(false);
    setIsAnonymous(false);
    setSelectedImage(null);
    setPreviewImage(null);
    setIsPoll(false);
    setPollOptions(["", ""]);
  };

  const handleAction = (action) => {
    if (action === "emoji") setContent((prev) => prev + "😀");
    if (action === "tag") setContent((prev) => prev + "@");
    if (action === "image") fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.04)] mb-md">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-md">
          <img
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
            src={user.avatar}
          />
          <div className="flex-1">
            <input
              type="text"
              className="w-full bg-surface-container-low px-md py-sm rounded-full text-on-surface font-body-md border-none focus:ring-0"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {previewImage && (
              <div className="mt-2 relative inline-block">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-48 rounded-lg border border-outline-variant object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewImage(null);
                  }}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>
            )}
            {isPoll && (
              <div className="mt-4 space-y-2 border border-surface-container rounded-xl p-4 bg-surface-container-lowest">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md font-bold text-on-surface">
                    Create a Poll
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPoll(false)}
                    className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                </div>
                {pollOptions.map((opt, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...pollOptions];
                        newOptions[index] = e.target.value;
                        setPollOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 bg-surface-container-low px-md py-sm rounded-lg text-on-surface font-body-md border border-outline-variant focus:border-primary focus:ring-0"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          setPollOptions(
                            pollOptions.filter((_, i) => i !== index),
                          )
                        }
                        className="text-error p-2 hover:bg-error-container rounded-full transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ""])}
                    className="text-primary font-label-md py-2 px-4 hover:bg-primary-container rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                    Add Option
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {user.isAdmin && (
          <div className="mt-2 ml-[56px] flex items-center gap-2">
            <input
              type="checkbox"
              id="announcement"
              checked={isAnnouncement}
              onChange={(e) => setIsAnnouncement(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <label
              htmlFor="announcement"
              className="text-sm text-on-surface-variant font-medium"
            >
              Post as Announcement
            </label>
          </div>
        )}

        <div className="flex flex-wrap justify-between mt-md pt-sm border-t border-outline-variant gap-2">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => handleAction("image")}
              className="flex items-center gap-2 text-secondary font-label-md px-sm py-xs hover:bg-surface-container rounded-lg transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">
                image
              </span>
              <span className="hidden sm:inline">Photo/Video</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("tag")}
              className="flex items-center gap-2 text-secondary font-label-md px-sm py-xs hover:bg-surface-container rounded-lg transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">
                person_add
              </span>
              <span className="hidden sm:inline">Tag</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction("emoji")}
              className="flex items-center gap-2 text-secondary font-label-md px-sm py-xs hover:bg-surface-container rounded-lg transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">
                mood
              </span>
              <span className="hidden sm:inline">Emoji</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-2 font-label-md px-sm py-xs hover:bg-surface-container rounded-lg transition-colors whitespace-nowrap ${isAnonymous ? "text-primary bg-primary-container" : "text-secondary"}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                mark_email_unread
              </span>
              <span className="hidden sm:inline">Anonymous Suggestion</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPoll(!isPoll)}
              className={`flex items-center gap-2 font-label-md px-sm py-xs hover:bg-surface-container rounded-lg transition-colors whitespace-nowrap ${isPoll ? "text-primary bg-primary-container" : "text-secondary"}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                poll
              </span>
              <span className="hidden sm:inline">Poll</span>
            </button>
          </div>
          <button
            type="submit"
            className="bg-primary text-white font-label-md px-6 py-1.5 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50 shrink-0"
            disabled={
              (!content.trim() && !selectedImage && !isPoll) ||
              (isPoll && pollOptions.filter((o) => o.trim() !== "").length < 2)
            }
          >
            {isAnonymous ? "Submit Suggestion" : "Post"}
          </button>
        </div>
      </form>
    </section>
  );
}
