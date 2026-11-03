<?php

if (!class_exists('ComunAFTModel')) {
    $dirAFT = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}

class SubmayorPatModel extends SubmayorModel//ZendExt_Model
{
    //private $sRegNumerico;
    private $mComunAFT, $mMaestroProd, $servicioEyC;

    public function __construct()
    {
        parent::ZendExt_Model();       
        //$this->sRegNumerico = new RegNumericoService();
        $this->mComunAFT = ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $this->mMaestroProd = new MaestroProductoModel();
        $this->servicioEyC = ServiciosEstructuraComposicionHelper::__init();
    }

    /*
     *  Devuelve los productos con las cantidades existencia y disponoble
     */

   /* public function getConteoEntidad($start = 0, $limit, $parametros, $arrIdesAreas = array())
    {
        if (!is_array($arrIdesAreas)) {
            $arrIdesAreas = $this->mComunAFT->getIdEstructurasHijas($arrIdesAreas, false, true);
        }
       
        if (count($arrIdesAreas) > 0) {
            // Este metodo en Dql no se puede hacer porque el distinct no pincha com debe, por lo que se hizo en sql.
            $estructurastring = " (".implode(',', $arrIdesAreas).")";

           /* $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
            $idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
            $idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;*/
           /* $select = "
                SELECT DISTINCT
                    p.idindicador AS idindicador,
                    --(SELECT SUM(p2.disponible) FROM mod_logistica.dat_producto p2 WHERE (p2.idproducto = p.idproducto)) AS disponible,
                    --(SELECT SUM(p2.cantidad) FROM mod_logistica.dat_producto p2 WHERE (p2.idproducto = p.idproducto)) AS cantidad,
                         i.idpadre, 
                         --(CASE WHEN (i.ordender - i.ordenizq) = 1 THEN 1 ELSE 0 END) AS eshoja,
                         --i.ordenizq AS ordenizq,
                         --i.ordender AS ordender,
                         i.denominacion AS denominacion,
                         --i.numeropieza AS numeropieza,
                         --i.descripcion AS descripcion,
                         i.idnaturaleza AS idnaturaleza,
                         i.codigo AS codigo, 
                         --i.nivel AS nivel,
                         --(i.codigo || ' - ' || i.denominacion) AS text,
                         --i.idformato AS idformato,
                         --i.idpais AS idpais,
                         --i.idumedida AS idumedida,
                         --i.estado AS estado,
                         --i.activo AS activo,
                         --(CASE WHEN i.tipo = 2 THEN 'cog' ELSE 'box' END) AS codtipo,
                         ---i.tipo AS tipo,
                         --i.fechainicio AS fechainicio,
                         --i.fechafin AS fechafin,
                         --i.numeropieza AS codigoproveedor,
                         i.idtabla AS idtabla, 
                         i.idtablageneral AS idtablageneral, 
                         i.arridtablas AS arridtablas, 
                         i.arridtablasgenerales AS arridtablasgenerales, 
                         --COALESCE(ih.precio, 0) AS precio,
                         --ih.explotacion AS explotacion,
                         --ih.almacenado AS almacenado,
                         --ih.idmarca AS idmarca,
                         --ih.idgruposubgrupo AS idgruposubgrupo,
                         --ih.idmodelo AS idmodelo,
                         --ih.peso AS peso,
                         --ih.largo AS largo,
                         --ih.ancho AS ancho,
                         --ih.alto AS alto,
                         --ih.tipocontrol AS tipocontrol,
                         --ih.codigoauxiliar AS codigoauxiliar,
                         nat.denominacion AS naturaleza,
                         --(SELECT m8.idimagen AS m8__idimagen FROM mod_datosmaestros.dat_imagenindicador m8
                         --WHERE (m8.principal = 0 AND m8.idindicador = i.idindicador) LIMIT 1) AS imagen,
                         marc.denominacion AS marca, 
                         marc.estado AS marcaestado, 
                         model.denominacion AS modelo, 
                         model.estado AS modeloestado";

            $from = " FROM mod_logistica.dat_producto p 
                INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador 
                INNER JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = i.idnaturaleza
                LEFT JOIN mod_datosmaestros.nom_marca marc ON ih.idmarca = marc.idmarca 
                LEFT JOIN mod_datosmaestros.nom_modelo model ON ih.idmodelo = model.idmodelo
                INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON p.idproducto = rn.idproducto
                ";
            $where = " WHERE (p.idestructura IN $estructurastring) ";

            if ($parametros['denominacion']) {
                $where .= "AND i.denominacion ILIKE '%{$parametros['denominacion']}%' ";
            }
            if ($parametros['idmarca']) {
                $where .= "AND ih.idmarca = {$parametros['idmarca']} ";
            }
            if ($parametros['idmodelo']) {
                $where .= "AND ih.idmodelo = {$parametros['idmodelo']} ";
            }
            if ($parametros['idgruposubgrupo']) {
                $where .= "AND ih.idgruposubgrupo = {$parametros['idgruposubgrupo']} ";
            }
            $where.= " AND p.cronologia > 0";
            $where = self::getConteoEntidadFilter($parametros, $where);
            $conn = Zend_Registry::get('conexion');
            $sqlDatos = $select.$from.$where;

            $sqlCount = 'SELECT count (distinct i.idindicador) '.$from.$where;
            $sqlDatos.= ' order by i.codigo, marc.denominacion';
            if ($limit) {
                $sqlDatos .= " offset $start limit $limit";
            }
            $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
            foreach ($datos as $pos => $indicador) {
                $sqlCantidad = "SELECT SUM(p2.cantidad) FROM mod_logistica.dat_producto p2 "
                    . "WHERE (p2.idindicador = {$indicador['idindicador']} and p2.idestructura IN $estructurastring)";
                $sqlDisponible = "SELECT SUM(p2.disponible) FROM mod_logistica.dat_producto p2 "
                    . "WHERE (p2.idindicador = {$indicador['idindicador']} and p2.idestructura IN $estructurastring)";
                $cantidad = $conn->execute($sqlCantidad)->fetchAll(PDO::FETCH_ASSOC);
                $disponible = $conn->execute($sqlDisponible)->fetchAll(PDO::FETCH_ASSOC);
                $datos[$pos]['cantidad'] = $cantidad[0]['sum'];
                $datos[$pos]['disponible'] = $disponible[0]['sum'];
            }
            $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
            $total = $total[0]['count'];
            return array('cantidad' => $total, 'datos' => $datos);
        } else {
            return array('cantidad' => 0, 'datos' => array());
        }
    }*/

   /* public function getConteoEntidadFilter($parametros, $where)
    {
        if ($parametros['idespecialidadBuscar']) {
            $idespecialidad = $parametros['idespecialidadBuscar'];
            $where .= "AND i.idespecialidad = $idespecialidad";
        }
        if ($parametros['minCant']) {
            $mincantidad = $parametros['minCant'];
            $where .= "AND p.cantidad >= $mincantidad";
        }
        if ($parametros['maxCant']) {
            $maxcantidad = $parametros['maxCant'];
            $where .= "AND p.cantidad < $maxcantidad";
        }
        if ($parametros['minDisp']) {
            $mindisponibilidad = $parametros['minDisp'];
            $where .= "AND p.disponible >= $mindisponibilidad ";
        }
        if ($parametros['maxDisp']) {
            $maxdisponibilidad = $parametros['maxDisp'];
            $where .= "AND p.disponible < $maxdisponibilidad ";
        }
        if ($parametros['idnaturaleza']) {
            if(is_array($parametros['idnaturaleza'])){
                $idnaturaleza = implode(",", $parametros['idnaturaleza']);
                $where .= "AND i.idnaturaleza in ($idnaturaleza) ";
            }
            else {
                $idnaturaleza = $parametros['idnaturaleza'];
                $where .= "AND i.idnaturaleza = $idnaturaleza ";
            }
        }
        if ($parametros['codigo']) {
            $where .= "AND i.codigo ILIKE '%{$parametros['codigo']}%' ";
        }
        if ($parametros['idpais']) {
            $where .= "AND i.idpais = {$parametros['idpais']}";
        }
        return $where;
    }*/

