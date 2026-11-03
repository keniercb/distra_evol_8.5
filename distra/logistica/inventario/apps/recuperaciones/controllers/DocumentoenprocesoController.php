<?php
/**
 *  Esta clase controla la gestión de los documentos en proceso
 * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class DocumentoenprocesoController extends BaseController
{
    private $serviciosAyuda;

    private $model;
    private $sConfGeneral;

    function init()
    {
        parent::init('log.inv.documentoenproceso');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new DocumentoEnProcesoModel();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function gestDocumentoenprocesoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        
        $this->initComponent('log.inv.documentoenproceso');
        $this->rendertemplate();
    }

    public function getDocumentosPorEstadoAction()
    {
        $this->uiParams['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $this->uiParams['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 30;
        if (!$this->uiParams['estado']) {
            $this->uiParams['estado'] = array(
                EstadoDocumentoModel::ESTADO_ELABORACION,
                EstadoDocumentoModel::ESTADO_PENDIENTE);
        } else {
            if ($this->uiParams['estado'] == 1) {
                $this->uiParams['estado'] = array(
                    EstadoDocumentoModel::ESTADO_ELABORACION);
            } else {
                $this->uiParams['estado'] = array(
                    EstadoDocumentoModel::ESTADO_PENDIENTE);
            }
        }

        $res = $this->model->getDocumentos($this->uiParams);
        $this->datos = $res['datos'];
        $this->cantidad = $res['cantidad'];
        $usuario = $this->model->cargaInicial();
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;

    }

    public function getTioposDocAction()
    {
        $documento = $this->model->cargaInicial();
        $this->denom = $documento['iddocs'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function cargarTipoDocumentoAction()
    {
        $tipodocumento = $this->sConfGeneral->documentosPorSubsistemaEntidad(
            LogisticaGlobal::SUBSISTEMA_INV, $this->global->Estructura->idestructura
        );
        $this->datos = $tipodocumento;
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }

    public function cargardepositosAction()
    {
        $datas = $this->model->loadDepositos();
        $this->datos = $datas['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }


}