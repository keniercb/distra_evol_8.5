<?php
/** Zend_Controller_Request_Http */
require_once 'Zend/Controller/Request/Http.php';

/** Zend_Uri */
require_once 'Zend/Uri.php';

/**
 * Extjs_Controller_Request_RawJson
 *
 *
 * @uses       Zend_Controller_Request_Http
 * @package    Zend_Controller
 * @subpackage Request
 * @todo Currently it only adds the RAW data it should allow for selecting sources, it doesnt right now.
 */
class Extjs_Controller_Request_RawJson extends Zend_Controller_Request_Http {

	protected $_paramSources = array ('_GET', '_POST', '_RAW' );

	protected $_rawPrefix = 'RAW_';

	/**
	 * 
	 * @var integer count of requests in rawdata
	 */
	public $requestCount = 0;

	/**
	 * Constructor
	 *
	 * If a $uri is passed, the object will attempt to populate itself using
	 * that information.
	 *
	 * @param string|Zend_Uri $uri
	 * @return void
	 * @throws Zend_Controller_Request_Exception when invalid URI passed
	 */
	public function __construct($uri = null) {
		parent::__construct ( $uri );
		
		$rawBody = $this->getRawBody ();
		if ($rawBody !== false) {
			$json = Zend_Json::decode ( $rawBody, Zend_Json::TYPE_ARRAY );
		} else {
			$json = false;
		}
		if ($json !== false && is_null ( $json ) !== true) {
			if (isset ( $json ["tid"] )) {
				$this->requestCount = 1;
				$json2 [] = $json;
				$json = $json2;
				unset ( $json2 );
			} else {
				$this->requestCount = count ( $json );
			}
            $json = array_reverse($json, false);
			$this->setParam ( "RawJson", $json );
		} else {
			if ($this->isPost ()) {
				$req = $this->getParams ();
				if (isset ( $req ["extTID"] )) {
					$this->requestCount = 1;
					$json = array ();
					$params = array ();
					foreach ( $req as $pname => $pval ) {
						switch ($pname) {
							case 'extAction' :
								$pname = 'action';
								break;
							case 'extTID' :
								$pname = 'tid';
								break;
							case 'extMethod' :
								$pname = 'method';
								break;
						}
						$params ["$pname"] = $pval;
					}
					$json [] = $params;
				}
                $json = array_reverse($json, false);
				$this->setParam ( "RawJson", $json );
			}
		}
	}
}
