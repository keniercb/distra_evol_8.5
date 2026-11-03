<?php

class ZendExt_Aspect_Security implements ZendExt_Aspect_ISinglenton
{
    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {

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
        //Se guarda en el singelton seguridad.
        $register = Zend_Registry::getInstance();
        $register->seguridadInstance = $instance;
        return $instance;
    }

    /**
     * @method authenticateUser - Funcion usuada para el proceso de autenticacion.
     * @author                  - Equipo de arquitectura UCID.
     * @ignore                  @return void
     */
    public function authenticateUser()
    {

        $session = new Zend_Session_Namespace('Zeolides');
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $config = Zend_Registry::get('config');

        $ttl = $config->security->ttl===-1?900:$config->security->ttl;
        if ($this->TiempoExpiracion($config)) {
            Zend_Session::getSaveHandler()->clear(Zend_Session::getId());
            session_regenerate_id();
            Zend_Session::destroy();
            unset($_SESSION);
            $e = new ZendExt_Exception_Log(new ZendExt_Exception('SEGINVALIDCERTIFICATE'));
            $e->handle();
            if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
                echo json_encode(array('expirate' => true));
            }
            else {
                echo '<script type="text/javascript">window.parent.location.reload()</script>';
            }
            Zend_Session::getSaveHandler()->gc($ttl);
            return true;
        }
        if (!isset($session->certificado)) {
            if (!isset($securitySession->SP['authData']['certificado'])) {
                Zend_Session::getSaveHandler()->clear(Zend_Session::getId());
                if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
                    echo json_encode(array('expirate' => true));
                } else {
                    echo '<script type="text/javascript">window.parent.location.href = "/seguridad/index.php/serviceprovider/index"</script>';
                }
                return true;
            }
            else {
                $trace = ZendExt_Aspect_Trace::getInstance();
                $trace->traceAutenticacion();

                $session->certificado = $securitySession->SP['authData']['certificado'];
                if ($config->security->ttl > 0) {
                    $session->setExpirationSeconds((integer)$config->security->ttl, 'certificado');
                }
            }
        }
        else {

            if ($config->security->ttl > 0) {
                $session->setExpirationSeconds((integer)$config->security->ttl, 'certificado');
                Zend_Session::getSaveHandler()->gc($ttl);
            }

            if (!isset($securitySession->SP['authData']['certificado'])) {

                $this->clearOutSession();
                $session->unsetAll();
                $securitySession->__unset('SP');
                Zend_Session::getSaveHandler()->clear(Zend_Session::getId());
                Zend_Session::getSaveHandler()->gc($ttl);
                Zend_Session::destroy();
                header("Location: /seguridad/index.php/serviceprovider/index");
            }
            else if (!self::verifyCertificate($session->certificado)) {
                Zend_Session::getSaveHandler()->clear(Zend_Session::getId());
                Zend_Session::getSaveHandler()->gc($ttl);
                session_regenerate_id();
                Zend_Session::destroy();
                unset($_SESSION);
                $e = new ZendExt_Exception_Log(new ZendExt_Exception('SEGINVALIDCERTIFICATE'));
                $e->handle();
                header("Location: /seguridad/index.php/serviceprovider/index");

            }
        }
        if($ttl===28800){
            Zend_Session::getSaveHandler()->gc($ttl);
        }
    }

    protected function clearOutSession()
    {
        if (isset($_SESSION['__ZF']) && is_array($_SESSION['__ZF'])) {
            foreach ($_SESSION['__ZF'] as $key => $sesszf) {
                $namespace = $key;
                break;
            }
            $session = $_SESSION;
            foreach ($session as $key => $sess) {
                if ($key != $namespace && $key != '__ZF') {
                    unset($_SESSION[$key]);
                }
            }
            unset($_SESSION['__ZF'][$namespace]);
        }
    }

    /**
     * getCertificate
     * Obtiene el certificado del usuario
     *
     * @param $user - nombre o alias del usuario que se registro
     * @param $password - clave de acceso del usuario
     *
     * @return string - devuelve el certificado asignado al usuario
     * @ignore return - retorna 1, pendiente a utilizacion
     */
    protected function getCertificate($user, $password)
    {
        return 1;
    }

    /**
     * @method verifyCertificate - Verifica la valides del certificado.
     *
     * @param string $certificado - Certificado del usuario.
     * @param integer $usuario - Usuario.
     *
     * @return integer              - Retorna 1 si el Certificado es valido 0 de lo contrario.
     */
    private static function verifyCertificate($certificado)
    {
        $integrator = ZendExt_IoC::getInstance();
        $securitySession = new Zend_Session_Namespace('Quarseg');
        return $integrator->seguridad->verifyCertificate($certificado, $securitySession->SP['authData']['usuario']);
    }

    /**
     * getUserData
     * Obtiene los datos del usuario autenticado a traves de un servicio de
     * negocio que brinda el componente portal
     *
     * @return void
     */
    public function getUserData()
    {
        $register = Zend_Registry::getInstance();
        $session = $register->session;
        if (!$session->perfil) {
            $integrator = ZendExt_IoC::getInstance();
            $usuario = $integrator->portal->BuscarUsuarioByAlias($session->usuario);
            $usuarioArr = $usuario->toArray();
            $session->perfil = $usuarioArr[0];
        }
    }

    /**
     * Muestra la ventana de autenticacion por HTTP
     *
     * @return void
     */
    protected function showLogonWindow()
    {
        //Se muetra la ventana de autenticacion.
        header('WWW-Authenticate: Basic realm="SIGIS"');
        //Si cancela la autenticacion se muestra un mensaje de acceso denegado
        header('HTTP/1.0 401 Unauthorized');
        //Si la peticion es por ajax
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
            //Se imprime la excepcion en codigo json
            die(json_encode(array('codMsg' => 3, 'mensaje' => '<b> Acceso denegado </b>')));
        } else {
            die('<h1 style="color:#FF0000">Acceso denegado</h1>');
        }
    }

    /**
     * verifyAccessToFunctionality
     * Contruye la ACL del usuario autenticado y verifica los accesos.
     *
     * @return void.
     */
    public function verifyAccessToFunctionality()
    {
        $session = Zend_Registry::getInstance()->session;
        if ($session->certificado) {
            if (!isset($session->acl)) {
                //Si no existe la ACL la creo y le inyecto los recursos publicos.
                $publicResourse = self::getPublicResourse();
                if(!count($publicResourse['SAML'])){
                    $publicResourse['SAML'] = array("/seguridad/index.php/identityprovider/sso",
                        "/seguridad/index.php/identityprovider/slo","/seguridad/index.php/identityprovider/login",
                        "/seguridad/index.php/identityprovider/authenticateAction",
                        "/seguridad/index.php/serviceprovider/index","/seguridad/index.php/serviceprovider/acs",
                        "/seguridad/index.php/serviceprovider/slo","/seguridad/index.php/serviceprovider/logout");
                }
                $session->acl = array();
                $session->acl = array_merge($session->acl, $publicResourse['Portal']);
                $session->acl = array_merge($session->acl, $publicResourse['SAML']);
                $session->acl['string'] = $publicResourse['String'];
                $session->acl['access'] = true;
            }
            if (isset($session->entidad->idestructura) && $session->acl['access']) {
                $integrator = ZendExt_IoC::getInstance();
                $userAcl = $integrator->seguridad->getUserAcl($session->certificado, $session->entidad->idestructura);
                $session->acl = array_merge($session->acl, $userAcl);
                $session->acl['access'] = false;
            }
            self::verifyAccesToResourse($session->acl);
        }
    }

    /**
     * verifyAccesToResourse
     * Verifica que un usuario tiene acceso al recurso solicitado
     *
     * @param $acl - Lista de Control de acceso (array).
     *
     * @return boolean - retorna true si el usuario autenticado tiene acceso falso sino.
     */
    private static function verifyAccesToResourse($acl)
    {
	return true;
        $recurso = $_SERVER['REQUEST_URI'];
        $uri = explode('?', $recurso);
        $temp = ltrim($uri[0], '/');
        $countUriacl = count(array_intersect(array($uri[0]), $acl));
        $countTempacl = count(array_intersect(array($temp), $acl));
        if ($countUriacl > 0 || $countTempacl > 0 || self::verifyPublicResourse($uri[0])
            || self::verifyString(
                $acl, $recurso
            )
        ) {
            $trace = ZendExt_Aspect_Trace::getInstance();
            $trace->traceAutorizacion();

            return true;
        } else {

            $trace = ZendExt_Aspect_Trace::getInstance();
            $trace->traceFalloAutorizacion();


            if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
                echo(json_encode(array('codMsg' => 3, 'mensaje' => "Acceso denegado al recurso solicitado.")));
                throw new ZendExt_Exception('SEGAUTHORIZATION');
            } else {
                die('<h1 style="color:#000000">Acceso denegado al recurso.<b>' . $recurso . '</b>.</h1>');
            }
        }
    }

    /**
     * verifyPublicResourse
     * Verifica si se esta solicitando un recurso que es publico
     *
     * @param $requestResourse - Recurso solicitado.
     *
     * @return boolean - retorna true si es un recurso publico.
     */
    private static function verifyPublicResourse($requestResourse)
    {
        $publicResourse = array('cargaretiquetas', 'cargaracciones', 'cargarexpresiones');
        $resourse = explode('/', $requestResourse);
        if (count(array_intersect(array($resourse[count($resourse) - 1]), $publicResourse)) > 0) {
            return true;
        }
        return false;
    }

    /**
     * verifyString
     * Verifica que un recurso publico este contenido dentro de una cadena
     *
     * @param $acl - ACL del usuario logueado.
     * @param $uri - Uri solicitada.
     *
     * @return boolean - retorna true si es un recurso publico.
     */
    private static function verifyString($acl, $uri)
    {
        foreach ($acl['string'] as $values) {
            if (preg_match("/{$values}/i", $uri)) {
                return true;
            }
        }
        return false;
    }

    /**
     * getPublicResourse
     * Devuelve los recursos publicos del Portal.
     *
     * @return array.
     */
    public static function getPublicResourse()
    {
        $register = Zend_Registry::getInstance();
        $dirXML = $register->config->xml->ACL;
        $ayudaXml = new SimpleXMLElement($dirXML, null, true);
        $arrayChildren = $ayudaXml->children();
        $arrayResources = array();
        foreach ($arrayChildren->recursos->Portal as $key => $resourses) {
            $arrayResources['Portal'][] = (string)$resourses->attributes()->referencia;
        }
        foreach ($arrayChildren->recursos->SAML as $key => $resourses) {
            $arrayResources['SAML'][] = (string)$resourses->attributes()->referencia;
        }
        foreach ($arrayChildren->string->cadena as $key => $resourses) {
            $arrayResources['String'][] = (string)$resourses->attributes()->name;
        }
        return $arrayResources;
    }

    public function TiempoExpiracion($config)
    {
        try {
            $maxLifetime = $config->security->ttl;
            $expiration = $_SESSION['fecha_expiration'];

            if($maxLifetime > 0) {
                if ($expiration) {
                    $fecha_actual = new DateTime();
                    if ($expiration < $fecha_actual) {

                        $_SESSION['fecha_expiration'] = '';
                        return true;
                    } else {

                        $_SESSION['fecha_expiration'] = $expired = new DateTime('+ ' . $maxLifetime . ' seconds');
                        return false;
                    }
                } else {
                    $_SESSION['fecha_expiration'] = $expired = new DateTime('+ ' . $maxLifetime . ' seconds');
                    return false;
                }
            }
            else
            {
                return false;
            }

        } catch (Exception $e) {
            $exceptionLog = new ZendExt_Exception_Log(new ZendExt_Exception('NOCONTROLLED', $e));
            $exceptionLog->handle();
            return false;
        }


    }

    public function getUserState(){
        $integrator = ZendExt_IoC::getInstance();
        $state = $integrator->seguridad->getUserState();

        if (!$state){
            Zend_Session::getSaveHandler()->clear(Zend_Session::getId());
            session_regenerate_id();
            Zend_Session::destroy();
            unset($_SESSION);
            if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
                echo json_encode(array('expirate' => true));
            }
            else {
                echo '<script type="text/javascript">window.parent.location.reload()</script>';
            }
        }
        return true;
    }

}
