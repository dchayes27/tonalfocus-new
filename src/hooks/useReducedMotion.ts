/**
 * @file src/hooks/useReducedMotion.ts
 * @description This module defines a custom React hook `useReducedMotion`
 * which detects whether the user has enabled a preference for reduced motion
 * in their operating system or browser settings. This is crucial for
 * accessibility, allowing developers to disable or alter animations and
 * transitions that could cause discomfort or issues for users sensitive to motion.
 *
 * The hook is a Client Component ('use client') as it interacts with browser-specific APIs.
 */
'use client'; // Marks this module as a Client Component.

import { useState, useEffect } from 'react';

/**
 * Custom React hook to detect user preference for reduced motion.
 * It listens to the `prefers-reduced-motion` CSS media query.
 *
 * @returns {boolean} `true` if the user prefers reduced motion, `false` otherwise.
 *                    Defaults to `false` on the server or if the preference cannot be determined,
 *                    ensuring animations are enabled by default.
 */
export default function useReducedMotion(): boolean {
  // Initialize state: defaults to `false` (no preference for reduced motion).
  // This ensures animations are enabled by default if the preference can't be detected (e.g., during SSR).
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // This effect should only run on the client-side where `window` is available.
    if (typeof window === 'undefined') {
      return; // Exit if not in a browser environment.
    }
    
    // Create a MediaQueryList object for the 'prefers-reduced-motion: reduce' media query.
    // This object allows us to check the current state of the query and listen for changes.
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set the initial state based on whether the media query currently matches.
    // `mediaQuery.matches` is true if the user prefers reduced motion.
    setPrefersReducedMotion(mediaQuery.matches);
    
    /**
     * Event handler for changes in the media query's state.
     * Updates the `prefersReducedMotion` state when the user's preference changes.
     * @param {MediaQueryListEvent} event - The event object containing the new match state.
     */
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    // Add an event listener to the media query list to detect changes.
    // The 'change' event fires when the result of the media query evaluation changes.
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup function: This is crucial to prevent memory leaks.
    // It removes the event listener when the component using this hook unmounts.
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount and cleans up on unmount.
  
  // Return the current state of the user's preference for reduced motion.
  return prefersReducedMotion;
}