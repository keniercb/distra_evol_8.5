<?php

class ZendExt_Aspect_SGIS_Service_Security extends ZendExt_Aspect_Security
{


    /**
     * Cliente de SOAP para utilizar los servicios web que brinda el SIGES
     *
     * @var SoapClient
     */
    protected $_soapClient;

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {
        //Se obtiene la configuracion del servicio web de seguridad.
        $securityConfig = Zend_Registry::get('config')->seguridad;
        try {
            $location = $securityConfig->location;
            $uri = $securityConfig->uri;
            //Se crea la instancia del cliente de SOAP
            $this->_soapClient = new SoapClient(null, array('location' => $location, 'uri' => $uri));
        } catch (SoapFault $e) { //Si se captura una excepcion de SOAP
            //Se dispara una excepcion declarada en el xml de excepciones
            throw new ZendExt_Exception('SEG001', $e);
        }
    }

    /**
     * Obtencion de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return ZendExt_Aspect_Security - instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    /**
     * getCertificate
     * Obtiene el certificado del usuario
     *
     * @param $pUser - nombre o alias del usuario que se registro
     * @param $pPass - clave de acceso del usuario
     * @param $pIdSistema - identificador del sistema
     *
     * @return string - devuelve el certificado asignado al usuario
     */
    protected function getCertificate($user, $password, $idsistema)
    {
        try {
            //Se solicita el servicio de autenticacion al SGIS
            return $this->_soapClient->Autenticar(
                base64_encode($user), base64_encode($password), base64_encode($idsistema)
            );
        } catch (SoapFault $e) {
            throw new ZendExt_Exception('SEG002', $e);
        }
    }

    /**
     * getUserData
     * Obtiene los datos del usuario autenticado a traves de un servicio web
     * que brinda el SGIS
     *
     * @return void
     */
    public function getUserData()
    {
        //Se obtiene la session a partir del registro
        $register = Zend_Registry::getInstance();
        $session = $register->session;
        //Si no se ha cargado el perfil
        if (!$session->perfil) {
            try {
                //Se solicita un servicio web al SGIS para cargar los datos del usuario
                $usuarioArr = $this->_soapClient->getData($session->usuario, $session->certificado);
                //Se guarda en una dimension de la session los datos del perfil del usuario
                $usuarioArr = $usuario->toArray();
                $session->perfil = $usuarioArr[0];
            } catch (SoapFault $e) {
                throw new ZendExt_Exception('SEG003', $e);
            }
        }
    }

    /**
     * hasAcces
     * Verifica que un usuario tiene acceso a una funcionalidad y a una
     * accion a traves de un servicio web que brinda el SGIS.
     *
     * @return boolean - retorna true si el usuario autenticado tiene acceso falso sino.
     * @ignore - Ignorar el resultado pq siempre se devuelve true.
     */
    public function hasAccess()
    {
        try {
            //Se obtiene la session a partir del registro
            $register = Zend_Registry::getInstance();
            $session = $register->session;
            $usuarioArr = $this->_soapClient->hasAccess(
                $session->certificado, $register->controller, $register->action
            );
        } catch (SoapFault $e) {
            throw new ZendExt_Exception('SEG004', $e);
        }
    }
}
