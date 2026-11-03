<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatCompetenciaCargo extends BaseDatCompetenciaCargo
  {
    /**
     * Configuración de las relaciones existentes
     */
    public function setUp()
    {
      parent::setUp();
      $this->hasMany('DatCompetencia', array('local' => 'iddcompetencia', 'foreign' => 'iddcompetencia'));

    }

    public function dameCompetenciasCargo($idcargo)
    {

        $mg   = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql  = " select nc.denominacion as competencia, nc.idescala, nc.idcompetencia,
                    dcc.iddcompetencia as idcompetenciacargo, dcc.idcargo, 1 as cargo
                  from mod_competencia.dat_competencia dc
                  inner join mod_competencia.dat_competenciacargo dcc on (dcc.iddcompetencia  = dc.iddcompetencia)
                  inner join mod_competencia.nom_competencia nc on (nc.idcompetencia = dc.idcompetencia)
                  where dcc.idcargo = $idcargo
                  order by nc.denominacion asc";//print_r($sql);die;
        $competenciasCargo = $conn->fetchAll($sql);
        return $competenciasCargo;
    }

    public function getById($idcompetenciacargo)
    {
      return Doctrine::getTable('DatCompetenciaCargo')->find($idcompetenciacargo);
    }
  }