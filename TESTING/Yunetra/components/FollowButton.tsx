"use client";

import React, { useState } from 'react';
import { UserPlus, UserCheck, UserMinus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FollowButtonProps {
    userId: string;
    initialIsFollowing?: boolean;
    initialIsConnected?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onFollowChange?: (isFollowing: boolean, isConnected: boolean) => void;
}

export function FollowButton({
    userId,
    initialIsFollowing = false,
    initialIsConnected = false,
    size = 'md',
    onFollowChange
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isConnected, setIsConnected] = useState(initialIsConnected);
    const [isLoading, setIsLoading] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);
        
        try {
            const endpoint = isFollowing 
                ? `/api/follow/${userId}`
                : `/api/follow/${userId}`;
            
            const method = isFollowing ? 'DELETE' : 'POST';
            
            const response = await fetch(endpoint, { method });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update follow status');
            }

            setIsFollowing(data.following);
            setIsConnected(data.isConnected || false);
            
            if (data.following) {
                toast.success(data.isConnected ? 'You are now Connected! 🤝' : 'Following successfully!');
            } else {
                toast.success('Unfollowed');
            }

            onFollowChange?.(data.following, data.isConnected || false);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
            // Don't update state on error - keep current state
        } finally {
            setIsLoading(false);
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-2.5 py-1 text-xs';
            case 'lg':
                return 'px-6 py-2.5 text-base';
            default:
                return 'px-4 py-2 text-sm';
        }
    };

    const getButtonContent = () => {
        if (isLoading) {
            return (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                </>
            );
        }

        if (isConnected) {
            if (isHovering) {
                return (
                    <>
                        <UserMinus className="w-4 h-4" />
                        <span>Unfollow</span>
                    </>
                );
            }
            return (
                <>
                    <UserCheck className="w-4 h-4" />
                    <span>Connected 🤝</span>
                </>
            );
        }

        if (isFollowing) {
            if (isHovering) {
                return (
                    <>
                        <UserMinus className="w-4 h-4" />
                        <span>Unfollow</span>
                    </>
                );
            }
            return (
                <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                </>
            );
        }

        return (
            <>
                <UserPlus className="w-4 h-4" />
                <span>Follow</span>
            </>
        );
    };

    const getButtonClasses = () => {
        const baseClasses = `
            inline-flex items-center justify-center gap-2
            rounded-full font-syne font-bold
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${getSizeClasses()}
        `;

        if (isConnected) {
            if (isHovering) {
                return `${baseClasses} bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20`;
            }
            return `${baseClasses} bg-primary/10 text-primary border border-primary/30`;
        }

        if (isFollowing) {
            if (isHovering) {
                return `${baseClasses} bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20`;
            }
            return `${baseClasses} glass-btn text-t1 border border-white/[0.06] hover:text-primary`;
        }

        return `${baseClasses} bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20`;
    };

    return (
        <button
            onClick={handleFollow}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            disabled={isLoading}
            className={getButtonClasses()}
        >
            {getButtonContent()}
        </button>
    );
}
