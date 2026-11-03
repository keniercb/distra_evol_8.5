<?php

/**
 * NomIndicador
 *
 *
 * @ author Dionisdel Ponce Santana
 * @ package PlanificaciÃƒÂ³n
 * @ subpackage PlanificaciÃƒÂ³n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class NomIndicador extends BaseNomIndicador {

    public function setUp() {
        parent::setUp();
        $this->hasMany('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idpadre'));
        $this->hasOne('NomIndicadorplanif', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatNorma', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatDestino', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatIndicadorcentrobalance', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatNecesidaddesglose', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomAprobacion', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion'));
        $this->hasMany('DatBasescalculo', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomDatosnomenclador', array('local' => 'idnaturaleza', 'foreign' => 'iddatosnomenclador'));
        $this->hasMany('DatIndicadorviaadquisicion', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany(
                'DatIndicadorviaadquisicionorganosatisface', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasMany('DatIndicadorcentrobalance', array('local' => 'idindicador', 'foreign' => 'idindicador'));

        $this->hasMany('DatPlanificacion', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatAjusteexistencia', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatArrendamiento', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomIndicadoruam', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('DatCartatecnologicaindicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatDatosclasificadorindicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatSalida', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('TempInsnorma', array('local' => 'codigo', 'foreign' => 'codigo'));
        $this->hasMany('TempInsindicador', array('local' => 'codigo', 'foreign' => 'codigo'));
        $this->hasMany('TempIndicadorprecio', array('local' => 'codigo', 'foreign' => 'codigo'));
        $this->hasMany('DatBasescalculosalida', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatIndicadormodelo', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatControldivisaindicadormodelo', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasOne('DatEtapaEquipo', array('local' => 'idindicador', 'foreign' => 'idindicador'));
    }

    //LISTAR LOS INDICADORES EN EL GRID PRINCIPAL
    public function listar($parametros, $idpadre, $idarbol, $start, $limit, $idEstructura, $flagfiltros, $idejercicio) {
        $query = new Doctrine_Query ();
        $query_total = new Doctrine_Query ();
        $devolverPadre = ($idpadre == 0 ? "null as _parent" : "idpadre as _parent");
        foreach ($parametros as $p => $s) {
            if ($s != '') {
                if ($p == 'denominacion') {
                    $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    $query_total->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                } else if ($p == 'codigo') {
                    $query->addWhere("n.codigo LIKE ? ", ("$s%"));
                    $query_total->addWhere("n.codigo LIKE ? ", ("$s%"));
                } else if ($p == 'numeropieza') {
                    $query->addWhere("upper(n.numeropieza) LIKE '%" . strtoupper($s) . "%'");
                    $query_total->addWhere("upper(n.numeropieza) LIKE '%" . strtoupper($s) . "%'");
                } else if ($p == 'identidaddatosnomenclador') {
                    if ($idpadre != null) {
                        $query->addWhere("r.$p=?", $s);
                        $query_total->addWhere("r.$p=?", $s);
                    } else {
                        $query->addWhere("r.$p=?", $s);
                        $query_total->addWhere("r.$p=$s ");
                    }
                } else if ($p == 'nivelsi') {
                    $query->addWhere("n.nivel  = 1 ");
                    $query_total->addWhere("n.nivel  = 1 ");
                } else if ($p == 'nivelno') {
                    $query->addWhere("n.nivel  = 0 ");
                    $query_total->addWhere("n.nivel  = 0 ");
                } else if ($p == 'idaprobacionsi') {
                    $query->addWhere("np.idaprobacion = 4 OR np.idaprobacion = 3");
                    $query_total->addWhere("np.idaprobacion = 4 OR np.idaprobacion = 3");
                } else if ($p == 'idaprobacionno') {
                    $query->addWhere("np.idaprobacion = 1 ");
                    $query_total->addWhere("np.idaprobacion = 1 ");
                } else if ($p == 'idumedida') {
                    $query->addWhere("n.$p=?", $s);
                    $query_total->addWhere("n.$p=?", $s);
                }
                //ESTO ES PK NO ME HACE FALTA EL PARAMETRO "USO", NO BORRAR PUES PODRIA HACER FALTA LUEGO
                else if ($p == 'uso') {
                    if ($s) {
                        $query->addWhere("nr.idindicador IS NOT NULL OR   pl.idindicador IS NOT NULL ");
                        $query_total->addWhere("nr.idindicador IS NOT NULL OR   pl.idindicador IS NOT NULL ");
                    } else {
                        $query->addWhere("nr.idindicador IS NULL AND  pl.idindicador IS NULL ");
                        $query_total->addWhere("nr.idindicador IS NULL AND  pl.idindicador IS NULL ");
                    }
                } else {
                    if ($p == 'estadosi') {
                        $query->addWhere("n.estado  = 1 ");
                        $query_total->addWhere("n.estado  = 1 ");
                    } else {
                        if ($p == 'estadono') {
                            $query->addWhere("n.estado  = 0 ");
                            $query_total->addWhere("n.estado  = 0 ");
                        } else {
                            if ($p == 'naturaleza') {
                                $query->addWhere("n.$p=?", $s);
                                $query_total->addWhere("n.$p=?", $s);
                            } else {
                                if ($p == 'idpais') {
                                    $query->addWhere("n.$p=?", $s);
                                    $query_total->addWhere("n.$p=?", $s);
                                } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3') {
                                    $query->addWhere(" n.precio " . $s['condicion'] . " ?", $s['precio']);
                                    $query_total->addWhere(" n.precio " . $s['condicion'] . " ?", $s['precio']);
                                } elseif ($p == 'coeficiente_condicion1' || $p == 'coeficiente_condicion2' || $p == 'coeficiente_condicion3'
                                ) {
                                    $query->addWhere(" COALESCE((SELECT (inp.precio / inp.preciodivisa)  FROM NomIndicador in  LEFT JOIN NomIndicadorplanif inp ON(in.idindicador = inp.idindicador) WHERE in.idindicador = n.idindicador AND inp.preciodivisa <> 0),0) " . $s['condicion'] . " ?", $s['coeficiente']);
                                    $query_total->addWhere(" COALESCE((SELECT (ip.precio / ip.preciodivisa)  FROM NomIndicador i LEFT JOIN NomIndicadorplanif ip ON(i.idindicador = ip.idindicador)  WHERE i.idindicador = n.idindicador AND ip.preciodivisa <> 0),0) " . $s['condicion'] . " ?", $s['coeficiente']);
                                } elseif ($p == 'preciodivisa_condicion1' || $p == 'preciodivisa_condicion2' || $p == 'preciodivisa_condicion3') {
                                    $query->addWhere(" n.preciodivisa " . $s['condicion'] . " ?", $s['preciodivisa']);
                                    $query_total->addWhere(
                                            " n.preciodivisa " . $s['condicion'] . " ?", $s['preciodivisa']
                                    );
                                } elseif ($p == 'flete_condicion1' || $p == 'flete_condicion2' || $p == 'flete_condicion3') {
                                    $query->addWhere(" n.flete " . $s['condicion'] . " ?", $s['flete']);
                                    $query_total->addWhere(" n.flete " . $s['condicion'] . " ?", $s['flete']);
                                } elseif ($p == 'contingencia_condicion1' || $p == 'contingencia_condicion2' || $p == 'contingencia_condicion3') {
                                    $query->addWhere(" n.contingencia " . $s['condicion'] . " ?", $s['contingencia']);
                                    $query_total->addWhere(
                                            " n.contingencia " . $s['condicion'] . " ?", $s['contingencia']
                                    );
                                } elseif ($p == 'idviaadquisicion') {
                                    $query->addWhere("z.$p=?", $s);
                                    $query_total->addWhere("z.$p=?", $s);
                                } elseif ($p == 'idorganosatisface') {
                                    $query->addWhere("upper(norg.denominacion) LIKE '%" . strtoupper($s) . "%'");
                                    $query_total->addWhere("upper(norg.denominacion) LIKE '%" . strtoupper($s) . "%'");
                                } elseif ($p == 'identidad') {
                                    $query->addWhere("r.$p=?", $s);
                                    $query_total->addWhere("r.$p=?", $s);
                                } elseif ($p == 'idmodelo') {
                                    if ($s == '-') {
                                        $query->addWhere("im.$p is null");
                                        $query_total->addWhere("im.$p is null");
                                    } else {
                                        $query->addWhere("im.$p=?", $s);
                                        $query_total->addWhere("im.$p=?", $s);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if ($parametros['nivelarbol'] != null && $parametros['nivelarbol'] != '' && $idpadre == null) {
            $query->addWhere("n.nivelarbol = ?", $parametros['nivelarbol']);
            $query_total->addWhere("n.nivelarbol = ?", $parametros['nivelarbol']);
            $flagfiltros = 2;
        }
        if ($idpadre) {
            $query->addWhere("n.idpadre = " . $idpadre . " AND n.idpadre <> n.idindicador ");
            $query_total->addWhere("n.idpadre = " . $idpadre . " AND n.idpadre <> n.idindicador ");

            if ($idarbol != null) {
                $query->addWhere("n.idarbol = " . $idarbol);
                $query_total->addWhere("n.idarbol = " . $idarbol);
            }
        } else {
            if ($flagfiltros != 2) {
                $query->addWhere("n.idpadre = n.idindicador");
                $query_total->addWhere("n.idpadre = n.idindicador");
            }
        }

        $data->data = $query->select(
                        "n.idindicador,n.idarbol,n.codigo,
                                                n.numeropieza, n.idumedida, n.denominacion, n.descripcion,
                                                n.idumedida, ROUND(np.precio, 6) AS precio, ROUND(np.preciodivisa, 6) AS preciodivisa,
                                                COALESCE((SELECT (i.precio / i.preciodivisa)  FROM NomIndicadorplanif i  WHERE i.idindicador = n.idindicador AND i.preciodivisa <> 0),0) as coeficiente,
                                                 n.ordender, n.ordenizq,
                                                e.identidaddatosnomenclador, e.identidaddatosnomenclador as idcb , n.estado, np.idaprobacion, np.nivelplanif as nivel,
                                                n.idnaturaleza as naturaleza, n.idpais, n.nivel as nivelarbol,
                                                np.flete, np.contingencia, n.idformato, n.idpadre, z.idviaadquisicion,
                                                dn.idorganosatisface, r.identidad," . $devolverPadre . ',(( ordender - ordenizq) = 1) as _is_leaf,
                                    nvia.denominacion, norg.idorganosatisface, norg.denominacion,
                                    im.idmodelo,mod.denominacion as denmodelo, nr.idindicador as indicadornorma, pl.idindicador as indicadorplanif
                                    '
                )
                ->from("NomIndicador n")
                ->leftjoin('n.NomIndicadorplanif np')
                ->leftjoin('n.DatIndicadorviaadquisicion z')
                ->leftjoin('z.NomViaadquisicion nvia')
                ->leftjoin("z.DatIndicadorviaadquisicionorganosatisface dn WITH z.idindicador = dn.idindicador")
                ->leftjoin("dn.NomOrganosatisface norg")
                ->leftjoin("n.DatIndicadorcentrobalance e")
                ->leftjoin("e.DatEntidaddatosnomenclador r")
                ->leftjoin("n.DatIndicadormodelo im")
                ->leftjoin("im.DatModelo mod")
                ->leftjoin("n.DatNorma nr")
                ->leftjoin("n.DatPlanificacion pl")
                ->orderby("n.codigo")
                ->offset($start)
                ->limit($limit)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        $data->total = $query_total->select("COUNT(DISTINCT n.idindicador) as total")
                        ->from("NomIndicador n, n.DatIndicadorviaadquisicion z,  z.NomViaadquisicion nvia")
                        ->leftjoin("z.DatIndicadorviaadquisicionorganosatisface dn WITH z.idindicador = dn.idindicador")
                        ->leftjoin("dn.NomOrganosatisface norg")
                        ->leftjoin("n.DatIndicadorcentrobalance e")
                        ->leftjoin("e.DatEntidaddatosnomenclador r")
                        ->leftjoin("n.DatIndicadormodelo im")
                        ->leftjoin("n.DatNorma nr")
                        ->leftjoin("n.DatPlanificacion pl")
                        ->execute()->getFirst()->total;
        return $data;
    }

    public function buscarIndicador($codigo, $asobj = null) {
        $query = new Doctrine_Query ();
        if ($asobj) {
            return $query
                            ->from('NomIndicador n')
                            ->where("n.codigo = ?", $codigo)
                            ->execute();
        }
        else
            return $query->select('n.idindicador as id')
                            ->from('NomIndicador n')
                            ->where("n.codigo = ?", $codigo)
                            ->execute()
                            ->toArray();
    }

    public function servBasesPlan_listarIndicadoresBasesPlan($parametros) {
        $query = new Doctrine_Query ();
        $query->from("NomIndicador n");
        $array_parametros = array();
        $condiciones = array();
        if ($parametros ['filtros']) {
            foreach ($parametros ['filtros'] as $key => $datos) {
                if ($datos ['field'] == 'codigo') {
                    $condiciones [] = "ind.codigo LIKE ? ";
                    $array_parametros [] = "{$datos ['data'] ['value']}%";
                } elseif ($datos ['field'] == 'denominacion') {
                    $condiciones [] = "upper(ind.denominacion) LIKE ? ";
                    $array_parametros [] = "%" . strtoupper($datos ['data'] ['value']) . "%";
                } elseif ($datos ['field'] == 'numeropieza') {
                    $condiciones [] = "upper(ind.numeropieza) LIKE ? ";
                    $array_parametros [] = "%" . strtoupper($datos ['data'] ['value']) . "%";
                } elseif ($datos ['field'] == 'descripcion') {
                    $condiciones [] = "upper(ind.descripcion) LIKE ? ";
                    $array_parametros [] = "%" . strtoupper($datos ['data'] ['value']) . "%";
                } elseif ($datos ['field'] == 'idumedida') {
                    $condiciones [] = "ind.idumedida = ? ";
                    $array_parametros [] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones [] = "indp.precio > ?";
                        $array_parametros [] = "" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones [] = "indp.precio < ?";
                        $array_parametros [] = "" . $datos ['data'] ['value'] . "";
                    } else {
                        $condiciones [] = "indp.precio = ?";
                        $array_parametros [] = "" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'preciodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones [] = "indp.preciodivisa > ?";
                        $array_parametros [] = "" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones [] = "indp.preciodivisa < ?";
                        $array_parametros [] = "" . $datos ['data'] ['value'] . "";
                    } else {
                        $condiciones [] = "indp.preciodivisa = ?";
                        $array_parametros [] = "" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'idcentrobalance') {
                    $condiciones [] = "indc.identidaddatosnomenclador  = ? ";
                    $array_parametros [] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'idnaturaleza') {
                    $query->addWhere("n.idnaturaleza = " . $datos ['data'] ['value']);
                    $condiciones [] = "ind.idnaturaleza = ? ";
                    $array_parametros [] = $datos ['data'] ['value'];
                }
            }
        }
        $idactividad = $parametros['idactividad'];
        $idejercicio = $parametros['idejercicio'];

        $ADDWHERE = "";
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . " AND " . $condicion . " ";
        }
        $conn = Doctrine_Manager::connection();
        $sql_ = "SELECT ind.ordender,
                          ind.ordenizq,
                          ind.idindicador,
                          ind.denominacion,
                          ind.codigo,
                          ind.descripcion,
                          ind.idformato,
                          ind.estado,
                          indp.nivelplanif,
                          ind.idpais,
                          indp.idaprobacion,
                          indp.precio,
                          indp.preciodivisa,
                          ind.idumedida,
                          ind.numeropieza,
                          indp.flete,
                          indp.contingencia,
                          ind.idnaturaleza as idnaturaleza,
                          ind.idumedida,
                          indc.identidaddatosnomenclador as idcentrobalance                                                
                       FROM mod_datosmaestros.nom_indicador ind
                       LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp ON ( ind.idindicador = indp.idindicador)
                       LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance indc ON( ind.idindicador = indc.idindicador )
                      WHERE  
                       indp.nivelplanif = 1 
                       AND ind.estado = 1                     
                       AND ( indp.idaprobacion = 4 )
                        AND
                       ind.idindicador NOT IN(
                       SELECT nor.idindicador 
                       FROM mod_planificacion.dat_norma nor
                       WHERE nor.idactividad = $idactividad AND nor.idejercicio = $idejercicio)
                       $ADDWHERE 
                       ORDER BY ind.codigo 
                       OFFSET {$parametros['start']} 
                       LIMIT {$parametros['limit']} ";

        $data->data = $conn->execute($sql_, $array_parametros)->fetchAll(PDO::FETCH_ASSOC);

        $sql_total = "SELECT COUNT( DISTINCT ind.idindicador ) as total
                FROM mod_datosmaestros.nom_indicador ind
                       LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp ON ( ind.idindicador = indp.idindicador)
                       LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance indc ON( ind.idindicador = indc.idindicador )
                      WHERE  
                       indp.nivelplanif = 1 
                       AND ind.estado = 1                     
                       AND ( indp.idaprobacion = 4 )
                        AND
                       ind.idindicador NOT IN(
                       SELECT nor.idindicador 
                       FROM mod_planificacion.dat_norma nor
                       WHERE nor.idactividad = $idactividad AND nor.idejercicio = $idejercicio)
                       $ADDWHERE  ";
        $result_ = $conn->execute($sql_total, $array_parametros)->fetchAll(PDO::FETCH_ASSOC);

        $data->total = $result_ [0] ['total'];
        return $data;
    }

    public function listarIndicadoresBuscarInd($parametros) {
        $query = new Doctrine_Query ();
        $query->from("NomIndicador n");
        $array_parametros = array();
        $addWhere = "";
        $condiciones = array();
        if ($parametros ['filtros']) {
            foreach ($parametros ['filtros'] as $key => $datos) {

                if ($datos ['field'] == 'codigo') {
                    $condiciones [] = "ind.codigo LIKE ? ";
                    $array_parametros [] = "{$datos ['data'] ['value']}%";
                } elseif ($datos ['field'] == 'estado') {
                    if ($datos ['data'] ['value'] == "Si") {
                        $addWhere.= " AND ind.estado  = 1 ";
                    } else {
                        $addWhere.= " AND ind.estado  = 0 ";
                    }
                } elseif ($datos ['field'] == 'aprobacion') {

                    if ($datos ['data'] ['value'] == "Si") {
                        $addWhere.= " AND indp.idaprobacion  = 3 ";
                    } else if ($datos ['data'] ['value'] == "Rector") {
                        $addWhere.= " AND indp.idaprobacion  = 4 ";
                    } else {
                        $addWhere.= " AND (indp.idaprobacion  = 1 OR indp.idaprobacion  = 2)";
                    }
                } elseif ($datos ['field'] == 'denominacion') {
                    $condiciones [] = "upper(ind.denominacion) LIKE ? ";
                    $array_parametros [] = "%" . strtoupper($datos ['data'] ['value']) . "%";
                }
            }
        }

        $ADDWHERE = "";
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . " AND " . $condicion . " ";
        }
        $conn = Doctrine_Manager::connection();
        $sql_ = "SELECT 
                          ind.idindicador,
                          ind.denominacion,
                          ind.codigo,                          
                          ind.estado,
                          indp.idaprobacion as aprobacion                                           
                       FROM mod_datosmaestros.nom_indicador ind
                       LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp ON(ind.idindicador = indp.idindicador)
                       LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance indc ON( ind.idindicador = indc.idindicador )
                       WHERE  indp.nivelplanif = 1
                       $addWhere
                       $ADDWHERE 
                       ORDER BY ind.codigo 
                       OFFSET {$parametros['start']} 
                       LIMIT {$parametros['limit']} ";
        $data->data = $conn->execute($sql_, $array_parametros)->fetchAll(PDO::FETCH_ASSOC);

        $sql_total = "SELECT COUNT( DISTINCT ind.idindicador ) as total
                FROM mod_datosmaestros.nom_indicador ind
                       LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp ON(ind.idindicador = indp.idindicador)
                       LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance indc ON( ind.idindicador = indc.idindicador )
                       WHERE  indp.nivelplanif = 1
                       $addWhere
                       $ADDWHERE  ";
        $result_ = $conn->execute($sql_total, $array_parametros)->fetchAll(PDO::FETCH_ASSOC);

        $data->total = $result_ [0] ['total'];
        return $data;
    }

    public function obtenerIndicadorDadoCodigo($codigo) {
        $query = Doctrine_Query::create();
        $query->from('NomIndicador i')->where('i.codigo = ?', $codigo);
        return $query->fetchOne();
    }

    public function obtenerIndicadorDadoId($id) {
        $query = Doctrine_Query::create();
        $query->from('NomIndicador i')->where('i.idindicador = ?', $id);
        return $query->fetchOne();
    }

    public function actualizarPrecioIndicadoresService($indicadores, $configColumnas = array()) {
        $config = $configColumnas['DatConfiguracionimportar ']->toArray();
        $result = array();
        $encontro = true;
        foreach ($indicadores as $indicador) {
            $obj = self::obtenerIndicadorDadoCodigo($indicador['codigo']);
            if ($obj) {
                $obj->precio = $indicador['precio'];
                $obj->save();
                array_push($result, $indicador[Doctrine::getTable($config['tablatemporal'])->getIdentifier()]);
            } else {
                $encontro = false;
            }
        }
        if (count($result) > 0) {
            DatImportarModel::eliminarDatosTempTable($result, $config['tablatemporal']);
        }
        if (!$encontro) {
            return array('cod' => '78', 'config' => $config);
        } else {
            return array('cod' => '77');
        }
    }

    function devolverIdCB($arraycb, $denominacion) {
        foreach ($arraycb as $cb) {
            if ($cb->denominacion == $denominacion)
                return $cb->idestructura;
        }
    }

    function devolverIdUM($arrayum, $denominacion) {
        foreach ($arrayum as $um) {
            if ($um->nombreum == $denominacion)
                return $um->idunidadmedida;
        }
    }

    function devolverOS($arrayos, $denominacion) {
        foreach ($arrayos as $um) {
            if ($um['denominacion'] == $denominacion)
                return $um['idorganosatisface'];
        }
    }

    function actualizarViaAdquisicion($idindicador, $idvia, $orgarray, $insertar) {
        $query = Doctrine_Query::create();
        $via = $query->from('DatIndicadorviaadquisicion iva')->where('iva.idindicador = ?', $idindicador)->execute();
        $idin = $via[0]->idindicador;
        $idviaold = $via[0]['idviaadquisicion'];
        $query1 = Doctrine_Query::create();
        $viaorgin = $query1->select('iva.idorganosatisface, iva.idviaadquisicion, iva.idindicador')->from(
                        'DatIndicadorviaadquisicionorganosatisface iva'
                )->where('iva.idindicador = ?', $idin)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        foreach ($orgarray as $or) {
            $obj = new DatIndicadorviaadquisicionorganosatisface();
            $obj->idviaadquisicion = $idvia;
            $obj->idindicador = $idindicador;
            $obj->idorganosatisface = $or;
            $obj->save();
        }
        $via[0]->idviaadquisicion = $idvia;
        $via[0]->save();
    }

    function actualizarOS($idvia, $idorgano) {
        $query = Doctrine_Query::create();
        $via = $query->from('DatIndicadorviaadquisicionorganosatisface iva')->where('iva.idindicador = ?', $idindicador)
                ->execute();
        $via->idviaadquisicion = $idvia;
        $via->save();
    }

    public function verificarCB($indreal, $rectora = false) {
        $integrator = ZendExt_IoC::getInstance();
        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $datosentidad = $integrator->metadatos->DameHijosEstructura($identidad);
        if ($rectora) {
            $ids = array();
            array_push($ids, $identidad);
            foreach ($datosentidad as $value) {
                array_push($ids, $value->idestructura);
            }
            $query = Doctrine_Query::create();
            $idcentros = $query
                            ->select('datnom.identidad')
                            ->from('DatEntidaddatosnomenclador datnom')
                            ->innerJoin('datnom.DatIndicadorcentrobalance cenbal')
                            ->innerJoin('cenbal.NomIndicador ind')
                            ->where('ind.idindicador = ?', $indreal->idindicador)
                            ->addWhere('datnom.iddatosnomenclador = 1')
                            ->execute()->toArray();
            foreach ($idcentros as $idcentro) {
                foreach ($ids as $id) {
                    if ($id == $idcentro['identidad']) {
                        return true;
                    }
                }
            }
        } else {
            if (strlen($indreal->codigo) > 5) {
                $ids = array();
                array_push($ids, $identidad);
                foreach ($datosentidad as $value) {
                    array_push($ids, $value->idestructura);
                }
                $query = Doctrine_Query::create();
                $idcentros = $query
                                ->select('datnom.identidad')
                                ->from('DatEntidaddatosnomenclador datnom')
                                ->innerJoin('datnom.DatIndicadorcentrobalance cenbal')
                                ->innerJoin('cenbal.NomIndicador ind')
                                ->where('ind.idindicador = ?', $indreal->idindicador)
                                ->addWhere('datnom.iddatosnomenclador = 1')
                                ->execute()->toArray();
                foreach ($idcentros as $idcentro) {
                    foreach ($ids as $id) {
                        if ($id == $idcentro['identidad']) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    public function verificarPadres($codigo_indicador) {
        if (strlen($codigo_indicador) == 3) {
            return true;
        } else {
            $flag = false;
            $lenghts = array(10, 6, 4);
            $idpadre = null;
            if (strlen($codigo_indicador) > 3) {
                foreach ($lenghts as $l) {
                    if ($flag) {
                        $padre_inmediato = self::obtenerIndicadorDadoCodigo(substr($codigo_indicador, 0, $l));
                        if (empty($padre_inmediato) || !isset($padre_inmediato)) {
                            return array(false, $idpadre);
                        } else {
                            if ($idpadre == null)
                                $idpadre = $padre_inmediato->idindicador;
                        }
                    }
                    if (strlen($codigo_indicador) == $l && $flag == false) {
                        $flag = true;
                    }
                }
            }
        }
        return array(true, $idpadre);
    }

    function verifExistanCB_VA_OS($array_nomcb, $datoscb, $array_nomva, $datosva, $array_nomorgsatisf, $datos_orgsatisf) {
        //Inserciones indirectas: CB, Via adq, Org. Satisface
        $array_relaciones = array();
        //CB
        $centros = split(',', $datoscb);
        $input = 'no';
        $array_cbs_a_add = array();
        $array_va_a_add = array();
        foreach ($centros as $cen) {
            $input = 'existe';
            if ($array_nomcb[strtoupper($cen)] != null) {
                $objDatIndCB = new stdClass();
                $objDatIndCB->identidaddatosnomenclador = $array_nomcb[strtoupper($cen)];
                $objDatIndCB->tipo = "cb";
                $array_relaciones[] = $objDatIndCB;
                $array_cbs_a_add[] = $array_nomcb[strtoupper($cen)];
            } else {
                return array('cb', $array_relaciones, $array_cbs_a_add, array());
            }
        }

        if ($input == 'no') {
            return array('cb', $array_relaciones, $array_cbs_a_add, $array_va_a_add);
        }
        $input = 'no';
        //VA            
        $viasdeaquisicion = split(',', $datosva);
        $orgs = split(',', $datos_orgsatisf);
        unset($datosva);
        $pos = 0;
        foreach ($viasdeaquisicion as $va) {
            if ($array_nomva[$va] != null) {
                $input = 'existe';
                $deno_orgsatisf = $orgs[$pos];
                $array_os = split('/', $deno_orgsatisf);
                $DatIndVA = new stdClass();
                $DatIndVA->idviaadquisicion = $array_nomva[$va];
                $DatIndVA->tipo = 'va';
                $exist_oss = false;

                foreach ($array_os as $organox) {
                    if ($organox != null) {
                        if ($array_nomorgsatisf[$organox] != null) { //sustituir importacion directa por el id o una uri
                            //add OS  
                            $objDatIndVA_OS = new stdClass();
                            $objDatIndVA_OS->idviaadquisicion = $array_nomva[$va];
                            $objDatIndVA_OS->idorganosatisface = $array_nomorgsatisf[$organox];
                            $objDatIndVA_OS->tipo = 'os';
                            $DatIndVA->organos[] = $objDatIndVA_OS;
                            $array_va_a_add[] = $array_nomva[$va];
                        } else {
                            //error no existe un os correspondiente a la va para esa misma posicion en la columna de org. satisf.
                            return array('os', $array_relaciones, $array_cbs_a_add, $array_va_a_add);
                        }
                    } else {
                        //error no existe un os correspondiente a la va para esa misma posicion en la columna de org. satisf.
                        return array('os', $array_relaciones, $array_cbs_a_add, $array_va_a_add);
                    }
                }
                $array_relaciones[] = $DatIndVA;
            } else {
                //error no existe via adq.
                return array('va', $array_relaciones, $array_cbs_a_add, $array_va_a_add);
            }
            $pos++;
        }
        if ($input == 'no') {
            return array('va', $array_relaciones, $array_cbs_a_add, $array_va_a_add);
        }
        return array('ok', $array_relaciones, $array_cbs_a_add, $array_va_a_add);
    }

    function verifExistanVA_OS($array_nomva, $datosva, $array_nomorgsatisf, $datos_orgsatisf, $array_vias_asociadas) {
        //Inserciones indirectas: CB, Via adq, Org. Satisface
        $array_relaciones = array();
        $input = 'no';
        //VA            
        $viasdeaquisicion = split(',', $datosva);
        $orgs = split(',', $datos_orgsatisf);
        unset($datosva);
        $pos = 0;
        foreach ($viasdeaquisicion as $va) {
            $existe_via = '0';
            if ($array_nomva[$va] != null) {
                if ($array_vias_asociadas[$array_nomva[$va]]['existe'] == 'ok') {
                    $existe_via = '1';
                }
                $input = 'existe';
                $deno_orgsatisf = $orgs[$pos];
                $array_os = split('/', $deno_orgsatisf);
                $DatIndVA = new stdClass();
                $DatIndVA->idviaadquisicion = $existe_via . '$' . $array_nomva[$va];
                $DatIndVA->tipo = 'va';
                foreach ($array_os as $organox) {
                    if ($organox != null) {
                        $objDatIndVA_OS = new stdClass();
                        if ($array_nomorgsatisf[$organox] != null) { //sustituir importacion directa por el id o una uri
                            if ($array_vias_asociadas[$array_nomva[$va]][$array_nomorgsatisf[$organox]] == 'ok') {
                                $objDatIndVA_OS->idorganosatisface = '-1';
                            } else {
                                $objDatIndVA_OS->idorganosatisface = $array_nomorgsatisf[$organox];
                            }
                            $objDatIndVA_OS->tipo = 'os';
                            $DatIndVA->organos[] = $objDatIndVA_OS;
                            $objDatIndVA_OS->idviaadquisicion = $array_nomva[$va];
                        } else {
                            //error no existe un os correspondiente a la va para esa misma posicion en la columna de org. satisf.
                            return array('os', $array_relaciones);
                        }
                    } else {
                        //error no existe un os correspondiente a la va para esa misma posicion en la columna de org. satisf.
                        return array('os', $array_relaciones);
                    }
                }
                $array_relaciones[] = $DatIndVA;
            } else {
                //error no existe via adq.
                return array('va', $array_relaciones);
            }
            $pos++;
        }
        if ($input == 'no') {
            return array('va', $array_relaciones);
        }
        return array('ok', $array_relaciones);
    }

    public function actualizarIndicadoresService($indicadores, $configColumnas, $rectora = false, $insertar = false) {
        foreach ($indicadores as $indicador) {
            if (!$insertar) {
                $obj = Doctrine::getTable('NomIndicador')->findByDql('codigo = ?', $indicador['codigo']);
                $insertar = true;
            } else {
                $obj[0] = new NomIndicador();
            }
            if (($obj[0]->idindicador && !$insertar) || ($insertar)) {
                if ($codnivel) {
                    $cb = true;
                    if ($cb) {
                        $orgs = split(',', $indicador['organosatisface']);
                        $orgarray = array();
                        foreach ($orgs as $or) {
                            if (!empty($or)) {
                                $idorgano = self::devolverOS($organos, $or);
                                array_push($orgarray, $idorgano);
                            }
                        }
                        $idnaturaleza = self::devolverIdNaturaleza($naturalezas, $indicador['naturaleza']);
                        $integrator = ZendExt_IoC::getInstance();
                        $aprobado = "0";
                        if ($indicador['idaprobacion'] == 1) {
                            $aprobado = 4;
                        } else {
                            $aprobado = 1;
                        }
                        $obj [0]->idaprobacion = $aprobado;
                        $nivelplanif = "0";
                        if ($indicador['nivel'] == 1) {
                            $nivelplanif = "1";
                        }
                        $obj [0]->nivel = $nivelplanif;
                        $activado = "0";
                        if ($indicador['estado'] == 'Si') {
                            $activado = "1";
                        }
                        $obj [0]->estado = $activado;
                        $obj [0]->precio = $indicador['precio'];
                        $obj [0]->codigo = $indicador['codigo'];
                        $obj [0]->save();
                        $cont++;
                        $centros = split(',', $indicador['centrobalance']);
                        array_push($result, $indicador['idinsindicador']);
                    } else {
                        $encontro = false;
                    }
                } else {
                    $encontro = false;
                }
            } else {
                $encontro = false;
            }
        }
        if ($result[0]->idinsindicador != null) {
            return $cont;
        } else {
            return 0;
        }
    }

    //DAR EL TOTAL PARA EL LISTAR DE ARRIBA DEL GRID, SOLO DA LA CANTIDAD
    public function listarTotal($parametros, $idpadre, $idarbol, $idEstructura) {
        $query = new Doctrine_Query ();
        $devolverPadre = ($idpadre == 0 ? "null as _parent" : "idpadre as _parent");
        foreach ($parametros as $p => $s) {
            if ($s != '') {
                if ($p == 'denominacion') {
                    $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                } else if ($p == 'codigo') {
                    $query->addWhere("n.codigo LIKE '$s%' ");
                } else if ($p == 'numeropieza') {
                    $query->addWhere("n.$p LIKE '%$s%' ");
                } else if ($p == 'identidaddatosnomenclador') {
                    $query->addWhere("r.$p=?", $s);
                } else if ($p == 'nivelsi') {
                    $query->addWhere("n.nivel  = 1 ");
                } else if ($p == 'nivelno') {
                    $query->addWhere("n.nivel  = 0 ");
                } else if ($p == 'idaprobacionsi') {
                    $query->addWhere("n.idaprobacion = 4 OR n.idaprobacion = 3");
                } else if ($p == 'idaprobacionno') {
                    $query->addWhere("n.idaprobacion = 1 ");
                } else if ($p == 'idumedida') {
                    $query->addWhere("n.$p=?", $s);
                } else if ($p == 'estadosi') {
                    $query->addWhere("n.estado  = 1 ");
                } else if ($p == 'estadono') {
                    $query->addWhere("n.estado  = 0 ");
                } else if ($p == 'naturaleza') {
                    $query->addWhere("n.$p=?", $s);
                } else if ($p == 'idpais') {
                    $query->addWhere("n.$p=?", $s);
                } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3') {
                    $query->addWhere(" n.precio " . $s['condicion'] . " ?", $s['precio']);
                } elseif ($p == 'flete_condicion1' || $p == 'flete_condicion2' || $p == 'flete_condicion3') {
                    $query->addWhere(" n.flete " . $s['condicion'] . " ?", $s['flete']);
                } elseif ($p == 'contingencia_condicion1' || $p == 'contingencia_condicion2' || $p == 'contingencia_condicion3'
                ) {
                    $query->addWhere(" n.contingencia " . $s['condicion'] . " ?", $s['contingencia']);
                } else if ($p == 'nivelarbol') {
                    $query->addWhere("n.$p=?", $s);
                } else if ($p == 'uso') {
                    $ejeractual = NomEjercicioplanificacion::listarEjercicioActual();
                    $idejercicio = $ejeractual[0]['idejercicio'];
                    $query_p = Doctrine_Query::create();
                    $query_n = Doctrine_Query::create();
                    $ids_p = $query_p->select('n.idindicador as id')
                            ->from('DatPlanificacion n')
                            ->where('idejercicio=?', array($idejercicio))
                            ->execute();
                    $ids_n = $query_n->select('n.idindicador as id')
                            ->from('DatNorma n')
                            ->execute()
                            ->toArray();
                    $array_p = array();
                    foreach ($ids_p as $id_p) {
                        array_push($array_p, $id_p['id']);
                    }
                    $array_n = array();
                    foreach ($ids_n as $id_n) {
                        array_push($array_n, $id_n['id']);
                    }
                    if ($s == 'true') {
                        $query->addWhere(
                                'n.idindicador IN (' . implode(',', $array_p) . ') OR n.idindicador IN (' . implode(
                                        ',', $array_n
                                ) . ')'
                        );
                    } else if ($s == 'false') {
                        $query->addWhere(
                                'n.idindicador NOT IN (' . implode(',', $array_p) . ') AND n.idindicador NOT IN ('
                                . implode(',', $array_n) . ')'
                        );
                    }
                }
            }
        }
        if ($parametros['nivelarbol'] != null && $parametros['nivelarbol'] != '' && $idpadre == null) {
            $query->addWhere("n.nivel = ?", $parametros['nivelarbol']);
        } elseif ($idpadre) {
            $query->addWhere("n.idpadre = " . $idpadre . " AND n.idpadre <> n.idindicador ");
            if ($idarbol != null)
                $query->addWhere("n.idarbol = " . $idarbol);
        } elseif ($parametros['codigo'] == null && $parametros['denominacion'] == null && $parametros['numeropieza'] == null && $parametros['nivel'] == null && $parametros['nivelarbol'] == null
        ) {
            $query->addWhere("n.idpadre = n.idindicador");
        }
        if ($parametros['codigo'] == null && $parametros['denominacion'] == null && $parametros['numeropieza'] == null && $parametros['nivel'] == null && $parametros['nivelarbol'] == null
        )
            $tiporama = '(( ordender - ordenizq) = 1) as _is_leaf';
        else
            $tiporama = '1 as _is_leaf';
        $total = $query->select("COUNT(n.idindicador)")
                ->from("NomIndicador n")
                ->innerjoin("n.DatIndicadorcentrobalance e")
                ->innerjoin("e.DatEntidaddatosnomenclador r")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $total;
    }

    public function ObtenerTodosIndicadores() {
        $query = new Doctrine_Query ();
        $result = $query->select(
                        "n.idindicador,n.denominacion, n.codigo, n.descripcion, n.idformato, n.estado, n.idaprobacion, n.nivel,n.idcentrobalance,n.idpais, n.precio, n.idumedida, n.numeropieza, n.flete, n.contingencia,n.idnaturaleza as idnaturaleza, dn.iddatosnomenclador"
                )
                ->from("NomIndicador n,n.DatIndicadormaterialdatosnomenclador dn")
                ->offset($start)
                ->limit($limit)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $result;
    }

    public function ObtenerIndicadoresUAM($idpadre, $start, $limit, $parametros) {
        $devolverPadre = ($idpadre == 0 ? "null as _parent" : "idpadre as _parent");
        $query = new Doctrine_Query ();
        $querytotal = new Doctrine_Query ();
        $badera = false;
        foreach ($parametros as $p => $s) {
            if ($s != null) {
                if ($p == 'codigo') {
                    $query->addWhere("n.codigo  LIKE ? ", ("$s%"));
                    $querytotal->addWhere("n.codigo  LIKE ? ", ("$s%"));
                } elseif ($p == 'denominacion') {
                    $query->addWhere("upper(n.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%"));
                    $querytotal->addWhere("upper(n.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%"));
                } elseif ($p == 'idumedida') {
                    if ($s == '-') {
                        $query->addWhere("n.idumedida is null ");
                        $querytotal->addWhere("n.idumedida is null ");
                    } else {
                        $query->addWhere("n.idumedida = ?", $s);
                        $querytotal->addWhere("n.idumedida = ?", $s);
                    }
                } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3') {
                    $query->addWhere("n.precio " . $s['condicion'] . " ? ", $s['precio']);
                    $querytotal->addWhere("n.precio " . $s['condicion'] . " ? ", $s['precio']);
                } elseif ($p == 'nivelarbol') {
                    $bandera = true;
                    if ($idpadre == 0) {
                        $query->addWhere("n.nivelarbol=?", $s);
                        $querytotal->addWhere("n.nivelarbol=?", $s);
                    } elseif ($idpadre) {
                        $devolverPadre = "null as _parent";
                        $codigopadre = NomIndicador::ObtenerCodigoPadre($idpadre)->codigo;
                        $query->addWhere("n.nivelarbol=? AND n.codigo LIKE ?", array($s, "$codigopadre%"));
                        $querytotal->addWhere("n.nivelarbol=? AND n.codigo LIKE ?", array($s, "$codigopadre%"));
                    }
                }
            }
        }
        if ($idpadre && !$bandera) {
            $query->addWhere("n.idpadre = ? AND n.idpadre <> n.idindicador ", $idpadre);
            $querytotal->addWhere("n.idpadre = ? AND n.idpadre <> n.idindicador ", $idpadre);
        } elseif ($idpadre == null && !$bandera) {
            $query->addWhere("n.idpadre = n.idindicador");
            $querytotal->addWhere("n.idpadre = n.idindicador");
        }
        $query->select(
                        "n.idindicador,
                        n.denominacion,
                        n.codigo,
                        n.descripcion,
                        n.estado,
                        np.idaprobacion,
                        n.nivel as nivelarbol,
                        np.precio,
                        n.idumedida,
                        n.idpadre,
                        n.ordender,
                        n.ordenizq,
                        n.numeropieza," . $devolverPadre . ',' . '(( ordender - ordenizq) = 1) as _is_leaf'
                )
                ->from("NomIndicador n")
                ->leftjoin("n.NomIndicadorplanif np")
                ->offset($start)
                ->limit($limit);
        $result['data'] = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        //**************Total************************
        $querytotal->select("COUNT(n.idindicador)")
                ->from("NomIndicador n"); //
        $resultado = $querytotal->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        $result['total'] = $resultado[0]['COUNT'];
        return $result;
    }

    public function ObtenerCodigoPadre($id) {
        $query = Doctrine_Query::create();
        $query->select("i.codigo")
                ->from('NomIndicador i')
                ->where('i.idindicador = ?', $id);
        return $query->execute()->getFirst();
    }

    public function ObtenerTotalIndicadores($idpadre) {
        $query = new Doctrine_Query ();
        $result = $query->select("COUNT(n.idindicador)")
                ->from("NomIndicador n"); //
        if ($idpadre) {
            $query->addWhere("n.idpadre = ? AND n.idpadre <> n.idindicador ", $idpadre);
        } else {
            $query->addWhere("n.idpadre = n.idindicador");
        }
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result[0]['COUNT'];
    }

    public function estaenNorma($idindicador) {
        $query = new Doctrine_Query (); //********AQUI
        $result = $query->from("DatNorma d")
                ->where('d.idindicador=?', $idindicador)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    function verificar($idindicador) {
        //de acuerdo al id del indicador busca el rango donde se encuentran sus hijos
        $ordenderordenizq = NomIndicador:: buscarOrdenIzqDer($idindicador);

        //se obtiene un arreglo con todos los hijos del indicador
        $hijos = NomIndicador::BuscarHijos(
                        $ordenderordenizq[0]['ordenizquierdo'], $ordenderordenizq[0]['ordenderecho']
        );

        if ($hijos) {
            foreach ($hijos as $h) { //se recorre el arreglo recursivamente para eliminar los hijos de los hijos
                if (NomIndicador::verificar($h ['idindicador']))
                    return true;
            }
        }
        //caso base en que el indicador es hoja, es decir no tiene hijos y se elimina
        if (NomIndicador::enUsoysinaprobar($h ['idindicador']))
            return true;
        return false;
    }

    public function Total($idpadre) {
        if ($idpadre) {
            $query = new Doctrine_Query ();
            return $query->from('NomIndicador n')->where('n.idpadre=?', $idpadre)->addWhere(
                            'n.idindicador!=?', $idpadre
                    )->count();
        } else {
            $query = new Doctrine_Query ();
            return $query->from('NomIndicador n')->where('n.idpadre=n.idindicador')->count();
        }
    }

    public function getIndicadorestoplan() {
        $query = new Doctrine_Query ();
        return $query->select('idindicador,codigo,denominacion')->from('NomIndicador n')->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->execute();
    }

    public function cantidad($idpadre) {
        $query = Doctrine_Query::create();
        if ($idpadre)
            $query->addWhere(" idpadre = " . $idpadre . " AND idpadre <> idindicador ");
        else
            $query->addWhere(" idpadre = idindicador ");
        return $query->select('COUNT(idindicador) as total')->from('NomIndicador')->execute()->getFirst()->total;
    }

    //devuelve un arreglo de los indicadores contenidos en el rango entrado por parametros
    public function BuscarHijos($izq, $der, $idarbol) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomIndicador n')
                ->where('n.ordenizq>? AND n.ordender<? AND n.idarbol=?', array($izq, $der, $idarbol)
                )->execute()
                ->toArray();
        return $result;
    }

    public function BuscarHijosId($izq, $der, $idarbol) {
        $query = new Doctrine_Query ();
        $result = $query->select(' n.idindicador')
                ->from('NomIndicador n')
                ->where('n.ordenizq>? AND n.ordender<? AND n.idarbol=?', array($izq, $der, $idarbol))
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function BuscarHijosNoAsociados($izq, $der, $idarbol, $idtipocod) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomIndicador n')
                ->addWhere('n.ordenizq > ? AND n.ordender < ? AND n.idarbol = ?', array($izq, $der, $idarbol))->execute()
                ->toArray();
        return $result;
    }

    public function BuscarHijosAsociados($izq, $der, $idarbol, $idtipocod) {
        $query = new Doctrine_Query ();
        $result = $query->select('n.idindicador, n.codigo, dci.iddatosclasificador, dc.idtipocodificador')
                ->from('NomIndicador n')
                ->leftJoin('n.DatDatosclasificadorindicador dci')
                ->leftJoin("dci.NomDatoscodificador dc")
                ->addWhere(
                        'n.ordenizq > ? AND n.ordender < ? AND n.idarbol = ? AND dc.idtipocodificador = ?', array($izq, $der, $idarbol, $idtipocod)
                )
                ->orderby('n.codigo')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function laSuper($idindicadores, $idaprob, $idejercicio) {
        $query = new NomIndicadorplanif ();
        $query->update("NomIndicadorplanif")
                ->set("idaprobacion", $idaprob)
                ->where("idindicador in (" . $idindicadores . ")")
                ->execute();
        return true;
    }

    public function EliminarIndicador($indiAeliminar, $idejercicio) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('NomIndicador ')
                        ->where('idaprobacion=? ', 1)
                        ->whereIn('idindicador', $indiAeliminar)
                        ->execute();
    }

    public function buscarPadre($izq, $der, $idarbol) {
        $query = new Doctrine_Query ();
        return $query->from('NomIndicador n')->where(
                        'n.ordenizq<? AND n.ordender>? AND n.idarbol=?', array($izq, $der, $idarbol)
                )->execute()->toArray();
    }

    public function borrarNivel($idindicador) {
        $query = Doctrine::getTable('NomIndicadorplanif')->find($idindicador);
        $query->nivelplanif = 0;
        $query->save();
        return true;
    }

    public function enUsoysinaprobar($idindicador) {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanificacion d,NomIndicador n,NomIndicadorplanif np')
                ->where('d.idindicador=? AND np.idaprobacion=?', array($idindicador, 1))
                ->execute();
    }

    public function activar($cadenaIndicadores, $estado, $idejercicio) {
        $query = new Doctrine_Query ();
        $result = $query->update('NomIndicador n')
                ->leftjoin('n.NomIndicadorplanif np')
                ->set('estado', $estado)
                ->where("n.idindicador in (" . $cadenaIndicadores . ")")
                ->addWhere('np.idaprobacion>=? ', array(3))
                ->execute();
        if ($result != 0) {
            return true;
        } else {
            return false;
        }
    }

    public function desactivar($cadenaIndicadores, $estado, $idejercicio) {
        $query = new Doctrine_Query ();
        $result = $query->update('NomIndicador n')
                ->set('estado', $estado)
                ->where("n.idindicador in (" . $cadenaIndicadores . ")")
                ->execute();
        return true;
    }

    public function GetIndicadoresNoEnUso($indicadores, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT i.idindicador, i.ordender, i.ordenizq, i.denominacion, i.idarbol FROM mod_datosmaestros.nom_indicador i LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip
                ON(i.idindicador=ip.dideindicador)
                WHERE i.idindicador IN ($indicadores)
                AND i.idindicador NOT IN (SELECT DISTINCT p.idindicador FROM mod_planificacion.dat_planificacion p WHERE p.idejercicio  = $idejercicio AND p.idindicador IN ($indicadores))
                AND i.idindicador NOT IN (SELECT DISTINCT n.idindicador FROM mod_planificacion.dat_norma n WHERE n.idejercicio  = $idejercicio AND n.idindicador IN ($indicadores))
                AND ip.nivelplanif >=3";

        $idindicadores = $conn->execute($sql)->fetchAll(PDO::FETCH_NAMED);
        return $idindicadores;
    }

    public function GetIndicadoresNoEnUsoEliminar($indicadores, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT i.idindicador, i.ordender, i.ordenizq, i.denominacion, i.idarbol FROM mod_datosmaestros.nom_indicador i WHERE i.idindicador IN ($indicadores)
                AND i.idindicador NOT IN (SELECT DISTINCT p.idindicador FROM mod_planificacion.dat_planificacion p WHERE p.idejercicio  = $idejercicio AND p.idindicador IN ($indicadores))
                AND i.idindicador NOT IN (SELECT DISTINCT n.idindicador FROM mod_planificacion.dat_norma n WHERE n.idejercicio  = $idejercicio AND n.idindicador IN ($indicadores))
                ";
        $idindicadores = $conn->execute($sql)->fetchAll(PDO::FETCH_NAMED);
        return $idindicadores;
    }

    public function ObtenerIdIndicadoresByOrdenes($params) {
        $conn = Doctrine_Manager::connection();
        $primero = true;
        foreach ($params as $id) {
            if ($primero) {
                $sqlWhere = "and (ind.ordenizq >= $id[3] and ind.ordender <= $id[2] and ind.idarbol=$id[1])";
                $primero = false;
            } else {
                $sqlWhere .= " or (ind.ordenizq >= $id[3] and ind.ordender <= $id[2] and ind.idarbol=$id[1])";
            }
        }
        $sql = "select ind.idindicador as idindicador
				from mod_datosmaestros.nom_indicador  ind
				where true				
				$sqlWhere";
        $idindicadores = $conn->execute($sql)->fetchAll(PDO::FETCH_NAMED);
        return $idindicadores;
    }

    public function ObtenerIdIndicadoresByIdHijos($params) {
        $conn = Doctrine_Manager::connection();
        $primero = true;
        foreach ($params as $id) {
            if ($primero) {
                $sqlWhere = "and (ind.ordenizq <= $id[3] and ind.ordender >= $id[2] and ind.idarbol=$id[1])";
                $primero = false;
            } else {
                $sqlWhere .= " or (ind.ordenizq <= $id[3] and ind.ordender >= $id[2] and ind.idarbol=$id[1])";
            }
        }
        $sql = "select ind.idindicador as idindicador
				from mod_datosmaestros.nom_indicador  ind
				where true				
				$sqlWhere";
        $idindicadores = $conn->execute($sql)->fetchAll(PDO::FETCH_NAMED);
        return $idindicadores;
    }

    public function aprobarDesaprobarIndicador($idindicador, $idaprobacion) {
        $hojas = Doctrine::getTable('NomIndicadorplanif')->find($idindicador);
        $hojas->idaprobacion = $idaprobacion;
        $hojas->save();
        return true;
    }

    public function validarCodigo($codigo, $idindicador) {
        $query = new Doctrine_Query ();
        if ($codigo) {
            if ($idindicador) {
                $indicador = Doctrine::getTable('NomIndicador')->find($idindicador);
                if ($codigo != $indicador->codigo)
                    return $query->from('NomIndicador n')->where("n.codigo = ?", $codigo)->execute()->toArray();
                else
                    return array();
            }
            return $query->from('NomIndicador n')->where("n.codigo = ?", $codigo)->execute()->toArray();
        }
        else
            return array();
    }

    /**
     * buscarOrdenIzqDer
     * Devuelve el orden derecho y orden izquierdo de un indicador
     *
     * @author Drisis Silvia Diaz
     * */
    public function buscarOrdenIzqDer($idindicador) {
        $query = new Doctrine_Query ();
        $result = $query->select('n.ordender, n.ordenizq')
                        ->from('NomIndicador n')
                        ->whereIn('n.idindicador', $idindicador)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

//fin de la funciÃ³n buscarOrdenIzqDer

    /**
     * ObtenerFamiliaDescendiente
     * Busca todos los descendientes de un indicador
     *
     * @author Drisis Silvia Diaz
     * */
    public function ObtenerFamiliaDescendiente($idindicador, $ordender, $ordenizq) {
        $query = new Doctrine_Query ();
        $result = $query->select('n.idindicador')
                        ->from('NomIndicador n')
                        ->where('n.ordender <=? AND n.ordenizq >=?', array($ordender, $ordenizq))
                        ->addWhere(
                                'n.idarbol = (SELECT i.idarbol
                                                                FROM NomIndicador i
                                                                WHERE i.idindicador = ?)', $idindicador
                        )
                        ->orderby('n.ordenizq  DESC')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

//fin de la funciÃ³n ObtenerFamiliaDescendiente

    /**
     * ObtenerFamiliaAscendente
     * Busca todos los antecesores de un indicador
     *
     * @author Drisis Silvia Diaz
     * */
    public function ObtenerFamiliaAscendente($idindicador, $ordender, $ordenizq) {
        $query = new Doctrine_Query ();
        $result = $query->select('n.idindicador')
                        ->from('NomIndicador n')
                        ->where('n.ordender >? AND n.ordenizq <?', array($ordender, $ordenizq))
                        ->addWhere(
                                'n.idarbol = (SELECT i.idarbol
                                                                FROM NomIndicador i
                                                                WHERE i.idindicador = ?)', $idindicador
                        )
                        ->orderby('n.ordenizq  DESC')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

//fin de la funciÃ³n ObtenerFamiliaAscendente

    /**
     * Obtener_key
     * MÃ©todo auxiliar que devuelve arreglo unidimensional
     *
     * @author Drisis Silvia Diaz
     * */
    function Obtener_key($array, $key) {
        $return = array();
        foreach ($array as $v) {
            $return [] = $v [$key];
        }
        return $return;
    }

//fin de la funciÃ³n Obtener_key

    /**
     * CargarIndicadoresPlan
     *
     * @author Drisis Silvia Diaz
     * */
    public function CargarIndicadoresPlan($idindicador) {
        $ordenes = NomIndicador::buscarOrdenIzqDer($idindicador);
        $ordender = $ordenes [0] ['ordenderecho'];
        $ordenizq = $ordenes [0] ['ordenizquierdo'];

        $arrFamiliaDesc = NomIndicador::ObtenerFamiliaDescendiente($idindicador, $ordender, $ordenizq);
        $arrFamiliaAsc = NomIndicador::ObtenerFamiliaAscendente($idindicador, $ordender, $ordenizq);

        $arrFamiliaDescL = $arrFamiliaDesc ? NomIndicador::Obtener_key($arrFamiliaDesc, "idindicador") : null;
        $arrFamiliaAscL = $arrFamiliaAsc ? NomIndicador::Obtener_key($arrFamiliaAsc, "idindicador") : null;

        $arrFamilia = array_merge($arrFamiliaDescL, $arrFamiliaAscL);
        $cadenaFamilia = $arrFamilia ? implode(",", $arrFamilia) : 0;


        $query = new Doctrine_Query ();
        $result = $query->select('n.idindicador')->from('NomIndicador n')->where(
                        "n.idindicador not in ($cadenaFamilia)"
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    //fin de la funciÃƒÂ³n CargarIndicadoresPlan


    public function ObtenerIndicador($idindicador) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomIndicador n')->where('n.idindicador= ?', $idindicador)->setHydrationMode(
                        Doctrine::HYDRATE_ARRAY
                )->execute();

        return $result;
    }

    public function BuscarIndicadoryMaterial($idindicador) {
        $query = new Doctrine_Query ();
        $result = $query->from('NomIndicador n')
                ->leftjoin("n.NomIndicadorplanif np")
                ->innerjoin("n.DatIndicadorcentrobalance e")
                ->innerjoin("e.DatEntidaddatosnomenclador r")
                ->where('n.idindicador= ?', $idindicador)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $result;
    }

    public function ObtenerDenominacion($idformato) {
        $query = new Doctrine_Query ();
        $result = $query->select('n.denominacion')->from('NomIndicador n')->where('n.idformato= ?', $idformato)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function chequearCB($idindicador) {
        $query = new Doctrine_Query ();
        $result = $query->select(
                        "n.idindicador,n.denominacion, n.codigo,r.identidad,e.identidaddatosnomenclador, n.estado,np.nivelplanif as nivel,n.idformato, np.precio, n.idumedida, n.numeropieza, n.idnaturaleza as idnaturaleza, dn.iddatosnomenclador"
                )
                ->from("NomIndicador n,n.DatIndicadormaterialdatosnomenclador dn")
                ->innerjoin("n.NomIndicadorplanif np")
                ->innerjoin("n.DatIndicadorcentrobalance e")
                ->innerjoin("e.DatEntidaddatosnomenclador r")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        if (count($result['DatIndicadorcentrobalance']) == 1)
            return true;
        else
            return false;
    }

    //LISTAR LOS INDICADORES QUE SEAN NIVEL DE PLANIFICACION, ESTEN APROBADOS , ETC.
    public function ListarIndNivelPlanif($parametros, $idejercicio, $start, $limit) {

        $query = new Doctrine_Query ();
        if ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != '') {
                    if ($p == 'denominacion') {
                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    } else if ($p == 'codigo') {
                        $query->addWhere("n.codigo LIKE '$s%' ");
                    } else if ($p == 'numeropieza') {
                        $query->addWhere("upper(n.$p) LIKE '%" . strtoupper($s) . "%'");
                    } else if ($p == 'identidaddatosnomenclador') {
                        $query->addWhere("r.$p=?", $s);
                    } else if ($p == 'idumedida') {
                        $query->addWhere("n.$p=?", $s);
                    } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3') {
                        $query->addWhere(" np.precio " . $s['condicion'] . " ?", $s['precio']);
                    }
                }
            }
        }
