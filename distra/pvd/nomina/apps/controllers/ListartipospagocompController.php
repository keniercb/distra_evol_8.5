<?php

class ListartipospagocompController extends ZendExt_Controller_Secure
{

    var $datosModelo;

    public function init()
    {
        parent::init();

    }

    public function listartipospagocompAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }


    public function obtenertipospagoAction()
    {
        $arraydatos = array();
        $inicio = $this->_getParam('start');
        $limite = $this->_getParam('limit');
        $criterio = $this->_getParam('criterio');
        $objPD = new NomTipoPago();
        $r = $objPD->obtenerListadoTiposPago($inicio, $limite, $criterio);
        foreach ($r as $pos => $val) {
            $r[$pos]['orden'] = ($val['orden'] < 10) ? '0' . $val['orden'] : $val['orden'];
        }
        $c = $objPD->obtenerCantidadTotalTiposPago();

        echo json_encode(array('datos' => $r, 'cantidad' => $c));

    }

}
