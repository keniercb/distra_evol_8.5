<?php

if (!class_exists('ComunAFTModel')) {
    $dirAFT = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class SubmayorModel extends ZendExt_Model
{
    //private $sRegNumerico;
    private $mComunAFT, $mMaestroProd, $servicioEyC, $serviciosRecursosHumanos;

    public function __construct()
    {
        parent::ZendExt_Model();
        //$this->sRegNumerico = new RegNumericoService();
        $this->mComunAFT = ComunAFTModel::getInstance();
        //$this->mMaestroProd = new MaestroProgetConteoEntidadductoModel();
        $this->servicioEyC = ServiciosEstructuraComposicionHelper::__init();
        $this->serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();

        $this->idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $this->idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        //$this->idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
    }

    /*
     *  Devuelve los productos con las cantidades existencia y disponoble
     */
    public function cargarSelectActividad($actividad, $estructurastring)
    {
        foreach ($actividad as $dat) {
            $idactividad = $dat['idactividad'];
            $select .= " ,(
            SELECT count(rn3.idregnumerico)
            FROM mod_logactivofijotangible.dat_registronumerico rn3
            INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna{$idactividad}
            ON rna{$idactividad}.idregnumerico = rn3.idregnumerico
            INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn3.idproducto
            WHERE p.idindicador = i.idindicador
            AND p.cronologia > 0 AND p.idestructura in $estructurastring AND rna{$idactividad}.idestadoperacion not in (0,7,6,8,9)
            AND rna{$idactividad}.idactividad = $idactividad
        ) AS activ{$idactividad} ";

        }
       return $select;
    }

    /*
     *  Devuelve los productos con las cantidades existencia y disponoble
     */

    public function getConteoEntidad($start = 0, $limit, $parametros, $arrIdesAreas = array())
    {
        if (!is_array($arrIdesAreas)) {
            $arrIdesAreas = $this->mComunAFT->getIdsAreasHijas();
        }

        if (count($arrIdesAreas) > 0) {
            // Este metodo en Dql no se puede hacer porque el distinct no pincha com debe, por lo que se hizo en sql.
            $estructurastring = " (" . implode(',', $arrIdesAreas) . ")";


            $select = "SELECT
                (
                    SELECT count(rn2.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    INNER JOIN mod_logactivofijotangible.nom_actividad na ON na.idactividad = rna.idactividad
                    INNER JOIN mod_logactivofijotangible.nom_estatustecnico net on net.idestatustecnico = rna.idestatustecnico
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 AND p.idestructura in $estructurastring AND rna.idestadoperacion not in (0,6,5,7,8,9)
                    AND na.denominacion NOT ILIKE '%P/B%' AND net.denominacion NOT LIKE 'Mal Estado'
                ) AS disponible,
                (
                    SELECT count(rn2.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 AND p.idestructura in $estructurastring AND rna.idestadoperacion not in (0,7, 6, 8, 9)
                ) AS cantidad,
                    i.denominacion as denominacion,
                    i.codigo as codigo,
                    nat.denominacion as naturaleza,
                    marc.denominacion as marca,
                    marc.estado as marcaestado,
                    model.denominacion as modelo,
                    model.estado as modeloestado,
                    ((Case When ih.idmarca is not null Then
                    (marc.denominacion  || (Case When ih.idmodelo is not null Then ' - ' Else '' End)) Else '' End)  || (Case
                    When ih.idmodelo is not null Then model.denominacion Else '' End)) AS marcamodelo,
                    i.idindicador as idindicador,
                    i.numeropieza as numeropieza
                  
                ";
            $from = " FROM mod_datosmaestros.nom_indicador i
                      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                      INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
                      LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca
                      LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo";

            $where = " WHERE (SELECT p.idestructura FROM mod_logistica.dat_producto p
                      INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = p.idproducto
                      WHERE p.idindicador = i.idindicador
                      AND p.cronologia > 0
                      AND p.idestructura in $estructurastring
                      LIMIT 1
              ) IS NOT NULL AND ih.explotacion = 1";

            $groupby = " GROUP BY i.idindicador,
                        i.denominacion,
                        i.codigo,
                        nat.denominacion,
                        marc.denominacion,
                        marc.estado,
                        model.denominacion,
                        model.estado,
                        ih.idmarca,
                        ih.idmodelo
                        ORDER BY i.denominacion, marc.denominacion, model.denominacion";


            if ($parametros['denominacion']) {
                $where .= "AND i.denominacion ILIKE '%{$parametros['denominacion']}%' ";
            }
            if ($parametros['idmarca']) {
                $where .= "AND ih.idmarca = {$parametros['idmarca']} ";
            }
            if ($parametros['idmodelo']) {
                $where .= "AND ih.idmodelo = {$parametros['idmodelo']} ";
            }
            if ($parametros['marcamodelo']) {
                $where .= "AND (marc.denominacion ILIKE '%{$parametros['marcamodelo']}%'
                            OR model.denominacion ILIKE '%{$parametros['marcamodelo']}%')";
            }
            if ($parametros['idgruposubgrupo']) {
                $where .= "AND ih.idgruposubgrupo = {$parametros['idgruposubgrupo']} ";
            }

            // $where = self::getConteoEntidadFilter($parametros, $where);
            $conn = Zend_Registry::get('conexion');

            $actividad = $this->cargarGrupoExplotacion($this->global->Estructura->idestructura);
            $select .= $this->cargarSelectActividad($actividad, $estructurastring); 
            $sqlDatos = $select . $from . $where /*. $groupby*/;

            $sqlCount = 'SELECT count (distinct i.idindicador) ' . $from . $where;
            $datosPre = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
            $cantidadPre = 0;
            $contador = 0;
            $enviar = array();
            foreach ($datosPre as $key => $value) {
                $cantidadPre += $value['cantidad'];
            }

            if ($limit) {
                $sqlDatos .= " offset $start limit $limit";
            }
            $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
            foreach ($datos as $key => $value) {
                if ($value['cantidad'] != 0) {
                    $enviar[]=$value;
                }else{
                    $contador++;
                }

            }
            $enviar[0]['areas'] = $arrIdesAreas;
            $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
            $total = $total[0]['count'];
            return array('cantidad' => $total-$contador, 'datos' => $enviar, 'cantidadTotal' => $cantidadPre);
        } else {
            return array('cantidad' => 0, 'datos' => array());
        }
    }

    public function getConteoEntidadFilter($parametros, $where)
    {
        if ($parametros['idespecialidadBuscar']) {
            $idespecialidad = $parametros['idespecialidadBuscar'];
            $where .= "AND i.idespecialidad = $idespecialidad";
        }
        //esto hay que arreglarlo en la consulta con Sabedra
        /* if ($parametros['min_cantidad']) {
             $mincantidad = $parametros['min_cantidad'];
             $where .= "AND cantidad > $mincantidad";
         }
         if ($parametros['max_cantidad']) {
             $maxcantidad = $parametros['max_cantidad'];
             $where .= "AND cantidad < $maxcantidad";
         }
         if ($parametros['cantidad']) {
             $cantidad = $parametros['cantidad'];
             $where .= "AND cantidad = $cantidad";
         }

         if ($parametros['min_disponible']) {
             $mindisponibilidad = $parametros['min_disponible'];
             $where .= "AND disponible > $mindisponibilidad ";
         }
         if ($parametros['max_disponible']) {
             $maxdisponibilidad = $parametros['max_disponible'];
             $where .= "AND disponible < $maxdisponibilidad ";
         }
         if ($parametros['disponible']) {
             $disponibilidad = $parametros['disponible'];
             $where .= "AND disponible = $disponibilidad ";
         }*/

        if ($parametros['idnaturaleza']) {
            $idnaturaleza = (is_array($parametros['idnaturaleza'])) ? implode(",", $parametros['idnaturaleza'])
                : $parametros['idnaturaleza'];
            $where .= "AND i.idnaturaleza in ($idnaturaleza) ";
        }
        if ($parametros['naturaleza']) {
            $where .= "AND nat.denominacion ILIKE '%{$parametros['naturaleza']}%' ";;
        }
        if ($parametros['idnaturalezaNotIn']) {
            $idnaturaleza = (is_array($parametros['idnaturalezaNotIn'])) ? implode(",", $parametros['idnaturalezaNotIn']) 
                : $parametros['idnaturalezaNotIn'];
            $where .= "AND i.idnaturaleza not in ($idnaturaleza) ";
        }
        if ($parametros['codigo']) {
            $where .= "AND i.codigo ILIKE '%{$parametros['codigo']}%' ";
        }
        if ($parametros['idpais']) {
            $where .= "AND i.idpais = {$parametros['idpais']}";
        }
        return $where;
    }

    public function GetConteoEntidadSalidas($start, $limit, $parametros, $arrIdesAreas)
    {

        if (!is_array($arrIdesAreas)) {
            // $arrIdesAreas = $this->mComunAFT->getIdEstructurasHijas($arrIdesAreas, false, true);
            $arrIdesAreas = $this->mComunAFT->getIdsAreasHijas();
        }

        if (count($arrIdesAreas) > 0) {
            $arrayEstructuras = " (" . implode(',', $arrIdesAreas) . ")";

            $conn = Zend_Registry::get('conexion');


            $select = " SELECT distinct
                    i.codigo, i.descripcion, i.arridtablas, i.arridtablasgenerales, i.idespecialidad, i.denominacion,
                    i.idindicador, 1 as salidas, modelo.denominacion as modelo,
                    marca.denominacion as marca,
                    (
                     SELECT count(distinct  movreg.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON
                    rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    INNER JOIN mod_logactivofijotangible.dat_movregnumerico movreg on
                    movreg.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo movrega on
                    movreg.idmovregnumerico = movrega.idmovregnumerico
                   WHERE p.idindicador = i.idindicador

                 AND movrega.idarearesp in $arrayEstructuras
                 and rna.idarearesp not in $arrayEstructuras)  as cantidad,
                    0 as disponibilidad,
                    nat.denominacion as naturaleza
                        ";

            $from = " FROM mod_datosmaestros.nom_indicador i
                      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                      INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
                      LEFT JOIN mod_datosmaestros.nom_marca marca on ih.idmarca = marca.idmarca
                      LEFT JOIN mod_datosmaestros.nom_modelo modelo on ih.idmodelo = modelo.idmodelo
            ";

            $where = "
                WHERE (SELECT count(distinct  movreg.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON
                    rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    INNER JOIN mod_logactivofijotangible.dat_movregnumerico movreg on
                    movreg.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo movrega on
                    movreg.idmovregnumerico = movrega.idmovregnumerico
                   WHERE p.idindicador = i.idindicador
                 AND movrega.idarearesp in $arrayEstructuras
                 and rna.idarearesp not in $arrayEstructuras) >0 AND ih.explotacion = 1";
            /*$where = "
            WHERE (SELECT p.idestructura FROM mod_logistica.dat_producto p
                  INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = p.idproducto
                  INNER JOIN mod_logactivofijotangible.dat_movregnumerico movreg2 on
            movreg2.idregnumerico = rn.idregnumerico
                  INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna2 ON
            rna2.idregnumerico = rn.idregnumerico
                  INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo movrega2
            on movreg2.idmovregnumerico = movrega2.idmovregnumerico
                  WHERE p.idindicador = i.idindicador
                  AND p.cronologia > 0
                  AND movrega2.idarearesp in $arrayEstructuras
                  AND rna2.idarearesp not in $arrayEstructuras
                  LIMIT 1
            
          ) IS NOT NULL AND ih.explotacion = 1";*/

            $where = self::GetFiltroConteoEntidadSalidas($where, $parametros);

            if ($parametros['cantidad']) {
                $cantidad = $parametros['cantidad'];
                $where .= "AND p.cantidad = $cantidad";
            }
            if ($parametros['idnaturaleza']) {
                $idnaturaleza = (is_array($parametros['idnaturaleza'])) ? implode(",", $parametros['idnaturaleza'])
                    : $parametros['idnaturaleza'];
                $where .= " AND i.idnaturaleza in ($idnaturaleza) ";
            }
            if ($parametros['tipo'] != 1 && $parametros['idnaturalezaNotIn']) {
                $idnaturaleza = (is_array($parametros['idnaturalezaNotIn'])) ? implode(
                    ",",
                    $parametros['idnaturalezaNotIn']
                ) : $parametros['idnaturalezaNotIn'];
                $where .= " AND i.idnaturaleza not in ($idnaturaleza) ";
            }
            if ($parametros['disponibilidad']) {
                $disponibilidad = $parametros['disponibilidad'];
                $where .= "AND p.disponibilidad = $disponibilidad ";
            }
            //$where .= " AND p.cronologia > 0";
            $sqlDatos = $select . $from . $where;
            $sqlCount = 'SELECT count (distinct i.codigo) ' . $from . $where;

            if ($limit) {
                $sqlDatos .= " offset($start) limit($limit)";
            }
            $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
            $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);

            return array('cantidad' => $total, 'datos' => $datos);
        } else {
            return array('cantidad' => 0, 'datos' => array());
        }
    }

    public function GetFiltroConteoEntidadSalidas($where, $parametros)
    {
        if ($parametros['codigo']) {
            $where .= "AND i.codigo iLike '{$parametros['codigo']}%'";
        }
        if ($parametros['idespecialidad']) {
            $where .= "AND i.idespecialidad = {$parametros['idespecialidad']}";
        }
        if ($parametros['marca']) {
            $idmarca = $parametros['marca'];
            $where .= "AND ih.idmarca = $idmarca ";
        }
        if ($parametros['modelo']) {
            $idmodelo = $parametros['modelo'];
            $where .= "AND ih.idmodelo = $idmodelo ";
        }

        if ($parametros['denominacion']) {
            $where .= "AND i.denominacion iLike '%{$parametros['denominacion']}%'";
        }
        if ($parametros['naturaleza']) {
            $where .= "AND nat.denominacion iLike '%{$parametros['naturaleza']}%'";
        }

        return $where;
    }

    public function GetConteoRegNumericosEntidad($idestructuraop, $parametros, $imprimir = false)
    {
        $sRegNumActivo = new RegNumActivoService();
        $estructura = 'Estructura';
     //   print_r($parametros);die;
        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructuraop[] = $global->$estructura->idestructura;
        }
        $naturaleza = ($parametros['naturaleza']) ? $parametros['naturaleza'] : null;
        unset($parametros['naturaleza']);
        unset($parametros['arrayIdarearesp']);
        if ($parametros['elementosXtabla']) {
            $regOperativo = new RegNumericoAtribDinamicoModel();
            $arrCritDinamicos = $regOperativo->getFiltrosBusqAvanzada(json_decode($parametros['elementosXtabla']));

            $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros, 'drna', $arrCritDinamicos);
        } else {
            $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros);
        }
        //print_r($query->getSqlQuery());die;
        $query->andWhereNotIn('drna.idestadoperacion', array(0, 6, 8));
        $query->addSelect('nmarc.denominacion as marca');
        $query->addSelect('nmod.denominacion as modelo');
        if ($parametros['idmodelo']) {
            $query->addWhere('nmod.idmodelo =?', $parametros['idmodelo']);
        }

        $mMovRegNum = new MovRegNumericoModel();
        $mMovRegNum->addJoinModel($query, 'rn', 'movrn', 1);
        $query->innerJoin('movrn.DatMovimientos mov');
        $query->innerJoin('mov.DatDocumento d');
        $query->innerJoin('i.NomNaturaleza n');
        $query->leftJoin('ih.NomGruposubgrupo ng');
        $query->leftJoin('ng.NomGruposubgrupohoja ngh');
        $query->addSelect('net.denominacion as estado');
        //$query->addSelect('n.denominacion as naturaleza');
        $query->addSelect('p.idproducto');
        $query->addSelect('rn.idregnumerico');
        $query->addSelect('d.idoperacion as idoperacion');
        $query->addSelect('d.iddocumento as iddocumento');
        /* if (!is_array($idestructuraop)) {
             $arrayIdEst = $this->mComunAFT->getIdEstructurasHijas($idestructuraop, false);
         } else if (count($idestructuraop) == 1) {
             $arrayIdEst = $this->mComunAFT->getIdEstructurasHijas($idestructuraop[0], false);
         } else {
             $arrayIdEst = $idestructuraop;
         }*/
        $arrayIdEst = $this->mComunAFT->getIdsAreasHijas();
        $query->addWhere('d.estado = 3');
        $query->whereIn('p.idestructura', $arrayIdEst);
		
		if($parametros['idestructuracomun']){
			$query->addWhere('p.idestructuracomun = ?', array($parametros['idestructuracomun']));
		}
        if ($parametros['tipo'] == 1) {
            $query->andWhereIn('n.idnaturaleza', array($this->idnatObjObra, $this->idnatINMUEBLE));
        } else {
            $query->andWhereNotIn('n.idnaturaleza', array($this->idnatObjObra, $this->idnatINMUEBLE));
        }
        if ($parametros['exportar'] == 1) {
            $query->addWhere('drna.idestadoperacion <> 7');
        }

        #region Para poder pedir el area de responsabilidad del medio
        $this->mComunAFT->incluirEstructuraHack();
        $relacion[] = array('cardinalidad' => 'one', 'relation' => 'NomFilaestruc',
                            'properties'   => array('local' => 'idarearesp', 'foreign' => 'idfila'));
        $rnaft = new DatRegnumericoActivo();
		$loghelper = LogisticaDoctrineHelper::__init();
        $loghelper->tryInyectRelactions($rnaft, $relacion);
        $query->innerJoin('drna.NomFilaestruc nfe');
        $query->innerJoin('nfe.DatEstructuraop deop');
        $query->addSelect('deop.denominacion as denomarearesp');

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'NomGruposubgrupo',
            'properties' => array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'NomNaturaleza',
            'properties' => array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza')
        ); 
        $ref =new DatRegnumericoActivo();
        $helper = LogisticaDoctrineHelper::__init();
        $helper->tryInyectRelactions($ref, $relations); 

        $rela[] = array('cardinalidad' => 'one', 'relation' => 'NomFilaestruc',
        'properties'   => array('local' => 'idestructuracomun', 'foreign' => 'idfila'));
        $prodL = new DatProductoLogistica();
		$helper1 = LogisticaDoctrineHelper::__init();
		$helper1->tryInyectRelactions($prodL, $rela);
       // $query->innerJoin('p.DatRegnumerico drn');
        //$query->innerJoin('drn.DatRegnumericoActivo drnac');  
         //$query->innerJoin('p.DatRegnumerico drn');
         $query->innerJoin('rn.DatRegnumericoActivo drnac'); 
        $query->leftJoin('drnac.NomGruposubgrupo ngsub');
     //   $query->leftJoin('ngsub.NomGruposubgrupohoja ngsh');  
        $query->leftJoin('p.NomFilaestruc nfe_entidad');
        $query->leftJoin('drnac.NomNaturaleza natu ');
		$query->leftJoin('nfe_entidad.DatEstructura estruct');
		$query->leftJoin('nfe_entidad.DatEstructuraop estruct1');    
        $query->addSelect('COALESCE(estruct.denominacion, estruct1.denominacion) as denomentidad');
        $query->addSelect('COALESCE(ngsub.denominacion,ng.denominacion) as descripciongrupo');  
        $query->addSelect('COALESCE(natu.denominacion,n.denominacion) as naturaleza');
        // Para los campos nulos
        if ($parametros['tipomedio']) {
            $nomIndicador = new NomIndicador();
            $array[] = array('cardinalidad' => 'one',
                             'relation'     => 'ConfTipomedionaturaleza',
                             'properties'   => array('local'   => 'idnaturaleza',
                                                     'foreign' => 'idnaturaleza'));
            LogisticaDoctrineHelper::__init()->tryInyectRelactions($nomIndicador, $array);

            $query->innerJoin('i.ConfTipomedionaturaleza conftipom');
            $query->addWhere('conftipom.tipo =?', $parametros['tipomedio']);
        }
        if ($parametros['Datos generales']) {
            
            $parametros['Datos generales'] = split(',', $parametros['Datos generales']);
            foreach ($parametros['Datos generales'] as $camposnull) {

                if ($camposnull == 'nroserie') {
                    $query->addWhere("rn.{$camposnull} is NULL");
                    continue;
                }
                if ($camposnull == 'valorresidual') {
                    $query->addWhere("(drna.valorcontable - drna.depreciacionacumulada) = 0 ");
                    continue;
                }
                if($camposnull == 'responsable' || $camposnull == 'idresponsable'){
                    $query->addWhere("drna.idresponsable is NULL");
                    continue;
                    //idcolorprim,idactividad,responsable,ubicacion,idcategoria,idestatustecnico,iddeposito
                }
                if($camposnull == 'ubicacion' || $camposnull == 'idubicacion'){
                    $query->addWhere("drna.idubicacion is NULL");
                    continue;
                }
                if($camposnull == 'iddeposito'|| $camposnull == 'idarearesp'){
                    $query->addWhere("drna.idarearesp is NULL");
                    continue;
                }
                else {  
                    $query->addWhere("drna.{$camposnull} is NULL");
                }
            }
        }
        // if ($parametros['sort']) {
        //     $parametros['sort'] = ($parametros['sort'] == 'estadoperacion') ? 'idestadoperacion' : $parametros['sort'];
        //     $query->orderBy("{$parametros['sort']} {$parametros['dir']}");
        // } else {
        //     $query->orderBy('i.denominacion ASC');
        // }

        /*print_r(
            array (
                'params' => $query->getParams(),
                'sql' => $query->getSqlQuery()
            )
        );die;*/

        $query->addSelect('(drna.valorcontable - drna.depreciacionacumulada) as valorresidual');
        //print_r($query->getSqlQuery());die;

        $datos = $query->fetchArray();

        /* Esto es para devolver el estado de las operaciones */
        $arrEstadosOperaciones = $this->mComunAFT->GetArrEstadosoperacion();
        $centrocosto = ServiciosContabilidadFinanzasHelper::__init();
        $cantBajas = 0;
        foreach ($datos as $key => $registro) {
            $valoradquisicion = $registro['valoradquisicion'];
            $valoradquisicionalternativo = $registro['valoradquisicionalternativo'];

            unset($datos[$key]['valoradquisicion']);
            unset($datos[$key]['valoradquisicionalternativo']);

            $datos[$key]['valoradquisicion'] = round($valoradquisicion, 2);
            $datos[$key]['valoradquisicionalternativo'] = round($valoradquisicionalternativo, 2);

            $datos[$key]['cantidadrecursoconsumido'] = $registro['recursoconsumido'] +
                $registro['cantidadrecursoconsumido'];
            if (!is_null($registro['idcentrocosto'])) {
                $dat = $centrocosto->obtenerCentroNivelPorId($registro['idcentrocosto']);				
				$datos[$key]['denomcentrocosto'] = $dat['codigocentrogrupo'] . " - " . $dat['descripcioncentrogrupo'];
            }
            $datos[$key]['estadoperacion'] = $arrEstadosOperaciones[$datos[$key]['idestadoperacion']];
            ($datos[$key]['idestadoperacion'] != 7) ?: $cantBajas++;
        }
        $cantidad = $query->count();
        $query->addWhere('drna.idestadoperacion = 7');
        $cantBajas = $query->count();
        if ($imprimir == true) {
            $arrIdregistros = array();
            foreach ($datos as $key => $registro) {
                array_push($arrIdregistros, $registro['idregnumerico']);
            }

            $resp = implode(',', $arrIdregistros);
            return array('datos' => $resp, 'total' => 0);
        } else {
            return array('datos' => (count($datos) > 0) ? $datos : array(), 'cantidad' => $cantidad,
                         'bajas' => $cantBajas);
        }
    }

    public function GetConteoRegNumericosEntidadSalidas($parametrosOll, $idestructuraop, $imprimir = false)
    {

        unset($parametrosOll['estadoperacion']);

        $sRegNumActivo = new RegNumActivoService();

        $estructura = 'Estructura';
        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructuraop[] = $global->$estructura->idestructura;
        }

        $limit = $parametrosOll['limit'];
        $start = $parametrosOll['start'];
        unset($parametrosOll['limit']);
        unset($parametrosOll['start']);

        $result = $sRegNumActivo->getObjRegNumActivoModel()->cargarMovimientosActivos($parametrosOll);
      //  print_r($result['query']->getSqlQuery());die;
        $query = $result['query'];
        $query->innerJoin('mns.DatMovimientos mov');
        $query->innerJoin('mov.DatDocumento d');
      //  $query->innerJoin('i.NomNaturaleza n');
        $query->innerJoin('rn.DatRegnumericoActivo drna');
       // $query->addSelect('nmarc.denominacion as marca');
       // $query->addSelect('nmod.denominacion as modelo');
        //$query->addSelect('net.denominacion as estado');
      //  $query->addSelect('n.denominacion as naturaleza');
        $query->addSelect('drna.idestadoperacion as idestadoperacion');

        if (count($idestructuraop) == 1) {
            // $arrayIdEst = $this->mComunAFT->getIdEstructurasHijas($idestructuraop[0], false);
            $arrayIdEst = $this->mComunAFT->getIdsAreasHijas();
        } else {
            $arrayIdEst = $idestructuraop;
        }

        $this->getFiltrosConteoRegNumericosEntidadSalidas($query, $parametrosOll, $arrayIdEst);

        $cantTotal = $query->count();
        if ($limit) {
            $query->limit($limit);
            $query->offset($start);
        }
        $datos = $query->fetchArray();
        foreach ($datos as $key => $value) {;
            $arrEstadosOperaciones = $this->mComunAFT->GetArrEstadosoperacion();
            $datos[$key]['estadoperacion'] = $arrEstadosOperaciones[$value['idestadoperacion']];
        }

        if ($imprimir == true) {
            self::getConteoEntidadFor($datos);
        } else {
            return array('datos' => (count($datos) > 0) ? $datos : array(), 'cantidad' => $cantTotal);
        }

