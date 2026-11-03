<?php

/**
 * Modelo para servicios de operaciones de depreciacion en
 * Activos Fijos Tangibles (AFT).
 * 22/11/2012
 *
 * @author  Jorge Luis Cuellar Mondeja
 * @package logistica
 * @version 0.1
 */
class DepreciacionLinealModel extends DepreciacionComunModel
{

    /**
     * SEGÚN MALDONADO
     *
     *                                   Valor Contable – Valor de Salvamento
     *  Tasa de depreciación anual  =  ----------------------------------------
     *                                           Vida Útil Probable
     *
     *                                   (Tasa de depreciación anual) x período
     *  Tasa de depreciación periodo  =  ----------------------------------------
     *                                                   12
     *
     * -------------------------------------------------------------------------
     * MIS CÁLCULOS (Ya que la tasa me la dan por %)
     *
     *
     *    Tasa de depreciación Anual (PARTE)      Tasa (PORCIENTO)
     *  -------------------------------------- = ------------------  (Fórmula de %)
     *                   (TOTAL)                      100
     *
     *
     *    Donde:
     *
     *    TOTAL = Valor Contable - VALOR DE SALVAMENTO;
     *
     *     VALOR DE SALVAMENTO (PARTE)     Porciento de recuperación (PORCIENTO)
     *  ----------------------------- = ---------------------------------------  (Fórmula de %)
     *     Valor Contable (TOTAL)             100
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Para calcular la tasa de depreciación anual, este método no aplica ya que para línea recta ya la tasa se
     * registra
     * de manera porcentual, por lo cual no hay necesidad de calcularla
     *
     * @param int   $valorSalvamento
     * @param float $valorContable
     * @param  int  $vidaUtilProvable
     *
     * @return float
     */
    public function getTasaAnual($valorSalvamento, $valorContable, $vidaUtilProvable)
    {
        $totalDepreciar = $valorContable - $valorSalvamento;
        $tasaDepreciacionAnual = $totalDepreciar / $vidaUtilProvable;

        return $tasaDepreciacionAnual;
    }

    /**
     * Para calcular la tasa de depreciación del período a depreciar, este método no aplica ya que para línea recta
     * ya la tasa se registra e manera porcentual, por lo cual no hay necesidad de calcularla
     *
     * @param $porcientoRecuperacion
     * @param $valorContable
     * @param $vidaUtilProvable
     * @param $depAcumulada
     *
     * @return float|int
     */
    public function getTasaPeriodo($porcientoRecuperacion, $valorContable, $vidaUtilProvable, $depAcumulada,
        $fechaDepInicial, $idRegNumerico, $tasaRegNumerico = false, $fechaexpfin = false)
    {
        $valorSalvamento = $this->getValorSalvamento($porcientoRecuperacion, $valorContable);
        if (($valorContable - $depAcumulada) >= $valorSalvamento) {

            $tasaAnual = $this->getTasaAnual($valorSalvamento, $valorContable, $vidaUtilProvable);
            $depDiaria = $tasaAnual / 365;
            $cantDiasDepreciar = $this->getCantDiasInicioDepreciarEntreMov(
                $idRegNumerico, $fechaDepInicial, $fechaexpfin
            );
            $return = $depDiaria * $cantDiasDepreciar;
        }

        return ($return) ? $return : 0;
    }

