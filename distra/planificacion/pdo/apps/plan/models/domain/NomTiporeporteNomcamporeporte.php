<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomTiporeporteNomCamporeporte extends BaseNomTiporeporteNomCamporeporte
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTiporeporte',
            array('local' => 'idtiporeporte', 'foreign' => 'idtiporeporte')
        );
        $this->hasOne(
            'NomCamporeporte',
            array('local' => 'idcamporeporte', 'foreign' => 'idcamporeporte')
        );
    }

    public function ObtenerCamposReporteEstandar($idtiporeporte)
    {
        $connA = Doctrine_Manager:: connection();
        $consulta
            = "SELECT * FROM mod_objetivos.nom_camporeporte cr
                    INNER JOIN mod_objetivos.nom_tiporeporte_nom_camporeporte trcr 
                    ON cr.idcamporeporte = trcr.idcamporeporte 
                    WHERE trcr.idtiporeporte = '$idtiporeporte' 
                    ORDER BY trcr.orden ASC";
        $res = $connA->execute($consulta);
        $resultado = $res->fetchAll();
        return $resultado;
    }


}//fin clase



