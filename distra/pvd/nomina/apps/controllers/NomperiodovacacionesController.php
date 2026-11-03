<?php

/**
 * Controlador para gestionar período de vacaciones.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomPeriodoVacacionesModel
 * @copyright UCID
 * @version 1.0
 */
class NomperiodovacacionesController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de período de vacaciones.
     */
    public function nomperiodovacacionesAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

     /**
     * Accion utilizada para listar los datos de los períodos de vacaciones.
     */
    public function obtenerListadoPeriodosVacacionesAction() {

        //Creando el modelo de negocio de gestion de período de vacaciones.
        $modeloNegocioPerVac = new NomPeriodoVacacionesModel();
         
        //Obteniendo el listado de período de vacaciones.
        $arrPerVac = $modeloNegocioPerVac->obtenerListadoPeriodoVacaciones(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        //Obteniendo la cantidad total de período de vacaciones
        $cantTotalPerVac = $modeloNegocioPerVac->obtenerCantidadTotalPeriodoVacaciones();

        //Imprimiendo el listado de período de vacaciones
        echo Zend_Json::encode(array('datos' => $arrPerVac, 'cantidad' => $cantTotalPerVac));
		// echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar un período de vacaciones.
     */
    public function adicionarPeriodoVacacionesAction() {

        //Creando el modelo de negocio de gestion de período de vacaciones.
        $modeloNegocioPerVac = new NomPeriodoVacacionesModel();
        
        //Insertando los datos del tipo de nómina.
        $modeloNegocioPerVac->adicionarPeriodoVacaciones(
            $this->_getParam('tiempootorgar'),
            $this->_getParam('tiempodescontar'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar un período de vacaciones.
     */
    public function modificarPeriodoVacacionesAction() {

        //Creando el modelo de negocio de gestion de períodos de vacaciones
        $modeloNegocioPerVac = new NomPeriodoVacacionesModel();

        //Modificando los datos del período de vacaciones.
        $modeloNegocioPerVac->modificarPeriodoVacaciones(
            $this->_getParam('idperiodovacaciones'),
            $this->_getParam('tiempootorgar'),
            $this->_getParam('tiempodescontar'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar un período de vacaciones.
     */
    public function eliminarPeriodoVacacionesAction() {

        //Creando el modelo de negocio de gestion de períodos de vacaciones
        $modeloNegocioPerVac = new NomPeriodoVacacionesModel();

        //Eliminando el período de vacaciones.
        $modeloNegocioPerVac->eliminarPeriodoVacaciones(
            $this->_getParam('idperiodovacaciones')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente
        echo "{'codigo':'1'}";
    }
}