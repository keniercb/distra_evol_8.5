<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar tipos de retenciones.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomTipoRetencionModel
 * @copyright UCID
 * @version 1.0
 */
class NomtiporetencionController extends ZendExt_Controller_Secure
{
    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de retenciones.
     */
    public function nomtiporetencionAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los tipos de retenciones.
     */
    public function obtenerListadoTiposRetencionAction()
    {
        //Estructura economica
        $idestructuraE = $this->global->EstructuraEconomica->idestructurae;
        //Creando el modelo de negocio de gestion de tipos de retenciones.
        $modeloNegocioTipoRetencion = new NomTipoRetencionModel();

        //Obteniendo el listado de tipos de retenciones.
        $arrTipoRetencion = $modeloNegocioTipoRetencion->obtenerListadoTiposRetencion(
            $this->_getParam('start', 0), $this->_getParam('limit', 10)
        );

        foreach ($arrTipoRetencion as $k => $v) {
            //Si es una estructura economica
            if ($idestructuraE) {
                if (!empty($v['cuentacontable'])) {
                    $arrTipoRetencion[$k]['denom'] = $this->integrator->contabilidad->obtenerCuentaPorId($v['cuentacontable'])->text;
                }
            }

        }

        //Obteniendo la cantidad total de tipos de retenciones.
        $cantTotalTipoRetencion = $modeloNegocioTipoRetencion->obtenerCantidadTotalTiposRetencion();

        //Imprimiendo el listado de tipos de retenciones.
        echo Zend_Json::encode(array('datos' => $arrTipoRetencion, 'cantidad' => $cantTotalTipoRetencion));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar un tipo de retencion.
     */
    public function adicionarTipoRetencionAction()
    {

        //Creando el modelo de negocio de gestion de tipos de retenciones.
        $modeloNegocioTipoRetencion = new NomTipoRetencionModel();

        //Insertando los datos del tipo de retencion.
        $resp = $modeloNegocioTipoRetencion->adicionarTipoRetencion(
            $this->_getParam('abreviatura'), $this->_getParam('denominacion'), $this->_getParam('saldolimite'), $this->_getParam('fechainicio'), $this->_getParam('fechafin'), $this->_getParam('descripcion'), $this->_getParam('cuentacontable')
            , $this->_getParam('orden'), $this->_getParam('tienelimitemaximo'), $this->_getParam('cobrosypagos')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'El tipo de retención que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un tipo de retencion.
     */
    public function modificarTipoRetencionAction()
    {

        //Creando el modelo de negocio de gestion de tipos de retenciones.
        $modeloNegocioTipoRetencion = new NomTipoRetencionModel();

        //Modificando los datos del tipo de retencion.
        $resp = $modeloNegocioTipoRetencion->modificarTipoRetencion(
            $this->_getParam('idtiporetencion'), $this->_getParam('abreviatura'), $this->_getParam('denominacion'), $this->_getParam('saldolimite'), $this->_getParam('fechainicio'), $this->_getParam('fechafin'), $this->_getParam('descripcion'), $this->_getParam('cuentacontable')
            , $this->_getParam('orden'), $this->_getParam('tienelimitemaximo'), $this->_getParam('cobrosypagos')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'El tipo de retención ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un tipo de retencion.
     */
    public function eliminarTipoRetencionAction()
    {

        //Creando el modelo de negocio de gestion de tipos de retenciones.
        $modeloNegocioTipoRetencion = new NomTipoRetencionModel();

        //Eliminando el tipo de retencion.
        $bool = $modeloNegocioTipoRetencion->eliminarTipoRetencion($this->_getParam('idtiporetencion'));

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
        $idestructuraE = $this->global->EstructuraEconomica->idestructurae;
        $obj = new NomTipoRetencionModel();
        $arr = $obj->obtenerListadoTiposRetencion(0, 1000);
        foreach ($arr as $k => $v) {
            //Si es una estructura economica
            if ($idestructuraE) {
                if (!empty($v['cuentacontable']))
                    $arr[$k]['denom'] = $this->integrator->contabilidad->obtenerCuentaPorId($v['cuentacontable'])->text;
            }

        }//print_r($arr);die;
        $r = $obj->fnExportarNomenclador($arr);
        echo json_encode($r);
    }
}
