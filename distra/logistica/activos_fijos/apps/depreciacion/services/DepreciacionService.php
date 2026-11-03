<?php

/**
 * Class DepreciacionService
 */
class DepreciacionService
{
    private $_mComunAFT, $_mDepEntidad, $_sDatMaestros, $_sRegNumerico, $_fechaContable, $_configuracionHelper;

    /* private $mDepEntidad;
      private $sDatMaestros;
      private $sRegNumerico;
      private $fechaContable; */

    public function __construct()
    {
        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->_mDepEntidad = new DepreciarEntidadModel();
        $this->_sDatMaestros = DatosMaestrosHelper::__init();
        $this->_sRegNumerico = new RegNumericoService();

        $this->_configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $fecha = $this->_configuracionHelper->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT
        );

        $this->_fechaContable = ($fecha->fecha) ? $fecha->fecha : date('d/m/Y');
    }

    /**
     * Devuelve un arreglo con los registros numéricos incluidos en el $arrIdRegNumerico y que traen como atributo una
     * variable en 'esta' en verde si el medio a depreciado en el período y negro si no
     *
     * @param bool $arrIdRegNumerico
     * @param      $idEstructura
     *
     * @return mixed
     */
    public function getBuscarRegNumDepreciado($arrIdRegNumerico, $idEstructura)
    {
        $fecha = $this->_sDatMaestros->getFechaContableSubsistemaObj($idEstructura, LogisticaGlobal::SUBSISTEMA_AFT)
            ->fecha;

        $modelo = DepreciacionModelFactory::getInstance(0);

        $query = $modelo->getQueryRegNumericosDepreciar($fecha, array(), $arrIdRegNumerico, false, $idEstructura);
        if ($query) {
            return $query->fetchArray();
        } else {
            return array();
        }
    }

    /**
     * @param $arrIdRegNumerico
     */
    public function depreciarByArrIdesRegNumericos($arrIdReg, $codigooperacion)
    {
        foreach ($this->_mDepEntidad->getMetodosDepreciacion() as $value) {
            $modelo = DepreciacionModelFactory::getInstance($value['idmetodo']);

            $arrIdeRegNum = $modelo->getArrIdRegNumericosDepreciar(
                $this->_fechaContable, $value['idmetodo'], $arrIdReg
            );

            if (count($arrIdeRegNum) > 0) {
                $modelo->depreciarRegNumByArrIdes($arrIdeRegNum, $this->_fechaContable, $codigooperacion);
            }
        }
    }

    public function getBuscarRegNumDepreciadoCierre($idRegNumerico, $idestruct,$idsubsistema)
    {
        $conn = Zend_Registry::get('conexion');
        //$fechacontable = 'FechaContable';
        $fechacontable = $this->_sDatMaestros->getFechaContableSubsistemaObj(
            $idestruct, LogisticaGlobal::SUBSISTEMA_AFT
        )
        ->fecha;

        $retur = null;
        $operacionesDeprec = $this->_mComunAFT->getDatosInterfazOperacion(
            11, false, false, false
        );
        if (!$operacionesDeprec) {
            throw new ZendExt_Exception('LOG_AFT_DOC_0010');
        }

        $idoperacion = $operacionesDeprec[0]['idoperacion'];
        $idareashijas = implode(',', $this->_mComunAFT->getIdsAreasHijas());
        $idareashijas = $idareashijas.','.$idestruct;


        $select = "SELECT DISTINCT
                case when q.idregnumerico > 0 then 'verde' else 'negro' end as esta, n.idregnumerico,ni.denominacion

                FROM mod_logactivofijotangible.dat_regnumericoactivo n
                    INNER JOIN mod_logactivofijotangible.dat_registronumerico r ON n.idregnumerico = r.idregnumerico
                    INNER JOIN mod_logactivofijotangible.nom_actividad a ON n.idactividad = a.idactividad
                    INNER JOIN mod_logactivofijotangible.nom_estatustecnico e ON n.idestatustecnico = e.idestatustecnico
                    INNER JOIN mod_logistica.dat_producto p ON r.idproducto = p.idproducto                    
                    INNER JOIN mod_estructuracomp.nom_filaestruc f ON f.idfila = p.idestructura                     
                    INNER JOIN mod_logactivofijotangible.conf_parametrosgenerales general on general.idestructura = f.idfila                    
                    INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON p.idindicador = ih.idindicador
                    INNER JOIN mod_datosmaestros.nom_indicador ni ON ih.idindicador = ni.idindicador                    
                    
                    LEFT JOIN mod_datosmaestros.nom_gruposubgrupohoja gsh ON ih.idgruposubgrupo = gsh.idgruposubgrupo
                    inner join 
                    (select mrn.idregnumerico, mrna.depreciacion, mrna.cantidadrecursoconsumido, mrna.recursoconsumido
                    from mod_logactivofijotangible.dat_movregnumerico mrn                    
                    inner JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna ON mrn.idmovregnumerico = mrna.idmovregnumerico
                    inner JOIN mod_logistica.dat_movimiento m ON mrn.idmovimiento = m.idmovimiento
                    inner JOIN mod_logistica.dat_documento doc ON doc.iddocumento = m.iddocumento 
                    and doc.idoperacion = '$idoperacion' AND doc.fechacontable = '$fechacontable') q on 
                    q.idregnumerico = n.idregnumerico";

        $where = " WHERE ( n.idestadoperacion not in (6,7) and e.deprecia = 1 and general.depreciacion = 1 
                and f.idfila IN ( $idareashijas ) and n.idregnumerico 
                IN (SELECT drn1.idregnumerico
                    FROM mod_logactivofijotangible.dat_registronumerico drn1
                    INNER JOIN mod_logactivofijotangible.his_regnumericoestatus hrn ON hrn.idregnumerico = drn1.idregnumerico
                    WHERE drn1.idregnumerico = n.idregnumerico AND
                    hrn.fechainicio <= '$fechacontable' AND hrn.deprecia = 1)
                ) ";

        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        $idnatUTILES = IntegracionNomencladoresModel::NATURALEZA_HERRAMIENTA;
        if ($idsubsistema == 22) {
            $where .= " and ni.idnaturaleza IN($idnatObjObra,$idnatINMUEBLE)";
        } else {
            $where .= " and ni.idnaturaleza Not IN($idnatObjObra,$idnatINMUEBLE)";
        }
        //$where .= " and ni.idnaturaleza Not IN($idnatUTILES)";
		$where .= " and coalesce(ih.isuh,0) = 0";
        if ($idRegNumerico) {
            $select .= "and n.idregnumerico IN (".implode(',', $idRegNumerico).")";
        }
        $retur = "0";

		$sistema = $conn->fetchAll($select.$where);
		foreach ($sistema as $regnumdepre) {
            if ($regnumdepre['esta'] == 'negro') {
                $retur = "1";
                break;
            } else {
                $retur = "0";
            }
        }

        return $retur;
    }

    /**
     * Metodo que se encarga de buscar todos los activos que estan totalmante depreciados en un area o entidad
     *
     * @param bool|integer idarearesp
     * @return activos
     */
    public function getRegNumDepreciadosTotalMente($parametros)
    {
        $params = "";
        $disponible = new RegNumActivoService();
        $metosDepre = $this->_mDepEntidad->getMetodosDepreciacion();

        $cEstructura = 'Estructura';
        $globalidEstructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        //$estructuraHelper = ServiciosEstructuraComposicionHelper::__init();
        // $areashijas = $estructuraHelper->getEstructurasHijasById(0, $globalidEstructura, false, true);       
        //$areashijas = $this->_mComunAFT->getIdEstructurasHijas($globalidEstructura, false);
		$areashijas = $this->_mComunAFT->getIdsAreasHijas();
		
        //$areashijas = $this->getLlenarIDAreasHijas($result);       
        foreach ($metosDepre as $metodos) {
            $idmetodo[] = $metodos['idmetodo'];
        }
        if (!$parametros['idarearesp']) {
            $param['arrayIdarearesp'] = $areashijas;
        } else if ($parametros['idarearesp'] == "") {
            $param['arrayIdarearesp'] = $areashijas;
        } else {
            $param['arrayIdarearesp'] = $parametros['idarearesp'];
        }

        $query = $disponible->getMediosDisponibles($params, true);
        $query->where('drna.idestadoperacion <> 7');
        $query->WhereIn('drna.idarearesp', $param['arrayIdarearesp']);
        $query->addSelect('drna.idarearesp');
        if (count($idmetodo) > 0) {
            $query->andWhereIn('nact.iddepreciacion', $idmetodo);
        }

        $mediosDisp = $query->fetchArray();

        $datos = $this->getRecorrerMediosDisponibles($mediosDisp, $parametros['todos'], $globalidEstructura);
        return $datos;
    }

    public function getRecorrerMediosDisponibles($mediosDisp, $todos, $globalidEstructura)
    {
        foreach ($mediosDisp as $mediosD) {
            $mediosD['idindicador'] = $mediosD['id'];
            $mediosD['idestructura'] = $globalidEstructura;
            unset($mediosD['id']);
            if ($todos != 2) {
                $valorSalvamento = $mediosD['porcientorecuperacion'] * $mediosD['valorcontable'] / 100;
				$valorSalvamentoAlt = $mediosD['porcientorecuperacion'] * $mediosD['valorcontablealternativo'] / 100;
                if (($mediosD['valorcontable'] - $mediosD['depreciacionacumulada']) <= $valorSalvamento
				&& ($mediosD['valorcontablealternativo'] - $mediosD['depreciacionacumuladaalternativo']) <= $valorSalvamentoAlt
				
				) {
                    $datos[] = $mediosD;
                }
            } else
                $datos[] = $mediosD;
        }
        return $datos;
    }

    public function getLlenarIDAreasHijas($result)
    {
        foreach ($result as $resul) {
            $idareas[] = $resul['id'];
        }
        return $idareas;
    }

	/*
	 * Para conocer si en el periodo actual se ha realizado la depreciacion
	*/
	
	public function existeDepreciacion($idperiodo, $idestructura){
		
		$conn = Zend_Registry::get('conexion');
		
		$sql = "
			SELECT d.idcomprobante, d.iddocumento
			FROM mod_logistica.dat_documento d
			INNER JOIN mod_datosmaestros.nom_operacion op on op.idnomoperaciones = d.idoperacion
			WHERE d.idperiodo = {$idperiodo}
			and d.idestructuracomun = {$idestructura}
			and d.estado = 3
			and op.codigooperacion = 'OPER_DEPRECIACION'
		";
		$datos = $conn->fetchAll($sql);
		
		if(count($datos) > 0){
			$countSinContabilizar = 0;
			foreach($datos as $doc){
				if ($doc['idcomprobante'] == null || ($doc['idcomprobante'] < 1 && $doc['idcomprobante'] != -1)){
					$countSinContabilizar++;
				}
			}
			if($countSinContabilizar == 0){
				return [];
			}else{
				// El documento de deprecición no se ha contabilizado.
				return [
					'noContabilizados' => $countSinContabilizar,
					'noDepreciados' => 0
				];
			}
		}else{
			// No se ha realizado ninguna depreciación en el periodo
			return [
					'noContabilizados' => 0,
					'noDepreciados' => 1
				];
		}
	}
	

}
