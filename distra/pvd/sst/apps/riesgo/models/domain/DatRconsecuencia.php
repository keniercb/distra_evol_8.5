<?php
class DatRconsecuencia extends BaseDatRconsecuencia
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRiesgo',
            array('local' => 'idriesgo', 'foreign' => 'idriesgo')
        );
        $this->hasOne(
            'NomConsecuencia',
            array('local' => 'idconsecuencia', 'foreign' => 'idconsecuencia')
        );
    }

    public function getById($idrconsecuencia)
    {
        return Doctrine::getTable('DatRconsecuencia')->find($idrconsecuencia);
    }

    public function getConsecuenciasByRiesgo($idriesgo, $limit = null, $start = 0)
    {
        try {
            $select = "dre.*, ne.denominacion as consecuencia";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRconsecuencia dre')
                ->innerJoin('dre.NomConsecuencia ne')
                ->where("dre.idriesgo = '$idriesgo'");
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantConsecuenciasByRiesgo($idriesgo)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatRconsecuencia dre')
                ->innerJoin('dre.NomConsecuencia ne')
                ->where("dre.idriesgo = '$idriesgo'");
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getConsecuenciaPrincipalByRiesgo($idriesgo)
    {
        try {
            $select = "dre.*, ne.valor as vconsecuencia";
            $query = Doctrine_Query::create()
                ->select($select)
                ->from('DatRconsecuencia dre')
                ->innerJoin('dre.NomConsecuencia ne')
                ->where("dre.idriesgo = '$idriesgo' AND dre.principal = 1");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function existeConsecuencia($idriesgo, $idconsecuencia)
    {
        try {
            $select = "dre.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRconsecuencia dre')
                ->where("dre.idriesgo = '$idriesgo' and dre.idconsecuencia = '$idconsecuencia'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}