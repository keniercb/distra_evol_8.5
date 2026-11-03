<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/05/16
 * Time: 9:23
 */

class DatControlplanpreparacionplan extends BaseDatControlplanpreparacionplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($idcontrolplanpreparacionplan) {
        $temp = $this->conn->getTable('DatControlplanpreparacionplan')->find($idcontrolplanpreparacionplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatControlplanpreparacionplan')->execute();
        return $result->toArray();
    }
    
    public function actualizarValor($idTabla, $idmonEntidad, $valor) {
        $query = new Doctrine_Query ();
        $query->update('DatControlplanpreparacionplan n')
                ->set('valor', $valor)
                ->where('idcontrolplantiempocontrol = ' . $idTabla . ' AND idmonedaentidad = '. $idmonEntidad)
                ->execute();
        return true;
    }

}
