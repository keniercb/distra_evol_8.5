<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2017 xetid
   */
class DatCompetenciapersona extends BaseDatCompetenciapersona
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomCompetencia', array('local' => 'idcompetencia', 'foreign' => 'idcompetencia'));
        $this->hasMany(
            'DatCertificacion',
            array('local' => 'idcompetenciapersona', 'foreign' => 'idcompetenciapersona')
        );
    }

    public function getById($idcompetenciapersona)
    {
        return Doctrine::getTable('DatCompetenciapersona')->find($idcompetenciapersona);
    }

    public function geCompetenciasPersona($idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('cp.*, cp.idvalorescala as idvalor, nc.denominacion as competencia, nc.idescala as idescala')
            ->from('DatCompetenciapersona cp')
            ->innerJoin('cp.NomCompetencia nc')
            ->where("cp.idpersona = '$idpersona' AND cp.fdesde <= now() AND (now() <= cp.fhasta OR cp.fhasta is null)");
        return $queryObj->fetchArray();
    }

    public function getDatosPersonaEvaluacion($idpersonaevaluacion)
    {
        $sql = "SELECT dpe.denom as proceso, pp.denominacion as periodo
            FROM mod_evaluaciones.dat_evalpersonaevaluacion AS per
            INNER JOIN mod_evaluaciones.dat_periodoproceso AS pp ON (per.idperiodoproceso = pp.idperiodoproceso)
            INNER JOIN mod_evaluaciones.dat_evalpreprocesoevaluativo AS ppe 
              ON (pp.idpreprocesoevaluativo = ppe.idpreprocesoevaluativo)
            INNER JOIN mod_evaluaciones.dat_evaldefprocesoevaluativo AS dpe 
              ON (ppe.iddefprocesoevaluativo = dpe.iddefprocesoevaluativo)
            WHERE per.idpersonaevaluacion = '$idpersonaevaluacion'";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}