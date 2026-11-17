export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-12 md:px-10">
      <div className="h-3 w-16 animate-pulse bg-brand-line motion-reduce:animate-none" />
      <div className="mt-4 h-16 w-64 animate-pulse bg-brand-line motion-reduce:animate-none" />
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[3/4] animate-pulse bg-brand-line motion-reduce:animate-none" />
            <div className="mt-3 h-4 w-2/3 animate-pulse bg-brand-line motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
