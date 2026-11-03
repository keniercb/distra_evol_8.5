<?php

class DatDatosclasificadorindicadorModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatDatosclasificadorindicador($datDatosclasificadorindicador
    )
    {
        $datDatosclasificadorindicador->save();
    }

    public function modificardatDatosclasificadorindicador($datDatosclasificadorindicador
    )
    {
        $datDatosclasificadorindicador->save();
    }

    public function eliminardatDatosclasificadorindicador($datDatosclasificadorindicador
    )
    {
        $datDatosclasificadorindicador->delete();
    }

    public function asociar($params)
    {
        if ($params['accion'] == 'asociar') {
            foreach ($params['indicadores'] as $value) {
                if ($params['iddelet']) {
                    DatDatosclasificadorindicador::eliminarDadoIdInd(
                        $params['idind'], $params['iddelet']
                    );
                }
                $obj = new DatDatosclasificadorindicador();
                $obj->iddatosclasificador = $params['iddatcodificador'];
                $obj->idindicador = $value[0];
                $obj->save();
                $idindicadores = NomIndicador::BuscarHijos(
                    $value[2], $value[3], $value[1], $params['idtipoc']
                );
                foreach ($idindicadores as $val) {
                    $obj = new DatDatosclasificadorindicador();
                    $obj->iddatosclasificador = $params['iddatcodificador'];
                    $obj->idindicador = $val['idindicador'];
                    $obj->save();
                }
            }
        } else {
            foreach ($params['indicadores'] as $value) {
                $idindicadores = NomIndicador::BuscarHijosAsociados(
                    $value[2], $value[3], $value[1], $params['idtipoc']
                );
                if ($idindicadores[0] != null) {
                    foreach ($idindicadores as $val) {
                        $aux[] = $val['idindicador'];
                    }
                }
                $aux[] = $value[0];
                DatDatosclasificadorindicador::eliminar($aux);
            }
        }
        return array('codMsg' => '24');
    }

    public function validarAsociacion($params)
    {
        $codMsg = '24';
        $iddatoscod = array();
        $idind;
        foreach ($params['indicadores'] as $value) {

            $idindicadores = NomIndicador::BuscarHijosAsociados(
                $value[2], $value[3], $value[1], $params['idtipoc']
            );
            if ($idindicadores[0] != null) {
                foreach ($idindicadores as $dat) {
                    $idind[] = $dat['idindicador'];
                }
                $iddatoscodificador
                    = NomDatoscodificador::obtenerDatosDadoIdtipo(
                        $params['idtipoc']
                    );
                foreach ($iddatoscodificador as $val) {
                    $iddatoscod[] = $val['iddatoscodificador'];
                }
                $codMsg = '23';
            }
        }
        $iddatoscod = array_unique($iddatoscod);
        return array('codMsg' => $codMsg, 'iddatoscod' => $iddatoscod,
                     'idindicador' => $idind);;
    }

}


