<?php

class ConfrangoedadesController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function confrangoedadesAction()
    {
        $this->render();
    }

    function getRangosAction()
    {
        //Obteniendo el resultado y enviando a la vista
        $idestructura = $this->global->Estructura->idestructura;
        $result = ConfRangoedadesModel::getRangos($idestructura);
        echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result)));
    }

    public function addRangoAction()
    {
        $denominacion = $this->_request->getPost('denominacion');
        $valorinicial = $this->_request->getPost('valorinicial');
        $valorfinal = $this->_request->getPost('valorfinal');
        $orden = $this->_request->getPost('orden');
        $idestructura = $this->global->Estructura->idestructura;
        $model = new ConfRangoedadesModel();
        $model->addRango($denominacion, $valorinicial, $valorfinal, $idestructura, $orden);
        $r->codigo = 1;
        $r->mensaje = 'El rango de edad ha sido adicionado satisfactoriamente';
        echo json_encode($r);
    }

    public function updRangoAction()
    {
        $idconfescala = $this->_request->getPost('idrangoedades');
        $denominacion = $this->_request->getPost('denominacion');
        $valorinicial = $this->_request->getPost('valorinicial');
        $valorfinal = $this->_request->getPost('valorfinal');
        $orden = $this->_request->getPost('orden');
        $model = new ConfRangoedadesModel();
        $resu=$model-> updRango($idconfescala, $denominacion, $valorinicial, $valorfinal, $orden);
        if($resu==1){
            $r->codigo = 1;
            $r->mensaje = 'El rango de edad ha sido modificado satisfactoriamente';
        }else{
            $r->codigo = 3;
            $r->mensaje = 'El rango de edad que desea modificar esta en uso';
        }
        echo json_encode($r);
    }

    public function delRangoAction()
    {
        $configuraciones=json_decode(stripslashes($this->_request->getPost('configuraciones')));
        $model = new ConfRangoedadesModel();
        $resu=$model->delRango($configuraciones);
        if($resu==1){
            $r->codigo = 1;
            $r->mensaje = 'Lo(s) rango(s) ha(n) sido elimindo(s) satisfactoriamente';
        }else{
            $r->codigo = 3;
            $r->mensaje = 'Lo(s) rango(s)que desea eliminar esta(n) en uso';
        }
        echo json_encode($r);
    }
}