<?php

/**
 * ZendExt_Aspect_Trace
 *
 * Aspecto de gestion de trazas de seguridad.
 *
 * @author     : Equipo de seguridad UCID
 * @copyright  UCID
 * @package    : ZendExt
 * @subpackage ZendExt_Aspect
 * @version    2.0.0
 */
class ZendExt_Aspect_Trace implements ZendExt_Aspect_ISinglenton
{

    private $_startScriptRuntime = 0;
    private $_endScriptRuntime = 0;
    private $_memory;
    private $trace_bag = array(1);
    /**
     * Instancia del Xml de config de las trazas.
     *
     * @var SimpleXmlElement.
     */
    private $_xml;
    const BEGIN_TRACE = "ZendExt_Trace_Container_Action";
    const EXCEPTION_TRACE = "ZendExt_Trace_Container_Exception";
    const IOC_TRACE = "ZendExt_Trace_Container_IoC";
    const AUTHENTICATION_TRACE = "ZendExt_Trace_Container_Autentication";
    const FALLO_AUTHENTICATION_TRACE = "ZendExt_Trace_Container_FalloAutenticacion";
    const CIERRE_SESSION_TRACE = "ZendExt_Trace_Container_CierreSesion";
    const FALLO_AUTHORIZATION_TRACE = "ZendExt_Trace_Container_FalloAutorizacion";
    const AUTHORIZATION_TRACE = "ZendExt_Trace_Container_Autorizacion";
    const BLOQUEO_TRACE = "ZendExt_Trace_Container_Block";

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {
        $register = Zend_Registry::getInstance();
        if (self::getEnviroment($register)) {
            try {
                $_taskRunner = new Amqp_Task_Mgr();
            } catch (Exception $e) {
                $e = new ZendExt_Exception('TRACE002', $e, null);
                $e->handle();
                exit;
            }
        }
        $this->_xml = ZendExt_FastResponse:: getXML('traceconfig');
    }

    private function pushTrace($params)
    {
        $className = $params[0]; //Obtengo el nombre de la clase del contenedor
        $tmp = $this->_xml->containers->$className; //Busco su rama dentro del Xml de trazas

        $enabled = (int)$tmp ['enabled'];
        if ($enabled && $className == self::BEGIN_TRACE) {
            $this->trace_bag[0] = $params;
        } else if ($enabled) {
            array_push($this->trace_bag, $params);
        }
    }

    static public function getInstance()
    {

        static $instance;
        if (!isset($instance)) {
            $instance = new self ();
        }
        return $instance;
    }

    /**
     * Salva de las trazas de inicio de accion
     *
     * @return void
     */
    public function beginTraceAction()
    {
        $this->script_runtime();
        $frontController = Zend_Controller_Front::getInstance();
        $controller = $frontController->getRequest()->getControllerName();
        $action = $frontController->getRequest()->getActionName();
        $register = Zend_Registry::getInstance();
        $global = ZendExt_GlobalConcept::getInstance();
        $exectime = $this->_endScriptRuntime;
        $memory = (memory_get_usage() - $this->_memory) / 1048576;
        $user = $global->Perfil->usuario;
        $categoria = 2; //($global->Subsistema->idsubsistema) ? $global->Subsistema->idsubsistema : 0;
        //FIXME Es incorrecto consultardesde aqui porque se supone que el modulo de trazas esta en un servidor aparte
        //$desc = HisTrazaModel::getDescription($controller, $action);
        //$desc =  $desc[0]['descripcion'];
        $desc = "Descripción: " . $controller." | " . $action;//$desc[0]['descripcion'];
        //$desc =  $controller."|" . $action;//$desc[0]['descripcion'];
        //        $referencia = $_SERVER['REQUEST_SCHEME']."://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $referencia = explode('?', $_SERVER['HTTP_REFERER']);
        $referencia = $referencia[0];
        $this->pushTrace(array("ZendExt_Trace_Container_Action",
            $action, $controller, $desc, $exectime, $memory, $referencia, $user,
            ZendExt_App::ipRealPcCliente(), session_id(), $global->Subsistema->denomsubsistema, $categoria
        ));
        $this->_memory = memory_get_usage();
    }


