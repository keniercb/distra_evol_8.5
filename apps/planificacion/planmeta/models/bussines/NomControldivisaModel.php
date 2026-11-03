<?php

class NomControldivisaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function insertarnom_controldivisa($nomControldivisa, $denominacion, $codigo, $descripcion
    ) {
        if ($denominacion) {
            $nomControldivisa->denominacion = $denominacion;
        }
        if ($codigo) {
            $nomControldivisa->codigo = $codigo;
        }
        if ($descripcion) {
            $nomControldivisa->descripcion = $descripcion;
        }
        $nomControldivisa->color = 0000;

        try {
            $nomControldivisa->save();
            return $nomControldivisa->idcontroldivisa;
        } catch (Exception $e) {
            return 'error';
        }
    }

    public function modificarnom_controldivisa($nomControldivisa) {
        $nomControldivisa->save();
    }

    public function eliminarnom_controldivisa($nomControldivisa) {
        $nomControldivisa->delete();
    }

    public function actualizarplanes($idEstructura, $idejercicio, $via, $pla, $naturalez) {
        $identidad = Doctrine::getTable('DatEntidaddatosnomenclador')
                ->findByDql(
                "iddatosnomenclador = 1 and identidad=$idEstructura"
        );



        $idEstructura = $identidad[0]->identidaddatosnomenclador;

        $data = DatEntidadmodelo::actualizarplanes(
                        $idEstructura, $idejercicio, $via, $pla, $naturalez
        );

        foreach ($data as $key => $val) {
            $plan[$key]['plan'] = $val['plan'];
            $plan[$key]['idplan'] = $val['identidadmodelo'];
            $naturaleza[$key]['naturaleza'] = $val['naturaleza'];
            $naturaleza[$key]['idnaturaleza'] = $val['idnaturaleza'];
            $controldivisa[$key]['controldivisa'] = $val['controldivisa'];
            $controldivisa[$key]['idcontroldivisa'] = $val['idcontroldivisa'];
            $controldivisa[$key]['codigo'] = $val['codigo'];
            $indicador[$key]['indicador'] = $val['indicador'];
            $indicador[$key]['idindicador'] = $val['idindicador'];
        }
        $indicador = self::array_unique_callback(
                        $indicador, function ($company) {
                    return $company['idindicador'];
                });
        $data = null;
        $plan = self::array_unique_callback(
                        $plan, function ($company) {
                    return $company['idplan'];
                });
        $valor = 0;
        foreach ($plan as $data) {
            $plann[$valor++] = $data;
        }

        $naturaleza = self::array_unique_callback(
                        $naturaleza, function ($company) {
                    return $company['idnaturaleza'];
                });
        $valor = 0;
        foreach ($naturaleza as $data) {
            $naturalezaa[$valor++] = $data;
        }
        $controldivisa = self::array_unique_callback(
                        $controldivisa, function ($company) {
                    return $company['idcontroldivisa'];
                });
        $valor = 0;
        foreach ($controldivisa as $data) {
            $controldivisaa[$valor++] = $data;
        }
        return array('controldivisa' => $controldivisaa, 'naturaleza' => $naturalezaa, 'plan' => $plann, 'indicador' => $indicador);
    }

    public function array_unique_callback(array $arr, callable $callback, $strict = false) {
        return array_filter(
                $arr, function ($item) use ($strict, $callback) {
            static $haystack = array();
            $needle = $callback($item);
            if (in_array($needle, $haystack, $strict)) {
                return false;
            } else {
                $haystack[] = $needle;
                return true;
            }
        }
        );
    }

    public function listarindicadoresCD($parametros, $start, $limit, $rector) {
        $data = NomControldivisa::listarindicadoresCD(
                        $parametros, $limit, $rector, $start
        );
        $importeplaniftotal = 0;
        foreach ($data->data as $pos => $k) {
            if ($parametros['desglose'] == 1) {
                $parametros['idcontroldivisa'] = $k['idcontroldivisa'];
                $importeplanif = DatDocumentoaprobacion::getImporteByIdIndCD($parametros);
                $importeplaniftotal += $importeplanif[0]['importe'];
                $data->data[$pos]['importe'] = $importeplanif[0]['importe'];
            }

            $data->data[$pos]['denominacion'] = $k['codigo'] . ' ' . $k['denominacion'];
        }
        $data->importetotal = $importeplaniftotal;

        return $data;
    }

    public function listarAsociacion($idindicador, $start, $limit) {
        $data = NomControldivisa::listarAsociacion(
                        $idindicador, $start, $limit
        );
        return $data;
    }

    public function eliminarIndCD($arrayToDelete) {
        foreach ($arrayToDelete as $value) {
            $eliminado = Doctrine::getTable('NomControldivisa')->find($value);
            $eliminado->delete();
        }
        return 1;
    }

    public function modificarEstado($idcontroldivisa, $estado) {
        $objNomControldivisa = Doctrine::getTable('NomControldivisa')->find(
                $idcontroldivisa
        );
        $objNomControldivisa->estado = $estado;
        $objNomControldivisa->save();
        return 1;
    }

    public function cargarDatos($idcontroldivisa) {
        $result = array();
        $objNomControldivisa = Doctrine::getTable('NomControldivisa')->find(
                $idcontroldivisa
        );
        $result['denominacion'] = $objNomControldivisa->denominacion;
        $result['descripcion'] = $objNomControldivisa->descripcion;
        $result['codigo'] = $objNomControldivisa->codigo;
        return $result;
    }

}
