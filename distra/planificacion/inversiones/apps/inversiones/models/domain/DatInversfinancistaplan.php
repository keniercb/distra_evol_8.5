<?php

class DatInversfinancistaplan extends BaseDatInversfinancistaplan {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinversfinancistaplan) {
        return Doctrine::getTable('DatInversfinancistaplan')->find($idinversfinancistaplan)->toArray();
    }

    public function EliminarDadoIdFinanc($idfinancista, $idinversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInversfinancistaplan n')
                        ->addwhere('n.idfinancista=?  AND n.idinversion=? ', array($idfinancista, $idinversion))
                        ->execute();
    }

    public function actualizarFinanc($idinversion, $idfinancistanuevo, $idfinancista) {
        $query = new Doctrine_Query ();
        $res = $query->update('DatInversfinancistaplan n')
                ->set('n.idfinancista', '?', $idfinancistanuevo)
                ->where('n.idinversion = ?  AND n.idfinancista = ?', array($idinversion, $idfinancista))
                ->execute();
        return 1;
    }

}

