<?php

/**
 * @class GestcierreinventarioModel
 * Clase que se encarga de las acciones
 * para realizar la carga de los documentos pendientes de los subsistemas y
 * la realización del cierre
 * @namespace Logistica\Inventario\ComunInv\Models\
 * @author Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version 1.0
 */
class GestcierrefacturaModel extends GestcierreModel
{


    public function gestcierrefacturaModel()
    {
        parent::gestcierreModel();
    }

    /**
     * @method cargarDocuPendInv
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Facturacion
     * @params $parametros Parametros provenientes de la vista
     * @return Arreglo con los documentos pendientes
     */

    public function cargarDocuPendFac($parametros = array())
    {
        return parent::cargarDocuPendFac($parametros);
    }


    /**
     * @method cierreDiario
     * Acción para realizar el cierre diario de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre diario
     * @return null
     */

    public function cierreDiario()
    {

        return parent::cierreDiario(LogisticaGlobal::SUBSISTEMA_FAC);
    }

    /**
     * @method cierrePeriodo
     * Acción para realizar el cierre período de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre período
     * @return null
     */

    public function cierrePeriodo()
    {
        $this->validarCierre();
        return parent::cierrePeriodo(LogisticaGlobal::SUBSISTEMA_FAC);
    }

    /**
     * @method cierreEjercicio
     * Acción para realizar el cierre ejercicio de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre ejercicio
     * @return null
     */

    public function cierreEjercico()
    {
        $this->validarCierre();
        return parent::cierreEjercico(LogisticaGlobal::SUBSISTEMA_FAC);
    }

    public function cargaDatosFecha()
    {
        return parent::cargaDatosFecha(LogisticaGlobal::SUBSISTEMA_FAC);
    }

    public function validarCierre(){

        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC);
        if ($estructurasubsist->contabiliza) {
            $datos = $this->cargarDocuPendFac(array());
            if($datos['cantidad'] > 0){
                throw new ZendExt_Exception('LOG_LB_CIERE_002');
            }
        }
    }

}
