import { Dispatch, SetStateAction } from "react";
import { Label } from "./label";
import { Slider } from "./slider";

type Props = {
  cpuCores: number[];
  onValueChange: Dispatch<SetStateAction<number[]>>;
};

export default function CpuCoresSlider({ cpuCores, onValueChange }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="cpus">CPU Cores</Label>
        <span className="w-24 px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
          {`${cpuCores[0]} - ${cpuCores[1]}`}
        </span>
      </div>
      <Slider
        id="cpus"
        min={1}
        max={128}
        value={cpuCores}
        step={1}
        onValueChange={onValueChange}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label="CPU Cores"
      />
    </>
  );
}
