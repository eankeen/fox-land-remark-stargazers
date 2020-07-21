import remark from "remark";
import remarkInsert from "@fox-land/remark-insert";

export interface IRemarkStarChart {
	owner: string;
	repo: string;
}

export default function remarkStarchart({ owner, repo }: IRemarkStarChart) {
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

	return remarkInsert({
		headingText: "Star Chart",
		headingDepth: 2,
		insertionAst: stargazerLink,
	});
}
