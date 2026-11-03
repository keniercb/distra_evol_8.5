<?php

/**
 *
 */
class RegistroDepreciacionModel extends ZendExt_Model
{
    private $_mComunAFT, $_sRegNumerico, $configuracionHelper, $idsubsistema;

    /**
     *
     */
    public function __construct()
    {
        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->_sRegNumerico = new RegNumericoService();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        
    }

    /**
     *
     */
    public function excelImportToArray($dirFile)
    {
        $objReader = PHPExcel_IOFactory::createReader('Excel5');
        $objReader->setReadDataOnly(true);
        $objPHPExcel = $objReader->load($dirFile);
        $fechaCreacionExcel = date('d/m/Y', $objPHPExcel->getProperties()->getCreated());

        $datos = Array();
        $index = 0;


        foreach ($objPHPExcel->getWorksheetIterator() as $worksheet) {

            $highestRow = $worksheet->getHighestRow();
            $highestColumn = $worksheet->getHighestColumn();
            $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);

            if($highestColumnIndex > 2){
                return false;
            }

            $arrayfila[] = $this->excelImportFor($highestRow, $highestColumnIndex, $worksheet);

            for ($col = 0; $col < $highestColumnIndex; ++$col) {
                for ($row = 1; $row <= $highestRow; ++$row) {
                    $val = $worksheet->getCellByColumnAndRow($col, $row)->getValue();
                    if ($row == 1) {
                        $datos[$index]['descripcion'] = ($val);
                        $datos[$index]['fecha'] = $fechaCreacionExcel;
                    } else {
                        if ($row != 1 && $val != "") {
                            $datos[$index]['valores'][] = ($val);
                        }
                    }
                }
                $index++;
            }


        }

