<?php

class DatInversfinancproyectado extends BaseDatInversfinancproyectado {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idplaninversfinancproyectado) {
        return Doctrine::getTable('DatInversfinancproyectado')->find($idplaninversfinancproyectado)->toArray();
    }

    public function EliminarDadoIdTf($idtipofinan, $idinversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInversfinancproyectado n')
                        ->addwhere(' n.idtipofinanciamiento=?  AND n.idinversion=?', array($idtipofinan, $idinversion))
                        ->execute();
    }
     public function actualizarTipoFinanc($idinversion, $tipofinc,$idtipofinanciamiento) {
        $query = new Doctrine_Query ();
        $res = $query->update('DatInversfinancproyectado n')
                ->set('n.idtipofinanciamiento', '?', $tipofinc)
                ->where('n.idinversion = ?  AND n.idtipofinanciamiento = ?', array($idinversion,$idtipofinanciamiento))
                
                ->execute();
        return 1;
    }

}

