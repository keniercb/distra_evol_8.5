<?php

/**
 * Created by PhpStorm.
 * User: Ariel
 * Date: 28/09/2016
 * Time: 16:10
 */
class CmppertavionesController extends ZendExt_Controller_Secure
{
    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
        $this->view->jspert = $this->integrator->planpdo->getJSPert();
        $this->view->getJSRelaciones
            = $this->integrator->planpdo->getJSRelaciones();

    }


    function cmppertavionesAction()
    {	
        $this->render();
    }

    public function getProyectosvivosAction(){
        $parametros->fecha = date('d/m/Y');
        $parametros->hora = date('H:i');
        $parametros->hora = $parametros->hora.':00';
        $model = new PertavionesModel();
        $proyectos = $model->getProyectosVivos($parametros);
        echo json_encode($proyectos);
    }

    public function verDetallesAction(){
        $parametros->idproyecto = $this->_request->getPost('idproyecto');
        $parametros->fecha = date('d/m/Y');
        $parametros->hora = date('H:i');
        $parametros->hora = $parametros->hora.':00';
        $parametros->ejecutadas = $this->_request->getPost('ejecutadas');
        $parametros->start = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $parametros->limit = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $inferiores = array();
        $actModel = new CmpgestionaractividadesModel();
        $actModel->buscarInferioresPert($parametros->idproyecto,$inferiores,'<=',3,10);
        $parametros->inferiores = implode(',',$inferiores);
        $model = new PertavionesModel();
        $actividades = $model->getActividadesByIdProyecto($parametros);
        echo json_encode(array('data'=>$actividades,'total'=>count($actividades)));
    }

}