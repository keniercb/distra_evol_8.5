<?php

/**
 * ZendExt_IoC
 * Integrador de servicios de negocio entre modulos
 *
 * @author    Manuel, Yoandry Morejon Borbon
 * @package   ZendExt
 * @copyright UCID-ERP Cuba
 * @version   1.0-0
 */
class ZendExt_IoC implements ZendExt_Aspect_ISinglenton
{
    /**
     * Constante para activar la simulacion del resultado a devolver
     * por el servicio solicitado en caso de error segun su contrato
     */
    const IOC_SIMULATE_RESULT = false;

    /**
     * Instancia de la clase.
     *
     * @var ZendExt_IoC
     */
    private static $instance;

    private $cache = array();

    /**
     * Nombre del modulo que brinda el servicio
     *
     * @var string
     */
    private $module;

    /**
     * Identificador del xml de IoC (ioc o iocinter).
     *
     * @var string
     */
    protected $idXMLIoC;

    /**
     * Atributo que define si se guarda la traza de integracion.
     *
     * @var bool
     */
    protected $iocTrace = false;

    /**
     * Atributo que define si se guarda la traza de excepcion de integracion.
     *
     * @var bool
     */
    protected $iocExceptionTrace = false;

    /**
     * Atributo que almacena los xml de IoC cargados.
     *
     * @var array
     */
    private static $xml;

    /**
     * Atributo que almacena el xml de expresiones regulares.
     *
     * @var array
     */
    private static $xmlexpressions;

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {
        $this->idXMLIoC = 'ioc'; $aspectxml = ZendExt_FastResponse::getXML('aspect'); $this->iocTrace = (string)$aspectxml->beginTraceIoC['active']; $this->iocExceptionTrace = 
        (string)$aspectxml->failedTraceIoC['active']; if (!isset(self::$xml)) {
            self::$xml = array();
        }
        if (!isset(self::$xml['comun'][$this->idXMLIoC])) { self::$xml['comun'][$this->idXMLIoC] = ZendExt_FastResponse::getXML($this->idXMLIoC);
        }
    }
    private function getCache( $key, $debug = false ) { if(isset($this->cache) && isset($this->cache[$key]) ){ /* file_put_contents('/var/www/data.txt', 
                $this->cache[$key].$key.chr(13)
            , FILE_APPEND); */ return $this->cache[$key];
        }
        return 'NO-DATA-CACHE-LKJHGFDS';
    }

    private function setCache( $key, $response, $data = '')
    {
        $this->cache[$key] = $response;
/*        file_put_contents('/var/www/data1.txt',
            $data.chr(13)
            , FILE_APPEND);*/
        return $response;

    }
    /**
     * Obtencion de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return ZendExt_IoC | null - Instancia de la clase
     */
    static public function getInstance()
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Funcion magica para obtener el modulo que brinda el servicio solicitado
     *
     * @param string $name - Nombre de la propiedad solicitada
     *
     * @return ZendExt_IoC | null - Instancia de la clase
     */
    public function __get($name)
    {
        $this->module = $name;
        return $this;
    }

