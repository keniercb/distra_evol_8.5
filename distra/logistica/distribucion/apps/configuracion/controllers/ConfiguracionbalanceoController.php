<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConfiguracionbalanceoController extends BaseController
{
    
    public function init()
    {
        parent::init('log.dist.configuracion');
        $this->idestructuraComun = $this->global->Estructura->idestructura;
           }

    public function configuracionbalanceoAction()
    {
        $this->autoShow = false;
        $this->render();
    }
    public function cargaralmacenesAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);

        $confbalanceo = new ConfiguracionbalanceoModel();
        $data = $confbalanceo->getDepositosEntidad($this->uiParams);

        $this->datos = $data['datos'];
        $this->total = $data['total'];
        $this->cantidad = $data['total'];
    }

    public function guardarconfAction(){
        
        $datos = json_decode(stripcslashes($this->uiParams['datos']));
        //$entSelecionadas = json_decode(stripcslashes($this->uiParams['entSelecionadas']));
        $clasifSelecionadas = json_decode(stripcslashes($this->uiParams['clasifSelecionadas']));
        $excluir = array();
        $noexcluir = array();/* 
        $cuadrediariosi = array();
        $cuadrediariono = array(); */
        $publicar = array();
        $nopublicar = array();

        foreach ($datos as $index => $value )
        {
            if($value->excluido == true){
                array_push($excluir, $value->iddeposito);
            } else if($value->excluido == false) {
                array_push($noexcluir, $value->iddeposito);
            }
            if($value->publico == true){
                array_push($publicar, $value->iddeposito);
            } else if($value->publico == false) {
                array_push($nopublicar, $value->iddeposito);
            }
        }
        
        $confbalanceo = new ConfiguracionbalanceoModel();
        if(count($excluir) > 0){
            $confbalanceo->adicionarExcluidos($excluir);
        }
        if(count($noexcluir) > 0){
            $confbalanceo->eliminarExcluidos($noexcluir);
        }
        if(count($publicar) > 0){
            $confbalanceo->adicionarPublicos($publicar);
        }
        if(count($nopublicar) > 0){
            $confbalanceo->eliminarPublicos($nopublicar);
        }/*
        if(count($cuadrediariosi) > 0){
            $confbalanceo->adicionarCuadreDiario($cuadrediariosi);
        }
        if(count($cuadrediariono) > 0){
            $confbalanceo->eliminarCuadreDiario($cuadrediariono);
        } */
        if($this->uiParams['iddeposito']){
            $confbalanceo->adicionarEntidadeClasificaciones($this->uiParams['iddeposito'],
                    $clasifSelecionadas,$this->uiParams['idestructura']);
        }
    }

    public function cargarClasificacionesAction(){
        //$this->uiParams['idestructuracomun'] = 200531089;
        if($this->uiParams['idestructuracomun']){
            $this->uiParams['start'] = ($this->uiParams['start'])?$this->uiParams['start']:0;
            $this->uiParams['limit'] = ($this->uiParams['limit'])?$this->uiParams['limit']:30;
            $confbalanceo = new ConfiguracionbalanceoModel();
            $data = $confbalanceo->cargarClasificacion($this->uiParams);
    
            $this->datos = $data['datos'];
            $this->total = $data['cantidad'];
            $this->cantidad = $data['cantidad'];
        }else {
            $this->datos = array();
            $this->total = $this->cantidad = 0;
        }
        
    }

    public function guardarcargainicialAction(){
        $confbalanceo = new ConfiguracionbalanceoModel();
        $this->objectHelper->synchronize($this, $confbalanceo->guardarcargainicial());
    }

    public function guardarNaturalezasAction(){
        $this->uiParams['data'] = json_decode($this->uiParams['data']);
        $confbalanceo = new ConfiguracionbalanceoModel();
        $this->objectHelper->synchronize($this, $confbalanceo->guardarNaturalezas($this->uiParams));
    }

    public function eliminarNaturalezasAction(){
        $this->uiParams['naturalezas'] = json_decode($this->uiParams['naturalezas']);
        $confbalanceo = new ConfiguracionbalanceoModel();
        $this->objectHelper->synchronize($this, $confbalanceo->eliminarNaturalezas($this->uiParams));
    }

    public function devolverNaturalezasByDepositoAction(){
        $confbalanceo = new ConfiguracionbalanceoModel();
        $this->objectHelper->synchronize($this, $confbalanceo->devolverNaturalezasByDeposito($this->uiParams));
    }

    public function cargarNaturalezasAction(){
        $confbalanceo = new ConfiguracionbalanceoModel();
        $this->objectHelper->synchronize($this, $confbalanceo->cargarNaturalezas($this->uiParams));
    }
}