//         if (!$idestructuraop) {
//            $global = ZendExt_GlobalConcept::getInstance();
//
//            $idestructuraop[] = $global->Estructura->idestructura;
//        }
//
//        if (count($idestructuraop) == 1) {
//            $arrayEstructuras = "( SELECT idfila FROM mod_estructuracomp.nom_filaestruc
//                                                 WHERE lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc
//                                                        WHERE idfila = $idestructuraop[0]) AND rgt <=
//                                                            (SELECT rgt FROM mod_estructuracomp.nom_filaestruc
//                                                                WHERE idfila = $idestructuraop[0]))";
//        } else {
//            $arrayEstructuras = " (" . implode(',', $idestructuraop) . ")";
//        }
//        $conn = Zend_Registry::get('conexion');
//
//        $select = " SELECT distinct
//                    i.codigo, i.descripcion, i.arridtablas, i.arridtablasgenerales, i.idespecialidad, i.denominacion,
//                    i.idindicador, 1 as salidas, pais.nombrepais as siglasnacionalidad, modelo.denominacion as modelo,
//                    marca.denominacion as marca,
//                    (select count (distinct  movreg.idregnumerico) from  mod_logistica.dat_producto pp
//
//                     inner join mod_datosmaestros.nom_indicador i2 on pp.idindicador = i2.idindicador
//                     inner join mod_logactivofijotangible.dat_activofijo a on pp.idproducto = a.idactivofijo
//                     inner join mod_logistica.dat_movimiento mov on pp.idproducto = mov.idproducto
//                     inner join mod_logactivofijotangible.dat_movregnumerico movreg on
                       //movreg.idmovimiento = mov.idmovimiento
