<?php

/**
 * Modelo para servicios de operaciones de depreciacion en
 * Activos Fijos Tangibles (AFT).
 * 22/11/2012
 *
 * @author     Jorge Luis Cuellar Mondeja
 * @package    logistica
 * @version    0.1
 */
class DepreciarEntidadModel extends BaseModel
{

    private $_mComunAFT, $_idEstructura;

    public function __construct()
    {
        parent::__construct();
        $cEstructura = 'Estructura';

        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->_idEstructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
    }

    /**
     * Funcionalidad para saber cuales son los métodos que están siendo usados por registros numéricos asociados
     * a la entidad
     */
    public function getMetodosDepreciacion($fechacontable = false, $identidad = false, $confEntidad = array())
    {
        if (!$fechacontable) {
            $cFechaContable = 'FechaContable';
            $fechacontable = ComunAFTModel::getInstance()->setDateFormatoIngles($this->global->$cFechaContable->fecha);
        }

        $identidad = ($identidad) ? $identidad : $this->_idEstructura;
        $sConfActivos = new ConfiguracionActivosService();
        if (count($confEntidad) == 0) {
            $confEntidad = $sConfActivos->getConfiguracionPG($identidad);
        }
        
        
        $metodos = array();
        if ($confEntidad[0]['depreciacion']) {
            $query = Doctrine_Query::create();
            $query->addSelect('nd.iddepreciacion, nd.denominacion');
            $query->from('NomDepreciacion nd');
            $query->innerJoin('nd.NomActividadMedio a');
            $query->innerJoin('a.DatRegnumericoActivo rna');
            $query->innerJoin('rna.DatRegnumerico rn');
            $query->innerJoin('rn.HisRegNumericoEstatus hrne');
            $query->innerJoin('rn.DatProductoLogistica dp');            
            $query->addWhere('dp.idestructuracomun = ?', array($identidad));
            $query->addWhere('hrne.deprecia = ?', array(1));
            $query->addWhere('hrne.fechainicio <= ?', array($fechacontable));
			$query->addWhere('nd.iddepreciacion > 0');
            $query->groupBy('nd.iddepreciacion');
            $query->orderBy('nd.denominacion DESC');
            $arrMetodDeprXml = $this->_mComunAFT->getMetodosDepreciacion();
            foreach ($query->fetchArray() as $metodo) {
                $cantidad = 1;
                if ($cantidad > 0) {
                    $metodos[] = array('idmetodo' => $metodo['iddepreciacion'],
                        'descripcion' => $metodo['denominacion'],
                        'unidadmedida' => $arrMetodDeprXml[$metodo['iddepreciacion']]['unidadmedida']);
                }
            }




            // -- hasta aki



            /*
            $sRegNumActivo = new RegNumActivoService();

            $query = Doctrine_Query::create();
            $query->addSelect('nd.iddepreciacion, nd.denominacion');
            $query->from('NomDepreciacion nd');
            $query->innerJoin('nd.NomActividadMedio a');
            $query->innerJoin('a.DatRegnumericoActivo rna');
            $query->innerJoin('rna.NomEstatustecnico et');
            $query->innerJoin('rna.DatRegnumerico rn');
            $mMovRegNum = new MovRegNumericoModel();
            $mMovRegNum->addJoinModelMy($query, 'rn', 'mrn', 1);
            $sRegNumActivo->getJoinMovRegNumericoActivo($query, 'mrna', 'mrn', true, true, false);

            $query->innerJoin('mrn.DatMovimientos mov');
            $query->innerJoin('mov.DatDocumento d');

            $arrIdesEstructuras = $this->_mComunAFT->getIdEstructurasHijas($this->_idEstructura, false);
            $query->addWhere('et.deprecia = 1 AND d.cronologia IS NOT null');
            $query->WhereIn('rna.idarearesp', $arrIdesEstructuras);
            $query->orderBy('nd.denominacion DESC');
            print_r($query->fetchArray());die;
            $arrMetodDeprXml = $this->_mComunAFT->getMetodosDepreciacion();

            foreach ($query->fetchArray() as $metodo) {
                $cantidad = 1;
                if ($cantidad > 0) {
                    $metodos[] = array('idmetodo' => $metodo['iddepreciacion'],
                        'descripcion' => $metodo['denominacion'],
                        'unidadmedida' => $arrMetodDeprXml[$metodo['iddepreciacion']]['unidadmedida']);
                }
            }*/
        }       
        return $metodos;
    }

    /**
     * Verificar la exitencia de un documento de tipo depreciación para una fecha contable determinada
     *
     * @param $fecha
     *
     * @return mixed
     */
    public function getVerificarExistenciaDoc($fecha)
    {
        $arrIdesOperaciones = $this->_mComunAFT->getDatosInterfazOperacion(false, false, 'OPER_DEPRECIACION', false);

        foreach ($arrIdesOperaciones as &$value) {
            $value = $value['idoperacion'];
        }

        //print_r($arrIdesOperaciones);
        //print_r($fecha);

        $query = Doctrine_Query::create();
        $query->from('DatDocumento d');
        $query->addSelect('d.iddocumento, d.estado, d.fechacontable, d.idoperacion');
        $query->whereIn('d.idoperacion', $arrIdesOperaciones);
        $query->addWhere('d.fechacontable = ?', array($fecha));
        $query->addWhere('d.idestructuracomun = ?', array($this->_idEstructura));

        return $query->fetchArray();
    }

