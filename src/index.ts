import { Application, PageEvent, ParameterType, RendererEvent } from "typedoc";
import { basename, join, relative } from "path";

import { copyFileSync, writeFileSync } from "fs";

export const pluginOptions = (app: Application) => ({
  options: () => ({
    outDir: app.options.getValue("out") as string | undefined,
    cdn: app.options.getValue("cdn") as boolean | string | undefined,
    cdnLink: app.options.getValue("cdnLink") as string | undefined,
    customJs: app.options.getValue("customJs") as string | undefined,
    customStyle: app.options.getValue("customStyle") as string | undefined,
    customScript: app.options.getValue("customScript") as string | undefined,
  }),
});

export type PluginOptionsGetter = ReturnType<typeof pluginOptions>;
export type PluginOptions = ReturnType<PluginOptionsGetter["options"]>;

function injectMtoS(content: string, link: string, ...others: string[]) {
  const script = `<script src="${link}"></script>` + others.join("");
  return content.replace(/(?=<\/head>)/, script);
}

function onPageRendered(this: PluginOptionsGetter, page: PageEvent) {
  const options = this.options();

  if (!page.contents) return;

  const others: string[] = [];
  if (options.customJs) others.push(`<script src="${relative(page.url, "assets").slice(3)}/${basename(options.customJs)}"></script>`);
  if (options.customStyle) others.push(`<style>${options.customStyle}</style>`);
  if (options.customScript) others.push(`<script>${options.customScript}</script>`);

  page.contents = injectMtoS(page.contents, options.cdnLink || (options.cdn ? __mtosCDN__ : `${relative(page.url, "assets").slice(3)}/mtos.js`), ...others);
}

function onRenderFinished(this: PluginOptionsGetter) {
  const options = this.options();
  const workingDir = process.cwd();
  const outDir = options.outDir || "./docs";

  if (options.customJs) copyFileSync(options.customJs, join(workingDir, outDir, "assets", basename(options.customJs)))

  if (options.cdn || options.cdnLink) return;

  writeFileSync(
    join(workingDir, outDir, "assets", "mtos.js"),
    __mtos__,
  );
}

export function load(app: Application) {
  app.options.addDeclaration({
    name: "cdn",
    help: "MtoS Plugin: Use mtos CDN Link instead of using static script.",
    type: ParameterType.Boolean,
    defaultValue: false,
  });

  app.options.addDeclaration({
    name: "cdnLink",
    help: "MtoS Plugin: Specify the CDN Link of mtos.",
    type: ParameterType.String,
    defaultValue: undefined,
  });

  app.options.addDeclaration({
    name: "customJs",
    help: "MtoS Plugin: Path to a custom JS file to for the script to import.",
    type: ParameterType.String,
    defaultValue: undefined,
  });

  app.options.addDeclaration({
    name: "customStyle",
    help: "MtoS Plugin: Add custom css content to document head.",
    type: ParameterType.String,
    defaultValue: undefined,
  });

  app.options.addDeclaration({
    name: "customScript",
    help: "MtoS Plugin: Add custom script content to document head.",
    type: ParameterType.String,
    defaultValue: undefined,
  });

  const options = pluginOptions(app);

  app.renderer.on(PageEvent.END, onPageRendered.bind(options));
  app.renderer.once(RendererEvent.END, onRenderFinished.bind(options));
}
