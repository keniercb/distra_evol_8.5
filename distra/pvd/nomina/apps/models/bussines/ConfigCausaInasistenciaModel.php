<?php

/**
 * Modelo de negocio para gestionar configuración de las causas de inasistencias
 *
 * @author Ing. Dainier Velazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Modelo de negocio
 * @uses ConfigConceptosContablesModel, Entidad valor de configuracion de los conceptos contables (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class ConfigCausaInasistenciaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function ConfigCausaInasistenciaModel()
    {
        parent::ZendExt_Model();
    }

    //Obtener las configuraciones de causas de ausencias
    public function obtenerListadoCausasInasistencias($start, $limit)
    {
        $objDomain = new ConfigCausaInasistencia();
        $arrFinal = $objDomain->obtenerListadoCausasInasistencias($start, $limit);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        foreach ($arrFinal as &$campo) {
            $sql = "select tp.denominacion as nombretiporeporte,ctvrc.denominacion as vartiporeportecertif, tp.deresultados as comportamiento, cra.*
                    from mod_nomina.conf_variablestiporeportescertificaciones ctvrc  
                    inner join mod_nomina.conf_causasreporteausencia cra on(cra.idvariablesconfreportescertificaciones = ctvrc.idvariablesconfreportescertificaciones)
                    left join  mod_nomina.conf_tiporeportescertificaciones tp on(tp.idconfreportescertificaciones = cra.idconfreportescertificaciones)
                    where cra.idcausasreporteausencia = ? "; 
            $r = $conn->fetchAll($sql, array($campo['idcausasreporteausencia']));  
            $campo['vartiporeportecertif'] = $r[0]['vartiporeportecertif'];
            $campo['nombretiporeporte'] = $r[0]['nombretiporeporte'];
            $campo['tiporeporte'] = $r[0]['comportamiento'];
        }
        return $arrFinal;
    }

    //obtener la cantidad de configuraciones de causas de ausencias
    public function obtenerCantidadTotalCausasInasistencias()
    {
        $objDomain = new ConfigCausaInasistencia();
        $cantidad = $objDomain->obtenerCantidadTotalCausasInasistencias();
        return $cantidad;
    }

    //Eliminar configuraciones de causas de ausencias
    public function eliminarConfigCausasInasistencias($arridconf)
    {
        foreach ($arridconf as $i => $value) {
            $objDomain = new ConfigCausaInasistencia();
            $objDelete = $objDomain->obtenerObjConfigCausasInasistencias($value);
            $objDelete->delete();
        }
        return 'DEL';
    }

    //Obtener las variables de tipos de reportes y certificaciones
    public function obtenerListadoReportesCertificaciones($start = 0, $limit = 100000)
    {
        $sql = "select trc.idconfreportescertificaciones as idconfreportescertificaciones,
            trc.denominacion as tiporeporte, vtrc.denominacion as variabletiporeporte,
            vtrc.idvariablesconfreportescertificaciones as idvariablesconfreportescertificaciones
            from mod_nomina.conf_tiporeportescertificaciones trc
            inner join mod_nomina.conf_variablestiporeportescertificaciones vtrc on(vtrc.idconfreportescertificaciones = trc.idconfreportescertificaciones)
            limit $limit offset $start";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function obtenerCantidadReportesCertificaciones()
    {
        $sql = "select  count(trc.idconfreportescertificaciones) as cantidad
            from mod_nomina.conf_tiporeportescertificaciones trc
            inner join mod_nomina.conf_variablestiporeportescertificaciones vtrc on(vtrc.idconfreportescertificaciones = trc.idconfreportescertificaciones)";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchOne($sql);
        return $r;
    }


    //Obtener las configuraciones de campos del reporte dado idconfreportecertificaciones
    public function obtenerCamposEvaluacionXIdReporteCertif($idconfreportescertificaciones)
    {
        $objDomain = new ConfigCausaInasistencia();
        return $objDomain->obtenerConfiguracion($idconfreportescertificaciones);
    }
}
