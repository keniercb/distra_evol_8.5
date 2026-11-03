<?php

/**
 * Description of ConciliacionValidator
 *
 * @author Maricet Estevez
 */
class ConciliacionValidator extends SalidaValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new ConciliacionLogisticaModel(
            array('alias' => 'conciliacionLog')
        );
    }

    public function validarExistenciaConciliacion()
    {

        $this->params['data'] = (array) Zend_Json::decode($this->params['data']);
        $this->params['idestructuracomun'] = Zend_Json::decode($this->params['idestructuracomun']);
        if ($this->params['data']['iddocumento']) {
            return true;
        } else {
            return $this->model->validarExistenciaConciliacion($this->params);
        }
    }

}
