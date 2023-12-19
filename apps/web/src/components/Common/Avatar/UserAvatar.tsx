"use client"
import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import './userAvatar.css';
import { getInitials } from '@/utils/helper';

interface UserAvatarProps{
  fallbackName?: string;
  imageURI: string;
}

const UserAvatar = ({fallbackName, imageURI}:UserAvatarProps) => {
 const nameInitials = getInitials(fallbackName ?? '')?.toUpperCase();

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <Avatar.Root className="AvatarRoot">
        <Avatar.Image
          className="AvatarImage"
          src={imageURI}
          alt={fallbackName}
        />
        <Avatar.Fallback className="AvatarFallback" delayMs={600}>
          {nameInitials}
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  )
};

export default UserAvatar;