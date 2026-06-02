import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const springValue = useSpring(0, { bounce: 0, duration: 1000 });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-full">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight">{displayValue}</span>
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}