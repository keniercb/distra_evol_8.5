<?php

class NomCriterio extends BaseNomCriterio
{

    static function getCriterios($p){
        $fechaIni =  $p['fechaini'];
        $fechaFin =  $p['fechafin'];
        $denominacion= $p['denominacion'];
        $q = Doctrine_Query::create()
            ->select("n.*")
            ->from('NomCriterio n');
        $q = ($fechaIni !== '' && $fechaFin !== '') ? $q->addWhere('n.fechaini >=?', $fechaIni)->andWhere('n.fechafin <=?', $fechaFin) : $q;
        $q = ($fechaIni !== '' && (!($fechaIni !== '' && $fechaFin !== ''))) ? $q->addWhere('n.fechaini =?', $fechaIni) : $q;
        $q = ($fechaFin !== '' && (!($fechaIni !== '' && $fechaFin !== ''))) ? $q->addWhere('n.fechafin =?', $fechaFin) : $q;
        $q = ($denominacion !== '') ? $q->addWhere('lower(n.denominacion) LIKE ?', '%' . strtolower($denominacion) . '%') : $q;
        $res = $q->fetchArray();
        return $res;
    }

    public function setUp()
    {
        parent :: setUp ();
        $this->hasMany ('DatCriterioestrategia', array ('local' => 'idcriterio', 'foreign' => 'idcriterio'));
    }

    public function getByid($idcriterio)
    {
        return Doctrine::getTable('NomCriterio')->find($idcriterio)->toArray();
    }


}

