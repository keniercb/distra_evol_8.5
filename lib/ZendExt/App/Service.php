<?php

/**
 * ZendExt_App_Service
 *
 * Gestor de la aplicacion
 *
 * @author    Yoandry Morejon Borbon, Darien Garcia Tejo.
 * @package   ZendExt
 * @copyright UCID.
 * @version   1.0-0
 */
class ZendExt_App_Service extends ZendExt_App_External
{

    /**
     * Inicializa la aplicacion y controla las excepciones disparadas por el sistema
     *
     * @param array $config - arreglo con la configuracion de la aplicacion
     *
     * @throws ZendExt_Exception - dispara las excepciones no controladas en tiempo de desarrollo.
     * @return void
     */
    public function init($config, $autentication = false)
    {

        try {
            $this->initApp($config, $autentication);
        } catch (Exception $e) {
            throw new SoapFault($e->getMessage(), 'SERVER');
        }
    }

    /**
     * Inicializa la aplicacion
     *
     * @param array $config - arreglo con la configuracion de la aplicacion
     *
     * @throws ZendExt_Exception - dispara las excepciones no controladas en tiempo de desarrollo.
     * @return void
     */
    protected function initApp($config, $autentication)
    {
        $this->initRegister();
        $this->initConfig($config);
        $this->initSessionServer();
        $this->initConexion();
        $this->updateRegister();
        if ($autentication) {
            if (!isset($_SESSION['UCID_ENTITY_SERVICES']['certificado'])) {
                throw new SoapFault('Acceso Denegado', 'AUTENTICATION');
            }
        }

    }

    protected function initSessionServer()
    {
        //Se inicia la sesion.
        session_save_path($this->config->session_save_path);
        Zend_Session::start(array('save_path' => $this->config->session_save_path));
        $session = new Zend_Session_Namespace('UCID_ENTITY_SERVICES');

        $this->register->session = $session;
    }
}
