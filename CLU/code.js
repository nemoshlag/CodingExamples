/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var result;
var threeResults = null;
var count = 0;
var resultsInString = null;
var length = 0;
var value = null;
var image = null;
var carousels = {};
var history;
var firstTap = true;
var removedItem = 0;
var numberOfSearch = 0;
var firstTime = true;

//$("mainPage").before(function() {
//        $(".mainLoader").fadeIn("slow");
//    }
//);

$("mainSearch").click(function() {
    var myvalue = $("mainSearch").val();
    if (myvalue !== undefined) {
        getCLU($(this).val());
        $(".loader").fadeIn("slow");
    }
});
$(document).on('keydown', '#mainSearch', function(noa) {
    if (noa.keyCode === 13) {
        getCLU($(this).val());
        $(".loader").fadeIn("slow");
    }
});

$(document).on('keydown', '#resultSearch', function(noa) {
//    console.log(e);
    if (noa.keyCode === 13) {
        getCLU($(this).val());
        $("#resultContentForm").show();
        $(".loader").fadeIn("slow");
    }
});

$("#resultSearch").focusin(function(){
     console.log("in");
  $("#resultContentForm").hide();
   $('#lineup').css({
        "top": "60%"
    });
});
$("#resultSearch").focusout(function(){
     console.log("out");
  $("#resultContentForm").show();
  $('#lineup').css({
        "top": "70%"
    });
});

/**
 * 
 * @param inputValue - Get the value from the user
 * @ build the 
 */
function getCLU(inputValue) {
    
    value = inputValue;
    console.log("getCLu : " + value);
    console.log(screen.height);
    // valid that value isn't null
    if (value === "") {
        console.log("value cant be null");
    } else {
        $(".loader").fadeIn("slow");
        // replace space to underline
        if (value.search(" ") !== -1) {
            value.replace(" ", "_");
        }
        // send value to server
        sendValueToServer(value);
        // alert("idan");
        build();

        // use to test locally 
        /**
         result = localSend(value);
         other = JSON.parse(JSON.stringify(result));
         threeRes = cutResults(other);
         buildPage(threeRes);
         **/

    }
}
function sendValueToServer(value) {
    console.log("Get Clue About " + value);
    $.ajax({
        type: "GET",
        url: 'http://noanimrodidan.milab.idc.ac.il/index.php?q=' + value})
            .done(function(response) {
                console.log(response);
                $(".loader").fadeOut("slow");
                //document.getElementById('resultPage').focus();
                var incomeResults = JSON.parse(response);
                result = JSON.parse(response);
                // valid that the results isn't null
                if (incomeResults === null) {
                    console.log("no results");
                } else {

                    // if not null - build the page 
                    length = incomeResults.results.length;
                    resultsInString = JSON.parse(JSON.stringify(incomeResults));
                    threeResults = cutResults(resultsInString);
                    image = incomeResults.imageURL;
                    history[numberOfSearch] = value;
                    numberOfSearch++;
                    console.log(history);
                }
                return false;
            });
}

function build() {
    $(document).ajaxStop(function() {
        buildPage(resultsInString, image);
    });
    // $.when(sendValueToServer).done(buildPage(resultsInString, image));
}

/**
 * Open the input value in wikipedia
 * @param {type} value
 * @returns {undefined}
 */
function goToWiki() {
    window.open("http://en.wikipedia.org/wiki/" + getInputValue(), "_self");
}

function getInputValue() {
    //console.log(result.results.searchValue);
    return value;
}

/**
 * 
 * @param {type} results
 * @param {type} image
 * @returns {undefined}
 */
