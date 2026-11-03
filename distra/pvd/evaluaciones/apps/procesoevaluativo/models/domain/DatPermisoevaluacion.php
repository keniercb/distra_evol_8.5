<?php

class DatPermisoevaluacion extends BaseDatPermisoevaluacion {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEvalprocesoevaluadores', array('local' => 'idevaluador', 'foreign' => 'idprocesoevaluadores'));
        $this->hasOne('DatEvalprocesoevaluados', array('local' => 'idevaluado', 'foreign' => 'idprocesoevaluados'));
    }

    public function getByid($idevaluador) {
        return Doctrine::getTable('DatPermisoevaluacion')->find($idevaluador)->toArray();
    }

}