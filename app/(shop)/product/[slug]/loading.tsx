export default function ProductLoading() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-2">
      <div className="aspect-[3/4] animate-pulse bg-brand-line motion-reduce:animate-none" />
      <div>
        <div className="h-3 w-24 animate-pulse bg-brand-line motion-reduce:animate-none" />
        <div className="mt-6 h-16 w-3/4 animate-pulse bg-brand-line motion-reduce:animate-none" />
        <div className="mt-6 h-8 w-24 animate-pulse bg-brand-line motion-reduce:animate-none" />
        <div className="mt-8 h-24 w-full animate-pulse bg-brand-line motion-reduce:animate-none" />
      </div>
    </div>
  );
}
