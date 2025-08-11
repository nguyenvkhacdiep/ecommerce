import Link from 'next/link';
import React from 'react';

type WithLinkProps<T> = T & {
  href?: string;
  children?: React.ReactNode;
  wrapperClassName?: string;
};

export function withLink<T>(OriginalComponent: React.FC<T>) {
  const WithLinkComponent: React.FC<WithLinkProps<T>> = ({
    wrapperClassName,
    href,
    children,
    ...props
  }) => {
    const WrapperComponent = href ? Link : React.Fragment;

    const wrapperProps: any = href
      ? {
          className: wrapperClassName,
          href,
        }
      : {};

    return (
      <WrapperComponent {...wrapperProps}>
        <OriginalComponent {...(props as T)}>{children}</OriginalComponent>
      </WrapperComponent>
    );
  };

  return WithLinkComponent;
}
