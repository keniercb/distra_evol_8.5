<?php

class NomMision extends BaseNomMision
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomTipomision', array('local' => 'idtipomision', 'foreign' => 'idtipomision'));
        $this->hasMany('DatEstanciaexterior', array('local' => 'idmision', 'foreign' => 'idmision'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idmision
     *
     * @return Doctrine_Record
     */
    public function getById($idmision)
    {
        return Doctrine::getTable('NomMision')->find($idmision);
    }

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     * @param      $idtipomision
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getMisionActive($filtro = null, $limit = null, $start = 0, $idtipomision,$value)
    {
        try {
            $select
                = 'nm.idmision, nm.idmision as idnomenclador, nm.denominacion, nm.fdesde, nm.abreviatura,
                nm.fhasta, nm.descripcion, ntm.idtipomision as idtipomision, ntm.denominacion as denomtipomision';
            $query = Doctrine_Query::create()->select($select)->from('NomMision nm')->innerJoin('nm.NomTipomision ntm')
                ->where('nm.fdesde <= now() and (now() <= nm.fhasta or nm.fhasta is null)')
                ->orderBy('nm.denominacion');
            if($value){
                $query->limit(500)->offset(0);

            }else{
                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
                }
            }
            if ($filtro != null) {
                $query->andWhere("nm.denominacion ilike '%$filtro%' or nm.descripcion ilike '%$filtro%'");
            }
            if (!empty($idtipomision)) {
                $query->andWhere("nm.idtipomision = ?", $idtipomision);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param null $filtro
     * @param      $idtipomision
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantMisionActive($filtro = null, $idtipomision)
    {
        try {
            $query = Doctrine_Query::create()->from('NomMision nm')->innerJoin('nm.NomTipomision ntm')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if ($filtro != null) {
                $query->andWhere("nm.denominacion ilike '%$filtro%' or nm.descripcion ilike '%$filtro%'");
            }
            if (!empty($idtipomision)) {
                $query->andWhere("nm.idtipomision = ?", $idtipomision);
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idmision
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipomision
     *
     * @throws Exception
     */
    public function modMision($idmision, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipomision)
    {
        try {
            $query = Doctrine_Query::create()->update('NomMision')->where('idmision = ? ', $idmision);
            $this->setValues($denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipomision, $query);
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

    /**
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipomision
     * @param $query
     */
    private function setValues($denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipomision, $query)
    {
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
        if ($idtipomision != '') {
            $query->set('idtipomision', '?', $idtipomision);
        }
    }

    /**
     * @param      $denom
     * @param null $idmision
     *
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenomadd($denom, $idmision = null, $idtipomision)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomMision nm')->innerJoin('nm.NomTipomision ntm')->where(
                'nm.fdesde <= now() and (nm.fhasta is null or nm.fhasta > now())'
            )->andWhere("nm.denominacion ilike '$denom'");
            if (!empty($idmision)) {
                $query->andWhere("nm.idmision <> ?", $idmision);
            }
            if (!empty($idtipomision)) {
                $query->andWhere("ntm.idtipomision = ?", $idtipomision);
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
}

