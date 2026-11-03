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
class GestcierretalleresModel extends GestcierreModel
{


    public function gestcierretalleresModel()
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

    public function cargarDocuPendTall($parametros = array())
    {
        return parent::cargarDocuPendTall($parametros);
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

        return parent::cierreDiario(LogisticaGlobal::SUBSISTEMA_TALLERES);
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
        $params['cierre'] = true;
        $balancecuadro = new BalancecuadreprocesoModel();
        $diferencia = $balancecuadro->adicionarBalance($params);
        if ($diferencia['diferencia'] == 1) {
            throw new ZendExt_Exception('LOG_LB_CIERE_010');
        } else {
            parent::cierrePeriodo(LogisticaGlobal::SUBSISTEMA_TALLERES);
        }
       
        return array('diferencia'=> $diferencia['diferencia']);
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
        return parent::cierreEjercico(LogisticaGlobal::SUBSISTEMA_TALLERES);
    }

    public function cargaDatosFecha()
    {
        return parent::cargaDatosFecha(LogisticaGlobal::SUBSISTEMA_TALLERES);
    }

    public function validarCierre(){

        $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES);
        $datos = $this->cargarDocuPendTall(array());
       // print_r($estructurasubsist);die;
        if ($estructurasubsist->contabiliza) {
            if($datos['cantidad'] > 0){
                throw new ZendExt_Exception('LOG_LB_CIERE_002');
        }
        }
         //else{
            if ($estructurasubsist->cierra) {
              foreach ($datos['datos'] as &$diferencia) {
                $diferencia['diferencia'] = $diferencia['saldocontableot'] - $diferencia['saldoot'];
                if($diferencia['diferencia'] > 0){
                    throw new LogisticaException('LOG_LB_CIERE_010');
                }    
            }
    }
   // }
}
}