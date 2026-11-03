<?php

class DatRestriccionesModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function ConfigurarRestricciones(
        $arraycambios, $idestado, $idtipodoc
    )
    {
        if (isset($arraycambios[0])) {
            foreach ($arraycambios as $key => $cambio) {
                $final = 0;
                $inicial = 0;
                if ($cambio->finall) {
                    $final = 1;
                }
                if ($cambio->inicial) {
                    $inicial = 1;
                }
                $idusuario = $cambio->idusuario;
                if ($cambio->tipo == 1) {
                    $existerestricc = Doctrine::getTable('DatRestricciones')
                        ->findByDql(
                            "idtipodoc = '$idtipodoc' AND idestado = '$idestado' 
                                AND idusuario = '$idusuario'"
                        );
                    if (isset($existerestricc[0]->idestado)
                        && $existerestricc[0]->idestado != ''
                    ) {
                        if ($inicial != 0 || $estadofinal != 0) {
                            $existerestricc[0]->estadoinicial = $inicial;
                            $existerestricc[0]->estadofinal = $final;
                            $existerestricc[0]->save();
                        } else {
                            $existerestricc[0]->delete();
                        }
                    } else {
                        $restriccion = new DatRestricciones();
                        $restriccion->idusuario = $idusuario;
                        $restriccion->idestado = $idestado;
                        $restriccion->idtipodoc = $idtipodoc;
                        $restriccion->estadoinicial = $inicial;
                        $restriccion->estadofinal = $final;
                        $restriccion->save();
                    }
                } else {
                    $existerestricc = Doctrine::getTable(
                        'DatRestriccionesestructura'
                    )->findByDql(
                        "idtipodoc = '$idtipodoc' AND idestado = '$idestado' 
                            AND idestructura = '$idusuario'"
                    );
                    if (isset($existerestricc[0]->idestado)
                        && $existerestricc[0]->idestado != ''
                    ) {
                        if ($inicial != 0 || $estadofinal != 0) {
                            $existerestricc[0]->estadoinicial = $inicial;
                            $existerestricc[0]->estadofinal = $final;
                            $existerestricc[0]->save();
                        } else {
                            $existerestricc[0]->delete();
                        }
                    } else {
                        $restriccion = new DatRestriccionesestructura();
                        $restriccion->idestructura = $idusuario;
                        $restriccion->idestado = $idestado;
                        $restriccion->idtipodoc = $idtipodoc;
                        $restriccion->estadoinicial = $inicial;
                        $restriccion->estadofinal = $final;
                        $restriccion->save();
                    }
                }
            }
            $espuesta = 1;
        } else {
            $espuesta = 0;
        }
        return $espuesta;
    }


}

