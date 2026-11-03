<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar tipos de billetes.
 *
 * @author Ing. Dainier Velazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomBilleteModel
 * @copyright UCID
 * @version 1.0
 */
class NombilleteController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de billetes.
     */
    public function nombilleteAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los tipos de billetes.
     */
    public function obtenerListadoBilletesAction()
    {

        //Creando el modelo de negocio de gestion de tipos de nómina.
        $modeloNegocioBillete = new NomBilleteModel();
        //Obteniendo el listado de tipos de nómina.
        $arrTiposBilletes = $modeloNegocioBillete->obtenerListadoBilletes($this->_getParam('start',0),$this->_getParam('limit',10000));
        $cantBilletes = $modeloNegocioBillete->cantBilletes();
        //Imprimiendo el listado de tipos de billetes
        echo Zend_Json::encode(array('datos' => $arrTiposBilletes, 'cantidad' => $cantBilletes));
    }

    /**
     * Accion para adicionar un tipo de billete.
     */
    public function adicionarBilleteAction()
    {
        $denominacion = $this->_getParam('denominacion');
        $orden = $this->_getParam('orden');
        $tipomoneda = $this->_getParam('tipomoneda');
        $monedaactiva = $this->_getParam('activo');

        //Creando el modelo de negocio de gestion de tipos de billetes.
        $modeloNegocioBillete = new NomBilleteModel();

        //Insertando los datos del tipo de billete.
        $codigo = $modeloNegocioBillete->adicionarBillete($denominacion, $orden, $tipomoneda, $monedaactiva);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'" . $codigo . "', 'tipomoneda':'" . $tipomoneda . "'}";
    }

    /**
     * Accion para modificar un tipo de billete.
     */
    public function modificarBilleteAction()
    {
        $idbillete = $this->_getParam('idbillete');
        $denominacion = $this->_getParam('denominacion');
        $orden = $this->_getParam('orden');
        $tipomoneda = $this->_getParam('tipomoneda');
        $monedaactiva = $this->_getParam('activo');

        //Creando el modelo de negocio de gestion de tipos de billetes.
        $modeloNegocioBillete = new NomBilleteModel();

        //Modificando los datos del tipo de billete.
        $codigo = $modeloNegocioBillete->modificarBillete($idbillete, $denominacion, $orden, $tipomoneda, $monedaactiva);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'" . $codigo . "', 'tipomoneda':'" . $tipomoneda . "'}";
    }

    /**
     * Accion para eliminar tipos de billetes.
     */
    public function eliminarBilletesAction()
    {
        //Creando el modelo de negocio de gestion de tipos de billetes.
        $modeloNegocioBillete = new NomBilleteModel();

        //Eliminando el tipo de billete.
        $resp = $modeloNegocioBillete->eliminarBillete($this->_getParam('idbillete'));

        //Devolviendo una notificación de que todo ocurrió correctamente
        $r = ($resp == 1) ? "{'codigo':'1'}" : "{'codigo':'3'}";

        echo $r;
    }

    /**
     * Accion utilizada para exportar billetes
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomBilleteModel();
        $arrBilletes = $obj->obtenerListadoBilletes();
        $r = $obj->fnExportarNomenclador($arrBilletes);
        echo json_encode($r);
    }
}
