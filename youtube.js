async function process(e) {
	const action = e && e.detail && e.detail.actionName;
	if (action == "yt-user-activity") return;
	modifyElement(document.getElementById("subscriber-count"), FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#top-level-buttons yt-formatted-string", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#header-author .yt-formatted-string", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector("#more-replies yt-formatted-string", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#date>yt-formatted-string", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector("#thumbnail-attribution", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#metadata-line>span", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#vote-count-middle", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#owner-sub-count", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector(".view-count", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector(".count-text", FRAC_MODES.UNTRUNCATED_WHOLE);
}

setTimeout(() => {
	document.body.addEventListener("transitionend", process);
	window.addEventListener("yt-navigate-finish", process);
	window.addEventListener("yt-navigate-start", () => {
		document.location.reload();
	});
	window.addEventListener("scroll", () => setTimeout(process, 1271));
}, 600);
