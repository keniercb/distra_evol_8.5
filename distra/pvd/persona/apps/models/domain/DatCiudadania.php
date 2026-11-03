<?php

class DatCiudadania extends BaseDatCiudadania
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomCiudadania', array('local' => 'idciudadania', 'foreign' => 'idciudadania'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idciudadania
     *
     * @return Doctrine_Record
     */
    public function getById($idciudadania)
    {
        $ciudadania = $this->reflectArray($idciudadania);
        if (count($ciudadania) > 0) {
            $query = Doctrine_Query::create()->from('DatCiudadania')->whereIn('idciudadaniap', $ciudadania);

            return $query->execute();
        }
    }

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
    public function getCiudadaniasByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select('dc.*, nc.denominacion as denomciudadania, nc.bandera as bandera')
                ->from('DatCiudadania dc')->innerJoin('dc.NomCiudadania nc');
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
    public function getCantCiudadaniasByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCiudadania dc')->innerJoin('dc.NomCiudadania nc');
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
    public function delCiudadanias(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatCiudadania');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idciudadaniap', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

