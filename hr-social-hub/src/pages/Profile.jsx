import React, { useRef, useState } from "react";
import { useStore } from "../store/useStore";
import PostCard from "../components/PostCard";

export default function Profile() {
  const user = useStore((state) => state.user);
  const updateAvatar = useStore((state) => state.updateAvatar);
  const updateCoverPhoto = useStore((state) => state.updateCoverPhoto);
  const updateProfile = useStore((state) => state.updateProfile);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const allPosts = useStore((state) => state.posts);
  const posts = allPosts.filter((p) => p.author?.name === user?.name);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    role: user?.role || "",
    country: user?.country || "",
    department: user?.department || "",
    contact: user?.contact || "",
    email: user?.email || "",
    birth_date: user?.birth_date || "",
    gender: user?.gender || "",
  });

  React.useEffect(() => {
    setEditForm({
      name: user?.name || "",
      role: user?.role || "",
      country: user?.country || "",
      department: user?.department || "",
      contact: user?.contact || "",
      email: user?.email || "",
      birth_date: user?.birth_date || "",
      gender: user?.gender || "",
    });
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateAvatar(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateCoverPhoto(file);
    }
  };

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <main className="pt-16 pb-24 max-w-[1200px] mx-auto">
      <section className="relative">
        <div
          className="h-48 md:h-64 w-full relative overflow-hidden bg-black group cursor-pointer"
          onClick={() => coverInputRef.current?.click()}
        >
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            accept="image/*"
            className="hidden"
          />

          {/* Blurred background layer to fill empty space */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
            style={{
              backgroundImage: `url(${user?.cover_photo || "https://lh3.googleusercontent.com/aida-public/AB6AXuCShel3DplpFmpMx8foX14yV-JOCDw4v8hfnCitonDrsnQ9GDJh-YSo8GPYRlTSwUb-i4gHng9Nwth-ZepGgADlpSVOyJgFX3XQec5CS5JLkeZOlnTPK6ALsmYXhzsgTsnSh1Pkja7k2OZFUQ7ouqspBB5LnRTqro56GV8URl8aHnoImr-HfShfbRPIV9YXc_qZFgdhfPmX2sBswjiR9lMhdldrvcKPrbtqknAzp_gXEvA-oUKQwgjC3ehR_DZUGPTkBRpxMU8WudM"})`,
            }}
          ></div>

          {/* Main image (Uncut) */}
          <img
            className="w-full h-full object-contain relative z-10"
            alt="Cover"
            src={
              user?.cover_photo ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCShel3DplpFmpMx8foX14yV-JOCDw4v8hfnCitonDrsnQ9GDJh-YSo8GPYRlTSwUb-i4gHng9Nwth-ZepGgADlpSVOyJgFX3XQec5CS5JLkeZOlnTPK6ALsmYXhzsgTsnSh1Pkja7k2OZFUQ7ouqspBB5LnRTqro56GV8URl8aHnoImr-HfShfbRPIV9YXc_qZFgdhfPmX2sBswjiR9lMhdldrvcKPrbtqknAzp_gXEvA-oUKQwgjC3ehR_DZUGPTkBRpxMU8WudM"
            }
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all z-20">
            <span className="material-symbols-outlined text-white text-4xl drop-shadow-md">
              add_a_photo
            </span>
          </div>
          {user?.cover_photo && (
            <div
              className="absolute top-4 right-4 hidden group-hover:flex items-center justify-center z-30 bg-black/50 hover:bg-error rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                updateCoverPhoto(null);
              }}
              title="Remove Cover Photo"
            >
              <span className="material-symbols-outlined text-white text-xl">
                delete
              </span>
            </div>
          )}
        </div>
        <div className="px-container-margin -mt-16 relative z-10 md:px-xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-col items-start w-full md:w-auto">
              <div className="relative group w-max">
                <div
                  className="p-1 bg-white rounded-full shadow-lg cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <img
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover"
                    alt={user.name}
                    src={user.avatar}
                  />
                  <div className="absolute inset-1 rounded-full bg-black/50 hidden group-hover:flex items-center justify-center transition-all m-1">
                    <span className="material-symbols-outlined text-white text-3xl">
                      photo_camera
                    </span>
                  </div>
                </div>
                {user.avatar !== "https://via.placeholder.com/150" && (
                  <button
                    className="absolute top-2 right-2 hidden group-hover:flex items-center justify-center bg-black/50 hover:bg-error rounded-full p-1.5 transition-colors z-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateAvatar("https://via.placeholder.com/150");
                    }}
                    title="Remove Profile Picture"
                  >
                    <span className="material-symbols-outlined text-white text-[16px]">
                      delete
                    </span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="mt-4 bg-white p-4 rounded-xl shadow-lg border border-surface-container w-full md:w-[400px] space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                      Role / Job Title
                    </label>
                    <input
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                        Department
                      </label>
                      <input
                        value={editForm.department}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            department: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                        Country
                      </label>
                      <select
                        value={editForm.country}
                        onChange={(e) =>
                          setEditForm({ ...editForm, country: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                      >
                        <option value="">Select</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Angola">Angola</option>
                        <option value="South Sudan">South Sudan</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="DRC">DRC</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                        Contact
                      </label>
                      <input
                        value={editForm.contact}
                        onChange={(e) =>
                          setEditForm({ ...editForm, contact: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                        Email
                      </label>
                      <input
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                        Birthday
                      </label>
                      <input
                        type="date"
                        value={editForm.birth_date}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            birth_date: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-primary text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">
                        Gender
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) =>
                          setEditForm({ ...editForm, gender: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-primary text-on-surface"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-primary text-white py-2 rounded font-bold text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-surface-container text-on-surface py-2 rounded font-bold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <h1 className="font-display-lg text-on-surface text-display-lg">
                    {user.name}
                  </h1>
                  <p className="font-body-lg text-secondary text-body-lg">
                    {user.role}
                  </p>
                  <div className="flex flex-col gap-1 mt-2 text-on-surface-variant font-label-md text-label-md">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">
                        location_on
                      </span>
                      {user.country || "Country not set"}
                      <span className="mx-1">•</span>
                      <span className="text-primary font-bold">
                        0 Connections
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-[16px]">
                        domain
                      </span>
                      {user.department || "Department not set"}
                      <span className="mx-2">|</span>
                      <span className="material-symbols-outlined text-[16px]">
                        mail
                      </span>
                      {user.email || "Email not set"}
                      <span className="mx-2">|</span>
                      <span className="material-symbols-outlined text-[16px]">
                        call
                      </span>
                      {user.contact || "Contact not set"}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-[16px]">
                        cake
                      </span>
                      {user.birth_date
                        ? new Date(user.birth_date).toLocaleDateString()
                        : "Birthday not set"}
                      <span className="mx-2">|</span>
                      <span className="material-symbols-outlined text-[16px]">
                        person
                      </span>
                      {user.gender || "Gender not set"}
                      {user.created_at && (
                        <>
                          <span className="mx-2">|</span>
                          <span className="material-symbols-outlined text-[16px]">
                            work_history
                          </span>
                          Joined {new Date(user.created_at).getFullYear()}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isEditing && (
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    edit
                  </span>
                  Edit Profile
                </button>
                <button className="border border-secondary text-secondary px-6 py-2 rounded-full font-bold hover:bg-secondary-container/10 transition-all">
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-container-margin mt-lg grid grid-cols-2 md:grid-cols-4 gap-sm">
        <div className="bg-white p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container-highest flex flex-col items-center justify-center text-center">
          <span className="text-display-md text-primary font-display-md">
            {posts.length}
          </span>
          <span className="text-label-md text-on-surface-variant font-label-md uppercase tracking-wider">
            Posts
          </span>
        </div>
        <div className="bg-white p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container-highest flex flex-col items-center justify-center text-center">
          <span className="text-display-md text-primary font-display-md">
            0
          </span>
          <span className="text-label-md text-on-surface-variant font-label-md uppercase tracking-wider">
            Connections
          </span>
        </div>
        <div className="bg-white p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container-highest flex flex-col items-center justify-center text-center">
          <span className="text-display-md text-primary font-display-md">
            0
          </span>
          <span className="text-label-md text-on-surface-variant font-label-md uppercase tracking-wider">
            Awards
          </span>
        </div>
        <div className="bg-white p-md rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container-highest flex flex-col items-center justify-center text-center">
          <span className="text-display-md text-primary font-display-md">
            0
          </span>
          <span className="text-label-md text-on-surface-variant font-label-md uppercase tracking-wider">
            Reach
          </span>
        </div>
      </section>

      <div className="px-container-margin mt-lg flex flex-col md:flex-row gap-lg">
        <div className="flex-1 space-y-md">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
            Recent Activity
          </h3>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
