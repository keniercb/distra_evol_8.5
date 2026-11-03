<?php

  /**
   * Class BaseNomCargo
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c)2013 xetid
   */
  abstract class BaseNomCargo extends Doctrine_Record
  {
    public function setTableDefinition()
    {
      $this->setTableName('mod_estructuracomp.nom_cargo');
      $this->hasColumn('idnomcargo', 'numeric', null, array('notnull' => true, 'primary' => true));
      $this->hasColumn('denominacion', 'character varying', 100, array('notnull' => true, 'primary' => false));
      $this->hasColumn('abreviatura', 'character varying', 10, array('notnull' => false, 'primary' => false));
      $this->hasColumn('actual', 'numeric', null, array('notnull' => false, 'primary' => false));
      $this->hasColumn('visible', 'numeric', null, array('notnull' => false, 'primary' => false));
      $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
      $this->hasColumn('facultado', 'numeric', null, array('notnull' => false, 'primary' => false));
      $this->hasColumn('idgrupocomplejidad', 'numeric', null, array('notnull' => false, 'primary' => false));
      $this->hasColumn('idnormajuridica', 'numeric', null, array('notnull' => TRUE, 'primary' => false));
      $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
      $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
      parent::setUp();
    }
  }