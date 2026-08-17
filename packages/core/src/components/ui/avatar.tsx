type AvatarProps = {
  src?: string;
  fallback?: string;
  className?: string;
};
function Avatar({
  src = "https://avatars.githubusercontent.com/u/107019128?v=4",
  fallback,
  className,
}: AvatarProps) {
  return (
    <div className="aspect-square size-10 overflow-hidden rounded-full">
      <img src={src} />
    </div>
  );
}
export default Avatar;