function buildPage(results, image)
{
    $.mobile.changePage('#resultPage');
    $("#resultContentForm").empty();
    count = 0;
    numberOfSearch = 0;
    removedItem = 0;
    $('#resultSearch').val(getInputValue());
    $('#resultImages').css({"background-image": "url" + "(" + image + ")", "background-repeat": "no-repeat", "background-size": "100% 100%"});
    showOnlyValue();
    var incomeResults = results;
    if (incomeResults !== null)
    {
        for (var i = 0; i < 3; i++) {
            addElement(i);
        }
        console.log("count" + count);
    }
    $('#resultPage').html();
    $('#resultPage').trigger("create");//refreashing dynamically
    $('#resultPage a').on('click', function(e) {
        e.preventDefault();
    });
}
;

function getContext(i) {
    if (firstTap) {
        $('#lineup').html("<b>" + setUpper(result.results[i].value) + "</b><br>" + result.results[i].context).css({"font-family": "'Lato' sans-serif", "font-size": "100%"});
        $('#lineup').css({top: '60%'});
        $('#lineup').animate({height: '40%'});
        $('#lineup').attr("onClick", "showOnlyValue()");
        firstTap = !firstTap;
    } else {
        $('#lineup').attr("onClick", "showOnlyValue()");
        firstTap = !firstTap;
        showOnlyValue();
    }
}

function showOnlyValue() {
    $('#lineup').css({
        "color": "white",
        "font-size": "2em",
        "background-color": "black",
        "opacity": "0.8",
        "height": "20%",
        "width": "100%",
        "bottom": "0px",
        "position": "relative",
        "top": "80%",
        "text-align":"left"
    });
    $('#lineup').text(setUpper(getInputValue()));
    var action = "onclick()";
    if ($('#lineup').attr("onclick") === action) {
        $('#lineup').removeAttribute("onclick");
    }
}

function cutResults(res) {
    var newRes = res;
    newRes.results = newRes.results.splice(0, 3);
    return newRes;
}

function removeFromList(el) {
    $(el).remove();
    removedItem++;
    $('#resultPage').trigger("refresh");
}

function randomPage() {
    $(".loader").fadeIn("slow"); 
    var holder = document.getElementById("resultContentForm");
    console.log("Get Random Clue");
    value = "randomValue";
    $.ajax({
        type: "GET",
        url: 'http://noanimrodidan.milab.idc.ac.il/index.php?q=' + value})
            .done(function(response) {
                console.log(response);
        $(".loader").fadeOut("slow");
                var incomeResults = JSON.parse(response);
                result = JSON.parse(response);
                // valid that the results isn't null
                if (incomeResults === null) {
                    console.log("no results");
                } else {

                    // if not null - build the page 
                    length = incomeResults.results.length;
                    resultsInString = JSON.parse(JSON.stringify(incomeResults));
                    threeResults = cutResults(resultsInString);
                    image = incomeResults.imageURL;
                    value = incomeResults.searchValue;
                    //value.replace(" ", "_");
                    history[numberOfSearch] = value;
                    numberOfSearch++;
                    console.log(history);
                    build();
                }
                return false;
            });
}

function startOver() {
    $(".loader").fadeIn("slow"); 
    var holder = document.getElementById("resultContentForm");
    $(holder).css({"text-align": "center", "background": "white", "margin-top": "0%", "width": "100%", "margin-left": "0%", "font-size": "100%"});
    index = 0;
    count = 0;
    getCLU(getInputValue());
}

function getAnotherValue(toRemove) {
    // no more words to show
//    if (count == length-1) {
    if (count == 6) {
        if (removedItem == 5) {
            removeFromList(toRemove);
            addWikiElement();
        } else {
            removeFromList(toRemove);
        }
    } else {
        console.log("this" + $(this).value);
        removeFromList(toRemove);
        addElement(count);
    }
}

