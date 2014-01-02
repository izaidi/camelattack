function showVideo(videoid) {
	$('.ui-hint').hide();
    video = true;
    videoDiv = $('<div id="video"><iframe width="853" height="480" src="http://www.youtube.com/embed/' + videoid + '" frameborder="0" allowfullscreen></iframe></div>');
    videoDiv.insertAfter('#video-bg');
    $('#video-bg').fadeIn(600, function () {
        var top = ($(window).height() - 480) / 2;
        var left = ($(window).width() - 853) / 2;
        $('#video').css({
            'top': top + 'px',
            'left': left + 'px'
        });
        $('#video').show();
    });
}

function hideVideo() {
    videoDiv = $('#video');
    videoDiv.remove();
    videoHidden = true;
    $('#video-bg').fadeOut(600);
    video = false;
}

function moveImage() {
    x_offset -= x_delta;
    y_offset -= y_delta;

    if (y_offset > topLim) {
        y_offset = topLim;
    }
    if (y_offset < bottomLim) {
        y_offset = bottomLim;
    }
    if (x_offset > leftLim) {
        x_offset = leftLim;
    }
    if (x_offset < rightLim) {
        x_offset = rightLim;
    }

    console.log('x offset');
    console.log(x_offset);
    console.log('y offset');
    console.log(y_offset);

    $("#layout").stop();
    $("#layout").animate({
        top: (y_offset) + "px",
        left: (x_offset) + "px"
    }, {
        duration: 2000,
        complete: moveImage,
        queue: false
    });

	if (!startedMoving) {
		startedMoving = true;
		if (moveHintShown) {
            $('#click-hint').fadeOut(200);
        }
	}

    if (!clickHintShown) {
        setTimeout(function () {
            if (!clickHintShown && !video) {
				$('#click-hint').html(hintHtml);
				$('#click-hint').removeClass('move-hint');
                $('#click-hint').fadeIn(300);
                clickHintShown = true;
                setTimeout(function () {
                    $('#click-hint').fadeOut(200);
                }, 10000);
            }
        }, 3000);
    }
}

function getDistance(x1, y1, x2, y2) {
    var dist = Math.sqrt(Math.pow(y1 - y2, 2) + Math.pow(x1 - x2, 2));
    return dist;
}

function stopMove(desiredDistance) {
    $('#layout').stop();
    active = false;
    start_x = smouse_x;
    start_y = smouse_y;
    restartDistance = desiredDistance;
}

$(document).ready(function () {
	isMobile = false;
	if ($('#mobile-detector').is(":visible")) {
		isMobile = true;
	}
	
	$('#video-bg').click(function () {
        hideVideo();
    });

    $('#video').click(function () {
        hideVideo();
    });

	w = $(window).width();
    h = $(window).height();
    img_w = 2558;
    img_h = 1847;
    x_offset = (w - img_w) / 2;
    y_offset = (h - img_h) / 2;

	// set click events on videos
	$('.video').each(function() {
		var videoId = this.id;
		if (isMobile) {
			$(this).attr('href', 'http://www.youtube.com/watch?v=' + videoId);
		} else {
			$(this).click(function() {
				showVideo(videoId);
			});
		}
	});

	if (!isMobile) {
		jQuery.easing.def = "linear";

	    $('#layout').offset({
	        top: y_offset,
	        left: x_offset
	    });

	    $('#shadow').offset({
	        top: y_offset,
	        left: x_offset
	    });

	    init_x = x_offset;
	    init_y = y_offset;

	    topLim = 0;
	    bottomLim = -img_h + h;
	    leftLim = 0;
	    rightLim = -img_w + w;

	    anim_counter = 0;

	    last_smouse_x = 0;
	    last_smouse_y = 0;

	    start_x = null;
	    start_y = null;

	    active = false;
	    video = false;
	    videoHidden = false;

	    loaded = false;

	    clickHintShown = false;
	    hintHtml = $('#click-hint').html();

	    restartDistance = 200;
		startedMoving = false;
		moveHintShown = false;

	    $(document).mouseleave(function (e) {
	        page_x = e.pageX;
	        page_y = e.pageY;

	        if ((page_x < 0 || page_y < 0 || page_x > $(document).width() || page_y > $(document).height()) && !video) {
	            $("#layout").stop();
	            $("#layout").animate({
	                top: init_y + "px",
	                left: init_x + "px"
	            }, {
	                duration: 5000,
	                easing: 'easeOutQuad'
	            });
	        }
	    });

	    $(document).click(function (e) {
	        stopMove(200);
	        if ($('#click-hint').is(":visible")) {
	            $('#click-hint').fadeOut(200);
	        }
	    });

	    $(document).mousemove(function (e) {
	        //console.log('mousemove');

	        page_x = e.pageX;
	        page_y = e.pageY;
	        smouse_x = e.pageX - (w / 2);
	        smouse_y = e.pageY - (h / 2);

	        if (loaded) {
	            if (start_x == null && start_y == null) {
	                start_x = smouse_x;
	                start_y = smouse_y;
	            }

	            if (!active) {
	                travel = getDistance(start_x, start_y, smouse_x, smouse_y);
	                console.log('TRAVEL');
	                console.log(travel);

	                if (travel > restartDistance) {
	                    active = true;
	                    $('#shadow').fadeOut(1000);
	                }
	            }
	        }

	        if (active && !video) {
	            if (smouse_x == 0) {
	                x_delta = 0;
	            } else {
	                x_delta = (smouse_x * smouse_x * smouse_x) / (600 * Math.abs(smouse_x));
	            }

	            if (smouse_y == 0) {
	                y_delta = 0;
	            } else {
	                y_delta = (smouse_y * smouse_y * smouse_y) / (600 * Math.abs(smouse_y));
	            }

	            console.log('x_delta');
	            console.log(x_delta);
	            console.log('y_delta');
	            console.log(y_delta);

	            moveImage();
	        }
	    });

	    $('area.video').hover(
	        function () {
	            stopMove(100);
	            $('#click-hint').addClass('yellow');
	            $('#click-hint').html('click to watch video');
	        },
	        function () {
	            $('#click-hint').removeClass('yellow');
	            $('#click-hint').html(hintHtml);
	        }
	    );

	    $('area.email').hover(
	        function () {
	            stopMove(100);
	            $('#click-hint').addClass('yellow');
	            $('#click-hint').html('click to send an email');
	        },
	        function () {
	            $('#click-hint').removeClass('yellow');
	            $('#click-hint').html(hintHtml);
	        }
	    );
	}

});