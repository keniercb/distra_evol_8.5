<?php

class AnalisisplanificacionModel extends ZendExt_Model {

    //Actividad - Niveles de actividad
    public function actNivelesActividad($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
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
                $importeNorma[$key] = (double) $value['importenorma'];
                $importeSalida[$key] = (double) $value['importesalida'];
                $importeDiferencia[$key] = (double) $value['diferencia'];
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
    public function nivelesActividad($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
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
                $importeAuto[$key] = (double) $value['nivelauto'];
                $importeManual[$key] = (double) $value['nivelmanual'];
                $importeAjuste[$key] = (double) $value['ajuste'];
                $importeTotal[$key] = (double) $value['total'];
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
            $series = Array($dataAuto, $dataManual, $dataAjuste, $datat);
            $result = Array($series, $categorias);

            //obteniendo los datos del segundo gráfico
            $datV = $analisisPlanif->nivelesMasValiosos($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            foreach ($datV as $key => $value) {
                $categoriasV[$key] = $value['actividad'];
                $importeAutoV[$key] = (double) $value['importenivelauto'];
                $importeManualV[$key] = (double) $value['importenivelmanual'];
                $importeAjusteV[$key] = (double) $value['importeajuste'];
                $importeTotalV[$key] = (double) $value['total'];
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
            $seriesV = Array($dataAutoV, $dataManualV, $dataAjusteV, $datatV);
            $resultV = Array($seriesV, $categoriasV);
            return array('data' => $result[0], 'categorias' => $result[1], 'dataV' => $resultV[0], 'categoriasV' => $resultV[1]);
        }
    }

    //Datos para graficar Calculo. Relación ingreso-gastos
    public function CalculoRIngreso($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($entidades[0] == null) {
            return 0;
        }
        $ent = implode(',', $entidades);
        $data = $analisisPlanif->calculoRIngreso($ent, $params['idejercicio'], $params);
        $ingresos = $data->ingresos;
        $gastos = $data->gastos;
        $gastos_peso = $data->gastos_peso;
        $ind_productividad = $data->indice;
        $valor_agregado_bruto = $ingresos - $gastos;
        $capacidad = $data->capacidad;
        $fondo_salario = $valor_agregado_bruto * 0.6;
        $salario_per_capita = $capacidad;
        $aportes = $data->aporte;
        $dat = Array(
            array(
                "name" => 'Ingresos',
                "color" => '#33FF12',
                "data" => Array((double) $ingresos)
            ),
            array(
                "name" => 'Gastos',
                "color" => '#47AFF5',
                "data" => Array((double) $gastos)
            ),
            array(
                "name" => 'Gasto por peso',
                "data" => Array((double) $gastos_peso)
            ),
            array(
                "name" => 'Índ. Prod. Anual',
                "data" => Array((double) $ind_productividad)
            ),
            array(
                "name" => 'Valor agregado bruto',
                "color" => '#FF0000',
                "data" => Array((double) $valor_agregado_bruto)
            ),
            array(
                "name" => 'Fondo de salario',
                "color" => '#c588fc',
                "data" => Array((double) $fondo_salario)
            ),
            array(
                "name" => 'Salario per cápita',
                "color" => '#fff720',
                "data" => Array((double) $salario_per_capita)
            ),
            array(
                "name" => 'Aportes',
                "data" => Array((double) $aportes)
            )
        );
        $categorias = Array('Análisis económico');
        return array('data' => $dat, 'categorias' => $categorias);
    }

    //Datos para graficar Calculo. Relación ingreso-gastos. XETID [Encadenamiento]
    public function CalculoEncadenamiento($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($entidades[0] == null) {
            return 0;
        }
        $ent = implode(',', $entidades);
        $data = $analisisPlanif->calculoEncadenamiento($ent, $params['idejercicio'], $params);
        $ingresos = $data->ingresos;
        $gastos = $data->gastos;
        $gastos_peso = $data->gastos_peso;
        $ind_productividad = $data->indice;
        $valor_agregado_bruto = $ingresos - $gastos;
        $capacidad = $data->capacidad;
        $fondo_salario = $valor_agregado_bruto * 0.6;
        $salario_per_capita = $capacidad;
        $aportes = $data->aportes;
        $dat = Array(
            array(
                "name" => 'Ingresos',
                "color" => '#33FF12',
                "data" => Array((double) $ingresos)
            ),
            array(
                "name" => 'Gastos',
                "color" => '#47AFF5',
                "data" => Array((double) $gastos)
            ),
            array(
                "name" => 'Gasto por peso',
                "data" => Array((double) $gastos_peso)
            ),
            array(
                "name" => 'Índ. Prod. Anual',
                "data" => Array((double) $ind_productividad)
            ),
            array(
                "name" => 'Valor agregado bruto',
                "color" => '#FF0000',
                "data" => Array((double) $valor_agregado_bruto)
            ),
            array(
                "name" => 'Fondo de salario',
                "color" => '#c588fc',
                "data" => Array((double) $fondo_salario)
            ),
            array(
                "name" => 'Salario per cápita',
                "color" => '#fff720',
                "data" => Array((double) $salario_per_capita)
            ),
            array(
                "name" => 'Aportes',
                "data" => Array((double) $aportes)
            )
        );
        $categorias = Array('Análisis económico');
        return array('data' => $dat, 'categorias' => $categorias);
    }

    //Datos para graficar Calculo. Planes por entidad
    public function graficarCalculoPlanesPorEntidad($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        $data = $analisisPlanif->calculoPlanesPorEntidad($params);
        $dataR = Array();
        foreach ($data as $value) {
            $dataR[] = array(
                "name" => $value['denomplan'],
                "data" => array((double) $value['importe'])
            );
        }
        $categorias = Array('Planes');
        return array('data' => $dataR, 'categorias' => $categorias);
    }

    //Plan - Normalizados y directos
    public function PlanNormalizadosDirectos($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($entidades[0] == null) {
            return 0;
        }
        $ent = implode(',', $entidades);
        $params['uri'] = 1;
        $data = $analisisPlanif->vieneBaseplan($ent, $params['idejercicio'], $params);

        //obteniendo los datos del primer gráfico
        $datos = array();
        $datos[] = array(
            'y' => (double) $data[0]['baseplan'],
            'color' => '#33FF12',
        );
        $datos[] = array(
            'y' => (double) $data[0]['directoplan'],
            'color' => '#47AFF5'
        );

        $params['uri'] = 0;
        $datab = $analisisPlanif->vieneBaseplan($ent, $params['idejercicio'], $params);

        //obteniendo los datos del segundo gráfico
        $datosb = array();
        $datosb[] = array(
            'y' => (double) $datab[0]['baseplan'],
            'color' => '#33FF12',
        );
        $datosb[] = array(
            'y' => (double) $datab[0]['directoplan'],
            'color' => '#47AFF5'
        );
        return array('pastel' => $datos, 'pastelG' => $datosb);
    }

    //Plan - Balance financiero
    public function PlanBalanceFinanciero($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($entidades[0] == null) {
            return 0;
        }
        $ent = implode(',', $entidades);
        $data = $analisisPlanif->balanceFinanciero($ent, $params['idejercicio'], $params);

        //obteniendo los datos del primer gráfico
        $datos[] = Array(
            "color" => '#33FF12',
            "y" => (double) $data[0]['importe']
        );
        $datos[] = Array(
            "color" => '#47AFF5',
            "y" => (double) $data[0]['importeajuste']
        );
        $datos[] = Array(
            "color" => '#c588fc',
            "y" => (double) $data[0]['importecontingencia']
        );
        $datos[] = Array(
            "color" => '#fff720',
            "y" => (double) $data[0]['importeflete']
        );
        $datos[] = Array(
            "color" => '#FF0000',
            "y" => (double) $data[0]['total']
        );

        //obteniendo los datos del segundo gráfico
        $dataU = $analisisPlanif->utilidad($ent, $params['idejercicio'], $params);
        $datosU[] = Array(
            "color" => '#33FF12',
            "y" => (double) $dataU[0]['ingreso']
        );
        $datosU[] = Array(
            "color" => '#47AFF5',
            "y" => (double) $dataU[0]['gastos']
        );
        $datosU[] = Array(
            "color" => '#FF0000',
            "y" => (double) $dataU[0]['utilidad']
        );
        return array('barra' => $datos, 'utilidades' => $datosU);
    }

    //Plan - Mas demandados
    public function PlanMasdemandados($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($entidades[0] == null) {
            return 0;
        }
        $ent = implode(',', $entidades);
        if ($params['contar'] == 'true') {
            $tot = $analisisPlanif->masValiososxViaTotal($ent, $params['idejercicio'], $params);
            return $tot[0];
        } else {
            if ($params['orden'] == 1) {
                $params['orden'] = "DESC";
            } else {
                $params['orden'] = "ASC";
            }
            $data = $analisisPlanif->masValiososxVia($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            $colors = array('#33FF12', '#47AFF5', '#c588fc', '#fff720', '#F7B9FF', '#7eb1b8', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

            //obteniendo los datos del primer gráfico
            foreach ($data as $key => $valor) {
                $arrtem = array();
                $arrtem[] = (double) $valor['sustitucionimportaciones'];
                $arrtem[] = (double) $valor['oace'];
                $arrtem[] = (double) $valor['importaciondirecta'];
                $arr[$key]['name'] = $valor['indicador'];
                $arr[$key]['data'] = $arrtem;
                $arr[$key]['color'] = $colors[$key];
            }
            if ($arr[0])
                foreach ($arr as $key => $valor) {
                    $result [] = Array(
                        "name" => $valor['name'],
                        "data" => $valor['data'],
                        "color" => $valor['color']
                    );
                } else {
                $result = array();
            }
            return $result;
        }
    }

    //Plan - Mas valiosos
    public function PlanMasvaliosos($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
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
            $tot = $analisisPlanif->masValiososTotal($ent, $params['idejercicio'], $params);
            return $tot[0];
        } else {
            $data = $analisisPlanif->masValiosos($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            $colors = array('#33FF12', '#47AFF5', '#c588fc', '#fff720', '#F7B9FF', '#7eb1b8', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

            //obteniendo los datos del primer gráfico
            foreach ($data as $key => $valor) {
                $arrtem = array();
                $arrtem = array();
                $arrtem[] = (double) $valor['importe'];
                $arrtem[] = (double) $valor['importeajuste'];
                $arrtem[] = (double) $valor['importecontingencia'];
                $arrtem[] = (double) $valor['importeflete'];
                $arrtem[] = (double) $valor['total'];
                $arr[$key]['name'] = $valor['indicador'];
                $arr[$key]['data'] = $arrtem;
                $arr[$key]['color'] = $colors[$key];
            }
            if ($arr[0])
                foreach ($arr as $key => $valor) {
                    $result [] = Array(
                        "name" => $valor['name'],
                        "data" => $valor['data'],
                        "color" => $valor['color']
                    );
                } else {
                $result = array();
            }
            return $result;
        }
    }

    //Plan - Resumen por CB
    public function PlanResumenCB($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $tot = $analisisPlanif->graficaResumenCBTotal($params);
            return $tot[0];
        } else {
            $data = $analisisPlanif->graficaResumenCB($params);
        }

        //obteniendo los datos del primer gráfico
        if ($data[0]) {
            foreach ($data as $key => $value) {
                $enti = $this->integrator->metadatos->DameEstructura($value['cb']);
                $categorias[$key] = $enti[0]->denominacion;
                $importeingresos[$key] = (double) $value['ingreso'];
                $importegastos[$key] = (double) $value['gastos'];
            }
            $data = Array(
                array(
                    "name" => 'Ingresos',
                    "color" => '#33FF12',
                    "data" => $importeingresos
                ), array(
                    "name" => 'Gastos',
                    "color" => '#47AFF5',
                    "data" => $importegastos
                )
            );
        } else {
            $data = array();
        }
        return array('data' => $data, 'categorias' => $categorias);
    }

    //Calculo Calculo de carga-capacidad
    public function calcularCargaCapacidad($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $params['identidades'] = implode(',', $entidades);
        $data = $analisisPlanif->calcularCargaCapacidad($params);

        //obteniendo los datos del primer gráfico
        if ($data[0]) {
            $carga[0] = (double) $data[0]['carga'];
            $capacidad[0] = (double) $data[0]['capacidad'];
            $diferencia[0] = (double) $data[0]['diferencia'];

            if ($diferencia[0] > 0) {
                $data = Array(
                    array(
                        "name" => 'Carga',
                        "color" => '#2328ff',
                        "data" => $carga
                    ), array(
                        "name" => 'Capacidad',
                        "color" => '#28d0ff',
                        "data" => $capacidad
                    )
                    , array(
                        "name" => 'Capacidad Disponible',
                        "color" => ' #1fff88',
                        "data" => $diferencia
                    )
                );
            } else if ($diferencia[0] < 0) {
                $data = Array(
                    array(
                        "name" => 'Carga',
                        "color" => '#2328ff',
                        "data" => $carga
                    ), array(
                        "name" => 'Capacidad',
                        "color" => '#28d0ff',
                        "data" => $capacidad
                    )
                    , array(
                        "name" => 'Sobrecarga',
                        "color" => '#E5142F',
                        "data" => $diferencia
                    )
                );
            } else {
                $data = Array(
                    array(
                        "name" => 'Carga',
                        "color" => '#33FF12',
                        "data" => $carga
                    ), array(
                        "name" => 'Capacidad',
                        "color" => '#47AFF5',
                        "data" => $capacidad
                    )
                );
            }
        } else {
            $data = array();
        }
        $categorias[0] = $params['entidad'];
        return array('data' => $data, 'categorias' => $categorias);
    }

    //Plan - Resumen por Entidad
    public function PlanResumenEntidad($params) {
        $analisisPlanif = new Analisisplanificacion();
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $tot = $analisisPlanif->graficaResumenEntidadTotal($params);
            return $tot[0];
        } else {
            $data = $analisisPlanif->graficaResumenEntidad($params);

            //obteniendo los datos del primer gráfico
            if ($data[0]) {
                foreach ($data as $key => $value) {
                    $enti = $this->integrator->metadatos->DameEstructura($value['od']);
                    $categorias[$key] = $enti[0]->denominacion;
                    $importeingresos[$key] = (double) $value['ingreso'];
                    $importegastos[$key] = (double) $value['gastos'];
                }
                $data = Array(
                    array(
                        "name" => 'Ingresos',
                        "color" => '#33FF12',
                        "data" => $importeingresos
                    ), array(
                        "name" => 'Gastos',
                        "color" => '#47AFF5',
                        "data" => $importegastos
                    )
                );
            } else {
                $data = array();
            }
            return array('data' => $data, 'categorias' => $categorias);
        }
    }

    //BM - CTE-necesidad
    public function BMCTENecesidad($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
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
            $tot = $analisisPlanif->diferenciaBalanceCantidadTotal($ent, $params['idejercicio'], $params);
            return $tot[0];
        } else {
            $data = $analisisPlanif->diferenciaBalanceCantidad($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            $colors = array('#33FF12', '#47AFF5', '#c588fc', '#fff720', '#F7B9FF', '#7eb1b8', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

            //obteniendo los datos del primer gráfico
            $categorias = array();
            $categorias[] = 'CTE';
            $categorias[] = 'Necesidad';
            $categorias[] = 'Demanda';
            foreach ($data as $key => $valor) {
                $arrtem = array();
                $arrtem[] = (double) $valor['cte'];
                $arrtem[] = (double) $valor['necesidad'];
                $arrtem[] = (double) $valor['diferencia'];
                $arr[$key]['name'] = $valor['indicador'];
                $arr[$key]['data'] = $arrtem;
                $arr[$key]['color'] = $colors[$key];
            }

            //obteniendo los datos del segundo gráfico
            $dataV = $analisisPlanif->diferenciaBalanceImporte($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            foreach ($dataV as $key => $valor) {
                $arrtemV = array();
                $arrtemV[] = (double) $valor['importecte'];
                $arrtemV[] = (double) $valor['importenecesidad'];
                $arrtemV[] = (double) $valor['diferencia'];
                $arrV[$key]['name'] = $valor['indicador'];
                $arrV[$key]['data'] = $arrtemV;
                $arrV[$key]['color'] = $colors[$key];
            }
            return array('data' => $arr, 'dataV' => $arrV, 'categorias' => $categorias);
        }
    }

    //BM - CTE-necesidad
    public function BMCPEDemanda($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
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
            $tot = $analisisPlanif->demandaBalanceCantidadTotal($ent, $params['idejercicio'], $params);
            return $tot[0];
        } else {
            $data = $analisisPlanif->demandaBalanceCantidad($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);
            $colors = array('#33FF12', '#47AFF5', '#c588fc', '#fff720', '#F7B9FF', '#7eb1b8', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

            //obteniendo los datos del primer gráfico
            $categorias[] = 'CPE';
            $categorias[] = 'Necesidad';
            $categorias[] = 'Demanda';
            foreach ($data as $key => $valor) {
                $arrtem = array();
                $arrtem[] = (double) $valor['cpe'];
                $arrtem[] = (double) $valor['necesidad'];
                $arrtem[] = (double) $valor['demanda'];
                $arr[$key]['name'] = $valor['indicador'];
                $arr[$key]['data'] = $arrtem;
                $arr[$key]['color'] = $colors[$key];
            }

            //obteniendo los datos del segundo gráfico
            $dataV = $analisisPlanif->demandaBalanceImporte($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);

            foreach ($dataV as $key => $valor) {
                $arrtemV = array();
                $arrtemV[] = (double) $valor['importecpe'];
                $arrtemV[] = (double) $valor['importenecesidad'];
                $arrtemV[] = (double) $valor['importedemanda'];
                $arrV[$key]['name'] = $valor['indicador'];
                $arrV[$key]['data'] = $arrtemV;
                $arrV[$key]['color'] = $colors[$key];
            }
            return array('data' => $arr, 'dataV' => $arrV, 'categorias' => $categorias);
        }
    }

    //Datos para graficar el tab CEPlan - global * entidad
    public function graficaEjecucionglobalxentidad($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        $data = $analisisPlanif->graficaEjecucionglobalxentidad($params);

        //obteniendo los datos del primer gráfico
        $categorias = array();
        $categorias[] = 'Planificado';
        $categorias[] = 'Ejecutado';
        $categorias[] = 'Pendiente';
        $datos = array();
        $datos[] = Array(
            "color" => '#33FF12',
            "y" => (double) $data[0]['importeplan']
        );
        $datos[] = Array(
            "color" => '#47AFF5',
            "y" => (double) $data[0]['importeejecutado']
        );
        $datos[] = Array(
            "color" => '#FF0000',
            "y" => (double) $data[0]['importependiente']
        );

        //obteniendo los datos del segundo gráfico
        $dataV = $analisisPlanif->graficaEjecucionglobalxentidadIngresoGasto($params);
        $categoriasV = array();
        $categoriasV[] = 'Ingresos';
        $categoriasV[] = 'Gastos';
        $categoriasV[] = 'Diferencia';
        $datosV = array();
        $datosV[] = Array(
            "color" => '#33FF12',
            "y" => (double) $dataV[0]['ingreso']
        );
        $datosV[] = Array(
            "color" => '#47AFF5',
            "y" => (double) $dataV[0]['gastos']
        );
        $datosV[] = Array(
            "color" => '#FF0000',
            "y" => (double) $dataV[0]['diferencia']
        );
        return array('data' => $datos, 'dataV' => $datosV, 'categorias' => $categorias, 'categoriasV' => $categoriasV);
    }

    //Datos para graficar el tab CEPlan - global * entidad * plan
    public function CEPlanglobalentidadplan($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $params['uri'] = 1;
            $tot = $analisisPlanif->graficaEjecucionglobalxentidadxClasifplanTotal($params);
            $to = $tot[0];
            $params['uri'] = 0;
            $tot = $analisisPlanif->graficaEjecucionglobalxentidadxClasifplanTotal($params);
            $t = $tot[0];
            if ($to > $t)
                return $to;
            else
                return $t;
        } else {
            $params['uri'] = 1;
            $data = $analisisPlanif->graficaEjecucionglobalxentidadxClasifplan($params);

            //obteniendo los datos del primer gráfico
            foreach ($data as $key => $value) {
                $categorias[$key] = $value['plan'];
                $importeplan[$key] = (double) $value['importeplan'];
                $importeejecutado[$key] = (double) $value['importeejecutado'];
                $importesustitucion[$key] = (double) $value['importesustitucion'];
                $importeadicion[$key] = (double) $value['importeadicion'];
                $importetotalejecutado[$key] = (double) $value['importetotalejecutado'];
            }
            $dataPlanificado = Array(
                "name" => 'Planificado',
                "type" => 'column',
                "color" => '#33FF12',
                "data" => $importeplan
            );
            $dataEjec = Array(
                "name" => 'Ejecutado por plan',
                "type" => 'column',
                "color" => '#47AFF5',
                "data" => $importeejecutado
            );
            $dataSust = Array(
                "name" => 'Ejecutado por sustitución',
                "type" => 'column',
                "color" => '#c588fc',
                "data" => $importesustitucion
            );
            $dataAdicion = Array(
                "name" => 'Ejecutado por adición',
                "type" => 'column',
                "color" => '#fff720',
                "data" => $importeadicion
            );
            $datat = Array(
                "type" => 'spline',
                "name" => 'Total ejecutado',
                "color" => '#FF0000',
                "data" => $importetotalejecutado
            );
            $series = Array($dataPlanificado, $dataEjec, $dataSust, $dataAdicion, $datat);

            //obteniendo los datos del segundo gráfico
            $params['uri'] = 0;
            $dataV = $analisisPlanif->graficaEjecucionglobalxentidadxClasifplan($params);
            foreach ($dataV as $key => $value) {
                $categoriasV[$key] = $value['plan'];
                $importeplanV[$key] = (double) $value['importeplan'];
                $importeejecutadoV[$key] = (double) $value['importeejecutado'];
                $importesustitucionV[$key] = (double) $value['importesustitucion'];
                $importeadicionV[$key] = (double) $value['importeadicion'];
                $importetotalejecutadoV[$key] = (double) $value['importetotalejecutado'];
            }
            $dataPlanificadoV = Array(
                "name" => 'Planificado',
                "type" => 'column',
                "color" => '#33FF12',
                "data" => $importeplanV
            );
            $dataEjecV = Array(
                "name" => 'Ejecutado por plan',
                "type" => 'column',
                "color" => '#47AFF5',
                "data" => $importeejecutadoV
            );
            $dataSustV = Array(
                "name" => 'Ejecutado por sustitución',
                "type" => 'column',
                "color" => '#c588fc',
                "data" => $importesustitucionV
            );
            $dataAdicionV = Array(
                "name" => 'Ejecutado por adición',
                "type" => 'column',
                "color" => '#fff720',
                "data" => $importeadicionV
            );
            $datatV = Array(
                "type" => 'spline',
                "name" => 'Total ejecutado',
                "color" => '#FF0000',
                "data" => $importetotalejecutadoV
            );
            $seriesV = Array($dataPlanificadoV, $dataEjecV, $dataSustV, $dataAdicionV, $datatV);
            return array('data' => $series, 'dataV' => $seriesV, 'categorias' => $categorias, 'categoriasV' => $categoriasV);
        }
    }

    //Datos para graficar el tab CEPlan - trimestre
    public function CEPTrimestre($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        $params['uri'] = 1;
        $dat[0] = $analisisPlanif->graficaEjecucionglobalxentidadejecutadoxtrimestre($params);
        $dat[1] = $analisisPlanif->graficaEjecucionglobalxentidadadicionadoxtrimestre($params);
        $dat[2] = $analisisPlanif->graficaEjecucionglobalxentidadsustituirxtrimestre($params);
        $dat[3] = $analisisPlanif->graficaEjecucionglobalxentidadplanificadoxtrimestre($params);

        //obteniendo los datos del primer gráfico
        $categorias[0] = 'Trimestre I';
        $categorias[1] = 'Trimestre II';
        $categorias[2] = 'Trimestre III';
        $categorias[3] = 'Trimestre IV';

        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre1'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre2'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre3'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre4'];

        $adicion[] = (double) $dat[1][0]['adiciontrimestre1'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre2'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre3'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre4'];

        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre1'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre2'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre3'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre4'];

        $plan[] = (double) $dat[3][0]['plantrimestre1'];
        $plan[] = (double) $dat[3][0]['plantrimestre2'];
        $plan[] = (double) $dat[3][0]['plantrimestre3'];
        $plan[] = (double) $dat[3][0]['plantrimestre4'];

        $pendiente[] = (double) $dat[3][0]['plantrimestre1'] - $dat[0][0]['ejecutadotrimestre1'];
        $pendiente[] = (double) $dat[3][0]['plantrimestre2'] - $dat[0][0]['ejecutadotrimestre2'];
        $pendiente[] = (double) $dat[3][0]['plantrimestre3'] - $dat[0][0]['ejecutadotrimestre3'];
        $pendiente[] = (double) $dat[3][0]['plantrimestre4'] - $dat[0][0]['ejecutadotrimestre4'];

        $total[] = (double) ($importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[2] + $adicion[2] + $sustitucion[2] +
                $importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[3] + $adicion[3] + $sustitucion[3] +
                $importeejecutado[2] + $adicion[2] + $sustitucion[2] +
                $importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $data = Array(
            array(
                "name" => 'Plan',
                "color" => '#33FF12',
                "data" => $plan
            ),
            array(
                "name" => 'Ejecutado',
                "color" => '#47AFF5',
                "data" => $importeejecutado
            ),
            array(
                "name" => 'Pendiente',
                "color" => '#c588fc',
                "data" => $pendiente
            ), array(
                "name" => 'Adición',
                "color" => '#fff720',
                "data" => $adicion
            ), array(
                "name" => 'Sustitución',
                "color" => '#F7B9FF',
                "data" => $sustitucion
            ), array(
                "name" => 'Total',
                "color" => '#FF0000',
                "data" => $total
            )
        );

        //obteniendo los datos del segundo gráfico
        $params['uri'] = 0;
        $datV[0] = $analisisPlanif->graficaEjecucionglobalxentidadejecutadoxtrimestre($params);
        $datV[1] = $analisisPlanif->graficaEjecucionglobalxentidadadicionadoxtrimestre($params);
        $datV[2] = $analisisPlanif->graficaEjecucionglobalxentidadsustituirxtrimestre($params);
        $datV[3] = $analisisPlanif->graficaEjecucionglobalxentidadplanificadoxtrimestre($params);

        $importeejecutadoV[] = (double) $datV[0][0]['ejecutadotrimestre1'];
        $importeejecutadoV[] = (double) $datV[0][0]['ejecutadotrimestre2'];
        $importeejecutadoV[] = (double) $datV[0][0]['ejecutadotrimestre3'];
        $importeejecutadoV[] = (double) $datV[0][0]['ejecutadotrimestre4'];

        $adicionV[] = (double) $datV[1][0]['adiciontrimestre1'];
        $adicionV[] = (double) $datV[1][0]['adiciontrimestre2'];
        $adicionV[] = (double) $datV[1][0]['adiciontrimestre3'];
        $adicionV[] = (double) $datV[1][0]['adiciontrimestre4'];

        $sustitucionV[] = (double) $datV[2][0]['sustituciontrimestre1'];
        $sustitucionV[] = (double) $datV[2][0]['sustituciontrimestre2'];
        $sustitucionV[] = (double) $datV[2][0]['sustituciontrimestre3'];
        $sustitucionV[] = (double) $datV[2][0]['sustituciontrimestre4'];

        $planV[] = (double) $datV[3][0]['plantrimestre1'];
        $planV[] = (double) $datV[3][0]['plantrimestre2'];
        $planV[] = (double) $datV[3][0]['plantrimestre3'];
        $planV[] = (double) $datV[3][0]['plantrimestre4'];

        $pendienteV[] = (double) $datV[3][0]['plantrimestre1'] - $datV[0][0]['ejecutadotrimestre1'];
        $pendienteV[] = (double) $datV[3][0]['plantrimestre2'] - $datV[0][0]['ejecutadotrimestre2'];
        $pendienteV[] = (double) $datV[3][0]['plantrimestre3'] - $datV[0][0]['ejecutadotrimestre3'];
        $pendienteV[] = (double) $datV[3][0]['plantrimestre4'] - $datV[0][0]['ejecutadotrimestre4'];

        $totalV[] = (double) ($importeejecutadoV[0] + $adicionV[0] + $sustitucionV[0]);

        $totalV[] = (double) ($importeejecutadoV[1] + $adicionV[1] + $sustitucionV[1] +
                $importeejecutadoV[0] + $adicionV[0] + $sustitucionV[0]);

        $totalV[] = (double) ($importeejecutadoV[2] + $adicionV[2] + $sustitucionV[2] +
                $importeejecutadoV[1] + $adicionV[1] + $sustitucionV[1] +
                $importeejecutadoV[0] + $adicionV[0] + $sustitucionV[0]);

        $totalV[] = (double) ($importeejecutadoV[3] + $adicionV[3] + $sustitucionV[3] +
                $importeejecutadoV[2] + $adicionV[2] + $sustitucionV[2] +
                $importeejecutadoV[1] + $adicionV[1] + $sustitucionV[1] +
                $importeejecutadoV[0] + $adicionV[0] + $sustitucionV[0]);

        $dataV = Array(
            array(
                "name" => 'Plan',
                "color" => '#33FF12',
                "data" => $planV
            ),
            array(
                "name" => 'Ejecutado',
                "color" => '#47AFF5',
                "data" => $importeejecutadoV
            ),
            array(
                "name" => 'Pendiente',
                "color" => '#c588fc',
                "data" => $pendienteV
            ), array(
                "name" => 'Adición',
                "color" => '#fff720',
                "data" => $adicionV
            ), array(
                "name" => 'Sustitución',
                "color" => '#F7B9FF',
                "data" => $sustitucionV
            ), array(
                "name" => 'Total',
                "color" => '#FF0000',
                "data" => $totalV
            )
        );
        return array('data' => $data, 'dataV' => $dataV, 'categorias' => $categorias);
    }

    //Datos para graficar el tab CEPlan - mes
    public function CEPMes($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        $dat[0] = $analisisPlanif->graficaEjecucionglobalxentidadejecutadoxmeses($params);
        $dat[1] = $analisisPlanif->graficaEjecucionglobalxentidadadicionadoxmeses($params);
        $dat[2] = $analisisPlanif->graficaEjecucionglobalxentidadsustituirxmeses($params);
        $dat[3] = $analisisPlanif->graficaEjecucionglobalxentidadplanxmeses($params);

        //obteniendo los datos del primer gráfico
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

        $importeejecutado[] = (double) $dat[0][0]['ejecutadoenero'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadofebrero'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadomarzo'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoabril'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadomayo'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadojunio'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadojulio'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoagosto'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoseptiembre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadooctubre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadonoviembre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadodiciembre'];


        $adicion[] = (double) $dat[1][0]['adicionenero'];
        $adicion[] = (double) $dat[1][0]['adicionfebrero'];
        $adicion[] = (double) $dat[1][0]['adicionmarzo'];
        $adicion[] = (double) $dat[1][0]['adicionabril'];
        $adicion[] = (double) $dat[1][0]['adicionmayo'];
        $adicion[] = (double) $dat[1][0]['adicionjunio'];
        $adicion[] = (double) $dat[1][0]['adicionjulio'];
        $adicion[] = (double) $dat[1][0]['adicionagosto'];
        $adicion[] = (double) $dat[1][0]['adicionseptiembre'];
        $adicion[] = (double) $dat[1][0]['adicionoctubre'];
        $adicion[] = (double) $dat[1][0]['adicionnoviembre'];
        $adicion[] = (double) $dat[1][0]['adiciondiciembre'];

        $sustitucion[] = (double) $dat[2][0]['sustitucionenero'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionfebrero'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionmarzo'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionabril'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionmayo'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionjunio'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionjulio'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionagosto'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionseptiembre'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionoctubre'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionnoviembre'];
        $sustitucion[] = (double) $dat[2][0]['sustituciondiciembre'];

        $plan[] = (double) $dat[3][0]['planenero'];
        $plan[] = (double) $dat[3][0]['planfebrero'];
        $plan[] = (double) $dat[3][0]['planmarzo'];
        $plan[] = (double) $dat[3][0]['planabril'];
        $plan[] = (double) $dat[3][0]['planmayo'];
        $plan[] = (double) $dat[3][0]['planjunio'];
        $plan[] = (double) $dat[3][0]['planjulio'];
        $plan[] = (double) $dat[3][0]['planagosto'];
        $plan[] = (double) $dat[3][0]['planseptiembre'];
        $plan[] = (double) $dat[3][0]['planoctubre'];
        $plan[] = (double) $dat[3][0]['plannoviembre'];
        $plan[] = (double) $dat[3][0]['plandiciembre'];

        $pendiente[] = (double) $dat[3][0]['planenero'] - $dat[0][0]['ejecutadoenero'];
        $pendiente[] = (double) $dat[3][0]['planfebrero'] - $dat[0][0]['ejecutadofebrero'];
        $pendiente[] = (double) $dat[3][0]['planmarzo'] - $dat[0][0]['ejecutadomarzo'];
        $pendiente[] = (double) $dat[3][0]['planabril'] - $dat[0][0]['ejecutadoabril'];
        $pendiente[] = (double) $dat[3][0]['planmayo'] - $dat[0][0]['ejecutadomayo'];
        $pendiente[] = (double) $dat[3][0]['planjunio'] - $dat[0][0]['ejecutadojunio'];
        $pendiente[] = (double) $dat[3][0]['planjulio'] - $dat[0][0]['ejecutadojulio'];
        $pendiente[] = (double) $dat[3][0]['planagosto'] - $dat[0][0]['ejecutadoagosto'];
        $pendiente[] = (double) $dat[3][0]['planseptiembre'] - $dat[0][0]['ejecutadoseptiembre'];
        $pendiente[] = (double) $dat[3][0]['planoctubre'] - $dat[0][0]['ejecutadooctubre'];
        $pendiente[] = (double) $dat[3][0]['plannoviembre'] - $dat[0][0]['ejecutadonoviembre'];
        $pendiente[] = (double) $dat[3][0]['plandiciembre'] - $dat[0][0]['ejecutadodiciembre'];


        $totacum = (double) ($importeejecutado[0] + $adicion[0] + $sustitucion[0]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[1] + $adicion[1] + $sustitucion[1]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[2] + $adicion[2] + $sustitucion[2]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[3] + $adicion[3] + $sustitucion[3]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[4] + $adicion[4] + $sustitucion[4]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[5] + $adicion[5] + $sustitucion[5]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[6] + $adicion[6] + $sustitucion[6]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[7] + $adicion[7] + $sustitucion[7]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[8] + $adicion[8] + $sustitucion[8]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[9] + $adicion[9] + $sustitucion[9]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[10] + $adicion[10] + $sustitucion[10]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[11] + $adicion[11] + $sustitucion[11]);
        $total[] = $totacum;

        $data = Array(
            array(
                "name" => 'Plan',
                "color" => '#33FF12',
                "data" => $plan
            ),
            array(
                "name" => 'Ejecutado',
                "color" => '#47AFF5',
                "data" => $importeejecutado
            ),
            array(
                "name" => 'Pendiente',
                "color" => '#c588fc',
                "data" => $pendiente
            ), array(
                "name" => 'Adición',
                "color" => '#fff720',
                "data" => $adicion
            ), array(
                "name" => 'Sustitución',
                "color" => '#F7B9FF',
                "data" => $sustitucion
            ), array(
                "name" => 'Total',
                "color" => '#FF0000',
                "data" => $total
            )
        );
        return array('data' => $data, 'categorias' => $categorias);
    }

    //Datos para graficar el tab CEPlan - mas valiosos
    public function CEPlanmasValiosos($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $params['uri'] = 1;
            $tot = $analisisPlanif->graficaEjecucionMasValiososTotal($params);
            $to = $tot[0];
            $params['uri'] = 0;
            $tot = $analisisPlanif->graficaEjecucionMasValiososTotal($params);
            $t = $tot[0];
            if ($to > $t)
                return $to;
            else
                return $t;
        } else {
            $params['uri'] = 1;
            $data = $analisisPlanif->graficaEjecucionMasValiosos($params);
            //obteniendo los datos del primer gráfico
            foreach ($data as $key => $value) {
                $categorias[$key] = $value['denominacion'];
                $importeplan[$key] = (double) $value['importeplan'];
                $importeejecutado[$key] = (double) $value['importeejecutado'];
            }
            $data = Array(
                array(
                    "name" => 'Plan',
                    "color" => '#33FF12',
                    "data" => $importeplan
                ), array(
                    "name" => 'Ejecución',
                    "color" => '#47AFF5',
                    "data" => $importeejecutado
                )
            );
            //obteniendo los datos del segundo gráfico
            $params['uri'] = 0;
            $dataV = $analisisPlanif->graficaEjecucionMasValiosos($params);
            foreach ($dataV as $key => $value) {
                $categoriasV[$key] = $value['denominacion'];
                $importeplanV[$key] = (double) $value['importeplan'];
                $importeejecutadoV[$key] = (double) $value['importeejecutado'];
            }

            $dataV = Array(
                array(
                    "name" => 'Plan',
                    "color" => '#33FF12',
                    "data" => $importeplanV
                ), array(
                    "name" => 'Ejecución',
                    "color" => '#47AFF5',
                    "data" => $importeejecutadoV
                )
            );
            return array('data' => $data, 'categorias' => $categorias, 'dataV' => $dataV, 'categoriasV' => $categoriasV);
        }
    }

    //Datos para graficar el tab CEPlan - mas valiosos fuera de plan
    public function graficarCEPlanmasValiososFuera($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $params['uri'] = 1;
            $tot = $analisisPlanif->graficaIndicadoresFueraPlanMasValiososTotal($params);
            $to = $tot[0];
            $params['uri'] = 0;
            $tot = $analisisPlanif->graficaIndicadoresFueraPlanMasValiososTotal($params);
            $t = $tot[0];
            if ($to > $t)
                return $to;
            else
                return $t;
        } else {
            $params['uri'] = 1;
            $data = $analisisPlanif->graficaIndicadoresFueraPlanMasValiosos($params);
            //obteniendo los datos del primer gráfico
            foreach ($data as $key => $value) {
                $categorias[$key] = $value['denominacion'];
                $importeplan[$key] = (double) $value['adiciones'];
            }
            $data = Array(
                array(
                    "name" => 'Ejecutado por adición',
                    "color" => '#33FF12',
                    "data" => $importeplan
                )
            );
            //obteniendo los datos del segundo gráfico
            $params['uri'] = 0;
            $dataV = $analisisPlanif->graficaIndicadoresFueraPlanMasValiosos($params);
            foreach ($dataV as $key => $value) {
                $categoriasV[$key] = $value['denominacion'];
                $importeplanV[$key] = (double) $value['adiciones'];
            }
            $dataV = Array(
                array(
                    "name" => 'Ejecutado por adición',
                    "color" => '#33FF12',
                    "data" => $importeplanV
                )
            );
            return array('data' => $data, 'categorias' => $categorias, 'dataV' => $dataV, 'categoriasV' => $categoriasV);
        }
    }

    //Datos para graficar el tab CEPlan - mas y menos ejecutados
    public function CEPlanmasMenosEjecutados($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $params['uri'] = 1;
            $tot = $analisisPlanif->graficaIndicadoresMasEjecutadosTotal($params);
            $to = $tot[0];
            $params['uri'] = 0;
            $tot = $analisisPlanif->graficaIndicadoresMasEjecutadosTotal($params);
            $t = $tot[0];
            if ($to > $t)
                return $to;
            else
                return $t;
        } else {
            $params['uri'] = 1;
            $data = $analisisPlanif->graficaIndicadoresMasEjecutados($params);
            //obteniendo los datos del primer gráfico
            foreach ($data as $key => $value) {
                $categorias[$key] = $value['denominacion'];
                $importeplan[$key] = (double) $value['plan'];
                $importeejec[$key] = (double) $value['ejecutado'];
            }
            $data = Array(
                array(
                    "name" => 'Planificado',
                    "color" => '#33FF12',
                    "data" => $importeplan
                ), array(
                    "name" => 'Ejecutado',
                    "color" => '#47AFF5',
                    "data" => $importeejec
                )
            );
            //obteniendo los datos del segundo gráfico
            $params['uri'] = 0;
            $dataV = $analisisPlanif->graficaIndicadoresMasEjecutados($params);
            foreach ($dataV as $key => $value) {
                $categoriasV[$key] = $value['denominacion'];
                $importeplanV[$key] = (double) $value['plan'];
                $importeejecV[$key] = (double) $value['ejecutado'];
            }
            $dataV = Array(
                array(
                    "name" => 'Planificado',
                    "color" => '#33FF12',
                    "data" => $importeplanV
                ), array(
                    "name" => 'Ejecutado',
                    "color" => '#47AFF5',
                    "data" => $importeejecV
                )
            );
            return array('data' => $data, 'categorias' => $categorias, 'dataV' => $dataV, 'categoriasV' => $categoriasV);
        }
    }

    //Datos para graficar el tab CEPlan - ejecutados * VA
    public function graficarCEPlanejecutadosVA($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $tot = $analisisPlanif->graficaEjecucionglobalxentidadxVATotal($params);
            return $tot[0];
        } else {
            $data = $analisisPlanif->graficaEjecucionglobalxentidadxVA($params);
            //obteniendo los datos del primer gráfico
            $acum = 0;
            foreach ($data as $key => $value) {
                $categorias[$key] = $value['viaadquisicion'];
                $importeplan[$key] = (double) $value['importeplan'];
                $importeejecutado[$key] = (double) $value['importeejecutado'];
                $importesustitucion[$key] = (double) $value['importesustitucion'];
                $importeadicion[$key] = (double) $value['importeadicion'];
                $importetotalejecutado[$key] = (double) $value['importetotalejecutado'];
                $acum += (double) $value['importetotalejecutado'];
                $importetotalejecutadoacum[$key] = (double) $acum;
            }
            $dataPlanificado = Array(
                "name" => 'Planificado',
                "type" => 'column',
                "color" => '#33FF12',
                "data" => $importeplan
            );
            $dataEjec = Array(
                "name" => 'Ejecutado por plan',
                "type" => 'column',
                "color" => '#47AFF5',
                "data" => $importeejecutado
            );
            $dataSust = Array(
                "name" => 'Ejecutado por sustitución',
                "type" => 'column',
                "color" => '#c588fc',
                "data" => $importesustitucion
            );
            $dataAdicion = Array(
                "name" => 'Ejecutado por adición',
                "type" => 'column',
                "color" => '#fff720',
                "data" => $importeadicion
            );
            $datat = Array(
                "type" => 'spline',
                "color" => '#F7B9FF',
                "name" => 'Total ejecutado',
                "data" => $importetotalejecutado
            );
            $dataacum = Array(
                "type" => 'spline',
                "color" => '#FF0000',
                "name" => 'Total ejecutado acumulado',
                "data" => $importetotalejecutadoacum
            );
            $series = Array($dataPlanificado, $dataEjec, $dataSust, $dataAdicion, $datat, $dataacum);
            return array('data' => $series, 'categorias' => $categorias);
        }
    }

