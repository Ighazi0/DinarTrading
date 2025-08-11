import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type Service = {
  id: string;
  title: string;
  brief: string;
  description?: string | null;
  image_url?: string | null;
  slug: string;
};

export function ServiceCard({ service }: { service: Service }) {
  const image = service.image_url || "/logistics-service.png";
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
        <CardTitle className="mt-3 text-base">{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground line-clamp-3">
        {service.brief}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/services/${service.slug}`}>See more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
