<?php

/**
 * @author Gerardo
 */
class RegistroActivoModel extends RegNumericoActivoModel/* AbstractCompositeModel */
{

    function RegistroActivoModel()
    {
        parent::__construct();
    }

    public function filters(Doctrine_Query &$query, $aliasTabla, $parametros = array())
    {
        if ($parametros['idsRegNumMostrarRO']) {
            $registrosMostrar = $parametros['idsRegNumMostrarRO'];
            $padreordenizq = $registrosMostrar->izquierdo;
            $padreordender = $registrosMostrar->derecho;
            $query->addWhere("$aliasTabla.ordenizq > $padreordenizq and $aliasTabla.ordender < $padreordender");
        }

        $query->andWhere(
            "$aliasTabla.idregnumerico not in (SELECT distinct(dmrn2.idregnumerico) FROM DatMovRegnumerico dmrn2)"
        );
        if ($parametros['paginado'] == 1 && !$parametros['anode'] && !$parametros['_id']) {
            $query->addWhere("$aliasTabla.idregnumerico = $aliasTabla.idpadre");
        }

        if ($parametros['descripciongrupo']) {
            $query->addWhere("ngsubg.denominacion ILIKE '{$parametros['descripciongrupo']}%'");
        }
        if ($parametros['denomactividad']) {
            $query->addWhere("nact.denominacion ILIKE '{$parametros['denomactividad']}%'");
        }
        if ($parametros['denomestadotecnico']) {
            $query->addWhere("net.denominacion ILIKE '{$parametros['denomestadotecnico']}%'");
        }
        if ($parametros['colorprim']) {
            $query->addWhere("ntc_prim.denominacion ILIKE '{$parametros['colorprim']}%'");
        }
        if ($parametros['colorsec']) {
            $query->addWhere("ntc_sec.denominacion ILIKE '{$parametros['colorsec']}%'");
        }
        if ($parametros['comparaciones']) {
            $this->filtersComparaciones($query, $aliasTabla, $parametros);
        }
    }

    public function filtersComparaciones(&$query, $aliasTabla, $parametros)
    {
        foreach ($parametros['comparaciones'] as $comparar) {
            $query->andWhere("$aliasTabla." . $comparar['campo'] . " " . $comparar['signo'] . " " . $comparar['valor']);
        }
    }

    public function adicionarActivo($parametros)
    {
        $this->guardarRegNumActivo($parametros);
    }

    public function elimiarActivo($parametros)
    {
        $this->beforeDelete($parametros);
    }

