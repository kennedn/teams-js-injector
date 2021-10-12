"use strict";
let highlight_color = "#FF00554f";

let main_rules = [

		//Custom Highlight Color
		`.app-header-bar { background: ${highlight_color}; }`,
		`.app-bar button.app-bar-link.app-bar-selected { background-color: ${highlight_color}; background-image: none; }`,
		`.message-list-divider-text { color:  ${highlight_color}; }`,
		`.app-tabs .btn-default.app-tabs-selected, .app-tabs .icons-more.app-tabs-selected, .app-tabs .ts-tabs-chevron.app-tabs-selected { border-bottom-color: ${highlight_color}; color: ${highlight_color};}`,
		`.chat-style .self .message-actions-container, .chat-style .self .message-body { background: ${highlight_color};}`,
		`.app-header-bar .me-profile:hover, body.acc-keyboard-mode .app-header-bar .me-profile:focus {background-color: ${highlight_color}; }`,
		`.app-bar button:hover.app-bar-link.app-bar-selected, body.acc-keyboard-mode .app-bar button:focus.app-bar-link.app-bar-selected {background-color: ${highlight_color};}`,

		// Chat list resize
		"span.cle-preview.single-line-truncation { display: none; }",
        ".recipient-group-list-item.left-rail-item-hover { height: 2.8rem !important; }",
		".chat-list .profile-img-parent { width: 2rem; height: 2rem;}",
		".chat-list .profile-img-parent img { vertical-align: top !important;}",
		".left-rail-unread::before { top: 1.2rem !important; }",
		".ts-skype-status .status-icon { height: 2rem !important; }",
		".chat-list .recipient-group-list-item a.cle-item { grid-template-rows: 1rem 1rem !important; padding: .55rem 1.8rem 0 2rem; }",
        `a.cle-item.left-rail-unread.ts-unread-channel { background-color: rgb(255, 0, 85, 0.46); height: 2.8rem !important; }`,

        `.message-list-divider::before { border-top: 1px solid ${highlight_color} !important; }`,
        `.app-bar button.app-bar-link.app-bar-selected { color: white !important; }`,
        `.messages-header-v2 .app-chat-header .group-chat-recipients-button.selected, .messages-header-v2 .app-chat-header .group-chat-recipients-button:hover { background: ${highlight_color}; !important}`,
        `.app-chat-header .app-title-bar-button.icons-call, .ts-title-bar-team-header .app-title-bar-button.icons-call { background: transparent !important}`,
        `.app-chat-header .app-title-bar-button.icons-call, .ts-title-bar-team-header .app-title-bar-button.icons-call:hover { background: ${highlight_color}; !important}`,
        `.slash-submit-button:hover, .ts-title-bar-buttons .app-title-bar-button:hover { background: transparent !important}`,
        `.app-bar .app-bar-selected::before {border-left: solid .2rem ${highlight_color} !important; background: ${highlight_color} !important;}`
    ];
let webview_rules = [
        `.ui-alert {display: none !important;}`,
        `.ui-box  {margin-top: 0rem !important;}`,
        `.ms-FocusZone.ui-chat__message {padding-top: 0.6rem !important;}`,
        `.ui-box.ui-chat__item__message:first-child > .ui-box > .ms-FocusZone {background-color: ${highlight_color} !important;}`,
        `.ui-divider::before {background-color: rgb(61, 61, 61) !important;}`,
        `.ui-divider::after {background-color: rgb(61, 61, 61) !important;}`,
        `.ui-divider {color: ${highlight_color} !important;}`,
        `.ui-icon[id^="read-status-icon-"] {color: ${highlight_color} !important;}`,
        `li.ui-chat__item.ui-chat__item--message {padding-top: 0.6rem !important;}`,
        `.ui-box:focus-within {box-shadow: none !important;}`,
        `.vl-placeholder-bg2 {fill: ${highlight_color} !important;}`,
        `a {color: rgb(48, 117, 187) !important; font-weight: bold !important;}`
	];


function injectStyleSheet() {
	if (document == null) {return;}
	let sheet = (function() {
		var style = document.createElement("style")
	    style.appendChild(document.createTextNode(""))
	    document.head.appendChild(style)
	    return style.sheet
	})();
	if (document.title.includes("| Microsoft Teams")) {
		main_rules.forEach(function(rule) {
			sheet.insertRule(rule, 0)
		});
	} else {
		webview_rules.forEach(function(rule) {
			sheet.insertRule(rule, 0)
		});

	}
}

function observeAndFixIcons() {
	let iconObserver = new MutationObserver((mutations) => {
	  mutations.forEach((mutation) => {
	  	 if(mutation.attributeName != "src" && mutation.target.className == "media-object"){
	  	 	 let attr = mutation.target.getAttribute("src");
	  	 	 attr = attr.replace('&size=HR42x42','');
	  	 	 mutation.target.src = attr;
	  	 }
	  })
	})

	iconObserver.observe(document.body, {attributes: true, childList: true, characterData: false, subtree: true })
}

let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
	injectStyleSheet();
	observeAndFixIcons();
  }
}, 100);

  
