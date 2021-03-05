(
    function(){
        function _ajaxReq(repo) {
            var xmlhttp;
            if (window.XMLHttpRequest) {
                //code for IE7,firefox chrome and above
                xmlhttp = new XMLHttpRequest();
            } else {
                //code for Internet Explorer
                xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            var mainver = 1;            // Manual Modification over the main ver.
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var repo = JSON.parse(xmlhttp.responseText);
                    document.getElementById("version").innerHTML = 'v' + (mainver + Object.keys(repo).length / 100).toFixed(2);
                } else {
                }
            };
            xmlhttp.open('GET', 'https://api.github.com/repos/' + repo +'/commits?per_page=100&page=' + (mainver + 1), true);            // Up to 100
            xmlhttp.send();
        }
        _ajaxReq("LogCreative/PGFPlotsEdt");
    }
)();