<?php

/**
 * Esta clase controla todo lo referente al libro de venta
 *
 * @copyright Xetid
 * @author    División de Gestión de Entidades
 * @version   1.0
 */
class LibroventaController extends BaseController// ZendExt_Controller_Secure
{

    private $model;

    public function init()
    {
        parent::init('log.fac.libroventa');
        $this->model = new LibroventaModel();
    }

    public function libroventaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.fac.libroventa');
        $this->rendertemplate();
    }

    public function cargarDocumentosAction()
    {
        $result = $this->model->cargarDocumentos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['total'];
    }
}
