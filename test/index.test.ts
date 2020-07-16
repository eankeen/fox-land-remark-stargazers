import remark from "remark";
import remarkStargazers from "../src";

interface Plugin {
	fn: any;
	options: {
		owner: string;
		repo: string;
	};
}

export function doRemark(input: string, plugins: Plugin[]): Promise<any> {
	let result = remark();
	for (const plugin of plugins) {
		result = result().use(plugin.fn, plugin.options);
	}
	return result.process(input);
}

const plugins = [
	{
		fn: remarkStargazers,
		options: {
			owner: "eankeen",
			repo: "sync-readme",
		},
	},
];

describe("work with files that have 'star chart'", () => {
	test("ensure it works normally", async () => {
		const input = "# Main Title\n\n## Star Chart\n\n## Conclusion\n";
		const output = `# Main Title

## Star Chart

[![Stargazers over time](https://starchart.cc/eankeen/sync-readme.svg)](https://starchart.cc/eankeen/sync-readme)

## Conclusion
`;

		const vfile = await doRemark(input, plugins);
		expect(output).toBe(vfile.contents);
	});

	test("ensure it works as last header", async () => {
		const input = "# Main Title\n\n## Star Chart\n";

		const output = `# Main Title

## Star Chart

[![Stargazers over time](https://starchart.cc/eankeen/sync-readme.svg)](https://starchart.cc/eankeen/sync-readme)
`;

		const vfile = await doRemark(input, plugins);
		expect(output).toBe(vfile.contents);
	});
});

describe("test on files without 'star chart'", () => {
	test("ensure it works no star chart heading", async () => {
		const input = "# Title";
		const output = `# Title

[![Stargazers over time](https://starchart.cc/eankeen/sync-readme.svg)](https://starchart.cc/eankeen/sync-readme)
`;

		const vfile = await doRemark(input, plugins);
		expect(output).toBe(vfile.contents);
	});

	test("ensure it works on a blank page", async () => {
		const input = "";
		const output = `# Title

[![Stargazers over time](https://starchart.cc/eankeen/sync-readme.svg)](https://starchart.cc/eankeen/sync-readme)
`;
		const vfile = await doRemark(input, plugins);
		expect(output).toBe(vfile.contents);
	});
});
