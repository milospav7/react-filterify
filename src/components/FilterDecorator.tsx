import { CSSProperties, ReactNode, useMemo } from "react";
import { Label } from "reactstrap";
import RenderIf from "./RenderIf";

interface IProps {
  children: ReactNode;
  className?: string;
  label?: string;
  labelClassName?: string;
  displayLabel?: boolean;
  style?: CSSProperties;
  labelStyle?: CSSProperties;
}

const FilterDecorator: React.FC<IProps> = ({
  children,
  className = "mb-2",
  label,
  labelClassName = "pb-0 text-dark font-weight-bold d-block text-left",
  displayLabel = false,
  style,
  labelStyle,
}) => {
  const memoizedFilter = useMemo(
    () => (
      <>
        <RenderIf condition={displayLabel}>
          <Label style={labelStyle} className={labelClassName} size="sm">
            {label}
          </Label>
        </RenderIf>
        {children}
      </>
    ),
    [children, displayLabel, label, labelClassName, labelStyle]
  );

  return (
    <div style={style} className={className}>
      {memoizedFilter}
    </div>
  );
};

export default FilterDecorator;
