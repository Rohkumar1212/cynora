import Image from "next/image";

const ICON_ASPECT = 520 / 305; // width / height of the cropped swirl mark

export default function Logo({ size = 72 }: { size?: number }) {
  const height = size;
  const width = Math.round(size * ICON_ASPECT);
  return (
    <Image
      src="/images/cynora-logo.png"
      alt="Cynora"
      width={width}
      height={height}
      className="logo-mark"
      style={{ objectFit: "contain", width, height }}
      priority
    />
  );
}
