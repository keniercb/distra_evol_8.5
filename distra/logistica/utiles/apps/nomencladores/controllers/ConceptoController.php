<?php

/**
 * @class      ConceptoController
 * Gestiona el nomeclador concepto
 *
 * @package    Logistica
 * @subpackage Nomencladores
 * @author     Manuel Yhon Figueroa
 * @copyright  XETID
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConceptoController extends BaseController
{
    /**
     * Instancia del modelo de negocio para la gestion de los nomencladores
     *
     * @var type
     */
    private $nomencladoresModel, $sConfGeneral;

    public function init()
    {
        parent::init();
        $this->nomencladoresModel = new NomencladoresModel();
        $params = $this->_request->getParams();
        $this->nomencladoresModel = ($params['bussines']) ? new $params['bussines']() : new NomencladoresModel();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     * Metodo para renderizar la interfaz general de los nomencladores de
     * logistica
     *
     * @return void
     */
    public function conceptoAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    /**
     * Metodo para cargar los tipos de documento de inventario
     * logistica
     *
     * @return array
     */
    public function cargarTipoDocumentoAction()
    {
        $tipodocumentoINV = $this->sConfGeneral->documentosPorSubsistemaEntidad(
            LogisticaGlobal::SUBSISTEMA_INV, $this->global->Estructura->idestructura
        );
        $tipodocumentoTALL = $this->sConfGeneral->documentosPorSubsistemaEntidad(
            LogisticaGlobal::SUBSISTEMA_TALLERES, $this->global->Estructura->idestructura
        );
        $tipodocumentoFAC = $this->sConfGeneral->documentosPorSubsistemaEntidad(
            LogisticaGlobal::SUBSISTEMA_FAC, $this->global->Estructura->idestructura
        );
        $tipodocumento = array_merge($tipodocumentoINV,$tipodocumentoTALL,$tipodocumentoFAC);
        
        foreach ($tipodocumento as &$tipodoc) {
            $tipodoc->denomtipodoc = $tipodoc->denominacion;
        }
        $this->datos = $tipodocumento;
        $this->idsubsistema = (count($tipodocumento) > 0) ? LogisticaGlobal::SUBSISTEMA_INV : 0;
    }

    public function cargarOperacionesAction()
    {
        $params = $this->_request->getParams();
        $operacionesINV = $this->configuracionHelper->obtenerOperaciones(
            $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV, $params['iddoc']
        );
        $operacionesTALL = $this->configuracionHelper->obtenerOperaciones(
            $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_TALLERES, $params['iddoc']
        );
        $operacionesFAC = $this->configuracionHelper->obtenerOperaciones(
            $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_FAC, $params['iddoc']
        );
        $operaciones = array_merge($operacionesINV, $operacionesTALL, $operacionesFAC);
        foreach ($operaciones as &$oper) {
            if($params['iddoc'] == $oper['iddocentidad'])
                $oper['denomoperaciones'] = $oper['denominacion'];
        }
        $this->datos = $operaciones;
    }
}