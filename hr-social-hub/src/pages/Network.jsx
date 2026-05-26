import React, { useState } from "react";
import { useStore } from "../store/useStore";

export default function Network() {
  const users = useStore((state) => state.users) || [];
  const [activeFilter, setActiveFilter] = useState("All Colleagues");
  const filters = [
    "All Colleagues",
    "Chess Club",
    "Aerobics",
    "Photography",
    "Volunteering",
    "Tech Meetups",
  ];

  // Mock social interests for users for the prototype magic
  const mockedUsersWithInterests = users.map((u, i) => ({
    ...u,
    interest:
      i % 2 === 0 ? "Chess Club" : i % 3 === 0 ? "Aerobics" : "Photography",
    matchScore: Math.floor(Math.random() * 40) + 60, // 60-99% match
  }));

  const filteredUsers =
    activeFilter === "All Colleagues"
      ? mockedUsersWithInterests
      : mockedUsersWithInterests.filter((u) => u.interest === activeFilter);

  // Magic match is just the first person who isn't the logged in user (or just pick top match)
  const magicMatch =
    mockedUsersWithInterests.length > 0 ? mockedUsersWithInterests[0] : null;

  return (
    <main className="pt-20 pb-24 px-4 max-w-md mx-auto md:max-w-3xl min-h-screen">
      {/* Magic Match Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary-container via-surface-tint to-primary rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <span>✨ Magic Match</span>
              </div>
              <h2 className="text-display-md font-bold leading-tight">
                Expand Your Network
              </h2>
              <p className="text-white/80 text-sm">
                We found colleagues who participate in the same social
                activities as you. Connect and grow!
              </p>
            </div>
            {magicMatch && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 w-full md:w-auto min-w-[250px]">
                <img
                  src={magicMatch.avatar || "https://via.placeholder.com/150"}
                  alt={magicMatch.name}
                  className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <div>
                  <h4 className="font-bold">{magicMatch.name}</h4>
                  <p className="text-xs text-white/80">
                    {magicMatch.matchScore}% Interest Match
                  </p>
                  <p className="text-[10px] font-bold bg-white/20 inline-block px-2 py-0.5 rounded mt-1">
                    {magicMatch.interest}
                  </p>
                </div>
                <button className="ml-auto material-symbols-outlined text-white hover:scale-110 transition-transform">
                  person_add
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="mb-lg">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-white border border-outline-variant rounded-xl focus:outline-none focus:border-secondary transition-colors text-body-md shadow-sm"
            placeholder="Search by name, role, or interest..."
            type="text"
          />
        </div>
        <div className="mt-md flex gap-2 overflow-x-auto hide-scrollbar py-1 -mx-4 px-4 md:mx-0 md:px-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md shadow-sm border transition-colors ${activeFilter === filter ? "bg-primary-container text-on-primary-container border-primary" : "bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Directory Grid */}
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
        {filteredUsers.length === 0 ? (
          <div className="col-span-2 text-center text-on-surface-variant italic font-body-sm p-4">
            No colleagues found in this category.
          </div>
        ) : (
          filteredUsers.map((person, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-surface-variant">
                    <img
                      alt={person.name}
                      className="w-full h-full object-cover"
                      src={person.avatar || "https://via.placeholder.com/150"}
                    />
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full bg-green-500`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-headline-sm text-on-background truncate">
                    {person.name}
                  </h3>
                  <p className="text-label-md text-on-surface-variant mb-xs truncate">
                    {person.role || "Employee"}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-secondary text-[10px] font-bold">
                      {person.interest}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-md flex gap-2">
                <button className="flex-1 py-2 bg-primary text-white rounded-lg font-label-md flex items-center justify-center gap-1 active:scale-95 transition-transform">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    person_add
                  </span>
                  Connect
                </button>
                <button className="flex-1 py-2 border border-secondary text-secondary rounded-lg font-label-md flex items-center justify-center gap-1 active:scale-95 transition-transform hover:bg-secondary-container/30">
                  <span className="material-symbols-outlined text-[18px]">
                    chat_bubble
                  </span>
                  Message
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
