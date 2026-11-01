interface ImageSlotProps {
  file: string;
  label: string;
}

/** Reserved frame. Replace the file in public/images when the photograph is ready. */
export function ImageSlot({ file, label }: ImageSlotProps) {
  const src = `/images/${file}`;
  return (
    <figure className="image-slot">
      <img src={src} alt="" width={1200} height={320} />
      <figcaption>
        {label}. File: public/images/{file}
      </figcaption>
    </figure>
  );
}
