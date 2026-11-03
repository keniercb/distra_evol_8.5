<?php

class ConfConceptosGeneralesNomina extends BaseConfConceptosGeneralesNomina
{

    public function setUp()
    {
        parent::setUp();

    }

    public static function obtenerConfConceptosGeneralesNomina($inicio = 0, $limite = 10, $identidad, $idsistemapago, $idtipopago, $sedesglosa, $lugaresdecimales, $criterio)
    {
        $w = ($sedesglosa == 1 ? "ccgn.identidad = ? and ccgn.idsistemapago = ? and ccgn.idtipopago = ?" : "ccgn.identidad = ? and ccgn.idtipopago = ? ");
        $a = ($sedesglosa == 1 ? array($identidad, $idsistemapago, $idtipopago) : array($identidad, $idtipopago));
        $w .= (!empty($criterio)) ? " and ncrm.denominacion ilike '%" . $criterio . "%'" : '';
        $query = new Doctrine_Query();
        $result = (($inicio != null) and ($limite != null)) ?
        $query->from('ConfConceptosGeneralesNomina ccgn')
            ->innerJoin('ccgn.NomConceptoRM ncrm')
            ->where($w, $a)
            ->limit($limite)
            ->offset($inicio)
            ->fetchArray():
            $query->from('ConfConceptosGeneralesNomina ccgn')
            ->innerJoin('ccgn.NomConceptoRM ncrm')
            ->where($w, $a)
            ->fetchArray();
        return $result;
    }

    public static function obtenerTodasConfConceptosGeneralesNomina($identidad, $idsistemapago, $idtipopago, $sedesglosa, $lugaresdecimales)
    {
        $w = ($sedesglosa == 1 ? "identidad = ? and idsistemapago = ? and idtipopago = ?" : "identidad = ? and idtipopago = ?");
        $a = ($sedesglosa == 1 ? array($identidad, $idsistemapago, $idtipopago) : array($identidad, $idtipopago));
        return Doctrine_Query::create()
            ->from('ConfConceptosGeneralesNomina')
            ->where($w, $a)
            ->fetchArray();
    }

    public static function obtenerCantidadConfConceptosGeneralesNomina($identidad, $idsistemapago, $idtipopago, $sedesglosa, $lugaresdecimales, $criterio)
    {
        $w = ($sedesglosa == 1 ? "ccgn.identidad = ? and ccgn.idsistemapago = ? and ccgn.idtipopago = ?" : "ccgn.identidad = ? and ccgn.idtipopago = ? ");
        $a = ($sedesglosa == 1 ? array($identidad, $idsistemapago, $idtipopago) : array($identidad, $idtipopago));
        $w .= (!empty($criterio)) ? " and ncrm.denominacion ilike '%" . $criterio . "%'" : '';
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
            ->from('ConfConceptosGeneralesNomina ccgn')
            ->innerJoin('ccgn.NomConceptoRM ncrm')
            ->where($w, $a)
            ->fetchOne()
            ->cantidad;
    }

    public static function seRepiteConfConceptosGeneralesNomina($identidad, $idsistemapago, $idtipopago, $idconceptorm, $id)
    {
        $w = 'identidad = ? and idsistemapago = ? and idtipopago = ? and idconceptorm = ?';
        $a = array($identidad, $idsistemapago, $idtipopago, $idconceptorm);
        if ($id != null) {
            $w .= ' and idconfconceptosgeneralesnomina <> ?';
            $a[] = $id;
        }
        $c = Doctrine_Query::create()->select('COUNT(*) AS cantidad')
            ->where($w, $a)
            ->from('ConfConceptosGeneralesNomina')
            ->fetchOne()
            ->cantidad;
        return ($c > 0);
    }

    public static function obtenerDenomXId($idconfconceptosgeneralesnomina)
    {
        return Doctrine_Query::create()->select('p.denominacion AS denominacion')
            ->from('NomConceptoPercepcionDescuento p')
            ->where('p.idconceptopercepciondescuento = ?', array($idconcepto))
            ->fetchOne()
            ->denominacion;
    }

    public function obtenerConfiguracionCRM()
    {
        $sql = "select crm.* from mod_nomina.conf_conceptosgeneralesnomina crm
		inner join mod_nomina.nom_conceptoretribucionmonetaria n on (n.idconceptorm = crm.idconceptorm)
		where n.fechafin is null or n.fechafin >= now()
		order by crm.idtipopago, crm.idsistemapago, crm.idconceptorm;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public static function estaReplicadoConceptosGeneralesNomina($idEstructura, $idconceptorm, $idtipopago)
    {
        $w = 'identidad = ? and idconceptorm = ? and idtipopago = ?';
        $a = array($idEstructura, $idconceptorm, $idtipopago);

        $c = Doctrine_Query::create()->select('COUNT(*) AS cantidad')
            ->from('ConfConceptosGeneralesNomina')
            ->where($w, $a)
            ->fetchOne()
            ->cantidad;
        return $c;
    }

    public static function idConceptosGeneralesNomina($idEstructura, $idconceptorm, $idtipopago)
    {
        $w = 'identidad = ? and idconceptorm = ? and idtipopago = ?';
        $a = array($idEstructura, $idconceptorm, $idtipopago);

        $c = Doctrine_Query::create()->select('idconfconceptosgeneralesnomina')
            ->from('ConfConceptosGeneralesNomina')
            ->where($w, $a)
            ->fetchArray();

        return $c;
    }

    public static function deleteConceptosGeneralesNomina($idconceptorm)
    {
        $sqlCriterio = " DELETE FROM mod_nomina.conf_conceptosgeneralesnomina WHERE mod_nomina.conf_conceptosgeneralesnomina.idconfconceptosgeneralesnomina in (" . implode(',', [$idconceptorm]) . " )";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sqlCriterio);
        return $r;
    }

    public static function obtenerIndicadoresExpresionesConceptosGenerales($identidad)
    {
        $sql = "select distinct deem.idindicador from mod_nomina.conf_conceptosgeneralesnomina cgn
        inner join mod_utiles.dat_elementoexpresionmatematica deem on deem.idexpresionmatematica = cgn.idexpresionmatematica
        where cgn.identidad = $identidad and deem.idindicador not like '0'";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

}