function addElement(nextSeq) {
    var holder = document.getElementById("resultContentForm");
    $(holder).append("<div id=\carousel" + nextSeq + ">" + "</div>");
    var resultsList = document.getElementById("carousel" + nextSeq);
    $(resultsList).css({"width": "100%","height": "33.3%"});
    $(resultsList).append("<ul id=\listBricks" + nextSeq + ">");
    $("#listBricks" + nextSeq).css({"width": "relative","height": "100%"});
    $("#listBricks" + nextSeq).css({"text-align": "center", "border": "solid 1px grey"});
    var resultsList2 = document.getElementById("listBricks" + nextSeq);
    $(resultsList2).append("<li id=\"pane1\">Get New CLUE</li>");
    $("#listBricks" + nextSeq + " > " + "#pane1").css({"background": "#4ab8eb", "background-position": "right", "background-image": "url(searchListItem.png)", "background-repeat": "no-repeat", "background-size": " 20% 100%", "height": "100%", "font-weight": "bold", "font-style": "italic", "font-size": "150%"});
    $(resultsList2).append("<li id=\"pane2\"><a>" + setUpper(result.results[nextSeq].value) + "</a></li>");
    $("#listBricks" + nextSeq + " > " + "#pane2").css({"margin-top": "0.5em", "height": "100%", "color": "grey", "font-style": "italic", "font-size": "150%", "font-family": "'Lato', sans-serif"});
    $(resultsList2).append("<li id=\"pane3\">Throw This CLUE</li>");
    $("#listBricks" + nextSeq + " > " + "#pane3").css({"background": "#fc344c", "background-image": "url(delListItemRed.png)", "background-repeat": "no-repeat", "background-size": "20% 100%", "height": "100%", "font-weight": "bold", "font-style": "italic", "font-size": "150%"});
    $(resultsList).append("</ul>");
    $("#listBricks" + nextSeq).css({"padding-left": "0em"});
    carousels[nextSeq] = new Carousel("#carousel" + nextSeq);
    carousels[nextSeq].init();
    console.log("next number " + nextSeq);
    count++;
}

function addWikiElement() {
    $('#lineup').html("<p id=\"resultText\"> <span> Didn't Get a Clue?!</span></p>").css({"font-size": "100%", "position": "absolute", "text-align": "center"});
    $('#lineup').css({top: "0%", "font-family": "'Lato', sans-serif"});
    $('#lineup').animate({height: "100%"});
    var holder = document.getElementById("resultContentForm");
    $(holder).append("<div id=\"random\" onClick=\"randomPage()\">" + "Get Random Clue" + "</div>");
    $('#random').css({"text-align": "center", "background": "#fc344c", "margin": "20% 0em 0em 16%", "height": "10%", "width": "67%", "font-size": "1.5em", "color": "white", "font-family": "'Lato', sans-serif","position":"fixed"});
    $(holder).append("<div id=\"startOver\" onClick=\"startOver()\">" + "Start Over" + "</div>");
    $('#startOver').css({"text-align": "center", "background": "#29cbd5", "margin": "2% 0em 0em 16%", "height": "10%", "width": "67%", "font-size": "1.5em", "color": "white", "font-family": "'Lato', sans-serif","position":"fixed"});
    $('#lineup span').css({"font-size": "2.5em"});
}

function parseFromString(value) {
    var parsedNumber;
    console.log(value.length);
    for (var i = 0; i < value.length; i++) {
        parsedNumber = Number(new String(value.charAt(i)));
        console.log("pasre: " + parsedNumber + isNaN(parsedNumber));
        if (!(isNaN(parsedNumber))) {
            return parsedNumber;
        }
    }
}

function setUpper(str) {
    var len = str.length;
    var res = str[0].toUpperCase() + str.substring(1, len);
    return res;
}

