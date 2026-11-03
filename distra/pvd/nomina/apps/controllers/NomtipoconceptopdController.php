<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar tipos de conceptos de percepciones y descuentos.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomTipoConceptoPDModel
 * @copyright UCID
 * @version 1.0
 */
class NomtipoconceptopdController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de conceptos de percepciones y descuentos.
     */
    public function nomtipoconceptopdAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los tipos de conceptos de percepciones y descuentos.
     */
    public function obtenerListadoTiposConceptoPDAction() {

        //Creando el modelo de negocio de gestion de los tipos de conceptos de percepciones y descuentos.
        $modeloNegocioTiposConceptos = new NomTipoConceptoPDModel();
        
        //Obteniendo el listado de tipos de conceptos de percepciones y descuentos.
        $arrTiposConceptos = $modeloNegocioTiposConceptos->obtenerListadoTiposConceptoPD(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        
        //Obteniendo la cantidad total de tipos de conceptos.
        $cantTotalTiposConceptos = $modeloNegocioTiposConceptos->obtenerCantidadTotalTiposConceptoPD();

        //Imprimiendo el listado de tipos de conceptos.
        echo Zend_Json::encode(array('datos' => $arrTiposConceptos, 'cantidad' => $cantTotalTiposConceptos));
		// echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar un tipo de concepto de percepciones y descuentos.
     */
    public function adicionarTipoConceptoPDAction() {

        //Creando el modelo de negocio de gestion de los tipos de conceptos de percepciones y descuentos.
        $modeloNegocioTiposConceptos = new NomTipoConceptoPDModel();

        //Insertando los datos del tipo de concepto de percepciones y descuentos.
        $resp= $modeloNegocioTiposConceptos->adicionarTipoConceptoPD(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El tipo de concepto de percepción y descuento que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un tipo de concepto de percepciones y descuentos.
     */
    public function modificarTipoConceptoPDAction() {

        //Creando el modelo de negocio de gestion de los tipos de conceptos de percepciones y descuentos.
        $modeloNegocioTiposConceptos = new NomTipoConceptoPDModel();

        //Modificando los datos del tipo de concepto de percepciones y descuentos.
        $resp= $modeloNegocioTiposConceptos->modificarTipoConceptoPD(
            $this->_getParam('idtipoconceptopd'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El tipo de concepto de percepción y descuento ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un tipo de concepto de percepciones y descuentos.
     */
    public function eliminarTipoConceptoPDAction() {

        //Creando el modelo de negocio de gestion de los tipos de conceptos de percepciones y descuentos.
        $modeloNegocioTiposConceptos = new NomTipoConceptoPDModel();

        //Eliminando el tipo de concepto de percepciones y descuentos.
        $bool = $modeloNegocioTiposConceptos->eliminarTipoConceptoPD($this->_getParam('idtipoconceptopd'));

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
        $obj = new NomTipoConceptoPDModel();
        $arr = $obj->obtenerListadoTiposConceptoPD(0,1000);
        $r = $obj->fnExportarNomenclador($arr);
        echo json_encode($r);
    }
}
