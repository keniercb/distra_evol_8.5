<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatFechaControl extends BaseDatFechaControl {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatElementos', array('local' => 'idelemento', 'foreign' => 'idelemento')
        );
    }

    public function CargarFechasControl($parametros) {
        $query = new Doctrine_Query();
        $result = $query
                ->from('DatFechaControl fc')
                ->where('fc.idelemento = ?', $parametros->idelemento)
                ->orderby('fc.fechacontrol  ASC')
                ->execute();
        return $result->toArray();
    }

    public function eliminarFechaControl($params) {
        $consulta
                = "DELETE FROM mod_objetivos.dat_fechacontrol f
		WHERE f.fechacontrol = '$params->fechacontrol' AND idelemento = $params->idelemento";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($consulta);
        $result = $res->fetchAll();
        return $result;
    }

}

//fin clase 



