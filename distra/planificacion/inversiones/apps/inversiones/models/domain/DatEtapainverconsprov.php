<?php

class DatEtapainverconsprov extends BaseDatEtapainverconsprov {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatConstructor', array('local' => 'idconstructor', 'foreign' => 'idconstructor'));
        $this->hasMany('DatEtapaInversion', array('local' => 'idetapainversion', 'foreign' => 'idetapainversion'));
    }

    public function getByid($idetapa) {
        return Doctrine::getTable('DatEtapainverconsprov')->find($idetapa);
    }
    public function getByDql($idetapainversion) {
        $aux = Doctrine::getTable('DatEtapainverconsprov')->findByDql('idetapainversion ='.$idetapainversion);
        return $aux->toArray();
    }
     public function EliminarConst($idetapainversion) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatEtapainverconsprov ')
                        ->where('idetapainversion =?', array($idetapainversion))
                        ->execute();
    }

    public function getConstructoresByInversion($idinversion) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select eq.idetapinverconsprov
                             FROM mod_planifinversiones.dat_etapainversion e
                             INNER JOIN mod_planifinversiones.dat_etapinverconsprov eq ON(e.idetapainversion = eq.idetapainversion)
                             WHERE e.idinversion = $idinversion";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}