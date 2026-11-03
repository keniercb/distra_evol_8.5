<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar variables globales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomVariableGlobalModel
 * @copyright UCID
 * @version 1.0
 */
class NomvariableglobalController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de las variables globales.
     */
    public function nomvariableglobalAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las variables globales.
     */
    public function obtenerListadoVariablesGlobalesAction()
    {

        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVarGlobal = new NomVariableGlobalModel();

        //Obteniendo el listado de variables globales.
        $arrVarGlobal = $modeloNegocioVarGlobal->obtenerListadoVariablesGlobales(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );

        //Obteniendo la cantidad total de variables globales.
        $cantTotalVarGlobal = $modeloNegocioVarGlobal->obtenerCantidadTotalVariablesGlobales();

        //Imprimiendo el listado de variables globales.
        echo Zend_Json::encode(array('datos' => $arrVarGlobal, 'cantidad' => $cantTotalVarGlobal));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion utilizada para obtener los niveles de configuración.
     */
    public function obtenerNivelesConfiguracionAction()
    {

        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVarGlobal = new NomVariableGlobalModel();

        //Obteniendo el arreglo de variables globales.
        $arrNivelConfig = $modeloNegocioVarGlobal->obtenerArregloNivelesConfiguracion();

        //Imprimiendo el arreglo de niveles de configuración.
        echo Zend_Json::encode(array('datos' => $arrNivelConfig));
    }

    /**
     * Accion para adicionar una variable global.
     */
    public function adicionarVariableGlobalAction()
    {

        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVarGlobal = new NomVariableGlobalModel();

        //Insertando los datos de la variable global.
        $resp = $modeloNegocioVarGlobal->adicionarVariableGlobal(
            $this->_getParam('idnivelconfig'),
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('lugaresdecimales')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.

        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'El período de pago que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar una variable global.
     */
    public function modificarVariableGlobalAction()
    {

        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVarGlobal = new NomVariableGlobalModel();

        //Modificando los datos de la variable global.
        $resp = $modeloNegocioVarGlobal->modificarVariableGlobal(
            $this->_getParam('idvariableglobal'),
            $this->_getParam('idnivelconfig'),
            $this->_getParam('abreviatura'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('lugaresdecimales')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'La variable global que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para eliminar una variable global.
     */
    public function eliminarVariableGlobalAction()
    {

        //Creando el modelo de negocio de gestion de variables globales.
        $modeloNegocioVarGlobal = new NomVariableGlobalModel();

        //Eliminando la variable global.
        $bool = $modeloNegocioVarGlobal->liminarVariableGlobal($this->_getParam('idvariableglobal'));

        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion de exportar
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomVariableGlobalModel();
        $arr = $obj->obtenerListadoVariablesGlobales(0, 1000);//print_r($arr);die;
        $r = $obj->fnExportarNomenclador($arr);
        echo json_encode($r);
    }
}
