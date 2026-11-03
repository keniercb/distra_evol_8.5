<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatCompetenciaProc extends BaseDatCompetenciaProc
  {
    /**
     * Configuración de las relaciones existentes
     */
    public function setUp()
    {
      parent::setUp();
      $this->hasMany('DatCompetencia', array('local' => 'iddcompetencia', 'foreign' => 'iddcompetencia'));

    }


    public function getById($idcompetenciaproc)
    {
      return Doctrine::getTable('DatCompetenciaProc')->find($idcompetenciaproc);
    }
  }