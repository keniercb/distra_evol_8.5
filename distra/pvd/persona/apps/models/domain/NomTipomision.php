<?php

/**
 * Class NomTipomision
 */
class NomTipomision extends BaseNomTipomision
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('NomMision', array('local' => 'idtipomision', 'foreign' => 'idtipomision'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipomision
     *
     * @return Doctrine_Record
     */
    public function getById($idtipomision)
    {
        return Doctrine::getTable('NomTipomision')->find($idtipomision);
    }

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getTipoMisionActivos($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipomision, idtipomision as idnomenclador, denominacion, fdesde, fhasta, 
                descripcion, abreviatura'
            )->from('NomTipomision')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }  else {
                $query->limit(15)->offset(0);
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
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
    public function getCantTipoMisionActivos($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipomision')->where(
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
    public function findByIdOrDenom($denom, $idtipomision = null)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomTipomision')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion = '$denom'");
            if (!empty($idtipomision)) {
                $query->andWhere("idtipomision <> ?", $idtipomision);
            }
            $result = $result->fetchArray();
            if (count($result) > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idtipomision
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     * @throws Exception
     */
    public function modTipoMision($idtipomision, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipomision')->where('idtipomision= ? ', $idtipomision);
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
}

