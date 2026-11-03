<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/03/16
 * Time: 9:23
 */

class DatDesagregacionmedambplan extends BaseDatDesagregacionmedambplan {

    public function setUp() {
        parent::setUp();
    }

    public function Buscar($iddesagregacionmedambplan) {
        $temp = $this->conn->getTable('DatDesagregacionmedambplan')->find($iddesagregacionmedambplan);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatDesagregacionmedambplan')->execute();
        return $result->toArray();
    }
    
    public function actualizar($idTabla, $valor, $idmonedaentidad) {
        $query = new Doctrine_Query ();
        $query->update('DatDesagregacionmedambplan n')
                ->set('valor', $valor)
//                ->whereIn('iddesagregacionequipoplan', $idTabla)
                ->where('iddesagregacionplan = ' . $idTabla . ' AND idmonedaentidad = '. $idmonedaentidad)
                ->execute();
                
        return true;
    }
}
