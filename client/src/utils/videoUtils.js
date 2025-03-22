/**
 * Extracts YouTube video ID from various URL formats
 * @param {string} url - The YouTube URL
 * @returns {string|null} - The video ID or null if invalid
 */
export const getYoutubeVideoId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };