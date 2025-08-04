import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, actions }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-headline text-foreground">{title}</h1>
      {actions && <div>{actions}</div>}
    </div>
  );
};

export default PageHeader;
