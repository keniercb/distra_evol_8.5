<?php

class NomColumnaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(NomColumna $NomColumna) {
        return $NomColumna->save();
    }

    public function Eliminar(NomColumna $NomColumna) {
        $NomColumna->delete();
        return true;
    }

    public function existencia($denominacion, $id) {
        if (count(NomColumna::verificarexistetcia($denominacion, $id)) != 0) {
            return true;
        } else {
            return false;
        }
    }

    function eliminarencadena($idcolumna) {
        if ($this->Eliminar(Doctrine::getTable('NomColumna')->find($idcolumna))) {
            return true;
        } else {
            return false;
        }
    }

    public function columnaEnUso($idcolumna) {
        $this->_meta = ZendExt_Metadata::getInstance();
        $arrayModelos = DatModelo::GetTodos();
        $tipomod = new NomTipomodelo();
        foreach ($arrayModelos as $modelo) {
            $tipomodelo = $tipomod->Buscar($modelo['idtipomodelo']);
            $result = $this->_meta->Metadata()->obtenerConfigGridPanel(
                    $tipomodelo[0]['idtabla']
            );
            foreach ($result->cm as $data) {
                $array = split('c', $data[dataIndex]);
                $idcompare = $array[count($array) - 1];
                if ($idcolumna == $idcompare) {
                    return true;
                }
            }
        }
        return false;
    }

}
