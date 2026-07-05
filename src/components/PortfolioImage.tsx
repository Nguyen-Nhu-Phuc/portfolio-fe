import Image, { ImageProps } from "next/image";
import { isSvgSrc, resolveImageSrc } from "@/lib/images";

type PortfolioImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export default function PortfolioImage({
  src,
  alt,
  ...props
}: PortfolioImageProps) {
  const resolved = resolveImageSrc(src);

  if (isSvgSrc(src) || isSvgSrc(resolved)) {
    const {
      fill: _fill,
      priority: _priority,
      quality: _quality,
      placeholder: _placeholder,
      blurDataURL: _blurDataURL,
      loader: _loader,
      sizes: _sizes,
      unoptimized: _unoptimized,
      onLoad: _onLoad,
      onLoadingComplete: _onLoadingComplete,
      ...imgProps
    } = props;

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolved} alt={alt} {...imgProps} />;
  }

  return <Image src={resolved} alt={alt} {...props} />;
}
