<?php

class NomEstadosftModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function cargarEstados($parametros) {
        $resulta = NomEstadosft::devolverEstados($parametros);
        $resultados->data = $resulta['datos'];
        $resultados->cant = $resulta['cantidad'];
        $resulta = DatTransicion::getIdEstadosInicialesFinales();
        $cont = 0;
        foreach ($resulta as $value) {
            $arrayresult[$cont] = $value['idestadoinicial'];
            $cont++;
            $arrayresult[$cont] = $value['idestadofinal'];
            $cont++;
        }
        $arrayresult1 = array_unique($arrayresult);

        foreach ($resultados->data as $k => $d) {
            if ($this->buscarValorArreglo($d['idestadosft'], $arrayresult1)) {
                $resultados->data[$k]['uso'] = 1;
            } else {
                $resultados->data[$k]['uso'] = 0;
            }
        }
        return $resultados;
    }

    public function buscarValorArreglo($idestado, $arrayresult1) {
        $esta = false;
        foreach ($arrayresult1 as $value) {
            if ($idestado == $value) {
                $esta = true;
                break;
            }
        }
        return $esta;
    }

    public function salvarEstados($parametros) {
        NomEstadosft::insertarNuevoEstado($parametros);
    }

    public function setEstados($parametros) {
        NomEstadosft::setEstado($parametros);
    }

    public function eliminarEstados($idestado) {
        NomEstadosft::deleteEstado($idestado);
    }

}

?>