<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar las cuentas del cierre
 *
 * @author Elizabeth Cordero Diaz.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomcuentascierreModel
 * @copyright UCID
 * @version 1.0
 */

 class NomcuentascierreController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase.
     */
    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de las CC.
     */
    public function nomcuentascierreAction() {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las CC.
     */
    public function obtenerListadoCuentasAction() {

      //Creando el modelo de negocio de gestion de las CC
        $modeloCC = new NomcuentascierreModel();

        //Obteniendo el listado de las CC
        $arrCC = $modeloCC->obtenerListadoCuentas(
            $this->_getParam('start',0),
            $this->_getParam('limit',10)

        ); //Obteniendo la cantidad total de las CC
        $cantTotalCC = $modeloCC->obtenerCantidadTotalCuentas();
         //Imprimiendo el listado de las CC
        echo Zend_Json::encode(array('datos' => $arrCC, 'cantidad' => $cantTotalCC));
        
    }
	
	/**
     * Accion utilizada para listar las cc
     */
    public function obtenerTodasCuentasAction() {

        //Creando el modelo de negocio de gestion de las CC
        $modeloCC = new NomcuentascierreModel();
        
        //Obteniendo el listado de las CC
        $arrCC = $modeloCC->obtenerTodasCuentas();
        
        //Imprimiendo el listado de las CC
        echo Zend_Json::encode(array('datos' => $arrCC, 'cantidad' => count($arrCC)));
    }

    /**
     * Accion utilizada para obtener las cuentas contables.
     */
    public function obtenerCuentasAction() {  
        //Creando el modelo de negocio de gestion de las CC
        $modeloCC = new NomcuentascierreModel();
        $cuentas=array();
        //Obteniendo el listado de las CC
        $array = $modeloCC->obtenerCuentas();
        echo Zend_Json::encode(array('datos'=>$array, 'cont'=> count($array)));
    }
	
    /**
     * Accion para adicionar una CC.
     */
    public function adicionarCCAction() {
        $tipo= $this->_getParam('tipo');
        $idcuenta = $this->_getParam('idcuenta'); 
       ////Creando el modelo de negocio de gestion de las CC
    $modeloCC = new NomcuentascierreModel();
    //Insertando los datos de la CC.
    $resp = $modeloCC->adicionarCC($idcuenta, $tipo);  
    // Devolviendo una notificación de que todo ocurrió correctamente.      
    if ($resp == 2) {
        echo "{'codigo':'1'}";
    } else {
        echo "{'codigo':'3':'Lacuenta de cierre que quiere adicionar ya existe.'}";
    }
        }


     /**
     * Accion para modificar una cuenta.
     */
    public function modificarCCAction() {
        $id=$this->_getParam('id');  //print_r($id);die;
        $tipo= $this->_getParam('tipo');
        $idcuenta = $this->_getParam('idcuenta'); 
        $mg = Doctrine_Manager::getInstance();
	    $conn = $mg->getCurrentConnection();
        if($idcuenta!=null){
        $sqlupdate = "UPDATE mod_nomina.nom_cuentascierre
        SET idcuenta = $idcuenta, tipo = $tipo WHERE id = $id;";  
			$conn->execute($sqlupdate);
       $respuesta->codigo = '1';
     } else {
        $respuesta->codigo = '3';
    }    
      $conn->commit();  
   // print_r($respuesta);die;
    echo json_encode($respuesta);
}   
       
    
        
    
    /**
     * Accion para eliminar un grupo escala.
     */
    public function eliminarCCAction() {    
        $respuesta = new stdClass();
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arryidcuenta = Zend_Json::decode(stripslashes($this->_getParam('arryidcuenta')));
        //comprobando si el arreglo no se encuentra vasio;  
        if (count($arryidcuenta) > 0){
            foreach ($arryidcuenta as $i => $value){
                $sqldelete = "DELETE FROM mod_nomina.nom_cuentascierre
                            WHERE idcuenta = $value;";  
                $conn->execute($sqldelete);
            }
            $respuesta->codigo = '1';
        } else {
            $respuesta->codigo = '3';
        }    
        $conn->commit();    //print_r($respuesta);die;
        echo json_encode($respuesta);
    }   
     /**
     * Accion utilizada para exportar los conceptos RM
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomcuentascierreModel();
        $datos = $obj->obtenerListadoCuentas(0,1000);
        $r = $obj->fnExportarNomenclador($datos);
        echo json_encode($r);
    }
}
