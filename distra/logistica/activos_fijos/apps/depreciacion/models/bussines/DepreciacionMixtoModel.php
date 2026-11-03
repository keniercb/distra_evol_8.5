<?php

/**
 * Modelo para servicios de operaciones de depreciacion en
 * Activos Fijos Tangibles (AFT).
 * 22/11/2012
 *  clase que se creo para una nueva forma de depreciacion para transgaviota.
 * @author  Jorge Luis Cuellar Mondeja
 * @package logistica
 * @version 0.1
 */
class DepreciacionMixtoModel extends DepreciacionComunModel
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
    public function getTasaAnual($valorSalvamento, $valorContable, $horasMaqEstimada)
    {
        $totalDepreciar = $valorContable - $valorSalvamento;
        $factorDepAnual = $totalDepreciar / $horasMaqEstimada;

        return $factorDepAnual;
    }

    /**
     * Devuelve la tasa a depreciar el registro numérico en el período a depreciar
     *
     * @param      $porcientoRecuperacion
     * @param      $valorContable
     * @param      $horasMaqEstimada
     * @param      $depAcumulada
     * @param      $fechaDepInicial
     * @param bool $tasaRegNumerico
     *
     * @return float|int
     */
    public function getTasaPeriodo($porcientoRecuperacion, $valorContable, $horasMaqEstimada, $depAcumulada,
        $fechaDepInicial, $idRegNumerico, $tasaRegNumerico = false)
    {
        $valorSalvamento = $this->getValorSalvamento($porcientoRecuperacion, $valorContable);

        if (($valorContable - $depAcumulada) >= $valorSalvamento) {
            $factorDepAnual = $this->getTasaAnual($valorSalvamento, $valorContable, $horasMaqEstimada);

            $depDiaria = $factorDepAnual / 365;
            $cantDiasDepreciar = $this->getCantDiasInicioDepreciarEntreMov($idRegNumerico, $fechaDepInicial);

            return $depDiaria * $cantDiasDepreciar;
        }

        return 0;
    }

    /**
     * Devuelve el listado de los registros numéricos a depreciar en el período contable actual de la entidad
     *
     * @param       $fecha
     * @param       $parametros
     * @param array $whereIN
     *
     * @return array
     */

     /*
      * Metodo de depreciacion mixto con tope. Combinacion del metodo de recursos consumidos o kilometraje con un tope a depreciar anualmente segun el 
        metodo de linea recta.

        -- Variables:
        --DM - Depreciacion mensual
        --DA - Depreciacion acumulada
        --V - Valor contable del medio
        --TF - Tasa fiscal  del medio
        --VU - Vida util (Max cantidad de km a recorrer para depreciar totalmente)
        --CRC - Cantidad de recursos consumidos en el mes (kilometraje del mes)


        --MD - Cantidad de meses que lleva el medio depreciando
        --DAMA - Depreciacion acumulada maxima anual
        --DAMA = V / (100 / TF)
        --DAM - Depreciacion acumulada maxima
        --DAM = ((MD / 12 ) + (case MD % 12 > 0 then 1 else 0 end) ) * DAMA ---------- cambiar formula

        --Formula:
        --DM = CRC * (V / VU

        --Condiciones
        -- Se deprecia si:
        --    DAM > DM + DA
        --    Si DA < DAM y  DAM < DM + DA entonces DM = DAM - DA
      */
    public function getRegNumericosDepreciar($fecha, $parametros, $whereIN = array())
    {
        $cEstructura = 'Estructura';
        $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $idMetodoDep = DepreciacionModelFactory::getIdMetodoByClassName('DepreciacionMixtoModel');

        $sql_SELECT = "
            SELECT 
            drn.idproducto,
            drn.nroserie,
            drna.idregnumerico,
            drna.nroinventario,
            drna.depreciacionacumulada,
            drna.depreciacionacumuladaalternativo,
            drna.vidautil vidautil,
            drna.porcientorecuperacion,
            drna.valorcontable,
            drna.valorcontablealternativo,
            drna.valoradquisicionalternativo,
            drna.fechaexpini,
            drna.fechaexpfin,
            drna.fechaadq,
            drna.tasafiscal,
            drna.valoradquisicion,
            COALESCE(drna.recursoconsumido, 0) AS recursoconsumido,
            COALESCE(drna.cantidadrecursoconsumido, 0) AS cantidadrecursoconsumido,
            drnat.nromatricula,
            drnat.nrocirculacion,
            drnat.nromotor1,
            drnat.indicativo,
            dp.idestructuracomun,
            ni.idindicador,
            ni.denominacion,
            ni.numeropieza,
            ni.codigo,
            (ni.codigo || ' - ' || ni.denominacion) AS codigodenominacion,
            nat.denominacion AS naturaleza,
            ng.denominacion AS gruposubgrupo,
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
            cim.idindicador AS id,
            (round( drna.recursoconsumido * (drna.valorcontable / drna.vidautil),2)) as v_DM,
            (
                (DATE_PART('year', AGE('{$fecha}', COALESCE(drna.fechaadq, drna.fechaexpini))) * 12 ) +
                        DATE_PART('month', AGE('{$fecha}', COALESCE(drna.fechaadq, drna.fechaexpini)))  + 
                            CASE WHEN (SELECT DATE_PART('day', AGE('{$fecha}', COALESCE(drna.fechaadq, drna.fechaexpini)))) > 0 
                            THEN 1 
                            ELSE 0 
                            END
            
            ) as v_MD
        ";
        $sql_FROM = "                
            FROM mod_logactivofijotangible.dat_registronumerico drn
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna ON drna.idregnumerico = drn.idregnumerico
            LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat ON drna.idregnumerico = drnat.idregnumerico
            INNER JOIN mod_logistica.dat_producto dp ON drn.idproducto = dp.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador ni ON dp.idindicador = ni.idindicador
            INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
            INNER JOIN mod_datosmaestros.nom_naturaleza nat ON ni.idnaturaleza = nat.idnaturaleza
            INNER JOIN mod_logactivofijotangible.nom_actividad nact ON drna.idactividad = nact.idactividad
            LEFT JOIN mod_datosmaestros.nom_gruposubgrupo ng ON nih.idgruposubgrupo = ng.idgruposubgrupo
            LEFT JOIN mod_datosmaestros.nom_gruposubgrupohoja ngh ON ngh.idgruposubgrupo = ng.idgruposubgrupo
            LEFT JOIN mod_datosmaestros.nom_marca nmarca ON nih.idmarca = nmarca.idmarca
            LEFT JOIN mod_datosmaestros.nom_modelo nmodelo ON nih.idmodelo = nmodelo.idmodelo
            LEFT JOIN mod_logactivofijotangible.conf_identificadormedio cim ON ni.idindicador = cim.idindicador
        ";
        $sql_WHERE = "
            WHERE
                drna.idestadoperacion NOT IN (0,7)
                AND drna.esbaja = 0
                AND  dp.idestructuracomun =  $idestructura
                AND nact.iddepreciacion = $idMetodoDep 
                AND drn.idregnumerico IN (
                        SELECT rn.idregnumerico
                        FROM mod_logactivofijotangible.dat_registronumerico rn
                        INNER JOIN mod_logactivofijotangible.his_regnumericoestatus hrn ON rn.idregnumerico = hrn.idregnumerico
                        WHERE (
                                rn.idregnumerico = drn.idregnumerico 
                                AND hrn.fechainicio < '$fecha' 
                                AND hrn.deprecia = 1
                        )
                ) /*AND
                drna.valorcontable > drna.depreciacionacumulada */
                AND drna.recursoconsumido > 0
                AND nih.isuh <> 1
                ";
                
        $sql_SUB = "
            SELECT *, (ceil(sub.v_md/12) / (100/sub.tasafiscal) ) * sub.valoradquisicion as max_a_depre
            FROM (
                $sql_SELECT $sql_FROM $sql_WHERE
            ) sub
        ";

        $sql = "
            SELECT sub2.*,(case when (sub2.depcalculada + sub2.depreciacionacumulada) > sub2.valorcontable 
                then sub2.valorcontable - sub2.depreciacionacumulada else sub2.depcalculada end) as depreciacion 
            FROM (
                SELECT 
                    sub1.idregnumerico, 
                    sub1.idproducto, 
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
                    sub1.valorcontablealternativo,
                    sub1.valoradquisicionalternativo,
                    sub1.depreciacionacumuladaalternativo,
                    sub1.nromatricula,
                    sub1.nromotor1,
                    sub1.indicativo,
                    sub1.idindicador,
            
                    sub1.denominacion,
                    sub1.numeropieza,
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
                    	CASE WHEN
                        	-- SI LA SUPUESTA DEPRECIACION FINAL > MAXIMO A DEPRECIAR PERMITIDO PERO EL MAXIMO A DEPRECIAR ES MAYOR QUE LA DEPRECIACION ACUMULADA
                            (sub1.v_dm + sub1.depreciacionacumulada) > sub1.max_a_depre AND sub1.max_a_depre > sub1.depreciacionacumulada
                        THEN
                            sub1.max_a_depre - sub1.depreciacionacumulada
                        ELSE
                      		CASE WHEN
                            	-- SI LA DEPRECIACION ACUMULADA > MAXIMO A DEPRECIAR PERMITODO
                            	sub1.depreciacionacumulada > sub1.max_a_depre
                            THEN
                            	0
                            ELSE
                            	sub1.v_dm
                            END
                        END
                    ) as depcalculada
                FROM ( $sql_SUB ) sub1
                ORDER BY sub1.descripcionmarcamodelo
            ) as sub2
        ";


        $sql_validate = " SELECT drna.nroinventario"
        . $sql_FROM 
        . $sql_WHERE
        . 
        " AND 
            (
                (drna.vidautil is NULL OR drna.vidautil = 0)
                OR (drna.fechaadq is NULL AND drna.fechaexpini IS NULL)
                OR (drna.tasafiscal is NULL OR drna.tasafiscal = 0)
            )
        "
        ;

        $sql .= $this->procesarFiltros($parametros);
        $conn = Zend_Registry::get('conexion');
        $validate = $conn->fetchAll($sql_validate);
        //print_r($validate);die;

        if(count($validate) > 0)
        {
            $inventarios = array_map(function($elem){
                return "<b> {$elem['nroinventario']} </b>";
            }, $validate);
            $str_inventarios  = implode(', ', $inventarios);
            return array(
                'error' => true,
                'errMsg' => "Revise que los siguientes activos cumpla con las siguientes condiciones:</br>"
                ."Contengan: <b>Tasa fiscal > 0</b> </br>"
                ."Contengan: <b>Vida útil > 0</b> </br>"
                ."Contengan: <b>Fecha de adquisicion</b> ó <b>Fecha de explotación inicio</b> </br>"
                ."Activos: </br>" . $str_inventarios
            );
        }
