<?php

/**
 * ZendExt_App
 *
 * Gestor de la aplicacion integrado con el SIGES (SGIS).
 *
 * @author    Yoandry Morejon Borbon
 * @package   ZendExt
 * @copyright UCID-ERP Cuba
 * @version   1.0-0
 */
class ZendExt_App
{

    /**
     * Gestor de configuracion del framework
     *
     * @var Zend_Config
     */
    protected $_config;
    /**
     * Gestor del registro unico de objetos, arreglos, textos, ...
     *
     * @var Zend_Register
     */
    protected $_register;
    /**
     * Gestor de sessiones
     *
     * @var Zend_Session_Namespace
     */
    protected $_session;
    /**
     * Controlador frontal
     *
     * @var Zend_Controller_Front
     */
    protected $_frontController;
    /**
     * Conexion a la Base de Datos
     *
     * @var Doctrine_Connection
     */
    protected $_conexion;
    /**
     * Directorio de controladores externos
     *
     * @var array of array of string
     */
    protected $_controllerArray = array();
    /**
     * Perfil del usuario que se accedio al sistema
     *
     * @var array
     */
    protected $_perfil;
    /**
     * Peticion o solicitud al servidor web
     *
     * Zend_Controller_Request_Abstract
     */
    protected $_request;

    /**
     * Indica si es necesario autenticacion para acceder al recurso solicitado
     *
     * Zend_Controller_Request_Abstract
     */
    protected $_isUnAuthenticatedResource = false;

    /**
     * Muestra la ventana de autenticacion por HTTP
     *
     * @return void
     */
    protected function showLogonWindow()
    {
        //Se muetra la ventana de autenticacion.
        header('WWW-Authenticate: Basic realm="SIGES"');
        //Si cancela la autenticacion se muestra un mensaje de acceso denegado
        header('HTTP/1.0 401 Unauthorized');
        die('<h1 style="color:#FF0000">Acceso denegado</h1>');
    }

