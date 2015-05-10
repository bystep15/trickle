(function (global, document) {
    'use strict';
    var navDescriptions = {
        type: {
            name: "Type",
            description: "The type of navigation that occurred: navigate, reload, back/foward."
        },
        redirectCount: {
            name: "Redirected count",
            description: "The number of redirections encountered to load the root document."
        }
    };
    var timingDescriptions = {
        navigationStart: {
            name: "Navigation Start",
            description: "The UTC time (ms) the user initiates navigation."
        },
        fetchStart: {
            name: "Fetch Start",
            description: "The UTC time (ms) the browser began fetching the root document."
        },
        unloadEventStart: {
            name: "onunload event start",
            description: "The UTC time (ms) when the onunload event fired."
        },
        unloadEventEnd: {
            name: "onunload event end",
            description: "The UTC time (ms) when the onunload event completed."
        },
        redirectStart: {
            name: "Redirect start",
            description: "The UTC time (ms) of the first http redirection."
        },
        redirectEnd: {
            name: "Redirect end",
            description: "The UTC time (ms) of the last http redirection."
        },
        domainLookupStart: {
            name: "Domain name lookup start",
            description: "The UTC time (ms) the first DNS lookup was initiated for the root document."
        },
        domainLookupEnd: {
            name: "Domain name lookup end",
            description: "The UTC time (ms) the first DNS lookup completed for the root document."
        },
        connectStart: {
            name: "TCP connection start",
            description: "The UTC time (ms) the first TCP connection was initiated for the root document."
        },
        connectEnd: {
            name: "TCP connection end",
            description: "The UTC time (ms) the first TCP connection completed for the root document."
        },
        requestStart: {
            name: "Request start",
            description: "The UTC time (ms) the request was initiated for the root document."
        },
        responseStart: {
            name: "Response start",
            description: "The UTC time (ms) the response body was initiated for the root document."
        },
        responseEnd: {
            name: "Response end",
            description: "The UTC time (ms) the response body completed for the root document."
        },
        domLoading: {
            name: "DOM loading",
            description: "The UTC time (ms) the onreadystate change transitioned to domLoading."
        },
        domInteractive: {
            name: "DOM interactive",
            description: "The UTC time (ms) the onreadystate change transitioned to domInteractive."
        },
        domComplete: {
            name: "DOM complete",
            description: "The UTC time (ms) the onreadystatechange transitioned to domComplete."
        },
        loadEventStart: {
            name: "onload event start",
            description: "The UTC time (ms) the onload event fired."
        },
        loadEventEnd: {
            name: "onload event end",
            description: "The UTC time (ms) the onload event completed."
        }
    };
    if (global.performance.timing.domContentLoadedEventStart !== undefined) {
        timingDescriptions.domContentLoadedEventStart = {
            name: "DomContentLoadedEventStart",
            description: "The UTC time (ms) the onreadystate change transitioned to domContentLoaded."
        };
        timingDescriptions.domContentLoadedEventEnd = {
            name: "DomContentLoadedEventEnd",
            description: "The UTC time (ms) domContentLoaded event completed."
        };
    } else {
        timingDescriptions.domContentLoaded = {
            name: "DomContentLoaded",
            description: "The UTC time (ms) the onreadystate change transitioned to domContentLoaded."
        };
    }
    var measureDescriptions = {
        navigation: {
            name: "Navigation",
            description: "The time taken from when the user initiates a navigation action to when the onload event completes."
        },
        unloadEvent: {
            name: "onUnload",
            description: "The time taken to execute the unload event handler of the previous navigation."
        },
        redirect: {
            name: "Redirect",
            description: "The time taken to redirect to the current navigation."
        },
        domainLookup: {
            name: "Domain name lookup",
            description: "The time taken to resolve the DNS of the root document."
        },
        connect: {
            name: "Connect",
            description: "The time taken to make the first TCP connection."
        },
        request: {
            name: "Request",
            description: "The time taken to make the request for the root document."
        },
        response: {
            name: "Response",
            description: "The time taken to receieve the response body of the root document."
        },
        domLoading: {
            name: "DOM loading",
            description: "The time taken from when the onreadystate change transitions from domLoading to domInteractive."
        },
        domInteractive: {
            name: "DOM interactive",
            description: "The time taken from when the onreadystate change transitions from domInteractive to domContentLoaded."
        },
        domContentLoaded: {
            name: "DomContentLoaded",
            description: "The time taken to execute the domContentloaded handler."
        },
        domComplete: {
            name: "DOM complete",
            description: "The time taken from when the onreadystate change transitions from domLoading to domComplete."
        },
        loadEvent: {
            name: "onLoad",
            description: "The time taken to begin and complete the onload event for the root document"
        },
        fetch: {
            name: "Fetch",
            description: "The time taken from fetchStart to loadEnd, this is the time taken to fetch and load the root document."},
        firstPaint: {
            name: "First Paint",
            description: "The time taken from when the user initiates navigation to when website content was first painted to the screen."
        }
    };


    function displayToolTip(title, result, id) {
        var tt = document.getElementById("dispTooltip");
        tt.style.display = "block";

        if (global.event.type == "mouseover") {
            tt.style.top = (global.event.clientY - 82) + "px";
            tt.style.left = global.event.clientX + "px";
        }
        else {
            var rect = document.getElementById(id).getBoundingClientRect();
            tt.style.top = (rect.top - 65) + "px";
            tt.style.left = (rect.right + 2) + "px";
        }

        var spantitle = document.getElementById("tooltip_title");
        spantitle.innerHTML = title + "</br>";

        var spancont = document.getElementById("tooltip_content");
        spancont.innerHTML = result;
    }

    global.descripHandler = function (elem) {
        var name = elem.id;
        var type = elem.getAttribute('data-type');
        var result = "";
        var title = "",
            description;

        switch (type) {
            case "timingMeasures":
                description = measureDescriptions[name];
                break;
            case 'WebkitPerformanceTiming':
            case 'MsPerformanceTiming':
            case 'PerformanceTiming':
                description = timingDescriptions[name];
                break;
            case "WebkitPerformanceNavigation":
            case "MsPerformanceNavigation":
            case "PerformanceNavigation":
                description = navDescriptions[name];
                break;
        }

        if (!description) {
            return;
        }

        title = description.name;
        result = description.description;

        displayToolTip(title, result, name);
    }

    global.closeDescrip = function () {
        var tt = document.getElementById("dispTooltip");
        tt.style.display = "none";
    }

}(this, this.document));
