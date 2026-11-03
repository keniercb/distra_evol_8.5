<?php

/**
 * Clase para la implementación de los publicadores de las trazas en bases de datos
 *
 * @author     Equipo de arquitectura.
 * @copyright  UCID - ERP Cuba.
 * @package    Trace.
 * @subpackage Publisher
 * @version    1.0.0
 */
class ZendExt_Trace_Publisher_Db extends ZendExt_Model
{

    /**
     * Instancia del Xml de config de las trazas.
     *
     * @var SimpleXmlElement.
     */
    private $_xml;

    /**
     * Conexión a la BD de trazas
     *
     * @var Doctrine_Connection
     */
    private $_conn;

    /**
     * Constructor
     *
     * @return void.
     */
    function __construct()
    {
        $this->_xml = ZendExt_FastResponse:: getXML('traceconfig');
        $transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
        $configApp = new ZendExt_App_Config();
        $configApp->addBdToConfig('traza', 'traza');
        $this->_conn = $transactionManager->openConections('traza');

    }

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
     * Método de persistencia de los logs en la BD.
     *
     * @param ZendExt_Trace_Container_Log $pPublisher
     */
    function save($pContainer, $tree = false)
    {
        $className = get_class($pContainer); //Obtengo el nombre de la clase del contenedor
        $tmp = $this->_xml->containers->$className; //Busco su rama dentro del Xml de trazas
        $doctrine = (string)$tmp ['doctrine'];

        $enabled = (int)$tmp ['enabled'];
        if ($enabled) { //Si la traza está habilitada
            if (!$tree) {
                /* Obtiene el nombre de la clase de Doctrine que persiste ese tipo de traza
                  Se llena la instancia de Doctrine con los datos de la clase padre (ZendExt_Trace_ContainerLog)
                 */
                $obj = $this->initObject($pContainer, $doctrine, $tmp);
                if ($pContainer->getIdType() == 1 && $pContainer->getAction() == $pContainer->getController()) {
                    $obj->idtrazapadre = null;
                } else {
                    $obj->idtrazapadre = $this->getIdTrazaPadre($pContainer);
                }

                $this->saveToDB($obj);
                return $obj;
            } else {
                $this->saveFromTree($pContainer, $doctrine, $tmp);
            }
        }

    }

    private function saveFromTree($pContainer, $doctrine, $tmp, $idtrazapadre = null)
    {
        $enabled = (int)$tmp ['enabled'];
        if ($enabled) { //Si la traza está habilitada
            $obj = $this->initObject($pContainer, $doctrine, $tmp);
            if ($idtrazapadre) {
                $obj->idtrazapadre = $idtrazapadre;
            } else {
                if ($pContainer->getIdType() == 1 && $pContainer->getAction() == $pContainer->getController()) {
                    $obj->idtrazapadre = null;
                } else if ($pContainer->getIdType() == 1) {
                    $obj->idtrazapadre = $this->getIdTrazaPadre($pContainer);
                }
            }
            $this->saveToDB($obj);
        }
        foreach ($pContainer->getChildren() as $child) {
            $className = get_class($child); //Obtengo el nombre de la clase del contenedor
            $tmp = $this->_xml->containers->$className; //Busco su rama dentro del Xml de trazas
            $doctrine = (string)$tmp ['doctrine'];
            $this->saveFromTree($child, $doctrine, $tmp, $obj->idtraza);
        }

    }

    /**
     * @param $pContainer
     * Obtener el id padre según el tipo de traza a registrar
     *
     * @return mixed
     */

    function getIdTrazaPadre($pContainer)
    {
        if ($pContainer->getIdType() == '6') {
            $consulta = Doctrine_Query::create($this->_conn)->select('t.idtraza as idtraza')
                ->from('HisTraza t')
                ->where('t.idseccion = ?', array($pContainer->getIdSession()))
                ->andwhere('t.idtipotraza = 1')
                ->andwhere('t.idcategoriatraza = ? ', array($pContainer->getCategoria()))
                ->andwhere('t.referencia = ? ', array($pContainer->getReference()))
                ->orderBy('idtraza DESC')->fetchOne();
            return $consulta['idtraza'];
        } else if ($pContainer->getIdType() == '1') {
            $consulta = Doctrine_Query::create($this->_conn)->select('t.idtraza as idtraza')
                ->from('HisTraza t')
                ->innerJoin('t.HisAccion acc')
                ->where('acc.accion = ? ', array($pContainer->getController()))
                ->andwhere('t.idseccion = ?', array($pContainer->getIdSession()))
                ->andwhere('acc.accion = acc.controlador and t.idtipotraza = 1')
                ->orderBy('idtraza DESC')->fetchOne();
            return $consulta['idtraza'];
        } else if (
            $pContainer->getIdType() == '3' || $pContainer->getIdType() == '7' || $pContainer->getIdType() == '5' ||
            $pContainer->getIdType() == '10'
        ) {
            $consulta = Doctrine_Query::create($this->_conn)->select('t.idtraza as idtraza')
                ->from('HisTraza t')
                ->where('t.idseccion = ?', array($pContainer->getIdSession()))
                ->andwhere('t.idtipotraza = 1')
                ->orderBy('idtraza DESC')->fetchOne();
            return $consulta['idtraza'];
        }

    }

    private function saveToDB($obj)
    {
        try {
            $obj->save($this->_conn);
        } catch (Exception $e) {
            throw new ZendExt_Exception('TRACE001', $e);
        }
    }

    private function initObject($pContainer, $doctrine, $tmp)
    {
        $obj = new $doctrine ();
        $obj->fecha = $pContainer->getDate();
        $obj->hora = $pContainer->getTime();
        $obj->usuario = $pContainer->getUser();
        $obj->referencia = $pContainer->getReference();
        $obj->idtipotraza = $pContainer->getIdType();
        $obj->idseccion = $pContainer->getIdSession();
        $obj->ippc = $pContainer->getIpPc();
        $obj->idcategoriatraza = $pContainer->getCategoria();
        $obj->subsistema = $pContainer->getSubsistema();
        if ($obj->subsistema == null || $obj->subsistema == '') {
            $obj->subsistema = 'Proveedor de identidad';
        }
        /*
          Se llena la instancia de Doctrine con los atributos privados de cada
          tipo de traza.
         */
        try {

            foreach ($tmp->atts->children() as $var) {

                $att = (string)$var ['att'];
                if ($att != 'autorizacion') {
                    $method = (string)$var ['method'];
                    $obj->$att = $pContainer->$method();
                }
            }
        } catch (Exception $e) {
            throw new ZendExt_Exception('TRACE050', $e);
        }
        return $obj;
    }
}

