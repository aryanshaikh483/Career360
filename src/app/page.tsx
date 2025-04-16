"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const reset = () => {
    if (typeof window !== "undefined" && sessionStorage.length > 0) {
      sessionStorage.clear();
    }
  };

  return (
    <div className="flex flex-col">
      <Header progressBar={[]} />
      <div className="bg-color-50 w-full rounded-2xl flex space-x-2 justify-center items-center p-4">
        {isClient && sessionStorage.length === 0 ? (
          <Link
            className={buttonVariants({ variant: "default" })}
            href={"/personality"}
          >
            Take Test!
          </Link>
        ) : (
          <>
            <Link
              className={buttonVariants({ variant: "default" })}
              href={"/personality"}
            >
              Continue
            </Link>
            <Link
              className={buttonVariants({ variant: "default" })}
              onClick={reset}
              href={"/personality"}
            >
              Try Again!
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
