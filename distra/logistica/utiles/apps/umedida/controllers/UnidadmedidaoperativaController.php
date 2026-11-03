<?php

/**
 * Created by PhpStorm.
 * User: Daniel
 * Date: 5/11/14
 * Time: 14:05
 */

/**
 *  Esta clase controla la gestión de operaciones con las UM del producto
 * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
class UnidadmedidaoperativaController extends BaseController
{

    private $uMedidaModel;

    function init()
    {
        parent::init('log.lb.unidadmedida');
        $this->uMedidaModel = new UMedidaOperativaModel();
    }

    public function gestUnidadmedidaoperativaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        
        $this->initComponent('log.lb.unidadmedida');
        $this->rendertemplate();
    }

    public function getUMedidaOperativaAction()
    {
        $source = $this->uMedidaModel->getConversionUMedida($this->uiParams);
        $this->datos = $source['datos'];
        $this->cantidad = $source['cantidad'];
        $this->umedida = $this->uMedidaModel->cargarUMedidaOperativaFinal();
    }

    public function adicionarUMedidaOperativaAction()
    {
        $this->success = $this->uMedidaModel->adicionarConversionUM($this->uiParams);
    }

    public function modificarUMedidaOperativaAction()
    {
        $this->datos = $this->uMedidaModel->modificarConversioUM($this->uiParams);
    }

    public function eliminarUMedidaOperativaAction()
    {
        $this->datos = $this->uMedidaModel->eliminarConversioUM($this->uiParams);
    }

    public function cargarUMedidaOperativaInicialAction()
    {

        $this->datos = $this->uMedidaModel->cargarUMedidaOperativaInicial($this->uiParams);
    }

    public function cargarUMedidaOperativaFinalAction()
    {
        $this->datos = $this->uMedidaModel->cargarUMedidaOperativaFinal();
    }

}
