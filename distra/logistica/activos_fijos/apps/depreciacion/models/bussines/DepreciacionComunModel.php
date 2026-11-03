<?php

/**
 * @author  Jorge Luis Cuellar Mondeja
 * @date    23/11/2012
 */
abstract class DepreciacionComunModel extends BaseModel
{
    protected $_mMProducto, $_mProdLogistica, $_mHisRegNumEstatus, $_idEstructura, $_idPeriodo, $_cantMesesAnno,
        $_cantDiasMeses, $_entidadDeprecia, $_campoFechaIniDepMedios, $_sRegNumerico, $_sRegNumActivo, $_sNomActivos,
        $_sConfActivos, $_sConfGeneral;

    /**
     * En caso de no ser pasado los parámetrizado se utilizarán los valores globales de la entidad por la cual el
     * usuario se encuentre autentificado
     *
     * @param bool|integer $idEstructura
     * @param bool|integer $idPeriodo
     */
    public function __construct($idEstructura = false, $idPeriodo = false)
    {
        parent::__construct();

        $cEstructura = 'Estructura';
        $cPeriodo = 'Periodo';

        $this->_mMProducto = new MaestroProductoModel();
        $this->_mProdLogistica = new LogisticaProductoModel();
        $this->_mHisRegNumEstatus = new HisRegNumericoEstatusModel();

        $this->_idEstructura = (!$idEstructura) ? ZendExt_GlobalConcept::getInstance()
            ->$cEstructura->idestructura : $idEstructura;

        $this->_idPeriodo = (!$idPeriodo) ? ZendExt_GlobalConcept::getInstance()
            ->global->$cPeriodo->periodoactual : $idPeriodo;

        $this->_sRegNumerico = new RegNumericoService();
        $this->_sRegNumActivo = new RegNumActivoService();
        $this->_sNomActivos = new NomencladoresActivosService();
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_sConfActivos = new ConfiguracionActivosService();

        $confEntidad = $this->_sConfActivos->getConfiguracionPG($this->_idEstructura);

        $this->_entidadDeprecia = $confEntidad[0]['depreciacion'];

        if ($this->_entidadDeprecia) {

            if ($confEntidad[0]['explotacionadquisicion']) {
                $this->_campoFechaIniDepMedios = 'fechaexpini';
            } else {
                $this->_campoFechaIniDepMedios = 'fechaadq';
            }
        }
    }

    /**
     * Devuelve cuanto deprecia un registro numérico al año para un método de depreciación determinado
     *
     * @param $porcientoRecuperacion
     * @param $valorContable
     * @param $vidaUtilProvable
     *
     * @return mixed
     */
    abstract protected function getTasaAnual($porcientoRecuperacion, $valorContable, $vidaUtilProvable);

    /**
     * Devuelve la tasa de depreciación de un registro numérico para un período determinado
     *
     * @param $porcientoRecuperacion
     * @param $valorContable
     * @param $vidaUtilProvable
     * @param $depAcumulada
     * @param $fechaDepInicial Fecha que tiene puesta el medio como de inicio de su explotación/adquisición
     * @param $idRegNumerico
     * @param $tasaRegNumerico
     *
     * @return mixed
     */
    abstract protected function getTasaPeriodo(
    $porcientoRecuperacion, $valorContable, $vidaUtilProvable, $depAcumulada, $fechaDepInicial, $idRegNumerico,
        $tasaRegNumerico
    );

    /**
     * Devuelve un listado de los registros numéricos que usan un método de depreciación determinado
     *
     * @param       $fecha
     * @param       $parametros
     * @param array $whereIN
     *
     * @return mixed
     */
    abstract protected function getRegNumericosDepreciar($fecha, $parametros, $whereIN = array());

    /**
     * Depreciar registros numéricos pasados por parámetros
     *
     * @param $arrIdesRegNumericos
     *
     * @return mixed
     */
    abstract protected function depreciarRegNumByArrIdes($arrIdesRegNumericos, $fecha);

    /**
     * Devuelve el valor de salvamento de un registro numérico
     *
     * @param $porcientoRecuperacion
     * @param $valorContable
     *
     * @return float
     */
    protected function getValorSalvamento($porcientoRecuperacion, $valorContable)
    {
        return $porcientoRecuperacion * $valorContable / 100;
    }

