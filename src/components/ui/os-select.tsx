import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

type Props = {
  value: string;
  onValueChange: Dispatch<SetStateAction<string>>;
};

export default function OsSelect({ value, onValueChange }: Props) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select OS" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>OS</SelectLabel>
          <SelectItem value="linux">Linux</SelectItem>
          <SelectItem value="mswin">Windows</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
