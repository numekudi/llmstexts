type HeaderTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const MdLikeHeading = ({
  variant,
  title,
}: {
  variant: HeaderTypes;
  title: string;
}) => {
  const HeadingTag = variant;

  const hasBottomBorder = variant === "h1" || variant === "h2";
  const fontSize = {
    h1: "text-2xl md:text-3xl",
    h2: "text-2xl md:text-3xl",
    h3: "text-2xl md:text-3xl",
    h4: "text-lg md:text-2xl",
    h5: "text-lg md:text-lg",
    h6: "text-lg md:text-lg",
  }[variant];
  const hashes = `#`.repeat(parseInt(variant.replace("h", "")));

  return (
    <HeadingTag className={`font-bold ${fontSize} `}>
      <div className={`${hasBottomBorder ? "border-b" : ""}`}>
        <span className="pr-4 text-gray-500">{hashes}</span>
        <span>{title}</span>
      </div>
    </HeadingTag>
  );
};

export default MdLikeHeading;
