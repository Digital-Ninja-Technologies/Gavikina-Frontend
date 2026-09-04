import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
	resolve: {
		tsconfigPaths: true,
		dedupe: ["react", "react-dom"],
	},
	ssr: {
		noExternal:
			command === "build"
				? true
				: ["@workspace/ui", "@workspace/engine", "@workspace/schemas"],
	},
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackStart(),
		nitro(),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
}));
