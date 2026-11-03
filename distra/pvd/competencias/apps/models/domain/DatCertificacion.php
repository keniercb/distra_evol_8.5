<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
class DatCertificacion extends BaseDatCertificacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatCompetenciapersona', array('local' => 'idcompetenciapersona', 'foreign' => 'idcompetenciapersona')
        );
    }

    public function getById($idcertificacion)
    {
        return Doctrine::getTable('DatCertificacion')->find($idcertificacion);
    }

    public function getCertificacionByPersona($idcompetenciapersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('cp.*')
            ->from('DatCertificacion cp')
            ->orderBy('cp.fhasta DESC');
        if (!empty($idcompetenciapersona)) {
            $queryObj->addWhere("cp.idcompetenciapersona = '$idcompetenciapersona'");
        }
        return $queryObj->fetchArray()[0];
    }
}