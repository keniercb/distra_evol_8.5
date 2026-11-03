<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatCompetenciaOrg extends BaseDatCompetenciaOrg
  {
    /**
     * Configuración de las relaciones existentes
     */
    public function setUp()
    {
      parent::setUp();
    //  $this->hasMany('DatCompetencia', array('local' => 'iddcomptencia', 'foreign' => 'iddcomptencia'));
     // $this->hasMany('NomFilaestruc', array('local' => 'idestructura', 'foreign' => 'idestructura'));

    }


    public function getById($idcompetenciaorg)
    {
      return Doctrine::getTable('DatCompetenciaOrg')->findOneBy('iddcompetencia', $idcompetenciaorg);
    }
  }