    //Datos para graficar el tab CE - NA - global * entidad
    public function graficarCENAglobalEntidad($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        $params['uri'] = 0;
        $data = $analisisPlanif->graficaEjecucionglobalxentidadAct($params);
        //obteniendo los datos del primer gráfico
        $datos = array();
        $datos[] = Array(
            "color" => '#33FF12',
            "y" => (double) $data[0]['nivel']
        );
        $datos[] = Array(
            "color" => '#47AFF5',
            "y" => (double) $data[0]['nivelejecutado']
        );
        $datos[] = Array(
            "color" => '#FF0000',
            "y" => (double) $data[0]['pendiente']
        );
        $categorias = array();
        $categorias[] = 'Planificado';
        $categorias[] = 'Ejecutado';
        $categorias[] = 'Pendiente';

        //obteniendo los datos del segundo gráfico
        $dat[0] = $analisisPlanif->graficaEjecucionglobalxentidadejecutadoxtrimestreAct($params);
        $dat[1] = $analisisPlanif->graficaEjecucionglobalxentidadadicionadoxtrimestreAct($params);
        $dat[2] = $analisisPlanif->graficaEjecucionglobalxentidadsustituirxtrimestreAct($params);
        $dat[3] = $analisisPlanif->graficaEjecucionglobalxentidadplanifxtrimestreAct($params);

        $categoriasT[0] = 'Trimestre I';
        $categoriasT[1] = 'Trimestre II';
        $categoriasT[2] = 'Trimestre III';
        $categoriasT[3] = 'Trimestre IV';

        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre1'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre2'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre3'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadotrimestre4'];

