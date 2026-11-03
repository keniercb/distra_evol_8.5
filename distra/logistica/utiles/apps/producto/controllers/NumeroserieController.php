<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NumeroserieController
 *
 * @author Kenier Kumba Bueno
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class NumeroserieController extends BaseController
{
    private $model;

    public function init()
    {
        parent::init('log.lb.numeroserie');
        $this->model = new LogisticaNumeroSerieModel();
    }

    /**
     * Devuelve los numeros de serie.
     */
    public function cargarNumeroserieAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarNroSerie($this->uiParams));
    }

    /**
     * Adiciona uno o varios numeros de serie.
     */
    public function adicionarNumeroserieAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        if ($this->uiParams['idaplicar']) {
            $this->uiParams['data']['idaplicar'] = $this->uiParams['idaplicar'];
            $this->uiParams['data']['aplicar'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['aplicar']));
        }

        $this->unsetNullValues();
        if ($this->uiParams['salida']) {
            $this->objectHelper->synchronize(
                $this, $this->model->addMovNroSerie($this->uiParams['data'], $this->uiParams['afecta'])
            );
        } else {
            $this->success = $this->model->adicionarNumeroserie($this->uiParams['data']);
        }
    }

    /**
     * Elimina uno varios numeros de serie.
     */
    public function eliminarNumeroserieAction()
    {
        $this->uiParams['id'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['id']));
        $this->objectHelper->synchronize(
            $this, $this->model->eliminarNumeroserie($this->uiParams['id'], $this->uiParams['afecta'])
        );
    }

    /**
     * Carga los numeros de serie filtrados para exportar.
     */
    public function cargarNumeroserieExportarAction()
    {
        $this->unsetParam('limit');
        $this->unsetParam('start');
        $this->unsetNullValues();
        $this->uiParams['existencia'] = true;
        $this->dirFichero = $this->model->crearExcelNroSerie($this->uiParams);
    }

    public function cargarAnnosNroSerieAction()
    {
        $datos = $this->model->cargarAnnosNroSerie($this->uiParams);
        $this->datos = $datos['datos'];
        $this->total = $datos['total'];
    }

}