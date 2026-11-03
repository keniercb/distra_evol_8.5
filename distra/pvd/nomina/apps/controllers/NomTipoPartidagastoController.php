<?php

/**
 *
 *
 * @author
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomTipoConceptoPDModel
 * @copyright UCID
 * @version 1.0
 */
class NomTipoPartidagastoController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }

    public function nomtipopartidagastoAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    public function obtenerListadoTiposPartidaGastoAction() {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new NomTipoPartidagastoModel();

        //Obteniendo el listado de tipos de pago.
        $arrTiposP = $modeloNegocioTipoP->obtenerListadoTipoPartida(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );

        //Obteniendo la cantidad total de tipos de pago.
        $cantTotalTiposP = $modeloNegocioTipoP->obtenerCantidadTotalTipoPartida($this->_getParam('start', 0),
            $this->_getParam('limit', 10));

        //Imprimiendo el listado de tipos de pago.
        echo Zend_Json::encode(array('datos' => $arrTiposP, 'cantidad' => $cantTotalTiposP));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    public function adicionarTiposPartidaGastoAction() {

        //Creando el modelo de negocio
        $modeloNegocioTipoP = new NomTipoPartidagastoModel();

        //Insertando los datos
        $result = $modeloNegocioTipoP->adicionarTiposPartidaGasto(	$this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
            );
        if($result){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El tipo de partida de gastos que quiere adicionar ya existe'}";
        }

    }

    public function modificarTiposPartidaGastoAction() {

        //Creando el modelo de negocio.
        $modeloNegocioTipoP = new NomTipoPartidagastoModel();

        //Modificando los datos del periodo de pago.
        $result = $modeloNegocioTipoP->modificarTiposPartidaGasto($this->_getParam('idtipopartidagasto'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
            );

        if($result){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El tipo de partida de gastos ya existe'}";
        }
    }

    public function eliminarTiposPartidaGastoAction() {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new NomTipoPartidagastoModel();

        //Eliminando el tipo de pago.
        $bool = $modeloNegocioTipoP->eliminarTiposPartidaGasto($this->_getParam('idtipopartidagasto'));

        if($bool == 2){
            //print_r($bool);die;
           echo "{'codigo':'3','mensaje':'El tipo de partida está en uso'}" ;
        }else{
            echo "{'codigo':'1'}";
        }
    }

}
