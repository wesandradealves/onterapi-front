import { DividerProps } from './interfaces';
import { containerClass, lineClass } from './styles';

export const Divider = ({ label }: DividerProps) => (
  <div className={containerClass}>
    <span className={lineClass} />
    {label && <span>{label}</span>}
    <span className={lineClass} />
  </div>
);

export default Divider;
