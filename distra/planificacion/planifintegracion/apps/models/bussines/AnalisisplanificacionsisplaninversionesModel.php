<?php

class AnalisisplanificacionsisplaninversionesModel extends AnalisisplanificacionModel {
    /*     * ****Actividad - Niveles de actividad******************* */

    public function actNivelesActividad($params) {
        $analisisPlanif = new Analisisplanificacionsisplaninversiones();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatBasescalculoModel::auxObtenerEntidadesHijas($params['identidad']);
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

    /*     * ****Niveles de actividad******************* */

    public function nivelesActividad($params) {

        $analisisPlanif = new Analisisplanificacionsisplaninversiones();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatBasescalculoModel::auxObtenerEntidadesHijas($params['identidad']);
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
                $importeInversiones[$key] = (double) $value['nivelinv'];
                $importeProyecto[$key] = (double) $value['nivelproyecto'];
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
            $dataInversion = Array(
                "name" => 'Inversión',
                "type" => 'column',
                "color" => '#fff720',
                "data" => $importeInversiones
            );
            $dataProyecto = Array(
                "name" => 'Proyecto',
                "type" => 'column',
                "color" => '#808080',
                "data" => $importeProyecto
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
            $series = Array($dataAuto, $dataManual, $dataInversion, $dataProyecto, $dataAjuste, $datat);

            $result = Array($series, $categorias);

            //obteniendo los datos del segundo gráfico
            $datV = $analisisPlanif->nivelesMasValiosos($ent, $params['idejercicio'], $params['orden'], $params['start'], $params['limit'], $params);

            foreach ($datV as $key => $value) {
                $categoriasV[$key] = $value['actividad'];
                $importeAutoV[$key] = (double) $value['importenivelauto'];
                $importeManualV[$key] = (double) $value['importenivelmanual'];
                $importeAjusteV[$key] = (double) $value['importeajuste'];
                $importeInversionV[$key] = (double) $value['importenivelinv'];
                $importeProyectoV[$key] = (double) $value['importenivelproyecto'];
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
            $dataInversionV = Array(
                "name" => 'Inversión',
                "type" => 'column',
                "color" => '#fff720',
                "data" => $importeInversionV
            );
            $dataProyectoV = Array(
                "name" => 'Proyecto',
                "type" => 'column',
                "color" => '#808080',
                "data" => $importeProyectoV
            );

            $datatV = Array(
                "type" => 'spline',
                "name" => 'Total',
                "color" => '#FF0000',
                "data" => $importeTotalV
            );

            $seriesV = Array($dataAutoV, $dataManualV, $dataInversionV, $dataProyectoV, $dataAjusteV, $datatV);

            $resultV = Array($seriesV, $categoriasV);

            return array('data' => $result[0], 'categorias' => $result[1], 'dataV' => $resultV[0], 'categoriasV' => $resultV[1]);
        }
    }

    //Datos para graficar el tab CE - NA - global * entidad
    public function graficarCENAglobalEntidad($params) {
        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatBasescalculoModel::auxObtenerEntidadesHijas($params['identidad']);
        }
        array_push($entidades, $params['identidad']);
        $var = implode(',', $entidades);
        $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
        if ($params['identidad'][0] == null) {
            return 0;
        }

        $params['uri'] = 0;
        $data = Analisisplanificacionsisplaninversiones::graficaEjecucionglobalxentidadAct($params);

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

    //Datos para graficar el tab CE - NA - mas valiosas
    public function CENAmasValiosos($params) {

        $analisisPlanif = new Analisisplanificacion();
        $entidades = array();
        if ($params['global'] == 'true') {
            $entidades = DatBasescalculoModel::auxObtenerEntidadesHijas($params['identidad']);
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

            $data = Analisisplanificacionsisplaninversiones::graficaEjecucionMasValiososAct($params);

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
            $entidades = DatBasescalculoModel::auxObtenerEntidadesHijas($params['identidad']);
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

            $data = Analisisplanificacionsisplaninversiones::graficaIndicadoresMasEjecutadosAct($params);

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
            $entidades = DatBasescalculoModel::auxObtenerEntidadesHijas($params['identidad']);
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

            $data = Analisisplanificacionsisplaninversiones::graficaEjecucionglobalxentidadxAct($params);

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

            $series = Array($dataPlanificado, $dataEjec, $dataSust,
                $dataAdicion, $datat);

            return array('data' => $series, 'categorias' => $categorias);
        }
    }

}
