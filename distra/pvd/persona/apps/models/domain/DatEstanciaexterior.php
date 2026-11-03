<?php

/**
 * Class DatEstanciaexterior
 */
class DatEstanciaexterior extends BaseDatEstanciaexterior
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomMision', array('local' => 'idmision', 'foreign' => 'idmision'));
        $this->hasOne(
            'NomTipoestanciaexterior', array('local' => 'idtipoestanciaexterior', 'foreign' => 'idtipoestanciaexterior')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idestanciaexterior
     *
     * @return Doctrine_Record
     */
    public function getById($idestanciaexterior)
    {
        $estanciaexterior = $this->reflectArray($idestanciaexterior);
        if (count($estanciaexterior) > 0) {
            $query = Doctrine_Query::create()->from('DatEstanciaexterior')->whereIn(
                'idestanciaexterior', $estanciaexterior
            );

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
    public function getEstanciasExteriorByPersonas(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "dee.*, nm.denominacion as denommision, ntee.denominacion as denomtipoestanciaexterior,
                    ntm.denominacion as denomtipomision, ntm.idtipomision as idtipomision,
                    (CASE
                    WHEN dee.fdesde <= now() and (now() <= dee.fhasta or dee.fhasta is null)
                    THEN 1
                    ELSE 0
                    END) AS historico"
            )->from('DatEstanciaexterior dee')->innerJoin('dee.NomMision nm')->leftJoin(
                'dee.NomTipoestanciaexterior ntee'
            )->innerJoin('nm.NomTipomision ntm');
            if (!empty($filtro)) {
                $query->addWhere("nm.denominacion ilike = '%$filtro%'");
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('dee.idpersona', $idpersona)->execute()->toArray() :
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
    public function getCantEstanciasExteriorByPersonas(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatEstanciaexterior dee')->innerJoin('dee.NomMision nm')->leftJoin(
                'dee.NomTipoestanciaexterior ntee'
            )->innerJoin('nm.NomTipomision ntm');
            if (!empty($filtro)) {
                $query->addWhere("nm.denominacion ilike = '%$filtro%'");
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('dee.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delEstanciasExterior(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatEstanciaexterior');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idestanciaexterior', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

