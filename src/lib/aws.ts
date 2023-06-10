import { AWS_PRICE_DATA, AWS_SPOT_ADVISOR_DATA } from "@/constants";

export type AWSPrice = {
  name: "linux" | "mswin";
  prices: {
    [key: string]: string;
  };
};

export type AWSInstanceSizePrice = {
  size: string;
  valueColumns: AWSPrice[];
};

export type AWSInstanceType = {
  type: string;
  sizes: AWSInstanceSizePrice[];
};

export type AWSRegion = {
  region: string;
  instanceTypes: AWSInstanceType[];
};

export type AWSSpotData = {
  vers: string;
  config: {
    rate: string;
    valueColumns: string[];
    currencies: string[];
    regions: AWSRegion[];
  };
};

export type AWSInstanceDetails = {
  cores: number;
  ram_gb: number;
  emr: boolean;
};

export type AWSInstanceDetailsMapping = {
  [name: string]: AWSInstanceDetails;
};

export const loadPrices = (handler: (value: any) => void) => {
  (window as any).callback = handler;
  const el = document.createElement("script");
  el.src = `${AWS_PRICE_DATA}?callback=callbacks&_=${Date.now()}`;
  document.body.appendChild(el);
};

export const getSpotAdvisorData = async (handler: (value: any) => void) => {
  const response = await fetch(AWS_SPOT_ADVISOR_DATA);
  const jsonData = await response.json();
  handler(jsonData);
};
