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
class NomPartidagastoController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }

    public function nompartidagastoAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    public function obtenerListadoPartidaGastoAction() {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioP = new NomPartidagastoModel();

        //Obteniendo el listado
        $arrTiposP = $modeloNegocioP->obtenerListadoPartida(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );

        //Obteniendo la cantidad total
        $cantTotalP = $modeloNegocioP->obtenerCantidadTotalPartida( $this->_getParam('start', 0),
            $this->_getParam('limit', 10));

        //Imprimiendo el listado .
        echo Zend_Json::encode(array('datos' => $arrTiposP, 'cantidad' => $cantTotalP));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    public function obtenerTipoPartidagastoAction() {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegociotP = new NomTipoPartidagastoModel();

        //Obteniendo el listado
        $arrTiposP = $modeloNegociotP->obtenerTodosTipoPartidagasto();
        //Imprimiendo el listado .
        echo Zend_Json::encode(array('datos' => $arrTiposP/*, 'cantidad' => count($arrTiposP)*/));

        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    public function adicionarPartidaGastoAction() {


        //Creando el modelo de negocio
        $modeloNegocioP = new NomPartidagastoModel();

        //Insertando los datos
        $booladd = $modeloNegocioP->adicionarPartidaGasto(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
//            $this->_getParam('idtipopartidagasto')
        );

        if($booladd){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'La partida de gastos ya existe'}";
        }
    }

    public function modificarPartidaGastoAction() {

        //Creando el modelo de negocio.
        $modeloNegocioP = new NomPartidagastoModel();

        //Modificando los datos del periodo de pago.
        $booladd = $modeloNegocioP->modificarPartidaGasto(	$this->_getParam('idpartidagasto'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
//            $this->_getParam('idtipopartidagasto')
        );

        if($booladd){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'La partida de gastos ya existe'}";
        }
    }

    public function eliminarPartidaGastoAction() {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioP = new NomPartidagastoModel();

        //Eliminando el tipo de pago.
        $bool = $modeloNegocioP->eliminarPartidaGasto($this->_getParam('idnivelactiveconom'));

        if($bool == 2){
            echo "{'codigo':'3'}";
        }else{

            echo "{'codigo':'1'}";
        }
    }

}
