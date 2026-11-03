<?php

/**
 * Controlador para gestionar grupos escala.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomGrupoEscalaModel
 * @copyright UCID
 * @version 1.0
 */
class NomgrupoescalaController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de los grupos escala.
     */
    public function nomgrupoescalaAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los grupos escala.
     */
    public function obtenerListadoGruposEscalaAction() {

        //Creando el modelo de negocio de gestion de grupos escala.
        $modeloNegocioGrupoE = new NomGrupoEscalaModel();
        
        //Obteniendo el listado de grupos escala.
        $arrGrupoE = $modeloNegocioGrupoE->obtenerListadoGruposEscala(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        
        //Obteniendo la cantidad total de grupos escala.
        $cantTotalGrupoE = $modeloNegocioGrupoE->obtenerCantidadTotalGruposEscala();

        //Imprimiendo el listado de grupos escala.
        echo Zend_Json::encode(array('datos' => $arrGrupoE, 'cantidad' => $cantTotalGrupoE));
		// echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }
	
	/**
     * Accion utilizada para listar todos los grupos escala.
     */
    public function obtenerTodosGruposEscalaAction() {

        //Creando el modelo de negocio de gestion de grupos escala.
        $modeloNegocioGrupoE = new NomGrupoEscalaModel();
        
        //Obteniendo el listado de grupos escala.
        $arrGrupoE = $modeloNegocioGrupoE->obtenerTodosGruposEscala();
        
        //Imprimiendo el listado de grupos escala.
        echo Zend_Json::encode(array('datos' => $arrGrupoE, 'cantidad' => count($arrGrupoE)));
    }
	
    /**
     * Accion para adicionar un grupo escala.
     */
    public function adicionarGrupoEscalaAction() {

        //Creando el modelo de negocio de gestion de grupos escala.
        $modeloNegocioGrupoE = new NomGrupoEscalaModel();

        //Insertando los datos del grupo escala.
        $resp=$modeloNegocioGrupoE->adicionarGrupoEscala(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El grupo escala que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un grupo escala.
     */
    public function modificarGrupoEscalaAction() {

        //Creando el modelo de negocio de gestion de grupos escala.
        $modeloNegocioGrupoE = new NomGrupoEscalaModel();

        //Modificando los datos del grupo escala.
        $resp= $modeloNegocioGrupoE->modificarGrupoEscala(
            $this->_getParam('idgrupoescala'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El grupo escala que quiere modificar ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un grupo escala.
     */
    public function eliminarGrupoEscalaAction() {

        //Creando el modelo de negocio de gestion de grupos escala.
        $modeloNegocioGrupoE = new NomGrupoEscalaModel();

        //Eliminando el grupo escala.
        $bool = $modeloNegocioGrupoE->eliminarGrupoEscala(
            $this->_getParam('idgrupoescala')
        );

        if($bool == 2){
		 echo "{'codigo':'3'}";
		}else{
       //Devolviendo una notificación de que todo ocurrió correctamente
         echo "{'codigo':'1'}";
	    }
    }
}
