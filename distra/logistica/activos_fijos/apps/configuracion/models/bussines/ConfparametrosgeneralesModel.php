<?php

/**
 *
 */
class ConfparametrosgeneralesModel extends ZendExt_Model
{
    private $_sPersona;

    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_sPersona = ServiciosRecursosHumanosHelper::__init();
    }

    /**
     *
     */
    public function getConfiguracionPG($idEstructura, $tipo, $acciones)
    {
        if (!$idEstructura) {
            $global = ZendExt_GlobalConcept::getInstance();
            $estructura = 'Estructura';
            $idEstructura = $global->$estructura->idestructura;
        }
        /*Para cuando quitan los permisos y estaba activado los plugins*/
        if ($acciones[0] == "0") {
            $existe = Doctrine::getTable('CfgParametrosGenerales')->find($idEstructura);
            if ($existe->transporte){
                $existe->transporte = 0;
                $existe->save();
            }
        }
        if ($acciones[1] == "0") {
            $existe = Doctrine::getTable('CfgParametrosGenerales')->find($idEstructura);
            if ($existe->buque){
                $existe->buque = 0;
                $existe->save();
            }
        }
        $array = CfgParametrosGenerales::getConfiguracionPG($idEstructura, $tipo);
        $arreglo = CfgEstadosReportes::getConfig();

        $resultado = array_merge($array, $arreglo);

        return $resultado;
    }

    public function usaCompletamientoEntidad($idestructura){
        if (!$idestructura) {
            $global = ZendExt_GlobalConcept::getInstance();
            $estructura = 'Estructura';
            $idEstructura = $global->$estructura->idestructura;
        }
        $array = CfgParametrosGenerales::getConfiguracionPG($idEstructura, 0);

        if($array[0]['usarcompletamiento'] === 1)
            return true;
        else
            return false;
    }

    /**
     *
     */
    public function setUsuarioPorEspecialidad($parametros)
    {
        $collection = new Doctrine_Collection('CfgUsuariosEspecialidad');
        foreach ($parametros as $d) {

            $cfgUsuariosEspecialidad = new CfgUsuariosEspecialidad();
            $existe = Doctrine::getTable('BaseCfgUsuariosEspecialidad')->find($d->idusuario);

            if ($existe) {
                $cfgUsuariosEspecialidad->assignIdentifier($d->idusuario);
            } else {
                $cfgUsuariosEspecialidad->idusuario = $d->idusuario;
            }

            $cfgUsuariosEspecialidad->idespecialidad = $d->idespecialidad;
            $collection[] = $cfgUsuariosEspecialidad;
        }
        $collection->save();
        return true;
    }

    /**
     *
     */
    public function delAsocUsuarioEspecialidad($parametros)
    {
        foreach ($parametros as $d) {
            $existe = Doctrine::getTable('BaseCfgUsuariosEspecialidad')->find(
                $d
            );
            if ($existe) {
                $existe->delete();
                return true;
            }
            return false;
        }
    }

    /**
     *
     */
    public function getEspecialidadByIdUser($idUsuario)
    {
        $cfgP = Doctrine::getTable('CfgUsuariosEspecialidad')->find($idUsuario);
        if ($cfgP) {
            return $cfgP->toArray();
        }
        return false;
    }

    /**
     *
     */
    public function updateParametros($parametros, $paramAll)
    {
        $numdis= $this->numerosDisponibles(); 
        if ($paramAll['numinicial'] <= $numdis && $paramAll['numinicial'] != '' ) {
            $m->msg = 'false';
            $m->num = $numdis;
            return $m;
        } else {           
            if ($paramAll['tipo'] == 1) {
                $cfgP = Doctrine::getTable('CfgParametrosGeneralesPatr')->find($parametros->idestructura);
                if (!$cfgP) {
                    $cfgP = new CfgParametrosGeneralesPatr();
                }
            } else {
                $cfgP = Doctrine::getTable('CfgParametrosGenerales')->find($parametros->idestructura);
                if (!$cfgP) {
                    $cfgP = new CfgParametrosGenerales();
                }
            }
            if ($parametros->codigooperacion) {
                foreach ($parametros->codigooperacion as $codigooper) {
                    $cfcodigooper = Doctrine::getTable('NomOperaciones')->find($codigooper->idnomoperaciones);
                    $cfcodigooper->codigooperacion = $codigooper->codigooperacion;
                    $cfcodigooper->save();
                }
            }
            
            $cfgP->idestructura = $parametros->idestructura;
            $cfgP->depreciacion = $parametros->deprecia;
            $cfgP->explotacionadquisicion = ($parametros->deprecia) ? $parametros->explotacionadquisicion : null;
            $cfgP->fecha = ($parametros->fechaadquisicion) ? $parametros->fechaadquisicion : null;
            $cfgP->generacomprobante = $parametros->generacomprobante;
            $cfgP->maxunidarrastporremolcadoras = ($parametros->maxunidarrastporremolcadoras) ? $parametros->maxunidarrastporremolcadoras : 0;
        
            //$cfgP->synchronizeWithArray($paramAll);
        
            $cfgP->numinicial = $paramAll['numinicial'] ? $paramAll['numinicial'] : null;
            $cfgP->autogenerado = $paramAll['autogenerado'] ? $paramAll['autogenerado'] : 0;
            $cfgP->prefijo = $paramAll['prefijo'] ? $paramAll['prefijo'] : '' ;
            $cfgP->contabilidad = $paramAll['contabilidad']  ? $paramAll['contabilidad'] : 0;
            $cfgP->inventario = $paramAll['inventario']  ? $paramAll['inventario'] : 0;
            $cfgP->persona = $paramAll['persona']  ? $paramAll['persona'] : 0;
            $cfgP->talleres = $paramAll['talleres']  ? $paramAll['talleres'] : 0;
            $cfgP->firmadigital = $paramAll['firmadigital']  ? $paramAll['firmadigital'] : 0;
            $cfgP->usarcompletamiento = $paramAll['usarcompletamiento']  ? $paramAll['usarcompletamiento'] : 0;
            //$cfgP->tipo = $paramAll['tipo'];
            $cfgP->buque = $paramAll['buque']  ? $paramAll['buque'] : 0;
            $cfgP->transporte =$paramAll['transporte']  ? $paramAll['transporte'] : 0;
      
            if($paramAll['autogenerado'] == 1 && $paramAll['numinicial'] != null && $cfgP->numinicial != $paramAll['numinicial']){
                $cfgP->ultimoinventario = $paramAll['numinicial'];

            }
            $cfgP->save();
            $m->msg = 'true';
            $this->guardarParametrosEstadosReportes($paramAll);
            return $m;
        }              
    }

    public function numerosDisponibles()
    {
        $conn = Zend_Registry::get('conexion');
        $global = ZendExt_GlobalConcept::getInstance();
        $estructura = 'Estructura';
        $idEstructura = $global->$estructura->idestructura;
        $sqlprefijo="  SELECT 
        MAX(CAST(SUBSTRING(rna.nroinventario FROM '-([0-9]+)') AS INTEGER)) AS mayor_numero
        FROM 
        mod_logactivofijotangible.dat_regnumericoactivo rna
        INNER JOIN 
        mod_logactivofijotangible.dat_registronumerico drn ON drn.idregnumerico = rna.idregnumerico
        INNER JOIN 
        mod_logistica.dat_producto p ON p.idproducto = drn.idproducto
        WHERE 
        p.idestructuracomun = $idEstructura 
        AND rna.nroinventario IS NOT NULL";

        $sql ="SELECT 
        MAX(CAST(SUBSTRING(rna.nroinventario FROM '[0-9]+') AS INTEGER)) AS mayor_numero
        FROM 
        mod_logactivofijotangible.dat_regnumericoactivo rna
        INNER JOIN 
        mod_logactivofijotangible.dat_registronumerico drn ON drn.idregnumerico = rna.idregnumerico
        INNER JOIN 
        mod_logistica.dat_producto p ON p.idproducto = drn.idproducto
        WHERE 
        p.idestructuracomun = 200531043 
        AND rna.nroinventario IS NOT NULL";

        if($paramAll['prefijo'] != ''){
            //print_r('khkb');die;
            $result = $conn->fetchOne($sqlprefijo);
            return $result;
        }
        else{
        $result = $conn->fetchOne($sql);
        return $result;
            }}  
    

    public function guardarParametrosEstadosReportes($paramAll)
    {
        if ($paramAll['tipo'] == 1) {
            $CfgEstadosReportes = 'CfgEstadosReportesPatr';
        } else
            $CfgEstadosReportes = 'CfgEstadosReportes';
        $cfgR = new Doctrine_Collection($CfgEstadosReportes);
        if ($paramAll['almacenado'] != "") {
            $almacenado = Doctrine::getTable($CfgEstadosReportes)->findByDql("denomcolumnareporte = 'almacenado'");
            if (count($almacenado->toArray()) > 0) {
                $almacenado[0]->idestado = $paramAll['almacenado'];
                $cfgR->add($almacenado[0]);
            } else {
                $almacenado = new CfgEstadosReportes();
                $almacenado->idestado = $paramAll['almacenado'];
                $almacenado->denomcolumnareporte = 'almacenado';
                $cfgR->add($almacenado);
            }
        }
        if ($paramAll['reserva'] != "") {
            $reserva = Doctrine::getTable($CfgEstadosReportes)->findByDql("denomcolumnareporte = 'reserva'");
            if (count($reserva->toArray()) > 0) {
                $reserva[0]->idestado = $paramAll['reserva'];
                $cfgR->add($reserva[0]);
            } else {
                $reserva = new CfgEstadosReportes();
                $reserva->idestado = $paramAll['reserva'];
                $reserva->denomcolumnareporte = 'reserva';
                $cfgR->add($reserva);
            }
        }
        if ($paramAll['concervacion'] != "") {
            $conservacion = Doctrine::getTable($CfgEstadosReportes)->findByDql("denomcolumnareporte = 'concervacion'");
            if (count($conservacion->toArray()) > 0) {
                $conservacion[0]->idestado = $paramAll['concervacion'];
                $cfgR->add($conservacion[0]);
            } else {
                $conservacion = new CfgEstadosReportes();
                $conservacion->idestado = $paramAll['concervacion'];
                $conservacion->denomcolumnareporte = 'concervacion';
                $cfgR->add($conservacion);
            }
        }
        if ($paramAll['bueno'] != "") {
            $bueno = Doctrine::getTable($CfgEstadosReportes)->findByDql("denomcolumnareporte = 'B'");
            if (count($bueno->toArray()) > 0) {
                $bueno[0]->idestado = $paramAll['bueno'];
                $cfgR->add($bueno[0]);
            } else {
                $bueno = new CfgEstadosReportes();
                $bueno->idestado = $paramAll['bueno'];
                $bueno->denomcolumnareporte = 'B';
                $cfgR->add($bueno);
            }
        }
        if ($paramAll['regular'] != "") {
            $regular = Doctrine::getTable($CfgEstadosReportes)->findByDql("denomcolumnareporte = 'R'");
            if (count($regular->toArray()) > 0) {
                $regular[0]->idestado = $paramAll['regular'];
                $cfgR->add($regular[0]);
            } else {
                $regular = new CfgEstadosReportes();
                $regular->idestado = $paramAll['regular'];
                $regular->denomcolumnareporte = 'R';
                $cfgR->add($regular);
            }
        }
        if ($paramAll['mal'] != "") {
            $mal = Doctrine::getTable($CfgEstadosReportes)->findByDql("denomcolumnareporte = 'M'");
            if (count($mal->toArray()) > 0) {
                $mal[0]->idestado = $paramAll['mal'];
                $cfgR->add($mal[0]);
            } else {
                $mal = new CfgEstadosReportes();
                $mal->idestado = $paramAll['mal'];
                $mal->denomcolumnareporte = 'M';
                $cfgR->add($mal);
            }
        }
        if ($cfgR->count() > 0) {
            $cfgR->save();
        }
    }

    /**
     *
     */
    public function asociarResponsable($parametros)
    {

        $existePersona = true;
        $crearResponsable = true;

        if (!$parametros['idpersona']) {
            $persona = new DatPersonaLocal();
            $persona->synchronizeWithArray($parametros);
            $persona->save();
            $existePersona = false;
            $idpersona = $persona->idpersona;
        }
        if ($existePersona) {
            $idpersona = $parametros['idpersona'];
            $responsable = Doctrine::getTable('DatResponsable')->findByDql(
                "tipo = ? AND idpersona = ?", array($parametros['tiporesponsable'], $parametros['idpersona'])
            );

            if ($responsable[0]['idresponsable']) {
                $crearResponsable = false;
            }
        }

        if ($crearResponsable) {
            $responsable = new DatResponsable();
            $responsable->synchronizeWithArray($parametros);
            $responsable->idpersona = $idpersona;

            $responsable->save();
        }

        if ($parametros['idarearesp']) {
            if ($parametros['tipo'] == 1) {// tipo = 0 para los datos de AFT y tipo = 1 cargue los datos de patrimonio
                $confArea = Doctrine::getTable('CfgResponsableAreaPat')->findByDql(
                    "idarearesp = ?", array($parametros['idarearesp'])
                );
            } else {
                $confArea = Doctrine::getTable('CfgResponsableArea')->findByDql(
                    "idarearesp = ?", array($parametros['idarearesp'])
                );
            }
        } else {
            if ($parametros['tipo'] == 1) {
                $confArea = Doctrine::getTable('CfgResponsableAreaPat')->findByDql(
                    "idestructuraubicacion = ?", array($parametros['idestructuraubicacion'])
                );
            } else {
                $confArea = Doctrine::getTable('CfgResponsableArea')->findByDql(
                    "idestructuraubicacion = ?", array($parametros['idestructuraubicacion'])
                );
            }
        }

        if (!$confArea[0]->idresponsablearea) {
            if ($parametros['tipo'] == 1) {
                $confRespoArea = new CfgResponsableAreaPat();
            } else {
                $confRespoArea = new CfgResponsableArea();
            }

            $confRespoArea->synchronizeWithArray($parametros);
            $confRespoArea->idresponsable = ($crearResponsable) ? $responsable->idresponsable :
                $responsable[0]['idresponsable'];
            $confRespoArea->save();
        } else {
            $confArea[0]->idresponsable = ($crearResponsable) ? $responsable->idresponsable :
                $responsable[0]['idresponsable'];
            $confArea->save();
        }
        return true;
    }

    /**
     *
     */
    public function getAreaById($nodo, $tipo)
    {
        //$integrator = ZendExt_IoC::getInstance();
        $global = ZendExt_GlobalConcept::getInstance();
        // $serverEstructura = ServiciosEstructuraComposicionHelper::__init();
        $serviciosUbicacion = LogisticaEstructuraUbicHelper::__init();

        if (!$nodo) {
            $estructura = 'Estructura';
            $nodo = $global->$estructura->idestructura;
        }

//        $datos = $integrator->metadatos->DameEstructurasInternas($nodo);
//        $datos = $serverEstructura->getEstructurasInternas($nodo);
        $datos = $serviciosUbicacion->cargardepositos(null, array(), null, null, null, 0)['depositos'];

        // Ordenando alfabeticamente las estructuras para no depender del servicio
        usort($datos, function($a, $b){
            return strcmp($a['text'], $b['text']);
        });

        foreach ($datos as &$dat) {
            $dat['leaf'] = false;
            $nombre = self::getResponsableByIdArea($dat['id'], $tipo);

            $dat['responsable'] = $nombre[0]['nombre'];
            $dat['idarearesp'] = $nombre[0]['id'];

            if (strlen($nombre[0]['snombre'])) {
                $dat['responsable'] .= ' '.$nombre[0]['snombre'];
            }

            if (strlen($nombre[0]['papel'])) {
                $dat['responsable'] .= ' '.$nombre[0]['papel'];
            }

            if (strlen($nombre[0]['sapel'])) {
                $dat['responsable'] .= ' '.$nombre[0]['sapel'];
            }

            $dat['text'] = (strlen($dat['responsable'])) ?
                ($dat['text'].' - <b>'.$dat['responsable'].'</b>') : $dat['text'];
        }
        return $datos;
    }

    /**
     *
     */
    public function getEstructurasUbicacion($idAreaResponsabilidad, $nivel, $ultimoNivelMostrar)
    {
        $query = Doctrine_Query::create();
        $query->select(
                "deu.idestructuraubicacion, deu.idestructuraubicacion as id,
            deu.descripcion as text, deu.descripcion as denominacion,
            da.idformato as idformato, (CASE WHEN ($nivel = deu.nivel) THEN (TRUE) ELSE FALSE END) as leaf"
            )
            ->from('DatEstructuraubicacion deu')
            ->leftJoin('deu.DatArea da')
            ->where(
                'da.idestructuracomun = ? AND deu.idpadre = deu.idestructuraubicacion', array($idAreaResponsabilidad)
            )
            ->orWhere('deu.idpadre = ? AND deu.idpadre <> deu.idestructuraubicacion', array($idAreaResponsabilidad));

        if ($ultimoNivelMostrar != -1) {
            $query->addWhere('deu.nivel <= ?', array($ultimoNivelMostrar));
        }

        $datos = $query->fetchArray();

        foreach ($datos as &$dat) {
            $nombre = self::getResponsableByIdArea($dat['id']);
            $dat['responsable'] = $nombre[0]['nombre'];
            if (strlen($nombre[0]['snombre'])) {
                $dat['responsable'] .= ' '.$nombre[0]['snombre'];
            }

            if (strlen($nombre[0]['papel'])) {
                $dat['responsable'] .= ' '.$nombre[0]['papel'];
            }

            if (strlen($nombre[0]['sapel'])) {
                $dat['responsable'] .= ' '.$nombre[0]['sapel'];
            }

            $dat['text'] = (strlen($dat['responsable'])) ?
                ($dat['text'].' - <b>'.$dat['responsable'].'</b>') : $dat['text'];
        }
        return $datos;
    }

    /**
     *
     */
    public function getResponsableByIdArea($idAreaResponsabilidad, $tipo)
    {
        $query = new Doctrine_Query();
        if ($tipo == 1) {
            $query->select('ra.idresponsable, r.idpersona as idpersona')
                ->from('CfgResponsableAreaPat ra')
                ->innerJoin('ra.DatResponsable r')
                ->where("ra.idarearesp = $idAreaResponsabilidad")
                ->orWhere("ra.idestructuraubicacion = $idAreaResponsabilidad");
        } else {
            $query->select('ra.idresponsable, r.idpersona as idpersona')
                ->from('CfgResponsableArea ra')
                ->innerJoin('ra.DatResponsable r')
                ->where("ra.idarearesp = $idAreaResponsabilidad")
                ->orWhere("ra.idestructuraubicacion = $idAreaResponsabilidad");
        }


        if (ComunAFTModel::integradoPersona()) {
            $resp = $query->fetchOne();
            $idPersona = $resp->idpersona;

            if ($idPersona) {
                $datos = $this->_sPersona->buscarPersonaPorArreglodeID(array($idPersona));
                $datos[0]['idresponsable'] = $resp->idresponsable;
                return $datos;
            }
        } else {

            $query->innerJoin('r.DatPersonaLocal p');
            return $query->fetchArray();
        }

        return array();
    }

    /**
     *  Obtener el responsable de los medios de un área de responsabilidad
     */
    public function getResponsableByAreaAndPerson($idAreaResp, $idPersona = false)
    {
        if ($idPersona) {
            $query = new Doctrine_Query();

            $idResponsable = $query->select('idresponsable')
                    ->from('DatResponsable')
                    ->where('idpersona =?', $idPersona)
                    ->fetchOne()->idresponsable;
            if (!$idResponsable) {
                $responsable = new DatResponsable();
                $responsable->tipo = (ComunAFTModel::integradoPersona()) ? 2 : 1;
                $responsable->idpersona = $idPersona;
                $responsable->save();
                return $responsable->idresponsable;
            }

            return $idResponsable;
        } else {
            $resp = $this->getResponsableByIdArea($idAreaResp);
            if (count($resp) > 0) {
                return $resp[0]['idresponsable'];
            }
        }

        return null;
    }

    /**
     *
     */
    public function eliminarReponsableAsociado($idAreaResponsabilidad, $tipo)
    {
        $query = Doctrine_Query::create();
        if ($tipo == 1) {
            $CfgResponsableArea = 'CfgResponsableAreaPat'; // Patrimonio
        } else
            /*$CfgResponsableArea = 'CfgResponsableArea';
            $query->delete()->from("$CfgResponsableArea cfg")
                ->where('cfg.idarearesp =?', $idAreaResponsabilidad)
                ->execute();*/

            if($idAreaResponsabilidad){
                $conn = Zend_Registry::get('conexion');
            $sql = "DELETE FROM mod_logactivofijotangible.conf_responsablearea cfg WHERE cfg.idarearesp = {$idAreaResponsabilidad}";
                $conn->execute($sql);
            } else {
                throw new Exception('Falta el idAreaResponsabilidad');
            }
            
        return 1;
    }

    /**
     *
     */
    public function getPersonasLocal()
    {
        $query = Doctrine_Query::create();
        return $query->from('DatPersonaLocal p')->fetchArray();
    }

    /**
     *
     */
    public function updateUsoDepreciacion($idEstructura, $valor)
    {
        $cfgP = Doctrine::getTable('CfgParametrosGenerales')->find($idEstructura);
        if ($cfgP) {
            if ($cfgP->enuso != $valor) {
                $cfgP->enuso = $valor;
                $cfgP->save();
            }
            return true;
        } else {
            $cfgP = new CfgParametrosGenerales();
            $cfgP->idestructura = $idEstructura;
            $cfgP->enuso = $valor;
            $cfgP->save();
            return true;
        }
    }

    public function cargaroperacionescontable($parametros)
    {
        
        $conn = Zend_Registry::get('conexion');
        $classEstructura = 'Estructura';
        if ($parametros['tipo'] == 1) {
            $idsubsistema = 22;
        } else
            $idsubsistema = 11;        
        $sqloperacion = " select no.* from mod_datosmaestros.nom_operacion no "
            . "left join mod_datosmaestros.dat_operacionesentidad oe on oe.idnomoperaciones = no.idnomoperaciones "
            ." where oe.idestructuracomun = {$this->global->$classEstructura->idestructura} "
            ." and no.idsubsistema = {$idsubsistema} "
            ." ORDER BY no.denominacion ";
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limitOffse = " OFFSET($start) LIMIT($limit)";

        $datos = $conn->fetchAll($sqloperacion.$limitOffse);        
        $datos = self::cargarXMLConfiguracion($datos);

        $total = count($conn->fetchAll($sqloperacion));
        return array('datos' => $datos, 'total' => $total);
    }

    public function cargarXMLConfiguracion($datos)
    {
        foreach ($datos as $index => $dat) {
            if ($dat['codigooperacion'] != null) {
                $datos[$index]['datosgenerales'] = self::leerXmlConfiguracion($dat['codigooperacion']);
            }
        }
        return $datos;
    }

    public function leerXmlConfiguracion($codigooperacion)
    {
        $xml = substr($_SERVER['SCRIPT_FILENAME'], 0, strrpos($_SERVER['SCRIPT_FILENAME'], 'web'))
            .'apps/logistica/activos_fijos/comun/recursos/xml/configuraciones.xml';

        if (is_readable($xml)) {
            $xmlOperaciones = simplexml_load_file($xml);
            $jsonString = json_encode($xmlOperaciones);
            $mlConfiguraciones = json_decode($jsonString, true);
            $index = 0;
            foreach ($mlConfiguraciones['operaciones'] as $codigo) {
                if ($codigo['codigo']) {
                    if ($codigooperacion) {
                        if ($codigooperacion == $codigo['codigo']) {
                            $datos = "<b>descripcion:</b> {$codigo['descripcion']}<pre></pre>"."
                                "." <b>detalles:</b> {$codigo['detalles']}"." <pre></pre>"."
                                "." <b>codigo:</b> "
                                .$codigo['codigo']."<pre></pre>"." <b>tipo:</b> {$codigo['tipo']}"." <pre></pre>".
                            
                                " <b>icono:</b> {$codigo['icono']}".
                                " <pre></pre> "." <b>idinterfaz:</b> {$codigo['idinterfaz']}"." <pre></pre> ".
                                " <b>iddatosespecificos:</b> {$codigo['iddatosespecificos']}"." <pre></pre> ".
                                " <b>generacomprobante:</b> {$codigo['generacomprobante']}"."<pre></pre> ".
                                " <b>cierra:</b> {$codigo['cierra']}"." <pre></pre>".
                                " <b>afectacantidad:</b> {$codigo['afectacantidad']}"." <pre></pre>".
                                " <b>afectadisponible:</b> {$codigo['afectadisponible']}"."<pre></pre> ".
                                " <b>autogenerada: </b>{$codigo['autogenerada']}"."<pre></pre> ".
                                " <b>debe_depreciar:</b> {$codigo['debe_depreciar']}"."<pre></pre> ".
                                " <b>operacion_sobre_medios:</b> {$codigo['operacion_sobre_medios']}"." <pre></pre>".
                                " <b>signo: </b>{$codigo['signo']}"."<pre></pre> ".
                                " <b>atributos_dinamicos_editables:</b> {$codigo['atributos_dinamicos_editables']}".
                                "<pre></pre> ".
                                " <b>idestadoperacion:</b> {$codigo['idestadoperacion']}"." <pre></pre>".
                                " <b>reporte: nombre:</b> {$codigo['nombre']}, <b>id:</b> {$codigo['id']}, "
                                ." <b>función:</b> {$codigo['funcion']} <pre></pre>";
                            if ($codigo['campos_editables'] && $codigo['campos_editables'] == 1 || $codigo['campos_editables'] == 0) {
                                $datos .= ""
                                    ." <b>campos_editables:</b> {$codigo['campos_editables']}";
                            } else if ($codigo['campos_editables']) {
                                $datos .= self::getRecorrerCamporEditables($codigo);
                            }
                        }
                    } else {
                        $datos[$index]['codigo'] = $codigo['codigo'];
                        $datos[$index]['codigooperacion'] = $codigo['codigo'];
                        $datos[$index]['detalles'] = $codigo['detalles'];
                    }

                    $index++;
                }
            }
        }
        return $datos;
    }

    public function getRecorrerCamporEditables($camposeditables)
    {
        $string = " <b>campos_editables: </b>";
        $index = 0;
        foreach ($camposeditables['campos_editables'] as $edit) {
            if (count($camposeditables['campos_editables']) - 1 != $index) {
                $string .= "$edit,<pre></pre>";
            } else {
                $string .= "$edit<pre></pre>";
            }
            $index++;
        }
        return $string;
    }

    public function eliminarCodigoOperacion($codigooperacion)
    {

        if (count($codigooperacion) > 0) {
            foreach ($codigooperacion as $codigooper) {
                $cfcodigooper = Doctrine::getTable('NomOperaciones')->find($codigooper);
                $cfcodigooper->codigooperacion = null;
                $cfcodigooper->save();
            }
        }
    }

    public function selectDataForScriptApk($arr_consolidador)
    {


        // Llenando el usuario
        array_push($arr_consolidador['dat_usuario'], array(
            'id' => 1,
            'usuario' => 'administrador',
            'contrasenna' => 'admiin'
        ));

        // Llenando los activos
        array_push($arr_consolidador['dat_activo'], array(
            'id' => 1,
            'codigo' => '156484784',
            'denominacion' => 'AUTO',
            'marca' => 'Lamborghini',
            'modelo' => 'Gallardo',
            'nroserie' => 'SN-4568',
            'nroinventario' => 'INV-7898548',
            'responsable' => 'Mark Zuckerberg',
            'ubicacion' => '',
            'estado' => 'BUENO',
            'campoident' => 'MATRICULA',
            'datoident' => 'HK58554',
            'idarea' => '1'
        ));

        array_push($arr_consolidador['dat_activo'], array(
            'id' => 2,
            'codigo' => '156484784',
            'denominacion' => 'AUTO',
            'marca' => 'Mercedez Benz',
            'modelo' => '206 TM',
            'nroserie' => 'SN-49965',
            'nroinventario' => 'INV-788447',
            'responsable' => 'Steve Jobs',
            'ubicacion' => '',
            'estado' => 'BUENO',
            'campoident' => 'MATRICULA',
            'datoident' => 'HK581125',
            'idarea' => '2'
        ));

        array_push($arr_consolidador['dat_activo'], array(
            'id' => 3,
            'codigo' => '156484784',
            'denominacion' => 'AUTO',
            'marca' => 'Mercedez Benz',
            'modelo' => 'AMG S 65',
            'nroserie' => 'SN-6523',
            'nroinventario' => 'INV-441585',
            'responsable' => 'Bill Gates',
            'ubicacion' => '',
            'estado' => 'BUENO',
            'campoident' => 'MATRICULA',
            'datoident' => 'HK8879541',
            'idarea' => '3'
        ));

        // Llenando las areas
        array_push($arr_consolidador['dat_area'], array(
            'id' => 1,
            'nombre' => 'Garaje 1',
	        'responsable' => 'SUSUKI'
        ));

        array_push($arr_consolidador['dat_area'], array(
            'id' => 2,
            'nombre' => 'Garaje 2',
            'responsable' => 'SUSUKI'
        ));

        array_push($arr_consolidador['dat_area'], array(
            'id' => 3,
            'nombre' => 'Garaje 3',
            'responsable' => 'SUSUKI'
        ));

        // LLenando los conteos
        array_push($arr_consolidador['dat_conteopendiente'], array(
            'id' => 1,
            'nrodocumento' => '10',
            'tipodoc' => 'Conteo parcial',
            'fechainicio' => '01/05/2017',
            'fechafin' => ''
        ));

        array_push($arr_consolidador['dat_conteopendiente'], array(
            'id' => 2,
            'nrodocumento' => '11',
            'tipodoc' => 'Conteo parcial',
            'fechainicio' => '04/05/2017',
            'fechafin' => ''
        ));

        // Llenando los conteos activos
        array_push($arr_consolidador['conteosactivos'], array(
            'id' => 1,
            'idconteo' => 1,
            'idactivo' => 1
        ));

        array_push($arr_consolidador['dat_conteoactivo'], array(
            'id' => 2,
            'idconteo' => 2,
            'idactivo' => 2
        ));

        array_push($arr_consolidador['dat_conteoactivo'], array(
            'id' => 3,
            'idconteo' => 2,
            'idactivo' => 3
        ));


        return $arr_consolidador;
    }

}
