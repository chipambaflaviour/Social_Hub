import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { supabase } from "../lib/supabase";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const darkMode = useStore((state) => state.darkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "everyone",
    showActivity: true,
    allowTags: true,
  });

  return (
    <main className="pt-20 pb-24 px-4 max-w-4xl mx-auto">
      <div className="mb-lg">
        <h1 className="font-display-lg text-display-lg text-primary mb-xs">
          Settings
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage your account preferences and app settings.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-container overflow-hidden">
        <div className="p-md border-b border-surface-container-highest flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-on-surface">Notifications</h3>
            <p className="font-body-md text-on-surface-variant mt-1">
              Control which notifications you receive.
            </p>
          </div>
          <div
            className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors ${notificationsEnabled ? "bg-primary" : "bg-surface-container-highest border border-outline-variant"}`}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full transition-all ${notificationsEnabled ? "left-7 bg-white" : "left-1 bg-on-surface-variant"}`}
            ></div>
          </div>
        </div>

        <div className="p-md border-b border-surface-container-highest flex items-center justify-between">
          <div>
            <h3 className="font-headline-sm text-on-surface">Dark Mode</h3>
            <p className="font-body-md text-on-surface-variant mt-1">
              Toggle dark mode theme for the app.
            </p>
          </div>
          <div
            className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-colors ${darkMode ? "bg-primary" : "bg-surface-container-highest border border-outline-variant"}`}
            onClick={toggleDarkMode}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full transition-all ${darkMode ? "left-7 bg-white" : "left-1 bg-on-surface-variant"}`}
            ></div>
          </div>
        </div>

        <div className="p-md flex items-center justify-between border-b border-surface-container-highest">
          <div>
            <h3 className="font-headline-sm text-on-surface">Privacy</h3>
            <p className="font-body-md text-on-surface-variant mt-1">
              Manage who can see your profile and activity.
            </p>
          </div>
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-primary font-label-md hover:underline"
          >
            Edit Privacy
          </button>
        </div>

        <div className="p-md flex items-center justify-between border-b border-surface-container-highest">
          <div>
            <h3 className="font-headline-sm text-on-surface">Log Out</h3>
            <p className="font-body-md text-on-surface-variant mt-1">
              Sign out of your account on this device.
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              useStore.setState({ user: null });
              window.location.href = "/login";
            }}
            className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md hover:bg-surface-container transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            Sign Out
          </button>
        </div>

        <div className="p-md flex items-center justify-between bg-error-container/10">
          <div>
            <h3 className="font-headline-sm text-error">Delete Account</h3>
            <p className="font-body-md text-error/80 mt-1">
              Permanently remove your account and all associated data.
            </p>
          </div>
          <button
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to permanently delete your account? This action cannot be undone.",
                )
              ) {
                await useStore.getState().deleteAccount();
                window.location.href = "/login";
              }
            }}
            className="bg-error text-on-error px-4 py-2 rounded-lg font-label-md hover:bg-error/90 transition-colors shadow-sm"
          >
            Delete Account
          </button>
        </div>
      </div>

      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-headline-sm">Privacy Settings</h3>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="material-symbols-outlined text-on-surface-variant"
              >
                close
              </button>
            </div>
            <div className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-bold mb-1 text-on-surface-variant">
                  Profile Visibility
                </label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      profileVisibility: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-primary bg-surface text-on-surface"
                >
                  <option value="everyone">Everyone (Public)</option>
                  <option value="connections">Connections Only</option>
                  <option value="nobody">Nobody (Private)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Show Activity Status</p>
                  <p className="text-xs text-on-surface-variant">
                    Let others see when you are online.
                  </p>
                </div>
                <div
                  className={`relative inline-block w-10 h-5 rounded-full cursor-pointer transition-colors ${privacySettings.showActivity ? "bg-primary" : "bg-surface-container-highest border border-outline-variant"}`}
                  onClick={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      showActivity: !privacySettings.showActivity,
                    })
                  }
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${privacySettings.showActivity ? "left-5 bg-white" : "left-0.5 bg-on-surface-variant"}`}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">Allow Mentions & Tags</p>
                  <p className="text-xs text-on-surface-variant">
                    Let others tag you in posts.
                  </p>
                </div>
                <div
                  className={`relative inline-block w-10 h-5 rounded-full cursor-pointer transition-colors ${privacySettings.allowTags ? "bg-primary" : "bg-surface-container-highest border border-outline-variant"}`}
                  onClick={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      allowTags: !privacySettings.allowTags,
                    })
                  }
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${privacySettings.allowTags ? "left-5 bg-white" : "left-0.5 bg-on-surface-variant"}`}
                  ></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="w-full bg-primary text-white py-2 rounded-lg font-bold mt-2"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
