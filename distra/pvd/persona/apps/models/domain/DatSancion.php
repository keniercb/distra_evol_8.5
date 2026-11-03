<?php

class DatSancion extends BaseDatSancion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomSancion', array('local' => 'idsancion', 'foreign' => 'idsancion'));
        $this->hasOne('NomMotivosancion', array('local' => 'idmotivosancion', 'foreign' => 'idmotivosancion'));
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @param $idsancionp
     *
     * @return Doctrine_Collection
     */
    public function getById($idsancionp)
    {
        $sanciones = $this->reflectArray($idsancionp);
        if (count($sanciones) > 0) {
            $query = Doctrine_Query::create()->from('DatSancion')->whereIn('idsancionp', $sanciones);

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
    public function getSancionesByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'ds.*, ns.denominacion as denomsancion, nms.denominacion as denommotivosancion,
                nts.denominacion as denomtiposancion, nts.idtiposancion as idtiposancion'
            )->from('DatSancion ds')
                ->innerJoin('ds.NomSancion ns')
                ->innerJoin('ds.NomMotivosancion nms')->innerJoin('ns.NomTiposancion nts')
                ->orderBy('ds.fimposicion DESC')
            ;
            if (!empty($filtro)) {
                $query->addWhere("ns.denominacion ilike = '%$filtro%'");
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('ds.idpersona', $idpersona)->execute()->toArray() :
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
    public function getCantSancionesByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatSancion ds')->innerJoin('ds.NomSancion ns')->innerJoin(
                'ds.NomMotivosancion nms'
            )->innerJoin('ns.NomTiposancion nts');
            if (!empty($filtro)) {
                $query->addWhere("ns.denominacion ilike = '%$filtro%'");
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('ds.idpersona', $idpersona)->count() : 0;
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
    public function delSanciones(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatSancion');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idsancionp', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

