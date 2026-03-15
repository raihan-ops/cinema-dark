import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Star,
  Clock,
  Calendar,
  Tv,
  Film,
} from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useMovieDetail } from "./useMovieDetail";
import { backdropUrl, posterUrl } from "@/api/tmdb";
import { useWatchlist } from "@/features/watchlist/useWatchlist";
import MovieCard from "@/components/MovieCard";
import { DetailSkeleton } from "@/components/skeletons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ROUTES } from "@/router/routes";

function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function CastCard({ person }) {
  const photo = posterUrl(person.profile_path, "w185");
  return (
    <div className="w-27.5 shrink-0">
      <div className="h-37.5 w-full overflow-hidden rounded-primary bg-surface-card">
        {photo ? (
          <img
            src={photo}
            alt={person.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-text-muted">
            No Photo
          </div>
        )}
      </div>
      <p className="mt-2 line-clamp-2 text-xs font-bold text-text-primary">
        {person.name}
      </p>
      {(person.character || person.job) && (
        <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary">
          {person.character || person.job}
        </p>
      )}
    </div>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function MovieDetailPage() {
  useScrollToTop();

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isLoading, isError } = useMovieDetail(id);

  const { addMovie, removeMovie, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(Number(id));

  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-surface-black px-8 text-center">
        <Film size={48} className="mb-4 text-text-muted" />
        <p className="text-2xl font-bold text-text-primary">
          Could not load title
        </p>
        <p className="mt-2 text-base text-text-secondary">
          This page may not exist or there was a network error. Please try
          again.
        </p>
        <button
          onClick={handleBack}
          className="mt-6 flex h-10 items-center gap-2 rounded-primary bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary-deep"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  if (!data) return null;

  const title = data.title || data.name || "Unknown";
  const year = (data.release_date || data.first_air_date || "").slice(0, 4);
  const runtime = data.runtime || data.episode_run_time?.[0] || null;
  const backdrop = backdropUrl(data.backdrop_path);
  const poster = posterUrl(data.poster_path, "w500");
  const rating = data.vote_average
    ? Number(data.vote_average).toFixed(1)
    : null;
  const voteCount = data.vote_count
    ? data.vote_count >= 1000
      ? `${(data.vote_count / 1000).toFixed(1)}K`
      : String(data.vote_count)
    : null;
  const genres = data.genres ?? [];
  const overview = data.overview ?? "";
  const cast = data.credits?.cast?.slice(0, 14) ?? [];
  const directors =
    data.credits?.crew?.filter((c) => c.job === "Director").slice(0, 3) ?? [];
  const creators = (data.created_by ?? []).slice(0, 3);
  const crewHighlights = data.media_type === "tv" ? creators : directors;
  const trailer = data.videos?.results?.find(
    (v) =>
      v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
  );
  const similar =
    data.similar?.results?.filter((m) => m.poster_path).slice(0, 8) ?? [];

  // Watclist-compatible object built from full detail response
  const movieObj = {
    id: data.id,
    title: data.title,
    name: data.name,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    release_date: data.release_date,
    first_air_date: data.first_air_date,
    vote_average: data.vote_average,
    genre_ids: genres.map((g) => g.id),
    media_type: data.media_type,
    overview: data.overview,
  };

  async function handleWatchlistToggle() {
    if (inWatchlist) {
      await removeMovie(data.id);
    } else {
      await addMovie(movieObj);
    }
  }

  function handleBack() {
    if (location.key !== 'default') {
      navigate(-1);
      return;
    }

    const fallbackRoute = location.state?.from || ROUTES.SEARCH;
    navigate(fallbackRoute, { replace: true });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen bg-surface-black"
    >
      {/* ── Backdrop ───────────────────────────────────────────────────────── */}
      <div className="relative aspect-video w-full max-h-[600px] overflow-hidden">
        {backdrop ? (
          <img
            src={backdrop}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-surface-elevated" />
        )}
        {/* gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-surface-black via-surface-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-surface-black/70 to-transparent" />
      </div>

      {/* Back button — outside overflow-hidden, z-50 so it's above the -mt-50 content on mobile */}
      <button
        onClick={handleBack}
        className="absolute left-4 top-5 z-50 flex items-center gap-2 rounded-primary bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/60 sm:left-8"
      >
        <ArrowLeft size={15} />
      </button>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        {/* Hero: poster + meta */}
        <div className="-mt-50 flex flex-col gap-8 md:flex-row md:gap-10 ">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto w-50 shrink-0 md:mx-0 md:w-60"
          >
            <div className=" aspect-2/3 w-full overflow-hidden rounded-primary border border-surface-border shadow-card">
              {poster ? (
                <img
                  src={poster}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-card text-sm text-text-secondary">
                  No Image
                </div>
              )}
            </div>
          </motion.div>

          {/* Meta panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex-1 pt-0 md:pt-32.5"
          >
            {/* Genre pills */}
            {genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="uppercase rounded-primary border border-primary/20 bg-surface-elevated px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl font-black leading-tight text-text-primary sm:text-4xl md:text-5xl">
              {title}
            </h1>

            {data.tagline && (
              <p className="mt-2 text-sm italic text-text-secondary sm:text-base">
                &ldquo;{data.tagline}&rdquo;
              </p>
            )}

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-primary" />
                  {year}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-primary" />
                  {formatRuntime(runtime)}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs uppercase tracking-wide">
                {data.media_type === "tv" ? (
                  <Tv size={13} className="text-primary" />
                ) : (
                  <Film size={13} className="text-primary" />
                )}
                {data.media_type === "tv" ? "TV Series" : "Movie"}
              </span>
            </div>

            {/* Stat boxes */}
            <div className="mt-6 flex flex-wrap gap-3">
              {rating && (
                <div className="flex flex-col items-center rounded-primary border border-surface-border bg-surface-elevated px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
                    Rating
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-2xl font-black text-text-primary">
                    <Star size={15} className="fill-primary text-primary" />
                    {rating}
                  </span>
                </div>
              )}
              {voteCount && (
                <div className="flex flex-col items-center rounded-primary border border-surface-border bg-surface-elevated px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
                    Votes
                  </span>
                  <span className="mt-1 text-2xl font-black text-text-primary">
                    {voteCount}
                  </span>
                </div>
              )}
              {data.status && (
                <div className="flex flex-col items-center rounded-primary border border-surface-border bg-surface-elevated px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
                    Status
                  </span>
                  <span className="mt-1 text-sm font-bold text-text-primary">
                    {data.status}
                  </span>
                </div>
              )}
              {data.media_type === "tv" && data.number_of_seasons && (
                <div className="flex flex-col items-center rounded-primary border border-surface-border bg-surface-elevated px-5 py-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
                    Seasons
                  </span>
                  <span className="mt-1 text-2xl font-black text-text-primary">
                    {data.number_of_seasons}
                  </span>
                </div>
              )}
            </div>

            {/* Watchlist toggle */}
            <Button
              onClick={handleWatchlistToggle}
              className={cn(
                "mt-6 flex h-11 items-center gap-2 rounded-primary px-6 text-sm font-bold transition-colors",
                inWatchlist
                  ? "border border-primary bg-primary/10 text-primary-soft hover:bg-primary/20"
                  : "bg-primary text-white hover:bg-primary-deep",
              )}
            >
              {inWatchlist ? (
                <BookmarkCheck size={16} />
              ) : (
                <Bookmark size={16} />
              )}
              {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
          </motion.div>
        </div>

        {/* ── Overview ───────────────────────────────────────────────────── */}
        {(overview || crewHighlights.length > 0) && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.35 }}
            className="mt-12"
          >
            {overview && (
              <>
                <h2 className="mb-4 text-xl font-bold text-text-primary">
                  Overview
                </h2>
                <p className="max-w-[800px] text-base leading-relaxed text-text-secondary">
                  {overview}
                </p>
              </>
            )}
            {crewHighlights.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-8">
                {crewHighlights.map((person) => (
                  <div key={person.id ?? person.credit_id}>
                    <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
                      {data.media_type === "tv" ? "Creator" : "Director"}
                    </p>
                    <p className="mt-1 text-sm font-bold text-text-primary">
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* ── Trailer ────────────────────────────────────────────────────── */}
        {trailer && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="mb-4 text-xl font-bold text-text-primary">
              Trailer
            </h2>
            <div
              className="overflow-hidden rounded-primary border border-surface-border"
              style={{ aspectRatio: "16/9", maxWidth: 720 }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </motion.section>
        )}

        {/* ── Cast ────────────────────────────────────────────────────────── */}
        {cast.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.45 }}
            className="mt-12"
          >
            <h2 className="mb-5 text-xl font-bold text-text-primary">Cast</h2>
            <Carousel opts={{ align: 'start', dragFree: true }}>
              <CarouselContent className="-ml-4">
                {cast.map((person) => (
                  <CarouselItem
                    key={`${person.id}-${person.cast_id}`}
                    className="pl-4 basis-auto"
                  >
                    <CastCard person={person} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 border-surface-border bg-surface-elevated text-text-secondary hover:bg-primary hover:text-white hover:border-primary disabled:opacity-0" />
              <CarouselNext className="hidden sm:flex -right-4 border-surface-border bg-surface-elevated text-text-secondary hover:bg-primary hover:text-white hover:border-primary disabled:opacity-0" />
            </Carousel>
          </motion.section>
        )}

        {/* ── Similar titles ──────────────────────────────────────────────── */}
        {similar.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.5 }}
            className="mt-12 pb-16"
          >
            <h2 className="mb-6 text-xl font-bold text-text-primary">
              Similar Titles
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {similar.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{ ...movie, media_type: data.media_type }}
                  variant="search"
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
