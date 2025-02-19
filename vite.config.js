import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
				usePolling: true
		},
	},
	resolve: {
		alias: {
				"@": path.resolve(__dirname, "./src"),
		},
	},
	css: {
	preprocessorOptions: {
		scss: {
			api: "modern-compiler",
			silenceDeprecations: ["legacy-js-api", "mixed-decls", "color-functions"],
		},
	}
	},
	build: {
	rollupOptions: {
		onwarn(warning, warn) {
			if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
				return;
			}
			warn(warning);
		},
	},
	},
});
