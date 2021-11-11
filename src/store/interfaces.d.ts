import { CSSProperties } from "react";
interface BaseFilterProps {
  containerId: string;
  filteringProperty: string;
  navigationProperty?: string; // TODO: Support for complex type in order to support more than one level navigation props filtering
  size?: string;
  className?: string;
  withAssociatedLabel?: boolean;
  labelClassName?: string;
  label?: string;
  style?: CSSProperties;
  placeholder?: string;
}

export { BaseFilterProps };
