import type { ImgHTMLAttributes, ReactElement } from "react";
import { BASENAME } from "@/customization/config-constants";

type DataFlowLogoProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "src"
> & {
  title?: string;
};

/** 使用公共资源显示 DataFlow 品牌图标。 */
export default function DataFlowLogo({
  title,
  "aria-hidden": ariaHidden,
  ...props
}: DataFlowLogoProps): ReactElement {
  return (
    <img
      width={18}
      height={18}
      {...props}
      src={`${BASENAME.replace(/\/$/, "")}/dataflow-icon.png?v=dataflow-20260908`}
      alt={
        ariaHidden === true || ariaHidden === "true" ? "" : title || "DataFlow"
      }
      aria-hidden={ariaHidden}
      title={title}
    />
  );
}
