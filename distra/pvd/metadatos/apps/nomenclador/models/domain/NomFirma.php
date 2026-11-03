<?php

    class NomFirma extends BaseNomFirma {
        public function setUp() {
            parent::setUp();
            $this->hasOne('NomCargo', array('local' => 'idnomcargo', 'foreign' => 'idnomcargo'));
            $this->hasOne('NomDominio', array('local' => 'iddominio', 'foreign' => 'iddominio'));
        }

        static function dameTodos($iddominio = 1) {
            $query     = Doctrine_Query::create();
            $resultado = $query->from('NomFirma')->where('iddominio = ? and actual = 1', $iddominio)->execute()->toArray();
            return $resultado;
        }

        static function buscarFirma($idfirma) {
            $query     = Doctrine_Query::create();
            $resultado = $query->select('c.*, a.denominacion as cargo')->from('NomFirma c')->innerJoin('c.NomCargo a')->where('idfirma = ?', $idfirma)->execute()->toArray();
            return $resultado;
        }

      /**
       * Descripción del método:  Busca la cantidad de elementos que existen con la misma denominacion
       *
       * @author    : Ing. Osvaldo M. Gonzalez
       * @modify    : Ing. Yoandry Borges
       *
       * @param      $denominacion
       * @param bool $modificar
       * @param int  $idGrupoComplejidad
       *
       * @return bool : bool Devuelve la cantidad de instancias encontradas
       * @copyright Copyright (c) 2013 xetid
       */
      function existeDenominacion($denominacion, $modificar = false, $idFirma = 1)
      {

        if ($modificar) {
          $object = Doctrine::getTable('NomFirma')->findByDql("idfirma = $idFirma")
                            ->getFirst();

          $denom = $object['persona'];
          if ($denom != $denominacion) {
            return $this->existeDenominacion($denominacion);
          } else {
            return false;
          }
        } else {
          $query = Doctrine_Query::create();
          $resultado = $query->from('NomFirma')->where(
                             "LOWER(persona) = LOWER
            ('$denominacion')"
          )->execute()->count();

          return $resultado > 0;
        }
      }
      /**
       * Descripción del método: Verifica si el cargo esta siendo utilizado
       *
       * @author    : Ing. Osvaldo M. Gonzalez
       * @modify    : Ing. Yoandry Borges
       *
       * @param $id
       *
       * @return bool : bool, Retorna true si esta en uso
       * @copyright Copyright (c) 2013 xetid
       */
      static function verificarDenominacionCargo($denominacion)
      {
        $query = Doctrine_Query::create();

        $resultado =  $query->from('NomFirma c')->leftJoin(
                              "c.NomCargo gc"
        )->where("LOWER(denominacion) like LOWER('".$denominacion."')")->execute()->count();
            if ($resultado > 0) {
          return true;
        }else
        return false;
      }
      /**
       * Descripción del método: Verifica si el cargo esta siendo utilizado
       *
       * @author    : Ing. Osvaldo M. Gonzalez
       * @modify    : Ing. Yoandry Borges
       *
       * @param $id
       *
       * @return bool : bool, Retorna true si esta en uso
       * @copyright Copyright (c) 2013 xetid
       */
      static function verificarUsoCargo($id)
      {
        $query = Doctrine_Query::create();
        $resultado = $query->from('NomCargo')->where("idnomcargo = $id")->execute()->count();
        if ($resultado > 0) {
          return true;
        }

        return false;
      }

    }

