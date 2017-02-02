
if (false) {
	//load from DHIS2 server
	updateLS(cycles);
	console.log("Working online");
} else {
	console.log("Working offline");
}

var facilityId = getParameterFromURLByName("facility");
if (isUndefinedOrNull(facilityId)) navigateToAddress("index.html");

var facility = LS.getFacilityById(facilityId);
if (isUndefinedOrNull(facility)) navigateToAddress("index.html");

generateMainMenu(); //located in scripts.js

generateFacilityInfoSection();
generateListOfCurrentCycleForms(getCurrentCycle(facility));
generateListOfPreviousCycles(getPreviousCycles(facility));

function generateFacilityInfoSection() {
	$("#facility_title_header").text(getName(facility));
}

function generateListOfCurrentCycleForms(cycle) {
	
	$("#current_cycle_header").text("Current Cycle: " + getId(cycle))
	var forms = getForms(cycle);
	var pendingFormsCount = 0;
	for (var i = 0; i < forms.length; i++) {
		if (actionIsRequiredByUser(forms[i], allowedApproval("TEMP"))) {
			$("#pending_forms").append(getListElement(cycle, forms[i]));
			pendingFormsCount++;
		} else {
			$("#submitted_forms").append(getListElement(cycle, forms[i]));
		}
	}
	if (pendingFormsCount == 0) {
		$("#pending_forms").append("<br><p>Wohoo! All forms submitted for this cycle</p>");
	}
}

function generateListOfPreviousCycles(cycles) {
	for (var i = 0; i < cycles.length; i++) {
		var listElement = document.createElement("LI");
		var detailElement = document.createElement("DETAILS");
		var summaryElement = document.createElement("SUMMARY");
		$(summaryElement).text("2016: cycle " + getId(cycles[i]));
		$(detailElement).append(summaryElement);
		$(listElement).append(detailElement);
		$("#previous_cycles").append(listElement);
		//buildListOfForms("#previous_cycles"), 
		var forms = getForms(cycles[i]);
		for (var j = 0; j < forms.length; j++) {
			$(detailElement).append(getListElement(cycles[i], forms[j]));
		}
	}
}



function getListElement(cycle, form) {
	
	var listElement = document.createElement("LI");
	
	
	//cycle info
	var cycleEl = document.createElement("P");
	$(cycleEl).html('<i class="fa fa-circle-o-notch" aria-hidden="true"></i>' + "CYCLE 1");
	$(listElement).append(cycleEl);
	
	//status info
	var status = document.createElement("P");
	$(status).addClass("form_status");
	$(status).html('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>' + getStatusText(form));
	$(listElement).append(status);
	
	//form name
	var link = document.createElement("A");
	$(listElement).append(link);
	
	$(link).html('<i class="fa fa-file-text-o" aria-hidden="true"></i>' + getName(form));

	
	if (isCompleted(form)) {
		$(link).attr("href", "form_summary.html?facility=" + facilityId + "&cycle=" + getId(cycle) + "&form=" + getId(form));
	} else {
		$(link).attr("href", "form_overview.html?facility=" + facilityId + "&cycle=" + getId(cycle) + "&form=" + getId(form));
	}
	return listElement;
}
