export default function Navbar() {
  return (
    <div className="flex justify-between items-center bg-base-100 shadow-md px-8 py-4">
      <h1 className="text-xl font-semibold">Dashboard Overview</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered input-sm"
        />
        <div className="avatar placeholder">
          <div className="bg-primary text-white rounded-full w-8">
            <span>S</span>
          </div>
        </div>
      </div>
    </div>
  );
}