        return array($datos, $arrayfila);
    }


    public function excelImportFor($highestRow, $highestColumnIndex, $worksheet)
    {
        $index = 0;
         for ($row = 1; $row <= $highestRow; ++$row) {

             for ($col = 0; $col < $highestColumnIndex; ++$col) {
                 $val = $worksheet->getCellByColumnAndRow($col, $row)->getValue();
                 if ($val !== "") {
                     $arrayfila[$index][] = $val;
                 }
             }
             $index++;
         }

        return $arrayfila;
    }
    /**
     *
     */
    public function concatenarDatos($parametros)
    {
        $campoFiltrar = $parametros->cmbSistema;
        $arrDatosExcel = $parametros->segundofichero[0];
       // $arrRefCamposES = array();


        //  Busco los datos que estan en el sistema y que estan en el excel
        $arrDatosSistema = self::concatRegNumSistema($campoFiltrar, $arrDatosExcel, $parametros);
        if (count($arrDatosExcel) == 0) {
            return array(array(), $campoFiltrar, array());
        }
        if (count($arrDatosSistema[0]) == 0) {
            return false;
        }

        $datos = $this->validarFechaExcelHistorico($arrDatosSistema[0], $parametros);
        $arrayDiff = array_diff($arrDatosExcel, $arrDatosSistema[1]);
        $index = 0;
        foreach ($arrayDiff as $pos =>$value) {
            $arrValue [$index][$campoFiltrar] = $value;
            $arrValue [$index]['odometro'] = $parametros->primerfichero[0][$pos];
            $arrValue [$index]['fecha'] = $parametros->fecha;
            $index++;

        }
        if (count($datos[0]) == 0 && count($datos[2]) == 0) {
            $concat = $arrValue;
        } else if (count($arrValue) == 0 && count($datos[2]) == 0) {
            $concat = $datos[0];
        } else if (count($arrValue) == 0 && count($datos[0]) == 0) {
            $concat = $datos[2];
        } else {
            $concat = array_merge($arrValue, $datos[0], $datos[2]);
        }

       return array($datos[1], $campoFiltrar, $concat);
    }

    /**
     *
     */
    public function concatRegNumericos($arrRefCamExSis, $arrRegNumericos, $campoFiltrar, $arrDatosSistema, $parametros)
    {
        $key = 0;
        $arrRegNumNoImportados = array();
        foreach ($arrRefCamExSis as $valueReferencias) {

            $flag = false;
            foreach ($arrRegNumericos[0] as $valueSistema) {

                if ($valueReferencias[$campoFiltrar] == $valueSistema[$campoFiltrar]) {
                    $flag = true;
                    $arrRegNumNoImportados[$key][$campoFiltrar] = $valueReferencias[$campoFiltrar];
                    $arrRegNumNoImportados[$key]['odometro'] = $parametros->segundofichero[0][$valueReferencias['pos']];
                    $arrRegNumNoImportados[$key]['denominacion'] = ($valueSistema['denominacion']) ?
                        $valueSistema['denominacion'] : '';
                    $arrRegNumNoImportados[$key]['idregnumerico'] = ($valueSistema['idregnumerico']) ?
                        $valueSistema['idregnumerico'] : '';
                    $arrRegNumNoImportados[$key]['marcamodelo'] = ($valueSistema['descripcionmarcamodelo']) ?
                        $valueSistema['descripcionmarcamodelo'] : '';
                    $arrRegNumNoImportados[$key]['fecha'] = $parametros->fecha;
                    $key++;
                }
            }
            if (!$flag) {
                $arrRegNumNoImportados[$key][$campoFiltrar] = $valueReferencias[$campoFiltrar];
                $arrRegNumNoImportados[$key]['odometro'] = $parametros->segundofichero[0][$valueReferencias['pos']];
                $arrRegNumNoImportados[$key]['denominacion'] = " ";
                $arrRegNumNoImportados[$key]['idregnumerico'] = " ";
                $arrRegNumNoImportados[$key]['marcamodelo'] = " ";
                $arrRegNumNoImportados[$key]['fecha'] = $parametros->fecha;
                $key++;
            }
        }
        $valor = self::getDatosConcatRegNumericos($arrDatosSistema, $parametros, $campoFiltrar);
        return array($valor, $arrRegNumNoImportados);
    }

    /**
     *
     */
    private function getDatosConcatRegNumericos($arrDatosSistema, $parametros, $campoFiltrar)
    {
        $key = 0;
        for ($i = 0; $i < count($arrDatosSistema); $i++) {
            for ($j = 0; $j < count($parametros->primerfichero[0]); $j++) {
                //$valor = self::getDatosConcatRegNumDos($arrDatosSistema, $parametros, $campoFiltrar, $i, $j, $key);
                if ($arrDatosSistema[$i][$campoFiltrar] == $parametros->segundofichero[0][$j]) {
                    if ($parametros->segundofichero[0][$j] == '') {
                        $valor[$key]['odometro'] = 0;
                    } else {
                        $valor[$key]['odometro'] = $parametros->primerfichero[0][$j];
                    }

                    $valor[$key][$campoFiltrar] = $arrDatosSistema[$i][$campoFiltrar];
                    $valor[$key]['denominacion'] = $arrDatosSistema[$i]['denominacion'];
                    $valor[$key]['idregnumerico'] = $arrDatosSistema[$i]['idregnumerico'];
                    $valor[$key]['fecha'] = $parametros->fecha;

                    if ($arrDatosSistema[$i]['descripcionmarcamodelo'] == '') {
                        $valor[$key]['marcamodelo'] = ' ';
                    } else {
                        $valor[$key]['marcamodelo'] = $arrDatosSistema[$i]['descripcionmarcamodelo'];
                    }
                }
            }
            $key++;
        }
        return $valor;
    }

    /**
     *
     */
    private function concatRegNumSistema($campoFiltrar, $arrDatosExcel, $params)
    {
        $sRegNumActivo = new RegNumActivoService();
        $parametros['grid'] = true;
        if ($campoFiltrar != "nroserie") {
            $parametros['arreglomatriculas'] = $arrDatosExcel;
        }
        $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros);

        if ($params->plugins == "Transportacion") {
            $query->whereIn("drna1." . $campoFiltrar, $arrDatosExcel);
        } else {
                $query->whereIn("rn." . $campoFiltrar, $arrDatosExcel);
        }
        //$query->addWhere('net.deprecia = 1  AND nact.iddepreciacion = 1');
        $datos = $query->fetchArray();
        foreach ($datos as $value) {
            $nroserie[] = $value[$campoFiltrar];
        }

        return array($datos, $nroserie);
    }

    /**
     *
     */
    public function getRegNumericoSinRestricciones($arrDatosSistema, $campoFiltrar)
    {
        $sRegNumActivo = new RegNumActivoService();
        $parametros['grid'] = true;

        foreach ($arrDatosSistema as $key => $value) {
            $arrIdesRegNumericos[$key] = $value['idregnumerico'];
            $arrValores[$key] = $value[$campoFiltrar];
        }
        $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros);
        $query->addWhere('net.deprecia = 1 AND nact.iddepreciacion = 2');

        if (count($arrIdesRegNumericos) > 0) {
            $query->WhereNotIn('drna.idregnumerico', $arrIdesRegNumericos);
        }

        return array($query->fetchArray(), $arrValores);
    }

    /**
     *
     */
    public function llenarHistorial($parametro)
    { 
       // print_r($parametro->idregnumerico);die;
        $query = new Doctrine_Query();
        $arridregistros = $parametro->idregnumerico;
        $arrrecursoconsu = $parametro->recursoconsumido;
        // foreach ($parametro->insertar as $key => $dato) {
        //     array_push($arridregistros, $dato->idregnumerico);
        // }
        $arrDatosSistema = self::getRegNumericosDeprecian($arridregistros);
        $collection = new Doctrine_Collection('DatRecursoRegNumericoActivo');

        $historico = $query->select(
            'drna.idregnumerico, r.fecha as fecha, r.idregnumericoactivo as idregnumericoactivo,
            r.cantidad as cantidad, r.lecturarecurso as lecturarecurso, r.cantentregadacomb as cantentregadacomb'
        )
        ->from('DatRegnumericoActivo drna')
        ->innerJoin('drna.DatRecursoRegNumericoActivo r')
        ->where('r.depreciar = 1')
        ->orderBy('r.fecha DESC')
        ->fetchArray();
            self::insertarExcelSistemaHistNull($parametro, $arrDatosSistema, $collection);
        
        return 1;
    }
    public function llenarHistorialforeach($parametro, $historico, $collection)
    {
        foreach ($parametro->insertar as $key => $data) {
            foreach ($historico as $his) {
                $data->idregnumericoactivo = $data->idregnumerico;
                $arrayDat = self::getHistoricoExelValidar($data, $his, $key, $collection);
                $collection = $arrayDat[0];
            }
        }
        return $collection;
    }

    public function getHistoricoExelValidar($data, $his, $key, $collection)
    {
        //print_r(array($data->idrecursoregnumericoactivo,$his['idrecursoregnumericoactivo']));die("cccc");

        if ($data->idregnumerico == $his['idregnumericoactivo']) {
            $flag = true;
            $collection[$key]->cantidad = $data->recursoconsumido;
            $collection[$key]->idregnumericoactivo = $data->idregnumericoactivo;
            $collection[$key]->fecha = $data->fecharecurso;
            $collection[$key]->manual = $data->manual;
            $collection[$key]->depreciar = 1;

            $collection[$key]->cantentregadacomb = ($data->cantentregadacomb != null) ? $data->cantentregadacomb : null;
            $collection[$key]->consumo = ($data->consumo != null) ? $data->consumo : 0;
            $collection[$key]->endeposito = ($data->endeposito != null) ? $data->endeposito : 0;
            $collection[$key]->lecturarecurso = ($his['lecturarecurso'] != 0) ?
                $his['lecturarecurso'] + $data->recursoconsumido :
                $data->cantidadrecursoconsumidoaux + $data->recursoconsumido;
            //$collection[$key]->cantentregada =
            $regNumAFT = Doctrine::getTable('DatRegnumericoActivo')->find($data->idregnumerico);
            $regNumAFT->recursoconsumido = $regNumAFT->recursoconsumido + $data->recursoconsumido;

           if ($data->endeposito && $data->endeposito != null) {
               $regNumAFTTasp = Doctrine::getTable('DatRegnumericoTransp')->find($data->idregnumerico);
              if (count($regNumAFT->toArray()) > 0) {
                  $regNumAFTTasp->endeposito = $data->endeposito;
                  $regNumAFTTasp->save();
              }
           }

          $regNumAFT->save();
        }
        return array($collection, $flag);
    }

    private function insertarExcelSistemaHistNull($parametro, $arrDatosSistema, $collection)
    {
        $conn = Zend_Registry::get('conexion');

        $classEstructura = 'Estructura';
       
        $idestructuracomun = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;

         $fechaa = $conn->fetchAll("select TO_CHAR(f.fecha, 'MM-YYYY') as fecha, f.fecha as fechactual from 
         mod_datosmaestros.dat_fecha f
         inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = f.idestructurasubsist
         where des.idsubsistema = 11 and des.idestructuracomun = '$idestructuracomun'");

        $fechasubsist = $fechaa[0]['fecha'];
        $fechaactual = $fechaa[0]['fechactual'];

        $datoss = $conn->fetchAll("
            Select *
        from mod_logactivofijotangible.dat_recursoregnumericoactivo
        where TO_CHAR(fecha, 'MM-YYYY') = '$fechasubsist'
        ");   
         

        $arrRegistro = array_column($arrDatosSistema, 'idregnumerico');

        for ($i=0; $i < count($parametro->idregnumerico) ; $i++) {
            for ($j=0; $j < count($arrDatosSistema) ; $j++) {
                if ($parametro->idregnumerico[$i] == $arrDatosSistema[$j]['idregnumerico']) {
                    $abc[] = [$parametro->idregnumerico[$i], $parametro->recursoconsumido[$i]];
                    $regNumAFT = "Select * from  mod_logactivofijotangible.dat_recursoregnumericoactivo dr
                    where dr.idregnumericoactivo = {$parametro->idregnumerico[$i]} ";
                    $regNumAFTFetch = $conn->fetchAll($regNumAFT);        
                    if(count($datoss) == 0){
                        $sql = " INSERT INTO
                        mod_logactivofijotangible.dat_recursoregnumericoactivo
                        (
                            idregnumericoactivo,
                            lecturarecurso,
                            cantidad,
                            fecha
                        )
                        VALUES (
                        {$parametro->idregnumerico[$i]},
                        {$parametro->recursoconsumido[$i]},
                        {$parametro->recursoconsumido[$i]},
                        '{$fechaactual}'
                        )";
                        $result = $conn->fetchAll($sql);

                    }     
                     if(count($datoss) > 0){
                        $update = " UPDATE
                        mod_logactivofijotangible.dat_recursoregnumericoactivo rna
                        SET
                        
                           -- idregnumericoactivo = {$parametro->idregnumerico[$i]},
                            lecturarecurso =  {$parametro->recursoconsumido[$i]},
                            cantidad =  {$parametro->recursoconsumido[$i]},
                            fecha = '{$fechaactual}'
                        
                        WHERE idregnumericoactivo = {$parametro->idregnumerico[$i]}

                        ";
                           $conn->execute($update);

                    }                     
                                       
                    }
                }
            }  
    return true;
    }
    
    // private function updateExcelSistemaHistNull($parametro, $arrDatosSistema, $collection)
    // { 
    //     $conn = Zend_Registry::get('conexion');
    //     for ($i=0; $i < count($parametro) ; $i++) {
    //         for ($j=0; $j < count($arrDatosSistema) ; $j++) {
    //             if ($parametro[$i]->idregnumerico == $arrDatosSistema[$j]['idregnumerico']) {
    //                 $regNumAFT = "Select * from  mod_logactivofijotangible.dat_recursoregnumericoactivo 
    //                 where idregnumericoactivo = {$parametro[$i]->idregnumerico} ";
    //                 $regNumAFTFetch = $conn->fetchAll($regNumAFT); 
    //                 if (count($regNumAFTFetch) > 0) {
    //                     $actualizar = "UPDATE mod_logactivofijotangible.dat_recursoregnumericoactivo SET
    //                     lecturarecurso = {$parametro[$i]->recursoconsumido},
    //                     cantidad = cantidad + {$parametro[$i]->recursoconsumido},
    //                     fecha = $fechaGlobal->fechasist 
    //                     WHERE idregnumericoactivo = {$parametro[$i]->idregnumerico} ";
    //                      $result = $conn->fetchAll($actualizar); 
    //                 }
                    
    //             }
    //         }    

    //     } 
    // return true;
    // }

    /**
     *
     */
    private function getRegNumericosDeprecian($arridregistros)
    {
        $sRegNumActivo = new RegNumActivoService();
        $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos(array(), 'drna', $arridregistros);
        //$query->addWhere('net.deprecia = 1'); Porque quiero importar los recursos a cualquier tipo d emedio
        return $query->fetchArray();
    }

    /**
     *
     */
    public function verificarFecha($parametros)
    {
        $datHistorial = $this->getDatHistorial();
        $flagFecha = 1;
        $flagDatos = 1;

        if (count($datHistorial != 0)) {
            foreach ($datHistorial as $value) {
                if ($parametros[0]['fecha'] == $value['fecha']) {

                    return array(0, 1);
                }
            }
        } else {
            if (count($datHistorial) == 0) {
                $flagDatos = 0;
            }
        }

        return array($flagFecha, $flagDatos);
    }

    /**
     *
     */
    public function getDatHistorial()
    {
        $query = Doctrine_Query::create()
            ->select('DISTINCT pg.fecha as fecha')
            ->from('DatRecursoRegNumericoActivo pg')
            ->groupBy('pg.fecha');
        $datos = $query->fetchArray();

        return $datos;
    }

    /**
     *
     */
    public function getDatosGridCentral_old($params)
    {
        $params = (array)$params;
        $conn = Zend_Registry::get('conexion');
        $cRegActivo = new RegistroActivoModel();

        $SELECT = " SELECT
                        i.denominacion,
                        i.idindicador,
                        'Inventario' as denidentificador,
                        rna.*,
                        rnat.*,
                        rec.idrecursoregnumericoactivo,
                        rec.fecha as fecharecurso,
                        COALESCE(rec.cantidad, 0) as recursoconsumido,
                        COALESCE(rec.cantentregadacomb, 0) as cantentregadacomb,
                        COALESCE(rec.consumo, 0) as consumo,
                        COALESCE(rec.lecturarecurso, 0) as lecturarecurso,
                        COALESCE(rec.endeposito,0) as endeposito,
                        (CASE WHEN COALESCE(rec.lecturarecurso, 0) = 0 THEN rna.cantidadrecursoconsumido ELSE rec.lecturarecurso END ) as cantidadrecursoconsumidoaux,
                        (CASE WHEN COALESCE(rec.lecturarecurso, 0) <> 0 THEN rec.lecturarecurso - rna.recursoconsumido ELSE rna.cantidadrecursoconsumido END) as cantidadrecursoconsumido,
                        COALESCE(rnat.indicativo, rnat.nromatricula) as valoridentificador  ";
        $leftWhere = ($params['vista'] == 1) ? " and rec.manual = 0" : " and rec.manual = 1";
        $FROM = " FROM mod_logactivofijotangible.dat_registronumerico rn
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rn.idregnumerico = rna.idregnumerico
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rn.idregnumerico = rnat.idregnumerico

                    INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                    INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                    INNER JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
                    INNER JOIN mod_logactivofijotangible.conf_tipomedio tm on tm.idtipomedio = n.idnaturaleza
                    LEFT JOIN mod_logactivofijotangible.dat_recursoregnumericoactivo rec on rec.idregnumericoactivo = rn.idregnumerico
                        and rec.idrecursoregnumericoactivo = (
                            select b.idrecursoregnumericoactivo from mod_logactivofijotangible.dat_recursoregnumericoactivo b
                            where b.idregnumericoactivo = rn.idregnumerico order by b.fecha desc limit 1
                        ) $leftWhere";
        $WHERE = " WHERE tm.cantidadrecursoconsumido = 1
                    AND p.idestructuracomun = {$params['idestructura']}
                    AND rna.idestadoperacion NOT IN (0,7) ";

        $GROUPBY = " GROUP BY rna.idregnumerico, rnat.idregnumerico, rec.idrecursoregnumericoactivo, i.denominacion, i.idindicador ";


/*
        $SELECT = " select distinct
            drna.idregnumerico, drna.depreciacionacumulada ,drna.vidautil, drna.porcientorecuperacion,
            drna.valorcontable, drna.fechaexpini, drna.fechaexpfin, drna.fechaadq, drna.tasafiscal,
            drna.valoradquisicion, drna.recursoconsumido, drna.cantidadrecursoconsumido,
            drna.nroinventario,drna.recursoconsumidomax, drna.importe, drna.arrendado, drna.valorcontablealternativo,
            drna.valoradquisicionalternativo, drna.depreciacionacumuladaalternativo,drna.valormoduloalternativo,
            rec.idregnumericoactivo, drna.nroinventario, drnat.*, drnat.normacombustible,

            (select max(a.fecha) from mod_logactivofijotangible.dat_recursoregnumericoactivo a
            where a.idregnumericoactivo = drna.idregnumerico) as fecharecurso,

            (select b.idrecursoregnumericoactivo from mod_logactivofijotangible.dat_recursoregnumericoactivo b
            where b.idregnumericoactivo = drna.idregnumerico order by b.fecha desc limit 1),

            (select b.cantidad from mod_logactivofijotangible.dat_recursoregnumericoactivo b
            where b.idregnumericoactivo = drna.idregnumerico order by b.fecha desc limit 1) as recursoconsumido,

            (select b.cantentregadacomb from mod_logactivofijotangible.dat_recursoregnumericoactivo b
            where b.idregnumericoactivo = drna.idregnumerico order by b.fecha desc limit 1) as cantentregadacomb,

            (select b.consumo from mod_logactivofijotangible.dat_recursoregnumericoactivo b
            where b.idregnumericoactivo = drna.idregnumerico order by b.fecha desc limit 1) as consumo,

            (select b.lecturarecurso from mod_logactivofijotangible.dat_recursoregnumericoactivo b
            where b.idregnumericoactivo = drna.idregnumerico order by b.fecha desc limit 1) as lecturarecurso,

            (select b.endeposito from mod_logactivofijotangible.dat_recursoregnumericoactivo b
            where b.idregnumericoactivo = drna.idregnumerico order by b.fecha desc limit 1) as endeposito,

            rn.nroserie, i.denominacion,i.idtabla, i.arridtablas, i.idindicador, cfgId.denominacion as denidentificador,
            cfgId.identificador, cfgId.tipo as tipoidentificador";

        $FROM = " FROM mod_logactivofijotangible.dat_regnumericoactivo drna
                INNER JOIN mod_logactivofijotangible.dat_recursoregnumericoactivo rec ON drna.idregnumerico = rec.idregnumericoactivo
                INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON drna.idregnumerico = rn.idregnumerico
                INNER JOIN mod_logistica.dat_producto p ON rn.idproducto = p.idproducto
                LEFT JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
                LEFT JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                LEFT JOIN mod_logactivofijotangible.conf_identificadormedio cfgId ON i.idindicador = cfgId.idindicador
                LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat
                ON drna.idregnumerico = drnat.idregnumerico  ";*/




        /*$idareas = implode(',', $idareas);
        $WHERE = " WHERE
        drna.idarearesp IN ({$idareas})
        AND i.idnaturaleza NOT IN (-7, -8)
        AND drna.idestadoperacion IN (1, 2, 3, 4)";*/


        $WHERE = $this->getFilter($params, $WHERE);
        $WHERE = $this->getIdentificadorDat($params, $WHERE);
        $orderBy = " order by i.denominacion";
        $sqlDatos = $SELECT.$FROM.$WHERE . $GROUPBY.$orderBy;

        //print_r($sqlDatos);die("Osmel");
        $sqlCount = 'SELECT count (DISTINCT rna.idregnumerico) '.$FROM.$WHERE;
        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
        /*if ($params['limit']) {
            $sqlDatos .= " offset({$params['start']}) limit({$params['limit']})";
        }*/
//print_r($sqlDatos);die;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $total = $total[0]['count'];
/*
        foreach ($datos as &$value) {
            $value['cantidadrecursoconsumidoaux'] = ($value['lecturarecurso']!=0) ?
                $value['lecturarecurso'] : $value['cantidadrecursoconsumido'];
            if ($value['lecturarecurso']!= 0) {
                $value['cantidadrecursoconsumido'] = $value['lecturarecurso'] - $value['recursoconsumido'];
            }
            $atributosDinamicos = $cRegActivo->getConfigDatosDinamicos($value);
            $cRegActivo->obtenerIndentificadorIndicador($atributosDinamicos, $value);

            $regNumAFTTrasp = Doctrine::getTable('DatRegnumericoTransp')->find($value['idregnumericoactivo']);
            $regNumAFTTrasp->endeposito =  $value['endeposito'];
            $regNumAFTTrasp->save();

        }*/
        return array('total' => $total, 'datos' => $datos);
    }

    /**
     *
     */
    public function getDatosGridCentral($params)
    {
        $params = (array)$params;
        $conn = Zend_Registry::get('conexion');
        $cRegActivo = new RegistroActivoModel();
        //print_r($params);die;
        $SELECT = " SELECT
                        i.denominacion,
                        i.idindicador,
                        'Inventario' as denidentificador,
                        rna.*,
                        rnat.*,
                        rna.recursoconsumido as recursoconsumido,
                        rna.cantidadrecursoconsumido as cantidadrecursoconsumido,


                        COALESCE(rnat.indicativo, rnat.nromatricula) as valoridentificador  ";

        $FROM = " FROM mod_logactivofijotangible.dat_registronumerico rn
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rn.idregnumerico = rna.idregnumerico
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rn.idregnumerico = rnat.idregnumerico

                    INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                    INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                    INNER JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
                    INNER JOIN mod_logactivofijotangible.conf_tipomedio tm on tm.idtipomedio = n.idnaturaleza";

        $WHERE = " WHERE tm.cantidadrecursoconsumido = 1
                    AND p.idestructuracomun = {$params['idestructura']}
                    AND rna.idestadoperacion NOT IN (0,7) ";

        $GROUPBY = " GROUP BY rna.idregnumerico, rnat.idregnumerico, i.denominacion, i.idindicador ";


        $WHERE = $this->getFilter($params, $WHERE);
        $WHERE = $this->getIdentificadorDat($params, $WHERE);
        $orderBy = " order by rna.recursoconsumido DESC, i.denominacion";
        $sqlDatos = $SELECT.$FROM.$WHERE . $GROUPBY.$orderBy;

        $sqlCount = 'SELECT count (DISTINCT rna.idregnumerico) '.$FROM.$WHERE;
        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);

        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $total = $total[0]['count'];

        return array('total' => $total, 'datos' => $datos);
    }

    public function getFilter($params, $WHERE)
    {
       // print_r($params);die;
        if ($params['fecharecurso']) {
            $fecha = new DateTime($params['fecharecurso']);
            $fecha = date_format($fecha, 'd/m/Y');
           // print_r($fecha);die;
            $WHERE .= " and rec.fecha = '{$fecha}'";
        }
        if ($params['comparaciones']) {
            foreach ($params['comparaciones'] as $comp) {
                $fecha = new DateTime($comp['valor']);
                $fecha = date_format($fecha, 'd/m/Y');
                $WHERE .= " and rec.fecha {$comp['signo']} '{$fecha}'";
            }
        }
        //print_r($params);die;
        if($params['nroinventario']){
            $WHERE .= " and rna.nroinventario like '%{$params['nroinventario']}%' ";
        }
        if($params['nroserie']){
            $WHERE .= " and rn.nroserie like '%{$params['nroserie']}%' ";
        }
        if($params['nromatricula']){
            $WHERE .= " and rnat.nromatricula like '%{$params['nromatricula']}%' ";
        }
        return $WHERE;
    }

    public function getIdentificadorDat($parametros, $where)
    {

        if ($parametros['valoridentificador']) {
            $where .= " and ";
        }
        $queryaux = Zend_Registry::get('conexion');
        $select = " select DISTINCT confident.identificador, confident.nombretabla";
        $from = " FROM mod_logactivofijotangible.conf_identificadormedio confident";
        $indicadoresmedios = $queryaux->fetchAll($select.$from);

        foreach ($indicadoresmedios as $pos => $item) {
            if ($item['nombretabla'] == "dat_regnumericoactivotransp" && $parametros['valoridentificador']) {
                if (is_numeric($parametros['valoridentificador'])) {
                    $where .= " drnat.{$item['identificador']} = '{$parametros['valoridentificador']}'";
                } else {
                    $where .= " drnat.".$item['identificador']." ILIKE '%".
                    $parametros['valoridentificador']."%'";
                }
            }
            if ($item['nombretabla'] == "dat_regnumericoactivo" && $parametros['valoridentificador']) {
                if (is_numeric($parametros['valoridentificador'])) {
                    $where .= " drna.{$item['identificador']} = '{$parametros['valoridentificador']}'";
                } else {
                    $where .= " drna.{$item['identificador']} ILIKE '%{$parametros['valoridentificador']}%'";
                   /* $where .= " drna.".$item['identificador']." ILIKE '%".
                    $parametros['valoridentificador']."%'";*/
                }
            }
            if ($item['nombretabla'] == "dat_registronumerico" && $parametros['valoridentificador']) {
                if (is_numeric($parametros['valoridentificador'])) {
                    $where .= " rn.{$item['identificador']} = '{$parametros['valoridentificador']}'";
                } else {
                    $where .= " rn.".$item['identificador']." ILIKE '%".
                    $parametros['valoridentificador']."%'";
                }
            }

            if (count($indicadoresmedios) > $pos + 1 && $parametros['valoridentificador']) {
                $where .= " OR ";
            }
        }
        $where .= "";
        return $where;
    }


    public function insertarRegNumInicial()
    {

        $query = new Doctrine_Query();
        $maestroProducto = new MaestroProductoModel();
        $idareas = $this->_mComunAFT->getIdsAreasHijas();
        $query->from("DatRegnumericoActivo drna");
        $query->innerJoin("drna.NomActividadMedio act");
        $query->innerJoin("drna.DatRegnumerico rn");
        $query->innerJoin('rn.DatProductoLogistica p');
        $query->innerJoin('p.DatMovimientos mov');
        $query->innerJoin('mov.DatDocumento dd');
        $maestroProducto->addQueryNomIndicador($query, 'p', 'i', 'ih', false, 'ngsubg');
        $query->whereIn('drna.idarearesp', $idareas);
        $query->addWhere('act.iddepreciacion = 1');
        $query->andWhereNotIn('i.idnaturaleza', array(-7, -8));
        $query->select('drna.idregnumerico');
        $query->addselect('dd.fechacontable as fechacontable');
        $query->addselect('drna.recursoconsumido, drna.cantidadrecursoconsumido');

        $query->andWhereNotIn('drna.idestadoperacion', array(0, 7));
        $datos = $query->fetchArray();




        foreach ($datos as $regnum) {
            $regNumAFT = Doctrine::getTable('DatRecursoRegNumericoActivo')
                ->findByDql('idregnumericoactivo = ?', array($regnum['idregnumerico']));
            $regNumAFTTrasnp = Doctrine::getTable('DatRegnumericoTransp')
                ->findByDql('idregnumerico = ?', array($regnum['idregnumerico']));
            $regNumAFTTrasnp = $regNumAFTTrasnp->toArray();

            if (count($regNumAFT->toArray()) == 0) {
                $obj = new DatRecursoRegNumericoActivo();
                $obj->idregnumericoactivo = $regnum['idregnumerico'];
                $obj->manual = 1;
                $obj->cantidad = $regnum['recursoconsumido'];
                //$obj->odometro = $regnum['recursoconsumido'];
                $obj->fecha = $regnum['fechacontable'];
                $obj->endeposito = $regNumAFTTrasnp[0]['endeposito'];
                if ($regnum['recursoconsumido']) {
                    $obj->lecturarecurso = $regnum['cantidadrecursoconsumido'] + $regnum['recursoconsumido'];
                }
                $obj->save();
            }
        }
    }

    /**
     *
     */
    public function eliminarDatHistorial($datoseliminar)
    {
        ini_set('memory_limit', '�24M');
        $query = Doctrine_Query::create()
            ->select('pg.lecturarecurso,pg.cantidad, pg.idregnumericoactivo, pg.endeposito')
            ->from('DatRecursoRegNumericoActivo pg');
       // if ($vista == 2) {
           // $bandera = true;
            $query->whereIn('pg.idrecursoregnumericoactivo', $datoseliminar);
      /*  } else {
            $query->whereIn('pg.fecha', $datoseliminar);
        }*/

        $datos = $query->fetchArray();


        foreach ($datos as $recursos) {

            $regNumAFT = Doctrine::getTable('DatRegnumericoActivo')->find($recursos['idregnumericoactivo']);
            //$regNumAFTTrasp = Doctrine::getTable('DatRegnumericoTransp')->find($recursos['idregnumericoactivo']);


            if ($recursos['cantidad'] < $regNumAFT->recursoconsumido) {
                $regNumAFT->recursoconsumido = $regNumAFT->recursoconsumido - $recursos['cantidad'];
            } else
                $regNumAFT->recursoconsumido = $recursos['cantidad'] - $regNumAFT->recursoconsumido;

           /* if($regNumAFTTrasp->endeposito > $recursos['cantentregadacomb']){
                $regNumAFTTrasp->endeposito = $regNumAFTTrasp->endeposito - $recursos['cantentregadacomb'];
            }else
                $regNumAFTTrasp->endeposito = $recursos['cantentregadacomb'] - $regNumAFTTrasp->endeposito;

            $regNumAFTTrasp->save();*/
            $regNumAFT->save();
        }
       // if ($bandera) {
            Doctrine_Query::create()->delete()->from('DatRecursoRegNumericoActivo')
                ->whereIn('idrecursoregnumericoactivo', $datoseliminar)->execute();


      /*  } else {
            Doctrine_Query::create()->delete()->from('DatRecursoRegNumericoActivo')
                ->whereIn('fecha', $datoseliminar)->execute();
        }*/

    }

    public function getCantRecConsumidoByIdRegNumerico($idRegNumerico)
    {
        $query = new Doctrine_Query();
        $query->select('SUM(h.cantidad) AS cantidad')
            ->from('DatRecursoRegNumericoActivo h')
            ->where('h.idregnumericoactivo = ?', $idRegNumerico);
        return $query->fetchOne()->cantidad;
    }

    public function cargarCamposIdentificadores()
    {
        $cfgAft = new ConfiguracionActivosService();
        return $cfgAft->getCamposIdentificador();
    }

    public function guardarDatos($datosrecurso)
    {
        foreach ($datosrecurso->insertar as $index => $recursos) {
          /*  $datRecurRegNumericoActivo = Doctrine::getTable('DatRecursoRegNumericoActivo')
                ->findByDql(
                    'idregnumericoactivo =? and fecha = ?',
                    array($recursos->idregnumericoactivo, $recursos->fecharecurso)
                );*/


            $queryaux = Zend_Registry::get('conexion');
            $select = "
                  select rec.idregnumericoactivo, rec.fecha,
                 (
                    CASE WHEN (
                   SELECT recaux.fecha  FROM mod_logactivofijotangible.dat_recursoregnumericoactivo recaux
                   where recaux.idregnumericoactivo = {$recursos->idregnumericoactivo}
                   order by recaux.fecha DESC limit 1
                 ) <= '{$recursos->fecharecurso}' THEN true ELSE false END
                 ) as result,
                 (
                CASE WHEN (SELECT recauxdos.fecha  FROM mod_logactivofijotangible.dat_recursoregnumericoactivo recauxdos
                where recauxdos.idregnumericoactivo = {$recursos->idregnumericoactivo}
                and recauxdos.fecha = '{$recursos->fecharecurso}')IS NOT NULL THEN 1 ELSE 0 END
                ) as fechasiguales
                  FROM mod_logactivofijotangible.dat_recursoregnumericoactivo rec
                  where rec.idregnumericoactivo = {$recursos->idregnumericoactivo} ORDER BY rec.fecha DESC limit 1";

            $indicadoresmedios = $queryaux->fetchAll($select);


            if ($indicadoresmedios[0]['fechasiguales'] == 1) {
                return 3;
            } else {

               if ($indicadoresmedios[0]['result'] != 1){
                    return 4;
               }
            }

           // $datosrecurso->insertar[$index]->odometro = $recursos->recursoconsumido;
            $datosrecurso->insertar[$index]->fecha = $recursos->fecharecurso;
            $datosrecurso->insertar[$index]->idregnumerico = $recursos->idregnumericoactivo;

            //unset($datosrecurso->insertar[$index]->recursoconsumido);
            //unset($datosrecurso->insertar[$index]->fecharecurso);
            unset($datosrecurso->insertar[$index]->cantidadrecursoconsumido);
           // unset($datosrecurso->insertar[$index]->idregnumericoactivo);
        }
        $this->llenarHistorial($datosrecurso);
        return 1;

    }

    /*
     * Validar que los datos que se van a insertar del excel no esten ya insertado en el historico para la fecha
    */

    public function validarFechaExcelHistorico($arrDatosSistema, $parametros)
    {

        foreach ($arrDatosSistema as $value) {

            //buscar los registros numericos del metodo unidades producidas
            $queryActividad = Doctrine_Query::create()
                ->select('a.idactividad')
                ->from('NomActividadMedio a')
                ->where("a.idactividad = {$value['idactividad']}")
                ->addWhere('a.iddepreciacion = 1');
            $actividad = $queryActividad->fetchArray();
            if (count($actividad) == 1) {

                //buscar los datos del excel que ya estan insertados para la fecha
                $queryRecurso = Doctrine_Query::create()
                    ->select('r.*')
                    ->from('DatRecursoRegNumericoActivo r')
                    ->where("r.idregnumericoactivo = {$value['idregnumerico']}")
                    ->addWhere("r.fecha =?", array($parametros->fecha));

                $recurso = $queryRecurso->fetchArray();
               // $value['odometro'] = $recurso[0]['odometro'];
                $value['fecha'] = $recurso[0]['fecha'];

                if (count($recurso) != 0) {

                    $datesta[] = $value;// existe para la fecha
                } else {
                    $value['manual'] = 0;
                    $value['idregnumericoactivo'] = $value['idregnumerico'];
                    $value['idrecursoregnumericoactivo'] = $value['idregnumerico'];
                    $value['cantidadrecursoconsumidoaux'] = $value['cantidadrecursoconsumido'];
                    $value['fecharecurso'] = $parametros->fecha;
                    $value['fecha'] = $parametros->fecha;
                    $recursoExcel = $this->getBuscarRegNumOdometro($value, $parametros);
                    if ($recursoExcel) {
                        $value['cantidad'] = $recursoExcel;
                        $value['recursoconsumido'] = $recursoExcel;
                       // $value['lecturarecurso'] = $recursoExcel + $value['cantidadrecursoconsumido'];
                       // $value['odometro'] = $odometro;
                    }
                    $datnoesta[] = $value;// no existe para la fecha
                }
            } else {
                $metodofalse[] = $value;// metodo de depreciacion distinto al de unidades producidas
            }
        }
        return array($datesta, $datnoesta, $metodofalse);


    }
    public function getBuscarRegNumOdometro($value, $parametros)
    {
        foreach ($parametros->segundofichero[0] as $pos => $valorparams) {
            if ($valorparams == $value[$parametros->cmbSistema]) {
                $odometros = $parametros->primerfichero[0][$pos];
            }
        }
       return $odometros;
    }

    public function obtenerRecuperacionDepreciacion($params)
    {

        $params = (array)$params;
        new CfgIdentificadorMedio();
        new DatRegnumericoTransp();

        $array[] = array('cardinalidad' => 'one',
                         'relation'     => 'DatRegnumericoTransp',
                         'properties'   => array('local'   => 'idregnumerico',
                                                 'foreign' => 'idregnumerico'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatRegnumericoActivo(), $array);

        $cRegActivo = new RegistroActivoModel();
        $maestroProducto = new MaestroProductoModel();
        $query = new Doctrine_Query();
        $query->addSelect('rn.nroserie as nroserie, drna.cantidadrecursoconsumido as cantidadrecursoconsumido');
        $query->addSelect(
            'i.denominacion as denominacion, i.idindicador, p.idproducto,
        rn.idregnumerico, drna.idregnumerico'
        );
        $query->addSelect('cfgId.denominacion as denidentificador');
        $query->addSelect('cfgId.identificador as identificador');
        $query->addSelect('cfgId.tipo as tipoidentificador');

        $query->addSelect('drnat.normacombustible as normacombustible, drnat.endeposito as endeposito');

        $query->addSelect(
            'rregnum.idrecursoregnumericoactivo, rregnum.cantentregadacomb as cantentregadacomb,
            rregnum.consumo as consumo'
        );

        $query->from("DatRecursoRegNumericoActivo rregnum");
        $query->innerJoin("rregnum.DatRegnumericoActivo drna");
        $query->leftJoin("drna.DatRegnumericoTransp drnat");
        $query->innerJoin("drna.DatRegnumerico rn");
        $query->innerJoin('rn.DatProductoLogistica p');
        $maestroProducto->addQueryNomIndicador($query, 'p', 'i', 'ih', false, 'ngsubg');
        $query->leftJoin('i.CfgIdentificadorMedio cfgId');

        $idareas = $this->_mComunAFT->getIdsAreasHijas();
        $query->andWhereIn('drna.idarearesp', $idareas);
        $query->orderBy("i.denominacion,fecha ASC");

        $total = $query->count();

        if ($params["limit"]) {
            $query->limit($params["limit"]);
        }
        if ($params["start"]) {
            $query->offset($params["start"]);
        }

        $datos = $query->fetchArray();
        foreach ($datos as &$value) {
            $atributosDinamicos = $cRegActivo->getConfigDatosDinamicos($value);
            $cRegActivo->obtenerIndentificadorIndicador($atributosDinamicos, $value);

        }

        return array('total' => $total, 'datos' => $datos);
    }

    /*
    * Para calcular las cosas del excel con las que ya estan en el sistema
    * */

    public function getExcelSistemaUpdate($data, $parametros)
    {
        foreach ($data as $value){
            $responsable = Doctrine::getTable('DatRecursoRegNumericoActivo')->findByDql(
                "tipo = ? AND idpersona = ?", array($parametros['tiporesponsable'], $parametros['idpersona'])
            );
            //DatRecursoRegNumericoActivo

        }
    }

    public function buildSqlUpdate($chapa_indicativo, $km){
        return " UPDATE mod_logactivofijotangible.dat_regnumericoactivo drna
                        set recursoconsumido = $km
                    WHERE drna.idregnumerico IN (
                    SELECT rnat.idregnumerico
                    FROM mod_logactivofijotangible.dat_regnumericoactivotransp rnat
                    WHERE
                        rnat.nromatricula like '$chapa_indicativo%'
                        OR rnat.indicativo = '$chapa_indicativo'
                    ); ";
    }

    public function importarKilometrajePorChapaIndicativo($datos){
        $conn = Zend_Registry::get('conexion');
        $sql = "";
        foreach ($datos[1][0] as $key => $value) {
            if(is_numeric($value[1])){
                $sql = $this->buildSqlUpdate($value[0], $value[1]);
                $conn->execute($sql);
            }
        }
    }
}