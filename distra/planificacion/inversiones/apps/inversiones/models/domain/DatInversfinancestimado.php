<?php

class DatInversfinancestimado extends BaseDatInversfinancestimado {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinversfinancestimado) {
        return Doctrine::getTable('DatInversfinancestimado')->find($idinversfinancestimado)->toArray();
    }
    public function EliminarDadoIdTf($idtipofinan,$idinversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                     ->from('DatInversfinancestimado n')
                    ->addwhere(' n.idtipofinanciamiento=?  AND n.idinversion=? ', array($idtipofinan,$idinversion))
                ->execute();
    }
    public function actualizarTipoFinanc($idinversion, $tipofinc,$idtipofinanciamiento) {
        $query = new Doctrine_Query ();
        $res = $query->update('DatInversfinancestimado n')
                ->set('n.idtipofinanciamiento', '?', $tipofinc)
                ->where('n.idinversion = ? AND n.idtipofinanciamiento = ?', array($idinversion,$idtipofinanciamiento))
                ->execute();
        return 1;
    }

}