//PONER LAS ULTIMAS 2 UNIONES COMO INNER, SE PUSIERON COMO LEFT PARA PODER PROBAR EL INSERTAR UN IND AL PLAN (ROBERTO)
        $data = $query->select(
                        "n.idindicador,n.codigo,n.numeropieza,n.denominacion,n.descripcion,n.idumedida,np.precio,np.preciodivisa, n.ordender,n.ordenizq,
                        e.identidaddatosnomenclador,n.estado,np.idaprobacion,np.nivelplanif as nivel,n.idnaturaleza as idnaturaleza,n.idpais,n.nivel as nivelarbol,
                        np.flete,np.contingencia,n.idformato,z.idviaadquisicion,dn.idorganosatisface, r.identidad," . $devolverPadre
                        . ',' . $tiporama
                )
                ->from("NomIndicador n")
                ->leftjoin('n.NomIndicadorplanif np')
                ->innerjoin("n.DatIndicadorcentrobalance e")
                ->innerjoin("e.DatEntidaddatosnomenclador r")
                ->leftjoin("n.DatPlanificacion dplanif")
                ->leftjoin("dplanif.NomEjercicioplanificacion nejerc")
                ->addWhere("n.estado  = 1 ")
                ->addWhere("np.nivelplanif  = 1 ")
                ->addWhere("np.idaprobacion = 4 ")
                ->addWhere("np.precio > 0")
                ->orderby("n.codigo")
                ->offset($start)
                ->limit($limit)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    //MUESTRA EL TOTAL DEL METODO SUPERIOR, SOLO LA CANTIDAD.
    public function listarTotalplanificados($parametros, $idejercicio) {

        $query = new Doctrine_Query ();
        If ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != '') {
                    if ($p == 'denominacion') {
                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    } else if ($p == 'codigo') {
                        $query->addWhere("n.codigo LIKE '$s%' ");
                    } else if ($p == 'numeropieza') {
                        $query->addWhere("n.$p LIKE '%$s%' ");
                    } else if ($p == 'identidaddatosnomenclador') {
                        $query->addWhere("r.$p=?", $s);
                    } else if ($p == 'idumedida') {
                        $query->addWhere("n.$p=?", $s);
                    } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3') {
                        $query->addWhere(" np.precio " . $s['condicion'] . " ?", $s['precio']);
                    }
                }
            }
        }
        $total = $query->select("count(distinct n.idindicador) as total")
                        ->from("NomIndicador n")
                        ->leftjoin('n.NomIndicadorplanif np')
                        ->innerjoin("n.DatIndicadorcentrobalance e")
                        ->innerjoin("e.DatEntidaddatosnomenclador r")
                        ->innerjoin("n.DatPlanificacion dplanif")
                        ->innerjoin("dplanif.NomEjercicioplanificacion nejerc")
                        ->addWhere("n.estado  = 1 ")
                        ->addWhere("np.nivelplanif  = 1 ")
                        ->addWhere("np.idaprobacion = 4 ")
                        ->addWhere("np.precio >0")
                        ->addWhere("nejerc.idejercicio = ?", $idejercicio)
                        ->execute()->getFirst()->total;
        return $total;
    }

    /* exiteIndicadorNorma
     * devuelve true si el indicador esta en al menos una norma, false si no es utilizado en ninguna
     *
     * @author Yasleiny Gutierrez Machado
     */

    public function exiteIndicadorNorma($idindicador) {
        $query = new Doctrine_Query (); //********AQUI

        $arr = $query->select('n.idindicador')
                ->from('DatNorma n')
                ->where('n.idindicador= ?', $idindicador)
                ->execute()
                ->toArray();

        if ($arr[0]['idindicador'] != null)
            return true;
        return false;
    }

    /* esCentroBalance
     * devuelve true si la entidad es centro de balance del indicador
     *
     * @author Yasleiny Gutierrez Machado
     */

    public function esCentroBalance($idindicador, $identidad) {
        $query = new Doctrine_Query ();

        $cb = $query->from('NomIndicador n')
                ->innerjoin("n.DatIndicadorcentrobalance e")
                ->innerjoin("e.DatEntidaddatosnomenclador r")
                ->where('e.idindicador= ?  AND r.identidad=? AND r.iddatosnomenclador=?', array($idindicador, $identidad, 1))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        if ($cb != null)
            return true;
        else
            return false;
    }

    /* entidadEsCB
     * devuelve true si el usuario logueado pertenece a una entidad que es centro de balance
     *
     * @author Yasleiny Gutierrez Machado
     */

    public function EsCB($identidad) {

        $query = new Doctrine_Query();
        $conn = Doctrine_Manager :: connection();
        $query = "SELECT d.iddatosnomenclador
		     FROM mod_planificacion.dat_entidaddatosnomenclador d
			 Where d.identidad= $identidad AND iddatosnomenclador = 1
			 ";
        $res = $conn->execute($query);
        $repeticiones = $res->fetchAll();

        if ($repeticiones[0]['iddatosnomenclador'] == 1) {
            return 'true';
        } else {
            return 'false';
        }
    }

    public function entidadEsCB($identidad) {
        $query = new Doctrine_Query ();

        $ident = $query->select('d.iddatosnomenclador')
                ->from('DatEntidaddatosnomenclador d')
                ->where('d.identidad= ? AND iddatosnomenclador = 1 ', $identidad)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        if ($ident[0]['iddatosnomenclador'] == 1 || $ident[1]['iddatosnomenclador'] == 1)
            return true;
        else
            return false;
    }

    public function entidadEsOD($identidad) {
        $query = new Doctrine_Query ();

        $ident = $query->select('d.iddatosnomenclador')
                ->from('DatEntidaddatosnomenclador d')
                ->where('d.identidad= ? AND iddatosnomenclador = 2 ', $identidad)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        if ($ident[0]['iddatosnomenclador'] == 1 || $ident[1]['iddatosnomenclador'] == 1)
            return true;
        else
            return false;
    }

    /* aprobacionIndicador
     * devuelve el idaprobacion de un indicador
     *
     * @author Yasleiny Gutierrez Machado
     */

    public function aprobacionIndicador($idindicador) {
        $query = new Doctrine_Query ();

        $idaprob = $query->select('np.idaprobacion')
                ->from('NomIndicadorplanif np')
                ->where('np.idindicador= ?', $idindicador)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $idaprob[0]['idaprobacion'];
    }

    public function ListarOrgDemPorCB1() {
        $query = new Doctrine_Query();
        $conn = Doctrine_Manager :: connection();
        $query = "SELECT distinct dpl.identidad, ni.idindicador
		     FROM mod_planificacion.dat_plan dpl
			 INNER JOIN mod_planificacion.dat_modelo dm
			 ON dpl.identidad = dm.identidad
			 INNER JOIN (mod_planificacion.dat_entidadmodelo dem
			 INNER JOIN (mod_planificacion.dat_planificacion dp			 
			 INNER JOIN (mod_datosmaestros.nom_indicador ni
			 INNER JOIN mod_planificacion.dat_entidaddatosnomenclador dedn
			 ON ni.idcentrobalance = dedn.identidaddatosnomenclador)
			 ON dp.idindicador = ni.idindicador)
			 ON dem.identidadmodelo = dp.identidadmodelo)
			 ON dm.identidad = dem.identidad";
        $res = $conn->execute($query);
        $repeticiones = $res->fetchAll();
        return $repeticiones;
    }

    public function IndicadoresPorEntidad($idmodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('ni.idindicador, ni.codigo, ni.denominacion')
                ->from('DatModelo dm, DatEntidadModelo dem, DatPlanificacion dp, NomIndicador ni')
                ->where('ni.idindicador = dp.idindicador')
                ->where('dp.identidadmodelo = dem.identidadmodelo')
                ->where('dem.identidad = dm.identidad AND dm.idmodelo= ?', $idmodelo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function ListarIndicadores() {
        $query = new Doctrine_Query();
        $result = $query->select('ni.idindicador, ni.codigo, ni.denominacion')
                ->from('DatModelo dm, DatEntidadModelo dem, DatPlanificacion dp, NomIndicador ni')
                ->where('ni.idindicador = dp.idindicador')
                ->where('dp.identidadmodelo = dem.identidadmodelo')
                ->where('dem.identidad = dm.identidad AND dm.idmodelo= ?', $idmodelo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function ListarIndPorCB($identdatnom) {
        $query = new Doctrine_Query();
        $indicent = $query->select(
                        'd.idindicador, d.codigo, d.numeropieza, d.denominacion, d.idumedida, np.precio, dicb.identidaddatosnomenclador, np.nivelplanif as nivel, d.estado, np.flete, np.contingencia, d.idnaturaleza, d.idpais'
                )
                ->from('DatIndicadorcentrobalance dicb, dicb.NomIndicador d')
                ->leftjoin('d.NomIndicadorplanif np')
                ->where('dicb.identidaddatosnomenclador =?', $identdatnom)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $indicent;
    }

    public function cambiarNivel($idindicador) {
        $obj = Doctrine::getTable('NomIndicadorplanif')->find($idindicador);
        $obj->nivelplanif = 1;
        $obj->save();

        return true;
    }

    public function obtenerIndCTEyOtros($idindicador) {
        $query = new Doctrine_Query();
        $result = $query->select(
                        'in.idindicador, in.denominacion, in.codigo,in.numeropieza,dae.idajusteentidad,
                                               dae.cantidadeninventario as inventario,dae.mercanciaentransito as pendarribo,
                                               dae.cantidadcontratado as contratados,dae.necesidadannoactual as necesidad,
                                               dae.coberturatotalestimada as CTE,daecb.cantidadreservaministro as RM,daecb.cantidadeconomia as economia'
                )
                ->from('DatAjusteentidad dae,dae.NomIndicador in,dae.DatAjusteentidadcentrobalance daecb')
                ->where('in.idindicador=? AND dae.idindicador= ?', array($idindicador, $idindicador))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getCbIndicador($idindicador) {
        $query = new Doctrine_Query();
        $result = $query->select('ind.idindicador,cb.identidaddatosnomenclador')
                ->from('NomIndicador ind,ind.DatIndicadorcentrobalance cb')
                ->where('ind.idindicador=? ', $idindicador)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result[0]['DatIndicadorcentrobalance'];
    }

    public function listarnombresViaadquisicion() {
        $query = new Doctrine_Query();
        $result->data = $query->from('NomViaadquisicion')
                        ->execute()->toArray();
        return $result;
    }

    public function listarnombresorganoSatisface() {
        $query = new Doctrine_Query();
        $result->data = $query->from('NomOrganosatisface')
                        ->execute()->toArray();
        return $result;
    }

    public function listarInd($params) {
        $query = new Doctrine_Query();
        $query_total = new Doctrine_Query();
        $devolverPadre = (!$params['idpadre']) ? "null as _parent" : $params['idpadre'] . " as _parent";
        if ($params['identidad']) {
            $query->addWhere('r.identidad = ?', $params['identidad']);
            $query_total->addWhere('r.identidad = ?', $params['identidad']);
        }
        if ($params['nivelarbol'] && $params['idpadre'] == null) {
            $query->addWhere('n.nivel = ?', $params['nivelarbol']);
            $query_total->addWhere('n.nivel = ?', $params['nivelarbol']);
        } else if ($params['idpadre']) {
            $query->addWhere("n.idpadre = " . $params['idpadre'] . " AND n.idpadre <> n.idindicador");
            $query_total->addWhere("n.idpadre = " . $params['idpadre'] . " AND n.idpadre <> n.idindicador");
        } else {
            $query->addWhere("n.idpadre = n.idindicador");
            $query_total->addWhere("n.idpadre = n.idindicador");
        }
        if ($params['codigo']) {
            $query->addWhere('n.codigo LIKE ?', $params['codigo'] . "%");
            $query_total->addWhere('n.codigo LIKE ?', $params['codigo']);
        }
        if ($params['numeropieza']) {
            $query->addWhere("upper(n.numeropieza) LIKE '%" . strtoupper($params['numeropieza']) . "%'");
            $query_total->addWhere("upper(n.numeropieza) LIKE '%" . strtoupper($params['numeropieza']) . "%'");
        }
        if ($params['denominacion']) {
            $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($params['denominacion']) . "%'");
            $query_total->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($params['denominacion']) . "%'");
        }
        if ($params['identidaddatosnomenclador']) {
            $query->addWhere("r.identidaddatosnomenclador = ?", $params['identidaddatosnomenclador']);
            $query_total->addWhere("r.identidaddatosnomenclador = ?", $params['identidaddatosnomenclador']);
        }
        if ($params['denodatoscodif']) {
            $query->addWhere("upper(dc.denominacion) LIKE '%" . strtoupper($params['denodatoscodif']) . "%'");
            $query_total->addWhere("upper(dc.denominacion) LIKE '%" . strtoupper($params['denodatoscodif']) . "%'");
        }
        if ($params['idtipocodificador']) {
            if ($params['idtipocodificador'] == 'true') {
                $query->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
                $query_total->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
            } else {
                $query->addWhere("tc.idtipocodificador is null");
                $query_total->addWhere("tc.idtipocodificador is null");
            }
        }
        if ($params['asociado'] == 1) {
            $query->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
            $query_total->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
        } else if ($params['asociado'] == 2) {
            $query->addWhere("tc.idtipocodificador <> ? OR tc.idtipocodificador is null", $params['idtipocodif']);
            $query_total->addWhere(
                    "tc.idtipocodificador <> ? OR tc.idtipocodificador is null", $params['idtipocodif'], null
            );
        }
        $data->data = $query->select(
                        "n.idindicador, n.codigo, n.numeropieza, n.denominacion, n.ordender,n.ordenizq, n.idpadre, n.idarbol, n.nivel as nivelarbol , dd.iddatosclasificador, dd.idindicador,
                e.idindicadorcentrobalance, r.identidaddatosnomenclador, r.identidad, dc.denominacion, tc.denominacion, tc.idtipocodificador, $devolverPadre, (( ordender - ordenizq) = 1) as _is_leaf, dc.codigo as codigocodificador, dc.denominacion as denomcodificador"
                )
                ->from('NomIndicador n')
                ->innerjoin("n.DatIndicadorcentrobalance e")
                ->innerjoin("e.DatEntidaddatosnomenclador r")
                ->leftJoin("n.DatDatosclasificadorindicador dd")
                ->leftJoin("dd.NomDatoscodificador dc")
                ->leftJoin("dc.NomTipocodificador tc")
                ->orderby("n.codigo")
                ->offset($params['start'])
                ->limit($params['limit'])
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        if ($params['asociado'] == 0) {
            $data->total = $query_total->select("COUNT(DISTINCT n.idindicador) as total")
                            ->from('NomIndicador n')
                            ->innerjoin("n.DatIndicadorcentrobalance e")
                            ->innerjoin("e.DatEntidaddatosnomenclador r")
                            ->leftJoin("n.DatDatosclasificadorindicador dd")
                            ->leftJoin("dd.NomDatoscodificador dc")
                            ->leftJoin("dc.NomTipocodificador tc")
                            ->execute()->getFirst()->total;
        }

        return $data;
    }

    public function listarIndE($params) {
        $query = new Doctrine_Query();
        $query_total = new Doctrine_Query();
        $devolverPadre = (!$params['idpadre']) ? "null as _parent" : $params['idpadre'] . " as _parent";
        if ($params['identidad']) {
            $query->addWhere('r.identidad = ?', $params['identidad']);
            $query_total->addWhere('r.identidad = ?', $params['identidad']);
        }
        if ($params['nivelarbol'] && $params['idpadre'] == null) {
            $query->addWhere('n.nivel = ?', $params['nivelarbol']);
            $query_total->addWhere('n.nivel = ?', $params['nivelarbol']);
        } else if ($params['idpadre']) {
            $query->addWhere("n.idpadre = " . $params['idpadre'] . " AND n.idpadre <> n.idindicador");
            $query_total->addWhere("n.idpadre = " . $params['idpadre'] . " AND n.idpadre <> n.idindicador");
        } else {
            $query->addWhere("n.idpadre = n.idindicador");
            $query_total->addWhere("n.idpadre = n.idindicador");
        }
        if ($params['codigo']) {
            $query->addWhere('n.codigo LIKE ?', $params['codigo'] . "%");
            $query_total->addWhere('n.codigo LIKE ?', $params['codigo']);
        }
        if ($params['numeropieza']) {
            $query->addWhere("upper(n.numeropieza) LIKE '%" . strtoupper($params['numeropieza']) . "%'");
            $query_total->addWhere("upper(n.numeropieza) LIKE '%" . strtoupper($params['numeropieza']) . "%'");
        }
        if ($params['denominacion']) {
            $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($params['denominacion']) . "%'");
            $query_total->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($params['denominacion']) . "%'");
        }
        if ($params['identidaddatosnomenclador']) {
            $query->addWhere("r.identidaddatosnomenclador = ?", $params['identidaddatosnomenclador']);
            $query_total->addWhere("r.identidaddatosnomenclador = ?", $params['identidaddatosnomenclador']);
        }
        if ($params['denodatoscodif']) {
            $query->addWhere("upper(dc.denominacion) LIKE '%" . strtoupper($params['denodatoscodif']) . "%'");
            $query_total->addWhere("upper(dc.denominacion) LIKE '%" . strtoupper($params['denodatoscodif']) . "%'");
        }
        if ($params['idtipocodificador']) {
            if ($params['idtipocodificador'] == 'true') {
                $query->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
                $query_total->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
            } else {
                $query->addWhere("tc.idtipocodificador is null");
                $query_total->addWhere("tc.idtipocodificador is null");
            }
        }
        if ($params['asociado'] == 1) {
            $query->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
            $query_total->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
        } else if ($params['asociado'] == 2) {
            $query->addWhere("tc.idtipocodificador <> ? OR tc.idtipocodificador is null", $params['idtipocodif']);
            $query_total->addWhere(
                    "tc.idtipocodificador <> ? OR tc.idtipocodificador is null", $params['idtipocodif'], null
            );
        }
        if ($params['asociado'] == 1) {
            $data->data = $query->select(
                            "n.idindicador, n.codigo, n.numeropieza, n.denominacion, n.ordender,n.ordenizq, n.idpadre, n.idarbol, n.nivel as nivelarbol, dd.iddatosclasificador, dd.idindicador,
                pla.idindicador, e.idindicadorcentrobalance, r.identidaddatosnomenclador, r.identidad, dc.denominacion, tc.denominacion, tc.idtipocodificador, $devolverPadre, (( ordender - ordenizq) = 1) as _is_leaf, dc.codigo as codigocodificador, dc.denominacion as denomcodificador"
                    )
                    ->from('NomIndicador n')
                    ->innerjoin("n.DatIndicadorcentrobalance e")
                    ->innerjoin("e.DatEntidaddatosnomenclador r")
                    ->leftJoin("n.DatDatosclasificadorindicador dd")
                    ->leftJoin("dd.NomDatoscodificador dc")
                    ->leftJoin("dc.NomTipocodificador tc")
                    ->where('n.nivel = ? and tc.idtipocodificador = ?', array($params['nivelarbol'], $params['idtipocodif']))
                    ->orderby("n.codigo")
                    ->offset($params['start'])
                    ->limit($params['limit'])
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
        } else if ($params['asociado'] == 2) {
            $data->data = $query->select(
                            "n.idindicador, n.codigo, n.numeropieza, n.denominacion, n.ordender,n.ordenizq, n.idpadre, n.idarbol, n.nivel, dd.iddatosclasificador, dd.idindicador,
                pla.idindicador, e.idindicadorcentrobalance, r.identidaddatosnomenclador, r.identidad, dc.denominacion, tc.denominacion, tc.idtipocodificador, $devolverPadre, (( ordender - ordenizq) = 1) as _is_leaf, dc.codigo as codigocodificador, dc.denominacion as denomcodificador"
                    )
                    ->from('NomIndicador n')
                    ->innerjoin("n.DatIndicadorcentrobalance e")
                    ->innerjoin("e.DatEntidaddatosnomenclador r")
                    ->leftJoin("n.DatDatosclasificadorindicador dd")
                    ->leftJoin("dd.NomDatoscodificador dc")
                    ->leftJoin("dc.NomTipocodificador tc")
                    ->where('n.nivel = ? and tc.idtipocodificador is null', array($params['nivelarbol']))
                    ->orderby("n.codigo")
                    ->offset($params['start'])
                    ->limit($params['limit'])
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
        } else if ($params['asociado'] == 3) {
            $data->data = $query->select(
                            "n.idindicador, n.codigo, n.numeropieza, n.denominacion, n.ordender,n.ordenizq, n.idpadre, n.idarbol, n.nivel, dd.iddatosclasificador, dd.idindicador,
                pla.idindicador, e.idindicadorcentrobalance, r.identidaddatosnomenclador, r.identidad, dc.denominacion, tc.denominacion, tc.idtipocodificador, $devolverPadre, (( ordender - ordenizq) = 1) as _is_leaf, dc.codigo as codigocodificador, dc.denominacion as denomcodificador"
                    )
                    ->from('NomIndicador n')
                    ->innerjoin("n.DatIndicadorcentrobalance e")
                    ->innerjoin("e.DatEntidaddatosnomenclador r")
                    ->leftJoin("n.DatDatosclasificadorindicador dd")
                    ->leftJoin("dd.NomDatoscodificador dc")
                    ->leftJoin("dc.NomTipocodificador tc")
                    ->where('n.nivel = ? ', array($params['nivelarbol']))
                    ->orderby("n.codigo")
                    ->offset($params['start'])
                    ->limit($params['limit'])
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
        }

        if ($params['asociado'] == 0) {
            $data->total = $query_total->select("COUNT(DISTINCT n.idindicador) as total")
                            ->from('NomIndicador n')
                            ->innerjoin("n.DatIndicadorcentrobalance e")
                            ->innerjoin("e.DatEntidaddatosnomenclador r")
                            ->leftJoin("n.DatDatosclasificadorindicador dd")
                            ->leftJoin("dd.NomDatoscodificador dc")
                            ->leftJoin("dc.NomTipocodificador tc")
                            ->execute()->getFirst()->total;
        }

        return $data;
    }

    public function totalindicadoresE($params) {
        $query_total = new Doctrine_Query();

        if ($params['identidad'])
            $query_total->addWhere('r.identidad = ?', $params['identidad']);
        if ($params['asociado'] == 1)
            $query_total->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
        else if ($params['asociado'] == 2)
            $query_total->addWhere(
                    "tc.idtipocodificador <> ? OR tc.idtipocodificador is null", $params['idtipocodif'], null
            );
        if ($params['asociado'] == 1) {
            $data->total = $query_total->select("COUNT(DISTINCT n.idindicador) as total")
                            ->from('NomIndicador n')
                            ->innerjoin("n.DatIndicadorcentrobalance e")
                            ->innerjoin("e.DatEntidaddatosnomenclador r")
                            ->leftJoin("n.DatDatosclasificadorindicador dd")
                            ->leftJoin("dd.NomDatoscodificador dc")
                            ->leftJoin("dc.NomTipocodificador tc")
                            ->where('n.nivel = ? and tc.idtipocodificador = ?', array($params['nivelarbol'], $params['idtipocodif']))
                            ->execute()
                            ->getFirst()->total;
        } else if ($params['asociado'] == 2) {
            $data->total = $query_total->select("COUNT(DISTINCT n.idindicador) as total")
                            ->from('NomIndicador n')
                            ->innerjoin("n.DatIndicadorcentrobalance e")
                            ->innerjoin("e.DatEntidaddatosnomenclador r")
                            ->leftJoin("n.DatDatosclasificadorindicador dd")
                            ->leftJoin("dd.NomDatoscodificador dc")
                            ->leftJoin("dc.NomTipocodificador tc")
                            ->where('n.nivel = ? and tc.idtipocodificador is null', array($params['nivelarbol']))
                            ->execute()
                            ->getFirst()->total;
        } else if ($params['asociado'] == 3) {
            $data->total = $query_total->select("COUNT(DISTINCT n.idindicador) as total")
                            ->from('NomIndicador n')
                            ->innerjoin("n.DatIndicadorcentrobalance e")
                            ->innerjoin("e.DatEntidaddatosnomenclador r")
                            ->leftJoin("n.DatDatosclasificadorindicador dd")
                            ->leftJoin("dd.NomDatoscodificador dc")
                            ->leftJoin("dc.NomTipocodificador tc")
                            ->where('n.nivel = ? ', array($params['nivelarbol']))
                            ->execute()
                            ->getFirst()->total;
        }
        return $data;
    }

    public function totalindicadores($params) {
        $query_total = new Doctrine_Query();

        if ($params['identidad'])
            $query_total->addWhere('r.identidad = ?', $params['identidad']);
        if ($params['asociado'] == 1)
            $query_total->addWhere("tc.idtipocodificador = ?", $params['idtipocodif']);
        else if ($params['asociado'] == 2)
            $query_total->addWhere(
                    "tc.idtipocodificador <> ? OR tc.idtipocodificador is null", $params['idtipocodif'], null
            );

        $data->total = $query_total->select("COUNT(DISTINCT n.idindicador) as total")
                        ->from('NomIndicador n')
                        ->innerjoin("n.DatIndicadorcentrobalance e")
                        ->innerjoin("e.DatEntidaddatosnomenclador r")
                        ->leftJoin("n.DatDatosclasificadorindicador dd")
                        ->leftJoin("dd.NomDatoscodificador dc")
                        ->leftJoin("dc.NomTipocodificador tc")
                        ->addWhere('n.nivel = ?', $params['nivelarbol'])
                        ->execute()
                        ->getFirst()->total;
        return $data;
    }

    public function obternerFormato() {
        $formato = ZendExt_IoC::getInstance()->datosmaestros->listarFormatos();

        foreach ($formato as $k => $valor) {
            if ($valor->nombre == 'Indicadores') {
                return $valor->idformato;
            }
        }
    }

    public function getCodPadre($codindhijo) {
        $len = strlen($codindhijo);
        if ($len == 3)
            return array(null, 1); //codigopadre,nivel
        elseif ($len == 4)
            return array(substr($codindhijo, 0, 3), 2);
        elseif ($len == 6)
            return array(substr($codindhijo, 0, 4), 3);
        elseif ($len == 10)
            return array(substr($codindhijo, 0, 6), 4);
        return 'errorformato';
    }

    public function buscarIndicadorVaYOs($idarbol, $ipadre, $izq, $der, $indindicador, $array_cbs, $array_viasaq) {
        //Uso en el importar indicador
        //Buscar indicador con su Centro balance, Via adquisicion y Organo Satisface
        $query = new Doctrine_Query ();
        $cond_cb = " idindicador = ind.idindicador  ";
        $str_cbs = implode(",", $array_cbs);
        if ($array_cbs[0] != null) {
            $cond_cb .= " AND identidaddatosnomenclador in($str_cbs)";
        }
        $cond_va = "iva.idindicador = ind.idindicador";
        $str_va = implode(",", $array_viasaq);
        if ($array_viasaq[0] != null) {
            $cond_va .= " AND idviaadquisicion IN($str_va)";
        }
        $query->from('NomIndicador ind')
                ->leftJoin("n.NomIndicadorplanif np")
                ->leftJoin('ind.DatIndicadorcentrobalance icb WITH ' . $cond_cb)
                ->leftJoin('ind.DatIndicadorviaadquisicion iva WITH ' . $cond_va)
                ->leftJoin(
                        'iva.DatIndicadorviaadquisicionorganosatisface ios WITH ind.idindicador = ios.idindicador AND ios.idviaadquisicion = iva.idviaadquisicion '
                )
                ->addwhere(
                        'ind.ordenizq = ? AND ind.ordender = ? AND ind.idarbol = ? AND ind.idpadre = ? AND ind.idindicador = ?', array($izq, $der, $idarbol, $ipadre, $indindicador)
        );
        return $query->execute();
    }

    public function listar_Control_Divisa(
    $parametros, $idpadre, $idarbol, $start, $limit, $idEstructura, $listarplanificados, $idejercicio
    ) {
        $arrayvia[] = "importacion directa";
        $arrayvia[] = "sustitucionimportaciones";
        $arrayDer = NomIndicador::getOrdenerbyId($arrayvia);
        $arrayIzq = NomIndicador::getOrdenizqbyId();
        $cadenaWHERE = " ";
        $query = new Doctrine_Query ();
        $query2 = new Doctrine_Query ();
        $query3 = new Doctrine_Query ();
        $devolverPadre = ($idpadre == 0) ? "null as _parent" : "idpadre as _parent";
        foreach ($parametros as $p => $s) {
            if ($s != '') {
                if ($p == 'denominacion') {
                    $query->addWhere("upper(n.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%"));
                } else if ($p == 'codigo') {
                    $query->addWhere("n.codigo LIKE ? ", ("$s%"));
                } else if ($p == 'identidaddatosnomenclador') {
                    if ($s != 'rector') {
                        $con = $s['identidaddatosnomenclador'];
                        $query->addWhere("cb.identidaddatosnomenclador = {$con}");
                    }
                } else if ($p == 'idplanificado') {
                    if ($s == 1) {

                        $query->addWhere("dp.idplanificacion is not null");
                    } else if ($s == 2) {
                        $query->addWhere("dp.idplanificacion is null");
                    }
                } else if ($p == 'aprobadoasociacion') {
                    $query->addWhere("cdi.idaprobacion = ?", ($s));
                } else if ($p == 'codigocd') {
                    if ($s == 1) {
                        $query->addWhere("cdi.idcontroldivisaindicadormodelo is not null");
                    }
                    if ($s == 2) {
                        $query->addWhere("cdi.idcontroldivisaindicadormodelo is null");
                    }
                }


                if ($p == 'numeropieza') {
                    $query->addWhere("upper(n.numeropieza) LIKE '%" . strtoupper($s) . "%'");
                } else if ($p == 'nivelsi') {
                    $query->addWhere("nip.nivelplanif  = 1 ");
                } else if ($p == 'nivelno') {
                    $query->addWhere("nip.nivelplanif  = 0 ");
                } else if ($p == 'idaprobacionsi') {
                    $query->addWhere("nip.idaprobacion = 4 OR nip.idaprobacion = 3");
                } else if ($p == 'idaprobacionno') {
                    $query->addWhere("nip.idaprobacion = 1 ");
                } else if ($p == 'asociadosi') {
                    $query->addWhere("cdi.idcontroldivisaindicadormodelo  is not null ");
                } else if ($p == 'centrobalance') {
                    $query->addWhere("e.identidad= ?", $s);
                } else if ($p == 'asociadono') {
                    $query->addWhere("cdi.idcontroldivisaindicadormodelo  is null ");
                } elseif ($p == 'flete_condicion1' || $p == 'flete_condicion2' || $p == 'flete_condicion3') {
                    $query->addWhere(" nip.flete " . $s['condicion'] . " ?", $s['flete']);
                } elseif ($p == 'contingencia_condicion1' || $p == 'contingencia_condicion2' || $p == 'contingencia_condicion3'
                ) {
                    $query->addWhere(" nip.contingencia " . $s['condicion'] . " ?", $s['contingencia']);
                }
            }
        }

        if ($parametros['nivel'] != null && $parametros['nivel'] != '' && $idpadre == null) {
            $query->addWhere("n.nivel = ?", $parametros['nivel']);
            $cadenaWHERE = " i.nivel=" . ($parametros['nivel']) . " ";
        } elseif ($idpadre) {
            $query->addWhere("n.idpadre = " . $idpadre . " AND n.idpadre <> n.idindicador ");
            $cadenaWHERE = " i.idpadre=" . $idpadre . " AND i.idpadre <> i.idindicador ";
            if ($idarbol != null) {
                $query->addWhere("n.idarbol = " . $idarbol);
                $cadenaWHERE.=" AND i.idarbol=" . ($idarbol) . " ";
            }
        } else {
            $query->addWhere("n.idpadre = n.idindicador");
            $cadenaWHERE = " i.idpadre= i.idindicador ";
        }


        $data->data = $query->select(
                        "n.idindicador,n.idarbol,n.codigo ,( case when cdi.idcontroldivisaindicadormodelo is not null then cdi.idcontroldivisaindicadormodelo end ) as idcontroldi ,
                                                n.numeropieza, ( case when cdi.idcontroldivisaindicadormodelo is not null then 'Si' else 'No' end ) as asociado , n.idumedida, n.denominacion, n.descripcion,
                                                n.idumedida, ROUND(nip.precio, 2) AS precio, ROUND(nip.precioventa, 2) AS preciodivisa, n.ordender, n.ordenizq,
                                                n.estado, nip.idaprobacion, nip.nivelplanif,z.idviaadquisicion,dp.idplanificacion ,( case when dp.idplanificacion is not null then 1 else 0 end ) as idplanificado ,
                                                n.idnaturaleza as idnaturaleza, n.idpais, n.nivel,cdi.idcontroldivisa,
                                                nip.flete, nip.contingencia,  n.idformato, n.idpadre,e.identidad as identidad,
                                                " . $devolverPadre . ",(( ordender - ordenizq) = 1) as _is_leaf,cb.idindicadorcentrobalance,
                                    cdi.idcontroldivisaindicadormodelo as idcontroldivisaindicador,cdi.identidadmodelo,cdi.idaprobacion as aprobadoasociacion,
                                    cd.codigo as codigocd,cd.denominacion as denominacioncd,cdi.idejercicio as idejercicio 
                                    "
                )
                ->from("NomIndicador n")
                ->leftjoin(' n.NomIndicadorplanif nip ')
                ->leftjoin('n.DatIndicadorviaadquisicion z')
                ->leftjoin('n.DatPlanificacion dp')
                ->leftjoin('n.DatIndicadorcentrobalance cb')
                ->leftjoin('cb.DatEntidaddatosnomenclador e')
                ->leftjoin('z.NomViaadquisicion nvia')
                ->leftjoin("n.DatControldivisaindicadormodelo cdi")
                ->leftjoin("cdi.NomControldivisa cd")
                ->addWhere('cdi.idejercicio =? OR cdi.idejercicio is null', $idejercicio)
                ->orWhere(
                        "n.idindicador IN 
                ( SELECT i.idindicador FROM NomIndicador i INNER JOIN i.DatIndicadorviaadquisicion iv 
                INNER JOIN iv.NomViaadquisicion nomv WHERE " . $cadenaWHERE . " AND nomv.uriviaadquisicion NOT IN ( 'sustitucionimportaciones','importacion directa' ) 
                AND ( SELECT COUNT(ind.idindicador) FROM NomIndicador ind INNER JOIN ind.DatIndicadorviaadquisicion iv1 
                INNER JOIN iv1.NomViaadquisicion nomv1 WHERE ind.ordenizq > i.ordenizq AND ind.ordender < i.ordender AND 
                ind.nivel = 4 AND nomv1.uriviaadquisicion IN ( 'sustitucionimportaciones','importacion directa' )) > 0 )"
                )
                ->orderby("n.codigo")
                ->offset($start)
                ->limit($limit)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        $data->total = $query->count();
        return $data;
    }

    //solo para sust de importa por que las dos V/A se demoran mucho(Prueba).
    public function getOrdenerbyId($arrayvia) {
        $conn = Doctrine_Manager::connection();
        $consult = ' SELECT n.ordender  FROM mod_datosmaestros.nom_indicador n LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion d 
 ON n.idindicador = d.idindicador LEFT JOIN mod_datosmaestros.nom_viaadquisicion n2 ON d.idviaadquisicion = n2.idviaadquisicion
  WHERE (n2.idviaadquisicion=1) ';
        $res = $conn->execute($consult);
        $arrayindicadores = $res->fetchAll();
        foreach ($arrayindicadores as $p => $s) {
            $array[] = $s[$p];
        }
        return $array;
    }

    public function getOrdenizqbyId() {
        $conn = Doctrine_Manager::connection();
        $consult = ' SELECT n.ordenizq  FROM mod_datosmaestros.nom_indicador n LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion d 
 ON n.idindicador = d.idindicador LEFT JOIN mod_datosmaestros.nom_viaadquisicion n2 ON d.idviaadquisicion = n2.idviaadquisicion
  WHERE (n2.idviaadquisicion=1) ';
        $res = $conn->execute($consult);
        $arrayindicadores = $res->fetchAll();
        foreach ($arrayindicadores as $p => $s) {
            $array[] = $s[$p];
        }
        return $array;
    }

    public function getIndporOrden($ordender, $ordenizq) {
        $query = new Doctrine_Query ();
        $query->select('ind.idindicador')
                ->from('NomIndicador ind')
                ->where('ind.ordender <= ? AND ind.ordenizq >= ?', array($ordender, $ordenizq))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $query->execute();
    }

    public function listarActividadesConIndicador($params) {
        $addWhere = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $key => $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere.="AND upper(n2.codigo) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                }
                if ($datos['field'] == 'denominacion') {

                    $addWhere.="AND upper(n2.denominacion) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                }

                if ($datos ['field'] == 'base') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere.="AND d.cantbase >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere.="AND d.cantbase <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere.="AND d.cantbase =" . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'norma') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere.="AND d.cantplanif >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere.="AND d.cantplanif <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere.="AND d.cantplanif =" . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'necesidad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere.="AND d.cantplanif/d.cantbase > " . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere.="AND d.cantplanif/d.cantbase < " . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere.="AND d.cantplanif/d.cantbase = " . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT n.idindicador, 
d.idnorma,
d.idejercicio,
n2.idactividad, 
d.cantbase as base,
d.cantplanif as norma, 
n2.codigo as codigo, 
n2.denominacion as denominacion,
round((d.cantplanif/d.cantbase),3) as necesidad
FROM mod_datosmaestros.nom_indicador n 
LEFT JOIN mod_planificacion.dat_norma d 
ON n.idindicador = d.idindicador AND (n.idindicador = d.idindicador) 
LEFT JOIN mod_planificacion.nom_actividad n2
ON d.idactividad = n2.idactividad AND (d.idactividad = n2.idactividad)
WHERE n.idindicador = {$params['idindicador']} AND d.idejercicio = {$params['idejercicio']} 
$addWhere
OFFSET ?
LIMIT ? 
";
        if ($params['start'])
            $array_parametros [] = $params['start'];
        else {
            $array_parametros [] = null;
        }
        if ($params['limit'])
            $array_parametros [] = $params['limit'];
        else {
            $array_parametros [] = null;
        }
        $res = $conn->execute($query, $array_parametros);
        $data->data = $res->fetchAll();
        $querytotal = "SELECT COUNT(n.idindicador)
FROM mod_datosmaestros.nom_indicador n 
LEFT JOIN mod_planificacion.dat_norma d 
ON n.idindicador = d.idindicador AND (n.idindicador = d.idindicador) 
LEFT JOIN mod_planificacion.nom_actividad n2
ON d.idactividad = n2.idactividad AND (d.idactividad = n2.idactividad)
WHERE n.idindicador = {$params['idindicador']} AND d.idejercicio = {$params['idejercicio']} 
$addWhere
";
        $res = $conn->execute($querytotal);
        $varaux = $res->fetchAll();
        $data->total = $varaux[0]['count'];
        return $data;
    }

    public function GetEnUsoIndicador($indicador, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT i.idindicador, i.ordender, i.ordenizq, i.denominacion, i.idarbol FROM mod_datosmaestros.nom_indicador i WHERE i.idindicador = $indicador
                AND i.idindicador NOT IN (SELECT DISTINCT p.idindicador FROM mod_planificacion.dat_planificacion p WHERE p.idejercicio  = $idejercicio AND p.idindicador = $indicador)
                AND i.idindicador NOT IN (SELECT DISTINCT n.idindicador FROM mod_planificacion.dat_norma n WHERE n.idejercicio  = $idejercicio AND n.idindicador = $indicador)
                ";
        $idindicadores = $conn->execute($sql)->fetchAll(PDO::FETCH_NAMED);
        return $idindicadores;
    }

    public function listarIndicadoresAddDoc($parametros, $idejercicio, $iddocumento, $start, $limit) {

        $query = new Doctrine_Query ();
        if ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != '') {
                    if ($p == 'denominacion') {
                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    } else if ($p == 'codigo') {
                        $query->addWhere("n.codigo LIKE '$s%' ");
                    } else if ($p == 'numeropieza') {
                        $query->addWhere("upper(n.$p) LIKE '%" . strtoupper($s) . "%'");
                    } else if ($p == 'identidaddatosnomenclador') {
                        $query->addWhere("r.$p=?", $s);
                    } else if ($p == 'idumedida') {
                        $query->addWhere("n.$p=?", $s);
                    } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3') {
                        $query->addWhere(" np.precio " . $s['condicion'] . " ?", $s['precio']);
                    } elseif ($p == 'preciomlc_condicion1' || $p == 'preciomlc_condicion2' || $p == 'preciomlc_condicion3') {
                        $query->addWhere(" np.preciodivisa " . $s['condicion'] . " ?", $s['preciomlc']);
                    }
                }
            }
        }

        $data = $query->select(
                        "n.idindicador,n.codigo,n.numeropieza,n.denominacion,n.descripcion,n.idumedida,np.precio,np.preciodivisa, n.ordender,n.ordenizq,
                       n.estado,np.idaprobacion,np.nivelplanif as nivel,n.idnaturaleza as idnaturaleza,n.idpais,n.nivel as nivelarbol,
                        np.flete,np.contingencia,n.idformato"
                )
                ->from("NomIndicador n")
                ->leftJoin("n.NomIndicadorplanif np")
                ->addWhere("n.idejercicio = ?", $idejercicio)
                ->where('np.nivelplanif', 1)
                ->where('np.idaprobacion = 4')
                ->addWhere("n.idindicador NOT IN (SELECT en.idindicador FROM Datentregaextraplanindicador en INNER JOIN en.DatEntregaextraplan daent WHERE en.iddocumento ={$iddocumento})")
                ->orderby("n.codigo")
                ->offset($start)
                ->limit($limit)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $data;
    }

    public function listarTotalIndicadoresAddDoc($parametros, $iddocumento, $idejercicio, $iddocumento) {

        $query = new Doctrine_Query ();
        If ($parametros) {
            foreach ($parametros as $p => $s) {
                if ($s != '') {
                    if ($p == 'denominacion') {
                        $query->addWhere("upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'");
                    } else if ($p == 'codigo') {
                        $query->addWhere("n.codigo LIKE '$s%' ");
                    } else if ($p == 'numeropieza') {
                        $query->addWhere("n.$p LIKE '%$s%' ");
                    } else if ($p == 'identidaddatosnomenclador') {
                        $query->addWhere("r.$p=?", $s);
                    } else if ($p == 'idumedida') {
                        $query->addWhere("n.$p=?", $s);
                    } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3') {
                        $query->addWhere(" np.precio " . $s['condicion'] . " ?", $s['precio']);
                    }
                }
            }
        }
        $total = $query->select("count(distinct n.idindicador) as total")
                        ->from("NomIndicador n")
                        ->leftJoin("n.NomIndicadorplanif np")
                        ->addWhere("n.idejercicio = ?", $idejercicio)
                        ->where('n.nivel', 1)
                        ->where('np.idaprobacion = 4')
                        ->addWhere("n.idindicador NOT IN (SELECT en.idindicador FROM Datentregaextraplanindicador en INNER JOIN en.DatEntregaextraplan daent WHERE en.iddocumento ={$iddocumento})")
                        ->execute()->getFirst()->total;
        return $total;
    }

    public function ObtenerIndicadorporCod($codigo) {
        $query = new Doctrine_Query ();
        $result = $query->select("n.*,e.*,np.*")
                        ->from('NomIndicador n')
                        ->innerJoin("n.NomIndicadorplanif np")
                        ->innerJoin("n.DatIndicadorcentrobalance e")
                        ->where('n.codigo= ?', $codigo)
                        ->setHydrationMode(
                                Doctrine::HYDRATE_ARRAY
                        )->execute();

        return $result;
    }

}
