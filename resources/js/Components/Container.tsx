import React from "react";

export default function Container({ children }: React.PropsWithChildren) {
    return <div className="mx-auto max-w-screen-xl p-4">{children}</div>;
}
