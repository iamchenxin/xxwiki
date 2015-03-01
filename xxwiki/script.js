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
    jQuery(".desktop #xxsidebar").slideToggle(500);
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
function voice_you_raw(){
//        audioElement.setAttribute('src', 'http://www.uscis.gov/files/nativedocuments/Track%2093.mp3');
    var str="http://dict.youdao.com/dictvoice?audio=";
    str += jQuery(this).text();
    str+="&type=2";
    audioElement.setAttribute('src', str);
    audioElement.setAttribute('autoplay', 'autoplay');
}

// --------------oxford voice ----------------------
var xxaudio;
var srcogg;
var srcmp3;
var faildword;

function build_oxford_us_str(words){
    words=words.trim(); // use trim to move white space and tab
    var xxword=words.toLowerCase();
    if(/[^a-z]/.test(xxword)==true)return ; //not a oxford word return
    var str = "http://www.oxforddictionaries.com/us/media/american_english/us_pron/";
    var backstr = xxword+"__us_1";
    str+= backstr.slice(0,1)+'/';
    str+= backstr.slice(0,3)+'/';
    str+= backstr.slice(0,5)+'/';
    str += backstr;
    return str;
}
function build_uk_str(words){
    words=words.trim(); // use trim to move white space and tab
    var xxword=words.toLowerCase();
    if(/[^a-z]/.test(xxword)==true)return ; //not a oxford word return
    var str = "http://www.oxforddictionaries.com/us/media/american_english/uk_pron/";
    var backstr = xxword+"__gb_1_8";
    str+= backstr.slice(0,1)+'/';
    str+= backstr.slice(0,3)+'/';
    str+= backstr.slice(0,5)+'/';
    str += backstr;
    return str;
}

function voice_youdao(){
    var str="http://dict.youdao.com/dictvoice?audio=";
    str += faildword;
    str+="&type=1";
    jQuery(xxaudio).attr('onerror',"");
    srcogg.attr('src',"");
    srcmp3.attr('src',"");
    xxaudio.setAttribute('src', str);
    xxaudio.setAttribute('autoplay', 'autoplay');
}

function voice_play(urlstr){
    srcogg.attr('src',urlstr+".ogg");
    srcmp3.attr('src',urlstr+".mp3");
    xxaudio.setAttribute('src', urlstr+".mp3");
    xxaudio.setAttribute('autoplay', 'autoplay');
}

function voice_oxford_uk(){
    var oxurl= build_uk_str(faildword);
    if(oxurl==undefined){
        voice_youdao();
        return;
    }
    jQuery(xxaudio).attr('onerror',"voice_youdao()");
    voice_play(oxurl);
}

function voice_oxford(){  // default is us voice
    var xword = jQuery(this).text();
    faildword=xword;
    var oxurl= build_oxford_us_str(xword);
    if(oxurl==undefined){
        voice_youdao();
        return;
    }
    jQuery(xxaudio).attr('onerror',"voice_oxford_uk()");
    voice_play(oxurl);
}

function init_ox_voice(dst_client){
    xxaudio = document.createElement('audio');
    srcogg = jQuery("<source src='' type='audio/ogg'>");
    srcmp3 = jQuery("<source src='' type='audio/mpeg'>");
    jQuery(xxaudio).append(srcogg);
    jQuery(xxaudio).append(srcmp3);
    jQuery(xxaudio).attr('autoplay', 'autoplay');
    jQuery(dst_client).click(voice_oxford);
}
// END END END END

function xxeditsize(height){
    var $textarea = jQuery('#wiki__text');
    $textarea.css('height', height+'px');
    DokuCookie.setValue('sizeCtl',$textarea.css('height'));
}

var currentInput = "numin1";
function xxnumin_get(numinId){

}

function xxeditsize_add(){

    var $sizect = jQuery('#size__ctl');
    var sizect=$sizect[0];
    if(!sizect)return;

    var mdiv =jQuery("<div id='xxeditsize'></div>");
    var numin1 = jQuery("<input type='text' id='numin1' name='textinput' value='150' />");
    var chstr1= DokuCookie.getValue('numin1');

    if(!chstr1){chstr1="150";}

    numin1.attr("value",chstr1);

    var numin2 = jQuery("<input type='text' id='numin2' name='textinput' value='400' />");
    var chstr2= DokuCookie.getValue('numin2');
    if(!chstr2){chstr2="400";}
    numin2.attr("value",chstr2);


    var bt=jQuery("<input name='xxSet' class='button' type='button' value='Set'>");
    currentInput="numin1";

    bt.attr("value","Set"+chstr1);
    bt.click(function(){
        var numcurrent =document.getElementById(currentInput).value;
        DokuCookie.setValue(currentInput,""+numcurrent); //store to cookie
        if(currentInput=="numin1"){
            currentInput="numin2";
        }else{currentInput="numin1";}
        var hh=parseInt(numcurrent);
        xxeditsize(hh);
        numcurrent =document.getElementById(currentInput).value;
        bt.attr("value","Set"+numcurrent);

    });
    mdiv.append(numin1);
    mdiv.append(numin2);
    mdiv.append(bt);

    jQuery("#size__ctl").after(mdiv);

}

function SetTotop(){
    var $xtoolbar=jQuery("#tool__bar");
    var xtoolbar=$xtoolbar[0];
    var totop =  jQuery("#realtotop");
    if(!xtoolbar){
       totop.attr("href","#dokuwiki__content");
    }else{
        totop.attr("href","#tool__bar");
    }
}

function xxinit(){
    toobar_youdao();
}
xxinit();

function jQ_xxinit(){
    audioElement = document.createElement('audio');
    init_ox_voice(".wrap_vo");
    jQuery(".wrap_voy").click(voice_you_raw);
    jQuery("#xxtoolpop").click(xxside_show);
    jQuery(window).resize(xxside_resize);
    xxeditsize_add();
    SetTotop();

}
jQuery(jQ_xxinit);