<?php

/**
 * Class DatCondecoracion
 */
class DatCondecoracion extends BaseDatCondecoracion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne(
            'NomMotivocondecoracion', array('local' => 'idmotivocondecoracion', 'foreign' => 'idmotivocondecoracion')
        );
        $this->hasOne('NomCondecoracion', array('local' => 'idcondecoracion', 'foreign' => 'idcondecoracion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcondecoracionp
     *
     * @return Doctrine_Record
     */
    public function getById($idcondecoracionp)
    {
        $condecoraciones = $this->reflectArray($idcondecoracionp);
        if (count($condecoraciones) > 0) {
            $query = Doctrine_Query::create()->from('DatCondecoracion')->whereIn('idcondecoracionp', $condecoraciones);

            return $query->execute();
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCondecoracionesByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dc.*, nc.denominacion as denomcondecoracion, nmc.denominacion as denommotivocondecoracion,
                    ntc.denominacion as denomtipocondecoracion, ntc.idtipocondecoracion as idtipocondecoracion'
            )->from('DatCondecoracion dc')->innerJoin('dc.NomCondecoracion nc')->leftJoin(
                'dc.NomMotivocondecoracion nmc'
            )->innerJoin('nc.NomTipocondecoracion ntc');
            if (!empty($filtro)) {
                $query->addWhere("nc.denominacion ilike = '%$filtro%'");
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('dc.idpersona', $idpersona)->execute()->toArray() :
                array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantCondecoracionesByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCondecoracion dc')
                ->innerJoin('dc.NomCondecoracion nc')->innerJoin(
                    'dc.NomMotivocondecoracion nmc'
                )->innerJoin('nc.NomTipocondecoracion ntc');
            if (!empty($filtro)) {
                $query->addWhere("nc.denominacion ilike = '%$filtro%'");
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('dc.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $id
     * @param array $idpersona
     *
     * @return bool|Doctrine_Collection
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delCondecoraciones(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatCondecoracion');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idcondecoracionp', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getOnlyCondecoraciones($idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dc.idcondecoracionp,nc.denominacion as denominacion, dc.idcondecoracion as id'
            )->from('DatCondecoracion dc')->leftJoin('dc.NomCondecoracion nc')->where('dc.idpersona = ?', $idpersona)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            if (!empty($filtro)) {
                $query->addWhere("nc.denominacion ilike = '%$filtro%'");
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return $query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantOnlyCondecoraciones($idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCondecoracion dc')->innerJoin('dc.NomCondecoracion nc')->where(
                'dc.idpersona = ?', $idpersona
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            if (!empty($filtro)) {
                $query->addWhere("nc.denominacion ilike = '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

