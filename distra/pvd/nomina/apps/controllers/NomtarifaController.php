<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar tarifas.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomTarifaController
 * @copyright UCID
 * @version 1.0
 */
class NomtarifaController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de las tarifas.
     */
    public function nomtarifaAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las tarifas.
     */
    public function obtenerListadoTarifaAction()
    {
        //Creando el modelo de negocio de gestion de tarifas.
        $modeloNegocioTarifa = new NomTarifaModel();

        //Obteniendo el listado de tarifas.
        $arrTarifa = $modeloNegocioTarifa->obtenerListadoTarifa(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        //Obteniendo la cantidad total de tarifas.
        $cantTotalTarifa = $modeloNegocioTarifa->obtenerCantidadTotalTarifa();

        //Imprimiendo el listado de tarifas.
        echo Zend_Json::encode(array('datos' => $arrTarifa, 'cantidad' => $cantTotalTarifa));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar un tipo de nómina.
     */
    public function adicionarTarifaAction()
    {

        //Creando el modelo de negocio de gestion de tarifas.
        $modeloNegocioTarifa = new NomTarifaModel();

        //Insertando los datos del tipo de nómina.
        $resp = $modeloNegocioTarifa->adicionarTarifa(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'La tarifa que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un tipo de nómina.
     */
    public function modificarTarifaAction()
    {

        //Creando el modelo de negocio de gestion de tarifas.
        $modeloNegocioTarifa = new NomTarifaModel();

        //Modificando los datos del tipo de nómina.
        $resp = $modeloNegocioTarifa->modificarTarifa(
            $this->_getParam('idtarifa'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'La tarifa ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un tipo de nómina.
     */
    public function eliminarTarifaAction()
    {

        //Creando el modelo de negocio de gestion de tarifas.
        $modeloNegocioTarifa = new NomTarifaModel();

        //Eliminando el tipo de nómina.
        $bool = $modeloNegocioTarifa->eliminarTarifa($this->_getParam('idtarifa'));

        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para exportar las tarifas
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomTarifaModel();
        $datos = $obj->obtenerListadoTarifa(0,1000);
        $r = $obj->fnExportarNomenclador($datos);
        echo json_encode($r);
    }
}
