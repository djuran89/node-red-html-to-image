"use strict";
module.exports = function (RED) {
	const html2canvas = require("html2canvas");

	function output(config) {
		const node = this;
		RED.nodes.createNode(this, config);

		node.on("input", async function (msg) {
			try {
				const html = config.html;
				const canvas = await html2canvas(html);
				const imageBase64 = canvas.toDataURL("image/png");

				msg.payload = imageBase64;
				node.status({});
				node.send(msg);
			} catch (err) {
				node.status({ fill: "red", shape: "dot", text: err });
				node.error(err, msg);
			}
		});
	}

	RED.nodes.registerType("html-2-image", output);
};