        $adicion[] = (double) $dat[1][0]['adiciontrimestre1'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre2'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre3'];
        $adicion[] = (double) $dat[1][0]['adiciontrimestre4'];

        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre1'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre2'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre3'];
        $sustitucion[] = (double) $dat[2][0]['sustituciontrimestre4'];

        $plan[] = (double) $dat[3][0]['plantrimestre1'];
        $plan[] = (double) $dat[3][0]['plantrimestre2'];
        $plan[] = (double) $dat[3][0]['plantrimestre3'];
        $plan[] = (double) $dat[3][0]['plantrimestre4'];

        $pendiente[] = (double) $dat[3][0]['plantrimestre1'] - $dat[0][0]['ejecutadotrimestre1'];
        $pendiente[] = (double) $dat[3][0]['plantrimestre2'] - $dat[0][0]['ejecutadotrimestre2'];
        $pendiente[] = (double) $dat[3][0]['plantrimestre3'] - $dat[0][0]['ejecutadotrimestre3'];
        $pendiente[] = (double) $dat[3][0]['plantrimestre4'] - $dat[0][0]['ejecutadotrimestre4'];

        $total[] = (double) ($importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[2] + $adicion[2] + $sustitucion[2] +
                $importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $total[] = (double) ($importeejecutado[3] + $adicion[3] + $sustitucion[3] +
                $importeejecutado[2] + $adicion[2] + $sustitucion[2] +
                $importeejecutado[1] + $adicion[1] + $sustitucion[1] +
                $importeejecutado[0] + $adicion[0] + $sustitucion[0]);

        $data = Array(
            array(
                "name" => 'Plan',
                "color" => '#33FF12',
                "data" => $plan
            ),
            array(
                "name" => 'Ejecutado',
                "color" => '#47AFF5',
                "data" => $importeejecutado
            ),
            array(
                "name" => 'Pendiente',
                "color" => '#c588fc',
                "data" => $pendiente
            ), array(
                "name" => 'Adición',
                "color" => '#fff720',
                "data" => $adicion
            ), array(
                "name" => 'Sustitución',
                "color" => '#F7B9FF',
                "data" => $sustitucion
            ), array(
                "name" => 'Total',
                "color" => '#FF0000',
                "data" => $total
            )
        );
        return array('data' => $datos, 'categorias' => $categorias, 'dataT' => $data, 'categoriasT' => $categoriasT);
    }

