<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

/**
 * Controlador para gestionar las formas y sistemas de pago.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomFormaPagoModel
 * @uses NomSistemaPagoModel
 * @copyright UCID
 * @version 1.0
 */
class NomformasistemapagoController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de las formas y sistemas de pago.
     */
    public function nomformasistemapagoAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las formas de pago.
     */
    public function obtenerListadoFormasPagoAction()
    {

        //Creando el modelo de negocio de gestion de formas de pago.
        $modeloNegocioFormaPago = new NomFormaPagoModel();

        //Obteniendo el listado de formas de pago.
        $arrFormas = $modeloNegocioFormaPago->obtenerListadoFormasPago($this->_getParam('start', 0),
            $this->_getParam('limit', 10));
        //Obteniendo la cantidad total de formas de pago.
        $cantTotalFormas = $modeloNegocioFormaPago->obtenerCantidadTotalFormasPago();

        //Imprimiendo el listado de formas de pago.
        echo Zend_Json::encode(array('datos' => $arrFormas, 'cantidad' => $cantTotalFormas));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion utilizada para listar los datos de los sistemas de pago.
     */
    public function obtenerListadoSistemasPagoAction()
    {

        //Creando el modelo de negocio de gestion de sistemas de pago.
        $modeloNegocioSistema = new NomSistemaPagoModel();

        //Obteniendo el listado de sistemas de pago.
        $arrSistemas = $modeloNegocioSistema->obtenerListadoSistemasPago($this->_getParam('idformapago', 1),
            $this->_getParam('start', 0),
            $this->_getParam('limit', 10)
        );
        //Obteniendo la cantidad total de sistemas de pago.
        $cantTotalSistemas = $modeloNegocioSistema->obtenerCantidadTotalSistemasPago($this->_getParam('idformapago', 1));

        //Imprimiendo el listado de sistemas de pago.
        echo Zend_Json::encode(array('datos' => $arrSistemas, 'cantidad' => $cantTotalSistemas));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar una forma de pago.
     */
    public function adicionarFormaPagoAction()
    {


        //Creando el modelo de negocio de gestion de formas de pago.
        $modeloNegocioFormaPago = new NomFormaPagoModel();

        //Insertando los datos de la forma de pago.
        $resp = $modeloNegocioFormaPago->adicionarFormaPago(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 1) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','msg':'La forma de pago que quiere adicionar ya existe.'}";
        }

    }

    /**
     * Accion para modificar una forma de pago.
     */
    public function modificarFormaPagoAction()
    {

        //Creando el modelo de negocio de gestion de formas de pago.
        $modeloNegocioFormaPago = new NomFormaPagoModel();

        //Modificando los datos de la forma de pago.
        $resp = $modeloNegocioFormaPago->modificarFormaPago(
            $this->_getParam('idformapago'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 1) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','msg':'La forma de pago que quiere modificar ya existe.'}";
        }
    }

    /**
     * Accion para eliminar una forma de pago.
     */
    public function eliminarFormaPagoAction()
    {

        //Creando el modelo de negocio de gestion de formas de pago.
        $modeloNegocioFormaPago = new NomFormaPagoModel();

        //Eliminando la forma de pago.
        $bool = $modeloNegocioFormaPago->eliminarFormaPago(
            $this->_getParam('idformapago')
        );

        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion para adicionar un sistema de pago.
     */
    public function adicionarSistemaPagoAction()
    {

        //Creando el modelo de negocio de gestion de sistemas de pago.
        $modeloNegocioSistema = new NomSistemaPagoModel();

        //Insertando los datos del sistema de pago.
        $modeloNegocioSistema->adicionarSistemaPago(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('idformapago')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para modificar un sistema de pago.
     */
    public function modificarSistemaPagoAction()
    {

        //Creando el modelo de negocio de gestion de sistemas de pago.
        $modeloNegocioSistema = new NomSistemaPagoModel();

        //Modificando los datos del sistema de pago.
        $modeloNegocioSistema->modificarSistemaPago(
            $this->_getParam('idsistemapago'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente.
        echo "{'codigo':'1'}";
    }

    /**
     * Accion para eliminar un sistema de pago.
     */
    public function eliminarSistemaPagoAction()
    {

        //Creando el modelo de negocio de gestion de sistemas de pago.
        $modeloNegocioSistema = new NomSistemaPagoModel();

        //Eliminando el sistema de pago.
        $bool = $modeloNegocioSistema->eliminarSistemaPago(
            $this->_getParam('idsistemapago')
        );
        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }

    /**
     * Accion utilizada para exportar los cargos por areas.
     */
    public function exportarNomencladorAction()
    {
        $obj = new NomFormaPagoModel();
        $objsp = new NomSistemaPagoModel();
        $datos = $obj->obtenerListadoFormasPago(0, 1000);
        foreach ($datos as $pos => $fsp) {
            $datos[$pos]['sistemaspago'] = $objsp->obtenerListadoSistemasPago($fsp['idformapago'], 0, 1000);
        }
        $r = $obj->fnExportarNomenclador($datos);
        echo json_encode($r);
    }
}