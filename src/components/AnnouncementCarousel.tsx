'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  type: 'text' | 'image' | 'video';
  media_url: string | null;
  link_url: string | null;
  link_text: string | null;
  bg_color: string;
  text_color: string;
}

export default function AnnouncementCarousel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    if (data && data.length > 0) setAnnouncements(data);
  };

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % announcements.length);
  }, [announcements.length]);

  const prev = () => {
    setCurrent(prev => (prev - 1 + announcements.length) % announcements.length);
  };

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [announcements.length, next]);

  if (announcements.length === 0) return null;

  const item = announcements[current];

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-6 md:mx-auto md:max-w-7xl">
      <div
        className="relative min-h-[200px] md:min-h-[280px] flex items-center transition-all duration-500"
        style={{ background: item.type === 'image' ? '#111' : item.bg_color }}
      >
        {/* Image background */}
        {item.type === 'image' && item.media_url && (
          <img
            src={item.media_url}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}

        {/* Video background */}
        {item.type === 'video' && item.media_url && (
          <video
            src={item.media_url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}

        {/* Overlay for media */}
        {(item.type === 'image' || item.type === 'video') && (
          <div className="absolute inset-0 bg-black/40" />
        )}

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 max-w-2xl">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: item.text_color }}
          >
            {item.title}
          </h2>
          {item.description && (
            <p
              className="text-sm md:text-base mb-5 opacity-90 leading-relaxed"
              style={{ color: item.text_color }}
            >
              {item.description}
            </p>
          )}
          {item.link_url && (
            <Link
              href={item.link_url}
              className="inline-block bg-white text-gray-800 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition shadow-md"
            >
              {item.link_text || 'En savoir plus'}
            </Link>
          )}
        </div>

        {/* Navigation arrows */}
        {announcements.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
            >
              &#10094;
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
            >
              &#10095;
            </button>
          </>
        )}

        {/* Dots */}
        {announcements.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === current ? 'bg-white scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
