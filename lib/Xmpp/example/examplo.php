<?php

set_include_path(get_include_path() . PATH_SEPARATOR . dirname(dirname(dirname(__FILE__))) . PATH_SEPARATOR . "D:/servicios/lib/zend/library/");

require_once 'Xmpp/PubSub/Standard.php';

$object = Xmpp_Pubsub_Standard::getInstance();
$config = array(
    	'user'	    =>	'admin',
        'pass'	    =>	'admin',
		'port'	    =>	5222,
    	'host'	    =>	'localhost',
    	'domain'    =>  'localhost',
		'logLevel'	=>	0,
		'service' => 'pubsub.localhost');
$object->init($config);
try {

/*
$object->deleteNode('time');
$object->deleteNode('variable');
*/

/*
$configure = array();
$configure['max_items'] = 20;
$configure['send_last_published_item'] = 'never';
$configure['presence_based_delivery'] = 1;
$configure['type'] = "http://scada.ucid/2012";
$configure['notify_retract'] = 0;
$configure['tempsub'] = 'true';
$configure['persist_items'] = 1;
$configure['access_model'] = 'whitelist';
$configure['deliver_payloads'] = 1;
$configure['node_type'] = 'leaf';

$object->createNode('time',$configure);
$object->createNode('variable',$configure);
$object->updateAffiliation('time', 'mmesa@scada.ucid', 'member');
*/

while(true)
{
	$date = date("h:i:s A");
    $item = "<scada xmlns='http://scada.ucid/2012'><field><name>date</name><value>{$date}</value></field></scada>";
	$object->publishItem('time', $item);
	sleep(2);
}



}catch (Xmpp_Exception_Auth $t)
{
	echo $t->getMessage();
	echo $t->getCode();
}
catch (Xmpp_Exception_Cancel $t)
{
	echo $t->getMessage();
	echo $t->getCode();
}
catch (Xmpp_Exception_Modify $t)
{
	echo $t->getMessage();
	echo $t->getCode();
}