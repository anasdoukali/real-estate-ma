import type { ReactNode } from "react";

type ArticleContentProps = { content?: string | null };

function safeImageUrl(value: string) {
  return /^(https?:\/\/|\/)/.test(value) ? value : null;
}

function inlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(!?\[[^\]]*\]\([^)]*\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    const image = part.match(/^!\[([^\]]*)\]\(([^)]*)\)$/);
    if (image) {
      const src = safeImageUrl(image[2]);
      return src ? <img key={index} src={src} alt={image[1]} className="my-8 w-full rounded-sm object-cover" /> : part;
    }
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null;

  return (
    <div className="text-[17px] leading-[1.95] text-ink/80">
      {content.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index} className="mb-7 last:mb-0">
          {paragraph.split("\n").flatMap((line, lineIndex) => [
            ...(lineIndex ? [<br key={`br-${lineIndex}`} />] : []),
            ...inlineMarkdown(line),
          ])}
        </p>
      ))}
    </div>
  );
}
