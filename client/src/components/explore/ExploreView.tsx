import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Novel } from '../../types';
import {
  Search,
  Star,
  Eye,
  Sparkles,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { BookShelf } from '../common/BookShelf';
import { Footer } from '../layout/Footer';

export const ExploreView: React.FC = () => {
  const navigate = useNavigate();
  const publishedNovels = useWorkspaceStore((s) => s.publishedNovels);
  const myNovels = useWorkspaceStore((s) => s.novels);
  const loadPublishedNovels = useWorkspaceStore((s) => s.loadPublishedNovels);
  const selectNovel = useWorkspaceStore((s) => s.selectNovel);
  const setIsReaderMode = useWorkspaceStore((s) => s.setIsReaderMode);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  // Load published books on mount
  useEffect(() => {
    loadPublishedNovels();
  }, [loadPublishedNovels]);

  const handleOpenBook = async (novelId: string) => {
    setIsReaderMode(true);
    await selectNovel(novelId);
    navigate(`/book/${novelId}?mode=reader`);
  };

  // Consolidate genuine published books (strictly no dummy data)
  const allPublishedBooks = useMemo<Novel[]>(() => {
    const map = new Map<string, Novel>();
    (publishedNovels || []).forEach((n) => {
      if (n && n._id && n.isPublished) {
        map.set(n._id, n);
      }
    });
    (myNovels || []).forEach((n) => {
      if (n && n._id && n.isPublished) {
        map.set(n._id, n);
      }
    });
    return Array.from(map.values());
  }, [publishedNovels, myNovels]);

  const genres = [
    'all',
    'General Fiction',
    'Sci-Fi',
    'Dark Fantasy',
    'Fantasy',
    'Post-Apocalyptic',
    'Steampunk',
    'Cyberpunk',
    'Thriller',
    'Mystery',
    'Horror',
    'Romance',
  ];

  // Apply search query and genre filter
  const filteredAll = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPublishedBooks.filter((b) => {
      const matchesSearch =
        !q ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.genre && b.genre.toLowerCase().includes(q)) ||
        (b.synopsis && b.synopsis.toLowerCase().includes(q));

      const matchesGenre =
        selectedGenre === 'all' ||
        (b.genre && b.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

      return matchesSearch && matchesGenre;
    });
  }, [allPublishedBooks, searchQuery, selectedGenre]);

  // CATEGORY 1: HIGHEST RATED
  const highestRatedBooks = useMemo(() => {
    return [...filteredAll].sort((a, b) => {
      const ratingA = a.rating ?? 5.0;
      const ratingB = b.rating ?? 5.0;
      if (ratingB !== ratingA) return ratingB - ratingA;
      return (b.ratingCount || 0) - (a.ratingCount || 0);
    });
  }, [filteredAll]);

  // CATEGORY 2: HIGHEST VIEWS
  const highestViewsBooks = useMemo(() => {
    return [...filteredAll].sort((a, b) => (b.views || 0) - (a.views || 0));
  }, [filteredAll]);

  // CATEGORY 3: NEW (chronological by publishedAt / createdAt)
  const newBooks = useMemo(() => {
    return [...filteredAll].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [filteredAll]);

  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-12">
      <div className="w-full px-4 sm:px-8 md:px-12 py-5 sm:py-8 space-y-6 sm:space-y-8">

        {/* Search Bar & Genre Filter Chips */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all published shelves..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs font-sans text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-500 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Genre Chips Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <SlidersHorizontal className="w-3.5 h-3.5 text-ink-muted flex-shrink-0 mr-1" />
            {genres.map((g) => {
              const isActive = selectedGenre === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-brand-600 text-white font-bold shadow-2xs'
                      : 'bg-canvas-card border border-canvas-border text-ink-muted hover:text-ink hover:bg-canvas-hover'
                  }`}
                >
                  {g === 'all' ? 'All Genres' : g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Search / Genre Indicator */}
        {(searchQuery || selectedGenre !== 'all') && (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-canvas-card border border-canvas-border text-xs font-mono text-ink-muted shadow-xs">
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span className="truncate">
                Filtering by{' '}
                {searchQuery && (
                  <span>
                    keyword &ldquo;<strong className="text-brand-700 dark:text-amber-400">{searchQuery}</strong>&rdquo;
                  </span>
                )}
                {searchQuery && selectedGenre !== 'all' && ' & '}
                {selectedGenre !== 'all' && (
                  <span>
                    genre &ldquo;<strong className="text-brand-700 dark:text-amber-400">{selectedGenre}</strong>&rdquo;
                  </span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('all');
              }}
              className="text-xs font-mono text-brand-600 hover:underline cursor-pointer flex-shrink-0 font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Publish to Explore Hero CTA when no books published yet */}
        {allPublishedBooks.length === 0 && (
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-brand-500/10 via-amber-500/10 to-canvas-card border border-brand-500/25 shadow-parchment flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 font-mono text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pioneer the Catalog</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-ink">
                The Explore shelves are waiting for your story
              </h3>
              <p className="text-sm text-ink-muted max-w-xl font-sans">
                {myNovels.length > 0
                  ? `You have ${myNovels.length} ${myNovels.length === 1 ? 'book' : 'books'} in your personal Library. Open your book settings and switch it to Published to feature it across the Alterjot community!`
                  : 'Alterjot’s public shelves are brand new and zero-dummy. Pen your first chapter in the Library and publish your book for readers to discover, read, and rate.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/library')}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-sans text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              {myNovels.length > 0 ? 'Manage Books in Library' : 'Create a Book in Library'}
            </button>
          </div>
        )}

        {/* CATEGORY 1: HIGHEST RATED */}
        <BookShelf
          title="Highest Rated"
          count={highestRatedBooks.length}
          subtitle="Top rated stories penned by community authors"
          badgeIcon={Star}
          books={highestRatedBooks}
          onOpenBook={handleOpenBook}
          badgeType="rating"
          emptyMessage={
            searchQuery || selectedGenre !== 'all'
              ? 'No highest rated books matching your filter.'
              : 'No published books rated yet.'
          }
        />

        {/* CATEGORY 2: HIGHEST VIEWS */}
        <BookShelf
          title="Highest Views"
          count={highestViewsBooks.length}
          subtitle="Most read and discovered volumes across the community"
          badgeIcon={Eye}
          books={highestViewsBooks}
          onOpenBook={handleOpenBook}
          badgeType="views"
          emptyMessage={
            searchQuery || selectedGenre !== 'all'
              ? 'No highest view books matching your filter.'
              : 'No published books with views recorded yet.'
          }
          className="pt-4 border-t border-canvas-border"
        />

        {/* CATEGORY 3: NEW */}
        <BookShelf
          title="New"
          count={newBooks.length}
          subtitle="Recently published releases fresh from the quill"
          badgeIcon={Sparkles}
          books={newBooks}
          onOpenBook={handleOpenBook}
          badgeType="new"
          emptyMessage={
            searchQuery || selectedGenre !== 'all'
              ? 'No new releases matching your filter.'
              : 'No new releases published yet.'
          }
          className="pt-4 border-t border-canvas-border"
        />

        {/* CATEGORY 4: ALL PUBLISHED */}
        <BookShelf
          title="All Published Books"
          count={filteredAll.length}
          subtitle="Complete catalog of published community books"
          badgeIcon={Globe}
          books={filteredAll}
          onOpenBook={handleOpenBook}
          emptyMessage={
            searchQuery || selectedGenre !== 'all'
              ? 'No published books matching your filter.'
              : 'No published books in the library catalog yet.'
          }
          className="pt-4 border-t border-canvas-border"
        />

      </div>

      {/* Website Footer */}
      <Footer />
    </div>
  );
};
