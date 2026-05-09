import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Button className="bg-heritage-green text-white hover:bg-heritage-green-dark">
        Se connecter
      </Button>
    </div>
  );
}
