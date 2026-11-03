<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar las causas de exclusión de la nómina.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomCausaExclusionNominaModel
 * @copyright UCID
 * @version 1.0
 */
class NomcausasexclusionnominaController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de las causas de exclusión.
     */
    public function nomcausasexclusionnominaAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las causas de exclusión.
     */
    public function obtenerListadoCausasExclusionNominaAction()
    {
        //Creando el modelo de negocio de gestion de las causas de exclusión.
        $modeloNegocioCE = new NomCausasExclusionNominaModel();

        //Obteniendo el listado de las causas de exclusión.
        $arrCE = $modeloNegocioCE->obtenerListadoCausasExclusionNomina($this->_getParam('start', 0),
            $this->_getParam('limit', 10));
        //Obteniendo la cantidad total de las causas de exclusión.
        $cantTotalCE = $modeloNegocioCE->obtenerCantidadTotalCausasExclusionNomina();

        //Imprimiendo el listado de las causas de exclusión.
        echo Zend_Json::encode(array('datos' => $arrCE, 'cantidad' => $cantTotalCE));
        //echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar una causa de exclusión.
     */
    public function adicionarCausasExclusionNominaAction()
    {

        $objV = new NomCausasExclusionNomina();
        $bool = $objV->existeCausaExclusion(NULL, $this->_getParam('denominacion'));

        if ($bool) {
            echo "{'codigo':'3','msg':'La causa de exclusión de la nómina que quiere adicionar ya existe.'}";
        } else {
            //Creando el modelo de negocio de gestion de las causas de exclusión.
            $modeloNegocioCE = new NomCausasExclusionNominaModel();

            //Insertando los datos de la causa de exclusión.
            $resp = $modeloNegocioCE->adicionarCausasExclusionNomina($this->_getParam('denominacion'),
                $this->_getParam('fechainicio'),
                $this->_getParam('fechafin'),
                $this->_getParam('descripcion'));

            //Devolviendo una notificación de que todo ocurrió correctamente.

            echo "{'codigo':'1'}";

        }


    }

    /**
     * Accion para modificar una causa de exclusión.
     */
    public function modificarCausasExclusionNominaAction()
    {
        $bool = NominaValidator:: modificarDenomCausaExclusion($this->_getParam('idcausaexclusion')
            , $this->_getParam('denominacion'));
        if ($bool) {
            //Creando el modelo de negocio de gestion de las causas de exclusión.
            $modeloNegocioCE = new NomCausasExclusionNominaModel();

            //Modificando los datos de la causa de exclusión.
            $resp = $modeloNegocioCE->modificarCausasExclusionNomina($this->_getParam('idcausaexclusion'),
                $this->_getParam('denominacion'),
                $this->_getParam('fechainicio'),
                $this->_getParam('fechafin'),
                $this->_getParam('descripcion'));

            //Devolviendo una notificación de que todo ocurrió correctamente.

            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','msg':'La causa de exclusión de la nómina que quiere modificar ya existe.'}";
        }


    }

    /**
     * Accion para eliminar una causa de exclusión.
     */
    public function eliminarCausasExclusionNominaAction()
    {

        //Creando el modelo de negocio de gestion de las causas de exclusión.
        $modeloNegocioCE = new NomCausasExclusionNominaModel();

        //Eliminando la causa de exclusión.
        $bool = $modeloNegocioCE->eliminarCausasExclusionNomina($this->_getParam('idcausaexclusion'));
        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para exportar las causas de exclusión.
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomCausasExclusionNominaModel();
        $arrCausas = $obj->obtenerListadoCausasExclusionNomina(0,1000);
        $r = $obj->fnExportarNomenclador($arrCausas);
        echo json_encode($r);
    }
}
