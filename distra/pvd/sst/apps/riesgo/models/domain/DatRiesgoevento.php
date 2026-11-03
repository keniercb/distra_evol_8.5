<?php
class DatRiesgoevento extends BaseDatRiesgoevento
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRiesgo',
            array('local' => 'idriesgo', 'foreign' => 'idriesgo')
        );
        $this->hasOne(
            'NomEvento',
            array('local' => 'idevento', 'foreign' => 'idevento')
        );
    }

    public function getById($idriesgoevento)
    {
        return Doctrine::getTable('DatRiesgoevento')->find($idriesgoevento);
    }

    public function getEventosByRiesgo($idriesgo, $limit = null, $start = 0)
    {
        try {
            $select = "dre.*, ne.denominacion as evento";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRiesgoevento dre')
                ->innerJoin('dre.NomEvento ne')
                ->where("dre.idriesgo = '$idriesgo'");
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantEventosByRiesgo($idriesgo)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatRiesgoevento dre')
                ->innerJoin('dre.NomEvento ne')
                ->where("dre.idriesgo = '$idriesgo'");
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function existeEvento($idriesgo, $idevento)
    {
        try {
            $select = "dre.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatRiesgoevento dre')
                ->where("dre.idriesgo = '$idriesgo' and dre.idevento = '$idevento'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}