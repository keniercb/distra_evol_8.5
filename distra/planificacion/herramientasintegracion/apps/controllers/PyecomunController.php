<?php

/**
 * Clase controladora para los componentes comun del componente Politica y estrategia
 *
 * @author    Ing. Frank David Corona Prendes
 * @copyrigth XETID Cuba
 * @version   1.0
 */
class PyecomunController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    public function cargarAyudaAction()
    {
        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
    }

    public function pyecomunAction()
    {
        $this->view->extensionesPLAN = $this->pIntegrator->integracion->extensionesPLAN();
        $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
//        $this->view->amchartsComponente = $this->integrator->gestion_incidencia->amchartComponente();
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }
    //------------------------------------------------------------------------------------------------------------------ GRAFICO ORGANIGRAMA
    public function obtenerdatosorganigramaAction() {
        $model = new PyecomunModel();
        $objefecto = Zend_Json_Decoder::decode(stripcslashes($this->_request->getPost('objefecto')));
        $data = $model->getDatosGraficoOrganigrama($objefecto);
        echo json_encode(array("success" => true, "data" => $data));
    }
}
