<?php

/**
 * Controlador para gestionar tipos de nómina.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomObraModel
 * @copyright UCID
 * @version 1.0
 */
class NomObraController extends ZendExt_Controller_Secure {

    /**
      * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de nómina.
     */
    public function nomobraAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los tipos de nómina.
     */
    public function obtenerListadoObrasAction() {
        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioObra = new NomObraModel();
        //Obteniendo el listado de tipos de nómina.
        $arrTiposN = $modeloNegocioObra->obtenerListadoObra(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        //Obteniendo la cantidad total de tipos de nómina.
        $cantTotalTiposN = $modeloNegocioObra->obtenerCantidadTotalObra();

        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode(array('datos' => $arrTiposN, 'cantidad' => $cantTotalTiposN));
		// echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }
	
	/**
     * Accion para adicionar un tipo de nómina.
     */
    public function adicionarObraAction() {

        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioObra = new NomObraModel();

        //Insertando los datos del tipo de nómina.
        $modeloNegocioObra->adicionarObra(
            $this->_getParam('denominacion'),
			$this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );
        //Devolviendo una notificación de que todo ocurrió correctamente.
       echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar un tipo de nómina.
     */
    public function modificarObraAction() {

        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioObra = new NomObraModel();

        //Modificando los datos del tipo de nómina.
        $modeloNegocioObra->modificarObra(
            $this->_getParam('idobra'),
            $this->_getParam('denominacion'),
			$this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar un tipo de nómina.
     */
    public function eliminarObraAction() {

        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioObra = new NomObraModel();

        //Eliminando el tipo de nómina.
        $bool = $modeloNegocioObra->eliminarObra($this->_getParam('idobra'));

        if($bool == 2){
			echo "{'codigo':'3'}";
		}else{
			//Devolviendo una notificación de que todo ocurrió correctamente
			echo "{'codigo':'1'}";
	    }
    }
}
