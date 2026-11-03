<?php

class ImportarController extends BaseController
{
    private $serviciosAyuda;
    private $model;

    public function init()
    {
        parent::init('log.lb.importar');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new ImportarModel($this->uiParams['class']);
    }

    public function importarAction()
    {
        $this->autoShow = FALSE;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponet('log.lb.importar');
        $this->renderTemplate();
    }

    public function importarFicheroAction()
    {
        $this->uiParams['params'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['params']));
        ini_set('max_execution_time', 0);
        if (!empty($_FILES['file-path']) && ($_FILES['file-path']['error'] == 0)) {
            try {
                $datos = $this->model->importarFichero($_FILES['file-path'], $this->uiParams['params']);
             } catch (exception $e) {
                $this->success = false;
                if($e->getCode()== 22){
                    $this->mensaje = 5;
                }
                elseif($e->getCode()== 42601){
                    $this->mensaje = 6;
                }
                else {
                    throw $e;
                }
           }

        } else {
            $datos = 3;
            $this->success = false;
            $this->mensaje = 2;
        }

        if (is_array($datos)) {
            $this->objectHelper->synchronize($this, $datos);
        } 
    }

}
