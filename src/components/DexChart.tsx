export default function DexChart() {
  return (
    <div className="card p-0 overflow-hidden h-[450px]">
      <iframe 
        src="https://dexscreener.com/solana/DgusxuYhbs5TqvLYNhEwEow8GwXyFNgc5hspP7SjfaNc?embed=1&theme=dark"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="$OTC Chart"
      />
    </div>
  );
}
