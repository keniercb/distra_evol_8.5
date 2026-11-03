<?php

/**
 * Class DatTallaje
 */
class DatTallaje extends BaseDatTallaje
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomNorma', array('local' => 'idnorma', 'foreign' => 'idnorma'));
        $this->hasOne('NomPrenda', array('local' => 'idprenda', 'foreign' => 'idprenda'));
        $this->hasOne('NomTalla', array('local' => 'idtalla', 'foreign' => 'idtalla'));
        $this->hasOne('Confprendanorma', array('local' => 'idtalla', 'foreign' => 'idtalla'));
    }

    /**
     * Devuelve un objeto de la clase
     *
     * @param idtallaje
     *
     * @return Doctrine_Record
     */
    public function getById($idtallaje)
    {
        try {
            $idtallaje = $this->reflectArray($idtallaje);
            if (count($idtallaje) > 0) {
                $query = Doctrine_Query::create()->from('DatTallaje')->whereIn('idtallaje', $idtallaje);

                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
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

    public function getTallajesByPersona(array $idpersona, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dt.*, nn.denominacion as denomnorma, np.denominacion as denomprenda, nt.denominacion as denomtalla'
            )->from('DatTallaje dt')->innerJoin('dt.NomNorma nn')->innerJoin('dt.NomPrenda np')->innerJoin(
                'dt.NomTalla nt'
            )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return count($idpersona) > 0 ? $query->andWhereIn('dt.idpersona', $idpersona)->execute() : array();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTallajesAll($idprenda)
    {
        try {
            if ($idprenda) {
                $query = Doctrine_Query::create()->select(
                    'dt.*, nn.denominacion as denomnorma, np.denominacion as denomprenda, nt.denominacion as denomtalla'
                )
                    ->from('DatTallaje dt')
                    ->innerJoin('dt.NomNorma nn')
                    ->innerJoin('dt.NomPrenda np')
                    ->innerJoin('dt.NomTalla nt')
                    ->andWhereIn('dt.idprenda', $idprenda)
                    ->orderBy('dt.idtalla');
                return $query->execute()->toArray();
            }


        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCantTallajesByPersona(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->from('DatTallaje dt')->innerJoin('dt.NomNorma nn')->innerJoin(
                'dt.NomPrenda np'
            )->innerJoin('dt.NomTalla nt')->setHydrationMode(Doctrine::HYDRATE_ARRAY);

            return count($idpersona) > 0 ? $query->andWhereIn('dt.idpersona', $idpersona)->count() : 0;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function delTallaje(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatTallaje');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idtallaje', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}