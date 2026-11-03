<?php

class DatInversnivelactividad extends BaseDatInversnivelactividad {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEtapaInversion', array('local' => 'idetapainversion', 'foreign' => 'idetapainversion'));
        $this->hasOne('DatActespcomportamiento', array('local' => 'idactespcomportamiento', 'foreign' => 'idactespcomportamiento'));        
        $this->hasMany('DatInversnivelactividaddesglose', array('local' => 'idinversnivelactividad', 'foreign' => 'idinversnivelactividad'));

    }

    public function guardarNiveles($params) {
        foreach ($params['arrayNiveles'] as $nivactividad) {
            /* Adicionar o actualizar */
            if ($nivactividad->idinversnivelactividad == null) {
                /* Adicionar */
               
                $objetapinvactespcomp = new DatInversnivelactividad();
                $objetapinvactespcomp->idetapainversion = $params['idetapainversion'];
                $objetapinvactespcomp->idactespcomportamiento = $nivactividad->idactespcomportamiento;
                $objetapinvactespcomp->nivelactividadinversion = $nivactividad->nivelactividadinversion;                              
                $objetapinvactespcomp->save();
            } else {
                /* Actualizar */
                $objetapinvactespcomp = Doctrine::getTable('DatInversnivelactividad')->findByDql("idinversnivelactividad = $nivactividad->idinversnivelactividad");                      
                $objetapinvactespcomp[0]->nivelactividadinversion = $nivactividad->nivelactividadinversion; 
                $objetapinvactespcomp[0]->save();
            }
        }
       return 1;
    }

}
