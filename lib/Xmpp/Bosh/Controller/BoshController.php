<?php

/**
 * Xmpp_Bosh_Controller_BoshController
 *
 * @author L�nea de autom�tica centro MTA -> UICD
 * @package XMPP_Bosh_Controller
 * @version 1.0
 */
abstract class Xmpp_Bosh_Controller_BoshController extends ZendExt_Controller_Secure
{

    /**
     *
     * @return void
     */
    public function init()
    {
        try {
            parent::init();
            $this->_helper->viewRenderer->setNoRender(true);
            $bosh = Xmpp_Bosh_Standard::getInstance();
            $config = $this->getConfig();
            if($config['active']) {
                $bosh->init($config);
                $result = $bosh->attach();
                $this->result = $result;
            }
            else {
                $this->result = array();
            }

        } catch (XMPP_Exception_Auth $e) {
            $this->result = array();
        } catch (XMPP_Exception_Cancel $e) {
            $this->result = array();
        } catch (XMPP_Exception_Modify $e) {
            $this->result = array();
        }
    }

    /**
     *
     * Obtiene el usuario y la credencial de la sessi�n
     * que se encuentra activa.
     *
     * @return array
     */
    protected function getConcurrentCredential()
    {
        $rsa = new ZendExt_RSA_Facade();
        $securitySession = new Zend_Session_Namespace('Quarseg');
        return array('user' => $securitySession->usuario, 'password' => $rsa->decrypt($securitySession->passw));
    }

    /**
     *
     * Crea la configuraci�n minima para poder realizar la comunicaci�n
     * con el servidor jabber.
     *
     * @abstract
     * @return array
     */
    abstract protected function getConfig();

    /**
     *
     * Obtiene los par�mtros de autenticaci�n a utilizar por
     * el componente strophe.
     *
     * @return json
     */
    public function attachAction()
    {
        echo Zend_Json::encode($this->result);
    }

}
