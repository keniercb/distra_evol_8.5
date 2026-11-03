<?php

class ConfReportesCertificaciones extends BaseConfReportesCertificaciones
{

    public function setUp()
    {
        parent::setUp();

    }

    public static function obtenerListadoReportesCertificaciones($inicio = 0, $limite = 1000, $criterio = null)
    {
        if (!empty($criterio)) {
            $query = new Doctrine_Query ();
            $result = (($inicio != null) and ($limite != null))?
            $query->from('ConfReportesCertificaciones')
                ->where("denominacion ilike '%{$criterio}%'")
                ->orderBy('denominacion')
                ->limit($limite)
                ->offset($inicio)
                ->fetchArray():
                $query->from('ConfReportesCertificaciones')
                ->where("denominacion ilike '%{$criterio}%'")
                ->orderBy('denominacion')
                ->fetchArray();
            return $result;

        } else {
            $query = new Doctrine_Query ();
            $result = (($inicio != null) and ($limite != null))?
            $query->from('ConfReportesCertificaciones')
                ->orderBy('denominacion')
                ->limit($limite)
                ->offset($inicio)
                ->fetchArray():
                $query->from('ConfReportesCertificaciones')
                ->orderBy('denominacion')
                ->fetchArray();
            return $result;
        }
    }

    public static function obtenerListadoReportesCertificacionesCompleto()
    {
        return Doctrine_Query::create()
            ->from('ConfReportesCertificaciones')
            ->orderBy('denominacion')
            ->fetchArray();
    }

    public static function obtenerCantidadReportesCertificaciones($criterio = null)
    {
        if (!empty($criterio)) {
            return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
                ->from('ConfReportesCertificaciones')
                ->where("denominacion ilike '%{$criterio}%'")
                ->fetchOne()
                ->cantidad;
        } else {
            return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
                ->from('ConfReportesCertificaciones')
                ->fetchOne()
                ->cantidad;
        }
    }

    public static function obtenerMesesReporte($idconfreporte)
    {
        return Doctrine_Query::create()->select('mesessnc')
            ->from('ConfReportesCertificaciones')
            ->where('idconfreportescertificaciones = ?', array($idconfreporte))
            ->fetchOne()
            ->mesessnc;
    }

    public static function obtenerIdReportesCertificacionesdadoEsResultado()
    {
        return Doctrine_Query::create()->select('c.idconfreportescertificaciones AS idconfreportescertificaciones')
            ->from('ConfReportesCertificaciones c')
            ->where('c.deresultados = 1')
            ->fetchOne()
            ->idconfreportescertificaciones;
    }

    public static function obtenerDenomReportesCertificacionesdadoxId($idconfreporte)
    {
        return Doctrine_Query::create()->select('c.denominacion AS denominacion')
            ->from('ConfReportesCertificaciones c')
            ->where('c.idconfreportescertificaciones = ?', array($idconfreporte))
            ->fetchOne()
            ->denominacion;
    }

    /**
     * Obtener todos los tipos de reportes y certificaciones.
     *
     * @return array    Listado de los datos de tipos de reportes y certificaciones.
     */
    public static function obtenerTodosTiposReportesCertificaciones()
    {

        //Devolviendo el listado de los tipos de reportes y certificaciones de arreglo.
        return Doctrine_Query::create()
            ->from('ConfReportesCertificaciones')
            ->fetchArray();
    }

    public function findByIdOrDenom($denom, $idconfreportescertificaciones = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('ConfReportesCertificaciones')
                ->where("denominacion ilike '$denom'");
            if (!empty($idconfreportescertificaciones)) {
                $query->andWhere("idconfreportescertificaciones <> ?", $idconfreportescertificaciones);
            }
            $result = $query->count();
            if ($result > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public static function obtenerTodosTiposReportesCertificacionesConVariables($inicio = 0, $limite = 10, $criterio = null)
    {
        $where = (!empty($criterio)) ? " WHERE cvrc.denominacion ilike '%{$criterio}%' " : " ";
        
	    $limitCadena = ($inicio != null and $limite != null)? " limit $limite offset $inicio": " ";
        $sql = "select ctrc.*, cvrc.denominacion as denominacionvariable, cvrc.idvariablesconfreportescertificaciones, ctrc.idconfreportescertificaciones
        from mod_nomina.conf_tiporeportescertificaciones ctrc
        inner join mod_nomina.conf_variablestiporeportescertificaciones cvrc on (cvrc.idconfreportescertificaciones = ctrc.idconfreportescertificaciones)"
            . $where . " order by ctrc.denominacion" . $limitCadena;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public static function obtenerCantidadTodosTiposReportesCertificacionesConVariables($criterio = null)
    {
        $where = (!empty($criterio)) ? " WHERE cvrc.denominacion ilike '%{$criterio}%' " : " ";
        $sql = "select count(*) as cantidad
        from mod_nomina.conf_tiporeportescertificaciones ctrc
        inner join mod_nomina.conf_variablestiporeportescertificaciones cvrc on (cvrc.idconfreportescertificaciones = ctrc.idconfreportescertificaciones)"
            . $where . ";";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $c = $conn->fetchAll($sql);
        return $c[0]['cantidad'];
    }

    public static function obtenerTodosReportesCertificaciones()
    {
        $sql = "select cvrc.denominacion as denominacionvariable, cvrc.idvariablesconfreportescertificaciones
        from mod_nomina.conf_tiporeportescertificaciones ctrc
        inner join mod_nomina.conf_variablestiporeportescertificaciones cvrc on (cvrc.idconfreportescertificaciones = ctrc.idconfreportescertificaciones)
		where ctrc.deresultados = 4;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public static function obtenerComportamiento($idconfreporte)
    {
        return Doctrine_Query::create()->select('c.deresultados')
            ->from('ConfReportesCertificaciones c')
            ->where('c.idconfreportescertificaciones = ?', array($idconfreporte))
            ->fetchOne()
            ->deresultados;
    }

    public static function obtenerCargoPrincipal($idconfreporte)
    {
        return Doctrine_Query::create()->select('c.deresultados')
            ->from('ConfReportesCertificaciones c')
            ->where('c.idconfreportescertificaciones = ?', array($idconfreporte))
            ->fetchOne()
            ->deresultados;
    }

    public static function obtenerVariablesReportesAnterioresXIdConfReporte($idconfreportescertificaciones)
    {
        $sql = "select cvrc.idvariablesconfreportescertificacionesreportesanteriores
        from mod_nomina.conf_tiporeportescertificaciones ctrc
        inner join mod_nomina.conf_variablestiporeportescertificaciones cvrc on (cvrc.idconfreportescertificaciones = ctrc.idconfreportescertificaciones)
		where ctrc.idconfreportescertificaciones = {$idconfreportescertificaciones} and cvrc.idvariablesconfreportescertificacionesreportesanteriores is not null;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public static function obtenerTiposReportesCertificacionesXIdVariablesReportesAnteriores($arrayidvariablesrepanterior)
    {
        $sql = "select distinct (ctrc.idconfreportescertificaciones) as idconfreportescertificaciones, ctrc.denominacion
        from mod_nomina.conf_tiporeportescertificaciones ctrc
        inner join mod_nomina.conf_variablestiporeportescertificaciones cvrc on (cvrc.idconfreportescertificaciones = ctrc.idconfreportescertificaciones)
		where cvrc.idvariablesconfreportescertificaciones in (" . implode(',', $arrayidvariablesrepanterior) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}
