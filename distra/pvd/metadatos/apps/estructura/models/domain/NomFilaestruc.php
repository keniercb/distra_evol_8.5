<?php

  /**
   * Class NomFilaestruc
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class NomFilaestruc extends BaseNomFilaestruc
  {
    public function setUp()
    {
      parent::setUp();
      $this->hasOne('NomConcepto', array('local' => 'idconcepto', 'foreign' => 'idconcepto'));
      $this->hasMany('DatMedio', array('local' => 'idfila', 'foreign' => 'idmedio'));
      $this->hasMany('DatSubordinacion', array('local' => 'idfila', 'foreign' => 'idhijo'));
      $this->hasMany('DatSubordinacion', array('local' => 'idfila', 'foreign' => 'idpadre'));
      $this->hasMany('DatEstructuraop', array('local' => 'idfila', 'foreign' => 'idestructuraop'));
      $this->hasMany('DatEstructura', array('local' => 'idfila', 'foreign' => 'idestructura'));
      $this->hasMany('DatCargo', array('local' => 'idfila', 'foreign' => 'idcargo'));
      $this->hasMany('NomFilaestruc', array('local' => 'idfila', 'foreign' => 'idpadre'));
      $this->hasOne('NomFilaestruc', array('local' => 'idpadre', 'foreign' => 'idfila'));
    }

    public function dameOrden($idpadre)
    {

      $query   = Doctrine_Query::create();
      $result  = $query->select('max(a.orden) as maximo')->from('NomFilaestruc a')
        ->where('a.idpadre = ?', $idpadre)->execute()->toArray();
      $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

      return $proximo;
    }

    public function dameNivel($idpadre)
    {

      $mg        = Doctrine_Manager::getInstance();
      $conn      = $mg->getCurrentConnection();
      $sql       = "select (public.nlevel(f.parent_path)) as nivel
from mod_estructuracomp.nom_filaestruc f
where f.idfila = $idpadre";
      $resultado = $conn->fetchAll($sql);

      $nivel = $resultado[0]['nivel'] + 1;

      return $nivel;
    }
  }