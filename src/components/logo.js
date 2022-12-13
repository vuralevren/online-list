import listLogo from "../assets/list-logo2.png";

export default function Logo({ className, w }) {
  return (
    <img
      className={className || `w-[${w || "192px"}] h-[120px] mb-6`}
      src={listLogo}
      alt="List"
    />
  );
}
