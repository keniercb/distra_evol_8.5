<?php

class NomEvalsenyalamientoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(NomEvalsenyalamiento $NomEvalsenyalamiento) {
        $NomEvalsenyalamiento->save();
    }

    public function Actualizar(NomEvalsenyalamiento $NomEvalsenyalamiento) {
        $NomEvalsenyalamiento->save();
    }

    public function Eliminar($NomEvalsenyalamiento) {
        $NomEvalsenyalamiento->delete();
    }

    public function existeDenominacion($idtiposenyalamiento, $denom) {
        $existe = NomEvalsenyalamiento :: ExisteDenomSenya($idtiposenyalamiento, $denom);
        if ($existe)
            return true;
        return false;
    }

    public function SenyalamientoEnUso($id) {
        $valores = NomEvalsenyalamiento :: SenyalamientoEnUso($id);
        if ($valores)
            return true;
        return false;
    }

}

