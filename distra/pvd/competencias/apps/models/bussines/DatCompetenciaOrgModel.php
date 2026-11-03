<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatCompetenciaOrgModel extends ZendExt_Model
  {
      public function __construct()
      {
          parent::ZendExt_Model();
          $this->instance = new DatCompetenciaOrg();
      }

      public function insertar($iddcompetencia, $idestructura)
      {
          try {
              $obj                 = new DatCompetenciaOrg();
              $obj->iddcompetencia = $iddcompetencia;
              $obj->idestructura        = $idestructura;
              $obj->save();
              return true;

          } catch (Exception $e) {
              return false;
          }
      }

      public function modificar($iddcompetencia, $idestructura)
      {
          try {
              $obj = DatCompetenciaOrg::getById($iddcompetencia);
//              print_r($obj);die;
              $obj->idestructura        = $idestructura;
              $obj->save();
              return true;

          } catch (Exception $e) {
              return false;
          }
      }

  }
