<?php

class DatCriterioestrategia extends BaseDatCriterioestrategia
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomCriterio', array('local' => 'idcriterio', 'foreign' => 'idcriterio'));
        $this->hasOne('DatEstrategia', array('local' => 'idestrategia', 'foreign' => 'idestrategia'));
    }

    public function getByid($idcriterio)
    {
        return Doctrine::getTable('DatCriterioestrategia')->find($idcriterio)->toArray();
    }

    static function getByFilaColumna($idcriterio, $idestrategia)
    {
        $q = Doctrine_Query::create();
        $q->select('v.*')->from('DatCriterioestrategia v')->where('v.idcriterio = ?', $idcriterio)->addWhere('v.idestrategia = ?', $idestrategia);

        return $q->execute();
    }

    static function getByidFila($idestrategia)
    {
        try {
            $q = Doctrine_Query::create();
            $q->select('v.*')->from('DatCriterioestrategia v')->where('v.idestrategia =?', $idestrategia)->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }


}

