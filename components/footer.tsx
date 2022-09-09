import dynamic from "next/dynamic";
import { Suspense } from "react";

const DynamicFooter = dynamic(() => import("./Footer/index"), {
  suspense: true,
});

export default function Footer() {
  return (
    <Suspense fallback={`Loading...`}>
      <DynamicFooter />
    </Suspense>
  );
}
