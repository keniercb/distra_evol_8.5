<?php

class AnalisisplanificacionsisplanproduccionesModel extends AnalisisplanificacionModel
{
    /*     * ****Actividad - Niveles de actividad******************* */

    public function actNivelesActividad($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        } else
            array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($entidades[0] == null) {
            return 0;
        }
        $ent = implode(',', $entidades);

        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }

        if ($params['contar'] == 'true') {

            $tot = $analisisPlanif->diferenciaNormaSalidaTotal($ent, $params['idejercicio'], $params);
            return $tot[0];
        } else {
            //obteniendo los datos del primer gráfico
            $dat = $analisisPlanif->diferenciaNormaSalida($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            foreach ($dat as $key => $value) {
                $categorias[$key] = $value['actividad'];
                $importeNorma[$key] = (double)$value['importenorma'];
                $importeSalida[$key] = (double)$value['importesalida'];
                $importeDiferencia[$key] = (double)$value['diferencia'];
            }

            $dataNorma = Array(
                "name" => 'Norma',
                "type" => 'column',
                "color" => '#33FF12',
                "data" => $importeNorma
            );
            $dataSalida = Array(
                "name" => 'Salida',
                "type" => 'column',
                "color" => '#47AFF5',
                "data" => $importeSalida
            );
            $dataDiferencia = Array(
                "name" => 'Diferencia',
                "type" => 'spline',
                "color" => '#FF0000',
                "data" => $importeDiferencia
            );

            $series = Array($dataNorma, $dataSalida, $dataDiferencia);

            $result = Array($series, $categorias);

            return array('data' => $result[0], 'categorias' => $result[1]);
        }
    }

    //Niveles de actividad
    public function nivelesActividad($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        } else
            array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($entidades[0] == null) {
            return 0;
        }
        $ent = implode(',', $entidades);
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $tot = $analisisPlanif->nivelesMasAltosTotal($ent, $params['idejercicio'], $params);
            return $tot[0];
        } else {
            //obteniendo los datos del primer gráfico
            $dat = $analisisPlanif->nivelesMasAltos($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            foreach ($dat as $key => $value) {
                $categorias[$key] = $value['actividad'];
                $importeAuto[$key] = (double)$value['nivelauto'];
                $importeManual[$key] = (double)$value['nivelmanual'];
                $importeAjuste[$key] = (double)$value['ajuste'];
                $importeCarta[$key] = (double)$value['nivelcarta'];
                $importeTotal[$key] = (double)$value['total'];
            }
            $dataAuto = Array(
                "name" => 'Automático',
                "type" => 'column',
                "color" => '#33FF12',
                "data" => $importeAuto
            );
            $dataManual = Array(
                "name" => 'Manual',
                "type" => 'column',
                "color" => '#47AFF5',
                "data" => $importeManual
            );
            $dataCarta = Array(
                "name" => 'Carta',
                "type" => 'column',
                "color" => '#7eb1b8',
                "data" => $importeCarta
            );
            $dataAjuste = Array(
                "name" => 'Ajuste',
                "type" => 'column',
                "color" => '#c588fc',
                "data" => $importeAjuste
            );
            $datat = Array(
                "type" => 'spline',
                "name" => 'Total',
                "color" => '#FF0000',
                "data" => $importeTotal
            );
            $series = Array($dataAuto, $dataManual, $dataCarta, $dataAjuste, $datat);
            $result = Array($series, $categorias);

            //obteniendo los datos del segundo gráfico
            $datV = $analisisPlanif->nivelesMasValiosos($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            foreach ($datV as $key => $value) {
                $categoriasV[$key] = $value['actividad'];
                $importeAutoV[$key] = (double)$value['importenivelauto'];
                $importeManualV[$key] = (double)$value['importenivelmanual'];
                $importeCartaV[$key] = (double)$value['importenivelcarta'];
                $importeAjusteV[$key] = (double)$value['importeajuste'];
                $importeTotalV[$key] = (double)$value['total'];
            }
            $dataAutoV = Array(
                "name" => 'Automático',
                "type" => 'column',
                "color" => '#33FF12',
                "data" => $importeAutoV
            );
            $dataManualV = Array(
                "name" => 'Manual',
                "type" => 'column',
                "color" => '#47AFF5',
                "data" => $importeManualV
            );
            $dataCartaV = Array(
                "name" => 'Carta',
                "type" => 'column',
                "color" => '#7eb1b8',
                "data" => $importeCartaV
            );
            $dataAjusteV = Array(
                "name" => 'Ajuste',
                "type" => 'column',
                "color" => '#c588fc',
                "data" => $importeAjusteV
            );
            $datatV = Array(
                "type" => 'spline',
                "name" => 'Total',
                "color" => '#FF0000',
                "data" => $importeTotalV
            );
            $seriesV = Array($dataAutoV, $dataManualV, $dataCartaV, $dataAjusteV, $datatV);
            $resultV = Array($seriesV, $categoriasV);
            return array('data' => $result[0], 'categorias' => $result[1], 'dataV' => $resultV[0], 'categoriasV' => $resultV[1]);
        }
    }

    public function listarVariables($params)
    {
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        } else
            array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $parametros->identidad = $var;
        $parametros->analisis = 1;
        $dat = DatVariablecontrol::cargarVariables($parametros);
        return array('data' => $dat);
    }

    public function graficarOcupacionCapacidadPorVariable($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        } else
            array_push($entidades, $params['identidad']);
        $ent = implode(',', $entidades);
        //print_r($params);die;
        //obteniendo los datos del primer gráfico
        $dat = $analisisPlanif->nivelesOcupacionInfraestructura($ent, $params['idejercicio'], '1/1/2017', '31/12/2017', $params['idvariable']);
        $totalOcupado = 0;
        foreach ($dat as $value) {
            $data[] = array(
                "name" => $value['denominacion'],
                "y" => (double)$value['ocupacion']
            );
            $totalOcupado += $value['ocupacion'];
        }
        $temp = $dat[0]['capacidad'] - $totalOcupado;
        $data[] = array(
            "name" => 'Disponibe',
            "y" => (double)$temp
        );
        return array('data' => $data);
    }

    public function graficarProduccionMensualPorProducto($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        } else
            array_push($entidades, $params['identidad']);
        $ent = implode(',', $entidades);
        //obteniendo los datos del primer gráfico
        $datos = $analisisPlanif->graficarProduccionMensualPorProducto($ent, $params['idejercicio']);
        $categorias[0] = 'Enero';
        $categorias[1] = 'Febrero';
        $categorias[2] = 'Marzo';
        $categorias[3] = 'Abril';
        $categorias[4] = 'Mayo';
        $categorias[5] = 'Junio';
        $categorias[6] = 'Julio';
        $categorias[7] = 'Agosto';
        $categorias[8] = 'Septiembre';
        $categorias[9] = 'Octubre';
        $categorias[10] = 'Noviembre';
        $categorias[11] = 'Diciembre';

        foreach ($datos as $key => $value) {
            $dataProducto[$key] = Array(
                "name" => $value['denominacion'] . ' (' . $value['abreviaturaunidadmedida'] . ')',
                "type" => 'column',
                //valor por mes
                "data" => Array(
                    (double)$value['produccionenero'],
                    (double)$value['produccionfebrero'],
                    (double)$value['produccionmarzo'],
                    (double)$value['produccionabril'],
                    (double)$value['produccionmayo'],
                    (double)$value['produccionjunio'],
                    (double)$value['produccionjulio'],
                    (double)$value['produccionagosto'],
                    (double)$value['produccionseptiembre'],
                    (double)$value['produccionoctubre'],
                    (double)$value['produccionnoviembre'],
                    (double)$value['producciondiciembre'],
                )
            );
        }

        $result = Array($dataProducto, $categorias);
        return array('data' => $result[0], 'categorias' => $result[1]);
    }

    public function graficarProduccionPorEtapas($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $columnas = self::auxlistarEtapasProducciones($params);
        $nuevas_columnas = "";
        foreach ($columnas as $columna) {
            if ($nuevas_columnas == "") {
                $nuevas_columnas = ',' . 'col' . $columna['iddatosnomenclador'] . ' TEXT';
            } else {
                $nuevas_columnas = $nuevas_columnas . ',' . 'col' . $columna['iddatosnomenclador'] . ' TEXT';
            }
        }
        $params['idcolumnas'] = $nuevas_columnas;
        $datos = $analisisPlanif->graficarProduccionPorEtapas($params);
        return $datos;
    }

    public function listarEtapasProducciones($params)
    {

        $columnas = self::auxlistarEtapasProducciones($params);

        $nuevas_columnas = array();
        foreach ($columnas as $columna) {
            array_push($nuevas_columnas, array('iddatosnomenclador' => 'col' . $columna['iddatosnomenclador'], 'denominacion' => $columna['denominacion']));
        }

        return $nuevas_columnas;
    }

    public function auxlistarEtapasProducciones($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        if (empty($params['idejercicio'])) {
            $ejercicio = $this->pIntegrator->planmeta->obtenerEjercicioActual();
            $params['idejercicio'] = $ejercicio['idejercicio'];
            $params['denomejercicio'] = $ejercicio['ejercicio'];
        }
        $datos = $analisisPlanif->listarEtapasProducciones($params);
        return $datos;
    }

    public function listarProduccionesRecursosPorMes($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $nomencladorMes = $analisisPlanif->nomencladorMES();
        $result = array();
        if (isset($nomencladorMes[0])) {
            $columnas = '';
            $denMes = array();
            foreach ($nomencladorMes as $key => $value) {
                $columnas .= ', col_' . $value['iddatosnomenclador'] . ' NUMERIC';
                array_push($denMes, $value['denominacion']);
            }
            $params['columnas'] = $columnas;
            if ($params['tipo'] == 3) {
                $datos = $analisisPlanif->listarProduccionesPorMes($params);
            } elseif ($params['tipo'] == 2) {
                $datos = $analisisPlanif->listarProduccionesPorMes($params);
//                var_dump($datos); die;
//                return $datos;
            }
            if (isset($datos[0])) {
                foreach ($datos as $produccion => $value) {
                    $arrayKeys = array_keys($value);
                    foreach ($arrayKeys as $key) {
                        if ($key != 'codigo' && $key != 'denominacion' && $key != 'idumedida') {
                            $datos[$produccion][$key] = ($value[$key] == null) ? 0 : number_format($value[$key], 2);
                        }
                    }
                }
                $result['datos'] = $datos;
                $result['meses'] = $nomencladorMes;
                //$result['meses'] = $denMes;
            }
            return $result['datos'];
        } else {
            $cod = 2; //No existe el momenclador de meses o no tiene valores
        }

    }

    public function listarNomencladorMes($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $nomencladorMes = $analisisPlanif->nomencladorMES();
        if (isset($nomencladorMes[0])) {
            foreach ($nomencladorMes as $columna) {
                array_push($den_meses, $columna['denominacion']);
            }
            return $den_meses;
        } else {
            $cod = 2; //No existe el momenclador de meses o no tiene valores
        }

    }

    public function listarcampoXcultivo($params)
    {

        $campoXcultivo = new Analisisplanificacionsisplanproducciones();
        $mes = $campoXcultivo->nomencladorMES($params);
        $capTotal = $campoXcultivo->capacidadcampoVC($params);
        $den_meses = array();
        $total_meses = array();
        $nuevas_columnas = "";
        foreach ($mes as $columna) {
            if ($nuevas_columnas == "") {
                $nuevas_columnas = ',' . 'col' . $columna['iddatosnomenclador'] . ' NUMERIC';
            } else {
                $nuevas_columnas = $nuevas_columnas . ',' . 'col' . $columna['iddatosnomenclador'] . ' NUMERIC';
            }
            array_push($den_meses, $columna['denominacion']);
            array_push($total_meses, floatval($capTotal['valor']));
        }

        $params['idmeses'] = $nuevas_columnas;
        $data = $campoXcultivo->campoXcultivo($params);
        $resultado = array();

        foreach ($data as $d => $value) {
            $tmp = array();
            $valorMeses = array();
            $tmp = $value;
            $totalMes = -1 * (count($mes));
            $resultado['data'][$d]['name'] = $value['denominacion'];
            $resultado['data'][$d]['type'] = "column";
            array_splice($tmp, 0, $totalMes);
            foreach ($tmp as $t => $valorM) {
                $r = 0;
                if ($valorM != null) {
                    $r = floatval($valorM);
                }
                array_push($valorMeses, $r);
            }

            if (count($valorMeses) == 0) {
                $valorMeses = array();
            }

            $resultado['data'][$d]['data'] = $valorMeses;
        }

        if (!$resultado['data']) {
            $resultado['data'] = array();
        }

        $resultado['meses'] = $den_meses;
        $resultado['capacidad'] = $total_meses;
        $resultado['variable'] = $capTotal['denominacion'];

        return $resultado;
    }

    public function listarMeses()
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $data = $analisisPlanif->nomencladorMES();
        return $data;
    }

    public function listarRecursosProduccionesPorMes($params)
    {
        $analisisPlanif = new Analisisplanificacionsisplanproducciones();
        $nomencladorMes = $analisisPlanif->nomencladorMES();
        $result = array();
        if (isset($nomencladorMes[0])) {
            $columnas = '';
            $denMes = array();
            foreach ($nomencladorMes as $key => $value) {
                $columnas .= ', col_' . $value['iddatosnomenclador'] . ' NUMERIC';
                array_push($denMes, $value['denominacion']);
            }
            $params['columnas'] = $columnas;
            if ($params['tipo'] == 3) {
                $datos = $analisisPlanif->listarProduccionesPorMes($params);
            } elseif ($params['tipo'] == 2) {
                $datos = $analisisPlanif->listarRecursosPorMes($params);
            }
            if (isset($datos[0])) {
                foreach ($datos as $produccion => $value) {
                    $arrayKeys = array_keys($value);
                    foreach ($arrayKeys as $key) {
                        if ($key != 'codigo' && $key != 'denominacion' && $key != 'idumedida') {
                            $datos[$produccion][$key] = ($value[$key] == null) ? '0.00' : number_format($value[$key], 2);
                        }
                    }
                }
            }
            return $datos;
        } else {
            $cod = 2; //No existe el momenclador de meses o no tiene valores
        }
    }

}
