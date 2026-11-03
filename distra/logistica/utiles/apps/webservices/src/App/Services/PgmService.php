<?php

namespace App\Services;

class PgmService extends BaseService
{
    /**
     * @param null $idEspecialidad
     * @param null $criterio
     * @param int $offset
     * @param int $limit
     * @return string
     */
    public function devolverSurtidos($idEspecialidad = null, $criterio = null, $offset = 0, $limit = 30)
    {
        $_sqlQuery = "SELECT i.codigo || ' - ' || i.denominacion as denom, upper(um.abreviaturaunidadmedida) as um,
                        nn.denominacion as naturaleza,i.idindicador as id
                        FROM mod_datosmaestros.nom_indicador i
                        INNER JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
                        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
                        inner join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = i.idnaturaleza";
        $arrayWhere[] = "i.tipo = 1";
        if ($idEspecialidad) {
            $arrayWhere[] = "i.idespecialidad = " . $idEspecialidad;
        }
        if ($criterio) {
            $arrayWhere[] = "(i.codigo ilike '{$criterio}%' OR upper(i.denominacion) ilike upper('{$criterio}%'))";
        }
        $_sqlQuery .= " WHERE " . implode(' AND ', $arrayWhere);
        $count = $this->db->executeQuery($_sqlQuery)->rowCount();
        $_sqlQuery .= " OFFSET " . $offset . " LIMIT " . $limit;
        return array(
            'cantidad' => $count,
            'datos' => $this->db->fetchAssoc($_sqlQuery)
        );
    }

    /**
     * @param null $idEspecialidad
     * @param null $criterio
     * @param null $idAlmacen
     * @param null $idNomenclador
     * @param int $offset
     * @param int $limit
     * @return string
     */
    public function devolverMediosAlmacenados($idEspecialidad = null, $criterio = null, $idAlmacen = null, $idNomenclador = null, $offset = 0, $limit = 30)
    {
        $_sqlQuery = "SELECT ni.codigo ||' - '||ni.denominacion as denom,ni.denominacion,
                upper(um.abreviaturaunidadmedida) as um,ni.idindicador,ce.idproducto as id,
                dcat.denominacion as categoria,ce.cantidad as existencia,ce.disponible,
                COALESCE(de.denominacion,'') ||'-'|| deop.denominacion as almacen
                FROM mod_loganalisis.cub_existencia ce
                INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = ce.idindicador
                INNER JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = ni.idumedida
                INNER JOIN mod_estructuracomp.dat_estructura de on de.idestructura = ce.identidad
                INNER JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = ce.idestructura
                INNER JOIN mod_loganalisis.dim_categoria dcat on dcat.idcategoria = ce.idcategoria";
        $arrayWhere[] = "deop.idconcepto = 8";
        if ($idEspecialidad) {
            $arrayWhere[] = "ni.idespecialidad = " . $idEspecialidad;
        }
        if ($criterio) {
            $arrayWhere[] = "(ni.codigo ilike '{$criterio}%' OR upper(ni.denominacion) ilike upper('{$criterio}%'))";
        }
        if ($idAlmacen) {
            $idAlmacenSearch = is_array($idAlmacen) ? implode(',', $idAlmacen) : $idAlmacen;
            $arrayWhere[] = "de.idestructura in (" . $idAlmacenSearch . ")";
        }
        if ($idNomenclador) {
            $idNomenclador = is_array($idNomenclador) ? implode(',', $idNomenclador) : $idNomenclador;
            $arrayWhere[] = "ni.idindicador in (" . $idNomenclador . ")";
        }
        $_sqlQuery .= " WHERE " . implode(' AND ', $arrayWhere);
        $count = $this->db->executeQuery($_sqlQuery)->rowCount();
        $_sqlQuery .= " ORDER BY de.idestructura, deop.idestructuraop, ni.idindicador OFFSET "
            . $offset . " LIMIT " . $limit;
        return array(
            'cantidad' => $count,
            'sql' => func_get_args(),
            'datos' => $this->db->fetchAssoc($_sqlQuery)
        );
    }