    /**
     * Funcion magica para obtener el servicio solicitado, obtener los
     * parametros y executarlo segun la descripcion del mismo en el xml
     * de integracion (ioc.xml)
     *
     * @param string $service - Nombre del servicio solicitado
     * @param array  $params  - Parametros que necesita el servicio
     *
     * @return unknow - Desconocido
     */
    public function __call($service, $params)
    {


        if ($this->module) {


            $tmp=$this->module;
            // Chequear la cache de datos
            $cache = $this->getCache( md5($tmp.$service. serialize( $params)));
            if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
                return $cache;

            $xml = $this->getXML($this->idXMLIoC, $this->module);
            $xmlservice = $xml->{$this->module}->$service;
            if (!$xmlservice) {
                $this->Exception(null, 'IOC001');
            }
            $count = 0;
            $cadParams = '';
            foreach ($xmlservice->prototipo->parametro as $xmlparam) {
                $params[$count] = isset($params[$count]) ? $params[$count] : 0;
                if ($this->Validate($xmlparam, $params[$count]) === false && !$xmlparam['default']) {
                    $this->Exception(null, 'IOC002');
                }
                if ($count) {
                    $cadParams .= ',';
                }

                if (!$params[$count] && $xmlparam['default']) {
                    $params[$count] = (string)$xmlparam['default'];
                }
                $count++;
            }
            $xmlresult = $xmlservice->prototipo->resultado;
            $class = utf8_encode($xmlservice->inyector['clase']);
            $method = utf8_encode($xmlservice->inyector['metodo']);
            if ($this->iocTrace == 'true') {
                $trace = ZendExt_Aspect_Trace::getInstance();
                $trace->beginTraceIoC($tmp, $class, $method, $this->idXMLIoC);
            }
            $this->module = $tmp;
            $referenceComp = $this->getRefenceComp($xml, $service);
            $this->setIncludePath($referenceComp);

            if (@class_exists($class)) {
                $doctrineManager = Doctrine_Manager::getInstance();
                try {
                    $conn = $doctrineManager->getConnection($tmp);
                } catch (Doctrine_Manager_Exception $e) {
                    $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
                    $configApp = new ZendExt_App_Config();
                    $configApp->addBdToConfig($tmp, $referenceComp);
                    $conn = $transactionManager->openConections($tmp);
                }
                $activeconn = $doctrineManager->getCurrentConnection()->getName();
                $doctrineManager->setCurrentConnection($tmp);
                $moduletmp = $tmp;
                $this->module = null;
                $objService = new $class();
                if (method_exists($objService, 'initConnection')) {
                    $objService->initConnection($moduletmp);
                } elseif (method_exists($objService, 'setModule')) {
                    $objService->setModule($moduletmp);
                }
                if (method_exists($objService, $method)) {
                    $result = null;
                    try {
                        $config = Zend_Registry::getInstance()->config;
                        $tempModuleReference = $config->module_reference;
                        $config->module_reference = $referenceComp;
                        $result = call_user_func_array(array($objService, $method), $params);
                        $config->module_reference = $tempModuleReference;
                        $doctrineManager->setCurrentConnection($activeconn);
                    } catch (Exception $ee) {
                        $config->module_reference = $tempModuleReference;
                        if ($this->iocExceptionTrace == 'true') {
                            if ($ee instanceof ZendExt_Exception) {
                                $e = $ee;
                            } else { //Si es una excepcion no controlada

                                $e = new ZendExt_Exception('NOCONTROLLED', $ee);
                            }
                            $this->traceIoCException($e, $class, $method, $moduletmp);
                        }
                        if (!self::IOC_SIMULATE_RESULT) {
                            throw $ee;
                        } elseif ($xmlresult) {
                            $doctrineManager->setCurrentConnection($activeconn);
                            return $this->setCache(md5($tmp.$service. serialize( $params)), $this->simulateResult($xmlresult),$tmp.'-'.$service.'-'. serialize( $params)) ;
                        }
                    }
                    if ($xmlresult) {
                        if (!$this->Validate($xmlresult, $result)) {
                            if (!self::IOC_SIMULATE_RESULT) {
                                $this->Exception(null, 'IOC005');
                            } else {
                                return $this->setCache(md5($tmp.$service. serialize( $params)), $this->simulateResult($xmlresult));
                            }
                        }
                        return $this->setCache(md5($tmp.$service. serialize( $params)), $result,$tmp.'-'.$service.'-'. serialize( $params)) ;
                    }
                } elseif (!self::IOC_SIMULATE_RESULT) {
                    $this->Exception(null, 'IOC004');
                } elseif ($xmlresult) {
                    $doctrineManager->setCurrentConnection($activeconn);
                    return $this->setCache(md5($tmp.$service. serialize( $params)), $this->simulateResult($xmlresult));
                }
            } elseif (!self::IOC_SIMULATE_RESULT) {
                $this->Exception(null, 'IOC003');
            } elseif ($xmlresult) {
                return $this->setCache(md5($tmp.$service. serialize( $params)), $this->simulateResult($xmlresult));
            }
        }
    }

    /**
     * Obtener un xml segun el identificador
     *
     * @param string $xmlname - Nombre o identificador del xml
     *
     * @return SimpleXMLElement - Objeto de tipo xml
     */
    public function getXML($xmlname, $module = null)
    {
        $key = md5($xmlname.$module);
        $cache = $this->getCache($key);
        if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
            return $cache;

        if (is_null($module)) {
            return self::$xml['comun'][$xmlname];
        }
        if (!isset(self::$xml[$module])) {
            self::$xml[$module] = array();
        }

        if (!isset(self::$xml[$module][$xmlname])) {
            $dirAplication = Zend_Registry::getInstance()->config->dir_aplication;
            $xml = self::$xml['comun'][$xmlname]->$module;
            $dirXml = $dirAplication . $xml['src'];

            if (file_exists($dirXml) && is_file($dirXml)) {
                self::$xml[$module][$xmlname] = @simplexml_load_file($dirXml);
                if (!self::$xml[$module][$xmlname] instanceof SimpleXMLElement) {
                    throw new ZendExt_FastResponse_Exception($xmlname, true);
                }
            } else {
                throw new ZendExt_FastResponse_Exception($xmlname, false);
            }
        }
        return $this->setCache( $key, self::$xml[$module][$xmlname]);
    }


