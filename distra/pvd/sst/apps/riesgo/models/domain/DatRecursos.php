<?php
class DatRecursos extends BaseDatRecursos
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRiesgo',
            array('local' => 'idriesgo', 'foreign' => 'idriesgo')
        );
        $this->hasOne(
            'NomRecurso',
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
    }

    public function getById($idrecurso)
    {
        return Doctrine::getTable('DatRecursos')->find($idrecurso);
    }
    
    /**
     * @param int $idriesgo
     * @param null $limit
     * @param int $start
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getRecursosByRiesgo($idriesgo, $limit = null, $start = 0)
    {
        try {
            $select = "dd.*, nr.denominacion as recurso";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRecursos dd')
                ->innerJoin('dd.NomRecurso nr')
                ->where("dd.idriesgo = '$idriesgo'");
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $idriesgo
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantRecursosByRiesgo($idriesgo)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatRecursos dd')
                ->innerJoin('dd.NomRecurso nr')
                ->where("dd.idriesgo = '$idriesgo'");
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param int $idriesgo
     * @param string $idrecurso
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function existeRec($idriesgo, $idrecurso)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRecursos dd')
                ->where("dd.idriesgo = '$idriesgo' and dd.idrecurso = '$idrecurso'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}