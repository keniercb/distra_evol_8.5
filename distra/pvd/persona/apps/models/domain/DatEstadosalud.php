<?php

class DatEstadosalud extends BaseDatEstadosalud
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomAptitudfisica', array('local' => 'idaptitudfisica', 'foreign' => 'idaptitudfisica'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $limitacion
     *
     * @return Doctrine_Record
     */
    public function getById($idestadosalud)
    {
        $estadosalud = $this->reflectArray($idestadosalud);
        if (count($estadosalud) > 0) {
            $query = Doctrine_Query::create()->from('DatEstadosalud')->whereIn('idestadosalud', $estadosalud);

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
    public function getEstadoSaludByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select("des.*, naf.denominacion as denomaptitudfisica")->from(
                'DatEstadosalud des'
            )->leftJoin('des.NomAptitudfisica naf');
            if (!empty($filtro)) {
                $query->addWhere("naf.denominacion ilike = '%$filtro%'");
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('des.idpersona', $idpersona)->execute()->toArray() :
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
    public function getCantEstadoSaludByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatEstadosalud des')->leftJoin('des.NomAptitudfisica naf');
            if (!empty($filtro)) {
                $query->addWhere("naf.denominacion ilike = '%$filtro%'");
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('des.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delEstadoSalud(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatEstadosalud');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idafeccion', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

