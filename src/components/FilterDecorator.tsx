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
}

const FilterDecorator: React.FC<IProps> = ({
  children,
  className = "mb-2",
  label,
  labelClassName = "pb-0 text-dark font-weight-bold d-block text-left",
  displayLabel = false,
  style,
}) => {
  const memoizedFilter = useMemo(
    () => (
      <>
        <RenderIf condition={displayLabel}>
          <Label className={labelClassName} size="sm">
            {label}
          </Label>
        </RenderIf>
        {children}
      </>
    ),
    [children, displayLabel, label, labelClassName]
  );

  return (
    <div style={style} className={className}>
      {memoizedFilter}
    </div>
  );
};

export default FilterDecorator;