    public function cargarRegistroOperativos($parametros)
    {
        $parametros['tree'] = true;
        $query = parent::getQueryDataVisualizarRegNumActivos($parametros, 'drna');
        $query->leftJoin("drna.DatPlantilla pl");
        $query->addSelect('pl.denominacion as denominacionplantilla');
        $query->addSelect('pl.color as color');
        $this->filters($query, $this->baseAlias, $parametros);

        new CfgIdentificadorMedio();

        if ($parametros['criterio']) {
            $query->addWhere("i.codigo ILIKE '%{$parametros['criterio']}%'
                            OR nmarc.denominacion ILIKE '%{$parametros['criterio']}%'
                            OR nmod.denominacion ILIKE '%{$parametros['criterio']}%'");
        }

        if ($parametros['idespecialidad']) {
            $query->addWhere("i.idespecialidad = {$parametros['idespecialidad']}");
        }
        if (!$parametros['excluirProceso']) {
            $query->andWhereNotIn("drna.idestadoperacion", array(9));
        }
        $query->leftJoin('i.CfgIdentificadorMedio cfgId');
        $query->addSelect('cfgId.denominacion as denidentificador');
        $query->addSelect('cfgId.identificador as identificador');
        $query->addSelect('cfgId.tipo as tipoidentificador');
        $datos = $query->fetchArray();

        $query->limit(false);
        $query->addWhere('drna.idregnumerico = drna.idpadre');

        foreach ($datos as &$value) {

            $this->getArrayIdsImagenes($value['idregnumerico'], $value['idindicador'], $value);
            $atributosDinamicos = $this->getConfigDatosDinamicos($value);
            $this->obtenerIndentificadorIndicador($atributosDinamicos, $value);

            $agrupaciones = $this->getAgrupaciones($atributosDinamicos['datos']);

            $atri="";
            if($value['idtabla'] != -1)
            $atri = $this->getStringAtriDinam(
                $atributosDinamicos['componentes'], $agrupaciones, $value['idregnumerico'], $value['idtabla']
            );
            $value['atribDinamicos'] = $atri;
        }

        return array("datos" => $datos, "total" => $query->count());
    }

    /**
     * @param $atributosDinamicos
     * @param $value
     */
    public function obtenerIndentificadorIndicador($atributosDinamicos, &$value)
    {
        if ($value['tipoidentificador'] == 2) {
            foreach ($atributosDinamicos['componentes'] as $cmp) {
                $nombre = str_replace(".", "_", $value['identificador']);
                if ($cmp['name'] == $nombre) {
                    $value['valoridentificador'] = $cmp['value'];
                    break;
                }

            }

        } else {
            $value['valoridentificador'] = $value[$value['identificador']];
        }
    }

    public function cargarActivobusqAvanzada($parametros)
    {
        $parametros['datos'][0]->tree = true;
        $query = $this->getRegNumActivoBusqAvanzada($parametros);
        $query->leftJoin('i.CfgIdentificadorMedio cfgId');
        $query->addSelect('cfgId.denominacion as denidentificador');
        $query->addSelect('cfgId.identificador as identificador');
        $query->addSelect('cfgId.tipo as tipoidentificador');
        $this->filters($query, $this->baseAlias, $parametros);
        $datos = $query->fetchArray();
        foreach ($datos as &$value) {
            /*$color = NomencladoresActivosService::getColorById($value['idcolorprim']);
            $colorSec = NomencladoresActivosService::getColorById($value['idcolorsec']);

            $value['denomcolorprim'] = $color['denominacion'];
            $value['denomcolorsec'] = $colorSec['denominacion'];*///Ya se cargan los colores

            $this->getArrayIdsImagenes($value['idregnumerico'], $value['idindicador'], $value);
            if ($value['idtabla'] && $value['idtabla'] != -1) {
                $atributosDinamicos = $this->getConfigDatosDinamicos($value/* ,$configFormulario, $active_record */);
                $this->obtenerIndentificadorIndicador($atributosDinamicos, $value);
                $agrupaciones = $this->getAgrupaciones($atributosDinamicos['datos']);
                $atri = $this->getStringAtriDinam(
                    $atributosDinamicos['componentes'], $agrupaciones, $value['idregnumerico'], $value['idtabla']
                );
                $value['atribDinamicos'] = $atri;
            }
        }
        return array("datos" => $datos, "total" => $query->count());
    }

    private function getImgBD($arrayImagenes, &$cacheImagen)
    {
        $arrayIMG = array();
        foreach ($arrayImagenes as $key => $idImagen) {
            if (!$cacheImagen[$idImagen['idimagen']]) {
                $cacheImagen[$idImagen['idimagen']] = LogisticaImagenHelper::__init()->obtenerImagenDb(
                    $idImagen['idimagen']
                );
            }
            $arrayIMG[] = array(
                'idimagen' => $idImagen['idimagen'],
                'src' => $cacheImagen[$idImagen['idimagen']]
            );
        }
        return $arrayIMG;
    }

    /**
     * metodo que devuelve las imagenes del registro numerico
     */
    public function getArrayIdsImagenes($idregnumerico, $idindicador, &$value)
    {
        $arrayImgenesRegistro = Doctrine_Query::create()
            ->select('ir.idimagen as idimagen')
            ->from('DatImagenRegnumerico ir')
            ->where('ir.idregnumerico = ?', array($idregnumerico))
            ->fetchArray();
        $arrayImagenesIndicador = $this->getIdImagenIndicador($idindicador);
        $cacheImagen = array();
        $value['imagenesIndicador'] = self::getImgBD($arrayImagenesIndicador, $cacheImagen);
        $value['imagenesRegistro'] = self::getImgBD($arrayImgenesRegistro, $cacheImagen);
    }

    /*
     * Metodo para buscar los componenetes visuales que se van a mostrar en la vista
     * segun la configuracion de atributos dinamicos que se le hizo al indicador
     */

    public function getConfigDatosDinamicos($parametros)
    {
        $idregnumerico = null;
        if ($parametros['idregnumerico']) {
            $idregnumerico = $parametros['idregnumerico'];
        }
        $maestroProducto = new MaestroProductoModel();
        $arrIdesTabla = $parametros['arridtablas'];
        $componentesDin = array();
        $datosDin = array();
        if (!is_array($arrIdesTabla) && $arrIdesTabla) {
            $arrIdesTabla = explode(',', $arrIdesTabla);
            $arrIdesTabla = array_unique($arrIdesTabla);
        }
        foreach ($arrIdesTabla as $idtabla) {
            $idtabla += 0;
            if ($idtabla != -1) {
                $query = $maestroProducto->getQueryIndicador('ind');
                $query->addWhere("ind.idtabla=?", array($idtabla));
                $ind = $query->fetchArray();
                $parametros['idindicador'] = $ind[0]['idindicador'];
                $parametros['idtabla'] = $idtabla;
                $datos = $this->configuracionHelper->getAtributosAgrupacionIndicador($parametros);

                if (count($datos) != 0) {
                    $idregnumerico += 0;
                    $componentes = $this->getComponentesTabla(
                        $idtabla, $idregnumerico/* , $configFormulario, $active_record */
                    );

                    foreach ($componentes as &$value) {
                        foreach ($datos as $dat) {
                            if ($value['id'] == $dat->idcampo) {
                                $value['tab'] = $dat->agrupacion;
                                $value['idtabla'] = $idtabla;
                                break;
                            }
                        }
                    }
                    $componentesDin = array_merge($componentes, $componentesDin);
                    $datosDin = array_merge($datosDin, $datos);
                }


            }
        }

        return array('componentes' => $componentesDin, 'datos' => $datosDin);
    }

    /*
     * metodo que devuelve las imagenes del indicador
     */

    public function getIdImagenIndicador($idindicador)
    {
        $images = Doctrine_Query::create()->select("img.idimagen as idimagen")
            ->from("DatImagenindicador img")
            ->where("img.idindicador = ?", $idindicador)
            ->fetchArray();
        return $images;
    }

    public function getAgrupaciones($parametros)
    {
        $agrupaciones = array();
        foreach ($parametros as $key => $value) {
            if (count($agrupaciones) == 0) {
                $agrupaciones[] = $value->agrupacion;
            } else {
                if (!in_array($value->agrupacion, $agrupaciones)) {
                    $agrupaciones[] = $value->agrupacion;
                }
            }
        }
        return $agrupaciones;
    }

    /**
     * Metodo para obtener los componentes de la interfaz dado el idtabla
     * para los atributos dinamicos
     */
    public function getComponentesTabla($idtabla, $idregnumerico)
    {
        $parametros['idtabla'] = $idtabla;
        $parametros['idregnumerico'] = $idregnumerico;
        $arWhere = array();
        if ($idregnumerico) {
            $arWhere[0] = "idregnumerico = $idregnumerico";
        }
        $configFormulario = $this->metadataModel->obtenerConfigFormulario($idtabla);

        $activeRecord = $this->metadataModel->obtenerInfoTabla($idtabla, array(), 'left');

        $_items = $configFormulario->items;
        unset($configFormulario->items);
        if (count($_items)) {
            /**
             * Creo el query para buscar los valores de los campos
             */
            if (count($arWhere)) {
                $configQuery = $activeRecord;
                $configQuery->ar_where = $arWhere;
                $tempAlias = $configQuery->ar_select;
                /**
                 * Obtengo los datos
                 */
                $respuesta = $configQuery->get()->result_array();
                $datos[] = $respuesta[0];
                $datosRew = $respuesta;//array();
                /*foreach ($datos as $pos => $dat) {
                    $i = 0;
                    foreach ($dat as $index => $d) {
                        $str = strrpos($tempAlias[$i], ' as ');
                        $sust = substr($tempAlias[$i], $str + 4);
                        $temppos = $sust;
                        $datosRew[$pos][$temppos] = $datos[$pos][$index];
                        unset($datos[$pos][$index]);
                        $i++;
                    }
                }*/
            }
            $items[] = array('items' => $_items, 'idtabla' => $idtabla);
        }
        /**
         * Conformo la respuesta
         */
        $data = array();
        foreach ($items as $item) {

            foreach ($item['items'] as $key => $value) {

                if (strlen($value['fieldLabel'])) {
                    $value['idtabla'] = $item['idtabla'];
                    $value['data'] = null;
                    $value['value'] = null;

                    if ($datos) {
                        $datos = $datosRew;
                        foreach ($datos as $dato) {
                            foreach ($dato as $keyValue => $valueData) {
                                if ($value['name'] == $keyValue || $value['hiddenName'] == $keyValue) {

                                    if ($value['xtype'] == 'checkbox') {
                                        $value['data'] = ($valueData == 1) ? "Si" : "No";
                                        $value['value'] = $valueData;
                                    } else {
                                        if ($value['xtype'] == 'datefield') {
                                            $fecha = explode('[/-]', $valueData);
                                            $value['data'] = (strlen($fecha[0]) == 4) ?
                                                $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : $valueData;
                                            $value['value'] = (strlen($fecha[0]) == 4) ?
                                                $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : $valueData;
                                        } else {
                                            $value['data'] = $valueData;
                                            $value['value'] = $valueData;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $data[count($data)] = $value;
                }
            }
        }
        $activeRecord->_reset_select();
        return $data;
    }

    private function getStringAtriDinam($atributosDinamicos, $agrupaciones, $idregnumerico, $idtabla)
    {
        $atri = "";
        for ($i = 0; $i < count($agrupaciones); $i++) {
            $atri .= '<p><b>' . $agrupaciones[$i] . ':' . '</b>' . " { ";
            foreach ($atributosDinamicos as $j => $cmp) {
                if ($agrupaciones[$i] == $cmp['tab']) {

                    if ($cmp['xtype'] == 'combo') {
                        $arWhere = array();
                        if ($idregnumerico) {
                            $arWhere[0] = "idregnumerico = $idregnumerico";
                        }
                        $configQuery = $this->metadataModel->obtenerInfoTabla($idtabla, array(), 'left');
                        $configQuery->ar_where = $arWhere;
                        $tempAlias = $configQuery->ar_select;
                        /**
                         * Obtengo los datos
                         */
                        $respuesta = $configQuery->get()->result_array();
                        $datos[] = $respuesta[0];
                        $datosNew = $respuesta;
                        /*foreach ($datos as $pos => $dat) {
                            $h = 0;
                            foreach ($dat as $index => $d) {
                                $temppos = substr($tempAlias[$h], strrpos($tempAlias[$h], ' as ') + 4);
                                $datosNew[$pos][$temppos] = $datos[$pos][$index];
                                unset($datos[$pos][$index]);
                                $h++;
                            }
                        }*/
                        $valorCombo = $datosNew[0][$cmp['displayField']];
                        $atri .= $cmp['fieldLabel'] . " : " . '"' . $valorCombo . '"' . "&nbsp;";
                        if ($j != count($atributosDinamicos) - 1) {
                            $atri .= "&nbsp;&nbsp;&nbsp;";
                        }
                    } else {
                        $atri .= $cmp['fieldLabel'] . " : " . '"' . $cmp['data'] . '"' . "&nbsp;";
                        if ($j != count($atributosDinamicos) - 1) {
                            $atri .= "&nbsp;&nbsp;&nbsp;";
                        }
                    }
                }
                if ($j == count($atributosDinamicos) - 1) {
                    $atri .= " } " . " <br/>";
                }
            }
        }
        return $atri;
    }

    /**
     * Inserta uno a varios registros en un documento
     * parametros->arreglo con los valores
     *           -(obligatorio)iddocumento id del documento donde se van a insertar los activos
     *           -(regnumericos)arreglo de objetos qie tienen el izquiero y el derecho de cada activo que se quiera
     * insertar en el documento.
     */
    public function insertRegDoc($parametros)
    {
        if ($this->mModuloRegNum) {
            $cDatProductoLogistica = 'DatProductoLogistica';
            $cNomIndicador = 'NomIndicador';
            $cDatRegnumericoActivo = 'DatRegnumericoActivo';

            $doc = Doctrine::getTable('DatDocumento')->find($parametros['iddocumento']);

            $idproductos = array();
            $valores = array();
            $sRegNumActivo = new RegNumActivoService();
            $sRegNumActivo->initReNumActivoModel();
            $objRegNumAftModel = $sRegNumActivo->getObjRegNumActivoModel();
            $validarDatos = 0;
            foreach ($parametros['regnumericos'] as $value) {

                $hijos = $this->mModuloRegNum->getHijosModulo($value->izquierdo, $value->derecho, $value->idarbol);

                foreach ($hijos as $i => $reg) {
                    $objDatRegnumerico = Doctrine::getTable('DatRegnumerico')->find($reg['idregnumerico']);
                    $objDatRegnumerico->$cDatRegnumericoActivo->idarearesp = $doc->idestructuracomun;
                    if ($objDatRegnumerico->$cDatRegnumericoActivo->idestadoperacion == 9)
                    {
                        continue;
                    }
                    $validarDatos++;
                    // Esto es para conocer que el registro esta siendo usado en un documento que no esta aprobado.
                    $objDatRegnumerico->enproceso = 1;
                    $objDatRegnumerico->save();

                    $objDatRegnumerico->$cDatProductoLogistica->NomIndicador;
                    $arridtabla = $objDatRegnumerico->$cDatProductoLogistica->$cNomIndicador->arridtablas;
                    $datos = $objDatRegnumerico->$cDatRegnumericoActivo->toArray();
                    $datos['idprod'] = $reg['idprod'];
                    $datos['arridtablas'] = $arridtabla;

                    foreach ($objRegNumAftModel->getListaPlugins() as $plugin) {
                        $objDatRegnumericoActivoTransp = $plugin->getDatRegnumericoActivoplugin($reg['idregnumerico']);
                        $datos = array_merge($datos, $objDatRegnumericoActivoTransp->toArray());
                    }
                    $valores[] = $datos;
                    $idproductos[] = $objDatRegnumerico->idproducto;
                }
            }

            if($validarDatos == 0) {
                if ($parametros['nuevo']) {
                    $doc->delete();
                }
                return false;
            }
            /**
             * Para inyectar las relaciones hasMany/hasOne desde DatMovimientos para DatMovRegnumerico y desde
             * DatMovRegnumericoActivo para DatMovRegnumerico
             */
            new DatMovRegnumerico();
            new DatMovRegnumericoActivo();
            $mov = new MovimientoService();
            $datDocumento = $mov->crearMovimiento($valores, $doc);
            $datDocumento->save();
            $conn = Zend_Registry::get('conexion');

            // Para ponerle los atributos dinámicos a ese movimiento.
            foreach ($valores as $i => $rn) {
                $arridtabla = explode(',', $rn['arridtablas']);
                foreach ($arridtabla as $idtabla) {
                    if ($idtabla && $idtabla != -1) {
                        $sql
                            = "SELECT dt.esquema, dt.tabla
                            FROM mod_metadata.dat_tabla dt
                            WHERE dt.idtabla = $idtabla";

                        $dir = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                        $update
                            = "UPDATE {$dir[0]['esquema']}.{$dir[0]['tabla']}
                    SET idmovregnumerico = (
                        SELECT mrn.idmovregnumerico
                        FROM mod_logactivofijotangible.dat_movregnumerico mrn
                        INNER JOIN mod_logistica.dat_movimiento m ON mrn.idmovimiento = m.idmovimiento
                        WHERE m.iddocumento = {$datDocumento->iddocumento}"
                            . " AND mrn.idregnumerico = {$rn['idregnumerico']}
                        )
                    WHERE idmovregnumerico = idregnumerico AND idregnumerico = {$rn['idregnumerico']}";
                        $conn->execute($update);
                    }
                }
            }
            return $this->actualizarProdRegNumerico($idproductos);
        } else {
            throw new ZendExt_Exception('LOG_AFT_RN_003');
        }
    }

    public function clonePluginsData($arrRegNumOld, $arrRegNumNew)
    {
        foreach ($this->getListaPlugins() as $key => $plugin) {
            $plugin->clonePluginsData($arrRegNumOld, $arrRegNumNew);
        }
    }

    function cargardepositos($iddeposito = null, $arrDepositos = array(), $filtro = null, $limit = null, $start = null,
                             $tipo = null, $idestructura = null
    )
    {
        $this->serviciosEstructComposicion = ServiciosEstructuraComposicionHelper::__init();
        $idestructura = ($idestructura) ? $idestructura : $this->global->Estructura->idestructura;
        if (isset($iddeposito) && !$filtro) {

            $index = 0;
            $area = $this->serviciosEstructComposicion->getAreasPorId($iddeposito);
            $datos[$index]['iddeposito'] = $iddeposito;
            $datos[$index]['deposito'] = $area[0]['denominacion'];
        } else {
            $arraIdsDeposit = null;
            if (isset($iddeposito)) {
                $arraIdsDeposit = array($iddeposito);
            }

            $depositos = $this->serviciosEstructComposicion->obtenerEstructurasNoFormales(
                false, $idestructura, $filtro, $limit, $start, $arraIdsDeposit, $tipo
            );

            if (!empty($arrDepositos)) {
                $depositos = array_intersect($depositos, $arrDepositos);
            }
            $datos = array();
            foreach ($depositos as $index => $r) {
                $datos[$index]['iddeposito'] = $r['idfila'];
                $datos[$index]['id'] = $r['idfila'];
                $datos[$index]['deposito'] = $r['text'];
                $datos[$index]['text'] = $r['text'];
                $datos[$index]['leaf'] = true;
            }
        }
        return array('depositos' => $datos);
    }
}
