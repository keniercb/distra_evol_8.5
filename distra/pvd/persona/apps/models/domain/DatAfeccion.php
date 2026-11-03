<?php

class DatAfeccion extends BaseDatAfeccion 
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomPadecimiento', array('local' => 'idpadecimiento', 'foreign' => 'idpadecimiento'));
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idafeccion
     *
     * @return Doctrine_Record
     */
    public function getById($idafeccion)
    {
        $afecciones = $this->reflectArray($idafeccion);
        if (count($afecciones) > 0) {
            $query = Doctrine_Query::create()->from('DatAfeccion')->whereIn('idafeccion', $afecciones);

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
    public function getAfeccionesByPersona(array $idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select("da.*, np.denominacion as denompadecimiento")
                ->from('DatAfeccion da')
                ->innerJoin('da.NomPadecimiento np');
            if (!empty($filtro)) {
                $query->addWhere("np.denominacion ilike = '%$filtro%'");
            }
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('da.idpersona', $idpersona)->execute()->toArray() :
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
    public function getCantAfeccionesByPersona(array $idpersona, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatAfeccion da')->innerJoin('da.NomPadecimiento np');
            if (!empty($filtro)) {
                $query->addWhere("np.denominacion ilike = '%$filtro%'");
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('da.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delAfecciones(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatAfeccion');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idafeccion', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    
    
}

