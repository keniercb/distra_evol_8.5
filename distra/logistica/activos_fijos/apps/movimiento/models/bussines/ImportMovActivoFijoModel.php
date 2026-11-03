<?php

$dirWww = str_ireplace('web', 'lib', $_SERVER['DOCUMENT_ROOT']);
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel.php');
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/Excel2007.php');
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/Excel5.php');
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/CSV.php');
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/Excel2003XML.php');
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/OOCalc.php');
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/SYLK.php');
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel/Reader/Gnumeric.php');
include_once($dirWww . '/Adapters/PHPExcel/1.8.0/PHPExcel/IOFactory.php');

class ImportMovActivoFijoModel extends BaseModel
{

    private $_sConfGeneral, $_sConfGenAFT;

    public function __construct()
    {
        parent::__construct();
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_sConfGenAFT = new ConfiguracionActivosService();
    }


    function getRealIP()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        return $_SERVER['REMOTE_ADDR'];
    }

    /**
     *
     */
    public function insertFromExelData($parametros, $idEstructura, $idDocumento, $idCentroCosto)
    { 
        $idCentroCosto = ($idCentroCosto) ? $idCentroCosto : 'null';
        $ip = $this->getRealIP();
        $insertDatImportarTemp = "INSERT INTO mod_logactivofijotangible.dat_importartmp(idindicador, nroserie,
            nroinventario, valorcontable, annofabricacion, fechainicialgarantia, fechafingarantia, recursoconsumido,
            recursoconsumidomax, idcolorprim, idcolorsec, cantidadrecursoconsumido, idactividad,
            idcategoria, fechaadq, fechaexpini, fechaexpfin, valoradquisicion, idestatustecnico,
            depreciacionacumulada, idconsecutivo, iddocumento, direccionip, valorcontablealternativo, valoradquisicionalternativo, denominacion,
            gruposubgrupo, naturaleza, actividad, colorprim, colorsec, denomestadotecnico,vidautil, tasafiscal, porcientorecuperacion, categoria, denomarearesp) VALUES ";


        foreach ($parametros['datos'] as $i => $data) {

            if ($data->fechaadq) {
                $fechaadq = self::tratamientofechaimportar($data->fechaadq);
                if (!$fechaadq) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de adquisici\xf3n');
                }
            } else {
                $fechaadq = 'null';
            }
            if ($data->fechaexpini) {
                $fechaexpini = self::tratamientofechaimportar($data->fechaexpini);
                if (!$fechaexpini) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de explotaci\xf3n inicio');
                }
            } else {
                $fechaexpini = 'null';
            }
            if ($data->fechaexpfin) {
                $fechaexpfin = self::tratamientofechaimportar($data->fechaexpfin);
                if (!$fechaexpfin) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de explotaci\xf3n fin');
                }
            } else {
                $fechaexpfin = 'null';
            }
            
            if ($data->fechainicialgarantia) {
                $fechainicialgarantia = self::tratamientofechaimportar($data->fechainicialgarantia);
                if (!$fechainicialgarantia) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de inicio de garant\xeda');
                }
            } else {
                $fechainicialgarantia = 'null';
            }
            if ($data->fechafingarantia) {
                $fechafingarantia = self::tratamientofechaimportar($data->fechafingarantia);
                if (!$fechafingarantia) {
                    return array("cod" => 5, "cadena" => 'el valor de la fecha de fin de garant\xeda');
                }
            } else {
                $fechafingarantia = 'null';
            }

            $idindicador = ($data->idindicador) ? $data->idindicador : 'Null';
            $depreciacionacumulada = ($data->depreciacionacumulada) ? $data->depreciacionacumulada : 'Null';
            $valoradquisicion = ($data->valoradquisicion) ? $data->valoradquisicion : 0;
            $valorcontable = ($data->valorcontable) ? $data->valorcontable : $valoradquisicion;

            $valoradquisicionalt = ($data->valoradquisicionalternativo) ? $data->valoradquisicionalternativo : 0;
            $valorcontablealt = ($data->valorcontablealternativo) ? $data->valorcontablealternativo : $valoradquisicionalt;

            $idcolorprim = ($data->idcolorprim) ? $data->idcolorprim : 'Null';
            $idcolorsec = ($data->idcolorsec) ? $data->idcolorsec : 'Null';

            $idestatustecnico = ($data->idestatustecnico) ? $data->idestatustecnico : 'Null';

            $idactividad = ($data->idactividad) ? $data->idactividad : 'Null';
            $annofabricacion = ($data->annofabricacion) ? $data->annofabricacion : 'Null';
            $idcategoria = ($data->idcategoria) ? $data->idcategoria : 'Null';
            $recursoconsumido = ($data->recursoconsumido) ? $data->recursoconsumido : 0;
            $cantidadrecursoconsumido = ($data->cantidadrecursoconsumido) ? $data->cantidadrecursoconsumido : 0;
            $nroinventario = ($data->nroinventario) ? "'" .$data->nroinventario . "'"  : 'Null';
            $recursoconsumidomax = ($data->recursoconsumidomax) ? $data->recursoconsumidomax : 0;
            $nroserie = ($data->nroserie) ? "'" . $data->nroserie . "'" : 'Null';
            $denominacion = ($data->denominacion) ? "'" . $data->denominacion . "'" : 'Null';
            $idgruposubgrupo = ($data->gruposubgrupo) ? "'" . $data->gruposubgrupo . "'" : 'Null';
            $idnaturaleza = ($data->naturaleza) ? "'" . $data->naturaleza . "'" : 'Null';
            $actividad = ($data->actividad) ? "'" . $data->actividad . "'" : 'Null';
            $colorprim = ($data->colorprim) ? "'" . $data->colorprim . "'" : 'Null';
            $colorsec = ($data->colorsec) ? "'" . $data->colorsec . "'" : 'Null';
            $denomestadotecnico = ($data->denomestadotecnico) ? "'" . $data->denomestadotecnico . "'" : 'Null';
            $vidautil = ($data->vidautil) ? $data->vidautil : 0;
            $tasafiscal = ($data->tasafiscal) ? $data->tasafiscal : 0;
            $porcientorecuperacion = ($data->porcientorecuperacion) ? $data->porcientorecuperacion : 0;
            $categoria = ($data->categoria) ? "'" . $data->categoria . "'" : 'Null';
            $denomarearesp = ($data->denomarearesp) ? "'" . $data->denomarearesp . "'" : 'Null';
            $dirip = ($ip) ? "'" . $ip ."'" : 'Null';
            $pos = $i +1;
            $insertDatImportarTemp .= "(" . $idindicador . ", " . $nroserie . ", " . $nroinventario . ", " .
                $valorcontable . ", " . $annofabricacion . ", " . $fechainicialgarantia . ", " . $fechafingarantia .
                ", " . $recursoconsumido . ", " . $recursoconsumidomax . "," . $idcolorprim . ", " . $idcolorsec . ", "
                . $cantidadrecursoconsumido . ", " . $idactividad . ", " . $idcategoria . ", " . $fechaadq . ", " .
                $fechaexpini . ", " . $fechaexpfin . ", " . $valoradquisicion . ", " . $idestatustecnico . ", " .
                $depreciacionacumulada . ", " . $pos . ",". $idDocumento . ", " . $dirip . ", ". $valorcontablealt .
                 ", ". $valoradquisicionalt .", ". $denominacion .", ". $idgruposubgrupo .", ". $idnaturaleza .",". 
                 $actividad .",". $colorprim .",". $colorsec .",". $denomestadotecnico .",". $vidautil .",". $tasafiscal .", ". $porcientorecuperacion .", ". $categoria .", ". $denomarearesp .")";

            if ($pos != count($parametros['datos'])) {
                $insertDatImportarTemp .= ", ";
            }
            $parametros['datos'][$i]->idconsecutivo = $pos;
            $parametros['datos'][$i]->iddocumento = $idDocumento;
            $parametros['datos'][$i]->direccionip = $dirip;



        }
        //print_r($insertDatImportarTemp);die;

        // En caso de que todos los datos esten correctos se inserta en la tabla temporal.
        $conn = Zend_Registry::get('conexion');

        $conn->execute($insertDatImportarTemp);

        $regnumactivo = new RegNumActivoService();

        $resp = $regnumactivo->validarAddDatosTemporalesPlugins($parametros['datos']);


        if ($resp["cod"] == 5) {
            return $resp;
        }
        // Mando a inserto en las temporales de los plugins
        $regnumactivo->addDatosTablasTemporalesPlugins($parametros['datos']);


        //Validando que no hallan nrosseries repetidos
        $nroseriesRepetidos = $regnumactivo->validarSeriesRegistrados($conn);
        if (count($nroseriesRepetidos) > 0) {
            $this->clearTempImport();
            return 4;
        }

        //Buscando numeros de series ya existentes
        $nroseriesRepetidos = $regnumactivo->buscarRNInsertadosImportar($conn);
        if (count($nroseriesRepetidos) > 0) {
            $this->clearTempImport();
            return array("cod" => 8, "repetidos" => $nroseriesRepetidos);
        }

        $idEstructuraPadre = $this->global->Estructura->idestructura;
        // Hay que revisar esto, porque si el dat_producto ya existe, no se debe volver a insertar.
       
        $insertDatproducto = "
            INSERT INTO mod_logistica.dat_producto(idestructura, idindicador, cantidad, disponible, idestructuracomun)
            (select distinct coalesce(dp.idestructura," . $idEstructura . ")as idestructura,
            dimp.idindicador, 0, 0,
            " . $idEstructuraPadre . " "
            . "from mod_logactivofijotangible.dat_importartmp dimp
            left join mod_logistica.dat_producto dp on dp.idindicador = dimp.idindicador and dp.idestructura = "
            . $idEstructura . "
            where  dp.idestructura is null)";
         $conn->execute($insertDatproducto);
        //$productosInsertados = $resp->fetchAll (PDO::FETCH_ASSOC);

        $insertMovimiento = "
            INSERT INTO mod_logistica.dat_movimiento(idproducto, cantidad, cronologia, iddocumento)
            select distinct dp.idproducto,
            (select count(imp.idindicador) from mod_logactivofijotangible.dat_importartmp imp
            where dp.idindicador = imp.idindicador),0," . $idDocumento . " from mod_logistica.dat_producto dp inner join
            mod_logactivofijotangible.dat_importartmp dimp on dp.idindicador = dimp.idindicador
            where dp.idestructura = " . $idEstructura . " returning idmovimiento";
       // $conn->execute($insertMovimiento);
        $v = $conn->execute($insertMovimiento)->fetchAll(PDO::FETCH_ASSOC);
       // print_r($v);die;
        

        $regnumactivo->importarDatos($conn, $idEstructura, $idDocumento, $idCentroCosto);
        
    
       $conn->execute("truncate mod_logactivofijotangible.dat_importartmp CASCADE");
        return 1;
    }

    /**
     * Extraer informacion necesaria desde el excel
     *
     * @param string $dirFile Dirección del fichero excel
     *
     * @return array
     */
    public function importarExcel($dirFile)
    {
        $objReader = PHPExcel_IOFactory::createReader('Excel5');

        $objReader->setReadDataOnly(true);
        $objPHPExcel = $objReader->load($dirFile);

        $datos = Array();

        foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {

            $highestRow = $worksheet->getHighestRow();
            $highestColumn = $worksheet->getHighestColumn();
            $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);

            for ($col = 0; $col < $highestColumnIndex; ++$col) {
                for ($row = 1; $row <= $highestRow; ++$row) {

                    $val = $worksheet->getCellByColumnAndRow($col, $row)->getValue();

                    if ($val != "") {
                        if ($row == 1) {
                            $datos[$col]['descripcion'] = $val;
                        } else {
                            $datos[$col]['valores'][] = $val;
                        }
                    } else {
                        if ($row != 1) {
                            $datos[$col]['valores'][] = $val;
                        }
                    }
                }
            }
        }
        return $datos;
    }

    public function obtenerIndicadoresSql($params){
        //print_r($params);die;
        $arrayInd = array();
        $idusuario = $this->global->Perfil->idusuario;
        foreach ($params as $nomb) {
            $select = "                                              
            select distinct 
            i.denominacion ,                                      
            i.idindicador     
            from mod_datosmaestros.nom_indicador i
            inner join mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
            where i.activo = 1 and ih.explotacion = 1 and i.tipo = 1 AND i.denominacion ILIKE '{$nomb}' limit 1
           ";
    
           $datos = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll(PDO::FETCH_ASSOC);
              
           
           if (count($datos) == 0) {
           
                $conn = Zend_Registry::get('conexion');
                $indic = "insert into mod_datosmaestros.nom_indicador
                    (denominacion, descripcion, idformato, idespecialidad, 
                    idnaturaleza, idpadre, idarbol, fechainicio, nivel, idusuario)
                    (select DISTINCT '{$nomb}', '{$nomb}', s.idformato, coalesce((select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                    where cue.idusuario = {$idusuario} limit 1), s.idespecialidad), coalesce(nat.idnaturaleza,s.idnaturaleza), s.idindicador as idpadre,
                    s.idindicador, now(), s.nivel, {$idusuario} from mod_datosmaestros.nom_indicador ni 
                    left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
                    left join (select ind.idformato,ind.idindicador,ind.tipo,ind.idespecialidad,
                            max(pf.nivel) as nivel,ind.idnaturaleza
                        from mod_datosmaestros.nom_indicador ind 
                        inner join mod_datosmaestros.dat_formato f on f.idformato = ind.idformato 
                        inner join mod_datosmaestros.dat_parteformato pf on pf.idformato = f.idformato
                        group by ind.idformato,ind.idindicador,ind.tipo,ind.idespecialidad
                        order by ind.idindicador asc limit 1) s on s.tipo = 1 limit 1
                )returning idindicador"; 
                $abc = $conn->execute($indic)->fetchAll(PDO::FETCH_ASSOC);
                //print_r($abc[0]['idindicador']);die;

                $indich = "insert into mod_datosmaestros.nom_indicadorhoja
                (idindicador, almacenado)
                VALUES ({$abc[0]['idindicador']}, 1)";
                  $conn->execute($indich);

    
                $planif = "insert into mod_datosmaestros.nom_indicadorplanif
                (idindicador, nivelplanif)
                VALUES ({$abc[0]['idindicador']}, 1)";
            
                $conn->execute($planif);


                $indnew = "(select ni.idindicador, ni.denominacion from mod_datosmaestros.nom_indicador ni where ni.denominacion ilike '%{$nomb}%' limit 1)";           
                $dat = LogisticaDoctrineHelper::__init()->getConnection()->execute($indnew)->fetchAll(PDO::FETCH_ASSOC);
                array_push($arrayInd, $dat[0]); 
           } else {
               array_push($arrayInd, $datos[0]); 
           }
        }

      
       /* if($params['query']){
            $select .= " and i.denominacion ilike '{$params['query']}%' ";
        }*/
       /* $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll(PDO::FETCH_ASSOC);
        $datosI = LogisticaDoctrineHelper::__init()->getConnection()->execute($select)->fetchAll(PDO::FETCH_ASSOC);*/
        //array_push($arrayInd, $datosI); 
        if($params['start'])
        {
            $select .=" offset {$params['start']} ";
        }
        if($params['limit'])
        {
            $select .=" limit {$params['limit']} ";
        }
        return array('datos'=>$arrayInd, 'total'=>count($datosI));
    }

    /**
     *
     */
    public function concatenarDatosExcel($param)
    {
        $nomActivoService = new NomencladoresActivosService();
        $coloresSis = $nomActivoService->getColoresHabilitadosEntidad($param['idestructura']);
        $productoModel = new MaestroProductoModel();
        $actividadSis = $nomActivoService->getActividades();
    $marcasSis = $this->_sConfGeneral->obtenerMarcas(array('incluirvencidas' => 2, 'estado' => 1));
     //  print_r($marcasSis);die;
        $modelosSis = $this->_sConfGeneral->obtenerModelos(array('incluirvencidas' => 2,'estado' => 1));
        $categoriaSis = $this->_sConfGenAFT->getCategorias($param['idestructura']);
        $indicadoresSis = $this->obtenerIndicadoresSql($param['datos']);

       // $categoriatransp = $this->obtenerCategoriasTransportacionSql($param['datos'])

        $categoriatransp = new NomCategoriaTransp();
        $getnomcategoriatransp = $categoriatransp->getCategoriaTransp();

       /*if($param['datos'][1]->descripcion){
            foreach ($param['datos'][1]->valores as $den) {
                $indicadoresSis[] = $this->obtenerIndicadoresSql($den); ///pasarle la denomm
            }
        }*/
       /* $indicadoresSis = $productoModel->cargarGridNomenclador(
            array('explotacion' => 1, 'tipo' => 1, 'activo' => 1, 'actual' => true)
        );*/

        if ($param['tipocombustible']){
            $nomTipoCombustible = new NomTipocombustible();
            $combustibleSis = $nomTipoCombustible->ObtenerCombustible();
           // print_r($combustibleSis);die;
        }

        $estadoSis = $nomActivoService->getEstatusTecnicos(
            array('estado' => 1, 'idestructura' => $param['idestructura'])
        );
      
        $marcasExc = $param['datos'][$param['marca']]->valores;
        $modelosExc = $param['datos'][$param['modelo']]->valores;
        $colorSExc = $param['datos'][$param['idcolorsec']]->valores;
        $colorPExc = $param['datos'][$param['idcolorprim']]->valores;
        $actividadExc = $param['datos'][$param['actividad']]->valores;
        $categoriaExc = $param['datos'][$param['idcategoria']]->valores;
        $estadoExc = $param['datos'][$param['idestatustecnico']]->valores;
        $indicadoresExc = $param['datos']['indicador']->valores;
        $categoriaTransExc = $param['datos'][$param['categoriatransp']]->valores;
        if ($param['tipocombustible'])
            $combustibleExc = $param['datos'][$param['tipocombustible']]->valores;


        /*

          $noSerieExc = $param['datos'][$param['noSerie']]->valores;




          $fechaAdqExc = $param['datos'][$param['fechaAdq']]->valores;

          $fechaexpiniExc = $param['datos'][$param['fechaexpini']]->valores;
          $depreciacionacumuladaExc = $param['datos'][$param['depreciacionacumulada']]->valores;
          $tasafiscalExc = $param['datos'][$param['tasafiscal']]->valores;
          $porcientorecuperacionExc = $param['datos'][$param['porcientorecuperacion']]->valores;
          $valorcontableExc = $param['datos'][$param['valorcontable']]->valores;
          $annofabricacionExc = $param['datos'][$param['annofabricacion']]->valores;
          $vidautilExc = $param['datos'][$param['vidautil']]->valores;
          $fechaexpfinExc = $param['datos'][$param['fechaexpfin']]->valores;
          $garantiaExc = $param['datos'][$param['garantia']]->valores;
          $depreciacionExc = $param['datos'][$param['depreciacion']]->valores;
          $recursoconsumidoExc = $param['datos'][$param['recursoconsumido']]->valores;
          $cantidadrecursoconsumidoExc = $param['datos'][$param['cantidadrecursoconsumido']]->valores;
          $importeExc = $param['datos'][$param['importe']]->valores;
          $usufructoExc = $param['datos'][$param['usufructo']]->valores;
          $valoradquisicionExc = $param['datos'][$param['valoradquisicion']]->valores; */

        $datosEnviar = Array();
        $indicadoresXmarcmod = Array();
        $arreglo = (count($marcasExc)>0)? $marcasExc: $indicadoresExc;
      //  print_r([$marcasExc, $param]);die;
        foreach ($arreglo as $keyExcMarca => $mExc) {

            $newObj = self::crearObjetoImportar($param, $keyExcMarca);
            foreach ($marcasSis['datos'] as $keySisMarca => $mSis) {
                if (strcasecmp(trim($marcasExc[$keyExcMarca]), trim($mSis['denominacion'])) == 0) {
                    $newObj->idmarca = $mSis['idmarca'];
                    $newObj->marca = $mSis['denominacion'];
                    break;
                }
            }
            if (!$newObj->idmarca) {
                $newObj->marca = '<span style="color:#ff0800;">' . $marcasExc[$keyExcMarca]
                    . '</span>';
            }


            foreach ($modelosSis['datos'] as $keySisModelo => $moSis) {
                if (strcasecmp(trim($modelosExc[$keyExcMarca]), trim($moSis['denominacion'])) == 0) {
                    $newObj->idmodelo = $moSis['idmodelo'];
                    $newObj->modelo = $moSis['denominacion'];
                    break;
                }
            }

            if (!$newObj->idmodelo) {
                $newObj->modelo = "<span style='color:#ff0800;'>" . $modelosExc[$keyExcMarca]
                    . "</span>";
            }

            if ($newObj->idmarca && $newObj->idmodelo) {
                $objInd = $indicadoresXmarcmod[$newObj->idmarca][$newObj->idmodelo];
                if ($objInd) {
                    $indicador = $objInd;
                }else{
                    $queryInd = $productoModel->cargarGridNomenclador(
                        array('idmarca' => $newObj->idmarca, 'idmodelo' => $newObj->idmodelo), true
                    );
                    $indicadoresXmarcmod[$newObj->idmarca][$newObj->idmodelo] = $queryInd->fetchArray()[0];
                    $indicador = $queryInd->fetchArray()[0];
                }

                if ($indicador) {
                    $newObj->tipomedio = ($indicador['indicador']) ?
                        $indicador['indicador'] . "-"
                        . $indicador['descripcionmarcamodelo'] : $indicador['descripcionmarcamodelo'];
                    $newObj->idindicador = $indicador['idindicador'];
                    $newObj->arearesp = $indicador['arearesp'];
                    $newObj->idarearesp = $indicador['idarearesp'];
                }
            } else {
                
                foreach ($indicadoresSis['datos'] as $keySisIndicador => $indSis) {
                    // if (strcasecmp(trim($indicadoresExc[$keyExcMarca]), trim($indSis['denominacion'])) == 0) {
                         $newObj->idindicador = $indSis['idindicador'];
                         $newObj->tipomedio = $indSis['denominacion'];
                        // break;
                    // }
                 }
                
                $newObj->tipomedio = ($newObj->idindicador) ? $newObj->tipomedio
                    : "<span style='color:#ff0800;'>" . $indicadoresExc[$keyExcMarca] . "</span>";
            }
 

            if ($param['idcolorsec']) {
                foreach ($coloresSis as $keySisColor => $cSis) {
                    if (strcasecmp(trim($colorSExc[$keyExcMarca]), trim($cSis['denominacion'])) == 0) {
                        $newObj->idcolorsec = $cSis['idcolor'];
                        $newObj->colorS = $cSis['denominacion'];
                        break;
                    }
                }
                if (!$newObj->colorS) {
                    $newObj->colorS = '<span style="color:#ff0800;">' . $colorSExc[$keyExcMarca]
                        . '</span>';
                }
            }
            if ($param['idcolorprim']) {
                foreach ($coloresSis as $keySisColor => $cSis) {
                    if (strcasecmp(trim($colorPExc[$keyExcMarca]), trim($cSis['denominacion'])) == 0) {
                        $newObj->idcolorprim = $cSis['idcolor'];
                        $newObj->colorP = $cSis['denominacion'];
                        break;
                    }
                }
                if (!$newObj->colorP) {
                    $newObj->colorP = '<span style="color:#ff0800;">' . $colorPExc[$keyExcMarca]
                        . '</span>';
                }
            }

            
         //  print_r([$param, $getnomcategoriatransp]);die;
            if ($param['categoriatransp']) {
                foreach ($getnomcategoriatransp as $aSis) {
                   if (strcasecmp(trim($param['datos'][$param['categoriatransp']]->valores[$keyExcMarca]), trim($aSis['denominacion'])) == 0) {
                        $newObj->idcategoriatransp = $aSis['idcategoriatransp'];
                        $newObj->categoriatransp = $aSis['denominacion'];
                       break;
                   }
                }
                if (!$newObj->categoriatransp) {
                    $newObj->categoriatransp = '<span style="color:#ff0800;">' . $actividadExc[$keyExcMarca] . '</span>';
                }
            }
            
            if ($param['actividad']) {
                foreach ($actividadSis as $aSis) {
                    if (strcasecmp(trim($actividadExc[$keyExcMarca]), trim($aSis['denominacion'])) == 0) {
                        $newObj->idactividad = $aSis['idactividad'];
                        $newObj->actividad = $aSis['denominacion'];
                        break;
                    }
                }
                if (!$newObj->actividad) {
                    $newObj->actividad = '<span style="color:#ff0800;">' . $actividadExc[$keyExcMarca] . '</span>';
                }
            }

            if ($param['idcategoria']) {
                foreach ($categoriaSis as $catSis) {
                    if (strcasecmp(trim($categoriaExc[$keyExcMarca]), trim($catSis['denominacion'])) == 0) {
                        $newObj->idcategoria = $catSis['idcategoria'];
                        $newObj->categoria = $catSis['denominacion'];
                        break;
                    }
                }
                if (!$newObj->categoria) {
                    $newObj->categoria = '<span style="color:#ff0800;">' . $categoriaExc[$keyExcMarca] . '</span>';
                }
            }

            if ($param['denomestadotecnico']) {
                foreach ($estadoSis as $estSis) {
                    //if (strcasecmp(trim($estadoExc[$keyExcMarca]), trim($estSis['denominacion'])) == 0) {
                        $newObj->idestatustecnico = $estSis['idestatustecnico'];
                        $newObj->estado = $estSis['denominacion'];
                      //  break;
                  //  }
                }

                if (!$newObj->estado) {
                    $newObj->estado = '<span style="color:#ff0800;">' . $estadoExc[$keyExcMarca]
                        . '</span>';
                }

            }


            if ($param['tipocombustible']) {
                foreach ($combustibleSis as $comSis) {
                    if (strcasecmp(trim($combustibleExc[$keyExcMarca]), trim($comSis['denominacion'])) == 0) {
                        $newObj->idtipocombustible = $comSis['idtipocombustible'];
                        $newObj->combustible = $comSis['denominacion'];
                        break;
                    }
                }

                if (!$newObj->idtipocombustible && $combustibleSis[0]) {
                    $newObj->combustible = '<span style="color:#ff0800;">'
                        . $combustibleExc[$keyExcMarca] . '</span>';
                }
            }

            /* $newObj->numeroserie = $noSerieExc[$keyExcMarca];
              $newObj->valoradquisicion = $valoradquisicionExc[$keyExcMarca];
              $newObj->fechaadq = $fechaAdqExc[$keyExcMarca];
              $newObj->fechaexpini = $fechaexpiniExc[$keyExcMarca];
              $newObj->depreciacionacumulada = $depreciacionacumuladaExc[$keyExcMarca];
              $newObj->tasafiscal = $tasafiscalExc[$keyExcMarca];
              $newObj->porcientorecuperacion = $porcientorecuperacionExc[$keyExcMarca];
              $newObj->valorcontable = $valorcontableExc[$keyExcMarca];
              $newObj->annofabricacion = $annofabricacionExc[$keyExcMarca];
              $newObj->vidautil = $vidautilExc[$keyExcMarca];
              $newObj->fechaexpfin = $fechaexpfinExc[$keyExcMarca];
              $newObj->garantia = $garantiaExc[$keyExcMarca];
              $newObj->depreciacion = $depreciacionExc[$keyExcMarca];
              $newObj->recursoconsumido = $recursoconsumidoExc[$keyExcMarca];
              $newObj->cantidadrecursoconsumido = $cantidadrecursoconsumidoExc[$keyExcMarca];
              $newObj->importe = $importeExc[$keyExcMarca];
              $newObj->usufructo = $usufructoExc[$keyExcMarca]; */

            $datosEnviar[] = $newObj;
        }

        return array($datosEnviar, $marcasSis, $modelosSis, $coloresSis,
            $actividadSis, $categoriaSis, $estadoSis, $categoriaSis, $combustibleSis, $indicadoresSis);
    }

    /**
     *
     */
    public function crearObjetoImportar($param, $posicion)
    {
        $newObj = new stdClass();
        $llaves = array_keys($param);
        $array_prueba = array('idtipocombustible', 'idmarca', 'idmodelo', 'idcolorsec', 'idcolorprim', 'idcategoria',
                              'idestatustecnico', 'idactividad', 'idtipocombustible', 'idcategoriatransp');
        foreach ($llaves as $atributo) {
            if ($atributo != 'start' && $param['datos'][$param[$atributo]]) {
                if (!in_array($atributo, $array_prueba)) {
                    $newObj->$atributo = $param['datos'][$param[$atributo]]->valores[$posicion];
                }
            }
        }
        return $newObj;
    }

    /**
     *
     */
    public function clearTempImport()
    {
        $query = new Doctrine_Query();
        $query->delete()->from("DatImportar i")->execute();
    }

    public static function tratamientofechaimportar($fecha)
    {
        $fechaArray = preg_split("/[\/\-]+/", $fecha);
        if (count($fechaArray) == 3) {
            $fecha = "'" . $fechaArray[2] . '-' . $fechaArray[1] . '-' . $fechaArray[0] . "'";
        } else {
            if (count($fechaArray) == 2) {
                $fecha = "'" . $fechaArray[1] . '-' . $fechaArray[0] . '-01' . "'";
            } else {
                if (count($fechaArray) == 1) {
                    $fecha = "'" . $fechaArray[0] . '-01-01' . "'";
                } else {
                    return false;
                }
            }
        }
        return $fecha;
    }

}
