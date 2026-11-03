<?php
class DatRpeligro extends BaseDatRpeligro
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRiesgo',
            array('local' => 'idriesgo', 'foreign' => 'idriesgo')
        );
        $this->hasOne(
            'NomPeligro',
            array('local' => 'idpeligro', 'foreign' => 'idpeligro')
        );
    }

    public function getById($idrpeligro)
    {
        return Doctrine::getTable('DatRpeligro')->find($idrpeligro);
    }

    public function getPeligrosByRiesgo($idriesgo, $limit = null, $start = 0)
    {
        try {
            $select = "dre.*, ne.denominacion as peligro";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRpeligro dre')
                ->innerJoin('dre.NomPeligro ne')
                ->where("dre.idriesgo = '$idriesgo'");
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantPeligrosByRiesgo($idriesgo)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatRpeligro dre')
                ->innerJoin('dre.NomPeligro ne')
                ->where("dre.idriesgo = '$idriesgo'");
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function existePeligro($idriesgo, $idpeligro)
    {
        try {
            $select = "dre.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRpeligro dre')
                ->where("dre.idriesgo = '$idriesgo' and dre.idpeligro = '$idpeligro'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}