    //Datos para graficar el tab CE - NA - mes
    public function CENAMes($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        $dat[0] = $analisisPlanif->graficaEjecucionglobalxentidadejecutadoxmesesAct($params);
        $dat[1] = $analisisPlanif->graficaEjecucionglobalxentidadadicionadoxmesesAct($params);
        $dat[2] = $analisisPlanif->graficaEjecucionglobalxentidadsustituirxmesesAct($params);
        $dat[3] = $analisisPlanif->graficaEjecucionglobalxentidadplanxmesesAct($params);

        //obteniendo los datos del primer gráfico
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

        $importeejecutado[] = (double) $dat[0][0]['ejecutadoenero'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadofebrero'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadomarzo'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoabril'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadomayo'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadojunio'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadojulio'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoagosto'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadoseptiembre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadooctubre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadonoviembre'];
        $importeejecutado[] = (double) $dat[0][0]['ejecutadodiciembre'];


        $adicion[] = (double) $dat[1][0]['adicionenero'];
        $adicion[] = (double) $dat[1][0]['adicionfebrero'];
        $adicion[] = (double) $dat[1][0]['adicionmarzo'];
        $adicion[] = (double) $dat[1][0]['adicionabril'];
        $adicion[] = (double) $dat[1][0]['adicionmayo'];
        $adicion[] = (double) $dat[1][0]['adicionjunio'];
        $adicion[] = (double) $dat[1][0]['adicionjulio'];
        $adicion[] = (double) $dat[1][0]['adicionagosto'];
        $adicion[] = (double) $dat[1][0]['adicionseptiembre'];
        $adicion[] = (double) $dat[1][0]['adicionoctubre'];
        $adicion[] = (double) $dat[1][0]['adicionnoviembre'];
        $adicion[] = (double) $dat[1][0]['adiciondiciembre'];

        $sustitucion[] = (double) $dat[2][0]['sustitucionenero'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionfebrero'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionmarzo'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionabril'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionmayo'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionjunio'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionjulio'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionagosto'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionseptiembre'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionoctubre'];
        $sustitucion[] = (double) $dat[2][0]['sustitucionnoviembre'];
        $sustitucion[] = (double) $dat[2][0]['sustituciondiciembre'];

        $plan[] = (double) $dat[3][0]['planenero'];
        $plan[] = (double) $dat[3][0]['planfebrero'];
        $plan[] = (double) $dat[3][0]['planmarzo'];
        $plan[] = (double) $dat[3][0]['planabril'];
        $plan[] = (double) $dat[3][0]['planmayo'];
        $plan[] = (double) $dat[3][0]['planjunio'];
        $plan[] = (double) $dat[3][0]['planjulio'];
        $plan[] = (double) $dat[3][0]['planagosto'];
        $plan[] = (double) $dat[3][0]['planseptiembre'];
        $plan[] = (double) $dat[3][0]['planoctubre'];
        $plan[] = (double) $dat[3][0]['plannoviembre'];
        $plan[] = (double) $dat[3][0]['plandiciembre'];

        $pendiente[] = (double) $dat[3][0]['planenero'] - $dat[0][0]['ejecutadoenero'];
        $pendiente[] = (double) $dat[3][0]['planfebrero'] - $dat[0][0]['ejecutadofebrero'];
        $pendiente[] = (double) $dat[3][0]['planmarzo'] - $dat[0][0]['ejecutadomarzo'];
        $pendiente[] = (double) $dat[3][0]['planabril'] - $dat[0][0]['ejecutadoabril'];
        $pendiente[] = (double) $dat[3][0]['planmayo'] - $dat[0][0]['ejecutadomayo'];
        $pendiente[] = (double) $dat[3][0]['planjunio'] - $dat[0][0]['ejecutadojunio'];
        $pendiente[] = (double) $dat[3][0]['planjulio'] - $dat[0][0]['ejecutadojulio'];
        $pendiente[] = (double) $dat[3][0]['planagosto'] - $dat[0][0]['ejecutadoagosto'];
        $pendiente[] = (double) $dat[3][0]['planseptiembre'] - $dat[0][0]['ejecutadoseptiembre'];
        $pendiente[] = (double) $dat[3][0]['planoctubre'] - $dat[0][0]['ejecutadooctubre'];
        $pendiente[] = (double) $dat[3][0]['plannoviembre'] - $dat[0][0]['ejecutadonoviembre'];
        $pendiente[] = (double) $dat[3][0]['plandiciembre'] - $dat[0][0]['ejecutadodiciembre'];

        $totacum = (double) ($importeejecutado[0] + $adicion[0] + $sustitucion[0]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[1] + $adicion[1] + $sustitucion[1]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[2] + $adicion[2] + $sustitucion[2]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[3] + $adicion[3] + $sustitucion[3]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[4] + $adicion[4] + $sustitucion[4]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[5] + $adicion[5] + $sustitucion[5]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[6] + $adicion[6] + $sustitucion[6]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[7] + $adicion[7] + $sustitucion[7]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[8] + $adicion[8] + $sustitucion[8]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[9] + $adicion[9] + $sustitucion[9]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[10] + $adicion[10] + $sustitucion[10]);
        $total[] = $totacum;
        $totacum += (double) ($importeejecutado[11] + $adicion[11] + $sustitucion[11]);
        $total[] = $totacum;

        $data = Array(
            array(
                "name" => 'Plan',
                "color" => '#33FF12',
                "data" => $plan
            ),
            array(
                "name" => 'Ejecutado',
                "color" => '#47AFF5',
                "data" => $importeejecutado
            ),
            array(
                "name" => 'Pendiente',
                "color" => '#c588fc',
                "data" => $pendiente
            ), array(
                "name" => 'Adición',
                "color" => '#fff720',
                "data" => $adicion
            ), array(
                "name" => 'Sustitución',
                "color" => '#F7B9FF',
                "data" => $sustitucion
            ), array(
                "name" => 'Total',
                "color" => '#FF0000',
                "data" => $total
            )
        );
        return array('data' => $data, 'categorias' => $categorias);
    }

    //Datos para graficar el tab CE - NA - mas valiosas
    public function CENAmasValiosos($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $tot = $analisisPlanif->graficaEjecucionMasValiososActTotal($params);
            $to = $tot[0];
            $tot = $analisisPlanif->graficaIndicadoresFueraPlanMasValiososActTotal($params);
            $t = $tot[0];
            if ($to > $t)
                return $to;
            else
                return $t;
        } else {
            $data = $analisisPlanif->graficaEjecucionMasValiososAct($params);
            //obteniendo los datos del primer gráfico
            foreach ($data as $key => $value) {
                $categorias[$key] = $value['denominacion'];
                $importeplan[$key] = (double) $value['importeplan'];
                $importeejecutado[$key] = (double) $value['importeejecutado'];
            }
            $data = Array(
                array(
                    "name" => 'Plan',
                    "color" => '#33FF12',
                    "data" => $importeplan
                ), array(
                    "name" => 'Ejecución',
                    "color" => '#47AFF5',
                    "data" => $importeejecutado
                )
            );
            //obteniendo los datos del segundo gráfico
            $dataV = $analisisPlanif->graficaIndicadoresFueraPlanMasValiososAct($params);
            foreach ($dataV as $key => $value) {
                $categoriasV[$key] = $value['denominacion'];
                $importeplanV[$key] = (double) $value['adiciones'];
            }
            $dataV = Array(
                array(
                    "name" => 'Ejecutado por adición',
                    "color" => '#33FF12',
                    "data" => $importeplanV
                )
            );
            return array('data' => $data, 'categorias' => $categorias, 'dataV' => $dataV, 'categoriasV' => $categoriasV);
        }
    }