    /**
     * Salva de las trazas de fin de accion
     *
     * @return void
     */
    public function endTraceAction()
    {
        $register = Zend_Registry::getInstance();
        $haveAction = true;
        $traceLogObj = TraceLog::getInstance();
        $this->script_runtime();
        $exectime = $this->_endScriptRuntime;
        $memory = (memory_get_usage() - $this->memory) / 1048576;
        if (!is_array($this->trace_bag[0])) {
            array_shift($this->trace_bag);
            $haveAction = false;
        }
        $arrayOfContainer = array();
        $enviroment = self::getEnviroment($register);
        $i = 0;
        foreach ($this->trace_bag as $trace) {
            switch ($trace[0]) {
                case self::BEGIN_TRACE:
                    $this->trace_bag[$i][4] = $trace[4] = $exectime;
                    $this->trace_bag[$i][5] = $trace[5] = $memory;
                    if (!$enviroment) {
                        $traceContainer = $traceLogObj->beginTrace(
                            $trace[1], $trace[2], $trace[3], $trace[4], $trace[5], $trace[6], $trace[7], $trace[8], $trace[9],
                            $trace[10], $trace[11]
                        );
                        if ($haveAction)
                            $arrayOfContainer[0] = $traceContainer;
                        else
                            $arrayOfContainer[] = $traceContainer;
                    }
                    break;
                case self::EXCEPTION_TRACE:
                    if (!$enviroment) {
                        $traceContainer = $traceLogObj->exceptionTrace(
                            $trace[1], $trace[2], $trace[3], $trace[4], $trace[5], $trace[6], $trace[7], $trace[8], $trace[9],
                            $trace[10], $trace[11], $trace[12]
                        );
                        if ($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    }
                    break;
                case self::IOC_TRACE:
                    $this->trace_bag[$i][11] = $trace[11] = $exectime;
                    $this->trace_bag[$i][12] = $trace[12] = $memory;
                    if (!$enviroment) {
                        $traceContainer = $traceLogObj->beginTraceIoC(
                            $trace[1], $trace[2], $trace[3], $trace[4], $trace[5], $trace[6], $trace[7], $trace[8], $trace[9],
                            $trace[10], $trace[11], $trace[12], $trace[13]
                        );
                        if ($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    }
                    break;
                case self::AUTHENTICATION_TRACE:
                    if (!$enviroment) {
//                        $traceContainer = $traceLogObj->traceAutenticacion(
//                            $trace[1], $trace[2], $trace[3], $trace[4], $trace[5], $trace[6]
//                        );
//                        if ($haveAction)
//                            $arrayOfContainer[0]->addChildren($traceContainer);
//                        else
//                            $arrayOfContainer[] = $traceContainer;
                    }
                    break;
                case self::CIERRE_SESSION_TRACE:
                    if (!$enviroment) {
                        $traceContainer = $traceLogObj->traceCierreSesion(
                            $trace[1], $trace[2], $trace[3], $trace[4], $trace[5], $trace[6]
                        );
                        if ($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    }
                    break;
                case self::FALLO_AUTHORIZATION_TRACE:
                    if (!$enviroment) {
                        $traceContainer = $traceLogObj->traceAutoritationFaild(
                            $trace[1], $trace[2], $trace[3], $trace[4], $trace[5], $trace[6]
                        );
                        if ($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    }
                    break;
                case self::AUTHORIZATION_TRACE:
                    if (!$enviroment) {
                        $traceContainer = $traceLogObj->traceAutoritation(
                            $trace[1], $trace[2], $trace[3], $trace[4], $trace[5], $trace[6]
                        );
                        if ($haveAction)
                            $arrayOfContainer[0]->addChildren($traceContainer);
                        else
                            $arrayOfContainer[] = $traceContainer;
                    }
                    break;
            }
            $i++;
        }
        if ($enviroment) {
            try {
                $json = base64_encode(json_encode($this->trace_bag));
                $_taskRunner = new Amqp_Task_Mgr();
                $_taskRunner->runTask("trace", array($json));
            } catch (Exception $e) {
                $e = new ZendExt_Exception('TRACE002', $e, null);
                $e->handle();
                exit;
            }
        } else {
            foreach ($arrayOfContainer as $container) {
                $traceLogObj->saveFromTree($container);
            }
        }

    }

    /**
     * Salva las trazas de fallo de la accion
     *
     */
    public function failedTraceAction(Exception $e = null)
    {

        if (!($e instanceof ZendExt_Exception)) {
            $e = new ZendExt_Exception('NOCONTROLLED', $e);
        }
        $this->_startScriptRuntime = 0;
        $this->_endScriptRuntime = 0;
        $global = ZendExt_GlobalConcept::getInstance();
        $frontController = Zend_Controller_Front::getInstance();
        $controller = (is_object($frontController->getRequest())) ? $frontController->getRequest()->getControllerName() : 'index';
        $action = (is_object($frontController->getRequest())) ? $frontController->getRequest()->getActionName() : 'index';
        $register = Zend_Registry::getInstance();
        $moduleReference = $register->config->module_reference;
//        $referencia = $_SERVER['REQUEST_SCHEME']."://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $referencia = explode('?', $_SERVER['HTTP_REFERER']);
        $referencia = $referencia[0];
        $categoria = 1;//($global->Subsistema->idsubsistema) ? $global->Subsistema->idsubsistema : 0;
        $user = $global->Perfil->usuario;
        $exectime = $this->_endScriptRuntime;
        $memory = (memory_get_usage() - $this->_memory) / 1048576;
        $pDescripcion = ' descripcion de accion excepcion';

        $codeExc = $e->getIdException();
        $typeExc = $e->getType();
        $langExc = $global->Perfil->idioma;
        $msgExc = $e->getDescription();
        $descExc = $e->getMessage();
        $traceExc = $e->getTraceAsString();
        $this->pushTrace(array("ZendExt_Trace_Container_Action",
            $controller, $action, $pDescripcion, $exectime, $memory, $referencia, $user,
            ZendExt_App::ipRealPcCliente(), session_id(), $global->Subsistema->denomsubsistema, $categoria
        ));
        $this->pushTrace(array("ZendExt_Trace_Container_Exception",
            $codeExc, $typeExc, $langExc, $msgExc, $descExc, $traceExc, $referencia, $user,
            ZendExt_App::ipRealPcCliente(), session_id(), $global->Subsistema->denomsubsistema, $categoria
        ));
    }

    /**
     * Salva las trazas de excepciones
     *
     * @param ZendExt_Exception $exception
     *
     * @return void
     */
    public function exceptionTraceAction($exception)
    {
        $className = "ZendExt_Trace_Container_Exception";
        $tmp = $this->_xml->containers->$className;
        $enabled = (int)$tmp ['enabled'];
        if ($enabled) {
            $code = $exception->getIdException();
            $type = $exception->getType();
            $register = Zend_Registry::getInstance();
            $global = ZendExt_GlobalConcept::getInstance();
            $langExc = $global->Perfil->idioma;
            $mensaje = $exception->getMessage();
            $descripcion = (string)$exception->getDescription();
            $global = ZendExt_GlobalConcept::getInstance();
            $enviroment = self::getEnviroment($register);
            $traceLogObj = TraceLog::getInstance();
            $tipoTraza = 3; //3 es la traza de excepcion, para mas info la table mod_traza.nom_tipotraza
            $log = ($exception->getInnerException()==NULL)?"": $exception->getInnerException();
            $this->script_runtime();
            $exectime = $this->_endScriptRuntime;
            $memory = (memory_get_usage() - $this->_memory) / 1048576;
            $ref = explode('?', $_SERVER['HTTP_REFERER']);
            $ref = $ref[0];
            $user = $global->Perfil->usuario;
            $categoria = 1;  // mod_traza.nom_categoriatraza 2 corresponde a al tipo "Trazas del sistema"
            if ($enviroment) {
                try {
                    $json = base64_encode(json_encode(array(array("ZendExt_Trace_Container_Exception",
                        $code, $type, $langExc, $mensaje, $descripcion, $log, "", $user, ZendExt_App::ipRealPcCliente(), session_id(), "Exception", $tipoTraza
                    ))));
                    $_taskRunner = new Amqp_Task_Mgr();
                    $_taskRunner->runTask("trace", array($json));
                } catch (Exception $e) {
                    $e = new ZendExt_Exception('TRACE002', $e, null);
                    $e->handle();
                    exit;
                }
            } else {
                $traceContainer = $traceLogObj->beginTrace(
                    "",
                    "",
                    "",
                    $exectime,
                    $memory,
                    $ref,
                    $user,
                    ZendExt_App::ipRealPcCliente(),
                    session_id(),
                    "Exception",
                    $categoria
                );
                $arrayOfContainer[0] = $traceContainer;
                $arrayOfContainer[0]->addChildren($traceLogObj->exceptionTrace(
                    $code, $type, $langExc, $mensaje, $descripcion, $log, "", $user, ZendExt_App::ipRealPcCliente(), session_id(), "Exception", $categoria));
                foreach ($arrayOfContainer as $container) {
                    $traceLogObj->saveFromTree($container);
                }
            }
        }
    }

    /**
     * Funcion usada para salvar las trazas de integracion.
     *
     * @param string $targetComponent Componente destino
     * @param string $class Clase que implementa el servicio.
     * @param string $method Servicio.
     * @param string $iocType Tipo de IoC.
     *
     * @return void
     */
    public function beginTraceIoC($targetComponent, $class, $method, $iocType)
    {

        $sourceComponent = Zend_Registry::get('config')->module_name;
        $register = Zend_Registry::getInstance();
        $global = ZendExt_GlobalConcept::getInstance();
        $usuario = $global->Perfil->usuario;
        $request = Zend_Controller_Front::getInstance()->getRequest();
        $this->script_runtime();
        $exectime = $this->_endScriptRuntime;
        $memory = (memory_get_usage() - $this->_memory) / 1048576;
        if ($request) {
            $action = $request->getActionName();
            $controller = $request->getControllerName();
        } else {
            $action = 'framework';
            $controller = 'framework';
        }
        $categoria = 2;//($global->Subsistema->idsubsistema) ? $global->Subsistema->idsubsistema : 0;
//        $reference = $_SERVER['REQUEST_SCHEME']."://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $reference = explode('?', isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "");
        $reference = $reference[0];
        $state = ($iocType == 'ioc') ? true : false;
        $ipReal = ZendExt_App::ipRealPcCliente();
        $this->pushTrace(array("ZendExt_Trace_Container_IoC",
            $state, $sourceComponent, $targetComponent, $class, $method,
            $reference, $usuario, isset($ipReal) ? $ipReal : "",
            session_id(), $global->Subsistema->denomsubsistema,
            $exectime, $memory, $categoria
        ));
        $this->_memory = memory_get_usage();
    }

    /**
     * Salva las trazas de autenticacion
     */
    public function traceAutenticacion()
    {

        $className = "ZendExt_Trace_Container_Autentication";
        $tmp = $this->_xml->containers->$className;
        $enabled = (int)$tmp ['enabled'];
        if ($enabled) {
            $global = ZendExt_GlobalConcept::getInstance();
            $register = Zend_Registry::getInstance();
            $uo=$_SESSION["unidadorganizativa"];
            $request = Zend_Controller_Front::getInstance()->getRequest();
            $enviroment = self::getEnviroment($register);
            $traceLogObj = TraceLog::getInstance();
            $referencia = explode('?', $_SERVER['HTTP_REFERER']);
            $referencia = $referencia[0];
            $tipoTraza = 8; //8 es la traza de autenticacion, para mas info la table mod_traza.nom_tipotraza
            $this->script_runtime();
            $exectime = $this->_endScriptRuntime;
            $memory = (memory_get_usage() - $this->_memory) / 1048576;
            $categoria = 2;  // mod_traza.nom_categoriatraza 2 corresponde a al tipo "Trazas del usuario"
            //$user = $global->Perfil->usuario; //Da usuario anonimo
            $user = $_SESSION["Quarseg"]["SP"]["authData"]["usuario"];
            if ($enviroment) {
                try {
                    $json = base64_encode(json_encode(array(array("ZendExt_Trace_Container_Autentication",
                        $tipoTraza,
                        $user, ZendExt_App::ipRealPcCliente(), session_id(),
                        $global->Subsistema->denomsubsistema,
                        $categoria
                    ))));
                    $_taskRunner = new Amqp_Task_Mgr();
                    $_taskRunner->runTask("trace", array($json));
                } catch (Exception $e) {
                    $e = new ZendExt_Exception('TRACE002', $e, null);
                    $e->handle();
                    exit;
                }
            } else {

                $traceContainer = $traceLogObj->beginTrace(
                    "Controller",
                    "Action",
                    "",
                    $exectime,
                    $memory,
                    $referencia,
                    $user,
                    ZendExt_App::ipRealPcCliente(),
                    session_id(),
                    $global->Subsistema->denomsubsistema,
                    $categoria
                );

                $arrayOfContainer[0] = $traceContainer;

                $arrayOfContainer[0]->addChildren($traceLogObj->traceAutenticacion($referencia,
                    $user, ZendExt_App::ipRealPcCliente(), session_id(),
                    $global->Subsistema->denomsubsistema,
                    $categoria, $uo
                ));

                foreach ($arrayOfContainer as $container) {
                    $traceLogObj->saveFromTree($container);
                }
            }
        }


        $register = Zend_Registry::getInstance();
        $ipPc = ZendExt_App::ipRealPcCliente();
        $user = 'anonimo';
        $global = ZendExt_GlobalConcept::getInstance();
        if (isset($_SERVER['PHP_AUTH_USER'])) {
            $user = $_SERVER['PHP_AUTH_USER'];
        } else {
            $securitySession = new Zend_Session_Namespace('Quarseg');
            $user = (isset($securitySession->usuario)) ? $securitySession->usuario : $securitySession->perfil->usuario;
        }
//        $ref = $_SERVER['REQUEST_SCHEME']."://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $ref = explode('?', $_SERVER['HTTP_REFERER']);
        $ref = $ref[0];
        $categoria = 1;// ($global->Subsistema->idsubsistema) ? $global->Subsistema->idsubsistema : 0;
        $this->pushTrace(array("ZendExt_Trace_Container_Autentication",
            $ref, $user, ZendExt_App::ipRealPcCliente(), session_id(), $global->Subsistema->denomsubsistema, $categoria
        ));
    }

    /**
     * Salva las trazas de Fallo de autenticacion
     */
    public function traceFalloAutenticacion()
    {
        $className = "ZendExt_Trace_Container_FalloAutenticacion";
        $tmp = $this->_xml->containers->$className;
        $enabled = (int)$tmp ['enabled'];
        if ($enabled) {
            $register = Zend_Registry::getInstance();
            $enviroment = self::getEnviroment($register);
            $global = ZendExt_GlobalConcept::getInstance();
            $uo = $_SESSION["unidadorganizativa"];
            $traceLogObj = TraceLog::getInstance();
            $usuario = 'anonimo';
            $tipoTraza = 2; //2 es la traza de fallo de autenticacion, para mas info la table mod_traza.nom_tipotraza
            $ref = explode('?', $_SERVER['HTTP_REFERER']);
            $ref = $ref[0];
            $request = Zend_Controller_Front::getInstance()->getRequest();
            $params = $request->getParams();
            $this->script_runtime();
            $exectime = $this->_endScriptRuntime;
            $memory = (memory_get_usage() - $this->_memory) / 1048576;


            if ($enviroment) {
                try {
                    $json = base64_encode(json_encode(array(array("ZendExt_Trace_Container_FalloAutenticacion",
                        $usuario, $ref, $usuario, ZendExt_App::ipRealPcCliente(),
                        session_id(), $global->Subsistema->denomsubsistema, $tipoTraza
                    ))));
                    $_taskRunner = new Amqp_Task_Mgr();
                    $_taskRunner->runTask("trace", array($json));
                } catch (Exception $e) {
                    $e = new ZendExt_Exception('TRACE002', $e, null);
                    $e->handle();
                    exit;
                }
            } else {
                $traceContainer = $traceLogObj->beginTrace(
                    $params["controller"],
                    $params["action"],
                    "",
                    $exectime,
                    $memory,
                    $ref,
                    $params["username"],
                    ZendExt_App::ipRealPcCliente(),
                    session_id(),
                    "Proveedor de identidad",
                    $tipoTraza
                );
                $arrayOfContainer[0] = $traceContainer;
                $arrayOfContainer[0]->addChildren($traceLogObj->traceFalloautenticacionLog(
                    $params["username"], $ref, $params["username"], ZendExt_App::ipRealPcCliente(),
                    session_id(), "Proveedor de identidad", $tipoTraza, $uo
                ));

                foreach ($arrayOfContainer as $container) {
                    $traceLogObj->saveFromTree($container);
                }

            }
        }
    }

    /**
     * Salva las trazas de cierre de seccion
     *
     * @param ZendExt_Exception $exception
     */
    public function traceCierreSesion()
    {
        $register = Zend_Registry::getInstance();
        $global = ZendExt_GlobalConcept::getInstance();
        $user = $global->Perfil->usuario;
        $categoria = 2;//($global->Subsistema->idsubsistema) ? $global->Subsistema->idsubsistema : 0;
//        $ref = $_SERVER['REQUEST_SCHEME']."://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $ref = explode('?', $_SERVER['HTTP_REFERER']);
        $ref = $ref[0];
        $this->pushTrace(array("ZendExt_Trace_Container_CierreSesion",
            $ref, $user, ZendExt_App::ipRealPcCliente(), session_id(),
            $global->Subsistema->denomsubsistema, $categoria
        ));
    }

    public function traceFalloAutorizacion()
    {
        $register = Zend_Registry::getInstance();
        $global = ZendExt_GlobalConcept::getInstance();
        $enviroment = self::getEnviroment($register);
        $traceLogObj = TraceLog::getInstance();
        $user = $global->Perfil->usuario;
        $categoria = 1;//($global->Subsistema->idsubsistema) ? $global->Subsistema->idsubsistema : 0;
//        $referencia = $_SERVER['REQUEST_SCHEME']."://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $referencia = explode('?', $_SERVER['HTTP_REFERER']);
        $referencia = $referencia[0];

        if ($enviroment) {
            try {
                $json = base64_encode(json_encode(array(array("ZendExt_Trace_Container_FalloAutorizacion",
                    $referencia, $user, ZendExt_App::ipRealPcCliente(), session_id(),
                    $global->Subsistema->denomsubsistema, $categoria
                ))));
                $_taskRunner = new Amqp_Task_Mgr();
                $_taskRunner->runTask("trace", array($json));
            } catch (Exception $e) {
                $e = new ZendExt_Exception('TRACE002', $e, null);
                $e->handle();
                exit;
            }
        } else {
            $traceLogObj->traceAutoritationFaild(
                $referencia, $user, ZendExt_App::ipRealPcCliente(), session_id(),
                $global->Subsistema->denomsubsistema, $categoria
            );
        }
    }

    public function traceAutorizacion()
    {

        $register = Zend_Registry::getInstance();
        $global = ZendExt_GlobalConcept::getInstance();
        $user = $global->Perfil->usuario;
        $categoria = 1;//($global->Subsistema->idsubsistema) ? $global->Subsistema->idsubsistema : 0;
//        $referencia = $_SERVER['REQUEST_SCHEME']."://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $referencia = explode('?', $_SERVER['HTTP_REFERER']);
        $referencia = $referencia[0];
        $this->pushTrace(array("ZendExt_Trace_Container_Autorizacion",
            $referencia, $user, ZendExt_App::ipRealPcCliente(), session_id(),
            $global->Subsistema->denomsubsistema, $categoria
        ));
    }

    /**
     * Para guardar una traza de tipo bloqueo
     * @param $tipo_bloqueo 1 -- bloqueo por ip  2 -- bloqueo por usuario   3 -- bloqueo por usuario y por ip
     */
    public function traceBloqueo($tipo_bloqueo)
    {

        $className = "ZendExt_Trace_Container_Block";
        $tmp = $this->_xml->containers->$className;
        $enabled = (int)$tmp ['enabled'];
        if ($enabled) {
            $register = Zend_Registry::getInstance();
            $request = Zend_Controller_Front::getInstance()->getRequest();
            $uo = $_SESSION["unidadorganizativa"];
            $enviroment = self::getEnviroment($register);
            $traceLogObj = TraceLog::getInstance();
            $referencia = explode('?', $_SERVER['HTTP_REFERER']);
            $referencia = $referencia[0];
            $tipoTraza = 4; //4 es la traza de bloqueo, para mas info la table mod_traza.nom_tipotraza
            $params = $request->getParams();
            $this->script_runtime();
            $exectime = $this->_endScriptRuntime;
            $memory = (memory_get_usage() - $this->_memory) / 1048576;
            $categoria = 2;  // mod_traza.nom_categoriatraza 2 corresponde a al tipo "Trazas del usuario"
            if ($enviroment) {
                try {
                    $json = base64_encode(json_encode(array(array("ZendExt_Trace_Container_Block",
                        $referencia, $params["username"], ZendExt_App::ipRealPcCliente(), session_id(), "Proveedor de identidad",
                        $tipo_bloqueo, $tipoTraza, $tipoTraza
                    ))));
                    $_taskRunner = new Amqp_Task_Mgr();
                    $_taskRunner->runTask("trace", array($json));
                } catch (Exception $e) {
                    $e = new ZendExt_Exception('TRACE002', $e, null);
                    $e->handle();
                    exit;
                }
            } else {

                $traceContainer = $traceLogObj->beginTrace(
                    $params["controller"],
                    $params["action"],
                    "",
                    $exectime,
                    $memory,
                    $referencia,
                    $params["username"],
                    ZendExt_App::ipRealPcCliente(),
                    session_id(),
                    "Proveedor de identidad",
                    $categoria
                );

                $arrayOfContainer[0] = $traceContainer;

                $arrayOfContainer[0]->addChildren($traceLogObj->traceBlock(
                    $tipo_bloqueo, $categoria, $referencia, $params["username"], ZendExt_App::ipRealPcCliente(), session_id(),
                    "Proveedor de identidad", $uo
                ));

                foreach ($arrayOfContainer as $container) {
                    $traceLogObj->saveFromTree($container);
                }
            }
        }

    }

    /**
     * Funcion usada para obtener la configuracion del entorno de las trazas.
     *
     * @param Zend_Registry $register Registro global de objetos
     *
     * @return Zend_Config_Ini Objeto de configuracion.
     */
    private static function getEnviroment($register)
    {
        $config = new Zend_Config_Ini($register->config->security_config, 'trace');
        return $config->background;
    }

    /**
     * Funcion para el calculo del tiempo de ejecucion de la accion
     *
     * @return void
     */
    private function script_runtime($round = 20)
    {
        //Check to see if the global is already set
        if ($this->_startScriptRuntime != 0) {
            //The global was set. So, get the current microtime and explode it into an array.
            list($msec, $sec) = explode(" ", microtime());
            $this->_endScriptRuntime = round(($sec + $msec) - $this->_startScriptRuntime, $round);
        } else {
            // The global was not set. Create it!
            list($msec, $sec) = explode(" ", microtime());
            $this->_startScriptRuntime = $sec + $msec;
        }
    }

}
