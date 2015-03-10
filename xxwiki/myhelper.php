<?php
/**
 * Created by PhpStorm.
 * User: z9764
 * Date: 2015/3/9
 * Time: 21:32
 */


function personal_sidebar()
{
    $usersidebar = "user:";
    $usera =$INFO['client'];
    if($usera&&$GLOBALS['USERINFO']){
        $usersidebar = $usersidebar.$usera.":";
    }else{
        $usersidebar = $usersidebar."unlog:"; // show the unlog sidebar
    }
    $usersidebar = $usersidebar .$conf['sidebar'];
    $tmp = tpl_include_page($usersidebar, true, false);
    if(!$tmp){ // use this method to make at mostly time ,tpl_include_page will excute once
        $userpage="user:".$INFO['client'];
        echo <<<END
<a title="$usersidebar" class="wikilink1" href="/$usersidebar?do=edit">create your sidebar</a><br/><span>Link code for sidebar: [[:$usersidebar]]</span><br/>
<a title="$userpage" class="wikilink1" href="/$userpage?do=edit">create your homepage</a><br/><span>Link code for userpage: [[:$userpage]]</span><br/>
END;
        tpl_include_page("user:none:".$conf['sidebar'], true, false); // user do not create his sidebar.
    }
}