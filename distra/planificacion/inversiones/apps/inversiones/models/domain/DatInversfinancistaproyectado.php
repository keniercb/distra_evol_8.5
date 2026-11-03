<?php

class DatInversfinancistaproyectado extends BaseDatInversfinancistaproyectado {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinversfinancistaproyectado) {
        return Doctrine::getTable('DatInversfinancistaproyectado')->find($idinversfinancistaproyectado)->toArray();
    }

    public function EliminarDadoIdFinanc($idfinancista, $idinversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInversfinancistaproyectado n')
                        ->addwhere('n.idfinancista=?  AND n.idinversion=? ', array($idfinancista, $idinversion))
                        ->execute();
    }

    public function actualizarFinanc($idinversion, $idfinancistanuevo, $idfinancista) {
        $query = new Doctrine_Query ();
        $res = $query->update('DatInversfinancistaproyectado n')
                ->set('n.idfinancista', '?', $idfinancistanuevo)
                ->where('n.idinversion = ?  AND n.idfinancista = ?', array($idinversion, $idfinancista))
                ->execute();
        return 1;
    }

}

