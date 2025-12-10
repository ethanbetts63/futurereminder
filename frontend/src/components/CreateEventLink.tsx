import { Link } from 'react-router-dom';
import { Button, type ButtonProps } from '@/components/ui/button';

interface CreateEventLinkProps {
  children?: React.ReactNode;
  className?: string;
  size?: ButtonProps['size'];
}

export const CreateEventLink: React.FC<CreateEventLinkProps> = ({ children, className, size }) => {
  return (
    <Link to="/event-gate">
      <Button size={size} className={className}>
        {children || 'Secure Your Reminder'}
      </Button>
    </Link>
  );
};
