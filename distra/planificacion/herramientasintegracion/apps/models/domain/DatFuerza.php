<?php

class DatFuerza extends BaseDatFuerza
{

    public function setUp() {
        parent:: setUp();
        $this->hasMany('DatFuerzaacto', array('local' => 'idfuerza', 'foreign' => 'idfuerza'));
    }

    public function getByid($idfuerza) {
        return Doctrine::getTable('DatFuerza')->find($idfuerza)->toArray();
    }

    /**
     * @param null $start
     * @param null $limit
     * @param $idEstudioMap
     * @return mixed
     */
    public static function obtenerFuerzasMap($start = null, $limit = null, $idEstudioMap) {
        $q = Doctrine_Query::create();
        $q->from('DatFuerza df')->where('df.idestudiomatrizdanalisispolitico =?', $idEstudioMap)->orderby('df.idfuerza');
        $res = $q->fetchArray();
        return $res;
    }

    /**
     * @param $fuerza
     * @param $idEstudioMap
     * @return mixed
     */
    public static function adicionarFuerza($fuerza, $idEstudioMap) {
        $fza = new DatFuerza();
        $fza->idestudiomatrizdanalisispolitico = $idEstudioMap;
        $fza->denominacion = $fuerza->fzaDenominacion;
        if (!empty($fuerza->fzaDescripcion))
            $fza->descripcion = $fuerza->fzaDescripcion;
        $fza->peso = $fuerza->peso;
        $fza->save();
        return $fza->idfuerza;
    }

    /**
     * @param $fuerza
     * @return mixed
     */
    public static function modificarFuerza($fuerza) {
        $fza = Doctrine::getTable('DatFuerza')->find($fuerza->idfuerza);
        $fza->denominacion = $fuerza->fzaDenominacion;
        $fza->descripcion = $fuerza->fzaDescripcion;
        $fza->peso = $fuerza->peso;
        $fza->save();
        return $fza->idfuerza;
    }

    /**
     * @param $idEstudioMap
     * @return mixed
     */
    public static function getCantidad($idEstudioMap) {
        $q = Doctrine_Query::create();
        $q->select('count(df.idfuerza)')->from('DatFuerza df')->where('df.idestudiomatrizdanalisispolitico =?', $idEstudioMap);
        $res = $q->fetchArray();
        return $res[0]['cantidad'];
    }
}