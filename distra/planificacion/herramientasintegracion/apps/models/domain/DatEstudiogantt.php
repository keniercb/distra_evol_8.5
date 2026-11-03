<?php

class DatEstudiogantt extends BaseDatEstudiogantt {

    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }

    public function getByid($idestudiogantt) {
        return Doctrine::getTable('DatEstudiogantt')->find($idestudiogantt)->toArray();
    }

    static function getProyectogantt($idproyecto) {
        try {
            $q = Doctrine_Query::create();
            $q->select('gantt.idproyecto as idproyecto, gantt.idestudiogantt as idestudiogantt, gantt.nativo as nativo, p.denominacion as denominacion')
                    ->from('DatEstudiogantt gantt')
                    ->innerJoin('gantt.DatProyecto p')
                    ->where('gantt.idproyecto = ?', $idproyecto)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());die;
        }
    }

}
