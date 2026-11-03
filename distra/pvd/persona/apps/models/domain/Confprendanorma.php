<?php

class Confprendanorma extends BaseConfprendanorma //conftallaje
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
           $this->hasOne('NomNorma', array('local' => 'idnorma', 'foreign' => 'idnorma'));
           $this->hasOne('NomPrenda', array('local' => 'idprenda', 'foreign' => 'idprenda'));
           $this->hasOne('NomTalla', array('local' => 'idtalla', 'foreign' => 'idtalla'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idaptitudfisica
     *
     * @return Doctrine_Record
     */
    public function getById($idconftallaje)
    {
        return Doctrine::getTable('Confprendanorma')->find($idconftallaje);
    }

    public function getConfiguracion($filtro = null, $limit = null, $start = 0, $value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'conf.idconftallaje, conf.idconftallaje as idnomenclador, conf.idprenda, conf.idnorma, conf.idtalla,nn.denominacion as denomnorma,np.denominacion as denonprenda, nt.denominacion as denontalla'
            )->from('Confprendanorma conf ')
            ->innerJoin('conf.NomNorma nn')
            ->innerJoin('conf.NomPrenda np')
            ->innerJoin('conf.NomTalla  nt');
            if ($value) {
                $query->limit(500)->offset($start);
            } else {
                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
                }
            }
            if ($filtro != null) {
                $query->andWhere("np.denominacion ilike '%$filtro%'");
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantConfiguracion($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'conf.idconftallaje, conf.idconftallaje as idnomenclador, conf.idprenda, conf.idnorma, conf.idtalla,nn.denominacion as denomnorma,np.denominacion as denonprenda, nt.denominacion as denontalla'
            )->from('Confprendanorma conf ')
                ->innerJoin('conf.NomNorma nn')
                ->innerJoin('conf.NomPrenda np')
                ->innerJoin('conf.NomTalla  nt');
            if ($filtro != null) {
                $query->andWhere("np.denominacion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $denom
     * @param null $idtipomision
     *
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    /*public function findByIdOrDenom($denom, $idasignaciondefensa)
     {
         try {
             $query = Doctrine_Query::create();
             $query->from('NomAsigdefensa')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                 "denominacion ilike '$denom'"
             );
             if (!empty($idasignaciondefensa)) {
                 $query->andWhere("idasignaciondefensa <> ?", $idasignaciondefensa);
             }
             $result = $query->count();
             if ($result > 0) {
                 return true;
             } else {
                 return false;
             }
         } catch (Doctrine_Exception $e) {
             throw $e;
         }
     }

     public function findByIdOrDenomadd($denom, $idasignaciondefensa = null)
     {
         try {
             $query = Doctrine_Query::create();
             $query->from('NomAsigdefensa')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                 "denominacion ilike '$denom'"
             );
             if (!empty($idaptitudfisica)) {
                 $query->andWhere("idasignaciondefensa <> ?", $idasignaciondefensa);
             }
             $result = $query->count();
             if ($result > 0) {
                 return true;
             } else {
                 return false;
             }
         } catch (Doctrine_Exception $e) {
             throw $e;
         }
     }
/*
     /**
      * @param $idaptitudfisica
      * @param $denominacion
      * @param $descripcion
      * @param $fdesde
      * @param $fhasta
      *
      * @return bool
      * @throws Exception
      */
      public function modConfiguracion($idnomenclador, $idprenda, $idnorma, $idtalla)
      {
          try {
              $query = Doctrine_Query::create()->update('Confprendanorma')
                  ->where('idconftallaje = ? ', $idnomenclador);

                  $query->set('idprenda', '?', $idprenda);
                  $query->set('idnorma', '?', $idnorma);
                  $query->set('idtalla','?', $idtalla);

              $result = $query->execute();
              if ($result) {
                  return true;
              } else {
                  return false;
              }
          } catch (Exception $e) {
              throw $e;
          }
      }
}

