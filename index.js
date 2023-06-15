"use strict";
module.exports = function (RED) {
	const puppeteer = require("puppeteer");

	function output(config) {
		const node = this;
		RED.nodes.createNode(this, config);

		node.on("input", async function (msg) {
			try {
				const html = config.html;
				const imageBase64 = await convertHtmlToImage(html);
				msg.payload = imageBase64;

				node.send(msg);
			} catch (err) {
				node.status({ fill: "red", shape: "dot", text: err });
				node.error(err, msg);
			}
		});
	}

	async function convertHtmlToImage(htmlString) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		// Set the viewport size as per your requirements
		await page.setViewport({ width: 800, height: 600 });

		// Set the HTML content
		await page.setContent(htmlString);

		// Take a screenshot of the page
		const screenshotBuffer = await page.screenshot({ type: "png" });

		// Close the browser
		await browser.close();

		// Convert the screenshot buffer to Base64
		const dataUrl = screenshotBuffer.toString("base64");

		return dataUrl;
	}

	RED.nodes.registerType("html-2-image", output);
};
