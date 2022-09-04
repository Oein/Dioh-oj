import dynamic from "next/dynamic";
import { Suspense } from "react";

const DynamicHeader = dynamic(() => import("./Head/index"), {
  suspense: true,
});

export default function Head() {
  return (
    <Suspense fallback={`Loading...`}>
      <DynamicHeader />
    </Suspense>
  );
}
