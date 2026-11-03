<?php

/**
 * Created by PhpStorm.
 * User: Miguel Antonio
 * Date: 18/01/2016
 * Time: 12:55 PM
 */
class ConsultardatosuinController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function consultardatosuinAction()
    {
        $this->render();
    }

    public function exportarDatosSuinAction()
    {
        $datos = json_decode($this->_request->getParam('datos'));
        //print_r($datos);die;
        $objPlanilla = new ExportarDatosSuinModel($datos);

        $objPlanilla->CrearPlantilla();
        $objPlanilla->Guardar();
        //$url = "/pvd/comun/views/js/consultardatosuin/DatosCuadroSuin";

    }

}