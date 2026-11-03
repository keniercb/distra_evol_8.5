<?php

class ConfVariablesReportesCertificaciones extends BaseConfVariablesReportesCertificaciones
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('ConfReportesCertificaciones', array(
            'local' => 'idconfreportescertificaciones',
            'foreign' => 'idconfreportescertificaciones',
            'refClass' => 'ConfVariablesReportesCertificaciones'
        ));

        $this->hasOne('NomNomencladorReferencia', array(
            'local' => 'idnomencladorreferencia',
            'foreign' => 'idnomencladorreferencia',
            'refClass' => 'ConfVariablesReportesCertificaciones'
        ));

    }

    public function getByid($idvariablesconfreportescertificaciones)
    {
        return Doctrine::getTable('ConfVariablesReportesCertificaciones')->find($idvariablesconfreportescertificaciones);
    }

    public static function obtenerListadoVariablesReportesCertificaciones($idconfreportescertificaciones, $inicio = 0, $limite = 10)
    {
        $sql = "select cvrc.*, nnr.denominacion as nomenclador, nnr.tiponomenclador
        from mod_nomina.conf_variablestiporeportescertificaciones cvrc
        left join mod_nomina.nom_nomencladorreferencia nnr on (nnr.idnomencladorreferencia = cvrc.idnomencladorreferencia)
        where idconfreportescertificaciones = ? order by (cvrc.orden);";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idconfreportescertificaciones));

    }

    public static function obtenerCantidadVariablesReportesCertificaciones($idconfreportescertificaciones)
    {
        $sql = "select count(cvrc.*) as cantidad
        from mod_nomina.conf_variablestiporeportescertificaciones cvrc
        left join mod_nomina.nom_nomencladorreferencia nnr on (nnr.idnomencladorreferencia = cvrc.idnomencladorreferencia)
        where idconfreportescertificaciones = ? ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql, array($idconfreportescertificaciones));
        return $resultado[0]['cantidad'];
    }

    public static function obtenerVariablesReportesCertificacionesByIdReporte($idconfreportescertificaciones)
    {
        $sql = "select *
        from mod_nomina.conf_variablestiporeportescertificaciones 
        where idconfreportescertificaciones = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idconfreportescertificaciones));

    }

    public static function obtenerVariablesReportesCertificacionesByIdRepor($idconfreportescertificaciones)
    {
        $sql = "select *
        from mod_nomina.conf_variablestiporeportescertificaciones 
        where idconfreportescertificaciones = ? and idvariablesconfreportescertificacionesreportesanteriores is not null;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idconfreportescertificaciones));

    }

    public static function obtenetIdPorDenominacion()
    {
        $sql = "select idvariablesconfreportescertificaciones
                from mod_nomina.conf_variablestiporeportescertificaciones 
                where denominacion ilike '%Salario calculado%';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $resultado = $conn->fetchAll($sql);
        return $resultado[0]['idvariablesconfreportescertificaciones'];          

    }

    public static function obtenerVariables()
    {
        $sql = "select cvrc.*, nnr.tiponomenclador,trc.denominacion as plantilla,trc.idconfreportescertificaciones
        from mod_nomina.conf_variablestiporeportescertificaciones cvrc
        inner join mod_nomina.conf_tiporeportescertificaciones trc on(trc.idconfreportescertificaciones = cvrc.idconfreportescertificaciones)
        left join mod_nomina.nom_nomencladorreferencia nnr on (nnr.idnomencladorreferencia = cvrc.idnomencladorreferencia)
        order by cvrc.orden;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);

    }

    public static function obtenerIdVariablesPorTipo($idconfreporte, $tipovariable)
    {
        $sql = "select cvrc.idvariablesconfreportescertificaciones
        from mod_nomina.conf_variablestiporeportescertificaciones cvrc
        inner join mod_nomina.conf_tiporeportescertificaciones trc on(trc.idconfreportescertificaciones = cvrc.idconfreportescertificaciones)
        where trc.idconfreportescertificaciones = ? and cvrc.tipovariable = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idconfreporte, $tipovariable));

    }

    public static function obtenerIdVariablesTRT()
    {
        $sql = "select cvrc.idvariablesconfreportescertificaciones
        from mod_nomina.conf_variablestiporeportescertificaciones cvrc
        inner join mod_nomina.conf_tiporeportescertificaciones trc on(trc.idconfreportescertificaciones = cvrc.idconfreportescertificaciones)
        where trc.deresultados = 11;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);

    }

    public static function obtenerIdVariablesToTalAusencias($idreportecert)
    {
        $sql = "select cvrc.idvariablesconfreportescertificaciones
        from mod_nomina.conf_variablestiporeportescertificaciones cvrc
        inner join mod_nomina.conf_tiporeportescertificaciones trc on(trc.idconfreportescertificaciones = cvrc.idconfreportescertificaciones)
        inner join mod_nomina.dat_reportescertificaciones rc on(rc.idconfreportescertificaciones = trc.idconfreportescertificaciones)
        where rc.idreportescertificaciones = ? and cvrc.tipovariable = -1 ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idreportecert));

    }

    public static function obtenerIdVariablesDescuentosNoAplicados()
    {
        $sql = "select cvrc.idvariablesconfreportescertificaciones
        from mod_nomina.conf_variablestiporeportescertificaciones cvrc
        inner join mod_nomina.conf_tiporeportescertificaciones trc on(trc.idconfreportescertificaciones = cvrc.idconfreportescertificaciones)
        where trc.deresultados = 12;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);

    }

    public static function getVariableconfiguracionreporte($idconfreporte)
    {
        return Doctrine_Query::create()
            ->select('cvrc.*')
            ->from('ConfVariablesReportesCertificaciones as cvrc')
            ->where('cvrc.idconfreportescertificaciones = ?', array($idconfreporte))
            ->orderBy('denominacion')
            ->fetchArray();
    }

    public static function getDatosVariableconfiguracionreporte($idconfreporte)
    {
        return Doctrine_Query::create()
            ->select('cvrc.idvariablesconfreportescertificaciones, cvrc.tipovariable')
            ->from('ConfVariablesReportesCertificaciones as cvrc')
            ->where('cvrc.idconfreportescertificaciones = ?', array($idconfreporte))
            ->orderBy('denominacion')
            ->fetchArray();
    }

    public static function DevolverDenomDadoid($idvariablesconfreportescertificaciones)
    {
        return Doctrine_Query::create()
            ->select('denominacion as denom')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idvariablesconfreportescertificaciones = ?', array($idvariablesconfreportescertificaciones))
            ->fetchOne()
            ->denom;
    }

    public static function DevolverIdConfReportesCertificaciones($idvariablesconfreportescertificaciones)
    {
        return Doctrine_Query::create()
            ->select('idconfreportescertificaciones')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idvariablesconfreportescertificaciones = ?', array($idvariablesconfreportescertificaciones))
            ->fetchOne()
            ->idconfreportescertificaciones;
    }

    public static function devDatosPorIdVariable($idvariablesconfreportescertificaciones)
    {
        return Doctrine_Query::create()
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idvariablesconfreportescertificaciones = ?', array($idvariablesconfreportescertificaciones))
            ->fetchArray();
    }

    public static function findByIdOrDenom($denom, $idconfreportescertificaciones, $idvariablesconfreportescertificaciones = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('ConfVariablesReportesCertificaciones')
                ->where("denominacion ilike '$denom'");
            $query->andWhere("idconfreportescertificaciones = ?", $idconfreportescertificaciones);
            if (!empty($idvariablesconfreportescertificaciones)) {
                $query->andWhere("idvariablesconfreportescertificaciones <> ?", $idvariablesconfreportescertificaciones);
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

    public static function obtenerDenomVariablexIdVariable($idvariablesconfreportescertificaciones)
    {
        return Doctrine_Query::create()
            ->select('denominacion')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idvariablesconfreportescertificaciones = ?', array($idvariablesconfreportescertificaciones))
            ->fetchOne()
            ->denominacion;
    }

    public static function obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones)
    {
        return Doctrine_Query::create()
            ->select('idconfreportescertificaciones')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idvariablesconfreportescertificaciones = ?', array($idvariablesconfreportescertificaciones))
            ->fetchOne()
            ->idconfreportescertificaciones;
    }

    public static function obtenerDenomReporteXIdVarConfReportesCert($idvariablesconfreportescertificaciones)
    {
        $sql = "select tr.denominacion as denominacion from mod_nomina.conf_tiporeportescertificaciones tr
        inner join mod_nomina.conf_variablestiporeportescertificaciones v on(v.idconfreportescertificaciones = tr.idconfreportescertificaciones)
        where v.idvariablesconfreportescertificaciones = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idvariablesconfreportescertificaciones));
    }

    public static function obtenerSoloDenomReporteXIdVarConfReportesCert($idvariablesconfreportescertificaciones)
    {
        $sql = "select tr.denominacion as denominacion from mod_nomina.conf_tiporeportescertificaciones tr
        inner join mod_nomina.conf_variablestiporeportescertificaciones v on(v.idconfreportescertificaciones = tr.idconfreportescertificaciones)
        where v.idvariablesconfreportescertificaciones = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sql, array($idvariablesconfreportescertificaciones));
    }

    /*public static function obtenerListadoVariablesReportesCertificaciones($idconfreportescertificaciones, $inicio = 0, $limite = 10) {
        return Doctrine_Query::create()
                ->select('cvrc.*, nnr.denominacion as nomenclador, nnr.tiponomenclador')
                ->from('ConfVariablesReportesCertificaciones as cvrc')
                ->leftJoin('cvrc.NomNomencladorReferencia as nnr')
                ->where('idconfreportescertificaciones = ?', array($idconfreportescertificaciones))
                ->orderBy('denominacion')
                ->limit($limite)
                ->offset($inicio)
                ->fetchArray();
    }

    public static function obtenerCantidadVariablesReportesCertificaciones($idconfreportescertificaciones) {
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
                        ->from('ConfVariablesReportesCertificaciones')
                        ->where('idconfreportescertificaciones = ?', array(idconfreportescertificaciones))
                        ->fetchOne()
                        ->cantidad;
    }*/

    public static function obtenerVariablesExpresionMatematica($idconftiporeporte) {
        return Doctrine_Query::create()
            ->select('count(idvariablesconfreportescertificaciones) as cantidad')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idconfreportescertificaciones = ? and idexpresionmatematica is not null', array($idconftiporeporte))
            ->fetchOne()
            ->cantidad;
    }

    public static function obtenerTosoVariablesExpresionMatematica($idconftiporeporte) {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idconfreportescertificaciones = ? and (idexpresionmatematica <> -1 and idexpresionmatematica is not null)', array($idconftiporeporte))
            ->orderBy('idvariablesconfreportescertificaciones')
            ->fetchArray();
    }

    public static function obtenerVariablesExpresionMatematicaHistorico($idconftiporeporte) {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idconfreportescertificaciones = ? and (idexpresionmatematicahistoriconominasreportes <> -1 and idexpresionmatematicahistoriconominasreportes is not null)', array($idconftiporeporte))
            ->orderBy('idvariablesconfreportescertificaciones')
            ->fetchArray();
    }

    public static function obtenerConfReportexIdVariables($idvariablesconfreportescertificaciones) {
        return Doctrine_Query::create()
            ->select('idconfreportescertificaciones')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idvariablesconfreportescertificaciones = ?', array($idvariablesconfreportescertificaciones))
            ->fetchOne()->idconfreportescertificaciones;
    }

    public static function obtenerIdVariablesConfReportesCertiicacionesmesinicial($idvariablesconfreportescertificaciones) {
        return Doctrine_Query::create()
            ->select('idvariablesconfreportescertiicacionesmesinicial')
            ->from('ConfVariablesReportesCertificaciones')
            ->where('idvariablesconfreportescertificaciones = ?', array($idvariablesconfreportescertificaciones))
            ->fetchOne()->idvariablesconfreportescertiicacionesmesinicial;
    }



}
