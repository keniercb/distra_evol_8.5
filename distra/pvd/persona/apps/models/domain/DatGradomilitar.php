<?php

/**
 * Class DatGradomilitar
 */
class DatGradomilitar extends BaseDatGradomilitar
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idgrado
     *
     * @return Doctrine_Record
     */
    public function getById($idgrado)
    {
        $grados = $this->reflectArray($idgrado);
        if (count($grados) > 0) {
            $query = Doctrine_Query::create()->from('DatGradomilitar')->whereIn('idgradomilitar', $grados);

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
    public function getGradosMilitaresByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "dg.*, (CASE
                    WHEN dg.fdesde <= now() and (now() <= dg.fhasta or dg.fhasta is null)
                    THEN 1
                    ELSE 0
                    END) AS historico"
            )->from('DatGradomilitar dg');
            if (!empty($filtro)) {
                //$query->addWhere("nc.denominacion ilike = '%$filtro%'");
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('dg.idpersona', $idpersona)->execute()->toArray() :
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
    public function getCantGradosMilitaresByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatGradomilitar dg');
            if (!empty($filtro)) {
                //$query->addWhere("nc.denominacion ilike = '%$filtro%'");
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('dg.idpersona', $idpersona)->count() : 0;
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
    public function delGradosMilitares(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatGradomilitar');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idgradomilitar', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getGradoActual(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->from('DatGradomilitar dg')->where(
                'dg.fdesde <= now() and (now() <= dg.fhasta or dg.fhasta is null)'
            );

            return count($idpersona) > 0 ? $query->execute()->toArray() : array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

