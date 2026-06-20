// Purely decorative background blobs — soft blurred circles of color
// that sit behind page content to make the layout feel less corporate
// and more alive, matching the playful reference style.
export default function Decor({ variant = "default" }) {
  if (variant === "hero") {
    return (
      <>
        <div className="blob blob-pink" style={{ width: 320, height: 320, top: -80, left: -100 }} />
        <div className="blob blob-gold" style={{ width: 220, height: 220, top: 120, right: -60 }} />
        <div className="blob blob-purple" style={{ width: 260, height: 260, bottom: -100, left: "40%" }} />
      </>
    );
  }
  return (
    <>
      <div className="blob blob-purple" style={{ width: 240, height: 240, top: -60, right: -80 }} />
      <div className="blob blob-pink" style={{ width: 180, height: 180, bottom: 40, left: -60 }} />
    </>
  );
}
