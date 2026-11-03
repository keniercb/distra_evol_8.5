<?php
class ConfigurarplantillasController extends ZendExt_Controller_Secure
{
    protected $_responeInfo;
    private $_plantillaDService;

    function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_plantillaDService = new PlantillaDService();
    }

    function configurarplantillasAction()
    {}

    public function getPlantillasAction()
    {
         $listPLantilla = $this->_plantillaDService->getPlantilla(Zend_Json::decode($this->_getParam('filters')));
         $this->_responeInfo->datos = $listPLantilla;
         $this->_responeInfo->cantidad = count($listPLantilla);

         echo $this->_responeInfo->getJson();
    }

    public function getModelAction()
    {
        $listPLantilla = $this->_plantillaDService->getModel();

        echo Zend_Json::encode(
            array(
                'data' => $listPLantilla,
                'count'  => count($listPLantilla)
            )
        );
    }

    public function insertPlantillaAction()
    {
         $this->crudProxy('_plantillaDService', 'insertPlantilla');
    }

    public function updatePlantillaAction()
    {
         $this->crudProxy('_plantillaDService', 'updatePlantilla');
    }

    public function deletePlantillaAction()
    {
         $this->crudProxy('_plantillaDService', 'deletePlantilla');
    }

    private function crudProxy($objectName, $methodName)
    {
        try{
            $this->$objectName->$methodName(Zend_Json::decode($this->_getParam('values')));
        }catch (Exception $e){
            $this->managerException($e);
        }

        echo $this->_responeInfo->getJson();
    }

    private function managerException($exception)
    {
        $exceptionClassName = get_class($exception);
        $businessExceptions = ['DuplicationValuesException', 'ElementInUseException', 'InvalidArgumentsException'];

        if(in_array($exceptionClassName, $businessExceptions))
        {
            $this->_responeInfo->success = false;
            $this->_responeInfo->codigoMsg = $exception->getCode();
            $this->_responeInfo->mensaje = $exception->getMessage();
        }else
            throw $exception;
    }
}
