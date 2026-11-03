<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomVersionreportesNomCamporeporte
    extends BaseNomVersionreportesNomCamporeporte
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomVersionreportes', array('local'   => 'idversionreporte',
                                       'foreign' => 'idversionreporte')
        );
        $this->hasOne(
            'NomCamporeporte',
            array('local' => 'idcamporeporte', 'foreign' => 'idcamporeporte')
        );
    }

    public function ObtenerCamposVersionReporte($idversionreporte)
    {
        $connA = Doctrine_Manager:: connection();
        $consulta
            = "SELECT * FROM mod_objetivos.nom_camporeporte cr
                    INNER JOIN mod_objetivos.nom_versionreportes_nom_camporeporte vrcr 
                    ON cr.idcamporeporte = vrcr.idcamporeporte 
                    WHERE vrcr.idversionreporte = '$idversionreporte' ";
        $res = $connA->execute($consulta);
        $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function ObtenerCamposVersionReporteParaRecuperaciones(
        $idversionreporte
    ) {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT * FROM mod_objetivos.nom_versionreportes_nom_camporeporte nvcp
                INNER JOIN mod_objetivos.nom_versionreportes vr 
                ON vr.idversionreporte = nvcp.idversionreporte 
                INNER JOIN mod_objetivos.nom_camporeporte cr 
                ON cr.idcamporeporte = nvcp.idcamporeporte 
                WHERE nvcp.idversionreporte = '$idversionreporte'";
        $resnopag = $connA->execute($cadena);
        $result = $resnopag->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


}//fin clase



