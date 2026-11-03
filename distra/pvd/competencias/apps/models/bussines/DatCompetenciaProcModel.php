<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatCompetenciaProcModel extends ZendExt_Model
  {
      public function __construct()
      {
          parent::ZendExt_Model();
          $this->instance = new DatCompetenciaProc();
      }

      public function insertar($iddcompetencia, $idproceso)
      {
          try {
              $obj                 = new DatCompetenciaProc();
              $obj->iddcompetencia = $iddcompetencia;
              $obj->idproceso      = $idproceso;
              $obj->save();

              return true;
          } catch (Exception $e) {
              return false;
          }
      }
      public function modificar($idcompetenciaproc, $idproceso)
      {
          try {
              $obj = DatCompetenciaProc::getById($idcompetenciaproc);
              $obj->idproceso      = $idproceso;
              $obj->save();
              return true;

          } catch (Exception $e) {
              return false;
          }
      }

  }
