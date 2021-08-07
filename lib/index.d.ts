import { Options } from "svgo";
import { Plugin } from "vite";
export declare function createSvgPlugin(options?: {
    svgoConfig?: Options;
}): Plugin;
