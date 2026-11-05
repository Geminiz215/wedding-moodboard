export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7EEE8] text-[#784653] p-6 text-center">
      <div>
        <h1 className="text-4xl font-serif mb-2">404</h1>
        <p className="text-sm">Halaman tidak ditemukan.</p>
        <a
          href="/"
          className="mt-4 inline-block px-5 py-2 rounded-full bg-[#C98AA3] text-[#FFF9F5] text-xs uppercase tracking-wider"
        >
          Kembali ke Undangan
        </a>
      </div>
    </div>
  );
}

