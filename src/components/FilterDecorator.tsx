import { CSSProperties, ReactNode, useMemo } from "react";
import { Label } from "reactstrap";

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
  displayLabel,
  style,
}) => {
  const memoizedFilter = useMemo(() => {
    if (displayLabel)
      return (
        <>
          <Label className={labelClassName} size="sm">
            {label}
          </Label>
          {children}
        </>
      );
    return <>{children}</>;
  }, [children, displayLabel, label, labelClassName]);

  return (
    <div style={style} className={className}>
      {memoizedFilter}
    </div>
  );
};

export default FilterDecorator;