    /**
     * Saber si existe un servicio determinado
     *
     * @param string $module - Nombre o identificador del modulo
     *
     * @return boolean
     */
    public function isService($module)
    {
        $xmlname = $this->idXMLIoC;

        if (isset(self::$xml[$module][$xmlname])) {
            return true;
        }else{
            $dirAplication = Zend_Registry::getInstance()->config->dir_aplication;
            $xml = self::$xml['comun'][$xmlname]->$module;
            $dirXml = $dirAplication . $xml['src'];
            if ((string)$xml['src'] != "" && is_file($dirXml)) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Validar un parametro o el resulado del servicio solicitado
     * segun la definicion del mismo en el xml de integracion
     *
     * @param SimpleXMLElement $xmlparam - Objeto xml que contiene la definicion del parametro
     * @param unknow           $param    - Parametro pasado al servicio
     */
    private function Validate($xmlparam, $param)
    {
        $key = md5( ($xmlparam). serialize($param));
        $cache = $this->getCache($key);
        if($cache !== 'NO-DATA-CACHE-LKJHGFDS')
            return $cache;


        $typeClass = utf8_encode($xmlparam['clase']);
        if ($typeClass && !($param instanceof $typeClass)) {
            return $this->setCache( $key, false);
            return false;
        } elseif ($xmlparam['tipo'] == 'array' && is_array($param)) {
            return $this->setCache( $key, true);
            return true;
        } elseif ($xmlparam['tipo']) {
            if (!isset(self::$xmlexpressions)) {
                self::$xmlexpressions = $this->getXML('expresiones');
            }
            $typeField = utf8_encode($xmlparam['tipo']);
            $typeRegexp = utf8_encode(self::$xmlexpressions->$typeField);
            if ($typeRegexp && !preg_match($typeRegexp, utf8_encode($param))) {
                return $this->setCache( $key, false);
                return false;
            }
        }
        return $this->setCache( $key, true);
        return true;
    }

    /**
     * Dispara una excepcion controlada por el sistema segun el codigo,
     * si en el primer codigo se pasa null se dispara la excepcion con
     * el segundo
     *
     * @throws ZendExt_Exception - excepciones controladas por el sistema
     */
    protected function Exception($errorCode, $auxCode = null, $class = null, $method = null)
    {
        if ($errorCode) {
            $e = new ZendExt_Exception($errorCode);
        } elseif ($auxCode) {
            $e = new ZendExt_Exception($auxCode);
        }
        $this->traceIoCException($e, $class, $method, $this->module);
        throw $e;
    }

    public function setIncludePath($srcmodule)
    {
        static $arrSrcModule;
        if (!isset($arrSrcModule)) {
            $arrSrcModule = array();
        }
        $register = Zend_Registry::getInstance();
        $srcservice = $register->get('config')->dir_aplication . '/' . $srcmodule;
        if (!isset($arrSrcModule[$srcservice])) {
            $arrSrcModule[$srcservice] = true;
            $includePath = get_include_path() . PATH_SEPARATOR . $srcservice;
            $includePath .= PATH_SEPARATOR . $srcservice . '/models';
            $includePath .= PATH_SEPARATOR . $srcservice . '/models/bussines';
            $includePath .= PATH_SEPARATOR . $srcservice . '/models/domain';
            $includePath .= PATH_SEPARATOR . $srcservice . '/models/domain/generated';
            $includePath .= PATH_SEPARATOR . $srcservice . '/validators';
            $includePath .= PATH_SEPARATOR . $srcservice . '/controllers';
            $includePath .= PATH_SEPARATOR . $srcservice . '/services';
            set_include_path($includePath);
        }
    }

    private function simulateResult($xmlResult)
    {
        $class = (string)$xmlResult['clase'];
        $type = (string)$xmlResult['tipo'];
        if ($class) {
            $class = ucfirst($class);
            $class = "ZendExt_IoC_{$class}Class";
            if (@class_exists($class)) {
                $return = new $class();
            } elseif (@class_exists('ZendExt_IoC_NullClass')) {
                $return = new ZendExt_IoC_NullClass();
            }
        } elseif ($type) {
            $type = ucfirst($type);
            $type = "ZendExt_IoC_{$type}Type";
            if (@class_exists($type)) {
                $return = new $type();
            } elseif (@class_exists('ZendExt_IoC_VoidType')) {
                $return = new ZendExt_IoC_NullClass();
            }
        }
        if (is_object($return)) {
            if (method_exists($return, 'getDefault')) {
                return $return->getDefault();
            } else {
                return $return;
            }
        }
        return;
    }

    private function getRefenceComp($xml, $service)
    {
        $srcModule = (string)$xml->{$this->module}['src'];
        $xmlservice = $xml->{$this->module}->$service;
        $referenceService = (string)$xmlservice['reference'];
        $separator = '';
        if ($referenceService) {
            $separator = '/';
        }
        return $srcModule . $separator . $referenceService;
    }

    private function traceIoCException($e, $class, $method, $module)
    {
        if ($this->iocExceptionTrace == 'true') {
            $trace = ZendExt_Aspect_Trace::getInstance();
            $trace->failedTraceIoc($e, $module, $class, $method, $this->idXMLIoC);
        }
    }

}

