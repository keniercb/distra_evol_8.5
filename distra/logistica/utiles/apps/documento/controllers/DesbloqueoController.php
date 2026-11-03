<?php

/**
 * @class     DesbloqueoController
 * Clase que se encarga de manejar las acciones
 * para el bloqueo y desbloqueo de documentos.
 * @namespace Logistica\Utiles\Documento\Controllers
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class DesbloqueoController extends BaseController
{

    private $modeloBloqueo, $documentoModel;

    function init($cmp = 'log.lb.desbloqueo')
    {
        parent::init($cmp);
        $arreglo = array('noexception' => true);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
        $this->modeloBloqueo = new BloqueoDocumentoModel($this->documentoModel);
    }

    public function gestDesbloqueoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        
        $this->initComponent('log.lb.desbloqueo');
        $this->rendertemplate();
    }

    /**
     * @method cargarDocumentoBloqueados
     * Acción para cargar los documentos que se encuentran bloqueados
     * en la entidad
     *
     * @params null
     *
     * @return null
     */
    public function cargarDocumentoBloqueadosAction()
    {
        $usuario = $this->documentoModel->cargaInicial();
        $result = $this->modeloBloqueo->devolverDocBloqueados($this->uiParams);
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * Acción para desbloquear los documentos seleccionados por el usuario
     *
     * @params null
     *
     * @return null
     */
    public function desbloquearDocumentoAction()
    {
        $doc = Zend_Json::decode($this->uiParams['id']);
        $this->success = $this->modeloBloqueo->desbloquearDocumetos($doc, $this->uiParams['alias']);
    }


}
