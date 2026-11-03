<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar conceptos de la retribución monetaria.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomConceptoRMModel
 * @copyright UCID
 * @version 1.0
 */
class NomconceptormController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los conceptos de la retribución monetaria.
     */
    public function nomconceptormAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los conceptos de la retribución monetaria.
     */
    public function obtenerListadoConceptoRMAction()
    {

        //Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $modeloNegocioConceptoRM = new NomConceptoRMModel();

        //Obteniendo el listado de conceptos.
        $arrConceptos = $modeloNegocioConceptoRM->obtenerListadoConceptosRM($this->_getParam('start', 0),
            $this->_getParam('limit', 10));

        //Obteniendo la cantidad total de conceptos.
        $cantTotalConceptos = $modeloNegocioConceptoRM->obtenerCantidadTotalConceptosRM();

        //Imprimiendo el listado de conceptos.
        echo Zend_Json::encode(array('datos' => $arrConceptos, 'cantidad' => $cantTotalConceptos));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar un concepto de la retribución monetaria.
     */
    public function adicionarConceptoRetribucionMonetariaAction()
    {
        //Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $modeloNegocioConceptoRM = new NomConceptoRMModel();

        //Insertando los datos del concepto.
        $resp = $modeloNegocioConceptoRM->adicionarConceptoRetribucionMonetaria($this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('idparrafofiscal'),
            $this->_getParam('idclienteproveedorcobropago'));
        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar un concepto de la retribución monetaria.
     */
    public function modificarConceptoRetribucionMonetariaAction()
    {
        //Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $modeloNegocioConceptoRM = new NomConceptoRMModel();

        //Modificando los datos del concepto.
        $resp = $modeloNegocioConceptoRM->modificarConceptoRetribucionMonetaria($this->_getParam('idconceptorm'),
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('idparrafofiscal'),
            $this->_getParam('idclienteproveedorcobropago'));
        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar un concepto de la retribución monetaria.
     */
    public function eliminarConceptoRetribucionMonetariaAction()
    {

        //Creando el modelo de negocio de gestion de conceptos de la retribución monetaria.
        $modeloNegocioConceptoRM = new NomConceptoRMModel();

        //Eliminando el concepto.
        $bool = $modeloNegocioConceptoRM->eliminarConceptoRetribucionMonetaria($this->_getParam('idconceptorm'));

        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para exportar los conceptos RM
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomConceptoRMModel();
        $datos = $obj->obtenerListadoConceptosRM(0,1000);
        $r = $obj->fnExportarNomenclador($datos);
        echo json_encode($r);
    }
}
