<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar salarios escala.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomSalarioEscalaModel
 * @copyright UCID
 * @version 1.0
 */
class NomsalarioescalaController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de los salarios escalas.
     */
    public function nomsalarioescalaAction() {

        //Agregando a la vista los ficheros js de la ayuda.
       // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

     /**
     * Accion utilizada para contruir dinámicamente el modelo y la vista de la interfaz a partir 
     * de los sectores salariales.
     */
    public function obtenerArregloEstructuraAction() {

        //Creando el modelo de negocio de gestion de salarios escalas.
        $modeloNegocioSalEsc = new NomSalarioEscalaModel();
        
        //Obteniendo el arreglo de la estructura de la interfaz.
        $arrEstruc = $modeloNegocioSalEsc->obtenerArregloEstructura();

        //Imprimiendo el arreglo de la estructura.
        echo Zend_Json::encode($arrEstruc);
    }

    /**
     * Accion utilizada para obtener el listado de salarios escalas.
     */
    public function obtenerListadoSalariosEscalasAction() {

        //Creando el modelo de negocio de gestion de salarios escalas.
        $modeloNegocioSalEsc = new NomSalarioEscalaModel();
        
        //Obteniendo el listado de salarios escalas.
        $arrSalEsc = $modeloNegocioSalEsc->obtenerListadoSalariosEscalas(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );

        //Obteniendo la cantidad total de salarios escalas.
        $cantTotalSalEsc = $modeloNegocioSalEsc->obtenerCantidadTotalSalariosEscalas();

        //Imprimiendo el listado de tipos de pago.
        echo Zend_Json::encode(array('datos' => $arrSalEsc, 'cantidad' => $cantTotalSalEsc));
		// echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar salarios escalas.
     */
    public function adicionarSalariosEscalasAction() {
        
        ///Creando el modelo de negocio de gestion de salarios escalas.
        $modeloNegocioSalEsc = new NomSalarioEscalaModel();
        
        //Insertando los datos de los salarios escalas.
        $modeloNegocioSalEsc->adicionarSalariosEscalas(
            $this->_getParam('idgrupoescala'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            Zend_Json::decode(stripslashes($this->_getParam('salarios')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar salarios escalas.
     */
    public function modificarSalariosEscalasAction() {

        //Creando el modelo de negocio de gestion de salarios escalas.
        $modeloNegocioSalEsc = new NomSalarioEscalaModel();

        //Modificando los datos de los salarios escalas.
        $modeloNegocioSalEsc->modificarSalariosEscalas(
            $this->_getParam('idgrupoescala'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            Zend_Json::decode(stripslashes($this->_getParam('salarios')))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar salarios escalas.
     */
    public function eliminarSalariosEscalasAction() {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioSalEsc = new NomSalarioEscalaModel();

        //Eliminando el tipo de pago.
        $bool = $modeloNegocioSalEsc->eliminarSalariosEscalas($this->_getParam('idgrupoescala'));

        if($bool == 2){
			echo "{'codigo':'3'}";
		}else{
		   //Devolviendo una notificación de que todo ocurrió correctamente
			echo "{'codigo':'1'}";
	    }
    }

    /**
     * Accion de exportar
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomSalarioEscalaModel();
        $arr = $obj->obtenerListadoSalariosEscalas(0,1000);
        //Obteniendo el arreglo de la estructura de la interfaz.
        $arrEstruc = $obj->obtenerArregloEstructura();
        $r = $obj->fnExportarNomenclador($arr,$arrEstruc);
        echo json_encode($r);
    }
}
