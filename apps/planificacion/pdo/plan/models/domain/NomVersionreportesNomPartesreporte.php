<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomVersionreportesNomPartesreporte
    extends BaseNomVersionreportesNomPartesreporte
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomVersionreportes', array('local'   => 'idversionreporte',
                                       'foreign' => 'idversionreporte')
        );
        $this->hasOne(
            'NomPartesreporte',
            array('local' => 'idpartereporte', 'foreign' => 'idpartereporte')
        );
    }

    public function ObtenerPartesVersionReporte($idversionreporte)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomVersionreportesNomPartesreporte vp')
            ->where("vp.idversionreporte = '$idversionreporte'")->orderby("vp.orden")
            ->execute();
        return $result->toArray();
    }

    public function ObtenerPartesVersionReporteParaRecuperaciones(
        $idversionreporte
    ) {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = " SELECT * FROM mod_objetivos.nom_versionreportes_nom_partesreporte nvnp
                INNER JOIN mod_objetivos.nom_versionreportes vr 
                ON vr.idversionreporte = nvnp.idversionreporte 
                INNER JOIN mod_objetivos.nom_partesreporte pr 
                ON pr.idpartereporte = nvnp.idpartereporte 
                WHERE nvnp.idversionreporte = '$idversionreporte' 
                ORDER BY pr.orden ";
        //print_r($cadena);die;
        $resnopag = $connA->execute($cadena);
        $result = $resnopag->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }


}//fin clase 



