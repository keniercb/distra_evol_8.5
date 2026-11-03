<?php
/**
 * Created by JetBrains PhpStorm.
 * User: ymorejonb
 * Date: 22/06/13
 * Time: 8:50
 * To change this template use File | Settings | File Templates.
 */
class ZendExt_App_Test extends ZendExt_App
{

    protected function checkSecurity()
    {
        $session = Zend_Registry::getInstance()->session;
        if (!isset($session->certificado) && !$session->certificado) {
            $session->certificado = 'test';
        }
    }
}
