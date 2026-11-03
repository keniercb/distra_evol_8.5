<?php

class DatVariableimpactocruzado extends BaseDatVariableimpactocruzado
{
    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatEstudiomatrizimpactocruzado', array('local' => 'idestudiomatrizimpactocruzado', 'foreign' => 'idestudiomatrizimpactocruzado'));
        $this->hasMany('DatMatrizimpactocruzado', array('local' => 'idvariable', 'foreign' => 'idvariablefila'));
        $this->hasMany('DatMatrizimpactocruzado', array('local' => 'idvariable', 'foreign' => 'idvariablecolumna'));
    }

    public static function getByid($idvariable) {
        return Doctrine::getTable('DatVariable')->find($idvariable)->toArray();
    }

    public static function getVariables($idestudiomatrizimpactocruzado, $idVariable = null) {
        try {
            $q = Doctrine_Query::create();
            $q->select()->from('DatVariableimpactocruzado v')->where('v.idestudiomatrizimpactocruzado = ?', $idestudiomatrizimpactocruzado);
            $q = (!is_null($idVariable) && is_numeric($idVariable)) ? $q->addWhere('v.idvariable =?', $idVariable) : $q;
            $q->orderBy('v.idvariable');
            $q->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }

    static function getVariablesasNodes($idestudiomatrizimpactocruzado, $idvariables) {
        try {
            $q = Doctrine_Query::create();
            $q->select('v.idvariable as id, v.denominacion as title, v.denominacion as label, v.descripcion as descripcion')
                ->from('DatVariableimpactocruzado v')
                ->where('v.idestudiomatrizimpactocruzado = ?', $idestudiomatrizimpactocruzado)
                ->andWhereIn('v.idvariable ', $idvariables);
            $q->orderBy('v.idvariable');
            $q->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $res = $q->execute();
            return $res;
        } catch (Exception $exc) {
            print_r($exc->getMessage());
            die;
        }
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getVariableByProyectoEstudio
     * @param $denominacion :Denominacion de la vriable
     * @param $idEstudio :Identificador del estudio
     * @return mixed
     */
    public static function getVariableByProyectoEstudio($denominacion, $idEstudio) {
        $q = Doctrine_Query::create();
        $q->from('DatVariableimpactocruzado dv')
            ->where('dv.denominacion =?', $denominacion)
            ->addWhere('dv.idestudiomatrizimpactocruzado =?', $idEstudio);
        $res = $q->fetchArray();
        return $res[0];
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getCausasByEstudio
     * @param $idEstudio :Identificador del estudio
     * @return mixed
     */
    static function getCausasByEstudio($idEstudio, $start = null, $limit = null) {
        $q = Doctrine_Query::create();
        $q->from('DatVariableimpactocruzado dv')->where('dv.idestudiomatrizimpactocruzado =?', $idEstudio);
        $res = $q->fetchArray();
        if (!is_null($start) && !is_null($limit)) {
            $q->offset($start)->limit($limit);
            $c = Doctrine_Query::create();
            $c->select('count(dv.idvariable) as cantidad')->from('DatVariableimpactocruzado dv')->where('dv.idestudiomatrizimpactocruzado =?', $idEstudio);
            $cant = $c->fetchArray();
            return array('root' => $res, 'cantidad_filas' => $cant[0]['cantidad']);
        }
        return $res;
    }
}