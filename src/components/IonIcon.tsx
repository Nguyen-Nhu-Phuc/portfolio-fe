"use client";

import { useSyncExternalStore } from "react";

export interface IonIconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
}

const subscribe = () => () => {};

function ClientOnlyIonIcon({ name, className, style, ...props }: IonIconProps) {
  return <ion-icon name={name} className={className} style={style} {...props} />;
}

export default function IonIcon({ name, className, style, ...props }: IonIconProps) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return (
      <span
        className={className}
        style={style}
        data-ionicon={name}
        aria-hidden={props["aria-hidden"] === true || props["aria-hidden"] === "true"}
      />
    );
  }

  return (
    <ClientOnlyIonIcon
      name={name}
      className={className}
      style={style}
      {...props}
    />
  );
}
