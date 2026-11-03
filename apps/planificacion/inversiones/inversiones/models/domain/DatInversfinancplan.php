<?php

class DatInversfinancplan extends BaseDatInversfinancplan {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinversfinancplan) {
        return Doctrine::getTable('DatInversfinancplan')->find($idinversfinancplan)->toArray();
    }

    public function EliminarDadoIdTf($idtipofinan, $idinversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInversfinancplan n')
                        ->addwhere(' n.idtipofinanciamiento=?  AND n.idinversion=? ', array($idtipofinan, $idinversion))
                        ->execute();
    }

    public function actualizarTipoFinanc($idinversion, $tipofinc,$idtipofinanciamiento) {
        $query = new Doctrine_Query ();
        $res = $query->update('DatInversfinancplan n')
                ->set('n.idtipofinanciamiento', '?', $tipofinc)
                ->where('n.idinversion = ?  AND n.idtipofinanciamiento = ?', array($idinversion,$idtipofinanciamiento))
                ->execute();
        return 1;
    }
    

}