    /**
     * Construir la consulta básica para cargar los registros numéricos por métodos de depreciación determinados
     *
     * @param       $fecha
     * @param       $parametros
     * @param array $whereIN
     * @param       $idMetodoDep
     *
     * @return Doctrine_Query
     */
    public function getQueryRegNumericosDepreciar($fecha, $parametros, $whereIN = array(), $idMetodoDep = false,
        $idEstru = false)
    {
        if (!$this->_entidadDeprecia) {
            return false;
        }
        $parametros['deprecia'] = 1;
        if (false) {
            $parametros['iddepreciacion'] = $idMetodoDep;
        }

        $operaciones = ComunAFTModel::getInstance()
            ->getDatosInterfazOperacion(false, false, 'OPER_DEPRECIACION', false);    
        if (count($operaciones) == 0) {
            throw new ZendExt_Exception('LOG_AFT_DEP_004');
           // throw new Exception('No se ha configurado la operación de depreciación para la entidad');
        };
       /* foreach ($operaciones as &$value) {//lo quite porque  no hacen nada con la variable $value(osmel)
            $value = $value['idoperacion'];
        }*/
        $service = new RegNumActivoService();
        $query = $service->getQueryDataVisualizarRegNumActivos($parametros, 'drna');
        $query->where('drna.idestadoperacion <> 7');
        $query->andWhere('drna.idestadoperacion <> 0');
        $query = $this->getFiltrosGridDepreciacion($query, $parametros);

        $idestr = $this->_idEstructura;
        $condicion = ($idEstru) ? $idEstru : $idestr;
        //print_r($condicion);
        //$query->whereIn('p.idestructura', ComunAFTModel::getInstance()->getIdEstructurasHijas($condicion, true));
        $query->addWhere('p.idestructuracomun = ?', $condicion);
        
        $operaciones = implode(',', LogisticaObjectHelper::__init()->extractValueFromArrayColumn($operaciones, 'idoperacion') );
        $fecha = ComunAFTModel::getInstance()->setDateFormatoIngles($fecha);

        $query->addSelect(
            "(CASE WHEN (SELECT mrn2.idregnumerico FROM DatMovRegnumerico mrn2 "
            ."INNER JOIN mrn2.DatMovimientos m2 INNER JOIN m2.DatDocumento d2 WHERE d2.idoperacion IN ($operaciones) "
            ."AND d2.fechacontable = '$fecha' "
            ."AND mrn2.idregnumerico = rn.idregnumerico LIMIT 1) IS NOT NULL THEN 'verde' ELSE 'negro' END) AS esta"
        );
        
        /*$query->addSelect(
            "(SELECT mrna3.depreciacion FROM DatMovRegnumerico mrn3 "
            ."INNER JOIN mrn3.DatMovRegnumericoActivo mrna3 INNER JOIN mrn3.DatMovimientos m3 "
            ."INNER JOIN m3.DatDocumento d3 "
            ."WHERE d3.idoperacion IN ($operaciones) AND d3.fechacontable = '$fecha' "
            ."AND mrn3.idregnumerico = rn.idregnumerico LIMIT 1) AS depreciacion "
        );
        $query->addSelect(
            "(SELECT mrna5.depreciacioncuc FROM DatMovRegnumerico mrn5 "
            ."INNER JOIN mrn5.DatMovRegnumericoActivo mrna5 INNER JOIN mrn5.DatMovimientos m5 "
            ."INNER JOIN m5.DatDocumento d5 "
            ."WHERE d5.idoperacion IN ($operaciones) AND d5.fechacontable = '$fecha' "
            ."AND mrn5.idregnumerico = rn.idregnumerico LIMIT 1) AS depreciacioncuc "
        );*/

        $query->addWhere("nact.iddepreciacion = '{$parametros['idmetodo']}' ");
        $query->addSelect('nmarc.denominacion as marca');
        $query->addSelect('nmod.denominacion as modelo');


        $query->addWhere(
            "drna.idregnumerico IN
            (
                SELECT drn1.idregnumerico
                FROM DatRegnumerico drn1
                INNER JOIN drn1.HisRegNumericoEstatus hrn
                WHERE drn1.idregnumerico = drna.idregnumerico AND
                hrn.fechainicio < '$fecha' AND hrn.deprecia = 1
            )"
        );

        //Para que la agrupacion del grid funcione correctamente

        if ($parametros['sort']) {
            $query->orderBy('i.denominacion');
        } else {
//            $query->orderBy('drna.idregnumerico');
            $query->orderBy('nmarc.denominacion ASC, nmod.denominacion ASC');
        }

        if (count($whereIN)) {
            $query->addWhereIn('drna.idregnumerico', $whereIN);
        }
        if ($parametros['criterio']) {
            $query->addWhere(" i.denominacion iLike '%{$parametros['criterio']}%' ");
        }       

        return $query;
    }

