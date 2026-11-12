import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ExternalLink, User, Building2, Tag, Video } from 'lucide-react';
import { events } from '../lib/db';
import { formatDateShort } from '../lib/utils';

function EventCard({ event }) {
  return (
    <div className="group bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Thumbnail */}
      {event.thumbnail_url ? (
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.thumbnail_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {event.event_type && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/70 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                <Video className="h-3 w-3" />
                {event.event_type}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
          <Video className="h-12 w-12 text-white/40" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Platform */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
            {event.platform || 'Online'}
          </span>
        </div>

        <h3 className="font-bold text-surface-900 text-base mb-1.5 group-hover:text-brand-600 transition-colors leading-snug">
          {event.title}
        </h3>
        {event.subtitle && (
          <p className="text-sm text-surface-500 mb-3 leading-relaxed line-clamp-2">{event.subtitle}</p>
        )}

        {/* Host info */}
        {(event.host_name || event.host_org) && (
          <div className="flex items-center gap-2 mb-3 text-xs text-surface-500">
            <User className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              <span className="font-medium text-surface-700">{event.host_name}</span>
              {event.host_title && `, ${event.host_title}`}
              {event.host_org && (
                <>
                  {' · '}
                  <span className="inline-flex items-center gap-0.5">
                    <Building2 className="h-3 w-3" />
                    {event.host_org}
                  </span>
                </>
              )}
            </span>
          </div>
        )}

        {/* Date */}
        {event.event_date && (
          <div className="flex items-center gap-2 text-xs text-surface-400 mb-4">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDateShort(event.event_date)}</span>
          </div>
        )}

        {/* CTA */}
        {event.platform_url && (
          <a
            href={event.platform_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Register Now
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function Events() {
  const { data: eventsList = [], isLoading } = useQuery({
    queryKey: ['events', 'all'],
    queryFn: async () => {
      const { data } = await events.list({ activeOnly: true, limit: 50 });
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <main>
      {/* ── Header ───────────────────────────────────────── */}
      <section className="bg-white pt-14 pb-10 border-b border-surface-200">
        <div className="container">
          <span className="section-eyebrow">Awareness Events</span>
          <h1 className="section-title mt-2 mb-3">Webinars, workshops & live sessions</h1>
          <p className="section-desc max-w-2xl">
            Join our FDE practitioners and industry experts for practical, field-tested knowledge on
            AI, compliance, and software delivery. All events are hosted on the gcode.in platform.
          </p>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-surface-200 overflow-hidden animate-pulse">
                  <div className="h-44 bg-surface-200" />
                  <div className="p-5">
                    <div className="h-4 bg-surface-200 rounded w-20 mb-3" />
                    <div className="h-5 bg-surface-200 rounded w-full mb-2" />
                    <div className="h-4 bg-surface-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : eventsList.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="font-semibold text-surface-700 mb-2">No events scheduled right now</h3>
              <p className="text-surface-500 text-sm">Follow us on LinkedIn to be notified when new events are announced.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {eventsList.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
