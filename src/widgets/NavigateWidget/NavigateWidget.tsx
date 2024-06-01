import { useNavigate } from 'react-router-dom';
import { Button } from '~/ui/Button';

interface NavigateWidgetProps {
  title: string;
  path: string;
  isLoading: boolean;
}
export function NavigateWidget({ path, title, isLoading }: NavigateWidgetProps) {
  const navigate = useNavigate();

  const handleGoTo = () => {
    navigate(path);
  };

  return (
    <Button onClick={handleGoTo} disabled={isLoading}>
      {title}
    </Button>
  );
}
