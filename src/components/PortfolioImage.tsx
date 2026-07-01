import Image, { ImageProps } from "next/image";
import { resolveImageSrc } from "@/lib/images";

type PortfolioImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export default function PortfolioImage({
  src,
  alt,
  ...props
}: PortfolioImageProps) {
  return <Image src={resolveImageSrc(src)} alt={alt} {...props} />;
}
