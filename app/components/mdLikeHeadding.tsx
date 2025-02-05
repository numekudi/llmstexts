type HeaderTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const MdLikeHeadding = ({
  variant,
  title,
}: {
  variant: HeaderTypes;
  title: string;
}) => {
  const HeadingTag = variant;

  const hasBottomBorder = variant === "h1" || variant === "h2";
  const fontSize = {
    h1: "text-6xl",
    h2: "text-5xl",
    h3: "text-4xl",
    h4: "text-3xl",
    h5: "text-2xl",
    h6: "text-lg",
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

export default MdLikeHeadding;
