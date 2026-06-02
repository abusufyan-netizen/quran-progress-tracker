import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "lucide-react";

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockMessage: string;
  };
  unlocked: boolean;
  progressText?: string;
}

export function BadgeCard({ badge, unlocked, progressText }: BadgeCardProps) {
  // @ts-ignore
  const Icon = Icons[badge.icon.split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("")] || Icons.Award;

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${unlocked ? 'border-accent shadow-md hover:shadow-lg' : 'opacity-60 bg-muted/50'}`}>
      <CardContent className="p-4 flex flex-col items-center text-center gap-3">
        <div className={`p-4 rounded-full ${unlocked ? 'bg-accent/20 text-accent ring-2 ring-accent ring-offset-2 ring-offset-background' : 'bg-muted text-muted-foreground'}`}>
          {unlocked ? <Icon className="h-8 w-8" /> : <Icons.Lock className="h-8 w-8" />}
        </div>
        <div>
          <h4 className="font-bold text-sm">{badge.name}</h4>
          <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
          {progressText && !unlocked && (
            <p className="text-[10px] font-medium text-primary mt-2">{progressText}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}