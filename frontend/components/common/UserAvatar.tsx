"use client";

import React, { useState } from "react";

interface UserAvatarProps {
  avatar?: string | null;
  name?: string | null;
  sizeClass?: string; // e.g. "w-6 h-6"
  textClass?: string; // e.g. "text-base"
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name,
  sizeClass = "w-6 h-6",
  textClass = "text-base",
}) => {
  const [imgError, setImgError] = useState(false);
  const displayAvatar = avatar || "🚀";
  const isUrl =
    !imgError &&
    (displayAvatar.startsWith("http://") || displayAvatar.startsWith("https://"));

  if (isUrl) {
    return (
      <img
        src={displayAvatar}
        alt={name || "User avatar"}
        className={`${sizeClass} rounded-full object-cover shrink-0 border shadow-xs`}
        style={{ borderColor: "var(--border)" }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span className={`${textClass} flex items-center justify-center shrink-0`}>
      {displayAvatar}
    </span>
  );
};
