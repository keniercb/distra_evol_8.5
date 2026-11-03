<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomVersionreportes extends BaseNomVersionreportes
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTiporeporte',
            array('local' => 'idtiporeporte', 'foreign' => 'idtiporeporte')
        );
        $this->hasMany(
            'NomVersionreportesNomPartesreporte',
            array('local' => 'idtiporeporte', 'foreign' => 'idtiporeporte')
        );
        $this->hasMany(
            'NomVersionreportesNomCamporeporte',
            array('local'   => 'idversionreporte',
                  'foreign' => 'idversionreporte')
        );

    }

    public function ObtenerVersionesReporte($idautor, $idtiporeporte)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomVersionreportes v')
            ->where(
                "v.idautor = '$idautor' AND v.idtiporeporte = '$idtiporeporte'"
            )->orderby("v.orden")
            ->execute();
        return $result->toArray();
    }

    public function ObtenerReporteEstandar($idtiporeporte)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomVersionreportes v')
            ->where("v.estandar = '1' AND v.idtiporeporte = '$idtiporeporte'")->orderby("v.orden")
            ->execute();
        return $result->toArray();
    }

    public function obtenerPartesReportes($datos)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT p.denpartereporte, p.idpartereporte, vp.idversionreporte
                FROM mod_objetivos.nom_versionreportes_nom_partesreporte vp
                INNER JOIN mod_objetivos.nom_partesreporte p
                ON(p.idpartereporte = vp.idpartereporte)
                WHERE vp.idversionreporte = {$datos->idversionreporte}";
        if ($datos->idpartereporte != null) {
            $cadena .= " AND p.idpartereporte = {$datos->idpartereporte}";
        }

        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function obtenerCamposReportes($datos)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT c.dencamporeporte, c.idcamporeporte, cr.idversionreporte
                FROM mod_objetivos.nom_versionreportes_nom_camporeporte cr
                INNER JOIN mod_objetivos.nom_camporeporte c
                ON(c.idcamporeporte = cr.idcamporeporte)
                WHERE cr.idversionreporte = {$datos->idversionreporte}
                ";
        if ($datos->idcamporeporte != null) {
            $cadena .= " AND c.idcamporeporte = {$datos->idcamporeporte}";
        }
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }


}//fin clase 



