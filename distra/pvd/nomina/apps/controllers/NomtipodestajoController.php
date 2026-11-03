<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar tipos de nómina.
 *
 * @author Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomTipoDestajoModel
 * @copyright UCID
 * @version 1.0
 */
class NomtipodestajoController extends ZendExt_Controller_Secure {

    /**
      * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }    
    
    public function obtenerListadoDestajoAction() {
        $inicio = $this->_getParam('start', 0);
        $limite = $this->_getParam('limit', 10);
        //Creando el modelo de negocio de gestion de tipos de destajo.
        $objTipoDestajo = new NomTipoDestajoModel();
        //Obteniendo el listado de tipos de destajo.
        $result = $objTipoDestajo->obtenerListadoDestajo($inicio, $limite);

        //Imprimiendo el listado de tipos de destajo.
        echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result)));
    }  
    
    public function adicionarDestajoAction() {
        $denominacion = $this->_getParam('denominacion');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $descripcion = $this->_getParam('descripcion');
        //Creando el modelo de negocio de gestion de tipos de destajo.
        $objTipoDestajo = new NomTipoDestajoModel();
        //Obteniendo el listado de tipos de destajo.
        $result = $objTipoDestajo->adicionarDestajo($denominacion, $fechainicio, $fechafin, $descripcion);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($result == 2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El tipo de destajo que quiere adicionar ya existe.'}";
        }
    } 

    /**
     * Accion para eliminar un tipo de destajo.
     */    
    public function modificarDestajoAction() {
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $denominacion = $this->_getParam('denominacion');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $descripcion = $this->_getParam('descripcion');
        //Creando el modelo de negocio de gestion de tipos de destajo.
        $objTipoDestajo = new NomTipoDestajoModel();
        //Obteniendo el listado de tipos de destajo.
        $result = $objTipoDestajo->modificarDestajo($idnomtipodestajo, $denominacion, $fechainicio, $fechafin, $descripcion);

        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar un tipo de destajo.
     */
    public function eliminarTiposDestajoAction() 
    {
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        //Creando el modelo de negocio de gestion de tipos de destajo.
        $objTipoDestajo = new NomTipoDestajoModel();

        //Eliminando el tipo de destajo.
        $result = $objTipoDestajo->eliminarTiposDestajo($idnomtipodestajo);

        if($result == 2){
			echo "{'codigo':'3'}";
		}else{
			//Devolviendo una notificación de que todo ocurrió correctamente
			echo "{'codigo':'1'}";
	    }
    }
}