//echo $sql;die;
        $datos = $conn->fetchAll($sql);

        return array('datos' => $datos, 'total' => count($datos));

    }

    /**
     * Devuelve el listado de los registros numéricos a depreciar en el período contable actual de la entidad
     *
     * @param       $fecha
     * @param       $parametros
     * @param array $whereIN
     *
     * @return array
     */
    public function getRegNumericosDepreciar_OLD($fecha, $parametros, $whereIN = array())
    {
        unset($parametros['start']);
        unset($parametros['limit']);
        $idMetodoDep = DepreciacionModelFactory::getIdMetodoByClassName('DepreciacionMixtoModel');
        $query = $this->getQueryRegNumericosDepreciar($fecha, $parametros, $whereIN, $idMetodoDep);
        if ($query) {
            //$query->where('nact.iddepreciacion = 3');
            $total = $query->count();

            /*$query->addSelect(
                "
            (
                SELECT COALESCE(SUM(rnac.cantidad),0) FROM DatRecursoRegNumericoActivo rnac
                WHERE rnac.idregnumericoactivo = drna.idregnumerico
                GROUP BY rnac.idregnumericoactivo
            ) AS recursoconsumido,
            (
                SELECT COALESCE(rnac2.lecturarecurso,0) FROM DatRecursoRegNumericoActivo rnac2
                WHERE rnac2.idregnumericoactivo = drna.idregnumerico
                ORDER BY rnac2.fecha DESC
                LIMIT 1
            ) AS cantidadrecursoconsumido
            "
            );*/
            $query->addSelect("
                COALESCE(drna.recursoconsumido,0) AS recursoconsumido, 
                COALESCE(drna.cantidadrecursoconsumido,0) AS cantidadrecursoconsumido");

            $dep = " ((drna.valorcontable / drna.vidautil) * COALESCE(drna.recursoconsumido,0)) ";
            $sqlDep = " CASE WHEN ($dep + drna.depreciacionacumulada) > drna.valorcontable THEN (drna.valorcontable - drna.depreciacionacumulada) ELSE $dep END ";
            $query->addSelect("(round($sqlDep, 2)) AS depreciacion");

            $query->addWhere('drna.valorcontable > drna.depreciacionacumulada');
            $query->addWhere('drna.recursoconsumido > 0');

            //$query->offset($parametros['start']);
            //$query->limit($parametros['limit']);

            //print_r($query->getSqlQuery());die;

            return array('datos' => $query->fetchArray(), 'total' => $total);
        } else {
            return array('datos' => array(), 'total' => 0);
        }

    }

    /**
     * Crea un nuevo movimiento de registro numérico con los últimos datos que tiene el registro numérico
     *
     * @param $movRegNumerico
     * @param $movRegNumActivo
     * @param $idRegNumerico
     */
    public function clonePropertyRegNumeToMovRegNumerico(&$movRegNumerico, &$movRegNumActivo, $idRegNumerico)
    {
        parent::clonePropertyRegNumeToMovRegNumerico($movRegNumerico, $movRegNumActivo, $idRegNumerico);
        $mRegDepreciacion = new RegistroDepreciacionModel();
        $movRegNumActivo->cantidadrecursoconsumido = $mRegDepreciacion->getCantRecConsumidoByIdRegNumerico(
            $idRegNumerico
        );
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
    public function depreciarRegNumByArrIdes($arrIdesRegNumericos, $fecha)
    {
        if (!$this->_entidadDeprecia) {
            throw new ZendExt_Exception('LOG_AFT_DEP_002');
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
/*aqqqiiiii*/
                if ($movRegNumActivo->valorcontable) {
                    // Cantidad de horas de explotación del medio en el período de depreciación
                    $horasExplotacionPeriodo = $movRegNumActivo->cantidadrecursoconsumido;

                    /*$factorDepPeriodo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable,
                        $movRegNumActivo->vidautil, $movRegNumActivo->depreciacionacumulada,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico
                    );*/
                    $factorDepPeriodo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable,
                        100/$movRegNumActivo->tasafiscal, $movRegNumActivo->depreciacionacumulada,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico, $movRegNumActivo->tasafiscal
                    );

                    $depPeriodo = $factorDepPeriodo * $horasExplotacionPeriodo;
                    $restavcvs = $movRegNumActivo->valorcontable - $valorSalvamento;
                    $depacudepperi = $regNumeActivo->depreciacionacumulada + $depPeriodo;
                    $valorSalvamento = $this->getValorSalvamento(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable
                    );

                    $movRegNumActivo->depreciacion = ($restavcvs < $depPeriodo) ? $restavcvs: $depPeriodo;
                    $depAcumulada = ($restavcvs - $valorSalvamento < $depacudepperi) ? $restavcvs : $depacudepperi;

                    $movRegNumActivo->depreciacionacumulada = $depAcumulada;
                    $regNumeActivo->depreciacionacumulada = $depAcumulada;
                }

                if ($movRegNumActivo->valorcontablealternativo) {
                    // Cantidad de horas de explotación del medio en el período de depreciación
                    $horasExplotacionPeriodo = $movRegNumActivo->cantidadrecursoconsumido;

                    /*$factorDepPeriodo = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontable,
                        $movRegNumActivo->vidautil, $movRegNumActivo->depreciacionacumulada,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico
                    );*/
                    $factorDepPeriodoAlt = $this->getTasaPeriodo(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontablealternativo,
                        100/$movRegNumActivo->tasafiscal, $movRegNumActivo->depreciacionacumuladaalternativo,
                        $movRegNumActivo->{$this->_campoFechaIniDepMedios}, $idRegNumerico, $movRegNumActivo->tasafiscal
                    );

                    $depPeriodo = $factorDepPeriodoAlt * $horasExplotacionPeriodo;
                    $restavcvsalert = $movRegNumActivo->valorcontablealternativo - $valorSalvamento;
                    $sumadepacudepperialt = $regNumeActivo->depreciacionacumuladaalternativo + $depPeriodo;

                    $valorSalvamento = $this->getValorSalvamento(
                        $movRegNumActivo->porcientorecuperacion, $movRegNumActivo->valorcontablealternativo
                    );

                    $movRegNumActivo->depreciacion = ($restavcvsalert < $depPeriodo) ? $restavcvsalert: $depPeriodo;
                    $depAcumulada = ($restavcvsalert - $valorSalvamento < $sumadepacudepperialt) ? $restavcvsalert
                        :$sumadepacudepperialt;

                    $movRegNumActivo->depreciacionacumulada = $depAcumulada;
                    $regNumeActivo->depreciacionacumulada = $depAcumulada;
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

    public function depreciar($iddocumento) {
        $idestructura = $this->global->Estructura->idestructura;
				
		$conn = Zend_Registry::get('conexion');
		$var = $conn->fetchAll(
			"SELECT * FROM \"mod_logactivofijotangible\".\"f_depreciarmediosentidadmixtocontope\"" .
			"($idestructura, $iddocumento)"
		);
		
        return 1;
    }

}
