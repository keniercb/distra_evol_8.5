<?php

class DatEvalhechoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalhecho $DatEvalhecho) {
        $DatEvalhecho->save();
    }

    public function Actualizar(DatEvalhecho $DatEvalhecho) {
        $DatEvalhecho->save();
    }

    public function Eliminar($idhecho) {
        $DatEvalhecho = Doctrine::getTable('DatEvalhecho')->find($idhecho);
        $DatEvalhecho->delete();
    }

    public function existeHecho($idmodelo, $idvalorcualitativo, $idexpresionmatematica) {
        $existe = DatEvalhecho::ExisteHecho($idmodelo, $idvalorcualitativo, $idexpresionmatematica);
        if ($existe)
            return true;
        return false;
    }

}

