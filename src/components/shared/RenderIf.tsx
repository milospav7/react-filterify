interface IProps {
  condition: boolean;
  children: React.ReactNode;
}

const RenderIf: React.FC<IProps> = ({ condition, children }) => (
  <>{condition ? children : null}</>
);

export default RenderIf;
