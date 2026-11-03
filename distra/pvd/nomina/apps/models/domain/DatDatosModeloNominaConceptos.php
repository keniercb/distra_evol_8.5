<?php
/**
 * Modelo de negocio para gestionar los tipos de nómina.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad modelo de nómina (Clase del dominio).
 * @copyright XETID
 * @version 1.0
 */

class DatDatosModeloNominaConceptos extends BaseDatDatosModeloNominaConceptos
{

    public static function obtenerListadoDatosModeloNominaConceptos ($inicio = 0, $limite = 10)
    {
        return Doctrine_Query::create()
            ->from('DatDatosModeloNominaConceptos')
            ->limit($limite)
            ->offset($inicio)
            ->fetchArray();
    }

    public static function obtenerListadoDatosModeloNominaConceptosxIdEstructurarModeloNomina ($idestructuramodelosnomina)
    {
        $result = Doctrine_Query::create()
            ->from('DatDatosModeloNominaConceptos')
            ->where('idestructuramodelosnomina = ?', array($idestructuramodelosnomina))
            ->fetchArray();


        return $result;
    }

    public static function obtenerObjDatosModeloNominaConceptosDadoId ($iddatosmodelonominaconceptos)
    {
        return Doctrine::getTable('DatDatosModeloNominaConceptos')->find($iddatosmodelonominaconceptos);
    }

    public function obtenerIdEstructuraModeloNomina ($identidad, $idconcepto, $tipo, $tipospagos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select ddmnc.idestructuramodelosnomina, cmn.idtipopago
                   from mod_nomina.dat_datosmodelonominaconceptos ddmnc
                   inner join mod_nomina.conf_estructuramodelosnomina cemn on (cemn.idestructuramodelodomina = ddmnc.idestructuramodelosnomina)
                   inner join mod_nomina.conf_estructuramodelosnominaentidad cemne on (cemne.idestructuramodelodomina = cemn.idestructuramodelodomina)
                   inner join mod_nomina.conf_modelonomina cmn on (cmn.idtiponomina = cemn.idtiponomina)
                  where cemne.idestructura = ? and ddmnc.idconcepto = ?  and ddmnc.tipo = ? and cmn.idtipopago in({$tipospagos}) and cemn.idtipocampo = 2;
                   ";
        $datos = $conn->fetchAll($sql, array($identidad, $idconcepto, $tipo));

        $r = array();
        foreach($datos as $d){
            $r[$d['idtipopago']] = $d['idestructuramodelosnomina'];
        }
        return $r;
    }

}
   
