import remark from "remark";

export default function plugin({
	owner,
	repo,
}: {
	owner: string;
	repo: string;
}) {
	return function transform(ast: any, file: any) {
		const stargazerLink = {
			type: "link",
			url: `https://starchart.cc/${owner}/${repo}`,
			children: [
				{
					type: "image",
					url: `https://starchart.cc/${owner}/${repo}.svg`,
					alt: "Stargazers over time",
				},
			],
		};

		let hasBeenInserted = false;
		for (let i = 0; i < ast.children.length; ++i) {
			const node = ast.children[i];
			const nextNode = ast.children[i + 1];

			if (
				node.type === "heading" &&
				node.children?.[0]?.value === "Star Chart"
			) {
				// optional chaining used when
				// star chart is the last header
				if (nextNode?.type !== "text") {
					ast.children.splice(i + 1, 0, stargazerLink);
					hasBeenInserted = true;
				}
				break;
			}
		}

		if (!hasBeenInserted) {
			ast.children.push(stargazerLink);
		}
	};
}
