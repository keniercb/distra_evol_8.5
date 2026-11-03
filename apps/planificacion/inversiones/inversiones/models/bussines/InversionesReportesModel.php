<?php

class InversionesReportesModel extends ZendExt_Model {

    protected $totalorgent = array();
    protected $total = array();

    public function getReportes() {
        return (array('data' => NomReporte::getNomReporte()));
    }

    public function getRptByIdRpt($idRpt) {
        return (array('data' => NomReporte::getReporteByIdReporte($idRpt)));
    }

    public function cargarEntidadesHijas($param) {
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

    public function cargarMonedas() {
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

    public function cargarClasificaciones() {
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

    public function cargarTiposInversion() {
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

    public function cargarMedioAmbiente() {
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

    public function cargarEntidadesArbol() {
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

    public function cargarFormaPropiedad() {
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

    public function cargarObjetivos() {
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

    public function cargarEfectos() {
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

    public function cargarDesempennos() {
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

    public function cargarProgramas() {
        $programas = DatInversion::listarProgramada();
        return (array('data' => self::getDataArbol($programas['data'])));
    }

    public function cargarQuienfinancia() {
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

    public function cargarComofinancia() {
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

    public function cargarComprar() {
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

    public function cargarPais() {
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

    public function cargarOrganoSatisface() {
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

    public function cargarNivel() {
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

    public function cargarAdquirir() {
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

    private function getDataArbol($datos) {
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

    public function guardarPie($params) {
        $objNomReporte = Doctrine::getTable('NomReporte')->find($params['idreporte']);
        $pie = array();
        foreach ($params['pie'] as $k => $obj) {
            $pie[$k] = $obj['id'];
        }
        //print_r($pie);die;
        //print_r(implode($pie,'|'));die;

        if ($pie)
            $objNomReporte->configuracion = implode($pie, '|');
        if ($params['denomreporte'])
            $objNomReporte->denominacion = $params['denomreporte'];
        if ($params['obserreporte'])
            $objNomReporte->descripcion = $params['obserreporte'];

        return (NomReporte::savePie($objNomReporte));
    }

    public function cargardarPie($idreporte) {
        $a = NomReporte::getConfiguracionByIdReporte($idreporte);

        $cadena_configuracion = explode('|', $a[0]['configuracion']);

        return array('aprobado' => $cadena_configuracion[0], 'elaborado' => $cadena_configuracion[1], 'observacion' => $cadena_configuracion[2]);
    }

    public function exportarReportesPDF($filtros, $parametros, $codigo) {
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

    private function fitroDatosGenerales($filtros, &$parametros) {
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

    private function filtroOtrosindicadores($filtros, $parametros) {
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

    private function filtroFinanciamito($filtros) {
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

    private function filtroConstructor($filtros) {
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

    private function filtroEquipos($filtros) {

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

    private function exportarRptPDF($codigo, $whereInver, $whereOtrosInd, $whereEq, &$parametros, $entid, $entidDenom, $whereFin, $whereConstr, $formaPropiedadDenom, $comprarEquipoDenom) {
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
        //print_r($parametros);die;

                $obj = new GenerarPdfEquiposAutomotores($parametros, $whereInver, $whereOtrosInd, $whereEq, $whereFin, $whereConstr);
                $obj->export();
                break;

            case 18:
                $parametros['idorganismo'] = $entid;
                $parametros['organismoden'] = $entidDenom;
                $parametros['formaden'] = $formaPropiedadDenom;
                $obj = new GenerarPdfEmisionHabitaciones($parametros, $whereInver, $whereOtrosInd, 0); //0-habitaciones
                $obj->export();
                break;
            case 19:
                $parametros['idorganismo'] = $entid;
                $parametros['organismoden'] = $entidDenom;
                $parametros['formaden'] = $formaPropiedadDenom;
                $obj = new GenerarPdfEmisionHabitaciones($parametros, $whereInver, $whereOtrosInd, 1); //0-viviendas
                $obj->export();
                break;
        }
    }

    public function getDatosReporte($params) {
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
                            if ($params['codigo'] == 7 || $params['codigo'] == 8 || $params['codigo'] == 6 || $params['codigo'] == 20 || $params['codigo'] == 1 || $params['codigo'] == 28 || $params['codigo'] == 26 || $params['codigo'] == 27 || $params['codigo'] == 23 || $params['codigo'] == 24 || $params['codigo'] == 3 || $params['codigo'] == 11 || $params['codigo'] == 15 || $params['codigo'] == 10 || $params['codigo'] == 16 || $params['codigo'] == 17 || $params['codigo'] == 22 || $params['codigo'] == 19
                            ) {
                                $org = $filtro['id'];
                            } else
                                $params['cadenaWHERE'] .= " AND ep.idestructura in ({$ids}) ";
                        } else if ($filtro['name'] == 'cbxEntidad') {
                            if ($params['codigo'] == 7 || $params['codigo'] == 8 || $params['codigo'] == 6 || $params['codigo'] == 20 || $params['codigo'] == 10 || $params['codigo'] == 28 || $params['codigo'] == 26 || $params['codigo'] == 27 || $params['codigo'] == 23 || $params['codigo'] == 24 || $params['codigo'] == 3 || $params['codigo'] == 11 || $params['codigo'] == 15 || $params['codigo'] == 16 || $params['codigo'] == 17 || $params['codigo'] == 22 || $params['codigo'] == 19) {
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
        //print_r($params['codigo']);die;
        /* Aqui se comprueba el codigo del reporte para implementarlo */
        switch ($params['codigo']) {
            case 6:
                $data = self::getDatosReporteGeneral($params, $org, $ent);
                break;
            case 7:
                $data = self::reporteSectoresAmbientales($params);
                break;
            case 8:
                $data = self::reporteAcciones($params);
                break;
            case 9:
                $data = self::getReporteCuencasBahias($params, $org, $ent);
                break;
            case 10:
                //Demanda por Constructor

                $data = self::getDatosRepNivActPorCons($params, $org, $ent);
                break;
            case 14:
                $datosinversion = DatInversion::getDatosInversiones($params);
                $etapas = DatInversion::getNombreEtapas();
                $result = array();
                $data[0]->tipo = 'multiheader';
                $auxresult = $datosinversion;
                $index = 0;
                $plantotalmp = 0;
                $plantotalusd = 0;

                foreach ($auxresult as $pos => $value) {

                    $idinversionactual = $value['idinversion'];
                    $next = $pos + 1;

                    if ($pos != (count($auxresult) - 1)) {
                        if ($idinversionactual != $auxresult[$next]['idinversion']) {
                            $result[$index]['datosinversion'] = $value;
                            $result[$index]['plantotalmp'] = $plantotalmp;
                            $result[$index]['plantotalusd'] = $plantotalusd;

                            $params['idinversion'] = $idinversionactual;

                            $index += 1;
                            $plantotalmp = 0;
                            $plantotalusd = 0;
                        } else {

                            $params['idetapainversion'] = $value['idetapa'];
                            $params['denominacionetapa'] = $value['nombreetapa'];

                            $parametros['idejercicio'] = $params['idejercicio'];
                            $parametros['idmoneda'] = $params['monedamp'];
                            $parametros['idetapa'] = $value['idetapa'];
                            $otrosmp = DatEtapaInversion::cargarPresupuestoInversionXEjercicio($parametros);
                            $parametros['idmoneda'] = $params['monedausd'];
                            $otrosusd = DatEtapaInversion::cargarPresupuestoInversionXEjercicio($parametros);

                            $plantotalmp += $otrosmp['plan'];
                            $plantotalusd += $otrosusd['plan'];


                            $result[$index]['planusd' . $value['idnombreetapa']] = $otrosusd['plan'];
                            $result[$index]['planmp' . $value['idnombreetapa']] = $otrosmp['plan'];
                        }
                    } else {
                        $result[$index]['datosinversion'] = $value;
                        $result[$index]['plantotalmp'] = $plantotalmp;
                        $result[$index]['plantotalusd'] = $plantotalusd;
                        $params['idinversion'] = $idinversionactual;
                    }
                }

                $data[0]->datos = $result;

                $data[0]->encabezados = array(
                    array(
                        'tipo' => 'simple',
                        'inside' => 'datosinversion',
                        'emptyvalue' => '-',
                        'header' => 'ATRIBUTOS GENERALES DE LA INVERSI&Oacute;N',
                        'columnas' => array('ORGANISMO', 'ENTIDAD', 'CODIGO INV', 'INVERSI&Oacute;N', 'TIPO DE INVERSI&Oacute;N',
                            'ESTADO EN EL PLAN ACTUAL', 'FORMA DE PROPIEDAD', 'PROVINCIA', 'PROGRAMA',
                            'FECHA DE INICIO', 'FECHA DE TERMINACI&Oacute;N', /* 'NATURALEZA', */
                            'MEDIO AMBIENTE',
                            'OBJETIVO DE LA INVERSI&Oacute;N', 'GRUPO OBRA', 'SECTOR ESTRAT&Eacute;GICO', 'EFECTO EN COMEX'),
                        'referencias' => array('organismo', 'entidad', 'codigo', 'denominacion', 'tipoinversion',
                            'estadoinversion', 'formapropiedad', 'provincia', 'programa',
                            'fechainicio', 'fechafin', /* 'naturaleza', */
                            'medioambiente',
                            'objetivo', 'grupoobra', 'sector', 'efectocomercial')
                ));
                $planMP = array(
                    'tipo' => 'simple',
                    'emptyvalue' => 0,
                    'actual' => 'actual',
                    'header' => 'PLAN (MP)',
                    'columnas' => array('PLAN (MP) - TOTAL'),
                    'referencias' => array('plantotalmp')
                );

                foreach ($etapas as $etapa) {
                    $planMP['columnas'][] = 'PLAN (MP) - ' . $etapa['denominacion'];
                    $planMP['referencias'][] = 'planmp' . $etapa['idnombreetapa'];
                }

                $planMP['columnas'][] = 'PLAN (MP) - PP';
                $planMP['referencias'][] = 'planmppp';

                $data[0]->encabezados[] = $planMP;

                $planMUSD = array(
                    'tipo' => 'simple',
                    'emptyvalue' => 0,
                    'actual' => 'actual',
                    'header' => 'PLAN (MUSD)',
                    'columnas' => array('PLAN (MUSD) - TOTAL'),
                    'referencias' => array('plantotalusd')
                );

                foreach ($etapas as $etapa) {
                    $planMUSD['columnas'][] = 'PLAN (MUSD) - ' . $etapa['denominacion'];
                    $planMUSD['referencias'][] = 'planusd' . $etapa['idnombreetapa'];
                }

                $planMUSD['columnas'][] = 'PLAN (MUSD) - PP';
                $planMUSD['referencias'][] = 'planusdpp';

                $data[0]->encabezados[] = $planMUSD;

                $data[0]->encabezados[] = array(
                    'tipo' => 'simple',
                    'emptyvalue' => 0,
                    'actual' => 'actual',
                    'header' => '',
                    'inside' => 'datosinversion',
                    'columnas' => array('FONDOS BASICOS (MP)'),
                    'referencias' => array('fondosbasicos')
                );
                $data[0]->encabezados[] = array(
                    'tipo' => 'simple',
                    'inside' => 'datosinversion',
                    'emptyvalue' => 0,
                    'actual' => 'actual',
                    'header' => '',
                    'columnas' => array('CONTRATACI&Oacute;N EXTERNA (MUSD)'),
                    'referencias' => array('contratacionexterna')
                );

                $data[0]->encabezados[] = array(
                    'tipo' => 'simple',
                    'emptyvalue' => '',
                    'inside' => 'datosinversion',
                    'header' => '',
                    'columnas' => array('OBSERVACIONES DE LA INVERSI&Oacute;N'),
                    'referencias' => array('observaciones')
                );

                $data['titulo'] = 'ONEI';
                $data['subsistema'] = 'inversiones';


                break;
            case 13:
                $datosinversion = DatInversion::getDatosInversiones($params);
                $quienfinancia = DatInversion::getQuienFinancia();
                $result = array();
                $data[0]->tipo = 'multiheader';
                $auxresult = $datosinversion;
                $index = 0;
                $plantotalmp = 0;

                foreach ($auxresult as $pos => $value) {

                    $idinversionactual = $value['idinversion'];
                    $next = $pos + 1;

                    if ($pos != (count($auxresult) - 1)) {
                        if ($idinversionactual != $auxresult[$next]['idinversion']) {
                            $result[$index]['datosinversion'] = $value;
                            $result[$index]['plantotalmp'] = $plantotalmp;
                            $params['idinversion'] = $idinversionactual;

                            $index += 1;
                            $plantotalmp = 0;
                        } else {

                            $params['idetapainversion'] = $value['idetapa'];
                            $params['denominacionetapa'] = $value['nombreetapa'];

                            $parametros['idejercicio'] = $params['idejercicio'];
                            $parametros['idmoneda'] = $params['monedamp'];
                            $parametros['idetapa'] = $value['idetapa'];
                            $otrosmp = DatEtapaInversion::cargarPresupuestoInversionXEjercicio($parametros);

                            $plantotalmp += $otrosmp['plan'];
                        }
                    } else {
                        $result[$index]['datosinversion'] = $value;
                        $result[$index]['plantotalmp'] = $plantotalmp;
                        $params['idinversion'] = $idinversionactual;
                    }
                }

                $index = 0;
                foreach ($result as $pos => $value) {
                    $params['idinversion'] = $value['datosinversion']['idinversion'];
                    $financistas = DatInversion::getFinancistasReporte($params);
                    foreach ($financistas as $financista) {
                        $result[$index]['financmp' . $financista['idfinancista']] = $financista['planmp'];
                    }
                    $index += 1;
                }

                $data[0]->datos = $result;

                $data[0]->encabezados = array(
                    array(
                        'tipo' => 'simple',
                        'inside' => 'datosinversion',
                        'emptyvalue' => '-',
                        'header' => 'ATRIBUTOS GENERALES DE LA INVERSI&Oacute;N',
                        'columnas' => array('ORGANISMO', 'ENTIDAD', 'CODIGO INV', 'INVERSI&Oacute;N', 'TIPO DE INVERSI&Oacute;N',
                            'ESTADO EN EL PLAN ACTUAL', 'FORMA DE PROPIEDAD', 'PROVINCIA', 'PROGRAMA',
                            'FECHA DE INICIO', 'FECHA DE TERMINACI&Oacute;N', /* 'NATURALEZA', */
                            'MEDIO AMBIENTE',
                            'OBJETIVO DE LA INVERSI&Oacute;N', 'GRUPO OBRA', 'SECTOR ESTRAT&Eacute;GICO', 'EFECTO EN COMEX'),
                        'referencias' => array('organismo', 'entidad', 'codigo', 'denominacion', 'tipoinversion',
                            'estadoinversion', 'formapropiedad', 'provincia', 'programa',
                            'fechainicio', 'fechafin', /* 'naturaleza', */
                            'medioambiente',
                            'objetivo', 'grupoobra', 'sector', 'efectocomercial')
                ));
                $planMP = array(
                    'tipo' => 'simple',
                    'emptyvalue' => 0,
                    'actual' => 'actual',
                    'header' => 'PLAN (MP)',
                    'columnas' => array('PLAN (MP) - TOTAL'),
                    'referencias' => array('plantotalmp')
                );

                $data[0]->encabezados[] = $planMP;

                $financiamientosMP = array(
                    'tipo' => 'simple',
                    'emptyvalue' => 0,
                    'actual' => 'actual',
                    'header' => 'FINANCIAMIENTOS (MP)',
                    'columnas' => array(),
                    'referencias' => array()
                );

                foreach ($quienfinancia as $financia) {
                    $financiamientosMP['columnas'][] = '' . $financia['denominacion'] . ' (MP)';
                    $financiamientosMP['referencias'][] = 'financmp' . $financia['idfinancista'];
                }

                $data[0]->encabezados[] = $financiamientosMP;

                $data['titulo'] = 'MFP';
                $data['subsistema'] = 'inversiones';
                break;
            //MINCEX
            case 12:
                $data = self::reporteMincex($params);
                break;

            case 11:
                //Construccion y montaje por constructor
                $data = self::getDatosRepConsMontPorConst($params, $org, $mostrarinv, $ent);
                break;
            case 15:
                //Construccion y montaje
                $data = self::getDatosRepConsMont($params, $org, $mostrarinv, $ent);
                break;
            case 16:
                //Inversion - Acreedor
                $data = self::getDatosRepInversionAcreedor($org, $params, $ent, $mon);
                break;
            case 17:
                // Acreedor -  Inversion
                $data = self::getDatosRepAcreedorInversion($org, $params, $ent, $mon);
                break;
            case 18:

            case 19:
                $data = self::getDatosViviendaHab($params, $org, $ent);

                break;
            case 22:
                // Maqueta
                $data = self::getDatosRepMaqueta($org, $ent, $params, $FP);
                break;
            case 1:
                // Nivel de actividad por constructor
                $data = self::getDatosNivelAct($params, $org);
                break;
            case 3:
                // Componentes
                $data = self::getDatosRepComponente($org, $ent, $params, $mostrarinv);
                break;
            case 24:
                // Equipos por organo rector
                $data = self::getDatosRepEquiposAutomotoresPlanes($org, $ent, $params);
                break;
            case 23:
                // Demanda de Equipos
                $data = self::getDatosRepDemandaEquipos($org, $ent, $mon, $nivel, $mostrarinv, $params);
                break;
            case 25:
                // Balance de Equipos
                $data = self::getDatosRepBalanceEquipos($params);
                break;

            case 20:
                //Resumen de inversion
                $data = self::getDatosReporteInversion($params, $org, $ent);
                break;
            case 26:
                // Modelo firma medio ambiente
                $data = self::getDatosReporteModeloFirmaMedioAmbiente($org, $ent, $params);
                break;
            case 27:
                // Plan total sector ambiental
                $data = self::getDatosRepPlanTotalSectorAmbiental($org, $ent, $mostrarinv, $params);
                break;
            case 28:
                // Plan provincia-organismo- sector ambiental
                $data = self::getDatosRepPlanProvinciaOrgSector($org, $ent, $provincia, $params);
                break;
        }


        return $data;
    }

    public function getReporteCuencasBahias($params) {
        //Obtener las inversiones.
        $datosinversion = DatInversion::getDatosInversiones($params);
        //Crear los encabezados
        $data[0]->encabezados = array(
            array(
                'tipo' => 'simple',
                'header' => 'ATRIBUTOS GENERALES DE LA INVERSI&Oacute;N',
                'columnas' => array('ORGANISMO', 'ENTIDAD', 'CODIGO INV', 'INVERSI&Oacute;N', 'TIPO DE INVERSI&Oacute;N',
                    'ESTADO EN EL PLAN ACTUAL', 'FORMA DE PROPIEDAD', 'PROVINCIA', 'PROGRAMA',
                    'FECHA DE INICIO', 'FECHA DE TERMINACI&Oacute;N',
                    'MEDIO AMBIENTE',
                    'OBJETIVO DE LA INVERSI&Oacute;N', 'EFECTO EN COMEX'),
                'referencias' => array('organismo', 'entidad', 'codigo', 'denominacion', 'tipoinversion',
                    'estadoinversion', 'formapropiedad', 'provincia', 'programa',
                    'fechainicio', 'fechafin',
                    'medioambiente',
                    'objetivo', 'efectocomercial')
            ),
            array(
                'tipo' => 'simple',
                'header' => 'CUENCAS',
                'columnas' => array('Total MP', 'Total MUSD'),
                'referencias' => array('planmp', 'planusd'),
                'emptyvalue' => '0.00'
            )
        );


        //Crear variables auxiliares.
        $contCuencas = 0;
        $arCuencas = array();

        $contBahias = 0;
        $arBahias = array();
        //Recorrer todas las inversiones
        foreach ($datosinversion as $key1 => $inver) {
            //Obtener las cuencas y bahias por cada inversion.
            $params['idinversion'] = $inver['idinversion'];
            //Agregar las columnas (cuencas) dinámincas;
            $cuencas = DatAmbiente::listaCuentaAux($params);
            //Recorrer las cuencas para crear las columnas
            foreach ($cuencas as $key => $value) {
                if (!in_array($value['idcuenca'], $arCuencas)) {
                    $params['idcuenca'][] = $value['idcuenca'];
                    //Pintar la columna dinámica.(cuenca)
                    $data[0]->encabezados[] = array(
                        'tipo' => 'simple',
                        'header' => $value['dato'],
                        'columnas' => array('MP', 'MUSD'),
                        'referencias' => array($value['iddatosnomenclador'] . 'mp', $value['iddatosnomenclador'] . 'usd'),
                        'emptyvalue' => '0.00',
                    );
                    $arCuencas[$contCuencas] = $value['idcuenca'];
                    $contCuencas++;
                }
            }
            //LLenar los datos de CUENCAS.
            $params['tipoMedioAmb'] = 'Cuenca';
            //Obtener los valores del  tipo de medioambiente en este caso Cuenca.
            $valorescuenca = DatAmbiente::cargarPresMedioAmbientePlan($params);
            if ($valorescuenca[0]['idmoneda'] === $params['monedausd']) {
                $datosinversion[$key1]['planusd'] = $valorescuenca[0]['valor'];
                $datosinversion[$key1]['planmp'] = $valorescuenca[1]['valor'];
            } else {
                $datosinversion[$key1]['planmp'] = $valorescuenca[0]['valor'];
                $datosinversion[$key1]['planusd'] = $valorescuenca[1]['valor'];
            }
            //LLenar los datos de las cuencas dinamicas.
            $cuencasDatos = DatAmbiente::cargarCuencas($params);
            foreach ($cuencasDatos as $k => $v) {
                if ($v['idmoneda'] == $params['monedausd']) {
                    $datosinversion[$key1][$v['iddatosnomenclador'] . 'usd'] = $v['valor'];
                }
                if ($v['idmoneda'] == $params['monedamp']) {
                    $datosinversion[$key1][$v['iddatosnomenclador'] . 'mp'] = $v['valor'];
                }
            }
            //Agregar las columnas (bahias) dinámincas;
            $bahias = DatAmbiente::listaBahiasAux($params);
            foreach ($bahias as $key2 => $value2) {
                if (!in_array($value2['idbahia'], $arBahias)) {
                    $params['idbahia'][] = $value2['idbahia'];
                    //Pintar la columna Bahia.
                    $data[0]->encabezados[] = array(
                        'tipo' => 'simple',
                        'header' => 'BAH&Iacute;AS',
                        'columnas' => array('Total MP', 'Total MUSD'),
                        'referencias' => array('totalAccionesCUP', 'totalAccionesUSD'),
                        'emptyvalue' => '0.00'
                    );
                    //Pintar la columna dinámica.(bahias)
                    $data[0]->encabezados[] = array(
                        'tipo' => 'simple',
                        'header' => $value2['dato'],
                        'columnas' => array('MP', 'MUSD'),
                        'referencias' => array($value2['iddatosnomenclador'] . 'mp', $value2['iddatosnomenclador'] . 'usd'),
                        'emptyvalue' => '0.00',
                    );
                    $arBahias[$contBahias] = $value2['idcuenca'];
                    $contBahias++;
                }
            }
            //LLenar los datos de Bahias.
            $params['tipoMedioAmb'] = 'Bahía';
            //Obtener los valores del  tipo de medioambiente en este caso Cuenca.
            $valoresbahia = DatAmbiente::cargarPresMedioAmbientePlan($params);
            if ($valoresbahia[0]['idmoneda'] === $params['monedausd']) {
                $datosinversion[$key1]['totalAccionesUSD'] = $valoresbahia[0]['valor'];
                $datosinversion[$key1]['totalAccionesCUP'] = $valoresbahia[1]['valor'];
            } else {
                $datosinversion[$key1]['totalAccionesCUP'] = $valoresbahia[0]['valor'];
                $datosinversion[$key1]['totalAccionesUSD'] = $valoresbahia[1]['valor'];
            }
            //LLenar los datos de las cuencas dinamicas.
            $bahiasDatos = DatAmbiente::cargarBahias($params);
            foreach ($bahiasDatos as $k => $v) {
                if ($v['idmoneda'] == $params['monedausd']) {
                    $datosinversion[$key1][$v['iddatosnomenclador'] . 'usd'] = $v['valor'];
                }
                if ($v['idmoneda'] == $params['monedamp']) {
                    $datosinversion[$key1][$v['iddatosnomenclador'] . 'mp'] = $v['valor'];
                }
            }
        }
        //Crear la columna Observación.
        $data[0]->encabezados[] = array(
            'tipo' => 'simple',
            'header' => '',
            'columnas' => array('OBSERVACIONES DE LA INVERSI&Oacute;N'),
            'referencias' => array('observaciones'),
            'emptyvalue' => '',
        );
        //Configurar reporte.
        $data[0]->datos = $datosinversion;
        $data[0]->tipo = 'multiheader';
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'CUENCAS Y BAHIAS';
        //Devover los resultados.
        return $data;
    }

    public function reporteAcciones($params, $org, $ent) {
        $params['inversionestipoMedioAmb'] = 'Acción';
        $datosinversion = DatInversion::getDatosInversiones($params);
        $data[0]->tipo = 'multiheader';
        $data[0]->datos = $datosinversion;
        $data[0]->encabezados = array(
            array(
                'tipo' => 'simple',
                'header' => 'ATRIBUTOS GENERALES DE LA INVERSI&Oacute;N',
                'columnas' => array('ORGANISMO', 'ENTIDAD', 'CODIGO INV', 'INVERSI&Oacute;N', 'TIPO DE INVERSI&Oacute;N',
                    'ESTADO EN EL PLAN ACTUAL', 'FORMA DE PROPIEDAD', 'PROVINCIA', 'PROGRAMA',
                    'FECHA DE INICIO', 'FECHA DE TERMINACI&Oacute;N', 'MEDIO AMBIENTE',
                    'OBJETIVO DE LA INVERSI&Oacute;N', 'EFECTO EN COMEX'),
                'referencias' => array('organismo', 'entidad', 'codigo', 'denominacion', 'tipoinversion',
                    'estadoinversion', 'formapropiedad', 'provincia', 'programa',
                    'fechainicio', 'fechafin', 'medioambiente',
                    'objetivo', 'efectocomercial')
            ),
            array(
                'tipo' => 'simple',
                'header' => 'TOTAL MEDIO AMBIENTE',
                'columnas' => array('MP', 'MUSD'),
                'referencias' => array('planCUP', 'planUSD'),
                'emptyvalue' => '0.00',
            ),
            array(
                'tipo' => 'simple',
                'header' => 'TOTAL ACCIONES',
                'columnas' => array('MP', 'MUSD'),
                'referencias' => array('totalAccionesCUP', 'totalAccionesUSD'),
                'emptyvalue' => '0.00',
            )
        );

        $accionesPintadas = array();
        $contSect = 0;

        foreach ($datosinversion as $key1 => $value1) {
            $params['idinversion'] = $value1['idinversion'];
            $acciones = DatAmbiente::listarAccionesAux($params);
            $idacciones = Array();
            $datosinversion[$key1]['observacion'] = $value1['observaciones'];
            foreach ($acciones as $key => $value) {
                if (!in_array($value['idaccion'], $accionesPintadas)) {
                    $params['idaccion'][] = $value['idaccion'];
                    $data[0]->encabezados[] = array(
                        'tipo' => 'simple',
                        'header' => $value['dato'],
                        'columnas' => array('MP', 'MUSD'),
                        'referencias' => array($value['iddatosnomenclador'] . 'CUP', $value['iddatosnomenclador'] . 'USD'),
                        'emptyvalue' => '0.00',
                    );
                    $accionesPintadas[$contSect] = $value['idsector'];
                    $contSect++;
                }
            }

            $valores = DatAmbiente::cargarPresMedioAmbientePlan($params);
            //pre_r($valores);die;
            foreach ($valores as $valor) {
                $datosinversion[$key1]['plan' . $valor['codigoiso']] = $valor['valor'];
            }

            $params['tipoMedioAmb'] = 'Acción';
            $valores = DatAmbiente::cargarPresMedioAmbientePlan($params);
            foreach ($valores as $valor) {
                $datosinversion[$key1]['totalAcciones' . $valor['codigoiso']] = $valor['valor'];
            }

            $sectoresDatos = DatAmbiente::cargarDatosAcciones($params);
            foreach ($sectoresDatos as $k => $v) {
                $datosinversion[$key1][$v['iddatosnomenclador'] . $v['codigoiso']] = $v['valor'];
            }
        }

        $data[0]->encabezados[] = array(
            'tipo' => 'simple',
            'header' => '',
            'columnas' => array('OBSERVACIONES DE LA INVERSI&Oacute;N'),
            'referencias' => array('observaciones')
        );

        $data[0]->datos = $datosinversion;
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'ACCIONES';
        return $data;
    }

    public function reporteSectoresAmbientales($params, $org, $ent) {
        $datosinversion = DatInversion::getDatosInversiones($params);

        $data[0]->tipo = 'multiheader';
        $data[0]->encabezados = array(
            array(
                'tipo' => 'simple',
                'emptyvalue' => '-',
                'header' => 'ATRIBUTOS GENERALES DE LA INVERSI&Oacute;N',
                'columnas' => array('ORGANISMO', 'ENTIDAD', 'CODIGO INV', 'INVERSI&Oacute;N', 'TIPO DE INVERSI&Oacute;N',
                    'ESTADO EN EL PLAN ACTUAL', 'FORMA DE PROPIEDAD', 'PROVINCIA', 'PROGRAMA',
                    'FECHA DE INICIO', 'FECHA DE TERMINACI&Oacute;N', /* 'NATURALEZA', */
                    'MEDIO AMBIENTE',
                    'OBJETIVO DE LA INVERSI&Oacute;N', 'EFECTO EN COMEX'),
                'referencias' => array('organismo', 'entidad', 'codigo', 'denominacion', 'tipoinversion',
                    'estadoinversion', 'formapropiedad', 'provincia', 'programa',
                    'fechainicio', 'fechafin', /* 'naturaleza', */
                    'medioambiente',
                    'objetivo', 'efectocomercial')
            ),
            array(
                'tipo' => 'simple',
                'emptyvalue' => '-',
                'header' => 'PLAN DE INVERSIONES',
                'columnas' => array('MP', 'MUSD'),
                'referencias' => array('planmp', 'planusd')
            ), array(
                'tipo' => 'simple',
                'header' => 'OBSERVACIONES DE LA INVERSI&Oacute;N',
                'columnas' => array('OBSERVACIONES DE LA INVERSI&Oacute;N'),
                'referencias' => array('observacion')
            )
        );

        $sectoresPintados = array();
        $contSect = 0;
        foreach ($datosinversion as $key1 => $value1) {
            $params['idinversion'] = $value1['idinversion'];
            $sectores = DatAmbiente::listarSectoresAux($params);
            $idsectores = Array();
            $datosinversion[$key1]['observacion'] = $value1['observaciones'];
            foreach ($sectores as $key => $value) {
                if (!in_array($value['idsector'], $sectoresPintados)) {
                    $params['idsector'][] = $value['idsector'];
                    $data[0]->encabezados[] = array(
                        'tipo' => 'simple',
                        'header' => $value['dato'],
                        'columnas' => array('MP', 'MUSD'),
                        'referencias' => array($value['iddatosnomenclador'] . 'mp', $value['iddatosnomenclador'] . 'usd')
                    );
                    $sectoresPintados[$contSect] = $value['idsector'];
                    $contSect++;
                }
            }

            $valores = DatAmbiente::cargarPresPlan($params);

            if ($valores[0]['idmoneda'] === $params['monedausd']) {
                $datosinversion[$key1]['planusd'] = $valores[0]['valor'];
                $datosinversion[$key1]['planmp'] = $valores[1]['valor'];
            } else {
                $datosinversion[$key1]['planusd'] = $valores[1]['valor'];
                $datosinversion[$key1]['planmp'] = $valores[0]['valor'];
            }

            $sectoresDatos = DatAmbiente::cargarDatosSectores($params);

            foreach ($sectoresDatos as $k => $v) {
                if ($v['idmoneda'] == $params['monedausd']) {
                    $datosinversion[$key1][$v['iddatosnomenclador'] . 'usd'] = $v['valor'];
                }
                if ($v['idmoneda'] == $params['monedamp']) {
                    $datosinversion[$key1][$v['iddatosnomenclador'] . 'mp'] = $v['valor'];
                }
            }
        }

        $data[0]->datos = $datosinversion;
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'SECTORES AMBIENTALES';
        return $data;
    }

    public function getEntidades($org, $ent) {
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

    public function getDatosRepPlanProvinciaOrgSector($org, $ent, $provincia, $params) {

        $arrcolumnas[] = 'Provincia/Organismo/Sector ambiental/Entidad/Inversi&oacute;n';
        $arrcolumnas[] = 'MP';
        $arrcolumnas[] = 'USD';

        $arrreferencias[] = 'sectores';
        $arrreferencias[] = 'monedamp';
        $arrreferencias[] = 'monedausd';

        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            $org = self::cargarOrganismos();
        }

        $idestructuras = array();
        foreach ($org as $pos => $value) {//organismos
            $idest = array();
            $idest = self::buscarEntidades($value);

            if ($ent[0] != null) {
                foreach ($idest as $key => $valor) {
                    if (in_array($valor, $ent)) {
                        $idestructuras[] = array($valor);
                        $estPorOrganismo[] = $valor;
                    }
                }
                if (empty($idestructuras)) {
                    $idestructuras[] = $idest;
                    $estPorOrganismo = $idest;
                }
            } else {
                $idestructuras[] = $idest;
                $estPorOrganismo = $idest;
            }

            $idestructuras[] = array($value);
            $estPorTodosOrganismo[$pos] = array_merge(array($value), $estPorOrganismo);
        }

        $todas_entidades = array();
        foreach ($idestructuras as $value) {
            $todas_entidades = array_merge($todas_entidades, $value);
        }

        /* $ids = array();

          foreach ($todas_entidades as $p => $dato) {
          if (!in_array($dato, $ids)) {
          $ids[] = $dato;
          }
          } */
        /* print_r(implode(",", $ids));
          die; */

        $params['todas_entidades'] = implode(",", $todas_entidades);
        $data = array();
        $posicion = 0;
        //Buscar todos los totales por Provincia
        $totalizarSector = 0;
        $totalizarOrganismo = 1;
        $totalizarEntidad = 0;
        $totalProvincia = DatMedioambglobal::totalPlanProvinciaOrgSector($params, $totalizarOrganismo, $totalizarSector, $totalizarEntidad);
        foreach ($totalProvincia as $k => $provinia) {
            $data[$posicion]['sectores'] = $provinia['provincia'];
            $data[$posicion]['monedamp'] = $provinia['valormp'];
            $data[$posicion]['monedausd'] = $provinia['valorusd'];
            $data[$posicion]['negrita'] = true;
            $posicion++;

            foreach ($org as $o => $organismo) {
                $totalizarOrganismo = 1;
                $params['todas_entidades'] = implode(",", $estPorTodosOrganismo[$o]);
                $params['provincia'] = " and i.idprovincia in({$provinia['idprovincia']})";
                $totalOrganismo = DatMedioambglobal::totalSectoresAmbientalesPorOrganismos($params, $totalizarOrganismo);

                if (count($totalOrganismo) != 0) {
                    $data[$posicion]['sectores'] = "." . "." . 'Organismo: ' . $totalOrganismo[0]['denominacion'];
                    $data[$posicion]['monedamp'] = $totalOrganismo[0]['valormp'];
                    $data[$posicion]['monedausd'] = $totalOrganismo[0]['valorusd'];
                    $data[$posicion]['negrita'] = true;
                    $posicion++;

                    $totalizarSector = 1;
                    $totalizarOrganismo = 0;
                    $totalizarEntidad = 0;
                    $params['todas_entidades'] = implode(",", $estPorTodosOrganismo[$o]);
                    $params['provincia'] = " and i.idprovincia in({$provinia['idprovincia']})";
                    $totalOrgSector = DatMedioambglobal::totalPlanProvinciaOrgSector($params, $totalizarOrganismo, $totalizarSector, $totalizarEntidad);

                    foreach ($totalOrgSector as $s => $sector) {
                        $data[$posicion]['sectores'] = "." . "." . "." . $sector['denomsector'];
                        $data[$posicion]['monedamp'] = $sector['valormp'];
                        $data[$posicion]['monedausd'] = $sector['valorusd'];
                        $data[$posicion]['color'] = '#CCFFCC';
                        $posicion++;

                        $totalizarOrganismo = 0;
                        $totalizarSector = 0;
                        $totalizarEntidad = 1;
                        $params['todas_entidades'] = implode(",", $estPorTodosOrganismo[$o]);
                        $params['provincia'] = " and i.idprovincia in({$provinia['idprovincia']}) and ds.idsector = {$sector['idsector']}";
                        $totalOrgSectorEntidad = DatMedioambglobal::totalPlanProvinciaOrgSector($params, $totalizarOrganismo, $totalizarSector, $totalizarEntidad);
                        foreach ($totalOrgSectorEntidad as $k => $entidad) {

                            $data[$posicion]['sectores'] = "." . "." . "." . "." . '(' . $entidad['codigoestructura'] . ') ' . $entidad['denomestructura'];
                            $data[$posicion]['monedamp'] = $entidad['valormp'];
                            $data[$posicion]['monedausd'] = $entidad['valorusd'];

                            $posicion++;

                            $totalizarOrganismo = 0;
                            $totalizarSector = 0;
                            $totalizarEntidad = 0;
                            $params['todas_entidades'] = implode(",", $estPorTodosOrganismo[$o]);
                            $params['provincia'] = " and i.idprovincia in({$provinia['idprovincia']}) and ds.idsector = {$sector['idsector']}";
                            $totalOrgSectorEntidadInversion = DatMedioambglobal::totalPlanProvinciaOrgSector($params, $totalizarOrganismo, $totalizarSector, $totalizarEntidad);

                            foreach ($totalOrgSectorEntidadInversion as $k => $inv) {

                                if ($entidad['estructura'] == $inv['estructura']) {
                                    $data[$posicion]['sectores'] = "." . "." . "." . "." . "." . "." . "." . "." . $inv['inversion'];
                                    $data[$posicion]['monedamp'] = $inv['valormp'];
                                    $data[$posicion]['monedausd'] = $inv['valorusd'];
                                    $posicion++;
                                }
                            }
                        }
                    }
                }
            }
        }


        //$totalSectores = DatMedioambglobal::totalPlanProvinciaOrgSector($params, $totalizarOrganismo);


        if ($params['filtros'][0]['cbxOrganismo'] != "") {
            $nombreOrganismo = $params['filtros'][0]['cbxOrganismo'];
        } else {
            $nombreOrganismo = "Direcci&oacute;n de Inversiones";
        }

        $result[0]->tipo = 'estandar';
        $result[0]->datos = $data;
        $result[0]->columnas = $arrcolumnas;
        $result[0]->referencias = $arrreferencias;
        $result[0]->emptyvalue = '';
        $result['subsistema'] = 'inversiones';
        $result['titulo'] = 'Plan ' . $params['ejercicio'] . ' de Inversiones Vinculadas a la Protecci&oacute;n del Medio Ambiente ' . $nombreOrganismo;
        //pre_r($result);die;
        return $result;
    }

    public function getDatosRepPlanTotalSectorAmbiental($org, $ent, $mostrarinv, $params) {

        $arrcolumnas[] = 'Organismo/Sector ambiental';
        $arrcolumnas[] = 'MP';
        $arrcolumnas[] = 'USD';

        $arrreferencias[] = 'sectoress';
        $arrreferencias[] = 'monedampp';
        $arrreferencias[] = 'monedausdd';


        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            $org = self::cargarOrganismos();
        }


        //formar el arreglo de organos y entidades hijas como uno solo
        /* foreach ($org as $pos => $value) {//organismos
          $idestructuras = array();
          $idest[] = self::buscarEntidades($value);
          $idest[] = array($value);
          }

          $todas_entidades = array();
          foreach ($idest as $value) {
          $todas_entidades = array_merge($todas_entidades, $value);
          } */
        $todas_entidades = self::getEntidades($org, $ent);
        //print_r($todas_entidades);die;

        $params['todas_entidades'] = implode(",", $todas_entidades);
        if ($mostrarinv == 0) {
            $totalizarOrganismo = 1;
            $params['provincia'] = " ";
            $totalSectores = DatMedioambglobal::totalSectoresAmbientalesPorOrganismos($params, $totalizarOrganismo);
            foreach ($totalSectores as $key => $org) {
                $data[$key]['sectoress'] = $org['denominacion'];
                $data[$key]['monedampp'] = $org['valormp'];
                $data[$key]['monedausdd'] = $org['valorusd'];
                $data[$key]['negrita'] = true;
            }
        } else {
            $posicion = 0;
            foreach ($org as $key => $or) {
                $totalizarOrganismo = 1;
                $params['provincia'] = " ";
                $totalSectores = DatMedioambglobal::totalSectoresAmbientalesPorOrganismos($params, $totalizarOrganismo);
                foreach ($totalSectores as $key => $sector) {
                    if ($or == $sector['estorganismo']) {
                        $data[$posicion]['sectoress'] = $sector['denominacion'];
                        $data[$posicion]['monedampp'] = $sector['valormp'];
                        $data[$posicion]['monedausdd'] = $sector['valorusd'];
                        $data[$posicion]['negrita'] = true;
                        $posicion++;
                        break;
                    }
                }
                //print_r($data);die;

                $totalizarOrganismo = 0;
                $params['provincia'] = " ";
                $totalSectores = DatMedioambglobal::totalSectoresAmbientalesPorOrganismos($params, $totalizarOrganismo);
                foreach ($totalSectores as $key => $sector) {
                    if ($or == $sector['estorganismo']) {
                        $data[$posicion]['sectoress'] = $sector['denomsector'];
                        $data[$posicion]['monedampp'] = $sector['valormp'];
                        $data[$posicion]['monedausdd'] = $sector['valorusd'];
                        $posicion++;
                    }
                }
            }
        }

        if ($params['filtros'][0]['cbxOrganismo'] != "") {
            $nombreOrganismo = $params['filtros'][0]['cbxOrganismo'];
        } else {
            $nombreOrganismo = "Direcci&oacute;n de Inversiones";
        }

        $result[0]->tipo = 'estandar';
        $result[0]->datos = $data;
        $result[0]->columnas = $arrcolumnas;
        $result[0]->referencias = $arrreferencias;
        $result[0]->emptyvalue = '';
        $result['subsistema'] = 'inversiones';
        $result['titulo'] = 'Plan Total Sector Ambiental    ' . $nombreOrganismo;
        //pre_r($result);die;
        return $result;
    }

    public function getDatosReporteModeloFirmaMedioAmbiente($org, $ent, $params) {

        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            $org = self::cargarOrganismos();
        }


        //formar el arreglo de organos y entidades hijas como uno solo
        /* foreach ($org as $pos => $value) {//organismos
          $idestructuras = array();
          $idest[] = self::buscarEntidades($value);
          $idest[] = array($value);
          }

          $todas_entidades = array();
          foreach ($idest as $value) {
          $todas_entidades = array_merge($todas_entidades, $value);
          } */
        $entidades = self::getEntidades($org, $ent);

        $params['entidadesaux'] = implode(",", $entidades);


        $totalPlanInversiones = DatMedioambglobal::totalPlanEjercicioInversiones($params);
        $totalSectores = DatMedioambglobal::totalSectoresAmbientales($params);
        $listadoCuenbahAcc = DatMedioambglobal::listarCuencasBahiasAcciones($params);
        $listadoSectores = DatMedioambglobal::listarTodosSectoresPorOrganismo($params);


        $contador = 0;
        $arrcolumnas[] = '';
        $arrcolumnas[] = 'MP';
        $arrcolumnas[] = 'USD';

        $arrreferencias[] = 'sectores';
        $arrreferencias[] = 'monedamp';
        $arrreferencias[] = 'monedausd';

        $data[$contador]['sectores'] = '% DEL MEDIO AMBIENTE / PLAN ' . $params['ejercicio'];
        $data[$contador]['monedamp'] = ($totalSectores[0]['valormp'] * 100) / $totalPlanInversiones[0]['planmp'] . "%";
        $data[$contador]['monedausd'] = ($totalSectores[0]['valorusd'] * 100) / $totalPlanInversiones[0]['planusd'] . "%";
        $data[$contador]['negrita'] = true;
        $contador++;
        $data[$contador]['sectores'] = 'TOTAL DEL PLAN ' . $params['ejercicio'] . ' DE INVERSIONES';
        $data[$contador]['monedamp'] = $totalPlanInversiones[0]['planmp'];
        $data[$contador]['monedausd'] = $totalPlanInversiones[0]['planusd'];
        $data[$contador]['negrita'] = true;
        $contador++;
        $data[$contador]['sectores'] = 'TOTAL DE LOS SECTORES AMBIENTALES';
        $data[$contador]['monedamp'] = $totalSectores[0]['valormp']; //number_format($totalSectores[0]['valormp'],'1',',','.');
        $data[$contador]['monedausd'] = $totalSectores[0]['valorusd']; //number_format($totalSectores[0]['valorusd'],'1',',','.');
        $data[$contador]['negrita'] = true;

        $contador++;
        foreach ($listadoSectores as $sectores) {
            $data[$contador]['sectores'] = $sectores['denominacion'];
            $data[$contador]['monedamp'] = $sectores['valormp'];
            $data[$contador]['monedausd'] = $sectores['valorusd'];
            $data[$contador]['negrita'] = true;
            $contador++;
            foreach ($listadoCuenbahAcc as $valores) {
                if ($sectores['iddatosnomenclador'] == $valores['iddatosnomenclador']) {
                    $data[$contador]['sectores'] = "De ello: " . $valores['denominacion'];
                    $data[$contador]['monedamp'] = $valores['valormp'];
                    $data[$contador]['monedausd'] = $valores['valorusd'];
                    $contador++;
                }
            }
        }

        if ($params['filtros'][0]['cbxOrganismo'] != "") {
            $nombreOrganismo = $params['filtros'][0]['cbxOrganismo'];
        } else {
            $nombreOrganismo = "Direcci&oacute;n de Inversiones";
        }

        $resultotro[0]->tipo = 'estandar';
        $resultotro[0]->datos = $data;
        $resultotro[0]->columnas = $arrcolumnas;
        $resultotro[0]->referencias = $arrreferencias;
        $resultotro[0]->emptyvalue = '';
        $resultotro['subsistema'] = 'inversiones';
        $resultotro['titulo'] = 'Indicadores Vinculados al Medio Ambiente      ' . 'Entidades: ' . $nombreOrganismo;
        return $resultotro;
    }

    public function getDatosReporteInversionMUSD($params) {
        $idEntidades = array();
        $idEstr = array();
        foreach ($params['filtros'] as $filtro) {

            if ($filtro['name'] == 'cbxOrganismo') {
                $ids = $filtro['id'];

                $arrayDeOrganismos = explode(',', $filtro['cbxOrganismo']);

                $model = new InversionesModel();

                if (count($params['filtros'][4]['id']) == 0) {
                    foreach ($ids as $key => $ident) {
                        $hijas = $model->cargarEntHijas($ident, $arrayDeOrganismos[$key]); //ENTIDADES HIJAS
                        if (count($hijas) > 0) {
                            $idEntidades = array_merge($idEntidades, $hijas); //toidas las entidades coninciden
                        } else {
                            $idEntidades[count($idEntidades)]['identidad'] = $ident; //toidas las entidades coninciden
                            $idEntidades[count($idEntidades) - 1]['entidad'] = $arrayDeOrganismos[$key]; //toidas las entidades coninciden
                        }
                    }

                    foreach ($idEntidades as $key => $valu) {
                        $idEstr[] = $valu['identidad']; //todas las entidades del organismo
                    }
                } else {
                    $IDEntidades = explode(",", $params['filtros'][4]['id']);
                    $idEstr = array();
                    foreach ($ids as $key => $ident) {
                        $idSeleccionadas = $model->dadoArrayEntidades($ident, $arrayDeOrganismos[$key], $IDEntidades); //ENTIDADES HIJAS seleccionadas
                        if (count($idSeleccionadas) > 0) {
                            $idEntidades = $idSeleccionadas;
                            foreach ($idEntidades as $key => $valu) {
                                $idEstr[] = $valu['identidad']; //todas las entidades del organismo
                            }
                        }
                    }
                }

                $arrEntidades = implode(",", $idEstr);
                $inversionesXentidad = DatInversion::listarDatosReporteResumenInverMUSD($params['idejercicio'], $arrEntidades, $params['idmoneda']);


                $totalPlan = 0;
                $totalPlanXEntidad = array();
                $totalComoFinancia = 0;
                $totalComoFinanciaXEntidad = array();
                $totalCredito = 0;
                $totalCreditoXEntidad = array();
                $totalContado = 0;
                $totalContadoXEntidad = array();
                $totalErogacion = 0;
                $totalErogacionXEntidad = array();
                $totalContratacionExterna = 0;
                $totalContratacionExternaXEntidad = array();
                $totalQuienfinancia = 0;
                $totalQuienfinanciaXEntidad = array();

                $quienPintados = array();
                $idFinancistas = array();
                foreach ($inversionesXentidad as $valIn) {
                    $quienFinancia = DatInversion::listarDenomFinancista($valIn['idinversion'], $params['idmoneda'], $arrEntidades);
                    foreach ($quienFinancia as $key => $quien) {
                        if (!in_array($quien['denominacion'], $quienPintados)) {
                            $quienPintados[] = $quien['denominacion'];
                            $idFinancistas[] = $quien['idfinancista'];
                        }
                    }
                    $totalPlan += $valIn['plan'];
                    $totalPlanXEntidad[$valIn['idestructuracomun']] += $valIn['plan'];
                    $totalComoFinancia += $valIn['totalcomosefinancia'];
                    $totalComoFinanciaXEntidad[$valIn['idestructuracomun']] += $valIn['totalcomosefinancia'];
                    $totalCredito += $valIn['credito'];
                    $totalCreditoXEntidad[$valIn['idestructuracomun']] += $valIn['credito'];
                    $totalContado += $valIn['contado'];
                    $totalContadoXEntidad[$valIn['idestructuracomun']] += $valIn['contado'];
                    $totalErogacion += $valIn['erogacionliquido'];
                    $totalErogacionXEntidad[$valIn['idestructuracomun']] += $valIn['erogacionliquido'];
                    $totalContratacionExterna += $valIn['contratacionexterna'];
                    $totalContratacionExternaXEntidad[$valIn['idestructuracomun']] += $valIn['contratacionexterna'];
                    $totalQuienfinancia += $valIn['totalquienfinancia'];
                    $totalQuienfinanciaXEntidad[$valIn['idestructuracomun']] += $valIn['totalquienfinancia'];
                }


                $datos = array();
                $datos[0]['denominacion'] = 'Total';
                $datos[0]['negrita'] = true;
                $datos[0]['plan'] = $totalPlan;
                $datos[0]['totalcomosefinancia'] = $totalComoFinancia;
                $datos[0]['credito'] = $totalCredito;
                $datos[0]['contado'] = $totalContado;
                $datos[0]['totalquienfinancia'] = $totalQuienfinancia;
                foreach ($quienPintados as $quienP) {
                    $totalQuienXfinancista = DatInversion::listarTotalQuienXfinancista($arrEntidades, $params['idmoneda'], $params['idejercicio']);
                    $valor = 0;
                    foreach ($totalQuienXfinancista as $totalXQuien) {
                        if ($quienP == $totalXQuien['denominacion']) {
                            $valor = $totalXQuien['totalquien'];
                            break;
                        }
                    }
                    $datos[0][$quienP] = $valor;
                }
                $datos[0]['erogacionliquido'] = $totalErogacio;
                $datos[0]['contratacionexterna'] = $totalContratacionExterna;


                $index = 1;

                foreach ($arrayDeOrganismos as $k => $value) {
                    $datos[$index]['denominacion'] = $value;
                    $datos[$index]['negrita'] = true;
                    $datos[$index]['plan'] = $totalPlanXEntidad[$ids[$k]];
                    $datos[$index]['totalcomosefinancia'] = $totalComoFinanciaXEntidad[$ids[$k]];
                    $datos[$index]['credito'] = $totalCreditoXEntidad[$ids[$k]];
                    $datos[$index]['contado'] = $totalContadoXEntidad[$ids[$k]];
                    $datos[$index]['totalquienfinancia'] = $totalQuienfinanciaXEntidad[$ids[$k]];
                    foreach ($quienPintados as $quienP) {
                        $totalQuienXfinancista = DatInversion::listarTotalQuienXfinancista($ids[$k], $params['idmoneda'], $params['idejercicio']);
                        $valor = 0;
                        foreach ($totalQuienXfinancista as $totalXQuien) {
                            if ($quienP == $totalXQuien['denominacion']) {
                                $valor = $totalXQuien['totalquien'];
                                break;
                            }
                        }
                        $datos[$index][$quienP] = $valor;
                    }
                    $datos[$index]['erogacionliquido'] = $totalErogacionXEntidad[$ids[$k]];
                    $datos[$index]['contratacionexterna'] = $totalContratacionExternaXEntidad[$ids[$k]];

                    $index += 1;

                    foreach ($inversionesXentidad as $key => $val) {
                        if ($ids[$k] == $val['idestructuracomun']) {
                            $datos[] = $val;
                            foreach ($idFinancistas as $quienP) {
                                $valorquienFinancia = DatInversion::listarValorPlanPorFinancista($val['idinversion'], $params['idmoneda'], $params['idejercicio']);

                                if (count($valorquienFinancia) > 0) {
                                    foreach ($valorquienFinancia as $quien) {
                                        $valor = 0;
                                        if ($quienP == $quien['idfinancista']) {
                                            $valor = $quien['valor'];
                                            break;
                                        }
                                    }
                                    $datos[$index][$quienP] = $valor;
                                } else {
                                    $datos[$index][$quienP] = 0;
                                }
                            }
                            $index += 1;
                        }
                    }
                    // print_r($idEntidades);die;
                    foreach ($idEntidades as $pos => $value) {
                        if ($value['identidad'] != $ids[$k]) {
                            $datos[$index]['denominacion'] = $value['entidad'];
                            $datos[$index]['negrita'] = true;
                            $datos[$index]['plan'] = $totalPlanXEntidad[$value['identidad']];
                            $datos[$index]['totalcomosefinancia'] = $totalComoFinanciaXEntidad[$value['identidad']];
                            $datos[$index]['credito'] = $totalCreditoXEntidad[$value['identidad']];
                            $datos[$index]['contado'] = $totalContadoXEntidad[$value['identidad']];
                            $datos[$index]['totalquienfinancia'] = $totalQuienfinanciaXEntidad[$value['identidad']];
                            foreach ($quienPintados as $quienP) {
                                $totalQuienXfinancista = DatInversion::listarTotalQuienXfinancista($value['identidad'], $params['idmoneda'], $params['idejercicio']);
                                $valor = 0;
                                foreach ($totalQuienXfinancista as $totalXQuien) {
                                    if ($quienP == $totalXQuien['denominacion']) {
                                        $valor = $totalXQuien['totalquien'];
                                        break;
                                    }
                                }
                                $datos[$index][$quienP] = $valor;
                            }
                            $datos[$index]['erogacionliquido'] = $totalErogacionXEntidad[$value['identidad']];
                            $datos[$index]['contratacionexterna'] = $totalContratacionExternaXEntidad[$value['identidad']];
                            $index += 1;

                            foreach ($inversionesXentidad as $key => $val) {
                                if ($value['identidad'] == $val['idestructuracomun']) {
                                    $datos[] = $val;
                                    foreach ($idFinancistas as $quienP) {
                                        $valorquienFinancia = DatInversion::listarValorPlanPorFinancista($val['idinversion'], $params['idmoneda'], $params['idejercicio']);

                                        if (count($valorquienFinancia) > 0) {
                                            foreach ($valorquienFinancia as $quien) {
                                                $valor = 0;
                                                if ($quienP == $quien['idfinancista']) {
                                                    $valor = $quien['valor'];
                                                    break;
                                                }
                                            }
                                            $datos[$index][$quienP] = $valor;
                                        } else {
                                            $datos[$index][$quienP] = 0;
                                        }
                                    }
                                    $index += 1;
                                }
                            }
                        }
                    }
                }

                //$datos = array_merge($datos,$inversionesXentidad);


                $data[0]->tipo = 'estandar';
                $data[0]->datos = $datos;
                $data[0]->columnas = array('OACE/Entidad/Inversiones', 'Plan(Incluye plan de preparaci&oacute;n)',
                    'Total C&oacute;mo se financia', 'Cr&eacute;dito', 'Contado', 'Total Qui&eacute;n financia');
                $data[0]->referencias = array('denominacion', 'plan', 'totalcomosefinancia', 'credito', 'contado', 'totalquienfinancia');
                foreach ($quienPintados as $key => $quien) {
                    $data[0]->columnas[] = $quien;
                    $data[0]->referencias[] = $quien;
                }
                $data[0]->columnas[] = 'Erogaci&oacute;n a l&iacute;quido de la importaci&oacute;n';
                $data[0]->referencias[] = 'erogacionliquido';
                $data[0]->columnas[] = 'Contrataci&oacute;n externa';
                $data[0]->referencias[] = 'contratacionexterna';
                $data[0]->emptyvalue = 0;
                // $data['observaciones'] = 'jbasfkjasgfkjgasg gasghkjasghkas gask gklas glkhaslgkh as';
                $data['subsistema'] = 'inversiones';
                $data['hora'] = $hoy = date("H:i:s");
            }
        }
        return $data;
    }

    private static function toUnidimencional($array, $indice) {
        $arrayResult = array();
        foreach ($array as $values) {
            array_push($arrayResult, $values[$indice]);
        }
        return $arrayResult;
    }

    /* public function getDatosReporteInversion($params, $org, $ent) {
      $idEntidades = array();
      $idEstr = array();
      foreach ($params['filtros'] as $filtro) {

      if ($filtro['name'] == 'cbxOrganismo') {
      $ids = $filtro['id'];
      $arrayDeOrganismos = explode(',', $filtro['cbxOrganismo']);
      $model = new InversionesModel();
      //                if (count($params['filtros'][4]['id']) == 0) {
      //                    foreach ($ids as $key => $ident) {
      //                        $hijas = $model->cargarEntHijas($ident, $arrayDeOrganismos[$key]); //ENTIDADES HIJAS
      //pre_r($hijas);die;
      //                        if (count($hijas) > 0) {
      //                            $idEntidades = array_merge($idEntidades, $hijas); //toidas las entidades coninciden
      //                        } else {
      //                            $idEntidades[count($idEntidades)]['identidad'] = $ident; //toidas las entidades coninciden
      //                            $idEntidades[count($idEntidades) - 1]['entidad'] = $arrayDeOrganismos[$key]; //toidas las entidades coninciden
      //                        }
      //                    }
      //
      //                    foreach ($idEntidades as $key => $valu) {
      //                        $idEstr[] = $valu['identidad']; //todas las entidades del organismo
      //                    }
      //                } else {
      //                    $IDEntidades = explode(",", $params['filtros'][4]['id']);
      //                    $idEstr = array();
      //                    foreach ($ids as $key => $ident) {
      //                        $idSeleccionadas = $model->dadoArrayEntidades($ident, $arrayDeOrganismos[$key], $IDEntidades); //ENTIDADES HIJAS seleccionadas
      //                        if (count($idSeleccionadas) > 0) {
      //                            $idEntidades = $idSeleccionadas;
      //                            foreach ($idEntidades as $key => $valu) {
      //                                $idEstr[] = $valu['identidad']; //todas las entidades del organismo
      //                            }
      //                        }
      //                    }
      //                }
      //

      $org = $filtro['id'];
      //formar el arreglo de organos en caso de que no se seleccionara ninguno
      if ($org[0] == null) {
      $org = self::cargarOrganismos();
      } else {
      $nomOrganismos = explode(',', $params['filtros'][0]['cbxOrganismo']);
      //pre_r($nomOrganismos);die;
      }


      $idestructuras = array();
      $estructuras = array();

      foreach ($org as $pos => $value) {//organismos
      $idest = array();
      //$idestructurasAux = array();
      //$estructurasAux = array();
      $idest = self::buscarEntidades($value);
      $est = self::buscarEntidadesConNombre($value);
      //pre_r($idest);pre_r('----');

      if ($ent[0] != null) {
      foreach ($idest as $key => $valor) {
      if (in_array($valor, $ent)) {
      $idestructuras[] = array($valor);
      $estructuras[] = $est[$key];
      }
      }
      if (empty($idestructuras) && empty($estructuras)) {
      $idestructuras[] = $idest;
      $estructuras = $est;
      }
      //pre_r($idestructuras);
      //pre_r($estructuras);die;
      } else {
      $idestructuras[] = $idest;
      foreach ($est as $e) {
      $estructuras[] = $e;
      }
      //$estructuras[]= $est;
      //pre_r($estructuras);print_r('--------');
      }

      $idestructuras[] = array($value);
      $estructuras[] = array('identidad' => $value, 'entidad' => $nomOrganismos[$pos]);
      //$estPorTodosOrganismo[$pos] = array_merge(array($value), $estPorOrganismo);
      }

      $todas_entidades = array();
      foreach ($idestructuras as $value) {
      $todas_entidades = array_merge($todas_entidades, $value);
      }
      //$idEstr
      //                $arrEntidades = implode(",", $idEstr);
      $arrEntidades = implode(",", $todas_entidades);
      //pre_r($arrEntidades);die;
      $inversionesXentidad = DatInversion::listarInversionesXentidad($params['idejercicio'], $arrEntidades);
      $idinversiones = self::toUnidimencional($inversionesXentidad, 'idinversion');
      $idinversiones = implode(',', $idinversiones);


      $totalPlan = 0;
      $totalPlanXEntidad = array();
      $totalComoFinancia = 0;
      $totalComoFinanciaXEntidad = array();
      $totalCredito = 0;
      $totalCreditoXEntidad = array();
      $totalContado = 0;
      $totalContadoXEntidad = array();
      $totalFondoBasico = 0;
      $totalFondoBasicoXEntidad = array();
      $totalRendimientoInver = 0;
      $totalRendimientoInverXEntidad = array();
      $totalInversInicioAno = 0;
      $totalInversInicioAnoXEntidad = array();
      $totalCuotaInversProceso = 0;
      $totalCuotaInversProcesoXEntidad = array();
      $totalQuienfinancia = 0;
      $totalQuienfinanciaXEntidad = array();
      $quienPintados = array();
      $idFinancistas = array();

      $quienFinancia = DatInversion::listarDenomFinancistaReporte($idinversiones, $params['idmoneda'], $arrEntidades);

      foreach ($quienFinancia as $key => $quien) {
      if (!in_array($quien['denominacion'], $quienPintados)) {
      $quienPintados[] = $quien['denominacion'];
      $idFinancistas[] = $quien['idfinancista'];
      }
      }

      foreach ($inversionesXentidad as $valIn) {
      $totalPlan += $valIn['plan'];
      $totalPlanXEntidad[$valIn['idestructuracomun']] += $valIn['plan'];
      $totalComoFinancia += $valIn['totalcomosefinancia'];
      $totalComoFinanciaXEntidad[$valIn['idestructuracomun']] += $valIn['totalcomosefinancia'];
      $totalCredito += $valIn['credito'];
      $totalCreditoXEntidad[$valIn['idestructuracomun']] += $valIn['credito'];
      $totalContado += $valIn['contado'];
      $totalContadoXEntidad[$valIn['idestructuracomun']] += $valIn['contado'];
      $totalFondoBasico += $valIn['fondobasico'];
      $totalFondoBasicoXEntidad[$valIn['idestructuracomun']] += $valIn['fondobasico'];
      $totalRendimientoInver += $valIn['rendinversion'];
      $totalRendimientoInverXEntidad[$valIn['idestructuracomun']] += $valIn['rendinversion'];
      $totalInversInicioAno += $valIn['inverprocpniano'];
      $totalInversInicioAnoXEntidad[$valIn['idestructuracomun']] += $valIn['inverprocpniano'];
      $totalCuotaInversProceso += $valIn['cuotainverproc'];
      $totalCuotaInversProcesoXEntidad[$valIn['idestructuracomun']] += $valIn['cuotainverproc'];
      $totalQuienfinancia += $valIn['totalquienfinancia'];
      $totalQuienfinanciaXEntidad[$valIn['idestructuracomun']] += $valIn['totalquienfinancia'];
      }



      $datos = array();
      $datos[0]['denominacion'] = 'Total OACE';
      $datos[0]['negrita'] = true;
      $datos[0]['plan'] = $totalPlan;
      $datos[0]['totalcomosefinancia'] = $totalComoFinancia;
      $datos[0]['credito'] = $totalCredito;
      $datos[0]['contado'] = $totalContado;
      $datos[0]['totalquienfinancia'] = $totalQuienfinancia;
      foreach ($quienPintados as $quienP) {
      $totalQuienXfinancista = DatInversion::listarTotalQuienXfinancista($arrEntidades, $params['idmoneda'], $params['idejercicio']);
      $valor = 0;
      foreach ($totalQuienXfinancista as $totalXQuien) {
      if ($quienP == $totalXQuien['denominacion']) {
      $valor = $totalXQuien['totalquien'];
      break;
      }
      }
      $datos[0][$quienP] = $valor;
      }
      $datos[0]['fondobasico'] = $totalFondoBasico;
      $datos[0]['rendinversion'] = $totalRendimientoInver;
      $datos[0]['inverprocpniano'] = $totalInversInicioAno;
      $datos[0]['cuotainverproc'] = $totalCuotaInversProceso;

      $index = 1;

      foreach ($arrayDeOrganismos as $k => $value) {
      $datos[$index]['denominacion'] = $value;
      $datos[$index]['negrita'] = true;
      $datos[$index]['plan'] = $totalPlanXEntidad[$ids[$k]];
      $datos[$index]['totalcomosefinancia'] = $totalComoFinanciaXEntidad[$ids[$k]];
      $datos[$index]['credito'] = $totalCreditoXEntidad[$ids[$k]];
      $datos[$index]['contado'] = $totalContadoXEntidad[$ids[$k]];
      $datos[$index]['totalquienfinancia'] = $totalQuienfinanciaXEntidad[$ids[$k]];
      foreach ($quienPintados as $quienP) {
      $totalQuienXfinancista = DatInversion::listarTotalQuienXfinancista($ids[$k], $params['idmoneda'], $params['idejercicio']);
      $valor = 0;
      foreach ($totalQuienXfinancista as $totalXQuien) {
      if ($quienP == $totalXQuien['denominacion']) {
      $valor = $totalXQuien['totalquien'];
      break;
      }
      }
      $datos[$index][$quienP] = $valor;
      }
      $datos[$index]['fondobasico'] = $totalFondoBasicoXEntidad[$ids[$k]];
      $datos[$index]['rendinversion'] = $totalRendimientoInverXEntidad[$ids[$k]];
      $datos[$index]['inverprocpniano'] = $totalInversInicioAnoXEntidad[$ids[$k]];
      $datos[$index]['cuotainverproc'] = $totalCuotaInversProcesoXEntidad[$ids[$k]];

      $index+=1;
      //pre_r($todas_entidades);
      //pre_r($ids);
      //pre_r($inversionesXentidad);die;
      foreach ($inversionesXentidad as $key => $val) {
      if ($ids[$k] == $val['idestructuracomun']) {
      $datos[] = $val;
      foreach ($idFinancistas as $quienP) {
      $valorquienFinancia = DatInversion::listarValorPlanPorFinancista($val['idinversion'], $params['idmoneda'], $params['idejercicio']);

      if (count($valorquienFinancia) > 0) {
      foreach ($valorquienFinancia as $quien) {
      $valor = 0;
      if ($quienP == $quien['idfinancista']) {
      $valor = $quien['valor'];
      break;
      }
      }
      $datos[$index][$quienP] = $valor;
      } else {
      $datos[$index][$quienP] = 0;
      }
      }
      $index+=1;
      }
      }
      //print_r($ids);
      //print_r($estructuras);die;
      foreach ($estructuras as $pos => $value) {
      if ($value['identidad'] != $ids[$k]) {
      $datos[$index]['denominacion'] = $value['entidad'];
      $datos[$index]['negrita'] = true;
      $datos[$index]['plan'] = $totalPlanXEntidad[$value['identidad']];
      $datos[$index]['totalcomosefinancia'] = $totalComoFinanciaXEntidad[$value['identidad']];
      $datos[$index]['credito'] = $totalCreditoXEntidad[$value['identidad']];
      $datos[$index]['contado'] = $totalContadoXEntidad[$value['identidad']];
      $datos[$index]['totalquienfinancia'] = $totalQuienfinanciaXEntidad[$value['identidad']];
      foreach ($quienPintados as $quienP) {
      $totalQuienXfinancista = DatInversion::listarTotalQuienXfinancista($value['identidad'], $params['idmoneda'], $params['idejercicio']);
      $valor = 0;
      foreach ($totalQuienXfinancista as $totalXQuien) {
      if ($quienP == $totalXQuien['denominacion']) {
      $valor = $totalXQuien['totalquien'];
      break;
      }
      }
      $datos[$index][$quienP] = $valor;
      }
      $datos[$index]['fondobasico'] = $totalFondoBasicoXEntidad[$value['identidad']];
      $datos[$index]['rendinversion'] = $totalRendimientoInverXEntidad[$value['identidad']];
      $datos[$index]['inverprocpniano'] = $totalInversInicioAnoXEntidad[$value['identidad']];
      $datos[$index]['cuotainverproc'] = $totalCuotaInversProcesoXEntidad[$value['identidad']];
      $index+=1;

      foreach ($inversionesXentidad as $key => $val) {
      if ($value['identidad'] == $val['idestructuracomun']) {
      $datos[] = $val;
      foreach ($idFinancistas as $quienP) {
      $valorquienFinancia = DatInversion::listarValorPlanPorFinancista($val['idinversion'], $params['idmoneda'], $params['idejercicio']);

      if (count($valorquienFinancia) > 0) {
      foreach ($valorquienFinancia as $quien) {
      $valor = 0;
      if ($quienP == $quien['idfinancista']) {
      $valor = $quien['valor'];
      break;
      }
      }
      $datos[$index][$quienP] = $valor;
      } else {
      $datos[$index][$quienP] = 0;
      }
      }
      $index+=1;
      }
      }
      }
      }
      }

      //$datos = array_merge($datos,$inversionesXentidad);


      $data[0]->tipo = 'estandar';
      $data[0]->datos = $datos;
      $data[0]->columnas = array('OACE/Entidad/Inversiones', 'Plan(Incluye plan de preparaci&oacute;n)',
      'Total C&oacute;mo se financia', 'Cr&eacute;dito', 'Contado', 'Total Qui&eacute;n financia');
      $data[0]->referencias = array('denominacion', 'plan', 'totalcomosefinancia', 'credito', 'contado', 'totalquienfinancia');
      foreach ($quienPintados as $key => $quien) {
      $data[0]->columnas[] = $quien;
      $data[0]->referencias[] = $quien;
      }
      $data[0]->columnas[] = 'Fondos b&aacute;sicos a poner en explotaci&oacute;n';
      $data[0]->referencias[] = 'fondobasico';
      $data[0]->columnas[] = 'Rendimiento de la inversi&oacute;n';
      $data[0]->referencias[] = 'rendinversion';
      $data[0]->columnas[] = 'Inversiones en proceso al inicio del a&nacute;o';
      $data[0]->referencias[] = 'inverprocpniano';
      $data[0]->columnas[] = 'Cuota de inversiones en proceso';
      $data[0]->referencias[] = 'cuotainverproc';


      $data[0]->emptyvalue = 0;
      $data['subsistema'] = 'inversiones';
      $data['hora'] = $hoy = date("H:i:s");
      }
      }
      return $data;
      } */

    public function getDatosReporteInversion($params, $org, $ent) {
        $objinversion = new DatInversion();
        $colRefer = $objinversion->listarColumnasRptResumen($params);
        $referencia = (str_ireplace(' text', '', $colRefer[0]['tipodato']));

        $referencia = explode(',', $referencia);
        unset($referencia[0]);
        unset($referencia[1]);

        $columna = explode(',', $colRefer[1]['tipodato']);
        unset($columna[0]);
        unset($columna[1]);

        //buscar las entidades
        if ($org[0] == null) {
            $selectDenomOrganismo = 0;
            $org = self::cargarTodosOrganismosYArrayHijas($this->global->Perfil->iddominio, $selectDenomOrganismo);
            $entidades = $org[0]['dato'];
        } else {
            foreach ($org as $k => $valueorg) {
                $idestructuras = array();
                $idest = self::buscarEntidadesTodas($valueorg);
                
                //print_r($idest);die;
                if ($ent[0] != null) {
                    foreach ($idest as $key => $valor) {
                        if (in_array($valor, $ent))
                            $idestructuras[] = $valor;
                    }
                } else
                    $idestructuras = $idest;


                for ($index9 = 0; $index9 < count($idestructuras); $index9++) {
                    $organismos1[] = $idestructuras[$index9];
                }
            }
            $entidades = implode(",", array_values($organismos1));
        }

        $params['entidades'] = $entidades;

        $data[0]->tipo = 'estandar';
        $data[0]->datos = $objinversion->listarDatosRptResumen($params, $colRefer[0]['tipodato']);
        //$data[0]->columnas = explode(',', $colRefer[1]['tipodato']);
        $data[0]->columnas = $columna;
        //$data[0]->referencias = explode(',', $referencia);
        $data[0]->referencias = $referencia;
        $data[0]->emptyvalue = '0.00'; //si una referencia viene sin valor pone 0
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'Resumen de inversiones en M' . $params['filtros'][8]['cbMoneda'];
        $data['hora'] = $hoy = date("H:i:s");

        return $data;
    }

    public function getDatosReporteGeneral($params, $org, $ent) {

        //buscar las entidades
        if ($org[0] == null) {
            $selectDenomOrganismo = 0;
            $org = self::cargarTodosOrganismosYArrayHijas($this->global->Perfil->iddominio, $selectDenomOrganismo);
            $entidades = $org[0]['dato'];
        } else {
            foreach ($org as $k => $valueorg) {
                $idestructuras = array();
                $idest = self::buscarEntidadesTodas($valueorg);

                if ($ent[0] != null) {
                    foreach ($idest as $key => $valor) {
                        if (in_array($valor, $ent))
                            $idestructuras[] = $valor;
                    }
                } else
                    $idestructuras = $idest;


                for ($index9 = 0; $index9 < count($idestructuras); $index9++) {
                    $organismos1[] = $idestructuras[$index9];
                }
            }
            $entidades = implode(",", array_values($organismos1));
        }

        $params['entidades'] = $entidades;
        //buscar los cuatro ejercicios a partir del actual
        $ejercicios = AnalisisInversiones::buscarEjercicioAnterior($params['ejercicio']);
        $arrayEjercicio = array();
        $arrayEjercicio[] = $ejercicios[0]['idejercicio'];
        $arrayEjercicio[] = $ejercicios[1]['idejercicio'];
        $arrayEjercicio[] = $params['idejercicio'];
        $arrayEjercicio[] = $ejercicios[2]['idejercicio'];

        $objinversion = new DatInversion();
        $datos = $objinversion->listarDatosFuncionRptGeneral($params, $arrayEjercicio);
        // $columnas = array('Entidad', 'Organismo');
        // $referncias = array('entidad, organismo');


        $columnas = array('Entidad', 'Organismo', 'Codigo', 'Denominaci&oacute;n', 'Tipo inversi&oacute;n', 'Estado inversi&oacute;n',
            'Forma propiedad', 'Provincia', 'Programa', 'Naturaleza', 'Medio ambiente', 'Objetivo', 'Efecto comercial',
            'Pto Total MP',
            'Real Total ejecutado hasta MP', 'Real ejecutado capital de trabajo inicial MP', 'Real ejecutado  equipos MP', 'Real ejecutado otros gastos MP',
            'Real ejecutado Const. y Monyaje MP', 'Pto Total USD', 'Real Total ejecutado hasta USD',
            'Real ejecutado capital de trabajo inicial USD', 'Real ejecutado  equipos USD', 'Real ejecutado otros gastos USD',
            'Real ejecutado Const. y Monyaje USD', 'Real ejecutado PP USD', 'Total estimado MP', 'Estimado capital de trabajo inicial MP',
            'Estimado  equipos MP', 'Estimado otros gastos MP', 'Estimado Const. y Monyaje MP', 'Estimado PP MP', 'Total estimado USD',
            'Estimado capital de trabajo inicial USD', 'Estimado  equipos USD', 'Estimado otros gastos USD',
            'Estimado Const. y Monyaje USD', 'Estimado PP USD', 'Total plan MP', 'Plan equipos MP', 'Plan otros gastos MP', 'Plan Const. y Monyaje MP',
            'Plan PP MP', 'Total plan USD', 'Plan equipos USD', 'Plan otros gastos USD',
            'Plan Const. y Monyaje USD', 'Plan PP USD', 'Fondos b&aacute;sicos MP', 'Contrataci&oacute;n externa USD', 'Contado ejercicio actual MP',
            'Cr&eacute;dito ejercicio actual MP', 'Financiamiento Fondo Nacional de medio mabiente MP',
            'Financiamiento Presupuesto del estado MP', 'Financiamiento Donaci&oacute;n MP', 'Financiamiento Contado MP',
            'Financiamiento Ingresos de la Entidad MP', 'Contado ejercicio actual USD', 'Cr&eacute;dito ejercicio actual USD',
            'Financiamiento Fondo Nacional de medio mabiente USD', 'Financiamiento Presupuesto del estado USD', 'Financiamiento Donaci&oacute;n USD',
            'Financiamiento Contado USD', 'Financiamiento Ingresos de la Entidad USD', 'Total proyectado MP', 'Total proyectado USD', 'Total a&ntilde;os posteriores MP',
            'Total a&ntilde;os posteriores USD', 'Observaciones de la inversi&oacute;n');

        $referncias = array('entidad', 'organismo', 'codigo', 'denominacion', 'tipoinversion', 'estadoinversion',
            'formapropiedad', 'provincia', 'programa', 'naturaleza', 'medioambiente', 'objetivo', 'efectocomercial',
            'presupuestototalmp',
            'ejecutadototalmp', 'ejecutadocapitalmp', 'ejecutadototalequiposmp', 'ejecutadootrosgastosmp',
            'ejecutadoconstruccionmp', 'presupuestototalusd', 'ejecutadototalusd',
            'ejecutadocapitalusd', 'ejecutadototalequiposusd', 'ejecutadootrosgastosusd',
            'ejecutadoconstruccionusd', 'ejecutadopresanteproyusd', 'estimadototalmp', 'estimadocapitalmp',
            'estimadototalequiposmp', 'estimadootrosgastosmp', 'estimadoconstruccionmp', 'estimadopresanteproymp', 'estimadototalusd',
            'estimadocapitalusd', 'estimadototalequiposusd', 'estimadootrosgastosusd',
            'estimadoconstruccionusd', 'estimadopresanteproyusd', 'plantotalmp', 'plantotalequiposmp', 'planotrosgastosmp', 'planconstruccionmp',
            'planpresanteproymp', 'plantotalusd', 'plantotalequiposusd', 'planotrosgastosusd',
            'planconstruccionusd', 'planpresanteproyusd', 'planfondosbasicosmp', 'plancontratacionextusd', 'financiamientocomocontadomp',
            'financiamientocreditomp', 'financiamientofondonacionalmp',
            'financiamientopresupestadomp', 'financiamientodonacionmp', 'financiamientocontadomp',
            'financiamientoingresoentmp', 'financiamientocomocontadousd', 'financiamientocreditousd',
            'financiamientofondonacionalusd', 'financiamientopresupestadousd', 'financiamientodonacionusd',
            'financiamientocontadousd', 'financiamientoingresoentusd', 'proyectadototalmp', 'proyectadototalusd', 'annos_post_total_mp',
            'annos_post_total_usd', 'observaciones');

        $data[0]->tipo = 'estandar';
        $data[0]->datos = $datos;
        $data[0]->columnas = $columnas;
        $data[0]->referencias = $referncias;
        $data[0]->emptyvalue = 'pppp';
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'Reporte General';
        $data['hora'] = $hoy = date("H:i:s");

        return $data;
    }

    public function getDatosRepComponente($org, $ent, $params, $mostrarinv) {
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
//print_r($mostrarinv);die;
        if ($mostrarinv == 1) {
            $encabezados = array(
                array(
                    'tipo' => 'simple',
                    'emptyvalue' => '0',
                    'header' => '',
                    'columnas' => array('ORGANISMO / PRESUPUESTO MEP', 'ORGANISMO', 'ENTIDAD', 'SECTOR ESTRATEGICO', 'IMPACTO POR INCREMENTO SALARIAL MT'),
                    'referencias' => array('denom', 'org', 'ent', 'sector', 'impactoSalarial')
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
                    'columnas' => array('ORGANISMO / PRESUPUESTO MEP', 'ORGANISMO', 'IMPACTO POR INCREMENTO SALARIAL MT'),
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
//                var_dump($entidades_hijas);
                $inversiones = array();
                $inversiones2 = array();
                $organ = null;
                $sectores = null;
                $valorpp = array();
                $denominversiones = array();
                $k = 0;
                $p = 0;
                $cont=0;
                $cont1=1;
                $cont2=1;
                foreach ($invXcomponentes as $p => $dato1) {
//                    var_dump($cont.'a');
                    if (!in_array($dato1['idinversion'], $inversiones)) {
                        $inversiones[] = $dato1['idinversion'];
                        $inversiones2[$cont]['idinversion'] = $dato1['idinversion'];
                        $inversiones2[$cont]['organismopadre'] = $dato1['organismopadre'];
                        $inversiones2[$cont]['entidad'] = $dato1['entidad'];
                        $inversiones2[$cont]['sector'] = $dato1['sector'];
                        $inversiones2[$cont]['inversion'] = $dato1['inversion'];
                        $denominversiones[] = $dato1['inversion'];
                        $organ = $dato1['organismopadre'];
                        $entidades = $dato1['entidad'];
                        $sectores = $dato1['sector'];
                        $cont++;
                    }
                    if ($dato1['idetapa'] == NULL) {
                        $valorpp[$k]['idinversion'] = $dato1['idinversion'];
                        $valorpp[$k]['codigoiso'] = $dato1['codigoiso'];
                        $valorpp[$k]['valorpp'] = $dato1['valor'];
                        $k++;
                    }
                    if ($dato1['indicador'] != NULL) {
                        $impactoSalarial[$p]['idinversion'] = $dato1['idinversion'];
                        $impactoSalarial[$p]['valorIS'] = $dato1['valor'];
                        $p++;
                    }
                }
//var_dump($inversiones2);die;
//                foreach ($inversiones as $i => $dato) {
                foreach ($inversiones2 as $i => $dato) {
                    //var_dump($dato);die;
                    $data[$posicionInv]['denom'] = $dato['inversion'];
                    $data[$posicionInv]['org'] = $dato['organismopadre'];
                    $data[$posicionInv]['ent'] = $dato['entidad'];
                    $data[$posicionInv]['sector'] = $dato['sector'];

                    foreach ($monedas as $moneda) {

                        $totalInversiones = 0;
                        foreach ($componentes as $comp) {
                            $encuentra = false;
                            $valComponente = 0;
                            foreach ($invXcomponentes as $p => $datoInv) {
                                if ($datoInv['idinversion'] == $dato['idinversion']) {
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
                            if ($var['idinversion'] == $dato['idinversion'] && $moneda == $var['codigoiso']) {
                                $planPreparacion = $var['valorpp'];
                                break;
                            }
                        }
                        $data[$posicionInv]['preparacion' . $moneda] = $planPreparacion;

                        $valorImpactoSalarial = 0;
                        foreach ($impactoSalarial as $var) {
                            if ($var['idinversion'] == $dato['idinversion']) {
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
        //var_dump($data);die;
        /* print_r($encabezados);
          print_r('//////////////');
          print_r($encabezados);die; */
        $result[0]->tipo = 'multiheader';
        $result[0]->encabezados = $encabezados;
        $result[0]->datos = $data;
        $result['subsistema'] = 'inversiones';
        $result['titulo'] = 'Componentes';

        return $result;
    }

    public function getDatosRepEquiposAutomotoresPlanes($org, $ent, $params) {
        //formar las columnas y sus referencias
        $arrcolumnas = array();
        $arrreferencias = array();

        $arrcolumnas[] = 'OACE/OSDE';
        $arrcolumnas[] = 'Entidad';
        $arrcolumnas[] = 'Inversi&oacute;n';
        $arrcolumnas[] = 'Descripci&oacute;n';
        $arrcolumnas[] = 'Organismo Rector';
        $arrcolumnas[] = 'Forma de Propiedad';
        $arrcolumnas[] = 'Adquirir';
        $arrcolumnas[] = 'Comprar';
        $arrcolumnas[] = 'Pa&iacute;s';
        $arrcolumnas[] = 'Cantidad Reposici&oacute;n';
        $arrcolumnas[] = 'Cantidad Incremento';
        $arrcolumnas[] = 'Cantidad Total';
        $arrcolumnas[] = 'Valor Total';
        $arrcolumnas[] = 'Valor Total Import';

        $arrreferencias[] = 'org';
        $arrreferencias[] = 'ent';
        $arrreferencias[] = 'inv';
        $arrreferencias[] = 'equipo';
        $arrreferencias[] = 'orgrector';
        $arrreferencias[] = 'forma';
        $arrreferencias[] = 'adquirir';
        $arrreferencias[] = 'comprar';
        $arrreferencias[] = 'pais';
        $arrreferencias[] = 'cantReposicion';
        $arrreferencias[] = 'cantIncremento';
        $arrreferencias[] = 'cantTotal';
        $arrreferencias[] = 'valorTotal';
        $arrreferencias[] = 'valortotalimportacion';

        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            //$org = self::cargarOrganismos();
            $selectDenomOrganismo = 0;
            $org = self::cargarTodosOrganismosEHijas($this->global->Perfil->iddominio, $selectDenomOrganismo);
            $params['filtro_entidades'] = implode(",", $org);
        } else {
            //formar el arreglo de organos y entidades hijas como uno solo en caso de que se seleccionen en la interfaz
            $idestructuras = array();
            foreach ($org as $pos => $value) {//organismos
                $idest = array();
                $idest = self::buscarEntidades($value);

                if ($ent[0] != null) {
                    foreach ($idest as $key => $valor) {
                        if (in_array($valor, $ent))
                            $idestructuras = array($valor);
                    }
                } else
                    $idestructuras[] = $idest;

                $idestructuras[] = array($value);
            }
            $todas_entidades = array();
            foreach ($idestructuras as $value) {
                $todas_entidades = array_merge($todas_entidades, $value);
            }
            $params['filtro_entidades'] = implode(",", array_values($todas_entidades));
        }


        $datospintar = DatEtapaEquipo::ExportarEquiposAutomotoresCompReportes($params);
// pre_r($datospintar);die('dedede');
        $totales = array();
        $data = array();
        foreach ($datospintar as $key => $value) {

            $data[$key]['org'] = $value['organismo'];
            $data[$key]['ent'] = $value['estructura'];
            $data[$key]['inv'] = $value['inversion'];
            $data[$key]['equipo'] = $value['indicador'];
            $data[$key]['orgrector'] = $value['organosatisface'];
            $data[$key]['forma'] = $value['formapropiedad'];
            $data[$key]['adquirir'] = $value['adquirir'];
            $data[$key]['comprar'] = $value['comprar'];
            $data[$key]['pais'] = $value['pais'];

            $data[$key]['cantReposicion'] = (float) $value['planrep'];
            $data[$key]['cantIncremento'] = (float) $value['planinc'];
            $data[$key]['cantTotal'] = (float) $value['total'];
            $data[$key]['valorTotal'] = str_replace(',', '.', $value['valortotal']);
            $data[$key]['valortotalimportacion'] += str_replace(',', '.', $value['valortotalimportacion']);

            $totales['planrep'] += $value['planrep'];
            $totales['planinc'] += $value['planinc'];
            $totales['total'] += $value['total'];
            $totales['valortotal'] += str_replace(',', '.', $value['valortotal']);
            $totales['valortotalimportacion'] += str_replace(',', '.', $value['valortotalimportacion']);
        }
//pinta los datos de la fila de los totales...
        if (count($datospintar) > 0) {
            $data[count($datospintar)]['org'] = 'Total de Equipos Automotores:';
            $data[count($datospintar)]['ent'] = " \t ";
            $data[count($datospintar)]['inv'] = " \t ";
            $data[count($datospintar)]['equipo'] = " \t ";
            $data[count($datospintar)]['orgrector'] = " \t ";
            $data[count($datospintar)]['forma'] = " \t ";
            $data[count($datospintar)]['adquirir'] = " \t ";
            $data[count($datospintar)]['comprar'] = " \t ";
            $data[count($datospintar)]['pais'] = " \t ";

            $data[count($datospintar)]['cantReposicion'] = $totales['planrep'];
            $data[count($datospintar)]['cantIncremento'] = $totales['planinc'];
            $data[count($datospintar)]['cantTotal'] = $totales['total'];
            $data[count($datospintar)]['valorTotal'] = $totales['valortotal'];
            $data[count($datospintar)]['valortotalimportacion'] = $totales['valortotalimportacion'];
        }


        $result[0]->tipo = 'estandar';
        $result[0]->datos = $data;
        $result[0]->columnas = $arrcolumnas;
        $result[0]->referencias = $arrreferencias;
        $result[0]->emptyvalue = 0;
        $result['subsistema'] = 'inversiones';
        $result['titulo'] = 'Equipos automotores por &oacute;rgano rector';
        //pre_r($result);die;


        return $result;
    }

    public function getDatosRepDemandaEquipos($org, $ent, $mon, $nivel, $mostrarinv, $params) {
        $objinversionModel = new InversionesModel();
        $objinversion = new DatInversion();

        //formar las columnas y sus referencias
        $encabezados = array(
            array(
                'tipo' => 'simple',
                'emptyvalue' => '0',
                'header' => '',
                'columnas' => array('Denominaci&oacute;n'),
                'referencias' => array('denom')
            ),
            array(
                'tipo' => 'simple',
                'emptyvalue' => '0',
                'header' => 'REPOSICION',
                'columnas' => array('Cantidad', 'Valor'),
                'referencias' => array('cantReposicion', 'valorReposicion')
            ),
            array(
                'tipo' => 'simple',
                'emptyvalue' => '0',
                'header' => 'INCREMENTO',
                'columnas' => array('Cantidad', 'Valor'),
                'referencias' => array('cantIncremento', 'valorIncremento')
            ),
            array(
                'tipo' => 'simple',
                'emptyvalue' => '0',
                'header' => 'TOTAL',
                'columnas' => array('Cantidad', 'Valor'),
                'referencias' => array('cantTotal', 'valorTotal')
        ));


        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            $org = self::cargarOrganismos();
        }
        //formar el arreglo de organos y entidades hijas como uno solo
        $entidades_hijas = Array();
//pre_r($org);die;
        foreach ($org as $ki => $value) {//organismos
            $identidades = Array();
            $organismodenominacion = $this->integrator->metadatos->DameEstructura($value);
            $organismoden[$ki] = $organismodenominacion[0]->denominacion;
            if ($ent[0] != null) {
                $idSeleccionadas = $objinversionModel->dadoArrayEntidades($value, $organismodenominacion['denominacion'], $ent); //ENTIDADES HIJAS seleccionadas
                if (count($idSeleccionadas) > 0) {
                    $idestructuras = $idSeleccionadas;
                    foreach ($idestructuras as $key => $valu) {
                        $identidades[$key] = $valu['identidad'];
                    }
                }
            } else {
                $idestructuras = $objinversionModel->cargarEntHijas($value, $organismodenominacion['denominacion']); //ENTIDADES HIJAS
//pre_r($idestructuras);die;
                foreach ($idestructuras as $key => $valor) {
                    $identidades[$key] = $valor['identidad'];
                }
            }

            if (count($identidades) > 0) {
                $arrayEntXOrg[$ki] = $identidades;
                $arrayDenEntXOrg[$ki] = $idestructuras;
                $entidades_hijas = array_merge($identidades, $entidades_hijas);
            } else {
                $arrayEntXOrg[$ki][0] = $value;
                $arrayDenEntXOrg[$ki][0] = $organismoden[$ki];
                $entidades_hijas[count($entidades_hijas)] = $value;
            }
        }
        $data_result = array();
        $pos = 0;
        //---------calculo total de todos los organismos-------------------------------------------------------------------------
        $sumaTlOrgRep = 0;
        $sumacantOrgRep = 0;
        $sumacantOrgInc = 0;
        $sumaTlOrgInc = 0;
        $mon = $mon[0];
        //Inversiones por organimos OK
        $tolTlOrg = $objinversion->getInversionesOrganismoDemandaCompReportes($params['cadenaWHERE'], $entidades_hijas, $params['ejercicio'], $params['idejercicio']); //TOTAL DEL ORGANISMO Y SUS ENTIDADES HIJAS
//pre_r($tolTlOrg);die;
        //Planes de las entidades
//        $planeTl = $objinversion->listarPlanesInversiones(implode(',', $entidades_hijas)); //PLANES
//    pre_r($planeTl);
//        pre_r($nivel);
        //Inversiones de las Planes  de incremento
        $indTlOrgIncr = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $tolTlOrg, $mon, 9/*$planeTl[0]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 1   INCREMENTO
//pre_r($indTlOrgIncr);die;
        //Inversiones de las Planes  de Reposicion
        $indTlOrgRepos = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $tolTlOrg, $mon, 10/*$planeTl[1]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 2    REPOSICION
//pre_r($indTlOrgRepos);die;
//        die;
        //Calcular el total de la cantidad de reposiciones y el valortotal de los organismos.
        foreach ($indTlOrgRepos as $key => $v) {
            $importOrgRepos = $v['importe'];
            $sumaTlOrgRep += $importOrgRepos;
            $sumacantOrgRep += $v['cantidad'];
        }
        //Calcular el total de la cantidad de Incrementos  y el valor total de los organismos.
        foreach ($indTlOrgIncr as $key => $v) {
            $importOrgIncr = $v['importe'];
            $sumaTlOrgInc += $importOrgIncr;
            $sumacantOrgInc += $v['cantidad'];
        }
        //Pintar la fila;
        $data_result[$pos]['denom'] = "\t" . 'Total';
        $data_result[$pos]['cantReposicion'] = $sumacantOrgRep;
        $data_result[$pos]['valorReposicion'] = $sumaTlOrgRep;
        $data_result[$pos]['cantIncremento'] = $sumacantOrgInc;
        $data_result[$pos]['valorIncremento'] = $sumaTlOrgInc;
        $data_result[$pos]['cantTotal'] = $sumacantOrgInc + $sumacantOrgRep;
        $data_result[$pos]['valorTotal'] = $sumaTlOrgRep + $sumaTlOrgInc;
        $data_result[$pos]['negrita'] = true;
        $pos++;


        //////-------------------------- calculos total organismo entidades-------------------------------------------------------------------------
        foreach ($org as $ko => $value) {//organismos padres
            $arrayInv = Array();
            $arrayOrg[0] = $value;
            //////---------------------------calculos total organismo  y sus entidades-------------------------------------------------------------------------
            $sumaOrgEntsRep = 0;
            $sumaOrgEntsInc = 0;
            $sumaOrgCantiRepo = 0;
            $sumaOrgCantiInc = 0;


            //TOTAL DEL ORGANISMO Y SUS ENTIDADES HIJAS
            $tolInvOrgEtns = $objinversion->getInversionesOrganismoDemandaCompReportes($params['cadenaWHERE'], $arrayEntXOrg[$ko], $params['ejercicio'], $params['idejercicio']);
//            $planeGenrl = $objinversion->listarPlanesInversiones(implode(',', $arrayEntXOrg[$ko])); //PLANES
            $indOrgEnts = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $tolInvOrgEtns, $mon, 9/*$planeGenrl[0]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION
            $indOrgEnts1 = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $tolInvOrgEtns, $mon, 10/*$planeGenrl[1]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO

            foreach ($indOrgEnts1 as $key => $v) {
                $importOrgEnts = round($v['precio'], 2) * $v['cantidad'];
                $sumaOrgCantiRepo += $v['cantidad'];
                $sumaOrgEntsRep += $importOrgEnts;
            }
            foreach ($indOrgEnts as $key => $v) {
                $importOrgEnts1 = round($v['precio'], 2) * $v['cantidad'];
                $sumaOrgCantiInc += $v['cantidad'];
                $sumaOrgEntsInc += $importOrgEnts1;
            }

            //////---------------------------end calculos total organismo entidades-------------------------------------------------------------------------
            //
            //////---------------------------calculos del propio organismo-------------------------------------------------------------------------
            $valorIncOrg = 0;
            $valorRepoOrg = 0;
            $cantincEnt = 0;
            $cantrepoEnt = 0;
            //INVERSIONES DE LOS ORGANISMOS
            $data = $objinversion->getInversionesOrganismoDemandaCompReportes($params['cadenaWHERE'], $arrayOrg, $params['ejercicio'], $params['idejercicio']);
//            $d = $objinversion->listarPlanesInversiones($value); //PLANES
//print_r($d);die;            
            $datosplanOrg = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $data, $mon, 9/*$d[0]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION
            $datosplanOrg1 = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $data, $mon, 10/*$d[1]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO

            foreach ($datosplanOrg1 as $key => $v) {
                $importOrg = round($v['precio'], 2) * $v['cantidad'];
                $cantincEnt += $v['cantidad'];
                $valorIncOrg += $importOrg;
            }
            foreach ($datosplanOrg as $key => $v) {
                $importOrg1 = round($v['precio'], 2) * $v['cantidad'];
                $valorRepoOrg += $importOrg1;
                $cantrepoEnt += $v['cantidad'];
            }
            //////---------------------------end calculos del propio organismo-------------------------------------------------------------------------

            $data_result[$pos]['denom'] = 'Total del organismo ' . $organismoden[$ko];
            $data_result[$pos]['cantReposicion'] = $sumaOrgCantiRepo;
            $data_result[$pos]['valorReposicion'] = $sumaOrgEntsRep;
            $data_result[$pos]['cantIncremento'] = $sumaOrgCantiInc;
            $data_result[$pos]['valorIncremento'] = $sumaOrgEntsInc;
            $data_result[$pos]['cantTotal'] = $sumaOrgCantiInc + $sumaOrgCantiRepo;
            $data_result[$pos]['valorTotal'] = $sumaOrgEntsRep + $sumaOrgEntsInc;
            $data_result[$pos]['negrita'] = true;
            $pos++;

            if (count($data) != 0) {
                ///---------------------TOTAL------------------------------------------------------------------------///
                foreach ($data as $k => $val) {
                    $arrayInv[0]['idinversion'] = $val['idinversion'];
                    ///--------------------CALCULANDO SUMATORIA DE LAS INVERSIONES-----------------------------------///
//                    $d = $objinversion->listarPlanesInversiones($value); //PLANES
                    $datosplan8 = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $arrayInv, $mon, 9/*$d[0]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION
                    $datosplan5 = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $arrayInv, $mon, 10/*$d[1]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO
                    foreach ($datosplan5 as $key => $v) {
                        $datosplan5[$key]['cantidad2'] = $v['cantidad'];
                        $datosplan5[$key]['precio2'] = $v['precio'];
                    }
                    foreach ($datosplan8 as $key => $v) {
                        $datosplan8[$key]['cantidad1'] = $v['cantidad'];
                        $datosplan8[$key]['precio1'] = $v['precio'];
                    }
                    $array3 = array_merge($datosplan8, $datosplan5);
                    $cont = 0;
                    $sumas = array();
                    $Xarbol = array();

                    foreach ($array3 as $key => $value1) {
                        if ($value1['nivel'] == 4) {
                            $sumas['sumaCantRepo'] += $value1['cantidad2'];
                            $sumas['sumaCantInc'] += $value1['cantidad1'];
                            $import = round($value1['precio1'], 2) * $value1['cantidad1'];
                            $sumas['sumaValRepo'] += $import;
                            $import1 = round($value1['precio2'], 2) * $value1['cantidad2'];
                            $sumas['sumaValInc'] += $import1;
                            $cont++;
                            $Xarbol[$value1['idarbol']]['CantRepo'] += $value1['cantidad1'];
                            $Xarbol[$value1['idarbol']]['CantInc'] += $value1['cantidad2'];
                            $importArb = round($value1['precio1'], 2) * $value1['cantidad1'];
                            $Xarbol[$value1['idarbol']]['ValRepo'] += $importArb;
                            $importArb1 = round($value1['precio2'], 2) * $value1['cantidad2'];
                            $Xarbol[$value1['idarbol']]['ValInc'] += $importArb1;
                        }
                    }
                    if (($sumas['sumaValRepo'] != 0) || ($sumas['sumaValInc'] != 0)) {
                        if ($mostrarinv == 1) {
                            $data_result[$pos]['denom'] = $val['denominacion'];
                            $data_result[$pos]['cantReposicion'] = $sumas['sumaCantRepo'];
                            $data_result[$pos]['valorReposicion'] = $sumas['sumaValRepo'];
                            $data_result[$pos]['cantIncremento'] = $sumas['sumaCantInc'];
                            $data_result[$pos]['valorIncremento'] = $sumas['sumaValInc'];
                            $data_result[$pos]['cantTotal'] = $sumas['sumaCantRepo'] + $sumas['sumaCantInc'];
                            $data_result[$pos]['valorTotal'] = $sumas['sumaValInc'] + $sumas['sumaValRepo'];
                            $pos++;
                        }
                        $denotabla = '';
                        $denotabla1 = '';
                        $denotabla2 = '';
                        $denotabla3 = '';
                        foreach ($array3 as $k => $va) {
                            $idarbol = $va['idarbol'];
                            if ($va['nivel'] == 1 && $va['idinversion'] == $val['idinversion'] && $va['nivel'] <= $nivel) {
                                if ($denotabla != $va['denominacion'] && ($sumas['sumaValInc'] != 0 || $sumas['sumaValRepo'] != 0)) {
                                    $denotabla = $va['denominacion'];

                                    $data_result[$pos]['denom'] = $denotabla;
                                    $data_result[$pos]['cantReposicion'] = $Xarbol[$idarbol]['CantRepo'];
                                    $data_result[$pos]['valorReposicion'] = $Xarbol[$idarbol]['ValRepo'];
                                    $data_result[$pos]['cantIncremento'] = $Xarbol[$va['idarbol']]['CantInc'];
                                    $data_result[$pos]['valorIncremento'] = $Xarbol[$va['idarbol']]['ValInc'];
                                    $data_result[$pos]['cantTotal'] = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                    $data_result[$pos]['valorTotal'] = $Xarbol[$va['idarbol']]['ValRepo'] + $Xarbol[$va['idarbol']]['ValInc'];
                                    $pos++;
                                }
                            }
                            if ($va['nivel'] == 2 && $va['idinversion'] == $val['idinversion'] && ($sumas['sumaValInc'] != 0 || $sumas['sumaValRepo'] != 0) && $va['nivel'] <= $nivel) {
                                if ($denotabla1 != $va['denominacion']) {
                                    $denotabla1 = $va['denominacion'];
                                    $denominacion1 = $va['denominacion'];

                                    $data_result[$pos]['denom'] = $denotabla1;
                                    $data_result[$pos]['cantReposicion'] = $Xarbol[$idarbol]['CantRepo'];
                                    $data_result[$pos]['valorReposicion'] = $Xarbol[$idarbol]['ValRepo'];
                                    $data_result[$pos]['cantIncremento'] = $Xarbol[$va['idarbol']]['CantInc'];
                                    $data_result[$pos]['valorIncremento'] = $Xarbol[$va['idarbol']]['ValInc'];
                                    $data_result[$pos]['cantTotal'] = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                    $data_result[$pos]['valorTotal'] = $Xarbol[$va['idarbol']]['ValRepo'] + $Xarbol[$va['idarbol']]['ValInc'];
                                    $pos++;
                                }
                            }
                            if ($va['nivel'] == 3 && $va['idinversion'] == $val['idinversion'] && ($sumas['sumaValInc'] != 0 || $sumas['sumaValRepo'] != 0) && $va['nivel'] <= $nivel) {
                                if ($denotabla2 != $va['denominacion']) {
                                    $denotabla2 = $va['denominacion'];
                                    $denominacion2 = $va['denominacion'];

                                    $data_result[$pos]['denom'] = $denotabla2;
                                    $data_result[$pos]['cantReposicion'] = $Xarbol[$idarbol]['CantRepo'];
                                    $data_result[$pos]['valorReposicion'] = $Xarbol[$idarbol]['ValRepo'];
                                    $data_result[$pos]['cantIncremento'] = $Xarbol[$va['idarbol']]['CantInc'];
                                    $data_result[$pos]['valorIncremento'] = $Xarbol[$va['idarbol']]['ValInc'];
                                    $data_result[$pos]['cantTotal'] = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                    $data_result[$pos]['valorTotal'] = $Xarbol[$va['idarbol']]['ValRepo'] + $Xarbol[$va['idarbol']]['ValInc'];
                                    $pos++;
                                }
                            }
                            if ($va['nivel'] == 4 && $va['idinversion'] == $val['idinversion'] && ($va['cantidad2'] != 0 || $va['cantidad1'] != 0) && $va['nivel'] <= $nivel) {

                                if ($denotabla3 != $va['denominacion']) {
                                    $denotabla3 = $va['denominacion'];

                                    $data_result[$pos]['denom'] = $va['denominacion'];
                                    $data_result[$pos]['cantReposicion'] = $va['cantidad2'];
                                    $data_result[$pos]['valorReposicion'] = $va['cantidad2'] * round($va['precio2'], 2);
                                    $data_result[$pos]['cantIncremento'] = $va['cantidad1'];
                                    $data_result[$pos]['valorIncremento'] = $va['cantidad1'] * round($va['precio1'], 2);
                                    $data_result[$pos]['cantTotal'] = $va['cantidad1'] + $va['cantidad2'];
                                    $data_result[$pos]['valorTotal'] = $va['cantidad2'] * round($va['precio2'], 2) + $va['cantidad1'] * round($va['precio1'], 2);
                                    $pos++;
                                }
                            }
                        }
                    }
                }
            }

            foreach ($arrayDenEntXOrg[$ko] as $k => $valor) {//entidades hijas
                if ($arrayOrg[0] != $valor['identidad']) {
                    $array = Array();
                    $valorIncEnt = 0;
                    $cantIncEnt = 0;
                    $cantRepEnt = 0;
                    $valorRepoEnt = 0;
                    $array[0] = $valor['identidad'];
                    $data = $objinversion->getInversionesOrganismoDemandaCompReportes($params['cadenaWHERE'], $array, $params['ejercicio'], $params['idejercicio']); //INVERSIONES DE LOS ORGANISMOS
//                    $di = $objinversion->listarPlanesInversiones($valor['identidad']); //PLANES
                    $datosplanEnti = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $data, $mon, 9/*$di[0]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION

                    $datosplanEnti1 = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $data, $mon, 10/*$di[1]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO
                    foreach ($datosplanEnti1 as $key => $v) {
                        $impEnt = round($v['precio'], 2) * $v['cantidad'];
                        $cantIncEnt += $v['cantidad'];
                        $valorIncEnt += $impEnt;
                    }
                    foreach ($datosplanEnti as $key => $v) {
                        $impEnt1 = round($v['precio'], 2) * $v['cantidad'];
                        $cantRepEnt += $v['cantidad'];
                        $valorRepoEnt += $impEnt1;
                    }

                    if (count($data) != 0) {

                        if ($mostrarinv == 1) {
                            $data_result[$pos]['denom'] = $valor['entidad'];
                            $data_result[$pos]['cantReposicion'] = $cantIncEnt;
                            $data_result[$pos]['valorReposicion'] = $valorIncEnt;
                            $data_result[$pos]['cantIncremento'] = $cantRepEnt;
                            $data_result[$pos]['valorIncremento'] = $valorRepoEnt;
                            $data_result[$pos]['cantTotal'] = $cantIncEnt + $cantRepEnt;
                            $data_result[$pos]['valorTotal'] = $valorIncEnt + $valorRepoEnt;
                            $data_result[$pos]['negrita'] = true;
                            $pos++;
                        }
                        foreach ($data as $k => $val) {

                            $arrayInv[0]['idinversion'] = $val['idinversion'];
                            $datosplan3 = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $arrayInv, $mon, 9/*$di[0]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION
                            $datosplan4 = $objinversion->listarIndicadoresPlanCmpReportes($params['ejercicio'], $params['cadenaEquipoWHERE'], $arrayInv, $mon, 10/*$di[1]*/, $params['idejercicio'], $nivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO

                            foreach ($datosplan4 as $key => $v) {
                                $datosplan4[$key]['cantidad2'] = $v['cantidad'];
                                $datosplan4[$key]['precio2'] = $v['precio'];
                            }
                            foreach ($datosplan3 as $key => $v) {
                                $datosplan3[$key]['cantidad1'] = $v['cantidad'];
                                $datosplan3[$key]['precio1'] = $v['precio'];
                            }

                            $equp = array();
                            $array4 = array_merge($datosplan4, $datosplan3);
                            $i = 0;
                            $y = 0;
                            $sumas = array();
                            $Xarbol = array();
                            foreach ($array4 as $key => $value1) {
                                if ($value1['nivel'] == 4) {
                                    $sumas['sumaCantRepo'] += $value1['cantidad2'];
                                    $sumas['sumaCantInc'] += $value1['cantidad1'];
                                    $import = round($value1['precio2'], 2) * $value1['cantidad2'];
                                    $sumas['sumaValRepo'] += $import;
                                    $import1 = round($value1['precio1'], 2) * $value1['cantidad1'];
                                    $sumas['sumaValInc'] += $import1;
                                    $Xarbol[$value1['idarbol']]['CantRepo'] += $value1['cantidad2'];
                                    $Xarbol[$value1['idarbol']]['CantInc'] += $value1['cantidad1'];
                                    $importArb = round($value1['precio2'], 2) * $value1['cantidad2'];
                                    $Xarbol[$value1['idarbol']]['ValRepo'] += $importArb;
                                    $importArb1 = round($value1['precio1'], 2) * $value1['cantidad1'];
                                    $Xarbol[$value1['idarbol']]['ValInc'] += $importArb1;
                                }
                            }
                            if (($sumas['sumaValRepo'] != 0) || ($sumas['sumaValInc'] != 0)) {

                                if ($mostrarinv == 1) {
                                    $data_result[$pos]['denom'] = "\"" . " " . $val['denominacion'];
                                    $data_result[$pos]['cantReposicion'] = $sumas['sumaCantRepo'];
                                    $data_result[$pos]['valorReposicion'] = $sumas['sumaValRepo'];
                                    $data_result[$pos]['cantIncremento'] = $sumas['sumaCantInc'];
                                    $data_result[$pos]['valorIncremento'] = $sumas['sumaValInc'];
                                    $data_result[$pos]['cantTotal'] = $sumas['sumaCantInc'] + $sumas['sumaCantRepo'];
                                    $data_result[$pos]['valorTotal'] = $sumas['sumaValInc'] + $sumas['sumaValRepo'];
                                    $data_result[$pos]['color'] = '#DCDDD9 ';
                                    $pos++;
                                }

                                $denominacion = '';
                                $denominacion1 = '';
                                $denominacion2 = '';

//    pre_r($array4);
                                foreach ($array4 as $k => $va) {
                                    $idarbol = $va['idarbol'];
                                    if ($va['nivel'] == 1 && $va['idinversion'] == $val['idinversion'] && $va['nivel'] <= $nivel) {
                                        if ($denominacion != $va['denominacion']) {
                                            $denotabla = $va['denominacion'];
                                            $denominacion = $va['denominacion'];

                                            $data_result[$pos]['denom'] = "." . " " . "." . " " . $denotabla;
                                            $data_result[$pos]['cantReposicion'] = $Xarbol[$idarbol]['CantRepo'];
                                            $data_result[$pos]['valorReposicion'] = $Xarbol[$idarbol]['ValRepo'];
                                            $data_result[$pos]['cantIncremento'] = $Xarbol[$va['idarbol']]['CantInc'];
                                            $data_result[$pos]['valorIncremento'] = $Xarbol[$va['idarbol']]['ValInc'];
                                            $data_result[$pos]['cantTotal'] = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                            $data_result[$pos]['valorTotal'] = $Xarbol[$va['idarbol']]['ValRepo'] + $Xarbol[$va['idarbol']]['ValInc'];
                                            $pos++;
                                        }
                                    }
                                    if ($va['nivel'] == 2 && $va['idinversion'] == $val['idinversion'] && $va['nivel'] <= $nivel) {
                                        $denotabla1 = $va['denominacion'];
                                        $denominacion1 = $va['denominacion'];

                                        if ($denominacion1 != $va['denominacion']) {
                                            //print_r('entra');die;

                                            $data_result[$pos]['denom'] = "." . " " . "." . " " . $denotabla1;
                                            $data_result[$pos]['denom'] = "   " . $denotabla1;
                                            $data_result[$pos]['cantReposicion'] = $Xarbol[$idarbol]['CantRepo'];
                                            $data_result[$pos]['valorReposicion'] = $Xarbol[$idarbol]['ValRepo'];
                                            $data_result[$pos]['cantIncremento'] = $Xarbol[$va['idarbol']]['CantInc'];
                                            $data_result[$pos]['valorIncremento'] = $Xarbol[$va['idarbol']]['ValInc'];
                                            $data_result[$pos]['cantTotal'] = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                            $data_result[$pos]['valorTotal'] = '';
                                            $pos++;
                                        }
                                    }
                                    if ($va['nivel'] == 3 && $va['idinversion'] == $val['idinversion'] && $va['nivel'] <= $nivel) {
                                        $denotabla2 = $va['denominacion'];
                                        $denominacion2 = $va['denominacion'];

                                        if ($denominacion2 != $va['denominacion']) {

                                            $data_result[$pos]['denom'] = "." . " " . "." . " " . $denotabla2;
                                            $data_result[$pos]['cantReposicion'] = $Xarbol[$idarbol]['CantRepo'];
                                            $data_result[$pos]['valorReposicion'] = $Xarbol[$idarbol]['ValRepo'];
                                            $data_result[$pos]['cantIncremento'] = $Xarbol[$va['idarbol']]['CantInc'];
                                            $data_result[$pos]['valorIncremento'] = $Xarbol[$va['idarbol']]['ValInc'];
                                            $data_result[$pos]['cantTotal'] = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                            $data_result[$pos]['valorTotal'] = '';
                                            $pos++;
                                        }
                                    }
                                    if ($va['nivel'] == 4 && $va['idinversion'] == $val['idinversion'] && $va['nivel'] <= $nivel) {
                                        $data_result[$pos]['denom'] = ". . . . " . $va['denominacion'];
                                        $data_result[$pos]['cantReposicion'] = round($va['cantidad2'], 0);
                                        $data_result[$pos]['valorReposicion'] = $va['cantidad2'] * round($va['precio2'], 2);
                                        $data_result[$pos]['cantIncremento'] = round($va['cantidad1'], 0);
                                        $data_result[$pos]['valorIncremento'] = $va['cantidad1'] * round($va['precio1'], 2);
                                        $data_result[$pos]['cantTotal'] = $va['cantidad2'] + $va['cantidad1'];
//                                        $data_result[$pos]['cantTotal'] = $va['cantidad2'] * round($va['precio2'], 2) + $va['cantidad1'] * round($va['precio1'], 2);
                                        $data_result[$pos]['valorTotal'] = '';
                                        $pos++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
//            die('e');
        }


        $result[0]->tipo = 'multiheader';
        $result[0]->encabezados = $encabezados;
        $result[0]->datos = $data_result;
        $result['subsistema'] = 'inversiones';
        $result['titulo'] = 'Demanda de Equipos automotores';

        return $result;
    }

    public function getDatosRepBalanceEquipos($parametros) {

        $tipoE = 0;
        $pos = 0;
        $columnasEquipos = array();
        $datospintar = DatEtapaEquipo::EquiposTercerNCompReportes($parametros);
//print_r($datospintar);die;

        foreach ($datospintar as $key => $value) {
            $adquirir = DatEtapaEquipo::nomAdquisicionCompReportes($value['idindicador'], 2, 1, $parametros);
//pre_r($adquirir);pre_r('---');pre_r($adquirir);
            if (count($adquirir) > 0) {
                $datospintar[$key]['adq'] = $adquirir;
                $columnasEquipos[$pos] = $value['denominacion'];
                //$columnasEquiposAdquirir[$pos]['adq'] = $adquirir;
                $pos++;
                $tipoE = $tipoE + 1;
            } else {
                unset($datospintar[$key]);
            }
        }//die;



        $datospintar = array_values($datospintar);
        //pre_r($datospintar);die;
        for ($index = 0; $index < count($datospintar); $index++) {
            $valuesAdquirir = array();
            $referenciasValuesAdquirir = array();
            for ($in = 0; $in < count($datospintar[$index]['adq']); $in++) {
                $st = $datospintar[$index]['adq'][$in]['denominacion'];
                $valuesAdquirir[] = $st;
                $referenciasValuesAdquirir[] = $datospintar[$index]['denominacion'] . $st;
            }
            $columnasEquiposAdquirir[$index] = $valuesAdquirir;
            $referenciasEquiposAdquirir[$index] = $referenciasValuesAdquirir;
        }

        //formar las columnas y sus referencias
        $encabezados = array();
        $encabezados[0] = array(
            'tipo' => 'rowspan',
            'rowspan' => 2,
            'emptyvalue' => '0',
            'header' => 'BALANCE ' . $parametros['ejercicio'] . ' VEHICULOS DE MOTOR',
            'columnas' => 'BALANCE ' . $parametros['ejercicio'] . ' VEHICULOS DE MOTOR',
            'referencias' => array('balance')
        );

        foreach ($columnasEquipos as $key => $value) {
            $encabezados[] = array(
                'tipo' => 'simple',
                'emptyvalue' => ' ',
                'header' => $value,
                'columnas' => $columnasEquiposAdquirir[$key],
                'referencias' => $referenciasEquiposAdquirir[$key]
            );
        }

        $encabezados[count($columnasEquipos) + 1] = array(
            'tipo' => 'rowspan',
            'rowspan' => 2,
            'emptyvalue' => '0',
            'header' => 'TOTAL ',
            'columnas' => 'TOTAL ',
            'referencias' => array('total')
        );

        $indice = 0;
        $data_result = array();

        //print_r($data_result);die;
        $data_result[0] = self::equiposEsp($datospintar, 'TOTAL FUENTES', $tipoE, 11, $parametros);
        $data_result[1] = self::equiposEsp($datospintar, 'Inventario Comercializadoras(' . ($parametros['ejercicio'] - 1) . ')', $tipoE, 11, $parametros);
        $data_result[2] = self::equiposEsp($datospintar, 'Bajas Turisticas (TRANSTUR y TRANSGAVIOTA)', $tipoE, 11, $parametros);
        $data_result[2] = self::equiposEsp($datospintar, 'PRODUCCION NACIONAL', $tipoE, 11, $parametros);
        $data_result[4] = self::equiposEsp($datospintar, 'A importar', $tipoE, 11, $parametros);
        $data_result[5] = self::equiposEsp($datospintar, 'Importaciones Centralizadas(MINSAP y Comunales)', $tipoE, 11, $parametros);
        $data_result[6] = self::equiposEsp($datospintar, 'Inventario en TRANSIMPORT', $tipoE, 11, $parametros);
        $data_result[7] = self::equiposEsp($datospintar, 'Otras fuentes', $tipoE, 11, $parametros);
        $data_result[8] = self::equiposEsp($datospintar, 'TOTAL DESTINOS', $tipoE, 11, $parametros);
        $data_result[9] = self::equiposEsp($datospintar, 'REPOSICION DEL SEGURO (PERSONAS JURIDICAS)', $tipoE, 11, $parametros);
        $data_result[10] = self::equiposEsp($datospintar, 'REPOSICION DEL SEGURO (PERSONAS NATURALES)', $tipoE, 11, $parametros);
        $data_result[11] = self::equiposEsp($datospintar, 'REPOSICION EQUIPOS A LA EMAE', $tipoE, 11, $parametros);
        $data_result[12] = self::equiposEsp($datospintar, 'VEHICULOS P ETT', $tipoE, 3, $parametros);
        $data_result[13] = self::equiposEsp($datospintar, 'VEHICULOS P TAXICUBA', $tipoE, 4, $parametros);
        $data_result[14] = self::equiposEsp($datospintar, 'GLORIAS DEPORTIVAS', $tipoE, 5, $parametros);
        $data_result[15] = self::equiposEsp($datospintar, 'REORDENAMIENTO DE PIQUERAS TOTAL', $tipoE, 8, $parametros);
        $data_result[16] = self::equiposEsp($datospintar, 'REORDENAMIENTO PIQUERAS OACES', $tipoE, 6, $parametros);
        $data_result[17] = self::equiposEsp($datospintar, 'REORDENAMIENTO PIQUERAS CAP', $tipoE, 7, $parametros);
        $data_result[18] = self::equiposEsp($datospintar, 'CIMEX (Ventas personas naturales Cubanas)', $tipoE, 11, $parametros);
        $data_result[19] = self::equiposEsp($datospintar, 'RESERVA PARA EL ESTADO', $tipoE, 11, $parametros);
        $data_result[20] = self::equiposEsp($datospintar, 'OTRAS INVERSIONES APROBADAS', $tipoE, 12, $parametros);
        $data_result[21] = self::equiposEsp($datospintar, 'EN PLAZA', $tipoE, 1, $parametros);
        $data_result[22] = self::equiposEsp($datospintar, 'DE IMPORTACION', $tipoE, 2, $parametros);
        $data_result[23] = self::equiposEsp($datospintar, 'RESULTADO ', $tipoE, 10, $parametros);
        //print_r($data_result);die;

        $result[0]->tipo = 'multiheader';
        $result[0]->encabezados = $encabezados;
        $result[0]->datos = $data_result;
        $result['subsistema'] = 'inversiones';
        $result['titulo'] = 'Balance de Equipos automotores';

        return $result;
    }

    public function equiposEsp($datospintar, $text, $tipoE, $n, $parametros) {//nomAdquisicion
        $datos = array();
        $datos['balance'] = $text;
        //$n = 8;
        //pre_r($datospintar);die;
        $totalFila = 0;
        for ($ind = 0; $ind <= $tipoE; $ind++) {
            $ad = $datospintar[$ind]['adq'];
            for ($in = 0; $in < count($ad); $in++) {
                $cantEspeNuevo[0]['sum'] = 0;
                if ($n == 1) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico(array(107), $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 2) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico(array(108), $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 5) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico(array(107), $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 4 || $n == 3 || $n == 6 || $n == 7) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico([107, 108], $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 8) {

                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico([107, 108], $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                } else if ($n == 12) {
                    $cantEspeNuevo = DatEtapaEquipo::cantEspecifico([107, 108], $ad[$in]['idadquisicion'], $datospintar[$ind]['idindicador'], $n, $parametros); //ids plaza y nuevo
                }
                $totalFila = $cantEspeNuevo[0]['sum'] + $totalFila;
                if ($n == 4 || $n == 3 || $n == 6 || $n == 7 || $n == 2 || $n == 1 || $n == 5 || $n == 8 || $n == 12) {
                    $datos[$datospintar[$ind]['denominacion'] . $ad[$in]['denominacion']] = $cantEspeNuevo[0]['sum'];
                } else {
                    $datos[$datospintar[$ind]['denominacion'] . $ad[$in]['denominacion']] = '';
                }
            }
        }
        $datos['total'] = $totalFila;
        return $datos;
    }

    public function getDatosRepMaqueta($org, $ent, $params, $FP) {
        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        /* if ($org[0] == null) {
          $org = self::cargarOrganismos();
          } */

        if ($org[0] == null) {
            $selectDenomOrganismo = 0;
            $org = self::cargarTodosOrganismosYArrayHijas($this->global->Perfil->iddominio, $selectDenomOrganismo);
            $entidades = $org[0]['dato'];
        } else {
            foreach ($org as $k => $valueorg) {
                $idestructuras = array();
                //$idest = self::cargarEntidades($valueorg);
                $idest = self::buscarEntidadesTodas($valueorg);

                if ($ent[0] != null) {
                    foreach ($idest as $key => $valor) {
                        if (in_array($valor, $ent))
                            $idestructuras[] = $valor;
                    }
                } else
                    $idestructuras = $idest;


                for ($index9 = 0; $index9 < count($idestructuras); $index9++) {
                    $organismos1[] = $idestructuras[$index9];
                }
            }
            $entidades = implode(",", array_values($organismos1));
        }

        //hom�logo del m�todo getInversionesDadoEntidadesYFormaPropiedad usado en el reporte  Maqueta
        //en el componente Plan de inversiones
        // ---------- Todas las inversiones de todas las entidades y formas de propiedad o las seleccionadas --------------------------
        $inversiones = DatInversion::getInversionesDadoEntidadesYFormaPropiedadNS($params['idejercicio'], $entidades, $params, $FP);

        $idinversiones = "";
        if (count($inversiones) > 0){
            foreach ($inversiones as $i => $inv) {
                if ($i == 0) {
                    $idinversiones .= $inv['idinversion'];
                } else {
                    $idinversiones .= "," . $inv['idinversion'];
                }
            }
        }
        // ---------- Totales para cada financista de todas las inversiones en todas las formas de propiedad ----------

        $arregloMonedas = "'" . CUP . "'";
//        $arregloMonedas = "'" . USD . "'"; //estaba este pero los quien financia es CUP
        //hom�logo del m�todo TotalPlanEjercicioActualPorCadaFinancista usado en el reporte  Maqueta
        //en el componente Plan de inversiones
        $financistasGenerales = DatInversion::TotalPlanEjercicioActualPorCadaFinancistaNS($idinversiones, $params, $arregloMonedas);
        $monedas[0] = 'CUP';
        $monedas[1] = 'USD';

        //formar las columnas y sus referencias
        $arrcolumnas[] = 'OACE/FORMA DE PROPIEDAD/COMPONENTES';
        //$arrcolumnas[] = 'PLAN MP';
        //$arrcolumnas[] = 'PLAN MUSD';

        foreach ($monedas as $moneda) {
            $arrcolumnas[] = 'PLAN' . ' ' . $moneda;
        }

        $arrcolumnas[] = 'Total como se financia';
        $arrcolumnas[] = 'CONTADO';
        $arrcolumnas[] = 'CR&Eacute;DITO';
        $arrcolumnas[] = 'Total quien financia';

        $arrreferencias = array();
        $arrreferencias[] = 'denom';
        //$arrreferencias[] = 'mptotal';
        //$arrreferencias[] = 'usdtotal';

        foreach ($monedas as $moneda) {
            $arrreferencias[] = $moneda . 'total';
        }
        $arrreferencias[] = 'totalCF';
        $arrreferencias[] = 'cont';
        $arrreferencias[] = 'cred';
        $arrreferencias[] = 'totalQF';
        foreach ($financistasGenerales as $key => $value) {
            $arrcolumnas[] = $value['denominacion'];
            $arrreferencias[] = $value['iddatosnomenclador'];
        }
        $arrcolumnas[] = 'EROG LIQ';
        $arrcolumnas[] = 'CTT EXT';
        $arrreferencias[] = 'erog';
        $arrreferencias[] = 'cit';

        //formar un arreglo con los datos listos para generar el reporte

        $dat = self::ordenarDatosMaqueta($params, $entidades, $FP, $financistasGenerales);

        //formar el arreglo con todos los par�metros para generar el reporte
        $data[0]->tipo = 'estandar';
        $data[0]->datos = $dat;
        $data[0]->columnas = $arrcolumnas;
        $data[0]->referencias = $arrreferencias;
        $data[0]->emptyvalue = " ";
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'Maqueta';
        $data['organismo'] = $params['filtros'][0]['cbxOrganismo'];

        return $data;
    }

    public function getDatosNivelAct($param, $org) {
        if ($org[0] == null) {
            $selectDenomOrganismo = 0;
            $org = self::cargarTodosOrganismosYArrayHijas($this->global->Perfil->iddominio, $selectDenomOrganismo);
            $entidades = $org[0]['dato'];
        } else {
            foreach ($org as $k => $valueorg) {
                $idestructuras = array();
                //$idest = self::cargarEntidades($valueorg);
                $idest = self::buscarEntidadesTodas($valueorg);

                if ($ent[0] != null) {
                    foreach ($idest as $key => $valor) {
                        if (in_array($valor, $ent))
                            $idestructuras[] = $valor;
                    }
                } else
                    $idestructuras = $idest;


                for ($index9 = 0; $index9 < count($idestructuras); $index9++) {
                    $organismos1[] = $idestructuras[$index9];
                }
            }
            $entidades = implode(",", array_values($organismos1));
        }
        $arrcolumnas[] = 'Inversion';
        $arrreferencias[] = 'inversion';
        $arrcolumnas[] = 'Constructor';
        $arrreferencias[] = 'constructor';
        $arrcolumnas[] = 'Provincia';
        $arrreferencias[] = 'provincia';
        $arrcolumnas[] = 'Organismo';
        $arrreferencias[] = 'organismo';
        $arrcolumnas[] = 'Entidad';
        $arrreferencias[] = 'entidad';
        $arrcolumnas[] = 'Grupo de Obra';
        $arrreferencias[] = 'grupoobra';
        $arrcolumnas[] = 'Valor';
        $arrreferencias[] = 'valor';

        $datos = DatConstructor::datNivelAct($param, $entidades);

        $data[0]->tipo = 'estandar';
        $data[0]->datos = $datos;
        $data[0]->columnas = $arrcolumnas;
        $data[0]->referencias = $arrreferencias;
        $data[0]->emptyvalue = " ";
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'Nivel de actividad por constructor en M' . $datos[0]['codigoiso'];

        return $data;
    }

    public function getDatosRepAcreedorInversion($org, $params, $ent, $mon) {
        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            $org = self::cargarOrganismos();
        }

        //formar las columnas y sus referencias
        $arrcolumnas[] = 'Acreedor/Inversi&oacute;n';
        $arrcolumnas[] = 'Plan';
        $arrcolumnas[] = 'Cr&eacute;dito';
        $arrcolumnas[] = 'Gracia';
        $arrcolumnas[] = 'Amortizaci&oacute;n';
        $arrcolumnas[] = '% Inter&eacute;s';

        $arrreferencias = array();
        $arrreferencias[] = 'denom';
        $arrreferencias[] = 'plan';
        $arrreferencias[] = 'credito';
        $arrreferencias[] = 'gracia';
        $arrreferencias[] = 'amort';
        $arrreferencias[] = 'interes';

        //formar un arreglo con los datos listos para generar el reporte
        $dat = self::ordenarDatosAcreedorInversion($org, $params, $ent, $mon);
        //formar el arreglo con todos los par�metros para generar el reporte
        $data[0]->tipo = 'estandar';
        $data[0]->datos = $dat;
        $data[0]->columnas = $arrcolumnas;
        $data[0]->referencias = $arrreferencias;
        $data[0]->emptyvalue = 0;
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'Acreedor - Inversi&oacute;n';

        return $data;
    }

    public function getDatosRepInversionAcreedor($org, $params, $ent, $mon) {
        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            $org = self::cargarOrganismos();
        }

        //formar las columnas y sus referencias
        $arrcolumnas[] = 'Inversi&oacute;n/Acreedor';
        $arrcolumnas[] = 'Plan';
        $arrcolumnas[] = 'Cr&eacute;dito';
        $arrcolumnas[] = 'Gracia';
        $arrcolumnas[] = 'Amortizaci&oacute;n';
        $arrcolumnas[] = '% Inter&eacute;s';

        $arrreferencias = array();
        $arrreferencias[] = 'denom';
        $arrreferencias[] = 'plan';
        $arrreferencias[] = 'credito';
        $arrreferencias[] = 'gracia';
        $arrreferencias[] = 'amort';
        $arrreferencias[] = 'interes';

        //formar un arreglo con los datos listos para generar el reporte
        $dat = self::ordenarDatosInversionAcreedor($org, $params, $ent, $mon);
// print_r($dat);die;
        //formar el arreglo con todos los par�metros para generar el reporte
        $data[0]->tipo = 'estandar';
        $data[0]->datos = $dat;
        $data[0]->columnas = $arrcolumnas;
        $data[0]->referencias = $arrreferencias;
        $data[0]->emptyvalue = 0;
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'Inversi&oacute;n - Acreedor';

        return $data;
    }

    public function getDatosRepConsMont($params, $org, $mostrarinv, $ent) {

        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            $iddominio = $this->global->Perfil->iddominio;
            //$org = self::cargarTodosOrganismosYArrayHijas($iddominio);
            //$org = self::cargarTodosOrganismosEHijas($iddominio);
            $org = self::cargarOrganismos();
            //print_r($org);die;
            unset($org[0]);
        }
        //print_r($org);die;
        //formar las columnas y sus referencias(depende de si se deben mostrar las inversiones)
        $arrcolumnas[] = 'Organismo inversionista/Inversi&oacute;n/Constructor';
        if ($mostrarinv == 1) {
            $arrcolumnas[] = 'Provincia';
        }
        $arrcolumnas[] = 'Plan - Forma de propiedad';
        $arrcolumnas[] = 'Plan - MP';
        $arrcolumnas[] = 'Plan - USD';

        $arrreferencias = array();
        $arrreferencias[] = 'denom';
        if ($mostrarinv == 1) {
            $arrreferencias[] = 'prov';
        }
        $arrreferencias[] = 'forma';
        $arrreferencias[] = 'cup';
        $arrreferencias[] = 'usd';

        //guarda el id de las monedas
        $params['usd'] = 9900000046;
        $params['mp'] = 9900000103;

        //formar un arreglo con los datos listos para generar el reporte
        $dat = array();
        $pos = 0;
        //
        foreach ($org as $key => $value) {
            $this->totalorgent = array();
            //hom�logo del m�todo listarConstructorDenominacion usado en el reporte  Construccion y montaje
            //en el componente Plan de inversiones

            $datos = DatInversion::listarConstruccionyMontajeI($params, $value);

            //---------------------------------------------------INVERSIONES DE LOS ORGANISMOS------------------------------------------
            $denominv = "";
            if (count($datos) > 0) {
                $dat[$pos]['denom'] = 'ORGANISMO PADRE';
                $dat[$pos]['color'] = '#DCDDD9';
                $dat[$pos]['negrita'] = true;
                $dat[$pos]['prov'] = " ";
                $dat[$pos]['forma'] = " ";
                $dat[$pos]['cup'] = " ";
                $dat[$pos]['usd'] = " ";
                $pos++;
            }

            foreach ($datos as $key => $val) {
                if ($mostrarinv == 1) {
                    if ($denominv != $val['denominacion']) {
                        $dat[$pos]['denom'] = $val['denominacion'];
                        $dat[$pos]['negrita'] = true;
                        $dat[$pos]['prov'] = " ";
                        $d = DatInversion::listarConstruccionyMontajeI($params, $value, $val['idinversion'], 1);
                        $dat[$pos]['forma'] = $val['forma'];
                        $dat[$pos]['cup'] = $d[0]['cup'];
                        $dat[$pos]['usd'] = $d[0]['usd'];
                        $pos++;
                        $dat[$pos]['denom'] = $val['dencont'];
                        $dat[$pos]['forma'] = " ";
                        $dat[$pos]['prov'] = $val['prov'];
                        $dat[$pos]['cup'] = $val['cup'];
                        $dat[$pos]['usd'] = $val['usd'];
                        $pos++;
                        $denominv = $val['denominacion'];
                    } else {
                        $dat[$pos]['denom'] = $val['dencont'];
                        $dat[$pos]['prov'] = $val['prov'];
                        $dat[$pos]['forma'] = " ";
                        $dat[$pos]['cup'] = $val['cup'];
                        $dat[$pos]['usd'] = $val['usd'];
                        $pos++;
                    }
                } else {
                    if ($denominv != $val['denominacion']) {
                        $dat[$pos]['denom'] = $val['denominacion'];
                        $dat[$pos]['prov'] = " ";
                        $dat[$pos]['forma'] = $val['forma'];
                        $d = DatInversion::listarConstruccionyMontajeI($params, $value, $val['idinversion'], 1);
                        $dat[$pos]['cup'] = $d[0] ['cup'];
                        $dat[$pos]['usd'] = $d[0]['usd'];
                        $pos++;
                        $denominv = $val['denominacion'];
                    }
                }
            }
            //------------------------------------------END INVERSIONES DE LOS ORGANISMOS ------------------------------------
            if ($datos[0]['idinversion'] != null)
            //formar un arreglo con los datos listos para generar el reporte
                array_merge($dat, self::calcularTotalesOrdenarDatosCyM($datos, $mostrarinv, $value, $pos));

            $hijasorg = self::buscarEntidades($value);

            //
            foreach ($hijasorg as $k => $val) {
                if ($ent[0] != null) {
                    if (in_array($val, $ent)) {
                        $datos = DatInversion::listarConstruccionyMontajeI($params, $val);
                        $pos = 0;
                        if ($datos[0]['idinversion'] != null)
                            $dat = array_merge($dat, self::calcularTotalesOrdenarDatosCyM($datos, $mostrarinv, $val, $pos));
                    }
                } else {
                    $datos = DatInversion::listarConstruccionyMontajeI($params, $val);
                    $pos = 0;
                    if ($datos[0]['idinversion'] != null)
                        $dat = array_merge($dat, self::calcularTotalesOrdenarDatosCyM($datos, $mostrarinv, $val, $pos));
                }
            }

            //$tempEnt = self::buscarEntidades($value);
            $tempEnt = DatInversion::getDatosEstructura($value);

            if ($this->totalorgent['cup'] != 0 || $this->totalorgent['usd'] != 0) {
                $datorg[0]['denom'] = 'Total del organismo ' . $tempEnt['denominacion'];
                $datorg[$pos]['color'] = '#DCDDD9';
                $datorg[$pos]['negrita'] = true;
                if ($mostrarinv == 1)
                    $datorg[0]['prov'] = " ";
                $datorg[$pos]['forma'] = " ";
                $datorg[0]['cup'] = $this->totalorgent['cup'];
                $datorg[0]['usd'] = $this->totalorgent['usd'];

                $dat = array_merge($dat, $datorg);

                $this->total['usd'] += $this->totalorgent['usd'];
                $this->total['cup'] += $this->totalorgent['cup'];
            }
        }

        $datt[0]['denom'] = 'TOTAL';
        $datt[$pos]['color'] = '#DCDDD9';
        $datt[$pos]['negrita'] = true;
        if ($mostrarinv == 1)
            $datt[0]['prov'] = " ";
        $datt[$pos]['forma'] = " ";
        $datt[0]['cup'] = $this->total['cup'];
        $datt[0]['usd'] = $this->total['usd'];

        $dat = array_merge($dat, $datt);

        //formar el arreglo con todos los par�metros para generar el reporte
        $data[0]->tipo = 'estandar';
        $data[0]->datos = $dat;
        $data[0]->columnas = $arrcolumnas;
        $data[0]->referencias = $arrreferencias;
        $data[0]->emptyvalue = 0;
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'CONSTRUCCI&Oacute;N Y MONTAJE';

        return $data;
    }

    public function getDatosRepConsMontPorConst($params, $org, $mostrarinv, $ent) {
        //formar el arreglo de organos en caso de que no se seleccionara ninguno
        if ($org[0] == null) {
            $iddominio = $this->global->Perfil->iddominio;
            $result = self::cargarTodosOrganismosYArrayHijas($iddominio);
            $org = explode(',', $result[0]['dato']);
        }

        //formar las columnas y sus referencias(depende de si se deben mostrar las inversiones)
        $arrcolumnas[] = 'Organismo inversionista/Constructor/Inversi&oacute;n';
        if ($mostrarinv == 1) {
            $arrcolumnas[] = 'Provincia';
        }
        $arrcolumnas[] = 'Plan - MP';
        $arrcolumnas[] = 'Plan - USD';

        $arrreferencias = array();
        $arrreferencias[] = 'denom';
        if ($mostrarinv == 1) {
            $arrreferencias[] = 'prov';
        }

        $arrreferencias[] = 'cup';
        $arrreferencias[] = 'usd';

        //guarda el id de las monedas
        $params['usd'] = 9900000046;
        $params['mp'] = 9900000103;

        //formar un arreglo con los datos listos para generar el reporte
        $dat = array();
//pre_r($org);die;
        foreach ($org as $key => $value) {
            $this->totalorgent = array();
            //hom�logo del m�todo listarConstructorDenominacionC usado en el reporte  Construccion y montaje por constructor
            //en el componente Plan de inversiones
            $datos = DatInversion::listarConstruccionyMontaje($params, $value);
            $pos = 0;
            if ($datos[0]['idinversion'] != null)
            //formar un arreglo con los datos listos para generar el reporte
                $arrtemp = self::calcularTotalesOrdenarDatos($datos, $mostrarinv, $value, $pos);
            $dat = array_merge($dat, $arrtemp);
            $hijasorg = self::buscarEntidades($value);

            foreach ($hijasorg as $k => $val) {
                if ($ent[0] != null) {
                    if (in_array($val, $ent)) {
                        $datos = DatInversion::listarConstruccionyMontaje($params, $val);
                        $pos = 0;
                        if ($datos[0]['idinversion'] != null)
                            $dat = array_merge($dat, self::calcularTotalesOrdenarDatos($datos, $mostrarinv, $val, $pos));
                    }
                } else {
                    $datos = DatInversion::listarConstruccionyMontaje($params, $val);
                    $pos = 0;
                    if ($datos[0]['idinversion'] != null)
                        $dat = array_merge($dat, self::calcularTotalesOrdenarDatos($datos, $mostrarinv, $val, $pos));
                }
            }
            $tempEnt = $this->integrator->metadatos->DameEstructura($value);
            $datorg[0]['denom'] = 'Total del organismo ' . $tempEnt[0]->denominacion;
            $datorg[$pos]['color'] = '#DCDDD9';
            $datorg[$pos]['negrita'] = true;
            if ($mostrarinv == 1)
                $datorg[0]['prov'] = " ";
            $datorg[0]['cup'] = $this->totalorgent['cup'];
            $datorg[0]['usd'] = $this->totalorgent['usd'];

            $dat = array_merge($dat, $datorg);

            $this->total['usd'] += $this->totalorgent['usd'];
            $this->total['cup'] += $this->totalorgent['cup'];
        }

        $datt[0]['denom'] = 'TOTAL';
        $datt[$pos]['color'] = '#DCDDD9';
        $datt[$pos]['negrita'] = true;
        if ($mostrarinv == 1)
            $datt[0]['prov'] = " ";
        $datt[0]['cup'] = $this->total['cup'];
        $datt[0]['usd'] = $this->total['usd'];

        $dat = array_merge($dat, $datt);

        //formar el arreglo con todos los par�metros para generar el reporte
        $data[0]->tipo = 'estandar';
        $data[0]->datos = $dat;
        $data[0]->columnas = $arrcolumnas;
        $data[0]->referencias = $arrreferencias;
        $data[0]->emptyvalue = 0;
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'CONSTRUCCI&Oacute;N Y MONTAJE POR CONSTRUCTOR';

        return $data;
    }

    private function reporteMincex($params) {

        $datosinversion = DatInversion::getDatosRptMINCEX($params);
// print_r($datosinversion);die;
        $quienfinancia = DatInversion::getQuienFinancia();
        $componentes = DatInversion::getComponentes();
        $result = array();
        $auxresult = $datosinversion;
        $index = 0;
        $plantotalUSD = 0;

        $data[0]->encabezados = array(
            array(
                'tipo' => 'simple',
                'inside' => 'datosinversion',
                'emptyvalue' => '-',
                'header' => 'ATRIBUTOS GENERALES DE LA INVERSI&Oacute;N',
                'columnas' => array('ORGANISMO', 'ENTIDAD', 'CODIGO INV', 'INVERSI&Oacute;N', 'TIPO DE INVERSI&Oacute;N',
                    'ESTADO EN EL PLAN ACTUAL', 'FORMA DE PROPIEDAD', 'PROVINCIA', 'PROGRAMA',
                    'FECHA DE INICIO', 'FECHA DE TERMINACI&Oacute;N', 'MEDIO AMBIENTE',
                    'OBJETIVO DE LA INVERSI&Oacute;N', 'GRUPO OBRA', 'SECTOR ESTRAT&Eacute;GICO', 'EFECTO EN COMEX'),
                'referencias' => array('organismo', 'entidad', 'codigo', 'denominacion', 'tipoinversion',
                    'estadoinversion', 'formapropiedad', 'provincia', 'programa',
                    'fechainicio', 'fechafin', 'medioambiente', 'objetivo', 'grupoobra', 'sector', 'efectocomercial')
        ));

        $data[0]->encabezados[] = array(
            'tipo' => 'simple',
            //'inside' => 'datosinversion',
            'emptyvalue' => 0,
            //'actual' => 'actual',
            'header' => '',
            'columnas' => array('IMPACTO POR INCREMENTO SALARIAL MT'),
            'referencias' => array('impactoSalarial')
        );

        $planCmpMP = array(
            'tipo' => 'simple',
            'emptyvalue' => 0,
            'actual' => 'actual',
            'header' => 'PLAN Componentes (MP)',
            'columnas' => array('MONEDA TOTAL (MP)'),
            'referencias' => array('monedatotal')
        );

        foreach ($componentes as $cmp) {
            $planCmpMP['columnas'][] = '' . $cmp['denominacion'] . ' (MP)';
            $planCmpMP['referencias'][] = 'cmp' . $cmp['idnombreetapa'];
        }

        $planCmpMP['columnas'][] = 'PP (MP)';
        $planCmpMP['referencias'][] = 'ppmp';

        $data[0]->encabezados[] = $planCmpMP;


        $planUSD = array(
            'tipo' => 'simple',
            'emptyvalue' => 0,
            'actual' => 'actual',
            'header' => 'PLAN (MUSD)',
            'columnas' => array('PLAN (MUSD) - TOTAL'),
            'referencias' => array('planusd')
        );

        $data[0]->encabezados[] = $planUSD;

        $data[0]->encabezados[] = array(
            'tipo' => 'simple',
            'inside' => 'datosinversion',
            'emptyvalue' => 0,
            'actual' => 'actual',
            'header' => '',
            'columnas' => array('CONTRATACI&Oacute;N EXTERNA (MUSD)'),
            'referencias' => array('contratacionexterna')
        );

        $comosefinanciaUSD = array(
            'tipo' => 'simple',
            'emptyvalue' => 0,
            'actual' => 'actual',
            'header' => 'Como se financia (Ejercicio Actual - MUSD)',
            'columnas' => array('TOTAL COMO SE FINANCIA (MUSD)', 'CONTADO (MUSD)', 'CR&Eacute;DITO (MUSD)'),
            'referencias' => array('totalcomousd', 'contadousd', 'creditousd')
        );
        $data[0]->encabezados[] = $comosefinanciaUSD;

        $quienfinanciaMP = array(
            'tipo' => 'simple',
            'emptyvalue' => 0,
            'actual' => 'actual',
            'header' => 'Quien financia (MP)',
            'columnas' => array('Total qui&eacute;n financia (MP)'),
            'referencias' => array('totalquien')
        );

        foreach ($quienfinancia as $financia) {
            $quienfinanciaMP['columnas'][] = '' . $financia['denominacion'] . ' (MP)';
            $quienfinanciaMP['referencias'][] = 'financusd' . $financia['idfinancista'];
        }



        foreach ($auxresult as $pos => $value) {

            $idinversionactual = $value['idinversion'];
            $next = $pos + 1;

            if ($pos != (count($auxresult) - 1)) {
                if ($idinversionactual != $auxresult[$next]['idinversion']) {
                    $result[$index]['datosinversion'] = $value;
//                            $result[$index]['plantotalusd'] = $plantotalUSD;
                    $params['idinversion'] = $idinversionactual;
                    $contados = DatInversion::getContado($params);
                    $result[$index]['contadousd'] = $contados['contadousd'];
                    $result[$index]['creditousd'] = $contados['creditousd'];
                    $result[$index]['totalcomousd'] = $contados['creditousd'] + $contados['contadousd'];
                    $index += 1;
//                            $plantotalUSD = 0;
                } else {

                    $params['idetapainversion'] = $value['idetapa'];
                    $params['denominacionetapa'] = $value['nombreetapa'];

                    $parametros['idejercicio'] = $params['idejercicio'];
                    $parametros['idmoneda'] = $params['monedausd'];
                    $parametros['idetapa'] = $value['idetapa'];
                    $otrosusd = DatEtapaInversion::cargarPresupuestoInversionXEjercicio($parametros);

//                            $plantotalUSD += $otrosusd['plan'];
                }
            } else {
                $result[$index]['datosinversion'] = $value;
//                        $result[$index]['plantotalusd'] = $plantotalUSD;
                $params['idinversion'] = $idinversionactual;
                $contados = DatInversion::getContado($params);
                $result[$index]['contadousd'] = $contados['contadousd'];
                $result[$index]['creditousd'] = $contados['creditousd'];
                $result[$index]['totalcomousd'] = $contados['creditousd'] + $contados['contadousd'];
            }
        }

        $index = 0;
        foreach ($result as $pos => $value) {
            $totalQuienFinancMP = 0;
            $params['idinversion'] = $value['datosinversion']['idinversion'];
            $financistas = DatInversion::getFinancistasReporte($params);
            foreach ($financistas as $financista) {
                $totalQuienFinancMP += $financista['planmp'];
                $result[$index]['financusd' . $financista['idfinancista']] = $financista['planmp'];
            }
            $result[$index]['totalquien'] = $totalQuienFinancMP;
            //Valor de los componentes
            $totalInversMP = 0;
            $valorCmpMP = DatInversion::getValorCmpMP($params);

            $result[$index]['impactoSalarial'] = 0;
            foreach ($valorCmpMP as $valCmp) {
                if ($valCmp['idnombreetapa'] == NULL) {
                    $result[$index]['impactoSalarial'] = $valCmp['valor'];
                } else {
                    $totalInversMP += $valCmp['valor'];
                    $result[$index]['cmp' . $valCmp['idnombreetapa']] = $valCmp['valor'];
                }
            }
            //die;
            //valor del plan de preparacion...
            //$valorPPMP = DatInversion::getPPPlanInvMP($params);
            $result[$index]['ppmp'] = $value['datosinversion']['ppmp'];

            //valor de moneda total.....
            $result[$index]['monedatotal'] = $totalInversMP /* + $value['datosinversion']['ppmp'] */;

            //valor del plan en MUSD
            $result[$index]['planusd'] = $value['datosinversion']['planusd'];

            $index += 1;
        }

        //aqui
        foreach ($result as $key => $value) {
            if ($value['ppmp'] == 0 && $value['monedatotal'] == 0 && $value['planusd'] == 0) {
                unset($result[$key]);
            }
        }
//print_r($result);die;

        $data[0]->tipo = 'multiheader';
        $data[0]->encabezados[] = $quienfinanciaMP;
        $data[0]->datos = $result;

        $data['titulo'] = 'MINCEX';
        $data['subsistema'] = 'inversiones';

        return $data;
    }

    public function getDatosRepNivActPorCons($params, $org, $ent) {
        if ($org[0] == null) {
            $selectDenomOrganismo = 0;
            $org = self::cargarTodosOrganismosYArrayHijas($this->global->Perfil->iddominio, $selectDenomOrganismo);
            $entidades = $org[0]['dato'];
        } else {
            foreach ($org as $k => $valueorg) {
                $idestructuras = array();
                //$idest = self::cargarEntidades($valueorg);
                $idest = self::buscarEntidadesTodas($valueorg);

                if ($ent[0] != null) {
                    foreach ($idest as $key => $valor) {
                        if (in_array($valor, $ent))
                            $idestructuras[] = $valor;
                    }
                } else
                    $idestructuras = $idest;


                for ($index9 = 0; $index9 < count($idestructuras); $index9++) {
                    $organismos1[] = $idestructuras[$index9];
                }
            }
            $entidades = implode(",", array_values($organismos1));
        }
        //obtener todas la monedas que est�n siendo usadas
        $monedas = DatConstructor::getMonedasReporteNAPorConstructor($params, $entidades);
        // print_r($monedas);die;
        //formar las columnas y sus referencias(las monedas usadas son columnas)
        $arrcolumnas[] = 'Constructor';
        $arrcolumnas[] = 'Provincia';
        $arrcolumnas[] = 'Forma de propiedad';
        $arrreferencias = array();
        $arrreferencias[] = 'constructor';
        $arrreferencias[] = 'provincia';
        $arrreferencias[] = 'formapropiedad';
        foreach ($monedas as $key => $value) {
            $arrcolumnas[] = $value['codigoiso'];
            $arrreferencias[] = $value['codigoiso'];
        }
        //obtener los datos a mostrar
        $constructores = DatConstructor::getDatosReporteNAPorConstructor($params, $entidades);
        //print_r($constructores);die;
        //formar un arreglo con los datos listos para generar el reporte
        $tempcontructor = "";
        $tempprovincia = "";
        $tempformapropiedad = "";
        $datos = array();
        $d = -1;
        $i = 0;
        $cantmonedas = count($monedas);
        foreach ($constructores as $key => $value) {
            if ($value['constructor'] != $tempcontructor || $value['provincia'] != $tempprovincia || $value['formapropiedad'] != $tempformapropiedad) {
                $i = 0;
                $d = $d + 1;
                $datos[$d]['constructor'] = $value['constructor'];
                $datos[$d]['provincia'] = $value['provincia'];
                $datos[$d]['formapropiedad'] = $value['formapropiedad'];
                $tempcontructor = $value['constructor'];
                $tempprovincia = $value['provincia'];
                $tempformapropiedad = $value['formapropiedad'];
            }
            for ($f = $i; $f < $cantmonedas; $f++) {
                if ($monedas[$f]['idmoneda'] == $value['idmoneda']) {
                    $datos[$d][$value['codigoiso']] = $value['valor'];
                    $i = $i + 1;
                    break;
                } else {
                    $i = $i + 1;
                }
            }
        }

        //formar el arreglo con todos los par�metros para generar el reporte
        $data[0]->tipo = 'estandar';
        $data[0]->datos = $datos;
        $data[0]->columnas = $arrcolumnas;
        $data[0]->referencias = $arrreferencias;
        $data[0]->emptyvalue = 0;
        $data['subsistema'] = 'inversiones';
        $data['titulo'] = 'DEMANDA POR CONSTRUCTOR';

        return $data;
    }

    /* public function getDatosViviendaHab($params, $org, $ent)
      {
      $data = array();
      $model = new InversionesModel();
      $params['idnomotrosindicadores'] = 120;
      $columna = 'Habitaciones';
      $data['titulo'] = 'Reporte Habitaciones';
      if ($params['codigo'] != 18) {
      $params['idnomotrosindicadores'] = 119;
      $data['titulo'] = 'Reporte Viviendas';
      $columna = 'Viviendas';
      }
      $datos = array();
      $sumaorganimso = 0;
      $sumaentidades = 0;

      foreach ($params['filtros'] as $filtro) {
      $ids = implode(',', $filtro['id']);
      if ($filtro['name'] == 'cbxOrganismo') {
      $params['condOrg'] .= " AND i.idestructuracomun in ({$ids}) ";
      $nombres = explode(',', $filtro['cbxOrganismo']);
      foreach ($filtro['id'] as $pos => $entidad) {
      $identidades = array();
      $IdOrganismo = $entidad;
      //$sumOrg = 0;
      if (count($params['filtros'][4]['id']) > 0) {
      $IDEntidades = $params['filtros'][4]['id'];
      $idSeleccionadas = $model->dadoArrayEntidades($entidad, $nombres[$pos], $IDEntidades); //ENTIDADES HIJAS seleccionadas
      if (count($idSeleccionadas) > 0) {
      $identidades = array();
      $idestructuras = $idSeleccionadas;
      foreach ($idestructuras as $key => $value) {
      $identidades[$key] = $value['identidad'];
      }
      } else {
      $identidades = array();
      $idestructuras = $model->cargarEntHijas($entidad, $nombres[$pos]); //ENTIDADES HIJAS
      foreach ($idestructuras as $key => $value) {
      $identidades[$key] = $value['identidad'];
      }
      }
      } else {
      $idestructuras = $model->cargarEntHijas($entidad, $nombres[$pos]); //ENTIDADES HIJAS
      foreach ($idestructuras as $key => $value) {
      $identidades[$key] = $value['identidad'];
      }
      }


      if (count($identidades) > 0) {
      $sumOrganis = DatInversion::sumaTotal($params, $identidades); //SUMA TOTAL DEL ORGANISMO
      } else {
      $sumOrganis[0]['sum'] = 0; //SUMA TOTAL DEL ORGANISMO
      }

      $invers = DatInversion::listarInversionesPorIdOr($params, $entidad);

      if (count($invers) > 0) {
      $ent = array();
      $ent[] = $entidad;

      $sumOrg = DatInversion::sumaTotal($params, $ent); //SUMA  ORGANISMO

      $datos[] = array('descripcion' => 'Organismo - ' . $nombres[$pos],
      'viviendas' => $sumOrg[0]['sum'],
      'color' => '#CCFFCC', 'negrita' => true);

      foreach ($invers as $inversion) {
      $sumaorganimso += $inversion['plan'];
      $datos[] = array('descripcion' => $inversion['denominacion'],
      'viviendas' => $inversion['plan']);
      }
      }

      foreach ($idestructuras as $key => $value) {
      if ($IdOrganismo != $value['identidad']) {

      $arrayEnt[0] = $value['identidad'];
      $sumaEntidad = DatInversion::listarSumaEntidades($params, $arrayEnt); //inversiones del entidad
      $InversionesEnt = DatInversion::listarInversionesPorIdOr($params, $value['identidad']); //inversiones de la entidad

      if (count($InversionesEnt) > 0) {

      $datos[] = array('descripcion' => 'Entidad - ' . $value['entidad'],
      'viviendas' => $sumaEntidad[0]['sum'], 'color' => '#CCFFCC', 'negrita' => true);

      foreach ($InversionesEnt as $inversion) {
      $sumaentidades += $inversion['plan'];
      $datos[] = array('descripcion' => $inversion['denominacion'],
      'viviendas' => $inversion['plan']);
      }
      }

      if (count($invers) > 0 || count($InversionesEnt) > 0) {
      $datos[] = array('descripcion' => 'Total Organismo - ' . $nombres[$pos],
      'viviendas' => $sumOrganis[0]['sum'], 'color' => '#DCDDD9 ', 'negrita' => true);
      }
      }
      }
      }

      $sumatotal = $sumaentidades + $sumaorganimso;
      $datos[] = array('descripcion' => 'TOTAL',
      'viviendas' => $sumatotal, 'color' => '#DCDDD9 ', 'negrita' => true);
      }
      }

      $data[0]->tipo = 'estandar';
      $data[0]->datos = $datos;
      $data[0]->columnas = array('Descripci&oacute;n', $columna);
      $data[0]->referencias = array('descripcion', 'viviendas');
      $data[0]->emptyvalue = 0;
      $data['subsistema'] = 'inversiones';
      $data['hora'] = $hoy = date("H:i:s");


      return $data;
      } */

    public function getDatosViviendaHab($params, $org, $ent) {
        $data = array();
        $model = new InversionesModel();
        $params['idnomotrosindicadores'] = 120;
        $columna = 'Habitaciones';
        $data['encab'] = 3;
        $data['ejercicio'] = $params['ejercicio'];
        $data['titulo'] = 'Emisión de Habitaciones';
        if ($params['codigo'] != 18) {
            $params['idnomotrosindicadores'] = 119;
            $data['titulo'] = 'Emisión de Viviendas';
            $data['encab'] = 4;
            $columna = 'Viviendas';
        }
        $datos = array();
        $sumaorganimso = 0;
        $sumaentidades = 0;
        // pre_r($params['filtros']);die;
        //foreach ($params['filtros'] as $filtro) {
        $ids = $params['filtros'][0]['id'];

        //if ($filtro['name'] == 'cbxOrganismo') {

        if (empty($ids)) {
            $ids = self::cargarOrganismos();
            unset($ids[0]);
        }
        //pre_r($ids);die;

        $listaIds = implode(',', $ids);
        $params['condOrg'] .= " AND i.idestructuracomun in ({$listaIds}) ";
        //$nombres = explode(',', $filtro['cbxOrganismo']);
        foreach (/* $filtro['id'] */$ids as $pos => $entidad) {
            $identidades = array();
            $IdOrganismo = $entidad;
            //$sumOrg = 0;
            $tempEnt = $this->integrator->metadatos->DameEstructura($entidad);
            //pre_r($tempEnt[0]->denominacion);die;

            if (count($params['filtros'][4]['id']) > 0) {
                $IDEntidades = $params['filtros'][4]['id'];


                $idSeleccionadas = $model->dadoArrayEntidades($entidad, /* $nombres[$pos] */ $tempEnt[0]->denominacion, $IDEntidades); //ENTIDADES HIJAS seleccionadas
                if (count($idSeleccionadas) > 0) {
                    $identidades = array();
                    $idestructuras = $idSeleccionadas;
                    foreach ($idestructuras as $key => $value) {
                        $identidades[$key] = $value['identidad'];
                    }
                } else {
                    $identidades = array();
                    $idestructuras = $model->cargarEntHijas($entidad, $tempEnt[0]->denominacion/* $nombres[$pos] */); //ENTIDADES HIJAS
                    foreach ($idestructuras as $key => $value) {
                        $identidades[$key] = $value['identidad'];
                    }
                }
            } else {
                $idestructuras = $model->cargarEntHijas($entidad, $tempEnt[0]->denominacion/* $nombres[$pos] */); //ENTIDADES HIJAS
                foreach ($idestructuras as $key => $value) {
                    $identidades[$key] = $value['identidad'];
                }
            }


            if (count($identidades) > 0) {
                $sumOrganis = DatInversion::sumaTotal($params, $identidades); //SUMA TOTAL DEL ORGANISMO
            } else {
                $sumOrganis[0]['sum'] = 0; //SUMA TOTAL DEL ORGANISMO
            }

            $invers = DatInversion::listarInversionesPorIdOr($params, $entidad);

            if (count($invers) > 0) {
                $ent = array();
                $ent[] = $entidad;

                $sumOrg = DatInversion::sumaTotal($params, $ent); //SUMA  ORGANISMO

                $datos[] = array('descripcion' => 'Organismo - ' . $tempEnt[0]->denominacion/* $nombres[$pos] */,
                    'viviendas' => $sumOrg[0]['sum'],
                    'color' => '#CCFFCC', 'negrita' => true);

                foreach ($invers as $inversion) {
                    $sumaorganimso += $inversion['plan'];
                    $datos[] = array('descripcion' => $inversion['denominacion'],
                        'viviendas' => $inversion['plan']);
                }
            }
            //pre_r($idestructuras);die;
            $existenInversionesEnEntidades = false;
            foreach ($idestructuras as $key => $value) {
                if ($IdOrganismo != $value['identidad']) {

                    $arrayEnt[0] = $value['identidad'];
                    $sumaEntidad = DatInversion::listarSumaEntidades($params, $arrayEnt); //inversiones del entidad
                    $InversionesEnt = DatInversion::listarInversionesPorIdOr($params, $value['identidad']); //inversiones de la entidad

                    if (count($InversionesEnt) > 0) {
                        $existenInversionesEnEntidades = true;
                        $datos[] = array('descripcion' => 'Entidad - ' . $value['entidad'],
                            'viviendas' => $sumaEntidad[0]['sum'], 'color' => '#CCFFCC', 'negrita' => true);

                        foreach ($InversionesEnt as $inversion) {
                            $sumaentidades += $inversion['plan'];
                            $datos[] = array('descripcion' => $inversion['denominacion'],
                                'viviendas' => $inversion['plan']);
                        }
                    }

                    /* if (count($invers) > 0 || count($InversionesEnt) > 0) {
                      $datos[] = array('descripcion' => 'Total Organismo - ' . $tempEnt[0]->denominacion,
                      'viviendas' => $sumOrganis[0]['sum'], 'color' => '#DCDDD9 ', 'negrita' => true);
                      } */
                }
            }
            if (count($invers) > 0 || $existenInversionesEnEntidades/* count($InversionesEnt) > 0 */) {
                $datos[] = array('descripcion' => 'Total Organismo - ' . $tempEnt[0]->denominacion/* $nombres[$pos] */,
                    'viviendas' => $sumOrganis[0]['sum'], 'color' => '#DCDDD9 ', 'negrita' => true);
            }
        }

        $sumatotal = $sumaentidades + $sumaorganimso;
        $datos[] = array('descripcion' => 'TOTAL',
            'viviendas' => $sumatotal, 'color' => '#DCDDD9 ', 'negrita' => true);
        //}
        //}

        $data[0]->tipo = 'estandar';
        $data[0]->datos = $datos;
        $data[0]->columnas = array('Descripci&oacute;n', $columna);
        $data[0]->referencias = array('descripcion', 'viviendas');
        $data[0]->emptyvalue = 0;
        $data['subsistema'] = 'inversiones';
        $data['hora'] = $hoy = date("H:i:s");


        return $data;
    }

    //Este metodo ordena los datos y calcula los totales para el reporte de codigo 11
    public function calcularTotalesOrdenarDatos($datos, $mostrarinv, $identidad, $pos) {

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

    //Este metodo ordena los datos y calcula los totales para el reporte de codigo 15
    public function calcularTotalesOrdenarDatosCyM($datos, $mostrarinv, $identidad, $pos) {

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
        $dat[$pos]['forma'] = " ";
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
        $denominv = $datos[0]['denominacion'];
        $ident = $datos[0]['idestructuracomun'];
        for ($ke = 0; $ke <= $longitud; $ke++) {
            if ($ident == $datos[$ke]['idestructuracomun']) {
                if ($denominv == $datos[$ke]['denominacion']) {
                    $totUSDinv += $datos[$ke]['usd'];
                    $totMPinv += $datos[$ke]['cup'];
                } else {
                    $totalesInv[$datos[$ke - 1]['idinversion']] ['usd'] = $totUSDinv;
                    $totalesInv[$datos[$ke - 1]['idinversion']] ['cup'] = $totMPinv;
                    $denominv = $datos[$ke]['denominacion'];
                    $totUSDinv = 0;
                    $totMPinv = 0;
                    $totUSDinv += $datos[$ke]['usd'];
                    $totMPinv += $datos[$ke]['cup'];
                }
            } else {
                $totalesInv[$datos[$ke - 1]['idinversion']] ['usd'] = $totUSDinv;
                $totalesInv[$datos[$ke - 1]['idinversion']] ['cup'] = $totMPinv;
                $ident = $datos[$ke]['idestructuracomun'];
                $denominv = $datos[$ke]['denominacion'];
                $totUSDinv = 0;
                $totMPinv = 0;
            }
        }

        $denominv = "";

        foreach ($datos as $key => $value) {
            if ($mostrarinv == 1) {
                if ($denominv != $value['denominacion']) {
                    $dat[$pos]['denom'] = $value['denominacion'];
                    $dat[$pos]['negrita'] = true;
                    $dat[$pos]['prov'] = " ";
                    $dat[$pos]['forma'] = $value['forma'];
                    $dat[$pos]['cup'] = $totalesInv[$value['idinversion']] ['cup'];
                    $dat[$pos]['usd'] = $totalesInv[$value['idinversion']] ['usd'];
                    $pos++;
                    $dat[$pos]['denom'] = $value['dencont'];
                    $dat[$pos]['forma'] = " ";
                    $dat[$pos]['prov'] = $value['prov'];
                    $dat[$pos]['cup'] = $value['cup'];
                    $dat[$pos]['usd'] = $value['usd'];
                    $pos++;
                    $denominv = $value['denominacion'];
                } else {
                    $dat[$pos]['denom'] = $value['dencont'];
                    $dat[$pos]['prov'] = $value['prov'];
                    $dat[$pos]['forma'] = " ";
                    $dat[$pos]['cup'] = $value['cup'];
                    $dat[$pos]['usd'] = $value['usd'];
                    $pos++;
                }
            } else {
                if ($denominv != $value['denominacion']) {
                    $dat[$pos]['denom'] = $value['denominacion'];
                    $dat[$pos]['prov'] = " ";
                    $dat[$pos]['forma'] = $value['forma'];
                    $dat[$pos]['cup'] = $totalesInv[$value['idinversion']] ['cup'];
                    $dat[$pos]['usd'] = $totalesInv[$value['idinversion']] ['usd'];
                    $pos++;
                    $denominv = $value['denominacion'];
                }
            }
        }

        return $dat;
    }

    //Este metodo carga los organismos de la entidad logueada...
    public function cargarOrganismos() {
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
    public function cargarOrganismosYNombre() {
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

    public function cargarEntidades($idorg) {
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

    public function entidadesHijas($identidad) {
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

    public function ordenarDatosInversionAcreedor($org, $params, $ent, $mon) {
        $pos = 0;
        $denominacion = '';

        foreach ($org as $ey => $valOrg) {
            $totalorgentCredito = 0;
            $totalorgentPlan = 0;
            $monedaentidad = InversionesModel::devolverIdMonedaEnt($mon[0], $valOrg);
            $datosM['idmoneda'] = $monedaentidad ? $monedaentidad[0]['idmonedaentidad'] : 0;
            //hom�logo del m�todo listarAcredorInversion usado en el reporte  Inversion - Acreedor
            //en el componente Plan de inversiones
            $datos = DatInversion::listarAcredorInversionSD($params['idejercicio'], $valOrg, $datosM['idmoneda'], $params);
//pre_r('/////////');
            //hom�logo del m�todo listarAcredorInversionC usado en el reporte  Inversion - Acreedor
            //en el componente Plan de inversiones
            $data = DatInversion::listarAcredorInversionCSD($params['idejercicio'], $valOrg, $datosM['idmoneda'], $params);

            if (count($data) > 0) {
                foreach ($data as $k => $v) {
                    $aux13 = $v['idinversfinancplan'] + $v['placontado'];
                    $sumaTotalCredito += $aux13;
                    $sumaorg1 += $v['idinversfinancplan'];
                }

                $tempEnt = $this->integrator->metadatos->DameEstructura($valOrg);
                $dat[$pos]['denom'] = 'Entidad - ' . $tempEnt[0]->denominacion;
                $dat[$pos]['plan'] = $sumaTotalCredito;
                $dat[$pos]['credito'] = $sumaorg1;
                $dat[$pos]['gracia'] = " ";
                $dat[$pos]['amort'] = " ";
                $dat[$pos]['interes'] = " ";
                $dat[$pos]['negrita'] = true;
                $dat[$pos]['color'] = '#CCFFCC';
                $pos++;

                $totalorgentPlan += $sumaorg1;
                $sumaorg1 = 0;
                $sumaTotalCredito = 0;
                $sumcredtinv = 0;
                $sumplaninv = 0;
                /* pre_r($datos);pre_r('//////////////////');
                  pre_r($data);die; */
                foreach ($data as $k => $value) {

                    if ($denominacion != $value['denominacion']) {
                        $acreedor = array();
                        foreach ($datos as $key => $k) {
                            if ($k['denominacion'] == $value['denominacion'] && !in_array($k['acredor'], $acreedor)) {
                                $acreedor[] = $k['acredor'];
                                $aux12 = $k['idinversfinancplan'] + $k['placontado'];
                                $sumcredtinv += $aux12;
                                $sumplaninv += $k['idinversfinancplan'];
                            }
                        }
                        $denomacredor = array();
                        $denotabla = $value['denominacion'];
                        $denominacion = $value['denominacion'];

                        $dat[$pos]['denom'] = $denotabla;
                        $dat[$pos]['plan'] = $sumcredtinv;
                        $dat[$pos]['credito'] = $sumplaninv;
                        $dat[$pos]['gracia'] = " ";
                        $dat[$pos]['amort'] = " ";
                        $dat[$pos]['interes'] = " ";
                        $dat[$pos]['negrita'] = true;
                        $pos++;

                        $sumcredtinv = 0;
                        $sumplaninv = 0;
                    }
                    foreach ($datos as $key => $val) {

                        if ($value['denominacion'] == $val['denominacion'] && !in_array($val['acredor'], $denomacredor)) {
                            $denomacredor[] = $val['acredor'];

                            $dat[$pos]['denom'] = $val['acredor'];
                            $aux11 = $val['idinversfinancplan'] + $val['placontado'];
                            $dat[$pos]['plan'] = $aux11;
                            $dat[$pos]['credito'] = $val['idinversfinancplan'];
                            $dat[$pos]['gracia'] = $val['gracia'];
                            $dat[$pos]['amort'] = $val['plazoamortizacion'];
                            $dat[$pos]['interes'] = $val['porcientointeres'];
                            $pos++;
                        }
                    }
                }
            }

            $idestructuras = array();
            $idest = self::cargarEntidades($valOrg);
            if ($ent[0] != null) {
                foreach ($idest as $key => $valor) {
                    if (in_array($valor, $ent))
                        $idestructuras[] = $valor;
                }
            } else
                $idestructuras = $idest;

            $denominacion = '';
            foreach ($idestructuras as $key => $valor) {
                $denominacion = '';
                $monedaentidad = InversionesModel::devolverIdMonedaEnt($mon[0], $valor);
                $idmonedaent = $monedaentidad ? $monedaentidad[0]['idmonedaentidad'] : 0;
                $datosM = DatInversion::listarAcredorInversionSD($params['idejercicio'], $valor, $idmonedaent, $params);

                $dataM = DatInversion::listarAcredorInversionCSD($params['idejercicio'], $valor, $idmonedaent, $params);
//print_r($datosM);die();
                if (count($datosM) > 0) {
                    $tempEnt = $this->integrator->metadatos->DameEstructura($valor);
                    $dat[$pos]['denom'] = 'Entidad - ' . $tempEnt[0]->denominacion;
                    $dat[$pos]['plan'] = " ";
                    $dat[$pos]['credito'] = " ";
                    $dat[$pos]['gracia'] = " ";
                    $dat[$pos]['amort'] = " ";
                    $dat[$pos]['interes'] = " ";
                    $dat[$pos]['negrita'] = true;
                    $dat[$pos]['color'] = '#CCFFCC';
                    $pos++;
                    $sumaorgM = 0;
                    $sumaTotalCreditoM = 0;

                    $sumcredtinvM = 0;
                    $sumplaninvM = 0;

                    foreach ($datosM as $k => $value) {
                        $denomacredorInv = array();
                        if ($denominacion != $value['denominacion']) {
                            foreach ($datosM as $key => $k) {
                                if ($k['denominacion'] == $value['denominacion'] && !in_array($k['acredor'], $denomacredorInv) && ($k['idinversfinancplan'] + $k['placontado'] > 0)
                                ) {
                                    $aux6 = $k['idinversfinancplan'] + $k['placontado'];
                                    $sumcredtinvM += $aux6;
                                    $totalorgentCredito += $aux6;
                                    $totalorgentPlan += $k['idinversfinancplan'];
                                    $sumaTotalCreditoM += $k['idinversfinancplan'];
                                    $sumaorgM += $aux6;
                                    $denomacredorInv[] = $k['acredor'];
                                    $sumplaninvM += $k['idinversfinancplan'];
                                }
                            }
                            $denomacredor = array();
                            $denotabla = $value['denominacion'];
                            $denominacion = $value['denominacion'];

                            $dat[$pos]['denom'] = $denotabla;
                            $dat[$pos]['plan'] = $sumcredtinvM;
                            $dat[$pos]['credito'] = $sumplaninvM;
                            $dat[$pos]['gracia'] = " ";
                            $dat[$pos]['amort'] = " ";
                            $dat[$pos]['interes'] = " ";
                            $dat[$pos]['negrita'] = true;
                            $pos++;

                            $sumcredtinvM = 0;
                            $sumplaninvM = 0;
                        }

                        foreach ($datosM as $key => $val) {

                            if ($value['denominacion'] == $val['denominacion'] && !in_array($val['acredor'], $denomacredor) && ($val['idinversfinancplan'] + $val['placontado'] > 0)
                            ) {
                                $denomacredor[] = $val['acredor'];

                                $dat[$pos]['denom'] = $val['acredor'];
                                $aux7 = $val['idinversfinancplan'] + $val['placontado'];
                                $dat[$pos]['plan'] = $aux7;
                                $dat[$pos]['credito'] = $val['idinversfinancplan'];
                                $dat[$pos]['gracia'] = $val['gracia'];
                                $dat[$pos]['amort'] = $val['plazoamortizacion'];
                                $dat[$pos]['interes'] = $val['porcientointeres'];
                                $pos++;
                            }
                        }
                    }
                }

                if (count($datosM) > 0) {
                    $tempEnt = $this->integrator->metadatos->DameEstructura($valor);
                    $dat[$pos]['denom'] = 'Total-Entidad - ' . $tempEnt[0]->denominacion;
                    $dat[$pos]['plan'] = $sumaorgM;
                    $dat[$pos]['credito'] = $sumaTotalCreditoM;
                    $dat[$pos]['gracia'] = " ";
                    $dat[$pos]['amort'] = " ";
                    $dat[$pos]['interes'] = " ";
                    $dat[$pos]['negrita'] = true;
                    $dat[$pos]['color'] = '#DCDDD9';
                    $pos++;
                }
            }
        }

        return $dat;
    }

    public function ordenarDatosAcreedorInversion($org, $params, $ent, $mon) {
        $pos = 0;
        $denominacion = '';

        foreach ($org as $ey => $valOrg) {
            $totalorgentCredito = 0;
            $totalorgentPlan = 0;
            $monedaentidad = InversionesModel::devolverIdMonedaEnt($mon[0], $valOrg);
            $datosM['idmoneda'] = $monedaentidad ? $monedaentidad[0]['idmonedaentidad'] : 0;
            //hom�logo del m�todo listarInversionAcredor usado en el reporte  Acreedor - Inversion
            //en el componente Plan de inversiones
            $datos = DatInversion::listarInversionAcredorSG($params['idejercicio'], $valOrg, $datosM['idmoneda'], $params);
            //print_r($datos);die;
            //hom�logo del m�todo listarInversionAcredorC usado en el reporte  Acreedor - Inversion
            //en el componente Plan de inversiones
            $data = DatInversion::listarInversionAcredorCSG($params['idejercicio'], $valOrg, $datosM['idmoneda'], $params);


            if (count($data) > 0) {
                foreach ($data as $k => $v) {
                    $sumaTotalCredito += $v['idinversfinancplan'];
                    $aux9 = $v['idinversfinancplan'] + $v['placontado'];
                    $sumaorg1 += $aux9;
                }

                $tempEnt = $this->integrator->metadatos->DameEstructura($valOrg);
                $dat[$pos]['denom'] = 'Entidad - ' . $tempEnt[0]->denominacion;
                $dat[$pos]['plan'] = $sumaorg1;
                $dat[$pos]['credito'] = $sumaTotalCredito;
                $dat[$pos]['gracia'] = " ";
                $dat[$pos]['amort'] = " ";
                $dat[$pos]['interes'] = " ";
                $dat[$pos]['negrita'] = true;
                $dat[$pos]['color'] = '#CCFFCC';
                $pos++;

                $sumaorg1 = 0;
                $sumaTotalCredito = 0;
                $sumcredtinv = 0;
                $sumplaninv = 0;
                foreach ($data as $k => $value) {
                    if ($denominacion != $value['denominacion']) {
                        foreach ($datos as $k) {
                            if ($k['denominacion'] == $value['denominacion']) {
                                $sumcredtinv += $k['idinversfinancplan'];
                                $aux7 = $k['idinversfinancplan'] + $k['placontado'];
                                $sumplaninv += $aux7;
                            }
                        }
                        $denomacredor = array();
                        $denotabla = $value['denominacion'];
                        $denominacion = $value['denominacion'];

                        $dat[$pos]['denom'] = $denotabla;
                        $dat[$pos]['plan'] = $sumplaninv;
                        $dat[$pos]['credito'] = $sumcredtinv;
                        $dat[$pos]['gracia'] = " ";
                        $dat[$pos]['amort'] = " ";
                        $dat[$pos]['interes'] = " ";
                        $dat[$pos]['negrita'] = true;
                        $pos++;

                        $sumcredtinv = 0;
                        $sumplaninv = 0;
                    }
                    foreach ($datos as $val) {

                        if ($value['denominacion'] == $val['denominacion'] && !in_array($val['deninv'], $denomacredor)) {
                            $denomacredor[] = $val['deninv'];

                            $dat[$pos]['denom'] = $val['deninv'];
                            $aux6 = $val['idinversfinancplan'] + $val['placontado'];
                            $dat[$pos]['plan'] = $aux6;
                            $dat[$pos]['credito'] = /* $aux6 */
                                    $val['idinversfinancplan'];
                            $dat[$pos]['gracia'] = $val['gracia'];
                            $dat[$pos]['amort'] = $val['plazoamortizacion'];
                            $dat[$pos]['interes'] = $val['porcientointeres'];
                            $pos++;
                        }
                    }
                }
            }
            $idestructuras = array();
            $idest = self::cargarEntidades($valOrg);
            if ($ent[0] != null) {
                foreach ($idest as $key => $valor) {
                    if (in_array($valor, $ent))
                        $idestructuras[] = $valor;
                }
            } else
                $idestructuras = $idest;

            $denominacion = '';
            //print_r(explode($idestructuras,));die;
            foreach ($idestructuras as $key => $valor) {
                $denominacion = '';
                $monedaentidad = InversionesModel::devolverIdMonedaEnt($mon[0], $valor);
                $idmonedaent = $monedaentidad ? $monedaentidad[0]['idmonedaentidad'] : 0;

                $datosM = DatInversion::listarInversionAcredorSG($params['idejercicio'], $valor, $idmonedaent, $params);

                $dataM = DatInversion::listarInversionAcredorCSG($params['idejercicio'], $valor, $idmonedaent, $params);

                if (count($dataM) > 0) {

                    $tempEnt = $this->integrator->metadatos->DameEstructura($valor);
                    $dat[$pos]['denom'] = 'Entidad - ' . $tempEnt[0]->denominacion;
                    $dat[$pos]['plan'] = " ";
                    $dat[$pos]['credito'] = " ";
                    $dat[$pos]['gracia'] = " ";
                    $dat[$pos]['amort'] = " ";
                    $dat[$pos]['interes'] = " ";
                    $dat[$pos]['negrita'] = true;
                    $dat[$pos]['color'] = '#CCFFCC';
                    $pos++;

                    $sumcredtinvM = 0;
                    $sumplaninvM = 0;
                    foreach ($datosM as $k => $value) {

                        $denomacredorTipo = array();
                        if ($denominacion != $value['denominacion'] && ($value['idinversfinancplan'] + $value['placontado']) > 0) {
                            foreach ($datosM as $key => $k) {
                                if ($k['denominacion'] == $value['denominacion'] && !in_array($k['deninv'], $denomacredorTipo)) {
                                    $denomacredorTipo[] = $k['deninv'];
                                    $sumcredtinvM += $k['idinversfinancplan'];
                                    $aux1 = $k['idinversfinancplan'] + $k['placontado'];
                                    $sumplaninvM += $aux1;
                                    $totalorgentPlan += $k['idinversfinancplan'] + $k['placontado'];
                                    $totalorgentCredito += $k['idinversfinancplan'];
                                }
                            }
                            $denomacredor = array();
                            $denotabla = $value['denominacion'];
                            $denominacion = $value['denominacion'];
                            $dat[$pos]['denom'] = $denotabla;
                            $dat[$pos]['plan'] = $sumplaninvM;
                            $dat[$pos]['credito'] = $sumcredtinvM;
                            $dat[$pos]['gracia'] = " ";
                            $dat[$pos]['amort'] = " ";
                            $dat[$pos]['interes'] = " ";
                            $dat[$pos]['negrita'] = true;
                            $pos++;

                            $sumcredtinvM = 0;
                            $sumplaninvM = 0;
                        }
                        foreach ($datosM as $key => $val) {

                            if ($value['denominacion'] == $val['denominacion'] && !in_array($val['deninv'], $denomacredor) && ($val['idinversfinancplan'] + $val['placontado']) > 0
                            ) {
                                $denomacredor[] = $val['deninv'];

                                $dat[$pos]['denom'] = $val['deninv'];
                                $sunc = $val['idinversfinancplan'] + $val['placontado'];
                                $dat[$pos]['plan'] = $sunc;
                                $dat[$pos]['credito'] = $val['idinversfinancplan'];
                                $dat[$pos]['gracia'] = $val['gracia'];
                                $dat[$pos]['amort'] = $val['plazoamortizacion'];
                                $dat[$pos]['interes'] = $val['porcientointeres'];
                                $pos++;
                            }
                        }
                    }
                }
            }
            if ($totalorgentPlan > 0 || $totalorgentCredito > 0) {
                $tempEnt = $this->integrator->metadatos->DameEstructura($valOrg);
                $dat[$pos]['denom'] = 'Total del organismo - ' . $tempEnt[0]->denominacion;
                $dat[$pos]['plan'] = $totalorgentPlan;
                $dat[$pos]['credito'] = $totalorgentCredito;
                $dat[$pos]['gracia'] = " ";
                $dat[$pos]['amort'] = " ";
                $dat[$pos]['interes'] = " ";
                $dat[$pos]['negrita'] = true;
                $dat[$pos]['color'] = '#DCDDD9';
                $pos++;
            }
        }

        return $dat;
    }

    public function ordenarDatosMaqueta($params, $entidades, $FP, $financistasGenerales) {
        //obtener los identidadmoneda
        $monedaentcup = DatInversion::listarMonedasEntidad(9900000103);
        $monedaentusd = DatInversion::listarMonedasEntidad(9900000046);

        foreach ($monedaentcup as $value345) {
            $monedaentcupp[] = $value345['idmonedaentidad'];
        }

        foreach ($monedaentusd as $value124) {
            $monedaentusdd[] = $value124['idmonedaentidad'];
        }

        $monedasentcup = implode(",", array_values($monedaentcupp));
        $monedasentusd = implode(",", array_values($monedaentusdd));

        //obtener las formas de propiedad
        if ($FP[0] != null) {
            $formaP = implode(",", $FP);
            $formaspropiedad = DatInversion::listarFormadadoId($formaP);
        } else {
            $formaspropiedad = DatInversion::listarForma();
        }


        $valormptotales = 0;
        $valorusdtotales = 0;
        $sumatoriatotalescsfinancia = 0;
        $sumatoriatotalesqfinancia = 0;
        $sumatoriatotaleserogacion = 0;
        $sumatoriatotalescontraexterna = 0;
        $valorcontadototales = 0;
        $valorcreditototales = 0;
        $pos = 0;

        //ordenando datos para generar reporte
        foreach ($formaspropiedad as $value) {
            $valormptotal = 0;
            $valorusdtotal = 0;

            $dat[$pos]['denom'] = $value['denominacion'];

            //--------------- Inversiones dada la forma de propiedad --------
            $inversiones3 = DatInversion::getInversionesDadoFormaPropiedad($params['idejercicio'], $params['ejercicio'], $entidades, $value['idformapropiedad']);
            $inversiones1 = "";
            for ($index3 = 0; $index3 < count($inversiones3); $index3++) {
                if ($index3 == (count($inversiones3) - 1)) {
                    $inversiones1 .= $inversiones3[$index3]['idinversion'];
                } else {
                    $inversiones1 .= $inversiones3[$index3]['idinversion'] . ",";
                }
            }

            if (count($inversiones3) == 0) {
                $inversiones2 = "0";
            } else {
                $inversiones2 = $inversiones1;
            }

            // ----------------------- Total MP y USD ---------------

            $arregloMonedas = "'" . CUP . "'" . "," . "'" . USD . "'";
            //hom�logo del m�todo TotalPlanEjercicioActualComponentes usado en el reporte  Maqueta
            //en el componente Plan de inversiones
            $totalPLanComponentesCUPyUSD = DatInversion::TotalPlanEjercicioActualComponentesNS($inversiones2, $params, $arregloMonedas);

            $valormptotal = 0;
            $valorusdtotal = 0;
            foreach ($totalPLanComponentesCUPyUSD as $comp) {
                if ($comp['codigoiso'] == 'CUP') {
                    $valormptotal += $comp['totalcomp'];
                    $valormptotales += $comp['totalcomp'];
                } else {
                    $valorusdtotal += $comp['totalcomp'];
                    $valorusdtotales += $comp['totalcomp'];
                }
            }

            $dat[$pos]['CUPtotal'] = $valormptotal;
            $dat[$pos]['USDtotal'] = $valorusdtotal;


            //------------------------ Como se financia ----------------
            //hom�logo del m�todo TotalPlanEjercicioActualContado usado en el reporte  Maqueta
            //en el componente Plan de inversiones
            $valorContado = DatInversion::TotalPlanEjercicioActualContadoNS($inversiones2, $params, "'" . USD . "'");
            if (count($valorContado) > 0)
                $valorContado = $valorContado[0]['totalcontado'];
            else
                $valorContado = 0;

            //hom�logo del m�todo TotalPlanEjercicioActualCredito usado en el reporte  Maqueta
            //en el componente Plan de inversiones
            $valorCredito = DatInversion::TotalPlanEjercicioActualCreditoNS($inversiones2, $params, "'" . USD . "'");
            if (count($valorCredito) > 0)
                $valorCredito = $valorCredito[0]['totalacreedores'];
            else
                $valorCredito = 0;

            $valorcontadototales += $valorContado;
            $valorcreditototales += $valorCredito;
            $sumatoriatotalescsfinancia += $valorContado + $valorCredito;

            $dat[$pos]['totalCF'] = $valorContado + $valorCredito;
            $dat[$pos]['cont'] = $valorContado;
            $dat[$pos]['cred'] = $valorCredito;

            //----------------------------Quien financia------------------------
            // ---- Total quien financia ------
            //hom�logo del m�todo TotalPlanEjercicioActualQuienFinancia usado en el reporte  Maqueta
            //en el componente Plan de inversiones
            $totalquienfinancia = DatInversion::TotalPlanEjercicioActualQuienFinanciaNS($inversiones2, $params, "'" . USD . "'");
            if (count($totalquienfinancia) > 0)
                $totalquienfinancia = $totalquienfinancia[0]['totalquienfinancia'];
            else
                $totalquienfinancia = 0;
            $sumatoriatotalesqfinancia += $totalquienfinancia;
            $dat[$pos]['totalQF'] = $totalquienfinancia;

            // ---- Total para cada financista ------
            //hom�logo del m�todo TotalPlanEjercicioActualPorCadaFinancista usado en el reporte  Maqueta
            //en el componente Plan de inversiones
            $financistas = DatInversion::TotalPlanEjercicioActualPorCadaFinancistaNS($inversiones2, $params, "'" . CUP . "'");
            //----- Si existen financistas para esta form de propiedad se pintan los valores sino se ponen vacios
            if (count($financistas) > 0) {
                foreach ($financistasGenerales as $i => $fg) {
                    $encuentra = false;
                    $valorAcreedor = 0;
                    foreach ($financistas as $financista) {
                        if ($fg['iddatosnomenclador'] == $financista['iddatosnomenclador']) {
                            $valorAcreedor = $financista['totalacreedor'];
                            $encuentra = true;
                            break;
                        } else {
                            $encuentra = false;
                        }
                    }
                    if ($encuentra)
                        $dat[$pos][$fg['iddatosnomenclador']] = $valorAcreedor;
                    else
                        $dat[$pos][$fg['iddatosnomenclador']] = " ";
                }
            }


            //--------------------- Erogacion ----------------------------------
            $indicadores = "'" . "123" . "'"; //122 y 123 id de los Ind. Erogacion y Contrat. externa
            //hom�logo del m�todo TotalPlanEjercicioActualOtrosIndicadores usado en el reporte  Maqueta
            //en el componente Plan de inversiones
            $erogacionPlanActual = DatInversion::TotalPlanEjercicioActualOtrosIndicadoresNS($inversiones2, $params, $indicadores);


            $dat[$pos]['erog'] = $erogacionPlanActual[0]['totalindicador'];
            $sumatoriatotaleserogacion += $erogacionPlanActual[0]['totalindicador'];


            $indicadores = "'" . "122" . "'"; //122 y 123 id de los Ind. Erogacion y Contrat. externa
            $contratacionPlanActual = DatInversion::TotalPlanEjercicioActualOtrosIndicadoresNS($inversiones2, $params, $indicadores);


            $dat[$pos]['cit'] = $contratacionPlanActual[0]['totalindicador'];
            $sumatoriatotalescontraexterna += $contratacionPlanActual[0]['totalindicador'];

            $dat[$pos]['color'] = '#CCFFCC';
            $dat[$pos]['negrita'] = true;
            $pos++;


            // ----------------- valores totales por componentes ---------------------

            if ($inversiones2 != "0") {
                $etapas = "";
                $componentesSeleccionados = DatInversion::ComponentesByIdEtapa($etapas);


                foreach ($componentesSeleccionados as $c) {
                    $valormp = 0;
                    $valorusd = 0;
                    //$encuentraCup =false;
                    //$encuentraUsd =false;
                    foreach ($totalPLanComponentesCUPyUSD as $comp) {
                        if ($comp['codigoiso'] == 'CUP') {
                            if ($c['idnombreetapa'] == $comp['idnombreetapa']) {
                                $valormp = $comp['totalcomp'];
                                break;
                                //$encuentraCup =true;
                            } else
                                $valormp = 0;
                        } /* else {
                          if ($c['idnombreetapa'] == $comp['idnombreetapa']) {
                          $valorusd = $comp['totalcomp'];
                          //break;
                          $encuentraUsd =true;
                          } else
                          $valorusd = 0;
                          } */
                    }

                    foreach ($totalPLanComponentesCUPyUSD as $comp) {
                        if ($comp['codigoiso'] == 'USD') {
                            if ($c['idnombreetapa'] == $comp['idnombreetapa']) {
                                $valorusd = $comp['totalcomp'];
                                break;
                                //$encuentraCup =true;
                            } else
                                $valorusd = 0;
                        }
                    }


                    $dat[$pos]['denom'] = $c['denominacion'];
                    $dat[$pos]['CUPtotal'] = $valormp;
                    $dat[$pos]['USDtotal'] = $valorusd;
                    $dat[$pos]['totalCF'] = " ";
                    $dat[$pos]['cont'] = " ";
                    $dat[$pos]['cred'] = " ";
                    $dat[$pos]['totalQF'] = " ";
                    $pos++;
                }
            }
        }/* die; */

        $dat[$pos]['denom'] = 'Total OACE';
        $dat[$pos]['CUPtotal'] = $valormptotales;
        $dat[$pos]['USDtotal'] = $valorusdtotales;
        $dat[$pos]['totalCF'] = $sumatoriatotalescsfinancia;
        $dat[$pos]['cont'] = $valorcontadototales;
        $dat[$pos]['cred'] = $valorcreditototales;
        $dat[$pos]['totalQF'] = $sumatoriatotalesqfinancia;
        $dat[$pos]['color'] = '#CCFFCC';
        $dat[$pos]['negrita'] = true;

        foreach ($financistasGenerales as $financista) {
            $dat[$pos][$financista['iddatosnomenclador']] = $financista['totalacreedor'];
        }

        $dat[$pos]['erog'] = $sumatoriatotaleserogacion;
        $dat[$pos]['cit'] = $sumatoriatotalescontraexterna;
        return $dat;
    }

    public function buscarEntidades($identidad) {
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

    public function buscarOrganismo() {
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

    public function buscarOrganismoYCodigo() {
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

    public function buscarEntidadesConNombre($identidad) {
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

    public function buscarEntidadesTodas($identidad) {
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
    private function cargarTodosOrganismosYArrayHijas($iddominio, $selectDenomOrganismo = null) {

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

    private function cargarTodosOrganismosEHijas($iddominio, $selectDenomOrganismo = null) {


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
