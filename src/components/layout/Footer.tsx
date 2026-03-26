'use client';

import Image from 'next/image';
import { assetPath } from "@/lib/basePath";

export function Footer() {
  return (
    /* paddingBottom: env(safe-area-inset-bottom) clears iOS home indicator on notched devices */
    <footer
      className="relative border-t border-[var(--border-default)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-oak)] to-transparent" />

      <div className="container-default section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <a href="/" className="mb-4 inline-block">
              <Image src={assetPath("/images/iron-oak-icon.webp")} alt="Iron & Oak" width={120} height={120} className="w-14 h-14" />
            </a>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Where iron sharpens iron and deep roots hold.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-4">Stay Connected</h4>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Never miss an episode. Join the launch list.
            </p>
            <form
              className="flex flex-col gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                try {
                  await fetch('https://formsubmit.co/ajax/theironandoakpodcast@gmail.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({
                      name: data.get('name'),
                      email: data.get('email'),
                      _subject: 'New Iron & Oak Subscriber (footer)',
                    }),
                  });
                  form.reset();
                  const btn = form.querySelector('button');
                  if (btn) { btn.textContent = 'Subscribed!'; setTimeout(() => { btn.textContent = 'Join'; }, 3000); }
                } catch { /* silently fail */ }
              }}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                {/* w-full on mobile for comfortable typing; text-base (16px) prevents iOS zoom */}
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="First name"
                  className="w-full sm:w-[120px] h-10 min-h-[44px] px-4 text-base sm:text-sm rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-oak)] transition-colors duration-300"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address"
                  className="w-full sm:flex-1 h-10 min-h-[44px] px-4 text-base sm:text-sm rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-oak)] transition-colors duration-300"
                />
                {/* w-full on mobile — full-width is easier to tap; min-h-[44px] ensures tap target */}
                <button
                  type="submit"
                  className="w-full sm:w-auto h-10 min-h-[44px] px-5 text-sm font-medium rounded-full bg-[var(--accent-oak)] text-white hover:bg-[var(--accent-oak-light)] transition-colors duration-300"
                >
                  Join
                </button>
              </div>
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
            </form>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-medium text-[var(--text-primary)] mb-4">Follow</h4>
            <div className="flex gap-4">
              <a href="https://www.youtube.com/@IronAndOakPodcast" target="_blank" rel="noopener noreferrer" className="p-3 -m-3 text-[var(--text-secondary)] hover:text-[var(--accent-oak)] transition-colors duration-300" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.instagram.com/ironandoakpodcast" target="_blank" rel="noopener noreferrer" className="p-3 -m-3 text-[var(--text-secondary)] hover:text-[var(--accent-oak)] transition-colors duration-300" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="https://open.spotify.com/show/ironandoakpodcast" target="_blank" rel="noopener noreferrer" className="p-3 -m-3 text-[var(--text-secondary)] hover:text-[var(--accent-oak)] transition-colors duration-300" aria-label="Spotify">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              </a>
              <a href="https://podcasts.apple.com/us/podcast/iron-and-oak-podcast" target="_blank" rel="noopener noreferrer" className="p-3 -m-3 text-[var(--text-secondary)] hover:text-[var(--accent-oak)] transition-colors duration-300" aria-label="Apple Podcasts">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c4.988 0 7.399 3.378 7.399 6.48 0 1.74-.756 3.768-1.77 4.956-.396.456-1.044.744-1.596.744-.852 0-1.344-.54-1.344-1.344 0-.264.048-.504.144-.768.492-1.272.768-2.52.768-3.588 0-2.064-1.32-4.248-3.6-4.248-2.28 0-3.6 2.184-3.6 4.248 0 1.068.276 2.316.768 3.588.096.264.144.504.144.768 0 .804-.492 1.344-1.344 1.344-.552 0-1.2-.288-1.596-.744-1.014-1.188-1.77-3.216-1.77-4.956-.001-3.102 2.41-6.48 7.397-6.48zM12 9.132a2.64 2.64 0 00-2.64 2.64 2.64 2.64 0 002.64 2.64 2.64 2.64 0 002.64-2.64A2.64 2.64 0 0012 9.132zm-.005 6.228c-.924 0-1.692.552-1.956 1.428l-1.212 4.188c-.252.876.312 1.464 1.188 1.464h3.96c.876 0 1.44-.588 1.188-1.464l-1.212-4.188c-.264-.876-1.032-1.428-1.956-1.428z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-default)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-tertiary)]">
            Built with conviction in Hays, Kansas.
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            &copy; {new Date().getFullYear()} The Iron &amp; Oak Podcast. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