    /**
     * @param $idEspecialidad
     * @param $criterio
     * @param null $idEntidad
     * @param null $idNomenclador
     * @param null $offset
     * @param null $limit
     * @return string
     */
    public function devolverActivos($idEspecialidad, $criterio, $idEntidad = null, $idNomenclador = null, $offset = null, $limit = null)
    {
        $_sqlQuery = "SELECT ni.codigo ||' - '||ni.denominacion as tipomedio,ni.denominacion,ns.nroserie,
                        ns.denominacioncolorprim as color, ns.denominacionestatustecnico as estado,ns.idproductonumericoactivo as id
                        ,ni.idindicador,ce.idproducto,eop.idestructuraop as arearesp
                        FROM mod_loganalisis.cub_existencia ce
                        INNER JOIN mod_loganalisis.cub_productonumericoactivo ns on ns.idproducto = ce.idproducto
                        INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = ce.idindicador
                        INNER JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = ce.idestructura
                        INNER JOIN mod_estructuracomp.dat_estructura e on e.idestructura = ce.identidad";
        $arrayWhere[] = "eop.idconcepto = 5";
        if ($idEspecialidad) {
            $arrayWhere[] = "ni.idespecialidad = " . $idEspecialidad;
        }
        if ($criterio) {
            $arrayWhere[] = "(ni.codigo ilike '{$criterio}%' OR upper(ni.denominacion) ilike upper('{$criterio}%'))";
        }
        if ($idEntidad) {
            $idEntidadSearch = is_array($idEntidad) ? implode(',', $idEntidad) : $idEntidad;
            $arrayWhere[] = "e.idestructura in (" . $idEntidadSearch . ")";
        }
        if ($idNomenclador) {
            $idNomenclador = is_array($idNomenclador) ? implode(',', $idNomenclador) : $idNomenclador;
            $arrayWhere[] = "ni.idindicador in (" . $idNomenclador . ")";
        }
        $_sqlQuery .= " WHERE " . implode(' AND ', $arrayWhere);
        $count = $this->db->executeQuery($_sqlQuery)->rowCount();

        $_sqlQuery .= " ORDER BY e.idestructura, eop.idestructuraop, ni.idindicador, ns.nroserie OFFSET "
            . $offset . " LIMIT " . $limit;
      //  print_r($_sqlQuery);die;
        return array(
            'cantidad' => $count,
            'datos' => $this->db->fetchAssoc($_sqlQuery),
        );
    }

    public function devolverEntidadesActivos($idEspecialidad, $criterio, $idEntidad = null, $idNomenclador = null, $offset = null, $limit = null)
    {
        $_sqlQuery = "SELECT e.denominacion ||' - '||eop.denominacion as arearesp,eop.idestructuraop
                        FROM mod_loganalisis.cub_existencia ce
                        INNER JOIN mod_loganalisis.cub_productonumericoactivo ns on ns.idproducto = ce.idproducto
                        INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = ce.idindicador
                        INNER JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = ce.idestructura
                        INNER JOIN mod_estructuracomp.dat_estructura e on e.idestructura = ce.identidad";
        $arrayWhere[] = "eop.idconcepto = 5";
        if ($idEspecialidad) {
            $arrayWhere[] = "ni.idespecialidad = " . $idEspecialidad;
        }
        if ($criterio) {
            $arrayWhere[] = "(ni.codigo ilike '{$criterio}%' OR upper(ni.denominacion) ilike upper('{$criterio}%'))";
        }
        if ($idEntidad) {
            $idEntidadSearch = is_array($idEntidad) ? implode(',', $idEntidad) : $idEntidad;
            $arrayWhere[] = "e.idestructura in (" . $idEntidadSearch . ")";
        }
        if ($idNomenclador) {
            $idNomenclador = is_array($idNomenclador) ? implode(',', $idNomenclador) : $idNomenclador;
            $arrayWhere[] = "ni.idindicador in (" . $idNomenclador . ")";
        }
        $_sqlQuery .= " WHERE " . implode(' AND ', $arrayWhere);
        $_sqlQuery .= " ORDER BY e.idestructura, eop.idestructuraop, ni.idindicador, ns.nroserie OFFSET "
            . $offset . " LIMIT " . $limit;
        $datosProductos = $this->db->fetchAssoc($_sqlQuery);
        $cacheEntidades = array();
        foreach ($datosProductos as &$prod) {
            if (!array_key_exists($prod['idestructuraop'], $cacheEntidades)) {
                $cacheEntidades[$prod['idestructuraop']] = $prod['arearesp'];
            }
            $prod['arearesp'] = $prod['idestructuraop'];
        }
        return array(
            'datos' => $cacheEntidades
        );
    }

