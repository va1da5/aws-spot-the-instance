import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Input } from "./components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./components/ui/hover-card";

import CpuCoresSlider from "./components/ui/cpu-cores-slider";
import RamSlider from "./components/ui/ram-slider";
import OsSelect from "./components/ui/os-select";
import {
  getSpotAdvisorData,
  loadPrices,
  AWSSpotData,
  AWSInstanceDetails,
  AWSInstanceDetailsMapping,
} from "./lib/aws";
import Loading from "./components/ui/loading";
import Footer from "./components/ui/footer";

type AWSRegionPrices = {
  region: string;
  linux: string | null;
  mswin: string | null;
  [key: string]: string | null;
};

type AWSInstancePriceMapping = {
  [type: string]: AWSRegionPrices[];
};

const InstanceType = ({
  name,
  details,
}: {
  name: string;
  details: AWSInstanceDetails;
}) => {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <span className="text-lg font-semibold">{name}</span>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="flex w-[200px] flex-col space-y-1 text-sm"
        side="right"
      >
        <p className="mb-3 text-muted-foreground">Instance details</p>
        <p className="flex justify-between">
          <span>{name}</span>
          <span className="text-muted-foreground">Type</span>
        </p>
        <p className="flex justify-between">
          <span>{details.cores}</span>{" "}
          <span className="text-muted-foreground">CPU Cores</span>
        </p>
        <p className="flex justify-between">
          <span>{details.ram_gb}GB</span>{" "}
          <span className="text-muted-foreground">RAM</span>
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

function App() {
  const [instanceDetails, setInstanceDetails] =
    useState<AWSInstanceDetailsMapping>({});
  const [instances, setInstances] = useState<AWSInstancePriceMapping>({});
  const [cpuCores, setCpuCores] = useState([1, 8]);
  const [ramRange, setRamRange] = useState([0, 32]);
  const [search, setSearch] = useState("");
  const [os, setOS] = useState<string>("linux");
  const [loading, setLoading] = useState(false);

  const parsePrices = (data: AWSSpotData) => {
    const prices: AWSInstancePriceMapping = Object.keys(instanceDetails).reduce(
      (out: AWSInstancePriceMapping, value) => {
        out[value] = [];
        return out;
      },
      {}
    );

    data.config.regions.forEach((region) => {
      region.instanceTypes.forEach((instanceType) => {
        instanceType.sizes.forEach((size) => {
          if (!prices[size.size]) {
            prices[size.size] = [];
          }
          prices[size.size].push({
            region: region.region,
            linux: null,
            mswin: null,
            ...size.valueColumns.reduce((out: any, item) => {
              out[item.name] = item.prices.USD
                ? parseFloat(item.prices.USD)
                : null;
              return out;
            }, {}),
          });
        });
      });
    });

    setInstances(prices);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getSpotAdvisorData((data) => {
      setInstanceDetails(data.instance_types);
      loadPrices(parsePrices);
    });
  }, []);

  const comparePrices = (a: AWSRegionPrices, b: AWSRegionPrices) => {
    if (!a[os] || isNaN(Number(a[os]))) return 1;

    return Number(a[os]) > Number(b[os]) ? 1 : -1;
  };

  const applySearch = (name: string) => {
    if (!search.length) return true;

    return name.includes(search);
  };

  const applyFilter = (instance: string) => {
    const [minCores, maxCores] = cpuCores;
    const [minRam, maxRam] = ramRange;

    const details = instanceDetails[instance];

    return (
      details.cores >= minCores &&
      details.cores <= maxCores &&
      details.ram_gb >= minRam &&
      details.ram_gb <= maxRam
    );
  };

  return (
    <>
      <div className="mb-20 mt-10 flex justify-center">
        <div className="w-3/4 ">
          <h1 className="mb-2 text-2xl">Spot the Instance</h1>
          <p className="mb-16 text-lg text-muted-foreground">
            A tool for finding the cheapest spot instances across different AWS
            regions
          </p>

          <Loading loading={loading} />

          <div className="mb-10 grid grid-cols-12 gap-5 ">
            <div className="col-span-3">
              <Input
                type="text"
                placeholder="Search instance"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-span-1">
              <OsSelect value={os} onValueChange={setOS} />
            </div>

            <div className="col-span-4">
              <CpuCoresSlider cpuCores={cpuCores} onValueChange={setCpuCores} />
            </div>

            <div className="col-span-4">
              <RamSlider ramRange={ramRange} onValueChange={setRamRange} />
            </div>
          </div>

          <Table>
            <TableCaption>A list of AWS Spot Instances</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Instance Type</TableHead>
                <TableHead colSpan={5}>Prices by Region</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(instances)
                .filter(applySearch)
                .filter(applyFilter)
                .sort()
                .filter((name) => instances[name].length !== 0)
                .map((instance) => (
                  <TableRow key={instance}>
                    <TableCell className="font-medium">
                      <InstanceType
                        name={instance}
                        details={instanceDetails[instance]}
                      />
                    </TableCell>
                    {instances[instance]
                      .sort(comparePrices)
                      .slice(0, 5)
                      .map((item) => {
                        return (
                          <TableCell key={`${item.region}`}>
                            <span>
                              {isNaN(Number(item[os]))
                                ? "N/A"
                                : `$${item[os]}/h`}{" "}
                            </span>
                            <p className="text-muted-foreground">
                              {item.region}
                            </p>
                          </TableCell>
                        );
                      })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
