<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatCompetenciaCargoModel extends ZendExt_Model
  {
      public function __construct()
      {
          parent::ZendExt_Model();
          $this->instance = new DatCompetenciaCargo();
      }

      public function insertar($iddcompetencia, $idcargo)
      {
          try {
              $obj                 = new DatCompetenciaCargo();
              $obj->iddcompetencia = $iddcompetencia;
              $obj->idcargo        = $idcargo;

              $obj->save();
              return true;
          } catch (Exception $e) {
            return false;
          }
      }

  }
