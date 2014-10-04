var savePnrLocalKey = 'trainManSavedPNRs';
var maxLocalPnrSave = 6;
var kPnrSplitString = '|||';

var pnrSearchJSObject = {

	changeToPNRDetailPage : function (pnrString) {
		if (!pnrString || pnrString == '') {
			var pnrTextField = $('#pnrInputBox').val();
			if (pnrTextField.length == 10) {
				pnrSearchJSObject.fetchPNRDetailWithPNR (pnrTextField);
				pnrSearchJSObject.savePNRInHistory({'pnrString' : pnrTextField});
			} else {
				// ERROR invalid Search
			}
		} else {
			pnrSearchJSObject.fetchPNRDetailWithPNR (pnrString);
			pnrSearchJSObject.savePNRInHistory({'pnrString' : pnrString});
		}	
	},

	changeToPNRTrendPage : function (pnrString) {
		$.mobile.changePage( "#pnrTrendingPage", { transition: "slide" } );
	},

	refillNewHistory : function () {
		var recentSearchesArray = pnrSearchJSObject.getArrayOfPNRObjsFromHistory();
		$('#recentSearchesTitleId').text('recent searches (' + recentSearchesArray.length + ')');

		// fillListView
		var containerToFill = $('#recentSearchesListContainerId');
		containerToFill.html('');
		for (var i = 0; i < recentSearchesArray.length; i++) {
			var currObject = recentSearchesArray[i];
			var appendString = '<li><a href="#" onclick="pnrSearchJSObject.changeToPNRDetailPage('+ currObject['pnrString'] +')" data-transition="slide"><h4>';
			appendString += currObject['pnrString'] + '</h4>';
			if (currObject['pnrFrom'] && currObject['pnrTo']) {
				appendString += '<label>' + currObject['pnrFrom'] +'    --     ' + currObject['pnrTo'] + '</label>';
			}
			if (currObject['pnrDate']) {
				appendString += '<label>'+ currObject['pnrDate'] +'</label>';
			}
			appendString += '</a></li>';
			containerToFill.append(appendString);
		}
		$('ul').listview('refresh');
	},

	savePNRInHistory : function (pnrObject) {
		var saveString = pnrObject['pnrString'];
		if (pnrObject['pnrFrom']) {
			saveString += '|' + pnrObject['pnrFrom']  + '|' + pnrObject['pnrTo'] + '|' + pnrObject['pnrDate']
		}

		var savedPNRs = localStorage.getItem(savePnrLocalKey);
		if (!savedPNRs || savedPNRs == '') {
			localStorage.setItem(savePnrLocalKey , saveString);
			return;
		}
		var pnrStrArray = savedPNRs.split(kPnrSplitString);

		// check if already exists
		for (var i = 0; i < pnrStrArray.length; i++) {
			var pnrNumberCurr = pnrStrArray[0].split('|')[0];
			if (pnrNumberCurr == pnrObject['pnrString']) {
				return; // dont save Already exists
			}
		}

		if (savedPNRs && savedPNRs != '') {

			var tempPnrStringNew = saveString + kPnrSplitString + savedPNRs;

			if (pnrStrArray.length > maxLocalPnrSave) {
				pnrSearchJSObject.checkAndSavePNRStr(tempPnrStringNew);
			} else {
				localStorage.setItem(savePnrLocalKey , tempPnrStringNew);
			}

		} else {
			localStorage.setItem(savePnrLocalKey , saveString);
		}
		pnrSearchJSObject.refillNewHistory();
	},

	fetchPNRDetailWithPNR : function(pnrString) {
		// fetch PNR detail here
		$.mobile.changePage( "#pnrDetailsPage", { transition: "slide" } );
	},

	checkAndSavePNRStr : function (newSavePNRString) {
		var pnrStrArray = newSavePNRString.split(kPnrSplitString);

		if (pnrStrArray.length > maxLocalPnrSave) {
			var newString = '';
			for (var i = 0; i < maxLocalPnrSave; i++) {
				newString += pnrStrArray[i] + kPnrSplitString; 
			}
		}
	},

	getArrayOfPNRObjsFromHistory : function () {
		var savedPNRs = localStorage.getItem(savePnrLocalKey);
		if (!savedPNRs || savedPNRs == '') {
			return [];
		}
		var pnrStrArray = savedPNRs.split(kPnrSplitString);
		var finalArray = [];
		for (var i = 0; i < pnrStrArray.length; i++) {
			var pnrLocalArray = pnrStrArray[i].split('|');
			var pnrObjectCurr = {};	
			if (pnrLocalArray[0]) {
				pnrObjectCurr['pnrString'] = pnrLocalArray[0];
			}
			if (pnrLocalArray[1]) {
				pnrObjectCurr['pnrFrom'] = pnrLocalArray[1];
			}
			if (pnrLocalArray[2]) {
				pnrObjectCurr['pnrTo'] = pnrLocalArray[2];
			}
			if (pnrLocalArray[3]) {
				pnrObjectCurr['pnrDate'] = pnrLocalArray[3];
			};
			finalArray[i] = pnrObjectCurr;
		}
		return finalArray;
	}
};

// Page Inits

$(document).on("pageinit","#pnrSearchPage", function() {
	pnrSearchJSObject.refillNewHistory();
});