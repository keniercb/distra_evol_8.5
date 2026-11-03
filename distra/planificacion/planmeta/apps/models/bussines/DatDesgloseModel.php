<?php

class DatDesgloseModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatDesglose $DatDesglose) {
        $DatDesglose->save();
    }

    public function Actualizar(DatDesglose $DatDesglose) {
        $DatDesglose->save();
    }

    public function Eliminar($DatDesglose) {
        $DatDesglose->delete();
    }

    public function adicionarConfigDesglose($parametros) {
        $iddesglose = $parametros['iddesglose'];
        if ($parametros['iddesglose'] == null) {
            $nuevaConfigDesglose = new DatDesglose();
            $nuevaConfigDesglose->denominacion = $parametros['denominacion'];
            $nuevaConfigDesglose->descripcion = $parametros['descripcion'];
            $nuevaConfigDesglose->save();
            $iddesglose = $nuevaConfigDesglose->iddesglose;
        } else {
            DatDesglosetiponomencladorModel::eliminarDesgloseNom($iddesglose);
        }
        DatDesglosetiponomencladorModel::adicionarDesgloseTipoNom(
                $iddesglose, $parametros ['tiponomencladores_orden']
        );
        return true;
    }

    public function adicionarConfigDesgloseAutomatico($parametros) {
        $nuevaConfigDesglose = new DatDesglose();
        $nuevaConfigDesglose->denominacion = $parametros['denominacion'];
        $nuevaConfigDesglose->save();
        $iddesglose = $nuevaConfigDesglose->iddesglose;
        DatDesglosetiponomencladorModel::adicionarDesgloseTipoNomAutomatico(
                $iddesglose, $parametros ['tiponomencladores']
        );
        return $iddesglose;
    }

    public function eliminarConfigDesglose($confDesgloses) {
        $arrayIds = array();
        foreach ($confDesgloses as $valor) {
            $arrayIds[] = $valor->iddesglose;
        }
        /*         * ************************** */
        if ($arrayIds[0] != null) {
            Doctrine_Query::create()->delete('DatDesglose')
                    ->from('DatDesglose')
                    ->whereIn('iddesglose', $arrayIds)
                    ->execute();
        }
        return true;
    }

    public function cambiarDesgloseActual($parametros) {
        $actual = Doctrine::getTable('DatDesglose')->findByDql("actual=1");

        if ($actual[0]->iddesglose == null) {
            $objejercicio = Doctrine::getTable('DatDesglose')->find(
                    $parametros->iddesglose
            );
            $objejercicio->actual = 1;
            DatDesglose::cambiarActual();
            $objejercicio->save();
            return 1;
        } else {
            if ($parametros->confirmar) {
                $objejercicio = Doctrine::getTable('Datdesglose')->find(
                        $parametros->iddesglose
                );
                $objejercicio->actual = 1;
                DatDesglose::cambiarActual();
                $objejercicio->save();
                return 1;
            } else {
                return 3;
            }
        }
    }

    public function obtenerDatosDesglose($idmodelo) {
        $datoscolumnas = Array();
        if ($idmodelo != null) {
            $asociado = DatDesglose::getAsociado($idmodelo);

            $nomColumnas = DatDesglose::datosXIdDesglose($asociado[0]);

            // $result = Array();
            foreach ($nomColumnas as $key => $value) {
                $datoscolumnas[$key]['idtiponomenclador'] = $value['idtiponomenclador'];
                $datoscolumnas[$key]['uritiponomenclador'] = $value['uritiponomenclador'];
                $datoscolumnas[$key]['denominacion'] = $value['denominacion'];
                $datoscolumnas[$key]['iddesglosetiponomenclador'] = $value['iddesglosetiponomenclador'];
                $datoscolumnas[$key]['datoscolumnas'] = DatDesglose::datosXIdTiponomenclador(
                                $value['idtiponomenclador'],$value['uritiponomenclador']
                );
            }
        }

        return $datoscolumnas;
    }

    public function desglosar($parametros) {
        $modeloActEnt = new DatActividadentidad();
        $actividadentidad = DatActividadentidad::BuscarIdactividadEntidades1(
                        $parametros['identidad'], $parametros['idactividad'], $parametros['idejercicio']
        );
        $parametros['idactividadentidad'] = $actividadentidad[0]['idactividadentidad'];
        DatDesgloseentidadnivel::eliminarDesgloseTodos($parametros);
        //insertando en dat_desgloseentidadnivel
        foreach ($parametros['desglose'] as $valueDos) {
            if ($valueDos->nivelactividad != 0) {
                $objDesgloseentidadnivel = new DatDesgloseentidadnivel();
                $objDesgloseentidadnivel->idactividadentidad = $parametros['idactividadentidad'];
                $objDesgloseentidadnivel->idejercicio = $parametros['idejercicio'];
                $objDesgloseentidadnivel->nivelactivdesglosado = $valueDos->nivelactividad;
                $objDesgloseentidadnivel->save();
                $iddesgloseentidadnivel = $objDesgloseentidadnivel->iddesgloseentidadnivel;

                foreach ($parametros['columnas'] as $valueUno) {
                    $objDesglosedatosnomenclador = new DatDesglosedatosnomenclador( );
                    $denom = $valueUno->denom;
                    $objDesglosedatosnomenclador->iddatosnomenclador = $valueDos->$denom;
                    $objDesglosedatosnomenclador->iddesgloseentidadnivel = $iddesgloseentidadnivel;
                    $objDesglosedatosnomenclador->iddesglosetiponomenclador = $valueUno->id;
                    $objDesglosedatosnomenclador->save();
                }
            }
        }

        return 20;
    }

    public function listarDesgloseNivelesActividad($parametros) {
    
        $modeloActEnt = new DatActividadentidad();
        $actividadentidad = DatActividadentidad::BuscarIdactividadEntidades1(
                        $parametros['identidad'], $parametros['idactividad'], $parametros['idejercicio']
        );    //print_r($actividadentidad);die;
        $parametros['idactividadentidad'] = $actividadentidad[0]['idactividadentidad'];
        $arrayfilas->data = array();

        if ($actividadentidad[0]['idactividadentidad'] != null) {
            $parametros['where'] = "";
            if (is_array($parametros['filtros'])) {
                foreach ($parametros['filtros'] as $datos) {
                    if ($datos['field'] == 'nivelactividad') {
                        if ($datos['data']['comparison'] == 'lt') {
                            $sqlSigno = "<";
                            $parametros['where'] = " and ROUND(dn.nivelactivdesglosado,4) < {$datos['data']['value']}";
                        } else {
                            if ($datos['data']['comparison'] == 'gt') {
                                $sqlSigno = ">";
                                $parametros['where'] = " and ROUND(dn.nivelactivdesglosado,4) > {$datos['data']['value']}";
                            } else {
                                $sqlSigno = "=";
                                $parametros['where'] = " and ROUND(dn.nivelactivdesglosado,4) = {$datos['data']['value']}";
                            }
                        }
                    }
                }
            }
            
            $datos = DatDesgloseentidadnivel::listarDesgloseNivelesActividad(
                            $parametros
            );
            $cont = 0;
            $arrayfilas->data = array();
            if (count($datos) > 0) {

                foreach ($datos as $y => $valueDos) {
                    if ($y < count($datos)) {
                        if ($valueDos['iddesgloseentidadnivel'] == $datos[$y + 1]['iddesgloseentidadnivel']
                        ) {
                            $arrayfilas->data[$cont][$valueDos['uritiponomenclador']] = $valueDos['iddatosnomenclador'];
                        } else {
                            $arrayfilas->data[$cont]['nivelactividad'] = $valueDos['nivelactivdesglosado'];
                            $arrayfilas->data[$cont]['iddesgloseentidadnivel'] = $valueDos['iddesgloseentidadnivel'];
                            $arrayfilas->data[$cont++][$valueDos['uritiponomenclador']] = $valueDos['iddatosnomenclador'];
                        }
                    }
                }
            } else {
                $arrayfilas->data = array();
            }
        }
        $total = DatDesgloseentidadnivel::totalDesgloseNivelesActividad(
                        $parametros
        );
        $arrayfilas->total = $total[0];
        return $arrayfilas;
    }

    public function eliminarDesglose($parametros) {
        $modeloActEnt = new DatActividadentidad();
        $actividadentidad = DatActividadentidad::BuscarIdactividadEntidades1(
                        $parametros['identidad'], $parametros['idactividad'], $parametros['idejercicio']
        );
        $parametros['idactividadentidad'] = $actividadentidad[0]['idactividadentidad'];
        $result = DatDesgloseentidadnivel::eliminarDesgloseVarios($parametros);
        return $result;
    }

    public function tieneActdesglosada($identidad, $valor, $idejercicio) {
        $result = DatDesgloseentidadnivel::tieneActdesglosada(
                        $identidad, $valor, $idejercicio
        );
        return $result;
    }

}

//fin clase