//                     inner join mod_logactivofijotangible.dat_registronumerico reg on
        //              movreg.idregnumerico = reg.idregnumerico
//                     inner join mod_logactivofijotangible.dat_regnumericoactivo rega2
//                     on rega2.idregnumerico = reg.idregnumerico
//                     inner join mod_logactivofijotangible.dat_movregnumericoactivo movrega
//                     on movreg.idmovregnumerico = movrega.idmovregnumerico
//                      WHERE i2.idindicador = i.idindicador and movreg.idregnumerico NOT IN ( Select r2.idregnumerico
//                    FROM mod_logactivofijotangible.dat_registronumerico r2
//                    inner join mod_logactivofijotangible.dat_regnumericoactivo rna2
//                    on rna2.idregnumerico = r2.idregnumerico
//
//                                            WHERE rna2.idarearesp IN $arrayEstructuras)
//                  AND movrega.idarearesp IN $arrayEstructuras) as cantidad,
//    0 as disponibilidad,
//    n.denominacion as naturaleza
//        ";
//
//        $from
//            = " FROM mod_logactivofijotangible.dat_activofijo a
//                INNER JOIN mod_logistica.dat_producto p ON a.idactivofijo = p.idproducto
//                INNER JOIN mod_logistica.dat_movimiento m ON p.idproducto = m.idproducto
//                inner join mod_logistica.dat_documento doc on m.iddocumento = doc.iddocumento
//                inner join mod_logactivofijotangible.dat_registronumerico reg on p.idproducto = reg.idproducto
//                inner join mod_logactivofijotangible.dat_movregnumerico movreg2 on
//                reg.idregnumerico = movreg2.idregnumerico
//                inner join mod_logactivofijotangible.dat_movregnumericoactivo movrega2
//                on movreg2.idmovregnumerico = movrega2.idmovregnumerico
//                INNER JOIN mod_estructuracomp.nom_filaestruc f ON p.idestructura = f.idfila
//                LEFT  JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
//                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
//                LEFT  JOIN mod_datosmaestros.nom_pais pais ON i.idpais = pais.idpais
//                LEFT  JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
//                LEFT  JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
//                INNER JOIN mod_datosmaestros.nom_naturaleza n ON i.idnaturaleza = n.idnaturaleza
//        ";
//
//        $where = " WHERE movrega2.idarearesp IN $arrayEstructuras
//                  AND movreg2.idregnumerico NOT IN ( Select reg2.idregnumerico
//                  FROM mod_logactivofijotangible.dat_registronumerico reg2
//                  inner join mod_logactivofijotangible.dat_regnumericoactivo rega2
//                  on rega2.idregnumerico = reg2.idregnumerico
//
//                  WHERE rega2.idarearesp IN $arrayEstructuras) AND m.cronologia > 0 AND doc.estado = 3";
//        $where = self::GetFiltroConteoEntidadSalidas($where, $parametros);
//
//        $sqlDatos = $select . $from . $where;
//
//        $sqlCount = 'SELECT count (distinct i.codigo) ' . $from . $where;
//
//        if ($limit) {
//            $sqlDatos .= " offset($start) limit($limit)";
//        }
//
//        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
//        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
//
//        return array('datos' => (count($datos) > 0) ? $datos : array(),
//            'total' => (count($total)) ? $total[0]['count'] : 0);
    }

    /**
     *
     */
    public function getFiltrosConteoRegNumericosEntidadSalidas(&$query, $parametrosOll, $arrayIdEst)
    {
        $queryregnum = Doctrine_Query::create();
        $queryregnum->FROM('DatRegnumerico rn');
        $queryregnum->addSELECT('rn.idregnumerico');
        $queryregnum->innerJoin('rn.DatRegnumericoActivo rna');
        $queryregnum->whereIn('rna.idarearesp', $arrayIdEst);
        $result = $queryregnum->fetchArray();
        foreach ($result as $i => $idregnum) {
            $arrayIdRegNum[$i] = $idregnum['idregnumerico'];
        };
        $query->whereNotIn('mns.idregnumerico', $arrayIdRegNum);
        $query->addWhere('d.estado = 3');
        $query->whereIn('mrna.idarearesp', $arrayIdEst);

        (!$parametrosOll['idindicador']) ?: $query->addWhere('i.idindicador = ?', $parametrosOll['idindicador']);

        // ($parametrosOll['tipo'] == 1)
        //     ?
        //     $query->andWhereIn('n.idnaturaleza', array($this->idnatObjObra, $this->idnatINMUEBLE))
        //     :
        //     $query->andWhereNotIn('n.idnaturaleza', array($this->idnatObjObra, $this->idnatINMUEBLE));

        if ($parametrosOll['camposnull'] && $parametrosOll['nombreplugin'] == 'Datos generales') {
            ($parametrosOll['camposnull'] == "nroserie")
                ?
                $query->addWhere("rn.{$parametrosOll['camposnull']} is NULL")
                :
                $query->addWhere("rna.{$parametrosOll['camposnull']} is NULL");
        }

        // (!$parametrosOll['sort'] || ($parametrosOll['sort'] && $parametrosOll['sort'] == 'estadoperacion'))
        //     ?
        //     $query->orderBy('nmarc.denominacion ASC, nmod.denominacion ASC')
        //     :
            // $query->orderBy("{$parametrosOll['sort']} {$parametrosOll['dir']}");

    }

    public function getConteoEntidadFor($datos)
    {
        $arrIdregistros = array();
        foreach ($datos as $registro) {
            array_push($arrIdregistros, $registro['idregnumerico']);
        }
        $resp = implode(',', $arrIdregistros);
        return array('datos' => $resp, 'total' => 0);
    }

    public function cargarDatosListadoDocRegNum($parametros)
    {
        $objMovService = new MovimientoService();
        $sConfGen = ServiciosConfiguracionGeneralHelper::__init();
        $movimientos = $objMovService->getMovimientosDocRegNum($parametros, false);
        //$idcomprobantes = [];
        for ($i = 0; $i < count($movimientos['datos']); $i++) 
        {

            /*$estruct = ServiciosEstructuraComposicionHelper::__init()->getEstructura(
                $movimientos['datos'][$i]['idarearesp']
            );*/
            $estruct = $this->integrator->metadatos->DameEstructura(
                $movimientos['datos'][$i]['idarearesp']
            );
            $movimientos['datos'][$i]['denomarearesp'] = $estruct[0]->denominacion;
            //$padre = ServiciosEstructuraComposicionHelper::__init()->getEstructura($estruct[0]->idpadre);
            //$padre = $this->integrator->metadatos->DameEstructura($estruct[0]->idpadre);

            $padre = ServiciosEstructuraComposicionHelper::__init()->getEstructura(
                $movimientos['datos'][$i]['identidad']
            );
            $movimientos['datos'][$i]['denomentidad'] = $padre[0]->denominacion;



            $oper = $sConfGen->obtenerOperaciones(
                null, null, null, $movimientos['datos'][$i]['idoperacion'], null, null, null
            );


            $movimientos['datos'][$i]['denominacion'] = $oper[0]['denominacion'];
            $movimientos['datos'][$i]['codigooperacion'] = $oper[0]['codigooperacion'];



            if ($oper[0]['codigooperacion'] == 'OPER_PRESTAMO') {
                $ddq = Doctrine_Query::create();
                //$doc = Doctrine::getTable('DatDocPrestamo')->find($movimientos['datos'][$i]['iddocumento']);
                $doc = $ddq->select('iddocprestamo, idpersona, idclientesproveedores')
                    ->from("DatDocPrestamo")->where(
                        "iddocprestamo = ?", array($movimientos['datos'][$i]['iddocumento'])
                    )
                    ->fetchArray();
                $idestructura = $this->global->Estructura->idestructura;
                if ($doc[0]['idpersona']) {
                    //cargar persona con algun servicio pasandolde $doc->idpersona
                    $persona = $this->serviciosRecursosHumanos->getPrincipalesDatosPersona(
                        array($doc[0]['idpersona']), $parametros['criterio'], 30, 0, array(0 => $idestructura),
                        array(), null
                    );
                    $movimientos['datos'][$i]['responsable'] = $persona->data[0]['nombreapellidos'];
                } else {
                    if ($doc[0]['idclientesproveedores']) {
                        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
                        $proveedores = $configuracionHelper->getClientesProveedorByParams(
                            $doc[0]['idclientesproveedores'], $idestructura, true, true, true, null, 0, 30
                        );
                        $movimientos['datos'][$i]['responsable'] = $proveedores['datos'][0]['nombre'];
                    }
                }
            }


            //if( $documento['idcomprobante'] != null && $documento['idcomprobante'] != -1){
            if( $movimientos['datos'][$i]['idcomprobante'] != null && $movimientos['datos'][$i]['idcomprobante'] != -1){
                //array_push($idcomprobantes, $movimientos['datos'][$i]['idcomprobante']);
                    
                
                $sql = "SELECT * FROM mod_contabilidad.dat_comprobante comp 
                        WHERE comp.idcomprobante = {$movimientos['datos'][$i]['idcomprobante']}";
                $conn = Zend_Registry::get('conexion');
                $comprobante = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                $movimientos['datos'][$i]['numerocomprobante'] = $comprobante[0]['numerocomprobante'];
                
            }
        }

        /*
        $conn = Zend_Registry::get('conexion');
        $idcomprobantesString = implode(',', $idcomprobantes);
        $sql = "SELECT comp.numerocomprobante, comp.idcomprobante
            FROM mod_contabilidad.dat_comprobante comp 
            WHERE comp.idcomprobante in ({$idcomprobantesString})";
        
        print_r($sql);//die;
        $comprobante = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        print_r($comprobante);die;
        */


        return $movimientos;
    }

    public function getDatosMovimiento($parametros)
    {
        $parametros['idmovregnumerico'] = Zend_Json::decode($parametros['idmovregnumerico']);
        $centrocosto = ServiciosContabilidadFinanzasHelper::__init();
        if ($parametros['idmovregnumerico']) {
            $sRegNumActivo = new RegNumActivoService();
            $result = $sRegNumActivo->cargarMovRegNumAftByIds(false);

            $query = $result['query'];
            $query->innerJoin('dmrna.NomEstatustecnico es');
            $query->addSelect('es.denominacion as denomestadotecnico');
            
            $query->innerJoin('mns.DatMovimientos dm');
            $query->innerJoin('dm.DatDocumento dd');
            $query->addSelect('dd.idoperacion as idoperacion');
            

            $query->whereIn('mrna.idmovregnumerico', $parametros['idmovregnumerico']);
            $datos = $query->fetchArray();


            foreach ($datos as $index => $row) {

                if($row['idoperacion']){
                    $operData = $this->mComunAFT->getDatosInterfazByIdOperacion($row['idoperacion']);
                    
                    $multiplicadorSigno = 1;
                    if($operData['codigo'] == 'OPER_MOD_VALOR_DIS' || $operData['codigo'] == 'OPER_MOD_VALOR_DIS_UH'){
                        $multiplicadorSigno = -1;
                    }
                    $datos[$index]['valorcontable'] = $row['valorcontable'] + ($row['diferenciavalor'] * $multiplicadorSigno);
                    $datos[$index]['valorcontablealternativo'] = $row['valorcontablealternativo'] + ($row['diferenciavaloralternativo'] * $multiplicadorSigno);
                    $datos[$index]['depreciacionacumulada'] = $row['depreciacionacumulada'] + ($row['diferenciadepreciacion'] * $multiplicadorSigno);
                    $datos[$index]['depreciacionacumuladaalternativo'] = $row['depreciacionacumuladaalternativo'] + ($row['diferenciadepreciacionalternativo'] * $multiplicadorSigno);
                   

                }
                if ($row['idestructuracomun']) {
                    //$denominacion = $this->servicioEyC->getEstructura($row['idestructuracomun']);
                    $denominacion = $this->integrator->metadatos->DameEstructura($row['idestructuracomun']);
                    $datos[$index]['entidad'] = $denominacion[0]->denominacion;
                }
                if ($row['idarearesp']) {
                    //$denominacion = $this->servicioEyC->getEstructura($row['idarearesp']);
                    $denominacion = $this->integrator->metadatos->DameEstructura($row['idarearesp']);
                    $datos[$index]['arearesponsabilidad'] = $denominacion[0]->denominacion;
                }
                if ($row['idubicacion']) {
                    $sql = " SELECT u.descripcion as ubicacion
                        FROM mod_logubicacion.dat_estructuraubicacion u
                        WHERE (u.idestructuraubicacion = {$row['idubicacion']})";
                    $conn = Zend_Registry::get('conexion');
                    $respdata = $conn->execute($sql);
                    $respdata = $respdata->fetchAll(PDO::FETCH_ASSOC);
                    $datos[$index]['ubicacion'] = $respdata[0]['ubicacion'];
                }

                $dataft = Doctrine::getTable('DatRegnumericoActivo')->find($row['idregnumerico']);
                $datos[$index]['idestadoperacion'] = $dataft->idestadoperacion;
                if (!is_null($row['idcentrocosto'])) {
                    $dat = $centrocosto->obtenerCentroNivelPorId($row['idcentrocosto']);
                    $datos[$index]['denomcentrocostomov'] = $dat['descripcioncentrogrupo'];
                }

            }
            
            return array('datos' => (count($datos) > 0) ? $datos : array(), 'total' => $query->count());
        } else {
            return array('datos' => array(), 'total' => 0);
        }
    }

    public function cargarComboEjercicios($identidad)
    {
        $ejercicio = ServiciosConfiguracionGeneralHelper::__init()->ObtenerEjercicios($identidad);
        return array('datos' => $ejercicio);
    }

    public function configureParams($params, $uiParams)
    {
        foreach ($params as $row) {
            if ($row->type == 'date') {
                $row->value = date("Y-m-d", strtotime($row->value));
            }
            if ($row->type == 'numeric' || $row->type == 'date') {
                if ($row->comparison == 'gt') {
                    $uiParams['min_' . $row->field] = $row->value;
                }
                if ($row->comparison == 'lt') {
                    $uiParams['max_' . $row->field] = $row->value;
                }
                if ($row->comparison != 'eq') {
                    unset($uiParams[$row->field]);
                } else {
                    $uiParams[$row->field] = $row->value;
                }
            }
            if ($row->type == 'string') {
                $uiParams[$row->field] = $row->value;
            }
            if ($row->type == 'list') {
                $uiParams[$row->field] = $row->value;
            }
        }
        return $uiParams;
    }

    public function getEstadosOperacion()
    {
        return $this->mComunAFT->GetArrEstadosoperacion();
    }

    /*
      public function GetGraficaDepreciacion($idregistronumerico)
      {
      $respDatos = array();
      $comunAFTModel = ComunAFTModel::getInstance();
      $operDepreciacion = $comunAFTModel->getDatosInterfazOperacion(
      false, false, 'OPER_DEPRECIACION'
      );


      $operIniciales = array_merge(
      $comunAFTModel->getDatosInterfazOperacion(false, false, 'OPER_APERTURA'),
      $comunAFTModel->getDatosInterfazOperacion(false, false, 'OPER_ALTA')
      );

      if (count($operIniciales)) {

      $conn = Zend_Registry::get('conexion');

      foreach ($operIniciales as &$value) {
      $value = $value['idoperacion'];
      }

      $operIniciales = implode(',', $operIniciales);

      $select
      = " SELECT
      MIN (d.fechacontable) as fechacontable,
      mrna.depreciacionacumulada
      ";

      $from
      = "
      FROM mod_logactivofijotangible.dat_regnumericoactivo rna
      INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn ON rna.idregnumerico = mrn.idregnumerico
      INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna
      on mrn.idmovregnumerico = mrna.idmovregnumerico
      INNER JOIN mod_logistica.dat_movimiento m ON mrn.idmovimiento = m.idmovimiento
      INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento
      ";

      $where = " WHERE
      m.cronologia > 0 AND
      mrn.idregnumerico = $idregistronumerico AND
      d.idoperacion IN ($operIniciales)

      GROUP BY mrna.depreciacionacumulada, d.fechacontable
      LIMIT 1
      ";


      $respDatos = $conn->execute($select . $from . $where)->fetchAll(
      PDO::FETCH_ASSOC
      );
      } else {
      throw new Exception(
      'No existen operaciones de entradas configuradas en el sistema'
      );
      }


      if (count($operDepreciacion)) {

      $conn = Zend_Registry::get('conexion');

      foreach ($operDepreciacion as &$value) {
      $value = $value['idoperacion'];
      }

      $operDepreciacion = implode(',', $operDepreciacion);

      $select
      = " SELECT
      mrna.depreciacionacumulada,
      d.fechacontable
      ";

      $from
      = "
      FROM mod_logactivofijotangible.dat_regnumericoactivo rna
      INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn ON rna.idregnumerico = mrn.idregnumerico
      INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna
      on mrn.idmovregnumerico = mrna.idmovregnumerico
      INNER JOIN mod_logistica.dat_movimiento m ON mrn.idmovimiento = m.idmovimiento
      INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento
      ";

      $where = " WHERE
      m.cronologia > 0 AND
      mrn.idregnumerico = $idregistronumerico AND
      d.idoperacion IN ($operDepreciacion)
      ";

      $respDatos = array_merge(
      $respDatos,
      $conn->execute($select . $from . $where)->fetchAll(
      PDO::FETCH_ASSOC
      )
      );
      } else {
      throw new Exception(
      'No existen operaciones de depreciación configuradas en el sistema'
      );
      }

      $datos = array();
      $fechas = array();

      foreach ($respDatos as $value) {

      $idFecha = strtotime(
      ComunAFTModel::getInstance()->setDateFormatoIngles($value['fechacontable'])
      );

      $datos[] = array($idFecha, $value['depreciacionacumulada']);
      $fechas[] = array($idFecha, $value['fechacontable']);
      }

      return array('datos'  => array(array('data' => $datos)),
      'fechas' => $fechas);
      }



      public function getDatEspecificosDoc($idDocumento, $idOperacion)
      {
      $objDocService = new DocumentoActivoService();
      $comun = ComunAFTModel::getInstance();
      $datos = $comun->getDatosInterfazByIdOperacion($idOperacion);

      if ($datos['signo'] == '-' || $datos['signo'] == '+') {
      return $objDocService->getDatosDocumentoOrigen($idDocumento, $idOperacion);

      }
      return $objDocService->getDatEspecificosDoc($idDocumento, $idOperacion);


      }

     */
    public function respuesta($parametros){
        $respuestaa = [];
        $parametros['exportar'] = 1;
        if ($parametros['salidas'] != 2) {//Para los disponibles                
            $respuesta = $this->GetConteoRegNumericosEntidad($parametros['arrayIdarearesp'], $parametros);
           $respuestaa['datos'] = $respuesta['datos'];
           $respuestaa['cantidad'] = $respuesta['cantidad'];
           $respuestaa['bajas'] = $respuesta['bajas'];
        } else {
            //Para los que han salido de la entidad
            $respuesta = $this->GetConteoRegNumericosEntidadSalidas($parametros, $parametros['arrayIdarearesp']);
            $centrocosto = ServiciosContabilidadFinanzasHelper::__init();
            foreach ($respuesta['datos'] as $key => $registro) {
                if (!is_null($registro['idcentrocosto'])) {
                    $dat = $centrocosto->obtenerCentroNivelPorId($registro['idcentrocosto']);
                    $respuesta['datos'][$key]['denomcentrocosto'] = $dat['descripcioncentrogrupo'];
                }
            }
            $respuestaa['datos'] = $respuesta['datos'];
           $respuestaa['cantidad'] = $respuesta['cantidad'];
        }
        return $respuestaa;
    }

    public function crearExcelVistageneral(){
        
        mkdir('tmp');
        $fecha = date("y.m.d");
        $fichero = "tmp/Listado_Vista_General_{$fecha}.xls";
        $excel = new ExcelWriter($fichero);
        $parametros = null;        
        $arrIdesAreas = $this->global->Estructura->idestructura;
        $arraydata = $this->getConteoEntidad($start = 0, $limit, $parametros, $arrIdesAreas);
        $datos = $arraydata['datos'];
        $cantidadTotal = $arraydata['cantidad'];
        $aumento = 10000;

        $columns = array(
            array('header' => '<b>Código</b>', 'dataIndex' => 'codigo'),
            array('header' => '<b>Código del proveedor</b>', 'dataIndex' => 'numeropieza'),
            array('header' => '<b>Marca-modelo</b>', 'dataIndex' => 'marcamodelo'),
            array('header' => '<b>Disponible</b>', 'dataIndex' => 'disponible'),
            array('header' => '<b>Cantidad</b>', 'dataIndex' => 'cantidad'),
            array('header' => '<b>Naturaleza</b>', 'dataIndex' => 'naturaleza'),
            array('header' => '<b>Grupo de activos</b>', 'dataIndex' => 'activ1000000003'),
            array('header' => '<b>Grupo de útiles</b>', 'dataIndex' => 'activ1000000004'),
            array('header' => '<b>Administrativo</b>', 'dataIndex' => 'activ1000000006'),
            array('header' => '<b>Auxilio</b>', 'dataIndex' => 'activ1000000007'),
            array('header' => '<b>Servicio</b>', 'dataIndex' => 'activ1000000008'),
            array('header' => '<b>Turístico</b>', 'dataIndex' => 'activ1000000005')
        );
        
        foreach ($columns as $col) {
            $excel->writeCol($col['header']);
        }

        $excel->writeRow();

        $this->crearExcel($columns, $datos, $excel);
        $excel->close();
        return '/logistica/activos_fijos/recuperaciones/' . $fichero;
    }

    public function crearExcelRegistronumerico($params)
    {
        mkdir('tmp');
        $fecha = date("y.m.d");
        $fichero = "tmp/listado_activos_{$fecha}.xls";
        $excel = new ExcelWriter($fichero);
        $data = $this->respuesta(['salidas' => -1, 'tipo' => 0,'start' => 0,'limit' => 1]);
        $cantidadTotal = $data['cantidad'];
        $aumento = 10000;
        $datos = $data['datos'];
        $columns = array(  
            array('header' => '<b>Entidad</b>', 'dataIndex' => 'denomentidad'),
            array('header' => '<b>Código</b>', 'dataIndex' => 'codigo'),
            array('header' => '<b>Códigoproveedor</b>', 'dataIndex' => 'numeropieza'),
            array('header' => '<b>Denominación</b>', 'dataIndex' => 'denominacion'),
            array('header' => '<b>Grupo</b>', 'dataIndex' => 'descripciongrupo'),           
            array('header' => '<b>Marca</b>', 'dataIndex' => 'marca'),
            array('header' => '<b>Modelo</b>', 'dataIndex' => 'modelo'),
            array('header' => '<b>Estado operación</b>', 'dataIndex' => 'estadoperacion'), 
            array('header' => '<b>Naturaleza</b>', 'dataIndex' => 'naturaleza'),
            array('header' => '<b>Centro de costo</b>', 'dataIndex' => 'denomcentrocosto'),          
            array('header' => '<b>Num de serie</b>', 'dataIndex' => 'nroserie'),
            array('header' => '<b>Num de inventario</b>', 'dataIndex' => 'nroinventario'),
            array('header' => '<b>Valor de adquisición</b>', 'dataIndex' => 'valoradquisicion'),
            array('header' => '<b>Valor contable</b>', 'dataIndex' => 'valorcontable'),
            array('header' => '<b>Depreciación acumulada</b>', 'dataIndex' => 'depreciacionacumulada'),
            array('header' => '<b>Valor residual</b>', 'dataIndex' => 'valorresidual'),
            array('header' => '<b>Año de fabricación</b>', 'dataIndex' => 'annofabricacion'), 
            array('header' => '<b>Recurso consumido máximo</b>', 'dataIndex' => 'recursoconsumidomax'),
            array('header' => '<b>Color primario</b>', 'dataIndex' => 'colorprim'),
            array('header' => '<b>Color secundario</b>', 'dataIndex' => 'colorsec'),
            array('header' => '<b>Recursos consumidos</b>', 'dataIndex' => 'recursoconsumido'), 
            array('header' => '<b>Cantidad recursos consumidos</b>', 'dataIndex' => 'cantidadrecursoconsumido'), 
            array('header' => '<b>Grupo de explotación</b>', 'dataIndex' => 'actividad'),
            array('header' => '<b>Responsable</b>', 'dataIndex' => 'responsable'),
            array('header' => '<b>Ubicación</b>', 'dataIndex' => 'ubicacion'),
            array('header' => '<b>Categoría</b>', 'dataIndex' => 'categoria'),
            array('header' => '<b>Fecha de adquisición</b>', 'dataIndex' => 'fechaadq'),
            array('header' => '<b>Fecha de explotación inicio</b>', 'dataIndex' => 'fechaexpini'),
            array('header' => '<b>Fecha de explotación fin</b>', 'dataIndex' => 'fechaexpfin'),          
            array('header' => '<b>Vida útil</b>', 'dataIndex' => 'vidautil'),
            array('header' => '<b>Tasa fiscal (%)</b>', 'dataIndex' => 'tasafiscal'),
            array('header' => '<b>% de recuperación</b>', 'dataIndex' => 'porcientorecuperacion'),
            array('header' => '<b>Estado técnico</b>', 'dataIndex' => 'denomestadotecnico'),
            array('header' => '<b>Area de resposabilidad</b>', 'dataIndex' => 'denomarearesp'),          
            array('header' => '<b>Fecha inicial de garantía</b>', 'dataIndex' => 'fechainicialgarantia'),
            array('header' => '<b>Fecha final de garantía</b>', 'dataIndex' => 'fechafingarantia'),            
            array('header' => '<b>Nro de matrícula</b>', 'dataIndex' => 'nromatricula'),
            array('header' => '<b>Nro de circulación</b>', 'dataIndex' => 'nrocirculacion'),
            array('header' => '<b>Nro de motor 1</b>', 'dataIndex' => 'nromotor1'),
            array('header' => '<b>Nro de motor 2</b>', 'dataIndex' => 'nromotor2'),
            array('header' => '<b>Indicativo</b>', 'dataIndex' => 'indicativo'),
            array('header' => '<b>Indice de consumo</b>', 'dataIndex' => 'indiceconsumo'),
            array('header' => '<b>Tipo de combustible</b>', 'dataIndex' => 'idtipocombustible'),
            array('header' => '<b>Ficav</b>', 'dataIndex' => 'ficav'),
            array('header' => '<b>Lot</b>', 'dataIndex' => 'lot'),
            array('header' => '<b>Pax</b>', 'dataIndex' => 'capacidad'),
            array('header' => '<b>Vin</b>', 'dataIndex' => 'vin'),
            array('header' => '<b>Nro llave</b>', 'dataIndex' => 'nollaveencendido'),
            array('header' => '<b>Fecha expedición circulación</b>', 'dataIndex' => 'expedicioncirculacion'),
            array('header' => '<b>Fecha vencimiento circulación</b>', 'dataIndex' => 'vencimientocirculacion'),
            array('header' => '<b>Fecha vencimiento ficav</b>', 'dataIndex' => 'vencimientoficav'),
            array('header' => '<b>Fecha vencimiento lot</b>', 'dataIndex' => 'vencimientolot'),
            array('header' => '<b>Cantidad de personas de pie</b>', 'dataIndex' => 'cantpersonapie'),  
            array('header' => '<b>Cantidad de personas sentados</b>', 'dataIndex' => 'cantpersonasentado'),             
            array('header' => '<b>Norma de combustible</b>', 'dataIndex' => 'normacombustible'),
            array('header' => '<b>GPS</b>', 'dataIndex' => 'idgps'),
            array('header' => '<b>Categoría transportación</b>', 'dataIndex' => 'idcategoriatransp'),       
            array('header' => '<b>En depósito</b>', 'dataIndex' => 'endeposito'),
            array('header' => '<b>KM asignado</b>', 'dataIndex' => 'kmasignado')
        );

        foreach ($columns as $col) {
            $excel->writeCol($col['header']);
           }
        $excel->writeRow();
        for ($i=0; $i < $cantidadTotal; $i = $i + $aumento) { 
            $datos = $this->respuesta([
                'start' => $i,
                'limit' => $aumento,
                'anode' => '',
                'idindicador' => '',
                'tipo' => 0,
                'salidas' => -1,
                'arrayIdarearesp' => '',
                'idnaturaleza' => $params['naturaleza'],
                'codigo' => $params['codigo'],
                'numeropieza' => $params['numeropieza'],
                'idmarca' => $params['marca'],
                'idmodelo' => $params['modelo'],
                'idgruposubgrupo' => $params['descripciongrupo'],
                'nroserie' => $params['nroserie'],
                'nroinventario' => $params['nroinventario'],
                'valoradquisicion' => $params['valoradquisicion'],
                'valorcontable' => $params['valorcontable'],
                'depreciacionacumulada' => $params['depreciacionacumulada'],
                'cantidadrecursoconsumido' => $params['cantidadrecursoconsumido'],
                'estadoperacion' => $params['estadoperacion'],                
                'idarearesp' => $params['denomarearesp'],
                'denominacion' => $params['denominacion'],
                'idcentrocosto' => $params['denomcentrocosto'],          
                'denomentidad' => $params['denomentidad'],
                'annofabricacion' => $params['annofabricacion'],
                'recursoconsumidomax' => $params['recursoconsumidomax'],
                'idcolorprim' => $params['idcolorprim'],
                'idcolorsec' => $params['idcolorsec'],
                'idactividad' => $params['idactividad'],
                'responsable' => $params['responsable'],
                'fechaadq' => $params['fechaadq'],
                'fechaexpini' => $params['fechaexpini'],
                'vidautil' => $params['vidautil'],
                'tasafiscal' => $params['tasafiscal'],
                'porcientorecuperacion' => $params['porcientorecuperacion'],
                'idestatustecnico' => $params['idestatustecnico'],                
                'fechainicialgarantia' => $params['fechainicialgarantia'],
                'fechafingarantia' => $params['fechafingarantia'],
                'nromatricula' => $params['nromatricula'],
                'nrocirculacion' => $params['nrocirculacion'],                 
                'nromotor1' => $params['nromotor1'],
                'nromotor2' => $params['nromotor2'],
                'indicativo' => $params['indicativo'],
                'indiceconsumo' => $params['indiceconsumo'],
                'idtipocombustible' => $params['idtipocombustible'],
                'max_ficav' => $params['max_ficav'],
                'max_lot' => $params['max_lot'],
                'vin' => $params['vin'],            
                'nollaveencendido' => $params['nollaveencendido'],
                'vencimientocirculacion' => $params['vencimientocirculacion'],
                'kmasignado' => $params['kmasignado']

            ])['datos'];
            $this->crearExcel($columns, $datos, $excel);
        }

        $excel->close();
        return '/logistica/activos_fijos/recuperaciones/' . $fichero;
    }

    public function crearExcel($columns, $datos, &$excel)
    {
           foreach ($datos as $dato) {
               foreach ($columns as $col) {
                   $index = $col['dataIndex'];
                   if($dato[$index]){
                       $excel->writeCol($dato[$index]);   
                   } else {
                       $excel->writeCol('');   
                   }
               }
            $excel->writeRow();
           }
    }

    public static function getDatosImprimir($params)
    {
        $conn = Zend_Registry::get('conexion');
        $depositos = str_replace(array("{", "}"), "", $params['arraydeposito']);
        $naturalezas = str_replace(array("{", "}"), "", $params['arrayidnaturaleza']);
        $disponible = "( SELECT count(rn2.idregnumerico)
    FROM mod_logactivofijotangible.dat_registronumerico rn2
    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto

    WHERE p.idindicador = i.idindicador
    AND p.cronologia > 0
        AND p.idestructura in ($depositos)
    AND rna.idestadoperacion = 1
  )";
        $cantidad = "(
        SELECT count(rn2.idregnumerico)
    FROM mod_logactivofijotangible.dat_registronumerico rn2
    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto

    WHERE p.idindicador = i.idindicador
    AND p.cronologia > 0
        AND p.idestructura in ($depositos)
    AND rna.idestadoperacion not in (0,7)
)";

        $select = "SELECT
   $disponible AS disponible,
 $cantidad AS cantidad,
