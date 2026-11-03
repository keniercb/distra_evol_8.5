<?php

class SubmayorModel extends ZendExt_Model {

    public function SubmayorModel() {
        parent::ZendExt_Model();
    }
    
    public function getInmuebles($arrayIdarearesp,$idespecialidad){
          if (count($arrayIdarearesp) == 1) {
            $arrayEstructuras = "(
         SELECT idfila FROM mod_estructuracomp.nom_filaestruc
        WHERE
        lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN (".  implode(',', $arrayIdarearesp).")) AND
                rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN (".  implode(',', $arrayIdarearesp).")))";
        } else {
            $arrayEstructuras =" (".  implode(',', $arrayIdarearesp).")";
        }
           $conn = Zend_Registry::get('conexion');
           $select = " select sum (q.valorcontabletotal) as valorcontabletotal from (
                      SELECT distinct rna.idregnumerico, rna.valormodulo as valorcontabletotal";
           $from = " from mod_logactivofijotangible.dat_regnumericoactivo rna
                        inner join mod_logistica.dat_registronumerico rn on rn.idregnumerico = rna.idregnumerico
                        inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                        INNER JOIN mod_estructuracomp.nom_filaestruc f ON p.idestructuraop = f.idfila
                        inner join mod_logistica.dat_movimiento mv on p.idproducto = mv.idproducto
                        inner join mod_logistica.dat_documento doc on mv.iddocumento = doc.iddocumento
                        inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = p.idprod
                        inner join mod_nomencladores.nom_especialidad nes on nes.idespecialidad = ni.idespecialidad   ";
           $where = " where doc.estado = 3 
               AND rna.esmodulo = 2 
               AND f.idfila IN $arrayEstructuras";
           
           if ($idespecialidad) {            
            $where .= " AND nes.idespecialidad in (".  implode(',', $idespecialidad).")";
          
            }
            $where .= " )q";
           $sqlDatos = $select . $from . $where;
           $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
          
           $select2 = "select count (DISTINCT rna.idregnumerico)";
           $from2 = " from mod_logistica.dat_registronumerico dar 
                        inner join mod_logistica.dat_producto dp on dar.idproducto = dp.idproducto
                        inner join  mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = dar.idregnumerico     
                        inner join mod_estructuracomp.dat_estructuraop desop on desop.idestructuraop = dp.idestructuraop
                        inner join mod_estructuracomp.nom_filaestruc ffh on ffh.idfila = desop.idestructuraop
                        inner join mod_estructuracomp.nom_filaestruc ffp on ffp.lft <= ffh.lft and ffp.rgt >= ffh.rgt   
                        inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idprod
                        inner join mod_nomencladores.nom_especialidad nes on nes.idespecialidad = ni.idespecialidad     ";
           $where2 =" where  ffp.idfila IN $arrayEstructuras 
                      and rna.esmodulo = 2 
                      and dar.idproducto in (select dm.idproducto
                      from mod_logistica.dat_movimiento dm 
                      inner join mod_logistica.dat_documento dd on dm.iddocumento = dd.iddocumento 
                      inner join mod_datosmaestros.dat_operacion opp on opp.idoperacion = dd.idoperacion
                      inner join mod_datosmaestros.nom_operaciones npp on npp.idnomoperaciones = opp.idnomoperaciones
                      where dd.estado = 3 )    ";
            if ($idespecialidad) {            
            $where2 .= " AND nes.idespecialidad in (".  implode(',', $idespecialidad).")";
          
        }
            $sqlDatos2 = $select2 . $from2 . $where2;
           
            $datos2 = $conn->execute($sqlDatos2)->fetchAll(PDO::FETCH_ASSOC);
            $datos2[0]['valorcontabletotal'] = $datos[0]['valorcontabletotal'];
          
          return $datos2;
          
    }

    public function GetConteoEntidad($start, $limit, $idestructuraop, $parametros) {

        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();

            $idestructuraop[] = $global->Estructura->idestructura;
        }

        if (count($idestructuraop) == 1) {
            $arrayEstructuras = "(
    SELECT idfila FROM mod_estructuracomp.nom_filaestruc
        WHERE
        lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN (" . implode(',', $idestructuraop) . ")) AND
                rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN (" . implode(',', $idestructuraop) . ")))";
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
                    (select sum (aa.cantidad) from mod_logactivofijotangible.dat_activofijo aa inner join
                     mod_logistica.dat_producto pp ON aa.idactivofijo = pp.idproducto
                     where pp.idprod = p.idprod and pp.idestructuraop in $arrayEstructuras
    )  as cantidad,
    
    (select sum (aa.disponible) from mod_logactivofijotangible.dat_activofijo aa inner join
    mod_logistica.dat_producto pp ON aa.idactivofijo = pp.idproducto
    where pp.idprod = p.idprod and pp.idestructuraop in $arrayEstructuras
    )  as disponibilidad,
    n.denominacion as naturaleza
        ";       

        $from = " FROM mod_logactivofijotangible.dat_activofijo a
                INNER JOIN mod_logistica.dat_producto p ON a.idactivofijo = p.idproducto
                INNER JOIN mod_logistica.dat_movimiento m ON p.idproducto = m.idproducto
                INNER JOIN mod_estructuracomp.nom_filaestruc f ON p.idestructuraop = f.idfila
                LEFT  JOIN mod_datosmaestros.nom_indicador i ON p.idprod = i.idindicador
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                LEFT  JOIN mod_nomencladores.nom_pais pais ON i.idpais = pais.idpais
                LEFT  JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                LEFT  JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
                INNER JOIN mod_datosmaestros.nom_naturaleza n ON i.idnaturaleza = n.idnaturaleza
        ";


        $where = " WHERE f.idfila IN $arrayEstructuras
                  AND m.cronologia > 0";

        /* if ($parametros['idespecialidad']) {
          $where .= "AND i.idespecialidad = {$parametros['idespecialidad']}";
          } */
        if ($parametros['idespecialidad']) {
            $where .= " AND i.idespecialidad in (" . implode(',', $parametros['idespecialidad']) . ")";
        }
        if ($parametros['codigo']) {
            $where .= "AND i.codigo iLike '{$parametros['codigo']}%'";
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
        if ($parametros['cantidad']) {
            $cantidad = $parametros['cantidad'];
            $where .= " AND (select sum (aa.cantidad) from mod_logactivofijotangible.dat_activofijo aa inner join
                        mod_logistica.dat_producto pp ON aa.idactivofijo = pp.idproducto
                        where pp.idprod = p.idprod and pp.idestructuraop in $arrayEstructuras
            ) = $cantidad";
        }
        if ($parametros['idnaturaleza']) {
            $idnaturaleza = $parametros['idnaturaleza'];
            $where .= "AND i.idnaturaleza = $idnaturaleza ";
        }


        if ($parametros['disponibilidad']) {
            $disponibilidad = $parametros['disponibilidad'];
            $where .= "AND (select sum (aa.disponible) from mod_logactivofijotangible.dat_activofijo aa inner join
                       mod_logistica.dat_producto pp ON aa.idactivofijo = pp.idproducto
                       where pp.idprod = p.idprod and pp.idestructuraop in $arrayEstructuras
            ) = $disponibilidad ";
        }       
        $sqlDatos = $select . $from . $where;
        $sqlCount = 'SELECT count (a.idactivofijo) ' . $from . $where;
        if ($limit) {
            $sqlDatos .= " offset($start) limit($limit)";
        }


        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => (count($datos) > 0) ? $datos : array(),
            'total' => (count($total)) ? $total[0]['count'] : 0);
    }

    public function GetConteoEntidadSalidas($start = 0, $limit = 20, $idestructuraop, $parametros) {
        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();

            $idestructuraop[] = $global->Estructura->idestructura;
        }



        if (count($idestructuraop) == 1) {
            $arrayEstructuras = "( SELECT idfila FROM mod_estructuracomp.nom_filaestruc
                                                 WHERE lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc
                                                        WHERE idfila = $idestructuraop[0]) AND rgt <=
                                                            (SELECT rgt FROM mod_estructuracomp.nom_filaestruc
                                                                WHERE idfila = $idestructuraop[0]))";
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
                    1 as salidas,
                    rna.idregnumerico,
                    pais.nombrepais as siglasnacionalidad,
                    modelo.denominacion as modelo,
                    marca.denominacion as marca,
                    (select count (distinct  movreg.idregnumerico) from  mod_logistica.dat_producto pp
                     inner join mod_datosmaestros.nom_indicador i2 on pp.idprod = i2.idindicador
                     inner join mod_logactivofijotangible.dat_activofijo a on pp.idproducto = a.idactivofijo
                     inner join mod_logistica.dat_movimiento mov on pp.idproducto = mov.idproducto
                     inner join mod_logistica.dat_movregnumerico movreg on movreg.idmovimiento = mov.idmovimiento
                     inner join mod_logistica.dat_registronumerico reg on movreg.idregnumerico = reg.idregnumerico
                     inner join mod_logactivofijotangible.dat_regnumericoactivo rega2 on rega2.idregnumerico = reg.idregnumerico
                     inner join mod_logactivofijotangible.dat_movregnumericoactivo movrega on movreg.idmovregnumerico = movrega.idmovregnumerico
                      WHERE i2.idindicador = i.idindicador and movreg.idregnumerico NOT IN ( Select r2.idregnumerico
                                            FROM mod_logistica.dat_registronumerico r2
                                            inner join mod_logactivofijotangible.dat_regnumericoactivo rna2 on rna2.idregnumerico = r2.idregnumerico

                                            WHERE rna2.idarearesp IN $arrayEstructuras)
                  AND movrega.idarearesp IN $arrayEstructuras) as cantidad,
    0 as disponibilidad,
    n.denominacion as naturaleza
        ";

        $from = " FROM mod_logactivofijotangible.dat_activofijo a
                INNER JOIN mod_logistica.dat_producto p ON a.idactivofijo = p.idproducto
                INNER JOIN mod_logistica.dat_movimiento m ON p.idproducto = m.idproducto
                inner join mod_logistica.dat_documento doc on m.iddocumento = doc.iddocumento
                inner join mod_logistica.dat_registronumerico reg on p.idproducto = reg.idproducto
                inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = reg.idregnumerico
                inner join mod_logistica.dat_movregnumerico movreg2 on reg.idregnumerico = movreg2.idregnumerico
                inner join mod_logactivofijotangible.dat_movregnumericoactivo movrega2 on movreg2.idmovregnumerico = movrega2.idmovregnumerico
                INNER JOIN mod_estructuracomp.nom_filaestruc f ON p.idestructuraop = f.idfila
                LEFT  JOIN mod_datosmaestros.nom_indicador i ON p.idprod = i.idindicador
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                LEFT  JOIN mod_nomencladores.nom_pais pais ON i.idpais = pais.idpais
                LEFT  JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                LEFT  JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
                INNER JOIN mod_datosmaestros.nom_naturaleza n ON i.idnaturaleza = n.idnaturaleza
        ";


        $where = " WHERE movrega2.idarearesp IN $arrayEstructuras
                  AND movreg2.idregnumerico NOT IN ( Select reg2.idregnumerico
                      FROM mod_logistica.dat_registronumerico reg2
                      inner join mod_logactivofijotangible.dat_regnumericoactivo rega2 on rega2.idregnumerico = reg2.idregnumerico

                          WHERE rega2.idarearesp IN $arrayEstructuras) AND m.cronologia > 0 AND doc.estado = 3";

        if ($parametros['codigo']) {
            $where .= "AND i.codigo iLike '{$parametros['codigo']}%'";
        }
        if ($parametros['idespecialidad']) {
            $where .= " AND i.idespecialidad in (" . implode(',', $parametros['idespecialidad']) . ")";
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
        if ($parametros['cantidad']) {
            $cantidad = $parametros['cantidad'];
            $where .= "AND cantidad = $cantidad";
        }
        if ($parametros['idnaturaleza']) {
            $idnaturaleza = $parametros['idnaturaleza'];
            $where .= "AND i.idnaturaleza = $idnaturaleza ";
        }


        if ($parametros['disponibilidad']) {
            $disponibilidad = $parametros['disponibilidad'];
            $where .= "AND disponibilidad = $disponibilidad ";
        }
        
        $sqlDatos = $select . $from . $where;
        $sqlCount = 'SELECT count (distinct i.codigo) ' . $from . $where;

        if ($limit) {
            $sqlDatos .= " offset($start) limit($limit)";
        }

        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);

        return array('datos' => (count($datos) > 0) ? $datos : array(),
            'total' => (count($total)) ? $total[0]['count'] : 0);
    }

    public function getContorValorInmueble($ordendermodulo, $ordenizqmodulo, $idarea)
    {
        $conn = Zend_Registry::get('conexion');
        $select = "SELECT sum(rna.valorcontable) as valorcontable
                    FROM mod_logactivofijotangible.dat_regnumericoactivo rna
                    where rna.idarearesp = $idarea and rna.ordenizq >= $ordenizqmodulo and rna.ordender <= $ordendermodulo
                    ";
        $cant = $conn->fetchAll($select);
        return $cant;

    }

    public function GetConteoRegNumericosEntidad(
    $start, $limit, $idestructuraop, $idindicador, $parametros, $conproducto = false, $parametrosOll
    ) {

        $total = 0;
        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructuraop[] = $global->Estructura->idestructura;
        }

        $conn = Zend_Registry::get('conexion');
        $select = " select distinct 
                    rn.idregnumerico,

                    eu.descripcion as ubicacion,  
                    rna.idarearesp,  
                    rna.nroinventario,  
                    rna.valoradquisicion,  
                    rna.valorcontable,  
                    rna.vidautil,  
                    rna.tasafiscal,  
                    rna.depreciacionacumulada,
                    rna.fechaadq,  
                    rna.fechaexpini,
                    rna.fechaexpfin,
                    rna.esbaja,
                    rna.esmodulo,
                    rna.ordenizq,
                    rna.ordender,
                    rna.estaentidad,
                    rnat.nromatricula as matricula,
                    rnat.indicativo,
                    rnat.nrocirculacion as numcirculacion,
                    rnat.kmasignado as kmasignado,
                    rnat.nromotor1 as numeromotor1,
                    rnat.nromotor2 as numeromotor2,
                    rnat.kilometraje,
                    rnat.indiceconsumo,
                    rnat.ficav,
                    rnat.lot,
                    rnat.capacidad as pax,
                    tipcom.denominacion as tipocombustible,
                    et.denominacion as estado,
                    es.denominacion as entidad,
                    deop.denominacion as arearesponsabilidad,
                    cat.denominacion as categoria,
                    cat.idcategoria as idcategoria,
                    rn.nroserie,
                    resp.idresponsable,
                    i.idespecialidad";

        $from = " from mod_logactivofijotangible.dat_regnumericoactivo rna
                  inner join mod_logistica.dat_registronumerico rn on rn.idregnumerico = rna.idregnumerico
                  inner join mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rn.idregnumerico = rnat.idregnumerico
                  left join mod_logactivofijotangible.nom_tipocombustible tipcom on rnat.idtipocombustible = tipcom.idtipocombustible
                  left join mod_logactivofijotangible.nom_estatustecnico et on rna.idestatustecnico = et.idestatustecnico
                  inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                  inner join mod_datosmaestros.nom_indicador i on p.idprod = i.idindicador
                  inner join mod_logistica.dat_movimiento mv on p.idproducto = mv.idproducto
                  inner join mod_logistica.dat_documento doc on mv.iddocumento = doc.iddocumento
                  left join mod_logistica.nom_categoria cat on cat.idcategoria = rna.idcategoria
                  left join mod_logistica.dat_estructuraubicacion eu on rna.idubicacion = eu.idestructuraubicacion
                  inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = rna.idarearesp
                  inner join mod_estructuracomp.nom_filaestruc f on f.idfila = deop.idestructuraop
                  inner join mod_estructuracomp.dat_estructura es on f.idpadre = es.idestructura
                  inner join mod_estructuracomp.nom_filaestruc fp on f.lft >= fp.lft and f.rgt <= fp.rgt
       ";
        if (ComunAFTModel::integradoPersona()) {
            $select .= ", ((case when pers.nombre is not null then (pers.nombre || (case when pers.papel is not null then ' ' else '' end))  else ''  end) ||
                        (case when pers.papel is not null then (pers.papel || (case when pers.sapel is not null then ' ' else '' end)) else '' end) ||  
                        (case when pers.sapel is not null then pers.sapel else '' end)) as responsable";

            $from .= " left join mod_logistica.dat_responsable resp on rna.idresponsable = resp.idresponsable
                       left join mod_persona.dat_persona pers on pers.idpersona = resp.idpersona";
        } else {
            die('No esta terminado');
        }
        if (count($idestructuraop) == 1) {
            $arrayIdEst = " (
                    SELECT idfila FROM mod_estructuracomp.nom_filaestruc
                        WHERE
                        lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc WHERE idfila = $idestructuraop[0]) AND
                        rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc WHERE idfila = $idestructuraop[0])
                    )";
        } else {
            $arrayIdEst = "(" . implode(",", $idestructuraop) . ")";
        }

        $where = " WHERE doc.estado = 3 AND p.idestructuraop IN $arrayIdEst";

        if ($parametrosOll['codigo']) {
            $where .= " AND i.codigo iLike '{$parametrosOll['codigo']}%'";
        }
        if ($parametros['codigo']) {
            $where .= " AND i.codigo iLike '{$parametros['codigo']}%'";
        }
        if ($parametrosOll['idespecialidad1']) {
            $where .= " AND i.idespecialidad in (" . implode(',', $parametrosOll['idespecialidad1']) . ")";
            // $where .= " AND i.idespecialidad = {$parametrosOll['idespecialidad']}";
        }
        if ($parametros['idespecialidad1']) {
            $where .= " AND i.idespecialidad in (" . implode(',', $parametros['idespecialidad1']) . ")";
            // $where .= " AND i.idespecialidad = {$parametrosOll['idespecialidad']}";
        }
        if ($parametrosOll['responsable']) {
            $responsable = $parametrosOll['responsable'];
            $where .= " AND resp.idresponsable =$responsable";
        }
        if ($parametrosOll['denominacion']) {
            $where .= " AND i.denominacion iLike '%{$parametrosOll['denominacion']}%'";
        }
        if ($parametrosOll['idmarca']) {
            $idmarca = $parametrosOll['idmarca'];
            $where .= "AND ih.idmarca = $idmarca ";
        }
        if ($parametrosOll['idnaturaleza']) {
            $idnaturaleza = $parametrosOll['idnaturaleza'];
            $where .= "AND i.idnaturaleza = $idnaturaleza ";
        }
        if ($parametrosOll['idmodelo']) {
            $idmodelo = $parametrosOll['idmodelo'];
            $where .= "AND ih.idmodelo = $idmodelo ";
        }
        if ($parametrosOll['idpais']) {
            $idpais = $parametrosOll['idpais'];
            $where .= "AND i.idpais = $idpais ";
        }
        if ($parametrosOll['nroRegistro']) {
            $nroRegistro = $parametrosOll['nroRegistro'];
            $where .= "AND rn.nroserie iLike '%{$nroRegistro}%' ";
        }
        if ($parametrosOll['nroInventario']) {
            $nroInventario = $parametrosOll['nroInventario'];
            $where .= "AND rna.nroinventario iLike '%{$nroInventario}%' ";
        }
        if ($parametrosOll['nromatricula']) {
            $nromatricula = $parametrosOll['nromatricula'];
            $where .= "AND rnat.nromatricula iLike '%{$nromatricula}%' ";
        }
        if ($parametrosOll['indicativo']) {
            $indicativo = $parametrosOll['indicativo'];
            $where .= "AND rnat.indicativo iLike '%{$indicativo}%' ";
        }
        if ($parametros['indicativo']) {
            $indicativo = $parametros['indicativo'];
            $where .= "AND rnat.indicativo iLike '%{$indicativo}%' ";
        }
        if ($parametrosOll['fechaAdquisicion']) {
            $fechaAdquisicion = $parametrosOll['fechaAdquisicion'];
            $where .= "AND rna.fechaadq = '$fechaAdquisicion' ";
        }
        if ($parametrosOll['fechainicioExplotacion']) {
            $fechainicioExplotacion = $parametrosOll['fechainicioExplotacion'];
            $where .= "AND rna.fechaexpini = '$fechainicioExplotacion' ";
        }
        if ($parametrosOll['fechafinExplotacion']) {
            $fechafinExplotacion = $parametrosOll['fechafinExplotacion'];
            $where .= "AND rna.fechaexpfin = '$fechafinExplotacion' ";
        }
        if ($parametrosOll['ValorCDesde']) {
            $ValorCDesde = $parametrosOll['ValorCDesde'];
            $where .= "AND rna.valorcontable < $ValorCDesde ";
        }
        if ($parametrosOll['ValorCHasta']) {
            $ValorCHasta = $parametrosOll['ValorCHasta'];
            $where .= "AND rna.valorcontable > $ValorCHasta ";
        }
        if ($parametrosOll['depreciacionDesde']) {
            $depreciacionDesde = $parametrosOll['depreciacionDesde'];
            $where .= "AND rna.depreciacionacumulada < $depreciacionDesde ";
        }
        if ($parametrosOll['depreciacionHasta']) {
            $depreciacionHasta = $parametrosOll['depreciacionHasta'];
            $where .= "AND rna.depreciacionacumulada > $depreciacionHasta ";
        }
        if ($parametrosOll['tasaDesde']) {
            $tasaDesde = $parametrosOll['tasaDesde'];
            $where .= "AND rna.tasafiscal < $tasaDesde ";
        }
        if ($parametrosOll['tasaHasta']) {
            $tasaHasta = $parametrosOll['tasaHasta'];
            $where .= "AND rna.tasafiscal > $tasaHasta ";
        }
        if ($parametrosOll['idestatustecnico']) {
            $idestado = $parametrosOll['idestatustecnico'];
            $where .= "AND rna.idestatustecnico = $idestado ";
        }
        if ($parametrosOll['valorcontable']) {
            $where .= "AND rna.valorcontable = {$parametrosOll['valorcontable']}";
        }
        if ($parametrosOll['motoruno']) {
            $nromotor1 = $parametrosOll['motoruno'];
            $where .= "AND rnat.nromotor1 = '" . $nromotor1 . "'";
        }
        if ($parametrosOll['motordos']) {
            $nromotor2 = $parametrosOll['motordos'];
            $where .= "AND rnat.nromotor1 = '" . $nromotor2 . "'";
        }
        if ($parametrosOll['circulacion']) {
            $circulacion = $parametrosOll['circulacion'];
            $where .= "AND rnat.nrocirculacion = '" . $circulacion . "'";
        }
        if ($parametrosOll['depreciacion']) {
            $depreciacion = $parametrosOll['depreciacion'];
            $where .= "AND rna.depreciacionacumulada = $depreciacion";
        }
        if ($parametrosOll['kilometraje']) {
            $kilometraje = $parametrosOll['kilometraje'];
            $where .= "AND rnat.kilometraje = $kilometraje";
        }
        if ($parametrosOll['ubicacion']) {
            $ubicacion = $parametrosOll['ubicacion'];
            $where .= "AND eu.descripcion iLike '%{$ubicacion}%' ";
        }
        if ($conproducto) {
            $select .= ", i.codigo,
                        i.descripcion,  
                        i.arridtablas,  
                        i.arridtablasgenerales,  
                        i.idespecialidad,
                        i.denominacion,  
                        i.idindicador,
                        pais.nombrepais as siglasnacionalidad,  
                        modelo.denominacion as modelo,
                        marca.denominacion as marca,  
                        n.denominacion as naturaleza";

            $from .= " inner join mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
            left join mod_nomencladores.nom_pais pais on i.idpais = pais.idpais
            left join mod_datosmaestros.nom_marca marca on ih.idmarca = marca.idmarca  
            left join mod_datosmaestros.nom_modelo modelo on ih.idmodelo = modelo.idmodelo
            inner join mod_datosmaestros.nom_naturaleza n on i.idnaturaleza = n.idnaturaleza
            ";
        }
        if ($parametrosOll['reporte'] == 1 || $parametros['reporte'] == 1) {
            $where .= " AND i.idindicador = $idindicador
            ";
        }
        if ($parametrosOll['reporte'] == 4 || $parametros['reporte'] == 4) {
            $select .= " ,
                i.denominacion,
                modelo.denominacion as modelo,
                marca.denominacion as marca
            ";
        }
        if ($parametrosOll['reporte'] == 18 || $parametros['reporte'] == 18) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idusuario = $global->Perfil->idusuario;
            $from.= "
                    inner join mod_nomencladores.nom_especialidad esp on esp.idespecialidad = i.idespecialidad
                    inner join mod_datosmaestros.dat_operacion o on o.idoperacion = doc.idoperacion
                    inner join mod_datosmaestros.nom_operaciones nopera on nopera.idnomoperaciones = o.idnomoperaciones
                    inner join mod_logistica.dat_movregnumerico mvr on mvr.idregnumerico = rn.idregnumerico
                    inner join mod_logactivofijotangible.conf_espagrupareporte cfgespagruprep on i.idespecialidad = cfgespagruprep.idespecialidad
                    inner join mod_logactivofijotangible.conf_usuarioespecialidad cfguseresp on i.idespecialidad = cfguseresp.idespecialidad
                    left join mod_datosmaestros.dat_unidadmedida um on um.idunidadmedida = p.idumedida
            "; // inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
            $select.= " ,
                    doc.fechacontable as fechadeldocumento,
                    doc.nrodoc as numerodeldocumento,
                    rna.nroinventario as nroinventario,
                    rn.nroserie as noserie,
                    i.denominacion as descripciondelmedio,
                    et.denominacion as estadodelmedio,
                    um.abreviatura as unidadmedida,
                    nopera.denominacion as operaciondoc
            ";
            $where .= "
				AND i.idindicador = $idindicador AND cfgespagruprep.denominacioncolumnareporte NOT IN('sistemaEmp') and cfguseresp.idusuario = $idusuario
            ";
        }
        $sqlDatos = $select . $from . $where;

        $sqlCount = 'SELECT count (DISTINCT(rn.idregnumerico)) ' . $from . $where;

        if ($limit) {
            $sqlDatos .= " offset($start) limit($limit)";
            $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
            $total = $total[0]['count'];
             
            if ($total) {
                $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
            }
           
        } else {
            $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        }
        foreach($datos as $index => $value){
                $valor = self::getContorValorInmueble($value['ordender'],$value['ordenizq'] , $value['idarearesp']);
                $datos[$index]['valorinmueble'] = $valor[0]['valorcontable'];
        }
         
        return array('datos' => (count($datos) > 0) ? $datos : array(), 'total' => $total);
    }

    public function GetDatosReporte($idestructuraop, $idespecialidad) {
        $conn = Zend_Registry::get('conexion');
        $sql = "select
                i.denominacion || ' ' || marca.denominacion || ' ' || mod.denominacion as indicador,
                rn.nroserie, mr.nroinventario,
                et.denominacion as estado,
                d.fechacontable as fecha_entrega,
                dper.nombre || ' ' || dper.papel || ' ' || dper.sapel as responsable_entrega,
                dd.fechacontable as fecha_devolucion,
                dd.iddocumento, ddper.nombre || ' ' || ddper.papel || ' ' || ddper.sapel as responsable_devolucion,
                net.denominacion as estado_devolucion
                
                from mod_datosmaestros.nom_indicador i
                inner join mod_datosmaestros.nom_indicadorhoja h on h.idindicador = i.idindicador
                left join mod_datosmaestros.nom_marca marca on marca.idmarca = h.idmarca
                left join mod_datosmaestros.nom_modelo mod on mod.idmodelo = h.idmodelo
                inner join mod_logistica.dat_producto p on p.idprod = i.idindicador
                inner join mod_logistica.dat_movimiento m on m.idproducto = p.idproducto
                inner join mod_logistica.dat_movregnumerico r on r.idmovimiento = m.idmovimiento
                inner join mod_logistica.dat_registronumerico rn on rn.idregnumerico = r.idregnumerico
                inner join mod_logactivofijotangible.dat_movregnumericoactivo mr on mr.idmovregnumerico = r.idmovregnumerico
                left join mod_logistica.dat_responsable dr on dr.idresponsable = mr.idresponsable
                left join mod_persona.dat_persona dper on dper.idpersona = dr.idpersona
                inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
                inner join mod_logactivofijotangible.nom_estatustecnico et on et.idestatustecnico = mr.idestatustecnico
                inner join mod_estructuracomp.nom_filaestruc f on p.idestructuraop = f.idfila
                inner join mod_datosmaestros.dat_operacion o on o.idoperacion = d.idoperacion
                inner join mod_datosmaestros.nom_operaciones op on op.idnomoperaciones = o.idnomoperaciones
                left join mod_logactivofijotangible.dat_transfentreareas t on t.iddocorigen = d.iddocumento
                left join mod_logistica.dat_documento dd on dd.iddocumento = t.iddocdestino
                left join mod_logistica.dat_movimiento mm on mm.iddocumento = dd.iddocumento
                left join mod_logistica.dat_movregnumerico rr on rr.idmovimiento = mm.idmovimiento
                left join mod_logactivofijotangible.dat_movregnumericoactivo mmr on mmr.idmovregnumerico = rr.idmovregnumerico
                left join mod_logactivofijotangible.nom_estatustecnico net on net.idestatustecnico = mmr.idestatustecnico
                left join mod_logistica.dat_responsable ddr on ddr.idresponsable = mmr.idresponsable
                left join mod_persona.dat_persona ddper on ddper.idpersona = ddr.idpersona
                inner join mod_estructuracomp.nom_filaestruc fp on f.lft >= fp.lft and f.rgt <= fp.rgt and fp.idfila = $idestructuraop[0]    
                
                where d.estado = 3 and op.codigooperacion = 'Entrega'";
        if ($idespecialidad)
            $sql .= " and i.idespecialidad = $idespecialidad";
        $sql .= " order by d.cronologia";
        return $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function GetConteoRegNumericosEntidadSalidas($parametrosOll, $idestructuraop, $conproducto, $idindicador) {
        if (!$idestructuraop) {
            $global = ZendExt_GlobalConcept::getInstance();
            $idestructuraop[] = $global->Estructura->idestructura;
        }

        $conn = Zend_Registry::get('conexion');
        $select = " select distinct
                    rn.idregnumerico,
                    eu.descripcion as ubicacion,
                    movra.idarearesp,
                    movra.nroinventario,
                    movra.valoradquisicion,
                    movra.valorcontable,
                    movra.vidautil,
                    movra.tasafiscal,
                    movra.depreciacionacumulada,
                    movra.fechaadq,
                    movra.fechaexpini,
                    movra.fechaexpfin,
                    rna.esbaja,
                    rna.esmodulo,
                    rna.ordenizq,
                    rna.ordender,
                    movrat.nromatricula as matricula,
                    movrat.indicativo,
                    movrat.nrocirculacion as numcirculacion,
                    movrat.kmasignado as kmasignado,
                    movrat.nromotor1 as numeromotor1,
                    movrat.nromotor2 as numeromotor2,
                    movrat.kilometraje,
                    movrat.indiceconsumo,
                    movrat.ficav,
                    movrat.lot,
                    movrat.capacidad as pax,
                    tipcom.denominacion as tipocombustible,
                    et.denominacion as estado,
                    es.denominacion as entidad,
                    deop.denominacion as arearesponsabilidad,
                    cat.denominacion as categoria,
                    cat.idcategoria as idcategoria,
                    rn.nroserie,
                    1 as salidas,
                    resp.idresponsable";

        $from = "   from mod_logistica.dat_movregnumerico movr

					INNER JOIN mod_logistica.dat_movimiento mov on movr.idmovimiento = mov.idmovimiento
                    inner join mod_logistica.dat_documento doc on mov.iddocumento = doc.iddocumento
                    inner join mod_logistica.dat_registronumerico rn on movr.idregnumerico = rn.idregnumerico
                    inner join mod_logistica.dat_producto p on p.idproducto = rn.idproducto
                    inner  join mod_datosmaestros.nom_indicador i on p.idprod = i.idindicador
                    inner join mod_logactivofijotangible.dat_movregnumericoactivo movra on movr.idmovregnumerico = movra.idmovregnumerico
                    left join mod_logactivofijotangible.dat_movregnumericoactivotransp movrat on movr.idmovregnumerico = movrat.idmovregnumerico
                    inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rn.idregnumerico = rna.idregnumerico
                    left join mod_logactivofijotangible.nom_tipocombustible tipcom on movrat.idtipocombustible = tipcom.idtipocombustible
                    left join mod_logactivofijotangible.nom_estatustecnico et on movra.idestatustecnico = et.idestatustecnico
                    left join mod_logistica.nom_categoria cat on cat.idcategoria = movra.idcategoria
                    left join mod_logistica.dat_estructuraubicacion eu on movra.idubicacion = eu.idestructuraubicacion
                    inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = movra.idarearesp
                    inner join mod_estructuracomp.nom_filaestruc f on f.idfila = deop.idestructuraop
                    inner join mod_estructuracomp.dat_estructura es on f.idpadre = es.idestructura
                    inner join mod_estructuracomp.nom_filaestruc fp on f.lft >= fp.lft and f.rgt <= fp.rgt
       ";
        if (ComunAFTModel::integradoPersona()) {
            $select .= ", ((case when pers.nombre is not null then (pers.nombre || (case when pers.papel is not null then ' ' else '' end))  else ''  end) ||
                        (case when pers.papel is not null then (pers.papel || (case when pers.sapel is not null then ' ' else '' end)) else '' end) ||
                        (case when pers.sapel is not null then pers.sapel else '' end)) as responsable";

            $from .= " left join mod_logistica.dat_responsable resp on rna.idresponsable = resp.idresponsable
                       left join mod_persona.dat_persona pers on pers.idpersona = resp.idpersona";
        } else {
            
        }

        if (count($idestructuraop) == 1) {
            $arrayIdEst = " (
                    SELECT idfila FROM mod_estructuracomp.nom_filaestruc
                                                 WHERE lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc
                                                        WHERE idfila = $idestructuraop[0]) AND rgt <=
                                                            (SELECT rgt FROM mod_estructuracomp.nom_filaestruc
                                                                WHERE idfila = $idestructuraop[0])
                    )";
        } else {
            $arrayIdEst = "(" . implode(",", $idestructuraop) . ")";
        }

        $where = " WHERE movr.idregnumerico NOT IN ( Select r2.idregnumerico
                                            FROM mod_logistica.dat_registronumerico r2
                                            inner join mod_logactivofijotangible.dat_regnumericoactivo rna2 on rna2.idregnumerico = r2.idregnumerico

                                            WHERE rna2.idarearesp IN $arrayIdEst)
                  AND movra.idarearesp IN $arrayIdEst AND doc.estado = 3";

        if ($parametrosOll['codigo']) {
            $where .= " AND i.codigo iLike '{$parametrosOll['codigo']}%'";
        }
        if ($parametrosOll['idespecialidad1']) {
            $where .= " AND i.idespecialidad in (" . implode(',', $parametrosOll['idespecialidad1']) . ")";
            // $where .= " AND i.idespecialidad = {$parametrosOll['idespecialidad']}";
        }
        if ($parametrosOll['responsable']) {
            $responsable = $parametrosOll['responsable'];
            $where .= " AND resp.idresponsable =$responsable";
        }
        if ($parametrosOll['denominacion']) {

            $where .= " AND i.denominacion iLike '%{$parametrosOll['denominacion']}%'";
        }
        if ($parametrosOll['idmarca']) {
            $idmarca = $parametrosOll['idmarca'];
            $where .= "AND ih.idmarca = $idmarca ";
        }
        if ($parametrosOll['idmodelo']) {
            $idmodelo = $parametrosOll['idmodelo'];
            $where .= "AND ih.idmodelo = $idmodelo ";
        }
        if ($parametrosOll['idpais']) {
            $idpais = $parametrosOll['idpais'];
            $where .= "AND i.idpais = $idpais ";
        }
        if ($parametrosOll['nroRegistro']) {
            $nroRegistro = $parametrosOll['nroRegistro'];
            $where .= "AND rn.nroserie iLike '%{$nroRegistro}%' ";
        }
        if ($parametrosOll['nroInventario']) {
            $nroInventario = $parametrosOll['nroInventario'];
            $where .= "AND movra.nroinventario iLike '%{$nroInventario}%' ";
        }
        if ($parametrosOll['nromatricula']) {
            $nromatricula = $parametrosOll['nromatricula'];
            $where .= "AND movrat.nromatricula iLike '%{$nromatricula}%' ";
        }
        if ($parametrosOll['indicativo']) {
            $indicativo = $parametrosOll['indicativo'];
            $where .= "AND movrat.indicativo iLike '%{$indicativo}%' ";
        }
        if ($parametrosOll['fechaAdquisicion']) {
            $fechaAdquisicion = $parametrosOll['fechaAdquisicion'];
            $where .= "AND movra.fechaadq = '$fechaAdquisicion' ";
        }
        if ($parametrosOll['fechainicioExplotacion']) {
            $fechainicioExplotacion = $parametrosOll['fechainicioExplotacion'];
            $where .= "AND movra.fechaexpini = '$fechainicioExplotacion' ";
        }
        if ($parametrosOll['fechafinExplotacion']) {
            $fechafinExplotacion = $parametrosOll['fechafinExplotacion'];
            $where .= "AND movra.fechaexpfin = '$fechafinExplotacion' ";
        }
        if ($parametrosOll['ValorCDesde']) {
            $ValorCDesde = $parametrosOll['ValorCDesde'];
            $where .= "AND movra.valorcontable < $ValorCDesde ";
        }
        if ($parametrosOll['ValorCHasta']) {
            $ValorCHasta = $parametrosOll['ValorCHasta'];
            $where .= "AND movra.valorcontable > $ValorCHasta ";
        }
        if ($parametrosOll['depreciacionDesde']) {
            $depreciacionDesde = $parametrosOll['depreciacionDesde'];
            $where .= "AND movra.depreciacionacumulada < $depreciacionDesde ";
        }
        if ($parametrosOll['depreciacionHasta']) {
            $depreciacionHasta = $parametrosOll['depreciacionHasta'];
            $where .= "AND movra.depreciacionacumulada > $depreciacionHasta ";
        }
        if ($parametrosOll['tasaDesde']) {
            $tasaDesde = $parametrosOll['tasaDesde'];
            $where .= "AND movra.tasafiscal < $tasaDesde ";
        }
        if ($parametrosOll['tasaHasta']) {
            $tasaHasta = $parametrosOll['tasaHasta'];
            $where .= "AND movra.tasafiscal > $tasaHasta ";
        }
        if ($parametrosOll['idestatustecnico']) {
            $idestado = $parametrosOll['idestatustecnico'];
            $where .= "AND movra.idestatustecnico = $idestado ";
        }
        if ($parametrosOll['valorcontable']) {
            $where .= "AND movra.valorcontable = {$parametrosOll['valorcontable']}";
        }
        if ($parametrosOll['motoruno']) {
            $nromotor1 = $parametrosOll['motoruno'];
            $where .= "AND movrat.nromotor1 = '" . $nromotor1 . "'";
        }
        if ($parametrosOll['motordos']) {
            $nromotor2 = $parametrosOll['motordos'];
            $where .= "AND movrat.nromotor1 = '" . $nromotor2 . "'";
        }
        if ($parametrosOll['circulacion']) {
            $circulacion = $parametrosOll['circulacion'];
            $where .= "AND movrat.nrocirculacion = '" . $circulacion . "'";
        }
        if ($parametrosOll['depreciacion']) {
            $depreciacion = $parametrosOll['depreciacion'];
            $where .= "AND movra.depreciacionacumulada = $depreciacion";
        }
        if ($parametrosOll['kilometraje']) {
            $kilometraje = $parametrosOll['kilometraje'];
            $where .= "AND rnat.kilometraje = $kilometraje";
        }
        if ($parametrosOll['ubicacion']) {
            $ubicacion = $parametrosOll['ubicacion'];
            $where .= "AND eu.descripcion iLike '%{$ubicacion}%' ";
        }


        if ($conproducto) {
            $select .= ", i.codigo,
                        i.descripcion,
                        i.arridtablas,
                        i.arridtablasgenerales,
                        i.idespecialidad,
                        i.denominacion,
                        i.idindicador,
                        pais.nombrepais as siglasnacionalidad,
                        modelo.denominacion as modelo,
                        marca.denominacion as marca,
                        n.denominacion as naturaleza";

            $from .= " inner join mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
            left join mod_nomencladores.nom_pais pais on i.idpais = pais.idpais
            left join mod_datosmaestros.nom_marca marca on ih.idmarca = marca.idmarca
            left join mod_datosmaestros.nom_modelo modelo on ih.idmodelo = modelo.idmodelo
            inner join mod_datosmaestros.nom_naturaleza n on i.idnaturaleza = n.idnaturaleza
            ";
        }

        if ($parametrosOll['reporte'] == 1) {
            $where .= " AND i.idindicador = $idindicador
            ";
        }

        $sqlDatos = $select . $from . $where;


        $sqlCount = 'SELECT count (DISTINCT(movr.idregnumerico)) ' . $from . $where;

        if ($parametrosOll['limit']) {
            $sqlDatos .= " offset(" . $parametrosOll['start'] . ") limit(" . $parametrosOll['limit'] . ")";

            $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
            $total = $total[0]['count'];

            if ($total) {
                $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
            }
        } else {
            $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        }
        return array('datos' => (count($datos) > 0) ? $datos : array(), 'total' => $total);
    }

    public function GetGraficaDepreciacion($idregistronumerico) {
        $respDatos = array();
        $comunAFTModel = ComunAFTModel::getInstance();
        $operDepreciacion = $comunAFTModel->getDatosInterfazOperacion(false, false, 'Depreciacion');


        $operIniciales = array_merge(
                $comunAFTModel->getDatosInterfazOperacion(false, false, 'Apertura'), $comunAFTModel->getDatosInterfazOperacion(false, false, 'Alta')
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
                INNER JOIN mod_logistica.dat_movregnumerico mrn ON rna.idregnumerico = mrn.idregnumerico
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrn.idmovregnumerico = mrna.idmovregnumerico
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


            $respDatos = $conn->execute($select . $from . $where)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            throw new Exception('No existen operaciones de entradas configuradas en el sistema');
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
                INNER JOIN mod_logistica.dat_movregnumerico mrn ON rna.idregnumerico = mrn.idregnumerico
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrn.idmovregnumerico = mrna.idmovregnumerico
                INNER JOIN mod_logistica.dat_movimiento m ON mrn.idmovimiento = m.idmovimiento
                INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento
            ";

            $where = " WHERE
                m.cronologia > 0 AND
                mrn.idregnumerico = $idregistronumerico AND
                d.idoperacion IN ($operDepreciacion)
            ";

            $respDatos = array_merge($respDatos, $conn->execute($select . $from . $where)->fetchAll(PDO::FETCH_ASSOC));
        } else {
            throw new Exception('No existen operaciones de depreciación configuradas en el sistema');
        }

        $datos = array();
        $fechas = array();

        foreach ($respDatos as $value) {

            $idFecha = strtotime(self::SetDateFormatoIngles($value['fechacontable']));

            $datos[] = array($idFecha, $value['depreciacionacumulada']);
            $fechas[] = array($idFecha, $value['fechacontable']);
        }

        return array('datos' => array(array('data' => $datos)), 'fechas' => $fechas);
    }

    private function SetDateFormatoIngles($fecha) {
        $date = date_parse_from_format('d/m/Y', $fecha);

        return $date['year'] . '-' . $date['month'] . '-' . $date['day'];
    }

    public function cargarDatosListadoDocRegNum($parametros) {
        $objMovService = new MovimientoService();
        $movimientos = $objMovService->cargarMovimientosDocRegNum($parametros);
       
        for ($i = 0; $i < count($movimientos['datos']); $i++) {

            $estruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura(
                    $movimientos['datos'][$i]['idarearesp']
            );
            $movimientos['datos'][$i]['denomarearesp'] = $estruct[0]->denominacion;
            $padre = ZendExt_IoC::getInstance()->metadatos->DameEstructura(
                    $estruct[0]->idpadre
            );
            $movimientos['datos'][$i]['denomentidad'] = $padre[0]->denominacion;
        }
        return $movimientos;
    }

    public function getMarcas($parametros) {
        $where = '';
        if ($parametros['limit']) {
            $limit = " limit {$parametros['limit']}";
            $limit .= " offset {$parametros['start']}";
        }

        if ($parametros['query']) {
            $where = " and marca.denominacion iLike '%{$parametros['query']}%'";
        }

        $conn = Zend_Registry::get('conexion');
        $sql
                = "SELECT DISTINCT  marca.idmarca,
                                    marca.denominacion
                FROM mod_datosmaestros.nom_indicadorhoja ih
                INNER JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                where marca.estado = 1 ";

        $sqlCount
                = "SELECT count(DISTINCT marca.idmarca)
                FROM mod_datosmaestros.nom_indicadorhoja ih
                INNER JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                where marca.estado = 1 ";
        $sqlDatos = $sql . $where . $limit;
        $sqlCount = $sqlCount . $where;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $countdatos = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);

        return array('data' => $datos, 'total' => $countdatos[0]['count']);
    }

    public function getModelos($parametros) {
        $where = '';

        if ($parametros['limit']) {
            $limit = " limit {$parametros['limit']}";
            $limit .= " offset {$parametros['start']}";
        }
        if ($parametros['query']) {
            $where .= " and modelo.denominacion iLike '%{$parametros['query']}%'";
        }
        if ($parametros['idmarca']) {
            $idmarca = $parametros['idmarca'];
            $where .= " and ih.idmarca = $idmarca ";
        }

        $conn = Zend_Registry::get('conexion');
        $sql = "SELECT DISTINCT modelo.denominacion,
                                modelo.idmodelo
                FROM mod_datosmaestros.nom_modelo modelo
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON modelo.idmodelo = ih.idmodelo
                WHERE modelo.estado = 1 ";
        $sqlCount = "SELECT count(DISTINCT modelo.idmodelo) 
                FROM mod_datosmaestros.nom_modelo modelo
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON modelo.idmodelo = ih.idmodelo
                WHERE modelo.estado = 1 ";

        $sqlDatos = $sql . $where . $limit;
        $sqlCountDatos = $sqlCount . $where;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
        $datosCount = $conn->execute($sqlCountDatos)->fetchAll(PDO::FETCH_ASSOC);

        return array('data' => $datos, 'total' => $datosCount[0]['count']);
    }

    public function getDatosMovimiento($parametros) {
        $idmovregnumerico = $parametros['idmovregnumerico'];
        $conn = Zend_Registry::get('conexion');

        $select
                = " SELECT DISTINCT
                movrna.nroinventario,
                eu.descripcion as ubicacion,
                movrna.idarearesp,
                movrna.valoradquisicion,
                movrna.valorcontable,
                movrna.vidautil,
                movrna.tasafiscal,
                movrna.depreciacionacumulada,
                movrna.fechaadq,
                movrna.fechaexpini,
                movrna.fechaexpfin,
                movrnatran.nromatricula as matricula,
                movrnatran.indicativo,
                movrnatran.nrocirculacion as numcirculacion,
                movrnatran.kmasignado as kmasignado,
                movrnatran.nromotor1 as numeromotor1,
                movrnatran.nromotor2 as numeromotor2,
                movrnatran.kilometraje,
                movrnatran.indiceconsumo,
                movrnatran.ficav,
                movrnatran.lot,
                movrnatran.capacidad as pax,
                tipcom.denominacion as tipocombustible,

                et.denominacion as estado,
                cat.denominacion as categoria,
                rn.nroserie,
                rn.idregnumerico,
                
                i.codigo,
                i.descripcion, 
                i.arridtablas, 
                i.arridtablasgenerales, 
                i.idespecialidad,
                i.denominacion, 
                i.idindicador,
                pais.siglas as siglasnacionalidad,
                modelo.denominacion as modelo,
                marca.denominacion as marca,
                n.denominacion as naturaleza
        ";

        $from
                = "
                FROM mod_logistica.dat_movregnumerico movrn
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo movrna ON movrn.idmovregnumerico = movrna.idmovregnumerico
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivotransp movrnatran ON movrnatran.idmovregnumerico = movrna.idmovregnumerico
                INNER JOIN mod_logistica.dat_registronumerico rn ON movrn.idregnumerico = rn.idregnumerico
                INNER JOIN mod_logistica.dat_producto p ON  p.idproducto= rn.idproducto
                LEFT  JOIN mod_datosmaestros.nom_indicador i ON p.idprod = i.idindicador
                
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                LEFT  JOIN mod_nomencladores.nom_pais pais ON i.idpais = pais.idpais
                LEFT  JOIN mod_datosmaestros.nom_marca marca ON ih.idmarca = marca.idmarca
                LEFT  JOIN mod_datosmaestros.nom_modelo modelo ON ih.idmodelo = modelo.idmodelo
                INNER JOIN mod_datosmaestros.nom_naturaleza n ON i.idnaturaleza = n.idnaturaleza
                
                LEFT JOIN mod_logactivofijotangible.nom_tipocombustible tipcom ON movrnatran.idtipocombustible = tipcom.idtipocombustible
                LEFT  JOIN mod_logactivofijotangible.nom_estatustecnico et ON movrna.idestatustecnico = et.idestatustecnico
                LEFT  JOIN mod_logistica.nom_categoria cat ON movrna.idcategoria = cat.idcategoria
                LEFT  JOIN mod_logistica.dat_estructuraubicacion eu ON movrna.idubicacion = eu.idestructuraubicacion
        ";


        if (ComunAFTModel::integradoPersona()) {
            $select .= ",(
                (Case When pers.nombre is not null
                Then (pers.nombre || (Case When pers.papel is not null Then ' ' Else '' End))
                Else ''
                End) ||
                (Case When pers.papel is not null
                Then (pers.papel || (Case When pers.sapel is not null Then ' ' Else '' End))
                Else ''
                End) ||
                (Case When pers.sapel is not null Then pers.sapel Else '' End)
                ) as responsable"
            ;
            $from .= " LEFT JOIN mod_logistica.dat_responsable resp ON movrna.idresponsable = resp.idresponsable
                       LEFT JOIN mod_persona.dat_persona pers ON pers.idpersona = resp.idpersona 
                    ";
        } else {
            die('No esta terminado');
        }

        $where = " WHERE movrn.idmovregnumerico = $idmovregnumerico ";

        $sqlDatos = $select . $from . $where;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

        return array('datos' => (count($datos) > 0) ? $datos : array(), 'total' => 1);
    }

    public function getdatosEspecificosDoc($parametros) {
        $objDocService = new DocumentoService();
        $datos = $this->integrator->parametros->OperacionesPorId($parametros['idoperacion']);
        if ($datos->signo == '-' || $datos->signo == '+') {
            return $objDocService->getDatosDocumentoOrigen($parametros);
        } else if ($datos->signo == "N") {
            return $objDocService->getdatosEspecificosDoc($parametros);
        }
    }

    public function getResponsables() {
        $conn = Zend_Registry::get('conexion');
        $select = "SELECT DISTINCT(
                (Case When pers.nombre is not null
                Then (pers.nombre || (Case When pers.papel is not null Then ' ' Else '' End))
                Else ''
                End) ||
                (Case When pers.papel is not null
                Then (pers.papel || (Case When pers.sapel is not null Then ' ' Else '' End))
                Else ''
                End) ||
                (Case When pers.sapel is not null Then pers.sapel Else '' End)
                ) as responsable,pers.idpersona as idpersona,resp.idresponsable"
        ;
        $from = " FROM mod_logactivofijotangible.dat_regnumericoactivo rna                
                      LEFT JOIN  mod_logistica.dat_responsable resp ON rna.idresponsable = resp.idresponsable
                       LEFT JOIN mod_persona.dat_persona pers ON pers.idpersona = resp.idpersona 
                    ";
        $sqlDatos = $select . $from;

        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

        return array('datos' => ($datos ));
    }

    public function cargarComboEjercicios($identidad) {
        $ejercicio = $this->integrator->parametros->ObtenerEjercicios($identidad);
        return array('datos' => $ejercicio);
    }

    function cargarTiposMedios($parametros) {
        $datos = array();
        $integrator = ZendExt_IoC::getInstance();
        $naturalezas = $integrator->parametros->ObtenerNaturalezasAsociadasIndicador($parametros->start, $parametros->limit, ' i.almacenado = 1 OR i.explotacion = 1');

        $datos['cantidad'] = $naturalezas['total'];
        foreach ($naturalezas['data'] as $index => $natura) {
            $dat = self::BuscarTipoMedioDadoId($natura['idnaturaleza'], 'array');
            if (count($dat) == 0) {
                $datos['datos'][] = array(
                    'idnaturaleza' => $natura['idnaturaleza'],
                    'dennaturaleza' => $natura['denominacion'],
                );
            } else {
                $datos['datos'][] = $dat[0];
            }
        }

        return $datos;
    }

    public function BuscarTipoMedioDadoId($idtipomedio, $tipo_retorno = null) {
        $query = new Doctrine_Query();
        $query->from('CfgTipoMedio cfgtm')
                ->where('cfgtm.idtipomedio = ?', array($idtipomedio));

        if ($tipo_retorno == 'obj') {
            return $query->execute();
        } else {
            return $query->fetchArray();
        }
    }

    public function exportarResumenRegistroNum($params) {

        $global = ZendExt_GlobalConcept::getInstance();
        $integrator = ZendExt_IoC::getInstance();

        $idareas = $params['idarea'];
        $deno = "";

        foreach ($idareas as $k => $idA) {
            $ent = $integrator->metadatos->DameEstructura($idA);
            $deno .=$ent[0]->denominacion;
            if ($k + 1 < count($idareas)) {
                $deno .=", ";
            }
        }

        // Crear objeto excel
        $objPHPExcel = new PHPExcel();

        // Cambiando las propiedades del documento
        $objPHPExcel->getProperties()->setCreator("SISTEMA ACTIVOS FIJOS");
        $objPHPExcel->getProperties()->setLastModifiedBy("SISTEMA ACTIVOS FIJOS");
        $objPHPExcel->getProperties()->setTitle("REPORTE: MEDIOS");
        $objPHPExcel->getProperties()->setSubject("REPORTE: MEDIOS");
        $objPHPExcel->getProperties()->setDescription("Reporte de los medios.");
        $objPHPExcel->getProperties()->setKeywords("Disponibilidad, medios");
        $objPHPExcel->getProperties()->setCategory("REPORTE");

        // Configurando encabezado
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('DISPONIBLES');
        $datosR = self::GetConteoRegNumericosEntidad(false, false, $idareas, false, false, $conproducto = true, $params);

        $idsregNum = Array();

        foreach ($datosR['datos'] as $key => $value) {
            $idsregNum[] = $value['idregnumerico'];

            $f = $key + 7;

            $objPHPExcel->getActiveSheet()->setCellValue('A' . $f, $key + 1);
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $f, $value['codigo']);
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $f, $value['denominacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $f, $value['marca']);
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $f, $value['modelo']);
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $f, $value['nroinventario']);
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $f, $value['nroserie']);
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $f, $value['matricula']);
            $objPHPExcel->getActiveSheet()->setCellValue('I' . $f, $value['indicativo']);
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $f, $value['entidad']);
            $objPHPExcel->getActiveSheet()->setCellValue('K' . $f, $value['arearesponsabilidad']);
            $objPHPExcel->getActiveSheet()->setCellValue('L' . $f, $value['ubicacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('M' . $f, $value['valorcontable']);
            $objPHPExcel->getActiveSheet()->setCellValue('N' . $f, $value['vidautil']);
            $objPHPExcel->getActiveSheet()->setCellValue('O' . $f, $value['tasafiscal']);
            $objPHPExcel->getActiveSheet()->setCellValue('P' . $f, $value['depreciacionacumulada']);
            $objPHPExcel->getActiveSheet()->setCellValue('Q' . $f, $value['fechaadq']);
            $objPHPExcel->getActiveSheet()->setCellValue('R' . $f, $value['fechaexpini']);
            $objPHPExcel->getActiveSheet()->setCellValue('S' . $f, $value['fechaexpfin']);
            $objPHPExcel->getActiveSheet()->setCellValue('T' . $f, $value['estado']);
            $objPHPExcel->getActiveSheet()->setCellValue('U' . $f, $value['tipocombustible']);
            $objPHPExcel->getActiveSheet()->setCellValue('V' . $f, $value['numcirculacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('W' . $f, $value['numeromotor1']);
            $objPHPExcel->getActiveSheet()->setCellValue('X' . $f, $value['numeromotor2']);
            $objPHPExcel->getActiveSheet()->setCellValue('Y' . $f, $value['kilometraje']);
            $objPHPExcel->getActiveSheet()->setCellValue('Z' . $f, $value['indiceconsumo']);
            $objPHPExcel->getActiveSheet()->setCellValue('AA' . $f, $value['ficav']);
            $objPHPExcel->getActiveSheet()->setCellValue('AB' . $f, $value['lot']);
            $objPHPExcel->getActiveSheet()->setCellValue('AC' . $f, $value['pax']);
            $objPHPExcel->getActiveSheet()->setCellValue('AD' . $f, $value['categoria']);
            $objPHPExcel->getActiveSheet()->setCellValue('AE' . $f, $value['responsable']);
            $objPHPExcel->getActiveSheet()->setCellValue('AF' . $f, $value['naturaleza']);
        }


        $objPHPExcel = self::crearHojaRegistros($objPHPExcel, $f, $deno);

        /*         * ************************************************************************************** */

        $objPHPExcel = self::crearHojaSalidas($objPHPExcel, $idareas, $deno, $params);
        /*         * ***************************************************************************************************************** */

        $objPHPExcel = self::crearHojaMovimientos($objPHPExcel, $idsregNum, $idareas, $deno, $params);

        /*         * ***************************************************************************************************************** */

        $objPHPExcel = self::crearHojaMedios($objPHPExcel, $idareas, $deno, $params);

        // Save Excel 95 file
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

        error_reporting(E_ALL);
        ini_set('display_errors', true);
        ini_set('display_startup_errors', true);

        define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

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

    public function crearHojaRegistros($objPHPExcel, $f, $ent) {
        $boders = new PHPExcel_Style();
        $boders->applyFromArray(
                array('borders' => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
                    'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
        );

        $objPHPExcel->getActiveSheet()->setSharedStyle($boders, "A6:AF{$f}");

        $objPHPExcel->getActiveSheet()->setCellValue('D1', 'Medios disponibles');
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Entidad(es)/Área(s)');
        $objPHPExcel->getActiveSheet()->setCellValue('C3', $ent);

        $objPHPExcel->getActiveSheet()->setCellValue('A6', 'No.');
        $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Tipo de medio');
        $objPHPExcel->getActiveSheet()->setCellValue('C6', 'Denominación');
        $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Marca');
        $objPHPExcel->getActiveSheet()->setCellValue('E6', 'Modelo');
        $objPHPExcel->getActiveSheet()->setCellValue('F6', 'No. inventario');
        $objPHPExcel->getActiveSheet()->setCellValue('G6', 'No. registro/serie');
        $objPHPExcel->getActiveSheet()->setCellValue('H6', 'Matrícula');
        $objPHPExcel->getActiveSheet()->setCellValue('I6', 'Indicativo');
        $objPHPExcel->getActiveSheet()->setCellValue('J6', 'Entidad');
        $objPHPExcel->getActiveSheet()->setCellValue('K6', 'Área');
        $objPHPExcel->getActiveSheet()->setCellValue('L6', 'Ubicación');
        $objPHPExcel->getActiveSheet()->setCellValue('M6', 'Valor contable');
        $objPHPExcel->getActiveSheet()->setCellValue('N6', 'Vida útil');
        $objPHPExcel->getActiveSheet()->setCellValue('O6', 'Tasa/Factor de Dep.(Anual)');
        $objPHPExcel->getActiveSheet()->setCellValue('P6', 'Dep. Acumulada');
        $objPHPExcel->getActiveSheet()->setCellValue('Q6', 'Fecha de adquisición');
        $objPHPExcel->getActiveSheet()->setCellValue('R6', 'Fecha Exp. inicio');
        $objPHPExcel->getActiveSheet()->setCellValue('S6', 'Fecha Exp. fin');
        $objPHPExcel->getActiveSheet()->setCellValue('T6', 'Estatus técnico');
        $objPHPExcel->getActiveSheet()->setCellValue('U6', 'Tipo de combustible');
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

        $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('J6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('K6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('L6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('M6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('N6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('O6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('P6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('Q6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('R6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('S6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('T6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('U6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('V6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('W6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('X6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('Y6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('Z6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AA6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AB6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AC6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AD6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AE6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AF6')->getFont()->setBold(true);


        return $objPHPExcel;
    }

    public function crearHojaSalidas($objPHPExcel, $idarea, $ent, $params) {
        /*         * ****************************************** Salidas     ********************************* */

        $datosS = self::GetConteoRegNumericosEntidadSalidas($params, $idarea, true, false);

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
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $fS, $valueS['codigo']);
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $fS, $valueS['denominacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $fS, $valueS['marca']);
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $fS, $valueS['modelo']);
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $fS, $valueS['nroinventario']);
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $fS, $valueS['nroserie']);
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $fS, $valueS['matricula']);
            $objPHPExcel->getActiveSheet()->setCellValue('I' . $fS, $valueS['indicativo']);
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $fS, $valueS['entidad']);
            $objPHPExcel->getActiveSheet()->setCellValue('K' . $fS, $valueS['arearesponsabilidad']);
            $objPHPExcel->getActiveSheet()->setCellValue('L' . $fS, $valueS['ubicacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('M' . $fS, $valueS['valorcontable']);
            $objPHPExcel->getActiveSheet()->setCellValue('N' . $fS, $valueS['vidautil']);
            $objPHPExcel->getActiveSheet()->setCellValue('O' . $fS, $valueS['tasafiscal']);
            $objPHPExcel->getActiveSheet()->setCellValue('P' . $fS, $valueS['depreciacionacumulada']);
            $objPHPExcel->getActiveSheet()->setCellValue('Q' . $fS, $valueS['fechaadq']);
            $objPHPExcel->getActiveSheet()->setCellValue('R' . $fS, $valueS['fechaexpini']);
            $objPHPExcel->getActiveSheet()->setCellValue('S' . $fS, $valueS['fechaexpfin']);
            $objPHPExcel->getActiveSheet()->setCellValue('T' . $fS, $valueS['estado']);
            $objPHPExcel->getActiveSheet()->setCellValue('U' . $fS, $valueS['tipocombustible']);
            $objPHPExcel->getActiveSheet()->setCellValue('V' . $fS, $valueS['numcirculacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('W' . $fS, $valueS['numeromotor1']);
            $objPHPExcel->getActiveSheet()->setCellValue('X' . $fS, $valueS['numeromotor2']);
            $objPHPExcel->getActiveSheet()->setCellValue('Y' . $fS, $valueS['kilometraje']);
            $objPHPExcel->getActiveSheet()->setCellValue('Z' . $fS, $valueS['indiceconsumo']);
            $objPHPExcel->getActiveSheet()->setCellValue('AA' . $fS, $valueS['ficav']);
            $objPHPExcel->getActiveSheet()->setCellValue('AB' . $fS, $valueS['lot']);
            $objPHPExcel->getActiveSheet()->setCellValue('AC' . $fS, $valueS['pax']);
            $objPHPExcel->getActiveSheet()->setCellValue('AD' . $fS, $valueS['categoria']);
            $objPHPExcel->getActiveSheet()->setCellValue('AE' . $fS, $valueS['responsable']);
            $objPHPExcel->getActiveSheet()->setCellValue('AF' . $fS, $valueS['naturaleza']);
        }

        $bodersS = new PHPExcel_Style();
        $bodersS->applyFromArray(
                array('borders' => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
                    'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
        );

        $objPHPExcel->getActiveSheet()->setSharedStyle($bodersS, "A6:AF{$fS}");

        $objPHPExcel->getActiveSheet()->setCellValue('D1', 'Medios que ya no estan en la entidad');
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Entidad(es)/Área(s)');
        $objPHPExcel->getActiveSheet()->setCellValue('C3', $ent);

        $objPHPExcel->getActiveSheet()->setCellValue('A6', 'No.');
        $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Tipo de medio');
        $objPHPExcel->getActiveSheet()->setCellValue('C6', 'Marca');
        $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Modelo');
        $objPHPExcel->getActiveSheet()->setCellValue('E6', 'Matrícula');
        $objPHPExcel->getActiveSheet()->setCellValue('F6', 'No. inventario');
        $objPHPExcel->getActiveSheet()->setCellValue('G6', 'No. registro/serie');
        $objPHPExcel->getActiveSheet()->setCellValue('H6', 'Matrícula');
        $objPHPExcel->getActiveSheet()->setCellValue('I6', 'Indicativo');
        $objPHPExcel->getActiveSheet()->setCellValue('J6', 'Entidad');
        $objPHPExcel->getActiveSheet()->setCellValue('K6', 'Área');
        $objPHPExcel->getActiveSheet()->setCellValue('L6', 'Ubicación');
        $objPHPExcel->getActiveSheet()->setCellValue('M6', 'Valor contable');
        $objPHPExcel->getActiveSheet()->setCellValue('N6', 'Vida útil');
        $objPHPExcel->getActiveSheet()->setCellValue('O6', 'Tasa/Factor de Dep.(Anual)');
        $objPHPExcel->getActiveSheet()->setCellValue('P6', 'Dep. Acumulada');
        $objPHPExcel->getActiveSheet()->setCellValue('Q6', 'Fecha de adquisición');
        $objPHPExcel->getActiveSheet()->setCellValue('R6', 'Fecha Exp. inicio');
        $objPHPExcel->getActiveSheet()->setCellValue('S6', 'Fecha Exp. fin');
        $objPHPExcel->getActiveSheet()->setCellValue('T6', 'Estatus técnico');
        $objPHPExcel->getActiveSheet()->setCellValue('U6', 'Tipo de combustible');
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


        $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('J6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('K6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('L6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('M6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('N6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('O6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('P6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('Q6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('R6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('S6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('T6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('U6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('V6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('W6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('X6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('Y6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('Z6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AA6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AB6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AC6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AD6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AE6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('AF6')->getFont()->setBold(true);

        return $objPHPExcel;
    }

    public function crearHojaMovimientos($objPHPExcel, $idsregNum, $idarea, $ent, $params) {
        /*         * ******************************************* Movimientos ***************************************************** */

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
            foreach ($datosM as $keyM => $valueM) {
                $objPHPExcel->getActiveSheet()->setCellValue('A' . $cant, ++$no);
                $objPHPExcel->getActiveSheet()->setCellValue('B' . $cant, $valueM['denominacion']);
                $objPHPExcel->getActiveSheet()->setCellValue('C' . $cant, $valueM['marca']);
                $objPHPExcel->getActiveSheet()->setCellValue('D' . $cant, $valueM['modelo']);
                $objPHPExcel->getActiveSheet()->setCellValue('E' . $cant, $valueM['nroserie']);
                $objPHPExcel->getActiveSheet()->setCellValue('F' . $cant, $valueM['fechacontable']);
                $objPHPExcel->getActiveSheet()->setCellValue('G' . $cant, $valueM['denominacionop']);
                $objPHPExcel->getActiveSheet()->setCellValue('H' . $cant, $valueM['entidad']);
                $objPHPExcel->getActiveSheet()->setCellValue('I' . $cant, $valueM['arearesponsabilidad']);
                $objPHPExcel->getActiveSheet()->setCellValue('J' . $cant, $valueM['nrodoc']);
                $objPHPExcel->getActiveSheet()->setCellValue('K' . $cant, $valueM['observaciones']);
                $cant++;
            }

            $cant++;
        }

        $bodersM = new PHPExcel_Style();
        $bodersM->applyFromArray(
                array('borders' => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
                    'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER)
        );

        $objPHPExcel->getActiveSheet()->setSharedStyle($bodersM, "A6:H{$cant}");

        $objPHPExcel->getActiveSheet()->setCellValue('A6', 'No.');
        $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Denominación');
        $objPHPExcel->getActiveSheet()->setCellValue('C6', 'Marca');
        $objPHPExcel->getActiveSheet()->setCellValue('D6', 'Modelo');
        $objPHPExcel->getActiveSheet()->setCellValue('E6', 'No. registro/serie');
        $objPHPExcel->getActiveSheet()->setCellValue('F6', 'Fecha');
        $objPHPExcel->getActiveSheet()->setCellValue('G6', 'Clave del documento');
        $objPHPExcel->getActiveSheet()->setCellValue('H6', 'Entidad');
        $objPHPExcel->getActiveSheet()->setCellValue('I6', 'Área de responsabilidad');
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




        $objPHPExcel->getActiveSheet()->setCellValue('D1', 'Movimientos por medios');
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Entidad(es)/Área(s)');
        $objPHPExcel->getActiveSheet()->setCellValue('C3', $ent);

        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow('C', '3', 'D', '3');


        $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('J6')->getFont()->setBold(true);



        return $objPHPExcel;
    }

    public function crearHojaMedios($objPHPExcel, $idarea, $ent, $params) {
        /*         * ******************************************* Movimientos ***************************************************** */
        $objPHPExcel->createSheet();

        $numHoja = $objPHPExcel->getSheetCount();
        $objPHPExcel->setActiveSheetIndex($numHoja - 1);
        $objPHPExcel->getActiveSheet()->setTitle('MEDIOS');
        $datosM = self::GetConteoEntidad(false, false, $idarea, $params);

        foreach ($datosM['datos'] as $keyM => $valueM) {


            $fM = $keyM + 7;

            $objPHPExcel->getActiveSheet()->setCellValue('A' . $fM, $keyM + 1);
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $fM, $valueM['codigo']);
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $fM, $valueM['denominacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $fM, $valueM['marca']);
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $fM, $valueM['modelo']);
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $fM, $valueM['siglasnacionalidad']);
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $fM, $valueM['cantidad']);
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $fM, $valueM['disponibilidad']);
            $objPHPExcel->getActiveSheet()->setCellValue('I' . $fM, $valueM['naturaleza']);
        }

        $bodersM = new PHPExcel_Style();
        $bodersM->applyFromArray(
                array('borders' => array('bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'right' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'top' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                        'left' => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
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



        $objPHPExcel->getActiveSheet()->setCellValue('D1', 'Cantidad de  medios');
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Entidad(es)/Área(s)');
        $objPHPExcel->getActiveSheet()->setCellValue('C3', $ent);

        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow('C', '3', 'D', '3');


        $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('B3')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('A6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('B6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('C6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('D6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('E6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('F6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('G6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('H6')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('I6')->getFont()->setBold(true);

        $objPHPExcel->setActiveSheetIndex(0);


        return $objPHPExcel;
    }

    public function getDatosMovRegNum($idregnum, $idarearesp, $params) {
        $conn = Zend_Registry::get('conexion');
        $selectDatos = "select distinct
                d.iddocumento,
                d.observaciones,
                d.idoperacion,
                d.nrodoc,
                mrna.idmovregnumerico,
                d.idoperacion,
                mrna.idarearesp,
                d.fechacontable,
                n.denominacion as denominacionop,
                mrna.nroinventario,
                reg.nroserie,
                eu.descripcion as ubicacion,
                mrna.valoradquisicion,
                mrna.valorcontable,
                mrna.vidautil,
                mrna.tasafiscal,
                mrna.depreciacionacumulada,
                mrna.fechaadq,
                mrna.fechaexpini,
                mrna.fechaexpfin,
                movrnatran.nromatricula as matricula,
                movrnatran.indicativo,
                movrnatran.nrocirculacion as numcirculacion,
                movrnatran.nromotor1 as numeromotor1,
                movrnatran.nromotor2 as numeromotor2,
                movrnatran.kilometraje,
                movrnatran.indiceconsumo,
                movrnatran.ficav,
                movrnatran.lot,
                tipcom.denominacion as tipocombustible,
                movrnatran.capacidad as pax,
                et.denominacion as estado,
                es.denominacion as entidad,
                deop.denominacion as arearesponsabilidad,
                cat.denominacion as categoria,
                i.codigo,
                i.descripcion,
                i.idespecialidad,
                i.denominacion,
                pais.siglas as siglasnacionalidad,
                modelo.denominacion as modelo,
                marca.denominacion as marca,
                nat.denominacion as naturaleza ";

        if (count($idarearesp) == 1) {
            $arrayEstructuras = "(
             SELECT idfila FROM mod_estructuracomp.nom_filaestruc
        WHERE
        lft >= (SELECT lft FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN (" . implode(',', $idarearesp) . ")) AND
                rgt <= (SELECT rgt FROM mod_estructuracomp.nom_filaestruc WHERE idfila IN (" . implode(',', $idarearesp) . ")))";
        } else {
            $arrayEstructuras = " (" . implode(',', $idarearesp) . ")";
        }

        $sql = "from  mod_logistica.dat_documento d
                inner join  mod_logistica.dat_movimiento m on d.iddocumento = m.iddocumento
                inner join  mod_logistica.dat_movregnumerico r on r.idmovimiento = m.idmovimiento
                inner join  mod_logistica.dat_registronumerico reg on r.idregnumerico = reg.idregnumerico
                INNER JOIN mod_logistica.dat_producto prod ON  prod.idproducto= reg.idproducto
                INNER  JOIN mod_datosmaestros.nom_indicador i ON prod.idprod = i.idindicador
                inner join  mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = r.idmovregnumerico
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivotransp movrnatran ON movrnatran.idmovregnumerico = mrna.idmovregnumerico
                inner join  mod_datosmaestros.dat_operacion p on p.idoperacion = d.idoperacion
                inner join  mod_datosmaestros.nom_operaciones n on n.idnomoperaciones = p.idnomoperaciones
                LEFT  JOIN mod_logistica.dat_estructuraubicacion eu ON mrna.idubicacion = eu.idestructuraubicacion
                LEFT JOIN mod_logactivofijotangible.nom_tipocombustible tipcom ON movrnatran.idtipocombustible = tipcom.idtipocombustible
                LEFT  JOIN mod_logactivofijotangible.nom_estatustecnico et ON mrna.idestatustecnico = et.idestatustecnico
                LEFT  JOIN mod_logistica.nom_categoria cat ON mrna.idcategoria = cat.idcategoria
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON i.idindicador = ih.idindicador
                LEFT  JOIN mod_nomencladores.nom_pais pais ON i.idpais = pais.idpais
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
            $sql.="AND i.idespecialidad = " . $params['idespecialidad'];
        }
        $sqlDatos = $selectDatos . $sql . $orderBY;
        $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);

        return $datos;
    }

    public function ObtenerEspecialidadPorId($idespe) {
        $conn = Zend_Registry::get('conexion');
        $selectDatos = "select esp.denespecialidad,esp.idespecialidad
                          from mod_nomencladores.nom_especialidad esp
                          INNER JOIN mod_logactivofijotangible.conf_espagrupareporte grr on esp.idespecialidad = grr.idespecialidad
                          where grr.denominacioncolumnareporte <> 'sistemaEmp' and  esp.idespecialidad in (" . implode(',', $idespe) . ")";
        return $conn->execute($selectDatos)->fetchAll(PDO::FETCH_ASSOC);
    }



}