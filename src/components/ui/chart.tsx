import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

const useChart = () => {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
};

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorEntries = Object.entries(config).filter(([, value]) => value.color);

  if (!colorEntries.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart="${id}"] {
${colorEntries
  .map(([key, value]) => `  --color-${key}: ${value.color};`)
  .join("\n")}
}
`,
      }}
    />
  );
};

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId().replace(/:/g, "");
  const chartId = `chart-${id ?? uniqueId}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn(
          "flex justify-center text-xs [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});

ChartContainer.displayName = "ChartContainer";

const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipContentProps = React.ComponentProps<"div"> & {
  active?: boolean;
  payload?: Array<{
    color?: string;
    dataKey?: string;
    name?: string;
    value?: string | number;
  }>;
  hideIndicator?: boolean;
};

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ active, payload, className, hideIndicator = false, ...props }, ref) => {
    const { config } = useChart();

    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] gap-1 rounded-lg border border-border/70 bg-background/95 p-2 text-xs shadow-md",
          className
        )}
        {...props}
      >
        {payload.map((item, index) => {
          const key = typeof item.dataKey === "string" ? item.dataKey : item.name;
          const configItem = key ? config[key] : undefined;
          const label = configItem?.label ?? item.name;

          return (
            <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                {!hideIndicator && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color || "currentColor" }}
                  />
                )}
                <span>{label}</span>
              </div>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
);

ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

type ChartLegendContentProps = React.ComponentProps<"div"> & {
  payload?: Array<{
    color?: string;
    dataKey?: string;
    value?: string;
  }>;
};

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, payload, ...props }, ref) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div ref={ref} className={cn("flex items-center justify-center gap-4", className)} {...props}>
        {payload.map((item) => {
          const key = typeof item.dataKey === "string" ? item.dataKey : item.value;
          const configItem = key ? config[key] : undefined;

          return (
            <div key={item.value} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color || "currentColor" }}
              />
              <span className="text-xs text-muted-foreground">{configItem?.label ?? item.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
);

ChartLegendContent.displayName = "ChartLegendContent";

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
};
