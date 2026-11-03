<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatNivelCompetenciaModel extends ZendExt_Model
  {
      public function __construct()
      {
          parent::ZendExt_Model();
          $this->instance = new DatNivelCompetencia();
      }

      public function insertarNivelCompetencia($parametros)
      {
          try {
              $obj                 = new DatNivelCompetencia();
              $obj->idescala       = $parametros->idescala;
              $obj->iddcompetencia = $parametros->iddcompetencia;
              $obj->descripcion    = $parametros->descripcion;
              $obj->idvalorescala  = $parametros->idvalor;
              $obj->save();
              return true;
          } catch (Exception $e) {
              return false;
          }
      }

      public function eliminarNivelCompetencia($idnivelcompetencia)
      {
          try {
              $query  = Doctrine_Query::create();
              $result = $query->delete('idnivelcompetencia')
                  ->from('DatNivelCompetencia')
                  ->where("idnivelcompetencia = $idnivelcompetencia")
                  ->execute();
              return $result == 0 ? false : true;
          } catch (Doctrine_Exception $ee) {
              return false;
          }
      }

      public function eliminarNivelByCompetencia($iddcompetencia)
      {
          try {
              $query  = Doctrine_Query::create();
              $result = $query->delete('idnivelcompetencia')
                  ->from('DatNivelCompetencia')
                  ->where("iddcompetencia = $iddcompetencia")
                  ->execute();
              return true;
          } catch (Doctrine_Exception $ee) {
              return false;
          }
      }

      public function modificarNivelCompetencia($parametros)
      {
          try {
              $obj = DatNivelCompetencia::getById($parametros->idnivelcompetencia);
              $obj->idescala       = $parametros->idescala;
              $obj->iddcompetencia = $parametros->iddcompetencia;
              $obj->descripcion    = $parametros->descripcion;
              $obj->idvalorescala  = $parametros->idvalorescala;
              $obj->save();
              return true;
          } catch (Exception $e) {
              return false;
          }
      }

      public function obtenerIdProximo()
      {
          $query   = Doctrine_Query::create();
          $result  = $query->select('max(a.idnivelcompetencia) as maximo')
              ->from('DatNivelCompetencia a')
              ->execute()->toArray();
          $proximo = isset ($result [0] ['maximo']) ? $result [0] ['maximo'] + 1 : 1;
          return $proximo;
      }

      public function mostrarNiveles($idescala, $iddcompetencia, $denominacion, $start = 0, $limit = 15)
      {
          $datos = DatNivelCompetencia::mostrarNiveles(
              $idescala, $iddcompetencia, $denominacion, $start = 0, $limit = 15
          );
          return $datos;
      }
  }
