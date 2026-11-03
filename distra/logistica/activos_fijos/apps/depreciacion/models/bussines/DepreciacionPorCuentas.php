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
class DepreciacionPorCuentas extends DepreciacionComunModel
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
        
        $sql = "
       
        with unnombre as 
(
SELECT * from (SELECT distinct sub2.*
        FROM (
               SELECT sub1.idregnumerico,
                      sub1.valoradquisicion,
                      sub1.depreciacionacumulada,
                      sub1.tasafiscal,
                      sub1.valorcontable,
                      sub1.gruposubgrupo,
                      sub1.cuenta,
                      (CASE
                         WHEN (sub1.depreciacion + sub1.depreciacionacumulada) > sub1.valorcontable THEN (sub1.valorcontable - sub1.depreciacionacumulada)
                         ELSE sub1.depreciacion
                       END) as depreciacion
               FROM (
                      SELECT sub.*
                      FROM (
                             SELECT drna.idregnumerico,                        
                                    drna.valoradquisicion,
                                    drna.depreciacionacumulada,
                                    drna.tasafiscal,
                                    drna.valorcontable,
                                    ng.denominacion AS gruposubgrupo,
                                    nc.concatcta as cuenta,
                                    (CASE
                                       WHEN drna.valorcontable * drna.tasafiscal / 100 /(360 / 30) + drna.depreciacionacumulada > drna.valorcontable OR (
                                         drna.valorcontable * drna.tasafiscal / 100 /(360 / 30) = 0 AND drna.tasafiscal > 0 AND drna.depreciacionacumulada > 0
                                         ) THEN round((drna.valorcontable - drna.depreciacionacumulada), 2)
                                       ELSE round(drna.valorcontable * drna.tasafiscal / 100 /(360 / 30), 2)
                                     END) as depreciacion
               
                             FROM mod_logactivofijotangible.dat_regnumericoactivo drna
                                  INNER JOIN mod_logactivofijotangible.nom_actividad na ON drna.idactividad = na.idactividad
                                  INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON drna.idregnumerico = drn.idregnumerico
                                  INNER JOIN mod_logistica.dat_producto p ON drn.idproducto = p.idproducto and p.idestructuracomun = $idestructura
                                  INNER JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
                                  INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                                  INNER JOIN mod_logactivofijotangible.his_regnumericoestatus hrn ON drn.idregnumerico = hrn.idregnumerico and hrn.fechafin is
                                  null and hrn.deprecia = 1 and hrn.fechainicio < '$fecha'
                                  LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drn.idregnumerico
                                  INNER JOIN mod_logactivofijotangible.nom_actividad nact on nact.idactividad = drna.idactividad
                                  INNER JOIN mod_logactivofijotangible.nom_depreciacion ndep on ndep.iddepreciacion = nact.iddepreciacion
                                  
                                  
                                                  
                        
                        inner join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = drna.idgruposubgrupo)
                        inner join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
                            
                         inner JOIN mod_datosmaestros.nom_gruposubgrupo ng ON nih.idgruposubgrupo = ng.idgruposubgrupo 
                         inner JOIN mod_datosmaestros.nom_gruposubgrupohoja ngh ON ngh.idgruposubgrupo = drna.idgruposubgrupo
                                  
                                  
                                  
                                  
                                  
                                  LEFT JOIN mod_datosmaestros.nom_marca nmarca ON nih.idmarca = nmarca.idmarca
                                  LEFT JOIN mod_datosmaestros.nom_modelo nmodelo ON nih.idmodelo = nmodelo.idmodelo
                                  LEFT JOIN mod_logactivofijotangible.conf_identificadormedio cim ON ni.idindicador = cim.idindicador
                             WHERE (drna.idestadoperacion NOT IN (0, 7) AND
                                   drna.esbaja = 0 AND
                                   ndep.iddepreciacion = 2 AND
                                   ni.idnaturaleza NOT IN (- 8, - 7, - 5) AND
                                   nih.isuh <> 1)
                             ORDER BY ni.denominacion
                           ) as sub
                      WHERE sub.depreciacion > 0 
                    ) as sub1
             ) as sub2 ) as query2
             
             UNION
        
        SELECT * from (SELECT distinct sub2.idregnumerico,sub2.valoradquisicion,sub2.depreciacionacumulada,sub2.tasafiscal,sub2.valorcontable,
        sub2.gruposubgrupo,sub2.cuenta,
               (case
                  when (sub2.depcalculada + sub2.depreciacionacumulada) > sub2.valorcontable then sub2.valorcontable - sub2.depreciacionacumulada
                  else sub2.depcalculada
                end) as depreciacion
        FROM (
               SELECT sub1.idregnumerico,
                      sub1.valoradquisicion,
                      sub1.depreciacionacumulada,
                      sub1.tasafiscal,
                      sub1.valorcontable,
                      sub1.gruposubgrupo,
                      sub1.cuenta,
               
                      (CASE   WHEN
          -- SI LA SUPUESTA DEPRECIACION FINAL > MAXIMO A DEPRECIAR PERMITIDO PERO EL MAXIMO A DEPRECIAR ES MAYOR QUE LA DEPRECIACION ACUMULADA 
          (sub1.v_dm + sub1.depreciacionacumulada) > sub1.max_a_depre AND sub1.max_a_depre > sub1.depreciacionacumulada THEN sub1.max_a_depre - sub1.depreciacionacumulada ELSE CASE WHEN
           -- SI LA DEPRECIACION ACUMULADA > MAXIMO A DEPRECIAR PERMITODO
            sub1.depreciacionacumulada > sub1.max_a_depre THEN 0 ELSE sub1.v_dm END END )
             as depcalculada
             
              FROM ( SELECT *, (ceil(sub.v_md/12) / (100/sub.tasafiscal) ) * sub.valoradquisicion as max_a_depre
              
              FROM ( SELECT drn.idproducto, drn.nroserie, drna.idregnumerico, drna.nroinventario, drna.depreciacionacumulada, drna.depreciacionacumuladaalternativo, drna.vidautil vidautil, 
              drna.porcientorecuperacion, drna.valorcontable, drna.valorcontablealternativo, drna.valoradquisicionalternativo, drna.fechaexpini, 
              drna.fechaexpfin, drna.fechaadq, drna.tasafiscal, drna.valoradquisicion, COALESCE(drna.recursoconsumido, 0) AS recursoconsumido, 
              COALESCE(drna.cantidadrecursoconsumido, 0) AS cantidadrecursoconsumido, drnat.nromatricula, drnat.nrocirculacion, drnat.nromotor1,
               drnat.indicativo, dp.idestructuracomun, ni.idindicador, ni.denominacion, ni.numeropieza, ni.codigo,
                (ni.codigo || ' - ' || ni.denominacion) AS codigodenominacion, nat.denominacion AS naturaleza,
                 ng.denominacion AS gruposubgrupo,
                 nc.concatcta as cuenta,
                 nact.denominacion AS actividad, nact.iddepreciacion, (ni.denominacion || ' ' ||((Case When nih.idmarca is not null
                  Then ( nmarca.denominacion ||(Case When nih.idmodelo is not null Then ' - ' Else '' End)) 
                  Else '' End) ||(Case When nih.idmodelo is not null Then nmodelo.denominacion Else '' End))) AS descripcionmarcamodelo, 
            
                  ((Case When nih.idmarca is not null Then (nmarca.denominacion ||(Case When nih.idmodelo is not null
                   Then ' - ' Else '' End)) Else '' End) ||(Case When nih.idmodelo is not null Then nmodelo.denominacion Else '' End)) AS marcamodelo,
                    cim.ididentificadormedio, cim.identificador, cim.denominacion AS denomidentificador, cim.nombretabla, cim.idindicador AS id,
                     (round( drna.recursoconsumido * (drna.valorcontable / drna.vidautil),2)) as v_DM, 
                     ( (DATE_PART('year', AGE('$fecha', COALESCE(drna.fechaadq, drna.fechaexpini))) * 12 ) + DATE_PART('month', AGE('$fecha', 
                     COALESCE(drna.fechaadq, drna.fechaexpini))) + CASE WHEN (SELECT DATE_PART('day', AGE('$fecha', COALESCE(drna.fechaadq, drna.fechaexpini)))) > 0 THEN 1 ELSE 0 END ) as v_MD 
                     FROM mod_logactivofijotangible.dat_registronumerico drn INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna ON drna.idregnumerico = drn.idregnumerico 
                     LEFT JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat ON drna.idregnumerico = drnat.idregnumerico 
                     INNER JOIN mod_logistica.dat_producto dp ON drn.idproducto = dp.idproducto
                      INNER JOIN mod_datosmaestros.nom_indicador ni ON dp.idindicador = ni.idindicador
                       INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador 
                       INNER JOIN mod_datosmaestros.nom_naturaleza nat ON ni.idnaturaleza = nat.idnaturaleza
                        INNER JOIN mod_logactivofijotangible.nom_actividad nact ON drna.idactividad = nact.idactividad
                        
                        
                        inner join mod_logactivofijotangible.conf_gruposcuentas cgc on (cgc.idgruposubgrupo = drna.idgruposubgrupo)
                        inner join mod_contabilidad.nom_cuenta nc on (nc.idcuenta = cgc.idcuentaactivo)
                            
                         inner JOIN mod_datosmaestros.nom_gruposubgrupo ng ON nih.idgruposubgrupo = ng.idgruposubgrupo 
                         inner JOIN mod_datosmaestros.nom_gruposubgrupohoja ngh ON ngh.idgruposubgrupo = drna.idgruposubgrupo
                         
                          LEFT JOIN mod_datosmaestros.nom_marca nmarca ON nih.idmarca = nmarca.idmarca 
                          LEFT JOIN mod_datosmaestros.nom_modelo nmodelo ON nih.idmodelo = nmodelo.idmodelo
                           LEFT JOIN mod_logactivofijotangible.conf_identificadormedio cim ON ni.idindicador = cim.idindicador
                            WHERE drna.idestadoperacion NOT IN (0,7) AND drna.esbaja = 0 AND dp.idestructuracomun = $idestructura AND nact.iddepreciacion = 3
                             AND drn.idregnumerico IN ( SELECT rn.idregnumerico FROM mod_logactivofijotangible.dat_registronumerico rn 
                             INNER JOIN mod_logactivofijotangible.his_regnumericoestatus hrn ON rn.idregnumerico = hrn.idregnumerico
                              WHERE ( rn.idregnumerico = drn.idregnumerico AND hrn.fechainicio < '$fecha' AND hrn.deprecia = 1 ) ) 
                              /*AND drna.valorcontable > drna.depreciacionacumulada */ 
                              AND drna.recursoconsumido > 0 AND nih.isuh <> 1 ) sub 
                              ) sub1 ORDER BY sub1.descripcionmarcamodelo 
                              ) as sub2) as query1
)
select sum(valoradquisicion) as valoradquisicion,
      sum(depreciacion) as depreciacion,
      sum(valorcontable) as valorcontable,
      count(idregnumerico) as cantidad,
      gruposubgrupo,
     CASE
     WHEN MIN(tasafiscal) = MAX(tasafiscal) THEN
         CAST(MAX(tasafiscal) AS TEXT)  
     ELSE
         CONCAT(CAST(MIN(tasafiscal) AS TEXT), ' - ', CAST(MAX(tasafiscal) AS TEXT))  
     END AS tasafiscal,
      cuenta
from unnombre
group by cuenta, gruposubgrupo       
        ";

        
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        $total = count($datos);

        if($total > 0){
            return array('datos' => $datos, 'cantidad' => $total);
        } else {
            return array('datos' => array(), 'cantidad' => 0);
        }
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



    // public function depreciar($iddocumento) {
    //     $idestructura = $this->global->Estructura->idestructura;
				
	// 	$conn = Zend_Registry::get('conexion');
	// 	$var = $conn->fetchAll(
	// 		"SELECT * FROM \"mod_logactivofijotangible\".\"f_depreciarmediosentidadlinearecta\"" .
	// 		"($idestructura, $iddocumento)"
	// 	);
		
    //     return 1;
    // }
	
}


