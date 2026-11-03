import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-600">StudioSpace</h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Find your space. Bring your ideas to life.
        </p>

        <Button className="mt-6 rounded-full bg-red-600 px-8 text-white hover:bg-red-700">
          Explore Studios
        </Button>
      </div>
    </main>
  );
}
