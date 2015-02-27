/**
 *  We handle several device classes based on browser width.
 *
 *  - desktop:   > __tablet_width__ (as set in style.ini)
 *  - mobile:
 *    - tablet   <= __tablet_width__
 *    - phone    <= __phone_width__
 */
var device_class = ''; // not yet known
var device_classes = 'desktop mobile tablet phone';

function tpl_dokuwiki_mobile(){

    // the z-index in mobile.css is (mis-)used purely for detecting the screen mode here
    var screen_mode = jQuery('#screen__mode').css('z-index') + '';

    // determine our device pattern
    // TODO: consider moving into dokuwiki core
    switch (screen_mode) {
        case '1':
            if (device_class.match(/tablet/)) return;
            device_class = 'mobile tablet';
            break;
        case '2':
            if (device_class.match(/phone/)) return;
            device_class = 'mobile phone';
            break;
        default:
            if (device_class == 'desktop') return;
            device_class = 'desktop';
    }

    jQuery('html').removeClass(device_classes).addClass(device_class);

    // handle some layout changes based on change in device
    var $handle = jQuery('#dokuwiki__aside h3.toggle');
    var $toc = jQuery('#dw__toc h3');

    if (device_class == 'desktop') {
        // reset for desktop mode
        if($handle.length) {
            $handle[0].setState(1);
            $handle.hide();
        }
        if($toc.length) {
            $toc[0].setState(1);
        }
    }
    if (device_class.match(/mobile/)){
        // toc and sidebar hiding
        if($handle.length) {
            $handle.show();
            $handle[0].setState(-1);
        }
        if($toc.length) {
            $toc[0].setState(-1);
        }
    }
}

jQuery(function(){
    var resizeTimer;
    dw_page.makeToggle('#dokuwiki__aside h3.toggle','#dokuwiki__aside div.content');

    tpl_dokuwiki_mobile();
    jQuery(window).bind('resize',
        function(){
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(tpl_dokuwiki_mobile,200);
        }
    );

    // increase sidebar length to match content (desktop mode only)
    var $sidebar = jQuery('.desktop #dokuwiki__aside');
    if($sidebar.length) {
        var $content = jQuery('#dokuwiki__content div.page');
        $content.css('min-height', $sidebar.height());
    }
});

function xxexpandcontent(){
    if( document.getElementById("xxexpandcon").style.maxWidth == "100%"){
        document.getElementById("xxexpandcon").style.maxWidth = "75em";
    }else{
        document.getElementById("xxexpandcon").style.maxWidth = "100%";
    }
}

function xxside_resize(){
    var top_width = jQuery("#dokuwiki__header").width();
    var win_width =jQuery(window).width();

    var bar_width = (win_width-top_width)/2 - 10;

    jQuery(".desktop #xxsidebar").width(bar_width);
}

function xxside_show(){
    xxside_resize();
    jQuery(".desktop #xxsidebar").slideToggle(1000);

}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

function toobar_youdao(){
    if (typeof window.toolbar !== 'undefined') {
        toolbar[toolbar.length] = {
            type: "format",
            title: "Voice",
            icon: "../../tpl/xxwiki/images/toolbar/voice.png",
            key: "",
            open: "<wrap vo>",
            sample: "WORD",
            close: "</wrap>"
        };
     //   var str = "path ={0} toolbar.length = {1}".format("../../tpl/xxwiki/images/toolbar",toolbar.length);
      //  alert(str);
    }
  //  alert("haha");
}

var audioElement ;
function voice_test(){
//        audioElement.setAttribute('src', 'http://www.uscis.gov/files/nativedocuments/Track%2093.mp3');
    var str="http://dict.youdao.com/dictvoice?audio=";
    str += jQuery(this).text();
    str+="&type=2";
    audioElement.setAttribute('src', str);
    audioElement.setAttribute('autoplay', 'autoplay');
    //audioElement.load()
    jQuery.get();
    audioElement.addEventListener("load", function () {
        audioElement.play();
    }, true);

    audioElement.play();
    //   $(this).text(str);

}

function xxinit(){
    toobar_youdao();
}
xxinit();

function jQ_xxinit(){
    audioElement = document.createElement('audio');
    jQuery(".wrap_vo").click(voice_test);
    jQuery("#xxtoolpop").click(xxside_show);
    jQuery(window).resize(xxside_resize);

}
jQuery(jQ_xxinit);