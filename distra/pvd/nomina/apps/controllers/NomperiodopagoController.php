<?php

/**
 * Controlador para gestionar periodos de pago.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Clase controladora.
 * @uses NomPeriodoPagoModel
 * @copyright UCID
 * @version 1.0
 */
class NomperiodopagoController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Acción utilizada para mostrar la vista de gestión de los periodos de pago.
     */
    public function nomperiodopagoAction()
    {

        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;

        //Mostrando la vista.
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de los periodos de pago.
     */
    public function obtenerPeriodosPagoAction()
    {

        //Creando el modelo de negocio de gestion de periodos de pago.
        $modeloNegocioPeriodo = new NomPeriodoPagoModel();

        //Obteniendo el listado de periodos de pago.
        $arrPeriodos = $modeloNegocioPeriodo->obtenerListadoPeriodosPago($this->_getParam('start', 0), $this->_getParam('limit', 10));
        foreach ($arrPeriodos as $i => $periodo) {
            switch ($periodo['tipoperiodo']) {
                case '1':
                    $arrPeriodos[$i]['tipoperiodo'] = 'semanal';
                    break;
                case '2':
                    $arrPeriodos[$i]['tipoperiodo'] = 'quincenal';
                    break;
                case '3':
                    $arrPeriodos[$i]['tipoperiodo'] = 'mensual';
                    break;
                case '4':
                    $arrPeriodos[$i]['tipoperiodo'] = 'trimestral';
                    break;
                case '5':
                    $arrPeriodos[$i]['tipoperiodo'] = 'semestral';
                    break;
                case '6':
                    $arrPeriodos[$i]['tipoperiodo'] = 'anual';
                    break;
                default :
                    $arrPeriodos[$i]['tipoperiodo'] = 'mensual';
                    break;
            }
            $arrPeriodos[$i]['idtipoperiodo'] = $periodo['tipoperiodo'];
        }
        //Obteniendo la cantidad total de periodos de pago.
        $cantTotalPeriodos = $modeloNegocioPeriodo->obtenerCantidadTotalPeriodosPago();

        //Imprimiendo el listado de periodos de pago.
        echo Zend_Json::encode(array('datos' => $arrPeriodos, 'cantidad' => $cantTotalPeriodos));
        // echo Zend_Json::encode(array('datos' => array(), 'cantidad' => 0));
    }

    /**
     * Accion para adicionar un periodo de pago.
     */
    public function adicionarPeriodoPagoAction()
    {

        //Creando el modelo de negocio de gestion de periodos de pago.
        $modeloNegocioPeriodo = new NomPeriodoPagoModel();

        //Insertando los datos del periodo de pago.
        $resp = $modeloNegocioPeriodo->adicionarPeriodoPago(
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('cantdias'),
            $this->_getParam('tipoperiodo')
        );
        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'El período de pago que quiere adicionar ya existe.'}";
        }
    }

    /**
     * Accion para modificar un periodo de pago.
     */
    public function modificarPeriodoPagoAction()
    {

        //Creando el modelo de negocio de gestión de periodos de pago.
        $modeloNegocioPeriodo = new NomPeriodoPagoModel();

        //Modificando los datos del periodo de pago.
        $resp = $modeloNegocioPeriodo->modificarPeriodoPago(
            $this->_getParam('idperiodopago'),
            $this->_getParam('denominacion'),
            $this->_getParam('fechainicio'),
            $this->_getParam('fechafin'),
            $this->_getParam('descripcion'),
            $this->_getParam('cantdias'),
            $this->_getParam('tipoperiodo')
        );
        //Devolviendo una notificación de que todo ocurrió correctamente.
        if ($resp == 2) {
            echo "{'codigo':'1'}";
        } else {
            echo "{'codigo':'3','mensaje':'El período de pago ya existe.'}";
        }
    }

    /**
     * Accion para eliminar un periodo de pago.
     */
    public function eliminarPeriodoPagoAction()
    {

        //Creando el modelo de negocio de gestion de periodos de pago.
        $modeloNegocioPeriodo = new NomPeriodoPagoModel();

        //Eliminando el periodo de pago.
        $bool = $modeloNegocioPeriodo->eliminarPeriodoPago($this->_getParam('idperiodopago'));

        if ($bool == 2) {
            echo "{'codigo':'3'}";
        } else {
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'1'}";
        }
    }
}
