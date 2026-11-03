<?php

/**
 * CierrePatrimonioModel
 */
class CierrePatrimonioModel extends GestcierreModel
{
    private $inicio;

    /**
     *
     */
    public function __construct()
    {
        parent::gestcierreModel();
    }

    /**
     * @method cierreDiario
     * Acción para realizar el cierre diario de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre diario
     *
     * @return null
     */
    public function cierreDiario()
    {
        return parent::cierreDiario(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
    }

    /**
     * @method cierrePeriodo
     * Acción para realizar el cierre período de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre período
     *
     * @return null
     */
    public function cierrePeriodo()
    {
        $this->cargaDatosFecha();
        $documentos = $this->cargarDocuPendientes()['datos'];
        $collection = new Doctrine_Collection('DatDocumento');
        $mRegNumActivo = new DatDocumento();
        $datos = array();
        foreach ($documentos as $row) {
            $mRegNumActivo->assignIdentifier($row['iddocumento']);
            $datos['fechacontable'] = date('d-m-Y', strtotime('+1 month', strtotime($row['fechacontable'])));
            $mRegNumActivo->synchronizeWithArray($datos);
            $collection->add($mRegNumActivo);
        }
        $collection->save();
        return parent::cierrePeriodo(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
    }

    /**
     * @method cierreEjercicio
     * Acción para realizar el cierre ejercicio de los documentos
     * pendientes de los subsistemas
     * @params $subsistema Id del subsistema sobre el cual se realizará
     * el cierre ejercicio
     *
     * @return null
     */
    public function cierreEjercico()
    {
        return parent::cierreEjercico(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
    }

    /**
     *
     */
    public function devolverTipoDocumento()
    {
        $cEstructura = 'Estructura';
        $sConfgeneral = ServiciosConfiguracionGeneralHelper::__init();

        return $sConfgeneral->documentosPorSubsistemaEntidad(
                LogisticaGlobal::SUBSISTEMA_PATRIMONIO, $this->global->$cEstructura->idestructura
        );
    }

    /**
     *
     */
    public function cargaInicial()
    {
        $usuariosCreadores = $this->devolverUsuarios();
        $usuariosOtros = $this->devolverUsuarios('aprobadopor');

        return array(
            'usuarios' => array_merge($usuariosCreadores, $usuariosOtros)
        );
    }

    /**
     *
     */
    public function devolverUsuarios($campo = 'idusuario')
    {
        $queryResults = Doctrine_Query::create()
            ->select("d.{$campo} as  id")
            ->from('DatDocumento d')
            ->addWhere('d.iddoc = ?', array($this->iddoc))
            ->fetchArray();

        $usuariosDevueltos = array();
        foreach ($queryResults as $idusuario) {
            if (!array_search($idusuario['id'], $usuariosDevueltos)) {
                array_push($usuariosDevueltos, $idusuario['id']);
            }
        }
        return ServiciosSeguridadHelper::__init()->getUsersNameById($usuariosDevueltos);
    }

    /**
     *
     */
    public function getBuscarRegNumDepreciado($idsubsistema)
    {
        $obj = new DepreciacionService();
        $estructura = 'Estructura';

        return $obj->getBuscarRegNumDepreciadoCierre(array(), $this->global->$estructura->idestructura, $idsubsistema);
    }

    public function cargaDatosFecha()
    {
        $result = parent::cargaDatosFecha(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $this->inicio = $result['periodo']->inicio;
        return $result;
    }

    /**
     * Metodo para obtne las cuentas de los documentos de apertura con su saldo
     * @param type $idEstructura
     * @return array
     */
    public function getCuentasImportes($idEstructura)
    {
        $conn = Zend_Registry::get('conexion');
        $sqlImporte = "SELECT round(sum(dmrna.valorcontable),2) as importevalor, ".
            "round (sum(dmrna.valorcontablealternativo),2) as importevaloralternativo, ".
            "round (sum(dmrna.depreciacionacumuladaalternativo),2) as importedepreciacionalternativo, ".
            "round (sum(dmrna.depreciacionacumulada),2) as importedepreciacion, ngs.idgruposubgrupo, ".
            "ni.denominacion as denomindicador, nm.denominacion as denommarca, ".
            "nmod.denominacion as denommodelo ".
            "FROM mod_logactivofijotangible.dat_movregnumericoactivo dmrna ".
            "INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn "
            ."ON dmrna.idmovregnumerico = dmrn.idmovregnumerico ".
            "INNER JOIN mod_logistica.dat_movimiento dm ON dmrn.idmovimiento = dm.idmovimiento ".
            "INNER JOIN mod_logistica.dat_documento dd ON dm.iddocumento = dd.iddocumento ".
            "INNER JOIN mod_logactivofijotangible.dat_documentoactivo docaft "
            ."on docaft.iddocumentoactivo = dd.iddocumento ".
            "INNER JOIN mod_datosmaestros.nom_operacion no ON dd.idoperacion = no.idnomoperaciones ".
            "INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = dm.idproducto ".
            "INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador ".
            "INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador ".
            "LEFT JOIN mod_datosmaestros.nom_gruposubgrupo ngs ON nih.idgruposubgrupo = ngs.idgruposubgrupo ".
            "LEFT JOIN mod_datosmaestros.nom_marca nm ON nih.idmarca = nm.idmarca ".
            "LEFT JOIN mod_datosmaestros.nom_modelo nmod ON nih.idmodelo = nmod.idmodelo ".
            "WHERE no.codigooperacion = 'OPER_APERTURA' AND dd.estado = 2  and docaft.tipo = 1 ".
            "AND dp.idestructuracomun = ".$idEstructura." ".
            "GROUP BY ngs.idgruposubgrupo, ni.denominacion,nm.denominacion, nmod.denominacion ";


        $datos = $conn->fetchAll($sqlImporte);

        $cfgGrupoCueta = new ConfgruposcuentasModel();
        $confHelper = ServiciosConfiguracionGeneralHelper::__init();
        $monedas = $confHelper->monedaContableEntidad($idEstructura);
        $moneda = array();
        $alternativa = 0;
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['monedaalternativa'] = $value['idmoneda'];
                $moneda['nomalternativa'] = $value['codigoiso'];
            } else {
                $moneda['monedacontable'] = $value['idmoneda'];
                $moneda['nomacontable'] = $value['codigoiso'];
            }
        }

        // $asocGruposCuentas = CfgGruposCuentas::getConfGruposCuentas($idEstructura);
        $data = array();
        foreach ($datos as $dato) {
            if ($dato['idgruposubgrupo'] == "") {
                // El tipo de medio no tiene grupo asociado
                $text = $dato['denomindicador']." ".$dato['denommarca']." ".$dato['denommodelo'];
                return array('error' => 6, 'msg' => $text);
            }

            $query = Doctrine_Query:: create();
            $grupo = $query->from('NomGruposubgrupo g')
                ->where('g.idgruposubgrupo = ?', array($dato['idgruposubgrupo']))
                ->fetchArray();
            $grupo[0]['importevalor'] = $dato['importevalor'];
            $grupo[0]['importedepreciacion'] = $dato['importedepreciacion'];
            $grupo[0]['importevaloralternativo'] = $dato['importevaloralternativo'];
            $grupo[0]['importedepreciacionalternativo'] = $dato['importedepreciacionalternativo'];

            //$grupo = $cfgGrupoCueta->getGrupoCuentas($grupo[0], $asocGruposCuentas);

            $aux = $cfgGrupoCueta->getConfGruposCuentas($dato['idgruposubgrupo'])[0];
            $grupo = array_merge($grupo[0], $aux);

            if (count($aux) == 0)
                return array('error' => 7);
            if ($grupo['idcuentaactivo'] == '') {
                // El grupo $grupo['denominacion'] no tiene asociado una cuenta de activos.
                return array('error' => 4, 'msg' => $grupo['desccuentaActivoscup']);
            } elseif ($grupo['idcuentadepreciacion'] == '') {
                // El grupo $grupo['denominacion'] no tiene asociado una cuenta de depreciacion.
                return array('error' => 5, 'msg' => $grupo['desccuentaDepreciacioncup']); //
            } elseif ($alternativa == 1) {
                if ($grupo['idcuentaactivoalternativa'] == '') {
                    // El grupo $grupo['denominacion'] no tiene asociado una cuenta de activos alternativa.
                    return array('error' => 4, 'msg' => $grupo['desccuentaActivoscuc']);
                } else if ($grupo['idcuentadepreciacionalternativa'] == '') {
                    // El grupo $grupo['denominacion'] no tiene asociado una cuenta de depreciacion alternativa.
                    return array('error' => 5, 'msg' => $grupo['desccuentaDepreciacioncuc']); //
                }
            }
            array_push($data, $grupo);
        }
        $arrcuentas = array();
        foreach ($data as $valor) {
            $arrcuentas[$valor['idcuentaactivo']] += $valor['importevalor'];
            $arrcuentas[$valor['idcuentadepreciacion']] += $valor['importedepreciacion'];
            $arrcuentas[$valor['idcuentaactivoalternativa']] += $valor['importevaloralternativo'];
            $arrcuentas[$valor['idcuentadepreciacionalternativa']] += $valor['importedepreciacionalternativo'];
        }
        $dataFinal = array();
        foreach ($arrcuentas as $pos => $cuenta) {
            if ($cuenta != 0) {
                array_push($dataFinal, array('idcuenta' => $pos, 'saldo' => $cuenta));
            }
        }
        return $dataFinal;
    }

    /**
     * @method cargarDocuPendTrans
     * Acción para cargar los documentos pendientes que se
     * encuentran en el subsistema de Facturación
     * @params $parametros Parametros provenientes de la vista
     *
     * @return Arreglo con los documentos pendientes
     */
    public function cargarDocuPendientes($parametros = array())
    {
        $obj = new DocumentoActivoService();
        $parametros['idestructuracomun'] = $this->global->Estructura->idestructura;
        $parametros['idestado'] = array(EstadoDocumentoModel::ESTADO_PENDIENTE,
            EstadoDocumentoModel::ESTADO_ELABORACION);
        $parametros['desde'] = $this->inicio;
        unset($parametros['fecha']);
        $parametros['tipo'] = 1;
        $datos = $obj->getDocActivosPendientes($parametros);
        return array(
            'cantidad' => $datos['cantidad'],
            'datos' => $datos['datos']
        );
    }

    /**
     * Metodo para realizar el cierre de la apertura de todos los depositos
     * 
     * @return array
     */
    public function cierreApertura()
    {

        $objActSer = new DocumentoActivoService(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $idestructura = $this->global->Estructura->idestructura;

        $query = $objActSer->obtenerDocumentos(
            array(
                'codigooperacion' => 'OPER_APERTURA',
                'idestado' => 1, 'dql' => true, LogisticaGlobal::SUBSISTEMA_PATRIMONIO
            )
        );

        $query->leftJoin('d.DatDocumentoActivo da')->andWhere('da.tipo = 1');
        $datos = $query->fetchArray();

        if (count($datos) > 0) {
            return array('error' => 1); //Si existen documentos de apertura en elaboracion enviar error 1
        } else {//Todos los documentos tienen que estar en preparado           
            $cuentasAft = $this->getCuentasImportes($idestructura);
            if ($cuentasAft['error']) {
                return $cuentasAft;
            }
            $cfgParamGenerales = Doctrine::getTable('CfgParametrosGeneralesPatr')->find($idestructura);
            if ($cfgParamGenerales->contabilidad) {
                $cuentasAft = $this->getCuentasImportes($idestructura);
                if ($cuentasAft['error'] != null) {
                    return $cuentasAft;
                }
                $cuentasContabilidad = $this->contabilidadHelper->obtenerSaldoDiarioContableCuenta(
                    $idestructura,
                    $this->configuracionHelper->getFechaContableSubsistema(
                        $idestructura, LogisticaGlobal::SUBSISTEMA_PATRIMONIO
                    ), $this->objectHelper->extractValueFromArrayColumn($cuentasAft, 'idcuenta'), 'idcuenta'
                );

                if (count($cuentasAft) == count($cuentasContabilidad)) {//Comparar si las cuentas tienen el mismo saldo.
                    foreach ($cuentasContabilidad as $index => $value) {
                        if ($cuentasAft[$index]['saldo'] != $value['saldo']) {
                            return array('error' => 2); //Error que no coenciden los saldos de las cuentas
                        }
                    }
                    //Aprobar todos los documentos de apertura
                    $query = $objActSer->obtenerDocumentos(
                        array(
                            'codigooperacion' => 'OPER_APERTURA',
                            'idestado' => 2, 'dql' => true, LogisticaGlobal::SUBSISTEMA_PATRIMONIO
                        )
                    );

                    $query->leftJoin('d.DatDocumentoActivo da')->andWhere('da.tipo = 1');
                    $datosApert = $query->fetchArray();
                    ini_set('memory_limit', '1024M');
                    foreach ($datosApert as $datAper) {

                        $observacion = "Documento aprobado desde el cierre de la apertura";
                        $respuesta = $objActSer->aprobarDocumento(
                            $datAper['iddocumento'], $datAper['idoperacion'], $idestructura, $observacion
                        );
                        if ($respuesta['Cod']) {
                            return array('error' => 3); //Ocurrio un error al aprobar las aperturas
                        }
                    }
                    //Metodo para cerrar la carga inicial en datos_maestos.datestructurasubs
                    $this->configuracionHelper->cierreCargaInicial($idestructura, LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
                    return array('exito' => 1); //El cierre se realizo con exito    
                } else {
                    return array('error' => 2); //Error que no coenciden los saldos de las cuentas
                }
            }
        }
    }

}