    /**
     * @param $idIndicador
     * @return string
     */
    public function obtenerDatosMedioPorId($idIndicador)
    {
        $idIndicador = is_array($idIndicador) ? implode(',', $idIndicador) : $idIndicador;
        $sqlMedios = "select i.idindicador, i.codigo, i.denominacion, upper(um.abreviaturaunidadmedida) as um," .
            "nn.denominacion as tipo from mod_datosmaestros.nom_indicador i " .
            "inner join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida " .
            "inner join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = i.idnaturaleza " .
            "WHERE i.idindicador in(" . $idIndicador . ")";
        return $this->db->fetchAssoc($sqlMedios)->fetchAll(PDO::FETCH_OBJ);
    }
    /**
     * @param $nomenclador
     * @param $extraParams
     *
     * @return string
     * Obtener las naturalezas del sistema
     */
    public function obtenerNomencladorCategorias($nomenclador, $extraParams)
    {
        $_sqlQuery
            = "SELECT nat.idnaturaleza as id, nat.denominacion as text

                    FROM mod_datosmaestros.nom_naturaleza nat
                    ";
        $arrayWhere[] = "WHERE nat.estado = 1";
        $_sqlQuery .= implode(' AND ', $arrayWhere);
        return $this->db->fetchAssoc($_sqlQuery);

    }


    /**
     * @param $naturaleza
     * @param $extraParams
     *
     * @return string
     * Obtener los datos de los RN dado una naturaleza
     */
    public function obtenerNomencladorArbol($nomenclador, $naturaleza, $extraParams)
    {
        $_sqlQuery = "SELECT * FROM \"mod_logactivofijotangible\".\"f_listaridentificador\"({$naturaleza})";
        $respuesta = $this->db->fetchAssoc($_sqlQuery);
        $datos = array();
        $filtrar = array();

        $parents = array();
        foreach ($respuesta as $k => $resp) {
            if (!$filtrar[$resp['idregnumerico']]) {
                $datos[$k]['idregnumerico'] = $resp['idregnumerico'];
                $datos[$k]['id'] = $resp['idregnumerico'];
                $datos[$k]['text'] = ($resp['identificador']) ? $resp['identificador'] : $resp['text'];
                $datos[$k]['leaf'] = true;
                $datos[$k]['identificador'] = $resp['identificador'];
                $filtrar[$resp['idregnumerico']] = $resp['idregnumerico'];

                $agrup = $resp['text'];


                if (!isset($parents[$agrup])) {
                    $parents[$agrup] = array(
                        'text' => $agrup,
                        'children' => array()
                    );
                }

                $parents[$agrup]['children'][] = $datos[$k];
            }
        }

        return array_values($parents);
    }

    /**
     * @param $nomenclador
     * @param $naturaleza
     * @param $activo
     * @param $extraParams
     *
     * @return string
     * @throws Zend_Exception
     */
    public function obtenerNomencladorDetalles($nomenclador, $naturaleza, $activo, $extraParams)
    {
        $_sqlQuery = "SELECT * FROM \"mod_logactivofijotangible\".\"f_devuelveRnAtribDin\"({$activo})";
        $respuesta = $this->db->fetchAssoc($_sqlQuery);

        $resp = end($respuesta);
        $resp['html'] = $resp['text'];
        $resp['text'] = $resp['denominacion'];
        return $resp;
    }

}
