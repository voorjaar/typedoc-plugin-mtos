import { Application, ParameterType, PageEvent, RendererEvent } from "typedoc";
import { writeFileSync } from "fs";
import { join } from "path";

export const pluginOptions = (app: Application) => ({
  options: () => ({
    outDir: app.options.getValue("out") as string | undefined,
    cdn: app.options.getValue("cdn") as boolean | string | undefined,
    cdnLink: app.options.getValue("cdnLink") as string | undefined,
  }),
});

export type PluginOptionsGetter = ReturnType<typeof pluginOptions>;
export type PluginOptions = ReturnType<PluginOptionsGetter["options"]>;

function injectMtoS(content: string) {
  const script = `<script src="../assets/mtos.js"></script>`;
  return content.replace(/(?=<\/head>)/, script);
}

function onPageRendered(this: PluginOptionsGetter, page: PageEvent) {
  if (!page.contents) return;
  page.contents = injectMtoS(page.contents);
}

function onRenderFinished(this: PluginOptionsGetter) {
  const options = this.options();

  if (options.cdn || options.cdnLink) return;

  const workingDir = process.cwd();
  const outDir = options.outDir || "./docs";

  writeFileSync(
    join(workingDir, outDir, "assets", "mtos.js"),
    "console.log(123)"
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

  const options = pluginOptions(app);

  app.renderer.on(PageEvent.END, onPageRendered.bind(options));
  app.renderer.once(RendererEvent.END, onRenderFinished.bind(options));
}
