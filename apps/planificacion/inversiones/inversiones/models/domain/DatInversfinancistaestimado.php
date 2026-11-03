<?php

class DatInversfinancistaestimado extends BaseDatInversfinancistaestimado {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinversfinancistaestimado) {
        return Doctrine::getTable('DatInversfinancistaestimado')->find($idinversfinancistaestimado)->toArray();
    }
     public function EliminarDadoIdFinanc($idfinancista, $idinversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInversfinancistaestimado n')
                        ->addwhere('n.idfinancista=?  AND n.idinversion=? ', array($idfinancista, $idinversion))
                        ->execute();
    }

    public function actualizarFinanc($idinversion, $idfinancistanuevo,$idfinancista) {
        $query = new Doctrine_Query ();
        $res = $query->update('DatInversfinancistaestimado n')
                ->set('n.idfinancista', '?', $idfinancistanuevo)
                ->where('n.idinversion = ?  AND n.idfinancista = ?', array($idinversion,$idfinancista))
                ->execute();
        return 1;
    }

}

