<?php

/**
 *
 */
class CierreActivoFijoModel extends GestcierreModel
{

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
        return parent::cierreDiario(LogisticaGlobal::SUBSISTEMA_AFT);
        
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
        //$this->validarCierre();                         
        $cerrarDif = "select count(nv.valor) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'CERRAR_CONDIF' and valor = 'true'";
        $validarDif = LogisticaDoctrineHelper::__init()->getConnection()->execute($cerrarDif)->fetchAll(PDO::FETCH_COLUMN);
        if (count($validarDif) && $validarDif[0] == 0) {
            $diferencias = $this->validarDiferenciasContabilidad();
            if ($diferencias['diferencias']) {
                return array('success' => false, 'codMsg' => 4,
                    'codigoMsg' => 4,
                    'mensaje' => 'Existen diferencias entre activos fijos y contabilidad',
                    'detalles'=> $diferencias['detalle']);
            }
        }
        parent::cierrePeriodo(LogisticaGlobal::SUBSISTEMA_AFT);
      //  LogisticaFechasHelper::__init()->cierrePeriodo();
    }
    // public function validarCierre(){
    //     $estructurasubsist = $this->integrator->datosmaestros->buscarInstancia($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT);
    //     if ($estructurasubsist->contabiliza) {
    //         $datos = $this->cargarDocuPendAft(array());
    //         if($datos['cantidad'] > 0){
    //             throw new ZendExt_Exception('LOG_LB_CIERE_002');
    //         }
    //     }
    // }
   
    private function validarDiferenciasContabilidad() {

        $idestructura = $this->global->Estructura->idestructura;        
        $idEjercicioActual = $this->integrator->datosmaestros->ejercicioActualSubsistema($idestructura, 11);

        $conn = Zend_Registry::get('conexion');
        $resultado = $conn->fetchAll("select * from mod_logactivofijotangible.f_balancecontbaleaft({$idestructura}, {$idEjercicioActual})"
       );  
        $diferencias = "<table style='width:90%'><tr><th><b>Cuenta</b></th>
                            <th style='width:100px; text-align:right;'><b>Saldo contable</b></th>
                            <th style='width:100px; text-align:right;'><b>Saldo aft</b></th>
                            <th style='width:100px; text-align:right;'><b>Diferencia</b></th>
                        </tr>";
        $existe = false;
 
        $arraydiferencias = array();
       // print_r($resultado);die; 
        for ($i = 1; $i < count($resultado); $i++) {
    
            $arraydiferencias = $resultado[$i]['saldo']-$resultado[$i]['valor'];
            if (($resultado[$i]['saldo']-$resultado[$i]['valor'])>0) {
                $existe = true;
                $diferencias .= '<tr><td>'. $resultado[$i]['concatcta']. "</td>".
                    "<td style='text-align:right'>". number_format($resultado[$i]['saldo'], 2, '.', ',').'</td>'.
                    "<td style='text-align:right'>". number_format($resultado[$i]['valor'], 2, '.', ',').'</td>'.
                    "<td style='text-align:right'>". number_format(($resultado[$i]['saldo']-$resultado[$i]['valor']), 2, '.', ',').'</td><tr>';
                    
            }    

           
        }
        $diferencias .= '</table>'; 
          return array('diferencias' => $existe, 'detalle'=>$diferencias);


          

        

        // if ($resultado>0 ){
        //    print_r($resultado[1]);die;


        // }
        // foreach ($datos as $d) {
        //     if (abs($d['diff']) > 0 )) { 
        //        // modificar if y calcular diff =saldo- valor
        //         $existe = true;
        //         $diferencias .= '<tr><td>'. $d['concatctax']. "</td>".
        //             "<td style='text-align:right'>". number_format($d['saldo'], 2, '.', ',').'</td>'.
        //             "<td style='text-align:right'>". number_format($d['valoraft'], 2, '.', ',').'</td>'.
        //             "<td style='text-align:right'>". number_format($d['diff'], 2, '.', ',').'</td><tr>';
        //     }
        // }
        // $diferencias .= '</table>';
      //  print_r(array('diferencias' => $existe, 'detalle'=>$diferencias));die;


    }



    

    public function getDocSinComprobante()
    {
        $objC = ComunAFTModel::getInstance();
        if ($objC->integradoContabiliadConf($this->idestructuracomun)) {
            $idsOpContabilizan = $objC->getArrayIdOpersQueContabililzan(false);
            $parametros['idestructuracomun'] = $this->idestructuracomun;
            $parametros['idestado'] = array(EstadoDocumentoModel::ESTADO_APROBADO);
            $parametros['idoperacion'] = (is_array($idsOpContabilizan)) ? $idsOpContabilizan : null;
            $parametros['dql'] = true;
            $objActSer = new DocumentoActivoService();
            $dql = $objActSer->obtenerDocumentos($parametros);
            $datos = $dql->andWhere("d.idcomprobante is null")->fetchArray();
            return array(
                'cantidad' => $dql->count(),
                'datos' => $datos
            );
        } else {
            return array('cantidad' => 0);
        }
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
        return parent::cierreEjercico(LogisticaGlobal::SUBSISTEMA_AFT);
    }

    /**
     *
     */
    public function devolverTipoDocumento()
    {
        $cEstructura = 'Estructura';
        $sConfgeneral = ServiciosConfiguracionGeneralHelper::__init();

        return $sConfgeneral->documentosPorSubsistemaEntidad(
                LogisticaGlobal::SUBSISTEMA_AFT, $this->global->$cEstructura->idestructura
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
        return $obj->getBuscarRegNumDepreciadoCierre(array(), $this->global->Estructura->idestructura,$idsubsistema);
    }

    public function cargaDatosFecha()
    {
        return parent::cargaDatosFecha(LogisticaGlobal::SUBSISTEMA_AFT);
    }

    public function cierreApertCicloCuantasAftOLD($cuentasAft, $cuentasContabilidad)
    {
        foreach ($cuentasContabilidad as $index => $value) {
            foreach ($cuentasAft as $idx => $cuenta) {
                if($cuentasContabilidad[$index]['idcuenta'] == $cuentasAft[$idx]['idcuenta']){
                    if(
						number_format($cuentasContabilidad[$index]['saldo'],2) != 
						number_format($cuentasAft[$idx]['saldo'],2)
					){
						print_r(number_format($cuentasContabilidad[$index]['saldo'],2));
						print_r(number_format($cuentasAft[$idx]['saldo'],2));
						die;
						return 0;
					}  
				}
            }
        }
		die('end');
	return 1;
    }
	
	public function cierreApertCicloCuantasAft($datos_contables)
    {
        foreach ($datos_contables as $index => $value) {
            if($value['saldo'] !== $value['valor']){
				return 0;
			}
        }
		return 1;
    }

    /**
     * Metodo para realizar el cierre de la apertura de todos los depositos
     * 
     * @return array
     */
    public function cierreApertura()
    {
        $objActSer = new DocumentoActivoService();
        $idestructura = $this->global->Estructura->idestructura;
        $datos = $objActSer->obtenerDocumentos(array('codigooperacion' => 'OPER_APERTURA', 'idestado' => 1));
		
        if (count($datos) > 0) {
            return array('error' => 1); //Si existen documentos de apertura en elaboracion enviar error 1
        } else {
            //Todos los documentos tienen que estar en preparado
            $cuentasCuadradas = $this->validarCuadreCuentas();
            if($cuentasCuadradas){
                $objActSer->aprobarAperturasCierre($idestructura);
                
                /* 
                 * El historial inicial se crea en la carga inicial de los medios
                 * y debido a esto, no es necesario volverlo a correr.
                 */ 
                // $historialRNEstadosModel = new HisRegNumericoEstatusModel();
                // $historialRNEstadosModel->crearHistorialInicial($idestructura);
                
                //Metodo para cerrar la carga inicial en datos_maestos.datestructurasubs
                $this->configuracionHelper->cierreCargaInicial($idestructura, LogisticaGlobal::SUBSISTEMA_AFT);
                return array('exito' => 1); //El cierre se realizo con exito

            } else {
                return array('error' => 8); //Error que no coenciden los saldos de las cuentas
            }
        }
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
            "nmod.denominacion as denommodelo, ni.idnaturaleza as idnaturaleza ".
            "FROM mod_logactivofijotangible.dat_movregnumericoactivo dmrna ".
            "INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn ON dmrna.idmovregnumerico = dmrn.idmovregnumerico ".
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
            "WHERE no.codigooperacion = 'OPER_APERTURA' AND dd.estado = 2 and docaft.tipo = 0 ".
            "AND dp.idestructuracomun = ".$idEstructura." ".
            "GROUP BY ngs.idgruposubgrupo, ni.denominacion,nm.denominacion, nmod.denominacion, ni.idnaturaleza ";


        $datos = $conn->fetchAll($sqlImporte);
		
        $cfgGrupoCueta = new ConfgruposcuentasModel();
        $confHelper = ServiciosConfiguracionGeneralHelper::__init();
        $monedas = $confHelper->monedaContableEntidad($idEstructura);
        $moneda = array();
        $alternativa = 0;
        foreach ($monedas['datos'] as $index => $value) {
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
            $grupo = $query->from(
                    'NomGruposubgrupo g')
                ->where('g.idgruposubgrupo = ?', array($dato['idgruposubgrupo']))
                ->fetchArray();
            $grupo[0]['importevalor'] = $dato['importevalor'];
            $grupo[0]['importedepreciacion'] = $dato['importedepreciacion'];
            $grupo[0]['importevaloralternativo'] = $dato['importevaloralternativo'];
            $grupo[0]['importedepreciacionalternativo'] = $dato['importedepreciacionalternativo'];

            //$grupo = $cfgGrupoCueta->getGrupoCuentas($grupo[0], $asocGruposCuentas);
			
            $aux = $cfgGrupoCueta->getConfGruposCuentas($dato['idgruposubgrupo'])[0];
			
            $grupo = array_merge($grupo[
                0], $aux);

            if (count($aux) == 0)
                return array('error' => 7);
            if ($grupo['idcuentaactivo'] == '') {
                // El grupo $grupo['denominacion'] no tiene asociado una cuenta de activos.
                return array('error' => 4, 'msg' => $grupo['desccuentaActivoscup']);
            } elseif ($grupo['idcuentadepreciacion'] == '' && $dato['idnaturaleza'] != -5) {
                // El grupo $grupo['denominacion'] no tiene asociado una cuenta de depreciacion.
                return array('error' => 5, 'msg' => $grupo['desccuentaDepreciacioncup']); //
            } elseif ($alternativa == 1) {
                if ($grupo['idcuentaactivoalternativa'] == '') {
                    // El grupo $grupo['denominacion'] no tiene asociado una cuenta de activos alternativa.
                    return array('error' => 4, 'msg' => $grupo['desccuentaActivoscuc']);
                } else if ($grupo['idcuentadepreciacionalternativa'] == '' && $dato['idnaturaleza'] != -5) {
                    // El grupo $grupo['denominacion'] no tiene asociado una cuenta de depreciacion alternativa.
                    return array('error' => 5, 'msg' => $grupo['desccuentaDepreciacioncuc']); //
                }
            }
            array_push($data, $grupo);
        }

        $arrcuentas = array();
        foreach ($data as $valor) {
			if($valor['idcuentaactivo'])
				$arrcuentas[$valor['idcuentaactivo']] += $valor['importevalor'];
            if($valor['idcuentaactivoalternativa'])
				$arrcuentas[$valor['idcuentaactivoalternativa']] += $valor['importevaloralternativo'];
            if($valor['idcuentadepreciacion'])
				$arrcuentas[$valor['idcuentadepreciacion']] += $valor['importedepreciacion'];
            if($valor['idcuentadepreciacionalternativa'])
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
	
    public function getDatosBalanceContable($idEstructura)
    {
        $idEstructura = $this->global->Estructura->idestructura;
        $idEjercicioActual = $this->integrator->datosmaestros->ejercicioActualSubsistema($idEstructura, 4);
        $datos = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logactivofijotangible.f_balancecontbaleaft({$idEstructura}, {$idEjercicioActual})"
        );
        return $datos;
    }
	
	public function validarDepreciacion() {

        $sConfActivos = new ConfiguracionActivosService();
        $cEstructura = 'Estructura';
        $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $confEntidad = $sConfActivos->getConfiguracionPG($idestructura);
        if ($confEntidad[0]['depreciacion']) {
            $cPeriodo = 'Periodo';
    		$idperiodo = ZendExt_GlobalConcept::getInstance()->$cPeriodo->periodoactual;
    		$resp = DepreciacionService::existeDepreciacion($idperiodo, $idestructura);
    		return $resp;
        } else {
           return [];
        }
	}
	
	public function validarCuadreCuentas() {
        $idestructura = $this->global->Estructura->idestructura;
        $objC = ComunAFTModel::getInstance();
        $integradoContabilidad = $objC->integradoContabiliadConf($idestructura);
        if($integradoContabilidad == 1){
            $datos_contables = $this->getDatosBalanceContable($idestructura);
            if (count($datos_contables) > 0) {//Comparar si las cuentas tienen el mismo saldo.
                $valid = $this->cierreApertCicloCuantasAft($datos_contables);
    
                if($valid == 0) {
                    return false;
                }else{
                    return true;
                }
            }
            return true;
        }else{
            return true;
        }
		
	}

    public function existenDocsAprobados($idestructura){
        $sql = "
            SELECT d.iddocumento
            FROM mod_logistica.dat_documento d
            WHERE d.iddoc IN (
                SELECT dprim.iddoc
                FROM mod_datosmaestros.dat_documentoprim dprim
                INNER JOIN mod_datosmaestros.dat_estructurasubsist sub on sub.idestructurasubsist = dprim.idestructurasubsist
                WHERE sub.idsubsistema = 11 and sub.idestructuracomun = {$idestructura}
            ) and d.estado = 3
        ";
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        if(count($datos) > 0){
            return true;
        }
        return false;
    }

}

