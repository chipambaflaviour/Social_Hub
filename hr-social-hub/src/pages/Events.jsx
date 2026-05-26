import React, { useState } from "react";
import { useStore } from "../store/useStore";

export default function Events() {
  const events = useStore((state) => state.events) || [];
  const groups = useStore((state) => state.groups) || [];
  const addEvent = useStore((state) => state.addEvent);
  const addGroup = useStore((state) => state.addGroup);
  const user = useStore((state) => state.user);
  const users = useStore((state) => state.users) || [];

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: "",
    type: "casual",
    location: "",
    start_time: "",
    end_time: "",
    image_url: "",
  });

  const handleAddEvent = async () => {
    if (!eventForm.title || !eventForm.start_time) return;
    await addEvent({
      ...eventForm,
      attendees: [{ name: user.name, avatar: user.avatar }],
    });
    setIsEventModalOpen(false);
    setEventForm({
      title: "",
      type: "casual",
      location: "",
      start_time: "",
      end_time: "",
      image_url: "",
    });
  };

  const [groupForm, setGroupForm] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  const handleAddGroup = async () => {
    if (!groupForm.name) return;
    await addGroup({
      ...groupForm,
      member_count: 1,
      events_count: 0,
    });
    setIsGroupModalOpen(false);
    setGroupForm({ name: "", description: "", image_url: "" });
  };

  const today = new Date();
  const todayMonth = today.getMonth();

  const milestones = users
    .filter((u) => u.id !== user?.id)
    .map((u) => {
      let type = null;
      let text = "";
      let sortWeight = 0;

      // Check birthday
      if (u.birth_date) {
        const bDay = new Date(u.birth_date);
        if (bDay.getMonth() === todayMonth) {
          type = "birthday";
          text = `Birthday (${bDay.getDate()} ${bDay.toLocaleString("default", { month: "short" })})`;
          sortWeight = bDay.getDate() >= today.getDate() ? 2 : 0; // Upcoming first
        }
      }

      // Check anniversary
      if (!type && u.created_at) {
        const joinDate = new Date(u.created_at);
        if (joinDate.getMonth() === todayMonth) {
          const diff = today.getFullYear() - joinDate.getFullYear();
          type = "anniversary";
          if (diff > 0) {
            text = `${diff} Yr Anniversary (${joinDate.getDate()} ${joinDate.toLocaleString("default", { month: "short" })})`;
          } else {
            text = `Joined (${joinDate.getDate()} ${joinDate.toLocaleString("default", { month: "short" })})`;
          }
          sortWeight = joinDate.getDate() >= today.getDate() ? 1 : -1;
        }
      }

      return type
        ? { ...u, milestoneType: type, milestoneText: text, sortWeight }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.sortWeight - a.sortWeight);

  return (
    <main className="pt-20 px-4 space-y-8 max-w-lg mx-auto pb-24">
      {/* Quick Filters / Categories */}
      <section className="flex gap-3 overflow-x-auto hide-scrollbar py-2 -mx-4 px-4">
        <button className="flex-shrink-0 px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-label-md font-label-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">
            calendar_today
          </span>
          All Events
        </button>
        <button className="flex-shrink-0 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-label-md font-label-md border border-outline-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">cake</span>
          Birthdays
        </button>
        <button className="flex-shrink-0 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-label-md font-label-md border border-outline-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">
            military_tech
          </span>
          Anniversaries
        </button>
        <button className="flex-shrink-0 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-label-md font-label-md border border-outline-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">groups</span>
          Socials
        </button>
      </section>

      {/* Featured Section: Celebration Grid */}
      <section className="space-y-4">
        <h2 className="font-headline-sm text-headline-sm text-on-background">
          Celebrate Milestones
        </h2>
        {milestones.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col items-center text-center text-on-surface-variant italic font-body-sm">
            No milestones this month.
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-surface-container p-4 w-40 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-surface-variant mb-2 relative">
                  <img
                    src={m.avatar || "https://via.placeholder.com/150"}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">
                      {m.milestoneType === "birthday"
                        ? "cake"
                        : "military_tech"}
                    </span>
                  </div>
                </div>
                <h4 className="font-bold text-body-md truncate w-full">
                  {m.name}
                </h4>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wide font-bold">
                  {m.milestoneText}
                </p>
                <button className="mt-3 text-primary bg-primary-container/50 px-3 py-1 rounded-full text-xs font-bold w-full">
                  Say Congrats
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Main Events Feed */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-sm text-headline-sm text-on-background">
            Upcoming Events
          </h2>
          <div className="flex gap-2">
            {user?.isAdmin && (
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">
                  add
                </span>{" "}
                Add Event
              </button>
            )}
            <a
              className="text-primary font-label-md text-label-md underline flex items-center"
              href="#"
            >
              See all
            </a>
          </div>
        </div>

        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-headline-sm">Create New Event</h3>
                <button
                  onClick={() => setIsEventModalOpen(false)}
                  className="material-symbols-outlined text-on-surface-variant"
                >
                  close
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Event Title *
                  </label>
                  <input
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, title: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    placeholder="e.g. Q3 Townhall"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={eventForm.start_time}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          start_time: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={eventForm.end_time}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, end_time: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Location
                  </label>
                  <input
                    value={eventForm.location}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, location: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    placeholder="e.g. Main Conference Room or Zoom"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Type</label>
                    <select
                      value={eventForm.type}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, type: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    >
                      <option value="casual">Casual</option>
                      <option value="workshop">Workshop</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Image URL (optional)
                    </label>
                    <input
                      value={eventForm.image_url}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          image_url: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddEvent}
                  className="w-full bg-primary text-white py-2 rounded-lg font-bold mt-2"
                >
                  Publish Event
                </button>
              </div>
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col items-center text-center text-on-surface-variant italic font-body-sm">
            No upcoming events.
          </div>
        ) : (
          events.map((event) => {
            const startDate = new Date(event.start_time);
            const day = startDate.getDate();
            const month = startDate.toLocaleString("default", {
              month: "short",
            });
            const time = startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const endDate = event.end_time ? new Date(event.end_time) : null;
            const endTime = endDate
              ? endDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container group mb-4"
              >
                {event.image_url && (
                  <div className="h-32 w-full relative">
                    <img
                      alt={event.title}
                      className="w-full h-full object-cover"
                      src={event.image_url}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center shadow-sm">
                      <p className="text-primary font-black text-lg leading-tight">
                        {day}
                      </p>
                      <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                        {month}
                      </p>
                    </div>
                  </div>
                )}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary px-2 py-0.5 bg-secondary-container rounded-full">
                        {event.type}
                      </span>
                      <h3 className="text-body-lg font-bold mt-1">
                        {event.title}
                      </h3>
                    </div>
                    {!event.image_url && (
                      <div className="bg-surface-container-low px-3 py-1 rounded-lg text-center">
                        <p className="text-on-surface-variant font-black text-lg leading-tight">
                          {day}
                        </p>
                        <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest">
                          {month}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-on-surface-variant text-body-md">
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">
                          location_on
                        </span>
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>
                      <span>
                        {time}
                        {endTime ? ` - ${endTime}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      {(event.attendees || []).slice(0, 3).map((att, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white bg-surface-variant overflow-hidden"
                        >
                          {att.avatar ? (
                            <img
                              src={att.avatar}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                      ))}
                      {(event.attendees || []).length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container flex items-center justify-center text-[10px] font-bold">
                          +{(event.attendees || []).length - 3}
                        </div>
                      )}
                    </div>
                    <button className="bg-primary text-white px-6 py-2 rounded-lg font-label-md text-label-md shadow-md active:scale-95 transition-transform">
                      Join Event
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Social Groups Section */}
      <section className="space-y-4 pb-12 mt-md">
        <div className="flex justify-between items-center">
          <h2 className="font-headline-sm text-headline-sm text-on-background">
            Social Groups
          </h2>
          {user?.isAdmin && (
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>{" "}
              Create Group
            </button>
          )}
        </div>

        {isGroupModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-headline-sm">Create Social Group</h3>
                <button
                  onClick={() => setIsGroupModalOpen(false)}
                  className="material-symbols-outlined text-on-surface-variant"
                >
                  close
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Group Name *
                  </label>
                  <input
                    value={groupForm.name}
                    onChange={(e) =>
                      setGroupForm({ ...groupForm, name: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    placeholder="e.g. Photography Club"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Description
                  </label>
                  <textarea
                    value={groupForm.description}
                    onChange={(e) =>
                      setGroupForm({
                        ...groupForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    placeholder="What is this group about?"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Cover Image URL (optional)
                  </label>
                  <input
                    value={groupForm.image_url}
                    onChange={(e) =>
                      setGroupForm({ ...groupForm, image_url: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    placeholder="https://..."
                  />
                </div>
                <button
                  onClick={handleAddGroup}
                  className="w-full bg-primary text-white py-2 rounded-lg font-bold mt-2"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}

        {groups.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col items-center text-center text-on-surface-variant italic font-body-sm">
            No active social groups.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center p-3 bg-white rounded-xl border border-surface-container shadow-sm gap-4"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-variant">
                  {group.image_url && (
                    <img
                      alt={group.name}
                      className="w-full h-full object-cover"
                      src={group.image_url}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-body-md">{group.name}</h4>
                  <p className="text-xs text-on-surface-variant">
                    {group.member_count} Active Members • {group.events_count}{" "}
                    Events
                  </p>
                </div>
                <button className="material-symbols-outlined text-primary p-2">
                  chevron_right
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