i.denominacion as denominacion,
i.codigo as codigo,
nat.denominacion as naturaleza,
marc.denominacion as marca,
marc.estado as marcaestado,
model.denominacion as modelo,
(Case When ih.idmarca is not null Then (marc.denominacion  ||
(Case When ih.idmodelo is not null Then ' - '|| model.denominacion Else
     '' End)) Else '' End) as marcamodelo,
model.estado as modeloestado,
(
select dep.denominacion
from mod_estructuracomp.nom_filaestruc fp

INNER JOIN mod_logistica.dat_producto pd on pd.idindicador = i.idindicador
--INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = pd.idproducto
--inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = rn.idregnumerico
--inner join mod_estructuracomp.nom_filaestruc nf on nf.idfila = drna.idarearesp
left join mod_estructuracomp.dat_estructura dep on dep.idestructura = pd.idestructuracomun
--where nf.lft >= fp.lft and nf.rgt <= fp.rgt
AND pd.cronologia > 0
 AND pd.idestructura = any(cast($1 as numeric[]))

 limit 1) as entidad




FROM mod_datosmaestros.nom_indicador i
INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
--INNER JOIN mod_logistica.dat_producto pd on pd.idindicador = i.idindicador
--left join mod_estructuracomp.dat_estructura dep on dep.idestructura = pd.idestructuracomun
INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca
LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo


";

        $where = "WHERE (
        SELECT p.idestructura FROM mod_logistica.dat_producto p
            INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = p.idproducto
            WHERE p.idindicador = i.idindicador
        AND p.cronologia > 0
        AND p.idestructura in ($depositos)
        LIMIT 1
  ) IS NOT NULL


AND i.idnaturaleza NOT IN ($naturalezas)
AND ih.explotacion = 1";

        $group
            = "GROUP BY
        entidad,
        i.idindicador,
        i.denominacion,
        i.codigo,
        nat.denominacion,
        marc.denominacion,
        marc.estado,
        model.denominacion,
        model.estado,
        ih.idmarca,
        ih.idmodelo

ORDER BY i.codigo, marc.denominacion ";

        self::procesarFiltros($params, $where, $disponible, $cantidad);

         $respDatos = $conn->execute($select . $where . $group)->fetchAll(
             PDO::FETCH_ASSOC
         );
      /*  print_r($select . "\n" . $where . "\n" . $group);
        die;*/
     //   print_r($respDatos);die;
        return $respDatos;
    }

    public static function procesarFiltros($params, &$where, $disponible, $cantidad)
    {
        $params['filters'] = json_decode($params['filters']);
        foreach ($params['filters'] as $filtro) {
            $where .= ($filtro->field == 'codigo') ? " AND i.codigo iLike '%{$filtro->data->value}%'" : "";
            $where .= ($filtro->field == 'denominacion') ? " AND i.denominacion iLike '%{$filtro->data->value}%'" : "";
            $where .= ($filtro->field == 'naturaleza') ? " AND nat.denominacion iLike '%{$filtro->data->value}%'" : "";
            $where .= ($filtro->field == 'marcamodelo')
                ? " AND marc.denominacion iLike '%{$filtro->data->value}%' OR
                model.denominacion iLike '%{$filtro->data->value}%'" : "";
            if (($filtro->field == 'cantidad') || ($filtro->field == 'disponible')) {
                $signo = ($filtro->data->comparison == 'gt') ? " > "
                    : ($filtro->data->comparison == 'lt') ? " < " : " = ";
            }
            $where .= " AND " . (($filtro->field == 'cantidad') ? $cantidad : $disponible) . $signo
                . $filtro->data->value;
        }

    }
    
    public function getResponsables() {
        $conn = Zend_Registry::get('conexion');
        $select = " SELECT DISTINCT(
                (Case When pers.nombre is not null
                Then (pers.nombre || (Case When pers.papel is not null Then ' ' Else '' End))
                Else ''
                End) ||
                (Case When pers.papel is not null
                Then (pers.papel || (Case When pers.sapel is not null Then ' ' Else '' End))
                Else ''
                End) ||
                (Case When pers.sapel is not null Then pers.sapel Else '' End)
                ) as responsable,pers.idpersona as idpersona,resp.idresponsable "
        ;
        $from = " FROM mod_logactivofijotangible.dat_regnumericoactivo rna                
                      LEFT JOIN  mod_logactivofijotangible.dat_responsable resp ON rna.idresponsable = resp.idresponsable
                      LEFT JOIN mod_persona.dat_persona pers ON pers.idpersona = resp.idpersona 
                    ";
        $sqlDatos = $select . $from;
        
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function cargarGrupoExplotacion($identidad)
    {
        $conn = Zend_Registry::get('conexion');
        $select = " select na.denominacion, na.idactividad
            FROM mod_logactivofijotangible.nom_actividad na
            INNER JOIN mod_logactivofijotangible.dat_actividadentidad da on da.idactividad = na.idactividad
            where da.idestructuracomun = $identidad
        ";
        $respDatos = $conn->execute($select)->fetchAll(
            PDO::FETCH_ASSOC
        );

       return $respDatos;

    }
   
   
 
}