function readMore() {
    if (firstTime) {
        $('#aboutContentForm').append("<p id=\"readMoreText\" onClick=\"closeText()\">" + "People surf the Net not only for fun, but also to discover and learn.<br> Serendipitous learning recognizes that search for knowledge may occur by chance, or as a by-product of the main task.<br> Knowledge retention as a result of serendipitous learning tends to be high, because motivation remains with the learner. It is a new way of learning that requires relatively low effort with a high payoff. Serendipitous learning can also make you gain new insights or interesting associations for our entrees and purchase a wide knowledge about any field.When you enter a term in CLU you will get a result page which presents you a picture and 3 key-words designed as building bricks that explain and describe the term you entered. By clicking on one of the key-words you can see the context to term or get an explanation about that word. The interface design in a fun, playful and simple way which made especially for the human eye. Clue's purpose is to make it easier for you to search for knowledge and for sure a lot more fun!" + "</p>");
        $('#readMoreText').css({"color": "grey", "font-weight": "bold", "margin-left": "5%", "font-family": "'Lato', sans-serif"});
         firstTime = false;
    } else {
  $('#readMoreText').remove();
    firstTime = true;
    }
}

$("#mainSearch").autocomplete({
    source: function(request, response) {
        console.log(request.term);
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
            }
        });
    }
});

$("#resultSearch").autocomplete({
    source: function(request, response) {
        console.log(request.term);
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php",
            dataType: "jsonp",
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
                
            }
        });
    }
});

function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 
 ){
 console.log(navigator.userAgent);
    return true;
  }
 else {
     console.log(navigator.userAgent);
    return false;
  }
}

$("#tutorialPage").ready(function(){
    $("#tutorialStepTitle").text("Swipe left on the image to go on");
    $("#tutorialStepTitle").css({"font-size":"1em","color":"rgb(11,191,179)","font-weight": "bold", "margin-left": "12%", "font-family": "'Lato', sans-serif"});
        $('#tutorialContentImage').css({"background-image": "url(tut1.jpg)", "background-repeat": "no-repeat", "background-size": "100% 100%"});

    //$('#tutorialPage').css({"background-image": "url(tut1.jpg)", "background-repeat": "no-repeat", "background-size": "100% 100%"});
   // $('#tutorialContentImage').css({"background-image": "url(tut1.jpg)", "background-repeat": "no-repeat", "background-size": "100% 100%"});
});

$("#tutorialContentImage").on("swiperight",function(){
        console.log("right");
        var currentBackground = $('#tutorialContentImage').css('background-image');
        console.log(currentBackground);
            var secondTut = "tut2.jpg";
            var thirdTut = "tut3.jpg";
    if (currentBackground.indexOf(thirdTut) > -1) {
    $('#tutorialContentImage').css({"background-image": "url(tut2.jpg)", "background-repeat": "no-repeat", "background-size": "100% 100%"});
    $("#tutorialStepTitle").text("Swipe right on the image to go on or left to go back");
    }else if (currentBackground.indexOf(secondTut) > -1){
            $('#tutorialContentImage').css({"background-image": "url(tut1.jpg)", "background-repeat": "no-repeat", "background-size": "100% 100%"});
        $("#tutorialStepTitle").text("swipe left on the image to go on");

    }
});

$("#tutorialContentImage").on("swipeleft",function(){
    console.log("left");
            var currentBackground = $('#tutorialContentImage').css('background-image');
    console.log(currentBackground);
            var firstTut = "tut1.jpg";
            var secondTut = "tut2.jpg";
            var thirdTut = "tut3.jpg";
            if (currentBackground.indexOf(firstTut) > -1) {
            console.log("first");
    $('#tutorialContentImage').css({"background-image": "url(tut2.jpg)", "background-repeat": "no-repeat", "background-size": "100% 100%"});
        $("#tutorialStepTitle").text("Swipe left on the image to go on or right to go back");
    }else if (currentBackground.indexOf(secondTut) > -1){
            $('#tutorialContentImage').css({"background-image": "url(tut3.jpg)", "background-repeat": "no-repeat", "background-size": "100% 100%"});
        $("#tutorialStepTitle").text("Swipe left on the image to go to menu or right to go back");
    }else if(currentBackground.indexOf(thirdTut) > -1){
            $.mobile.changePage('#mainPage');
        }
});

