import React, { useState } from "react";
import { PersonalInfoSection } from "./components/personal-info-section";
import { PasswordSection } from "./components/password-section";
import { TwoFactorSection } from "./components/two-factor-section";
import { INITIAL_USER_PROFILE } from "./constant/mock_settings";
import type { UserProfileData } from "./constant/mock_settings";

export function SettingsPage() {
  const [profile, setProfile] = useState<UserProfileData>(INITIAL_USER_PROFILE);

  const handleProfileSave = (updated: UserProfileData) => {
    setProfile(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile details, account security, and active
          sessions.
        </p>
      </div>

      <div className="space-y-6">
        <PersonalInfoSection initialData={profile} onSave={handleProfileSave} />
        <PasswordSection />
        <TwoFactorSection />
      </div>
    </div>
  );
}

export default SettingsPage;
