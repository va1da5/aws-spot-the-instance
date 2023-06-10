import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

type Props = {};

export default function GenerateRootToken({}: Props) {
  const [status, setStatus] = useState({
    initiated: false,
  });
  return (
    <div className="p-4">
      {!status.initiated && (
        <div>
          <p className="mb-3 leading-7 [&:not(:first-child)]:mt-6">
            Generate Root Token
          </p>
          <Button
            onClick={() =>
              setStatus((current) => ({ ...current, initiated: true }))
            }
          >
            Start Procedure
          </Button>
          <div className="mb-5"></div>
        </div>
      )}

      {status.initiated && <InputWithText />}
    </div>
  );
}

export function InputWithText() {
  return (
    <div className="grid w-full items-center gap-1.5">
      <p className="mb-3 leading-7 [&:not(:first-child)]:mt-6">
        The process of generating a Vault root token has been initiated. Please
        proceed by providing your key share below.
      </p>
      <Label htmlFor="unseal-key">Unseal key</Label>
      <Input type="password" id="unseal-key" placeholder="Key share" />
      <p className="text-sm text-muted-foreground">
        Enter your unseal key share
      </p>
      <Button type="submit">Submit</Button>
    </div>
  );
}
