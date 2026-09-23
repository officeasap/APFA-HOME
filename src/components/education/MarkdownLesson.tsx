import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type VideoSource =
  | {
      kind: "youtube";
      url: string;
      title: string;
    }
  | {
      kind: "file";
      url: string;
      title: string;
    };

type MarkdownLinkProps = {
  href: string | undefined;
  children?: React.ReactNode;
  onVideo: (video: VideoSource) => void;
};

function getYouTubeId(href: string): string | null {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/")[2] ?? null;
      }

      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/")[2] ?? null;
      }
    }

    if (host === "youtu.be") {
      return url.pathname.split("/")[1] ?? null;
    }
  } catch {
    return null;
  }

  return null;
}

function getVideoSource(
  href: string | undefined,
  title: string,
): VideoSource | null {
  if (!href) {
    return null;
  }

  try {
    const url = new URL(href);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    const youtubeId = getYouTubeId(href);

    if (youtubeId) {
      return {
        kind: "youtube",
        url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
          youtubeId,
        )}?rel=0&modestbranding=1`,
        title,
      };
    }

    if (/\.(mp4|webm|ogg|m4v|mov)(?:$|[?#])/i.test(url.pathname + url.search + url.hash)) {
      return {
        kind: "file",
        url: href,
        title,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function MarkdownLink({
  href,
  children,
  onVideo,
}: MarkdownLinkProps) {
  const label = String(children ?? "").trim();
  const video = getVideoSource(href, label || "APFA lesson video");

  if (video) {
    return (
      <button
        type="button"
        className="apfa-video-link"
        onClick={() => onVideo(video)}
        aria-label={`Watch video: ${label || "APFA lesson video"}`}
      >
        <span className="apfa-video-link__play" aria-hidden="true">
          ▶
        </span>
        <span>WATCH VIDEO</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      className="underline underline-offset-2"
    >
      {children}
    </a>
  );
}

function VideoPlayer({
  video,
  onClose,
}: {
  video: VideoSource;
  onClose: () => void;
}) {
  return (
    <section
      className="apfa-video-shell not-prose"
      aria-label="APFA video player"
    >
      <div className="apfa-video-shell__header">
        <div>
          <p className="apfa-video-shell__eyebrow">
            APFA VIDEO PLAYER
          </p>

          <p className="apfa-video-shell__title">
            {video.title || "Course lesson video"}
          </p>
        </div>

        <button
          type="button"
          className="apfa-video-close"
          onClick={onClose}
          aria-label="Close video player"
        >
          CLOSE
        </button>
      </div>

      <div className="apfa-video-frame">
        {video.kind === "youtube" ? (
          <iframe
            src={video.url}
            title={video.title || "APFA lesson video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            controls
            playsInline
            preload="metadata"
            src={video.url}
          >
            Your browser does not support this video.
          </video>
        )}
      </div>

      <p className="apfa-video-shell__footer">
        Video stays inside your APFA lesson session.
      </p>
    </section>
  );
}

export function MarkdownLesson({
  content,
}: {
  content: string;
}) {
  const [activeVideo, setActiveVideo] = useState<VideoSource | null>(null);

  return (
    <>
      <article className="prose max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-7 prose-li:leading-7 prose-a:underline prose-a:underline-offset-2 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-pre:overflow-x-auto prose-table:w-full prose-th:border prose-th:border-border prose-th:p-2 prose-td:border prose-td:border-border prose-td:p-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            a: ({ href, children }) => (
              <MarkdownLink
                href={href}
                onVideo={setActiveVideo}
              >
                {children}
              </MarkdownLink>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {activeVideo ? (
        <VideoPlayer
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      ) : null}
    </>
  );
}
