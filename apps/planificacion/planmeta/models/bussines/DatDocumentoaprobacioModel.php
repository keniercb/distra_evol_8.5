<?php

class DatDocumentoaprobacioModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function insertardat_documentoaprobacion($datDocumentoaprobacion) {

        $datDocumentoaprobacion->save();
        return $datDocumentoaprobacion->iddocumentoaprobacion;
    }

    public function modificardat_documentoaprobacion($arraydatosdoc, $iddocumento
    ) {
        foreach ($arraydatosdoc as $datosdocumento) {
            $objdocaprobCD = new DatControldivisadocumentoaprobacion();
            $objdocaprobCD->idcontroldivisa = (isset($datosdocumento->idcontroldivisa)) ? $datosdocumento->idcontroldivisa : $datosdocumento['idcontroldivisa'];
            $objdocaprobCD->importe = (isset($datosdocumento->importe)) ? $datosdocumento->importe : $datosdocumento['importe'];
            $objdocaprobCD->iddocumentoaprobacion = $iddocumento;
            $objdocaprobCD->save();

            $objdocVia = new DatControldivisadocumentoviaadquisicion();
            $objdocVia->idcontroldivisadocumentoaprobacion = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
            $objdocVia->idviaadquisicion = (isset($datosdocumento->idvia)) ? $datosdocumento->idvia : $datosdocumento['idvia'];
            $objdocVia->save();

            if ($datosdocumento->idconceptoplan) {
                $objdocModelo = new DatControldivisadocumentomodelo();
                $objdocModelo->identidadmodelo = (isset($datosdocumento->idconceptoplan)) ? $datosdocumento->idconceptoplan : $datosdocumento['idconceptoplan'];
                $objdocModelo->idcontroldivisadocumentoaprobacion = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
                $objdocModelo->save();
            }
        }
        return 1;
    }

    public function eliminardat_documentoaprobacion($datDocumentoaprobacion) {
        $datDocumentoaprobacion->delete();
    }

    public function verDocumentoManual($iddocumento, $start, $limit, $parametros
    ) {
        $resul = DatDocumentoaprobacion::getdatosDocumentoManual(
                        $parametros, $iddocumento, $start, $limit
        );
        return $resul;
    }

    public function verDocumentototal($identidad, $iddocumento, $parametros) {
        return DatDocumentoaprobacion::cuerpoDocumentototal(
                        $identidad, $iddocumento, $parametros
        );
    }

    public function gestPermisos($params) {

        $query = Doctrine_Query::create();
        $query->select(
                'dpfe.insertar as insertar, dpfe.modificar as modificar,'
                . ' dpfe.eliminar as eliminar, dpfe.guardar as guardar,'
                . 'dpf.idprocesofuncionalidad,dpfe.idprocesofuncionalidadentidad'
                . ',dpfest.idprocesofuncionalidadestado'
        )->from('DatProcesofuncionalidad dpf')->innerjoin(
                'dpf.DatProcesofuncionalidadestado dpfest'
        )->innerjoin('dpfest.DatProcesofuncionalidadentidad dpfe')->where(
                "dpfest.idejercicio = ?  AND dpfe.identidad = ? AND dpfest.activo = 1
                    AND dpf.referencia LIKE '%" . ($params['idfuncionalidad'])
                . "' ", array($params['idejercicio'], $params['identidad'])
        )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();

        return $result;
    }

    public function eliminar($id) {
        $query = Doctrine_Query::create();
        $queryPRIMERO = Doctrine_Query::create();
        $query->addWhere('ap.idaprobacion <> 4');
        $query->delete('DatDocumentoaprobacion ap')->whereIn(
                'ap.iddocumentoaprobacion', $id
        );
        $res = $query->execute();
        if ($res) {
            $queryPRIMERO->delete('DatDocumentoaprobcontroldivisaindicador ap')
                    ->whereIn('ap.iddocumentoaprobacion', $id);
            return $queryPRIMERO->execute();
        } else {
            return $res;
        }
    }

    public function AprobarDesaprobar($iddocumento, $aprobacion) {
        $query = Doctrine_Query::create();
        if ($aprobacion) {

            $query->update('DatDocumentoaprobacion')->set(
                    'idaprobacion', $aprobacion
            )->where(
                    'iddocumentoaprobacion=?', $iddocumento
            );
            return $query->execute();
        }
    }

    public function cuerpoDocumento($identidad, $iddocumento, $start, $limit) {
        $result = DatDocumentoaprobacion::getIndicadoresDocumento(
                        $identidad, $iddocumento, $start, $limit
        );

        return $result;
    }

    public function listarOperaciones($aprobacion, $ejercicio, $identidad) {
        $result = DatDocumentoaprobacion::listarOperaciones($aprobacion, $ejercicio, $identidad);
        return $result;
    }

    public function listarTipoAprobacion($accion, $identidad, $parametros) {
        $result = DatDocumentoaprobacion::listarTipoAprobacion(
                        $accion, $identidad, $parametros
        );
        return $result;
    }

    public function listarNaturalezadelindicador($parametros) {
        $result = DatDocumentoaprobacion::listarnaturaleza(
                        $parametros
        );



        return $result;
    }

    public function listarAprobaciones() {
        $centbal = DatEntidaddatosnomenclador::getCB();

        $i = 0;
        $dat = array();

        if ($centbal) {
            foreach ($centbal as $valor) {
                $dat[$i]['id'] = $valor['identidad'];
                $enti = $this->integrator->metadatos->DameEstructura(
                        $valor['identidad']
                );
                $dat[$i]['text'] = $enti[0]->denominacion;

                $dat[$i]['leaf'] = true;
                $i++;
            }
            $datos = $dat;
        } else {
            $datos = 1;
        }
        return $datos;
    }

    public function generardatosreporte($parametros) {
        $result = DatDocumentoaprobacion::listarmanual(
                        $parametros);
        $resultautom = DatDocumentoaprobacion::listarautomatico(
                        $parametros);
        $datos = self::limpiarautom($resultautom);
        $resultado = array_merge($result, $datos);
        //aki uno todas las posiciones de arreglo que tengan una misma entidad
        $resultado = self::unirporentidad($resultado);

        //aki preparo por via de adquisición
        foreach ($resultado as $key => $result) {
            $resultado[$key] ['datos'] = self::unirporviaadquisicion($result['datos']);
        }
        $pendadistrib = DatDocumentoaprobacion::pdtadistribuirautomatico(
                        $parametros);
        $pendadistrib = self::limpiarautom($pendadistrib);
        $pendadistrib = self::unirporentidad($pendadistrib);
        foreach ($pendadistrib as $key => $result) {
            $pendadistrib[$key] ['datos'] = self::unirporviaadquisicion($result['datos']);
        }

        $resulta->resul = $resultado;
        $resulta->pendadistrib = $pendadistrib;
        $resulta->autom = $datos;




        return $resulta;
    }

    public function sumarcadacosa($parametros) {
        $array = [];

        foreach ($parametros as $k) {
            $array['importdirectaliq']+=$k['datos']['importdirectaliq'];
            $array['operacionesncex']+=$k['datos']['operacionesncex'];
            $array['operacionesncin']+=$k['datos']['operacionesncin'];
            $array['totalexterno']+=$k['datos']['totalexterno'];
            $array['totalinterno']+=$k['datos']['totalinterno'];
            $array['totaldivisa']+=$k['datos']['totaldivisa'];
            $array['total']+=$k['datos']['total'];
            $array['continex']+=$k['datos']['continex'];

            $array['continin']+=$k['datos']['continin'];
            $array['importdirectacred']+=$k['datos']['importdirectacred'];
            $array['servyotrospag']+=$k['datos']['servyotrospag'];
            $array['oace']+=$k['datos']['oace'];
            $array['balancecentral']+=$k['datos']['balancecentral'];
            $array['concdecomp']+=$k['datos']['concdecomp'];
        }
        return $array;
    }

    public function restarcadaposdelarray($column, $pdte) {
        $array['importdirectaliq'] = abs($pdte['importdirectaliq'] - $column['importdirectaliq']);
        $array['operacionesncex'] = abs($pdte['operacionesncex'] - $column['operacionesncex']);
        $array['operacionesncin'] = abs($pdte['operacionesncin'] - $column['operacionesncin']);
        $array['totalexterno'] = abs($pdte['totalexterno'] - $column['totalexterno']);
        $array['totalinterno'] = abs($pdte['totalinterno'] - $column['totalinterno']);
        $array['totaldivisa'] = abs($pdte['totaldivisa'] - $column['totaldivisa']);
        $array['total'] = abs($pdte['total'] - $column['total']);
        $array['continex'] = abs($pdte['continex'] - $column['continex']);

        $array['continin'] = abs($pdte['continin'] - $column['continin']);
        $array['importdirectacred'] = abs($pdte['importdirectacred'] - $column['importdirectacred']);
        $array['servyotrospag'] = abs($pdte['servyotrospag'] - $column['servyotrospag']);
        $array['oace'] = abs($pdte['oace'] - $column['oace']);
        $array['balancecentral'] = abs($pdte['balancecentral'] - $column['balancecentral']);
        $array['concdecomp'] = abs($pdte['concdecomp'] - $column['concdecomp']);

        return $array;
    }

    public function sumarcadaposdelarray($column, $pdte) {
        $array['importdirectaliq'] = $pdte['importdirectaliq'] + $column['importdirectaliq'];
        $array['operacionesncex'] = $pdte['operacionesncex'] + $column['operacionesncex'];
        $array['operacionesncin'] = $pdte['operacionesncin'] + $column['operacionesncin'];
        $array['totalexterno'] = $pdte['totalexterno'] + $column['totalexterno'];
        $array['totalinterno'] = $pdte['totalinterno'] + $column['totalinterno'];
        $array['totaldivisa'] = $pdte['totaldivisa'] + $column['totaldivisa'];
        $array['total'] = $pdte['total'] + $column['total'];
        $array['continex'] = $pdte['continex'] + $column['continex'];

        $array['continin'] = $pdte['continin'] + $column['continin'];
        $array['importdirectacred'] = $pdte['importdirectacred'] + $column['importdirectacred'];
        $array['servyotrospag'] = $pdte['servyotrospag'] + $column['servyotrospag'];
        $array['oace'] = $pdte['oace'] + $column['oace'];
        $array['balancecentral'] = $pdte['balancecentral'] + $column['balancecentral'];
        $array['concdecomp'] = $pdte['concdecomp'] + $column['concdecomp'];

        return $array;
    }

    public function limpiarautom($resultautom) {
        foreach ($resultautom as $key => $result) {
            // $resultautom[$key]['autom']=1;
            if ($result['destino'] == 'Operaciones no Comerciales') {//asi tiene que llamarse el nomenclador destino
                $resultautom[$key]['operacionesnc'] = 1;

                unset($resultautom[$key]['destino']);
            } else {
                $resultautom[$key]['operacionesnc'] = 0;
                unset($resultautom[$key]['destino']);
            }
        }
        return $resultautom;
    }

    public function unirporentidad($array) {
        $cont = 1;
        $arrayfinal[0]['identidad'] = $array[0]['identidad'];
        unset($array[0]['identidad']);
        $arrayfinal[0]['datos'][0] = $array[0];
        for ($a = 1; $a < count($array); $a++) {
            $pos = self::estaenelarray($arrayfinal, $array[$a]['identidad']);
            if ($pos != -1) {
                unset($array[$a]['identidad']);
                array_push($arrayfinal[$pos]['datos'], $array[$a]);
            } else {
                $arrayfinal[$cont]['identidad'] = $array[$a]['identidad'];
                unset($array[$a]['identidad']);
                $arrayfinal[$cont++]['datos'][0] = $array[$a];
            }
        }


        return $arrayfinal;
    }

    public function unirporviaadquisicion($array) {
        //    definir contingencia
        $arrayfinal = [];
        $valor = 0;
        $arrayfinal['operacionesncex'] = 0;
        $arrayfinal['totalexterno'] = 0;
        $arrayfinal['totalinterno'] = 0;
        $arrayfinal['totaldivisa'] = 0;
        $arrayfinal['total'] = 0;
        $arrayfinal['operacionesncin'] = 0;
        $arrayfinal['continex'] = 0;
        $arrayfinal['continin'] = 0;
        $arrayfinal['importdirectaliq'] = 0;
        $arrayfinal['importdirectacred'] = 0;
        $arrayfinal['servyotrospag'] = 0;
        $arrayfinal['oace'] = 0;
        $arrayfinal['balancecentral'] = 0;
        $arrayfinal['concdecomp'] = 0;
        for ($a = 0; $a < count($array); $a++) {
            $valor = ($array[$a]['importe'] * $array[$a]['contingencia']) / 100;
            //aki se ven las operaciones no comerciales sea del indole ke sea
            if ($array[$a]['operacionesnc'] == 1) {
                if ($array[$a]['uriviaadquisicion'] == 'importaciondirecta') {
                    $arrayfinal['totalexterno']+=$array[$a]['importe'];
                    $arrayfinal['operacionesncex']+=$array[$a]['importe'] - $valor;
                    $arrayfinal['continex']+=$valor;
                } else {
                    $arrayfinal['totalinterno']+=$array[$a]['importe'];
                    $arrayfinal['operacionesncin']+=$array[$a]['importe'] - $valor;
                    $arrayfinal['continin']+=$valor;
                }
            } else {
                if ($array[$a]['uriviaadquisicion'] == 'importaciondirecta') {
                    $arrayfinal['continex']+=$valor;
                    $arrayfinal['totalexterno']+=$array[$a]['importe'];
                    if ($array[$a]['tipooperacion'] == 'Líquido') {
                        $arrayfinal['importdirectaliq']+=$array[$a]['importe'] - $valor;
                    } else {
                        $arrayfinal['importdirectacred']+=$array[$a]['importe'] - $valor;
                    }
                } else {
                    if ($array[$a]['uriviaadquisicion'] == 'sustitucionimportaciones') {
                        $arrayfinal['totalinterno']+=$array[$a]['importe'];
                        $arrayfinal['continin']+=$valor;
                        $arrayfinal['servyotrospag']+=$array[$a]['importe'] - $valor;
                    } else {
                        if ($array[$a]['uriviaadquisicion'] == 'oace') {
                            $arrayfinal['oace']+=$array[$a]['importe'];
                        } else {
                            if ($array[$a]['uriviaadquisicion'] == 'balanceadorcentral') {
                                $arrayfinal['balancecentral']+=$array[$a]['importe'];
                            } else {
                                if ($array[$a]['uriviaadquisicion'] == 'concentraciondecompras') {
                                    $arrayfinal['totalinterno']+=$array[$a]['importe'];
                                    $arrayfinal['continin']+=$valor;
                                    $arrayfinal['concdecomp'] += $array[$a]['importe'] - $valor;
                                }
                            }
                        }
                    }
                }
            }
            $arrayfinal['totaldivisa'] = $arrayfinal['totalinterno'] + $arrayfinal['totalexterno'];
            $arrayfinal['total'] = $arrayfinal['totaldivisa'] + $arrayfinal['balancecentral'] + $arrayfinal['oace'];
        }




        return $arrayfinal;
    }

    public function estaenelarray($array, $elemento) {
        foreach ($array as $key => $elem) {
            if ($elem['identidad'] == $elemento) {
                return $key;
            }
        }
        return -1;
    }

    public function listarRelacionconInd($manual, $idcontroldivisa, $identidadmodelo, $idviaadquisicion, $idestructura, $organo, $idejercicio, $iddocumentoaprobacion
    ) {
        $identidad = Doctrine::getTable('DatEntidaddatosnomenclador')
                ->findByDql(
                "iddatosnomenclador = 1 and identidad=$idestructura"
        );
        $parametros;
        // $parametros->manual = $manual;
        $parametros->idestructura = $idestructura;
        $parametros->idejercicio = $idejercicio;
        $parametros->idcentrobalance = $identidad[0]->identidaddatosnomenclador;
        $parametros->idcontroldivisa = $idcontroldivisa;
        $parametros->identidadmodelo = $identidadmodelo;
        $parametros->idviaadquisicion = $idviaadquisicion;
        $parametros->organo = $organo;
        $parametros->iddocumentoaprobacion = $iddocumentoaprobacion;

        if ($manual == 0) {
            $result = DatDocumentoaprobacion::probareste(
                            $parametros
            );
        } else {
            $result = DatDocumentoaprobacion::probarnuevo(
                            $parametros
            );
        }
        return $result;
    }

    public function listarRelacionconIndDesglose($parametros) {
        $result = DatDocumentoaprobacion::indicadoresRelacDesglose($parametros);
        return $result;
    }

    public function AdicionarDocAutomatico(
    $version, $origen, $idoperacion, $idEstructura, $idtipoaprobacion, $idusuario, $idejercicio, $numerodoc, $nosoyauto, $iddoc, $tipoaprobacion
    ) {
        $identidad = Doctrine::getTable('DatEntidaddatosnomenclador')
                ->findByDql(
                "iddatosnomenclador = 1 and identidad=$idEstructura"
        );


        $parametros;
        $parametros->idejercicio = $idejercicio;
        $parametros->tipoaprobacion = $tipoaprobacion;
        $parametros->idestructura = $idEstructura;
        $parametros->idcentrobalance = $identidad[0]->identidaddatosnomenclador;

        $cuerpo = DatDocumentoaprobacion::RecuperarCuerpoDoc(
                        $parametros
        );

        if (count($cuerpo) > 0) {

            if ($nosoyauto) {
                $numero = DatDocumentoaprobacion::ultimoNumero(
                                $idEstructura, $parametros
                );
                $documento = new DatDocumentoaprobacion();
                if (isset($version)) {
                    $documento->version = $version;
                }
                $documento->esmanual = $origen;
                $documento->identidad = $idEstructura;
                $documento->idejercicio = $idejercicio;
                $documento->idusuario = $idusuario;
                $documento->numeroaprobacion = $numerodoc;
                $documento->idtipoaprobacion = $idtipoaprobacion;
                //$documento->idoperacion = $idoperacion;
                $documento->idaprobacion = 1;
                $documento->numero = $numero;
                $documento->save();
            }
            if (isset($iddoc)) {
                $iddocumento = $iddoc;
            } else {
                $iddocumento = $documento->iddocumentoaprobacion;
            }
            foreach ($cuerpo as $cadaTuplaconInd) {

                $objdocaprobCD = new DatControldivisadocumentoaprobacion();
                $objdocaprobCD->idcontroldivisa = $cadaTuplaconInd['idcontroldivisa'];
                $objdocaprobCD->importe = (trim(strtoupper($tipoaprobacion)) == 'MEP') ? $cadaTuplaconInd['importeliquido'] : $cadaTuplaconInd['importecredito'];
                $objdocaprobCD->cantidad = $cadaTuplaconInd['cantidad'];
                $objdocaprobCD->idindicador = $cadaTuplaconInd['idindicador'];
                $objdocaprobCD->preciodivisa = $cadaTuplaconInd['precio'];
                $objdocaprobCD->iddocumentoaprobacion = $iddocumento;
                $objdocaprobCD->save();

                $objdocVia = new DatControldivisadocumentoviaadquisicion();
                $objdocVia->idcontroldivisadocumentoaprobacion = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
                $objdocVia->idviaadquisicion = $cadaTuplaconInd['idvia'];
                $objdocVia->save();

                if ($cadaTuplaconInd['identidadmodelo']) {
                    $objdocModelo = new DatControldivisadocumentomodelo();
                    $objdocModelo->identidadmodelo = $cadaTuplaconInd['identidadmodelo'];
                    $objdocModelo->idcontroldivisadocumentoaprobacion = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
                    $objdocModelo->save();
                }
            }
            return 1;
        } else {
            return 3;
        }
    }

    public function Adicionardocumentomanual(
    $arraydatosdoc, $origen, $idoperacion, $identidad, $idtipoaprobacion, $idusuario, $idejercicio, $numerodoc, $version, $indicadores
    ) {






        $numero = DatDocumentoaprobacion::ultimoNumero($identidad);
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $documento = new DatDocumentoaprobacion();

        if (isset($version)) {


            $documento->version = $version;
        }
        /*
          $documento->esmanual = $origen;
          $documento->identidad = $identidad;
          $documento->idejercicio = $idejercicio;
          $documento->idusuario = $idusuario;
          $documento->numeroaprobacion = $numerodoc;

          $documento->idtipoaprobacion = $idtipoaprobacion;
          $documento->idoperacion = $idoperacion;
          $documento->idaprobacion = 1;
          $documento->numero = $numero;
          $documento->save(); */
        $iddocumento = DatDocumentoaprobacion::Guardardatosdeldocumento($numero, $identidad, $idejercicio, $idtipoaprobacion, $idusuario, $idoperacion, $origen, $numerodoc);


        foreach ($arraydatosdoc as $datosdocumento) {
            // foreach ($indicadores as $ind) {
            if ($datosdocumento->operacionesnc) {
                
            }
            $objdocaprobCD = new DatControldivisadocumentoaprobacion();
            /*  foreach ($indicadores as $ind) { */
            $objdocaprobCD->idcontroldivisa = (isset($datosdocumento->idcontroldivisa)) ? $datosdocumento->idcontroldivisa : $datosdocumento['idcontroldivisa'];
            $objdocaprobCD->importe = (isset($datosdocumento->importe)) ? $datosdocumento->importe : $datosdocumento['importe'];
            if ($datosdocumento->operacionesnc) {
                $objdocaprobCD->operacionesnc = 1;
            } else {
                $objdocaprobCD->operacionesnc = 0;
            }
            /* $objdocaprobCD->idindicador = (isset($ind->idindicador))
              ? $ind->idindicador
              : $ind['idindicador']; */
            $objdocaprobCD->iddocumentoaprobacion = $iddocumento;
            $objdocaprobCD->save();
            //  }
            $objdocVia = new DatControldivisadocumentoviaadquisicion();
            $objdocVia->idcontroldivisadocumentoaprobacion = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
            $objdocVia->idviaadquisicion = (isset($datosdocumento->idvia)) ? $datosdocumento->idvia : $datosdocumento['idvia'];

            $objdocVia->save();
            $idmodelo = $datosdocumento;
            /*    if ($datosdocumento->idconceptoplan) {
              $objdocModelo = new DatControldivisadocumentomodelo();
              $idmodelo=$datosdocumento->idconceptoplan;
              $query="SELECT
              distinct
              mod_planificacion.dat_entidadmodelo.identidadmodelo
              FROM
              mod_planificacion.dat_entidadmodelo
              INNER JOIN mod_planificacion.dat_planificacion ON (mod_planificacion.dat_entidadmodelo.identidadmodelo = mod_planificacion.dat_planificacion.identidadmodelo)
              WHERE
              mod_planificacion.dat_entidadmodelo.idmodelo= $idmodelo";

              $conex = Doctrine_Manager:: connection();
              $loco= $conex->execute($query)->fetchAll();
              //   $loco= DatControldivisadocumentomodelo::dameentidadmodelodadomodelo($datosdocumento['idconceptoplan']);
              foreach($loco as $data){
              $objdocModelo->identidadmodelo
              =
              $data[0];
              $objdocModelo->idcontroldivisadocumentoaprobacion
              = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
              $objdocModelo->save();
              }
              } */
        }
        return $iddocumento;
    }

    public function Modificadocumentomanual(
    $arraydatosdoc, $origen, $iddocumento, $idoperacion, $identidad, $idtipoaprobacion, $idusuario, $idejercicio, $numerodoc, $version, $indicadores
    ) {

        $numero = DatDocumentoaprobacion::ultimoNumero($identidad);
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $documento = new DatDocumentoaprobacion();

        if (isset($version)) {
            $documento->version = $version;
        }
        $documento->esmanual = $origen;
        $documento->identidad = $identidad;
        $documento->idejercicio = $idejercicio;
        $documento->idaprobacion = 1;
        $documento->idusuario = $idusuario;
        $documento->numeroaprobacion = $numerodoc;
        $documento->idtipoaprobacion = $idtipoaprobacion;
        $documento->numero = $numero;
        //$documento->idoperacion = $idoperacion;
        $documento->save();

        /*
          $iddocumento = DatDocumentoaprobacion::Guardardatosdeldocumento($numero,$identidad,$idejercicio,$idtipoaprobacion,$idusuario,
          $idoperacion,$origen,$numerodoc);
         */

        foreach ($arraydatosdoc as $datosdocumento) {
            // foreach ($indicadores as $ind) {
            /* if($datosdocumento->operacionesnc){

              } */
            $objdocaprobCD = new DatControldivisadocumentoaprobacion();
            /*  foreach ($indicadores as $ind) { */
            $objdocaprobCD->idcontroldivisa = (isset($datosdocumento->idcontroldivisa)) ? $datosdocumento->idcontroldivisa : $datosdocumento['idcontroldivisa'];

            $objdocaprobCD->importe = (isset($datosdocumento->importe)) ? $datosdocumento->importe : $datosdocumento['importe'];

            if ($datosdocumento->operacionesnc) {
                $objdocaprobCD->operacionesnc = 1;
            } else {
                $objdocaprobCD->operacionesnc = 0;
            }

            /* $objdocaprobCD->idindicador = (isset($ind->idindicador))
              ? $ind->idindicador
              : $ind['idindicador']; */

            $objdocaprobCD->iddocumentoaprobacion = $documento->iddocumentoaprobacion;

            $objdocaprobCD->save();

            //  }
            $objdocVia = new DatControldivisadocumentoviaadquisicion();
            $objdocVia->idcontroldivisadocumentoaprobacion = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
            $objdocVia->idviaadquisicion = (isset($datosdocumento->idvia)) ? $datosdocumento->idvia : $datosdocumento['idvia'];

            $objdocVia->save();
            $idmodelo = $datosdocumento;
            if ($datosdocumento->idconceptoplan) {
                $objdocModelo = new DatControldivisadocumentomodelo();
                $idmodelo = $datosdocumento->idconceptoplan;
                $query = "SELECT
    distinct
      mod_planificacion.dat_entidadmodelo.identidadmodelo
    FROM
      mod_planificacion.dat_entidadmodelo
      INNER JOIN mod_planificacion.dat_planificacion ON (mod_planificacion.dat_entidadmodelo.identidadmodelo = mod_planificacion.dat_planificacion.identidadmodelo)
    WHERE
      mod_planificacion.dat_entidadmodelo.idmodelo= $idmodelo";

                $conex = Doctrine_Manager:: connection();
                $loco = $conex->execute($query)->fetchAll();
                //   $loco= DatControldivisadocumentomodelo::dameentidadmodelodadomodelo($datosdocumento['idconceptoplan']);

                foreach ($loco as $data) {
                    $objdocModelo->identidadmodelo = $data[0];
                    $objdocModelo->idcontroldivisadocumentoaprobacion = $objdocaprobCD->idcontroldivisadocumentoaprobacion;
                    $objdocModelo->save();
                }
            }
        }
        return $iddocumento;
    }

    public function getDatosDocumentoImprimir($parametros) {

        /* $datos = DatDocumentoaprobacion::cuerpoDocumentototal(
          $parametros
          );
          $datos=self::limpiararray($datos);

          $planONC = DatDocumentoaprobacion::cuerpoDocumentototalPlanOP(
          $parametros
          );

          if (count($planONC) > 0) {
          $datos[] = $planONC;
          }

          // $integrator = ZendExt_IoC::getInstance();

          $datosentidad = $this->integrator->metadatos->DameEstructura(
          $parametros['identidad']
          );

          $datos[0]['entidad'] = $datosentidad[0]->denominacion ;
          return $datos; */
        $datos = DatDocumentoaprobacion::cuerpoDocumentototal($parametros);
        $planONC = DatDocumentoaprobacion::cuerpoDocumentototalPlanOP($parametros);
        if (count($planONC) > 0) {
            $datos[] = $planONC;
        }
        $integrator = ZendExt_IoC::getInstance();
        $datosentidad = $integrator->metadatos->DameEstructura($datos[0]['identidad']);
        $datos[0]['entidad'] = $datosentidad[0]->denominacion;
        return $datos;
    }

    public function limpiararray($datos) {
        //  $data[0]['denominacion']=$datos[0]['via'];
        if (count($datos) > 1) {
            for ($v = 0; $v < count($datos) - 1; $v++) {
                $data[$v]['denominacion'] = $datos[$v]['via'];
                $data[$v]['aprobacion'] = $datos[$v]['aprobacion'];
                unset($datos[$v]['via']);
                unset($datos[$v][2]);
                $data[$v]['arreglo'][0] = $datos[$v];
                $cont = 1;
                for ($a = $v + 1; $a < count($datos); $a++) {

                    if ($datos[$a]['via'] == $data[$v]['denominacion']) {
                        unset($datos[$a]['via']);
                        unset($datos[$a][2]);
                        $data[$v]['arreglo'][$cont] = $datos[$a];
                        unset($datos[$a]);
                    }
                }
            }
        } else {
            $data[0]['denominacion'] = $datos[0]['via'];
            $data[0]['aprobacion'] = $datos[0]['aprobacion'];
            unset($datos[0]['via']);
            unset($datos[0][2]);
            $data[0]['arreglo'][0] = $datos[0];
        }
        foreach ($data as $key => $dat) {
            $data[$key]['arreglo'] = self::ind($dat['arreglo']);
            $data[$key]['totalvia'] = $data[$key]['arreglo']['totalvia'];
            unset($data[$key]['arreglo']['totalvia']);
            $data['totalgeneral']+=$data[$key]['totalvia'];
        }

        return $data;
    }

    public function ind($datos) {
        if (count($datos) > 1) {
            for ($v = 0; $v < count($datos) - 1; $v++) {
                $data[$v]['denominacion'] = $datos[$v]['denominacion'];
                $data[$v]['codigo'] = $datos[$v]['codigo'];
                $data[$v]['importe'] = $datos[$v]['importe'] - (($datos[$v]['importe'] * $datos[$v]['porciento']) / 100);
                unset($datos[$v]['denominacion']);
                unset($datos[$v][1]);
                unset($datos[$v]['importe']);
                unset($datos[$v][5]);
                unset($datos[$v]['codigo']);
                unset($datos[$v][0]);
                $data[$v]['arreglo'][0] = $datos[$v];
                $cont = 1;
                for ($a = $v + 1; $a < count($datos); $a++) {

                    if ($datos[$a]['codigo'] == $data[$v]['codigo']) {
                        unset($datos[$a]['denominacion']);
                        unset($datos[$a][1]);
                        $data[$v]['importe']+=$datos[$a]['importe'] - (($datos[$a]['importe'] * $datos[$a]['porciento']) / 100);
                        unset($datos[$a]['importe']);
                        unset($datos[$a][5]);
                        unset($datos[$a]['codigo']);
                        unset($datos[$a][0]);
                        $data[$v]['arreglo'][$cont] = $datos[$a];
                        unset($datos[$a]);
                    }
                }
                $data['totalvia']+=$data[$v]['importe'];
            }
        } else {
            $data[0]['denominacion'] = $datos[0]['denominacion'];
            $data[0]['codigo'] = $datos[0]['codigo'];
            $data[0]['importe'] = $datos[0]['importe'] - (($datos[0]['importe'] * $datos[0]['porciento']) / 100);
            unset($datos[0]['denominacion']);
            unset($datos[0][1]);
            unset($datos[0]['importe']);
            unset($datos[0][5]);
            unset($datos[0]['codigo']);
            unset($datos[0][0]);
            $data[0]['arreglo'][0] = $datos[0];
        }
        foreach ($data as $key => $dat) {
            if ($dat['arreglo'][$key]['naturaleza'] == 'Equipo') {
                $data[$key]['arreglo'] = self::indplanif($dat['arreglo']);
            } else {
                unset($dat['arreglo'][$key]);
            }
        }
        return $data;
    }

    public function indplanif($datos) {
        if (count($datos) > 1) {
            for ($v = 0; $v < count($datos) - 1; $v++) {
                $data[$v]['indicador'] = $datos[$v]['indicador'];
                $data[$v]['cantidad'] = $datos[$v]['cantidad'];
                $data[$v]['precio'] = $datos[$v]['precio'];
                unset($datos[$v]['indicador']);
                unset($datos[$v][8]);
                unset($datos[$v]['cantidad']);

                unset($datos[$v][6]);
                unset($datos[$v]['precio']);
                unset($datos[$v][9]);
                // $data[$v]['arreglo'][0]=$datos[$v];
                $cont = 1;
                for ($a = $v + 1; $a < count($datos); $a++) {

                    if ($datos[$a]['codigo'] == $data[$v]['codigo']) {
                        unset($datos[$v]['indicador']);
                        unset($datos[$v][8]);
                        unset($datos[$v]['cantidad']);
                        $data[$v]['cantidad']+=$datos[$a]['cantidad'];
                        unset($datos[$v][6]);
                        unset($datos[$v]['precio']);
                        unset($datos[$v][9]);
                        //   $data[$v]['arreglo'][$cont]=$datos[$a];
                        unset($datos[$a]);
                    }
                }
            }
        } else {
            $data[0]['indicador'] = $datos[0]['indicador'];
            $data[0]['cantidad'] = $datos[0]['cantidad'];
            $data[0]['precio'] = $datos[0]['precio'];
        }


        return $data;
    }

    public function generarDoc($datos) {
        PHPRtfLite::registerAutoloader();
        $rtf = new PHPRtfLite();
        $rtf->setMargins(1, 1, 1, 1, 1);
        $dir = $_SERVER['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        //$camino = $apps . 'apps/contratacion/comun/recursos/imagenes/guardianalba.JPG';
        $section = $rtf->addSection();
        //$section->addImage($camino);
        $section->writeText('<br>');
        $section->writeText(
                '"ORDINARIO" ', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
        );
        $section->writeText(
                '"Ejemplar No." ', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
        );
        $section->writeText('<br>');
        $section->writeText(
                '<b>MINISTRO DE LAS FAR</b>', new PHPRtfLite_Font(14, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
        );
        $section->writeText(
                '<b>GENERAL DE CUERPO DE EJÉRCITO</b>', new PHPRtfLite_Font(14, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
        );
        $section->writeText('<br><br>');
        $section->writeText(
                '<b>APROBADO :</b>', new PHPRtfLite_Font(14, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_JUSTIFY)
        );
        $section->writeText('<br>');
        $section->writeText(
                '<b>LEOPOLDO CINTRA FRIAS</b>', new PHPRtfLite_Font(14, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
        );
        $section->writeText('<br><br>');
        $section->writeText(
                '<b>APROBACIÓN No. </b>' . '<b>' . $datos[0]['numeroaprobacion'] . '</b>', new PHPRtfLite_Font(14, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_JUSTIFY)
        );
        $section->writeText(
                '<b>' . $datos[0]['entidad'] . '</b>', new PHPRtfLite_Font(14, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_JUSTIFY)
        );
        $section->writeText('<br>');

        $table = $section->addTable();


        $table->addRows(2);
        $table->addColumnsList(array(3.0, 7.75, 3.0, 3.0, 3.0));
        $border = new PHPRtfLite_Border(
                $rtf, new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1)
        );
        $border1 = new PHPRtfLite_Border(
                $rtf, new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(0), new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1)
        );
        $border2 = new PHPRtfLite_Border(
                $rtf, new PHPRtfLite_Border_Format(0), new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1), new PHPRtfLite_Border_Format(1)
        );


        $cell11 = $table->getCell(1, 1);
        $cell11->setBorder($border1);
        $cell11->writeText(
                '<b>CÓDIGO</b>', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
        );

        $cell12 = $table->getCell(1, 2);
        $cell12->setBorder($border1);
        $cell12->writeText(
                '<b>DESCRIPCIÓN</b>', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
        );

        $cell13 = $table->getCell(1, 3);
        $cell13->setBorder($border1);
        $cell13->writeText(
                '<b>CANT</b>', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
        );

        $cell14 = $table->getCell(1, 4);
        $cell14->setBorder($border1);
        $cell14->writeText(
                '<b>PRECIO</b>', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
        );

        $cell15 = $table->getCell(1, 5);
        $cell15->setBorder($border);
        $cell15->writeText(
                '<b>VALOR(MCUC)</b>', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
        );

        $cell21 = $table->getCell(2, 1);
        $cell21->setBorder($border1);


        $cell22 = $table->getCell(2, 2);
        $cell22->setBorder($border1);


        $cell23 = $table->getCell(2, 3);
        $cell23->setBorder($border1);


        $cell24 = $table->getCell(2, 4);
        $cell24->setBorder($border1);

        $cell25 = $table->getCell(2, 5);
        $cell25->setBorder($border);

        $viaactual = $datos[0]['via'];
        $escrito = false;
        $sumaImportes = 0;
        $sumatotal = 0;
        foreach ($datos as $key => $value) {
            if (!$escrito) {

                $cell22->writeText(
                        '<b>' . strtoupper($viaactual) . '</b>', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell21->writeText('');
                $cell23->writeText('');
                $cell24->writeText('');
                $cell25->writeText('');

                $escrito = true;
            }

            if ($value['via'] == $viaactual) {

                $cell22->writeText(
                        $value['denominacion'], new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_LEFT)
                );
                $cell21->writeText(
                        $value['codigo'], new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell25->writeText(
                        number_format($value['importe'], '2', '.', ','), new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
                );
                $cell23->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell24->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                if (strtoupper($value['denominacion']) == 'EQUIPOS' || strtoupper($value['denominacion']) == 'EQUIPO') {
                    $idEstructura = $value['identidad'];

                    $identidad = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql(
                            "iddatosnomenclador = 1 and identidad=$idEstructura"
                    );

                    $parametros;
                    $parametros->idestructura = $idEstructura;
                    $parametros->idcentrobalance = $identidad[0]->identidaddatosnomenclador;
                    $parametros->idcontroldivisa = $value['idcontroldivisa'];
                    $parametros->idviaadquisicion = $value['idviaadquisicion'];
                    $parametros->organo = $value['idorganosatisface'];


                    if ($parametros->idviaadquisicion) {
                        $escribir = DatDocumentoaprobacion::RecuperarIndicadoresCuerpoDocImprimir($parametros);
                    } else {
                        $escribir = DatDocumentoaprobacion::RecuperarIndicadoresCuerpoDocPlanOP($parametros);
                    }

                    if (count($escribir) > 0) {
                        foreach ($escribir['datos'] as $valor) {
                            $cell22->writeText(
                                    '-' . $valor['denominacion'], new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_LEFT)
                            );
                            $cell23->writeText(
                                    number_format($valor['cantidad'], '2', '.', ','), new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
                            );
                            $cell24->writeText(
                                    number_format($valor['precio'], '2', '.', ','), new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
                            );
                            $cell21->writeText(
                                    '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                            );
                            $cell25->writeText(
                                    '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                            );
                        }
                        //$cell22->writeText('', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER));
                        //$cell21->writeText('', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER));
                        //$cell25->writeText('', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER));
                    }
                }
                $sumaImportes += $value['importe'];
                $sumatotal += $value['importe'];
            } else {

                $viaactual = $value['via'];
                //$cell21->writeText('', new PHPRtfLite_Font(8, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER));
                $cell21->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell22->writeText(
                        '<b>SUB TOTAL</b>', new PHPRtfLite_Font(10, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
                );
                $cell25->writeText(
                        '<b>' . number_format($sumaImportes, '2', '.', ',') . '</b>', new PHPRtfLite_Font(10, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
                );
                $cell23->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell24->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $sumaImportes = 0;

                $cell21->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell22->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell23->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell24->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell25->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell22->writeText(
                        '<b>' . strtoupper($viaactual) . '</b>', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell21->writeText('<br>');
                //$cell22->writeText('<br>');
                $cell23->writeText('<br>');
                $cell24->writeText('<br>');
                $cell23->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell24->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell25->writeText('<br>');

                $cell22->writeText(
                        $value['denominacion'], new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_LEFT)
                );
                $cell21->writeText(
                        $value['codigo'], new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell23->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell24->writeText(
                        '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                );
                $cell25->writeText(
                        number_format($value['importe'], '2', '.', ','), new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
                );
                if (strtoupper($value['denominacion']) == 'EQUIPOS' || strtoupper($value['denominacion']) == 'EQUIPO') {

                    $idEstructura = $value['identidad'];

                    $identidad = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql(
                            "iddatosnomenclador = 1 and identidad=$idEstructura"
                    );

                    $parametros;
                    $parametros->idestructura = $idEstructura;
                    $parametros->idcentrobalance = $identidad[0]->identidaddatosnomenclador;
                    $parametros->idcontroldivisa = $value['idcontroldivisa'];
                    $parametros->idviaadquisicion = $value['idviaadquisicion'];
                    $parametros->organo = $value['idorganosatisface'];

                    if ($parametros->idviaadquisicion) {
                        $escribir = DatDocumentoaprobacion::RecuperarIndicadoresCuerpoDocImprimir($parametros);
                    } else {
                        $escribir = DatDocumentoaprobacion::RecuperarIndicadoresCuerpoDocPlanOP($parametros);
                    }
                    if (count($escribir) > 0) {
                        foreach ($escribir['datos'] as $valor) {
                            $cell22->writeText(
                                    '-' . $valor['denominacion'], new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_LEFT)
                            );
                            $cell23->writeText(
                                    number_format($valor['cantidad'], '2', '.', ','), new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
                            );
                            $cell24->writeText(
                                    number_format($valor['precio'], '2', '.', ','), new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
                            );
                            $cell21->writeText(
                                    '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                            );
                            $cell25->writeText(
                                    '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
                            );
                        }
                        // $cell21->writeText('', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER));
                        //$cell25->writeText('', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER));
                    }
                }
                $sumaImportes += $value['importe'];
                $sumatotal += $value['importe'];
            }
        }

        if ($viaactual == 0) {


            $cell21->writeText(
                    '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
            );
            $cell22->writeText(
                    '<b>SUB TOTAL</b>', new PHPRtfLite_Font(10, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
            );
            $cell25->writeText(
                    '<b>' . number_format($sumaImportes, '2', '.', ',') . '</b>', new PHPRtfLite_Font(10, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
            );
            $cell21->writeText(
                    '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
            );
            $cell22->writeText(
                    '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
            );
            $cell25->writeText(
                    '', new PHPRtfLite_Font(11, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_CENTER)
            );
            $cell22->writeText(
                    '<b>TOTAL GENERAL</b>', new PHPRtfLite_Font(10, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
            );
            $cell25->writeText(
                    '<b>' . number_format($sumatotal, '2', '.', ',') . '</b>', new PHPRtfLite_Font(10, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_RIGHT)
            );
        }


        $table->mergeCellRange(4, 1, 4, 4, 4);

        $section->writeText(
                '<b>Nota: -Las cantidades y valores son indicativas y los precios referativos. </b>', new PHPRtfLite_Font(12, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_JUSTIFY)
        );
        $section->writeText(
                '<b>      -El financiamiento líquido se realizará puntualmente. </b>', new PHPRtfLite_Font(12, 'Arial'), new PHPRtfLite_ParFormat(PHPRtfLite_ParFormat::TEXT_ALIGN_JUSTIFY)
        );
        $section->writeText('<br>');


        $rtf->sendRtf("Documento Aprobacion");
    }

    public function guardarDatosDesglose($parametros) {
        if (count($parametros['datos']) > 0) {
            foreach ($parametros['datos'] as $dato) {
                if ($parametros['upgrid'] == 1 || $parametros['tipo'] == 1) {
                    $identidad = $parametros['identidad'];
                    if ($parametros['automatico'] == 1) {
                        //
                        $objetoGuardar = Doctrine::getTable('DatDesglosecontroldivisa')
                                ->findByDql("idcontroldivisa = $dato->idcontroldivisa AND identidad = $identidad");
                        if ($objetoGuardar[0]->idcontroldivisa != null) {
                            $credito = ($dato->importe * $parametros['porciento']) / 100;
                            $objetoGuardar[0]->importecredito = $credito;
                            $objetoGuardar[0]->importeliquido = ($dato->importe - $credito);
                            $objetoGuardar->save();
                        } else {
                            $objetoGuardar = new DatDesglosecontroldivisa();
                            $objetoGuardar->idcontroldivisa = $dato->idcontroldivisa;
                            $objetoGuardar->identidad = $identidad;
                            $credito = ($dato->credito * $parametros['porciento']) / 100;
                            $objetoGuardar->importecredito = $credito;
                            $objetoGuardar->importeliquido = ($dato->importe - $credito);
                            $objetoGuardar->save();
                        }
                    } else {
                        $objetoGuardar = Doctrine::getTable('DatDesglosecontroldivisa')
                                ->findByDql("idcontroldivisa = $dato->idcontroldivisa AND identidad = $identidad");
                        if ($objetoGuardar[0]->idcontroldivisa != null) {
                            $objetoGuardar[0]->importecredito = $dato->credito;
                            $objetoGuardar[0]->importeliquido = $dato->liquido;
                            $objetoGuardar->save();
                        } else {
                            $objetoGuardar = new DatDesglosecontroldivisa();
                            $objetoGuardar->idcontroldivisa = $dato->idcontroldivisa;
                            $objetoGuardar->identidad = $identidad;
                            $objetoGuardar->importecredito = $dato->credito;
                            $objetoGuardar->importeliquido = $dato->liquido;
                            $objetoGuardar->save();
                        }
                    }
                } elseif ($parametros['automatico'] == 1) {
                    $objetoGuardar = Doctrine::getTable('DatControldivisaindicadormodelo')
                            ->find($dato->idcontroldivisaindicadormodelo);
                    if ($objetoGuardar) {
                        $credito = round(($dato->cantidad * $parametros['porciento']) / 100);
                        $objetoGuardar->cantcredito = $credito;
                        $objetoGuardar->cantliquido = $dato->cantidad - $credito;
                        $objetoGuardar->importecredito = $credito * $dato->precio;
                        $objetoGuardar->importeliquido = ($dato->cantidad - $credito) * $dato->precio;
                        $objetoGuardar->save();
                    } else {
                        $objetoGuardar = new DatControldivisaindicadormodelo();
                        $objetoGuardar->idcontroldivisaindicadormodelo = $dato->idcontroldivisaindicadormodelo;
                        $credito = ($dato->cantidad * $parametros['porciento']) / 100;
                        $objetoGuardar->cantcredito = $credito;
                        $objetoGuardar->cantliquido = $dato->cantidad - $credito;
                        $objetoGuardar->importecredito = $credito * $dato->precio;
                        $objetoGuardar->importeliquido = ($dato->cantidad - $credito) * $dato->precio;
                        $objetoGuardar->save();
                    }
                } else {
                    $objetoGuardar = Doctrine::getTable('DatControldivisaindicadormodelo')
                            ->find($dato->idcontroldivisaindicadormodelo);
                    if ($objetoGuardar) {
                        $objetoGuardar->cantcredito = $dato->credito;
                        $objetoGuardar->cantliquido = $dato->liquido;
                        $objetoGuardar->importecredito = $dato->credito * $dato->precio;
                        $objetoGuardar->importeliquido = $dato->liquido * $dato->precio;
                        $objetoGuardar->save();
                    }
                }
            }
            return 1;
        }
        return 3;
    }

    public function getDatosReporte($params) {
        $data = array();
        switch ($params['codigo']) {
            case 1:
                $iddoc = $params['iddocumentoaprobacion'];
                $documento = Doctrine::getTable('DatDocumentoaprobacion')->find($iddoc);
                if (isset($documento)) {
                    if ($documento->esmanual == 0) {
                        $params['imprimir'] = true;
                    }
                }
                $datos = self::getDatosDocumentoImprimir($params);
                $data[0]->tipo = 'noborder';
                $data[0]->datos = $datos;
                $data[0]->clumnacumun = 'via';
                $data[0]->clumnacumundato = 'denominacion';
                $data[0]->emptyvalue = '';
                $data[0]->columnas = array('C&oacute;digo', 'Descripci&oacute;n',
                    'Cant', 'Precio', 'Valor (MCUC)');
                $data[0]->referencias = array('codigo', 'denominacion', 'cantidad', 'precio', 'importe');
                $data['subsistema'] = 'controlaprobaciones';
                $data['responsable'] = $params['responsable'];
                $data['idejercicio'] = $params['idejercicio'];
                $data['identidad'] = $params['identidad'];
                $data['numero'] = $datos[0]['numeroaprobacion'];
                $data['entidad'] = $datos[0]['entidad'];
                $data[0]->datos = self::orderByparam($data);
                break;
            case 2:
                $integrator = ZendExt_IoC::getInstance();
                $datosentidad = $integrator->metadatos->DameEstructura($params['identidad']);

                $ultimosDoc = DatDocumentoaprobacion::getLastDocsByidentidad($params);
                $docsmanuales = array();
                $docsautomaticos = array();
                foreach ($ultimosDoc as $pos => $iddoc) {
                    $documento = Doctrine::getTable('DatDocumentoaprobacion')->find($iddoc[0]);
                    if (isset($documento)) {
                        if ($documento->esmanual == 0) {
                            $docsautomaticos[] = $iddoc;
                        } else {
                            $docsmanuales[] = $iddoc;
                        }
                    }
                }
                $docsmanuales = self::toUnidimencional($docsmanuales, 'iddocumentoaprobacion');
                $docsautomaticos = self::toUnidimencional($docsautomaticos, 'iddocumentoaprobacion');
                $totalplanificado = DatDocumentoaprobacion::getTotalPlanificado($params);
                $auto = array();
                $manuales = array();
                if (count($docsmanuales) > 0) {
                    $params['iddocs'] = implode(',', $docsmanuales);
                    $manuales = DatDocumentoaprobacion::listarmanualReportegeneral($params);
                }
                if (count($docsautomaticos) > 0) {
                    $params['iddocs'] = implode(',', $docsautomaticos);
                    $auto = DatDocumentoaprobacion::getdatosAutomatico($params);
                }


                $aux = array();
                $datos = array();
                $aux = array_merge($manuales, $auto);
                $params['data'] = $aux;
                $params['reference'] = 'identidad';
                $aux = self::orderArrayByReference($params);
                $index = 0;
                $totales = array();
                foreach ($totalplanificado as $total) {
                    switch ($total['uriviaadquisicion']) {
                        case 'importaciondirecta':
                            $totales[1]['credito'] += $total['importecredito'];
                            $totales[1]['liquido'] += $total['importeliquido'];
                            $totales[1]['contingenciape'] += $total['contingencia'];
                            $totales[1]['totalpe'] += $total['importecredito'] + $total['importeliquido'] + $total['contingencia'];
                            break;
                        case 'sustitucionimportaciones':
                            $totales[1]['servicios'] += $total['importecredito'] + $total['importeliquido'];
                            $totales[1]['contingenciapi'] += $total['contingencia'];
                            $totales[1]['totalpi'] += $total['importecredito'] + $total['importeliquido'] + $total['contingencia'];
                            break;
                        case 'concentraciondecompras':
                            $totales[1]['concentracion'] += $total['importecredito'] + $total['importeliquido'];
                            $totales[1]['contingenciapi'] += $total['contingencia'];
                            $totales[1]['totalpi'] += $total['importecredito'] + $total['importeliquido'] + $total['contingencia'];
                            break;
                        case 'oace':
                            $totales[1]['oace'] += $total['importecredito'] + $total['importeliquido'];
                            break;
                        case 'balanceadorcentral':
                            $totales[1]['balancecentral'] += $total['importecredito'] + $total['importeliquido'];
                            break;
                    }
                }

                $totales[1]['totalout'] = $totales[1]['totalpe'] + $totales[1]['totalpi'];
                $totales[1]['totalall'] = $totales[1]['totalout'] + $totales[1]['oace'] + $totales[1]['balancecentral'];
                $totales[1]['centrobalance'] = 'Total';
                $totales[1]['negrita'] = true;

                foreach ($aux as $key => $value) {
                    $oe = $this->integrator->metadatos->DameEstructura($key);
                    $datos[$index]['centrobalance'] = $oe[0]->denominacion;

                    //inicializar datos para evitar errores de sintaxis en la suma
                    $datos[$index]['credito'] = 0;
                    $datos[$index]['liquido'] = 0;
                    $datos[$index]['contingenciape'] = 0;
                    $datos[$index]['servicios'] = 0;
                    $datos[$index]['contingenciapi'] = 0;
                    $datos[$index]['concentracion'] = 0;
                    $datos[$index]['oace'] = 0;
                    $datos[$index]['balancecentral'] = 0;

                    foreach ($value as $llave => $dato) {
                        switch ($dato['uriviaadquisicion']) {
                            case 'importaciondirecta':
                                switch (trim(strtoupper($dato['tipoaprobacion']))) {
                                    case 'CRED':
                                    case 'OTRAS':
                                        $datos[$index]['credito'] += $dato['importe'];
                                        break;
                                    case 'MEP':
                                        $datos[$index]['liquido'] += $dato['importe'];
                                        break;
                                }
                                if ($dato['contingencia'])
                                    $datos[$index]['contingenciape'] += ($dato['importe'] * $dato['contingencia']) / 100;
                                else
                                    $datos[$index]['contingenciape'] += 0;

                                break;
                            case 'sustitucionimportaciones':
                                $datos[$index]['servicios'] += $dato['importe'];
                                if ($dato['contingencia'])
                                    $datos[$index]['contingenciapi'] += ($dato['importe'] * $dato['contingencia']) / 100;
                                else
                                    $datos[$index]['contingenciapi'] += 0;

                                break;
                            case 'concentraciondecompras':
                                $datos[$index]['concentracion'] += $dato['importe'];
                                if ($dato['contingencia'])
                                    $datos[$index]['contingenciapi'] += ($dato['importe'] * $dato['contingencia']) / 100;
                                else
                                    $datos[$index]['contingenciapi'] += 0;
                                break;
                            case 'oace':
                                $datos[$index]['oace'] += $dato['importe'];
                                break;
                            case 'balanceadorcentral':
                                $datos[$index]['balancecentral'] += $dato['importe'];
                                break;
                        }
                    }
                    $datos[$index]['totalpe'] = $datos[$index]['credito'] + $datos[$index]['liquido'] + $datos[$index]['contingenciape'];
                    $datos[$index]['totalpi'] = $datos[$index]['concentracion'] + $datos[$index]['servicios'] + $datos[$index]['contingenciapi'];
                    $datos[$index]['totalout'] = $datos[$index]['totalpe'] + $datos[$index]['totalpi'];
                    $datos[$index]['totalall'] = $datos[$index]['totalout'] + $datos[$index]['oace'] + $datos[$index]['balancecentral'];

                    $totales[0]['credito'] += $datos[$index]['credito'];
                    $totales[0]['liquido'] += $datos[$index]['liquido'];
                    $totales[0]['contingenciape'] += $datos[$index]['contingenciape'];
                    $totales[0]['concentracion'] += $datos[$index]['concentracion'];
                    $totales[0]['servicios'] += $datos[$index]['servicios'];
                    $totales[0]['contingenciapi'] += $datos[$index]['contingenciapi'];
                    $totales[0]['oace'] += $datos[$index]['oace'];
                    $totales[0]['balancecentral'] += $datos[$index]['balancecentral'];
                    $totales[0]['totalpe'] += $datos[$index]['totalpe'];
                    $totales[0]['totalpi'] += $datos[$index]['totalpi'];
                    $totales[0]['totalout'] += $datos[$index]['totalout'];
                    $totales[0]['totalall'] += $datos[$index]['totalall'];
                    $totales[0]['centrobalance'] = 'Total a Distribuir';
                    $totales[0]['negrita'] = true;

                    $index+=1;
                }

                $totales[2]['credito'] = max($totales[1]['credito'] - $totales[0]['credito'], 0);
                $totales[2]['liquido'] = max($totales[1]['liquido'] - $totales[0]['liquido'], 0);
                $totales[2]['contingenciape'] = max($totales[1]['contingenciape'] - $totales[0]['contingenciape'], 0);
                $totales[2]['concentracion'] = max($totales[1]['concentracion'] - $totales[0]['concentracion'], 0);
                $totales[2]['servicios'] = max($totales[1]['servicios'] - $totales[0]['servicios'], 0);
                $totales[2]['contingenciapi'] = max($totales[1]['contingenciapi'] - $totales[0]['contingenciapi'], 0);
                $totales[2]['oace'] = max($totales[1]['oace'] - $totales[0]['oace'], 0);
                $totales[2]['balancecentral'] = max($totales[1]['balancecentral'] - $totales[0]['balancecentral'], 0);
                $totales[2]['totalpe'] = max($totales[1]['totalpe'] - $totales[0]['totalpe'], 0);
                $totales[2]['totalpi'] = max($totales[1]['totalpi'] - $totales[0]['totalpi'], 0);
                $totales[2]['totalout'] = max($totales[1]['totalout'] - $totales[0]['totalout'], 0);
                $totales[2]['totalall'] = max($totales[1]['totalall'] - $totales[0]['totalall'], 0);
                $totales[2]['centrobalance'] = 'Pendiente a Distribuir';
                $totales[2]['negrita'] = true;

                $datos[] = $totales[0];
                $datos[] = $totales[2];
                $datos[] = $totales[1];

                $encabezados = array(
                    array(
                        'tipo' => 'simple',
                        'emptyvalue' => '0',
                        'header' => '',
                        'rowspan' => 2,
                        'columnas' => array('Centros de Balance'),
                        'referencias' => array('centrobalance')
                    ), array(
                        'tipo' => 'colspan',
                        'emptyvalue' => '0',
                        'columnadoble' => 0,
                        'colspancolumns' => array('Liquido', 'Credito'),
                        'colspanreferencias' => array('liquido', 'credito'),
                        'colspan' => 2,
                        'rowspan' => 2,
                        'header' => 'Pagos Externos',
                        'columnas' => array('Importacion Directa', 'Oper. NC', 'Contingencia', 'Total'),
                        'referencias' => array('importacion', 'operacionesnc', 'contingenciape', 'totalpe')
                    ), array(
                        'tipo' => 'simple',
                        'emptyvalue' => '0',
                        'rowspan' => 2,
                        'header' => 'Pagos Internos',
                        'columnas' => array('Servicios y Otros Pagos', 'Concen. Compras', 'Contingencia', 'Total'),
                        'referencias' => array('servicios', 'concentracion', 'contingenciapi', 'totalpi')
                    ), array(
                        'tipo' => 'simple',
                        'rowspan' => 2,
                        'emptyvalue' => '0',
                        'header' => '',
                        'columnas' => array('Total'),
                        'referencias' => array('totalout')
                    ), array(
                        'tipo' => 'simple',
                        'emptyvalue' => '0',
                        'rowspan' => 2,
                        'header' => '',
                        'columnas' => array('OACE'),
                        'referencias' => array('oace')
                    ), array(
                        'tipo' => 'simple',
                        'emptyvalue' => '0',
                        'rowspan' => 2,
                        'header' => '',
                        'columnas' => array('Balance Central'),
                        'referencias' => array('balancecentral')
                    ), array(
                        'tipo' => 'simple',
                        'emptyvalue' => '0',
                        'rowspan' => 2,
                        'header' => '',
                        'columnas' => array('Total'),
                        'referencias' => array('totalall')
                    )
                );
                $data[0]->tipo = 'multiheader';
                $data[0]->encabezados = $encabezados;
                $data[0]->datos = $datos;
                $data['subsistema'] = 'controlaprobaciones';
                $data['responsable'] = $params['responsable'];
                $data['entidad'] = $datosentidad[0]->denominacion;
                ;
                $data[0]->datos = $datos;

                break;
        }
        return $data;
    }

    public function orderArrayByReference($params) {
        $result = array();
        foreach ($params['data'] as $value) {
            $result[$value[$params['reference']]][] = $value;
        }
        return $result;
    }

    public function orderByparam($params) {
        $result = array();
        $index = 0;
        $first = $params[0]->datos[0][$params[0]->clumnacumun];
        $result[$index] = array('denominacion' => $first, 'negrita' => true, 'center' => true, 'font-size' => 18);
        $index+=1;
        $subtotal = 0;
        $total = 0;
        foreach ($params[0]->datos as $key => $value) {
            if (trim($value[$params[0]->clumnacumun]) != trim($first)) {
                $first = $value[$params[0]->clumnacumun];
                $result[$index] = array('denominacion' => 'SUBTOTAL', 'importe' => $subtotal, 'negrita' => true, 'right' => true, 'font-size' => 15);
                $index+=1;
                $result[$index] = array('denominacion' => $first, 'negrita' => true, 'center' => true, 'font-size' => 18);
                $index+=1;
                $subtotal = 0;
            }
            $subtotal+=$value['importe'];
            $total+=$value['importe'];
            $result[$index] = $value;
            $index+=1;
            $params['idindicadorcd'] = $value['idcontroldivisa'];
            $indicadores = DatDocumentoaprobacion::indicadoresRelacDesglose($params);
            foreach ($indicadores['data'] as $pos => $indicador) {
                $indicador['denominacion'] = ($pos + 1) . '- ' . $indicador['denominacion'];
                $result[$index] = $indicador;
                $index+=1;
            }
        }
        $result[$index] = array('denominacion' => 'SUBTOTAL', 'importe' => $subtotal, 'negrita' => true, 'right' => true, 'font-size' => 15);
        $index+=1;
        $result[$index] = array('denominacion' => 'TOTAL GENERAL', 'importe' => $total, 'negrita' => true, 'right' => true, 'font-size' => 15);
        return $result;
    }

    private static function toUnidimencional($array, $indice) {
        $arrayResult = array();
        foreach ($array as $values) {
            array_push($arrayResult, $values[$indice]);
        }
        return $arrayResult;
    }

}
