<?php

class DatEstudiomatrizdanalisispolitico extends BaseDatEstudiomatrizdanalisispolitico
{

    public function setUp() {
        parent:: setUp();
        $this->hasMany('DatActo', array('local' => 'idestudiomatrizdanalisispolitico', 'foreign' => 'idestudiomatrizdanalisispolitico'));
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }

    public function getByid($idestudiomatrizdanalisispolitico) {
        return Doctrine::getTable('DatEstudiomatrizdanalisispolitico')->find($idestudiomatrizdanalisispolitico)->toArray();
    }

    public static function getProyectomap($idproyecto) {
        try {
            $q = Doctrine_Query::create();
            $q->select(
                'map.idproyecto as idproyecto, map.idestudiomatrizdanalisispolitico as idestudiomatrizdanalisispolitico,
                map.nativo as nativo, map.resultado as resultado, p.denominacion as denominacion'
            )
                ->from('DatEstudiomatrizdanalisispolitico map')
                ->innerJoin('map.DatProyecto p')
                ->where('map.idproyecto = ?', $idproyecto)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }
}