    /**
     * @return string
     */
    public function getPeriodoToString()
    {
        $modelo = DepreciacionModelFactory::getInstance(0);
        $periodo = $modelo->getPeriodo();


        if ($periodo['mesInicio'] == $periodo['mesFin'] && $periodo['annoInicio'] == $periodo['annoFin']) {
            return $this->arrMeses[$periodo['mesInicio']] . " " . $periodo['annoFin'];
        } else {
            if ($periodo['mesInicio'] != $periodo['mesFin'] && $periodo['annoInicio'] == $periodo['annoFin']) {
                $mesInicio = $this->arrMeses[$periodo['mesInicio']];
                $mesFin = $this->arrMeses[$periodo['mesFin']];
                return $mesInicio . " " . $periodo['annoInicio'] . " - " . $mesFin . " " . $periodo['annoFin'];
            } else {
                self::getPeriodoToStringDos($periodo);
            }
        }
    }

    public function getPeriodoToStringDos($periodo)
    {
        if ($periodo['mesInicio'] == $periodo['mesFin'] && $periodo['annoInicio'] != $periodo['annoFin']) {
            $mesInicio = $this->arrMeses[$periodo['mesInicio']];
            return $mesInicio . " " . $periodo['annoInicio'] . " - " . $mesInicio . " " . $periodo['annoFin'];
        } else {
            if ($periodo['mesInicio'] != $periodo['mesFin'] && $periodo['annoInicio'] != $periodo['annoFin']) {
                $mesInicio = $this->arrMeses[$periodo['mesInicio']];
                $mesFin = $this->arrMeses[$periodo['mesFin']];
                return $mesInicio . " " . $periodo['annoInicio'] . " - " . $mesFin . " " . $periodo['annoFin'];
            }
        }
    }

    /**
     * Devuelve una nueva instancia de la clase DatDocumento para crear un documento de depreciación
     *
     * @param $fecha
     *
     * @return DatDocumento
     */
    public function getDocDepreciacion($fecha)
    {
        $operacion = ComunAFTModel::getInstance()->getDatosInterfazOperacion(false, false, 'OPER_DEPRECIACION', false);
        $paramsDocumento = array('idoperacion' => $operacion[0]['idoperacion'],
            'observaciones' => "Depreciación ".$fecha,
            'iddoc' => $operacion[0]['iddoc'],
            'idestructuracomun' => $this->_idEstructura
        );

        $oDocumentoAFT = new DocumentoActivoModel();
        $documento = $oDocumentoAFT->adicionarDocumento($paramsDocumento);
        $datDocumento->DatDocumentoActivo->tipo = 0;
        $documento->estado = 2;

        $documento->save();

        return $documento;
    }

    public function validarExistenciaDocsSinAprobar($idestructura){
        $sql = "select count(d.iddocumento) as cantidad
                    from mod_logistica.dat_documento d
                    inner join mod_logactivofijotangible.dat_documentoactivo da on da.iddocumentoactivo = d.iddocumento
                    inner join mod_datosmaestros.dat_documentoprim docprim on d.iddoc = docprim.iddoc
                    inner join mod_datosmaestros.dat_estructurasubsist subsist on subsist.idestructurasubsist = docprim.idestructurasubsist
                    where 
                        subsist.idestructuracomun = {$idestructura}
                        and subsist.idsubsistema = 11
                        and d.estado in (1,2)";
        $conn = Zend_Registry::get('conexion');
        $cant = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);

        if($cant[0] > 0) {
            throw new ZendExt_Exception('LOG_AFT_DOCS_SIN_APROBAR');
        }
    }

    public function validarActivosPendientesRecepcionar($idestructura){
        $sql = "
                select count(rn.idregnumerico) as cantidad
                from mod_logactivofijotangible.dat_registronumerico rn
                inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
                where 
                    rna.idestadoperacion in (6, 8) and p.idestructuracomun = {$idestructura} and ih.isuh <> 1
            ";
        $conn = Zend_Registry::get('conexion');
        $cant = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        if($cant[0] > 0) {
            return false;
        }
        return true;
    }

    public function validarDepreciacionUltimoDia($fechacontable, $idPeriodoActual)
    {
        $periodoActual= $this->integrator->datosmaestros->obtenerPeriodo($idPeriodoActual);
        $fechaFinPeriodo = $periodoActual->fin;
        if($fechacontable !== $fechaFinPeriodo){
            return false;
        }
        return true;
    }

    public function validarExistenciaDepreciacion($idestructura, $idPeriodoActual){
        $sql = "
            select count(d.iddocumento) as cantidad
            from mod_logistica.dat_documento d
            inner join mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = d.idoperacion
            where 
                oper.codigooperacion = 'OPER_DEPRECIACION' 
                and d.estado = 3
                and d.idestructuracomun = $idestructura 
                and d.idperiodo = $idPeriodoActual    
            ";
        $conn = Zend_Registry::get('conexion');
        $cant = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        if($cant[0] > 0) {
            return false;
        }
        return true;
    }
}
