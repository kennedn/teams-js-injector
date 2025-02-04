"use strict";
var highlight_color = "#14897da0";
var highlight_color_lighter = "#14897d";
var highlight_color_links = "#1fd0be";
var rules = [
	// Hide Out of office messages, etc
	`.ui-alert {
		display: none !important;
	}`,
	// Fix message box border when ui-alert is trying to display
	`.fui-Primitive:has(> div[data-tid='simplified-formatting-toolbar']) {
		border-top-left-radius: 6px !important; 
		border-top-right-radius: 6px !important;
		border-top: 1px solid var(--colorNeutralStroke2) !important;
	}`, 
	// Sent chat message color
	`div.fui-ChatMyMessage__body {
		background-color: ${highlight_color} !important;
	}`,
	// Highlight unread messages in left pane
	`div[data-tid="chat-list-item"]:has(> .chatListItem_unreadIndicator) {
		background-color: ${highlight_color} !important; 
		border-radius: var(--borderRadiusMedium)!important;
	}`,
	// System colors
	`.fui-FluentProviderr0 {
		--colorNeutralForeground2BrandHover: ${highlight_color};
		--colorNeutralForeground2BrandPressed: ${highlight_color};
		--colorNeutralForeground2BrandSelected: ${highlight_color};
		--colorNeutralForeground3BrandHover: ${highlight_color};
		--colorNeutralForeground3BrandPressed: ${highlight_color};
		--colorNeutralForeground3BrandSelected: ${highlight_color_lighter};
		--colorBrandForegroundLink: ${highlight_color_links};
		--colorBrandForegroundLinkHover: ${highlight_color};
		--colorBrandForegroundLinkPressed: ${highlight_color};
		--colorBrandForegroundLinkSelected: ${highlight_color};
		--colorCompoundBrandForeground1: ${highlight_color};
		--colorCompoundBrandForeground1Hover: ${highlight_color};
		--colorCompoundBrandForeground1Pressed: ${highlight_color};
		--colorBrandForeground1: ${highlight_color};
		--colorBrandForeground2: ${highlight_color};
		--colorBrandForeground2Hover: ${highlight_color};
		--colorBrandForeground2Pressed: ${highlight_color};
		--colorNeutralForegroundOnBrand: white;
		--colorBrandForegroundInverted: ${highlight_color};
		--colorBrandForegroundInvertedHover: ${highlight_color};
		--colorBrandForegroundInvertedPressed: ${highlight_color};
		--colorBrandForegroundOnLight: ${highlight_color};
		--colorBrandForegroundOnLightHover: ${highlight_color};
		--colorBrandForegroundOnLightPressed: ${highlight_color};
		--colorBrandForegroundOnLightSelected: ${highlight_color};
		--colorBrandBackground: ${highlight_color};
		--colorBrandBackgroundHover: ${highlight_color};
		--colorBrandBackgroundPressed: ${highlight_color};
		--colorBrandBackgroundSelected: ${highlight_color};
		--colorCompoundBrandBackground: ${highlight_color};
		--colorCompoundBrandBackgroundHover: ${highlight_color};
		--colorCompoundBrandBackgroundPressed: ${highlight_color};
		--colorBrandBackgroundStatic: ${highlight_color};
		--colorBrandBackground2: ${highlight_color};
		--colorBrandBackground2Hover: ${highlight_color};
		--colorBrandBackground2Pressed: ${highlight_color};
		--colorBrandBackground3Static: ${highlight_color};
		--colorBrandBackground4Static: ${highlight_color};
		--colorBrandBackgroundInverted: ${highlight_color};
		--colorBrandBackgroundInvertedHover: ${highlight_color};
		--colorBrandBackgroundInvertedPressed: ${highlight_color};
		--colorBrandBackgroundInvertedSelected: ${highlight_color};
		--colorNeutralStrokeOnBrand: ${highlight_color};
		--colorNeutralStrokeOnBrand2: ${highlight_color};
		--colorNeutralStrokeOnBrand2Hover: ${highlight_color};
		--colorNeutralStrokeOnBrand2Pressed: ${highlight_color};
		--colorNeutralStrokeOnBrand2Selected: ${highlight_color};
		--colorBrandStroke1: ${highlight_color};
		--colorBrandStroke2: ${highlight_color};
		--colorBrandStroke2Hover: ${highlight_color};
		--colorBrandStroke2Pressed: ${highlight_color};
		--colorBrandStroke2Contrast: ${highlight_color};
		--colorCompoundBrandStroke: ${highlight_color};
		--colorCompoundBrandStrokeHover: ${highlight_color};
		--colorCompoundBrandStrokePressed: ${highlight_color};
		--colorTeamsBrand1Hover: ${highlight_color};
		--colorTeamsBrand1Pressed: ${highlight_color};
		--colorTeamsBrand1Selected: ${highlight_color};
	}`
];


function injectStyleSheet() {
	if (document == null) {return;}
	// remove old stylesheet if exist
	document.getElementById("teams-js-injector")?.remove();
	var sheet = (function() {
		var style = document.createElement("style");
		style.id = "teams-js-injector";
	    style.appendChild(document.createTextNode(""));
	    document.head.appendChild(style);
	    return style.sheet;
	})();
	rules.forEach(function(rule) {
		sheet.insertRule(rule, 0);
	});
}

var stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
	injectStyleSheet();
  }
}, 10);

  
