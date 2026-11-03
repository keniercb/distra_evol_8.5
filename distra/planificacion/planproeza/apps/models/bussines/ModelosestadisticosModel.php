<?php

class ModelosestadisticosModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    //1 Inter-Emi y economía (Clientes priorizados)
    public function interEmiyEconomia($params, $integrator) {

        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        //tipo de grafica: barra
        $dat = Modelosestadisticos::interEmiyEconomia($params);

        foreach ($dat as $key => $value) {
            $enti = $integrator->metadatos->DameEstructura($value['identidadcliente']);
            $categorias[$key] = $enti[0]->denominacion;
            $importemn[$key] = (double) $value['importemn'];
            $importedivisa[$key] = (double) $value['importedivisa'];
        }
        $dataMn = Array(
            "name" => 'MN',
            "type" => 'column',
            "color" => '#33FF12',
            "data" => $importemn
        );
        $dataDivisa = Array(
            "name" => 'MLC',
            "type" => 'column',
            "color" => '#47AFF5',
            "data" => $importedivisa
        );

        $series = Array($dataMn, $dataDivisa);
        $result = Array($series, $categorias);

        return array('data' => $result[0], 'categorias' => $result[1]);
        //}
    }

    //Datos para graficar el tab PlanInter-Emi 
    //2.1 Mayor Cantidad de demandas
    //2.2 Porciento de importe
    public function planInterEmi($params, $integrator) {

        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }

        //2.1 obteniendo los datos del primer gráfico 
        //tipo de grafica: linea
        $data = Modelosestadisticos::planInterEmiMayorCantdemandas($params);
        foreach ($data as $key => $value) {

            $enti = $integrator->metadatos->DameEstructura($value['identidadproveedor']);
            $categorias[$key] = $enti[0]->denominacion;
            $cantidad[$key] = (double) $value['cantdemandas'];
        }
        $arr = Array(
            "name" => 'Proveedores',
            "type" => 'column',
            "color" => '#33FF12',
            "data" => $cantidad
        );
        $series = Array($arr);
        $result = Array($series, $categorias);

        //2.2 obteniendo los datos del segundo gráfico   
        //tipo de grafica: pastel
        $colors = array('#47AFF5', '#33FF12', '#c588fc', '#fff720', '#F7B9FF', '#7eb1b8', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');
        $dataV = Modelosestadisticos::planInterEmiMayorPorcientoImportes($params);

        $datosgrafica = array();
        foreach ($dataV as $k => $dato) {
            $enti = $integrator->metadatos->DameEstructura($dato['identidadproveedor']);
            $datosgrafica[$k]['name'] = $enti[0]->denominacion;
            $datosgrafica[$k]['color'] = $colors[$k];
            $datosgrafica[$k]['y'] = (float) $dato['porcientoimportetotal'];
        }
        return array('data' => $result[0], 'dataV' => $datosgrafica, 'categorias' => $result[1]);
    }

    //Datos para graficar el tab Plan de la economia
    //3.1 clientes importe 
    //3.2 clientes porciento
    public function planEconomia($params, $integrator) {

        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        //3.1 obteniendo los datos del primer gráfico 
        //tipo de grafica: barra
        $data = Modelosestadisticos::planEconomiaImportes($params);

        foreach ($data as $key => $value) {
            $enti = $integrator->metadatos->DameEstructura($value['identidadcliente']);
            $categorias[$key] = $enti[0]->denominacion;
            $importemn[$key] = (double) $value['importemn'];
            $importedivisa[$key] = (double) $value['importedivisa'];
        }
        $dataMn = Array(
            "name" => 'MN',
            "type" => 'column',
            "color" => '#33FF12',
            "data" => $importemn
        );
        $dataDivisa = Array(
            "name" => 'MLC',
            "type" => 'column',
            "color" => '#47AFF5',
            "data" => $importedivisa
        );

        $series = Array($dataMn, $dataDivisa);
        $result = Array($series, $categorias);

        //3.2 obteniendo los datos del segundo gráfico   
        //tipo de grafica: pastel
        $colors = array('#c588fc', '#47AFF5', '#33FF12', '#fff720', '#F7B9FF', '#7eb1b8', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');
        $dataV = Modelosestadisticos::planEconomiaPorcientoImportes($params);

//        $categorias[] = 'Porciento del importe total';
//        foreach ($dataV as $key => $valor) {
//            // $arrtemV = array();
//            // $arrtemV[] = (double) $valor['porcientoimportetotal'];
//            $enti = $integrator->metadatos->DameEstructura($valor['identidadcliente']);
//            $arrV[$key]['name'] = $enti[0]->denominacion;
//            $arrV[$key]['data'] = $valor['porcientoimportetotal'];
//            $arrV[$key]['color'] = $colors[$key];
//        }
        $datosgrafica = array();
        foreach ($dataV as $k => $dato) {
            $enti = $integrator->metadatos->DameEstructura($dato['identidadcliente']);
            $datosgrafica[$k]['name'] = $enti[0]->denominacion;
            $datosgrafica[$k]['color'] = $colors[$k];
            $datosgrafica[$k]['y'] = (float) $dato['porcientoimportetotal'];
        }
        return array('data' => $result[0], 'dataV' => $datosgrafica, 'categorias' => $result[1]);

//        return array('data' => $result[0], 'dataV' => $arrV, 'categorias' => $result[1]);
    }

    //Datos para graficar el tab Producciones Captadas 
    //4.1 Cantidad de demandas aprobadas contra las que no
    //4.2 Importe de demandas aprobadas contra las que no
    public function produccionesCaptadas($params) {

        //4.1 obteniendo los datos del primer gráfico 
        //tipo de grafica: barra
        $data = Modelosestadisticos::cantidadProduccionesCaptadas($params);
        $datos = array();
        $datos[] = array(
            'y' => (double) $data[0]['aprobadorector'],
            'color' => '#33FF12',
        );
        $datos[] = array(
            'y' => (double) $data[0]['otrasaprobaciones'],
            'color' => '#47AFF5'
        );
        //4.2 obteniendo los datos del 2do gráfico 
        //tipo de grafica: barra
        $dataImporte = Modelosestadisticos::importeProduccionesCaptadas($params);
        $datosb = array();
        $datosb[] = array(
            'y' => (double) $dataImporte[0]['importeaprobadorector'],
            'color' => '#33FF12',
        );
        $datosb[] = array(
            'y' => (double) $dataImporte[0]['importeotrasaprobaciones'],
            'color' => '#47AFF5'
        );
        return array('data' => $datos, 'dataV' => $datosb);
    }

    //5 Datos para graficar el tab Producciones atrasadas/sobrecumplimientos (Control)
    public function produccionesAtrasadasSobrecumplimientos($params, $integrator) {
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        //tipo de grafica: barra
        $data = Modelosestadisticos::produccionesAtrasadasSobrecumplimientos($params);
        foreach ($data as $key => $value) {
            $enti = $integrator->metadatos->DameEstructura($value['identidadproveedor']);
            $categorias[$key] = $enti[0]->denominacion;
            $cantcumplimiento[$key] = (double) $value['cantcumplimiento'];
        }
        //atraso
        if ($params['atraso'] == 1) {
            $name = 'Atrasos';
            $color = '#FFCCAA';
        } else {
            //Sobrecumplimiento
            $name = 'Sobrecumplimientos';
            $color = '#33FF12';
        }
        $datacumplimiento = Array(
            "name" => $name,
            "type" => 'column',
            "color" => $color,
            "data" => $cantcumplimiento
        );
        $series = Array($datacumplimiento);
        $result = Array($series, $categorias);
        return array('data' => $result[0], 'categorias' => $result[1]);
    }

    //7.1 Plan Vs Real Semestre
    //7.2 Plan Vs Real Trimestre
    //7.3 Plan Vs Real Mes
    public function planVsReal($params) {

        //obteniendo los datos para todos los gráficos 
        //tipo de grafica: barra
        $data = Modelosestadisticos::planVsReal($params);

        //trabajo con los datos de los semestres
        $importeplan[0] = (double) $data[0]['plan1semestre'];
        $importeplan[1] = (double) $data[0]['plan2semestre'];
        $importereal[0] = (double) $data[0]['real1semestre'];
        $importereal[1] = (double) $data[0]['real2semestre'];

        $plan = Array(
            "name" => 'Plan',
            "type" => 'column',
            "color" => '#33FF12',
            "data" => $importeplan
        );
        $real = Array(
            "name" => 'Real',
            "type" => 'column',
            "color" => '#47AFF5',
            "data" => $importereal
        );
        $series = Array($plan, $real);
        $result = Array($series);

        //trabajo con los datos de los meses
        $importeplanMes[0] = (double) $data[0]['importeplanenero'];
        $importeplanMes[1] = (double) $data[0]['importeplanfebrero'];
        $importeplanMes[2] = (double) $data[0]['importeplanmarzo'];
        $importeplanMes[3] = (double) $data[0]['importeplanabril'];
        $importeplanMes[4] = (double) $data[0]['importeplanmayo'];
        $importeplanMes[5] = (double) $data[0]['importeplanjunio'];
        $importeplanMes[6] = (double) $data[0]['importeplanjulio'];
        $importeplanMes[7] = (double) $data[0]['importeplanagosto'];
        $importeplanMes[8] = (double) $data[0]['importeplanseptiembre'];
        $importeplanMes[9] = (double) $data[0]['importeplanoctubre'];
        $importeplanMes[10] = (double) $data[0]['importeplannoviembre'];
        $importeplanMes[11] = (double) $data[0]['importeplandiciembre'];
        $importerealMes[0] = (double) $data[0]['realenero'];
        $importerealMes[1] = (double) $data[0]['realfebrero'];
        $importerealMes[2] = (double) $data[0]['realmarzo'];
        $importerealMes[3] = (double) $data[0]['realabril'];
        $importerealMes[4] = (double) $data[0]['realmayo'];
        $importerealMes[5] = (double) $data[0]['realjunio'];
        $importerealMes[6] = (double) $data[0]['realjulio'];
        $importerealMes[7] = (double) $data[0]['realagosto'];
        $importerealMes[8] = (double) $data[0]['realseptiembre'];
        $importerealMes[9] = (double) $data[0]['realoctubre'];
        $importerealMes[10] = (double) $data[0]['realnoviembre'];
        $importerealMes[11] = (double) $data[0]['realdiciembre'];

        $planMes = Array(
            "name" => 'Plan',
            "type" => 'column',
            "color" => '#33FF12',
            "data" => $importeplanMes
        );
        $realMes = Array(
            "name" => 'Real',
            "type" => 'column',
            "color" => '#47AFF5',
            "data" => $importerealMes
        );
        $seriesMes = Array($planMes, $realMes);
        $resultMes = Array($seriesMes);

        //trabajo con los datos de los trimestres
        $importeplanTrim[0] = (double) $data[0]['plan1trimestre'];
        $importeplanTrim[1] = (double) $data[0]['plan2trimestre'];
        $importeplanTrim[2] = (double) $data[0]['plan3trimestre'];
        $importeplanTrim[3] = (double) $data[0]['plan4trimestre'];
        $importerealTrim[0] = (double) $data[0]['real1trimestre'];
        $importerealTrim[1] = (double) $data[0]['real2trimestre'];
        $importerealTrim[2] = (double) $data[0]['real3trimestre'];
        $importerealTrim[3] = (double) $data[0]['real4trimestre'];

        $planTrim = Array(
            "name" => 'Plan',
            "type" => 'column',
            "color" => '#33FF12',
            "data" => $importeplanTrim
        );
        $realTrim = Array(
            "name" => 'Real',
            "type" => 'column',
            "color" => '#47AFF5',
            "data" => $importerealTrim
        );
        $seriesTrim = Array($planTrim, $realTrim);
        $resultTrim = Array($seriesTrim);

        return array('dataSem' => $result[0], 'dataMes' => $resultMes[0], 'dataTrim' => $resultTrim[0]);
    }

    // Datos para graficar el tab Programas 
    // 8.1 % del total de demandas corresponde a cada programa 
    // 8.2 Importe que corresponde a cada programa
    // 9.1 % del total de demandas corresponde a cada Destino 
    // 9.2 Importe que corresponde a cada Destino

    public function programasODestinos($params) {
        if ($params['orden'] == 1) {
            $params['orden'] = "DESC";
        } else {
            $params['orden'] = "ASC";
        }
        if ($params['clasificacion'] == 'idprograma') {
            //Programas
            $data_programas = DemandaproduccionModel::cargarProgramas();
            $params['array_clasificacion'] = array();
            foreach ($data_programas as $programa) {
                $params['array_clasificacion'][$programa['iddatosnomenclador']] = $programa['denominacion'];
            }
            unset($data_programas);
        } else {
            //Destinos
            $data_destinos = DemandaproduccionModel::cargarDestinos();
            $params['array_clasificacion'] = array();
            foreach ($data_destinos as $destino) {
                $params['array_clasificacion'][$destino['iddatosnomenclador']] = $destino['denominacion'];
            }
            unset($data_destinos);
        }


        //8.1 y 9.1 obteniendo los datos del primer gráfico 
        //tipo de grafica: barra
        $data = Modelosestadisticos::programasODestinosPorciento($params);
       
        foreach ($data as $key => $value) {
            //$enti = $this->integrator->metadatos->DameEstructura($value['identidadcliente']);
            if ($params['clasificacion'] == 'idprograma') {
                $categorias[$key] = $params['array_clasificacion'][$value['idprograma']];
            } else {
                $categorias[$key] = $params['array_clasificacion'][$value['iddestino']];
            }
            $porciento[$key] = (double) $value['porciento'];
        }
        $dataPorciento = Array(
            "name" => 'Porciento',
            "type" => 'column',
            "color" => '#33FF12',
            "data" => $porciento
        );

        $series = Array($dataPorciento);
        $result = Array($series, $categorias);

        //3.2 obteniendo los datos del segundo gráfico   
        //tipo de grafica: barra
        //8.2 y 9.2 obteniendo los datos del 2do gráfico 
        //tipo de grafica: barra
        $dataImp = Modelosestadisticos::programasODestinosImporte($params);
        
        foreach ($dataImp as $key => $value) {
            if ($params['clasificacion'] == 'idprograma') {
                $categorias[$key] = $params['array_clasificacion'][$value['idprograma']];
            } else {
                $categorias[$key] = $params['array_clasificacion'][$value['iddestino']];
            }
            $importemn[$key] = (double) $value['importe'];
            $importedivisa[$key] = (double) $value['importetotaldivisa'];
        }
        $dataMn = Array(
            "name" => 'MN',
            "type" => 'column',
            "color" => '#33FF12',
            "data" => $importemn
        );
        $dataDivisa = Array(
            "name" => 'MLC',
            "type" => 'column',
            "color" => '#47AFF5',
            "data" => $importedivisa
        );

        $series1 = Array($dataMn, $dataDivisa);
        $result1 = Array($series1, $categorias);
        return array('data' => $result[0], 'dataImp' => $result1[0], 'categorias' => $result[1]);
    }

}
