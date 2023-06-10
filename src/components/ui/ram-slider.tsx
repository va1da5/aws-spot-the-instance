import { Dispatch, SetStateAction } from "react";
import { Label } from "./label";
import { Slider } from "./slider";

type Props = {
  ramRange: number[];
  onValueChange: Dispatch<SetStateAction<number[]>>;
};

export default function RamSlider({ ramRange, onValueChange }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="rams">RAM Memory Range</Label>
        <span className="w-24 px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
          {`${ramRange[0]} - ${ramRange[1]}`}
        </span>
      </div>
      <Slider
        id="rams"
        min={0}
        max={128}
        value={ramRange}
        step={1}
        onValueChange={onValueChange}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4 "
        aria-label="RAM Memory range"
      />
    </>
  );
}