    /**
     * Devuelve un arreglo de identificadores de los registros numéricos que deben depreciar en una fecha contable,
     * filtrado por un método de depreciación determinado
     *
     * @param $fecha
     * @param $idMetodoDep
     *
     * @return mixed
     */
    public function getArrIdRegNumericosDepreciar($fecha, $idMetodoDep, $arrIdRegNumerico = false)
    {

        $parametros = array('deprecia' => 1, 'iddepreciacion' => $idMetodoDep);

        $operaciones = ComunAFTModel::getInstance()
            ->getDatosInterfazOperacion(false, false, 'OPER_DEPRECIACION', false);
       
        foreach ($operaciones as &$value) {
            $value = $value['idoperacion'];
        }
        $operaciones = implode(',', $operaciones);

        $query = $this->_sRegNumActivo->getObjRegNumActivoModel()->getQueryRegNumActivo('rna', false);
        $query = $this->_sRegNumerico->getObjRegNumericoModel()->addJoinModel($query, 'rna', 'rn', false);

        $this->_sNomActivos
            ->getObjNomActividadMedioModel()->getJoinQueryNomActividad($query, 'na', 'rna', 1, false, $parametros);

        $this->_sNomActivos->getObjNomEstatusModel()
            ->getJoinQueryEstatusTecnico($query, 'net', 'rna', 1, false, $parametros);
        $query->innerJoin('rn.DatProductoLogistica p');

        //$idestr = $this->_idEstructura;
        //$query->whereIn('p.idestructura', ComunAFTModel::getInstance()->getIdEstructurasHijas($idestr, true));
        $query->addWhere('p.idestructuracomun = ?', array($this->_idEstructura));



        $fecha = ComunAFTModel::getInstance()->setDateFormatoIngles($fecha);


        $query->addWhere(
            "rna.idregnumerico NOT IN (
                SELECT mrn2.idregnumerico FROM DatMovRegnumerico mrn2
                INNER JOIN mrn2.DatMovimientos m2 INNER JOIN m2.DatDocumento d2
                WHERE d2.idoperacion IN ($operaciones) AND d2.fechacontable = '$fecha'
            )"
        );

