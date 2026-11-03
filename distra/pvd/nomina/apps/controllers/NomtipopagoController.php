<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar tipos de pago.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomTipoPagoModel
 * @copyright UCID
 * @version 1.0
 */
class NomtipopagoController extends ZendExt_Controller_Secure
{
    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los tipos de pago.
     */
    public function nomtipopagoAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los tipos de pago.
     */
    public function obtenerListadoTiposPagoAction()
    {
        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new NomTipoPagoModel();

        //Obteniendo el listado de tipos de pago.
        $arrTiposP = $modeloNegocioTipoP->obtenerListadoTiposPago(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        foreach ($arrTiposP as $i => $tipopago) {
            $arrTiposP[$i]['orden'] = ($tipopago['orden'] < 10) ? '0' . $tipopago['orden'] : $tipopago['orden'];
        }

        //Obteniendo la cantidad total de tipos de pago.
        $cantTotalTiposP = $modeloNegocioTipoP->obtenerCantidadTotalTiposPago();

        //Imprimiendo el listado de tipos de pago.
        echo Zend_Json::encode(array('datos' => $arrTiposP, 'cantidad' => $cantTotalTiposP));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    public function obtenerListadoTipoReporteAction()
    {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoReporte = new ConfReportesCertificaciones();

        //Obteniendo el listado de tipos de pago.
        $arrTiposP = $modeloNegocioTipoReporte->obtenerListadoReportesCertificacionesCompleto();


        //Imprimiendo el listado de tipos de pago.
        echo Zend_Json::encode(array('datos' => $arrTiposP, 'cantidad' => count($arrTiposP)));
    }

    /************************VER ESTOS M"ETODOS*************************/
    public function obtenerModoSeleccionPersonaAction()
    {

        $arr[0]['idseleccionpersona'] = 1;
        $arr[0]['denommodoseleccionpersonas'] = "Elaborar pagos";
        $arr[1]['idseleccionpersona'] = 2;
        $arr[1]['denommodoseleccionpersonas'] = "Específicas";

        //Obteniendo la cantidad total del arreglo.
        $cant = count($arr);

        //Imprimiendo el listado de modos de seleccion de la persona.
        echo Zend_Json::encode(array('datos' => $arr, 'cantidad' => $cant));
    }

    public function obtenerFormaEfectuarPagoAction()
    {

        $arr[0]['idformaefectuarpago'] = 1;
        $arr[0]['denommodopago'] = "Pago por período";
        $arr[1]['idformaefectuarpago'] = 2;
        $arr[1]['denommodopago'] = "Mes específico";

        //Obteniendo la cantidad total del arreglo.
        $cant = count($arr);
        //Imprimiendo el listado de modos de seleccion de la persona.
        echo Zend_Json::encode(array('datos' => $arr, 'cantidad' => $cant));
    }

    /**
     * Accion para adicionar un tipo de pago.
     */
    public function adicionarTipoPagoAction()
    {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new NomTipoPagoModel();

        //Insertando los datos del tipo de pago.
        $resp = $modeloNegocioTipoP->adicionarTipoPago(
            $this->_getParam('denominacion'),
            $this->_getParam('sedesglosa'),
            $this->_getParam('modopago'),
            $this->_getParam('modoseleccionPersonas'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('idconfreportecertificaciones'),
            $this->_getParam('pagoxresultadosdestajo'),
            $this->_getParam('orden'),
            $this->_getParam('mismomes')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'El tipo de pago que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un tipo de pago.
     */
    public function modificarTipoPagoAction()
    {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new NomTipoPagoModel();

        //Modificando los datos del tipo de pago.
        $resp = $modeloNegocioTipoP->modificarTipoPago(
            $this->_getParam('idtipopago'),
            $this->_getParam('denominacion'),
            $this->_getParam('sedesglosa'),
            $this->_getParam('modopago'),
            $this->_getParam('modoseleccionPersonas'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('idconfreportecertificaciones'),
            $this->_getParam('pagoxresultadosdestajo'),
            $this->_getParam('orden'),
            $this->_getParam('mismomes')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'El tipo de pago ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un tipo de pago.
     */
    public function eliminarTipoPagoAction()
    {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new NomTipoPagoModel();

        //Eliminando el tipo de pago.
        $bool = $modeloNegocioTipoP->eliminarTipoPago($this->_getParam('idtipopago'));

        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    public function obtenerListadoTiposPagoDependenciaAction()
    {////////////////////////////////////////////////

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new ConfTipoPagoDependenciaModel();

        //Insertando los datos del tipo de pago.
        $resp = $modeloNegocioTipoP->obtenerArregloConfTipoPagoDependencia(
            $this->_getParam('idtipopago')
        );

        $cant = $modeloNegocioTipoP->obtenerCantidadTipoPagoDependencia(
            $this->_getParam('idtipopago')
        );
        //Imprimiendo el listado de tipos de pago.
        echo Zend_Json::encode(array('datos' => $resp, 'cantidad' => $cant));
    }

    public function obtenerListadoTiposPagoDependenciaRestanteAction()
    {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new ConfTipoPagoDependenciaModel();

        //Insertando los datos del tipo de pago.
        $resp = $modeloNegocioTipoP->obtenerArregloConfTipoPagoDependenciaRestante(
            $this->_getParam('idtipopago')
        );

        $cant = $modeloNegocioTipoP->obtenerCantidadTipoPagoDependenciaRestante(
            $this->_getParam('idtipopago')
        );


        //Imprimiendo el listado de tipos de pago.
        echo Zend_Json::encode(array('datos' => $resp, 'cantidad' => $cant));
    }

    /**
     * Accion para adicionar una dependencia del tipo de pago.
     */
    public function adicionarTipoPagoDependenciaAction()
    {

        //print_r( Zend_Json::decode($this->_getParam('idtipospagodependencia')));die;
        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new ConfTipoPagoDependenciaModel();

        //Insertando los datos del tipo de pago.
        $resp = $modeloNegocioTipoP->adicionarConfTipoPagoDependencia(
            $this->_getParam('idtipopago'),
            Zend_Json::decode($this->_getParam('idtipospagodependencia'))
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 1) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'La dependencia del tipo de pago que quiere adicionar ya existe.'}";
        }
    }

    public function eliminarTipoPagoDependenciaAction()
    {

        //Creando el modelo de negocio de gestion de tipos de pago.
        $modeloNegocioTipoP = new ConfTipoPagoDependenciaModel();

        //Eliminando el tipo de pago.
        $bool = $modeloNegocioTipoP->eliminarConfTipoPagoDependencia(Zend_Json::decode($this->_getParam('iddependencia')));
        //Devolviendo una notificación de que todo ocurrió correctamente
        echo "{'codigo':'1'}";

    }

    public function obtenerOrdenDisponibleAction()
    {
        $r = NomTipoPagoModel::obtenerOrdenDisponible();
        echo Zend_Json::encode($r);
    }

    /**
     * Accion de exportar
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomTipoPagoModel();
        $objdepend = new ConfTipoPagoDependenciaModel();
        $arr = $obj->obtenerListadoTiposPago(0, 1000);
        foreach ($arr as $i => $tipopago) {
            $dependencias = $objdepend->obtenerArregloConfTipoPagoDependencia($tipopago['idtipopago']);
            $arr[$i]['dependencias'] = $dependencias;
        }
        //print_r($arr);die;
        $r = $obj->fnExportarNomenclador($arr);
        echo json_encode($r);
    }
}
