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
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var repo = JSON.parse(xmlhttp.responseText);
                    document.getElementById("version").innerHTML = 'v' + Object.keys(repo).length / 100;
                } else {
                }
            };
            xmlhttp.open('GET', 'https://api.github.com/repos/' + repo +'/commits?per_page=1000', true);            //Up to 1000
            xmlhttp.send();
        }
        _ajaxReq("LogCreative/PGFPlotsEdt");
    }
)();