    /**
     * Inicializa la aplicacion y controla las excepciones disparadas por el sistema
     *
     * @param array $config - arreglo con la configuracion de la aplicacion
     *
     * @throws ZendExt_Exception - dispara las excepciones no controladas en tiempo de desarrollo.
     * @return void
     */
    public function init($config, $idapp = 0)
    {
        try {
            $this->initApp($config);
        } catch (ZendExt_Exception $e) {
            $e->handle();
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
    protected function initApp($config)
    {
        try {
            //Se inicializa el registro
            $this->initRegister();
            //Se inicializa la configuracion de la aplicacion
            $this->initConfig($config);
            //Se inicializa la configuracion de la session
            $this->initSession(); //Aspect OKP
            //Se inicializa la conexion
            $this->initConexion(); //Aspect OKP

            $this->initSAML();
            //Se chequea la seguridad de la aplicacion
            $this->checkSecurity(); //Aspect OKP
            //Se inicializa el controlador frontal
            $this->initFrontController();
            //Se actualiza el registro
            $this->updateRegister();
            //Se inicializa el perfil del usuario
            if (Zend_Registry::getInstance()->session->certificado) {
                $this->initPerfil();
            } //Aspect OKP
            //Se intenta cargar el controlador solicitado
            if (Zend_Registry::getInstance()->session->certificado || $this->_isUnAuthenticatedResource) {
                $this->_frontController->dispatch();
            }
        } catch (Exception $e) { //Si se captura una excepcion
            //Si la excepcion capturada es de ZendExt
            if ($e instanceof ZendExt_Exception) {
                $e->handle();//Se dispara la excepcion
            } else { //Si es una excepcion no controlada
                $e = new ZendExt_Exception('NOCONTROLLED', $e); //Se dispara una excepcion controlada
                $aspectxml = ZendExt_FastResponse::getXML('aspect');
                if ($aspectxml->failedTraceAction['active'] == 'true') {
                    ZendExt_Aspect_Trace::getInstance()->failedTraceAction($e);
                }
                throw $e;
            }
        }
    }

    /**
     * Inicializa la instalacion de la aplicacion
     *
     * @param array $config - arreglo con la configuracion de instalacion de la aplicacion
     *
     * @throws ZendExt_Exception - dispara las excepciones no controladas en tiempo de desarrollo.
     * @return void
     */
    public function initInstalacion($config)
    {
        try {
            $this->initRegister();
            $this->initConfigInstalacion($config);
            //$this->initSession();
            $this->initFrontController();
            $this->_frontController->dispatch();
        } catch (Exception $e) {
            //Si la excepcion capturada es de ZendExt
            if ($e instanceof ZendExt_Exception) {
                $e->handle(); //Se dispara la excepcion
            } else { //Si es una excepcion no controlada
                $e = new ZendExt_Exception('NOCONTROLLED', $e); //Se dispara una excepcion controlada
                $aspectxml = ZendExt_FastResponse::getXML('aspect');
                if ($aspectxml->failedTraceAction['active'] == 'true') {
                    ZendExt_Aspect_Trace::getInstance()->failedTraceAction($e);
                }
                throw $e;
            }
        }
    }

    /**
     * Inicializa la configuracion de la aplicacion
     *
     * @param array $config - arreglo con la configuracion de la aplicacion
     *
     * @return void
     */
    protected function initConfig($config)
    {
        $configApp = new ZendExt_App_Config();
        $this->_config = $configApp->configApp($config);
        //Se guarda en el singelton la configuracion del framework.
        $this->_register->config = $this->_config;
    }

    /**
     * Inicializa la configuracion de instalacion de la aplicacion
     *
     * @param array $config - arreglo con la configuracion de instalacion de la aplicacion
     *
     * @return void
     */
    protected function initConfigInstalacion($config)
    {
        $configApp = new ZendExt_App_Config();
        $this->_config = $configApp->configApp($config, false);
        //Se guarda en el singelton la configuracion del framework.
        $this->_register->config = $this->_config;
    }

    /**
     * Inicializa la session del usuario
     *
     * @return void
     */
    protected function initSession()
    {
        ZendExt_Aspect_Session::getInstance()->initSession();
    }

    /**
     * Inicializa el registro unico de objetos, arreglos, ...
     *
     * @return void
     */
    protected function initRegister()
    {
        //Se crea el registro de objetos, variables y arreglos
        $this->_register = new Zend_Registry(array(), ArrayObject::ARRAY_AS_PROPS);
        //Se guarda el registro en el singelton de Registro
        //@todo revisar esto que se puso para que pincharan los servicios por SOAP
        Zend_Registry::_unsetInstance();
        //@todo fin
        Zend_Registry::setInstance($this->_register);
    }

    /**
     * Actualiza el registro unico de objetos, arreglos, ...
     *
     * @return void
     */
    protected function updateRegister()
    {
        //Se guarda en el registro la conexion activa.
        $this->_register->conexion = $this->_conexion;
    }

    /**
     * Chequea la seguridad de aplicacion
     *
     * @return void
     */
    protected function initSAML()
    {
        SAML2\Compat\ContainerSingleton::setContainer(new ZendExt_SAML_Container());
    }

    /**
     * Chequea la seguridad de aplicacion
     *
     * @return void
     */
    protected function checkSecurity()
    {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        if (!$this->isPublicResource()) {
            $security->authenticateUser();
            $security->getUserState();
            $security->verifyAccessToFunctionality();
        }
    }

    /**
     * Chequea que no sea necesaria la authenticacion para acceder al recurso
     *
     * @return boolean
     */
    protected function isPublicResource()
    {
        $register = Zend_Registry::getInstance();
        $dirXML = $register->config->xml->noAuthenticateACL;
        $ayudaXml = new SimpleXMLElement($dirXML, null, true);
        $arrayChildren = $ayudaXml->children();
        $arrayResources = array();
        foreach ($arrayChildren->SAML as $key => $resourses) {
            $arrayResources[] = (string)$resourses->attributes()->referencia;
        }
        $recurso = $_SERVER['REQUEST_URI'];
        $uri = explode('?', $recurso);
        $temp = ltrim($uri[0], '/');
        $countUriacl = count(array_intersect(array($uri[0]), $arrayResources));
        $countTempacl = count(array_intersect(array($temp), $arrayResources));
        if ($countUriacl > 0 || $countTempacl > 0) {
            $trace = ZendExt_Aspect_Trace::getInstance();
            $trace->traceAutorizacion();
            $this->_isUnAuthenticatedResource = true;
            return true;
        }
        return false;
    }

    /**
     * Inicializa el controlador frontal
     *
     * @return void
     */
    protected function initFrontController()
    {
        //Se inicia el controlador frontal.
        $this->_frontController = Zend_Controller_Front::getInstance();
        //Se obtiene la peticion o solicitud al servidor web
        $this->_request = $this->_frontController->getRequest();
        //Se activan las excepciones
        $this->_frontController->throwExceptions(true);
        //Se especifica el directorio de los controladores
        $this->_frontController->setControllerDirectory($this->_config->controllers_path);
        if (count($this->_controllerArray)) { //Si el array de controladores externos no esta vacio
            //Se adicionan los controladores externos
            foreach ($this->_controllerArray as $controller) {
                //Adiciono cada uno de los controladores
                $this->_frontController->addControllerDirectory($controller[0], $controller[1]);
            }
        }
    }

    /**
     * Inicializa la conexion a la base de datos
     *
     * @throws ZendExt_Exception - excepcion declarada en el xml de excepciones
     * @return void
     */
    protected function initConexion()
    {
        //Obtengo una instancia del administrador de transacciones
        $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
        //Creo la conexion activa
        $this->_conexion = $transactionManager->openConections(null, true);
    }

    /**
     * Adiciona un nuevo directorio de controladores
     *
     * @return void
     */
    public function addController($controllerDirectory, $moduleName)
    {
        $this->_controllerArray[] = array($controllerDirectory, $moduleName);
    }

    /**
     * initPerfil
     *
     * Inicializa el perfil del usuario
     *
     * @throws ZendExt_Exception - dispara excepcion declarada en el xml de excepciones
     * @return void
     */
    public function initPerfil()
    {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $security->getUserData();
    }


    /**
     * devolverIp
     * Retorna el ip de la PC Cliente
     *
     * @return string - IP de la PC Cliente.
     */
    static public function ipRealPcCliente()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))
            return $_SERVER['HTTP_CLIENT_IP'];

        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
            return $_SERVER['HTTP_X_FORWARDED_FOR'];

        return $_SERVER['REMOTE_ADDR'];
    }

}