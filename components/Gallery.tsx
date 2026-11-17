"use client";

import { useState } from "react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) {
    return <div className="aspect-[3/4] bg-brand-mist" />;
  }

  return (
    <div>
      <div className="flex gap-3">
        {images.length > 1 ? (
          <div className="hidden w-[4.5rem] shrink-0 flex-col gap-2 md:flex">
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`aspect-[3/4] overflow-hidden bg-brand-mist ${
                  index === active ? "ring-2 ring-brand-black" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Show photo ${index + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
        <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-brand-mist">
          <img src={current} alt={name} className="h-full w-full object-cover" />
        </div>
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto md:hidden">
          {images.map((src, index) => (
            <button
              key={`${src}-mobile-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`h-20 w-16 shrink-0 overflow-hidden bg-brand-mist ${
                index === active ? "ring-2 ring-brand-black" : "opacity-70"
              }`}
              aria-label={`Show photo ${index + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
