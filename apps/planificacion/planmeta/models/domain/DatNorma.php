<?php

class DatNorma extends BaseDatNorma {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomActividad', array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasOne(
                'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
                'DatRegla', array('local' => 'idnorma', 'foreign' => 'idnorma')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

    public function obtenerIdentificador() {
        $query = Doctrine_Query::create();
        $query->select('n.idindicador as id')->from('DatNorma n');
        $result = $query->execute()->toArray();
        return $result;
    }

    public function listarNormasPorActividad(Array $params) {
        $sqlWhere = "";
        $sqlWhereImportes = "";

        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $sqlWhere .= "AND i.codigo  LIKE '{$datos ['data'] ['value']}%'";
                    $sqlWhereImportes .= "AND i.codigo  LIKE '{$datos ['data'] ['value']}%'";
                } elseif ($datos ['field'] == 'numeropieza') {
                    $temp = mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8');
                    $sqlWhere .= "AND upper(i.numeropieza)  LIKE '%" . $temp . "%'";
                    $sqlWhereImportes .= "AND upper(i.numeropieza)  LIKE '%" . $temp . "%'";
                } elseif ($datos ['field'] == 'idnaturaleza') {
                    $temp = mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8');
                    $sqlWhere .= "AND (i.idnaturaleza)  = '" . $temp . "'";
                    $sqlWhereImportes .= "AND (i.idnaturaleza)  = '" . $temp . "'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $temp = mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8');
                    $sqlWhere .= "AND upper(i.denominacion)  LIKE '%" . $temp . "%' ";
                    $sqlWhereImportes .= "AND upper(i.denominacion) LIKE '%" . $temp . "%' ";
                } elseif ($datos ['field'] == 'idumedida') {
                    $sqlWhere .= 'AND i.idumedida  = ' . $datos ['data'] ['value'];
                    $sqlWhereImportes .= 'AND i.idumedida  = ' . $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'cantplanif') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= "AND n.cantplanif >" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND n.cantplanif >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= "AND n.cantplanif <" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND n.cantplanif <" . $datos ['data'] ['value'];
                    } else {
                        $sqlWhere .= "AND n.cantplanif =" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND n.cantplanif =" . $datos ['data'] ['value'];
                    }
                } elseif ($datos ['field'] == 'cantbase') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= "AND n.cantbase >" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND n.cantbase >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= "AND n.cantbase <" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND n.cantbase <" . $datos ['data'] ['value'];
                    } else {
                        $sqlWhere .= "AND n.cantbase =" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND n.cantbase =" . $datos ['data'] ['value'];
                    }
                } elseif ($datos ['field'] == 'necesidad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= "AND round( ( n.necesidad ) ,6 ) >" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad ) ,6 ) >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= "AND round( ( n.necesidad ) ,6 ) <" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad ) ,6 ) <" . $datos ['data'] ['value'];
                    } else {
                        $sqlWhere .= "AND round( ( n.necesidad ) ,6 ) =" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad ) ,6 ) =" . $datos ['data'] ['value'];
                    }
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= "AND ip.precio >" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND ip.precio >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= "AND ip.precio <" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND ip.precio <" . $datos ['data'] ['value'];
                    } else {
                        $sqlWhere .= "AND ip.precio =" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND ip.precio =" . $datos ['data'] ['value'];
                    }
                } elseif ($datos ['field'] == 'preciodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= "AND ip.preciodivisa >" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND ip.preciodivisa >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= "AND ip.preciodivisa <" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND ip.preciodivisa <" . $datos ['data'] ['value'];
                    } else {
                        $sqlWhere .= "AND ip.preciodivisa =" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND ip.preciodivisa =" . $datos ['data'] ['value'];
                    }
                } elseif ($datos ['field'] == 'idcentrobalance') {
                    $sqlWhere .= 'AND icb.identidaddatosnomenclador = ' . $datos ['data'] ['value'];
                    $sqlWhereImportes .= 'AND icb.identidaddatosnomenclador = ' . $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'importe') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= "AND round( ( n.necesidad * ip.precio ) ,6 ) >" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad * ip.precio ) ,6 ) >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= "AND round( ( n.necesidad * ip.precio ) ,6 ) <" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad * ip.precio ) ,6 ) <" . $datos ['data'] ['value'];
                    } else {
                        $sqlWhere .= "AND round( ( n.necesidad * ip.precio ) ,6 ) =" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad * ip.precio ) ,6 ) =" . $datos ['data'] ['value'];
                    }
                } elseif ($datos ['field'] == 'importedivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= "AND round( ( n.necesidad * ip.preciodivisa ) ,6 ) >" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad * ip.preciodivisa ) ,6 ) >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= "AND round( ( n.necesidad * ip.preciodivisa ) ,6 ) <" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad * ip.preciodivisa ) ,6 ) <" . $datos ['data'] ['value'];
                    } else {
                        $sqlWhere .= "AND round( ( n.necesidad * ip.preciodivisa ) ,6 ) =" . $datos ['data'] ['value'];
                        $sqlWhereImportes .= "AND round( ( n.necesidad * ip.preciodivisa ) ,6 ) =" . $datos ['data'] ['value'];
                    }
                } elseif ($datos ['field'] == 'estado') {
                    if ($datos ['data'] ['value'] == 'No') {
                        $sqlWhere .= "AND i.estado = 0";
                        $sqlWhereImportes .= "AND i.estado = 0";
                    } else {
                        $sqlWhere .= "AND i.estado = 1";
                        $sqlWhereImportes .= "AND i.estado = 1";
                    }
                }  elseif ($datos ['field'] == 'nivelplanif') {
                    if ($datos ['data'] ['value'] == 'No') {
                        $sqlWhere .= "AND ip.nivelplanif = 0";
                        $sqlWhereImportes .= "AND ip.nivelplanif = 0";
                    } else {
                        $sqlWhere .= "AND ip.nivelplanif = 1";
                        $sqlWhereImportes .= "AND ip.nivelplanif = 1";
                    }
                } elseif ($datos ['field'] == 'idaprobacion') {
                    if ($datos ['data'] ['value'] == 'Si' || $datos ['data'] ['value'] == 'Sí') {
                        $sqlWhere .= "AND ip.idaprobacion >= 3";
                        $sqlWhereImportes .= "AND ip.idaprobacion >= 3";
                    } else {
                        if ($datos ['data'] ['value'] == 'Rector') {
                            $sqlWhere .= "AND ip.idaprobacion = 4";
                            $sqlWhereImportes .= "AND ip.idaprobacion = 4";
                        } else {
                            $sqlWhere .= "AND ip.idaprobacion = 1";
                            $sqlWhereImportes .= "AND ip.idaprobacion = 1";
                        }
                    }
                } elseif ($datos ['field'] == 'idusuario') {
                    $sqlWhere .= "AND n.idusuario = " . $datos ['data'] ['value'];
                    $sqlWhereImportes .= "AND n.idusuario = " . $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'fecha') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlWhere .= "AND n.fecha::date<'{$fechafin}'";
                        $sqlWhereImportes .= "AND n.fecha::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $sqlWhere .= "AND n.fecha::date>'{$fechafin}'";
                        $sqlWhereImportes .= "AND n.fecha::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $sqlWhere .= "AND n.fecha::date='{$fechafin}'";
                        $sqlWhereImportes .= "AND n.fecha::date='{$fechafin}'";
                    }
                }
            }
        }

        $delimitando = "";
        if ($params['start'] != null && $params['limit']) {
            $delimitando = " LIMIT {$params['limit']} OFFSET {$params['start']} ";
        }

        $con = Doctrine_Manager::connection();
        $query = "SELECT n.idnorma,
                            n.idactividad,
                            n.cantplanif,
                            n.cantbase,
                            i.idindicador,
                            i.codigo,
                            n.idusuario,
                            i.denominacion,
                            i.numeropieza,
                            i.idumedida,
                            i.estado,
                            ip.idindicador,
                            ip.idaprobacion,
                            i.idnaturaleza,
                            ip.nivelplanif,
                            icb.identidaddatosnomenclador as idcentrobalance,
                            ROUND((n.necesidad), 6) AS necesidad,
                            ROUND((n.necesidad * ip.precio), 6) AS importe,
                            ROUND((n.necesidad * ip.preciodivisa), 6) AS importedivisa,
                            ROUND(ip.precio, 6) AS precio,
                            n.fecha,
                            ROUND(ip.preciodivisa, 6) AS preciodivisa,
                            COUNT(*) OVER() as total
                            FROM mod_planificacion.dat_norma n
        INNER JOIN mod_datosmaestros.nom_indicador i ON n.idindicador = i.idindicador AND (n.idactividad = " . $params['idactividad'] . ")
        INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON i.idindicador = ip.idindicador
        LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance icb ON i.idindicador = icb.idindicador
        WHERE n.idejercicio = " . $params ['idejercicio'] . " AND icb.identidaddatosnomenclador is not null $sqlWhere
        ORDER BY i.codigo $delimitando";
        $data->data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];

        $conn = Doctrine_Manager::connection();
        $querytotal = "SELECT round( SUM( ( n.necesidad ) * ip.precio ),3 ) as importetotal
        FROM mod_planificacion.dat_norma n
        INNER JOIN mod_datosmaestros.nom_indicador i ON n.idindicador = i.idindicador AND (n.idactividad = " . $params['idactividad'] . ")
        INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON i.idindicador = ip.idindicador
        LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance icb ON i.idindicador = icb.idindicador
        INNER JOIN mod_seguridad.seg_usuario u ON(u.idusuario = n.idusuario)
        WHERE n.idejercicio = " . $params ['idejercicio'] . " AND icb.identidaddatosnomenclador is not null $sqlWhereImportes";
        $calculoImporteTotal = $conn->execute($querytotal)->fetchAll(PDO::FETCH_ASSOC);
        if ($calculoImporteTotal[0]['importetotal'] > 0) {
            $data->importetotal = number_format($calculoImporteTotal[0]['importetotal'], '3', '.', ',');
        } else {
            $data->importetotal = number_format('0', '3', '.', ',');
        }
        return $data;
    }

    public function listarNormasDeActividad(Array $params) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT    i.codigo,
            i.numeropieza,
            i.denominacion,
            i.idumedida,
            ROUND(ip.precio, 6) AS precio,
            ROUND(ip.preciodivisa, 6) AS preciodivisa,
            i.estado,
            ip.idaprobacion,
            ip.nivelplanif,
            n.cantplanif,
            n.cantbase,
            ROUND((n.necesidad), 6) AS necesidad,
            icb.identidaddatosnomenclador as idcentrobalance,
            ROUND((n.necesidad * ip.precio), 6) AS importe,
            ROUND((n.necesidad * ip.preciodivisa), 6) AS importedivisa,
            sum(ROUND((n.necesidad * ip.precio), 6)) OVER() as importetotal,
            sum(ROUND((n.necesidad * ip.preciodivisa), 6)) OVER() as importedivisatotal
        FROM mod_planificacion.dat_norma n
        INNER JOIN mod_datosmaestros.nom_indicador i ON n.idindicador = i.idindicador AND (n.idactividad = " . $params['idactividad'] . ")
        INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON i.idindicador = ip.idindicador
        LEFT JOIN mod_datosmaestros.dat_indicadorcentrobalance icb ON i.idindicador = icb.idindicador
        WHERE n.idejercicio = " . $params ['idejercicio'] . " AND icb.identidaddatosnomenclador is not null 
        ORDER BY i.codigo ";        
        $data->data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function buscarNormas($idactividad, $formatoredultadocomoarray = true
    ) {
        $query = Doctrine_Query::create();
        if ($formatoredultadocomoarray) {
            return $query->from('DatNorma n')
                            ->where('n.idactividad = ?', $idactividad)->execute()->toArray(true);
        } else {
            return $query->from('DatNorma n')
                            ->where('n.idactividad = ?', $idactividad)->execute();
        }
    }

    public function buscarNormasPorEjercicio($idactividad, $idejercicio, $formatoredultadocomoarray = true
    ) {
        $query = Doctrine_Query::create();
        if ($formatoredultadocomoarray) {
            return $query->from('DatNorma n')
                            ->where(
                                    'n.idactividad = ? and n.idejercicio = ?', array($idactividad, $idejercicio)
                            )->execute()->toArray(true);
        } else {
            return $query->from('DatNorma n')
                            ->where(
                                    'n.idactividad = ? and n.idejercicio = ?', array($idactividad, $idejercicio)
                            )->execute();
        }
    }
        public function buscarNormasEjercicioAprobacion($idactividad, $idejercicio) {
        $query = Doctrine_Query::create();
            return $query->from('DatNorma n')
                    ->innerJoin('n.NomIndicador i')
                    ->innerJoin('i.NomIndicadorplanif ip')
                            ->where(
                                    'n.idactividad = ? and n.idejercicio = ? and ip.nivelplanif=? and ip.idaprobacion=?', array($idactividad, $idejercicio, 1, 4)
                            )->execute()->toArray(true);
        
    }

    public function buscarIndicadoresInvolucradosEnActividad($idactividad, $todos = true
    ) {
        $query = Doctrine_Query::create();
        $parcial = $query
                ->select('DISTINCT idindicador,in.*')->from('DatNorma n')
                ->innerJoin('n.NomIndicador in')->where('n.idactividad = ?', $idactividad)
                ->execute();
        $indicadores = array();

        if ($todos == true) {
            foreach ($parcial as $norma) {
                $indicadores[] = array($norma->idindicador);
            }
        } else {
            /* Precio mayor que cero */
            foreach ($parcial as $norma) {
                if ($norma->NomIndicador->NomIndicadormaterial->precio > 0) {
                    $indicadores[] = array($norma->idindicador);
                }
            }
        }
        return $indicadores;
    }

    public function calcularImporte($idactividad) {
        $result = Doctrine_Query::create()
                        ->select(
                                'n.idnorma, round( SUM( n.cantplanif/n.cantbase * in.precio ), 8) as importe'
                        )->from('DatNorma n')->innerJoin('n.NomIndicador in')
                        ->where("n.idactividad = $idactividad")->groupby("n.idnorma")->execute();
        $importeTotal = 0;
        foreach ($result as $valor) {
            $importeTotal += $valor->importe;
        }

        return $importeTotal;
    }

    public function buscar($idnorna) {
        return Doctrine::getTable('DatNorma')->find($idnorna);
    }

    public function tieneNormas($idactividad) {
        $objnorma = Doctrine_Query::create()
                        ->from('DatNorma n')->where('n.idactividad = ?', $idactividad)
                        ->offset(0)->limit(1)->execute()->getFirst();
        return $objnorma->idnorma;
    }

    /* Metodos de clase */

    public function calcularNecesidad() {
        return ($this->cantplanif / $this->cantbase);
    }

    public function exiteIndicadorEnNorma($idindicador) {
        $query = new Doctrine_Query();
        $arr = $query->select('n.idindicador')
                        ->from('DatNorma n')->where('n.idindicador= ?', $idindicador)
                        ->execute()->toArray();

        if ($arr[0]['idindicador'] != null) {
            return true;
        }
        return false;
    }

    public function selectUno() {
        $consulta = "n.idnorma,n.idactividad,n.idindicador,in.idumedida,n.cantplanif,
                     n.cantbase,n.version,round( ( n.cantplanif/n.cantbase ) ,6 ) as necesidad,
                     round( ( n.cantplanif/n.cantbase * indplanif.precio ) ,6 ) as importe,
                     in.idindicador,in.codigo,in.denominacion,'-' as idcentrobalance,
                     in.idindicador,in.numeropieza,in.idumedida,
                     round( indplanif.precio ,8 ) as precio,0 as depreciacion,e.*,induam.*";
        return $consulta;
    }

    public function listarNormasPorActividadUAM($start, $limit, $idactividad, array $params
    ) {
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();
        foreach ($params as $p => $s) {
            if ($s != null) {
                if ($p == 'codigo') {
                    $query->addWhere("in.codigo  LIKE '%$s%' ");
                    $querytotal->addWhere("in.codigo  LIKE '%$s%' ");
                } elseif ($p == 'numeropieza') {
                    $query->addWhere(
                            "upper(in.numeropieza)  LIKE '%" . strtoupper($s) . "%'"
                    );
                    $querytotal->addWhere(
                            "upper(in.numeropieza)  LIKE '%" . strtoupper($s) . "%'"
                    );
                } elseif ($p == 'denominacion') {
                    $query->addWhere(
                            " upper(in.denominacion) LIKE '%" . strtoupper($s)
                            . "%' "
                    );
                    $querytotal->addWhere(
                            "upper(in.denominacion)  LIKE '%" . strtoupper($s)
                            . "%' "
                    );
                } elseif ($p == 'idumedida') {
                    $query->addWhere("n.idumedida  = ? ", $s);
                    $querytotal->addWhere("n.idumedida  = ? ", $s);
                } elseif ($p == 'idcentrobalance') {
                    $query->addWhere("e.identidaddatosnomenclador = $s ");
                    $querytotal->addWhere("e.identidaddatosnomenclador = $s");
                } elseif ($p == 'cantplanif_condicion1' || $p == 'cantplanif_condicion2' || $p == 'cantplanif_condicion3'
                ) {
                    $query->addWhere(
                            "n.cantplanif " . $s['condicion'] . " ? ", $s['cantplanif']
                    );
                    $querytotal->addWhere(
                            "n.cantplanif " . $s['condicion'] . " ? ", $s['cantplanif']
                    );
                } elseif ($p == 'cantbase_condicion1' || $p == 'cantbase_condicion2' || $p == 'cantbase_condicion3'
                ) {
                    $query->addWhere(
                            "n.cantbase " . $s['condicion'] . " ? ", $s['cantbase']
                    );
                    $querytotal->addWhere(
                            "n.cantbase " . $s['condicion'] . " ? ", $s['cantbase']
                    );
                } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3'
                ) {
                    $query->addWhere(
                            "in.precio " . $s['condicion'] . " ? ", $s['precio']
                    );
                    $querytotal->addWhere(
                            "in.precio " . $s['condicion'] . " ? ", $s['precio']
                    );
                } elseif ($p == 'necesidad_condicion1' || $p == 'necesidad_condicion2' || $p == 'necesidad_condicion3'
                ) {
                    $query->addWhere(
                            "round( ( n.cantplanif/n.cantbase ) ,8 ) "
                            . $s['condicion'] . " ? ", $s['necesidad']
                    );
                    $querytotal->addWhere(
                            "round( ( n.cantplanif/n.cantbase ) ,8 ) "
                            . $s['condicion'] . " ? ", $s['necesidad']
                    );
                } elseif ($p == 'importe_condicion1' || $p == 'importe_condicion2' || $p == 'importe_condicion3'
                ) {
                    $query->addWhere(
                            "round( ( n.cantplanif/n.cantbase * indplanif.precio ) ,8 ) "
                            . $s['condicion'] . " ? ", $s['importe']
                    );
                    $querytotal->addWhere(
                            "round( ( n.cantplanif/n.cantbase * indplanif.precio ) ,8 ) "
                            . $s['condicion'] . " ? ", $s['importe']
                    );
                }
            }
        }
        $select = self::selectUno();

        $data->data = $query
                        ->select($select)
                        ->from("DatNorma n")
                        ->innerJoin("n.NomIndicador in WITH n.idactividad = ?", $idactividad)
                        ->innerJoin("in.NomIndicadorplanif indplanif")
                        ->innerJoin("in.DatIndicadorcentrobalance e")
                        ->innerJoin("in.NomIndicadoruam induam")->offset($start)
                        ->limit($limit)->orderby("in.denominacion")->execute()->toArray(true);

        $calculoImporteTotal = $querytotal
                        ->select(
                                " round( SUM( ( n.cantplanif / n.cantbase ) * indplanif.precio ),3 ) as importetotal, COUNT(idnorma) as total"
                        )->from("DatNorma n")
                        ->innerJoin("n.NomIndicador in WITH n.idactividad = ?", $idactividad)
                        ->innerJoin("in.NomIndicadorplanif indplanif")
                        ->innerJoin("in.DatIndicadorcentrobalance e")
                        ->innerJoin("in.NomIndicadoruam induam")->execute()->toArray(true);

        $data->total = $calculoImporteTotal[0]['total'];

        foreach ($data->data as $indice => $valor) {
            $data->data[$indice]['precio'] = number_format(
                    $valor['NomIndicador']['precio'], '3', '.', ','
            );
            $data->data[$indice]['codigo'] = $valor['NomIndicador'] ['codigo'];
            $data->data[$indice]['denominacion'] = $valor['NomIndicador'] ['denominacion'];
            $data->data[$indice]['numeropieza'] = $valor['NomIndicador']['numeropieza'];
            $data->data[$indice]['idumedida'] = $valor['NomIndicador']['idumedida'];
            $data->data[$indice]['importetotalactividad'] = $data->importetotal;
            $data->data[$indice]['importe'] = $data->data[$indice]['importe'];
            if ($data->data[$indice]['NomIndicador']['NomIndicadoruam']['idnaturalezauam'] == 2 || $data->data[$indice]['NomIndicador']['NomIndicadoruam']['idnaturalezauam'] == 6
            ) {
                $data->data[$indice]['depreciacion'] = number_format(
                        $data->data[$indice]['NomIndicador']['NomIndicadoruam']['capacidad'] * $data->data[$indice]['NomIndicador']['precio'] * $data->data[$indice]['NomIndicador']['NomIndicadoruam']['depreciacion'] / 365 / 24, '4', '.', ','
                );
                $data->data[$indice]['importe'] = number_format(
                        $data->data[$indice]['NomIndicador']['NomIndicadoruam']['capacidad'] * $data->data[$indice]['NomIndicador']['precio'] * $data->data[$indice]['NomIndicador']['NomIndicadoruam']['depreciacion'] / 365 / 24 * ($data->data[$indice]['cantplanif'] / $data->data[$indice]['cantbase']), '6', '.', ','
                );
            }
            $data->data[$indice]['centrobalance'] = $valor['NomIndicador']['DatIndicadorcentrobalance'][0]['identidaddatosnomenclador'];
        }
        return $data;
    }

    function damePlazoNormaUAM($idactividad) {
        /* $query = new Doctrine_Query();
          return $query->select(" round( ( n.cantplanif/n.cantbase ) ,6 ) as plazo")
          ->from("DatNorma n")
          ->innerJoin("n.NomIndicador ind")
          ->innerJoin("ind.NomIndicadoruam inuam")
          ->innerJoin("inuam.NomNaturalezauam natuam")
          ->addWhere("natuam.idnaturalezauam = 12")
          ->addWhere("n.idactividad=?", $idactividad)
          ->execute()->toArray(true); */
        $conn = Doctrine_Manager::connection();
        $query = "SELECT  ROUND(SUM(d.cantplanif / d.cantbase), 6) AS plazo
                  FROM mod_planificacion.dat_norma d
                  INNER JOIN mod_datosmaestros.nom_indicador m ON d.idindicador = m.idindicador
                  INNER JOIN mod_spouam.nom_indicadoruam m2 ON m.idindicador = m2.idindicador
                  INNER JOIN mod_spouam.nom_naturalezauam m3 ON m2.idnaturalezauam = m3.idnaturalezauam
                  WHERE (m3.idnaturalezauam = 12 AND d.idactividad = $idactividad)";
        $res = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    /* public function obtenerNormasArrayActividades($arrayIdactividades) {
      $arrayNormas = array();
      if ($arrayIdactividades[0] != null) {
      $conn = Doctrine_Manager::connection();
      $sql = 'SET  search_path TO mod_planificacion;
      SELECT * FROM dat_norma nor
      INNER JOIN nom_indicador ind ON ( ind.idindicador = nor. idindicador )
      INNER JOIN dat_indicadorcentrobalance indc ON( ind.idindicador = indc.idindicador )
      WHERE nor.idactividad IN( ' . (implode(
      ",", $arrayIdactividades
      )) . ' ) ORDER BY nor.idactividad ';
      $arrayNormas = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
      }
      return $arrayNormas;
      }
     */

    public static function validarExistenciaDatos($idejercicio) {
        //Devolviendo la cantidad.
        return Doctrine_Query::create()->select('COUNT(idnorma) AS cantidad')
                        ->from('DatNorma')->where('idejercicio=?', $idejercicio)->fetchOne()
                ->cantidad;
    }

    public function cargarUsuarios() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT (u.idusuario),u.nombreusuario
                 FROM mod_seguridad.seg_usuario u WHERE u.activo = TRUE
                 ORDER BY u.nombreusuario;";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function eliminarNorma($idnormas) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE 
                    FROM mod_planificacion.dat_norma
                  WHERE 
                    idnorma IN($idnormas) ;";
        $conn->execute($query);
        return true;
    }

}
