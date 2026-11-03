<?php

class DatActo extends BaseDatActo
{

    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatEstudiomatrizdanalisispolitico', array('local' => 'idestudiomatrizdanalisispolitico', 'foreign' => 'idestudiomatrizdanalisispolitico'));
    }

    public function getByid($idacto) {
        return Doctrine::getTable('DatActo')->find($idacto)->toArray();
    }

    /**
     * @param $start
     * @param $limit
     * @param $idEstudioMap
     * @return mixed
     */
    public static function obtenerActosMap($start = null, $limit = null, $idEstudioMap) {
        $q = Doctrine_Query::create();
        $q->from('DatActo da')->where('da.idestudiomatrizdanalisispolitico =?', $idEstudioMap)->orderby('da.idacto');
        $q = (!is_null($start) && !is_null($limit)) ? $q->offset($start)->limit($limit) : $q;
        $res = $q->fetchArray();
        return $res;
    }

    /**
     * @param $acto
     * @param $idEstudioMap
     * @return mixed
     */
    public static function adicionarActo($acto, $idEstudioMap) {
        
        $act = new DatActo();
        $act->idestudiomatrizdanalisispolitico = $idEstudioMap;
        $act->denominacion = $acto->actoDenominacion;
        if (!empty($acto->actoDescripcion))
            $act->descripcion = $acto->actoDescripcion;
        $act->factibilidadinstitucional = $acto->institucional;
        $act->valorinteres = $acto->interes;
        $act->factibilidadhecho = $acto->hecho;
        $act->estabilidadminima = $acto->estabilidad;
        $act->nivelcompulsionmax = $acto->compulsion;
        $act->save();
        return $act->idacto;
    }

    /**
     * @param $acto
     * @return mixed
     */
    public static function modificarActo($acto) {
        $act = Doctrine::getTable('DatActo')->find($acto->idacto);
        $act->descripcion = $acto->descripcion;
        $act->denominacion = $acto->denominacion;
        $act->valorinteres = $acto->valorinteres;
        $act->factibilidadhecho = $acto->factibilidadhecho;
        $act->estabilidadminima = $acto->estabilidadminima;
        $act->nivelcompulsionmax = $acto->nivelcompulsionmax;
        $act->factibilidadinstitucional = $acto->factibilidadinstitucional;
        $act->save();
        return $act->idacto;
    }

    /**
     * @param $idEstudioMap
     * @return mixed
     */
    public static function getCantidad($idEstudioMap) {
        $q = Doctrine_Query::create();
        $q->select('count(da.idacto) as cantidad')->from('DatActo da')->where('da.idestudiomatrizdanalisispolitico =?', $idEstudioMap);
        $res = $q->fetchArray();
        return $res[0]['cantidad'];
    }
}