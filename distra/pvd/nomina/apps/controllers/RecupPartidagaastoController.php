<?php

/**
 * Controlador para configurar los conceptos contables.
 *
 * @author Tte. Frank Rodiguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses ConfigconceptoscontablesController
 * @copyright UCID
 * @version 1.0
 */
class RecupPartidagaastoController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de configurar los conceptos contabless.
     */
    public function recuppartidagaastoAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->scriptelemgastoUI = $this->integrator->contabilidad->dir_CmpEOGUI ();
        //$this->view->scriptelemgastoClass = $this->integrator->contabilidad->dir_CmpEOGClass();
        //Mostrando la vista.
		 
        $this->render();
    }

    /**
     * Acción utilizada para listar las partidas de gastos
     */
    public function listarpornominapartidasgastoAction() {
        $idelaborarpagos = Zend_Json::decode(stripslashes($this->_getParam('idelaborarpagos')));
        $identidad = $this->_getParam('identidad');
        $tipo = $this->_getParam('tipo');

        $respuesta= RecupPartidagaastoModel::listarpornominapartidasgasto($idelaborarpagos,$identidad,$tipo);


        echo Zend_Json::encode(array('dato'=>$respuesta,'cantidad'=>count($respuesta)));
    }


    
}