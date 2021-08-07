import { readFileSync } from "fs";
import { basename } from "path";
import SVGO, { Options } from "svgo";
import { Plugin } from "vite";
import { compileTemplate, parse } from "@vue/component-compiler-utils";
import * as compiler from "vue-template-compiler";

function compileSvg(svg: any, id: string): string {
  const template = parse({
    source: `
      <template>
        ${svg}
      </template>
    `,
    compiler: compiler as any,
    filename: `${basename(id)}.vue`,
  }).template;

  if (!template) return "";

  const result = compileTemplate({
    compiler: compiler as any,
    source: template.content,
    filename: `${basename(id)}.vue`,
  });

  return `
    ${result.code}
    export default {
      render: render,    
    }
  `;
}

async function optimizeSvg(svgo: SVGO, content: string, path: string) {
  const { data } = await svgo.optimize(content, {
    path,
  });

  return data;
}

export function createSvgPlugin(
  options: {
    svgoConfig?: Options;
  } = {},
): Plugin {
  const { svgoConfig } = options;
  const svgo = new SVGO(svgoConfig);
  const svgRegex = /(^.*?\.svg)(\?.*)?$/;

  return {
    name: "vite-plugin-vue2-svg",
    async transform(_source: string, id: string) {
      const match = id.match(svgRegex);
      if (match) {
        const code: string = readFileSync(match[1], { encoding: "utf-8" });
        const svg = await optimizeSvg(svgo, code, match[1]);
        if (!svg)
          throw new Error(`[vite-plugin-vue2-svg] fail to compile ${match[1]}`);
        const result = compileSvg(svg, match[1]);

        return result;
      }
      return null;
    },
  };
}
