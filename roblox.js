function process() {
	modifySelector(".rbx-game-server-status", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector(".game-favorite-count", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector(".playing-counts-label", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#nav-robux-balance", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector("#game-visit-count", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector(".vote-percentage-label", FRAC_MODES.PERCENTAGE);
	modifySelector(".date-time-i18n", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector("#nav-robux-amount", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#vote-down-text", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector(".notification", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector("#vote-up-text", FRAC_MODES.TRUNCATED_WHOLE);

	modifySelector(":nth-child(1)>.badge-stats-info", FRAC_MODES.PERCENTAGE);
	modifySelector(":nth-child(2)>.badge-stats-info", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector(":nth-child(3)>.badge-stats-info", FRAC_MODES.UNTRUNCATED_WHOLE);

	modifySelector(".game-stat:nth-child(1)>:last-child", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector(".game-stat:nth-child(2)>:last-child", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector(".game-stat:nth-child(3)>:last-child", FRAC_MODES.TRUNCATED_WHOLE);
	modifySelector(".game-stat:nth-child(4)>:last-child", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector(".game-stat:nth-child(5)>:last-child", FRAC_MODES.UNTRUNCATED_WHOLE);
	modifySelector(".game-stat:nth-child(6)>:last-child", FRAC_MODES.UNTRUNCATED_WHOLE);
	//document.getElementById("voting-section").style.width = "150px";
}
setTimeout(process, 1271);
window.addEventListener("scroll", () => setTimeout(process, 1271));
