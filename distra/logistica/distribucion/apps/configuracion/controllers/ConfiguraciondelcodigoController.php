<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConfiguraciondelcodigoController extends BaseController
{
   
    public function init()
    {
        parent::init('log.dist.configuracion');
        $this->idestructuraComun = $this->global->Estructura->idestructura;
           }

           public function salvarconfiguracionAction()
           {
               $this->uiParams['idestructuracomun'] = $this->idestructuraComun;
               $this->modelSetting->salvarConfiguracion($this->uiParams);
               $this->success = true;
           }
    public function configuraciondelcodigoAction()
    {
        $this->autoShow = false;
        $this->render();
    }
   
   
    public function getcargarcodigodeoperacionesAction(){
        $this->uiParams['data'] = json_decode($this->uiParams['data']);
        $confcodigo = new ConfiguraciondelcodigoModel();
        $this->objectHelper->synchronize($this, $confcodigo->codigodeoperaciones($this->uiParams));
    }
    public function getcargarcodigoAction(){
        $this->uiParams['data'] = json_decode($this->uiParams['data']);
        $confcodigo = new ConfiguraciondelcodigoModel();
        $this->objectHelper->synchronize($this, $confcodigo->cargarcodigo($this->uiParams));
    }
    
    public function actualizarcodigoAction(){
        //$this->uiParams['data'] = json_decode($this->uiParams['data']);
        $confcodigo = new ConfiguraciondelcodigoModel();
        $this->objectHelper->synchronize($this, $confcodigo->actualizarcodigo($this->uiParams));
    }
    public function eliminarcodigoAction(){
        $this->uiParams['data'] = json_decode($this->uiParams['data']);
        $confcodigo = new ConfiguraciondelcodigoModel();
        $this->objectHelper->synchronize($this, $confcodigo->eliminarcodigo($this->uiParams));
    }


   
   
}
