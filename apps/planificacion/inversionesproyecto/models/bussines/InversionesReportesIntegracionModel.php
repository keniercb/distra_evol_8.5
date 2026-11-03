<?php

class InversionesReportesIntegracionModel extends InversionesReporteModel
{

    protected $totalorgent = array();
    protected $total = array();

    public function getReportes()
    {
        return (array('data' => NomReporte::getNomReporte()));
    }

    public function getRptByIdRpt($idRpt)
    {
        return (array('data' => NomReporte::getReporteByIdReporte($idRpt)));
    }

    public function cargarEntidadesHijas($param)
    {
        $allDominios = array();
        foreach ($param as $idEnt) {
            $dominios = $this->integrator->metadatos->DameHijosEstructura($idEnt);
            $allDominios = array_merge($allDominios, $dominios);
        }
        $cont = 0;
        $result = array();
        foreach ($allDominios as $val) {
            $result[$cont]['_parent'] = $val->_parent;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = /* $val->codigo . ' - ' . */
                $val->text;
            $result[$cont]['idorganismo'] = $val->id;
            $result[$cont]['codigo'] = $val->text;
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarMonedas()
    {
        $result = array();
        $moneda = $this->integrator->datosmaestros->buscarNomMoneda();
        foreach ($moneda as $k => $mon) {
            $result[$k]['_parent'] = null;
            $result[$k]['_is_leaf'] = true;
            $result[$k]['text'] = $mon['codigoiso'];
            $result[$k]['idmoneda'] = $mon['idmoneda'];
            $result[$k]['codigo'] = $mon['codigoiso'];
        }
        return (array('data' => $result));
    }

    public function cargarClasificaciones()
    {
        $result = array();
        $cont = 0;
        $clasificacion = NomTipoinversion::listarprincipal();
        foreach ($clasificacion as $clasif) {
            if ($clasif['uso'] == 1) {
                $result[$cont]['_parent'] = null;
                $result[$cont]['_is_leaf'] = true;
                $result[$cont]['text'] = $clasif['denominacion'];
                $result[$cont]['idtipoinversion'] = $clasif['idtipoinversion'];
                $result[$cont]['codigo'] = $clasif['denominacion'];
                $cont = $cont + 1;
            }
        }
        return (array('data' => $result));
    }

    public function cargarTiposInversion()
    {
        $result = array();
        $cont = 0;
        $tiposInv = DatInversion::listarTipoInversion();
        foreach ($tiposInv['data'] as $clasif) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $clasif['denominacion'];
            $result[$cont]['idtipoinversionprograma'] = $clasif['idtipoinversionprograma'];
            $result[$cont]['codigo'] = $clasif['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarMedioAmbiente()
    {
        $result = array();
        $cont = 0;
        $medioAmbiente = DatInversion::listarCmbMedioAmbiente();
        foreach ($medioAmbiente as $ma) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $ma['denominacion'];
            $result[$cont]['idmedioambiente'] = $ma['idmedioambiente'];
            $result[$cont]['codigo'] = $ma['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarEntidadesArbol()
    {
        $dominio = $this->integrator->metadatos->buscarHijosEstructuras($this->global->Perfil->iddominio, 0, 0, 0, 3);
        $cont = 0;
        $result = array();
        foreach ($dominio as $valor) {
            $entidades = $this->integrator->metadatos->DameHijosEstructura($valor['id']); //--
            foreach ($entidades as $key => $val) {
                $result[$cont]['_parent'] = $val->_parent;
                $result[$cont]['_is_leaf'] = true;
                $result[$cont]['text'] = /* $val->codigo . ' - ' . */
                    $val->text;
                $result[$cont]['idorganismo'] = $val->id;
                $result[$cont]['codigo'] = $val->text;
                $result[$cont]['codigoestructura'] = $val->codigo;
                $cont = $cont + 1;
            }
        }
        return (array('data' => $result));
    }

    public function cargarFormaPropiedad()
    {
        $formaPropiedad = DatInversion::listarFormaPlan();
        $result = array();
        $cont = 0;
        foreach ($formaPropiedad as $dat) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $dat['denominacion'];
            $result[$cont]['idformapropiedad'] = $dat['idformapropiedad'];
            $result[$cont]['codigo'] = $dat['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarObjetivos()
    {
        $objetivos = DatInversion::listarObjetivo();
        $result = array();
        $cont = 0;
        foreach ($objetivos as $obj) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $obj['denominacion'];
            $result[$cont]['idobjetivo'] = $obj['idobjetivo'];
            $result[$cont]['codigo'] = $obj['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarEfectos()
    {
        $efectos = DatInversion::listarEfecto();
        $result = array();
        $cont = 0;
        foreach ($efectos as $efecto) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $efecto['denominacion'];
            $result[$cont]['idefectocomercial'] = $efecto['idefectocomercial'];
            $result[$cont]['codigo'] = $efecto['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarDesempennos()
    {
        $desempennos = DatInversion::listarDesempeno();
        $result = array();
        $cont = 0;
        foreach ($desempennos as $desemp) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $desemp['denominacion'];
            $result[$cont]['iddatdesempenno'] = $desemp['iddatdesempenno'];
            $result[$cont]['codigo'] = $desemp['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarProgramas()
    {
        $programas = DatInversion::listarProgramada();
        return (array('data' => self::getDataArbol($programas['data'])));
    }

    public function cargarQuienfinancia()
    {
        $financistas = DatInversion::listarFinancista();
        $result = array();
        $cont = 0;
        foreach ($financistas as $fin) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $fin['denominaciontipo'];
            $result[$cont]['idfinancista'] = $fin['idfinancista'];
            $result[$cont]['codigo'] = $fin['denominaciontipo'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarComofinancia()
    {
        $financistas = DatInversion::listarTipoFinan();
        $result = array();
        $cont = 0;
        foreach ($financistas as $fin) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $fin['denominaciontipo'];
            $result[$cont]['idfinancista'] = $fin['idtipofinanciamiento'];
            $result[$cont]['codigo'] = $fin['denominaciontipo'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarComprar()
    {
        $comprar = DatInversion::listarCompra();
        $result = array();
        $cont = 0;
        foreach ($comprar as $fin) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $fin['denominacion'];
            $result[$cont]['idcomprar'] = $fin['idcomprar'];
            $result[$cont]['codigo'] = $fin['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarPais()
    {
        $comprar = DatInversion::listarCompra();
        $result = array();
        $cont = 0;
        foreach ($comprar as $fin) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $fin['denominacion'];
            $result[$cont]['idpais'] = $fin['idcomprar'];
            $result[$cont]['codigo'] = $fin['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarOrganoSatisface()
    {
        $organos = AnalisisInversiones::organosSatisface();
        $result = array();
        $cont = 0;
        foreach ($organos as $org) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $org['denominacion'];
            $result[$cont]['idorganosatisface'] = $org['idorganosatisface'];
            $result[$cont]['codigo'] = $org['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    public function cargarNivel()
    {
        $niveles = array('Genérico', 'Subgenérico', 'Específico', 'Surtido');
        $result = array();
        foreach ($niveles as $k => $niv) {
            $result[$k]['_parent'] = null;
            $result[$k]['_is_leaf'] = true;
            $result[$k]['text'] = $niv;
            $result[$k]['idnivel'] = $k + 1;
            $result[$k]['codigo'] = $niv;
        }
        return (array('data' => $result));
    }

    public function cargarAdquirir()
    {
        $comprar = DatInversion::listarAdquisicion();
        $result = array();
        $cont = 0;
        foreach ($comprar as $fin) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $fin['denominacion'];
            $result[$cont]['idadquisicion'] = $fin['idadquisicion'];
            $result[$cont]['codigo'] = $fin['denominacion'];
            $cont = $cont + 1;
        }
        return (array('data' => $result));
    }

    private function getDataArbol($datos)
    {
        $result = array();
        $cont = 0;
        foreach ($datos as $dat) {
            $result[$cont]['_parent'] = null;
            $result[$cont]['_is_leaf'] = true;
            $result[$cont]['text'] = $dat['denominacion'];
            $result[$cont]['idprogramada'] = $dat['idprogramada'];
            $result[$cont]['codigo'] = $dat['denominacion'];
            $cont = $cont + 1;
        }
        return $result;
    }

    public function guardarPie($params)
    {
        $objNomReporte = Doctrine::getTable('NomReporte')->find($params['idreporte']);
        $pie = array();
        foreach($params['pie'] as $k => $obj){
            $pie[$k] = $obj['id'];
        }
        //print_r($pie);die;
        //print_r(implode($pie,'|'));die;

        if ($pie)
            $objNomReporte->configuracion = implode($pie,'|');
        if ($params['denomreporte'])
            $objNomReporte->denominacion = $params['denomreporte'];
        if ($params['obserreporte'])
            $objNomReporte->descripcion = $params['obserreporte'];

        return (NomReporte::savePie($objNomReporte));
    }

    public function cargardarPie($idreporte)
    {
        $a = NomReporte::getConfiguracionByIdReporte($idreporte);

        $cadena_configuracion = explode('|',$a[0]['configuracion']);

        return array('aprobado'=>$cadena_configuracion[0], 'elaborado'=>$cadena_configuracion[1], 'observacion'=>$cadena_configuracion[2]);
    }

    public function exportarReportesPDF($filtros, $parametros, $codigo)
    {
        //pre_r($parametros);die('inicio');
        $whereInver = self::fitroDatosGenerales($filtros, $parametros);
        $whereOtrosInd = self::filtroOtrosindicadores($filtros, $parametros);
        $whereEq = self::filtroEquipos($filtros);
        $whereFin = self::filtroFinanciamito($filtros);
        $whereConstr = self::filtroConstructor($filtros);
//pre_r($filtros);die;
        foreach ($filtros as $filtro) {

            if ($filtro->cbxOrganismo) {
                $entid = implode(',', $filtro->id);
                $entidDenom = $filtro->cbxOrganismo;
            }

            if ($filtro->cbFormaPropiedad) {
                $formaPropiedadDenom = $filtro->cbFormaPropiedad;
            }

            if ($filtro->cbComprar) {
                $comprarEquipoDenom = $filtro->cbComprar;
            }

            if ($filtro->cbxEntidad && $filtro->cbxEntidad != '') {
                $parametros['entidadeshijas'] = implode(',', $filtro->id);
                $parametros['entidadesDen'] = $filtro->cbxEntidad;
            }
        }
        $parametros['iddominio'] = $this->global->Perfil->iddominio;
        //pre_r($parametros);die('final');
        self::exportarRptPDF($codigo, $whereInver, $whereOtrosInd, $whereEq, $parametros, $entid, $entidDenom, $whereFin, $whereConstr, $formaPropiedadDenom, $comprarEquipoDenom);
    }

    private function fitroDatosGenerales($filtros, &$parametros)
    {
        $whereInversion = "";
        foreach ($filtros as $filtro) {
            if ($filtro->cbFormaPropiedad) {
                $formaP = implode(',', $filtro->cbFormaPropiedad);
                $idformaP = implode(',', $filtro->id);
                $parametros['forma'] = $idformaP;
                $parametros['formaden'] = $formaP;
                $whereInversion .= " AND i.idformapropiedad IN (" . $idformaP . ")";
            }

            if ($filtro->cbMoneda) {
                $parametros['usd'] = $filtro->id[0];
                $parametros['mp'] = $filtro->id[1];
            }
//constructiva - no constructiva
            if ($filtro->cbClasificacion) {
                $idclasificacion = implode(',', $filtro->id);
                $whereInversion .= " AND i.idtipoinversion IN (" . $idclasificacion . ")";
            }
//tipo de inversion
            if ($filtro->cbTipoInver) {
                $idtipoinversionprograma = implode(',', $filtro->id);
                $whereInversion .= " AND i.idtipoinversionprograma IN (" . $idtipoinversionprograma . ")";
            }
//clasificacion del medio ambiente
            if ($filtro->cbxMedioAmbiente) {
                $idMedioAmbiente = implode(',', $filtro->id);
                $whereInversion .= " AND i.idmedioambiente IN (" . $idMedioAmbiente . ")";
            }
//fecha inicio
            if ($filtro->dfFechaInicio) {
                $fechaInicio = $filtro->rawValue;
                $whereInversion .= " AND i.fechainicio = '" . $fechaInicio . "'";
            }
//fecha fin
            if ($filtro->dfFechaFin) {
                $fechaFin = $filtro->rawValue;
                $whereInversion .= " AND i.fechafin = '" . $fechaFin . "'";
            }
//objetivo de la inversion
            if ($filtro->cbObjetivo) {
                $idObjetivo = implode(',', $filtro->id);
                $whereInversion .= " AND i.idobjetivo IN (" . $idObjetivo . ")";
            }
//efecto de la inversion
            if ($filtro->cbEfecto) {
                $idEfecto = implode(',', $filtro->id);
                $whereInversion .= " AND i.idefectocomercial IN (" . $idEfecto . ")";
            }
//desempenno de la inversion
            if ($filtro->cbDesempeno) {
                $idDesempenno = implode(',', $filtro->id);
                $whereInversion .= " AND i.iddatdesempenno IN (" . $idDesempenno . ")";
            }
//programa de la inversion
            if ($filtro->cbPrograma) {
                $idprograma = implode(',', $filtro->id);
                $whereInversion .= " AND i.idprograma IN (" . $idprograma . ")";
            }
//analisis post-inversion de la inversion
            if ($filtro->nfAnosPost) {
                $whereInversion .= " AND i.analpostinversiones " . $filtro->rawValue . "";
            }
//inversion fasttrack de la inversion
            if ($filtro->chViarapida) {
                $whereInversion .= " AND i.fasttrack = " . $filtro->id . "";
            }
        }

        //print_r('<pre>'); print_r($whereInversion); print_r('<pre>'); print_r($parametros);die;
        return $whereInversion;
    }

    private function filtroOtrosindicadores($filtros, $parametros)
    {
        foreach ($filtros as $filtro) {
            if ($filtro->tfErogacion) {
                $whereOtrosIndicadores .= "and i.idinversion in (select doi.idinversion from   mod_planifinversiones.dat_otrosindicadares doi
                where doi.plan  {$filtro->rawValue}
                and doi.idejercicio = {$parametros['idejercicio']}
                and doi.idnomotrosindicadores = 123)";
            }
            if ($filtro->tfHabitacionesNuevas) {
                $whereOtrosIndicadores .= "and i.idinversion in (select doi.idinversion from   mod_planifinversiones.dat_otrosindicadares doi
                where doi.plan  {$filtro->rawValue}
                and doi.idejercicio = {$parametros['idejercicio']}
                and doi.idnomotrosindicadores = 120)";
            }
            if ($filtro->tfInvProceso) {
                $whereOtrosIndicadores .= "and i.idinversion in (select doi.idinversion from   mod_planifinversiones.dat_otrosindicadares doi
                where doi.plan  {$filtro->rawValue}
                and doi.idejercicio = {$parametros['idejercicio']}
                and doi.idnomotrosindicadores = 125)";
            }
            if ($filtro->tfViviendasTerminacion) {
                $whereOtrosIndicadores .= "and i.idinversion in (select doi.idinversion from   mod_planifinversiones.dat_otrosindicadares doi
                where doi.plan  {$filtro->rawValue}
                and doi.idejercicio = {$parametros['idejercicio']}
                and doi.idnomotrosindicadores = 119)";
            }
            if ($filtro->tfContratacExterna) {
                $whereOtrosIndicadores .= "and i.idinversion in (select doi.idinversion from   mod_planifinversiones.dat_otrosindicadares doi
                where doi.plan  {$filtro->rawValue}
                and doi.idejercicio = {$parametros['idejercicio']}
                and doi.idnomotrosindicadores = 122)";
            }
            if ($filtro->tfFondosBas) {
                $whereOtrosIndicadores .= "and i.idinversion in (select doi.idinversion from   mod_planifinversiones.dat_otrosindicadares doi
                where doi.plan  {$filtro->rawValue}
                and doi.idejercicio = {$parametros['idejercicio']}
                and doi.idnomotrosindicadores = 124)";
            }
            if ($filtro->tfFisicoToatalEquipos) {
                $whereOtrosIndicadores .= "and i.idinversion in (select doi.idinversion from   mod_planifinversiones.dat_otrosindicadares doi
                where doi.plan  {$filtro->rawValue}
                and doi.idejercicio = {$parametros['idejercicio']}
                and doi.idnomotrosindicadores = 121)";
            }
        }
//        print_r('<pre>'); print_r($whereOtrosIndicadores); print_r('<pre>'); print_r($parametros);die;

        return $whereOtrosIndicadores;
    }

    private function filtroFinanciamito($filtros)
    {
        foreach ($filtros as $filtro) {
            if ($filtro->cbQuien) {
                $idcbQuien = implode(',', $filtro->id);
                $whereFin .= "and i.idinversion in (select fi.idinversion from mod_planifinversiones.dat_financiamiento"
                    . " fi where fi.idfinancista IN (" . $idcbQuien . ") )";
            }
            if ($filtro->cbComo) {
                $idcbComo = implode(',', $filtro->id);
                $whereFin .= "and i.idinversion in (select fi.idinversion from mod_planifinversiones.dat_financiamiento"
                    . " fi where fi.idtipofinanciamiento IN (" . $idcbComo . ") )";
            }
            if ($filtro->nfGracias) {
                $whereFin .= "and i.idinversion in (select fi.idinversion from mod_planifinversiones.dat_financiamiento"
                    . " fi where fi.gracia " . $filtro->rawValue . ")";
            }
            if ($filtro->nfPorciento) {
                $whereFin .= "and i.idinversion in (select fi.idinversion from mod_planifinversiones.dat_financiamiento"
                    . " fi where fi.porcientointeres " . $filtro->rawValue . ") ";
            }
        }
        return $whereFin;
    }

    private function filtroConstructor($filtros)
    {
        foreach ($filtros as $filtro) {
            if ($filtro->cbConstructor) {
                $cbConstructor = implode(',', $filtro->cbConstructor);
                $whereConts .= "and eta.idetapainversion in (select etaco.idetapainversion from mod_planifinversiones.dat_etapinverconsprov"
                    . " etaco where etaco.idconstructor IN (" . $cbConstructor . ") )";
            }
            if ($filtro->cbConstructorProv) {
                $idProv = implode(',', $filtro->cbConstructorProv);
                $whereConts .= "and eta.idetapainversion in (select etaco.idetapainversion from mod_planifinversiones.dat_etapinverconsprov"
                    . " etaco where etaco.idetapinverconsprov IN (" . $idProv . ") )";
            }
        }
        return $whereConts;
    }

    private function filtroEquipos($filtros)
    {

        $whereEquipos = " ";
        foreach ($filtros as $filtro) {
            if ($filtro->cbComprar) {
                $idcomprar = implode(',', $filtro->id);
                if (count($whereEquipos)) {
                    $whereEquipos .= " AND e.idcomprar IN (" . $idcomprar . ")";
                } else {
                    $whereEquipos .= " e.idcomprar IN (" . $idcomprar . ")";
                }
            }
            if ($filtro->cbAquirir) {
                $idadquirir = implode(',', $filtro->id);
                if (count($whereEquipos)) {
                    $whereEquipos .= " AND e.idadquisicion IN (" . $idadquirir . ")";
                } else {
                    $whereEquipos .= " e.idadquisicion IN (" . $idadquirir . ")";
                }
            }
            if ($filtro->cbxPais) {

                $idcomprar = implode(',', $filtro->id);

                if (count($whereEquipos)) {
                    $whereEquipos .= " AND e.idcomprarpais IN (" . $idcomprar . ")";
                } else {
                    $whereEquipos .= " e.idcomprarpais IN (" . $idcomprar . ")";
                }
            }
            if ($filtro->tfCantEquipo) {
                $cantidad = $filtro->rawValue;
                if (count($whereEquipos)) {
                    $whereEquipos .= " AND e.cantidad {$cantidad}";
                } else {
                    $whereEquipos .= " e.cantidad {$cantidad}";
                }
            }
        }

        return $whereEquipos;
    }

    private function exportarRptPDF($codigo, $whereInver, $whereOtrosInd, $whereEq, &$parametros, $entid, $entidDenom, $whereFin, $whereConstr, $formaPropiedadDenom, $comprarEquipoDenom)
    {
        //pre_r($parametros);die;
        switch ($codigo) {
            //reporte Emision de inversion
//        $parametros['direccionInversiones'] = $this->integrator->metadatos->DameHijosEstructura();
            case 2:
                $parametros['idorganismo'] = $entid;
                $parametros['organismoden'] = $entidDenom;
                $parametros['formaden'] = $formaPropiedadDenom;
                $obj = new GenerarPdfEmisionInversion($parametros, $whereInver, $whereOtrosInd);
                $obj->export();
                break;
            case 5:
                $parametros['idorganismo'] = $entid;
                $parametros['organismoden'] = $entidDenom;
                $parametros['formaden'] = $formaPropiedadDenom;
                $parametros['comprarden'] = $comprarEquipoDenom;
                $parametros['idforma'] = $formaPropiedadDenom;
                $parametros['forma'] = $parametros['forma'];
                //pre_r($parametros);die;

                $obj = new GenerarPdfEquiposAutomotores($parametros, $whereInver, $whereOtrosInd, $whereEq, $whereFin, $whereConstr);
                $obj->export();
                break;
        }
    }

    public function getDatosReporte($params)
    {
        $data = array();
        if ($params['codigo'] == 11 || $params['codigo'] == 15 || $params['codigo'] == 16 || $params['codigo'] == 17 || $params['codigo'] == 22) {
            $org = array();
            $ent = array();
        }
        if ($params['codigo'] == 16 || $params['codigo'] == 17) {
            $mon = array();
        }

        if ($params['codigo'] == 22) {
            $FP = array();
        }
        /* Aqui se forma la cadena para el where de la consulta teniendo en cuenta los filtros
          la cadena se guardara en $params donde ya se encuentran los demas parametros
          Los alias son:
          i: Tabla dat_inversion
          e: Tabla dat_estructura para el organismo
          ep: Tabla dat_estructura para la entidad
          c: Tabla dat_constructor
          eicpp: Tabla dat_etapinverconsprovplan
          dpt: Tabla nom_dpt
          eeq: Tabla dat_etapaequipos
          os: Tabla
         */

        $params['cadenaWHERE'] = "";
        $params['cadenaEquipoWHERE'] = "";
        //print_r($params['filtros']);die;

        if (count($params['filtros'])) {
            foreach ($params['filtros'] as $filtro) {
                /* Para los filtros que son combos de multiseleccion */
                if (is_array($filtro['id']) || $filtro['id'] != '') {

                    if (count($filtro['id'])) {
                        $ids = implode(',', $filtro['id']);

                        if ($filtro['name'] == 'cbxOrganismo') {
                            if ($params['codigo'] == 7 || $params['codigo'] == 8 || $params['codigo'] == 6 || $params['codigo'] == 20
                                || $params['codigo'] == 1 || $params['codigo'] == 28 || $params['codigo'] == 26
                                || $params['codigo'] == 27 || $params['codigo'] == 23 || $params['codigo'] == 24
                                ||  $params['codigo'] == 3 ||$params['codigo'] == 11 || $params['codigo'] == 15
                                || $params['codigo'] == 10 || $params['codigo'] == 16 || $params['codigo'] == 17
                                || $params['codigo'] == 22 || $params['codigo'] == 19
                            ) {
                                $org = $filtro['id'];
                            } else
                                $params['cadenaWHERE'] .= " AND ep.idestructura in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbxEntidad') {
                            if ($params['codigo'] == 7 || $params['codigo'] == 8 || $params['codigo'] == 6 || $params['codigo'] == 20
                                || $params['codigo'] == 10 || $params['codigo'] == 28 || $params['codigo'] == 26
                                || $params['codigo'] == 27 || $params['codigo'] == 23 || $params['codigo'] == 24
                                || $params['codigo'] == 3 || $params['codigo'] == 11 || $params['codigo'] == 15
                                || $params['codigo'] == 16 || $params['codigo'] == 17 || $params['codigo'] == 22
                                || $params['codigo'] == 19) {
                                $ent = $filtro['id'];
                            } else
                                $params['cadenaWHERE'] .= " AND e.idestructura in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbObjetivo') {
                            $params['cadenaWHERE'] .= " AND i.idobjetivo in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbxMedioAmbiente') {
                            $params['cadenaWHERE'] .= " AND i.idmedioambiente in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbFormaPropiedad') {
                            if ($params['codigo'] == 22) {
                                $FP = $filtro['id'];
                            } else
                                $params['cadenaWHERE'] .= " AND i.idformapropiedad in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbEfecto') {
                            $params['cadenaWHERE'] .= " AND i.idefectocomercial in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbProvincia') {
                            $params['cadenaWHERE'] .= " AND i.idprovincia in ({$ids}) ";
                            $provincia = $ids;
                        } else if ($filtro['name'] == 'cbPrograma') {
                            $params['cadenaWHERE'] .= " AND i.idprograma in ({$ids}) ";
                        } //la clasificacion esta en la tabla datinversion  y es el idtipoinversion
                        else if ($filtro['name'] == 'cbClasificacion') {
                            $params['cadenaWHERE'] .= " AND i.idtipoinversion in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbDesempeno') {
                            $params['cadenaWHERE'] .= " AND i.iddatdesempenno in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbTipoInver') {
                            $params['cadenaWHERE'] .= " AND i.idtipoinversionprograma in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbMoneda') {
                            if ($params['codigo'] == 20 || $params['codigo'] == 23 || $params['codigo'] == 16 || $params['codigo'] == 17) {
                                $mon = $filtro['id'];
                            }
                        }
                        /* else if($filtro['name']=='cbConstructor'){
                          $params['cadenaWHERE'].= " AND c.idconstructor in ({$ids}) ";
                          }
                          else if($filtro['name']=='cbConstructorProv'){
                          $params['cadenaWHERE'].= " AND dpt.iddpt in ({$ids}) ";
                          }
                          else if($filtro['name']=='cbComprar'){
                          $params['cadenaWHERE'].= " AND eeq.idcomprar in ({$ids}) ";
                          }
                          else if($filtro['name']=='cbAquirir'){
                          $params['cadenaWHERE'].= " AND eeq.idadquisicion in ({$ids}) ";
                          }
                          else if($filtro['name']=='cbxPais'){
                          $params['cadenaWHERE'].= " AND eeq.idcomprarpais in ({$ids}) ";
                          } */
                        //filtros de equipos
                        else if ($filtro['name'] == 'cbComprar') {
                            $params['cadenaEquipoWHERE'] .= " AND eeq.idcomprar in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbAquirir') {
                            $params['cadenaEquipoWHERE'] .= " AND eeq.idadquisicion in ({$ids}) ";
                        } else if ($filtro['name'] == 'tfCantEquipo') {
                            //print_r($filtro['id']);die;
                            $params['cadenaEquipoWHERE'] .= " AND eeq.cantidad {$filtro['id']} ";
                        } else if ($filtro['name'] == 'cbxPais') {
                            $params['cadenaEquipoWHERE'] .= " AND eeq.idcomprarpais in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbxOrganoSatisf') {
                            $params['cadenaEquipoWHERE'] .= " AND os.idorganosatisface in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbxNivel') {
                            if ($params['codigo'] == 23) {
                                $nivel = $filtro['id'][0];
                            }
                        }
                    }
                }

                /*   Para los filtros que son de seleccion simple */
                if ($filtro['name'] == 'dfFechaInicio') {
                    if ($filtro['rawValue'])
                        $params['cadenaWHERE'] .= "  AND i.fechainicio = '" . $filtro['rawValue'] . "'";
                } else if ($filtro['name'] == 'dfFechaFin') {
                    if ($filtro['rawValue'])
                        $params['cadenaWHERE'] .= " AND i.fechafin = '" . $filtro['rawValue'] . "' ";
                } else if ($filtro['name'] == 'nfAnosPost') {
                    if ($filtro['rawValue'])
                        $params['cadenaWHERE'] .= " AND i.analpostinversiones " . $filtro['rawValue'] . "";
                } //identificar si se muestran o no las inversiones(reportes 11 y 15 y 3)
                else if ($filtro['name'] == 'chMostrarInversiones') {
                    if ($filtro['id'] == 1)
                        $mostrarinv = 1;
                    else
                        $mostrarinv = 0;
                }
            }
        }
        /* Fin de los filtros */
        // print_r($params['codigo']);die;
        /* Aqui se comprueba el codigo del reporte para implementarlo */
        switch ($params['codigo']) {
            case 6:
                //$data = self::getDatosReporteGeneral($params, $org, $ent);
                break;
            case 7:
                //$data = self::reporteSectoresAmbientales($params);
                break;
            case 8:
                //$data = self::reporteAcciones($params);
                break;
            case 9:
                //$data = self::getReporteCuencasBahias($params, $org, $ent);
                break;
            case 10:
                //Demanda por Constructor
                //$data = self::getDatosRepNivActPorCons($params, $org, $ent);
                break;
            case 14:

                break;
            case 13:

                break;
            //MINCEX
            case 12:
                //$data = self::reporteMincex($params);
                break;


            case 11:
                //Construccion y montaje por constructor
                //$data = self::getDatosRepConsMontPorConst($params, $org, $mostrarinv, $ent);
                break;
            case 15:
                //Construccion y montaje
                //$data = self::getDatosRepConsMont($params, $org, $mostrarinv, $ent);
                break;
            case 16:
                //Inversion - Acreedor
                //$data = self::getDatosRepInversionAcreedor($org, $params, $ent, $mon);
                break;
            case 17:
                // Acreedor -  Inversion
                //$data = self::getDatosRepAcreedorInversion($org, $params, $ent, $mon);
                break;
            case 18:

            case 19:
                //$data = self::getDatosViviendaHab($params, $org, $ent);

                break;
            case 22:
                // Maqueta
                //$data = self::getDatosRepMaqueta($org, $ent, $params, $FP);
                break;
            case 1:
                // Nivel de actividad por constructor
                //$data = self::getDatosNivelAct($params, $org);
                break;
            case 3:
                // Componentes
                $data = self::getDatosRepComponente($org, $ent, $params, $mostrarinv);
                break;
            case 24:
                // Equipos por organo rector
                //$data = self::getDatosRepEquiposAutomotoresPlanes($org, $ent, $params);
                break;
            case 23:
                // Demanda de Equipos
                //$data = self::getDatosRepDemandaEquipos($org, $ent, $mon, $nivel, $mostrarinv, $params);
                break;
            case 25:
                // Balance de Equipos
                //$data = self::getDatosRepBalanceEquipos($params);
                break;

            case 20:
                //Resumen de inversion
                //$data = self::getDatosReporteInversion($params, $org, $ent);
                break;
            case 26:
                // Modelo firma medio ambiente
                //$data = self::getDatosReporteModeloFirmaMedioAmbiente($org, $ent, $params);
                break;
            case 27:
                // Plan total sector ambiental
                //$data = self::getDatosRepPlanTotalSectorAmbiental($org, $ent, $mostrarinv, $params);
                break;
            case 28:
                // Plan provincia-organismo- sector ambiental
                //$data = self::getDatosRepPlanProvinciaOrgSector($org, $ent, $provincia, $params);
                break;
        }


        return $data;
    }









    public function getEntidades($org, $ent)
    {
        $idestructuras = array();
        foreach ($org as $pos => $value) {//organismos
            $idest = array();
            $idest = self::buscarEntidades($value);
            if ($ent[0] != null) {
                foreach ($idest as $key => $valor) {
                    if (in_array($valor, $ent)) {
                        $idestructuras[] = array($valor);
                    }
                }
                if (empty($idestructuras)) {
                    $idestructuras[] = $idest;
                }
            } else {
                $idestructuras[] = $idest;
            }

            $idestructuras[] = array($value);
        }

        $todas_entidades = array();
        foreach ($idestructuras as $value) {
            $todas_entidades = array_merge($todas_entidades, $value);
        }

        return $todas_entidades;
    }

















    public function getDatosRepComponente($org, $ent, $params, $mostrarinv)
    {
        print_r('comp');die;
        //formar las columnas y sus referencias
        $objinversion = new DatInversion();
        $componentes = $objinversion->getComponentes();
        foreach ($componentes as $key => $value) {
            $arrcolumnasCUP[] = $value['denominacion'];
            $arrreferenciasCUP[] = $value['denominacion'] . "CUP";
        }
        $arrcolumnasCUP[] = 'TOTAL INVERSION';
        $arrcolumnasCUP[] = 'PLAN DE PREPARACION';
        $arrreferenciasCUP[] = 'totalinversionCUP';
        $arrreferenciasCUP[] = 'preparacionCUP';

        foreach ($componentes as $key => $value) {
            $arrcolumnasUSD[] = $value['denominacion'];
            $arrreferenciasUSD[] = $value['denominacion'] . "USD";
        }
        $arrcolumnasUSD[] = 'TOTAL INVERSION';
        $arrcolumnasUSD[] = 'PLAN DE PREPARACION';
        $arrreferenciasUSD[] = 'totalinversionUSD';
        $arrreferenciasUSD[] = 'preparacionUSD';
        if ($mostrarinv == 1) {
            $encabezados = array(
                array(
                    'tipo' => 'simple',
                    'emptyvalue' => '0',
                    'header' => '',
                    'columnas' => array('ORGANISMO / PRESUPUESTO MEP', 'ORGANISMO', 'SECTOR ESTRATEGICO','IMPACTO POR INCREMENTO SALARIAL MT'),
                    'referencias' => array('denom', 'org', 'sector', 'impactoSalarial')
                ),
                array(
                    'tipo' => 'simple',
                    'emptyvalue' => '0',
                    'header' => 'Plan ' . $params['ejercicio'] . ' Moneda TOTAL',
                    'columnas' => $arrcolumnasCUP,
                    'referencias' => $arrreferenciasCUP
                ),
                array(
                    'tipo' => 'simple',
                    'emptyvalue' => '0',
                    'header' => 'Plan ' . $params['ejercicio'] . ' DIVISA',
                    'columnas' => $arrcolumnasUSD,
                    'referencias' => $arrreferenciasUSD
                ));
        } else {
            $encabezados = array(
                array(
                    'tipo' => 'simple',
                    'emptyvalue' => '0',
                    'header' => '',
                    'columnas' => array('ORGANISMO / PRESUPUESTO MEP', 'ORGANISMO','IMPACTO POR INCREMENTO SALARIAL MT'),
                    'referencias' => array('denom', 'org', 'impactoSalarial')
                ),
                array(
                    'tipo' => 'simple',
                    'emptyvalue' => '0',
                    'header' => 'Plan ' . $params['ejercicio'] . ' Moneda TOTAL',
                    'columnas' => $arrcolumnasCUP,
                    'referencias' => $arrreferenciasCUP
                ),
                array(
                    'tipo' => 'simple',
                    'emptyvalue' => '0',
                    'header' => 'Plan ' . $params['ejercicio'] . ' DIVISA',
                    'columnas' => $arrcolumnasUSD,
                    'referencias' => $arrreferenciasUSD
                ));
        }

        //formar el arreglo de organos en caso de que no se seleccione ninguno
        $organismos = $org;
        if ($organismos[0] == null) {
            $organismos = self::cargarOrganismos();
        }

        //formar el arreglo de organos y entidades hijas como uno solo
        $data = array();
        $objinversionModel = new InversionesModel();
        //Si se muestran las inversiones se quita la direccion de inversiones
        if ($mostrarinv == 1 && $org[0] == null) {
            unset($organismos[0]);
        }

        $posicionInv = 0;
        foreach ($organismos as $pos => $value) {//organismos
            $idestructuras = array();
            $idest = array();
            //$idest = self::buscarEntidades($value);
            $idest = self::buscarEntidadesTodas($value);

            if ($ent[0] != null) {
                foreach ($idest as $key => $valor) {
                    if (in_array($valor, $ent))
                        $idestructuras[] = $valor;
                }
                if (empty($idestructuras)) {
                    $idestructuras[] = $idest;
                }
            } else
                $idestructuras = $idest;

//            $idestructuras[] = $value;

            $entidades_hijas = implode(",", array_values($idestructuras));


            if ($mostrarinv == 1) {

                $monedas[0] = 'CUP';
                $monedas[1] = 'USD';

                //$inversionesSegunFiltros = $objinversion->listarInversionPorFiltros($entidades_hijas, $params, 'componente');
                $totalizarPorOrganismo = 1;
                //pre_r($inversionesSegunFiltros);die;
                $invXcomponentes = $objinversion->getDatosRptComponentes($params, $params['idejercicio'], $entidades_hijas, $totalizarPorOrganismo);

                $inversiones = array();
                $organismos = array();
                $sectores = array();
                $valorpp = array();
                $denominversiones = array();
                $k = 0;
                $p = 0;
                foreach ($invXcomponentes as $p => $dato) {
                    if (!in_array($dato['idinversion'], $inversiones)) {
                        $inversiones[] = $dato['idinversion'];
                        $denominversiones[] = $dato['inversion'];
                        $organismos[] = $dato['organismopadre'];
                        $sectores[] = $dato['sector'];
                    }
                    if ($dato['idetapa'] == NULL) {
                        $valorpp[$k]['idinversion'] = $dato['idinversion'];
                        $valorpp[$k]['codigoiso'] = $dato['codigoiso'];
                        $valorpp[$k]['valorpp'] = $dato['valor'];
                        $k++;
                    }
                    if($dato['indicador'] != NULL){
                        $impactoSalarial[$p]['idinversion'] = $dato['idinversion'];
                        $impactoSalarial[$p]['valorIS'] = $dato['valor'];
                        $p++;
                    }
                }

                foreach ($inversiones as $i => $dato) {
                    $data[$posicionInv]['denom'] = $denominversiones[$i];
                    $data[$posicionInv]['org'] = $organismos[$i];
                    $data[$posicionInv]['sector'] = $sectores[$i];

                    foreach ($monedas as $moneda) {

                        $totalInversiones = 0;
                        foreach ($componentes as $comp) {
                            $encuentra = false;
                            $valComponente = 0;
                            foreach ($invXcomponentes as $p => $datoInv) {
                                if ($datoInv['idinversion'] == $dato) {
                                    if ($moneda == $datoInv['codigoiso']) {
                                        if ($comp['idnombreetapa'] == $datoInv['idnombreetapa']) {
                                            $encuentra = true;
                                            $valComponente = $datoInv['valor'];
                                            break;
                                        }
                                    }
                                }
                            }

                            $val = ($encuentra) ? $valComponente : 0;
                            $totalInversiones += ($encuentra) ? $valComponente : 0;
                            $data[$posicionInv][$comp['denominacion'] . $moneda] = $val;
                        }
                        $data[$posicionInv]['totalinversion' . $moneda] = $totalInversiones;
                        $planPreparacion = 0;
                        foreach ($valorpp as $var) {
                            if ($var['idinversion'] == $dato && $moneda == $var['codigoiso']) {
                                $planPreparacion = $var['valorpp'];
                                break;
                            }
                        }
                        $data[$posicionInv]['preparacion' . $moneda] = $planPreparacion;

                        $valorImpactoSalarial = 0;
                        foreach ($impactoSalarial as $var) {
                            if ($var['idinversion'] == $dato ) {
                                $valorImpactoSalarial = $var['valorIS'];
                                break;
                            }
                        }
                        $data[$posicionInv]['impactoSalarial'] = $valorImpactoSalarial;
                    }
                    $posicionInv++;
                }
            } else {
                $totalesXcomponentes = [];
                //$inversionesSegunFiltros = $objinversion->listarInversionPorFiltros($entidades_hijas, $params, 'componente');
                $totalesXcomponentes = $objinversion->getDatosRptComponentes($params, $params['idejercicio'], $entidades_hijas, 0); //print_r($totalesXcomponentes);die;
                //print_r($totalesXcomponentes);die;
                $tempEnt = $this->integrator->metadatos->DameEstructura($value);
                //print_r($totalesXcomponentes);die;
                $data[$pos]['denom'] = $tempEnt[0]->codigo . ' - ' . $tempEnt[0]->denominacion;
                $data[$pos]['org'] = $tempEnt[0]->denominacion;

                for ($i = 0; $i < count($componentes); $i++) {
                    foreach ($totalesXcomponentes as $dat => $datos) {
                        if ($datos['codigoiso'] == 'CUP') {
                            if (($componentes[$i]['idnombreetapa'] == $datos['idnombreetapa'])) {
                                $data[$pos][$componentes[$i]['denominacion'] . 'CUP'] += $datos['valor'];
                            } else {
                                $data[$pos][$componentes[$i]['denominacion'] . 'CUP'] += 0;
                            }
                        } else {
                            if (($componentes[$i]['idnombreetapa'] == $datos['idnombreetapa'])) {

                                $data[$pos][$componentes[$i]['denominacion'] . 'USD'] += $datos['valor'];
                            } else {
                                $data[$pos][$componentes[$i]['denominacion'] . 'USD'] += 0;
                            }
                        }
                    }
                }
                //print_r($data);die;
                $ppcup = 0;
                $ppusd = 0;
                foreach ($totalesXcomponentes as $datos) {
                    if ($datos['idetapa'] == NULL && $datos['indicador'] == NULL) {
                        if ($datos['codigoiso'] == 'CUP')
                            $ppcup += $datos['valor'];
                        else
                            $ppusd += $datos['valor'];
                    }
                }

                //buscar el impacto salarial
                $impactoSalarial = 0;
                foreach ($totalesXcomponentes as $datos) {
                    if ($datos['indicador'] != NULL) {
                        $impactoSalarial += $datos['valor'];
                    }
                }
                $data[$pos]['impactoSalarial'] = $impactoSalarial;

                $data[$pos]['totalinversionCUP'] = 0;
                $data[$pos]['totalinversionUSD'] = 0;
                foreach ($componentes as $valorcomp) {
                    $data[$pos]['totalinversionCUP'] += $data[$pos][$valorcomp['denominacion'] . 'CUP'];
                    $data[$pos]['totalinversionUSD'] += $data[$pos][$valorcomp['denominacion'] . 'USD'];
                }
                //print_r($ppcup);die;
                $data[$pos]['preparacionCUP'] = $ppcup;
                $data[$pos]['preparacionUSD'] = $ppusd;

                /* if ($data[$pos]['totalinversionCUP'] > 0)
                  $data[$pos]['preparacionCUP'] = $totalesXcomponentes[0]['planpreparacion'];
                  else
                  $data[$pos]['preparacionCUP'] = 0;

                  if ($data[$pos]['totalinversionUSD'] > 0)
                  $data[$pos]['preparacionUSD'] = $totalesXcomponentes[count($totalesXcomponentes) - 1]['planpreparacion'];
                  else
                  $data[$pos]['preparacionUSD'] = 0; */
            }
        }
        /* print_r($encabezados);
		 print_r('//////////////');
		 print_r($encabezados);die;*/
        $result[0]->tipo = 'multiheader';
        $result[0]->encabezados = $encabezados;
        $result[0]->datos = $data;
        $result['subsistema'] = 'inversiones';
        $result['titulo'] = 'Componentes';

        return $result;
    }



























    //Este metodo ordena los datos y calcula los totales para el reporte de codigo 11
    public function calcularTotalesOrdenarDatos($datos, $mostrarinv, $identidad, $pos)
    {

        $totUSDent = 0;
        $totMPent = 0;
        $longitud = count($datos);
        for ($k = 0; $k <= $longitud; $k++) {
            $totUSDent += $datos[$k]['usd'];
            $totMPent += $datos[$k]['cup'];
        }
        $tempEnt = $this->integrator->metadatos->DameEstructura($identidad);
        $dat[$pos]['denom'] = 'Entidad - ' . $tempEnt[0]->denominacion;
        if ($mostrarinv == 1) {
            $dat[$pos]['prov'] = " ";
        }
        $dat[$pos]['cup'] = $totMPent;
        $dat[$pos]['usd'] = $totUSDent;
        $dat[$pos]['negrita'] = true;
        $dat[$pos]['color'] = '#CCFFCC';
        $pos++;

        $this->totalorgent['usd'] += $totUSDent;
        $this->totalorgent['cup'] += $totMPent;

        $longitud = count($datos);
        $totUSDinv = 0;
        $totMPinv = 0;
        $totalesInv = array();
        $denomcont = $datos[0]['dencont'];
        $ident = $datos[0]['idestructuracomun'];
        for ($ke = 0; $ke <= $longitud; $ke++) {
            if ($ident == $datos[$ke]['idestructuracomun']) {
                if ($denomcont == $datos[$ke]['dencont']) {
                    $totUSDinv += $datos[$ke]['usd'];
                    $totMPinv += $datos[$ke]['cup'];
                } else {
                    $totalesInv[$datos[$ke - 1]['idconstructor']] ['usd'] = $totUSDinv;
                    $totalesInv[$datos[$ke - 1]['idconstructor']] ['cup'] = $totMPinv;
                    $denomcont = $datos[$ke]['dencont'];
                    $totUSDinv = 0;
                    $totMPinv = 0;
                    $totUSDinv += $datos[$ke]['usd'];
                    $totMPinv += $datos[$ke]['cup'];
                }
            } else {
                $totalesInv[$datos[$ke - 1]['idconstructor']] ['usd'] = $totUSDinv;
                $totalesInv[$datos[$ke - 1]['idconstructor']] ['cup'] = $totMPinv;
                $ident = $datos[$ke]['idestructuracomun'];
                $denomcont = $datos[$ke]['dencont'];
                $totUSDinv = 0;
                $totMPinv = 0;
            }
        }

        $denomcont = "";
        foreach ($datos as $key => $value) {
            if ($mostrarinv == 1) {
                if ($denomcont != $value['dencont']) {
                    $dat[$pos]['denom'] = $value['dencont'];
                    $dat[$pos]['negrita'] = true;
                    $dat[$pos]['prov'] = " ";
                    $dat[$pos]['cup'] = $totalesInv[$value['idconstructor']] ['cup'];
                    $dat[$pos]['usd'] = $totalesInv[$value['idconstructor']] ['usd'];
                    $pos++;
                    $dat[$pos]['denom'] = $value['denominacion'];
                    $dat[$pos]['prov'] = $value['prov'];
                    $dat[$pos]['cup'] = $value['cup'];
                    $dat[$pos]['usd'] = $value['usd'];
                    $pos++;
                    $denomcont = $value['dencont'];
                } else {
                    $dat[$pos]['denom'] = $value['denominacion'];
                    $dat[$pos]['prov'] = $value['prov'];
                    $dat[$pos]['cup'] = $value['cup'];
                    $dat[$pos]['usd'] = $value['usd'];
                    $pos++;
                }
            } else {
                if ($denomcont != $value['dencont']) {
                    $dat[$pos]['denom'] = $value['dencont'];
                    $dat[$pos]['prov'] = " ";
                    $dat[$pos]['cup'] = $totalesInv[$value['idconstructor']] ['cup'];
                    $dat[$pos]['usd'] = $totalesInv[$value['idconstructor']] ['usd'];
                    $pos++;
                    $denomcont = $value['dencont'];
                }
            }
        }

        return $dat;
    }



    //Este metodo carga los organismos de la entidad logueada...
    public function cargarOrganismos()
    {
        $idEstructura = 0;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras($this->global->Perfil->iddominio, $idEstructura, 0, 0, 3);
        $cont = 0;
        $result = array();
        foreach ($dominios as $valor) {
            $entidades = $this->integrator->metadatos->DameHijosEstructura($valor['id']);
            $result[$cont] = $valor['id'];
            $cont = $cont + 1;
            foreach ($entidades as $key => $val) {
                $result[$cont] = $val->id;
                $cont = $cont + 1;
            }
        }

        return $result;
    }

    //Este metodo carga los organismos de la entidad logueada...
    public function cargarOrganismosYNombre()
    {
        $idEstructura = 0;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras($this->global->Perfil->iddominio, $idEstructura, 0, 0, 3);
        $cont = 0;
        $result = array();
        foreach ($dominios as $valor) {
            $entidades = $this->integrator->metadatos->DameHijosEstructura($valor['id']);
            $result[$cont] = $valor['id'];
            $cont = $cont + 1;
            foreach ($entidades as $key => $val) {
                $result[$cont]['id'] = $val->id;
                $result[$cont]['denom'] = $val->denominacion;
                $cont = $cont + 1;
            }
        }

        return $result;
    }

    public function cargarEntidades($idorg)
    {
        $entidades = array();
        $dominios = $this->integrator->metadatos->DameHijosEstructura($idorg);
        if ($dominios[0] != "") {
            foreach ($dominios as $key => $k) {
                $entidades_hijas = self::entidadesHijas($k->id);
                $entidades = array_merge($entidades_hijas, $entidades);
            }
        }
        return $entidades;
    }

    public function entidadesHijas($identidad)
    {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);
        $entidades_hijas = array();
        $entidades_hijas[0] = $identidad;
        foreach ($dominios as $key => $entidad_hija) {
            if ($entidad_hija->leaf == 1) {
                $entidades_hijas[$key + 1] = $entidad_hija->id;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id));
            }
        }
        return $entidades_hijas;
    }



    public function buscarEntidades($identidad)
    {
        $query = " SELECT f5.idfila as idestructura
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc
f3 WHERE f3.idfila = $identidad)AND f5.rgt <= (SELECT f4.rgt FROM "
            . "mod_estructuracomp.nom_filaestruc f4 WHERE f4.idfila = $identidad)
AND f5.rgt -f5.lft =1";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);

        return $result;
    }

    public function buscarOrganismo()
    {
        $query = "SELECT f5.idfila as idestructura, de.denominacion                    
                FROM mod_estructuracomp.nom_filaestruc f5
                 INNER JOIN mod_estructuracomp.dat_estructura de ON(de.idestructura = f5.idfila)
                 where f5.idfila <> f5.idpadre  AND f5.rgt -f5.lft <>1
                order by  de.denominacion";
        $conn = Doctrine_Manager::connection();

        //pre_r($query);die;
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarOrganismoYCodigo()
    {
        $query = "SELECT f5.idfila as idestructura, de.denominacion, de.codigo
                FROM mod_estructuracomp.nom_filaestruc f5
                 INNER JOIN mod_estructuracomp.dat_estructura de ON(de.idestructura = f5.idfila)
                 where f5.idfila <> f5.idpadre  AND f5.rgt -f5.lft <>1
                order by  de.denominacion";
        $conn = Doctrine_Manager::connection();

        //pre_r($query);die;
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarEntidadesConNombre($identidad)
    {
        $query = " SELECT f5.idfila as identidad, de.denominacion as entidad
                    FROM mod_estructuracomp.nom_filaestruc f5
                    INNER JOIN mod_estructuracomp.dat_estructura de ON(de.idestructura = f5.idfila)
                    WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc
                    f3 WHERE f3.idfila = $identidad)AND f5.rgt <= (SELECT f4.rgt FROM "
            . "mod_estructuracomp.nom_filaestruc f4 WHERE f4.idfila = $identidad)
                    AND f5.rgt -f5.lft =1";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function buscarEntidadesTodas($identidad)
    {
        $query = " SELECT f5.idfila as idestructura
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc
f3 WHERE f3.idfila = $identidad)AND f5.rgt <= (SELECT f4.rgt FROM "
            . "mod_estructuracomp.nom_filaestruc f4 WHERE f4.idfila = $identidad)
/*AND f5.rgt -f5.lft =1*/";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);

        return $result;
    }

    //para buscar las entidades hijas de todos los organismos excepto el de dir de inversion
    //que viene solo su id
    /* public function buscarEntidades($identidad)

      {
      $query
      = " SELECT f5.idfila as idestructura
      FROM mod_estructuracomp.nom_filaestruc f5
      WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc
      f3 WHERE f3.idfila = $identidad and f3.idfila <> f3.idpadre)AND f5.rgt <= (SELECT f4.rgt FROM "
      . "mod_estructuracomp.nom_filaestruc f4 WHERE f4.idfila = $identidad)
      AND f5.rgt -f5.lft =1";
      $conn = Doctrine_Manager::connection();
      $res = $conn->execute($query);
      $result = $res->fetchAll(PDO::FETCH_COLUMN);

      return $result;
      } */
    private function cargarTodosOrganismosYArrayHijas($iddominio, $selectDenomOrganismo = null)
    {

        /*
          $selectDenom = " ";
          if ($selectDenomOrganismo == null || $selectDenomOrganismo == 0) {
          $selectDenom = " ";
          } else if ($selectDenomOrganismo == 1) {
          $selectDenom = " ,CASE
          when nomcargo.denominacion <> '' then nomcargo.denominacion
          when estructura.denominacion <> '' then estructura.denominacion
          when estructuraop.denominacion <> '' then estructuraop.denominacion
          when nommedio.denominacion <> '' then nommedio.denominacion
          END as text";
          }
         */

        $query = "SELECT idfila as id,

               CASE
                      when nomcargo.denominacion <> '' then nomcargo.denominacion
                      when estructura.denominacion <> '' then estructura.denominacion
                      when estructuraop.denominacion <> '' then estructuraop.denominacion
                      when nommedio.denominacion <> '' then nommedio.denominacion
                                                                    END as text,
                 COALESCE( (        SELECT
   array_to_string(array_prepend(idpadre,
    
                    (SELECT

                    array_agg(f.idfila)
                    FROM mod_estructuracomp.nom_filaestruc  f
                 WHERE (f.lft > (
                                                  SELECT f1.lft
                                                  FROM mod_estructuracomp.nom_filaestruc  f1
                                                  WHERE f1.idfila = fila.idfila
                                                  )
                                            AND f.lft < (
                                                  SELECT f1.rgt
                                                  FROM mod_estructuracomp.nom_filaestruc  f1
                                                  WHERE f1.idfila = fila.idfila
                                                  )
                                        )

                and f.idfila in (
                SELECT idfila
                               FROM mod_estructuracomp.nom_filaestruc fila

                                    INNER JOIN mod_estructuracomp.nom_concepto nomeav
                                        ON (fila.idconcepto = nomeav.idconcepto)
                                    INNER JOIN mod_estructuracomp.nom_icono icono
                                        ON (icono.idicono = nomeav.idicono)
                                    LEFT JOIN mod_estructuracomp.dat_estructura estructura
                                        ON (fila.idfila = estructura.idestructura AND estructura.idproyecto =0 )
                                    LEFT JOIN mod_estructuracomp.nom_organo orgest
                                        ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto )
                                    LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                                        ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto =0)
                                    LEFT JOIN mod_estructuracomp.nom_organo orgestop
                                        ON ( orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto   )
                                    LEFT JOIN mod_estructuracomp.dat_medio  medio
                                        ON ( medio.idmedio = fila.idfila AND medio.idproyecto =0 )
                                      LEFT JOIN mod_datosmaestros.nom_indicador  nommedio
                                          ON ( nommedio.idindicador = medio.idnommedio )
                                      LEFT JOIN mod_estructuracomp.dat_cargo  cargo
                                          ON ( cargo.idcargo = fila.idfila AND cargo.idproyecto =0 )
                                      LEFT JOIN mod_estructuracomp.dat_cargocivil cargociv
                                          ON (cargo.idcargo = cargociv.idcargo AND cargociv.idproyecto =0)
                                      LEFT JOIN mod_estructuracomp.dat_cargomilitar cargom
                                          ON (cargo.idcargo = cargom.idcargo AND cargom.idproyecto =0)
                                      LEFT JOIN mod_estructuracomp.nom_cargo nomcargo
                                          ON (  cargo.idnomcargo = nomcargo.idnomcargo )

                               WHERE (fila.fechafin is null)
                                    AND
                                     (estructura.denominacion <> '' OR estructuraop.denominacion <> '' OR nomcargo.denominacion <>
                                    '' OR nommedio.denominacion <>
                                    '')
                                    AND (fila.dominiofila[$iddominio] = 1 :: bit
                                    OR (
                                        SELECT COUNT(DISTINCT f.idfila)
                                        FROM mod_estructuracomp.nom_filaestruc f
                                        WHERE (f.lft > (
                                                  SELECT f1.lft
                                                  FROM mod_estructuracomp.nom_filaestruc  f1
                                                  WHERE f1.idfila = fila.idfila
                                                  )
                                            AND f.lft < (
                                                  SELECT f1.rgt
                                                  FROM mod_estructuracomp.nom_filaestruc  f1
                                                  WHERE f1.idfila = fila.idfila
                                                  )
                                              )
                                    AND (f.fechafin is null)
                                    AND f.dominiofila[$iddominio] = 1 :: bit ) > 0)
                               ORDER BY fila.lft
                ))

                    ), ',')
                FROM mod_estructuracomp.nom_filaestruc
                where idpadre = fila.idfila
                GROUP BY idpadre
                ORDER BY idpadre) ,fila.idfila::text) as dato
                                    
               FROM mod_estructuracomp.nom_filaestruc fila
              
                    INNER JOIN mod_estructuracomp.nom_concepto nomeav
                        ON (fila.idconcepto = nomeav.idconcepto)
                    INNER JOIN mod_estructuracomp.nom_icono icono
                        ON (icono.idicono = nomeav.idicono)
                    LEFT JOIN mod_estructuracomp.dat_estructura estructura
                        ON (fila.idfila = estructura.idestructura AND estructura.idproyecto =0 )
                    LEFT JOIN mod_estructuracomp.nom_organo orgest
                        ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto )
                    LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                        ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto =0)
                    LEFT JOIN mod_estructuracomp.nom_organo orgestop
                        ON ( orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto   )
                    LEFT JOIN mod_estructuracomp.dat_medio  medio
                        ON ( medio.idmedio = fila.idfila AND medio.idproyecto =0 )
                                                              LEFT JOIN mod_datosmaestros.nom_indicador  nommedio
                                                                  ON ( nommedio.idindicador = medio.idnommedio )
                                                              LEFT JOIN mod_estructuracomp.dat_cargo  cargo
                                                                  ON ( cargo.idcargo = fila.idfila AND cargo.idproyecto =0 )
                                                              LEFT JOIN mod_estructuracomp.dat_cargocivil cargociv
                                                                  ON (cargo.idcargo = cargociv.idcargo AND cargociv.idproyecto =0)
                                                              LEFT JOIN mod_estructuracomp.dat_cargomilitar cargom
                                                                  ON (cargo.idcargo = cargom.idcargo AND cargom.idproyecto =0)
                                                              LEFT JOIN mod_estructuracomp.nom_cargo nomcargo
                                                                  ON (  cargo.idnomcargo = nomcargo.idnomcargo )
                    
               WHERE (fila.fechafin is null)
                    AND
                     (estructura.denominacion <> '' OR estructuraop.denominacion <> '' OR nomcargo.denominacion <>
                    '' OR nommedio.denominacion <>
                    '')
                    AND (fila.dominiofila[$iddominio] = 1 :: bit
                    OR (
                        SELECT COUNT(DISTINCT f.idfila)
                        FROM mod_estructuracomp.nom_filaestruc f
                        WHERE (f.lft > (
                                  SELECT f1.lft
                                  FROM mod_estructuracomp.nom_filaestruc  f1
                                  WHERE f1.idfila = fila.idfila
                                  )
                            AND f.lft < (
                                  SELECT f1.rgt
                                  FROM mod_estructuracomp.nom_filaestruc  f1
                                  WHERE f1.idfila = fila.idfila
                                  )
                              )
                    AND (f.fechafin is null)
                    AND f.dominiofila[$iddominio] = 1 :: bit ) > 0)
                    and fila.rgt - fila.lft <> 1
               ORDER BY fila.lft";
        $conn = Doctrine_Manager::connection();
        //print_r($query);die;
        $res = $conn->execute($query);

        /* if ($selectDenomOrganismo == null || $selectDenomOrganismo == 0) {
          $result = $res->fetchAll(PDO::FETCH_COLUMN);
          } else if ($selectDenomOrganismo == 1) {
          $result = $res->fetchAll(PDO::FETCH_ASSOC);
          } */

        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    private function cargarTodosOrganismosEHijas($iddominio, $selectDenomOrganismo = null)
    {


        $selectDenom = " ";
        if ($selectDenomOrganismo == null || $selectDenomOrganismo == 0) {
            $selectDenom = " ";
        } else if ($selectDenomOrganismo == 1) {
            $selectDenom = " ,CASE
                              when nomcargo.denominacion <> '' then nomcargo.denominacion
                              when estructura.denominacion <> '' then estructura.denominacion
                              when estructuraop.denominacion <> '' then estructuraop.denominacion
                              when nommedio.denominacion <> '' then nommedio.denominacion
                              END as text";
        }

        $query = " SELECT idfila as id
                          $selectDenom
                   FROM mod_estructuracomp.nom_filaestruc fila
                        INNER JOIN mod_estructuracomp.nom_concepto nomeav
                            ON (fila.idconcepto = nomeav.idconcepto)
                        INNER JOIN mod_estructuracomp.nom_icono icono
                            ON (icono.idicono = nomeav.idicono)
                        LEFT JOIN mod_estructuracomp.dat_estructura estructura
                            ON (fila.idfila = estructura.idestructura AND estructura.idproyecto =0 )
                        LEFT JOIN mod_estructuracomp.nom_organo orgest
                            ON ( orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto )
                        LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop
                            ON (fila.idfila = estructuraop.idestructuraop AND estructuraop.idproyecto =0)
                        LEFT JOIN mod_estructuracomp.nom_organo orgestop
                            ON ( orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto   )
                        LEFT JOIN mod_estructuracomp.dat_medio  medio
                            ON ( medio.idmedio = fila.idfila AND medio.idproyecto =0 )
                        LEFT JOIN mod_datosmaestros.nom_indicador  nommedio
                          ON ( nommedio.idindicador = medio.idnommedio )
                        LEFT JOIN mod_estructuracomp.dat_cargo  cargo
                          ON ( cargo.idcargo = fila.idfila AND cargo.idproyecto =0 )
                        LEFT JOIN mod_estructuracomp.dat_cargocivil cargociv
                          ON (cargo.idcargo = cargociv.idcargo AND cargociv.idproyecto =0)
                        LEFT JOIN mod_estructuracomp.dat_cargomilitar cargom
                          ON (cargo.idcargo = cargom.idcargo AND cargom.idproyecto =0)
                        LEFT JOIN mod_estructuracomp.nom_cargo nomcargo
                          ON (  cargo.idnomcargo = nomcargo.idnomcargo )

                   WHERE (fila.fechafin is null)
                        AND
                         (estructura.denominacion <> '' OR estructuraop.denominacion <> '' OR nomcargo.denominacion <>
                        '' OR nommedio.denominacion <>
                        '')
                        --AND fila.idfila = fila.idpadre
                        AND (fila.dominiofila[$iddominio] = 1 :: bit
                        OR (
                            SELECT COUNT(DISTINCT f.idfila)
                            FROM mod_estructuracomp.nom_filaestruc f
                            WHERE (f.lft > (
                                      SELECT f1.lft
                                      FROM mod_estructuracomp.nom_filaestruc  f1
                                      WHERE f1.idfila = fila.idfila
                                      )
                                AND f.lft < (
                                      SELECT f1.rgt
                                      FROM mod_estructuracomp.nom_filaestruc  f1
                                      WHERE f1.idfila = fila.idfila
                                      )
                                  )
                            AND (f.fechafin is null)
                            AND f.dominiofila[$iddominio] = 1 :: bit ) > 0)
                   ORDER BY fila.lft";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        //print_r($res);die;

        if ($selectDenomOrganismo == null || $selectDenomOrganismo == 0) {
            $result = $res->fetchAll(PDO::FETCH_COLUMN);
        } else if ($selectDenomOrganismo == 1) {
            $result = $res->fetchAll(PDO::FETCH_ASSOC);
        }
        return $result;
    }

}
