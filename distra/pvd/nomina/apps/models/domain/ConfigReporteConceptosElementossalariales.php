<?php

/**
 * ConfigReporteConceptosElementossalariales
 *
 * 
 * @author Tte. Milena Gainza Rodríguez.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @copyright UCID
 * @version 1.0
 */
class ConfigReporteConceptosElementossalariales extends BaseConfigReporteConceptosElementossalariales {

    /**
     * Obtener un listado de cocneptos
     *
     */
    public static function obtenerListadoConceptos() {
        //Devolviendo el listado de elementos salariales al cargo en forma de arreglo.
        return Doctrine_Query::create()
                ->select('rces.idconceptopd,ncp.denominacion as denominacion')
                ->from('ConfigReporteConceptosElementossalariales  rces')
                ->innerJoin('rces.NomConceptoPercepcionDescuento ncp')
                ->fetchArray();
    }



}
