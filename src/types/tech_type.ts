import { StaticImageData } from "next/image";

export interface Techitem {
    name: string;
    icon: StaticImageData;
    tags: string[];
}