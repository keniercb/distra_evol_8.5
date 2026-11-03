<?php

class DatInversion extends BaseDatInversion {

    public function setUp() {
        parent:: setUp();
    }

    private function addWhereClistarCapExplotaciononParams(&$Where, &$params_query, $colum_cond, $param
    ) {
        $Where .= " AND " . $colum_cond . $param;
    }

    private function addWhereConParams(&$Where, &$params_query, $colum_cond, $param
    ) {
        $Where .= " AND " . $colum_cond . $param;
    }

    public function getByid($idinversion) {
        return Doctrine::getTable('DatInversion')->find($idinversion)->toArray(
        );
    }

    public static function cambiarInversion($param) {
        $query = new Doctrine_Query ();
        $cumplida = "Cumplida";
        $result = $query->update('NomCumplimientoinversion n')
                ->set('n.denominacion', $cumplida)
                ->where(
                        ' n.idcumplimientoinversion ', array($param['idcumplimientoinversion'])
                )
                ->execute();
        return true;
    }

    public function IdconsprovDadoConst($prov) {
        $conn = Doctrine_Manager::connection();
        $sql = "select eiv.idetapinverconsprov
                FROM mod_planifinversiones.dat_etapinverconsprov eiv
                WHERE  eiv.idconstructor = " . $prov;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function GetDocumentosFactibilidadByInversion($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "select ie.*
                FROM mod_planifinversiones.dat_inversionestfact ie where ie.idinversion = {$param['idinversion']} ";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function buscarEspacioFactibilidadByTipoInv($idtipoinversion = null) {
        $conn = Doctrine_Manager::connection();
        $sql = "select ti.*
                FROM mod_planifinversiones.nom_tipoinversion ti ";

        if ($idtipoinversion != null) {
            $sql .= " where ti.idtipoinversion = $idtipoinversion";
        }

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        //print_r();die;
        return $datos;
    }

    public function devolCodigoR($id) {
        $conn = Doctrine_Manager::connection();
        $sql = "select dat.codigo
                FROM mod_estructuracomp.dat_estructura dat
                WHERE  dat.idestructura in (" . $id . ")";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function updatevalor($tabla, $valor, $id, $valorid, $idejer) {
        $conn = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones." . $tabla .
                " SET  valor = " . $valor . "
            WHERE   mod_planifinversiones." . $tabla . "." . $id . " = "
                . $valorid . "and mod_planifinversiones." . $tabla . ".idejercicio = " . $idejer;

        $res1 = $conn->execute($sql);
        return $res1;
    }

    public function getValue($tabla, $id, $valorid, $idejer) {
        $conn = Doctrine_Manager::connection();
        $sql = "select * from mod_planifinversiones.{$tabla}
            WHERE   mod_planifinversiones." . $tabla . "." . $id . " = "
                . $valorid . "and mod_planifinversiones." . $tabla . ".idejercicio = " . $idejer;
//print_r($sql);die;
        $res1 = $conn->execute($sql);
        return $res1->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminarDesgloseEquipo($tabla, $idtext, $id) {
        if ($id != '') {
            $query = new Doctrine_Query();
            $sql_query = "DELETE FROM mod_planifinversiones." . $tabla . " 
                            WHERE (" . $idtext . " = " . $id . ")";
            $conn = Doctrine_Manager::connection();
            $conn->execute($sql_query);
        }
    }

    public function getValor($tabla, $valor, $id, $valorid, $idejer) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                e.idetapaequipoplan,
                e.idetapaequipoglobal,
                e.idejercicio,
                e.valor
              FROM 
                mod_planifinversiones.{$tabla} e WHERE e.idetapaequipoglobal = {$valorid}";
        $res1 = $conn->execute($sql);
//    print_r($res1);die;
        return $res1->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addvalorConstr($tabla, $valor, $moneda, $ejercicio, $consprov) {
        $conn = Doctrine_Manager::connection();
        $sql = "INSERT INTO  mod_planifinversiones." . $tabla . " (idmoneda,idejercicio,idetapinverconsprov,valor)
                VALUES (" . $moneda . "," . $ejercicio . "," . $consprov . ","
                . $valor . ");";
        $res1 = $conn->execute($sql);
        return $res1;
    }

    public function listarInversiones($params, $identidad, $idinvers) {
//pre_r(implode(',', $idinvers));die('e');        
        $entidades = implode(',', $identidad);
        $conn = Doctrine_Manager::connection();
        $addwhere = "";
        $ADDWHERE = "";
        $condiciones = array();
        $wheretrue = " Where true";
        $Havingtrue = "Having true ";
        $query = Doctrine_Query::create();
        $params_query = array();
        foreach ($params['filtros'] as $p => $s) {

            if ($s != null) {
                if ($s['field'] == 'codigo') {

                    self::addWhereConParams(
                            $addwhere, $params_query, "i.codigo  LIKE", ("'%" . $s['data']['value'] . "%'")
                    );
                } else if ($s['field'] == 'denominacion') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "upper(i.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                } else if ($s['field'] == 'financista') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "upper(nomfinan.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                } else if ($s['field'] == 'tipofinanciamiento') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "upper(nomtipof.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                } else if ($s['field'] == 'clasificacion') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "ti.idtipoinversion = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'tipoinv') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "tip.idtipoinversionprograma = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'programa') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "prog.idprograma = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'caracteristicas') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "c.idcaracteristica = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'desempenno') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "de.iddatdesempenno = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'provincia') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "i.idprovincia = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'forma') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "fp.idformapropiedad = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'medioambiente') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "mamb.idmedioambiente = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'estadoplan') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "eplaninv.idestadoplaninversion = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'sector') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "sectestrag.idsectorestrategico = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'grupoobra') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "gobra.idgrupoobra = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'objetivo') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "obj.idobjetivo = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'efecto') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "ec.idefectocomercial = ", $s['data']['value']
                    );
                } else if ($s['field'] == 'fechainicio') {
                    if ($s['data']['comparison'] == 'gt') {
                        $addwhere.= " AND  i.fechainicio > '" . $s['data']['value'] . "'";
                    }
                    if ($s['data']['comparison'] == 'lt') {
                        $addwhere.= " AND  i.fechainicio <  '" . $s['data']['value'] . "'";
                    }
                    if ($s['data']['comparison'] == 'eq') {
                        $addwhere.= " AND  i.fechainicio = '" . $s['data']['value'] . "'";
                    }
                } else if ($s['field'] == 'fechafin') {
                    if ($s['data']['comparison'] == 'gt') {
                        $addwhere.= " AND  i.fechafin >  '" . $s['data']['value'] . "'";
                    }
                    if ($s['data']['comparison'] == 'lt') {
                        $addwhere.= " AND  i.fechafin <  '" . $s['data']['value'] . "'";
                    }
                    if ($s['data']['comparison'] == 'eq') {
                        $addwhere.= " AND  i.fechafin =  '" . $s['data']['value'] . "'";
                    }
                } else if ($s['field'] == 'fasttrack' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "i.fasttrack=1";
                } else if ($s['field'] == 'fasttrack' && $s['data']['value'] == 'No') {
                    $condiciones[] = "i.fasttrack=0";
                } else if ($s['field'] == 'equipos' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "ee.idetapaequipos != 0";
                } else if ($s['field'] == 'documento' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "ele.documento=1";
                } else if ($s['field'] == 'plan') {
                    if ($s['data']['value'] == 'Resto de inversiones') {
                        $condiciones[] = "(i.idcumplimientoinversion = 1 AND UPPER(nomcaract.denominacion) = 'RESTO DE INVERSIONES')";
                    } else if ($s['data']['value'] == 'Plan Mep') {
                        $condiciones[] = "(i.idcumplimientoinversion = 1 AND UPPER(nomcaract.denominacion) != 'RESTO DE INVERSIONES')";
                    } else {
                        $condiciones[] = "i.idcumplimientoinversion = 0";
                    }
                } else if ($s['field'] == 'idestadoaprobacion' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "i.idestadoaprobacion=1";
                } else if ($s['field'] == 'idestadoaprobacion' && $s['data']['value'] == 'No') {
                    $condiciones[] = "i.idestadoaprobacion=2";
                } else if ($s['field'] == 'idestadoinversion' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "i.idestadoinversion=1";
                } else if ($s['field'] == 'idestadoinversion' && $s['data']['value'] == 'No') {
                    $condiciones[] = "i.idestadoinversion=2";
                } else if ($s['field'] == 'analpostinversiones') { {
                        $cond = "=";
                        if ($s['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($s['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        $condiciones[] = "i.analpostinversiones {$cond} " . ($s['data']['value']);
                    }
                } else if ($s['field'] == 'cuadrada' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "i.cuadrada=1";
                } else if ($s['field'] == 'cuadrada' && $s['data']['value'] == 'No') {
                    $condiciones[] = "i.cuadrada=0";
                } else if ($s['field'] == 'cartera' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "(SELECT COUNT (fact.idinversionestfact)
                            from mod_planifinversiones.dat_inversionestfact fact where fact.idinversion = i.idinversion)>0 and (i.idestadoplaninversion = 5 or i.preparacion = 1)";
                } else if ($s['field'] == 'cartera' && $s['data']['value'] == 'No') {
                    $condiciones[] = "(SELECT COUNT (fact.idinversionestfact)
                            from mod_planifinversiones.dat_inversionestfact fact where fact.idinversion = i.idinversion)= 0 and (i.idestadoplaninversion = 5 or i.preparacion = 1)";
                } else if ($s['field'] == 'factibilidad' && $s['data']['value'] == 'Si') {

                    $condiciones[] = "(SELECT COUNT (facti.idinversionestfact)
                            from mod_planifinversiones.dat_inversionestfact facti where facti.idinversion = i.idinversion)>0";
                } else if ($s['field'] == 'factibilidad' && $s['data']['value'] == 'No') {
                    $condiciones[] = "(SELECT COUNT (facti.idinversionestfact)
                            from mod_planifinversiones.dat_inversionestfact facti where facti.idinversion = i.idinversion)= 0";
                } else if ($s['field'] == 'nompreparacion' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "i.preparacion=1";
                } else if ($s['field'] == 'nompreparacion' && $s['data']['value'] == 'No') {
                    $condiciones[] = "i.preparacion=0";
                } else if ($s['field'] == 'bloqueada' && $s['data']['value'] == 'Si') {
                    $condiciones[] = "i.bloqueada=1";
                } else if ($s['field'] == 'bloqueada' && $s['data']['value'] == 'No') {
                    $condiciones[] = "i.bloqueada=2";
                }
            }
        }  // print_r( strtoupper($s['data']['value']));die;

        $ADDWHERE = '';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }
        if ($plan) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "i.idestadoaprobacion=1 AND i.idestadoinversion=1";
        }

        /* $hoy = NomEjercicioplanificacion::obtenerDenEjercicioActual();
          print_r($hoy);die; */
        if ($params['vigente'] == 1) {

            // $hoy = split(':', date("D:M:Y"));
            //$hoy = NomEjercicioplanificacion::obtenerDenEjercicioActual();
            //$fechaInicio = '01-01-' . $hoy[2];
            // $fechaFin = '31-12-' . $hoy[2];
            //$fechaInicio = '01-01-' . $hoy['ejercicio'];
            //$fechaFin = '31-12-' . $hoy['ejercicio']; /* print_r($fechaInicio);echo('----');print_r($fechaFin);die; */
            //$ADDWHERE = $ADDWHERE . ' AND ' . "i.fechainicio >= '" . $fechaInicio . "' AND i.fechafin <= '" . $fechaFin . "'";
            $ADDWHERE = $ADDWHERE . " AND ({$params['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$params['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$params['idejercicio']} ";
        }
        if (count($idinvers)) {
            $ADDWHERE = $ADDWHERE . " AND i.idinversion  in (" . implode(',', $idinvers) . ")";
        }
        if ($params['factibilidad']) {
            $ADDWHERE = $ADDWHERE . " and (SELECT COUNT (fact.idinversionestfact)
                            from mod_planifinversiones.dat_inversionestfact fact where fact.idinversion = i.idinversion)>0";
        }
        if ($params['cartera']) {
            $ADDWHERE = $ADDWHERE . " and (SELECT COUNT (fact.idinversionestfact)
                            from mod_planifinversiones.dat_inversionestfact fact where fact.idinversion = i.idinversion)>0 and (i.idestadoplaninversion = 5 or i.preparacion = 1)";
        }
        //LA CONSULTA LISTA TODO LO DE LA TABLA INVERSION 
        //Y ADEMAS LOS NOMENCLADORES ASOCIADOS A CADA INVERSION
        $sql = "SELECT i.idinversion, i.codigo,i.preparacion, i.idcumplimientoinversion, i.fechainicio, i.denominacion
, i.fechafin,
                i.fasttrack, i.idprovincia idprovincia,	i.idestadoaprobacion, i.idestadoinversion, c.idcaracteristica,
                i.observaciones,
                i.analpostinversiones,i.iddatdesempenno, i.cuadrada, i.idcontenido, dpt.denominacion provincia,
                obj.idobjetivo, ti.idtipoinversion, tip.idtipoinversionprograma,mamb.idmedioambiente
,nomtmed.denominacion medioambiente, fp.idformapropiedad, ec.idefectocomercial,
                ti.denominacion clasificacion, nomcaract.denominacion caracteristicas, nomforma.denominacion
 forma,prog.idprograma,nomidprograma.denominacion programa,
                nomefecto.denominacion efecto, nomobjetivo.denominacion objetivo,desem.denominacion desempenno
, nomttipo.denominacion tipoinv,
              --  nomfinan.denominacion financista, 
                
              --  nomtipof.denominacion tipofinanciamiento, 
               -- ele.documento,
                i.idestructuracomun, 
                e.denominacion estructura, 
                i.idejercicio,
                nomgobra.denominacion grupoobra, gobra.idgrupoobra, nomeplaninv.denominacion estadoplan
, eplaninv.idestadoplaninversion,
                nomesector.denominacion sector, sectestrag.idsectorestrategico,
               --ei.idetapainversion,
                 --CASE WHEN ee.idetapainversion IS NOT NULL THEN 1 ELSE 0 END AS equipos,
                 CASE WHEN i.preparacion = 1 THEN 'Si' ELSE 'No' END AS nompreparacion,
                 CASE WHEN (SELECT COUNT (fact.idinversionestfact)
                            from mod_planifinversiones.dat_inversionestfact fact where fact.idinversion
 = i.idinversion)>0 then 'Si' else 'No' end as factibilidad,
                 CASE WHEN ((SELECT COUNT (fact.idinversionestfact)
                            from mod_planifinversiones.dat_inversionestfact fact where fact.idinversion
 = i.idinversion)> 0 )
                            and ((i.idestadoplaninversion = 5) or (i.preparacion = 1))then 'Si' else
 'No' end as cartera


                /*case when (SELECT count (ee.idetapainversion) as contador,
                
                FROM mod_planifinversiones.dat_etapainversion eti 
                inner join mod_planifinversiones.dat_etapaequipos ee on (eti.idetapainversion = ee.idetapainversion
)
                where eti.idinversion = i.idinversion)>0  
                then 1 else 0 end as equipos   */
                ,bloqueada
                FROM  mod_planifinversiones.dat_inversion i
                inner join mod_estructuracomp.dat_estructura e on e.idestructura = i.idestructuracomun
		LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (dpt.iddpt = i.idprovincia)
                LEFT JOIN mod_planifinversiones.dat_caracteristica c ON (i.idcaracteristica = c.idcaracteristica
) 
              LEFT JOIN mod_planificacion.nom_datosnomenclador nomcaract ON (c.iddatosnomenclador 
=  nomcaract.iddatosnomenclador) 
                  LEFT JOIN mod_planifinversiones.dat_objetivo obj ON (i.idobjetivo = obj.idobjetivo) 

                LEFT JOIN mod_planificacion.nom_datosnomenclador nomobjetivo ON (obj.iddatosnomenclador
 =  nomobjetivo.iddatosnomenclador) 
                
                LEFT JOIN mod_planifinversiones.dat_programa prog ON (i.idprograma = prog.idprograma
) 
               LEFT JOIN mod_planificacion.nom_datosnomenclador nomidprograma ON (prog.iddatosnomenclador
 =  nomidprograma.iddatosnomenclador)
                
                 LEFT JOIN mod_planifinversiones.dat_tipoinversionprograma tip ON (i.idtipoinversionprograma
 = tip.idtipoinversionprograma) 
                LEFT JOIN mod_planificacion.nom_datosnomenclador nomttipo ON (tip.iddatosnomenclador
 =  nomttipo.iddatosnomenclador) 
                
              LEFT JOIN mod_planifinversiones.dat_medioambiente mamb ON (i.idmedioambiente = mamb.idmedioambiente
)   
                LEFT JOIN mod_planificacion.nom_datosnomenclador nomtmed ON (mamb.iddatosnomenclador
 =  nomtmed.iddatosnomenclador)

               LEFT JOIN mod_planifinversiones.dat_grupoobra gobra ON (i.idgrupoobra = gobra.idgrupoobra
)
                 LEFT JOIN mod_planificacion.nom_datosnomenclador nomgobra ON (gobra.iddatosnomenclador
 =  nomgobra.iddatosnomenclador)

                LEFT JOIN mod_planifinversiones.dat_estadoplaninversion eplaninv ON (i.idestadoplaninversion
 = eplaninv.idestadoplaninversion)
                LEFT JOIN mod_planificacion.nom_datosnomenclador nomeplaninv ON (eplaninv.iddatosnomenclador
 =  nomeplaninv.iddatosnomenclador)

                LEFT JOIN mod_planifinversiones.dat_sectorestrategico sectestrag ON (i.idsectorestrategico
 = sectestrag.idsectorestrategico)
                LEFT JOIN mod_planificacion.nom_datosnomenclador nomesector ON (sectestrag.iddatosnomenclador
 =  nomesector.iddatosnomenclador)
                
                LEFT JOIN mod_planifinversiones.nom_tipoinversion ti ON (i.idtipoinversion = ti.idtipoinversion
) 
                LEFT JOIN mod_planifinversiones.dat_formapropiedad fp ON (i.idformapropiedad = fp.idformapropiedad
) 
                LEFT JOIN mod_planificacion.nom_datosnomenclador nomforma ON (fp.iddatosnomenclador 
=  nomforma.iddatosnomenclador)                
                LEFT JOIN mod_planifinversiones.dat_desempenno de ON (i.iddatdesempenno = de.iddatdesempenno
) 
                LEFT JOIN mod_planificacion.nom_datosnomenclador desem ON (de.iddatosnomenclador =  desem
.iddatosnomenclador) 
             /*  LEFT JOIN mod_planifinversiones.dat_financiamiento financiamiento ON (i.idinversion 
= financiamiento.idinversion) 
               LEFT JOIN mod_planifinversiones.dat_financista financista ON (financista.idfinancista
 = financiamiento.idfinancista) 
                 LEFT JOIN mod_planificacion.nom_datosnomenclador nomfinan ON (nomfinan.iddatosnomenclador
 =  financista.iddatosnomenclador)
                
                LEFT JOIN mod_planifinversiones.dat_tipofinanciamiento tipof ON (tipof.idtipofinanciamiento
 = financiamiento.idtipofinanciamiento)  
                LEFT JOIN mod_planificacion.nom_datosnomenclador nomtipof ON (nomtipof.iddatosnomenclador
 =  tipof.iddatosnomenclador)

                 LEFT JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion
)
                LEFT JOIN mod_planifinversiones.dat_etapaequipos ee ON (ee.idetapainversion = ei.idetapainversion
)

                LEFT JOIN mod_planifinversiones.dat_etapaelementoinversion eei ON (eei.idetapainversion
 = ei.idetapainversion)               
                LEFT JOIN mod_planifinversiones.dat_elemento ele ON (ele.idelemento = eei.idelemento
)*/

                LEFT JOIN mod_planifinversiones.dat_efectocomercial ec ON (i.idefectocomercial = ec.idefectocomercial
) 
                LEFT JOIN mod_planificacion.nom_datosnomenclador nomefecto ON (ec.iddatosnomenclador
 =  nomefecto.iddatosnomenclador)  
                WHERE i.eliminada = 0 AND i.idestructuracomun IN (" . $entidades . ")
                $addwhere
                $ADDWHERE
                ORDER BY i.denominacion";
//print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInversionesReHV($params, $identidad) {
        $entidades = implode(',', $identidad);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct(i.codigo), i.idinversion, i.denominacion,idestructuracomun
           ,i.idejercicio,no.plan    
                FROM  mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_otrosindicadares no ON(no.idinversion=i.idinversion)
                INNER JOIN mod_planifinversiones.nom_otrosindicadores nom ON(nom.idnomotrosindicadores=no.idnomotrosindicadores)
                WHERE no.idejercicio =" . $params['idejercicio']
                . "  AND i.idestructuracomun IN (" . $entidades . ")
                 AND nom.denominacion='" . $params['descrip'] . "'
                Group by 
               i.idinversion, i.idestructuracomun, i.idejercicio,  i.denominacion,no.plan 
                 ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInversionesPorIdOr($params, $idorganismo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct(i.codigo), i.idinversion, i.denominacion,idestructuracomun
           ,i.idejercicio,no.plan::numeric(19,0)   
                FROM  mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_otrosindicadares no ON(no.idinversion=i.idinversion)
                INNER JOIN mod_planifinversiones.nom_otrosindicadores nom ON(nom.idnomotrosindicadores=no.idnomotrosindicadores)
                WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND no.idejercicio =" . $params['idejercicio'] . "  AND i.idestructuracomun = $idorganismo
                 AND nom.idnomotrosindicadores='"
                . $params['idnomotrosindicadores'] . "' AND no.plan>0
                Group by
               i.idinversion, i.idestructuracomun, i.idejercicio,  i.denominacion,no.plan
                 ";
// print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInversionesPorIdOrCopia($params, $idorganismo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct(i.codigo), i.idinversion, i.denominacion,idestructuracomun
           ,i.idejercicio,no.plan::numeric(19,0)
                FROM  mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_otrosindicadares no ON(no.idinversion=i.idinversion)
                INNER JOIN mod_planifinversiones.nom_otrosindicadores nom ON(nom.idnomotrosindicadores=no.idnomotrosindicadores)
                WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND no.idejercicio =" . $params['idejercicio'] . "  AND i.idestructuracomun in($idorganismo)
                 AND nom.idnomotrosindicadores='"
                . $params['idnomotrosindicadores'] . "' AND no.plan>0
                Group by
               i.idinversion, i.idestructuracomun, i.idejercicio,  i.denominacion,no.plan
                 ";
//print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarSumaEntidades($parametros, $identidad) {
        $entidades = implode(',', $identidad);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idestructuracomun ,SUM(no.plan)::numeric(19,0)
                FROM  mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_otrosindicadares no ON(no.idinversion=i.idinversion)
                INNER JOIN mod_planifinversiones.nom_otrosindicadores nom ON(nom.idnomotrosindicadores=no.idnomotrosindicadores)
                WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND no.idejercicio =" . $parametros['idejercicio']
                . "  AND i.idestructuracomun IN (" . $entidades . ")
                AND nom.idnomotrosindicadores='"
                . $parametros['idnomotrosindicadores'] . "'
                Group by
                i.idestructuracomun
                 ";

        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function sumaTotal($params, $identidad) {
        $entidades = implode(',', $identidad);
        $conn = Doctrine_Manager::connection();
        $sql = " SELECT SUM(no.plan)::numeric(19,0)
                FROM  mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_otrosindicadares no ON(no.idinversion=i.idinversion)
                INNER JOIN mod_planifinversiones.nom_otrosindicadores nom ON(nom.idnomotrosindicadores=no.idnomotrosindicadores)
                WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND no.idejercicio = " . $params['idejercicio']
                . "   AND i.idestructuracomun  IN (" . $entidades . ")
                AND nom.idnomotrosindicadores="
                . $params['idnomotrosindicadores'];
        $dato = $conn->execute($sql);
        $dat = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function sumaTotalCopia($params, $identidad) {
        //$entidades = implode(',', $identidad);
        $conn = Doctrine_Manager::connection();
        $sql = " SELECT SUM(no.plan)::numeric(19,0)
                FROM  mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_otrosindicadares no ON(no.idinversion=i.idinversion)
                INNER JOIN mod_planifinversiones.nom_otrosindicadores nom ON(nom.idnomotrosindicadores=no.idnomotrosindicadores)
                WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND no.idejercicio = " . $params['idejercicio']
                . "   AND i.idestructuracomun  IN (" . $identidad . ")
                AND nom.idnomotrosindicadores="
                . $params['idnomotrosindicadores'];
        $dato = $conn->execute($sql);
        $dat = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function listarAcredorInversion($idejercicio, $entidades, $parametros, $valOrg, $idmoneda
    ) {

        $ADDWHERE = "";
        if ($parametros['gracia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "f.gracia="
                    . $parametros['gracia'] . "";
        }
        if ($parametros['interes']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "f.porcientointeres="
                    . $parametros['interes'] . "";
        }
        if ($parametros['amorti']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "f.plazoamortizacion="
                    . $parametros['amorti'] . "";
        }
        if ($parametros['credito']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "tf.idtipofinanciamiento in ("
                    . $parametros['credito'] . ")";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "

  Select    i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion , f.valor as credito, dnf.denominacion    as acredor ,  infp.valor as idinversfinancplan
  ,cont.valor as placontado
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 INNER JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                . $idmoneda . " and infp.idejercicio=" . $idejercicio . " and infp.idtipofinanciamiento=f.idtipofinanciamiento )



   left JOIN   mod_planifinversiones.dat_inverscontadoplan cont  ON(cont.idinversion=i.idinversion and cont.idmonedaentidad="
                . $idmoneda . " and cont.idejercicio=" . $idejercicio . " )


 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  i.idejercicio=" . $idejercicio . "    AND f.idmonedaentidad=" . $idmoneda
                . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
     $ADDWHERE
 order by i.denominacion
 ";

        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    //hom?logo del m?todo listarAcredorInversion
// implementado para el reporte  Inversion - Acreedor
//en la nueva soluci?n en el componente Reportes
    public function listarAcredorInversionSD($idejercicio, $valOrg, $idmoneda, $parametros) {

        $conn = Doctrine_Manager::connection();
        $sql = "

  Select    i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion , f.valor as credito, dnf.denominacion    as acredor ,  infp.valor as idinversfinancplan
  ,cont.valor as placontado
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 INNER JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                . $idmoneda . " and infp.idejercicio=" . $idejercicio . " and infp.idtipofinanciamiento=f.idtipofinanciamiento )



   left JOIN   mod_planifinversiones.dat_inverscontadoplan cont  ON(cont.idinversion=i.idinversion and cont.idmonedaentidad="
                . $idmoneda . " and cont.idejercicio=" . $idejercicio . " )


 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  i.eliminada = 0 AND i.idestadoinversion = 1 AND ({$parametros['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                                  and
                                  {$parametros['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                                 )    AND 
                f.idmonedaentidad=" . $idmoneda
                . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
  {$parametros['cadenaWHERE']}

 order by i.denominacion
 ";
//pre_r($sql);

        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function listarInversionAcredor($idejercicio, $entidades, $parametros, $valOrg, $idmoneda
    ) {

        $ADDWHERE = "";
        if ($parametros['gracia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "f.gracia="
                    . $parametros['gracia'] . "";
        }
        if ($parametros['interes']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "f.porcientointeres="
                    . $parametros['interes'] . "";
        }
        if ($parametros['amorti']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "f.plazoamortizacion="
                    . $parametros['amorti'] . "";
        }
        if ($parametros['credito']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "tf.idtipofinanciamiento in ("
                    . $parametros['credito'] . ")";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "

  Select    i.denominacion as deninv, f.gracia, f.porcientointeres, f.plazoamortizacion , f.valor as credito, dnf.denominacion    as denominacion ,
  infp.valor as idinversfinancplan,cont.valor as placontado
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 left JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                . $idmoneda . " and infp.idejercicio=" . $idejercicio . " and infp.idtipofinanciamiento=f.idtipofinanciamiento )

   left JOIN   mod_planifinversiones.dat_inverscontadoplan cont  ON(cont.idinversion=i.idinversion and cont.idmonedaentidad="
                . $idmoneda . " and cont.idejercicio=" . $idejercicio . " )


 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  i.idejercicio=" . $idejercicio . "    AND f.idmonedaentidad=" . $idmoneda
                . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
     $ADDWHERE
 order by dnf.denominacion
 ";
        // print_r('<pre>');print_r($sql);die;


        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    //hom?logo del m?todo listarInversionAcredor
// implementado para el reporte  Acreedor - Inversion
//en la nueva soluci?n en el componente Reportes
    public function listarInversionAcredorSG($idejercicio, $valOrg, $idmoneda, $params
    ) {

        $conn = Doctrine_Manager::connection();
        $sql = "

  Select    i.denominacion as deninv, f.gracia, f.porcientointeres, f.plazoamortizacion , f.valor as credito, dnf.denominacion    as denominacion ,
  infp.valor as idinversfinancplan,cont.valor as placontado
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 left JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                . $idmoneda . " and infp.idejercicio=" . $idejercicio . " and infp.idtipofinanciamiento=f.idtipofinanciamiento )

   left JOIN   mod_planifinversiones.dat_inverscontadoplan cont  ON(cont.idinversion=i.idinversion and cont.idmonedaentidad="
                . $idmoneda . " and cont.idejercicio=" . $idejercicio . " )


 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  ({$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                                  and
                                  {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                                 )
AND i.eliminada = 0 AND i.idestadoinversion = 1 AND f.idmonedaentidad=" . $idmoneda
                . "
 {$params['cadenaWHERE']}
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0

 order by dnf.denominacion
 ";

//print_r($sql);
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function listarAcredorInversionC($idejercicio, $entidades, $parametros, $valOrg, $idmoneda
    ) {
        $ADDWHERE;
        $conn = Doctrine_Manager::connection();
        if ($parametros['gracia'] == null && $parametros['interes'] == null && $parametros['amorti'] == null && $parametros['credito'] == null
        ) {
            $sql = "Select    i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion ,  SUM(f.valor) as credito, dnf.denominacion    as acredor ,  infp.valor as idinversfinancplan
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 INNER JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                    . $idmoneda . " and infp.idejercicio=" . $idejercicio . " and infp.idtipofinanciamiento=f.idtipofinanciamiento )
 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  i.idejercicio=" . $idejercicio . "    AND f.idmonedaentidad=" . $idmoneda
                    . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
 GROUP BY i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion, dnf.denominacion  ,  infp.valor
 order by i.denominacion
 ";
        } else {
            if ($parametros['gracia']) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "f.gracia="
                        . $parametros['gracia'] . "";
            }
            if ($parametros['interes']) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "f.porcientointeres="
                        . $parametros['interes'] . "";
            }
            if ($parametros['amorti']) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "f.plazoamortizacion="
                        . $parametros['amorti'] . "";
            }
            if ($parametros['credito']) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "tf.idtipofinanciamiento in ("
                        . $parametros['credito'] . ")";
            }
            $sql = "Select    i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion ,  SUM(f.valor) as credito, dnf.denominacion    as acredor ,  infp.valor as idinversfinancplan
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 INNER JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                    . $idmoneda . " and infp.idejercicio=" . $idejercicio . "  and infp.idtipofinanciamiento=f.idtipofinanciamiento)
 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  i.idejercicio=" . $idejercicio . "    AND f.idmonedaentidad=" . $idmoneda
                    . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
     $ADDWHERE
 GROUP BY i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion, dnf.denominacion  ,  infp.valor
 order by i.denominacion
                      ";
        }//print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    //hom?logo del m?todo listarAcredorInversionC
// implementado para el reporte  Inversion - Acreedor
//en la nueva soluci?n en el componente Reportes
    public function listarAcredorInversionCSD($idejercicio, $valOrg, $idmoneda, $parametros
    ) {

        $conn = Doctrine_Manager::connection();

        $sql = "Select    i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion ,  SUM(f.valor) as credito, dnf.denominacion    as acredor ,  infp.valor as idinversfinancplan
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 INNER JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                . $idmoneda . " and infp.idejercicio=" . $idejercicio . "  and infp.idtipofinanciamiento=f.idtipofinanciamiento)
 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  i.eliminada = 0 AND i.idestadoinversion = 1 AND ({$parametros['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                                  and
                                  {$parametros['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                                 )  AND 
                f.idmonedaentidad=" . $idmoneda
                . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
  {$parametros['cadenaWHERE']}
 GROUP BY i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion, dnf.denominacion  ,  infp.valor
 order by i.denominacion
                      ";


        //pre_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInversionAcredorC($idejercicio, $entidades, $parametros, $valOrg, $idmoneda
    ) {
        $ADDWHERE;
        $conn = Doctrine_Manager::connection();
        if ($parametros['gracia'] == null && $parametros['interes'] == null && $parametros['amorti'] == null && $parametros['credito'] == null
        ) {
            $sql = "Select i.denominacion as deninv , f.gracia, f.porcientointeres, f.plazoamortizacion ,  SUM(f.valor) as credito, dnf.denominacion  as denominacion ,  infp.valor as idinversfinancplan,cont.valor as placontado
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 left JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                    . $idmoneda . " and infp.idejercicio=" . $idejercicio . " and infp.idtipofinanciamiento=f.idtipofinanciamiento )


   left JOIN   mod_planifinversiones.dat_inverscontadoplan cont  ON(cont.idinversion=i.idinversion and cont.idmonedaentidad="
                    . $idmoneda . " and cont.idejercicio=" . $idejercicio . " )



 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  i.idejercicio=" . $idejercicio . "    AND f.idmonedaentidad=" . $idmoneda
                    . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
 GROUP BY i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion, dnf.denominacion  ,  infp.valor,cont.valor
 order by dnf.denominacion
 ";
        } else {
            if ($parametros['gracia']) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "f.gracia="
                        . $parametros['gracia'] . "";
            }
            if ($parametros['interes']) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "f.porcientointeres="
                        . $parametros['interes'] . "";
            }
            if ($parametros['amorti']) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "f.plazoamortizacion="
                        . $parametros['amorti'] . "";
            }
            if ($parametros['credito']) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "tf.idtipofinanciamiento in ("
                        . $parametros['credito'] . ")";
            }
            $sql = "

Select    i.denominacion as deninv, f.gracia, f.porcientointeres, f.plazoamortizacion ,  SUM(f.valor) as credito, dnf.denominacion    as denominacion ,  infp.valor as idinversfinancplan,cont.valor as placontado
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 left JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                    . $idmoneda . " and infp.idejercicio=" . $idejercicio . "  and infp.idtipofinanciamiento=f.idtipofinanciamiento)

    left JOIN   mod_planifinversiones.dat_inverscontadoplan cont  ON(cont.idinversion=i.idinversion and cont.idmonedaentidad="
                    . $idmoneda . " and cont.idejercicio=" . $idejercicio . " )




 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where  i.idejercicio=" . $idejercicio . "    AND f.idmonedaentidad=" . $idmoneda
                    . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
     $ADDWHERE
 GROUP BY i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion, dnf.denominacion  ,  infp.valor,cont.valor
 order by dnf.denominacion
                      ";
        }//print_r($sql);die;
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

//hom?logo del m?todo listarInversionAcredorC
// implementado para el reporte  Acreedor - Inversion
//en la nueva soluci?n en el componente Reportes
    public function listarInversionAcredorCSG($idejercicio, $valOrg, $idmoneda, $parametros
    ) {

        $conn = Doctrine_Manager::connection();

        $sql = "

Select    i.denominacion as deninv, f.gracia, f.porcientointeres, f.plazoamortizacion ,  SUM(f.valor) as credito, dnf.denominacion    as denominacion ,  infp.valor as idinversfinancplan,cont.valor as placontado
 From mod_planifinversiones.dat_inversion i
 INNER JOIN   mod_planifinversiones.dat_financiamiento f  ON(f.idinversion=i.idinversion)
 left JOIN   mod_planifinversiones.dat_inversfinancplan infp  ON(infp.idinversion=i.idinversion and infp.idmonedaentidad="
                . $idmoneda . " and infp.idejercicio=" . $idejercicio . "  and infp.idtipofinanciamiento=f.idtipofinanciamiento)

    left JOIN   mod_planifinversiones.dat_inverscontadoplan cont  ON(cont.idinversion=i.idinversion and cont.idmonedaentidad="
                . $idmoneda . " and cont.idejercicio=" . $idejercicio . " )




 INNER JOIN   mod_planifinversiones.dat_financista fi  ON(fi.idfinancista=f.idfinancista)
 INNER JOIN   mod_planifinversiones.dat_tipofinanciamiento tf  ON(tf.idtipofinanciamiento=f.idtipofinanciamiento)
 left JOIN   mod_planificacion.nom_datosnomenclador dn  ON(dn.iddatosnomenclador=fi.iddatosnomenclador and dn.denominacion like 'CREDITO')
 left JOIN   mod_planificacion.nom_datosnomenclador dnf  ON(dnf.iddatosnomenclador=tf.iddatosnomenclador )
Where i.eliminada = 0 AND i.idestadoinversion = 1 AND ({$parametros['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                                  and
                                  {$parametros['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                                 )
                                 AND f.idmonedaentidad=" . $idmoneda
                . "
 AND i.idestructuracomun = $valOrg and f.porcientointeres > 0
     {$parametros['cadenaWHERE']}
 GROUP BY i.denominacion , f.gracia, f.porcientointeres, f.plazoamortizacion, dnf.denominacion  ,  infp.valor,cont.valor
 order by dnf.denominacion
                      ";
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarAcredorInversionContado($idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = " Select plan.valor,plan.idinversion FROM mod_planifinversiones.dat_inverscontadoplan plan
                  INNER JOIN  mod_planifinversiones.dat_inversion i ON(i.idinversion=plan.idinversion)
                   WHERE plan.idejercicio=" . $idejercicio . " AND plan.valor !=0
                      ";
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInversionAcredPlan($idejercicio, $entidades, $parametros, $valOrg, $moneda
    ) {
        $ADDWHERE = "";
        if ($parametros['gracia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "fi.gracia="
                    . $parametros['gracia'] . "";
        }
        if ($parametros['interes']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "fi.porcientointeres="
                    . $parametros['interes'] . "";
        }
        if ($parametros['amorti']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "fi.plazoamortizacion="
                    . $parametros['amorti'] . "";
        }
        if ($parametros['credito']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "fi.idtipofinanciamiento in ("
                    . $parametros['credito'] . ")";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "Select ip.idinversfinancplan,ip.valor,ip.valor as credito,ip.idinversion,i.denominacion,ip.idtipofinanciamiento ,nomtipof.denominacion as acredor ,fi.gracia,fi.porcientointeres,fi.plazoamortizacion
                    From mod_planifinversiones.dat_inversfinancplan ip
                    INNER JOIN  mod_planifinversiones.dat_inversion i ON(i.idinversion=ip.idinversion)
                    INNER JOIN  mod_planifinversiones.dat_tipofinanciamiento f ON(f.idtipofinanciamiento=ip.idtipofinanciamiento)
                    INNER JOIN mod_planificacion.nom_datosnomenclador nomtipof ON (nomtipof.iddatosnomenclador =  f.iddatosnomenclador)
                    INNER JOIN mod_planifinversiones.dat_financiamiento fi ON (fi.idtipofinanciamiento = ip.idtipofinanciamiento)
                    Where  ip.idejercicio=" . $idejercicio . "  AND fi.idinversion=i.idinversion
                    AND i.idestructuracomun = $valOrg AND ip.idmonedaentidad="
                . $moneda . "
                    $ADDWHERE
                    order by ip.idtipofinanciamiento
                      ";
        $dato = $conn->execute($sql);
        $datos = $dato->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarTipoInversionReporte($entidad, $parametros) {
        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON (tip.idtipoinversionprograma)tip.idtipoinversionprograma,i.idinversion,i.denominacion,nomttipo.denominacion tipoinv
                    From mod_planifinversiones.dat_inversion i
                    inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = i.idinversion)
                    inner JOIN mod_planifinversiones.dat_inversetapaplan m ON(ei.idetapainversion = m.idetapainversion)
                    INNER JOIN mod_planifinversiones.dat_tipoinversionprograma tip ON (i.idtipoinversionprograma = tip.idtipoinversionprograma)
                    INNER JOIN mod_planificacion.nom_datosnomenclador nomttipo ON (tip.iddatosnomenclador =  nomttipo.iddatosnomenclador)
                    WHERE m.idejercicio=" . $parametros['idejercicio'] . "
                    --AND i.idformapropiedad in (" . $parametros['forma'] . ")
                    --AND i.idestructuracomun IN (" . $entid . ")
                    /*AND nomttipo.iddatosnomenclador not in(2204)*/ --'PREPARACION'
                    AND i.preparacion = 0  and i.idtipoinversionprograma <> 133 and i.idtipoinversionprograma <> 130
                    --order by tip.idtipoinversionprograma DESC ";
//pre_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function listarTipInversion($entidad, $parametros, $tipo_reporte) {
        if (is_array($entidad)) {
            $entid = implode(',', $entidad);
        } else {
            $entid = $entidad;
        }
        $addWhere = " ";
        if ($tipo_reporte == 'emision') {
            $addWhere .= " AND i.preparacion = 0 ";
        }
        if ($parametros['forma'] != '') {
            $addWhere .= " AND i.idformapropiedad in (" . $parametros['forma'] . ")";
        }
        $conn = Doctrine_Manager::connection();
//-------------------------------SE EXCLUYEN LAS DE TIPO PREPARACION Y LAS -
        $sql = "Select tip.idtipoinversionprograma,i.idinversion,i.denominacion,nomttipo.denominacion tipoinv, nomttipo.iddatosnomenclador
                From mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = i.idinversion)
                inner JOIN mod_planifinversiones.dat_inversetapaplan m ON(ei.idetapainversion = m.idetapainversion)
                INNER JOIN mod_planifinversiones.dat_tipoinversionprograma tip ON (i.idtipoinversionprograma = tip.idtipoinversionprograma)
                INNER JOIN mod_planificacion.nom_datosnomenclador nomttipo ON (tip.iddatosnomenclador =  nomttipo.iddatosnomenclador)
                WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND m.idejercicio=" . $parametros['idejercicio'] . " and i.idtipoinversionprograma <> 133 and i.idtipoinversionprograma <> 130
                    AND i.idestructuracomun IN (" . $entid . ")
                    $addWhere
                    order by tip.idtipoinversionprograma DESC "; /* print_r($sql);die; */



        //pre_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function listarInversionPorFiltros($entidad, $parametros, $tipo_reporte) {
        $addWhere = " ";
        if ($tipo_reporte == 'emision') {
            $addWhere .= " AND i.preparacion = 0 ";
        } elseif ($tipo_reporte == 'componente') {
            $addWhere = " ";
        }

        $conn = Doctrine_Manager::connection();

        $sql = "Select tip.idtipoinversionprograma,i.idinversion,i.denominacion,nomttipo.denominacion tipoinv, nomttipo.iddatosnomenclador
                From mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_tipoinversionprograma tip ON (i.idtipoinversionprograma = tip.idtipoinversionprograma)
                INNER JOIN mod_planificacion.nom_datosnomenclador nomttipo ON (tip.iddatosnomenclador =  nomttipo.iddatosnomenclador)
                WHERE i.idejercicio=" . $parametros['idejercicio'] . "
                    AND i.idestructuracomun IN (" . $entidad . ") $addWhere {$parametros['cadenaWHERE']}
                    order by tip.idtipoinversionprograma DESC "; //print_r($sql);die;
        //print_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function listarCmbMedioAmbiente() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select idat.denominacion,
			ma.idmedioambiente
                        from mod_planifinversiones.dat_medioambiente ma
                        INNER JOIN mod_planificacion.nom_datosnomenclador idat
			ON idat.iddatosnomenclador = ma.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ListarSumaInv($entidad, $parametros, $where, $moneda) {
        if ($moneda == 1) {
            $moneda = 'USD';
        } else {
            $moneda = 'CUP';
        }
        if ($parametros['forma'] != '') {
            $addWhere = " and di.idformapropiedad in (" . $parametros['forma'] . ")";
        } else {
            $addWhere = "";
        }
        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
        /* $sql = "select
          SUM(r.valor)
          , r.idinversion
          from
          (
          SELECT m.idelementovalor, m.idmonedaentidad, m.valor, di.idinversion
          FROM mod_planifinversiones.dat_inversion di
          inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
          inner join mod_planifinversiones.dat_etapaelementoinversion eei on(eei.idetapainversion = ei.idetapainversion)
          inner join mod_planifinversiones.dat_elementovalor m on(eei.idetapaelementoinversion = m.idelemento)

          inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
          inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
          inner join mod_datosmaestros.dat_monedaentidad me on (me.idmonedaentidad = m.idmonedaentidad)
          inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)

          where mo.codigoiso = '$moneda'
          and di.idestructuracomun in ($entid)
          $addWhere
          and di.idejercicio = " . $parametros['idejercicio'] . "

          union

          SELECT (SELECT sum(m.idelementovalor) FROM mod_planifinversiones.dat_elementovalor m
          WHERE (m.idmonedaentidad = me.idmonedaentidad)) as idelementovalor,
          me.idmonedaentidad ,sum(eq.importe) as importe, di.idinversion
          FROM  mod_planifinversiones.dat_inversion di
          inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
          inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
          inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
          left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion)
          inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = eq.identidadmodelo)
          inner join mod_datosmaestros.dat_monedaentidad me on (me.idestructuracomun = em.identidad)
          inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = me.idmoneda)
          WHERE
          di.idestructuracomun in ($entid)
          and di.idejercicio = " . $parametros['idejercicio'] . "
          $addWhere
          and m.codigoiso = '$moneda'
          group by me.idmonedaentidad, di.idinversion


          )r

          group by r.idinversion
          order by r.idinversion"; */

        // print_r($sql);die;
        $sql = "select SUM(ep.valor), di.idinversion
                FROM mod_planifinversiones.dat_inversion di
                inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
                 inner join mod_planifinversiones.dat_inversetapaplan ep on (ep.idetapainversion = ei.idetapainversion)
                 inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                  inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                  inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = ep.idmoneda)
                  where mo.codigoiso = '$moneda' and di.idestructuracomun in ($entid)
                  and ep.idejercicio = {$parametros['idejercicio']}
                  $addWhere
                  group by di.idinversion";

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ListarCmpPorInv($data) {
        $arrayInv = array();
        foreach ($data as $val) {
            $arrayInv[] = $val['idinversion'];
        }
        if ($arrayInv != null) {
            $inversiones = implode(',', $arrayInv);
        } else {
            $inversiones = 0;
        }
        $conn = Doctrine_Manager::connection();
        $sql = "select DISTINCT ne.idnombreetapa ,ne.denominacion, ne.orden
                FROM mod_planifinversiones.dat_etapainversion eiv
               INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
               INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
order by ne.orden
			   ";
        // --where ne.idnombreetapa not in(76)   --no se incluye el componente capital inicial de trabajo en la emision del 2016
        //print_r('<pre>');print_r($sql);die;
        /* WHERE  eiv.idinversion in(" . $inversiones . ") */
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ListarValxCmp($data, $params) {
        $arrayInv = array();
        foreach ($data as $val) {
            $arrayInv[] = $val['idinversion'];
        }
        if ($arrayInv != null) {
            $inversiones = implode(',', $arrayInv);
        } else {
            $inversiones = 0;
        }
        $conn = Doctrine_Manager::connection();
//        $sql = "select ne.idnombreetapa ,ne.denominacion,  sum(dev.valor) as totalComp
//					FROM mod_planifinversiones.dat_etapainversion eiv
//                                        --LEFT JOIN mod_planifinversiones.dat_etapaequipos eteq ON (eteq.idetapainversion =eiv.idetapainversion)
//					INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
//					INNER JOIN mod_planifinversiones.dat_etapaelementoinversion dei ON(eiv.idetapainversion = dei.idetapainversion)
//					INNER JOIN mod_planifinversiones.dat_elementovalor dev ON(dei.idetapaelementoinversion = dev.idelemento)
//					INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
//					INNER JOIN mod_planifinversiones.dat_inversion i ON(eiv.idinversion=i.idinversion)
//					INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON(dev.idmonedaentidad = dme.idmonedaentidad)
//					INNER JOIN mod_datosmaestros.nom_moneda nm ON(dme.idmoneda = nm.idmoneda)
//					WHERE i.idinversion in(" . $inversiones . ") AND nm.idmoneda = 9900000103
//					group by (ne.idnombreetapa)";
        $sql = "select
            SUM(r.valor) as totalComp, r.denominacion, r.idnombreetapa
            from
            (
            SELECT m.idelementovalor, m.idmonedaentidad, m.valor,ne.denominacion, ne.idnombreetapa
            FROM mod_planifinversiones.dat_inversion di
            inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
            inner join mod_planifinversiones.dat_etapaelementoinversion eei on(eei.idetapainversion = ei.idetapainversion)
            inner join mod_planifinversiones.dat_elementovalor m on(eei.idetapaelementoinversion = m.idelemento)

            inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
            inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
            inner join mod_datosmaestros.dat_monedaentidad me on (me.idmonedaentidad = m.idmonedaentidad)
            inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)

            where mo.codigoiso = 'CUP'
            and di.idinversion in (" . $inversiones . ")
            and di.idejercicio = " . $params['idejercicio'] . "

            union

            SELECT (SELECT sum(m.idelementovalor) FROM mod_planifinversiones.dat_elementovalor m
            WHERE (m.idmonedaentidad = me.idmonedaentidad)) as idelementovalor,
            me.idmonedaentidad ,sum(eq.importe) as importe,ne.denominacion, ne.idnombreetapa
            FROM  mod_planifinversiones.dat_inversion di
            inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
            inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
            inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
            left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion)
            inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = eq.identidadmodelo)
            inner join mod_datosmaestros.dat_monedaentidad me on (me.idestructuracomun = em.identidad)
            inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = me.idmoneda)
            WHERE
                di.idinversion in (" . $inversiones . ")
                and di.idejercicio = " . $params['idejercicio'] . "
                and m.codigoiso = 'CUP'
            group by me.idmonedaentidad,ne.denominacion, ne.idnombreetapa


            )r
            group by r.denominacion, r.idnombreetapa
            order by r.denominacion";
        //print_r($sql);die;
        $data = $conn->execute($sql);
        //print_r($data);die;
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ListarValPlanxPrograma($data, $params, $whereInversion, $entidad, $totalizarPrograma, $denomInversion) {
        $arrayInv = array();
        $conn = Doctrine_Manager::connection();
        if (is_array($entidad)) {
            $entid = implode(',', $entidad);
        } else {
            $entid = $entidad;
        }

        if ($totalizarPrograma == 1) {
            $selectTotalPrograma = "select sum(p.totalComp)  as totalInv from ( ";
            $groupByTotalPrograma = ")p ";
        } else {
            $selectTotalPrograma = " ";
            $groupByTotalPrograma = " ";
        }
        if ($denomInversion == 1) {
            $selectDenomInversionGral = " r.denominversion,";
            $selectDenomInversion = " i.denominacion as denominversion,";
            $groupByDenomInversionGral = " r.denominversion,";
        } else {
            $selectDenomInversionGral = " ";
            $selectDenomInversion = " ";
            $groupByDenomInversionGral = " ";
        }

        $sqlInv = "$selectTotalPrograma
                      select
                            $selectDenomInversionGral SUM(r.valor) as totalComp, r.denominacion, r.idtipoinversionprograma, r.iddatosnomenclador
                            from
                            (
                              SELECT $selectDenomInversion m.valor,d.denominacion, p.idtipoinversionprograma, d.iddatosnomenclador
                              FROM mod_planifinversiones.dat_inversion i

                              inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = i.idinversion)
                              inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                                inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                              inner JOIN mod_planifinversiones.dat_inversetapaplan m ON(ei.idetapainversion = m.idetapainversion)
                              inner join mod_planifinversiones.dat_tipoinversionprograma p on(i.idtipoinversionprograma = p.idtipoinversionprograma)
                              INNER JOIN mod_planificacion.nom_datosnomenclador d ON(p.iddatosnomenclador= d.iddatosnomenclador)
                              inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = m.idmoneda)

                              where i.eliminada = 0 AND i.idestadoinversion = 1 AND mo.codigoiso = 'CUP' and p.idtipoinversionprograma <> 133 and p.idtipoinversionprograma <> 130
                              AND i.idestructuracomun IN ({$entid})
                              and m.idejercicio = {$params['idejercicio']}  AND  ne.idnombreetapa <> 76
                               and   ({$params['idejercicioden']} >= (date_part('year', i.fechainicio))::numeric
                               and {$params['idejercicioden']} <= (date_part('year', i.fechafin))::numeric )
                               $whereInversion
                            )r
                      group by $groupByDenomInversionGral r.denominacion, r.idtipoinversionprograma, r.iddatosnomenclador
                      order by r.denominacion
                    $groupByTotalPrograma ";
        //pre_r($sqlInv);die;
        $data = $conn->execute($sqlInv);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ListarValxCmpPlan($data, $params, $whereInversion, $entidad) {
        $arrayInv = array();
        $conn = Doctrine_Manager::connection();
        if (is_array($entidad)) {
            $entid = implode(',', $entidad);
        } else {
            $entid = $entidad;
        }
        foreach ($data as $val) {
            $arrayInv[] = $val['idinversion'];
        }
        if ($arrayInv != null) {
            $inversiones = implode(',', $arrayInv);
        } else {
            $inversiones = 0;
        }

        //pre_r($whereInversion);die;
//        $sql = "select ne.idnombreetapa ,ne.denominacion,  sum(dev.valor) as totalComp
//					FROM mod_planifinversiones.dat_etapainversion eiv
//                                        --LEFT JOIN mod_planifinversiones.dat_etapaequipos eteq ON (eteq.idetapainversion =eiv.idetapainversion)
//					INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
//					INNER JOIN mod_planifinversiones.dat_etapaelementoinversion dei ON(eiv.idetapainversion = dei.idetapainversion)
//					INNER JOIN mod_planifinversiones.dat_elementovalor dev ON(dei.idetapaelementoinversion = dev.idelemento)
//					INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
//					INNER JOIN mod_planifinversiones.dat_inversion i ON(eiv.idinversion=i.idinversion)
//					INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON(dev.idmonedaentidad = dme.idmonedaentidad)
//					INNER JOIN mod_datosmaestros.nom_moneda nm ON(dme.idmoneda = nm.idmoneda)
//					WHERE i.idinversion in(" . $inversiones . ") AND nm.idmoneda = 9900000103
//					group by (ne.idnombreetapa)";

        $sql = "select
            SUM(r.valor) as totalComp, r.denominacion, r.idnombreetapa
            from
            (
            SELECT m.valor,ne.denominacion, ne.idnombreetapa
            FROM mod_planifinversiones.dat_inversion i
            inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = i.idinversion)
            inner JOIN mod_planifinversiones.dat_inversetapaplan m ON(ei.idetapainversion = m.idetapainversion)
            inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
            inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
            inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = m.idmoneda)

            where i.eliminada = 0 AND i.idestadoinversion = 1 AND mo.codigoiso = 'CUP'  and i.idtipoinversionprograma <> 133 and i.idtipoinversionprograma <> 130
             AND i.idestructuracomun IN (" . $entid . ")
            and m.idejercicio = " . $params['idejercicio'] . "
            and   ({$params['idejercicioden']} >= (date_part('year', i.fechainicio))::numeric
            and {$params['idejercicioden']} <= (date_part('year', i.fechafin))::numeric )
            $whereInversion
            )r
            group by r.denominacion, r.idnombreetapa
            order by r.denominacion";
        //print_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ListarValxCmpUSD($data, $params, $whereInversion, $entidad) {
        $arrayInv = array();
        foreach ($data as $val) {
            $arrayInv[] = $val['idinversion'];
        }

        if (is_array($entidad)) {
            $entid = implode(',', $entidad);
        } else {
            $entid = $entidad;
        }
        if ($arrayInv != null) {
            $inversiones = implode(',', $arrayInv);
        } else {
            $inversiones = 0;
        }
        $conn = Doctrine_Manager::connection();
        $sql = "select sum(p.totalcomp)
                    from(select
                            SUM(r.valor) as totalComp, r.denominacion, r.idnombreetapa
                            from
                            (
                            SELECT  iep.idmoneda, iep.valor,ne.denominacion, ne.idnombreetapa,i.codigo,iep.idetapainversion
                            FROM mod_planifinversiones.dat_inversion i
                            inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = i.idinversion)
                            inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                            inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                            inner join mod_planifinversiones.dat_inversetapaplan iep on (iep.idetapainversion = ei.idetapainversion and iep.idejercicio = "
                . $params['idejercicio'] . ")
                            inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = iep.idmoneda)
                            where i.eliminada = 0 AND i.idestadoinversion = 1 AND mo.codigoiso = 'USD'
                             AND i.idestructuracomun IN (" . $entid . ")
                            and iep.idejercicio = " . $params['idejercicio'] . "
                               and   ({$params['idejercicioden']} >= (date_part('year', i.fechainicio))::numeric
                               and {$params['idejercicioden']} <= (date_part('year', i.fechafin))::numeric )
                               $whereInversion
                            )r
                            group by r.denominacion, r.idnombreetapa
                            having SUM(r.valor) <> 0
                            order by r.denominacion
                    )p";

//pre_r($sql);die;

        $data = $conn->execute($sql);
        //$dat = $data->fetchAll(PDO::FETCH_ASSOC);
        $dat = $data->fetchAll(PDO::FETCH_COLUMN);
        return $dat;
    }

    public function ListarSumaTotal($entidad, $parametros) {
        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
//ne.idnombreetapa,
        if ($parametros['forma'] != '') {
            $addWhere = " and i.idformapropiedad in (" . $parametros['forma'] . ")";
        } else {
            $addWhere = " ";
        }
        $sql = "SELECT et.idetapa ,SUM(no.valor)
                   FROM mod_planifinversiones.dat_etapainversion eiv
                   INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                   INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                   INNER JOIN mod_planifinversiones.dat_inversion i ON(eiv.idinversion=i.idinversion)
                   INNER JOIN mod_planifinversiones.dat_inversetapaplan no ON(no.idetapainversion=eiv.idetapainversion)
                   Where no.idejercicio=" . $parametros['idejercicio'] . "
                   AND i.idestructuracomun in ( " . $entid
                . ") $addWhere
                   AND no.idmoneda=" . $parametros['mp'] . "   AND no.valor!=0
                   GROUP BY et.idetapa";
        //print_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ListarSumaDivisas($entidad, $parametros) {
        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
        if ($parametros['forma'] != '') {
            $addWhere = " and i.idformapropiedad in (" . $parametros['forma'] . ")";
        } else {
            $addWhere = " ";
        }
        $sql = "SELECT et.idetapa ,SUM(no.valor)
                   FROM mod_planifinversiones.dat_etapainversion eiv
                   INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                   INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                   INNER JOIN mod_planifinversiones.dat_inversion i ON(eiv.idinversion=i.idinversion)
                   INNER JOIN mod_planifinversiones.dat_inversetapaplan no ON(no.idetapainversion=eiv.idetapainversion)
                   Where no.idejercicio=" . $parametros['idejercicio'] . "
                    AND i.idestructuracomun in ( " . $entid
                . ") $addWhere
                    AND no.idmoneda=" . $parametros['usd'] . "   AND no.valor!=0
                   GROUP BY et.idetapa";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function listarSumaEntidadesEmision($parametros, $params, $entidad) {
        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
        if ($parametros['forma'] != '') {
            $addWhere = " and i.idformapropiedad in (" . $parametros['forma'] . ")";
        } else {
            $addWhere = " ";
        }
        $sql = "SELECT idestructuracomun ,SUM(no.plan)
                FROM  mod_planifinversiones.dat_inversion i
                INNER JOIN mod_planifinversiones.dat_otrosindicadares no ON(no.idinversion=i.idinversion)
                INNER JOIN mod_planifinversiones.nom_otrosindicadores nom ON(nom.idnomotrosindicadores=no.idnomotrosindicadores)
                WHERE no.idejercicio =" . $parametros['idejercicio']
                . "  AND i.idestructuracomun IN ( " . $entid . ")
               $addWhere
                AND nom.idnomotrosindicadores =" . $params['descrip'] . "
                Group by
                i.idestructuracomun
                 ";
//print_r($sql);die;
//print_r('--');
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function ListarPlanMP($parametros, $entidad) {//yos
        // print_r($entidad);die;
        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
        if ($parametros['forma'] != '') {
            $addWhere = " and i.idformapropiedad in (" . $parametros['forma'] . ")";
        } else {
            $addWhere = " ";
        }
        $sql = "SELECT
		p.idmonedaentidad ,COALESCE(SUM(p.valor),0) as suma
		FROM  mod_planifinversiones.dat_presanteproy p
		INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = p.idinversion)
		INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = p.idmonedaentidad AND me.idmoneda ="
                . $parametros['mp'] . " )
		WHERE i.idejercicio =" . $parametros['idejercicio'] . "  AND i.idestructuracomun IN($entid)
                    $addWhere
                Group by p.idmonedaentidad
                 "; //pre_r($sql);die;
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function ListarPlanPreparacionReporteEmisionCUP($parametros, $entidad, $whereInversion) {

        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
        $sql = "select sum(p.suma) as preparacioncup from (SELECT
                            p.idmonedaentidad, COALESCE(SUM(pp.valor),0) as suma
                            FROM  mod_planifinversiones.dat_inversion i
                            INNER JOIN  mod_planifinversiones.dat_presanteproy p ON (i.idinversion = p.idinversion)
                            inner join  mod_planifinversiones.dat_presupplan pp ON (pp.idpresanteproy = p.idpresanteproy)
                            INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = p.idmonedaentidad /*AND me.idmoneda = {$parametros['mp']}*/ )
                            inner join mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda AND m.codigoiso = 'CUP')
                            WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND pp.idejercicio ={$parametros['idejercicio']}  AND i.idestructuracomun IN($entid)
                                    and   ({$parametros['idejercicioden']} >= (date_part('year', i.fechainicio))::numeric
                            and {$parametros['idejercicioden']} <= (date_part('year', i.fechafin))::numeric )
                            $whereInversion
                            Group by p.idmonedaentidad
                 )p
                 ";
        //pre_r($sql);die;
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function ListarPlanPreparacionReporteEmisionUSD($parametros, $entidad, $whereInversion) {
        // print_r($entidad);die;
        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
        $sql = "select sum(p.suma) as preparacionusd from (SELECT
                            p.idmonedaentidad, COALESCE(SUM(pp.valor),0) as suma
                            FROM  mod_planifinversiones.dat_inversion i
                            INNER JOIN  mod_planifinversiones.dat_presanteproy p ON (i.idinversion = p.idinversion)
                            inner join  mod_planifinversiones.dat_presupplan pp ON (pp.idpresanteproy = p.idpresanteproy)
                            INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = p.idmonedaentidad /*AND me.idmoneda = {$parametros['usd']}*/ )
                            inner join mod_datosmaestros.nom_moneda m ON(me.idmoneda = m.idmoneda AND m.codigoiso = 'USD')
                            WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND pp.idejercicio ={$parametros['idejercicio']}  AND i.idestructuracomun IN($entid)
                               and   ({$parametros['idejercicioden']} >= (date_part('year', i.fechainicio))::numeric
                               and {$parametros['idejercicioden']} <= (date_part('year', i.fechafin))::numeric )
                               $whereInversion
                            Group by p.idmonedaentidad
                 )p
                 "; //pre_r($sql);die;
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function ListarPlanUSD($parametros, $entidad) {
        $entid = implode(',', $entidad);
        $conn = Doctrine_Manager::connection();
        if ($parametros['forma'] != '') {
            $addWhere = " and i.idformapropiedad in (" . $parametros['forma'] . ")";
        } else {
            $addWhere = " ";
        }
        $sql = "SELECT
		p.idmonedaentidad ,COALESCE(SUM(p.valor),0) as suma
		FROM  mod_planifinversiones.dat_presanteproy p
		INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = p.idinversion)
	        INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = p.idmonedaentidad
                    AND me.idmoneda =" . $parametros['usd'] . " )
                WHERE i.idejercicio =" . $parametros['idejercicio'] . "  AND i.idestructuracomun IN($entid)
                   $addWhere
                Group by
                p.idmonedaentidad
                 "; // print_r($sql);die;
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarConstructorDenominacion($parametros, $entidades, $org) {
        $ADDWHERE;
        if ($parametros['constructor']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.idconstructor  IN ("
                    . $parametros['arrayconstructor'] . ")";
        }
        if ($parametros['provincia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.iddpt  IN ("
                    . $parametros['provincia'] . ")";
        }
        if ($parametros['formaden'] == "") {
            $ADDWHERE = " and i.idformapropiedad in (" . $parametros['formaden']
                    . ")";
        } else {
            $ADDWHERE = "";
        }
        $conn = Doctrine_Manager::connection();

        $sql = "select r.idinversion,r.denominacion ,r.forma,r.idetapainversion,r.idconstructor,r.dencont,r.denetapa,r.prov,
sum(r.cup) as cup ,sum(r.usd ) as usd

from (

Select i.idinversion,i.denominacion ,eiv.idetapainversion,con.idconstructor,da.denominacion as dencont,df.denominacion  as forma,
ne.denominacion as denetapa,p.denominacion as prov,
case when ejec.idmoneda=" . $parametros['mp'] . " then ejec.valor else 0 end cup,
case when ejec.idmoneda=" . $parametros['usd'] . " then ejec.valor else 0 end usd
from mod_planifinversiones.dat_inversion i
INNER JOIN mod_planifinversiones.dat_etapainversion eiv ON(i.idinversion=eiv.idinversion)
INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
INNER JOIN mod_planifinversiones.dat_etapinverconsprov con ON(con.idetapainversion=eiv.idetapainversion)
INNER JOIN mod_planifinversiones.dat_constructor c ON(con.idconstructor=c.idconstructor)
INNER JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador = c.iddatosnomenclador)
INNER JOIN mod_datosmaestros.nom_dpt p ON (p.iddpt=con.iddpt)
INNER JOIN mod_planifinversiones.dat_etapinverconsprovplan ejec ON (con.idetapinverconsprov = ejec.idetapinverconsprov)
 INNER JOIN mod_planifinversiones.dat_formapropiedad forma ON (forma.idformapropiedad = i.idformapropiedad)
   INNER JOIN mod_planificacion.nom_datosnomenclador df ON (df.iddatosnomenclador = forma.iddatosnomenclador)
 WHERE ejec.idejercicio =" . $parametros['idejercicio'] . "  AND i.idestructuracomun = $org $ADDWHERE
 --group by i.idinversion,i.denominacion ,eiv.idetapainversion,con.idconstructor,da.denominacion,ne.denominacion,con.iddpt--,ejec.idmoneda

 )r
 group by r.idinversion,r.denominacion ,r.idetapainversion,r.idconstructor,r.dencont,r.denetapa,r.prov,r.forma
 order by r.denominacion ";
        //   print_r($sql);die;

        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarConstructorDenominacionC($parametros, $entidades, $org
    ) {
        $ADDWHERE;
        if ($parametros['constructor']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.idconstructor  IN ("
                    . $parametros['arrayconstructor'] . ")";
        }
        if ($parametros['provincia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.iddpt  IN ("
                    . $parametros['provincia'] . ")";
        }
        $conn = Doctrine_Manager::connection();

        $sql = "select r.idinversion,r.denominacion ,r.idetapainversion,r.idconstructor,r.dencont,r.denetapa,r.prov,r.idestructuracomun,
sum(r.cup) as cup ,sum(r.usd ) as usd

from (

Select i.idinversion,i.denominacion ,eiv.idetapainversion,con.idconstructor,da.denominacion as dencont,
ne.denominacion as denetapa,p.denominacion as prov,i.idestructuracomun,
case when ejec.idmoneda=" . $parametros['mp'] . " AND ejec.idejercicio ="
                . $parametros['idejercicio'] . " then ejec.valor else 0 end cup,
case when ejec.idmoneda=" . $parametros['usd'] . " AND ejec.idejercicio ="
                . $parametros['idejercicio'] . " then ejec.valor else 0 end usd
from mod_planifinversiones.dat_inversion i
INNER JOIN mod_planifinversiones.dat_etapainversion eiv ON(i.idinversion=eiv.idinversion)
INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
INNER JOIN mod_planifinversiones.dat_etapinverconsprov con ON(con.idetapainversion=eiv.idetapainversion)
INNER JOIN mod_planifinversiones.dat_constructor c ON(con.idconstructor=c.idconstructor)
INNER JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador = c.iddatosnomenclador)
INNER JOIN mod_datosmaestros.nom_dpt p ON (p.iddpt=con.iddpt)
LEFT JOIN mod_planifinversiones.dat_etapinverconsprovplan ejec ON (con.idetapinverconsprov = ejec.idetapinverconsprov)
 WHERE i.idestructuracomun = $org
 --group by i.idinversion,i.denominacion ,eiv.idetapainversion,con.idconstructor,da.denominacion,ne.denominacion,con.iddpt--,ejec.idmoneda

 )r
 group by r.idinversion,r.denominacion ,r.idetapainversion,r.idconstructor,r.dencont,r.denetapa,r.prov,r.idestructuracomun
 order by r.dencont,r.idestructuracomun ";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

//hom?logo del m?todo listarConstructorDenominacionC
// implementado para el reporte  Construccion y montaje por constructor
//en la nueva soluci?n en el componente Reportes
    public function listarConstruccionyMontaje($parametros, $org) {
        $conn = Doctrine_Manager::connection();

        $sql = "select r.idinversion,r.denominacion ,r.idetapainversion,r.idconstructor,r.dencont,r.denetapa,r.prov,r.idestructuracomun,
sum(r.cup) as cup ,sum(r.usd ) as usd

from (

Select i.idinversion,i.denominacion ,eiv.idetapainversion,con.idconstructor,da.denominacion as dencont,
ne.denominacion as denetapa,p.denominacion as prov,i.idestructuracomun,
case when ejec.idmoneda=" . $parametros['mp'] . " AND ejec.idejercicio ="
                . $parametros['idejercicio'] . " then ejec.valor else 0 end cup,
case when ejec.idmoneda=" . $parametros['usd'] . " AND ejec.idejercicio ="
                . $parametros['idejercicio'] . " then ejec.valor else 0 end usd
from mod_planifinversiones.dat_inversion i
INNER JOIN mod_planifinversiones.dat_etapainversion eiv ON(i.idinversion=eiv.idinversion)
INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
INNER JOIN mod_planifinversiones.dat_etapinverconsprov con ON(con.idetapainversion=eiv.idetapainversion)
INNER JOIN mod_planifinversiones.dat_constructor c ON(con.idconstructor=c.idconstructor)
INNER JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador = c.iddatosnomenclador)
INNER JOIN mod_datosmaestros.nom_dpt p ON (p.iddpt=con.iddpt)
LEFT JOIN mod_planifinversiones.dat_etapinverconsprovplan ejec ON (con.idetapinverconsprov = ejec.idetapinverconsprov)
 WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND i.idestructuracomun = $org
      and ejec.valor>0
 {$parametros['cadenaWHERE']}

 )r
 group by r.idinversion,r.denominacion ,r.idetapainversion,r.idconstructor,r.dencont,r.denetapa,r.prov,r.idestructuracomun
 order by r.dencont,r.idestructuracomun ";
 
 //print_r('Construccion y montaje por constructor:---'.$sql);die;
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //hom?logo del m?todo listarConstructorDenominacion
    // implementado para el reporte  Construccion y montaje
    //en la nueva soluci?n en el componente Reportes

    public function listarConstruccionyMontajeI($parametros, $org, $idinversion, $cons = null) {

        $conn = Doctrine_Manager::connection();
        if ($cons == 1) {
            $sel = "select sum(t.cup) as cup ,sum(t.usd ) as usd
from(";
            $group = ")t";
            $addw = "and i.idinversion=$idinversion";
        } else {
            $sel = "";
            $group = "";
            $addw = "";
        }
        $sql = " $sel select r.idinversion,r.denominacion ,r.forma,r.idetapainversion,r.idconstructor,r.dencont,r.denetapa,r.prov,
sum(r.cup) as cup ,sum(r.usd ) as usd

from (

Select i.idinversion,i.denominacion ,eiv.idetapainversion,con.idconstructor,da.denominacion as dencont,df.denominacion  as forma,
ne.denominacion as denetapa,p.denominacion as prov,
case when ejec.idmoneda=" . $parametros['mp'] . " then ejec.valor else 0 end cup,
case when ejec.idmoneda=" . $parametros['usd'] . " then ejec.valor else 0 end usd
from mod_planifinversiones.dat_inversion i
INNER JOIN mod_planifinversiones.dat_etapainversion eiv ON(i.idinversion=eiv.idinversion)
INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
INNER JOIN mod_planifinversiones.dat_etapinverconsprov con ON(con.idetapainversion=eiv.idetapainversion)
INNER JOIN mod_planifinversiones.dat_constructor c ON(con.idconstructor=c.idconstructor)
INNER JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador = c.iddatosnomenclador)
INNER JOIN mod_datosmaestros.nom_dpt p ON (p.iddpt=con.iddpt)
INNER JOIN mod_planifinversiones.dat_etapinverconsprovplan ejec ON (con.idetapinverconsprov = ejec.idetapinverconsprov)
 INNER JOIN mod_planifinversiones.dat_formapropiedad forma ON (forma.idformapropiedad = i.idformapropiedad)
   INNER JOIN mod_planificacion.nom_datosnomenclador df ON (df.iddatosnomenclador = forma.iddatosnomenclador)
 WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND ejec.idejercicio =" . $parametros['idejercicio'] . "  AND i.idestructuracomun = $org
     and
                    ({$parametros['ejercicio']} >=(date_part('year', i.fechainicio))::numeric and
                    {$parametros['ejercicio']} <=(date_part('year', i.fechafin))::numeric)
     and ejec.valor>0
    $addw
 {$parametros['cadenaWHERE']}

 )r
 group by r.idinversion,r.denominacion ,r.idetapainversion,r.idconstructor,r.dencont,r.denetapa,r.prov,r.forma
 order by r.denominacion $group";

 //print_r('Construccion y montaje:---'.$sql);die;
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarConstructorDenominacionUSD($parametros, $entidades) {
        $ADDWHERE;
        if ($parametros['constructor']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.idconstructor  IN ("
                    . $parametros['arrayconstructor'] . ")";
        }
        if ($parametros['provincia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.iddpt  IN ("
                    . $parametros['provincia'] . ")";
        }

        $conn = Doctrine_Manager::connection();
        $sql = "Select i.idinversion,i.denominacion ,eiv.idetapainversion,con.idconstructor,da.denominacion as dencont,
                         ne.denominacion as denetapa,con.iddpt,ejec.valor as valorusd
                         from mod_planifinversiones.dat_inversion i
                         INNER JOIN mod_planifinversiones.dat_etapainversion eiv ON(i.idinversion=eiv.idinversion)
                         INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                         INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov con ON(con.idetapainversion=eiv.idetapainversion)
                         INNER JOIN mod_planifinversiones.dat_constructor c ON(con.idconstructor=c.idconstructor)
                         INNER JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador = c.iddatosnomenclador)
                         INNER JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (con.idetapinverconsprov = ejec.idetapinverconsprov)
                         WHERE ejec.idejercicio =" . $parametros['idejercicio']
                . "
                         AND ejec.idmoneda=" . $parametros['usd']
                . "AND i.idestructuracomun IN (" . $entidades . ")
                         $ADDWHERE ";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarDenominacionInversiones($parametros, $entidades, $org) {
        $ADDWHERE;
        if ($parametros['constructor']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.idconstructor  IN ("
                    . $parametros['arrayconstructor'] . ")";
        }
        if ($parametros['provincia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.iddpt  IN ("
                    . $parametros['provincia'] . ")";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "Select  DISTINCT ON (i.idinversion)i.idinversion,i.denominacion
                       from mod_planifinversiones.dat_inversion i
                       INNER JOIN mod_planifinversiones.dat_etapainversion eiv ON(i.idinversion=eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                       INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                       INNER JOIN mod_planifinversiones.dat_etapinverconsprov con ON(con.idetapainversion=eiv.idetapainversion)
                       INNER JOIN mod_planifinversiones.dat_constructor c ON(con.idconstructor=c.idconstructor)
                       INNER JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador = c.iddatosnomenclador)
                       INNER JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (con.idetapinverconsprov = ejec.idetapinverconsprov)
                       WHERE ejec.idejercicio =" . $parametros['idejercicio'] . "
                       AND i.idestructuracomun = $org
                        $ADDWHERE  ";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarSumaTotalConstructorMP($parametros, $entidades) {
        $ADDWHERE;
        if ($parametros['constructor']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.idconstructor  IN ("
                    . $parametros['arrayconstructor'] . ")";
        }
        if ($parametros['provincia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.iddpt  IN ("
                    . $parametros['provincia'] . ")";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "Select i.idinversion, SUM(ejec.valor) as sumamp
                      from mod_planifinversiones.dat_inversion i
                      INNER JOIN mod_planifinversiones.dat_etapainversion eiv ON(i.idinversion=eiv.idinversion)
                      INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                      INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                      INNER JOIN mod_planifinversiones.dat_etapinverconsprov con ON(con.idetapainversion=eiv.idetapainversion)
                      INNER JOIN mod_planifinversiones.dat_constructor c ON(con.idconstructor=c.idconstructor)
                      INNER JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador = c.iddatosnomenclador)
                      INNER JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (con.idetapinverconsprov = ejec.idetapinverconsprov)
                      WHERE ejec.idejercicio =" . $parametros['idejercicio'] . "
                      AND ejec.idmoneda=" . $parametros['mp']
                . "AND i.idestructuracomun IN (" . $entidades . ")
                      $ADDWHERE
                      GROUP BY i.idinversion
                          ";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function TotalesValConst($datosInv, $moneda, $ejerc) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select  COALESCE( sum(ejec.valor),0) as ejec, COALESCE( sum(estim.valor),0) as est,
         COALESCE( sum(pla.valor),0) as plan, COALESCE( sum(pro.valor),0) as proy
        FROM mod_planifinversiones.dat_etapainversion eiv
        INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON ( eiv.idetapainversion = etc.idetapainversion)
        LEFT JOIN mod_planifinversiones.dat_etapinverconsprovejecutado ejec ON ( etc.idetapinverconsprov = ejec.idetapinverconsprov AND ejec.idejercicio = $ejerc and ejec.idmoneda =  $moneda )
        LEFT JOIN mod_planifinversiones.dat_etapinverconsprovestimado estim ON (etc.idetapinverconsprov = estim.idetapinverconsprov AND estim.idejercicio = $ejerc and estim.idmoneda = $moneda)
        LEFT JOIN mod_planifinversiones.dat_etapinverconsprovplan pla ON (etc.idetapinverconsprov = pla.idetapinverconsprov AND pla.idejercicio = $ejerc and pla.idmoneda =  $moneda )
        LEFT JOIN mod_planifinversiones.dat_etapinverconsprovproyeccion pro ON (etc.idetapinverconsprov = pro.idetapinverconsprov AND pro.idejercicio = $ejerc and pro.idmoneda = $moneda )
        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
        INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
         WHERE inv.idestructuracomun = " . $datosInv['identidad']
                . " AND eiv.idinversion = " . $datosInv['idinversion'] . "";
        // print_r($sql);
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarSumaTotalConstructorUSD($parametros, $entidades, $org) {
        $ADDWHERE;
        if ($parametros['constructor']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.idconstructor  IN ("
                    . $parametros['arrayconstructor'] . ")";
        }
        if ($parametros['provincia']) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "con.iddpt  IN ("
                    . $parametros['provincia'] . ")";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "Select i.idinversion, SUM(ejec.valor) as sumausd
                      from mod_planifinversiones.dat_inversion i
                      INNER JOIN mod_planifinversiones.dat_etapainversion eiv ON(i.idinversion=eiv.idinversion)
                      INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                      INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                      INNER JOIN mod_planifinversiones.dat_etapinverconsprov con ON(con.idetapainversion=eiv.idetapainversion)
                      INNER JOIN mod_planifinversiones.dat_constructor c ON(con.idconstructor=c.idconstructor)
                      INNER JOIN mod_planificacion.nom_datosnomenclador da ON (da.iddatosnomenclador = c.iddatosnomenclador)
                      INNER JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (con.idetapinverconsprov = ejec.idetapinverconsprov)
                      WHERE ejec.idejercicio =" . $parametros['idejercicio'] . "
                      AND ejec.idmoneda=" . $parametros['usd'] . "AND i.idestructuracomun = $org
                      $ADDWHERE
                      GROUP BY i.idinversion
                          ";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function getComponentes() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT ne.denominacion,ne.idnombreetapa --, de.idetapa
            FROM mod_planifinversiones.dat_etapa de
            INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON(ne.idnombreetapa = de.idnombreetapa)
            ORDER BY ne.denominacion";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getDatosRptComponentes($parametros, $idejercicio, $entidades, $totalOrganismo) {
        $totalOrganismo = 1;



        $conn = Doctrine_Manager::connection();
        /* $sql = "SELECT z.idestructuracomun,
          z.idinversion,
          z.codigo,
          z.inversion,
          z.sector,
          z.idnombreetapa,
          z.denominacion,
          z.codigoiso,
          z.valor,
          z.idmoneda,
          z.organismopadre,
          z.planpreparacion
          FROM (
          select r.idestructuracomun,
          r.idinversion,
          r.codigo,
          r.inversion,
          r.sector,
          r.idnombreetapa,
          r.denominacion,
          r.codigoiso,
          sum(r.valor)::numeric (19, 3) as valor,
          r.idmoneda,
          r.organismopadre,
          COALESCE(case
          when 1 = $totalOrganismo then (
          SELECT sum(coalesce(pres.valor, 0))
          as planpreparacion
          FROM
          mod_planifinversiones.dat_inversion
          i
          inner join
          mod_planifinversiones.dat_presanteproy
          p on (i.idinversion =
          p.idinversion)
          inner join
          mod_planifinversiones.dat_presupplan
          pres on (pres.idpresanteproy =
          p.idpresanteproy)
          inner join
          mod_datosmaestros.dat_monedaentidad
          me on (me.idmonedaentidad =
          p.idmonedaentidad)
          where i.idinversion = r.idinversion
          and
          me.idmoneda = r.idmoneda and
          pres.idejercicio = $idejercicio
          )
          else
          (
          SELECT sum(coalesce(pres.valor, 0)) as planpreparacion
          FROM mod_planifinversiones.dat_inversion i
          inner join mod_planifinversiones.dat_presanteproy p on (
          i.idinversion = p.idinversion)
          inner join mod_planifinversiones.dat_presupplan pres on (
          pres.idpresanteproy = p.idpresanteproy)
          inner join mod_datosmaestros.dat_monedaentidad me on (
          me.idmonedaentidad = p.idmonedaentidad)
          where i.idestructuracomun in (
          select fi.idfila
          from
          mod_estructuracomp.nom_filaestruc
          fi
          where fi.lft BETWEEN (
          select
          fila.lft
          from
          mod_estructuracomp.nom_filaestruc
          fila
          where
          fila.idfila
          =
          r.idestructuracomun
          ) and
          (
          select fila.rgt
          from
          mod_estructuracomp.nom_filaestruc
          fila
          where fila.idfila =
          r.idestructuracomun
          )
          ) and
          i.idestructuracomun IN ($entidades) {$parametros['cadenaWHERE']} and
          me.idmoneda = r.idmoneda and
          pres.idejercicio = $idejercicio and
          ({$parametros['ejercicio']} >=(date_part('year', i.fechainicio))::numeric and
          {$parametros['ejercicio']} <=(date_part('year', i.fechafin))::numeric)
          )
          end, 0) as planpreparacion
          from (
          SELECT (
          select fi.idfila
          from mod_estructuracomp.nom_filaestruc fi
          where fi.lft =
          (
          select min(fis.lft)
          from mod_estructuracomp.nom_filaestruc fis
          where (
          select fila.lft
          from mod_estructuracomp.nom_filaestruc
          fila
          where fila.idfila = i.idestructuracomun
          ) BETWEEN fis.lft and
          fis.rgt
          )
          ) as idestructuracomun,
          case
          when 1 = $totalOrganismo then i.idinversion
          else 1
          end as idinversion,
          case
          when 1 = $totalOrganismo then i.codigo
          else ''
          end as codigo,
          case
          when 1 = $totalOrganismo then i.denominacion
          else ''
          end as inversion,
          ei.idetapa,
          ne.denominacion,
          dnse.denominacion AS sector,
          ne.idnombreetapa,
          --est.denominacion as organismo,
          m.codigoiso,
          m.idmoneda,
          eq.valor,
          case
          when fest.rgt - fest.lft <> 1 then est.denominacion
          else estpadre.denominacion
          end as organismopadre
          FROM mod_planifinversiones.dat_inversion i
          inner join mod_planifinversiones.dat_etapainversion ei on (
          i.idinversion = ei.idinversion)
          inner JOIN mod_planifinversiones.dat_etapa e ON (ei.idetapa =
          e.idetapa)
          inner join mod_estructuracomp.dat_estructura est ON (
          est.idestructura = i.idestructuracomun)
          inner join mod_estructuracomp.nom_filaestruc fest ON (
          est.idestructura = fest.idfila)
          inner join mod_estructuracomp.dat_estructura estpadre ON (
          fest.idpadre = estpadre.idestructura)
          inner JOIN mod_planifinversiones.nom_nombreetapa ne ON (
          e.idnombreetapa = ne.idnombreetapa)
          inner JOIN mod_planifinversiones.dat_inversetapaplan eq ON (
          ei.idetapainversion = eq.idetapainversion)
          inner join mod_datosmaestros.nom_moneda m on (m.idmoneda =
          eq.idmoneda)
          LEFT JOIN mod_planifinversiones.dat_sectorestrategico se on (
          se.idsectorestrategico = i.idsectorestrategico)
          LEFT JOIN mod_planificacion.nom_datosnomenclador dnse ON (
          dnse.iddatosnomenclador = se.iddatosnomenclador)
          WHERE i.idestructuracomun IN ($entidades) {$parametros['cadenaWHERE']} and
          eq.idejercicio = $idejercicio and
          ({$parametros['ejercicio']} >=(date_part('year', i.fechainicio))::numeric and
          {$parametros['ejercicio']} <=(date_part('year', i.fechafin))::numeric)
          ) r
          group by r.idestructuracomun,
          r.idinversion,
          r.codigo,
          r.inversion,
          r.sector,
          r.denominacion,
          r.codigoiso,
          r.idmoneda,
          r.idnombreetapa,
          r.organismopadre
          order by r.organismopadre,
          r.codigoiso,
          r.denominacion
          ) z
          WHERE
          z.planpreparacion <>0 OR z.valor <> 0"; */
        $sql = "--componente
            select * from (
( SELECT 
                     case
                       when 1 = $totalOrganismo then i.idinversion
                       else 1
                     end as idinversion,
                     case
                       when 1 = $totalOrganismo then i.codigo
                       else ''
                     end as codigo,
                     case
                       when 1 = $totalOrganismo then i.denominacion
                       else ''
                     end as inversion,
                     ei.idetapa,
                     ne.denominacion,
                     dnse.denominacion AS sector,
                     ne.idnombreetapa,                   
                     m.codigoiso,
                     m.idmoneda,
                     eq.valor,
                     case
                       when fest.rgt - fest.lft <> 1 then est.denominacion
                       else estpadre.denominacion
                     end as organismopadre,
                     est.denominacion entidad,
                     null as indicador
              FROM mod_planifinversiones.dat_inversion i
                   inner join mod_planifinversiones.dat_etapainversion ei on (
                     i.idinversion = ei.idinversion)
                   inner JOIN mod_planifinversiones.dat_etapa e ON (ei.idetapa =
                     e.idetapa)
                   inner join mod_estructuracomp.dat_estructura est ON (
                     est.idestructura = i.idestructuracomun)
                   inner join mod_estructuracomp.nom_filaestruc fest ON (
                     est.idestructura = fest.idfila)
                   inner join mod_estructuracomp.dat_estructura estpadre ON (
                     fest.idpadre = estpadre.idestructura)
                   inner JOIN mod_planifinversiones.nom_nombreetapa ne ON (
                     e.idnombreetapa = ne.idnombreetapa)
                   INNER JOIN mod_planifinversiones.dat_inversetapaplan eq ON (
                     ei.idetapainversion = eq.idetapainversion)
                   INNER join mod_datosmaestros.nom_moneda m on (m.idmoneda =
                     eq.idmoneda)
                   LEFT JOIN mod_planifinversiones.dat_sectorestrategico se on (
                     se.idsectorestrategico = i.idsectorestrategico)
                   LEFT JOIN mod_planificacion.nom_datosnomenclador dnse ON (
                     dnse.iddatosnomenclador = se.iddatosnomenclador)
              WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND i.idestructuracomun IN ($entidades) {$parametros['cadenaWHERE']} and
                    eq.idejercicio = $idejercicio and
                    ({$parametros['ejercicio']} >=(date_part('year', i.fechainicio))::numeric and
                    {$parametros['ejercicio']} <=(date_part('year', i.fechafin))::numeric) AND
                    eq.valor <> 0
 
       order by organismopadre,
                m.codigoiso,
                ne.denominacion, entidad)
                UNION
--plan de prep
(    SELECT case
             when 1 = $totalOrganismo then i.idinversion
             else 1
           end as idinversion,
           case
             when 1 = $totalOrganismo then i.codigo
             else ''
           end as codigo,
           case
             when 1 = $totalOrganismo then i.denominacion
             else ''
           end as inversion,
           null as idetapa,
           null as denominacion,
           dnse.denominacion AS sector,
           null as idnombreetapa,
           m.codigoiso,
           m.idmoneda,
         COALESCE(sum(coalesce(pres.valor, 0))) as valor,
           case
             when fest.rgt - fest.lft <> 1 then est.denominacion
             else estpadre.denominacion
           end as organismopadre,
           est.denominacion entidad,
            null as indicador
           
    FROM mod_planifinversiones.dat_inversion i
         inner join mod_planifinversiones.dat_presanteproy p on (i.idinversion =
           p.idinversion)
         inner join mod_planifinversiones.dat_presupplan pres on (
           pres.idpresanteproy = p.idpresanteproy)
           inner join mod_estructuracomp.dat_estructura est ON (
                     est.idestructura = i.idestructuracomun)
                   inner join mod_estructuracomp.nom_filaestruc fest ON (
                     est.idestructura = fest.idfila)
                   inner join mod_estructuracomp.dat_estructura estpadre ON (
                     fest.idpadre = estpadre.idestructura)
         inner join mod_datosmaestros.dat_monedaentidad me on (
           me.idmonedaentidad = p.idmonedaentidad)
           INNER join mod_datosmaestros.nom_moneda m on (m.idmoneda =
                     me.idmoneda)
           LEFT JOIN mod_planifinversiones.dat_sectorestrategico se on (
                     se.idsectorestrategico = i.idsectorestrategico)
                   LEFT JOIN mod_planificacion.nom_datosnomenclador dnse ON (
                     dnse.iddatosnomenclador = se.iddatosnomenclador)
    where i.eliminada = 0 AND i.idestadoinversion = 1 AND i.idestructuracomun IN ($entidades) {$parametros['cadenaWHERE']} and
          pres.idejercicio = $idejercicio and
          ({$parametros['ejercicio']} >=(date_part('year', i.fechainicio))::numeric and
          {$parametros['ejercicio']} <=(date_part('year', i.fechafin))::numeric) AND pres.valor <> 0
    GROUP BY i.idinversion,dnse.denominacion,m.idmoneda,m.codigoiso,fest.rgt,fest.lft,est.denominacion,estpadre.denominacion)
    UNION
--impacto salarial
(    SELECT case
             when 1 = $totalOrganismo then i.idinversion
             else 1
           end as idinversion,
           case
             when 1 = $totalOrganismo then i.codigo
             else ''
           end as codigo,
           case
             when 1 = $totalOrganismo then i.denominacion
             else ''
           end as inversion,
           null as idetapa,
           null as denominacion,
           dnse.denominacion AS sector,
           null as idnombreetapa,
           null as codigoiso,
           null as idmoneda,
           /*COALESCE(sum(coalesce(oi.plan, 0))) as valor,*/
           oi.plan,
           case
             when fest.rgt - fest.lft <> 1 then est.denominacion
             else estpadre.denominacion
           end as organismopadre,
           est.denominacion entidad,
           noi.denominacion as indicador

     FROM mod_planifinversiones.dat_inversion i
         inner join mod_planifinversiones.dat_otrosindicadoresannospostcant p on (i.idinversion = p.idinversion)
         INNER JOIN mod_planifinversiones.dat_otrosindicadares oi on(i.idinversion = oi.idinversion)
         INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(oi.idnomotrosindicadores  = noi.idnomotrosindicadores)
         inner join mod_estructuracomp.dat_estructura est ON ( est.idestructura = i.idestructuracomun)
         inner join mod_estructuracomp.nom_filaestruc fest ON ( est.idestructura = fest.idfila)
         inner join mod_estructuracomp.dat_estructura estpadre ON (fest.idpadre = estpadre.idestructura)
         LEFT JOIN mod_planifinversiones.dat_sectorestrategico se on (se.idsectorestrategico = i.idsectorestrategico)
         LEFT JOIN mod_planificacion.nom_datosnomenclador dnse ON (
         dnse.iddatosnomenclador = se.iddatosnomenclador)
    where i.eliminada = 0 AND i.idestadoinversion = 1 AND i.idestructuracomun IN ($entidades) {$parametros['cadenaWHERE']}
         and oi.idejercicio = {$idejercicio}
         and noi.idnomotrosindicadores = 118 /*valor para el nomenclador de impacto salarial*/
         and ({$parametros['ejercicio']} >=(date_part('year', i.fechainicio))::numeric
         and {$parametros['ejercicio']} <=(date_part('year', i.fechafin))::numeric) AND oi.plan <> 0
    ))as dd order by organismopadre,entidad";
//print_r($sql);die;
        $datosListar = $conn->execute($sql);
        //pre_r($sql);die;
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function getDatosRptComponentesEntidades($idejercicio, $entidades, $totalOrganismo
    ) {

//print_r($entidades);die;
        $conn = Doctrine_Manager::connection();
        $sql = "
                select
                    r.idestructuracomun,

                      r.idinversion,
                      r.codigo,
                      r.inversion,
                       r.idnombreetapa,
                     -- r.idetapa,
                     r.organismo,
                      r.denominacion ,
                      r.codigoiso,
                      sum(r.valor)::numeric(19,3) as valor,
                     r.idmoneda ,
                        COALESCE( case when 1 = $totalOrganismo then (SELECT sum (coalesce( p.valor,0)) as planpreparacion
                       FROM mod_planifinversiones.dat_inversion dim
                       inner join mod_planifinversiones.dat_presanteproy p on (dim.idinversion = p.idinversion)
                       inner join mod_datosmaestros.dat_monedaentidad me on (me.idmonedaentidad = p.idmonedaentidad)
                       where dim.idinversion = r.idinversion
                        and me.idmoneda = r.idmoneda and dim.idejercicio = $idejercicio)

                        else

                         (SELECT sum (coalesce( p.valor,0)) as planpreparacion
                       FROM mod_planifinversiones.dat_inversion dim
                       inner join mod_planifinversiones.dat_presanteproy p on (dim.idinversion = p.idinversion)
                       inner join mod_datosmaestros.dat_monedaentidad me on (me.idmonedaentidad = p.idmonedaentidad)
                       where dim.idestructuracomun in
                       (select fi.idfila from  mod_estructuracomp.nom_filaestruc fi where fi.lft BETWEEN
                        (select fila.lft from  mod_estructuracomp.nom_filaestruc fila where fila.idfila = r.idestructuracomun)
                           and (select fila.rgt from  mod_estructuracomp.nom_filaestruc fila where fila.idfila = r.idestructuracomun)
                       )and dim.idestructuracomun in ($entidades)
                        and me.idmoneda = r.idmoneda and dim.idejercicio = $idejercicio) end,0) as planpreparacion



                   from (
                   SELECT
                          (select fi.idfila from  mod_estructuracomp.nom_filaestruc fi where fi.lft =
                            (select min(fis.lft)from  mod_estructuracomp.nom_filaestruc fis where (select fila.lft from  mod_estructuracomp.nom_filaestruc fila where fila.idfila = di.idestructuracomun) BETWEEN fis.lft and fis.rgt)) as idestructuracomun,

                           case when 1 = $totalOrganismo then di.idinversion else 1 end as idinversion,
                           case when 1 = $totalOrganismo then di.codigo else '' end as codigo,
                           case when 1 = $totalOrganismo then di.denominacion else '' end as inversion,
                           ei.idetapa,
                           ne.denominacion ,
                            ne.idnombreetapa,
                            est.denominacion as organismo,
                           m.codigoiso,
                           m.idmoneda,
                           eq.valor
                       FROM
                       mod_planifinversiones.dat_inversion di
                       inner join mod_planifinversiones.dat_etapainversion ei  on (di.idinversion = ei.idinversion)
                       inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                       inner join mod_estructuracomp.dat_estructura est ON(est.idestructura = di.idestructuracomun)
                       inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                       inner JOIN mod_planifinversiones.dat_inversetapaplan eq ON(ei.idetapainversion = eq.idetapainversion)
                       inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = eq.idmoneda)

                       WHERE di.idestructuracomun in ($entidades)
                           and eq.idejercicio = $idejercicio


                   )r
                   group by
                       r.idestructuracomun,
                       r.idinversion,
                       r.codigo,
                       r.inversion,
                       r.denominacion ,
                       r.codigoiso,
                       r.idmoneda,
                       r.idnombreetapa ,
                       r.organismo
                   order by  r.idestructuracomun, r.codigo, r.codigoiso, r.denominacion";
        //print_r('<pre>');print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarComponentes($params) {
        $conn = Doctrine_Manager::connection();
        $addwhere = "";
        foreach ($params['filtros'] as $p => $s) {
            if ($s != null) {
                if ($s['field'] == 'denominacion') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "upper(ne.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                } elseif ($s['field'] == 'estado') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "eiv.idestadoft = ", $s['data']['value']
                    );
                } elseif ($s['field'] == 'orden') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "et.orden " . $params['filtros']['orden_condicion'], $s['data']['value']
                    );
                }
            }
        }


        if ($params['idetapa']) {
            $ADDWHERE1 = " AND et.idetapa in (" . $params['idetapa'] . ")";
        } else {
            $ADDWHERE1 = "";
        }

        $sql = "select eiv.idetapainversion idetapa, eiv.idetapa idcomponente,ne.denominacion,
		estado.denominacion estado, estado.idestadosft,et.orden,
		mod_planifinversiones.dat_flujotrabajo.idflujotrabajo,
		eiv.idestadoft idestadoflujotrabajo
                FROM mod_planifinversiones.dat_etapainversion eiv
                INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                LEFT JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                LEFT JOIN mod_planifinversiones.nom_estadosft estado ON (estado.idestadosft = eiv.idestadoft)
                INNER JOIN mod_planifinversiones.dat_flujotrabajo ON (mod_planifinversiones.dat_flujotrabajo.idflujotrabajo = et.idflujotrabajo)
                INNER JOIN mod_planifinversiones.conf_formatoetapa fe ON (et.idformatoetapa = fe.idformatoetapa)
                INNER JOIN mod_planifinversiones.nom_tipoinversion ON (fe.idformatoetapa = mod_planifinversiones.nom_tipoinversion.idformatoetapa)
                INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.nom_tipoinversion.idtipoinversion = mod_planifinversiones.dat_inversion.idtipoinversion)
                WHERE
                mod_planifinversiones.dat_inversion.idestructuracomun = "
                . $params['identidad'] . "
                AND mod_planifinversiones.dat_inversion.idinversion = "
                . $params['idinversion'] . "
                and eiv.idinversion = " . $params['idinversion'] . "
                $addwhere
                $ADDWHERE1
                Group by
                estado,
                eiv.idetapainversion,
                estado.idestadosft,
                et.orden,
                eiv.idetapa,
                eiv.idestadoft,
                ne.denominacion,
                idestadoflujotrabajo,
                mod_planifinversiones.dat_flujotrabajo.idflujotrabajo
                order by et.orden";
//pre_r($sql);die;

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarVerPre($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "select
                    r.idmonedaentidad, SUM(r.valor) as valor, r.denominacion
                    ,r.codigoiso from
                    (
                    SELECT m.idmonedaentidad, m.valor,ne.denominacion,mo.codigoiso
                    FROM mod_planifinversiones.dat_elementovalor m
                    inner join mod_planifinversiones.dat_etapaelementoinversion eei on(eei.idetapaelementoinversion = m.idelemento)
                    inner join mod_planifinversiones.dat_etapainversion ei on (ei.idetapainversion = eei.idetapainversion)
                    inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                    inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                    inner join mod_datosmaestros.dat_monedaentidad me on (me.idmonedaentidad = m.idmonedaentidad)
                    inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                    WHERE ei.idinversion = " . $params['idinversion'] . "

                    union

                    SELECT me.idmonedaentidad ,sum(eq.importe) as importe,ne.denominacion ,m.codigoiso
                    FROM  mod_planifinversiones.dat_etapainversion ei
                    inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                    inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                    left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion)
                    inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = eq.identidadmodelo)
                    inner join mod_datosmaestros.dat_monedaentidad me on (me.idestructuracomun = em.identidad)
                    inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = me.idmoneda)
                    WHERE
                     ei.idinversion = " . $params['idinversion'] . "
                       and m.codigoiso = 'CUP'
                    group by me.idmonedaentidad,ne.denominacion,m.codigoiso
                    union
                    SELECT  me.idmonedaentidad ,sum(eq.importedivisa) as importe,ne.denominacion ,m.codigoiso
                    FROM  mod_planifinversiones.dat_etapainversion ei
                    inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                    inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                    left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion)
                    inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = eq.identidadmodelo)
                    inner join mod_datosmaestros.dat_monedaentidad me on (me.idestructuracomun = em.identidad)
                    inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = me.idmoneda)
                    WHERE
                     ei.idinversion = " . $params['idinversion'] . "
                       and m.codigoiso = 'USD'
                    group by me.idmonedaentidad,ne.denominacion,m.codigoiso

                    )r

                    group by r.idmonedaentidad, r.denominacion,r.codigoiso
                    ORDER BY r.denominacion,r.codigoiso";
//print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarTotal($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "select


                 eval.idmonedaentidad,SUM(eval.valor)

                FROM mod_planifinversiones.dat_etapainversion eiv
               -- INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
               -- INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
               -- INNER JOIN moxd_planifinversiones.nom_estadosft estado ON (estado.idestadosft = eiv.idestadoft)
               -- INNER JOIN mod_planifinversiones.dat_elemento el ON (et.idetapa=el.idetapa)
                INNER JOIN mod_planifinversiones.dat_etapaelementoinversion etel ON(etel.idetapainversion = eiv.idetapainversion)
                INNER JOIN mod_planifinversiones.dat_elementovalor eval ON(etel.idetapaelementoinversion = eval.idelemento)
                WHERE  eiv.idinversion = " . $params['idinversion'] . " AND eval.valor!=0
                GROUP BY eval.idmonedaentidad";


        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    //*** Devuelve el id del ejercicio pasandole la denominacion por parametro ***
    public function idejercicioPorDenominacion($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT e.idejercicio
            FROM mod_planificacion.nom_ejercicioplanificacion e
            WHERE e.ejercicio = '" . $params . "'";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_COLUMN);
        return $datos[0];
    }

    //*** Devuelve el id del ejercicio pasandole la denominacion por parametro ***
    public function ejercicioPorId($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT e.ejercicio
            FROM mod_planificacion.nom_ejercicioplanificacion e
            WHERE e.idejercicio = $params ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_COLUMN);
        return $datos[0];
    }

    public function estadoEjercicioPorEjercicio($params) {
        $ejerc = "'" . $params . "'";
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT d.denominacion
            FROM mod_planificacion.nom_ejercicioplanificacion e
            inner join mod_planificacion.nom_datosnomenclador d on(e.idestado= d.iddatosnomenclador)
            WHERE e.idejercicio = $ejerc ";
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_COLUMN);
        return $datos[0];
    }

    public function idejercicioPorId($params) {
        $ejerc = ".'{$params}'.";

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT e.ejercicio
            FROM mod_planificacion.nom_ejercicioplanificacion e
            WHERE e.idejercicio =  ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_COLUMN);
        return $datos[0];
    }

    //***otros inicadores***a
    public function listarOtrosindicadores($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT doi.iddatotrosindicadares, doi.idejercicio, doi.ejecutado, doi.estimado, doi.plan, doi.proyeccion,
                noi.idnomotrosindicadores, noi.denominacion otrosindicadores
                FROM mod_planifinversiones.dat_otrosindicadares doi
                INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON (doi.idnomotrosindicadores = noi.idnomotrosindicadores )
                WHERE doi.idinversion = " . $params['idinversion'] . "
                GROUP BY doi.iddatotrosindicadares, doi.idejercicio, doi.ejecutado, doi.estimado, doi.plan, doi.proyeccion,
                noi.idnomotrosindicadores, otrosindicadores
                ORDER BY  noi.idnomotrosindicadores
                OFFSET " . $params['start'] . "
                LIMIT " . $params['limit']; //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function planPrep($params, $id) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
		mod_planifinversiones.dat_presanteproy.valor as valor,
		mod_planifinversiones.dat_presanteproy.idpresanteproy
		FROM
		  mod_planifinversiones.dat_presanteproy
		  INNER JOIN mod_planifinversiones.dat_inversion ON
                  (mod_planifinversiones.dat_inversion.idinversion = mod_planifinversiones.dat_presanteproy.idinversion)
		  WHERE mod_planifinversiones.dat_inversion.idejercicio = "
                . $params['idejercicio'] . "
                      AND mod_planifinversiones.dat_inversion.idestructuracomun = "
                . $params['identidad'] . "
		  and mod_planifinversiones.dat_inversion.idinversion = "
                . $params['idinversion'] . " and
                      mod_planifinversiones.dat_presanteproy.idmonedaentidad = "
                . $id . "
                Group by
		mod_planifinversiones.dat_presanteproy.idpresanteproy,
		valor";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function totalInversiones($params, $id) {
        $conn = Doctrine_Manager::connection();
        $sql = "select coalesce (SUM(eval.valor),0) + coalesce ((select SUM(eqv.importe)
               FROM mod_planifinversiones.dat_etapainversion eivv
               INNER JOIN mod_planifinversiones.dat_etapaequipos eqv on (eqv.idetapainversion = eivv.idetapainversion)
               WHERE eivv.idetapainversion = eiv.idetapainversion),0) as sum
               ,eiv.idetapainversion
               FROM mod_planifinversiones.dat_etapainversion eiv
               INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
               INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
               INNER JOIN mod_planifinversiones.dat_etapaelementoinversion etel ON(etel.idetapainversion = eiv.idetapainversion)
               left JOIN mod_planifinversiones.dat_elementovalor eval ON(etel.idetapaelementoinversion = eval.idelemento and eval.idmonedaentidad =" . $id . ")
               WHERE  eiv.idinversion =" . $params['idinversion']
                . "
              GROUP BY eiv.idetapainversion";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarIndicadorCuota($params, $ind, $ejercicio, $iddatos) {//debe devolver un solo indicador cuota
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT doi.iddatotrosindicadares, doi.idejercicio, doi.ejecutado, doi.estimado, doi.plan, doi.proyeccion,
                    noi.idnomotrosindicadores, noi.denominacion otrosindicadores
                    FROM mod_planifinversiones.dat_otrosindicadares doi
                    INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON (doi.idnomotrosindicadores = noi.idnomotrosindicadores )
                    WHERE doi.idinversion = " . $params['idinversion'] . " and noi.idnomotrosindicadores = $ind and doi.idejercicio = $ejercicio
                    GROUP BY doi.iddatotrosindicadares, doi.idejercicio, doi.ejecutado, doi.estimado, doi.plan, doi.proyeccion,
                    noi.idnomotrosindicadores, otrosindicadores
                    ORDER BY  noi.idnomotrosindicadores
                    OFFSET " . $params['start'] . "
                    LIMIT " . $params['limit'];
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarIndicadorOtros($ind, $ejercicio, $nomejercicio, $entid, $whereInversion) {//debe devolver un solo indicador cuota
        $conn = Doctrine_Manager::connection();
        $entidad = implode(',', $entid);
        $sql = "SELECT sum( doi.plan)
                    FROM mod_planifinversiones.dat_otrosindicadares doi
                    INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON (doi.idnomotrosindicadores = noi.idnomotrosindicadores )
                     INNER JOIN mod_planifinversiones.dat_inversion i ON (doi.idinversion = i.idinversion)

                    WHERE i.eliminada = 0 AND i.idestadoinversion = 1 AND noi.idnomotrosindicadores = $ind and doi.idejercicio = $ejercicio
                        and
                        ($nomejercicio >= (date_part('year',  i.fechainicio))::numeric  and  $nomejercicio <= (date_part('year',  i.fechafin))::numeric )
                      AND i.idestructuracomun IN ({$entidad})
                      $whereInversion
                      ";
        // print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    //*** Otros indicadores annos post cant
    public function listarOtrosindAnnosPCant($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT noi.idnomotrosindicadores, ap.idotrosindicadoresannospostcant, ap.valor annospos, ap.cantidad
                FROM mod_planifinversiones.dat_otrosindicadoresannospostcant ap
                INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON (ap.idnomotrosindicadores = noi.idnomotrosindicadores )
                WHERE ap.idinversion = " . $params['idinversion'] . "
                GROUP BY noi.idnomotrosindicadores, ap.idotrosindicadoresannospostcant, annospos, ap.cantidad
                ORDER BY noi.idnomotrosindicadores
                OFFSET " . $params['start'] . "
                LIMIT " . $params['limit'];
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    //***Listar nomenclador de otros inicadores***
    public function listarNomOtrosind($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT no.idnomotrosindicadores id, no.denominacion ,no.descripcion
        FROM mod_planifinversiones.nom_otrosindicadores no
        order by no.orden";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    //***Listar nomenclador de otros inicadores***
    public function listarIndPorInv($params, $parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT no.plan
        FROM mod_planifinversiones.dat_otrosindicadares no
         WHERE  no.idinversion = " . $params['idinversion']
                . " and   no.idnomotrosindicadores = " . $params['idindicador'] . "
             and   no.idejercicio = " . $parametros['idejercicio'] . "
        order by no.plan";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    //***Dado un array de inversiones  otrosindicadores***
    public function listarValorPlan($params) {
        $entidades = implode(',', $identidad);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT no.plan
        FROM mod_planifinversiones.dat_otrosindicadares no
         WHERE  no.idinversion in (" . $entidades
                . ") and   no.iddatotrosindicadares = " . $params['idindicador'] . "
        order by no.plan";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    //***Capacidades a poner en explotacion****
    public function listarInvCapExplotacion($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  dn.denominacion nivelact, ice.idinverscapexplot, ice.idejercicio, ice.idinversion,
                ce.iddatcapexplotacion, ice.ejecutado, ice.estimado, ice.plan, ice.proyeccion, dn.descripcion um
                FROM mod_planifinversiones.dat_inverscapexplot ice
                INNER JOIN mod_planifinversiones.dat_capexplotacion ce ON(ce.iddatcapexplotacion = ice.iddatcapexplotacion)
                INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(ce.iddatosnomenclador = dn.iddatosnomenclador)
                WHERE  ice.idinversion = " . $params['idinversion'] . "
                GROUP BY nivelact, ice.idinverscapexplot, ice.idejercicio, ice.idinversion, um,
                ce.iddatcapexplotacion, ice.ejecutado, ice.estimado, ice.plan, ice.proyeccion
                ORDER BY ice.idinverscapexplot
                OFFSET " . $params['start'] . "
                LIMIT " . $params['limit'];

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    //***Capacidades a poner en explotacion ANNOS POSTERIORES - CANT****
    public function listarCapExplotAnnosPCant($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT ap.idinversion, ce.iddatcapexplotacion, ap.valor annospos, ap.cantidad, ap.idcapexplotannospostcant,
                dn.descripcion um, dn.denominacion nivelact
                FROM mod_planifinversiones.dat_capexplotannospostcant ap
                INNER JOIN mod_planifinversiones.dat_capexplotacion ce ON (ap.iddatcapexplotacion = ce.iddatcapexplotacion)
                INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(ce.iddatosnomenclador = dn.iddatosnomenclador)
                WHERE  ap.idinversion = " . $params['idinversion'] . "
                GROUP BY ap.idinversion, ce.iddatcapexplotacion, annospos, ap.cantidad, ap.idcapexplotannospostcant, um, nivelact
                ORDER BY ap.idcapexplotannospostcant
                OFFSET " . $params['start'] . "
                LIMIT " . $params['limit'];
        $datosListar = $conn->execute($sql);
        //pre_r($sql);die;
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarElementos($params) {
        $conn = Doctrine_Manager::connection();
        $addwhere = "";
        foreach ($params['filtros'] as $p => $s) {
            if ($s != null) {
                if ($s['field'] == 'denominacion') {
                    self::addWhereConParams(
                            $addwhere, $params_query, "upper(e.denominacion)  LIKE", ("'%" . strtoupper($s['data']['value']) . "%'")
                    );
                } elseif ($s['field'] == 'documento' && $s['data']['value'] == 'NO'
                ) {
                    self::addWhereConParams(
                            $addwhere, $params_query, "e.documento = ", 0
                    );
                } elseif ($s['field'] == 'documento' && $s['data']['value'] == 'SI'
                ) {
                    self::addWhereConParams(
                            $addwhere, $params_query, "e.documento = ", 1
                    );
                } elseif ($s['field'] == 'parametrosdinamicos' && $s['data']['value'] == 'SI'
                ) {
                    self::addWhereConParams(
                            $addwhere, $params_query, "e.parametrosdinamicos = ", 1
                    );
                } elseif ($s['field'] == 'parametrosdinamicos' && $s['data']['value'] == 'NO'
                ) {
                    self::addWhereConParams(
                            $addwhere, $params_query, "e.parametrosdinamicos = ", 0
                    );
                }
            }
        }
        $sql = "select distinct ON(e.idelemento)e.idelemento,eei.idetapaelementoinversion,
                   e.denominacion,
                   e.documento ,
                   e.parametrosdinamicos,
                   etv.idelementotipomodelo,
                   etv.idelementotipomodelovalor,
                   ed.iddocumentos,
                   edg.idcontenido
                   from mod_planifinversiones.dat_etapainversion ei
                   INNER join mod_planifinversiones.dat_etapaelementoinversion eei on (eei.idetapainversion = ei.idetapainversion)
                   LEFT JOIN mod_planifinversiones.dat_elementotipomodelovalor etv  on (etv.idelemento = eei.idetapaelementoinversion)
                   INNER join mod_planifinversiones.dat_elemento e on (e.idelemento = eei.idelemento)
                   left join mod_planifinversiones.dat_elementodoc ed on(e.idelemento = ed.idelemento)
                   left join mod_planifinversiones.dat_elementodocgestordoc edg on (eei.idetapaelementoinversion = edg.idetapaelementoinversion)
                   where
                   ei.idetapainversion = " . $params['idcomponente'] .
                "$addwhere
                    ";
//pre_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos->data = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getPreInv($params) {
        $ADDWHERE = "";
        $condiciones = array();
        $p = $params['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'moneda') {
                $condiciones[] = (" mod_planifinversiones.dat_presanteproy.idmonedaentidad  ="
                        . ($datos['data']['value']));
            } else {
                if ($datos['field'] == 'valor') { {
                        $cond = "=";
                        if ($datos['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        $condiciones[] = "mod_planifinversiones.dat_presanteproy.{$datos['field']} {$cond} "
                                . ($datos['data']['value']);
                    }
                }
            }
        }
        $ADDWHERE = ' ';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }
        $conn = Doctrine_Manager::connection();

        $sql = "SELECT
		mod_planifinversiones.dat_presanteproy.idmonedaentidad as idmonedaentidad,
		mod_planifinversiones.dat_inversion.idinversion	,
		mod_planifinversiones.dat_presanteproy.valor as valor,
		mod_planifinversiones.dat_presanteproy.idpresanteproy
		FROM
		  mod_planifinversiones.dat_presanteproy
		  INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.dat_inversion.idinversion = mod_planifinversiones.dat_presanteproy.idinversion)
		  WHERE mod_planifinversiones.dat_inversion.idestructuracomun = "
                . $params['identidad'] . "
		  and mod_planifinversiones.dat_inversion.idinversion = "
                . $params['idinversion'] . "
                $ADDWHERE
		Group by
		idmonedaentidad,
		mod_planifinversiones.dat_inversion.idinversion,
		mod_planifinversiones.dat_presanteproy.idpresanteproy,
		valor";

        $datosListar = $conn->execute($sql);
        $datosL = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        return $datosL;
    }

    public function listarCapExplotacion($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT ce.iddatcapexplotacion, dn.descripcion um, dn.denominacion
                FROM mod_planifinversiones.dat_capexplotacion ce
                INNER JOIN mod_planificacion.nom_datosnomenclador dn ON(ce.iddatosnomenclador = dn.iddatosnomenclador)
                GROUP BY
                ce.iddatcapexplotacion, um, dn.denominacion
                order by ce.iddatcapexplotacion
                OFFSET " . $params['start'] . "
                LIMIT " . $params['limit'];
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ListarLiquidos($params) {

        $conn = Doctrine_Manager::connection();

        $sql = "SELECT
		mod_planifinversiones.dat_erogacionliquido.idmonedaentidad as idmonedaentidad,
		mod_planifinversiones.dat_inversion.idinversion	,
		mod_planifinversiones.dat_erogacionliquido.valor as valor,
		mod_planifinversiones.dat_erogacionliquido.iderogacionliquido
		FROM
		  mod_planifinversiones.dat_erogacionliquido
		  INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.dat_inversion.idinversion = mod_planifinversiones.dat_erogacionliquido.idinversion)
		  WHERE mod_planifinversiones.dat_inversion.idestructuracomun = "
                . $params['identidad'] . "
		  and mod_planifinversiones.dat_inversion.idinversion = "
                . $params['idinversion'] . "

		Group by
		idmonedaentidad,
		mod_planifinversiones.dat_inversion.idinversion,
		mod_planifinversiones.dat_erogacionliquido.iderogacionliquido,
		valor";

        $datosListar = $conn->execute($sql);
        $datosL = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datosL;
    }

    public function listarClasificacion() {
        $conn = Doctrine_Manager::connection();
        $sql = "select
					mod_planifinversiones.nom_tipoinversion.idtipoinversion,
					mod_planifinversiones.nom_tipoinversion.denominacion
					FROM mod_planifinversiones.nom_tipoinversion

					Group by
					mod_planifinversiones.nom_tipoinversion.idtipoinversion,
					mod_planifinversiones.nom_tipoinversion.denominacion ";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function buscarInv() {
        $conn = Doctrine_Manager::connection();
        $sql = "select
					mod_planifinversiones.dat_inversion.idcumplimientoinversion,
					FROM mod_planifinversiones.dat_inversion
					WHERE  mod_planifinversiones.dat_inversion.idinversion = "
                . $params['idinversion'] . "
					Group by
					mod_planifinversiones.nom_tipoinversion.idcumplimientoinversion ";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarF($params) {
        $ADDWHERE = "";
        $condiciones = array();
        $p = $params['filtros'];
        foreach ($p as $key => $datos) {
            if ($datos['field'] == 'moneda') {
                $condiciones[] = (" mod_planifinversiones.dat_financiamiento.idmonedaentidad  ="
                        . ($datos['data']['value']));
            } else {
                if ($datos['field'] == 'valor') { {
                        $cond = "=";
                        if ($datos['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        $condiciones[] = "mod_planifinversiones.dat_financiamiento.{$datos['field']} {$cond} "
                                . ($datos['data']['value']);
                    }
                } else {
                    if ($datos['field'] == 'financi') {
                        $condiciones[] = (" mod_planifinversiones.dat_financiamiento.idfinancista  ="
                                . ($datos['data']['value']));
                    } else {
                        if ($datos['field'] == 'tipo') {
                            $condiciones[] = (" mod_planifinversiones.dat_financiamiento.idtipofinanciamiento  ="
                                    . ($datos['data']['value']));
                        }
                    }
                }
            }
        }
        $ADDWHERE = ' ';
        foreach ($condiciones as $condicion) {
            $ADDWHERE = $ADDWHERE . ' AND ' . $condicion;
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
					mod_planifinversiones.dat_financiamiento.idmonedaentidad as idmonedaentidad,
					mod_planifinversiones.dat_financiamiento.valor as valor,
					mod_planifinversiones.dat_financiamiento.idfinanciamiento,
					nom.denominacion financi,
					mod_planifinversiones.dat_tipofinanciamiento.idtipofinanciamiento,
					nomtipo.denominacion tipo,
					mod_planifinversiones.dat_financista.idfinancista,
                                        mod_planifinversiones.dat_financiamiento.porcientointeres,
                                        mod_planifinversiones.dat_financiamiento.plazoamortizacion,
                                        mod_planifinversiones.dat_financiamiento.gracia
					FROM
					mod_planifinversiones.dat_financiamiento
					INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.dat_inversion.idinversion = mod_planifinversiones.dat_financiamiento.idinversion)
					INNER JOIN mod_planifinversiones.dat_financista  ON mod_planifinversiones.dat_financiamiento.idfinancista =  mod_planifinversiones.dat_financista.idfinancista
					INNER JOIN mod_planificacion.nom_datosnomenclador nom
					ON nom.iddatosnomenclador =
					mod_planifinversiones.dat_financista.iddatosnomenclador
					INNER JOIN mod_planifinversiones.dat_tipofinanciamiento  ON mod_planifinversiones.dat_tipofinanciamiento.idtipofinanciamiento= mod_planifinversiones.dat_financiamiento.idtipofinanciamiento
					INNER JOIN mod_planificacion.nom_datosnomenclador nomtipo
					ON nomtipo.iddatosnomenclador =
					mod_planifinversiones.dat_tipofinanciamiento.iddatosnomenclador
					WHERE mod_planifinversiones.dat_inversion.idestructuracomun = "
                . $params['identidad'] . "
					and mod_planifinversiones.dat_inversion.idinversion = "
                . $params['idinversion'] . "
                                        $ADDWHERE
					Group by
					idmonedaentidad,
					mod_planifinversiones.dat_tipofinanciamiento.idtipofinanciamiento,
					mod_planifinversiones.dat_financista.idfinancista,
					mod_planifinversiones.dat_financiamiento.idfinanciamiento,
                                         mod_planifinversiones.dat_financiamiento.porcientointeres,
                                        mod_planifinversiones.dat_financiamiento.plazoamortizacion,
					valor,
					financi,
					tipo ";

//pre_r($sql);die;

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    // super metodos del Bernal Star
    public function listarFinanciamientoParaInversion($params) {
        $ADDWHERE = "";
        // $params['idinversion']=513;
        $conn = Doctrine_Manager::connection();

        $sql = "
      SELECT  s.*, coalesce((s.sumapresp_mp - (s.ejecutado_mp2 + s.plan_mp3 + s.proyec_mp4)),0) as annospost_mp,
                   coalesce((s.sumapresp_usd - (s.ejecutado_usd2 + s.plan_usd3 + s.proyec_usd4)),0) as annospost_usd,
                   

              FROM
              (SELECT distinct( nomtipo.denominacion) as tipofinanciamiento, --distinct(tp.idtipofinanciamiento),
                     nomtipo.iddatosnomenclador,

                    (select t.idejercicio from mod_planifinversiones.dat_tipofinanciamiento t
                    where t.iddatosnomenclador = tp.iddatosnomenclador and t.idejercicio = " . $params['aaejercicio'] . " )as tiene1,

                    (select t.idejercicio from mod_planifinversiones.dat_tipofinanciamiento t
                    where t.iddatosnomenclador = tp.iddatosnomenclador and t.idejercicio = " . $params['aejercicio'] . " )as tiene2,

                    (select t.idejercicio from mod_planifinversiones.dat_tipofinanciamiento t
                    where t.iddatosnomenclador = tp.iddatosnomenclador and t.idejercicio = " . $params['idejercicio'] . " )as tiene3,

                    (select t.idejercicio from mod_planifinversiones.dat_tipofinanciamiento t
                    where t.iddatosnomenclador = tp.iddatosnomenclador and t.idejercicio = " . $params['pejercicio'] . " )as tiene4,
       
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idtipofinanciamiento = tp.idtipofinanciamiento and fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000046 and fin.idcolumnaejercicio = ".$params['aaidcolumnaejercicio']."),0) as ejecutado_usd1,
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancejecutado fin
         inner join   mod_planifinversiones.dat_tipofinanciamiento tip on (tip.idtipofinanciamiento = fin.idtipofinanciamiento)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where --fin.idtipofinanciamiento = tp.idtipofinanciamiento 
         tip.iddatosnomenclador = tp.iddatosnomenclador
         and fin.idinversion = ". $params['idinversion'] . "
        and fin.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000103 and fin.idcolumnaejercicio = ".$params['aaidcolumnaejercicio']."),0) as ejecutado_mp1 ,
    coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancejecutado fin
         inner join   mod_planifinversiones.dat_tipofinanciamiento tip on (tip.idtipofinanciamiento = fin.idtipofinanciamiento)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where --fin.idtipofinanciamiento = tp.idtipofinanciamiento 
         tip.iddatosnomenclador = tp.iddatosnomenclador
         and fin.idinversion = ". $params['idinversion'] . "
        and fin.idejercicio = " . $params['aejercicio'] . " and nomoneda.idmoneda = 9900000046 and fin.idcolumnaejercicio = ".$params['aaidcolumnaejercicio']."),0) as ejecutado_usd2,
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancejecutado fin
         inner join   mod_planifinversiones.dat_tipofinanciamiento tip on (tip.idtipofinanciamiento = fin.idtipofinanciamiento)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where --fin.idtipofinanciamiento = tp.idtipofinanciamiento 
         tip.iddatosnomenclador = tp.iddatosnomenclador
         and fin.idinversion = ". $params['idinversion'] . "
        and fin.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000103 and fin.idcolumnaejercicio = ".$params['aaidcolumnaejercicio']."),0) as ejecutado_mp2 ,
            coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancejecutado fin
         inner join   mod_planifinversiones.dat_tipofinanciamiento tip on (tip.idtipofinanciamiento = fin.idtipofinanciamiento)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where --fin.idtipofinanciamiento = tp.idtipofinanciamiento 
         tip.iddatosnomenclador = tp.iddatosnomenclador
         and fin.idinversion = ". $params['idinversion'] . "
        and fin.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046 and fin.idcolumnaejercicio = ".$params['aaidcolumnaejercicio']."),0) as ejecutado_usd3,
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancejecutado fin
         inner join   mod_planifinversiones.dat_tipofinanciamiento tip on (tip.idtipofinanciamiento = fin.idtipofinanciamiento)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where --fin.idtipofinanciamiento = tp.idtipofinanciamiento 
         tip.iddatosnomenclador = tp.iddatosnomenclador
         and fin.idinversion = ". $params['idinversion'] . "
        and fin.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103 and fin.idcolumnaejercicio = ".$params['aaidcolumnaejercicio']."),0) as ejecutado_mp3 ,
            coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancejecutado fin
         inner join   mod_planifinversiones.dat_tipofinanciamiento tip on (tip.idtipofinanciamiento = fin.idtipofinanciamiento)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where --fin.idtipofinanciamiento = tp.idtipofinanciamiento 
         tip.iddatosnomenclador = tp.iddatosnomenclador
         and fin.idinversion = ". $params['idinversion'] . "
        and fin.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000046 and fin.idcolumnaejercicio = ".$params['aaidcolumnaejercicio']."),0) as ejecutado_usd4,
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancejecutado fin
         inner join   mod_planifinversiones.dat_tipofinanciamiento tip on (tip.idtipofinanciamiento = fin.idtipofinanciamiento)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where --fin.idtipofinanciamiento = tp.idtipofinanciamiento 
         tip.iddatosnomenclador = tp.iddatosnomenclador
         and fin.idinversion = ". $params['idinversion'] . "
        and fin.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000103 and fin.idcolumnaejercicio = ".$params['aaidcolumnaejercicio']."),0) as ejecutado_mp4 ,

        --------------------------------------------------
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idtipofinanciamiento = tp.idtipofinanciamiento and finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as estimado_usd1,
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idtipofinanciamiento = tp.idtipofinanciamiento and finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as estimado_mp1 ,
    coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idtipofinanciamiento = tp.idtipofinanciamiento and finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as estimado_usd2,
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idtipofinanciamiento = tp.idtipofinanciamiento and finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as estimado_mp2 ,
            coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idtipofinanciamiento = tp.idtipofinanciamiento and finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as estimado_usd3,
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idtipofinanciamiento = tp.idtipofinanciamiento and finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as estimado_mp3 ,
            coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idtipofinanciamiento = tp.idtipofinanciamiento and finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as estimado_usd4,
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idtipofinanciamiento = tp.idtipofinanciamiento and finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as estimado_mp4 ,
        --------------------------------------------------
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idtipofinanciamiento = tp.idtipofinanciamiento and finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as plan_usd1,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idtipofinanciamiento = tp.idtipofinanciamiento and finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as plan_mp1 ,
    coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idtipofinanciamiento = tp.idtipofinanciamiento and finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as plan_usd2,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idtipofinanciamiento = tp.idtipofinanciamiento and finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as plan_mp2 ,
            coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idtipofinanciamiento = tp.idtipofinanciamiento and finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as plan_usd3,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idtipofinanciamiento = tp.idtipofinanciamiento and finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as plan_mp3 ,
            coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idtipofinanciamiento = tp.idtipofinanciamiento and finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as plan_usd4,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idtipofinanciamiento = tp.idtipofinanciamiento and finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as plan_mp4 ,

        --------------------------------------------------
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idtipofinanciamiento = tp.idtipofinanciamiento and finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as proyec_usd1,
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idtipofinanciamiento = tp.idtipofinanciamiento and finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as proyec_mp1 ,
    coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idtipofinanciamiento = tp.idtipofinanciamiento and finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as proyec_usd2,
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idtipofinanciamiento = tp.idtipofinanciamiento and finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as proyec_mp2 ,
            coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idtipofinanciamiento = tp.idtipofinanciamiento and finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as proyec_usd3,
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idtipofinanciamiento = tp.idtipofinanciamiento and finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as proyec_mp3 ,
            coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idtipofinanciamiento = tp.idtipofinanciamiento and finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as proyec_usd4,
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idtipofinanciamiento = tp.idtipofinanciamiento and finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as proyec_mp4 ,

           coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
          and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres > 0
        and nomoneda.idmoneda = 9900000046),0) as sumapresp_usd ,

        coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
        and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres > 0
        and nomoneda.idmoneda = 9900000103),0) as sumapresp_mp ,

        coalesce ((select SUM(finan.porcientointeres)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
         and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres > 0),0) as porcientointeres ,

        coalesce ((select SUM(finan.plazoamortizacion)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
          and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres > 0),0) as plazoamortizacion ,

        coalesce ((select SUM(finan.gracia)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
         and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres > 0),0) as gracia ,

       coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
         and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres = 0
        and nomoneda.idmoneda = 9900000103),0) as presupmpcontado ,

        coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
          and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres = 0
        and nomoneda.idmoneda = 9900000046),0) as presupusdcontado ,

        (select distinct(finan.idmonedaentidad)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
          and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres > 0
        and nomoneda.idmoneda = 9900000103) as idmonedaentidad_mp ,

        (select distinct(finan.idmonedaentidad)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where tf.idtipofinanciamiento = tp.idtipofinanciamiento
        and inv.idinversion = " . $params['idinversion'] . " and finan.porcientointeres > 0
        and nomoneda.idmoneda = 9900000046) as idmonedaentidad_usd ,

                                        f.idmonedaentidad as idmonedaentidad,
                                        mod_planifinversiones.dat_inversion.idinversion as idinversion,
                                        sum(f.valor) as valor,
                                        /*nom.denominacion as quienfinac,*/
                                        tp.idtipofinanciamiento as idtipofinanciamiento,
                                        f.idtipofinanciamiento as f_idtipofinanciamiento,

                                        nomtipo.denominacion as comosefinanc /*,

                                        mod_planifinversiones.dat_financista.idfinancista as idfinancista,
                                        sum(f.porcientointeres) as porcientointeres,
                                        sum(f.plazoamortizacion) as plazoamortizacion,
                                        sum(f.gracia) as gracia*/

                                        FROM
                                        mod_planifinversiones.dat_tipofinanciamiento tp

                                        INNER JOIN mod_planifinversiones.dat_financiamiento f  ON tp.idtipofinanciamiento = f.idtipofinanciamiento

                                        INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.dat_inversion.idinversion = f.idinversion)

                                        INNER JOIN mod_planificacion.nom_datosnomenclador nomtipo ON nomtipo.iddatosnomenclador = tp.iddatosnomenclador

                                        WHERE
                                         mod_planifinversiones.dat_inversion.idestructuracomun = "
                . $params['identidad'] . "
                                        AND mod_planifinversiones.dat_inversion.idinversion = "
                . $params['idinversion'] . "
                                        AND f.porcientointeres > 0
                                        Group by
                                        tp.idtipofinanciamiento,idmonedaentidad,mod_planifinversiones.dat_inversion.idinversion,
                                        comosefinanc,/*quienfinac,*/f_idtipofinanciamiento) as s ";
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarFinancistas($params) {
        // $params['idinversion'] = 513;
        $ADDWHERE = "";
        $conn = Doctrine_Manager::connection();
        $sql = "
      SELECT  s.*, coalesce((s.sumapresp_mp - (s.ejecutado_mp2 + s.plan_mp3 + s.proyec_mp4)),0) as annospost_mp,
                   coalesce((s.sumapresp_usd - (s.ejecutado_usd2 + s.plan_usd3 + s.proyec_usd4)),0) as annospost_usd

              FROM
              (SELECT distinct(fict.idfinancista),

        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancistaejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idfinancista = fict.idfinancista and  fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as ejecutado_usd1,
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancistaejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idfinancista = fict.idfinancista and  fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as ejecutado_mp1 ,
    coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancistaejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idfinancista = fict.idfinancista and  fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['aejercicio'] . " and nomoneda.idmoneda = 9900000046),0) as ejecutado_usd2,
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancistaejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idfinancista = fict.idfinancista and  fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as ejecutado_mp2 ,
            coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancistaejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idfinancista = fict.idfinancista and  fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as ejecutado_usd3,
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancistaejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idfinancista = fict.idfinancista and  fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as ejecutado_mp3 ,
            coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancistaejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idfinancista = fict.idfinancista and  fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as ejecutado_usd4,
        coalesce ((select fin.valor from mod_planifinversiones.dat_inversfinancistaejecutado fin
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = fin.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where fin.idfinancista = fict.idfinancista and  fin.idinversion = "
                . $params['idinversion'] . "
        and fin.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as ejecutado_mp4 ,

        --------------------------------------------------
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancistaestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idfinancista = fict.idfinancista and  finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as estimado_usd1,
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancistaestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idfinancista = fict.idfinancista and  finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as estimado_mp1 ,
    coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancistaestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idfinancista = fict.idfinancista and  finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as estimado_usd2,
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancistaestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idfinancista = fict.idfinancista and  finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as estimado_mp2 ,
            coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancistaestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idfinancista = fict.idfinancista and  finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as estimado_usd3,
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancistaestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idfinancista = fict.idfinancista and  finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as estimado_mp3 ,
            coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancistaestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idfinancista = fict.idfinancista and  finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as estimado_usd4,
        coalesce ((select finanestim.valor from mod_planifinversiones.dat_inversfinancistaestimado finanestim
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanestim.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanestim.idfinancista = fict.idfinancista and  finanestim.idinversion = "
                . $params['idinversion'] . "
        and finanestim.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as estimado_mp4 ,
        --------------------------------------------------
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as plan_usd1,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as plan_mp1 ,
    coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as plan_usd2,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as plan_mp2 ,
            coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as plan_usd3,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as plan_mp3 ,
            coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as plan_usd4,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as plan_mp4 ,

        --------------------------------------------------
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancistaproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idfinancista = fict.idfinancista and  finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as proyec_usd1,
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancistaproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idfinancista = fict.idfinancista and  finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['aaejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as proyec_mp1 ,
    coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancistaproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idfinancista = fict.idfinancista and  finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as proyec_usd2,
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancistaproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idfinancista = fict.idfinancista and  finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['aejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as proyec_mp2 ,
            coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancistaproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idfinancista = fict.idfinancista and  finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as proyec_usd3,
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancistaproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idfinancista = fict.idfinancista and  finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as proyec_mp3 ,
            coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancistaproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idfinancista = fict.idfinancista and  finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as proyec_usd4,
        coalesce ((select finanproyec.valor from mod_planifinversiones.dat_inversfinancistaproyectado finanproyec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanproyec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanproyec.idfinancista = fict.idfinancista and  finanproyec.idinversion = "
                . $params['idinversion'] . "
        and finanproyec.idejercicio = " . $params['pejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as proyec_mp4 ,

          coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
         and inv.idinversion = " . $params['idinversion'] . " /*and finan.porcientointeres > 0*/
        and nomoneda.idmoneda = 9900000046),0) as sumapresp_usd ,

        coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
         and inv.idinversion = " . $params['idinversion'] . " /*and finan.porcientointeres > 0*/
        and nomoneda.idmoneda = 9900000103),0) as sumapresp_mp ,

        coalesce ((select SUM(finan.porcientointeres)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
          and inv.idinversion = " . $params['idinversion'] . "/* and finan.porcientointeres > 0*/),0) as porcientointeres ,

        coalesce ((select SUM(finan.plazoamortizacion)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
          and inv.idinversion = " . $params['idinversion'] . " /*and finan.porcientointeres > 0*/),0) as plazoamortizacion ,

        coalesce ((select SUM(finan.gracia)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
         and inv.idinversion = " . $params['idinversion'] . " /*and finan.porcientointeres > 0*/),0) as gracia ,

       coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
         and inv.idinversion = " . $params['idinversion'] . " /*and finan.porcientointeres = 0*/
        and nomoneda.idmoneda = 9900000103),0) as presupmpcontado ,

        coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
          and inv.idinversion = " . $params['idinversion'] . " /*and finan.porcientointeres = 0*/
        and nomoneda.idmoneda = 9900000046),0) as presupusdcontado ,

        (select distinct(finan.idmonedaentidad)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
         and inv.idinversion = " . $params['idinversion'] . " /*and finan.porcientointeres > 0*/
        and nomoneda.idmoneda = 9900000103) as idmonedaentidad_mp ,

        (select distinct(finan.idmonedaentidad)
         from mod_planifinversiones.dat_financista ft
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (ft.idfinancista = finan.idfinancista)
         INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where ft.idfinancista = fict.idfinancista
         and inv.idinversion = " . $params['idinversion'] . " /*and finan.porcientointeres > 0*/
        and nomoneda.idmoneda = 9900000046) as idmonedaentidad_usd ,

                                        i.idinversion as idinversion,
                                        nom.denominacion as quienfinac,
                                        fict.idfinancista as idfinancista

                                        FROM
                                        mod_planifinversiones.dat_financista fict

                                        INNER JOIN mod_planifinversiones.dat_financiamiento f  ON f.idfinancista =  fict.idfinancista

                                        INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = f.idinversion)

                                        INNER JOIN mod_planificacion.nom_datosnomenclador nom ON nom.iddatosnomenclador = fict.iddatosnomenclador

                                        WHERE i.idestructuracomun = "
                . $params['identidad'] . "
                                        AND i.idinversion = "
                . $params['idinversion'] . "
                                        /*AND f.porcientointeres > 0   */
                                        Group by
                                        fict.idfinancista,i.idinversion,
                                        quienfinac) as s ORDER BY quienfinac";
//pre_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function listarFinanciamientoContado($params) {
        $ADDWHERE = "";
        // $params['idinversion'] = 513;
        $conn = Doctrine_Manager::connection();
        $sql = "
    SELECT
        distinct(inv.idinversion),
        coalesce ((select SUM(icejec.valor) from mod_planifinversiones.dat_inverscontadoejecutado icejec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icejec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icejec.idinversion = inv.idinversion
        and icejec.idejercicio = " . $params['aaejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as ejecutado_mp1 ,

        coalesce ((select SUM(icejec.valor) from mod_planifinversiones.dat_inverscontadoejecutado icejec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icejec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icejec.idinversion = inv.idinversion
        and icejec.idejercicio = " . $params['aaejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as ejecutado_usd1 ,

        coalesce ((select SUM(icejec.valor) from mod_planifinversiones.dat_inverscontadoejecutado icejec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icejec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icejec.idinversion = inv.idinversion
        and icejec.idejercicio = " . $params['aejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as ejecutado_mp2 ,

        coalesce ((select SUM(icejec.valor) from mod_planifinversiones.dat_inverscontadoejecutado icejec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icejec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icejec.idinversion = inv.idinversion
        and icejec.idejercicio = " . $params['aejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as ejecutado_usd2 ,

        coalesce ((select SUM(icejec.valor) from mod_planifinversiones.dat_inverscontadoejecutado icejec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icejec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icejec.idinversion = inv.idinversion
        and icejec.idejercicio = " . $params['idejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as ejecutado_mp3 ,

        coalesce ((select SUM(icejec.valor) from mod_planifinversiones.dat_inverscontadoejecutado icejec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icejec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icejec.idinversion = inv.idinversion
        and icejec.idejercicio = " . $params['idejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as ejecutado_usd3 ,

        coalesce ((select SUM(icejec.valor) from mod_planifinversiones.dat_inverscontadoejecutado icejec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icejec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icejec.idinversion = inv.idinversion
        and icejec.idejercicio = " . $params['pejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as ejecutado_mp4 ,

        coalesce ((select SUM(icejec.valor) from mod_planifinversiones.dat_inverscontadoejecutado icejec
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icejec.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icejec.idinversion = inv.idinversion
        and icejec.idejercicio = " . $params['pejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as ejecutado_usd4 ,

        -----------------------------------------------

        coalesce ((select SUM(icest.valor) from mod_planifinversiones.dat_inverscontadoestimado icest
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icest.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icest.idinversion = inv.idinversion
        and icest.idejercicio = " . $params['aaejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as estimado_mp1 ,

        coalesce ((select SUM(icest.valor) from mod_planifinversiones.dat_inverscontadoestimado icest
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icest.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icest.idinversion = inv.idinversion
        and icest.idejercicio = " . $params['aaejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as estimado_usd1 ,

        coalesce ((select SUM(icest.valor) from mod_planifinversiones.dat_inverscontadoestimado icest
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icest.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icest.idinversion = inv.idinversion
        and icest.idejercicio = " . $params['aejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as estimado_mp2 ,

        coalesce ((select SUM(icest.valor) from mod_planifinversiones.dat_inverscontadoestimado icest
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icest.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icest.idinversion = inv.idinversion
        and icest.idejercicio = " . $params['aejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as estimado_usd2 ,

        coalesce ((select SUM(icest.valor) from mod_planifinversiones.dat_inverscontadoestimado icest
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icest.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icest.idinversion = inv.idinversion
        and icest.idejercicio = " . $params['idejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as estimado_mp3 ,

        coalesce ((select SUM(icest.valor) from mod_planifinversiones.dat_inverscontadoestimado icest
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icest.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icest.idinversion = inv.idinversion
        and icest.idejercicio = " . $params['idejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as estimado_usd3 ,

        coalesce ((select SUM(icest.valor) from mod_planifinversiones.dat_inverscontadoestimado icest
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icest.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icest.idinversion = inv.idinversion
        and icest.idejercicio = " . $params['pejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as estimado_mp4 ,

        coalesce ((select SUM(icest.valor) from mod_planifinversiones.dat_inverscontadoestimado icest
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icest.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icest.idinversion = inv.idinversion
        and icest.idejercicio = " . $params['pejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as estimado_usd4 ,

        -----------------------------------------------

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = inv.idinversion
        and icplan.idejercicio = " . $params['aaejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as plan_mp1 ,

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = inv.idinversion
        and icplan.idejercicio = " . $params['aaejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as plan_usd1 ,

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = inv.idinversion
        and icplan.idejercicio = " . $params['aejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as plan_mp2 ,

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = inv.idinversion
        and icplan.idejercicio = " . $params['aejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as plan_usd2 ,

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = inv.idinversion
        and icplan.idejercicio = " . $params['idejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as plan_mp3 ,

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = inv.idinversion
        and icplan.idejercicio = " . $params['idejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as plan_usd3 ,

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = inv.idinversion
        and icplan.idejercicio = " . $params['pejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as plan_mp4 ,

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = inv.idinversion
        and icplan.idejercicio = " . $params['pejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as plan_usd4 ,

        -----------------------------------------------

       coalesce ((select SUM(icproy.valor) from mod_planifinversiones.dat_inverscontadoproyectado icproy
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icproy.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icproy.idinversion = inv.idinversion
        and icproy.idejercicio = " . $params['aaejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as proyec_mp1 ,

        coalesce ((select SUM(icproy.valor) from mod_planifinversiones.dat_inverscontadoproyectado icproy
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icproy.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icproy.idinversion = inv.idinversion
        and icproy.idejercicio = " . $params['aaejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as proyec_usd1 ,

        coalesce ((select SUM(icproy.valor) from mod_planifinversiones.dat_inverscontadoproyectado icproy
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icproy.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icproy.idinversion = inv.idinversion
        and icproy.idejercicio = " . $params['aejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as proyec_mp2 ,

        coalesce ((select SUM(icproy.valor) from mod_planifinversiones.dat_inverscontadoproyectado icproy
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icproy.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icproy.idinversion = inv.idinversion
        and icproy.idejercicio = " . $params['aejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as proyec_usd2 ,

        coalesce ((select SUM(icproy.valor) from mod_planifinversiones.dat_inverscontadoproyectado icproy
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icproy.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icproy.idinversion = inv.idinversion
        and icproy.idejercicio = " . $params['idejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as proyec_mp3 ,

        coalesce ((select SUM(icproy.valor) from mod_planifinversiones.dat_inverscontadoproyectado icproy
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icproy.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icproy.idinversion = inv.idinversion
        and icproy.idejercicio = " . $params['idejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as proyec_usd3 ,

        coalesce ((select SUM(icproy.valor) from mod_planifinversiones.dat_inverscontadoproyectado icproy
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icproy.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icproy.idinversion = inv.idinversion
        and icproy.idejercicio = " . $params['pejercicio'] . "
        and nomo.idmoneda = 9900000103),0) as proyec_mp4 ,

        coalesce ((select SUM(icproy.valor) from mod_planifinversiones.dat_inverscontadoproyectado icproy
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icproy.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icproy.idinversion = inv.idinversion
        and icproy.idejercicio = " . $params['pejercicio'] . "
        and nomo.idmoneda = 9900000046),0) as proyec_usd4 ,

        ----------------------------------------------------------------

        (select distinct(finan.idmonedaentidad)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where i.idinversion = inv.idinversion
         and i.idinversion = " . $params['idinversion'] . " and finan.porcientointeres = 0
        and nomoneda.idmoneda = 9900000103   and me.idestructuracomun = "
                . $params['identidad'] . ") as idmonedaentidad_mp ,

        (select distinct(finan.idmonedaentidad)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where i.idinversion = inv.idinversion
        and i.idinversion = " . $params['idinversion'] . " and finan.porcientointeres = 0
        and nomoneda.idmoneda = 9900000046   and me.idestructuracomun = "
                . $params['identidad'] . ") as idmonedaentidad_usd ,

        coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where i.idinversion = i.idinversion
         and i.idinversion = " . $params['idinversion'] . " and finan.porcientointeres = 0
        and nomoneda.idmoneda = 9900000103),0) as sumapresp_mp ,

        coalesce ((select SUM(finan.valor)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where i.idinversion = inv.idinversion
          and i.idinversion = " . $params['idinversion'] . " and finan.porcientointeres = 0
        and nomoneda.idmoneda = 9900000046),0) as sumapresp_usd ,

        coalesce ((select SUM(finan.plazoamortizacion)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where i.idinversion = inv.idinversion
        and i.idinversion = " . $params['idinversion'] . " and finan.porcientointeres = 0),0) as plazoamortizacion ,

        coalesce ((select SUM(finan.gracia)
         from mod_planifinversiones.dat_tipofinanciamiento tf
         INNER JOIN  mod_planifinversiones.dat_financiamiento finan ON (tf.idtipofinanciamiento = finan.idtipofinanciamiento)
         INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = finan.idinversion)
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where i.idinversion = inv.idinversion
         and i.idinversion = " . $params['idinversion'] . " and finan.porcientointeres = 0),0) as gracia

                                        FROM

                                        mod_planifinversiones.dat_inversion inv

                                        WHERE inv.idinversion = " . $params['idinversion'];
//print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        //print_r($sql);die;

        $datos[0]['comosefinanc'] = "Contado";

        //print_r($datos);die;
        return $datos;
    }

    public function listarDatosParaFinanciamiento($params) {
        $ADDWHERE = "";
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
					mod_planifinversiones.dat_financiamiento.idfinanciamiento as idfinanciamiento,

                                        mod_planifinversiones.dat_inversfinancejecutado.valor as valorejecutado,
                                        mod_planifinversiones.dat_inversfinancestimado.valor as valorestimado,
                                        mod_planifinversiones.dat_inversfinancplan.valor as valorplan,
                                        mod_planifinversiones.dat_inversfinancproyectado.valor as valorproyectado,
                                        mod_datosmaestros.nom_moneda.codigoiso as tipomoneda

					FROM
					mod_planifinversiones.dat_financiamiento

                                        INNER JOIN mod_planifinversiones.dat_inversfinancejecutado ON (mod_planifinversiones.dat_inversfinancejecutado.idfinanciamiento = mod_planifinversiones.dat_financiamiento.idfinanciamiento)
                                        INNER JOIN mod_planifinversiones.dat_inversfinancestimado ON (mod_planifinversiones.dat_inversfinancestimado.idfinanciamiento = mod_planifinversiones.dat_financiamiento.idfinanciamiento)
                                        INNER JOIN mod_planifinversiones.dat_inversfinancplan ON (mod_planifinversiones.dat_inversfinancplan.idfinanciamiento = mod_planifinversiones.dat_financiamiento.idfinanciamiento)
                                        INNER JOIN mod_planifinversiones.dat_inversfinancproyectado ON (mod_planifinversiones.dat_inversfinancproyectado.idfinanciamiento = mod_planifinversiones.dat_financiamiento.idfinanciamiento)

                                        INNER JOIN mod_datosmaestros.dat_monedaentidad ON (mod_datosmaestros.dat_monedaentidad.idmonedaentidad = mod_planifinversiones.dat_financiamiento.idmonedaentidad)
                                        INNER JOIN mod_datosmaestros.nom_moneda ON (mod_datosmaestros.nom_moneda.idmoneda = mod_datosmaestros.dat_monedaentidad.idmoneda)

					WHERE
                                              mod_planifinversiones.dat_financiamiento.idfinanciamiento in ( "
                . $params['idfinanciamiento'] . " )AND
                                              mod_planifinversiones.dat_inversfinancejecutado.idejercicio = "
                . $params['idejercicio'] . " AND
                                              mod_datosmaestros.nom_moneda.codigoiso = '"
                . $params['tipomoneda'] . "'
                                        $ADDWHERE
					Group by
					idfinanciamiento,
                                        tipomoneda";
        /* print_r($sql);
          die; */
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarTotalF($params) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT mod_planifinversiones.dat_financiamiento.idmonedaentidad as idmonedaentidad,
                                        SUM(mod_planifinversiones.dat_financiamiento.valor)
					FROM
					mod_planifinversiones.dat_financiamiento
					INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.dat_inversion.idinversion = mod_planifinversiones.dat_financiamiento.idinversion)
					INNER JOIN mod_planifinversiones.dat_financista  ON mod_planifinversiones.dat_financiamiento.idfinancista =  mod_planifinversiones.dat_financista.idfinancista
					INNER JOIN mod_planificacion.nom_datosnomenclador nom
					ON nom.iddatosnomenclador =
					mod_planifinversiones.dat_financista.iddatosnomenclador
					INNER JOIN mod_planifinversiones.dat_tipofinanciamiento  ON mod_planifinversiones.dat_tipofinanciamiento.idtipofinanciamiento= mod_planifinversiones.dat_financiamiento.idtipofinanciamiento
					INNER JOIN mod_planificacion.nom_datosnomenclador nomtipo
					ON nomtipo.iddatosnomenclador =
					mod_planifinversiones.dat_tipofinanciamiento.iddatosnomenclador
					WHERE mod_planifinversiones.dat_inversion.idejercicio = "
                . $params['idejercicio']
                . " AND mod_planifinversiones.dat_inversion.idestructuracomun = "
                . $params['identidad'] . "
					and mod_planifinversiones.dat_inversion.idinversion ="
                . $params['idinversion'] . "
					Group by
					mod_planifinversiones.dat_financiamiento.idmonedaentidad ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarTotalP($params) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
		mod_planifinversiones.dat_presanteproy.idmonedaentidad as idmonedaentidad,

		SUM(mod_planifinversiones.dat_presanteproy.valor)

		FROM
		  mod_planifinversiones.dat_presanteproy
		  INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.dat_inversion.idinversion = mod_planifinversiones.dat_presanteproy.idinversion)
		  WHERE mod_planifinversiones.dat_inversion.idejercicio = "
                . $params['idejercicio']
                . " AND mod_planifinversiones.dat_inversion.idestructuracomun = "
                . $params['identidad'] . "
		  and mod_planifinversiones.dat_inversion.idinversion ="
                . $params['idinversion'] . "

		Group by
		idmonedaentidad";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarTipoFinan() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion denominaciontipo,
			mod_planifinversiones.dat_tipofinanciamiento.idtipofinanciamiento
                        from mod_planifinversiones.dat_tipofinanciamiento
                        INNER JOIN mod_planificacion.nom_datosnomenclador
                        ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador =
                        mod_planifinversiones.dat_tipofinanciamiento.iddatosnomenclador";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarFinancista() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion denominaciontipo,
			mod_planifinversiones.dat_financista.idfinancista
                        from mod_planifinversiones.dat_financista
                        INNER JOIN mod_planificacion.nom_datosnomenclador
                        ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador =
                        mod_planifinversiones.dat_financista.iddatosnomenclador";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarTipoInversion() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_tipoinversionprograma.idtipoinversionprograma
                        from mod_planifinversiones.dat_tipoinversionprograma
                        INNER JOIN mod_planificacion.nom_datosnomenclador
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_tipoinversionprograma.iddatosnomenclador ";
        $datosListar = $conn->execute($sql);
        $datos['data'] = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarProgramada() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_programa.idprograma idprogramada
                        from mod_planifinversiones.dat_programa
                        INNER JOIN mod_planificacion.nom_datosnomenclador
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_programa.iddatosnomenclador ";
        $datosListar = $conn->execute($sql);
        $datos['data'] = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function EliminarInc($parametros, $dat) {
        /* $query = new Doctrine_Query();
          return $query->delete()
          ->from('DatInversion ')
          ->where(
          'idestructuracomun=? AND idejercicio=?', array($parametros['identidad'], $parametros['idejercicio'])
          )
          ->whereIn('idinversion', $dat)
          ->execute(); */
        $idinvers = implode(',', $dat);
        $conn = Doctrine_Manager::connection();
//        $sql = "DELETE FROM mod_planifinversiones.dat_inversion
//                WHERE idinversion IN ($idinvers) ";
        $sql = "UPDATE 
                    mod_planifinversiones.dat_inversion 
                  SET 

                    eliminada = 1
                  WHERE 
                    idinversion IN ({$idinvers})";
        $datosListar = $conn->execute($sql);
    }

    public function ActDesactInv($parametros) {
        $query = new Doctrine_Query ();
        $result = $query->update('DatInversion n')
                ->set('idestadoinversion', $parametros['idestado'])
                /* ->where(
                  'idestructuracomun=? AND idejercicio=?', array($parametros['identidad'], $parametros['idejercicio'])
                  ) */
                ->whereIn('idinversion', $parametros['idinversion'])
                ->execute();
        return true;
    }
    
    public function BloqDesactivarInv($parametros) {
        $query = new Doctrine_Query ();
        $result = $query->update('DatInversion n')
                ->set('bloqueada', $parametros['idestado'])
                ->whereIn('idinversion', $parametros['idinversion'])
                ->execute();
        return true;
    }

    public function AprobarDes($parametros) {
        $query = new Doctrine_Query ();
        /* foreach($parametros['idinversion'] as $idinversion){
          $existe = Doctrine::getTable('DatInversion')->findByDql("idinversion = $idinversion");
          print_r($existe[0]);die;
          } */

        $result = $query->update('DatInversion n')
                ->set('idestadoaprobacion', $parametros['idaprobado'])
                /* ->where(
                  'idestructuracomun=? AND idejercicio=?', array($parametros['identidad'], $parametros['idejercicio'])
                  ) */
                ->whereIn('idinversion', $parametros['idinversion'])
                ->execute();
        return true;
    }

    public function listarCaracteristica() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_caracteristica.idcaracteristica
                        from mod_planifinversiones.dat_caracteristica
                        INNER JOIN mod_planificacion.nom_datosnomenclador 
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_caracteristica.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarCreditos() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planifinversiones.dat_financista.idfinancista idcredito,
            mod_planificacion.nom_datosnomenclador.denominacion credito
                        from mod_planifinversiones.dat_financista
                        INNER JOIN mod_planificacion.nom_datosnomenclador 
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_financista.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarForma() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_formapropiedad.idformapropiedad
                        from mod_planifinversiones.dat_formapropiedad
                        INNER JOIN mod_planificacion.nom_datosnomenclador 
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_formapropiedad.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarFormaPlan() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_formapropiedad.idformapropiedad
                        from mod_planifinversiones.dat_formapropiedad
                        INNER JOIN mod_planificacion.nom_datosnomenclador 
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_formapropiedad.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarGrupoObra() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_grupoobra.idgrupoobra
                        from mod_planifinversiones.dat_grupoobra
                        INNER JOIN mod_planificacion.nom_datosnomenclador
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_grupoobra.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarEstado() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_estadoplaninversion.idestadoplaninversion
                        from mod_planifinversiones.dat_estadoplaninversion
                        INNER JOIN mod_planificacion.nom_datosnomenclador
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_estadoplaninversion.iddatosnomenclador";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarSectorEstrategico() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_sectorestrategico.idsectorestrategico
                        from mod_planifinversiones.dat_sectorestrategico
                        INNER JOIN mod_planificacion.nom_datosnomenclador
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_sectorestrategico.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarObjetivo() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
			mod_planifinversiones.dat_objetivo.idobjetivo
                        from mod_planifinversiones.dat_objetivo
                        INNER JOIN mod_planificacion.nom_datosnomenclador 
			ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_objetivo.iddatosnomenclador";
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarDesempeno() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select n.denominacion,
			d.iddatdesempenno
                        from mod_planifinversiones.dat_desempenno d
                        INNER JOIN mod_planificacion.nom_datosnomenclador n
			ON n.iddatosnomenclador = d.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarEfecto() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select mod_planificacion.nom_datosnomenclador.denominacion,
                mod_planifinversiones.dat_efectocomercial.idefectocomercial
                from mod_planifinversiones.dat_efectocomercial
                INNER JOIN mod_planificacion.nom_datosnomenclador 
                ON mod_planificacion.nom_datosnomenclador.iddatosnomenclador = mod_planifinversiones.dat_efectocomercial.iddatosnomenclador";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getUltimoCodigo($idespecialidad, $idejecicio) {
        $query = new Doctrine_Query ();
        return $query->select('MAX(di.codigo)')
                        ->from("DatInversion di")
                        ->where(
                                'idestructuracomun = ? AND idejercicio = ?', array($idespecialidad, $idejecicio)
                        )
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
    }

    public function adicionarInversiones($params, $aboj) {
        if ($aboj) {
            $objdatoinversion = $aboj;
        } else {
            $objdatoinversion = new DatInversion();
            $objdatoinversion->codigo = $params['codigo'];
            $objdatoinversion->idejercicio = $params['idejercicio'];
            $objdatoinversion->idestadoinversion = 2;
            $objdatoinversion->idestadoaprobacion = 2;
        }

        $objdatoinversion->idtipoinversion = $params['idclasificacion'];
        $objdatoinversion->idestructuracomun = $params['idespecialidad'];
        $objdatoinversion->fechainicio = $params['fechainicio'];
        $objdatoinversion->fechafin = $params['fechafin'];
        $objdatoinversion->idtipoinversionprograma = $params['idtipoinversion'];
        $objdatoinversion->idprograma = $params['idprogramada'];
        $objdatoinversion->idformapropiedad = $params['idforma'];
        $objdatoinversion->idcaracteristica = $params['idcaracteristica'];
        $objdatoinversion->idobjetivo = $params['idobjetivo'];
        $objdatoinversion->fasttrack = $params['fasttrack'];
        $objdatoinversion->preparacion = $params['preparacion'];
        $objdatoinversion->idprovincia = $params['provincia'];
        $objdatoinversion->idmedioambiente = $params['idmedioambiente'];
        $objdatoinversion->denominacion = $params['denominacion'];
        $objdatoinversion->idefectocomercial = $params['idefecto'];
        $objdatoinversion->idcumplimientoinversion = 0;
        $objdatoinversion->cuadrada = 0;
        $objdatoinversion->iddatdesempenno = $params['iddatdesempenno'];
        $objdatoinversion->analpostinversiones = $params['analpostinversiones'];
        //$objdatoinversion->observaciones = $_pl_in_&${$params['observaciones']}$_pl_in_&$;
        $objdatoinversion->observaciones = $params['observaciones'];
        $objdatoinversion->idsectorestrategico = $params['idsectorestrategico'];
        $objdatoinversion->idgrupoobra = $params['idgrupoobra'];
        $objdatoinversion->idestadoplaninversion = $params['idestadoplan'];
        //pre_r($objdatoinversion);die;
        $objdatoinversion->save();
        $idinversion = $objdatoinversion->idinversion;
        return $idinversion;
    }

    public function gestionarparametros($idelemento) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT de.idelemento, de.idetapa, de.documento, de.parametrosdinamicos, de.denominacion as denelemento,
                detm.idtipomodelo, ntm.denominacion
				FROM mod_planifinversiones.dat_elemento de
				LEFT JOIN mod_planifinversiones.dat_elementotipomodelo detm ON de.idelemento = detm.idelemento
				INNER JOIN mod_planificacion.nom_tipomodelo ntm ON ntm.idtipomodelo = detm.idtipomodelo
				WHERE de.idelemento = " . $idelemento;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarIndicadores($params) {
//print_r($params);die;
        $arrayvia[] = "importacion directa";
        $arrayvia[] = "sustitucionimportaciones";
        $arrayDer = NomIndicador::getOrdenerbyId($arrayvia);

        $arrayIzq = NomIndicador::getOrdenizqbyId();
        $cadenaWHERE = "true ";
        $query = new Doctrine_Query ();
        $query2 = new Doctrine_Query ();
        $query3 = new Doctrine_Query ();
        foreach ($params['filtros'] as $p => $s) {
            if ($s['field'] == 'codigo') {
                $query->addWhere(
                        "n.codigo LIKE ? ", ("{$s['data']['value']}%")
                );
            } else {
                if ($s['field'] == 'numeropieza') {
                    $query->addWhere(
                            "n.numeropieza  LIKE ? ", ("{$s['data']['value']}%")
                    );
                } elseif ($s['field'] == 'denominacion') {
                    $query->addWhere(
                            "upper(n.denominacion)  ILIKE ? ", ("%{$s['data']['value']}%")
                    );
                } else {
                    if ($s['field'] == 'precio') {
                        $cond = "=";
                        if ($s['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($s['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        $query->addWhere(
                                " np.{$s['field']} {$cond} ?", $s['data']['value']
                        );
                    } elseif ($s['field'] == 'preciodivisa') {
                        $cond = "=";
                        if ($s['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($s['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        $query->addWhere(
                                " np.{$s['field']} {$cond} ?", $s['data']['value']
                        );
                    } elseif ($s['field'] == 'denoum') {
                        $s['field'] = 'idumedida';
                        $query->addWhere(
                                "n.{$s['field']} = ?", $s['data']['value']
                        );
                    } elseif ($s['field'] == 'denocentrobalance') {
                        $s['field'] = 'identidaddatosnomenclador';
                        $query->addWhere(
                                "cb.{$s['field']} = ?", $s['data']['value']
                        );
                    }
                }
            }
        }
        $data->data = $query->select(
                        "n.idindicador,n.idarbol,n.codigo ,( case when cdi.idcontroldivisaindicadormodelo is not null then cdi.idcontroldivisaindicadormodelo end ) as idcontroldi ,
                                                n.numeropieza, ( case when cdi.idcontroldivisaindicadormodelo is not null then 'Si' else 'No' end ) as asociado , n.idumedida, n.denominacion, n.descripcion,
                                                n.idumedida, ROUND(np.precio, 2) AS precio, ROUND(np.preciodivisa, 2) AS preciodivisa, n.ordender, n.ordenizq,
                                                n.estado, np.idaprobacion, n.nivel,z.idviaadquisicion,dp.idplanificacion,( case when dp.idplanificacion is not null then 1 else 0 end ) as idplanificado ,
                                                n.idnaturaleza, n.idpais, np.nivelplanif,cdi.idcontroldivisa, cb.identidaddatosnomenclador,
                                                np.flete, np.contingencia,  n.idformato, n.idpadre,e.identidad as identidad, im.idmodelo,mod.denominacion as denmodelo,
                                    cdi.idcontroldivisaindicadormodelo as idcontroldivisaindicador, cdi.idaprobacion as aprobadoasociacion,
                                    cd.codigo as codigocd,cd.denominacion as denominacioncd,cdi.idejercicio as idejercicio,n.activo,np.idaprobacion"
                )
                ->from("NomIndicador n")
                ->leftjoin('n.DatIndicadorviaadquisicion z')
                ->leftjoin('n.DatPlanificacion dp')
                ->leftjoin('n.NomIndicadorplanif np')
                ->leftjoin('n.DatIndicadorcentrobalance cb')
                ->leftjoin('cb.DatEntidaddatosnomenclador e')
                ->leftjoin('z.NomViaadquisicion nvia')
                ->leftjoin("n.DatControldivisaindicadormodelo cdi")
                ->leftjoin("cdi.NomControldivisa cd")
                ->leftjoin("n.DatIndicadormodelo im")
                ->leftjoin("im.DatModelo mod")
                ->addWhere(
                        '(cdi.idejercicio =? OR cdi.idejercicio is null)
                    and np.nivelplanif = 1 and np.idaprobacion=4 and n.activo=1' 
//                    and n.idindicador NOT IN 
//                    (SELECT eq.idindicador FROM DatEtapaEquipo eq WHERE eq.idetapainversion=? and eq.idequipoplan=?)'
                        , array($params['idejercicio'])
                )
                ->orderby("n.codigo")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        
//        ->getSqlQuery(); 
//        pre_r($data->data);die;
        $data->total = $query->count();
        return $data;
    }

    public function listarum($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT um.idunidadmedida, um.abreviaturaunidadmedida um
                FROM mod_datosmaestros.nom_unidadmedida um";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarejecutado($ejercicio, $idmoneda, $idetapinverconsprov, $params
    ) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(conts.idconstructor,ejec.idetapinverconsprovejecutado) conts.idconstructor,ejec.valor,
            ejec.idetapinverconsprovejecutado,etc.iddpt
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                        INNER JOIN  mod_planifinversiones.dat_etapinverconsprovejecutado ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                       INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                        WHERE ejec.idejercicio = {$ejercicio} and ejec.idmoneda ={$idmoneda} and inv.idestructuracomun = {$params['identidad']}
                AND eiv.idinversion = {$params['idinversion']}  and etc.idetapinverconsprov  = {$idetapinverconsprov}";
        //print_r($sql);
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarplanconts($ejercicio, $idmoneda, $idetapinverconsprov, $params
    ) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(conts.idconstructor,ejec.idetapinverconsprovplan) conts.idconstructor,  ejec.valor,
            ejec.idetapinverconsprovplan,etc.iddpt
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         LEFT JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                        INNER JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                       INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                       WHERE ejec.idejercicio = {$ejercicio} and ejec.idmoneda ={$idmoneda} and inv.idestructuracomun = {$params['identidad']}
                AND eiv.idinversion = {$params['idinversion']}  and etc.idetapinverconsprov  = {$idetapinverconsprov}";
        // print_r($sql);
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarproyecc($ejercicio, $idmoneda, $idetapinverconsprov, $params
    ) {
        $conn = Doctrine_Manager::connection();
        $sql = " Select DISTINCT ON(conts.idconstructor,ejec.idetapinverconsprovproyeccion) conts.idconstructor,ejec.valor,
            ejec.idetapinverconsprovproyeccion,etc.iddpt
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         LEFT JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                        INNER JOIN mod_planifinversiones.dat_etapinverconsprovproyeccion ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                       INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                        WHERE ejec.idejercicio = {$ejercicio} and ejec.idmoneda ={$idmoneda} and inv.idestructuracomun = {$params['identidad']}
                AND eiv.idinversion = {$params['idinversion']}  and  etc.idetapinverconsprov  = {$idetapinverconsprov}";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarestimado($ejercicio, $idmoneda, $idetapinverconsprov, $params
    ) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(conts.idconstructor,ejec.idetapinverconsprovestimado) conts.idconstructor,
                 ejec.valor,ejec.idetapinverconsprovestimado,etc.iddpt
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                        
                         LEFT JOIN mod_planifinversiones.dat_etapinverconsprovestimado ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                       INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                         WHERE ejec.idejercicio = {$ejercicio} and ejec.idmoneda ={$idmoneda} and inv.idestructuracomun = {$params['identidad']}
                AND eiv.idinversion = {$params['idinversion']}  and etc.idetapinverconsprov  = {$idetapinverconsprov}";
        // print_r($sql);
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function Listarconstructores($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT inv.idinversion,eiv.idetapainversion,conts.idconstructor,
                 nom.denominacion den,etc.iddpt,etc.idetapinverconsprov
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                        INNER JOIN mod_planificacion.nom_datosnomenclador nom ON (nom.iddatosnomenclador =  conts.iddatosnomenclador)
			 WHERE inv.idestructuracomun = {$params['identidad']}
                AND eiv.idinversion = {$params['idinversion']} ";
        // print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarAP($params) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select DISTINCT ON(conts.idconstructor) conts.idconstructor,
                 nom.denominacion
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                        INNER JOIN mod_planificacion.nom_datosnomenclador nom ON (nom.iddatosnomenclador =  conts.iddatosnomenclador)
			 WHERE inv.idestructuracomun = {$params['identidad']}
                AND eiv.idinversion = {$params['idinversion']} ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarPresupuestoEtapaxMoneda($parametros, $moneda) {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';
        $cadenaQUERY = '';

        $cadenaSELECT = " SELECT COALESCE(SUM(elv.valor),0) ";
        $cadenaJOIN = " FROM mod_planifinversiones.dat_etapainversion ei
                        INNER JOIN mod_planifinversiones.dat_etapaelementoinversion eeli ON (eeli.idetapainversion = ei.idetapainversion)
                        INNER JOIN mod_planifinversiones.dat_elementovalor elv ON (eeli.idetapaelementoinversion = elv.idelemento)
                        INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = elv.idmonedaentidad AND me.idmonedaentidad = {$moneda})";
        $cadenaWHERE = " WHERE ei.idetapainversion = {$parametros['idetapa']} ";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
// pre_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $datosListar = $conn->execute($cadenaQUERY);
        $datos = $datosListar->fetchAll(PDO::FETCH_COLUMN);

        $result = $datos[0];
        return $result;
    }

    public function cargarPresPorConstructorEtapaMoneda($parametros, $moneda) {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';
        $cadenaQUERY = '';

        $cadenaSELECT = " SELECT COALESCE(SUM(elv.valor),0) ";
        $cadenaJOIN = " FROM mod_planifinversiones.dat_etapainversion ei
                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov ecp ON (ecp.idetapainversion = ei.idetapainversion)
			            INNER JOIN mod_planifinversiones.dat_constructor ec ON (ec.idconstructor = ecp.idconstructor)
                        INNER JOIN mod_planifinversiones.dat_etapaelementoinversion eeli ON (eeli.idetapainversion = ei.idetapainversion)
                        INNER JOIN mod_planifinversiones.dat_elementovalor elv ON (eeli.idelemento = elv.idelemento)
                        INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = elv.idmonedaentidad AND me.idmoneda = {$moneda})";
        $cadenaWHERE = " WHERE ei.idinversion = {$parametros['idinversion']} AND ei.idetapa = {$parametros['idetapa']} ";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;


        $conn = Doctrine_Manager::connection();
        $datosListar = $conn->execute($cadenaQUERY);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getInversionesOrganismo($entidades) {
        $query = "select distinct(inv.idinversion),inv.idestructuracomun,inv.denominacion
            from mod_planifinversiones.dat_inversion inv 
            where inv.idestructuracomun IN($entidades)";
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getInversionesOrganismoDemanda($entidades, $id) {
        $entid = implode(',', $entidades);
        $query = "select distinct(inv.idinversion),inv.idestructuracomun,inv.denominacion
            from mod_planifinversiones.dat_inversion inv 
             inner join mod_planifinversiones.dat_etapainversion ei on(inv.idinversion =ei.idinversion)
             inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)
            where inv.idestructuracomun IN($entid) and inv.idejercicio = $id
                ";
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getInversionesOrganismoDemandaCompReportes($cadenaWHERE, $entidades, $ejercicio, $idejercicio) {
        $entid = implode(',', $entidades);
        if ($entid == 'A') {
            $entid = 0;
        }
//        pre_r($entidades);
        $query = "select distinct(i.idinversion),i.idestructuracomun,i.denominacion,i.codigo
            from mod_planifinversiones.dat_inversion i
             inner join mod_planifinversiones.dat_etapainversion ei on(i.idinversion =ei.idinversion)
            inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)
            inner join mod_planifinversiones.dat_etapaequipoglobal etg on (etg.idetapaequipos = ee.idetapaequipos)
            inner join mod_planifinversiones.dat_etapaequipoplan ete on (ete.idetapaequipoglobal = etg.idetapaequipoglobal and ete.idejercicio = $idejercicio)
            where i.eliminada = 0 AND i.idestadoinversion = 1 AND i.idestructuracomun IN($entid) and
            ($ejercicio >= (date_part('year',  i.fechainicio))::numeric
              and
              $ejercicio <= (date_part('year',  i.fechafin))::numeric
              )
            $cadenaWHERE
            order by codigo";
//pre_r($query);die;
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanesInversiones($entidades) {
        $conn = Doctrine_Manager::connection();
        if ($entidades == 'A') {
            $entidades = 0;
        }
        $sql = "Select distinct ON (m.idmodelo)m.idmodelo,ent.identidadmodelo,m.denominacion  FROM mod_planificacion.dat_entidadmodelo ent
                             INNER JOIN mod_planificacion.dat_modelo m ON(ent.idmodelo=m.idmodelo)
                             WHERE ent.identidad IN($entidades);";
        //print_r($sql);die;
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function getInversionesIndicadores($idinversion, $identidadmodelo, $idmoneda, $idindicador
    ) {

        if ($idmoneda == 990000000149) {
            $SELECT = 'ee.precio';
        } else {
            $SELECT = 'ee.preciodivisa';
        }

        if ($idindicador == '') {
            $ADDWHERE = ' ';
        } else {
            $ADDWHERE = " AND ind.idindicador=$idindicador ";
        }

        if ($identidadmodelo == '') {
            $ADDWHERE = ' ';
        } else {
            $ADDWHERE = " AND ee.identidadmodelo=$identidadmodelo ";
        }

        $query = "select ee.idindicador, ind.denominacion, ind.idformato, ind.nivel, ee.cantidad, ee.identidadmodelo, em.idmodelo, ei.idinversion,inv.idestructuracomun, $SELECT
         from mod_planifinversiones.dat_etapainversion ei 
            inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)
             inner join mod_datosmaestros.nom_indicador ind on(ee.idindicador = ind.idindicador)
                 inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = ee.identidadmodelo)
            inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)
            inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion)
            where ei.idinversion=$idinversion AND m.idmodelo in(10000000058,10000000058) $ADDWHERE
                Group by ee.idindicador, ind.denominacion, ind.idformato, ind.nivel, ee.cantidad, ee.identidadmodelo, em.idmodelo, ei.idinversion,inv.idestructuracomun, $SELECT
                Order by ind.nivel;";
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getInversionesIndicadoress($idinversion, $idmoneda, $idindicador
    ) {

        if ($idmoneda == 990000000149) {
            $SELECT = 'ee.precio';
        } else {
            $SELECT = 'ee.preciodivisa';
        }

        $query = "select ee.idindicador, ind.denominacion, ind.idformato, ind.nivel, ee.cantidad, em.idmodelo, ei.idinversion,inv.idestructuracomun, $SELECT
         from mod_planifinversiones.dat_etapainversion ei 
            inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)
             inner join mod_datosmaestros.nom_indicador ind on(ee.idindicador = ind.idindicador)
                 inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = ee.identidadmodelo)
            inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)
            inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion)
            where ei.idinversion=$idinversion AND m.idmodelo in(10000000058,10000000059) AND ind.idindicador=$idindicador
                Group by ee.idindicador, ind.denominacion, ind.idformato, ind.nivel, ee.cantidad, em.idmodelo, ei.idinversion,inv.idestructuracomun, $SELECT
                Order by ind.nivel;";
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarIndicadoresPlan($data, $idmoneda, $plan, $ejercicio, $nivel, $nivel4
    ) {
        $addwhere = '';
        if ($plan['idmodelo'] == null) {
            $plan['idmodelo'] = 0;
        }
        $arrayInv = array();
        foreach ($data as $val) {
            $arrayInv[] = $val['idinversion'];
        }
        if ($arrayInv != null) {
            $inversiones = implode(',', $arrayInv);
        } else {
            $inversiones = 0;
        }

        if ($idmoneda == 9900000046) {
            $precio = ',b.precio as valor';
            $precioSub = ',ee.precio as valor ';
        } else {
            $precio = '';
            $precioSub = '';
        }

        if ($nivel4) {
            $addwhere = " AND p.nivel = 4";
        } else {
            $addwhere = " AND p.nivel <=" . $nivel . "";
        }


        //$precio = ',b.preciodivisa as valor';
        $query = "select distinct * from (select distinct
                        b.idindicador,
                        b.codigo,
                        b.denominacion,
                        b.nivel,
                        b.idarbol ,
                        b.cantidad,
                        b.idmodelo ,
                        c.idinversion,
                        b.idestructuracomun,
                        b.precio ,b.divisa                        
                        from (select   
                        p.idindicador,
                        h.idindicador  as idindicador1,
                        p.codigo, 
                        p.denominacion, 
                        p.nivel,
                        p.idarbol ,
                        0 as cantidad,
                        0 as idmodelo 
                        ,0 as idestructuracomun,
                        nomplanif.precio as precio,nomplanif.preciodivisa as divisa
                        from mod_datosmaestros.nom_indicador p,
                        mod_datosmaestros.nom_indicador h
                         inner join mod_datosmaestros.nom_indicadorplanif nomplanif on(nomplanif.idindicador = h.idindicador)
                        where h.ordenizq BETWEEN p.ordenizq and p.ordender 
                        and h.idarbol = p.idarbol 
                        AND p.nivel <=" . $nivel . "
                        and h.idindicador in 
                         
                         
                         (select distinct ee.idindicador 
                         from mod_planifinversiones.dat_etapainversion ei    
                         inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)    
                        inner join mod_datosmaestros.nom_indicador ind on(ee.idindicador = ind.idindicador)    
                        inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = ee.identidadmodelo)    
                        inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)    
                        inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion)   
                        where ei.idinversion in(" . $inversiones . ")
                       AND m.idmodelo=" . $plan['idmodelo']
                . "  AND ee.idejercicio  =" . $ejercicio . " )
                        and p.nivel <> 4 
                       -- order by idindicador1, p.codigo 
                        )b
                        inner join 
                        (select distinct ee.idindicador,ei.idinversion 
                         from mod_planifinversiones.dat_etapainversion ei    
                         inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)    
                        inner join mod_datosmaestros.nom_indicador ind on(ee.idindicador = ind.idindicador)    
                        inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = ee.identidadmodelo)    
                        inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)    
                        inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion)   
                        where ei.idinversion in(" . $inversiones . ")
                       AND m.idmodelo =" . $plan['idmodelo']
                . "  AND ee.idejercicio =" . $ejercicio . "  )c
                           on (c.idindicador = b.idindicador1)                       
                        
                         )f
                         union 
                         
                         (select 
                       ee.idindicador,ind.codigo, ind.denominacion, ind.nivel, ind.idarbol, 
                       ee.cantidad, em.idmodelo, ei.idinversion,inv.idestructuracomun, nomplanif.precio,nomplanif.preciodivisa  
                       from mod_planifinversiones.dat_etapainversion ei    
                       inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)    
                       inner join mod_datosmaestros.nom_indicador ind on(ee.idindicador = ind.idindicador)    
                       inner join mod_datosmaestros.nom_indicadorplanif nomplanif on(nomplanif.idindicador = ind.idindicador)
                       inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = ee.identidadmodelo)    
                       inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)    
                       inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion)   
                       where ei.idinversion in(" . $inversiones . ")
                       AND m.idmodelo=" . $plan['idmodelo']
                . " AND ee.idejercicio  =" . $ejercicio . " AND ind.nivel>=1
                       Group by ind.codigo,ee.idindicador, ind.denominacion,    
                       ind.nivel, ee.cantidad, em.idmodelo,ei.idinversion,inv.idestructuracomun, ind.idarbol,nomplanif.precio,nomplanif.preciodivisa 
  
                       ) 
                       order by idinversion,codigo";
        /*   print_r('<pre>');print_r($query);
          die; */
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);


        return $datos;
    }

    public function listarIndicadoresPlanCmpReportes($denomejercicio, $paramWhere, $data, $idmoneda, $plan, $ejercicio, $nivel, $nivel4 = null) {
        $addwhere = '';
        if ($plan['idmodelo'] == null) {
            $plan['idmodelo'] = 0;
        }
        $arrayInv = array();
        foreach ($data as $val) {
            $arrayInv[] = $val['idinversion'];
        }
        if ($arrayInv != null) {
            $inversiones = implode(',', $arrayInv);
        } else {
            $inversiones = 0;
        }

        if ($idmoneda == 9900000046) {
            $precio = ',b.precio as valor';
            $precioSub = ',ee.precio as valor ';
        } else {
            $precio = '';
            $precioSub = '';
        }

        if ($nivel4) {
            $addwhere = " AND p.nivel = 4";
        } else {
            $addwhere = " AND p.nivel <=" . $nivel . "";
        }

        //$precio = ',b.preciodivisa as valor';
        $query = "select distinct f.idindicador,
f.codigo,
f.denominacion,
f.nivel,
f.idarbol ,
f.cantidad as cantidad,
0, --precio
0, --preciodivisa
0, --importe
0, --importedivisa
--c.importe ,
--c.importedivisa,
f.idinversion,
f.idestructuracomun from (select distinct
                        b.idindicador,
                        b.codigo,
                        b.denominacion,
                        b.nivel,
                        b.idarbol ,
                        b.cantidad,
                        b.precio ,
                        b.divisa,
                        b.importe,
                        b.importedivisa,
                        --b.idmodelo ,
                        c.idinversion,
                        b.idestructuracomun
                        from (select
                        p.idindicador,
                        h.idindicador  as idindicador1,
                        p.codigo,
                        p.denominacion,
                        p.nivel,
                        p.idarbol ,
                        0 as cantidad,
                        --0 as idmodelo,
                        --0 as idestructuracomun,
                        nomplanif.precio as precio,nomplanif.preciodivisa as divisa,
                        0 as importe,
                        0 as importedivisa,
                        0 as idestructuracomun
                        
                        from mod_datosmaestros.nom_indicador p,
                        mod_datosmaestros.nom_indicador h
                         inner join mod_datosmaestros.nom_indicadorplanif nomplanif on(nomplanif.idindicador = h.idindicador)
                        where h.ordenizq BETWEEN p.ordenizq and p.ordender
                        and h.idarbol = p.idarbol
                        AND p.nivel <=" . $nivel . "
                        and h.idindicador in

                         ( select distinct eeq.idindicador
                            from mod_planifinversiones.dat_etapainversion ei
                            inner join mod_planifinversiones.dat_etapaequipos eeq on(ei.idetapainversion= eeq.idetapainversion)
                           inner join mod_datosmaestros.nom_indicador ind on(eeq.idindicador = ind.idindicador)
                           --inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = eeq.identidadmodelo)
                           --inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)
                           inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion AND inv.eliminada = 0)

                           INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = ind.idindicador)
                                   INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                           where inv.idestadoinversion = 1 AND ei.idinversion in(" . $inversiones . ")
                                AND eeq.idequipoplan = {$plan}
                          --AND m.idmodelo=" . $plan['idmodelo']
                . " /* AND eet.idejercicio  =" . $ejercicio . "*/
                          $paramWhere
                          and (" . $denomejercicio . " >= (date_part('year',  inv.fechainicio))::numeric
                          and " . $denomejercicio . " <= (date_part('year',  inv.fechafin))::numeric )
                        )
                        and p.nivel <> 4
                       -- order by idindicador1, p.codigo
                        )b
                        inner join
                        (select distinct eeq.idindicador,ei.idinversion
                         from mod_planifinversiones.dat_etapainversion ei
                         inner join mod_planifinversiones.dat_etapaequipos eeq on(ei.idetapainversion= eeq.idetapainversion)
                        inner join mod_datosmaestros.nom_indicador ind on(eeq.idindicador = ind.idindicador)
                        --inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = eeq.identidadmodelo)
                        --inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)
                        inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion AND inv.eliminada = 0)

                        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = ind.idindicador)
		                INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                        where inv.idestadoinversion = 1 AND ei.idinversion in(" . $inversiones . ")
                            AND eeq.idequipoplan = {$plan}
                          --AND m.idmodelo=" . $plan['idmodelo']
                . "   /* AND eeq.idejercicio  =" . $ejercicio . "*/
                       $paramWhere
                       and (" . $denomejercicio . " >= (date_part('year',  inv.fechainicio))::numeric
                       and " . $denomejercicio . " <= (date_part('year',  inv.fechafin))::numeric )
                       )c
                           on (c.idindicador = b.idindicador1)

                         )f
                         union

                         (select distinct
                                eeq.idindicador,ind.codigo, ind.denominacion, 
                                ind.nivel, ind.idarbol,
                                sum (ete.valor) as cantidad/*, em.idmodelo*/,
                                0 as precio , 
                                0 as preciodivisa, 
                                sum (eeq.precio * ete.valor) as importe ,
                                sum (eeq.preciodivisa * ete.valor) as importedivisa,
                                 ei.idinversion,
                                inv.idestructuracomun -- ,eeq.precio,eeq.preciodivisa
                        from mod_planifinversiones.dat_etapainversion ei
                        inner join mod_planifinversiones.dat_etapaequipos eeq on(ei.idetapainversion= eeq.idetapainversion)
                        inner join mod_planifinversiones.dat_etapaequipoglobal etg on (etg.idetapaequipos = eeq.idetapaequipos)
                        inner join mod_planifinversiones.dat_etapaequipoplan ete on (ete.idetapaequipoglobal = etg.idetapaequipoglobal and ete.idejercicio = " . $ejercicio . ")
                        inner join mod_datosmaestros.nom_indicador ind on(eeq.idindicador = ind.idindicador)
                        inner join mod_datosmaestros.nom_indicadorplanif nomplanif on(nomplanif.idindicador = ind.idindicador)
                        --inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = eeq.identidadmodelo)
                        --inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)
                        inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion AND inv.eliminada = 0)

                        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos ON (indos.idindicador = ind.idindicador)
                                INNER JOIN mod_datosmaestros.nom_organosatisface os ON (os.idorganosatisface = indos.idorganosatisface)
                        where inv.idestadoinversion = 1 AND ei.idinversion in(" . $inversiones . ")
                                AND eeq.idequipoplan = {$plan}
                          --AND m.idmodelo=" . $plan['idmodelo']
                . "  AND ete.idejercicio  =" . $ejercicio . " AND ind.nivel>=1
                       $paramWhere
                       and (" . $denomejercicio . " >= (date_part('year',  inv.fechainicio))::numeric
                       and " . $denomejercicio . " <= (date_part('year',  inv.fechafin))::numeric )
group by eeq.idindicador,ind.codigo, ind.denominacion, 
                                ind.nivel, ind.idarbol,
                                /*, em.idmodelo*/ ei.idinversion,
                                inv.idestructuracomun
                       )
                       order by idinversion,codigo";
//        print_r($query);die;
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);

        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);


        return $datos;
    }

    public function listarSuma($data, $idmoneda, $plan, $ejercicio, $nivel) {
        if ($plan['idmodelo'] == null) {
            $plan['idmodelo'] = 0;
        }
        $arrayInv = array();
        foreach ($data as $val) {
            $arrayInv[] = $val['idinversion'];
        }
        if ($arrayInv != null) {
            $inversiones = implode(',', $arrayInv);
        } else {
            $inversiones = 0;
        }
        $precio = 'ee.preciodivisa';
        if ($idmoneda == 9900000046) {
            $precio = 'ee.precio';
        }
        $query = "select  SUM(ee.cantidad),SUM($precio) as valor,ei.idinversion
                       from mod_planifinversiones.dat_etapainversion ei    
                       inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)    
                       inner join mod_datosmaestros.nom_indicador ind on(ee.idindicador = ind.idindicador)    
                       inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = ee.identidadmodelo)    
                       inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)    
                       inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion)   
                       where ei.idinversion in(" . $inversiones . ")
                       AND m.idmodelo =" . $plan['idmodelo']
                . " AND ee.idejercicio  =" . $ejercicio . " AND ind.nivel=4
                      Group by ei.idinversion";
        $con = Doctrine_Manager::connection();
        /*  print_r($query);die; */
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function contarModelos($idinversion, $idindicador) {

        $query = "select em.idmodelo
         from mod_planifinversiones.dat_etapainversion ei 
            inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion)
             inner join mod_datosmaestros.nom_indicador ind on(ee.idindicador = ind.idindicador)
                 inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = ee.identidadmodelo)
            inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo)
            inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion)
            where ei.idinversion=$idinversion AND ee.idindicador=$idindicador";
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function sumaIndicadoresSurtidosInversiones($idinversion, $idmodelo, $nivel, $idmoneda
    ) {

        if ($idmoneda == 990000000149) {
            $SELECT = 'SUM(ee.precio) as suma';
        } else {
            $SELECT = 'SUM(ee.preciodivisa) as suma';
        }

        $query = "select  $SELECT
from mod_planifinversiones.dat_etapainversion ei 
inner join mod_planifinversiones.dat_etapaequipos ee on(ei.idetapainversion= ee.idetapainversion) 
inner join mod_datosmaestros.nom_indicador ind on(ee.idindicador = ind.idindicador) inner join mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = ee.identidadmodelo) 
inner join mod_planificacion.dat_modelo m on(em.idmodelo = m.idmodelo) 
inner join mod_planifinversiones.dat_inversion inv on(ei.idinversion=inv.idinversion) where ei.idinversion=$idinversion AND m.idmodelo=$idmodelo AND ind.nivel=$nivel;";
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarDenomInver($parametros) {
        /*  $entidades = implode(',', $parametros['identidad']);
          print_r($entidades);die;
          $query = new Doctrine_Query ();
          $data = $query->select('di.idinversion, di.idejercicio, di.denominacion, di.idestructuracomun')
          ->from('DatInversion di')
          ->whereIn('idestructuracomun',$parametros['identidad'])
          ->where('idejercicio = ?', $parametros['idejercicio'])
          ->getSqlQuery(); */

        //  ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
        // ->execute();
        $query = "select  di.idinversion, di.idejercicio, di.denominacion, di.idestructuracomun
                    from mod_planifinversiones.dat_inversion di 
                    where  idestructuracomun IN ( " . $parametros['identidad'] . " )
                        AND idejercicio =" . $parametros['idejercicio'] . " ;";
        $con = Doctrine_Manager::connection();
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ListarMonedaPorEntidad($params) {
        $conn = Doctrine_Manager::connection();
        $sqlL = "SELECT
    --  dat_monedaentidad.idmonedaentidad,
      nom_moneda.nombremoneda,
      nom_moneda.codigoiso
      FROM
      mod_datosmaestros.nom_moneda,
     -- mod_datosmaestros.dat_monedaentidad
     -- WHERE
     -- dat_monedaentidad.idmoneda = nom_moneda.idmoneda and dat_monedaentidad.idestructuracomun IN ("
                . $entidades . ")";
        $sql = "
        SELECT 
      nom_moneda.nombremoneda,
      nom_moneda.codigoiso,
      dat_monedaentidad.idmonedaentidad idmoneda
      FROM
      mod_datosmaestros.nom_moneda,
      mod_datosmaestros.dat_monedaentidad
      WHERE
      dat_monedaentidad.idmoneda = nom_moneda.idmoneda ";

        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInversionesXentidad($idejercicio, $idEntidades/* , $idInversion */
    ) {
        $ADDWHERE = ' ';
//        if ($idInversion) {
//            $ADDWHERE = " AND di.idinversion = $idInversion ";
//        }
//        foreach ($idEntidades as $ident) {
//            $organismos = stripslashes($ident);
////            $entidades = implode(',', $idEntidades[0]);
//            $arrayOrganismos[] = explode(',', $organismos);
//        }
//        $arrEntidades = implode(",", array_merge($arrayOrganismos[0],$arrayOrganismos[1]));
        $con = Doctrine_Manager::connection();
        $query = "select p.idinversion,p.denominacion,
                p.idestructuracomun,
                p.idejercicio, 
                estruct.denominacion organismo,
                coalesce( pp.planpreparacion,0) ::numeric(19,3) as planpreparacion,
                coalesce( vc.valorelemento,0)::numeric(19,3) as valorelemento,
                (coalesce( pp.planpreparacion,0) + coalesce( vc.valorelemento,0)) ::numeric(19,3) as plan,
                (coalesce( co.contado,0)::numeric(19,3) + coalesce( cr.credito,0))::numeric(19,3) as Totalcomosefinancia,
                coalesce( cr.credito,0)::numeric(19,3) as credito,
                coalesce( co.contado,0)::numeric(19,3) as contado,
                coalesce (tqf.totalquienfinancia, 0)::numeric(19,3) as totalquienfinancia,
                p.fondobasico ::numeric(19,3),
                p.rendinversion ::numeric(19,3),
                p.inverprocpniano ::numeric(19,3),
                p.cuotainverproc  from ( SELECT 
                di.idinversion,
                di.denominacion,
                di.idestructuracomun,
                di.idejercicio,
                coalesce( (SELECT
                            doi.plan
                        FROM mod_planifinversiones.dat_inversion dii
                        INNER JOIN mod_planifinversiones.dat_otrosindicadares doi ON(di.idinversion = doi.idinversion)
                        INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(doi.idnomotrosindicadores = noi.idnomotrosindicadores)
                        WHERE dii.idinversion = di.idinversion and noi.idnomotrosindicadores = 124 and doi.idejercicio = $idejercicio) ,0 )::numeric(19,3) as fondobasico,
                coalesce( (SELECT
                            doi.plan
                        FROM mod_planifinversiones.dat_inversion dii
                        INNER JOIN mod_planifinversiones.dat_otrosindicadares doi ON(di.idinversion = doi.idinversion)
                        INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(doi.idnomotrosindicadores = noi.idnomotrosindicadores)
                        WHERE dii.idinversion = di.idinversion and noi.idnomotrosindicadores = 127 and doi.idejercicio = $idejercicio) ,0 )::numeric(19,3) as rendinversion,
                coalesce( (SELECT
                            doi.plan
                        FROM mod_planifinversiones.dat_inversion dii
                        INNER JOIN mod_planifinversiones.dat_otrosindicadares doi ON(di.idinversion = doi.idinversion)
                        INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(doi.idnomotrosindicadores = noi.idnomotrosindicadores)
                        WHERE dii.idinversion = di.idinversion and noi.idnomotrosindicadores = 125 and doi.idejercicio = $idejercicio) ,0 )::numeric(19,3) as inverprocpniano,
                coalesce( (SELECT
                            doi.plan
                        FROM mod_planifinversiones.dat_inversion dii
                        INNER JOIN mod_planifinversiones.dat_otrosindicadares doi ON(di.idinversion = doi.idinversion)
                        INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(doi.idnomotrosindicadores = noi.idnomotrosindicadores)
                        WHERE dii.idinversion = di.idinversion and noi.idnomotrosindicadores = 126 and doi.idejercicio = $idejercicio
                ) ,0 )::numeric(19,3) as cuotainverproc

              FROM mod_planifinversiones.dat_inversion di
              WHERE di.idestructuracomun IN($idEntidades) AND di.idejercicio = $idejercicio $ADDWHERE) p 
                  INNER JOIN mod_estructuracomp.dat_estructura estruct on(p.idestructuracomun  = estruct.idestructura) 
                  
              left join (SELECT
                            dicp.idinversion,
                        dicp.valor as contado
                        FROM mod_planifinversiones.dat_inverscontadoplan dicp
                        INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dicp.idmonedaentidad = dme.idmonedaentidad)
                        WHERE dicp.idejercicio = $idejercicio AND dme.idmoneda = 9900000103)co on (co.idinversion = p.idinversion)
              left join (SELECT 
                            dfp.idinversion,
                            sum(dfp.valor) credito
                        FROM mod_planifinversiones.dat_inversfinancplan dfp
                        INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dfp.idmonedaentidad = dme.idmonedaentidad)
                        WHERE dfp.idejercicio = $idejercicio AND dme.idmoneda = 9900000103
                        GROUP BY (dfp.idinversion))cr on (cr.idinversion = p.idinversion)
              left join (SELECT 
                            dpap.idinversion,sum(dpap.valor) planpreparacion,
                            di.denominacion
                        FROM mod_planifinversiones.dat_presanteproy dpap
                        INNER JOIN mod_planifinversiones.dat_inversion di ON (dpap.idinversion = di.idinversion)
                        INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dpap.idmonedaentidad = dme.idmonedaentidad)
                        WHERE di.idestructuracomun IN($idEntidades) 
                            AND di.idejercicio = $idejercicio AND dme.idmoneda = 9900000103
                        GROUP BY dpap.idinversion,di.denominacion)pp on (pp.idinversion = p.idinversion)
              left join (
                        
                        select 
                            SUM(r.valor)::numeric(19,3) as valorelemento
                            , r.idinversion
                            from
                            (
                            SELECT mo.idmoneda, iep.valor, di.idinversion
                          FROM mod_planifinversiones.dat_inversion di 
                          inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
                          

                          inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                          inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                          inner join mod_planifinversiones.dat_inversetapaplan iep on (iep.idetapainversion = ei.idetapainversion  
                          and iep.idejercicio = di.idejercicio )
                          inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = iep.idmoneda)

                            where mo.codigoiso = 'CUP'
                            and di.idejercicio = $idejercicio

                           /* union

                            SELECT me.idmoneda ,sum(eq.importe)::numeric(19,3) as importe, di.idinversion
                            FROM  mod_planifinversiones.dat_inversion di 
                            inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
                            inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                            inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                            left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion)
                            inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = eq.identidadmodelo)
                            inner join mod_datosmaestros.dat_monedaentidad me on (me.idestructuracomun = em.identidad)
                            inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = me.idmoneda)
                            WHERE 
                                di.idejercicio = $idejercicio
                                and m.codigoiso = 'CUP'
                            group by me.idmoneda, di.idinversion*/


                            )r

                            group by r.idinversion
                            order by r.idinversion
                        

                        ) vc on (vc.idinversion = p.idinversion)
              left join (SELECT sum(dfi.valor) totalquienfinancia, dfi.idinversion 
                    FROM mod_planifinversiones.dat_inversfinancistaplan dfi 
                   left JOIN mod_datosmaestros.dat_monedaentidad dme ON (dfi.idmonedaentidad = dme.idmonedaentidad) 
                   WHERE dfi.idejercicio = $idejercicio AND dme.idmoneda = 9900000103
                   group by dfi.idinversion) tqf on (tqf.idinversion = p.idinversion) order by estruct.denominacion ";
//pre_r($query);die;
        $datosListar = $con->execute($query);
        $data = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarDatosReporteResumenInverMUSD($idejercicio, $entidades, $idmoneda
    ) {
        $ADDWHERE = ' ';
        /* if ($idInversion) {
          $ADDWHERE = " AND di.idinversion = $idInversion ";
          } */
        // $entidades = implode(',', $idEntidades);
        $con = Doctrine_Manager::connection();
        $query = "select p.idinversion,p.denominacion,
                    p.idestructuracomun,
                    p.idejercicio, 
                    coalesce( pp.planpreparacion,0)  as planpreparacion,coalesce( vc.valorelemento,0) as valorelemento,coalesce( pp.planpreparacion,0) + coalesce( vc.valorelemento,0) as plan,
                    coalesce( co.contado,0) + coalesce( cr.credito,0) as Totalcomosefinancia,coalesce( cr.credito,0) as credito,coalesce( co.contado,0) as contado, 
                    coalesce (tqf.totalquienfinancia, 0) as totalquienfinancia,
                    p.erogacionliquido,
                    p.contratacionexterna
                    from ( SELECT 
                    di.idinversion,
                    di.denominacion,
                    di.idestructuracomun,
                    di.idejercicio, 
                    coalesce( (SELECT
                                doi.plan
                            FROM mod_planifinversiones.dat_inversion dii
                            INNER JOIN mod_planifinversiones.dat_otrosindicadares doi ON(di.idinversion = doi.idinversion)
                            INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(doi.idnomotrosindicadores = noi.idnomotrosindicadores)
                            WHERE dii.idinversion = di.idinversion and noi.idnomotrosindicadores = 123 and doi.idejercicio = $idejercicio) ,0 ) as erogacionLiquido,
                    coalesce( (SELECT
                                doi.plan
                            FROM mod_planifinversiones.dat_inversion di
                            INNER JOIN mod_planifinversiones.dat_otrosindicadares doi ON(di.idinversion = doi.idinversion)
                            INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(doi.idnomotrosindicadores = noi.idnomotrosindicadores)
                            WHERE dii.idinversion = di.idinversion and noi.idnomotrosindicadores = 122 and doi.idejercicio = $idejercicio) ,0 ) as contratacionExterna
                FROM mod_planifinversiones.dat_inversion di
                WHERE di.eliminada = 0 and di.idestructuracomun IN($entidades) AND di.idejercicio = $idejercicio $ADDWHERE) p 
                left join (SELECT
                            dicp.idinversion,
                            dicp.valor as contado
                        FROM mod_planifinversiones.dat_inverscontadoplan dicp
                        INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dicp.idmonedaentidad = dme.idmonedaentidad)
                        WHERE dicp.idejercicio = $idejercicio AND dme.idmoneda = $idmoneda)co on (co.idinversion = p.idinversion)
                left join (SELECT 
                            dfp.idinversion,
                            sum(dfp.valor) credito
                        FROM mod_planifinversiones.dat_inversfinancplan dfp
                        INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dfp.idmonedaentidad = dme.idmonedaentidad)
                        WHERE dfp.idejercicio = $idejercicio AND dme.idmoneda = $idmoneda
                        GROUP BY (dfp.idinversion))cr on (cr.idinversion = p.idinversion)
                  left join (SELECT 
                                dpap.idinversion,sum(dpap.valor) planpreparacion,
                                di.denominacion
                            FROM mod_planifinversiones.dat_presanteproy dpap
                            INNER JOIN mod_planifinversiones.dat_inversion di ON (dpap.idinversion = di.idinversion)
                            INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dpap.idmonedaentidad = dme.idmonedaentidad)
                            WHERE di.idestructuracomun IN($entidades) 
                                AND di.idejercicio = $idejercicio AND dme.idmoneda = $idmoneda
                            GROUP BY dpap.idinversion,di.denominacion)pp on (pp.idinversion = p.idinversion)
                  left join (
                            select 
                            SUM(r.valor) as valorelemento
                            , r.idinversion
                            from
                            (
                            SELECT mo.idmoneda, iep.valor, 
                          di.idinversion
                          FROM mod_planifinversiones.dat_inversion di 
                          inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
                          

                          inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                          inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                          inner join mod_planifinversiones.dat_inversetapaplan iep on (iep.idetapainversion = ei.idetapainversion  
                          and iep.idejercicio = di.idejercicio )
                          inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = iep.idmoneda)

                            where mo.codigoiso = 'USD'
                            and di.idejercicio = $idejercicio

                            /*union

                            SELECT me.idmoneda ,sum(eq.importedivisa) as importe, di.idinversion
                            FROM  mod_planifinversiones.dat_inversion di 
                            inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
                            inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                            inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                            left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion)
                            inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = eq.identidadmodelo)
                            inner join mod_datosmaestros.dat_monedaentidad me on (me.idestructuracomun = em.identidad)
                            inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = me.idmoneda)
                            WHERE di.eliminada = 0 and
                                di.idejercicio = $idejercicio
                                and m.codigoiso = 'USD'
                            group by me.idmoneda, di.idinversion*/


                            )r

                            group by r.idinversion
                            order by r.idinversion


) vc on (vc.idinversion = p.idinversion)
                  left join (SELECT 
                                sum(df.valor) totalquienfinancia,
                                df.idinversion
                            FROM mod_planifinversiones.dat_financista dfi
                            INNER JOIN mod_planifinversiones.dat_financiamiento df ON (dfi.idfinancista = df.idfinancista)
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn ON (dfi.iddatosnomenclador = ndn.iddatosnomenclador)
                            INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (df.idmonedaentidad = dme.idmonedaentidad)
                            WHERE dme.idmoneda = $idmoneda
                            group by df.idinversion) tqf on (tqf.idinversion = p.idinversion)";
        $datosListar = $con->execute($query);
        $data = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarDenomFinancista($idinversion, $idmoneda, $identidades) {
        $con = Doctrine_Manager::connection();

        if ($identidades) {
            $ADDWHERE = " di.idestructuracomun in ($identidades)";
        } else {
            $ADDWHERE = 'true';
        }
        $query = "SELECT
                    ndn.denominacion,
                    sum(df.valor) as valor,
                    dfi.idfinancista,
                    dfi.iddatosnomenclador
                  FROM
                  mod_planifinversiones.dat_financista dfi
                  INNER JOIN mod_planifinversiones.dat_financiamiento df ON (dfi.idfinancista = df.idfinancista)
                  INNER JOIN mod_planifinversiones.dat_inversion di ON (di.idinversion = df.idinversion)
                  INNER JOIN mod_planificacion.nom_datosnomenclador ndn ON (dfi.iddatosnomenclador = ndn.iddatosnomenclador)
                  INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (df.idmonedaentidad = dme.idmonedaentidad)
                  WHERE di.eliminada = 0 and df.idinversion = $idinversion AND dme.idmoneda = $idmoneda and $ADDWHERE
                GROUP BY ndn.denominacion, dfi.idfinancista, dfi.iddatosnomenclador"; //print_r($query);
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function listarDenomFinancistaReporte($idinversion, $idmoneda, $identidades
    ) {
        $con = Doctrine_Manager::connection();

        if ($identidades) {
            $ADDWHERE = " di.idestructuracomun in ($identidades)";
        } else {
            $ADDWHERE = 'true';
        }
        $query = "SELECT
                    ndn.denominacion,
                    sum(df.valor) as valor,
                    dfi.idfinancista,
                    dfi.iddatosnomenclador
                  FROM
                  mod_planifinversiones.dat_financista dfi
                  INNER JOIN mod_planifinversiones.dat_financiamiento df ON (dfi.idfinancista = df.idfinancista)
                  INNER JOIN mod_planifinversiones.dat_inversion di ON (di.idinversion = df.idinversion)
                  INNER JOIN mod_planificacion.nom_datosnomenclador ndn ON (dfi.iddatosnomenclador = ndn.iddatosnomenclador)
                  INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (df.idmonedaentidad = dme.idmonedaentidad)
                  WHERE df.idinversion IN ({$idinversion}) AND dme.idmoneda = $idmoneda and $ADDWHERE
                GROUP BY ndn.denominacion, dfi.idfinancista, dfi.iddatosnomenclador"; //print_r($query);
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function listarValorPlanPorFinancista($idinversion, $idmoneda, $idejercicio
    ) {
        $con = Doctrine_Manager::connection();

        $query = "SELECT distinct inv.idejercicio,inv.idestructuracomun ,inv.idinversion,dn.denominacion, fcistaplan.*
      FROM mod_planifinversiones.dat_inversion inv
      inner join mod_planifinversiones.dat_inversfinancistaplan fcistaplan on(inv.idinversion = fcistaplan.idinversion )
      inner join mod_planifinversiones.dat_financista fcista on(fcistaplan.idfinancista = fcista.idfinancista)
      INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (fcistaplan.idmonedaentidad = dme.idmonedaentidad)
      inner join mod_planificacion.nom_datosnomenclador dn on(fcista.iddatosnomenclador = dn.iddatosnomenclador)
      where inv.eliminada = 0 and inv.idinversion = $idinversion and dme.idmoneda = $idmoneda and fcistaplan.idejercicio = $idejercicio"; //print_r($query);die;
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    /* public function listarValorPlanPorFinancista($idinversion, $idmoneda, $idejercicio, $identidades) {
      $con = Doctrine_Manager::connection();

      $query = "SELECT distinct inv.idejercicio,inv.idestructuracomun ,inv.idinversion,dn.denominacion, fcistaplan.*
      FROM mod_planifinversiones.dat_inversion inv
      inner join mod_planifinversiones.dat_inversfinancistaplan fcistaplan on(inv.idinversion = fcistaplan.idinversion )
      inner join mod_planifinversiones.dat_financista fcista on(fcistaplan.idfinancista = fcista.idfinancista)
      INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (fcistaplan.idmonedaentidad = dme.idmonedaentidad)
      inner join mod_planificacion.nom_datosnomenclador dn on(fcista.iddatosnomenclador = dn.iddatosnomenclador)
      where inv.idinversion = $idinversion and dme.idmoneda = $idmoneda and fcistaplan.idejercicio = $idejercicio";
      $datosListar = $con->execute($query);
      $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);

      return $datos;
      } */

    public function listarDatosFinancistas($idejercicio, $idmoneda, $inversiones, $idfinancista
    ) {
        if ($idfinancista) {
            $ADDWHERE = "and invfinan.idfinancista=$idfinancista";
        } else {
            $ADDWHERE = "";
        }

        if ($inversiones == "0") {
            $ADDWHERE1 = "and invfinan.idinversion in ($inversiones)";
        } else {
            $ADDWHERE1 = "";
        }

        $con = Doctrine_Manager::connection();
        $sql_query = "select invfinan.idinversfinancistaplan, invfinan.idfinancista, invfinan.valor, invfinan.idinversion, nom.denominacion as denominacionfinancista
                      from mod_planifinversiones.dat_inversion inv 
                      left join mod_planifinversiones.dat_inversfinancistaplan invfinan on(inv.idinversion = invfinan.idinversion)
                      left join mod_planifinversiones.dat_financista finan on(finan.idfinancista = invfinan.idfinancista)
                      inner join mod_planificacion.nom_datosnomenclador nom on (nom.iddatosnomenclador = finan.iddatosnomenclador)
                      where invfinan.idejercicio = $idejercicio and invfinan.idmonedaentidad in ($idmoneda) $ADDWHERE1 $ADDWHERE";

        $datosListar = $con->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    /* public function listarTotalQuienXfinancista($idestructura, $idmoneda) {
      // $arridestructura = implode(',', $idestructura);
      //print_r($arridestructura);
      //print_r('--');
      //print_r($otros);
      //die;
      $con = Doctrine_Manager::connection();
      $query = "SELECT
      ndn.denominacion,
      sum(df.valor) as totalquien
      FROM
      mod_planifinversiones.dat_financista dfi
      INNER JOIN mod_planifinversiones.dat_financiamiento df ON (dfi.idfinancista = df.idfinancista)
      INNER JOIN mod_planifinversiones.dat_inversion di ON (df.idinversion = di.idinversion)
      INNER JOIN mod_planificacion.nom_datosnomenclador ndn ON (dfi.iddatosnomenclador = ndn.iddatosnomenclador)
      INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (df.idmonedaentidad = dme.idmonedaentidad)
      WHERE di.idestructuracomun IN($idestructura) AND dme.idmoneda = $idmoneda
      GROUP BY (ndn.denominacion)";
      $datosListar = $con->execute($query);
      $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
      //print_r($datos);die('eded');
      return $datos;
      } */

    public function listarTotalQuienXfinancista($idestructura, $idmoneda, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT distinct ndn.denominacion, sum(dfp.valor) ::numeric(19,3) as totalquien
            FROM mod_planifinversiones.dat_financista dfi 
           INNER JOIN mod_planifinversiones.dat_inversfinancistaplan dfp ON (dfp.idfinancista = dfi.idfinancista) 
           INNER JOIN mod_planifinversiones.dat_inversion di ON (dfp.idinversion = di.idinversion) 
           INNER JOIN mod_planificacion.nom_datosnomenclador ndn ON (dfi.iddatosnomenclador = ndn.iddatosnomenclador) 
           INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dfp.idmonedaentidad = dme.idmonedaentidad) 
      WHERE di.eliminada = 0 and di.idestructuracomun IN($idestructura) AND dme.idmoneda = $idmoneda and
      dfp.idejercicio = $idejercicio
      GROUP BY (ndn.denominacion)";
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarParteFormatosSegunFormato($idformato, $idindicador) {
        $con = Doctrine_Manager::connection();
        $query = "select pf.idparteformato, pf.nombre, ind.idindicador from mod_datosmaestros.nom_indicador ind
inner join mod_datosmaestros.dat_formato f on(ind.idformato = f.idformato)
inner join mod_datosmaestros.dat_parteformato pf on(f.idformato = pf.idformato)  where ind.idformato = $idformato AND ind.nivel = pf.nivel AND ind.idindicador = $idindicador
Group by pf.nombre,pf.idparteformato,ind.idindicador
Order by pf.nombre";
        $datosListar = $con->execute($query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarRep_Const($params, $moneda, $const, $entidades, $org) {
        $arrayconstructor = implode(',', $params['consrtuctor']);
        $addwhere = "true";
        $conn = Doctrine_Manager::connection();
        if ($params['idpt'] != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "etc.iddpt IN (" . $params['provincia'] . ")"
            );
        }
        if ($const != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "conts.idconstructor  IN (", $const . ")"
            );
        }
        $sql = "Select  DISTINCT ON(conts.idconstructor) conts.idconstructor,
                 nom.denominacion den, SUM(ejec.valor)
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                          LEFT JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                        INNER JOIN mod_planificacion.nom_datosnomenclador nom ON (nom.iddatosnomenclador =  conts.iddatosnomenclador)
			 WHERE inv.idestructuracomun = $org
                AND  inv.idejercicio = {$params['idejercicio']} and $addwhere
                    Group by 
                    conts.idconstructor,
                    nom.denominacion ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function totalSumas($params, $moneda, $const, $entidades, $org) {
        $arrayconstructor = implode(',', $const);
        $addwhere = "true";
        $conn = Doctrine_Manager::connection();
        if ($params['idpt'] != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "etc.iddpt IN (" . $params['provincia'] . ")"
            );
        }
        if ($const != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "conts.idconstructor  IN (", $const . ")"
            );
        }
        $sql = "Select  DISTINCT ON(conts.idconstructor) conts.idconstructor, SUM(ejec.valor)
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                          LEFT JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                        INNER JOIN mod_planificacion.nom_datosnomenclador nom ON (nom.iddatosnomenclador =  conts.iddatosnomenclador)
			 WHERE inv.idestructuracomun IN (" . $org . ")
                AND  inv.idejercicio = {$params['idejercicio']} and $addwhere
                    Group by 
                    conts.idconstructor,
                    nom.denominacion ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function sumaOrganismo($params, $moneda, $const, $entidades, $org) {
        $arrayconstructor = implode(',', $params['consrtuctor']);
        $addwhere = "true";
        $conn = Doctrine_Manager::connection();
        if ($params['idpt'] != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "etc.iddpt IN (" . $params['provincia'] . ")"
            );
        }
        if ($const != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "conts.idconstructor  IN (", $const . ")"
            );
        }
        $sql = "Select  DISTINCT ON(conts.idconstructor) conts.idconstructor, SUM(ejec.valor)
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                          LEFT JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                        INNER JOIN mod_planificacion.nom_datosnomenclador nom ON (nom.iddatosnomenclador =  conts.iddatosnomenclador)
			 WHERE inv.idestructuracomun = $org
                AND  inv.idejercicio = {$params['idejercicio']} and $addwhere
                    Group by 
                    conts.idconstructor,
                    nom.denominacion ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function valorMoneda($params, $id, $moneda, $entidades, $valOrg) {
        $arrayconstructor = implode(',', $params['consrtuctor']);
        $addwhere = "true";
        $conn = Doctrine_Manager::connection();
        if ($params['idpt'] != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "etc.iddpt IN (" . $params['provincia'] . ")"
            );
        }
        if ($const != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "conts.idconstructor  IN (", $const . ")"
            );
        }
        $sql = "Select DISTINCT ON(conts.idconstructor) conts.idconstructor,  sum(ejec.valor)
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         LEFT JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                        INNER JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                       INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                       WHERE ejec.idejercicio = {$params['idejercicio']} and ejec.idmoneda ={$moneda} and inv.idestructuracomun = $valOrg
             and conts.idconstructor  = {$id} and $addwhere
             Group by 
                conts.idconstructor";
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInvXConst($params, $id, $moneda) {
        $entidades = implode(',', $params['ids']);
        $addwhere = "true";
        $conn = Doctrine_Manager::connection();
        if ($params['idpt'] != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "etc.iddpt = ", $params['provincia']
            );
        }
        if ($const != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "conts.idconstructor = ", $const
            );
        } else {
            if ($params['constructor'] != "") {
                self::addWhereConParams(
                        $addwhere, $params_query, "conts.idconstructor =", $params['constructor']
                );
            }
        }
        $sql = "Select DISTINCT ON(conts.idconstructor,ejec.idetapinverconsprovplan) conts.idconstructor,  ejec.valor,
            ejec.idetapinverconsprovplan,etc.iddpt
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         LEFT JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                        LEFT JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                       INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                       WHERE inv.idestructuracomun in({$entidades})
                        AND conts.idconstructor ={$id} AND inv.idejercicio = {$params['idejercicio']} AND ejec.idmoneda = {$moneda}
                        and $addwhere";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInv($params, $id, $moneda, $entidades, $valOrg) {
        $conn = Doctrine_Manager::connection();
        $addwhere = "true";
        if ($params['idpt'] != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "etc.iddpt IN (" . $params['provincia'] . ")"
            );
        }
        if ($const != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "conts.idconstructor  IN (", $const . ")"
            );
        }
        $sql = "Select DISTINCT ON(inv.idinversion) inv.idinversion,inv.denominacion,ejec.valor,ejec.idmoneda,eiv.idetapainversion
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         LEFT JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                         LEFT JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                       WHERE inv.idestructuracomun  = $valOrg
                        AND conts.idconstructor ={$id} AND inv.idejercicio = {$params['idejercicio']} and ejec.idmoneda = {$moneda}
                         and $addwhere"; //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarInvsinV($params, $id, $moneda, $entidades, $valOrg) {
        $conn = Doctrine_Manager::connection();
        $addwhere = "true";
        if ($params['idpt'] != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "etc.iddpt IN (" . $params['provincia'] . ")"
            );
        }
        if ($const != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "conts.idconstructor  IN (", $const . ")"
            );
        }
        $sql = "Select DISTINCT ON(inv.idinversion) inv.idinversion,inv.denominacion,ejec.valor,ejec.idmoneda,eiv.idetapainversion
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         LEFT JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                         LEFT JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                       WHERE inv.idestructuracomun  = $valOrg
                        AND conts.idconstructor ={$id} AND inv.idejercicio = {$params['idejercicio']} 
                         and $addwhere"; //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarValorI($params, $id, $moneda, $inv, $entidades, $valOrg
    ) {
        $conn = Doctrine_Manager::connection();
        $addwhere = "true";
        if ($params['idpt'] != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "etc.iddpt IN (" . $params['provincia'] . ")"
            );
        }
        if ($const != "") {
            self::addWhereConParams(
                    $addwhere, $params_query, "conts.idconstructor  IN (", $const . ")"
            );
        }
        $sql = "Select DISTINCT ON(inv.idinversion) inv.idinversion,inv.denominacion,ejec.valor
                         FROM mod_planifinversiones.dat_etapainversion eiv
                         LEFT JOIN mod_planifinversiones.dat_etapinverconsprov etc ON (eiv.idetapainversion = etc.idetapainversion)
                         LEFT JOIN  mod_planifinversiones.dat_etapinverconsprovplan ejec ON (etc.idetapinverconsprov = ejec.idetapinverconsprov)
                        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
                       INNER JOIN mod_planifinversiones.dat_constructor conts ON (conts.idconstructor = etc.idconstructor)
                       WHERE inv.idestructuracomun = $valOrg
                        AND conts.idconstructor ={$id} AND inv.idejercicio = {$params['idejercicio']}
                            and ejec.idmoneda = {$moneda} AND eiv.idetapainversion = {$inv} and $addwhere";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarAdquisicion() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select n.denominacion,a.idadquisicion
                        from mod_planifinversiones.dat_adquisicion a
                        INNER JOIN mod_planificacion.nom_datosnomenclador n
		        ON n.iddatosnomenclador = a.iddatosnomenclador";
        $data = $conn->execute($sql);
        $datos = $data->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarCompra() {
        $conn = Doctrine_Manager::connection();
        $sql = "Select n.denominacion,c.idcomprar
                        from mod_planifinversiones.dat_comprar c
                        INNER JOIN mod_planificacion.nom_datosnomenclador n
		        ON n.iddatosnomenclador = c.iddatosnomenclador";
        $data = $conn->execute($sql);
        $datos = $data->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getInversionesDadoEntidades($idejercicio, $entidades) {
        $sql_query = "Select inv.idinversion, inv.denominacion from mod_planifinversiones.dat_inversion inv
            where inv.idejercicio = $idejercicio AND inv.idestructuracomun IN($entidades)";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getComoSeFinancia($idejercicio, $idinversion) {
        $sql_query = "Select nomtipo.denominacion as comosefinanc,tp.idtipofinanciamiento
                                        FROM
                                        mod_planifinversiones.dat_tipofinanciamiento tp   
                                        INNER JOIN mod_planifinversiones.dat_financiamiento f  ON tp.idtipofinanciamiento = f.idtipofinanciamiento
                                        INNER JOIN mod_planifinversiones.dat_inversion ON (mod_planifinversiones.dat_inversion.idinversion = f.idinversion)  
                                        INNER JOIN mod_planificacion.nom_datosnomenclador nomtipo ON nomtipo.iddatosnomenclador = tp.iddatosnomenclador
                                        WHERE
                                         mod_planifinversiones.dat_inversion.idinversion = $idinversion                                           
                                        Group by comosefinanc,tp.idtipofinanciamiento";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarPlanPresupuesto($params) {

        if ($params['idinversion'] == 0) {
            $params['idinversion'] = $params['id'];
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT p.idmonedaentidad,p.idinversion,p.valor, dme.idmoneda
		FROM mod_planifinversiones.dat_presanteproy p
                INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (p.idmonedaentidad = dme.idmonedaentidad)
		INNER JOIN mod_planifinversiones.dat_inversion i ON (p.idinversion =i.idinversion) 
	        WHERE i.idinversion =" . $params['idinversion'] . " ";
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarFinan($params) {
        if ($params['idinversion'] == 0) {
            $params['idinversion'] = $params['id'];
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT SUM(f.valor),f.idmonedaentidad,f.idinversion, dme.idmoneda
		FROM mod_planifinversiones.dat_financiamiento f
                INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (f.idmonedaentidad = dme.idmonedaentidad)
		INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = f.idinversion) 
		WHERE f.idinversion =" . $params['idinversion'] . "
                GROUP BY f.idmonedaentidad,f.idinversion, dme.idmoneda";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarValorInversion($params) {
        if ($params['idinversion'] == 0) {
            $params['idinversion'] = $params['id'];
        }
        $conn = Doctrine_Manager::connection();
        $sql = "select
                    SUM(r.valor), r.idmoneda
                    ,r.codigoiso from 
                    ( 
                    SELECT m.idmonedaentidad, m.valor,ne.denominacion,mo.codigoiso, me.idmoneda 
                    FROM mod_planifinversiones.dat_elementovalor m 
                    inner join mod_planifinversiones.dat_etapaelementoinversion eei on(eei.idetapaelementoinversion = m.idelemento) 
                    inner join mod_planifinversiones.dat_etapainversion ei on (ei.idetapainversion = eei.idetapainversion) 
                    inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa) 
                    inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa) 
                    inner join mod_datosmaestros.dat_monedaentidad me on (me.idmonedaentidad = m.idmonedaentidad) 
                    inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)  
                    WHERE ei.idinversion = " . $params['idinversion'] . "  

                    union 

                    SELECT me.idmonedaentidad ,sum(eq.importe) as importe,ne.denominacion ,m.codigoiso, me.idmoneda
                    FROM  mod_planifinversiones.dat_etapainversion ei  
                    inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa) 
                    inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa) 
                    left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion) 
                    --inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = eq.identidadmodelo) 
                    inner join mod_planifinversiones.dat_inversion i on (i.idinversion = ei.idinversion)
                    inner join mod_datosmaestros.dat_monedaentidad me on (me.idestructuracomun = i.idestructuracomun)
                    inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = me.idmoneda) 
                    WHERE 
                     ei.idinversion = " . $params['idinversion'] . " 
                       and m.codigoiso = 'CUP' 
                    group by me.idmonedaentidad,ne.denominacion,m.codigoiso
                    union  
                    SELECT  me.idmonedaentidad ,sum(eq.importedivisa) as importe,ne.denominacion ,m.codigoiso, me.idmoneda
                    FROM  mod_planifinversiones.dat_etapainversion ei  
                    inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa) 
                    inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa) 
                    left JOIN mod_planifinversiones.dat_etapaequipos eq ON(ei.idetapainversion = eq.idetapainversion) 
                    --inner join mod_planificacion.dat_entidadmodelo em on (em.identidadmodelo = eq.identidadmodelo) 
                    inner join mod_planifinversiones.dat_inversion i on (i.idinversion = ei.idinversion)
                    inner join mod_datosmaestros.dat_monedaentidad me on (me.idestructuracomun = i.idestructuracomun)
                    inner join mod_datosmaestros.nom_moneda m on (m.idmoneda = me.idmoneda) 
                    WHERE 
                     ei.idinversion = " . $params['idinversion'] . " 
                       and m.codigoiso = 'USD' 
                    group by me.idmonedaentidad,ne.denominacion,m.codigoiso

                    )r 

                    group by r.idmoneda, r.codigoiso
                    ORDER BY r.codigoiso";
//print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function ObternerCuadrada($params) {
        if ($params['idinversion'] == 0) {
            $params['idinversion'] = $params['id'];
        }
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE mod_planifinversiones.dat_inversion
                         SET cuadrada=1
                            WHERE  idinversion ={$params['idinversion']}";
        $total = $conn->execute($query);
    }

    public function ObternerNoCuadrada($params) {
        if ($params['idinversion'] == 0) {
            $params['idinversion'] = $params['id'];
        }
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE mod_planifinversiones.dat_inversion
                SET cuadrada=0
                WHERE  idinversion ={$params['idinversion']}";
        $conn->execute($query);
    }

    public function getValoresComoSeFinancia($formapropiedad, $inversiones, $idtipofinanciamiento, $idmoneda
    ) {

        if ($formapropiedad) {
            $ADDWHERE = " and fp.idformapropiedad in ($formapropiedad)";
            $SELECT = ",fp.idformapropiedad ";
        } else {
            $ADDWHERE = "";
            $SELECT = "";
        }

        if ($inversiones == "0") {
            $ADDWHERE1 = " and fcp.idinversion in($inversiones)";
        } else {
            $ADDWHERE1 = "";
        }

        $conn = Doctrine_Manager::connection();
        $sql = "select dn.denominacion, inv.idinversion, fp.iddatosnomenclador, fcp.idtipofinanciamiento,inv.denominacion, fcp.idmonedaentidad, dn.denominacion,
            Coalesce(SUM(fcp.valor),0) as suma $SELECT
from mod_planifinversiones.dat_formapropiedad fp
inner join mod_planifinversiones.dat_inversion inv on(fp.idformapropiedad = inv.idformapropiedad)
left join mod_planifinversiones.dat_inversfinancplan fcp on(fcp.idinversion = inv.idinversion)
inner join mod_planificacion.nom_datosnomenclador dn on(dn.iddatosnomenclador = fp.iddatosnomenclador)
where fcp.idtipofinanciamiento = $idtipofinanciamiento and fcp.idmonedaentidad in($idmoneda) $ADDWHERE $ADDWHERE1 
Group By inv.idinversion, fp.iddatosnomenclador, fcp.idtipofinanciamiento, dn.denominacion, fcp.idmonedaentidad $SELECT";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getInversionesDadoFormaPropiedad($idejercicio, $ejercicio, $entidades, $forma
    ) {
        //pre_r($forma);die;
        if ($forma) {
            $ADDWHERE = "AND fp.idformapropiedad=$forma";
        } else {
            $ADDWHERE = "";
        }

        $sql_query = "Select distinct inv.idinversion, inv.denominacion, inv.idestructuracomun
             from mod_planifinversiones.dat_inversion inv
            INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(inv.idinversion = ei.idinversion)
            INNER JOIN mod_planifinversiones.dat_inversetapaplan p ON(ei.idetapainversion = p.idetapainversion)
            inner join mod_planifinversiones.dat_formapropiedad fp on(inv.idformapropiedad = fp.idformapropiedad)
            where inv.idestadoinversion = 1 AND
                  ($ejercicio >= (date_part('year',  inv.fechainicio))::numeric
                      and
                      $ejercicio <= (date_part('year',  inv.fechafin))::numeric
                  ) and p.valor <> 0
            AND inv.idestructuracomun IN($entidades)
            $ADDWHERE --order by inv.denominacion";
        $conn = Doctrine_Manager::connection();
        //pre_r($sql_query);die;
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getValoresQuienFinancia($idmoneda, $inversiones, $idejercicio, $iddatosnom
    ) {

        if ($iddatosnom) {
            $ADDWHERE = " and finan.iddatosnomenclador = $iddatosnom";
        } else {
            $ADDWHERE = "";
        }
        $sql = "select invp.idinversion, invp.idfinancista, invp.valor
from mod_planifinversiones.dat_inversfinancistaplan invp
inner join mod_planifinversiones.dat_inversfinancistaplan inv on(invp.idinversion = inv.idinversion)
inner join mod_planifinversiones.dat_financista finan on(finan.idfinancista = invp.idfinancista)
inner join mod_planificacion.nom_datosnomenclador nom on(nom.iddatosnomenclador = finan.iddatosnomenclador)
where invp.idmonedaentidad = $idmoneda and invp.idinversion in ($inversiones) and invp.idejercicio = $idejercicio $ADDWHERE
Group By invp.idinversion, invp.idfinancista, invp.valor";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getErogacionLiquido($idmoneda, $inversiones, $idejercicio) {
        $sql = "select eroliq.idinversion, eroliq.valor from mod_planifinversiones.dat_erogacionliquido eroliq
                inner join mod_planifinversiones.dat_inversion inv on(inv.idinversion = eroliq.idinversion )
                where inv.idejercicio = $idejercicio and eroliq.idinversion in ($inversiones) and eroliq.idmonedaentidad in ($idmoneda)";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getValoresContado($idejercicio, $inversiones) {
        $sql = "select finan.idinversion, finan.porcientointeres, finan.valor, finan.idfinanciamiento, finan.valor
                from  mod_planifinversiones.dat_financiamiento finan
                inner join  mod_planifinversiones.dat_inversion inv on(finan.idinversion = inv.idinversion)
                where inv.idinversion in($inversiones) and inv.idejercicio = $idejercicio";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getValoresContratacionExterna($idejercicio, $inversiones, $idotrosind
    ) {
        $sql = "select noi.denominacion, oi.idinversion, oi.plan, oi.idnomotrosindicadores, oi.idejercicio
                from mod_planifinversiones.dat_otrosindicadares oi
                inner join mod_planifinversiones.nom_otrosindicadores noi on(oi.idnomotrosindicadores = noi.idnomotrosindicadores)
                where oi.idejercicio = $idejercicio and oi.idinversion in ($inversiones) and oi.idnomotrosindicadores = $idotrosind";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarFormadadoId($idforma) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select dn.denominacion,fp.idformapropiedad
                    from mod_planifinversiones.dat_formapropiedad fp
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn ON fp.iddatosnomenclador = dn.iddatosnomenclador
                    WHERE fp.idformapropiedad IN($idforma)";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public static function devolverIdMonedaEnt($moneda, $entidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
		me.idmonedaentidad 
		FROM  mod_datosmaestros.dat_monedaentidad me
                WHERE  me.idestructuracomun = $entidad and me.idmoneda = $moneda";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public static function devolverIdMonedaXCodigo($cod, $entidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
		me.idmonedaentidad ,m.idmoneda
		FROM  mod_datosmaestros.dat_monedaentidad me
                inner join mod_datosmaestros.nom_moneda m on (me.idmoneda = m.idmoneda)
                WHERE  me.idestructuracomun = $entidad and m.codigoiso = '$cod'";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public static function listarPlanesPreparacionPorInversion($param) {
        $conn = Doctrine_Manager::connection();
        //print_r($param);die;

        $sql_query = " SELECT inv.idinversion,
                        pre.idpresanteproy as ppMP,
                        pre1.idpresanteproy as ppUSD,
                        inv.idejercicio,
                        ejerplanif.ejercicio,
                       Coalesce((pre.valor)) as valormp,
                       Coalesce((pre1.valor)) as valorusd
                    FROM mod_planifinversiones.dat_inversion inv 		  
                       LEFT JOIN mod_planifinversiones.dat_presanteproy pre on(inv.idinversion = pre.idinversion and pre.idmonedaentidad = {$param['MP']})
                       LEFT JOIN mod_planifinversiones.dat_presanteproy pre1 on(pre1.idinversion = inv.idinversion and pre1.idmonedaentidad = {$param['USD']})
                       INNER JOIN mod_planificacion.nom_ejercicioplanificacion ejerplanif on(ejerplanif.idejercicio = inv.idejercicio)
                    WHERE  inv.idestructuracomun = {$param['identidad']}
		       and inv.idinversion = {$param['idinversion']} --AND ejerplanif.actual = 1
                    Group By inv.idinversion,pre.idpresanteproy,pre1.idpresanteproy,ejerplanif.ejercicio,pre1.valor";
//pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanesPreparacionPorInversionDesglose($param, $idEjercicio
    ) {

        $conn = Doctrine_Manager::connection();
        $sql_query = " SELECT
                             ppejec.idpresupejecutado as id,
                             pp.idmonedaentidad,
                             COALESCE(ppejec.valor,0) as valor,
                             ppejec.idejercicio,
                             case when pp.idmonedaentidad = {$param['MP']} then '1ejecutado_mp'
                                  when pp.idmonedaentidad = {$param['USD']} then '1ejecutado_usd'
                             end desglose

                            FROM
                             mod_planifinversiones.dat_inversion inv
                             left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                             left join mod_planifinversiones.dat_presupejecutado ppejec on(pp.idpresanteproy = ppejec.idpresanteproy)
                             where inv.idestructuracomun in ({$param['identidad']})
                             and ppejec.idejercicio in ({$idEjercicio}) and inv.idinversion = {$param['idinversion']}

                            union

                            SELECT
                             ppest.idpresupestimado as id,
                             pp.idmonedaentidad,
                             COALESCE(ppest.valor,0) as valor,
                             ppest.idejercicio,
                             case when pp.idmonedaentidad = {$param['MP']} then '2estimado_mp'
                                  when pp.idmonedaentidad = {$param['USD']} then '2estimado_usd' end desglose

                            FROM
                             mod_planifinversiones.dat_inversion inv
                             left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                             left join mod_planifinversiones.dat_presupestimado ppest on(pp.idpresanteproy = ppest.idpresanteproy)
                             where inv.idestructuracomun in ({$param['identidad']})
                             and ppest.idejercicio in ({$idEjercicio}) and inv.idinversion = {$param['idinversion']}

                             union

                             SELECT
                             ppplan.idpresupplan as id,
                             pp.idmonedaentidad,
                             COALESCE(ppplan.valor,0) as valor,
                             ppplan.idejercicio,
                             case when pp.idmonedaentidad = {$param['MP']} then '3plan_mp'
                                  when pp.idmonedaentidad = {$param['USD']} then '3plan_usd' end desglose

                            FROM
                             mod_planifinversiones.dat_inversion inv
                             left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                             left join mod_planifinversiones.dat_presupplan ppplan on(pp.idpresanteproy = ppplan.idpresanteproy)
                             where inv.idestructuracomun in ({$param['identidad']})
                             and ppplan.idejercicio in ({$idEjercicio}) and inv.idinversion = {$param['idinversion']}

                             union

                             SELECT
                             ppproy.idpresupproyectado as id,
                             pp.idmonedaentidad,
                             COALESCE(ppproy.valor,0) as valor,
                             ppproy.idejercicio,
                             case when pp.idmonedaentidad = {$param['MP']} then '4proyec_mp'
                                  when pp.idmonedaentidad = {$param['USD']} then '4proyec_usd' end desglose

                            FROM
                             mod_planifinversiones.dat_inversion inv
                             left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                             left join mod_planifinversiones.dat_presupproyectado ppproy on(pp.idpresanteproy = ppproy.idpresanteproy)
                             where inv.idestructuracomun in ({$param['identidad']})
                             and ppproy.idejercicio in ({$idEjercicio}) and inv.idinversion = {$param['idinversion']}

                             order by desglose";
        // print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public static function listarDatosContado($inversiones, $idmoneda) {
        $conn = Doctrine_Manager::connection();
        $sql_query = " select Coalesce(SUM(invcontplan.valor),0) as suma
                       from mod_planifinversiones.dat_inverscontadoplan invcontplan 
                       where invcontplan.idinversion in ($inversiones) and invcontplan.idmonedaentidad in ($idmoneda) ";
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public static function listarMonedasEntidad($idmoneda) {
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT idmonedaentidad, idmoneda, tipomoneda, idestructuracomun
                FROM mod_datosmaestros.dat_monedaentidad mn where mn.idmoneda = $idmoneda";
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public static function CalcularTotalInversionByAnno($idinversion, $idejercicio
    ) {
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT distinct ( et.idinversion) , sum(plan.valor) valplan , sum(pro.valor ) valpro ,sum(ejec.valor) valejec, sum(est.valor) valest
                      FROM mod_planifinversiones.dat_etapainversion  et
                      left JOIN mod_planifinversiones.dat_inversetapaplan plan ON (et.idetapainversion = plan.idetapainversion and plan.idejercicio = $idejercicio and plan.idmoneda = 9900000103)
                      left JOIN mod_planifinversiones.dat_inversetapaproyectado pro ON (et.idetapainversion = pro.idetapainversion and pro.idejercicio = $idejercicio and pro.idmoneda = 9900000103)
                      left JOIN mod_planifinversiones.dat_inversetapaejecutado ejec ON (et.idetapainversion = ejec.idetapainversion and ejec.idejercicio = $idejercicio and ejec.idmoneda = 9900000103)
                      left JOIN mod_planifinversiones.dat_inversetapaestimado est ON (et.idetapainversion = est.idetapainversion and est.idejercicio = $idejercicio and est.idmoneda = 9900000103)
                      WHERE et.idinversion = $idinversion
                      GROUP BY et.idinversion";
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public static function listarInversionesConstrucMontaje($entidades, $idejercicio, $forma
    ) {

        if ($forma != "") {
            $ADDWHERE = " and inv.idformapropiedad in (" . $forma . ")";
        } else {
            $ADDWHERE = "";
        }
        $conn = Doctrine_Manager::connection();
        $sql_query = "Select DISTINCT (inv.idinversion), inv.denominacion,df.denominacion as forma ,inv.idestructuracomun, estruct.denominacion as denominacioneentidad,
            prov.denominacion as provincia, prov.iddpt,inv.codigo
            from mod_planifinversiones.dat_inversion inv
             INNER JOIN mod_planifinversiones.dat_formapropiedad forma ON (forma.idformapropiedad = inv.idformapropiedad) 
              INNER JOIN mod_planificacion.nom_datosnomenclador df ON (df.iddatosnomenclador = forma.iddatosnomenclador)
            INNER JOIN mod_estructuracomp.dat_estructura estruct on(inv.idestructuracomun = estruct.idestructura) 
            INNER JOIN mod_datosmaestros.nom_dpt prov on(inv.idprovincia = prov.iddpt)
            WHERE inv.idestructuracomun IN($entidades) AND inv.idejercicio = $idejercicio  $ADDWHERE
            ORDER BY estruct.denominacion";
        //print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public static function listarDenomOrganismo($idorganismo) {
        $conn = Doctrine_Manager::connection();
        $sql_query = "Select est.denominacion
            from mod_estructuracomp.dat_estructura est
            WHERE est.idestructura = $idorganismo";
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public static function listarConstProv($idejercicio, $idinversion) {
        $conn = Doctrine_Manager::connection();
        $sql_query = "Select DISTINCT (inv.idinversion), inv.denominacion,cons.idconstructor, ei.idetapainversion,
          ndn.denominacion as denomconstructor, prov1.denominacion as provconstructor, eicpplan.valor as valormp, eicpplan1.valor as valorusd
            from mod_planifinversiones.dat_inversion inv
            INNER JOIN mod_planifinversiones.dat_etapainversion ei on(inv.idinversion = ei.idinversion)
            INNER JOIN mod_planifinversiones.dat_etapinverconsprov eicp on(ei.idetapainversion = eicp.idetapainversion)
           INNER JOIN mod_planifinversiones.dat_constructor cons on(eicp.idconstructor = cons.idconstructor)
            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on(cons.iddatosnomenclador = ndn.iddatosnomenclador)
            INNER JOIN mod_datosmaestros.nom_dpt prov1 on(eicp.iddpt = prov1.iddpt)
             LEFT JOIN mod_planifinversiones.dat_etapinverconsprovplan eicpplan on(eicp.idetapinverconsprov = eicpplan.idetapinverconsprov AND eicpplan.idmoneda = 9900000103 )
             LEFT JOIN mod_planifinversiones.dat_etapinverconsprovplan eicpplan1 on(eicp.idetapinverconsprov = eicpplan1.idetapinverconsprov AND eicpplan1.idmoneda = 9900000046 )
            WHERE inv.idinversion = $idinversion AND inv.idejercicio = $idejercicio";
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarIdEtapa($parametros, $idetapa) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select  eiv.idetapainversion
                       from mod_planifinversiones.dat_etapainversion eiv 
                       INNER JOIN mod_planifinversiones.dat_etapa et ON (eiv.idetapa =et.idetapa)
                       INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                       WHERE  eiv.idinversion =  " . $parametros['idinversion']
                . "
                             AND et.idetapa =  " . $idetapa . "";
        $datosL = $conn->execute($sql);
        $data = $datosL->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function cargarDesglose($datosInv, $moneda) {
        $conn = Doctrine_Manager::connection();
        $sql = "Select  COALESCE( sum(ejec.valor),0) as ejec, COALESCE( sum(estim.valor),0) as est,
         COALESCE( sum(pla.valor),0) as plan, COALESCE( sum(pro.valor),0) as proy
        FROM mod_planifinversiones.dat_etapainversion eiv
        INNER JOIN mod_planifinversiones.dat_etapinverconsprov etc ON ( eiv.idetapainversion = etc.idetapainversion)
        LEFT JOIN mod_planifinversiones.dat_etapinverconsprovejecutado ejec ON ( etc.idetapinverconsprov = ejec.idetapinverconsprov AND  ejec.idmoneda =  $moneda )
        LEFT JOIN mod_planifinversiones.dat_etapinverconsprovestimado estim ON (etc.idetapinverconsprov = estim.idetapinverconsprov AND estim.idmoneda = $moneda)
        LEFT JOIN mod_planifinversiones.dat_etapinverconsprovplan pla ON (etc.idetapinverconsprov = pla.idetapinverconsprov AND  pla.idmoneda =  $moneda )
        LEFT JOIN mod_planifinversiones.dat_etapinverconsprovproyeccion pro ON (etc.idetapinverconsprov = pro.idetapinverconsprov AND  pro.idmoneda = $moneda )
        INNER JOIN mod_planifinversiones.dat_inversion inv ON (inv.idinversion = eiv.idinversion)
        WHERE  eiv.idinversion =  " . $datosInv['idinversion'] . "";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function obtenerMonedasPorEntidad($identidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idmonedaentidad, m.idmoneda,m.codigoiso,m.nombremoneda, idestructuracomun
                      FROM mod_datosmaestros.dat_monedaentidad me
                      inner join mod_datosmaestros.nom_moneda m on (me.idmoneda = m.idmoneda)
                      where idestructuracomun = $identidad";
        //print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function arbolEntidades($identidad) {
        $query = " SELECT f5.idfila as idestructura
                    FROM mod_estructuracomp.nom_filaestruc f5
                    WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE f3.idfila = $identidad)
                    AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE f4.idfila = $identidad)
                    AND f5.rgt -f5.lft =1";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);

        return $result;
    }

    public function GuardarInversionEtapaDesglose($tabla, $idmoneda, $idejercicio, $idetapainversion, $valor) {
        $guardar = Doctrine::getTable($tabla)->findByDql(
                "idmoneda = {$idmoneda}
                    and idejercicio = {$idejercicio}
                    and idetapainversion = {$idetapainversion}"
        );

        if (isset($guardar[0])) {
            if ($objguardar[0]->valor != $valor) {
                $guardar[0]->valor = $valor;
                $guardar->save();
                
            }
        } else {
            $guardar = new $tabla();
            $guardar->idmoneda = $idmoneda;
            $guardar->idejercicio = $idejercicio;
            $guardar->idetapainversion = $idetapainversion;
            $guardar->valor = $valor;
            $guardar->save();
        }
    }

    public function EliminarInversionEtapaDesglose($tabla, $idmoneda, $idejercicio, $idetapainversion
    ) {

        $query = new Doctrine_Query();
        $query->delete()
                ->from($tabla)
                ->where(
                        'idmoneda=? AND idejercicio=? AND idetapainversion=?', array($idmoneda, $idejercicio, $idetapainversion)
                )
                ->execute();
    }

    public function EliminarInversionConstrE($tabla, $idmoneda, $idejercicio, $idetapinverconsprov
    ) {
        /*
          $query = new Doctrine_Query();
          $query->delete()
          ->from($tabla)
          ->where('idmoneda=? AND idejercicio=? AND idetapinverconsprov=?', array($idmoneda, $idejercicio, $idetapinverconsprov))
          ->execute(); */
        if ($idetapinverconsprov == '') {
            return -1;
        } else {
            $array_parametros = array();
            $array_parametros[0] = $idmoneda;
            $array_parametros[1] = $idejercicio;
            $array_parametros[2] = $idetapinverconsprov;
            $conn = Doctrine_Manager::connection();
            $query = "DELETE FROM " . $tabla . " 
                         WHERE idmoneda = ?  
                         AND idejercicio = ? 
                         AND idetapinverconsprov = ? ";
            //   print_r($array_parametros);die;
            $conn->execute(
                    $query, $array_parametros
            ); //de1.iddesgloseentidad = de.iddesgloseentidad
        }
    }

    public function TotalPlanEjercicioActualOtrosIndicadores($inversiones, $params, $arrOtrosIndicadores
    ) {
        $conn = Doctrine_Manager::connection();

        $where = "";
        if ($arrOtrosIndicadores) {
            $where = " and noi.idnomotrosindicadores in ($arrOtrosIndicadores)";
        }

        $sql = "select
                    SUM(r.plan) as totalindicador, r.denominacion, r.idnomotrosindicadores
                    from
                    (
                    SELECT oi.plan, noi.denominacion, noi.idnomotrosindicadores, di.idinversion
                    FROM mod_planifinversiones.dat_inversion di
                    inner join mod_planifinversiones.dat_otrosindicadares oi on (di.idinversion = oi.idinversion  and oi.idejercicio = "
                . $params['idejercicio'] . ")
                    inner join mod_planifinversiones.nom_otrosindicadores noi on (oi.idnomotrosindicadores = noi.idnomotrosindicadores)
                    where di.idinversion in (" . $inversiones . ")
                    and di.idejercicio = " . $params['idejercicio'] . "
                    $where
                     )r
                    group by r.denominacion, r.idnomotrosindicadores
                    having SUM(r.plan) <> 0
                    order by r.denominacion";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    //hom?logo del m?todo TotalPlanEjercicioActualOtrosIndicadores
// implementado para el reporte  Maqueta
//en la nueva soluci?n en el componente Reportes

    public function TotalPlanEjercicioActualOtrosIndicadoresNS($inversiones, $params, $arrOtrosIndicadores
    ) {
        $conn = Doctrine_Manager::connection();

        $where = "";
        if ($arrOtrosIndicadores) {
            $where = " and noi.idnomotrosindicadores in ($arrOtrosIndicadores)";
        }
        if ($inversiones == '') {
            $inversiones = 0;
        }

        $sql = "select
                    COALESCE(SUM(r.plan),0) as totalindicador, r.denominacion, r.idnomotrosindicadores
                    from
                    (
                    SELECT oi.plan, noi.denominacion, noi.idnomotrosindicadores, i.idinversion
                    FROM mod_planifinversiones.dat_inversion i
                    inner join mod_planifinversiones.dat_otrosindicadares oi on (i.idinversion = oi.idinversion  and oi.idejercicio = "
                . $params['idejercicio'] . ")
                    inner join mod_planifinversiones.nom_otrosindicadores noi on (oi.idnomotrosindicadores = noi.idnomotrosindicadores)
                    where i.eliminada = 0 AND i.idestadoinversion = 1 AND i.idinversion in (" . $inversiones . ")
                    and ( {$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                      and
                      {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                    ) and oi.plan <> 0
                    {$params['cadenaWHERE']}
                    $where
                     )r
                    group by r.denominacion, r.idnomotrosindicadores
                    having SUM(r.plan) <> 0
                    order by r.denominacion";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getInversionesDadoEntidadesYFormaPropiedad($idejercicio, $entidades, $formasdepropiedad
    ) {

        $where = "";
        if ($formasdepropiedad) {
            $where = "AND inv.idformapropiedad IN($formasdepropiedad)";
        }
        $sql_query = "Select inv.idinversion, inv.denominacion from mod_planifinversiones.dat_inversion inv
            where inv.idejercicio = $idejercicio AND inv.idestructuracomun IN($entidades) $where";
// print_r('<pre>');print_r($sql_query);die('ddsdsds');
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    //hom?logo del m?todo getInversionesDadoEntidadesYFormaPropiedad
// implementado para el reporte  Maqueta
//en la nueva soluci?n en el componente Reportes
    public function getInversionesDadoEntidadesYFormaPropiedadNS($idejercicio, $entidades, $params, $formasdepropiedad
    ) {


        $where = "";
        if ($formasdepropiedad) {
            $form = implode(',', $formasdepropiedad);
            $where = "AND i.idformapropiedad IN($form)";
        }
        $sql_query = "Select i.idinversion, i.denominacion from mod_planifinversiones.dat_inversion i
            where i.eliminada = 0 AND i.idestadoinversion = 1 AND ({$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                      and
                      {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                  )
            AND i.idestructuracomun IN($entidades)
            $where
            {$params['cadenaWHERE']}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sql_query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function TotalPlanEjercicioActualPorCadaFinancista($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();

        $sql = "select
                SUM(r.valor) as totalacreedor, r.denominacion, r.iddatosnomenclador, r.codigoiso
                from
                (
                SELECT  mo.idmoneda, fp.valor, dn.denominacion, dn.iddatosnomenclador, di.codigo, mo.codigoiso, di.idinversion
                FROM mod_planifinversiones.dat_inversion di
                inner join mod_planifinversiones.dat_inversfinancistaplan fp on (di.idinversion = fp.idinversion  and fp.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_planifinversiones.dat_financista fta on (fp.idfinancista = fta.idfinancista)
                inner join mod_planificacion.nom_datosnomenclador dn ON(fta.iddatosnomenclador = dn.iddatosnomenclador)
                inner join mod_datosmaestros.dat_monedaentidad me on (fp.idmonedaentidad = me.idmonedaentidad)
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                where di.eliminada = 0 AND di.idestadoinversion = 1 AND mo.codigoiso in ($arrMonedas)
                and di.idinversion in (" . $inversiones . ")
                and di.idejercicio = " . $params['idejercicio'] . "
                 )r
                group by r.denominacion, r.iddatosnomenclador, r.codigoiso
                having SUM(r.valor) <> 0
                order by r.denominacion ";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    //hom?logo del m?todo TotalPlanEjercicioActualPorCadaFinancista
// implementado para el reporte  Maqueta
//en la nueva soluci?n en el componente Reportes
    public function TotalPlanEjercicioActualPorCadaFinancistaNS($inversiones, $params, $arrMonedas) {
        $conn = Doctrine_Manager::connection();
        if ($inversiones == '') {
            $inversiones = 0;
        }

        $sql = "select
                COALESCE(SUM(r.valor),0) as totalacreedor, r.denominacion, r.iddatosnomenclador, r.codigoiso
                from
                (
                SELECT  mo.idmoneda, fp.valor, dn.denominacion, dn.iddatosnomenclador, i.codigo, mo.codigoiso, i.idinversion
                FROM mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_inversfinancistaplan fp on (i.idinversion = fp.idinversion  and fp.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_planifinversiones.dat_financista fta on (fp.idfinancista = fta.idfinancista)
                inner join mod_planificacion.nom_datosnomenclador dn ON(fta.iddatosnomenclador = dn.iddatosnomenclador)
                inner join mod_datosmaestros.dat_monedaentidad me on (fp.idmonedaentidad = me.idmonedaentidad)
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                where i.eliminada = 0 AND i.idestadoinversion = 1 AND mo.codigoiso in ($arrMonedas)
                and i.idinversion in (" . $inversiones . ")
                and ( {$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                      and
                      {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                  ) and fp.valor <> 0
                {$params['cadenaWHERE']}
                 )r
                group by r.denominacion, r.iddatosnomenclador, r.codigoiso
                having SUM(r.valor) <> 0
                order by r.denominacion ";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function TotalPlanEjercicioActualComponentes($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();
        $sql = "select
                SUM(r.valor) as totalComp, r.denominacion, r.idnombreetapa,r.codigoiso
                from
                (
                SELECT  iep.idmoneda, iep.valor,ne.denominacion, ne.idnombreetapa,di.codigo,iep.idetapainversion,mo.codigoiso
                FROM mod_planifinversiones.dat_inversion di
                inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = di.idinversion)
                inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                inner join mod_planifinversiones.dat_inversetapaplan iep on (iep.idetapainversion = ei.idetapainversion and iep.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = iep.idmoneda)
                where mo.codigoiso in ( $arrMonedas )
                and di.idinversion in (" . $inversiones . ")
                and di.idejercicio = " . $params['idejercicio'] . "
                )r
                group by r.denominacion, r.idnombreetapa, r.codigoiso
                having SUM(r.valor) <> 0
                order by r.denominacion";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    //hom?logo del m?todo TotalPlanEjercicioActualComponentes
// implementado para el reporte  Maqueta
//en la nueva soluci?n en el componente Reportes
    public function TotalPlanEjercicioActualComponentesNS($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();
        if ($inversiones == '') {
            $inversiones = 0;
        }
        $sql = "select
                COALESCE(SUM(r.valor), 0) as totalComp, r.denominacion, r.idnombreetapa,r.codigoiso
                from
                (
                SELECT  iep.idmoneda, iep.valor,ne.denominacion, ne.idnombreetapa,i.codigo,iep.idetapainversion,mo.codigoiso
                FROM mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_etapainversion ei on (ei.idinversion = i.idinversion)
                inner JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                inner JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                inner join mod_planifinversiones.dat_inversetapaplan iep on (iep.idetapainversion = ei.idetapainversion
                and iep.idejercicio = " . $params['idejercicio'] . ")
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = iep.idmoneda)
                where i.eliminada = 0 AND i.idestadoinversion = 1 AND mo.codigoiso in ( $arrMonedas )
                and i.idinversion in (" . $inversiones . ")
                and ( {$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                      and
                      {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                  ) and iep.valor <> 0
                {$params['cadenaWHERE']}
                )r
                group by r.denominacion, r.idnombreetapa, r.codigoiso
                having SUM(r.valor) <> 0
                order by r.denominacion";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function TotalPlanEjercicioActualContado($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();

        $sql = "select
                SUM(r.valor) as totalContado,r.idmoneda, r.codigoiso
                from
                (
                SELECT  mo.idmoneda, cp.valor, i.codigo,mo.codigoiso
                FROM mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_inverscontadoplan cp on (i.idinversion = cp.idinversion and cp.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_datosmaestros.dat_monedaentidad me on (cp.idmonedaentidad = me.idmonedaentidad)
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                where mo.codigoiso in ($arrMonedas)
                and i.idinversion in  (" . $inversiones . ")
                and i.idejercicio = " . $params['idejercicio'] . "
                )r
                group by r.idmoneda, r.codigoiso
                having SUM(r.valor) <> 0";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    //hom?logo del m?todo TotalPlanEjercicioActualContado
// implementado para el reporte  Maqueta
//en la nueva soluci?n en el componente Reportes
    public function TotalPlanEjercicioActualContadoNS($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();

        if ($inversiones == '') {
            $inversiones = 0;
        }

        $sql = "select
                COALESCE(SUM(r.valor), 0) as totalContado,r.idmoneda, r.codigoiso
                from
                (
                SELECT  mo.idmoneda, cp.valor, i.codigo,mo.codigoiso
                FROM mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_inverscontadoplan cp on (i.idinversion = cp.idinversion and cp.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_datosmaestros.dat_monedaentidad me on (cp.idmonedaentidad = me.idmonedaentidad)
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                where mo.codigoiso in ($arrMonedas)
                and i.eliminada = 0 AND i.idestadoinversion = 1 AND i.idinversion in  (" . $inversiones . ")
                and ( {$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                      and
                      {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                  ) and cp.valor <> 0
                {$params['cadenaWHERE']}
                )r
                group by r.idmoneda, r.codigoiso
                having SUM(r.valor) <> 0";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function TotalPlanEjercicioActualCredito($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();

        $sql = "select
                SUM(r.valor) as totalAcreedores,r.idmoneda, r.codigoiso
                from
                (
                SELECT  mo.idmoneda, fp.valor, i.codigo,mo.codigoiso
                FROM mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_inversfinancplan fp on (i.idinversion = fp.idinversion and fp.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_datosmaestros.dat_monedaentidad me on (fp.idmonedaentidad = me.idmonedaentidad)
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                where mo.codigoiso in ($arrMonedas)
                and i.idinversion in (" . $inversiones . ")
                and i.idejercicio = " . $params['idejercicio'] . "
                )r
                group by r.idmoneda, r.codigoiso
                having SUM(r.valor) <> 0";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    //hom?logo del m?todo TotalPlanEjercicioActualCredito
// implementado para el reporte  Maqueta
//en la nueva soluci?n en el componente Reportes
    public function TotalPlanEjercicioActualCreditoNS($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();
        if ($inversiones == '') {
            $inversiones = 0;
        }

        $sql = "select
                COALESCE(SUM(r.valor), 0) as totalAcreedores,r.idmoneda, r.codigoiso
                from
                (
                SELECT  mo.idmoneda, fp.valor, i.codigo,mo.codigoiso
                FROM mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_inversfinancplan fp on (i.idinversion = fp.idinversion and fp.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_datosmaestros.dat_monedaentidad me on (fp.idmonedaentidad = me.idmonedaentidad)
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                where i.eliminada = 0 AND i.idestadoinversion = 1 AND mo.codigoiso in ($arrMonedas)
                and i.idinversion in (" . $inversiones . ")
                and ( {$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                      and
                      {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                  ) and fp.valor <> 0
                {$params['cadenaWHERE']}
                )r
                group by r.idmoneda, r.codigoiso
                having SUM(r.valor) <> 0";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function TotalPlanEjercicioActualQuienFinancia($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();

        $sql = "select
                SUM(r.valor) as totalquienfinancia,r.idmoneda, r.codigoiso
                from
                (
                SELECT  mo.idmoneda, fp.valor, i.codigo,mo.codigoiso
                FROM mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_inversfinancistaplan fp on (i.idinversion = fp.idinversion and fp.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_datosmaestros.dat_monedaentidad me on (fp.idmonedaentidad = me.idmonedaentidad)
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                where mo.codigoiso in ($arrMonedas)
                and i.idinversion in (" . $inversiones . ")
                and i.idejercicio = " . $params['idejercicio'] . "
                )r
                group by r.idmoneda, r.codigoiso
                having SUM(r.valor) <> 0";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    //hom?logo del m?todo TotalPlanEjercicioActualQuienFinancia
// implementado para el reporte  Maqueta
//en la nueva soluci?n en el componente Reportes
    public function TotalPlanEjercicioActualQuienFinanciaNS($inversiones, $params, $arrMonedas
    ) {

        $conn = Doctrine_Manager::connection();
        if ($inversiones == '') {
            $inversiones = 0;
        }

        $sql = "select
                COALESCE(SUM(r.valor), 0) as totalquienfinancia,r.idmoneda, r.codigoiso
                from
                (
                SELECT  mo.idmoneda, fp.valor, i.codigo,mo.codigoiso
                FROM mod_planifinversiones.dat_inversion i
                inner join mod_planifinversiones.dat_inversfinancistaplan fp on (i.idinversion = fp.idinversion and fp.idejercicio = "
                . $params['idejercicio'] . ")
                inner join mod_datosmaestros.dat_monedaentidad me on (fp.idmonedaentidad = me.idmonedaentidad)
                inner join mod_datosmaestros.nom_moneda mo on (mo.idmoneda = me.idmoneda)
                where i.eliminada = 0 AND i.idestadoinversion = 1 AND mo.codigoiso in ($arrMonedas)
                and i.idinversion in (" . $inversiones . ")
                and ( {$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric
                      and
                      {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric
                  ) and fp.valor <> 0
                {$params['cadenaWHERE']}
                )r
                group by r.idmoneda, r.codigoiso
                having SUM(r.valor) <> 0";

        //print_r($sql);die;

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function ComponentesByIdEtapa($etapas) {

        $conn = Doctrine_Manager::connection();
        $ADDWHERE = "";
        if ($etapas) {
            $ADDWHERE = " WHERE et.idetapa in (" . $etapas . ")";
        } else {
            $ADDWHERE = "";
        }

        $sql = "select distinct ne.denominacion,ne.idnombreetapa
		        FROM mod_planifinversiones.dat_etapa et
                LEFT JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa =ne.idnombreetapa)
                $ADDWHERE";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function BuscarDesglosePlan($tabla, $idTabla, $valor, $idmonedaentidad, $idejercicio, $idinversion, $idestructura
    ) {
        //print_r($params);die;
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                 ppejec." . $idTabla . " as id,
                 ppejec.valor,
                 ppejec.idejercicio
                FROM
                 mod_planifinversiones.dat_inversion inv
                 left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                 left join mod_planifinversiones." . $tabla . " ppejec on(pp.idpresanteproy = ppejec.idpresanteproy)
                 where inv.idestructuracomun in ($idestructura)
                 and ppejec.idejercicio = $idejercicio and inv.idinversion = $idinversion and pp.idmonedaentidad = $idmonedaentidad";

        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function addvalorGlobalPlanPreparacion($tabla, $valor, $planPrep, $ejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "INSERT INTO  mod_planifinversiones." . $tabla . " (idpresanteproy,idejercicio,valor)
                VALUES (" . $planPrep . "," . $ejercicio . "," . $valor . ");";
        //print_r($sql);die;
        $res1 = $conn->execute($sql);
        return $res1;
    }

    public function getDatosInversiones($params) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        if ($params['inversionestipoMedioAmb'] != '')
            $whereTipo = " and nom.nombrecampo = '{$params['inversionestipoMedioAmb']}'";
        else
            $whereTipo = " ";

        $cadenaSELECT = " SELECT DISTINCT COALESCE(oi.plan::numeric(19,0),0) as contratacionexterna,COALESCE(oifb.plan::numeric(19,0),0) as fondosbasicos,
                          --ne.denominacion as nombreetapa,ne.idnombreetapa,eti.idetapainversion as idetapa,
                          i.idestructuracomun,memp.idmonedaentidad as mp,meusd.idmonedaentidad as usd,i.idinversion,
                          i.denominacion,i.codigo,i.fechainicio,i.fechafin,ti.denominacion as tipoinversion,
                          ei.denominacion as estadoinversion,dn.denominacion as formapropiedad,dpt.denominacion as provincia,
                          dnp.denominacion as programa, 'Ninguna' as naturaleza, dnma.denominacion as medioambiente,
                          dno.denominacion as objetivo,dnec.denominacion as efectocomercial,
                          e.denominacion as entidad,ep.denominacion as organismo,i.observaciones,
                          COALESCE(dngo.denominacion,'-') as grupoobra,COALESCE(dnse.denominacion,'-') as sector";
        $cadenaJOIN = " FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.nom_tipoinversion ti ON i.idtipoinversion = ti.idtipoinversion
                        INNER JOIN mod_planifinversiones.nom_estadoinversion ei ON i.idestadoinversion = ei.idestadoinversion
                        INNER JOIN mod_planifinversiones.dat_formapropiedad fp ON i.idformapropiedad = fp.idformapropiedad
                        INNER JOIN mod_planificacion.nom_datosnomenclador dn ON fp.iddatosnomenclador = dn.iddatosnomenclador
                        INNER JOIN mod_planifinversiones.dat_programa p ON i.idprograma = p.idprograma
                        INNER JOIN mod_planificacion.nom_datosnomenclador dnp ON p.iddatosnomenclador = dnp.iddatosnomenclador
                        INNER JOIN mod_planifinversiones.dat_medioambiente ma ON i.idmedioambiente = ma.idmedioambiente
                        INNER JOIN mod_planificacion.nom_datosnomenclador dnma ON ma.iddatosnomenclador = dnma.iddatosnomenclador
                        INNER JOIN mod_planifinversiones.dat_objetivo o ON i.idobjetivo = o.idobjetivo
                        INNER JOIN mod_planificacion.nom_datosnomenclador dno ON o.iddatosnomenclador = dno.iddatosnomenclador
                        INNER JOIN mod_planifinversiones.dat_efectocomercial ec ON i.idefectocomercial = ec.idefectocomercial
                        INNER JOIN mod_planificacion.nom_datosnomenclador dnec ON ec.iddatosnomenclador = dnec.iddatosnomenclador


                        INNER JOIN mod_planifinversiones.dat_etapainversion eti ON eti.idinversion = i.idinversion
                        INNER JOIN mod_planifinversiones.dat_etapa et ON et.idetapa = eti.idetapa
                        INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON ne.idnombreetapa = et.idnombreetapa
                        INNER JOIN mod_datosmaestros.dat_monedaentidad memp ON (memp.idestructuracomun = i.idestructuracomun AND memp.idmoneda = 9900000103)
                        INNER JOIN mod_datosmaestros.dat_monedaentidad meusd ON (meusd.idestructuracomun = i.idestructuracomun AND meusd.idmoneda = 9900000046)

                        LEFT JOIN mod_planifinversiones.dat_otrosindicadares oi ON (oi.idinversion = i.idinversion AND oi.idejercicio = {$params['idejercicio']} AND oi.idnomotrosindicadores = 122)
                        LEFT JOIN mod_planifinversiones.dat_otrosindicadares oifb ON (oifb.idinversion = i.idinversion AND oifb.idejercicio = {$params['idejercicio']} AND oifb.idnomotrosindicadores = 124)

                        LEFT JOIN mod_planifinversiones.dat_grupoobra go ON go.idgrupoobra = i.idgrupoobra
                        LEFT JOIN mod_planificacion.nom_datosnomenclador dngo ON go.iddatosnomenclador = dngo.iddatosnomenclador
                        LEFT JOIN mod_planifinversiones.dat_sectorestrategico se ON se.idsectorestrategico = i.idsectorestrategico
                        LEFT JOIN mod_planificacion.nom_datosnomenclador dnse ON se.iddatosnomenclador = dnse.iddatosnomenclador
                        LEFT JOIN mod_datosmaestros.nom_dpt dpt ON dpt.iddpt = i.idprovincia
                        LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = i.idestructuracomun
                        LEFT JOIN mod_estructuracomp.dat_estructura e ON nfe.idfila = e.idestructura
                        LEFT JOIN mod_estructuracomp.dat_estructura ep ON nfe.idpadre = ep.idestructura

                        INNER JOIN mod_planifinversiones.dat_medioambglobal glo ON (glo.idinversion = i.idinversion)
                        INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = glo.idnomenclador)
                        ";
        $cadenaWHERE = " WHERE i.eliminada = 0 and i.idestadoinversion=1 and ({$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric and {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric)"
                . $params['cadenaWHERE'] . $whereTipo;

        //print_r($params['filtros']);die;


        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE
                . " ORDER BY i.idinversion DESC";
//pre_r($cadenaQUERY);die;


        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($cadenaQUERY);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getDatosRptMINCEX($params) {
// print_r($params);die;
        $cadenaSELECT = " SELECT COALESCE(oi.plan::numeric(19, 0), 0) as contratacionexterna,
                            (
                              select coalesce(sum(ev.valor), 0)
                              from mod_planifinversiones.dat_etapainversion eti
                                   inner join mod_planifinversiones.dat_inversetapaplan ev on (ev.idetapainversion = eti.idetapainversion)
                              where eti.idinversion = i.idinversion and
                                    ev.idmoneda = 9900000046 and
                                    ev.idejercicio = {$params['idejercicio']}
                            ) as planusd,
                            
                            (
                                coalesce ((SELECT 
                                     dppp.valor
                                 FROM
                                     mod_planifinversiones.dat_presanteproy dpp
                                     INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dpp.idmonedaentidad = dme.idmonedaentidad)
                                     INNER JOIN mod_planifinversiones.dat_presupplan dppp ON (dpp.idpresanteproy = dppp.idpresanteproy)
                                 WHERE
                                     dpp.idinversion = i.idinversion AND 
                                     dppp.idejercicio = {$params['idejercicio']}
                                     AND dme.idmoneda = 9900000103), 0)
                            ) as ppmp,

                            i.idestructuracomun,
                            i.idinversion,
                            i.denominacion,
                            i.codigo,
                            i.fechainicio,
                            i.fechafin,
                            dntip.denominacion as tipoinversion,
                            ei.denominacion as estadoinversion,
                            dn.denominacion as formapropiedad,
                            dpt.denominacion as provincia,
                            dnp.denominacion as programa,
                            dnma.denominacion as medioambiente,
                            dno.denominacion as objetivo,
                            dnec.denominacion as efectocomercial,
                            e.denominacion as entidad,
                            ep.denominacion as organismo,
                            i.observaciones,
                            COALESCE(dngo.denominacion, '-') as grupoobra,
                            COALESCE(dnse.denominacion, '-') as sector";
        $cadenaJOIN = " FROM mod_planifinversiones.dat_inversion i
                             
                       INNER JOIN mod_planifinversiones.dat_tipoinversionprograma invprog ON (invprog.idtipoinversionprograma = i.idtipoinversionprograma)
                       INNER JOIN mod_planificacion.nom_datosnomenclador dntip ON invprog.iddatosnomenclador = dntip.iddatosnomenclador
                       
                            LEFT JOIN mod_planifinversiones.nom_estadoinversion ei ON (i.idestadoinversion = ei.idestadoinversion)
                            LEFT JOIN mod_planifinversiones.dat_formapropiedad fp ON (i.idformapropiedad = fp.idformapropiedad)
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dn ON (fp.iddatosnomenclador = dn.iddatosnomenclador)
                            LEFT JOIN mod_planifinversiones.dat_programa p ON (i.idprograma = p.idprograma)
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dnp ON (p.iddatosnomenclador = dnp.iddatosnomenclador)
                            LEFT JOIN mod_planifinversiones.dat_medioambiente ma ON (i.idmedioambiente = ma.idmedioambiente)
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dnma ON (ma.iddatosnomenclador = dnma.iddatosnomenclador)
                            LEFT JOIN mod_planifinversiones.dat_objetivo o ON (i.idobjetivo = o.idobjetivo)
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dno ON (o.iddatosnomenclador = dno.iddatosnomenclador)
                            LEFT JOIN mod_planifinversiones.dat_efectocomercial ec ON (i.idefectocomercial = ec.idefectocomercial)
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dnec ON (ec.iddatosnomenclador = dnec.iddatosnomenclador)     
                            LEFT JOIN mod_planifinversiones.dat_otrosindicadares oi ON (oi.idinversion = i.idinversion AND oi.idejercicio = {$params['idejercicio']} AND oi.idnomotrosindicadores = 122)
                            LEFT JOIN mod_planifinversiones.dat_grupoobra go ON (go.idgrupoobra = i.idgrupoobra)
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dngo ON (go.iddatosnomenclador = dngo.iddatosnomenclador)
                            LEFT JOIN mod_planifinversiones.dat_sectorestrategico se ON (se.idsectorestrategico = i.idsectorestrategico)
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dnse ON (se.iddatosnomenclador = dnse.iddatosnomenclador)
                            LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (dpt.iddpt = i.idprovincia)
                            LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON (nfe.idfila = i.idestructuracomun)
                            LEFT JOIN mod_estructuracomp.dat_estructura e ON (nfe.idfila = e.idestructura)
                            LEFT JOIN mod_estructuracomp.dat_estructura ep ON (nfe.idpadre = ep.idestructura)";
        $cadenaWHERE = " WHERE i.eliminada = 0 and i.idestadoinversion=1 and ({$params['ejercicio']} >= (date_part('year',  i.fechainicio))::numeric and {$params['ejercicio']} <= (date_part('year',  i.fechafin))::numeric)"
                . $params['cadenaWHERE'];

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE
                . " ORDER BY i.denominacion ";
// print_r($cadenaQUERY);die;

        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($cadenaQUERY);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getNombreEtapas() {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = "SELECT * FROM mod_planifinversiones.nom_nombreetapa";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($cadenaQUERY);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getQuienFinancia() {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = "SELECT f.idfinancista,dn.iddatosnomenclador as idfinancia,dn.denominacion
                         FROM mod_planifinversiones.dat_financista f";
        $cadenaJOIN = " INNER JOIN mod_planificacion.nom_datosnomenclador dn
                        ON dn.iddatosnomenclador = f.iddatosnomenclador";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($cadenaQUERY);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getContado($params) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = "SELECT   coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = i.idinversion
        and icplan.idejercicio = {$params['idejercicio']}
        and nomo.idmoneda = 9900000103),0) as contadomp ,

        coalesce ((select SUM(icplan.valor) from mod_planifinversiones.dat_inverscontadoplan icplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = icplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomo ON (nomo.idmoneda = me.idmoneda)
         where icplan.idinversion = i.idinversion
        and icplan.idejercicio = {$params['idejercicio']}
        and nomo.idmoneda = 9900000046),0) as contadousd,
       COALESCE((SELECT 
            sum(difp.valor)
          FROM
            	mod_planifinversiones.dat_inversfinancplan difp
 			INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = difp.idmonedaentidad)
          WHERE 
            difp.idejercicio = {$params['idejercicio']}
  			and me.idmoneda = 9900000046
            and difp.idinversion = i.idinversion
            ), 0) as creditousd

        FROM mod_planifinversiones.dat_inversion i";

        $cadenaWHERE = " WHERE i.eliminada = 0 and  i.idinversion =  {$params['idinversion']}";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
//pre_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($cadenaQUERY);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat[0];
    }

    public function getFinancistasReporte($params) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";


        $cadenaSELECT = " SELECT  s.*";
        $cadenaJOIN = " FROM
              (SELECT distinct(fict.idfinancista),coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000046),0) as planusd,
        coalesce ((select finanplan.valor from mod_planifinversiones.dat_inversfinancistaplan finanplan
         INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (me.idmonedaentidad = finanplan.idmonedaentidad)
         INNER JOIN mod_datosmaestros.nom_moneda nomoneda ON (nomoneda.idmoneda = me.idmoneda)
         where finanplan.idfinancista = fict.idfinancista and  finanplan.idinversion = "
                . $params['idinversion'] . "
        and finanplan.idejercicio = " . $params['idejercicio'] . "
        and nomoneda.idmoneda = 9900000103),0) as planmp, i.idinversion as idinversion,nom.denominacion as quienfinac,
        fict.idfinancista as idfinancista
        FROM mod_planifinversiones.dat_financista fict
        INNER JOIN mod_planifinversiones.dat_financiamiento f  ON f.idfinancista =  fict.idfinancista
        INNER JOIN mod_planifinversiones.dat_inversion i ON (i.idinversion = f.idinversion and i.eliminada = 0)
        INNER JOIN mod_planificacion.nom_datosnomenclador nom ON nom.iddatosnomenclador = fict.iddatosnomenclador
        WHERE i.idinversion = " . $params['idinversion'] . "
                                        Group by
                                        fict.idfinancista,i.idinversion,
                                        quienfinac) as s ";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
//pre_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($cadenaQUERY);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getValorCmpMP($params) {
        $sql = "SELECT 
                        ne.denominacion,
                        ne.idnombreetapa,
                        dip.valor
                      FROM
                        mod_planifinversiones.nom_nombreetapa ne
                        INNER JOIN mod_planifinversiones.dat_etapa de ON (ne.idnombreetapa = de.idnombreetapa)
                        INNER JOIN mod_planifinversiones.dat_etapainversion dei ON (de.idetapa = dei.idetapa)
                        INNER JOIN mod_planifinversiones.dat_inversetapaplan dip ON (dip.idetapainversion = dei.idetapainversion)
                      WHERE
                        dei.idinversion = {$params[idinversion]} AND 
                        dip.idejercicio = {$params[idejercicio]}
                        AND dip.idmoneda = {$params[monedamp]}

                UNION

                SELECT
                        noi.denominacion,
                        NULL as idnombreetapa,
                        COALESCE(oi.plan ,0)as valor
                        FROM mod_planifinversiones.dat_inversion i
                          inner join mod_planifinversiones.dat_otrosindicadoresannospostcant p on (i.idinversion = p.idinversion)
                          INNER JOIN mod_planifinversiones.dat_otrosindicadares oi on(i.idinversion = oi.idinversion)
                          INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(oi.idnomotrosindicadores  = noi.idnomotrosindicadores)
                        WHERE i.eliminada = 0 and i.idinversion = {$params[idinversion]}
                          and oi.idejercicio = {$params[idejercicio]}
                          and noi.idnomotrosindicadores = 118"; /* valor del nomenclador de impacto salarial */
        $conn = Doctrine_Manager::connection();
        //print_r($sql);die;
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getPlanInversion($params, $idmoneda) {
        $sql = "SELECT sum (dip.valor) planMUSD
                    FROM mod_planifinversiones.nom_nombreetapa ne
                         INNER JOIN mod_planifinversiones.dat_etapa de ON (ne.idnombreetapa = de.idnombreetapa)
                         INNER JOIN mod_planifinversiones.dat_etapainversion dei ON (de.idetapa = dei.idetapa)
                         INNER JOIN mod_planifinversiones.dat_inversetapaplan dip ON (dip.idetapainversion = dei.idetapainversion)
                      WHERE
                        dei.idinversion = {$params[idinversion]} AND 
                        dip.idejercicio = {$params[idejercicio]}
                        AND dip.idmoneda = {$idmoneda}";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getPlanContratacion($params) {
        $sql = "SELECT 
                        doi.plan
                      FROM
                        mod_planifinversiones.dat_otrosindicadares doi
                        INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON (doi.idnomotrosindicadores = noi.idnomotrosindicadores)
                      WHERE
                        doi.idnomotrosindicadores = 122 AND
                        doi.idinversion = {$params[idinversion]} AND 
                        doi.idejercicio = {$params[idejercicio]}";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function getPPPlanInvMP($params) {
        $sql = "SELECT 
                    dppp.valor
                FROM
                    mod_planifinversiones.dat_presanteproy dpp
                    INNER JOIN mod_datosmaestros.dat_monedaentidad dme ON (dpp.idmonedaentidad = dme.idmonedaentidad)
                    INNER JOIN mod_planifinversiones.dat_presupplan dppp ON (dpp.idpresanteproy = dppp.idpresanteproy)
                WHERE
                    dpp.idinversion = {$params[idinversion]} AND 
                    dppp.idejercicio = {$params[idejercicio]}
                    AND dme.idmoneda = {$params[monedamp]}";
        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function eliminarGlobal($tabla, $idtext, $id) {
        if ($id != '') {
            $query = new Doctrine_Query();
            $sql_query = "DELETE FROM mod_planifinversiones." . $tabla . "
                            WHERE (" . $idtext . " = " . $id . ")";
            $conn = Doctrine_Manager::connection();
            $conn->execute($sql_query);
        }
    }

    public function listarPlanesPreparacionReporte($param) {

        $conn = Doctrine_Manager::connection();
        $sql_query = " SELECT
                             ppejec.idpresupejecutado as id,
                             pp.idmonedaentidad,
                             COALESCE(ppejec.valor,0) as valor,
                             ppejec.idejercicio,
                             case when pp.idmonedaentidad = {$param['MP']} then '1ejecutado_mp'
                                  when pp.idmonedaentidad = {$param['USD']} then '1ejecutado_usd'
                             end desglose

                            FROM
                             mod_planifinversiones.dat_inversion inv
                             left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                             left join mod_planifinversiones.dat_presupejecutado ppejec on(pp.idpresanteproy = ppejec.idpresanteproy)
                             where ppejec.idejercicio = {$param['idejercicio']} and inv.idinversion = {$param['idinversion']}

                            union

                            SELECT
                             ppest.idpresupestimado as id,
                             pp.idmonedaentidad,
                             COALESCE(ppest.valor,0) as valor,
                             ppest.idejercicio,
                             case when pp.idmonedaentidad = {$param['MP']} then '2estimado_mp'
                                  when pp.idmonedaentidad = {$param['USD']} then '2estimado_usd' end desglose

                            FROM
                             mod_planifinversiones.dat_inversion inv
                             left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                             left join mod_planifinversiones.dat_presupestimado ppest on(pp.idpresanteproy = ppest.idpresanteproy)
                             where ppest.idejercicio = {$param['idejercicio']} and inv.idinversion = {$param['idinversion']}

                             union

                             SELECT
                             ppplan.idpresupplan as id,
                             pp.idmonedaentidad,
                             COALESCE(ppplan.valor,0) as valor,
                             ppplan.idejercicio,
                             case when pp.idmonedaentidad = {$param['MP']} then '3plan_mp'
                                  when pp.idmonedaentidad = {$param['USD']} then '3plan_usd' end desglose

                            FROM
                             mod_planifinversiones.dat_inversion inv
                             left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                             left join mod_planifinversiones.dat_presupplan ppplan on(pp.idpresanteproy = ppplan.idpresanteproy)
                             where ppplan.idejercicio = {$param['idejercicio']} and inv.idinversion = {$param['idinversion']}

                             union

                             SELECT
                             ppproy.idpresupproyectado as id,
                             pp.idmonedaentidad,
                             COALESCE(ppproy.valor,0) as valor,
                             ppproy.idejercicio,
                             case when pp.idmonedaentidad = {$param['MP']} then '4proyec_mp'
                                  when pp.idmonedaentidad = {$param['USD']} then '4proyec_usd' end desglose

                            FROM
                             mod_planifinversiones.dat_inversion inv
                             left join mod_planifinversiones.dat_presanteproy pp on (inv.idinversion = pp.idinversion)
                             left join mod_planifinversiones.dat_presupproyectado ppproy on(pp.idpresanteproy = ppproy.idpresanteproy)
                             where ppproy.idejercicio = {$param['idejercicio']} and inv.idinversion = {$param['idinversion']}

                             order by desglose";
        // print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function eleConsEqValor($params) {
        $ADDWHERE = " ";
        if (count($params['idinvers']) > 0) {
            $idinvers = implode(',', $params['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }
        $conn = Doctrine_Manager::connection();
        $sql_query = "select
                        r.concepto,
                        r.codigo,
                        r.etapa,
                        r.valor,
                        r.estado,
                        (SELECT 
                            nm.codigoiso
                          FROM 
                            mod_datosmaestros.dat_monedaentidad me inner join mod_datosmaestros.nom_moneda nm on (nm.idmoneda = me.idmoneda)
                            where me.idmonedaentidad = r.idmonedaentidad) codigo_iso,
                        (SELECT 
                            denominacion
                          FROM 
                            mod_datosmaestros.nom_dpt nd
                          WHERE nd.iddpt = r.iddpt) as provincia,
                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_constructor dc
                          INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = dc.iddatosnomenclador)
                          WHERE dc.idconstructor = r.idconstructor) as constructor,
                         (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_comprar dc 
                          INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = dc.iddatosnomenclador) 
                          WHERE dc.idcomprar = r.idcomprarpais) as comprar_pais,
                        r.observaciones,
                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_comprar dc 
                          INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = dc.iddatosnomenclador) 
                          WHERE dc.idcomprar = r.idcomprar) as comprar,
                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_adquisicion da  
                          INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = da.iddatosnomenclador) 
                          WHERE da.idadquisicion = r.idadquisicion) as adquisicion,
                        r.importedivisa,
                        r.preciodivisa,
                        r.importe,
                        r.cantidad,
                        (SELECT  
                                      e.denominacion
                          FROM
                            mod_estructuracomp.dat_estructura e
                            INNER JOIN mod_planificacion.dat_entidaddatosnomenclador dn ON (e.idestructura = dn.identidad)
                          WHERE
                            dn.iddatosnomenclador = 1 
                            AND dn.identidaddatosnomenclador = r.idcentrobalance) as centro_balance,

                        (SELECT 
                            nu.denominacionunidadmedida
                          FROM 
                            mod_datosmaestros.nom_unidadmedida nu
                          WHERE nu.idunidadmedida = r.idunidadmedida) as unidad_medida,
                        r.precio,
                        (SELECT 
                            ep.ejercicio
                          FROM 
                            mod_planificacion.nom_ejercicioplanificacion ep
                          WHERE ep.idejercicio = {$params['idejercicio']}) as ejercicio,
                        (SELECT 
                            dm.denominacion
                          FROM
                            mod_planificacion.dat_entidadmodelo em
                            INNER JOIN mod_planificacion.dat_modelo dm ON (em.idmodelo = dm.idmodelo)
                          WHERE em.identidadmodelo = r.identidadmodelo) as modelo,
                        (SELECT 
                            ni.codigo
                          FROM 
                            mod_datosmaestros.nom_indicador ni
                          WHERE ni.idindicador = r.idindicador) as indicador
                      from (
                        SELECT
                          'elemento' as concepto,
                          i.codigo,
                          esta.denominacion as estado,
                          ne.denominacion as etapa,
                          ev.valor,
                          ev.idmonedaentidad,
                          NULL::numeric(19,0) as iddpt,
                          NULL::numeric(19,0) as idconstructor,
                          NULL::numeric(19,0) as idcomprarpais,
                          NULL::varchar(255) as observaciones,
                          NULL::numeric(19,0) as idcomprar,
                          NULL::numeric(19,0) as idadquisicion,
                          NULL::numeric(19,2) as importedivisa,
                          NULL::numeric(19,2) as preciodivisa,
                          NULL::numeric(19,2) as importe,
                          NULL::numeric(19,0) as cantidad,
                          NULL::numeric(19,0) as idcentrobalance,
                          NULL::numeric(19,0) as idunidadmedida,
                          NULL::numeric(19,2) as precio,
                          NULL::numeric(19,0) as idejercicio,
                          NULL::numeric(19,0) as identidadmodelo,
                          NULL::numeric(19,0) as idindicador
                        FROM
                          mod_planifinversiones.dat_inversion i
                          INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                          INNER JOIN mod_planifinversiones.dat_etapa e ON (e.idetapa = ei.idetapa)
                          INNER JOIN mod_planifinversiones.nom_estadosft esta ON (esta.idestadosft = e.idestadoflujotrabajo)
                          INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (ne.idnombreetapa = e.idnombreetapa)
                          INNER JOIN mod_planifinversiones.dat_etapaelementoinversion eei ON (ei.idetapainversion = eei.idetapainversion)
                          LEFT JOIN mod_planifinversiones.dat_elementovalor ev ON (eei.idetapaelementoinversion = ev.idelemento)
                        WHERE
                          i.idestructuracomun = " . $params['identidad'] . " AND ev.valor <> 0 AND ev.valor is not null AND ({$params['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      AND {$params['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric)
                                    $ADDWHERE

                          UNION

                        SELECT
                          'constructor' as concepto,
                          i.codigo,
                          esta.denominacion as estado,
                          ne.denominacion as etapa,
                          NULL::numeric(19,2)  as valor_elemento,
                          NULL::numeric(19,0)  as idmonedaentidad,
                          eicp.iddpt,
                          eicp.idconstructor,
                          NULL::numeric(19,0)  as idcomprarpais,
                          NULL::varchar(255)  as observaciones,
                          NULL::numeric(19,0)  as idcomprar,
                          NULL::numeric(19,0)  as idadquisicion,
                          NULL::numeric(19,2)  as importedivisa,
                          NULL::numeric(19,2)  as preciodivisa,
                          NULL::numeric(19,2)  as importe,
                          NULL::numeric(19,0)  as cantidad,
                          NULL::numeric(19,0)  as idcentrobalance,
                          NULL::numeric(19,0)  as idunidadmedida,
                          NULL::numeric(19,2)  as precio,
                          NULL::numeric(19,0)  as idejercicio,
                          NULL::numeric(19,0)  as identidadmodelo,
                          NULL::numeric(19,0)  as idindicador
                        FROM
                          mod_planifinversiones.dat_inversion i
                          INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                          INNER JOIN mod_planifinversiones.dat_etapinverconsprov eiprov ON (ei.idetapainversion = eiprov.idetapainversion)
                          INNER JOIN mod_planifinversiones.dat_etapa e ON (e.idetapa = ei.idetapa)
                          INNER JOIN mod_planifinversiones.nom_estadosft esta ON (esta.idestadosft = e.idestadoflujotrabajo)
                          INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (ne.idnombreetapa = e.idnombreetapa)
                          LEFT JOIN mod_planifinversiones.dat_etapinverconsprov eicp ON (ei.idetapainversion = eicp.idetapainversion)
                        WHERE
                          i.idestructuracomun = " . $params['identidad'] . " AND ({$params['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      AND {$params['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric)
                                    $ADDWHERE

                          UNION
                          
                        SELECT
                          'equipo' as concepto,
                          i.codigo,
                          esta.denominacion as estado,
                          ne.denominacion as etapa,
                          NULL::numeric(19,2)  as valor_elemento,
                          NULL::numeric(19,0)  as idmonedaentidad,
                          NULL::numeric(19,0)  as iddpt,
                          NULL::numeric(19,0)  as idconstructor,
                          ee.idcomprarpais,
                          ee.observaciones,
                          ee.idcomprar,
                          ee.idadquisicion,
                          ee.importedivisa,
                          ee.preciodivisa,
                          ee.importe,
                          ee.cantidad,
                          ee.idcentrobalance,
                          ee.idunidadmedida,
                          ee.precio,
                          ee.idejercicio,
                          ee.identidadmodelo,
                          ee.idindicador
                        FROM
                          mod_planifinversiones.dat_inversion i
                          INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (i.idinversion = ei.idinversion)
                          INNER JOIN mod_planifinversiones.dat_etapa e ON (e.idetapa = ei.idetapa)
                          INNER JOIN mod_planifinversiones.nom_estadosft esta ON (esta.idestadosft = e.idestadoflujotrabajo)
                          INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (ne.idnombreetapa = e.idnombreetapa)
                          INNER JOIN mod_planifinversiones.dat_etapaequipos ee ON (ei.idetapainversion = ee.idetapainversion)
                        WHERE
                          i.idestructuracomun = " . $params['identidad'] . " AND ({$params['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      AND {$params['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric)
                                    $ADDWHERE
                      ) r  

                      ORDER BY r.concepto, r.codigo";
//print($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getDatosEstructura($idestructura) {

        $sql = "SELECT
                  idconcepto,
                  idespecialidad,
                  denominacion,
                  abreviatura,
                  codigo
                FROM
                  mod_estructuracomp.dat_estructura e
                WHERE
                  e.idestructura = $idestructura
                ;";

        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat[0];
    }

    public function getDatosFormaPropiedad($selectNombreForma) {

        $sql = "SELECT f.idformapropiedad, d.denominacion
                  FROM mod_planifinversiones.dat_formapropiedad f
                  inner join mod_planificacion.nom_datosnomenclador d ON(f.iddatosnomenclador = d.iddatosnomenclador)
                ;";

        $conn = Doctrine_Manager::connection();
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    public function inversionGral($params) {
        $ADDWHERE = " ";
        if (count($params['idinvers']) > 0) {
            $idinvers = implode(',', $params['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT 'datosgenerales' as concepto,
                        (SELECT
                              nti.denominacion
                          FROM mod_planifinversiones.nom_tipoinversion nti
                          WHERE nti.idtipoinversion = i.idtipoinversion) as tipo_inversion,

                        (SELECT 
                            ep.ejercicio
                          FROM 
                            mod_planificacion.nom_ejercicioplanificacion ep
                          WHERE ep.idejercicio = {$params['idejercicio']}) as ejercicio,

                        i.fechainicio,
                        i.fechafin,

                        (SELECT
                            ndn.denominacion
                          FROM
                            mod_planifinversiones.dat_tipoinversionprograma ip
                          INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = ip.iddatosnomenclador)
                          WHERE ip.idtipoinversionprograma = i.idtipoinversionprograma) as tipo_invers_prog,

                        (SELECT 
                            ndn.denominacion
                          FROM
                            mod_planificacion.nom_datosnomenclador ndn
                            INNER JOIN mod_planifinversiones.dat_formapropiedad fp ON (ndn.iddatosnomenclador = fp.iddatosnomenclador)
                          WHERE fp.idformapropiedad = i.idformapropiedad) as forma_propiedad,

                        (SELECT 
                            ndn.denominacion
                          FROM
                            mod_planificacion.nom_datosnomenclador ndn
                            INNER JOIN mod_planifinversiones.dat_caracteristica dc ON (ndn.iddatosnomenclador = dc.iddatosnomenclador)
                          WHERE dc.idcaracteristica = i.idcaracteristica) as caracteristica,

                        (SELECT 
                            ndn.denominacion
                          FROM
                            mod_planificacion.nom_datosnomenclador ndn
                            INNER JOIN mod_planifinversiones.dat_objetivo doo ON (ndn.iddatosnomenclador = doo.iddatosnomenclador)
                          WHERE doo.idobjetivo = i.idobjetivo) as objetivo,

                        i.fasttrack,

                        (SELECT 
                            nei.denominacion
                          FROM
                            mod_planifinversiones.nom_estadoinversion nei
                          WHERE nei.idestadoinversion = i.idestadoinversion) as estado_inversion,

                        i.denominacion,
                        i.codigo,

                        (SELECT
                            ndn.denominacion
                          FROM
                            mod_planifinversiones.dat_efectocomercial ec
                          INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = ec.iddatosnomenclador)
                          WHERE ec.idefectocomercial = i.idefectocomercial) as efecto_comercial,

                        (SELECT
                            nea.denominacion
                          FROM mod_planifinversiones.nom_estadoaprobacion nea
                          WHERE nea.idestadoaprobacion = i.idestadoaprobacion) as estado_aprobacion,

                        (SELECT 
                            iddpt
                          FROM 
                            mod_datosmaestros.nom_dpt nd
                          WHERE nd.iddpt = i.idprovincia) as provincia,

                        (SELECT
                            nci.denominacion
                          FROM 
                            mod_planifinversiones.nom_cumplimientoinversion nci
                          WHERE nci.idcumplimientoinversion = i.idcumplimientoinversion) as cumplimiento_inversion,

                        i.observaciones,
                        i.analpostinversiones,

                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_desempenno dd
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = dd.iddatosnomenclador)
                          WHERE dd.iddatdesempenno = i.iddatdesempenno) as desempenno,

                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_programa dp
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = dp.iddatosnomenclador)
                          WHERE dp.idprograma = i.idprograma) as programa,

                        i.cuadrada,

                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_medioambiente ma
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = ma.iddatosnomenclador)
                          WHERE ma.idmedioambiente = i.idmedioambiente) as medio_ambiente,

                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_grupoobra go
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = go.iddatosnomenclador)
                          WHERE go.idgrupoobra = i.idgrupoobra) as grupo_obra,

                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_estadoplaninversion epi
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = epi.iddatosnomenclador)
                          WHERE epi.idestadoplaninversion = i.idestadoplaninversion) as estado_plan_inversion,

                        i.preparacion,

                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_sectorestrategico se
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = se.iddatosnomenclador)
                          WHERE se.idsectorestrategico = i.idsectorestrategico) as sector_estrategico,
                        i.idcontenido
                      FROM
                        mod_planifinversiones.dat_inversion i
                      WHERE
                        i.idestructuracomun = " . $params['identidad'] . " AND ({$params['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      AND {$params['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) $ADDWHERE";
        //print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function erogPPfinanciamiento($params) {
        $ADDWHERE = " ";
        if (count($params['idinvers']) > 0) {
            $idinvers = implode(',', $params['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT
                        r.concepto,
                        r.codigo,
                        
                        (SELECT 
                          nm.codigoiso
                        FROM 
                          mod_datosmaestros.dat_monedaentidad me 
                          inner join mod_datosmaestros.nom_moneda nm on (nm.idmoneda = me.idmoneda)
                          where me.idmonedaentidad = r.idmonedaentidad) codigo_iso,

                        r.valor,

                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_financista f
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = f.iddatosnomenclador)
                          WHERE f.idfinancista = r.idfinancista) as financista_quien,

                        (SELECT 
                            ndn.denominacion
                          FROM 
                            mod_planifinversiones.dat_tipofinanciamiento tf
                            INNER JOIN mod_planificacion.nom_datosnomenclador ndn on (ndn.iddatosnomenclador = tf.iddatosnomenclador)
                          WHERE tf.idtipofinanciamiento = r.idtipofinanciamiento) as tipo_financiamiento_quien,

                        r.porcientointeres,
                        r.plazoamortizacion,
                        r.gracia

                      FROM (
                          SELECT 
                            i.idinversion,
                            'financiamiento' as concepto,
                            i.codigo,
                            df.valor,
                            df.idmonedaentidad,
                            df.idfinancista,
                            df.idtipofinanciamiento,

                            df.porcientointeres,
                            df.plazoamortizacion,
                            df.gracia
                          FROM
                            mod_planifinversiones.dat_inversion i
                            INNER JOIN mod_planifinversiones.dat_financiamiento df ON (i.idinversion = df.idinversion)
                          WHERE
                            i.idestructuracomun = " . $params['identidad'] . " AND ({$params['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      AND {$params['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric)
                                    $ADDWHERE

                            UNION

                          SELECT 
                            i.idinversion,
                            'preparacion' as concepto,
                            i.codigo,
                            pp.valor,
                            pp.idmonedaentidad,

                             NULL::numeric(19,0) as financista_quien,
                             NULL::numeric(19,0) as tipo_financiamiento_quien,
                             NULL::numeric(4,2) as porcientointeres,
                             NULL::numeric(5,0) as plazoamortizacion,
                             NULL::numeric(3,0) as gracia
                          FROM
                            mod_planifinversiones.dat_presanteproy pp
                            INNER JOIN mod_planifinversiones.dat_inversion i ON (pp.idinversion = i.idinversion)
                          WHERE
                            i.idestructuracomun = " . $params['identidad'] . " AND ({$params['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      AND {$params['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric)
                                    $ADDWHERE
                            UNION

                          SELECT 
                            i.idinversion,
                            'erogacion' as concepto,
                            i.codigo,
                            el.valor,
                            el.idmonedaentidad,

                            NULL::numeric(19,0) as financista_quien,
                            NULL::numeric(19,0) as tipo_financiamiento_quien,
                            NULL::numeric(4,2) as porcientointeres,
                            NULL::numeric(5,0) as plazoamortizacion,
                            NULL::numeric(3,0) as gracia
                          FROM
                            mod_planifinversiones.dat_inversion i
                            INNER JOIN mod_planifinversiones.dat_erogacionliquido el ON (i.idinversion = el.idinversion)
                          WHERE
                            i.idestructuracomun = " . $params['identidad'] . " AND ({$params['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      AND {$params['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric)
                                    $ADDWHERE
                      ) r
                      ORDER BY r.concepto";
//pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepComponentesPresupuestoExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }
//pre_r($idinvers);
//die('eeeeeee');
        $conn = Doctrine_Manager::connection();
        $sql_query = "select i.codigo, i.version, ei.idetapainversion, ne.denominacion
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                        INNER JOIN mod_planifinversiones.dat_etapa e ON(ei.idetapa = e.idetapa)
                        INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON(e.idnombreetapa = ne.idnombreetapa)
                        WHERE i.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE";

//print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepInversionesEquiposExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "select i.codigo, i.version, ind.idindicador, ne.denominacion as etapa, mod.denominacion as plan, ind.codigo as indcodigo, eg.idetapaequipoglobal
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                        INNER JOIN mod_datosmaestros.nom_indicador ind ON(e.idindicador = ind.idindicador)
                        INNER JOIN mod_planifinversiones.dat_etapa de ON(ei.idetapa = de.idetapa)
                        INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON(de.idnombreetapa = ne.idnombreetapa)
                        INNER JOIN mod_planificacion.dat_entidadmodelo entmod ON(e.identidadmodelo = entmod.identidadmodelo)
                        INNER JOIN mod_planificacion.dat_modelo mod ON (entmod.idmodelo = mod.idmodelo)
                        WHERE i.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepConstructoresExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "select i.codigo, i.version, e.idetapinverconsprov, ne.denominacion as etapa, ind.denominacion, p.denominacion as provincia
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                        INNER JOIN mod_planifinversiones.dat_constructor eg ON(e.idconstructor = eg.idconstructor)
                        INNER JOIN mod_planificacion.nom_datosnomenclador ind ON(eg.iddatosnomenclador  = ind.iddatosnomenclador)
                        INNER JOIN mod_planifinversiones.dat_etapa de ON(ei.idetapa = de.idetapa)
                        INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON(de.idnombreetapa = ne.idnombreetapa)
                        INNER JOIN mod_datosmaestros.nom_dpt p ON(e.iddpt  = p.iddpt)
                        WHERE i.idestructuracomun = {$parametros['identidad']}
                          $ADDWHERE
                        ";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepOtrosIndicadoresExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "select i.codigo, i.version, i.idinversion, oi.idotrosindicadoresannospostcant, oi.idnomotrosindicadores, noi.denominacion, oi.cantidad, oi.valor
                          FROM mod_planifinversiones.dat_inversion i
                          INNER JOIN mod_planifinversiones.dat_otrosindicadoresannospostcant oi on(i.idinversion = oi.idinversion)
                          INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(oi.idnomotrosindicadores  = noi.idnomotrosindicadores)
                          WHERE i.idestructuracomun = {$parametros['identidad']}
                          $ADDWHERE";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepNivelesActividadExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT i.codigo, i.version, i.idinversion, n.denominacion, ce.cantidad, ce.valor
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.dat_capexplotannospostcant ce ON(i.idinversion = ce.idinversion)
                        INNER JOIN mod_planifinversiones.dat_capexplotacion c ON(ce.iddatcapexplotacion = c.iddatcapexplotacion)
                        INNER JOIN mod_planificacion.nom_datosnomenclador n ON(c.iddatosnomenclador = n.iddatosnomenclador)
                        WHERE i.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepNivelesActividadDesgloseExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }

        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT DISTINCT i.codigo, i.version, i.idinversion, n.denominacion, ce.iddatcapexplotacion
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.dat_inverscapexplot ce ON(i.idinversion = ce.idinversion)
                        INNER JOIN mod_planifinversiones.dat_capexplotacion c ON(ce.iddatcapexplotacion = c.iddatcapexplotacion)
                        INNER JOIN mod_planificacion.nom_datosnomenclador n ON(c.iddatosnomenclador = n.iddatosnomenclador)
                        WHERE i.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepMedioAmbienteExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  di.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  di.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND di.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND di.idinversion in ({$idinvers} )";
        }

        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT
                          mg.idmedioambglobal,
                          mg.idinversion,
                          di.codigo,
                          di.version,
                          mg.iddatosnomenclador,
                          h.denominacion as denommedioambiente,
                          nn.nombrecampo as tipohijo,
                          mg.iddatosnomencladorpadre,
                          p.denominacion as denommedioambientepadre,
                          (SELECT
                              nni.nombrecampo
                            FROM
                              mod_planifinversiones.dat_medioambglobal mgi
                              INNER JOIN mod_planifinversiones.nom_nomenclador nni ON (mgi.idnomenclador = nni.idnomenclador)
                            WHERE
                              mgi.idmedioambglobal =  mg.idpadre) as tipopadre,
                          mg.idnomenclador,
                          mg.idpadre
                        FROM
                          mod_planifinversiones.dat_medioambglobal mg
                          INNER JOIN mod_planifinversiones.dat_inversion di ON (mg.idinversion = di.idinversion)
                          INNER JOIN mod_planifinversiones.nom_nomenclador nn ON (mg.idnomenclador = nn.idnomenclador)
                         inner join mod_planificacion.nom_datosnomenclador h on (h.iddatosnomenclador = mg.iddatosnomenclador)
                         inner join mod_planificacion.nom_datosnomenclador p on (p.iddatosnomenclador = mg.iddatosnomencladorpadre)
                        WHERE di.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE
                          order by di.idinversion,mg.idpadre,mg.idmedioambglobal
                        ";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepMedioAmbientePresupuestoExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  di.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  di.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND di.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND di.idinversion in ({$idinvers} )";
        }

        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT
                          mg.idmedioambglobal,
                          mg.idinversion,
                          di.codigo,
                          di.version,
                          mg.iddatosnomenclador,
                          h.denominacion as denommedioambiente,
                          nn.nombrecampo as tipohijo,
                          mg.iddatosnomencladorpadre,
                          p.denominacion as denommedioambientepadre,
                          pre.valor,
                          pre.idmonedaentidad,
                          (SELECT
                              nni.nombrecampo
                            FROM
                              mod_planifinversiones.dat_medioambglobal mgi
                              INNER JOIN mod_planifinversiones.nom_nomenclador nni ON (mgi.idnomenclador = nni.idnomenclador)
                            WHERE
                              mgi.idmedioambglobal =  mg.idpadre) as tipopadre,
                          mg.idnomenclador,
                          mg.idpadre
                        FROM
                          mod_planifinversiones.dat_medioambglobal mg
                          INNER JOIN mod_planifinversiones.dat_inversion di ON (mg.idinversion = di.idinversion)
                          INNER JOIN mod_planifinversiones.nom_nomenclador nn ON (mg.idnomenclador = nn.idnomenclador)
                         inner join mod_planificacion.nom_datosnomenclador h on (h.iddatosnomenclador = mg.iddatosnomenclador)
                         inner join mod_planificacion.nom_datosnomenclador p on (p.iddatosnomenclador = mg.iddatosnomencladorpadre)
                         INNER JOIN mod_planifinversiones.dat_medioambpresupuesto pre ON(mg.idmedioambglobal = pre.idmedioambglobal)
                        WHERE di.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE
                          order by di.idinversion,mg.idpadre,mg.idmedioambglobal
                        ";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepMedioAmbienteDesgloseExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  di.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  di.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND di.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND di.idinversion in ({$idinvers} )";
        }

        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT
                          mg.idmedioambglobal,
                          mg.idinversion,
                          di.codigo,
                          di.version,
                          mg.iddatosnomenclador,
                          h.denominacion as denommedioambiente,
                          nn.nombrecampo as tipohijo,
                          mg.iddatosnomencladorpadre,
                          p.denominacion as denommedioambientepadre,
                          (SELECT
                              nni.nombrecampo
                            FROM
                              mod_planifinversiones.dat_medioambglobal mgi
                              INNER JOIN mod_planifinversiones.nom_nomenclador nni ON (mgi.idnomenclador = nni.idnomenclador)
                            WHERE
                              mgi.idmedioambglobal =  mg.idpadre) as tipopadre,
                          mg.idnomenclador,
                          mg.idpadre
                        FROM
                          mod_planifinversiones.dat_medioambglobal mg
                          INNER JOIN mod_planifinversiones.dat_inversion di ON (mg.idinversion = di.idinversion)
                          INNER JOIN mod_planifinversiones.nom_nomenclador nn ON (mg.idnomenclador = nn.idnomenclador)
                         inner join mod_planificacion.nom_datosnomenclador h on (h.iddatosnomenclador = mg.iddatosnomenclador)
                         inner join mod_planificacion.nom_datosnomenclador p on (p.iddatosnomenclador = mg.iddatosnomencladorpadre)
                        WHERE di.idestructuracomun = {$parametros['identidad']}
                        and (mg.idmedioambglobal IN(SELECT
                                                    idmedioambglobal
                                                    FROM
                                                    mod_planifinversiones.dat_medioambejecutado)
                                                    or mg.idmedioambglobal IN(SELECT
                                                    idmedioambglobal
                                                    FROM
                                                    mod_planifinversiones.dat_medioambestimado)
                                                    or mg.idmedioambglobal IN(SELECT
                                                    idmedioambglobal
                                                    FROM
                                                    mod_planifinversiones.dat_medioambplan)
                                                    or mg.idmedioambglobal IN(SELECT
                                                    idmedioambglobal
                                                    FROM
                                                    mod_planifinversiones.dat_medioambproyectado))
                        $ADDWHERE
                          order by di.idinversion,mg.idpadre,mg.idmedioambglobal
                        ";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepOtrosIndicadoresDesgloseExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {

            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "select DISTINCT i.codigo, i.version, i.idinversion, oi.idnomotrosindicadores, noi.denominacion
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN mod_planifinversiones.dat_otrosindicadares oi on(i.idinversion = oi.idinversion)
                        INNER JOIN mod_planifinversiones.nom_otrosindicadores noi ON(oi.idnomotrosindicadores  = noi.idnomotrosindicadores)
                        WHERE i.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE";

        //pre_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepInversionesContadoExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {
            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "select  i.idinversion, i.codigo, i.version
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN  mod_planifinversiones.dat_financiamiento f ON(i.idinversion=f.idinversion)
                        WHERE i.idestructuracomun = {$parametros['identidad']} AND f.porcientointeres = 0
                        $ADDWHERE";

        //print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepInversionesAcreedorExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {
            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "select  i.idinversion, i.codigo, i.version, f.idtipofinanciamiento,d.denominacion
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN  mod_planifinversiones.dat_financiamiento f ON(i.idinversion=f.idinversion)
                        INNER JOIN  mod_planifinversiones.dat_tipofinanciamiento tf ON(f.idtipofinanciamiento= tf.idtipofinanciamiento)
                        INNER JOIN   mod_planificacion.nom_datosnomenclador d ON(tf.iddatosnomenclador = d.iddatosnomenclador)
                        WHERE i.idestructuracomun = {$parametros['identidad']} AND f.porcientointeres <> 0
                        $ADDWHERE";

        //print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepInversionesFinancistaExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {
            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "select  i.idinversion, i.codigo, i.version, f.idfinancista,d.denominacion
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN  mod_planifinversiones.dat_financiamiento f ON(i.idinversion=f.idinversion)
                        INNER JOIN  mod_planifinversiones.dat_financista tf ON(f.idfinancista= tf.idfinancista)
                        INNER JOIN   mod_planificacion.nom_datosnomenclador d ON(tf.iddatosnomenclador = d.iddatosnomenclador)
                        WHERE i.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE";

        //print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepInversionesPlanPreparacionExportar($parametros) {

        $ADDWHERE = " ";
        if ($parametros['vigente'] == 1) {
            $ADDWHERE = $ADDWHERE . " AND ({$parametros['ejercicio']} >= " . "(date_part('year',  i.fechainicio))::numeric
                                      and
                                          {$parametros['ejercicio']} <= " . " (date_part('year',  i.fechafin))::numeric) ";
        } else {
            $ADDWHERE = $ADDWHERE . " AND i.idejercicio =  {$parametros['idejercicio']} ";
        }

        if (count($parametros['idinvers']) > 0) {
            $idinvers = implode(',', $parametros['idinvers']);
            $ADDWHERE = $ADDWHERE . " AND i.idinversion in ({$idinvers} )";
        }


        $conn = Doctrine_Manager::connection();
        $sql_query = "select  i.idinversion, i.codigo, i.version, f.idpresanteproy, f.idmonedaentidad
                        FROM mod_planifinversiones.dat_inversion i
                        INNER JOIN  mod_planifinversiones.dat_presanteproy f ON(i.idinversion=f.idinversion)
                        WHERE i.idestructuracomun = {$parametros['identidad']}
                        $ADDWHERE";
        //print_r($sql_query);die;
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepDesgloseExportar($parametros) {

        //print_r($parametros['tablas_desglose']['ejecutado']);die;
        $ejers = implode(',', $parametros['ejercicios']);
        $ejecutado = $parametros['tablas_desglose']['ejecutado'];
        $plan = $parametros['tablas_desglose']['plan'];
        $estimado = $parametros['tablas_desglose']['estimado'];
        $proyectado = $parametros['tablas_desglose']['proyectado'];

        $INNERJOIN = " ";
        $ADDWHERE = " ";
        switch ($parametros['concepto']) {
            case 'Presupuesto':
                $SELECT_Ejecutado = "ices.valor";
                $SELECT_Estimado = "ices.valor";
                $SELECT_Plan = "ices.valor";
                $SELECT_Proyectado = "ices.valor";
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                               inner join mod_planifinversiones.$ejecutado ices ON(ei.idetapainversion = ices.idetapainversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                               inner join mod_planifinversiones.$estimado ices ON(ei.idetapainversion = ices.idetapainversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                               inner join mod_planifinversiones.$plan ices ON(ei.idetapainversion = ices.idetapainversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                               inner join mod_planifinversiones.$proyectado ices ON(ei.idetapainversion = ices.idetapainversion";
                $ADDWHERE .= " and ices.idetapainversion = {$parametros['idetapainversion']}
                               and (ices.idmoneda = {$parametros['idmoneda']})";
                break;
            case 'Contado':
                $SELECT_Ejecutado = "ices.valor";
                $SELECT_Estimado = "ices.valor";
                $SELECT_Plan = "ices.valor";
                $SELECT_Proyectado = "ices.valor";
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.$ejecutado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.$estimado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.$plan ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.$proyectado ices ON(i.idinversion = ices.idinversion";
                $ADDWHERE .= " and i.idinversion = {$parametros['idinversion']}
                               and (ices.idmonedaentidad = {$parametros['idmonedaentidad']}) ";
                break;
            case 'Acreedor':
                $SELECT_Ejecutado = "ices.valor";
                $SELECT_Estimado = "ices.valor";
                $SELECT_Plan = "ices.valor";
                $SELECT_Proyectado = "ices.valor";
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.$ejecutado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.$estimado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.$plan ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.$proyectado ices ON(i.idinversion = ices.idinversion";
                $ADDWHERE .= " and ices.idtipofinanciamiento = {$parametros['idtipofinanciamiento']}
                               and (ices.idmonedaentidad = {$parametros['idmonedaentidad']})
                               and i.idinversion = {$parametros['idinversion']}";
                break;
            case 'Financista':
                $SELECT_Ejecutado = "ices.valor";
                $SELECT_Estimado = "ices.valor";
                $SELECT_Plan = "ices.valor";
                $SELECT_Proyectado = "ices.valor";
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.$ejecutado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.$estimado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.$plan ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.$proyectado ices ON(i.idinversion = ices.idinversion";
                $ADDWHERE .= " and ices.idfinancista = {$parametros['idfinancista']}
                               and (ices.idmonedaentidad = {$parametros['idmonedaentidad']})
                               and i.idinversion = {$parametros['idinversion']}";
                break;
            case 'Plan de Prep.':
                $SELECT_Ejecutado = "ices.valor";
                $SELECT_Estimado = "ices.valor";
                $SELECT_Plan = "ices.valor";
                $SELECT_Proyectado = "ices.valor";
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.dat_presanteproy p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$ejecutado ices ON(p.idpresanteproy = ices.idpresanteproy";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.dat_presanteproy p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$estimado ices ON(p.idpresanteproy = ices.idpresanteproy";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.dat_presanteproy p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$plan ices ON(p.idpresanteproy = ices.idpresanteproy";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.dat_presanteproy p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$proyectado ices ON(p.idpresanteproy = ices.idpresanteproy";
                $ADDWHERE .= " and ices.idpresanteproy = {$parametros['idpresanteproy']}
                               and (p.idmonedaentidad = {$parametros['idmonedaentidad']})";
                break;
            case 'Equipo':
                $SELECT_Ejecutado = "ices.valor";
                $SELECT_Estimado = "ices.valor";
                $SELECT_Plan = "ices.valor";
                $SELECT_Proyectado = "ices.valor";
                $INNERJOIN_Ejecutado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                                         inner join mod_planifinversiones.$ejecutado ices ON(eg.idetapaequipoglobal = ices.idetapaequipoglobal";
                $INNERJOIN_Estimado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                                         inner join mod_planifinversiones.$estimado ices ON(eg.idetapaequipoglobal = ices.idetapaequipoglobal";
                $INNERJOIN_Plan = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                                         inner join mod_planifinversiones.$plan ices ON(eg.idetapaequipoglobal = ices.idetapaequipoglobal";
                $INNERJOIN_Proyectado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                                         inner join mod_planifinversiones.$proyectado ices ON(eg.idetapaequipoglobal = ices.idetapaequipoglobal";
                $ADDWHERE .= " and ices.idetapaequipoglobal = {$parametros['idetapaequipoglobal']}
                               ";
                break;
            case 'Constructor':
                $SELECT_Ejecutado = "ices.valor";
                $SELECT_Estimado = "ices.valor";
                $SELECT_Plan = "ices.valor";
                $SELECT_Proyectado = "ices.valor";
                $INNERJOIN_Ejecutado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                                         inner join mod_planifinversiones.$ejecutado ices ON(e.idetapinverconsprov = ices.idetapinverconsprov";
                $INNERJOIN_Estimado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                                        inner join mod_planifinversiones.$estimado ices ON(e.idetapinverconsprov = ices.idetapinverconsprov";
                $INNERJOIN_Plan = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                                        inner join mod_planifinversiones.$plan ices ON(e.idetapinverconsprov = ices.idetapinverconsprov";
                $INNERJOIN_Proyectado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                                        inner join mod_planifinversiones.$proyectado ices ON(e.idetapinverconsprov = ices.idetapinverconsprov";
                $ADDWHERE .= " and ices.idetapinverconsprov = {$parametros['idetapinverconsprov']}
                               and (ices.idmoneda = {$parametros['idmoneda']})";
                break;
            case 'Otros indicadores desglose':
                $SELECT_Ejecutado = "ices.ejecutado as valor";
                $SELECT_Estimado = "ices.estimado as valor";
                $SELECT_Plan = "ices.plan as valor";
                $SELECT_Proyectado = "ices.proyeccion as valor";
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.$ejecutado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.$estimado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.$plan ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.$proyectado ices ON(i.idinversion = ices.idinversion";
                $ADDWHERE .= " and (ices.idnomotrosindicadores = {$parametros['idnomotrosindicadores']})
                               and i.idinversion = {$parametros['idinversion']}";
                break;
            case 'Nivel de actividad desglose':
                $SELECT_Ejecutado = "ices.ejecutado as valor";
                $SELECT_Estimado = "ices.estimado as valor";
                $SELECT_Plan = "ices.plan as valor";
                $SELECT_Proyectado = "ices.proyeccion as valor";
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.$ejecutado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.$estimado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.$plan ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.$proyectado ices ON(i.idinversion = ices.idinversion";
                $ADDWHERE .= " and (ices.iddatcapexplotacion = {$parametros['iddatcapexplotacion']})
                               and i.idinversion = {$parametros['idinversion']}";
                break;
            case 'Medio ambiente desglose':
                $SELECT_Ejecutado = "ices.valor";
                $SELECT_Estimado = "ices.valor";
                $SELECT_Plan = "ices.valor";
                $SELECT_Proyectado = "ices.valor";
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.dat_medioambglobal p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$ejecutado ices ON(p.idmedioambglobal = ices.idmedioambglobal";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.dat_medioambglobal p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$estimado ices ON(p.idmedioambglobal = ices.idmedioambglobal";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.dat_medioambglobal p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$plan ices ON(p.idmedioambglobal = ices.idmedioambglobal";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.dat_medioambglobal p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$proyectado ices ON(p.idmedioambglobal = ices.idmedioambglobal";
                $ADDWHERE .= " and ices.idmedioambglobal = {$parametros['idmedioambglobal']}
                               and (ices.idmonedaentidad = {$parametros['idmonedaentidad']})";
                break;
        }
//print_r('entra');die;
        $conn = Doctrine_Manager::connection();
        $sql_query = "select ep.idejercicio,'1ejecutado' as etapa,/*(select m.idmoneda from
                         mod_datosmaestros.nom_moneda m where m.idmoneda = {$parametros['idmoneda']}),*/
                             coalesce(r.valor,0) as valor,
                             ep.ejercicio
                            from mod_planificacion.nom_ejercicioplanificacion ep
                            left join (select '1ejecutado' as etapa, /*f.idmoneda,*/
                             sum(f.valor) as valor,
                             f.idejercicio,
                             f.ejercicio
                             from (SELECT
                             --ices.idmoneda,
                             $SELECT_Ejecutado,
                             ices.idejercicio,
                             ep.ejercicio
                               FROM
                             mod_planifinversiones.dat_inversion i
                             $INNERJOIN_Ejecutado

                        )
                             inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)

                             where ices.idejercicio in ($ejers)
                             $ADDWHERE

                              )f
                             group by f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

                             where ep.idejercicio in ($ejers)

                        ---------------------------------------------------------------
                        union

                        select ep.idejercicio,'2estimado' as etapa,/*(select m.idmoneda from mod_datosmaestros.nom_moneda m where
                         m.idmoneda = {$parametros['idmoneda']}),*/
                             coalesce(r.valor,0) as valor,
                             ep.ejercicio
                            from mod_planificacion.nom_ejercicioplanificacion ep
                            left join (select '2estimado' as etapa, /*f.idmoneda,*/
                             sum(f.valor) as valor,
                             f.idejercicio,
                             f.ejercicio
                             from (SELECT
                             --ices.idmoneda,
                             $SELECT_Estimado,
                             ices.idejercicio,
                             ep.ejercicio
                               FROM
                             mod_planifinversiones.dat_inversion i
                             $INNERJOIN_Estimado
                        )
                             inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)


                             where ices.idejercicio in ($ejers)
                             $ADDWHERE

                              )f
                             group by f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

                             where ep.idejercicio in ($ejers)
                        ---------------------------------------------------------------
                        union

                         select ep.idejercicio,'3plan' as etapa,/*(select m.idmoneda from mod_datosmaestros.nom_moneda m where
                         m.idmoneda = {$parametros['idmoneda']}),*/
                             coalesce(r.valor,0) as valor,
                             ep.ejercicio
                            from mod_planificacion.nom_ejercicioplanificacion ep
                            left join (select '3plan' as etapa, /*f.idmoneda,*/
                             sum(f.valor) as valor,
                             f.idejercicio,
                             f.ejercicio
                             from (SELECT
                             --ices.idmoneda,
                             $SELECT_Plan,
                             ices.idejercicio,
                             ep.ejercicio
                               FROM
                             mod_planifinversiones.dat_inversion i
                             $INNERJOIN_Plan

                        )
                             inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)

                             where ices.idejercicio in ($ejers)
                             $ADDWHERE

                              )f
                             group by f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

                             where ep.idejercicio in ($ejers)


                         ---------------------------------------------------------------
                        union

                        select ep.idejercicio,'4proyectado' as etapa,/*(select m.idmoneda from mod_datosmaestros.nom_moneda m where
                         m.idmoneda = {$parametros['idmoneda']}),*/
                             coalesce(r.valor,0) as valor,
                             ep.ejercicio
                            from mod_planificacion.nom_ejercicioplanificacion ep
                            left join (select '4proyectado' as etapa, /*f.idmoneda,*/
                             sum(f.valor) as valor,
                             f.idejercicio,
                             f.ejercicio
                             from (SELECT
                             --ices.idmoneda,
                             $SELECT_Proyectado,
                             ices.idejercicio,
                             ep.ejercicio
                               FROM
                             mod_planifinversiones.dat_inversion i
                             $INNERJOIN_Proyectado

                        )
                             inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)

                             where ices.idejercicio in ($ejers)
                             $ADDWHERE

                              )f
                             group by f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

                             where ep.idejercicio in ($ejers)

                        order by ejercicio,etapa";

        /* pre_r($sql_query);
          pre_r('***-------*****'); */
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarPlanPrepDesgloseExportarOtro($parametros) {

        //print_r($parametros['tablas_desglose']['ejecutado']);die;
        $ejers = implode(',', $parametros['ejercicios']);
        $ejecutado = $parametros['tablas_desglose']['ejecutado'];
        $plan = $parametros['tablas_desglose']['plan'];
        $estimado = $parametros['tablas_desglose']['estimado'];
        $proyectado = $parametros['tablas_desglose']['proyectado'];

        $INNERJOIN = " ";
        $ADDWHERE = " ";
        switch ($parametros['concepto']) {
            case 'Presupuesto':
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                               inner join mod_planifinversiones.$ejecutado ices ON(ei.idetapainversion = ices.idetapainversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                               inner join mod_planifinversiones.$estimado ices ON(ei.idetapainversion = ices.idetapainversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                               inner join mod_planifinversiones.$plan ices ON(ei.idetapainversion = ices.idetapainversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                               inner join mod_planifinversiones.$proyectado ices ON(ei.idetapainversion = ices.idetapainversion";
                $ADDWHERE .= " and ices.idetapainversion = {$parametros['idetapainversion']}
                               and (ices.idmoneda = {$parametros['idmoneda']})";
                break;
            case 'Contado':
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.$ejecutado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.$estimado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.$plan ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.$proyectado ices ON(i.idinversion = ices.idinversion";
                $ADDWHERE .= " and i.idinversion = {$parametros['idinversion']}
                               and (ices.idmonedaentidad = {$parametros['idmonedaentidad']}) ";
                break;
            case 'Acreedor':
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.$ejecutado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.$estimado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.$plan ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.$proyectado ices ON(i.idinversion = ices.idinversion";
                $ADDWHERE .= " and ices.idtipofinanciamiento = {$parametros['idtipofinanciamiento']}
                               and (ices.idmonedaentidad = {$parametros['idmonedaentidad']})
                               and i.idinversion = {$parametros['idinversion']}";
                break;
            case 'Financista':
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.$ejecutado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.$estimado ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.$plan ices ON(i.idinversion = ices.idinversion";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.$proyectado ices ON(i.idinversion = ices.idinversion";
                $ADDWHERE .= " and ices.idfinancista = {$parametros['idfinancista']}
                               and (ices.idmonedaentidad = {$parametros['idmonedaentidad']})
                               and i.idinversion = {$parametros['idinversion']}";
                break;
            case 'Plan de Prep.':
                $INNERJOIN_Ejecutado = " inner join mod_planifinversiones.dat_presanteproy p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$ejecutado ices ON(p.idpresanteproy = ices.idpresanteproy";
                $INNERJOIN_Estimado = " inner join mod_planifinversiones.dat_presanteproy p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$estimado ices ON(p.idpresanteproy = ices.idpresanteproy";
                $INNERJOIN_Plan = " inner join mod_planifinversiones.dat_presanteproy p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$plan ices ON(p.idpresanteproy = ices.idpresanteproy";
                $INNERJOIN_Proyectado = " inner join mod_planifinversiones.dat_presanteproy p on(i.idinversion = p.idinversion)
                                         inner join mod_planifinversiones.$proyectado ices ON(p.idpresanteproy = ices.idpresanteproy";
                $ADDWHERE .= " and ices.idpresanteproy = {$parametros['idpresanteproy']}
                               and (p.idmonedaentidad = {$parametros['idmonedaentidad']})";
                break;
            case 'Equipo':
                $INNERJOIN_Ejecutado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                                         inner join mod_planifinversiones.$ejecutado ices ON(eg.idetapaequipoglobal = ices.idetapaequipoglobal";
                $INNERJOIN_Estimado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                                         inner join mod_planifinversiones.$estimado ices ON(eg.idetapaequipoglobal = ices.idetapaequipoglobal";
                $INNERJOIN_Plan = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                                         inner join mod_planifinversiones.$plan ices ON(eg.idetapaequipoglobal = ices.idetapaequipoglobal";
                $INNERJOIN_Proyectado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipos e ON(ei.idetapainversion = e.idetapainversion)
                                        INNER JOIN mod_planifinversiones.dat_etapaequipoglobal eg ON(e.idetapaequipos = eg.idetapaequipos)
                                         inner join mod_planifinversiones.$proyectado ices ON(eg.idetapaequipoglobal = ices.idetapaequipoglobal";
                $ADDWHERE .= " and ices.idetapaequipoglobal = {$parametros['idetapaequipoglobal']}
                               ";
                break;
            case 'Constructor':
                $INNERJOIN_Ejecutado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                         INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                                         inner join mod_planifinversiones.$ejecutado ices ON(e.idetapinverconsprov = ices.idetapinverconsprov";
                $INNERJOIN_Estimado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                                        inner join mod_planifinversiones.$estimado ices ON(e.idetapinverconsprov = ices.idetapinverconsprov";
                $INNERJOIN_Plan = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                                        inner join mod_planifinversiones.$plan ices ON(e.idetapinverconsprov = ices.idetapinverconsprov";
                $INNERJOIN_Proyectado = " INNER JOIN mod_planifinversiones.dat_etapainversion ei ON(i.idinversion = ei.idinversion)
                                        INNER JOIN mod_planifinversiones.dat_etapinverconsprov e ON(ei.idetapainversion = e.idetapainversion)
                                        inner join mod_planifinversiones.$proyectado ices ON(e.idetapinverconsprov = ices.idetapinverconsprov";
                $ADDWHERE .= " and ices.idetapinverconsprov = {$parametros['idetapinverconsprov']}
                               and (ices.idmoneda = {$parametros['idmoneda']})";
                break;
        }

        $conn = Doctrine_Manager::connection();
        $sql_query = "select ep.idejercicio,'1ejecutado' as etapa,/*(select m.idmoneda from
                         mod_datosmaestros.nom_moneda m where m.idmoneda = {$parametros['idmoneda']}),*/
                             coalesce(r.valor,0) as valor,
                             ep.ejercicio
                            from mod_planificacion.nom_ejercicioplanificacion ep
                            left join (select '1ejecutado' as etapa, /*f.idmoneda,*/
                             sum(f.valor) as valor,
                             f.idejercicio,
                             f.ejercicio
                             from (SELECT
                             --ices.idmoneda,
                             ices.valor,
                             ices.idejercicio,
                             ep.ejercicio
                               FROM
                             mod_planifinversiones.dat_inversion i
                             $INNERJOIN_Ejecutado

                        )
                             inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)

                             where ices.idejercicio in ($ejers)
                             $ADDWHERE

                              )f
                             group by f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

                             where ep.idejercicio in ($ejers)

                        ---------------------------------------------------------------
                        union

                        select ep.idejercicio,'2estimado' as etapa,/*(select m.idmoneda from mod_datosmaestros.nom_moneda m where
                         m.idmoneda = {$parametros['idmoneda']}),*/
                             coalesce(r.valor,0) as valor,
                             ep.ejercicio
                            from mod_planificacion.nom_ejercicioplanificacion ep
                            left join (select '2estimado' as etapa, /*f.idmoneda,*/
                             sum(f.valor) as valor,
                             f.idejercicio,
                             f.ejercicio
                             from (SELECT
                             --ices.idmoneda,
                             ices.valor,
                             ices.idejercicio,
                             ep.ejercicio
                               FROM
                             mod_planifinversiones.dat_inversion i
                             $INNERJOIN_Estimado
                        )
                             inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)


                             where ices.idejercicio in ($ejers)
                             $ADDWHERE

                              )f
                             group by f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

                             where ep.idejercicio in ($ejers)
                        ---------------------------------------------------------------
                        union

                         select ep.idejercicio,'3plan' as etapa,/*(select m.idmoneda from mod_datosmaestros.nom_moneda m where
                         m.idmoneda = {$parametros['idmoneda']}),*/
                             coalesce(r.valor,0) as valor,
                             ep.ejercicio
                            from mod_planificacion.nom_ejercicioplanificacion ep
                            left join (select '3plan' as etapa, /*f.idmoneda,*/
                             sum(f.valor) as valor,
                             f.idejercicio,
                             f.ejercicio
                             from (SELECT
                             --ices.idmoneda,
                             ices.valor,
                             ices.idejercicio,
                             ep.ejercicio
                               FROM
                             mod_planifinversiones.dat_inversion i
                             $INNERJOIN_Plan

                        )
                             inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)

                             where ices.idejercicio in ($ejers)
                             $ADDWHERE

                              )f
                             group by f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

                             where ep.idejercicio in ($ejers)


                         ---------------------------------------------------------------
                        union

                        select ep.idejercicio,'4proyectado' as etapa,/*(select m.idmoneda from mod_datosmaestros.nom_moneda m where
                         m.idmoneda = {$parametros['idmoneda']}),*/
                             coalesce(r.valor,0) as valor,
                             ep.ejercicio
                            from mod_planificacion.nom_ejercicioplanificacion ep
                            left join (select '4proyectado' as etapa, /*f.idmoneda,*/
                             sum(f.valor) as valor,
                             f.idejercicio,
                             f.ejercicio
                             from (SELECT
                             --ices.idmoneda,
                             ices.valor,
                             ices.idejercicio,
                             ep.ejercicio
                               FROM
                             mod_planifinversiones.dat_inversion i
                             $INNERJOIN_Proyectado

                        )
                             inner JOIN mod_planificacion.nom_ejercicioplanificacion ep ON (ices.idejercicio = ep.idejercicio)

                             where ices.idejercicio in ($ejers)
                             $ADDWHERE

                              )f
                             group by f.idejercicio,f.ejercicio)r on (r.idejercicio = ep.idejercicio)

                             where ep.idejercicio in ($ejers)

                        order by ejercicio,etapa";

        /* pre_r($sql_query);
          pre_r('***-------*****'); */
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarColumnasRptResumen($parametros) {
//pre_r($parametros['filtros'][8]['id'][0]);die;
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT * FROM mod_planifinversiones.f_devolvertd({$parametros['idejercicio']}, {$parametros['filtros'][8]['id'][0]})";
        $datosListar = $conn->execute($sql_query);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function listarDatosRptResumen($parametros, $colum) {
//pre_r(implode(',', $parametros['filtros'][0]['id']));die;
//        $idorganismos = implode(',', $parametros['filtros'][0]['id']);

        $entid = $parametros['entidades'];
        $strarrayentidades = "'" . $entid . "'";
        //$strarrayentidades = "{" .$entid . "}";

        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT * FROM mod_planifinversiones.f_resumen_inversiones($strarrayentidades, null, null, null, null, null, null,
                                null, null, null, null, null, null, {$parametros['idejercicio']}, {$parametros['filtros'][8]['id'][0]}, null)
                        as func({$colum})";
        set_time_limit(0);
//    print_r($sql_query);die;
        $datosListar = $conn->fetchAll($sql_query);
        return $datosListar;
    }

    public function listarDatosFuncionRptGeneral($parametros, $arrayEjercicio) {
        $entid = $parametros['entidades'];
        $strarrayentidades = "'" . "{" . $entid . "}" . "'";
        $conn = Doctrine_Manager::connection();
        $sql_query = "SELECT * FROM mod_planifinversiones.f_reporte_general($strarrayentidades, null, null, null, null, null, null,
                                null, null, null, null, null, null, null, null, null,
                                {$arrayEjercicio[0]}, {$arrayEjercicio[1]}, {$arrayEjercicio[2]},{$arrayEjercicio[3]})";
        set_time_limit(0);

//pre_r($sql_query);die;
        $datosListar = $conn->fetchAll($sql_query);
        //pre_r($datosListar);die;
        return $datosListar;
    }

    public function getFechas($params) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = " select max(ej.ejercicio) as fechamax, min(ej.ejercicio)  as fechamin ";
        $cadenaJOIN = " from mod_planifinversiones.dat_inversetapaplan ep
            inner join mod_planifinversiones.dat_etapainversion ei on ei.idetapainversion = ep.idetapainversion
            inner join mod_planificacion.nom_ejercicioplanificacion ej on ep.idejercicio = ej.idejercicio ";
        $cadenaWHERE = " where ep.valor > 0 AND ei.idinversion = {$params['idinversion']}";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;

        $conn = Doctrine_Manager::connection();
        $fechas = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $fechas;
    }
    
    public function exportarIndSCP($params) {
        $identidades = implode(',', $params['dominios']);
        
        $cadenaQUERY = "Select * from mod_planifinversiones.f_reporte_inversiones_indicadores_scp (
                            array[{$identidades}],
                            {$params['idejercicio']}
                          )";
                            
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