    //Datos para graficar el tab CE - NA - mas ejecutadas
    public function CENAmasMenosEjecutados($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $tot = $analisisPlanif->graficaIndicadoresMasEjecutadosActTotal($params);
            return $tot[0];
        } else {
            $data = $analisisPlanif->graficaIndicadoresMasEjecutadosAct($params);
            //obteniendo los datos del primer gráfico
            foreach ($data as $key => $value) {
                $categorias[$key] = $value['denominacion'];
                $importeplan[$key] = (double) $value['plan'];
                $importeejec[$key] = (double) $value['ejecutado'];
            }
            $data = Array(
                array(
                    "name" => 'Planificado',
                    "color" => '#33FF12',
                    "data" => $importeplan
                ), array(
                    "name" => 'Ejecutado',
                    "color" => '#47AFF5',
                    "data" => $importeejec
                )
            );
            return array('data' => $data, 'categorias' => $categorias);
        }
    }

    //Datos para graficar el tab CE - NA - total * entidad
    public function graficarCENATotal($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['contar'] == 'true') {
            $tot = $analisisPlanif->graficaEjecucionglobalxentidadxActTotal($params);
            return $tot[0];
        } else {
            $data = $analisisPlanif->graficaEjecucionglobalxentidadxAct($params);
            //obteniendo los datos del primer gráfico
            $acum = 0;
            foreach ($data as $key => $value) {
                $categorias[$key] = $value['denominacion'];
                $importeplan[$key] = (double) $value['nivel'];
                $importeejecutado[$key] = (double) $value['nivelejecutado'];
                $importesustitucion[$key] = (double) $value['sustitucion'];
                $importeadicion[$key] = (double) $value['adicion'];
                $importetotalejecutado[$key] = (double) $value['totalejecutado'];
            }

            $dataPlanificado = Array(
                "name" => 'Planificado',
                "type" => 'column',
                "color" => '#33FF12',
                "data" => $importeplan
            );
            $dataEjec = Array(
                "name" => 'Ejecutado por plan',
                "type" => 'column',
                "color" => '#47AFF5',
                "data" => $importeejecutado
            );
            $dataSust = Array(
                "name" => 'Ejecutado por sustitución',
                "type" => 'column',
                "color" => '#c588fc',
                "data" => $importesustitucion
            );
            $dataAdicion = Array(
                "name" => 'Ejecutado por adición',
                "type" => 'column',
                "color" => '#fff720',
                "data" => $importeadicion
            );

            $datat = Array(
                "type" => 'spline',
                "color" => '#FF0000',
                "name" => 'Total ejecutado',
                "data" => $importetotalejecutado
            );
            $series = Array($dataPlanificado, $dataEjec, $dataSust, $dataAdicion, $datat);
            return array('data' => $series, 'categorias' => $categorias);
        }
    }

    //Datos para graficar el tab linea de tiempo LT
    public function LineaTiempo($params) {
        //Obteniendo el listado de las entidades asociadas
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        //Obteniendo los datos de las actividades
        $analisisPlanif = new Analisisplanificacion();
        $datos = $analisisPlanif->graficaLineaTiempo($params);
        //Llamando al método de procesamiento de la Línea de tiempo LT
        return self::AuxLineaTiempo($datos, "Desglose de actividades por fecha", "Actividades", "Nivel de actividad", "Actividad");
    }

    /* Implementacion del servicio para manejar datos de la Línea de tiempo
     * @author: oduran y yorosa
     * @param:
     *  - $datos: Arreglo de datos ﻿ordenados por 'fechainicio', con los campos 'fechainicio', 'valor' y 'denominacion'.
     * Ejemplo:  Array(
     *                   [0] => Array(
     *                       [fechainicio] => 24/05/2014
     *                       [valor] => 500.032
     *                       [denominacion] => Etiqueta 1
     *                   )
     *                   [1] => Array(
     *                       [fechainicio] => 31/12/2016
     *                       [valor] => 315.680
     *                       [denominacion] => Etiqueta 1
     *                   )
     *               )
     * - $titulo: etiqueta que identifica el título de la línea de tiempo a representar; se ubica centrado en la parte superior. Por defecto, $titulo = "Título".
     * - $labelConcepto: etiqueta que identifica el significado de la serie que se representa. Por defecto, $labelValor = "Concepto". [Ej: "Actividades"]
     * - $labelValor: etiqueta que identifica el significado de 'valor', se representa en el eje de las Y. Por defecto, $labelValor = "Valor". [Ej: "Nivel de actividad"]
     * - $labelDenominacion: etiqueta que identifica el concepto que se va a graficar. Por defecto, $labelDenominacion = "Denominacion". [Ej: "Actividad": $valor['denominacion'] ]
     */

    public function AuxLineaTiempo($datos, $titulo = "Título", $labelConcepto = "Concepto", $labelValor = "Valor", $labelDenominacion = "Denominación") {
        $data = Array();
        foreach ($datos as $valor) {
            //Convirtiendo el formato de la fecha '30-12-2016' a UTC
            $fi = str_replace("/", "-", $valor['fechainicio']);
            $fecha = date("Y-m-d", strtotime($fi));
            $date = new DateTime($fecha, new DateTimeZone('UTC'));
            $ts = $date->getTimestamp();
            //Guardando los datos en un arreglo
            $data[] = array(
                "x" => (double) ($ts * 1000),
                "y" => (double) $valor['valor'],
                "name" => $valor['denominacion']
            );
        }
        return array('data' => $data, 'titulo' => $titulo, 'concepto' => $labelConcepto, 'valor' => $labelValor, 'denominacion' => $labelDenominacion);
    }

    //Inventando LT
    public function AuxCrearSerieLineaTiempo($datos, $titulo = "Título", $labelConcepto = "Concepto", $labelValor = "Valor", $labelDenominacion = "Denominación") {
        $cont = count($datos);
        $dataUno = self::AuxGenerarSerie($datos[0]);
        $cont--;
        if ($cont) {
            $dataDos = self::AuxGenerarSerie($datos[1]);
            $cont--;
        }
        if ($cont) {
            $dataTres = self::AuxGenerarSerie($datos[2]);
            $cont--;
        }
        if ($cont) {
            $dataCuatro = self::AuxGenerarSerie($datos[3]);
            $cont--;
        }
        if ($cont) {
            $dataCinco = self::AuxGenerarSerie($datos[4]);
            $cont--;
        }
        return array('dataUno' => $dataUno, 'dataDos' => $dataDos, 'dataTres' => $dataTres, 'dataCuatro' => $dataCuatro, 'dataCinco' => $dataCinco,
            'titulo' => $titulo, 'concepto' => $labelConcepto, 'valor' => $labelValor, 'denominacion' => $labelDenominacion, 'cont' => count($datos));
    }

    public function AuxGenerarSerie($datos) {
        $data = Array();
        foreach ($datos as $valor) {
            //Convirtiendo el formato de la fecha '30-12-2016' a UTC
            $fi = str_replace("/", "-", $valor['fechainicio']);
            $fecha = date("Y-m-d", strtotime($fi));
            $date = new DateTime($fecha, new DateTimeZone('UTC'));
            $ts = $date->getTimestamp();
            //Guardando los datos en un arreglo
            $data[] = array(
                "x" => (double) ($ts * 1000),
                "y" => (double) $valor['valor'],
                "name" => $valor['denominacion']
            );
        }
        return $data;
    }

    //Datos para graficar Histograma
    public function Histograma($params) {
        //Obteniendo el listado de las entidades asociadas        
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }
        //Obteniendo los datos de los desgloses de las actividades por fechas
        $analisisPlanif = new Analisisplanificacion();
        $datos = $analisisPlanif->graficaHistograma($params);
        //Llamando al método de procesamiento del histograma
        $intervalo = 0;
        return self::AuxHistogramaRango($datos, $params['tipo'], $intervalo, "Importe de los centros de balance", "Importe", "Centro de balance");
    }

    /* Implementacion del servicio para manejar datos del Histograma
     * @author: oduran y yorosa
     * @param:
     *  - $datos: Arreglo de datos ﻿ordenados por 'valor', con un campo 'valor' y otro 'denominación'.
     * Ejemplo:  Array(
     *                   [0] => Array(
     *                           [denominacion] => Etiqueta 1
     *                           [valor] => 500.032
     *                   )
     *                   [1] => Array(
     *                           [denominacion] => Etiqueta 2
     *                           [valor] => 100.000
     *                   )
     *               )
     *  - $tipo: entero entre 0 y 3, que define el tipo de histograma a graficar de acuerdo a los siguientes valores. Por defecto, $tipo = 0.
     *          0 = Frecuencia absoluta: el número de veces que aparece un valor.
     *          1 = Frecuencia relativa: el resultado de dividir la frecuencia absoluta de un determinado valor entre el número total de datos.
     *          2 = Frecuencia acumulada: la suma de frecuencias absolutas de todos los valores iguales o inferiores al valor considerado.
     *          3 = Frecuencia relativa acumulada: el resultado de dividir la frecuencia acumulada entre el número total de datos.
     * - $titulo: etiqueta que identifica el título del histograma a representar; se ubica centrado en la parte superior. Por defecto, $titulo = "Título".
     * - $labelValor: etiqueta que identifica el significado de 'valor', se representa en el eje de las Y. Por defecto, $labelValor = "Valor".
     * - $labelDenominacion: etiqueta que identifica el concepto que se va a graficar. Por defecto, $labelDenominacion = "Denominacion".
     */

    public function AuxHistograma($datos, $tipo = 0, $titulo = "Título", $labelValor = "Valor", $labelDenominacion = "Denominación") {
        $cantidad = 0;
        $mayor = $datos[0]['valor'];
        $menor = $datos[0]['valor'];
        foreach ($datos as $valor) {
            //Se llenan los datos del arreglo para el histograma
            $data[] = array((double) $valor['valor']);
            //Se llenan los datos del arreglo para los puntos
            $dataV[] = array(
                "x" => (double) round($valor['valor'], 3),
                "y" => (double) round($valor['valor'], 3),
                "name" => $valor['denominacion']
            );
            $cantidad++;
            if ($valor['valor'] > $mayor)
                $mayor = $valor['valor'];

            if ($valor['valor'] < $menor)
                $menor = $valor['valor'];
        }
        //Cálculo de la longitud de clase para el histograma
        $long = (int) (($mayor - $menor) / ((int) sqrt($cantidad) + 1));
        //Calculando la frecuencia de los datos por clases
        $histo = [];
        $arr = [];
        for ($i = 0; $i < $cantidad; $i++) {
            $x = (int) ($data[$i][0] / $long) * $long;
            if (!$histo[$x]) {
                $histo[$x] = 0;
            }
            $histo[$x] ++;
        }

        //Definiendo el comportamiento para cada tipo de histograma
        $acum = 0;
        $rel = 1;
        if ($tipo == 0) {
            $labelTipo = " absoluta";
        } else {
            if ($tipo == 1) {
                $labelTipo = " relativa";
                $rel = $cantidad;
            } else {
                if ($tipo == 2) {
                    $labelTipo = " acumulada";
                } else {
                    if ($tipo == 3) {
                        $labelTipo = " relativa acumulada";
                        $rel = $cantidad;
                    }
                }
            }
        }
        //Guardando los datos en un arreglo, de acuerdo al tipo de histograma
        foreach ($histo as $x => $value) {
            if ($value != null) {
                $arr[] = array(
                    "x" => (double) $x,
                    "y" => (double) (($acum + $value) / $rel),
                    "finintervalo" => (double) ($x + $long)
                );
                if ($tipo == 2 || $tipo == 3)
                    $acum += $value;
            }
        }
        return array('data' => $arr, 'dataV' => $dataV, 'tipo' => $labelTipo, 'titulo' => $titulo, 'valor' => $labelValor, 'denominacion' => $labelDenominacion);
    }

    /* Implementacion del servicio para manejar datos del Histograma
     * @author: oduran y yorosa
     * @param:
     *  - $datos: Arreglo de datos ﻿ordenados por 'valor', con un campo 'valor' y otro 'denominación'.
     * Ejemplo:  Array(
     *                   [0] => Array(
     *                           [denominacion] => Etiqueta 1
     *                           [valor] => 500.032
     *                   )
     *                   [1] => Array(
     *                           [denominacion] => Etiqueta 2
     *                           [valor] => 100.000
     *                   )
     *               )
     *  - $tipo: entero entre 0 y 3, que define el tipo de histograma a graficar de acuerdo a los siguientes valores. Por defecto, $tipo = 0.
     *          0 = Frecuencia absoluta: el número de veces que aparece un valor.
     *          1 = Frecuencia relativa: el resultado de dividir la frecuencia absoluta de un determinado valor entre el número total de datos.
     *          2 = Frecuencia acumulada: la suma de frecuencias absolutas de todos los valores iguales o inferiores al valor considerado.
     *          3 = Frecuencia relativa acumulada: el resultado de dividir la frecuencia acumulada entre el número total de datos.
     * - $intervalo: variable que representa el valor del intervalo de acuerdo a los siguientes criterios.
     *          Cuando $intervalo = 0. No se especifica la longitud de clase, y se define una amplitud autocalculada.
     *          Cuando $intervalo = $valor; donde $valor es un entero positivo. Se define $valor como la longitud regular de clase. 
     *          Cuando $intervalo = $arregloIntervalos; donde $arregloIntervalos es un arreglo de valores enteros ordenados, tales que el primer elemento sea 0 
     *                              y el último sea mayor que el mayor valor posible en el arreglo $datos. Se definen valores personalizados de clase.
     *                              [Ej: $intervalo = array(0, 25, 90, 100, 1000);]
     * - $titulo: etiqueta que identifica el título del histograma a representar; se ubica centrado en la parte superior. Por defecto, $titulo = "Título".
     * - $labelValor: etiqueta que identifica el significado de 'valor', se representa en el eje de las Y. Por defecto, $labelValor = "Valor".
     * - $labelDenominacion: etiqueta que identifica el concepto que se va a graficar. Por defecto, $labelDenominacion = "Denominacion".
     */

    public function AuxHistogramaRango($datos, $tipo = 0, $intervalo = 0, $titulo = "Título", $labelValor = "Valor", $labelDenominacion = "Denominación") {
        $cantidad = 0;
        $mayor = $datos[0]['valor'];
        $menor = $datos[0]['valor'];
        foreach ($datos as $valor) {
            $enti = $this->integrator->metadatos->DameEstructura($valor['identidad']);
            $data[] = array((double) $valor['valor']);
            $dataV[] = array(
                "x" => (double) round($valor['valor'], 3),
                "y" => (double) round($valor['valor'], 3),
                "name" => $enti[0]->denominacion
            );

            $cantidad++;
            if ($valor['valor'] > $mayor)
                $mayor = $valor['valor'];

            if ($valor['valor'] < $menor)
                $menor = $valor['valor'];
        }
        $histo = [];
        $arr = [];
        //Cálculo de la longitud de clase para el histograma
        if ($intervalo == 0) {
            //Calculando la frecuencia de los datos por clases
            $long = (int) (($mayor - $menor) / ((int) sqrt($cantidad) + 1));
            for ($i = 0; $i < $cantidad; $i++) {
                $x = (int) ($data[$i][0] / $long) * $long;
                if (!$histo[$x]) {
                    $histo[$x] = 0;
                }
                $histo[$x] ++;
            }
        } else {
            if (count($intervalo) < 2) {
                //Calculando la frecuencia de los datos con una amplitud de clase definida
                for ($i = 0; $i < $cantidad; $i++) {
                    $x = (int) ($data[$i][0] / $intervalo) * $intervalo;
                    if (!$histo[$x]) {
                        $histo[$x] = 0;
                    }
                    $histo[$x] ++;
                }
            } else {
                //Calculando la frecuencia de los datos por intervalos
                $long_intervalo = count($intervalo);
                for ($i = 0; $i < $cantidad; $i++) {
                    for ($j = 0; $j < $long_intervalo; $j++) {
                        $temp = $intervalo[$j];
                        $x = $intervalo[$j - 1];
                        if ($data[$i][0] < $temp) {
                            if (!$histo[$x]) {
                                $histo[$x] = 0;
                            }
                            $histo[$x] ++;
                            break;
                        }
                    }
                }
            }
        }

        //Definiendo el comportamiento para cada tipo de histograma
        $acum = 0;
        $rel = 1;
        if ($tipo == 0) {
            $labelTipo = " absoluta";
        } else {
            if ($tipo == 1) {
                $labelTipo = " relativa";
                $rel = $cantidad;
            } else {
                if ($tipo == 2) {
                    $labelTipo = " acumulada";
                } else {
                    if ($tipo == 3) {
                        $labelTipo = " relativa acumulada";
                        $rel = $cantidad;
                    }
                }
            }
        }

        //Guardando los datos en un arreglo, de acuerdo al tipo de histograma
        if ($intervalo == 0) {
            foreach ($histo as $x => $value) {
                if ($value != null) {
                    $arr[] = array(
                        "x" => (double) $x,
                        "y" => (double) (($acum + $value) / $rel),
                        "finintervalo" => (double) ($x + $long)
                    );
                    if ($tipo == 2 || $tipo == 3)
                        $acum += $value;
                }
            }
        } else {
            if (count($intervalo) < 2) {
                //Calculando la frecuencia de los datos con una amplitud de clase definida
                foreach ($histo as $x => $value) {
                    if ($value != null) {
                        $arr[] = array(
                            "x" => (double) $x,
                            "y" => (double) (($acum + $value) / $rel),
                            "finintervalo" => (double) ($x + $intervalo)
                        );
                        if ($tipo == 2 || $tipo == 3)
                            $acum += $value;
                    }
                }
            }
            else {
                foreach ($histo as $x => $value) {
                    if ($value != null) {
                        for ($j = 0; $j < $long_intervalo; $j++) {
                            if ($x == $intervalo[$j])
                                $finintervalo = $intervalo[$j + 1];
                        }
                        $arr[] = array(
                            "x" => (double) $x,
                            "y" => (double) (($acum + $value) / $rel),
                            "finintervalo" => (double) ($finintervalo)
                        );
                        if ($tipo == 2 || $tipo == 3)
                            $acum += $value;
                    }
                }
            }
        }
        return array('data' => $arr, 'dataV' => $dataV, 'tipo' => $labelTipo, 'titulo' => $titulo, 'valor' => $labelValor, 'denominacion' => $labelDenominacion);
    }

    //Plan Residuos
    public function residuos($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        }
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
            $tot = $analisisPlanif->residuosTotal($ent, $params['idejercicio']);
            return $tot[0];
        } else {
            //obteniendo los datos del primer gráfico
            $dat = $analisisPlanif->residuos($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit']);
            foreach ($dat as $key => $value) {
                $categorias[$key] = $value['indicador'];
                $importeTotal[$key] = (double) $value['total'];
            }
            $datat = Array(
                "type" => 'column',
                "name" => 'Importe',
                "data" => $importeTotal
            );
            $series = Array($datat);
            $result = Array($series, $categorias);
            return array('data' => $result[0], 'categorias' => $result[1]);
        }
    }

    //Metodo auxiliar
    public function listarEntidades($idEstructura, $rector) {
        if ($rector == 1) {
            $centbal = DatEntidaddatosnomenclador::getEntidadesCentrosDeBalanceRectorBalance();
            if ($centbal) {
                $i = 0;
                foreach ($centbal as $valor) {
                    $dat[$i]['identidad'] = $valor;
                    $enti = $this->integrator->metadatos->DameEstructura($valor);
                    $dat[$i]['denominacion'] = $enti[0]->denominacion;
                    $i++;
                }
                $datos = $dat;
            } else {
                $datos = 1;
            }
        } else {
            $esCB = DatEntidaddatosnomenclador::getCB1($idEstructura);
            if ($esCB[0]['identidaddatosnomenclador'] != null) {
                $datos[0]['identidad'] = $idEstructura;
                $enti = $this->integrator->metadatos->DameEstructura($idEstructura);
                $datos[0]['denominacion'] = $enti[0]->denominacion;
            } else
                $datos = 1;
        }
        return $datos;
    }

    public function listarPlanes($params) {
        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        $datos = DatModelo::obtenerModelosDadoEntidades($params['identidad']);
        return $datos;
    }

    public function listarCodigoInd($params) {
        $datos = Analisisplanificacion::listarCodigoInd($params);
        return $datos;
    }

    public function listarCB($params) {
        if ($params['rector'] == 1) {
            $centbal = DatEntidaddatosnomenclador::getCB();
            if ($centbal) {
                $i = 0;
                foreach ($centbal as $valor) {
                    $dat[$i]['identidad'] = $valor['identidaddatosnomenclador'];
                    $enti = $this->integrator->metadatos->DameEstructura($valor['identidad']);
                    $dat[$i]['denominacion'] = $enti[0]->denominacion;
                    $i++;
                }
                $datos = $dat;
            } else {
                $datos = 1;
            }
        } else {
            $esCB = DatEntidaddatosnomenclador::getCB1($idEstructura);
            if ($esCB[0]['identidaddatosnomenclador'] != null) {
                $datos[0]['identidad'] = $esCB[0]['identidaddatosnomenclador'];
                $enti = $this->integrator->metadatos->DameEstructura($idEstructura);
                $datos[0]['denominacion'] = $enti[0]->denominacion;
            } else
                $datos = 1;
        }
        return $datos;
    }

    public function listarVias() {
        $datos = NomViaadquisicion::Obtener_via_adquisicion()->data;
        return $datos;
    }

    public function listarOrganos() {
        $datos = NomOrganosatisface::obtenerOS();
        return $datos;
    }

}
