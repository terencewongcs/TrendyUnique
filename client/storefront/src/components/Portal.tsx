import { ReactNode, FC } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

const Portal: FC<PortalProps> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export default Portal;
