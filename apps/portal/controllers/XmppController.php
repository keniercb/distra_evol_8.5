<?php

class XmppController extends Xmpp_Bosh_Controller_BoshController
{

    public function init()
    {
        parent::init();
    }

    public function getConfig()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $generalConfigFile = $dirApps . '/portal/comun/recursos/ini/pubsub/configuracion.ini';
        $iniConfig = parse_ini_file($generalConfigFile, true);
        $credential = $this->getConcurrentCredential();

        return array(
            'user' => $credential['user'],
            'pass' => $credential['password'],
            'admin' => (isset ($iniConfig['admin'])) ? (bool)$iniConfig['admin'] : false,
            'domain' => $iniConfig['domain'],
            'boshHost' => $iniConfig['boshHost'],
            'boshSsl' => (bool)$iniConfig['boshSsl'],
            'boshSslVerifyPeer' => (bool)$iniConfig['boshSslVerifyPeer'],
            'boshSslVerifyHost' => $iniConfig['boshSslVerifyHost'],
            'boshCaInfo' => (bool)$iniConfig['boshCaInfo'],
            'boshOut' => (bool)$iniConfig['boshOut'],
            'boshPort' => $iniConfig['boshPort'],
            'mode' => $iniConfig['mode'],
            'active' => (isset ($iniConfig['active'])) ? (bool)$iniConfig['active'] : false
        );
    }
}