    /**
     * Devuelve el listado de registros numéricos a depreciar para el período a depreciar y para el método de línea
     * recta
     *
     * @param date  $fecha
     * @param array $parametros
     * @param array $whereIN
     *
     * @return array
     */
    public function getRegNumericosDepreciar_Old($fecha, $parametros, $whereIN = array())
    {
		unset($parametros['start']);
		unset($parametros['limit']);
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatInmuebles = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        $idnatUtilesHerramientas = IntegracionNomencladoresModel::NATURALEZA_HERRAMIENTA;
       // $idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;  
        $query = $this->getQueryRegNumericosDepreciar($fecha, $parametros, $whereIN, $parametros['idmetodo']);
        $query->where('nact.iddepreciacion = 2');
        if ($idnatInmuebles && $idnatObjObra) {
            $query->andWhereNotIn('i.idnaturaleza', array($idnatInmuebles, $idnatObjObra));
        }

        // Excluyendo los que ya esten depreciados
		$query->addWhere("drna.valorcontable > drna.depreciacionacumulada or drna.valorcontablealternativo > depreciacionacumuladaalternativo");
		$sql_dep = "(CASE
						WHEN 
						 (round(drna.valorcontable * drna.tasafiscal/100/(360/30),2)"
						."
						 + drna.depreciacionacumulada > drna.valorcontable)
						THEN round((drna.valorcontable - drna.depreciacionacumulada),2) 
						ELSE round(drna.valorcontable * drna.tasafiscal/100/(360/30)"
						."
						,2)						
					END) AS depreciacion";
		$query->addSelect($sql_dep);
		$sql_dep_alt = "(CASE
						WHEN 
						 (round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2)"
						."
						 + drna.depreciacionacumuladaalternativo > drna.valorcontablealternativo)
						THEN round((drna.valorcontablealternativo - drna.depreciacionacumuladaalternativo),2) 
						ELSE round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30)"
						."
						,2)						
					END) AS depreciacioncuc";
        $query->addSelect($sql_dep_alt);
		
        $query->andWhere('coalesce(ih.isuh,0) = 0');
        $idestructura = $this->global->Estructura->idestructura;
        $query->addWhere('p.idestructuracomun = ?', $idestructura);
		$query->orderBy('p.idproducto');
		
		/*print_r(
            array(
                'query' => $query->getSqlQuery(),
                'params' => $query->getParams()
            )
        );die;*/
		
        if ($query) {
            $total = $query->count();

            return array('datos' => $query->fetchArray(), 'cantidad' => $total);
        } else {
            return array('datos' => array(), 'cantidad' => 0);
        }
    }

    /**
     * Devuelve el listado de registros numéricos a depreciar para el período a depreciar y para el método de línea
     * recta
     *
     * @param date  $fecha
     * @param array $parametros
     * @param array $whereIN
     *
     * @return array
     */
    public function getRegNumericosDepreciar($fecha, $parametros, $whereIN = array())
    {
        $idestructura = $this->global->Estructura->idestructura;
        $arrNaturalezasExcluir = implode(',', array(
            IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA,
            IntegracionNomencladoresModel::NATURALEZA_INMUEBLE,
            IntegracionNomencladoresModel::NATURALEZA_HERRAMIENTA
            )
        );

        $sql_SELECT = "
                SELECT 
                    drna.idregnumerico, 
                    p.idproducto, 
                    drna.idestatustecnico, 
                    drna.valoradquisicion,
                    drna.depreciacionacumulada,
                    drna.tasafiscal,
                    drna.porcientorecuperacion,
                    drna.valorcontable,
                    drna.vidautil,
                    drna.fechaadq,
                    drna.fechaexpini,
                    drna.fechaexpfin,
                    drna.recursoconsumido,
                    drna.cantidadrecursoconsumido,
                    drna.nroinventario,
                    drna.recursoconsumidomax,            
                    drna.valorcontablealternativo,
                    drna.valoradquisicionalternativo,
                    drna.depreciacionacumuladaalternativo,
                    (
                        CASE WHEN
                            drna.valorcontable * drna.tasafiscal/100/(360/30) + drna.depreciacionacumulada > drna.valorcontable 
                            OR (drna.valorcontable * drna.tasafiscal/100/(360/30) = 0 AND drna.tasafiscal > 0 AND drna.depreciacionacumulada > 0)
                        THEN round((drna.valorcontable - drna.depreciacionacumulada),2)
                        ELSE round(drna.valorcontable * drna.tasafiscal/100/(360/30),2) 
                        END
                    ) as depreciacion,
                    
                    (
                        CASE WHEN
                        round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) + drna.depreciacionacumuladaalternativo > drna.valorcontablealternativo 
                            OR (round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) = 0 AND drna.tasafiscal > 0 AND drna.depreciacionacumuladaalternativo > 0)
                        THEN round((drna.valorcontablealternativo - drna.depreciacionacumuladaalternativo),2)
                        ELSE round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) 
                        END
                    ) as depreciacionalternativo,
                
                    drnat.nromatricula,
                    drnat.nromotor1,
                    drnat.indicativo,
                    ni.idindicador,
            
                    ni.denominacion,
                    ni.numeropieza,
                    ni.descripcion,
                    ni.idnaturaleza,
                    ni.codigo,
                    (ni.codigo || ' - ' || ni.denominacion) AS codigodenominacion,                    
                    
                    nact.denominacion AS actividad,
                    nact.iddepreciacion,
                    (ni.denominacion || ' ' ||((Case
                                                When nih.idmarca is not null Then (
                                                    nmarca.denominacion ||(Case
                                                                        When nih.idmodelo
                                                                            is not null Then
                                                                            ' - '
                                                                        Else ''
                                                                        End))
                                                Else ''
                                                End) ||(Case
                                                        When nih.idmodelo is not null Then
                                                            nmodelo.denominacion
                                                        Else ''
                                                        End))) AS descripcionmarcamodelo,
                    ((Case
                        When nih.idmarca is not null Then (nmarca.denominacion ||(Case
                                                                                When
                                                                                nih.idmodelo
                                                                                is not
                                                                                null Then
                                                                                ' - '
                                                                                Else ''
                                                                            End))
                        Else ''
                    End) ||(Case
                                When nih.idmodelo is not null Then nmodelo.denominacion
                                Else ''
                            End)) AS marcamodelo,
                            
                    cim.ididentificadormedio,
                    cim.identificador,
                    cim.denominacion AS denomidentificador,
                    cim.nombretabla,
                    cim.idindicador AS id
        ";
        $sql_FROM = "
            FROM mod_logactivofijotangible.dat_regnumericoactivo drna
            INNER JOIN mod_logactivofijotangible.nom_actividad na ON drna.idactividad = na.idactividad  
            INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON drna.idregnumerico = drn.idregnumerico
            INNER JOIN mod_logistica.dat_producto p ON drn.idproducto = p.idproducto and p.idestructuracomun = {$idestructura}
            INNER JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
            INNER JOIN mod_logactivofijotangible.his_regnumericoestatus hrn ON drn.idregnumerico = hrn.idregnumerico and hrn.fechafin is null and hrn.deprecia = 1 and hrn.fechainicio < '$fecha'
            LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drn.idregnumerico
            INNER JOIN mod_logactivofijotangible.nom_actividad nact on nact.idactividad = drna.idactividad
            INNER JOIN mod_logactivofijotangible.nom_depreciacion ndep on ndep.iddepreciacion = nact.iddepreciacion
            LEFT JOIN mod_datosmaestros.nom_marca nmarca ON nih.idmarca = nmarca.idmarca
            LEFT JOIN mod_datosmaestros.nom_modelo nmodelo ON nih.idmodelo = nmodelo.idmodelo
            LEFT JOIN mod_logactivofijotangible.conf_identificadormedio cim ON ni.idindicador = cim.idindicador
        ";
        $sql_WHERE = "
            WHERE (
                drna.idestadoperacion NOT IN (0, 7)
                AND drna.esbaja = 0
                AND ndep.iddepreciacion = 2
                AND ni.idnaturaleza NOT IN ($arrNaturalezasExcluir)
                AND nih.isuh <> 1
            )
        ";

        

        $sql_ORDER = " ORDER BY ni.denominacion ";


        $sql_SUB_QUERY = $sql_SELECT . $sql_FROM . $sql_WHERE . $sql_ORDER;
        
        $sql = "
            SELECT sub2.*
            FROM (
                SELECT 
                    sub1.idregnumerico, 
                    sub1.idproducto, 
                    sub1.idestatustecnico, 
                    sub1.valoradquisicion,
                    sub1.depreciacionacumulada,
                    sub1.tasafiscal,
                    sub1.porcientorecuperacion,
                    sub1.valorcontable,
                    sub1.vidautil,
                    sub1.fechaadq,
                    sub1.fechaexpini,
                    sub1.fechaexpfin,
                    sub1.recursoconsumido,
                    sub1.cantidadrecursoconsumido,
                    sub1.nroinventario,
                    sub1.recursoconsumidomax,            
                    sub1.valorcontablealternativo,
                    sub1.valoradquisicionalternativo,
                    sub1.depreciacionacumuladaalternativo,
                    sub1.nromatricula,
                    sub1.nromotor1,
                    sub1.indicativo,
                    sub1.idindicador,
            
                    sub1.denominacion,
                    sub1.numeropieza,
                    sub1.descripcion,
                    sub1.idnaturaleza,
                    sub1.codigo,
                    sub1.codigodenominacion,
                    
                    sub1.actividad,
                    sub1.iddepreciacion,
                    sub1.descripcionmarcamodelo,
                    sub1.marcamodelo,
                    sub1.ididentificadormedio,
                    sub1.identificador,
                    sub1.denomidentificador,
                    sub1.nombretabla,
                    sub1.id,
                    (
                        CASE WHEN (sub1.depreciacion + sub1.depreciacionacumulada) > sub1.valorcontable
                        THEN (sub1.valorcontable - sub1.depreciacionacumulada) 
                        ELSE sub1.depreciacion END
                    ) as depreciacion,
                    (
                        CASE WHEN (sub1.depreciacionalternativo + sub1.depreciacionacumuladaalternativo) > sub1.valorcontablealternativo
                        THEN (sub1.valorcontablealternativo - depreciacionacumuladaalternativo) 
                        ELSE sub1.depreciacionalternativo END
                    ) as depreciacionalternativo

                FROM (
                    SELECT sub.* 
                    FROM
                        ( $sql_SUB_QUERY ) as sub
                    WHERE sub.depreciacion > 0 OR sub.depreciacionalternativo > 0
                ) as sub1
            ) as sub2
        ";

        $sql .= $this->procesarFiltros($parametros);
        //print_r($sql);die;
        
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        //print_r($datos);die;
        $total = count($datos);

        if($total > 0){
            return array('datos' => $datos, 'cantidad' => $total);
        } else {
            return array('datos' => array(), 'cantidad' => 0);
        }
    }
	
	public function getSubConsRegNumEst($alias){
		return "(SELECT ('$fecha'- $alias.fechainicio)
                FROM HisRegNumericoEstatus $alias
                WHERE $alias.idregnumerico = drna.idregnumerico AND $alias.fechainicio < '$fecha' AND $alias.fechafin is null AND $alias.deprecia = 1 limit 1)";
	}

    /**
     * Depreciar un grupo de registros numéricos según su identificador y la fecha contable del período a depreciar
     *
     * @param $arrIdesRegNumericos
     * @param $fecha
     *
     * @throws ZendExt_Exception('LOG_AFT_DEP_002')
     *
     * @return void
     */
    public function depreciarRegNumByArrIdes($arrIdesRegNumericos, $fecha, $codigooperacion = false)
    {
        if ($codigooperacion != false) {
            $codigoOp = array('OPER_BAJA','OPER_BAJA_DESARME','OPER_BAJA_DEFINITIVA','OPER_BAJA_VENTA');
            $operacion = in_array($codigooperacion, $codigoOp);
        }        
        if (!$this->_entidadDeprecia) {
            return $msg = 4;
            // throw new ZendExt_Exception('LOG_AFT_DEP_002');
        }

        $documento = $this->getDocDepreciacion($fecha);

        $cDatMovRegnumerico = 'DatMovRegnumerico';
        $cDatMovRegnumericoActivo = 'DatMovRegnumericoActivo';
        $cDatRegNumerico = 'DatRegnumerico';
        $cDatRegNumActivo = 'DatRegnumericoActivo';

        $arrIdesProd = $this->getIdesProdByRegNumericos($arrIdesRegNumericos);

        $movCollection = new Doctrine_Collection('DatMovimientos');
        foreach ($arrIdesProd as $idProdLogistica) {

            $movimiento = $this->getNewInstanceMov($idProdLogistica, $documento->iddocumento);

            foreach ($arrIdesRegNumericos as $idRegNumerico) {
                
                $movRegNumerico = new DatMovRegnumerico();
                $movRegNumActivo = new DatMovRegnumericoActivo();

                self::clonePropertyRegNumeToMovRegNumerico($movRegNumerico, $movRegNumActivo, $idRegNumerico);

                $regNumeActivo = &$movRegNumerico->$cDatRegNumerico->$cDatRegNumActivo;
                if ($movRegNumActivo->valorcontable) {

                    $depPeriodo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable,
                        100/$movRegNumActivo->tasafiscal, $movRegNumActivo->depreciacionacumulada,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico,
                        $movRegNumActivo->tasafiscal, ($operacion) ? $movRegNumActivo->fechaexpfin: false
                    );
                    $valorSalvamento = $this->getValorSalvamento(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable
                    );
                    $restavcvs = $movRegNumActivo->valorcontable - $valorSalvamento;
                    $sumadepacudepperi = $regNumeActivo->depreciacionacumulada + $depPeriodo;

                    $movRegNumActivo->depreciacion = ($restavcvs < $depPeriodo) ? $restavcvs: $depPeriodo;
                    $depAcumulada = ($restavcvs < $sumadepacudepperi) ? $restavcvs :$sumadepacudepperi;
                    $movRegNumActivo->depreciacionacumulada = $depAcumulada;
                    $regNumeActivo->depreciacionacumulada = $depAcumulada;
                }

                if ($movRegNumActivo->valorcontablealternativo) {

                    $depPeriodoAlternativo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontablealternativo,
                        100/$movRegNumActivo->tasafiscal, $movRegNumActivo->depreciacionacumuladaalternativo,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico,
                        $movRegNumActivo->tasafiscal, ($operacion) ? $movRegNumActivo->fechaexpfin: false
                    );
                    $vcalter = $movRegNumActivo->valorcontablealternativo;
                    $depacumaltern = $regNumeActivo->depreciacionacumuladaalternativo;
                    $valorSalvamento = $this->getValorSalvamento($movRegNumActivo->porcientorecuperacion, $vcalter);


                    $restavcvs = $vcalter - $valorSalvamento;
                    $sumadepacudepperi = $depacumaltern + $depPeriodoAlternativo;
                    $movRegNumActivo->depreciacioncuc = ($restavcvs < $depPeriodoAlternativo) ? $restavcvs
                        : $depPeriodoAlternativo;

                    $depAcumulada = ($restavcvs < $sumadepacudepperi) ? $restavcvs :$sumadepacudepperi;

                    $movRegNumActivo->depreciacionacumuladaalternativo = $depAcumulada;
                    $regNumeActivo->depreciacionacumuladaalternativo = $depAcumulada;
                }
                $regNumeActivo->save();

                $movRegNumerico->$cDatMovRegnumericoActivo = $movRegNumActivo;
                $movimiento->$cDatMovRegnumerico->add($movRegNumerico);
            }           
             
            $movCollection->add($movimiento);

           
        }
        $movCollection->save();
        $mDocDepreciacion = new DocDepreciacionModel();

        $mDocDepreciacion->aprobarDocDepreciacion($documento->iddocumento);

        $historialRNEstadosModel = new HisRegNumericoEstatusModel();
        $historialRNEstadosModel->eliminarHistorial($arrIdesRegNumericos);
        $historialRNEstadosModel->guardarHistorialRegNumEstatus($documento->iddocumento, $fecha);
    }

    public function depreciarRegNumByData($arrIdesRegNumericos, $fecha, $codigooperacion = false)
    {
        if ($codigooperacion != false) {
            $codigoOp = array('OPER_BAJA','OPER_BAJA_DESARME','OPER_BAJA_DEFINITIVA','OPER_BAJA_VENTA');
            $operacion = in_array($codigooperacion, $codigoOp);
        }
        if (!$this->_entidadDeprecia) {
            return $msg = 4;
        }

        $documento = $this->getDocDepreciacion($fecha);

        $cDatMovRegnumerico = 'DatMovRegnumerico';
        $cDatMovRegnumericoActivo = 'DatMovRegnumericoActivo';
        $cDatRegNumerico = 'DatRegnumerico';
        $cDatRegNumActivo = 'DatRegnumericoActivo';

        $movCollection = new Doctrine_Collection('DatMovimientos');
        $cacheMov = array();
        foreach ($arrIdesRegNumericos['datos'] as $idProdLogistica) {

            if (!array_key_exists($idProdLogistica['idproducto'], $cacheMov)) {
                $cacheMov[$idProdLogistica['idproducto']] = 
					$this->getNewInstanceMov($idProdLogistica['idproducto'], $documento->iddocumento);
            }
            $movimiento = $cacheMov[$idProdLogistica['idproducto']];


            $idRegNumerico = $idProdLogistica['idregnumerico'];

            $movRegNumerico = new DatMovRegnumerico();
            $movRegNumActivo = new DatMovRegnumericoActivo();
            self::clonePropertyRegNumeToMovRegNumerico($movRegNumerico, $movRegNumActivo, $idRegNumerico);

            //$regNumeActivo = &$movRegNumerico->$cDatRegNumerico->$cDatRegNumActivo;
            $idProdLogistica['depreciacion'] = is_null($idProdLogistica['depreciacion']) ? 0  : $idProdLogistica['depreciacion'];
            $movRegNumActivo->depreciacion = $idProdLogistica['depreciacion'];
            $movRegNumActivo->depreciacionacumulada =  $idProdLogistica['depreciacionacumulada'] + $idProdLogistica['depreciacion'];
            //$regNumeActivo->depreciacionacumulada = $idProdLogistica['depreciacionacumulada'] + $idProdLogistica['depreciacion'];
			$movRegNumerico->$cDatRegNumerico->$cDatRegNumActivo->depreciacionacumulada = $idProdLogistica['depreciacionacumulada'] + $idProdLogistica['depreciacion'];

            $idProdLogistica['depreciacioncuc'] = is_null($idProdLogistica['depreciacioncuc']) ? 0  : $idProdLogistica['depreciacioncuc'];
            $movRegNumActivo->depreciacioncuc = $idProdLogistica['depreciacioncuc'];
            $movRegNumActivo->depreciacionacumuladaalternativo =  $idProdLogistica['depreciacionacumuladaalternativo'] + $idProdLogistica['depreciacioncuc'];
            //$regNumeActivo->depreciacionacumuladaalternativo = $idProdLogistica['depreciacionacumuladaalternativo'] + $idProdLogistica['depreciacioncuc'];
			$movRegNumerico->$cDatRegNumerico->$cDatRegNumActivo->depreciacionacumuladaalternativo = $idProdLogistica['depreciacionacumuladaalternativo'] + $idProdLogistica['depreciacioncuc'];
            
            $movRegNumerico->$cDatMovRegnumericoActivo = $movRegNumActivo;
            $movimiento->$cDatMovRegnumerico->add($movRegNumerico);
            $movCollection->add($movimiento);
        }
		//print_r($movCollection->toArray());die;
		
        $movCollection->save();
		
        $mDocDepreciacion = new DocDepreciacionModel();

        $mDocDepreciacion->aprobarDocDepreciacion($documento->iddocumento);

        $historialRNEstadosModel = new HisRegNumericoEstatusModel();
        $historialRNEstadosModel->eliminarHistorial(LogisticaObjectHelper::__init()->extractValueFromArrayColumn($arrIdesRegNumericos['datos'], 'idregnumerico'));
        $historialRNEstadosModel->guardarHistorialRegNumEstatus($documento->iddocumento, $fecha);
    }
	
	public function depreciarRegNumByDataNew($arrIdesRegNumericos, $fecha, $codigooperacion = false)
    {
        if ($codigooperacion != false) {
            $codigoOp = array('OPER_BAJA','OPER_BAJA_DESARME','OPER_BAJA_DEFINITIVA','OPER_BAJA_VENTA');
            $operacion = in_array($codigooperacion, $codigoOp);
        }
        if (!$this->_entidadDeprecia) {
            return $msg = 4;
        }

        $documento = $this->getDocDepreciacion($fecha);
		$mDocDepreciacion = new DocDepreciacionModel();
        $mDocDepreciacion->aprobarDocDepreciacion($documento->iddocumento);
        
		
		$idestructura = $this->global->Estructura->idestructura;
		$iddocumento = $documento->iddocumento;
				
		$conn = Zend_Registry::get('conexion');
		$var = $conn->fetchAll(
			"SELECT * FROM \"mod_logactivofijotangible\".\"f_depreciarmediosentidadlinearecta\"" .
			"($idestructura, $iddocumento)"
		);
		
        return 1;
    }

    public function depreciar($iddocumento) {
        $idestructura = $this->global->Estructura->idestructura;
				
		$conn = Zend_Registry::get('conexion');
		$var = $conn->fetchAll(
			"SELECT * FROM \"mod_logactivofijotangible\".\"f_depreciarmediosentidadlinearecta\"" .
			"($idestructura, $iddocumento)"
		);
		
        return 1;
    }
	
}


