<?php

set_include_path(get_include_path() . PATH_SEPARATOR . dirname(dirname(dirname(__FILE__))) . PATH_SEPARATOR . "dir/Zend");

require_once 'Xmpp/Bosh/Standard.php';

/**
 *
 * Bosh sobre HTTPS
 */
$object = Xmpp_Bosh_Standard::getInstance();
$config = array(
    	'user' => 'admin',
        'pass' => 'admin',
        'domain' => 'localhost',
        'boshHost' => 'localhost',
		'boshSsl' => false,
        'boshSslVerifyPeer' => true,
        'boshSslVerifyHost' => 1,
        'boshCaInfo' => true,
        'boshOut' => false,
        'boshPort' => 5281,
        'mode' => 'cgi');
try {
    $object->init($config);
	print_r ($object->attach());
}catch (Exception $e)
{
	echo $e->getMessage();
}

/**
 *
 * Bosh HTTP
 */

$object = Xmpp_Bosh_Standard::getInstance();
$config = array(
    	'user' => 'admin',
        'pass' => 'admin',
        'domain' => 'localhost',
        'boshHost' => 'localhost',
        'boshOut' => false,
        'boshPort' => 5280,
        'mode' => 'cgi');
try {
    $object->init($config);
	print_r ($object->attach());
}catch (Exception $e)
{
	echo $e->getMessage();
}
