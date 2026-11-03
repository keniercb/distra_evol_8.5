<?php

class NomSituacexcep extends BaseNomSituacexcep
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        //   $this->hasMany('DatEstadosalud', array('local' => 'idaptitudfisica', 'foreign' => 'idaptitudfisica'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idaptitudfisica
     *
     * @return Doctrine_Record
     */
    public function getById($idsituacexcep)
    {
        return Doctrine::getTable('NomSituacexcep')->find($idsituacexcep);
    }

    public function getSituacExcep($filtro = null, $limit = null, $start = 0, $value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idsituacexcep, idsituacexcep as idnomenclador, denominacion, fdesde, fhasta, descripcion,
                abreviatura'
            )->from('NomSituacexcep')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
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
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }
//print_r($query->getSqlQuery());die;
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
    public function getCantSituacExcep($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomSituacexcep')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
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
    public function findByIdOrDenom($denom, $idsituacexcep)
     {
         try {
             $query = Doctrine_Query::create();
             $query->from('NomSituacexcep')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                 "denominacion ilike '$denom'"
             );
             if (!empty($idsituacexcep)) {
                 $query->andWhere("idsituacexcep <> ?", $idsituacexcep);
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

     public function findByIdOrDenomadd($denom, $idsituacexcep = null)
     {
         try {
             $query = Doctrine_Query::create();
             $query->from('NomSituacexcep')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                 "denominacion ilike '$denom'"
             );
             if (!empty($idsituacexcep)) {
                 $query->andWhere("idsituacexcep <> ?", $idsituacexcep);
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
      public function modSituacExcep($idsituacexcep, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
      {
          try {
              $query = Doctrine_Query::create()->update('NomSituacexcep')
                  ->where('idsituacexcep = ? ', $idsituacexcep);
              if ($denominacion != '') {
                  $query->set('denominacion', '?', $denominacion);
              }
              if ($abreviatura != '') {
                  $query->set('abreviatura', '?', $abreviatura);
              } else {
                  $query->set('abreviatura', 'null');
              }
              if ($descripcion != '') {
                  $query->set('descripcion', '?', $descripcion);
              } else {
                  $query->set('descripcion', 'null');
              }
              if ($fdesde != '') {
                  $query->set('fdesde', '?', $fdesde);
              }
              if ($fhasta != '') {
                  $query->set('fhasta', '?', $fhasta);
              } else {
                  $query->set('fhasta', 'null');
              }
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

    public function getEntidad($idestructura)
    {
        //  print_r($idestructura);die;
        $sql = "SELECT  idestructura
                 FROM mod_fuerzatrabajo.conf_entidad
                 where mod_fuerzatrabajo.conf_entidad.identidad=$idestructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        // print_r($sql);die;

        return $conn->fetchAll($sql);
    }
}

