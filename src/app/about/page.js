export default function About() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-ray-bg dark:bg-ray-bg">
      <div className="bg-ray-card dark:bg-ray-card rounded-2xl shadow-ray p-8 border border-ray-muted/40 max-w-2xl w-full mx-4">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-ray-text">About This Blog</h1>
        <p className="text-lg text-ray-text-muted mb-8">
          This is a modern blog built with Next.js and Tailwind CSS. In the future, it will be powered by Sanity for content management. The project demonstrates a clean, responsive design and is ready for dynamic content integration.
        </p>
        <a href="/" className="inline-block px-6 py-2 bg-ray-accent text-white font-semibold rounded-lg shadow-ray hover:bg-ray-accent-dark transition-colors">← Back to Home</a>
      </div>
    </div>
  );
} 