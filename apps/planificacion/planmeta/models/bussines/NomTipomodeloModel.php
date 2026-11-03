<?php

class NomTipomodeloModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(NomTipomodelo $NomTipomodelo) {
        return $NomTipomodelo->save();
    }

    public function Actualizar(NomTipomodelo $NomTipomodelo) {
        return $NomTipomodelo->save();
    }

    public function Eliminar(NomTipomodelo $NomTipomodelo) {
        return $NomTipomodelo->delete();
    }

    //devuelve true si el tipo de modelo no esta aprobado.
    public function validartipomodelo($idtipomodelo) {

        $tipoModelo = Doctrine::getTable('NomTipomodelo')->find($idtipomodelo);
        if ($tipoModelo['idaprobacion'] == 1) {
            return true;
        } else {
            return false;
        }
    }

    public function listarDesglosesAsociar($arridtiponomenclador,$cant) {
        $data = NomTipomodelo::listarDesglosesAsociar($arridtiponomenclador,$cant);
       return  $data;
    }
    public function listarDesglosesTodos() {
        $data = NomTipomodelo::listarDesglosesTodos();
        return  $data;
    }
    public function cantColmnasNomencladas($idtipomodelo) {
        $data = NomTipomodelo::cantColmnasNomencladas($idtipomodelo);
       return $data;
    }
    public function getColmnasNomencladas($idtipomodelo) {
        $data = NomTipomodelo::getColmnasNomencladas($idtipomodelo);
        return $data;
    }
    public function asociarDesglose($idtipomodelo,$iddesglose) {
        NomTipomodelo::asociarDesglose($idtipomodelo,$iddesglose);
    }
    public function desasociarDesglose($idtipomodelo) {
        NomTipomodelo::desasociarDesglose($idtipomodelo);
    }

}
