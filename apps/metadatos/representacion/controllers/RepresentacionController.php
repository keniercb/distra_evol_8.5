<?php

/**
 * Short description for class
 * Long description for class (if any)...
 *
 * @category   PhpStorm
 * @package    Beta
 * @subpackage Wand
 * @copyright  Copyright (c) 2005-2015 XETID (http://www.xetid.cu)
 * @license    http://framework.zend.com/license   BSD License
 * @version    Release: @package_version@
 * @link       http://10.12.170.10:9880/Estructura_composicion/
 * @since      Class available since Release 1.5.0
 * @deprecated Class deprecated in Release 2.0.0
 */
class RepresentacionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function representacionAction()
    {
        $this->view->jsrepresentacion = $this->integrator->gis->DevolverJS();
        $this->render();
    }
}