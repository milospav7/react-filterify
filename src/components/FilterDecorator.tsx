import { ReactNode, useMemo } from "react";
import { Label } from "reactstrap";

interface IProps {
  children: ReactNode;
  className?: string;
  label?: string;
  labelClassName?: string;
  displayLabel?: boolean;
}

const FilterDecorator: React.FC<IProps> = ({
  children,
  className = "mb-2",
  label,
  labelClassName = "pb-0 text-dark font-weight-bold d-block text-left",
  displayLabel,
}) => {
  const memoizedFilter = useMemo(() => {
    if (displayLabel)
      return (
        <div className={className}>
          <Label className={labelClassName} size="sm">
            {label}
          </Label>
          {children}
        </div>
      );
    return <div className={className}>{children}</div>;
  }, [children, className, displayLabel, label, labelClassName]);

  return memoizedFilter;
};

export default FilterDecorator;
