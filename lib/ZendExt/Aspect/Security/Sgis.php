<?php
/**
 * ZendExt_Aspect_Security_Sgis
 * Encapsula los aspectos de seguridad, realiza a traves del SGIS los
 * procesos de autenticacion, autorizacion, auditoria y administracion
 * de perfiles
 *
 * @package   ZendExt
 * @copyright UCID-ERP Cuba
 * @author    Omar Antonio Diaz Peña
 * @version   1.0-0
 */
class ZendExt_Aspect_Security_Sgis extends ZendExt_Aspect_Security
{


    /**
     * Integrador utilizado para solicitar los servicios que brinda el SIGES
     * a traves de inversion de control
     *
     * @var ZendExt_IoC
     */
    protected $_integrator;

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {
        //Se obtiene la instancia del integrador
        $this->_integrator = ZendExt_IoC::getInstance();
    }

    /**
     * Obtencion de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return ZendExt_Aspect_Security_Sgis - instancia de la clase
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
     * @param $pUser      - nombre o alias del usuario que se registro
     * @param $pPass      - clave de acceso del usuario
     * @param $pIdSistema - identificador del sistema
     *
     * @return string - devuelve el certificado asignado al usuario
     */
    protected function getCertificate($user, $password)
    {
        $integrator = ZendExt_IoC::getInstance();
        return $integrator->seguridad->AutenticarUsuario($user, $password);
    }

    /**
     * getUserData
     * Obtiene los datos del usuario autenticado utilizando un servicio
     * que brinda el SGIS a traves del IoC
     *
     * @return void
     */
    public function getUserData()
    {
        //Se obtiene la session a partir del registro
        $session = Zend_Registry::getInstance()->session;
        if (!isset($session->perfil)) {
            //Se solicita un servicio al SGIS para cargar los datos del usuario
            $integrator = ZendExt_IoC::getInstance();
            $usuarioArr = $integrator->seguridad->CargarPerfil($session->certificado);
            //Se guarda en una dimension de la session los datos del perfil del usuario
            $session->perfil = $usuarioArr;
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
    public function verifyAccessEntity()
    {
        $session = Zend_Registry::get('session');
        $integrator = ZendExt_IoC::getInstance();
        return $integrator->seguridad->verifyAccessEntity($session->certificado, $session->idestructura);
    }

    public function getDomain($idestructuracomun)
    {
        $certificate = Zend_Registry::get('session')->certificado;
        return $this->_integrator->seguridad->CargarDominio($certificate, $idestructuracomun);
    }
}
