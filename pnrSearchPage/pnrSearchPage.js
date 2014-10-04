var pnrSearchJSObject = {

	changeToPNRDetailPage : function (pnrString) {
		fetchPNRDetailWithPNR (pnrString);
	},

	changeToPNRTrendPage : function (pnrString) {
		$.mobile.changePage( "pnrTrendingPage", { transition: "slide" } );
	},

	refillNewHistory : function () {
		var recentSearchesArray = [];
		$.('#recentSearchesTitleId').text = 'recent searches (' + recentSearchesArray.length + ')';
	},

	savePNRInHistory : function (pnrString) {

	},

	fetchPNRDetailWithPNR : function(pnrString) {
		// fetch PNR detail here
		$.mobile.changePage( "pnrDetailsPage", { transition: "slide" } );
	}
};

// Page Inits

$(document).on("pageinit","#pnrSearchPage", function() {
	pnrSearchJSObject.refillNewHistory();
});