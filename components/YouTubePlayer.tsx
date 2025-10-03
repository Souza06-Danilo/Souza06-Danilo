
import React from 'react';
import { Video } from '../types';

interface YouTubePlayerProps {
  video: Video;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ video }) => {
  const { videoId, startTimeInSeconds, title } = video;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTimeInSeconds}&autoplay=0&rel=0`;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">{title}</h4>
      <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="border-0"
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubePlayer;