        $query->addWhere(
            "rna.idregnumerico IN (
                SELECT drn1.idregnumerico
                FROM DatRegnumerico drn1
                INNER JOIN drn1.HisRegNumericoEstatus hrn
                WHERE drn1.idregnumerico = rna.idregnumerico AND
                hrn.fechainicio < '$fecha' AND hrn.deprecia = 1
            )"
        );

        // Excluyendo los que ya esten depreciados
        $query->addWhere('(rna.valorcontable - ((rna.valorcontable * rna.porcientorecuperacion)/100)) <> rna.depreciacionacumulada OR (rna.valorcontablealternativo - ((rna.valorcontablealternativo * rna.porcientorecuperacion)/100)) <> rna.depreciacionacumuladaalternativo');
        
        if ($arrIdRegNumerico) {
            $query->whereIn('rn.idregnumerico', $arrIdRegNumerico);
        }

        $arreglo = $query->fetchArray();

        foreach ($arreglo as &$value) {
            $value = $value['idregnumerico'];
        }

        return $arreglo;
    }

    /**
     * @param $query
     * @param $parametros
     */
    public function getFiltrosGridDepreciacion($query, $parametros)
    {
        foreach ($parametros['filter'] as $filtro) {
            if ($filtro->type == 'numeric') {
                switch ($filtro->field.$filtro->comparison) {
                    case 'valorcontablelt':
                        $query->addWhere('drna.valorcontable < ?', array($filtro->value));
                        break;
                    case 'valorcontablegt':
                        $query->addWhere('drna.valorcontable > ?', array($filtro->value));
                        break;
                    case 'valorcontableeq':
                        $query->addWhere('drna.valorcontable = ?', array($filtro->value));
                        break;
                    case 'valorcontablealternativolt':
                        $query->addWhere('drna.valorcontablealternativo < ?', array($filtro->value));
                        break;
                    case 'valorcontablealternativogt':
                        $query->addWhere('drna.valorcontablealternativo > ?', array($filtro->value));
                        break;
                    case 'valorcontablealternativoeq':
                        $query->addWhere('drna.valorcontablealternativo = ?', array($filtro->value));
                        break;
                    case 'cantidadrecursoconsumidolt':
                        $query->addWhere('drna.cantidadrecursoconsumido < ?', array($filtro->value));
                        unset($parametros['cantidadrecursoconsumido']);
                        break;
                    case 'cantidadrecursoconsumidogt':
                        $query->addWhere('drna.cantidadrecursoconsumido > ?', array($filtro->value));
                        break;
                    case 'cantidadrecursoconsumidoeq':
                        $query->addWhere('drna.cantidadrecursoconsumido = ?', array($filtro->value));
                        unset($parametros['cantidadrecursoconsumido']);
                        break;
                    case 'vidautillt':
                        $query->addWhere('drna.vidautil < ?', array($filtro->value));
                        break;
                    case 'vidautilgt':
                        $query->addWhere('drna.vidautil > ?', array($filtro->value));
                        unset($parametros['vidautil']);
                        break;
                    case 'vidautileq':
                        $query->addWhere('drna.vidautil = ?', array($filtro->value));
                        break;
                    case 'tasafiscallt':
                        $query->addWhere('drna.tasafiscal < ?', array($filtro->value));
                        break;
                    case 'tasafiscalgt':
                        $query->addWhere('drna.tasafiscal > ?', array($filtro->value));
                        break;
                    case 'tasafiscaleq':
                        $query->addWhere('drna.tasafiscal = ?', array($filtro->value));
                        break;
                    case 'porcientorecuperacionlt':
                        $query->addWhere('drna.porcientorecuperacion < ?', array($filtro->value));
                        break;
                    case 'porcientorecuperaciongt':
                        $query->addWhere('drna.porcientorecuperacion > ?', array($filtro->value));
                        break;
                    case 'porcientorecuperacioneq':
                        $query->addWhere('drna.porcientorecuperacion = ?', array($filtro->value));
                        break;
                    case 'depreciacionacumuladalt':
                        $query->addWhere('drna.depreciacionacumulada < ?', array($filtro->value));
                        break;
                    case 'depreciacionacumuladagt':
                        $query->addWhere('drna.depreciacionacumulada > ?', array($filtro->value));
                        break;
                    case 'depreciacionacumuladaeq':
                        $query->addWhere('drna.depreciacionacumulada = ?', array($filtro->value));
                        break;
                    case 'depreciacionacumuladaalternativolt':
                        $query->addWhere('drna.depreciacionacumuladaalternativo < ?', array($filtro->value));
                        break;
                    case 'depreciacionacumuladaalternativogt':
                        $query->addWhere('drna.depreciacionacumuladaalternativo > ?', array($filtro->value));
                        break;
                    case 'depreciacionacumuladaalternativoeq':
                        $query->addWhere('drna.depreciacionacumuladaalternativo = ?', array($filtro->value));
                        break;
                }
            } else {
                $query = $this->getFiltrosGridDepreciacionCampos($query, $filtro);
            }
        }

        return $query;
    }

    /**
     * @param $query
     * @param $filtro
     *
     * @return mixed
     */
    public function getFiltrosGridDepreciacionCampos(&$query, $filtro)
    {
        switch ($filtro->field) {
            case "nroinventario":
                $query->addWhere("drna.{$filtro->field} = '{$filtro->value}'");
                break;
            case "nromatricula":
                $query->addWhere("drna1.{$filtro->field} iLike '%{$filtro->value}%'");
                break;
            case "denomidmedio":
                $service = new RegNumActivoService();
                $where = $service->getIdentificadorDat(
                    array('denomidmedio' => $filtro->value), 'drna', 'drna1', 'rn'
                );
                $query->addWhere($where);
                break;
            case "descripcionmarcamodelo":
                $query->addWhere(
                    "nmarc.denominacion ILIKE '%{$filtro->value}%' OR "
                    ."nmod.denominacion ILIKE '%{$filtro->value}%' OR "
                    ."i.denominacion ILIKE '%{$filtro->value}%'"
                );
                break;
            default :
                $query->addWhere("drna.{$filtro->field} iLike '{$filtro->value}%'");
                break;
        }

        return $query;
    }

    /**
     * Devuelve un arreglo de los identificadores de los productos a los que pertenecen los registros
     *  numéricos a depreciar
     *
     * @param $arrIdesRegNumericos
     *
     * @return array
     */
    protected function getIdesProdByRegNumericos($arrIdesRegNumericos)
    {
        $arrIdesProd = array();
        $query = $this->_sRegNumerico->getObjRegNumericoModel()->getQueryRegNumerico('rn');
        $query->whereIn('rn.idregnumerico', $arrIdesRegNumericos);
        $query->addSelect('DISTINCT rn.idproducto');

        foreach ($query->fetchArray() as $value) {
            array_push($arrIdesProd, $value['idproducto']);
        }

        return array_unique($arrIdesProd);
    }

    /**
     * Devuelve una nueva instancia de la clase DatDocumento para crear un documento de depreciación
     *
     * @param $fecha
     *
     * @return DatDocumento
     */
    protected function getDocDepreciacion($fecha)
    {
        $operacion = ComunAFTModel::getInstance()->getDatosInterfazOperacion(false, false, 'OPER_DEPRECIACION', false);
        $paramsDocumento = array('idoperacion' => $operacion[0]['idoperacion'],
            'observaciones' => "Depreciación ".$fecha,
            'iddoc' => $operacion[0]['iddoc'],
            'idestructuracomun' => $this->_idEstructura
        );

        $oDocumentoAFT = new DocumentoActivoModel();
        $documento = $oDocumentoAFT->adicionarDocumento($paramsDocumento);
        $documento->estado = 2;

        $documento->save();

        return $documento;
    }

    /**
     * Devuelve un arreglo con las fechas iniciales y finales del período contable configurado
     *
     * @return array
     */
    public function getPeriodo()
    {
        $respuesta = array();
        $periodo = $this->_sConfGeneral->obtenerPeriodo($this->_idPeriodo);
        $iniPeriodo = $periodo->inicio;
        $iniPeriodo = explode('/', $iniPeriodo);

        $finPeriodo = $periodo->fin;
        $finPeriodo = explode('/', $finPeriodo);

        $respuesta['diaInicio'] = $iniPeriodo[0];
        $respuesta['mesInicio'] = $iniPeriodo[1];
        $respuesta['annoInicio'] = $iniPeriodo[2];

        $respuesta['diaFin'] = $finPeriodo[0];
        $respuesta['mesFin'] = $finPeriodo[1];
        $respuesta['annoFin'] = $finPeriodo[2];

        return $respuesta;
    }

    /**
     * Crea un nuevo movimiento de registro numérico con los últimos datos que tiene el registro numérico
     *
     * @param $movRegNumerico
     * @param $movRegNumActivo
     * @param $idRegNumerico
     */
    protected function clonePropertyRegNumeToMovRegNumerico(&$movRegNumerico, &$movRegNumActivo, $idRegNumerico)
    {
        $datRegNumerico = $this->_sRegNumerico->getObjRegNumericoModel()
                ->getQueryRegNumerico('rn', true)->where('idregnumerico = ?', $idRegNumerico)->fetchOne();

        $movRegNumerico->synchronizeWithArray($datRegNumerico->toArray());

        $datRegNumActivo = $this->_sRegNumActivo->getObjRegNumActivoModel()
                ->getQueryRegNumActivo('rna', true)->where('idregnumerico = ?', $idRegNumerico)->fetchOne();

        $movRegNumActivo->synchronizeWithArray($datRegNumActivo->toArray());
    }

    /**
     * Devuelve una nueva instancia de la clase movimiento para crear un documento de depreciación
     *
     * @param $idProdLogistica
     * @param $idDocumento
     *
     * @return DatMovimientos
     */
    protected function getNewInstanceMov($idProdLogistica, $idDocumento)
    {
        $movimiento = new DatMovimientos();
        $movimiento->idproducto = $idProdLogistica;
        $movimiento->iddocumento = $idDocumento;
        $movimiento->signo = 'N';

        return $movimiento;
    }

    

    /**
     * Devuelve la cantidad de días que debe depreciar un medio en un rango de fecha, en caso de no especificarse la
     * fecha inicio, este método tomará como dicha fecha la que tenga el medio como fecha de explotación inicial
     *
     * @param      $idRegNumerico
     * @param      $fechaInicio
     * @param bool $fechaFin
     *
     * @return int
     * @throws ZendExeption
     */
    protected function getCantDiasInicioDepreciarEntreMov($idRegNumerico, $fechaInicio, $fechaFin = false)
    {
        if (!$fechaInicio) {
//            throw new ZendExt_Exception('La fecha de inicio es un dato obligatorio para depreciar.');
            throw new ZendExt_Exception('LOG_AFT_DEP_003');
        }

        if (!$fechaFin) {
            $fechaDiaPeriodo = DatosMaestrosHelper::__init();
            $fechadia = $fechaDiaPeriodo->getFechaContableSubsistemaObj(
                $this->_idEstructura, LogisticaGlobal::SUBSISTEMA_AFT
            );
            $fechaFin = $fechadia->fecha;
            /* $periodo = $this->getPeriodo();
              $fechaFin = "{$periodo['diaFin']}/{$periodo['mesFin']}/{$periodo['annoFin']}"; */
        }

        $respuesta = $this->_mHisRegNumEstatus->getCantDiasDepreciar($idRegNumerico, $fechaInicio, $fechaFin);

        $canDiasDepreciar = $respuesta['cantDiasDepMov'];

        if (!is_null($respuesta['fechaIniMovSinDep'])) {           
            $fechaInicial = explode('/', $respuesta['fechaIniMovSinDep']);
            $fechaFin = explode('/', $fechaFin);

            $diaFin = $fechaFin[0];
            $mesFin = $fechaFin[1];
            $annoFin = $fechaFin[2];

            $diaIni = $fechaInicial[0];
            $mesIni = $fechaInicial[1];
            $annoIni = $fechaInicial[2];

            $canDiasDepreciar += ComunAFTModel::getInstance()
                ->getCantDias($diaIni, $mesIni, $annoIni, $diaFin, $mesFin, $annoFin);             
        }
        return $canDiasDepreciar;
    }


    /*
     * En este metodo lo que se hace es para los RN que tenian movimientos pendientes
     * ctualizar los valores de depreciacion en esos movimientos, para que una vez sean
     * aprobados estos no se pierdan.
     * */
    public function auxDepreciarRegistros($arrIdesRegNumericos)
    {
        foreach ($arrIdesRegNumericos as $idRegNumerico) {
            $rnaService = new RegNumActivoService();
            // Aqui se busca si alguno de los RN estan en un documento que no este preparado
            $iddocumentoSinAprobar = $rnaService->getIddocumentoRnActEnElaboracionOPreparado($idRegNumerico);
            if ($iddocumentoSinAprobar) {
                $rnaService->setValoresDepreInMovRnaFromRnaDadoDoc($iddocumentoSinAprobar);
            }
        }
    }

    private function getComparadornumeric ($comparador){
        switch ($comparador) {
            case 'lt':
                return " < ";
            case 'gt':
                return " > ";
            default:
                return " = ";
        }
    }

    public function procesarFiltros($params)
    {
        //print_r($params['filter']);

        $where = array();
        //$params['filters'] = json_decode($params['filters']);
        
        foreach ($params['filter'] as $filtro) {
            //print_r($filtro->field);
            if($filtro->field == 'denomidmedio') break;
            if($filtro->type == 'string'){
                array_push($where, " sub2.{$filtro->field} ILIKE '%{$filtro->value}%' ");
                
                //$where .= " sub2.{$filtro->field} ILIKE '%{$filtro->value}%' ";
            }
            if($filtro->type == 'numeric'){
                $signoCmp = $this->getComparadornumeric($filtro->comparison);
                array_push($where, " sub2.{$filtro->field} {$signoCmp} {$filtro->value} ");
            }
            
            
            //$where .= ($filtro->field == 'descripcionmarcamodelo') ? " AND (sub2.descripcionmarcamodelo ILIKE '%{$filtro->value}%')" : "";
            /*$where .= ($filtro->field == 'nroinventario') ? " AND drna.nroinventario ILIKE '%{$filtro->data->value}%'" : "";
            
            $where .= ($filtro->field == 'valorcontable') ? " AND drna.nroinventario {$signoCmp} '%{$filtro->data->value}%'" : "";
            $where .= ($filtro->field == 'vidautil') ? " AND drna.vidautil {$signoCmp} '%{$filtro->data->value}%'" : "";

            
            
            $where .= ($filtro->field == 'marcamodelo')
                ? " AND marc.denominacion iLike '%{$filtro->data->value}%' OR
                model.denominacion iLike '%{$filtro->data->value}%'" : "";*/
            
        }
        if(count($where) > 0)
            return " WHERE " . implode(' AND ', $where);
        else 
            return "";

    }

}
