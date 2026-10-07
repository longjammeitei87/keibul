type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  level?: 1 | 2;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  level = 2,
}: SectionHeadingProps) {
  const HeadingTag = level === 1 ? 'h1' : 'h2';

  return (
    <div className={`section-heading${align === 'center' ? ' is-centered' : ''}`}>
      {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
      <HeadingTag>{title}</HeadingTag>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
