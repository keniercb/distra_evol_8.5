<?php

class DatInversfinancejecutado extends BaseDatInversfinancejecutado {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinversfinancejecutado) {
        return Doctrine::getTable('DatInversfinancejecutado')->find($idinversfinancejecutado)->toArray();
    }

    public function EliminarDadoIdTf($idtipofinan, $idinversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInversfinancejecutado n')
                        ->addwhere(' n.idtipofinanciamiento=?  AND n.idinversion=? ', array($idtipofinan, $idinversion))
                        ->execute();
    }

    public function actualizarTipoFinanc($idinversion, $tipofinc,$idtipofinanciamiento) {
        $query = new Doctrine_Query ();
        $res = $query->update('DatInversfinancejecutado n')
                ->set('n.idtipofinanciamiento', '?', $tipofinc)
                ->where('n.idinversion = ? AND n.idtipofinanciamiento = ?', array($idinversion,$idtipofinanciamiento))
                ->execute();
        return 1;
    }

}