    public function GetConteoEntidadSalidas($start, $limit, $parametros, $arrIdesAreas)
    {

        if (!is_array($arrIdesAreas)) {
            $arrIdesAreas = $this->mComunAFT->getIdEstructurasHijas($arrIdesAreas, false, true);
        }

        if (count($arrIdesAreas) > 0) {
            $arrayEstructuras = " (".implode(',', $arrIdesAreas).")";


            $conn = Zend_Registry::get('conexion');


            $select = " SELECT distinct
                    i.codigo, i.descripcion, i.arridtablas, i.arridtablasgenerales, i.idespecialidad, i.denominacion,
                    i.idindicador, 1 as salidas, pais.nombrepais as siglasnacionalidad, modelo.denominacion as modelo,
                    marca.denominacion as marca,
                    (select count (distinct  movreg.idregnumerico) from  mod_logistica.dat_producto pp

                     inner join mod_datosmaestros.nom_indicador i2 on pp.idindicador = i2.idindicador
                     inner join mod_logistica.dat_movimiento mov on pp.idproducto = mov.idproducto
                     inner join mod_logactivofijotangible.dat_movregnumerico movreg on movreg.idmovimiento = mov.idmovimiento
                     inner join mod_logactivofijotangible.dat_registronumerico reg on movreg.idregnumerico = reg.idregnumerico
                     inner join mod_logactivofijotangible.dat_regnumericoactivo rega2
                     on rega2.idregnumerico = reg.idregnumerico
                     inner join mod_logactivofijotangible.dat_movregnumericoactivo movrega
                     on movreg.idmovregnumerico = movrega.idmovregnumerico
                      WHERE i2.idindicador = i.idindicador and movreg.idregnumerico NOT IN ( Select r2.idregnumerico
                    FROM mod_logactivofijotangible.dat_registronumerico r2
                    inner join mod_logactivofijotangible.dat_regnumericoactivo rna2
                    on rna2.idregnumerico = r2.idregnumerico

                    WHERE rna2.idarearesp IN $arrayEstructuras)
                    AND movrega.idarearesp IN $arrayEstructuras) as cantidad,
                    0 as disponibilidad,
                    n.denominacion as naturaleza
                        ";

            $from = " FROM mod_logistica.dat_producto p
                    INNER JOIN mod_logistica.dat_movimiento m ON p.idproducto = m.idproducto
                    inner join mod_logistica.dat_documento doc on m.iddocumento = doc.iddocumento
                    inner join mod_logactivofijotangible.dat_registronumerico reg on p.idproducto = reg.idproducto
                    inner join mod_logactivofijotangible.dat_movregnumerico movreg2 on reg.idregnumerico = movreg2.idregnumerico
                    inner join mod_logactivofijotangible.dat_movregnumericoactivo movrega2
                    on movreg2.idmovregnumerico = movrega2.idmovregnumerico
                    INNER JOIN mod_estructuracomp.nom_filaestruc f ON p.idestructura = f.idfila
                    LEFT  JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
                    INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                    LEFT  JOIN mod_datosmaestros.nom_pais pais ON i.idpais = pais.idpais
                    LEFT  JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                    LEFT  JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
                    INNER JOIN mod_datosmaestros.nom_naturaleza n ON i.idnaturaleza = n.idnaturaleza
            ";

            $where = " WHERE movrega2.idarearesp IN $arrayEstructuras
                      AND movreg2.idregnumerico NOT IN ( Select reg2.idregnumerico
                      FROM mod_logactivofijotangible.dat_registronumerico reg2
                      inner join mod_logactivofijotangible.dat_regnumericoactivo rega2
                      on rega2.idregnumerico = reg2.idregnumerico
                      WHERE rega2.idarearesp IN $arrayEstructuras) AND doc.estado = 3";

            $where = self::GetFiltroConteoEntidadSalidas($where, $parametros);

            if ($parametros['cantidad']) {
                $cantidad = $parametros['cantidad'];
                $where .= "AND p.cantidad = $cantidad";
            }
            if ($parametros['idnaturaleza']) {
                $idnaturaleza = $parametros['idnaturaleza'];
                $where .= "AND i.idnaturaleza = $idnaturaleza ";
            }
            if ($parametros['disponibilidad']) {
                $disponibilidad = $parametros['disponibilidad'];
                $where .= "AND p.disponibilidad = $disponibilidad ";
            }
            $where.= " AND p.cronologia > 0";
            $sqlDatos = $select.$from.$where;
            $sqlCount = 'SELECT count (distinct i.codigo) '.$from.$where;

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
        if ($parametros['siglasnacionalidad']) {
            $idpais = $parametros['siglasnacionalidad'];
            $where .= "AND i.idpais = $idpais ";
        }
        if ($parametros['denominacion']) {
            $where .= "AND i.denominacion iLike '%{$parametros['denominacion']}%'";
        }
        return $where;
    }

    public function GetConteoRegNumericosEntidad($idestructuraop, $parametros, $imprimir = false)
    {       
        $sRegNumActivo = new RegNumActivoService();
        $estructura = 'Estructura';
        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructuraop[] = $global->$estructura->idestructura;
        }

        unset($parametros['arrayIdarearesp']);
        if ($parametros['elementosXtabla']) {
            $regOperativo = new RegNumericoAtribDinamicoModel();
            $arrCritDinamicos = $regOperativo->getFiltrosBusqAvanzada(json_decode($parametros['elementosXtabla']));

            $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros, 'drna', $arrCritDinamicos);
        } else {
            $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros);
        }

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
        $query->addSelect('net.denominacion as estado');
        $query->addSelect('n.denominacion as naturaleza');
        $query->addSelect('p.idproducto');
        $query->addSelect('rn.idregnumerico');


        if(!is_array($idestructuraop)){
            $arrayIdEst = $this->mComunAFT->getIdEstructurasHijas($idestructuraop, false);
        } else if (count($idestructuraop) == 1) {
            $arrayIdEst = $this->mComunAFT->getIdEstructurasHijas($idestructuraop[0], false);
        } else {
            $arrayIdEst = $idestructuraop;
        }

        $query->addWhere('d.estado = 3');
        $query->whereIn('p.idestructura', $arrayIdEst);

        #region Para poder pedir el area de responsabilidad del medio
        $relacion[] = array('cardinalidad' => 'one', 'relation' => 'NomFilaestruc',
            'properties' => array('local' => 'idarearesp', 'foreign' => 'idfila'));
        $rnaft = new DatRegnumericoActivo();
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($rnaft, $relacion);
        $query->innerJoin('drna.NomFilaestruc nfe');
        $query->innerJoin('nfe.DatEstructuraop deop');
        $query->addSelect('deop.denominacion as denomarearesp');
        #endregion
          
        if ($parametros['tipomedio']) {
            $nomIndicador = new NomIndicador();
            $array[] = array('cardinalidad' => 'one',
            'relation' => 'ConfTipomedionaturaleza',
            'properties' => array('local' => 'idnaturaleza',
                'foreign' => 'idnaturaleza'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($nomIndicador, $array);
            
            $query->innerJoin('i.ConfTipomedionaturaleza conftipom');
            $query->addWhere('conftipom.tipo =?', $parametros['tipomedio']);
        }
		// Para los campos nulos
        if ($parametros['Datos generales']) {
            $parametros['Datos generales'] = split(',', $parametros['Datos generales']);
            foreach ($parametros['Datos generales'] as $camposnull) {
                
                if ($camposnull == 'nroserie') {
                    $query->addWhere("rn.{$camposnull} is NULL");
                } else {
                    $query->addWhere("drna.{$camposnull} is NULL");
                }
            }
        }
        $query->orderBy('nmarc.denominacion ASC, nmod.denominacion ASC');
        //$query = self::GetFiltrosRegnumericosEntidad($parametros, $query);		
        $datos = $query->fetchArray();

        /* Esto es para devolver el estado de las operaciones */
        $cantBajas = 0;
        $arrEstadosOperaciones = $this->mComunAFT->GetArrEstadosoperacion();
        foreach ($datos as $key => $registro) {
            $datos[$key]['estadooperacion'] = $arrEstadosOperaciones[$datos[$key]['idestadoperacion']];
            ($datos[$key]['idestadoperacion'] != 7) ?: $cantBajas++;
        }

        if ($imprimir == true) {
            $arrIdregistros = array();
            foreach ($datos as $key => $registro) {
                array_push($arrIdregistros, $registro['idregnumerico']);
            }
            $resp = implode(',', $arrIdregistros);
            return array('datos' => $resp, 'total' => 0);
        } else {
            return array('datos' => (count($datos) > 0) ? $datos : array(), 'cantidad' => $query->count(),
                         'bajas' => $cantBajas);
        }
    }

    public function GetConteoRegNumericosEntidadSalidas($parametrosOll, $idestructuraop, $imprimir = false)
    {
        $sRegNumActivo = new RegNumActivoService();
        $estructura = 'Estructura';
        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructuraop[] = $global->$estructura->idestructura;
        }

        $result = $sRegNumActivo->getObjRegNumActivoModel()->cargarMovimientosActivos($parametrosOll);
        $query = $result['query'];
        $query->innerJoin('mns.DatMovimientos mov');
        $query->innerJoin('mov.DatDocumento d');
        $query->innerJoin('i.NomNaturaleza n');
        $query->addSelect('nmarc.denominacion as marca');
        $query->addSelect('nmod.denominacion as modelo');
        $query->addSelect('net.denominacion as estado');
        $query->addSelect('n.denominacion as naturaleza');

        if (count($idestructuraop) == 1) {
            $arrayIdEst = $this->mComunAFT->getIdEstructurasHijas($idestructuraop[0], false);

        } else {
            $arrayIdEst = $idestructuraop;
        }
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
        //$query->whereIn('p.idestructura', $arrayIdEst);
        $query->addWhere('d.estado = 3');
        $query->WhereIn('mrna.idarearesp', $arrayIdEst);
        if ($parametros['camposnull'] && $parametros['nombreplugin'] == 'Datos generales') {
            if ($parametrosOll['camposnull'] == "nroserie") {
                $query->addWhere("rn.{$parametrosOll['camposnull']} is NULL");
            } else {
                $query->addWhere("rna.{$parametrosOll['camposnull']} is NULL");
            }
        }
       // self::GetFiltrosRegnumericosEntidad($parametrosOll, $query);
        $datos = $query->fetchArray();

        if ($imprimir == true) {
            self::getConteoEntidadFor($datos);
        } else {
            return array('datos' => (count($datos) > 0) ? $datos : array(), 'total' => $query->count());
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
//                     inner join mod_logactivofijotangible.dat_movregnumerico movreg on movreg.idmovimiento = mov.idmovimiento
//                     inner join mod_logactivofijotangible.dat_registronumerico reg on movreg.idregnumerico = reg.idregnumerico
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
//                inner join mod_logactivofijotangible.dat_movregnumerico movreg2 on reg.idregnumerico = movreg2.idregnumerico
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

        for ($i = 0; $i < count($movimientos['datos']); $i++) {

            $estruct = ServiciosEstructuraComposicionHelper::__init()->getEstructura(
                $movimientos['datos'][$i]['idarearesp']
            );
            $movimientos['datos'][$i]['denomarearesp'] = $estruct[0]->denominacion;
            $padre = ServiciosEstructuraComposicionHelper::__init()->getEstructura($estruct[0]->idpadre);

            $movimientos['datos'][$i]['denomentidad'] = $padre[0]->denominacion;
            $oper = $sConfGen->obtenerOperaciones(
                null, null, null, $movimientos['datos'][$i]['idoperacion'], null, null, null
            );
            $movimientos['datos'][$i]['denominacion'] = $oper[0]['denominacion'];
        }
        return $movimientos;
    }

    public function getDatosMovimiento($parametros)
    {
        $sRegNumActivo = new RegNumActivoService();
        $result = $sRegNumActivo->cargarMovimientosActivos(false);


        $query = $result['query'];
        $query->innerJoin('mns.DatMovimientos mov');
        $query->innerJoin('mov.DatDocumento doc');

        $query->addSelect('nat.idnaturaleza as idnaturaleza, nat.denominacion as naturaleza');
        $query->addSelect('i.idindicador');
        $query->addSelect('p.idproducto');
        $query->addSelect('nmarc.denominacion as marca');
        $query->addSelect('nmod.denominacion as modelo');
        $query->Where(
            'doc.cronologia = ? AND doc.cronologia <> ? AND rn.idregnumerico = ?',
            array($parametros['cronologia'], 0, $parametros['idregnumerico'])
        );
        //$query->WhereIn('mns.idmovregnumerico', $parametros['idmovregnumerico']);
        ServiciosConfiguracionGeneralHelper::__init()->innerJoinNomNaturaleza($query, 'i', 'nat', true);
        $datos = $query->fetchArray();

        return array('datos' => (count($datos) > 0) ? $datos : array(), 'total' => 1);
//        $idmovregnumerico = $parametros['idmovregnumerico'];
//        $conn = Zend_Registry::get('conexion');
//
//        $select = " SELECT DISTINCT
//                movrna.nroinventario,
//                eu.descripcion as ubicacion,
//                movrna.idarearesp,
//                movrna.valoradquisicion,
//                movrna.valorcontable,
//                movrna.vidautil,
//                movrna.tasafiscal,
//                movrna.depreciacionacumulada,
//                movrna.fechaadq,
//                movrna.fechaexpini,
//                movrna.fechaexpfin,
//                movrnatran.nromatricula,
//                movrnatran.indicativo,
//                movrnatran.nrocirculacion,
//                movrnatran.nromotor1,
//                movrnatran.nromotor2,
//                movrnatran.kilometraje,
//                movrnatran.indiceconsumo,
//                movrnatran.ficav,
//                movrnatran.lot,
//                movrnatran.vin,
//                movrnatran.odometro,
//                movrnatran.capacidad,
//                tipcom.denominacion as tipocombustible,
//
//                et.denominacion as estado,
//                cat.denominacion as categoria,
//                rn.nroserie,
//                rn.idregnumerico,
//
//                i.codigo,
//                i.descripcion,
//                i.arridtablas,
//                i.arridtablasgenerales,
//                i.idespecialidad,
//                i.denominacion,
//                i.idindicador,
//                pais.siglas as siglasnacionalidad,
//                modelo.denominacion as modelo,
//                marca.denominacion as marca,
//                n.denominacion as naturaleza
//        ";
//
//        $from = "
//                FROM mod_logactivofijotangible.dat_movregnumerico movrn
//                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo movrna
//                ON movrn.idmovregnumerico = movrna.idmovregnumerico
//                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivotransp movrnatran
//                ON movrnatran.idmovregnumerico = movrna.idmovregnumerico
//                INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON movrn.idregnumerico = rn.idregnumerico
//                INNER JOIN mod_logistica.dat_producto p ON  p.idproducto= rn.idproducto
//                LEFT  JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
//
//                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
//                LEFT  JOIN mod_datosmaestros.nom_pais pais ON i.idpais = pais.idpais
//                LEFT  JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
//                LEFT  JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
//                INNER JOIN mod_datosmaestros.nom_naturaleza n ON i.idnaturaleza = n.idnaturaleza
//
//                LEFT JOIN mod_logactivofijotangible.nom_tipocombustible tipcom
//                ON movrnatran.idtipocombustible = tipcom.idtipocombustible
//                LEFT  JOIN mod_logactivofijotangible.nom_estatustecnico et
//                ON movrna.idestatustecnico = et.idestatustecnico
//                LEFT  JOIN mod_logistica.nom_categoria cat ON movrna.idcategoria = cat.idcategoria
//                LEFT  JOIN mod_logistica.dat_estructuraubicacion eu ON movrna.idubicacion = eu.idestructuraubicacion
//        ";
//
//
//        if (ComunAFTModel::integradoPersona()) {
//            $select
//                .= ",(
//                (Case When pers.nombre is not null
//                Then (pers.nombre || (Case When pers.papel is not null Then ' ' Else '' End))
//                Else ''
//                End) ||
//                (Case When pers.papel is not null
//                Then (pers.papel || (Case When pers.sapel is not null Then ' ' Else '' End))
//                Else ''
//                End) ||
//                (Case When pers.sapel is not null Then pers.sapel Else '' End)
//                ) as responsable";
//            $from
//                .= " LEFT JOIN mod_logactivofijotangible.dat_responsable resp ON movrna.idresponsable = resp.idresponsable
//                       LEFT JOIN mod_persona.dat_persona pers ON pers.idpersona = resp.idpersona
//                    ";
//        } else {
//            die('No esta terminado');
//        }
//
//        $where = " WHERE movrn.idmovregnumerico = $idmovregnumerico ";
//
//        $sqlDatos = $select.$from.$where;
//        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
//
//        return array('datos' => (count($datos) > 0) ? $datos : array(),
//            'total' => 1);
    }

    
    public function cargarComboEjercicios($identidad)
    {
        $ejercicio = ServiciosConfiguracionGeneralHelper::__init()->ObtenerEjercicios($identidad);
        return array('datos' => $ejercicio);
    }

    /*

      public function GetConteoEntidadOLD($idestructuraop, $arrayIdEspecialidades, $parametros, $start, $limit)
      {

      if (!$idestructuraop) {
      $global = ZendExt_GlobalConcept::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
      $estructura = 'Estructura';
      $idestructuraop[] = $global->$estructura->idestructura;
      }

      if (count($idestructuraop) == 1) {
      $arrayEstructuras
      = "(
      SELECT idfila FROM mod_estructuracomp.nom_filaestruc
      WHERE
      lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN ("
      . implode(',', $idestructuraop) . ")) AND
      rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN ("
      . implode(',', $idestructuraop) . ")))";
      } else {
      $arrayEstructuras = " (" . implode(',', $idestructuraop) . ")";
      }
      $conn = Zend_Registry::get('conexion');

      $select = " SELECT distinct
      i.codigo,
      i.descripcion,
      i.arridtablas,
      i.arridtablasgenerales,
      i.idespecialidad,
      i.denominacion,
      i.idindicador,

      pais.nombrepais as siglasnacionalidad,
      modelo.denominacion as modelo,
      marca.denominacion as marca,
      (select sum (pp.cantidad) from mod_logistica.dat_producto pp
      where pp.idindicador = p.idindicador and pp.idestructura in $arrayEstructuras
      )  as cantidad,

      (select sum (pp.disponible) from mod_logistica.dat_producto pp
      where pp.idindicador = p.idindicador and pp.idestructura in $arrayEstructuras
      )  as disponibilidad,
      n.denominacion as naturaleza
      ";
      $from
      = " FROM mod_logistica.dat_producto p
      INNER JOIN mod_logistica.dat_movimiento m ON p.idproducto = m.idproducto
      inner join mod_logistica.dat_documento doc on m.iddocumento = doc.iddocumento
      INNER JOIN mod_estructuracomp.nom_filaestruc f ON p.idestructura = f.idfila
      INNER JOIN mod_logactivofijotangible.dat_registronumerico reg ON reg.idproducto = p.idproducto
      INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rega
     * ON reg.idregnumerico = rega.idregnumerico
      LEFT  JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador
      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
      LEFT  JOIN mod_datosmaestros.nom_pais pais ON i.idpais = pais.idpais
      LEFT  JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
      LEFT  JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
      INNER JOIN mod_datosmaestros.nom_naturaleza n ON i.idnaturaleza = n.idnaturaleza
      ";
      $where = " WHERE doc.estado = 3 AND f.idfila IN $arrayEstructuras
      ";
      $where = self::GetFiltroConteoEntidadSalidas($where, $parametros);

      if ($parametros['idespecialidad']) {
      $where .= "AND i.idespecialidad = {$parametros['idespecialidad']}";
      }
      if ($parametros['cantidad']) {
      $cantidad = $parametros['cantidad'];
      $where .= "AND (select sum (p.cantidad) from mod_logactivofijotangible.dat_activofijo aa inner join
      mod_logistica.dat_producto pp ON aa.idactivofijo = pp.idproducto
      where pp.idindicador = p.idindicador and pp.idestructura in $arrayEstructuras
      )  = $cantidad";
      }
      if ($parametros['idnaturaleza']) {
      $idnaturaleza = $parametros['idnaturaleza'];
      $where .= "AND i.idnaturaleza = $idnaturaleza ";
      }
      if ($parametros['disponibilidad']) {
      $disponibilidad = $parametros['disponibilidad'];
      $where .= "AND (select sum (p.disponible) from mod_logactivofijotangible.dat_activofijo aa inner join
      mod_logistica.dat_producto pp ON aa.idactivofijo = pp.idproducto
      where pp.idindicador = p.idindicador and pp.idestructura in $arrayEstructuras
      )  = $disponibilidad ";
      }

      $sqlDatos = $select . $from . $where;
      $sqlCount = 'SELECT count (p.idproducto) ' . $from . $where;

      if ($limit) {
      $sqlDatos .= " offset($start) limit($limit)";
      }

      $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
      $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);

      return array('datos' => (count($datos) > 0) ? $datos : array(),
      'total' => (count($total)) ? $total[0]['count'] : 0);
      }










      //    public function GetDatosReporte($idestructuraop, $idespecialidad)
      //    {
      //        $conn = Zend_Registry::get('conexion');
      //        $sql = "select
      //                i.denominacion || ' ' || marca.denominacion || ' ' || mod.denominacion as indicador,
      //                rn.nroserie, mr.nroinventario,
      //                et.denominacion as estado,
      //                d.fechacontable as fecha_entrega,
      //                dper.nombre || ' ' || dper.papel || ' ' || dper.sapel as responsable_entrega,
      //                dd.fechacontable as fecha_devolucion,
      //                dd.iddocumento, ddper.nombre || ' ' || ddper.papel || ' ' ||
     * ddper.sapel as responsable_devolucion,
      //                net.denominacion as estado_devolucion
      //
      //                from mod_datosmaestros.nom_indicador i
      //                inner join mod_datosmaestros.nom_indicadorhoja h on h.idindicador = i.idindicador
      //                left join mod_datosmaestros.nom_marca marca on marca.idmarca = h.idmarca
      //                left join mod_datosmaestros.nom_modelo mod on mod.idmodelo = h.idmodelo
      //                inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador
      //                inner join mod_logistica.dat_movimiento m on m.idproducto = p.idproducto
      //                inner join mod_logactivofijotangible.dat_movregnumerico r on r.idmovimiento = m.idmovimiento
      //                inner join mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = r.idregnumerico
      //                inner join mod_logactivofijotangible.dat_movregnumericoactivo mr
      //                on mr.idmovregnumerico = r.idmovregnumerico
      //                left join mod_logactivofijotangible.dat_responsable dr on dr.idresponsable = mr.idresponsable
      //                left join mod_persona.dat_persona dper on dper.idpersona = dr.idpersona
      //                inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
      //                inner join mod_logactivofijotangible.nom_estatustecnico et
      //                on et.idestatustecnico = mr.idestatustecnico
      //                inner join mod_estructuracomp.nom_filaestruc f on p.idestructuraop = f.idfila
      //                inner join mod_datosmaestros.dat_operacion o on o.idoperacion = d.idoperacion
      //                inner join mod_datosmaestros.nom_operacion op on op.idnomoperaciones = o.idnomoperaciones
      //                left join mod_logactivofijotangible.dat_transfentreareas t on t.iddocorigen = d.iddocumento
      //                left join mod_logistica.dat_documento dd on dd.iddocumento = t.iddocdestino
      //                left join mod_logistica.dat_movimiento mm on mm.iddocumento = dd.iddocumento
      //                left join mod_logactivofijotangible.dat_movregnumerico rr on rr.idmovimiento = mm.idmovimiento
      //                left join mod_logactivofijotangible.dat_movregnumericoactivo mmr
      //                on mmr.idmovregnumerico = rr.idmovregnumerico
      //                left join mod_logactivofijotangible.nom_estatustecnico net
      //                on net.idestatustecnico = mmr.idestatustecnico
      //                left join mod_logactivofijotangible.dat_responsable ddr on ddr.idresponsable = mmr.idresponsable
      //                left join mod_persona.dat_persona ddper on ddper.idpersona = ddr.idpersona
      //                inner join mod_estructuracomp.nom_filaestruc fp on f.lft >= fp.lft
      //                and f.rgt <= fp.rgt and fp.idfila = $idestructuraop[0]
      //
      //                where d.estado = 3 and op.codigooperacion = 'OPER_ENTREG_TEMPORAL'";
      //        if ($idespecialidad) {
      //            $sql .= " and i.idespecialidad = $idespecialidad";
      //        }
      //        $sql .= " order by d.cronologia";
      //        return $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
      //    }



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



      public function getMarcas($parametros)
      {
      $parametros['estado'] = 1;
      $parametros['denominacion'] = $parametros['query'];
      $marca = MarcamodeloModel::GetMarcas($parametros);
      return array('data' => $marca['datos'], 'total' => $marca['cantidad']);
      }

      public function getModelos($parametros)
      {
      $parametros['estado'] = 1;
      $parametros['denominacion'] = $parametros['query'];
      $modelo = MarcamodeloModel::GetModelos($parametros);
      return array('data' => $modelo['datos'], 'total' => $modelo['cantidad']);
      }



      public function getDatEspecificosDoc($idDocumento, $idOperacion)
      {
      $objDocService = new DocumentoActivoService();
      $comun = ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
      $datos = $comun->getDatosInterfazByIdOperacion($idOperacion);

      if ($datos['signo'] == '-' || $datos['signo'] == '+') {
      return $objDocService->getDatosDocumentoOrigen($idDocumento, $idOperacion);

      }
      return $objDocService->getDatEspecificosDoc($idDocumento, $idOperacion);


      }

      public function getResponsables()
      {
      $conn = Zend_Registry::get('conexion');
      $select
      = "SELECT DISTINCT(
      (Case When pers.nombre is not null
      Then (pers.nombre || (Case When pers.papel is not null Then ' ' Else '' End))
      Else ''
      End) ||
      (Case When pers.papel is not null
      Then (pers.papel || (Case When pers.sapel is not null Then ' ' Else '' End))
      Else ''
      End) ||
      (Case When pers.sapel is not null Then pers.sapel Else '' End)
      ) as responsable,pers.idpersona as idpersona,resp.idresponsable";
      $from
      = " FROM mod_logactivofijotangible.dat_regnumericoactivo rna
      LEFT JOIN  mod_logactivofijotangible.dat_responsable resp ON rna.idresponsable = resp.idresponsable
      LEFT JOIN mod_persona.dat_persona pers ON pers.idpersona = resp.idpersona
      ";
      $sqlDatos = $select . $from;

      $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

      return array('datos' => ($datos));
      }

      public function cargarComboEjercicios($identidad)
      {
      $ejercicio = ServiciosConfiguracionGeneralHelper::__init()->ObtenerEjercicios(
      $identidad
      );
      return array('datos' => $ejercicio);
      }

      public function cargarTiposMedios($parametros)
      {
      $datos = array();
      $integrator = ZendExt_IoC::getInstance();
      $naturalezas = $integrator->parametros->ObtenerNaturalezasAsociadasIndicador(
      $parametros->start, $parametros->limit, ' i.almacenado = 1 OR i.explotacion = 1'
      );

      $datos['total'] = $naturalezas['total'];
      foreach ($naturalezas['data'] as $natura) {
      $dat = self::findTipoMedioById(
      $natura['idnaturaleza'], 'array'
      );
      if (count($dat) == 0) {
      $datos['datos'][] = array('idnaturaleza'  => $natura['idnaturaleza'],
      'dennaturaleza' => $natura['denominacion'],);
      } else {
      $datos['datos'][] = $dat[0];
      }
      }

      return $datos;
      }

      public function findTipoMedioById($idtipomedio, $tiporetorno = null)
      {
      $query = new Doctrine_Query();
      $query->from('CfgTipoMedio cfgtm')->where(
      'cfgtm.idtipomedio = ?', array($idtipomedio)
      );

      if ($tiporetorno == 'obj') {
      return $query->execute();
      } else {
      return $query->fetchArray();
      }
      }

      public function exportarResumenRegistroNum($params)
      {

      $integrator = ZendExt_IoC::getInstance();

      $idareas = $params['idarea'];
      $deno = "";

      foreach ($idareas as $k => $idA) {
      $ent = $integrator->metadatos->DameEstructura($idA);
      $deno .= $ent[0]->denominacion;
      if ($k + 1 < count($idareas)) {
      $deno .= ", ";
      }
      }

      // Crear objeto excel
      $objPHPExcel = new PHPExcel();

      // Cambiando las propiedades del documento
      $objPHPExcel->getProperties()->setCreator("SISTEMA ACTIVOS FIJOS");
      $objPHPExcel->getProperties()->setLastModifiedBy(
      "SISTEMA ACTIVOS FIJOS"
      );
      $objPHPExcel->getProperties()->setTitle("REPORTE: MEDIOS");
      $objPHPExcel->getProperties()->setSubject("REPORTE: MEDIOS");
      $objPHPExcel->getProperties()->setDescription("Reporte de los medios.");
      $objPHPExcel->getProperties()->setKeywords("Disponibilidad, medios");
      $objPHPExcel->getProperties()->setCategory("REPORTE");

      // Configurando encabezado
      $objPHPExcel->setActiveSheetIndex(0);
      $objPHPExcel->getActiveSheet()->setTitle('DISPONIBLES');
      $datosR = self::GetConteoRegNumericosEntidad($idareas, $params);

      $idsregNum = Array();

      foreach ($datosR['datos'] as $key => $value) {
      $idsregNum[] = $value['idregnumerico'];

      $f = $key + 7;

      $objPHPExcel->getActiveSheet()->setCellValue('A' . $f, $key + 1);
      $objPHPExcel->getActiveSheet()->setCellValue(
      'B' . $f, $value['codigo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'C' . $f, $value['denominacion']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'D' . $f, $value['marca']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'E' . $f, $value['modelo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'F' . $f, $value['nroinventario']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'G' . $f, $value['nroserie']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'H' . $f, $value['matricula']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'I' . $f, $value['indicativo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'J' . $f, $value['entidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'K' . $f, $value['arearesponsabilidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'L' . $f, $value['ubicacion']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'M' . $f, $value['valorcontable']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'N' . $f, $value['vidautil']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'O' . $f, $value['tasafiscal']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'P' . $f, $value['depreciacionacumulada']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'Q' . $f, $value['fechaadq']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'R' . $f, $value['fechaexpini']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'S' . $f, $value['fechaexpfin']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'T' . $f, $value['estado']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'U' . $f, $value['tipocombustible']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'V' . $f, $value['numcirculacion']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'W' . $f, $value['numeromotor1']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'X' . $f, $value['numeromotor2']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'Y' . $f, $value['kilometraje']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'Z' . $f, $value['indiceconsumo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AA' . $f, $value['ficav']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AB' . $f, $value['lot']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AC' . $f, $value['pax']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AD' . $f, $value['categoria']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AE' . $f, $value['responsable']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AF' . $f, $value['naturaleza']
      );
      }


      $objPHPExcel = self::crearHojaRegistros($objPHPExcel, $f, $deno);
      $objPHPExcel = self::crearHojaSalidas($objPHPExcel, $idareas, $deno, $params);
      $objPHPExcel = self::crearHojaMovimientos($objPHPExcel, $idsregNum, $idareas, $deno, $params);
      $objPHPExcel = self::crearHojaMedios(
      $objPHPExcel, $idareas, $deno, $params
      );

      // Save Excel 95 file
      $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

      error_reporting(E_ALL);
      //ini_set('display_errors', true);
      //ini_set('display_startup_errors', true);
      //define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
      // Generate the server headers

      header('Content-Type: application/vnd.ms-excel');
      header('Content-Disposition: attachment; filename="fichero.xls"');
      header("Content-Transfer-Encoding: binary");
      header('Expires: 0');
      header('Cache-Control: max-age=0');
      header('Cache-Control: max-age=1');
      header('Cache-Control: cache, must-revalidate');
      header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
      header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

      if (strpos($_SERVER['HTTP_USER_AGENT'], "MSIE") !== false) {
      header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
      header('Pragma: public', true);
      } else {
      header('Pragma: no-cache');
      }

      $objWriter->save('php://output');
      }

      public function crearHojaRegistros($objPHPExcel, $f, $ent)
      {
      $boders = new PHPExcel_Style();
      $boders->applyFromArray(
      array('borders'    => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'right'  => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'top'    => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'left'   => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
      'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
      );

      $objPHPExcel->getActiveSheet()->setSharedStyle($boders, "A6:AF{$f}");

      $objPHPExcel->getActiveSheet()->setCellValue(
      'D1', 'Medios disponibles'
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'B3', 'Entidad(es)/Área(s)'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('C3', $ent);

      $objPHPExcel->getActiveSheet()->setCellValue('A6', 'No.');
      $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Tipo de medio');
      $objPHPExcel->getActiveSheet()->setCellValue('C6', 'Denominación');
      $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Marca');
      $objPHPExcel->getActiveSheet()->setCellValue('E6', 'Modelo');
      $objPHPExcel->getActiveSheet()->setCellValue('F6', 'No. inventario');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'G6', 'No. registro/serie'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('H6', 'Matrícula');
      $objPHPExcel->getActiveSheet()->setCellValue('I6', 'Indicativo');
      $objPHPExcel->getActiveSheet()->setCellValue('J6', 'Entidad');
      $objPHPExcel->getActiveSheet()->setCellValue('K6', 'Área');
      $objPHPExcel->getActiveSheet()->setCellValue('L6', 'Ubicación');
      $objPHPExcel->getActiveSheet()->setCellValue('M6', 'Valor contable');
      $objPHPExcel->getActiveSheet()->setCellValue('N6', 'Vida útil');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'O6', 'Tasa/Factor de Dep.(Anual)'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('P6', 'Dep. Acumulada');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'Q6', 'Fecha de adquisición'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('R6', 'Fecha Exp. inicio');
      $objPHPExcel->getActiveSheet()->setCellValue('S6', 'Fecha Exp. fin');
      $objPHPExcel->getActiveSheet()->setCellValue('T6', 'Estatus técnico');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'U6', 'Tipo de combustible'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('V6', 'No. circulación');
      $objPHPExcel->getActiveSheet()->setCellValue('W6', 'No. motor 1');
      $objPHPExcel->getActiveSheet()->setCellValue('X6', 'No. motor 2');
      $objPHPExcel->getActiveSheet()->setCellValue('Y6', 'Kilometraje');
      $objPHPExcel->getActiveSheet()->setCellValue('Z6', 'Índice de consumo');
      $objPHPExcel->getActiveSheet()->setCellValue('AA6', 'FICAV');
      $objPHPExcel->getActiveSheet()->setCellValue('AB6', 'LOT');
      $objPHPExcel->getActiveSheet()->setCellValue('AC6', 'PAX');
      $objPHPExcel->getActiveSheet()->setCellValue('AD6', 'Categoría');
      $objPHPExcel->getActiveSheet()->setCellValue('AE6', 'Responsable');
      $objPHPExcel->getActiveSheet()->setCellValue('AF6', 'Naturaleza');


      $objPHPExcel->getActiveSheet()->getColumnDimension(A)->setWidth(5);
      $objPHPExcel->getActiveSheet()->getColumnDimension(B)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(C)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(D)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(E)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(F)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(G)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(H)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(I)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(J)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(K)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(L)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(N)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(O)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(P)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(Q)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(R)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(S)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(T)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(U)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(V)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(W)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(X)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(Y)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(Z)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AA)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AB)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AC)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AD)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AE)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AF)->setWidth(16);

      $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('J6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('K6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('L6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('M6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('N6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('O6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('P6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('Q6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('R6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('S6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('T6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('U6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('V6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('W6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('X6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('Y6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('Z6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AA6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AB6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AC6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AD6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AE6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AF6')->getFont()->setBold(
      true
      );


      return $objPHPExcel;
      }

      public function crearHojaSalidas($objPHPExcel, $idarea, $ent, $params)
      {
      //          ****************************************** Salidas     *********************************

      $datosS = self::GetConteoRegNumericosEntidadSalidas($params, $idarea);

      if (count($datosS['datos']) == 0) {
      return $objPHPExcel;
      }

      $objPHPExcel->createSheet();

      $numHoja = $objPHPExcel->getSheetCount();
      $objPHPExcel->setActiveSheetIndex($numHoja - 1);
      $objPHPExcel->getActiveSheet()->setTitle('SALIDAS');

      foreach ($datosS['datos'] as $keyS => $valueS) {


      $fS = $keyS + 7;

      $objPHPExcel->getActiveSheet()->setCellValue('A' . $fS, $keyS + 1);
      $objPHPExcel->getActiveSheet()->setCellValue(
      'B' . $fS, $valueS['codigo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'C' . $fS, $valueS['denominacion']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'D' . $fS, $valueS['marca']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'E' . $fS, $valueS['modelo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'F' . $fS, $valueS['nroinventario']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'G' . $fS, $valueS['nroserie']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'H' . $fS, $valueS['matricula']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'I' . $fS, $valueS['indicativo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'J' . $fS, $valueS['entidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'K' . $fS, $valueS['arearesponsabilidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'L' . $fS, $valueS['ubicacion']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'M' . $fS, $valueS['valorcontable']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'N' . $fS, $valueS['vidautil']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'O' . $fS, $valueS['tasafiscal']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'P' . $fS, $valueS['depreciacionacumulada']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'Q' . $fS, $valueS['fechaadq']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'R' . $fS, $valueS['fechaexpini']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'S' . $fS, $valueS['fechaexpfin']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'T' . $fS, $valueS['estado']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'U' . $fS, $valueS['tipocombustible']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'V' . $fS, $valueS['numcirculacion']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'W' . $fS, $valueS['numeromotor1']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'X' . $fS, $valueS['numeromotor2']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'Y' . $fS, $valueS['kilometraje']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'Z' . $fS, $valueS['indiceconsumo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AA' . $fS, $valueS['ficav']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AB' . $fS, $valueS['lot']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AC' . $fS, $valueS['pax']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AD' . $fS, $valueS['categoria']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AE' . $fS, $valueS['responsable']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'AF' . $fS, $valueS['naturaleza']
      );
      }

      $bodersS = new PHPExcel_Style();
      $bodersS->applyFromArray(
      array('borders'    => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'right'  => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'top'    => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'left'   => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
      'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
      );

      $objPHPExcel->getActiveSheet()->setSharedStyle($bodersS, "A6:AF{$fS}");

      $objPHPExcel->getActiveSheet()->setCellValue(
      'D1', 'Medios que ya no estan en la entidad'
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'B3', 'Entidad(es)/Área(s)'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('C3', $ent);

      $objPHPExcel->getActiveSheet()->setCellValue('A6', 'No.');
      $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Tipo de medio');
      $objPHPExcel->getActiveSheet()->setCellValue('C6', 'Marca');
      $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Modelo');
      $objPHPExcel->getActiveSheet()->setCellValue('E6', 'Matrícula');
      $objPHPExcel->getActiveSheet()->setCellValue('F6', 'No. inventario');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'G6', 'No. registro/serie'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('H6', 'Matrícula');
      $objPHPExcel->getActiveSheet()->setCellValue('I6', 'Indicativo');
      $objPHPExcel->getActiveSheet()->setCellValue('J6', 'Entidad');
      $objPHPExcel->getActiveSheet()->setCellValue('K6', 'Área');
      $objPHPExcel->getActiveSheet()->setCellValue('L6', 'Ubicación');
      $objPHPExcel->getActiveSheet()->setCellValue('M6', 'Valor contable');
      $objPHPExcel->getActiveSheet()->setCellValue('N6', 'Vida útil');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'O6', 'Tasa/Factor de Dep.(Anual)'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('P6', 'Dep. Acumulada');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'Q6', 'Fecha de adquisición'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('R6', 'Fecha Exp. inicio');
      $objPHPExcel->getActiveSheet()->setCellValue('S6', 'Fecha Exp. fin');
      $objPHPExcel->getActiveSheet()->setCellValue('T6', 'Estatus técnico');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'U6', 'Tipo de combustible'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('V6', 'No. circulación');
      $objPHPExcel->getActiveSheet()->setCellValue('W6', 'No. motor 1');
      $objPHPExcel->getActiveSheet()->setCellValue('X6', 'No. motor 2');
      $objPHPExcel->getActiveSheet()->setCellValue('Y6', 'Kilometraje');
      $objPHPExcel->getActiveSheet()->setCellValue('Z6', 'Índice de consumo');
      $objPHPExcel->getActiveSheet()->setCellValue('AA6', 'FICAV');
      $objPHPExcel->getActiveSheet()->setCellValue('AB6', 'LOT');
      $objPHPExcel->getActiveSheet()->setCellValue('AC6', 'PAX');
      $objPHPExcel->getActiveSheet()->setCellValue('AD6', 'Categoría');
      $objPHPExcel->getActiveSheet()->setCellValue('AE6', 'Responsable');
      $objPHPExcel->getActiveSheet()->setCellValue('AF6', 'Naturaleza');


      $objPHPExcel->getActiveSheet()->getColumnDimension(A)->setWidth(5);
      $objPHPExcel->getActiveSheet()->getColumnDimension(B)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(C)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(D)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(E)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(F)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(G)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(H)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(I)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(J)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(K)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(L)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(N)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(O)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(P)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(Q)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(R)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(S)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(T)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(U)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(V)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(W)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(X)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(Y)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(Z)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AA)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AB)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AC)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AD)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AE)->setWidth(16);
      $objPHPExcel->getActiveSheet()->getColumnDimension(AF)->setWidth(16);


      $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('J6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('K6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('L6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('M6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('N6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('O6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('P6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('Q6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('R6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('S6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('T6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('U6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('V6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('W6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('X6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('Y6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('Z6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AA6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AB6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AC6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AD6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AE6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('AF6')->getFont()->setBold(
      true
      );

      return $objPHPExcel;
      }

      public function crearHojaMovimientos($objPHPExcel, $idsregNum, $idarea, $ent, $params)
      {
      // Movimientos

      if (count($idsregNum) == 0) {
      return $objPHPExcel;
      }
      $objPHPExcel->createSheet();

      $numHoja = $objPHPExcel->getSheetCount();
      $objPHPExcel->setActiveSheetIndex($numHoja - 1);
      $objPHPExcel->getActiveSheet()->setTitle('MOVIMIENTOS');

      $cant = 7;
      foreach ($idsregNum as $idR) {
      $datosM = self::getDatosMovRegNum($idR, $idarea, $params);

      $no = 0;
      foreach ($datosM as $valueM) {
      $objPHPExcel->getActiveSheet()->setCellValue(
      'A' . $cant, ++$no
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'B' . $cant, $valueM['denominacion']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'C' . $cant, $valueM['marca']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'D' . $cant, $valueM['modelo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'E' . $cant, $valueM['nroserie']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'F' . $cant, $valueM['fechacontable']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'G' . $cant, $valueM['denominacionop']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'H' . $cant, $valueM['entidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'I' . $cant, $valueM['arearesponsabilidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'J' . $cant, $valueM['nrodoc']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'K' . $cant, $valueM['observaciones']
      );
      $cant++;
      }

      $cant++;
      }

      $bodersM = new PHPExcel_Style();
      $bodersM->applyFromArray(
      array('borders'    => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'right'  => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'top'    => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'left'   => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
      'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
      );

      $objPHPExcel->getActiveSheet()->setSharedStyle($bodersM, "A6:H{$cant}");

      $objPHPExcel->getActiveSheet()->setCellValue('A6', 'No.');
      $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Denominación');
      $objPHPExcel->getActiveSheet()->setCellValue('C6', 'Marca');
      $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Modelo');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'E6', 'No. registro/serie'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('F6', 'Fecha');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'G6', 'Clave del documento'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('H6', 'Entidad');
      $objPHPExcel->getActiveSheet()->setCellValue(
      'I6', 'Área de responsabilidad'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('J6', 'No. Doc');
      $objPHPExcel->getActiveSheet()->setCellValue('K6', 'Observaciones');

      $objPHPExcel->getActiveSheet()->getColumnDimension(A)->setWidth(5);
      $objPHPExcel->getActiveSheet()->getColumnDimension(B)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(C)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(D)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(E)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(F)->setWidth(15);
      $objPHPExcel->getActiveSheet()->getColumnDimension(G)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(H)->setWidth(30);
      $objPHPExcel->getActiveSheet()->getColumnDimension(I)->setWidth(30);
      $objPHPExcel->getActiveSheet()->getColumnDimension(J)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(K)->setWidth(40);


      $objPHPExcel->getActiveSheet()->setCellValue(
      'D1', 'Movimientos por medios'
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'B3', 'Entidad(es)/Área(s)'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('C3', $ent);

      $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(
      'C', '3', 'D', '3'
      );


      $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('J6')->getFont()->setBold(
      true
      );


      return $objPHPExcel;
      }

      public function crearHojaMedios($objPHPExcel, $idarea, $ent, $params)
      {
      //         ************************* Movimientos *****************************
      $objPHPExcel->createSheet();

      $numHoja = $objPHPExcel->getSheetCount();
      $objPHPExcel->setActiveSheetIndex($numHoja - 1);
      $objPHPExcel->getActiveSheet()->setTitle('MEDIOS');
      $datosM = self::GetConteoEntidad(false, false, $idarea, $params);

      foreach ($datosM['datos'] as $keyM => $valueM) {


      $fM = $keyM + 7;

      $objPHPExcel->getActiveSheet()->setCellValue('A' . $fM, $keyM + 1);
      $objPHPExcel->getActiveSheet()->setCellValue(
      'B' . $fM, $valueM['codigo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'C' . $fM, $valueM['denominacion']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'D' . $fM, $valueM['marca']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'E' . $fM, $valueM['modelo']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'F' . $fM, $valueM['siglasnacionalidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'G' . $fM, $valueM['cantidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'H' . $fM, $valueM['disponibilidad']
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'I' . $fM, $valueM['naturaleza']
      );
      }

      $bodersM = new PHPExcel_Style();
      $bodersM->applyFromArray(
      array('borders'    => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'right'  => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'top'    => array('style' => PHPExcel_Style_Border::BORDER_THIN),
      'left'   => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
      'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
      );

      $objPHPExcel->getActiveSheet()->setSharedStyle($bodersM, "A6:H{$fM}");

      $objPHPExcel->getActiveSheet()->setCellValue('A6', 'No.');
      $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Código');
      $objPHPExcel->getActiveSheet()->setCellValue('C6', 'Denominación');
      $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Marca');
      $objPHPExcel->getActiveSheet()->setCellValue('E6', 'Modelo');
      $objPHPExcel->getActiveSheet()->setCellValue('F6', 'Nacionalidad');
      $objPHPExcel->getActiveSheet()->setCellValue('G6', 'Cantidad');
      $objPHPExcel->getActiveSheet()->setCellValue('H6', 'Disponibilidad');
      $objPHPExcel->getActiveSheet()->setCellValue('I6', 'Naturaleza');

      $objPHPExcel->getActiveSheet()->getColumnDimension(A)->setWidth(5);
      $objPHPExcel->getActiveSheet()->getColumnDimension(B)->setWidth(30);
      $objPHPExcel->getActiveSheet()->getColumnDimension(C)->setWidth(30);
      $objPHPExcel->getActiveSheet()->getColumnDimension(D)->setWidth(15);
      $objPHPExcel->getActiveSheet()->getColumnDimension(E)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(F)->setWidth(20);
      $objPHPExcel->getActiveSheet()->getColumnDimension(G)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(H)->setWidth(10);
      $objPHPExcel->getActiveSheet()->getColumnDimension(I)->setWidth(30);


      $objPHPExcel->getActiveSheet()->setCellValue(
      'D1', 'Cantidad de  medios'
      );
      $objPHPExcel->getActiveSheet()->setCellValue(
      'B3', 'Entidad(es)/Área(s)'
      );
      $objPHPExcel->getActiveSheet()->setCellValue('C3', $ent);

      $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(
      'C', '3', 'D', '3'
      );


      $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(
      true
      );
      $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(
      true
      );

      $objPHPExcel->setActiveSheetIndex(0);


      return $objPHPExcel;
      }

      public function getDatosMovRegNum($idregnum, $idarearesp, $params)
      {
      $conn = Zend_Registry::get('conexion');
      $selectDatos
      = "select distinct
      d.iddocumento, d.observaciones, d.idoperacion, d.nrodoc, mrna.idmovregnumerico, d.idoperacion,
      mrna.idarearesp, d.fechacontable, n.denominacion as denominacionop, mrna.nroinventario,
      reg.nroserie, eu.descripcion as ubicacion, mrna.valoradquisicion, mrna.valorcontable, mrna.vidautil,
      mrna.tasafiscal, mrna.depreciacionacumulada, mrna.fechaadq, mrna.fechaexpini, mrna.fechaexpfin,
      movrnatran.nromatricula as matricula,movrnatran.indicativo,movrnatran.nrocirculacion as numcirculacion,
      movrnatran.nromotor1 as numeromotor1, movrnatran.nromotor2 as numeromotor2, movrnatran.kilometraje,
      movrnatran.indiceconsumo, movrnatran.ficav, movrnatran.lot, tipcom.denominacion as tipocombustible,
      movrnatran.capacidad as pax, et.denominacion as estado, es.denominacion as entidad,
      deop.denominacion as arearesponsabilidad, cat.denominacion as categoria, i.codigo, i.descripcion,
      i.idespecialidad, i.denominacion, pais.siglas as siglasnacionalidad, modelo.denominacion as modelo,
      marca.denominacion as marca, nat.denominacion as naturaleza ";

      if (count($idarearesp) == 1) {
      $arrayEstructuras
      = "(
      SELECT idfila FROM mod_estructuracomp.nom_filaestruc
      WHERE
      lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN ("
      . implode(',', $idarearesp) . ")) AND
      rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN ("
      . implode(',', $idarearesp) . ")))";
      } else {
      $arrayEstructuras = " (" . implode(',', $idarearesp) . ")";
      }

      $sql = "from  mod_logistica.dat_documento d
      inner join  mod_logistica.dat_movimiento m on d.iddocumento = m.iddocumento
      inner join  mod_logactivofijotangible.dat_movregnumerico r on r.idmovimiento = m.idmovimiento
      inner join  mod_logactivofijotangible.dat_registronumerico reg on r.idregnumerico = reg.idregnumerico
      INNER JOIN mod_logistica.dat_producto prod ON  prod.idproducto= reg.idproducto
      INNER  JOIN mod_datosmaestros.nom_indicador i ON prod.idindicador = i.idindicador
      inner join  mod_logactivofijotangible.dat_movregnumericoactivo mrna
      on mrna.idmovregnumerico = r.idmovregnumerico
      INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivotransp movrnatran
      ON movrnatran.idmovregnumerico = mrna.idmovregnumerico
      inner join  mod_datosmaestros.dat_operacion p on p.idoperacion = d.idoperacion
      inner join  mod_datosmaestros.nom_operacion n on n.idnomoperaciones = p.idnomoperaciones
      LEFT  JOIN mod_logistica.dat_estructuraubicacion eu ON mrna.idubicacion = eu.idestructuraubicacion
      LEFT JOIN mod_logactivofijotangible.nom_tipocombustible tipcom
      ON movrnatran.idtipocombustible = tipcom.idtipocombustible
      LEFT  JOIN mod_logactivofijotangible.nom_estatustecnico et
      ON mrna.idestatustecnico = et.idestatustecnico
      LEFT  JOIN mod_logistica.nom_categoria cat ON mrna.idcategoria = cat.idcategoria
      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
      LEFT  JOIN mod_datosmaestros.nom_pais pais ON i.idpais = pais.idpais
      LEFT  JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
      LEFT  JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
      INNER JOIN mod_datosmaestros.nom_naturaleza nat ON i.idnaturaleza = nat.idnaturaleza
      inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = mrna.idarearesp
      inner join mod_estructuracomp.nom_filaestruc f on f.idfila = deop.idestructuraop
      inner join mod_estructuracomp.dat_estructura es on f.idpadre = es.idestructura
      inner join mod_estructuracomp.nom_filaestruc fp on f.lft >= fp.lft and f.rgt <= fp.rgt
      where r.idregnumerico = $idregnum and d.estado = 3 and d.idestructuracomun IN $arrayEstructuras ";
      $orderBY = ' order by mrna.idmovregnumerico ASC ';

      if ($params['idespecialidad']) {
      $sql .= "AND i.idespecialidad = " . $params['idespecialidad'];
      }
      $sqlDatos = $selectDatos . $sql . $orderBY;
      $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

      return $datos;
      }


     */
}
