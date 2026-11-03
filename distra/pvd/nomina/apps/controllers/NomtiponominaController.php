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
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomTipoNominaModel
 * @copyright UCID
 * @version 1.0
 */
class NomtiponominaController extends ZendExt_Controller_Secure {

    /**
      * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de nómina.
     */
    public function nomtiponominaAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los tipos de nómina.
     */
    public function obtenerListadoTiposNominaAction() {
        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioTipoN = new NomTipoNominaModel();
        //Obteniendo el listado de tipos de nómina.
        $arrTiposN = $modeloNegocioTipoN->obtenerListadoTiposNomina(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );

        //Obteniendo la cantidad total de tipos de nómina.
        $cantTotalTiposN = $modeloNegocioTipoN->obtenerCantidadTotalTiposNomina();

        //Imprimiendo el listado de tipos de nómina.
        echo Zend_Json::encode(array('datos' => $arrTiposN, 'cantidad' => $cantTotalTiposN));
		// echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }
	
	/**
     * Accion utilizada para listar los datos de las operaciones contables.
     */
    public function obtenerOperacionesContablesAction() {
        //Dame el idsubsistema
        $idsubsistema = $this->global->Subsistema->idsubsistema;
		$datosoperaciones = $this->integrator->datosmaestros->obtenerOperaciones($this->global->Estructura->idestructura, 71/*$idsubsistema*/); //$idsubsistema
		//Array  devolver
		$arrayreturn = array();
		$cont = 0;
		//foreach($datosoperaciones['data'] as $i=>$value){
		foreach($datosoperaciones as $i=>$value){
		  $arrayreturn[$cont]['idoperacioncontable'] = $value['idnomoperaciones'];
		  $arrayreturn[$cont]['denomoperacioncontable'] = $value['denominacion'];
		  $cont++;
		}

        //Imprimiendo el listado de las operaciones contables.
        echo Zend_Json::encode(array('datos' => $arrayreturn, 'cantidad' => count($arrayreturn)));
		// echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion utilizada para listar los datos de las operaciones contables.
     */
    public function obtenerOperacionesContablesCuentasPorCobrarAction() {
        //Dame el idsubsistema
        $idsubsistema = $this->global->Subsistema->idsubsistema;
        $datosoperaciones = $this->integrator->datosmaestros->obtenerOperaciones($this->global->Estructura->idestructura, 71/*$idsubsistema*/); //$idsubsistema
        //Array  devolver
        $arrayreturn = array();
        $cont = 0;
        //foreach($datosoperaciones['data'] as $i=>$value){
        foreach($datosoperaciones as $i=>$value){
            $arrayreturn[$cont]['idoperacioncontablecuentasporcobrar'] = $value['idnomoperaciones'];
            $arrayreturn[$cont]['denomoperacioncontablecuentaspcobrar'] = $value['denominacion'];
            $cont++;
        }

        //Imprimiendo el listado de las operaciones contables.
        echo Zend_Json::encode(array('datos' => $arrayreturn, 'cantidad' => count($arrayreturn)));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar un tipo de nómina.
     */
    public function adicionarTipoNominaAction() {

        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioTipoN = new NomTipoNominaModel();
        
        //Insertando los datos del tipo de nómina.
        $resp=$modeloNegocioTipoN->adicionarTipoNomina(
            $this->_getParam('denominacion'),
			$this->_getParam('acumulac'),
			$this->_getParam('acumulasnc'),
			$this->_getParam('reintegro'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('tipomoneda'),
            $this->_getParam('operacioncontable'),
            $this->_getParam('operacioncontablecuentasporcobrar'),
            $this->_getParam('descripcion')
        );
        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El tipo de nómina que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un tipo de nómina.
     */
    public function modificarTiposNominaAction() {

        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioTipoN = new NomTipoNominaModel();

        //Modificando los datos del tipo de nómina.
        $resp=$modeloNegocioTipoN->modificarTipoNomina(
            $this->_getParam('idtiponomina'),
            $this->_getParam('denominacion'),
			$this->_getParam('acumulac'),
            $this->_getParam('acumulasnc'),
            $this->_getParam('reintegro'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('tipomoneda'),
            $this->_getParam('operacioncontable'),
            $this->_getParam('operacioncontablecuentasporcobrar'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($resp==2){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3','mensaje':'El tipo de nómina ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un tipo de nómina.
     */
    public function eliminarTiposNominaAction() {

        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioTipoN = new NomTipoNominaModel();

        //Eliminando el tipo de nómina.
        $bool = $modeloNegocioTipoN->eliminarTipoNomina($this->_getParam('idtiponomina'));

        if($bool == 2){
			echo "{'codigo':'3'}";
		}else{
			//Devolviendo una notificación de que todo ocurrió correctamente
			echo "{'codigo':'1'}";
	    }
    }

    public function exportarNomencladorAction()
    {
        $obj = new NomTipoNominaModel();
        $arr = $obj->obtenerListadoTiposNomina(0,1000);//print_r($arr);die;
        $r = $obj->fnExportarNomenclador($arr);
        echo json_encode($r);
    }
}
