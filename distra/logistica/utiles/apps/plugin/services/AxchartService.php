<?php
/**
 * @class         AxchartService
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Division GE
 * @copyright (c) 2016, XETID
 * @version       1.0
 */
class AxchartService extends ZendExt_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getScript()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirScripts= file_get_contents($dirApps . '/logistica/utiles/plugin/views/scripts/axchart/services.phtml');
        return $dirScripts;
    }

}
