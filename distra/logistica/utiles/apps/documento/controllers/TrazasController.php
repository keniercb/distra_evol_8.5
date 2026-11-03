<?php

/**
 * @class     TrazasController
 * Clase que se encarga de manejar el registro
 * de las trazas.
 * @namespace Logistica\Utiles\Documento\Controllers
 * @author    Divisi�on de Gesti�on de Entidades
 * @copyright XETID
 * @version   1.0
 */
class TrazasController extends BaseController
{

    private $trazasModel, $documentoModel;

    function init()
    {
        parent::init('log.lb.trazas');
        $arreglo = array('noexception' => true);
        $this->documentoModel = new DocumentoLogisticaModel($arreglo);
        $this->trazasModel = new TrazasDocumentoModel();
    }

    public function gestTrazasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        
        $this->initComponent('log.lb.trazas');
        $this->rendertemplate();
    }

    public function cargarTrazasAction()
    {
        $result = $this->trazasModel->devolverTrazas($this->uiParams);
        $usuario = $this->documentoModel->cargaInicial();
        $this->usuarios = $usuario['usuarios'];
        $this->documentos = $usuario['iddocs'];
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

}
