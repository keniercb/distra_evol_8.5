<?php

class ServiceProvider
{

    private $_sqlConnection;

    public function __construct()
    {
        $this->_sqlConnection = Doctrine_Manager::connection();
    }

    public function getMessage($stdClass)
    {
        if (method_exists($this, $stdClass->method)) {
            try {
                $response = call_user_func_array(array($this, $stdClass->method), $stdClass->params);
                return $this->jsonResponse($response);
            } catch (Exception $e) {
                return $this->jsonResponse('Ha ocurrido un error procesando la respuesta.');
            }
        }
        return $this->jsonResponse('El m&eacute;todo solicitado no existe.');
    }

    private function jsonResponse($data)
    {
        return json_encode($data);
    }

    /**
     * @param null $idEspecialidad
     * @param null $criterio
     * @param int $offset
     * @param int $limit
     * @return string
     */
    public function devolverSurtidos($idEspecialidad = null, $criterio = null, $offset = 0, $limit = 30)
    {
        $this->setDefaultValue($offset, 0);
        $this->setDefaultValue($limit, 30);
        $_sqlQuery = "SELECT i.codigo || ' - ' || i.denominacion as denom, upper(um.abreviaturaunidadmedida) as um,
                        nn.denominacion as naturaleza,i.idindicador as id
                        FROM mod_datosmaestros.nom_indicador i
                        INNER JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
                        INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
                        inner join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = i.idnaturaleza";
        $arrayWhere[] = "i.tipo = 1";
        if (!is_null($idEspecialidad)) {
            $arrayWhere[] = "i.idespecialidad = " . $idEspecialidad;
        }
        if (!is_null($criterio)) {
            $arrayWhere[] = "(i.codigo ilike '{$criterio}%' OR upper(i.denominacion) ilike upper('{$criterio}%'))";
        }
        $_sqlQuery .= " WHERE " . implode(' AND ', $arrayWhere);
        $count = $this->_sqlConnection->execute($_sqlQuery)->rowCount();
        $_sqlQuery .= " OFFSET " . $offset . " LIMIT " . $limit;
        return $this->jsonResponse(array(
            'cantidad' => $count,
            'datos' => $this->_sqlConnection->execute($_sqlQuery)->fetchAll(PDO::FETCH_ASSOC)
        ));
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
        $this->setDefaultValue($offset, 0);
        $this->setDefaultValue($limit, 30);
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
        if (!is_null($idEspecialidad)) {
            $arrayWhere[] = "ni.idespecialidad = " . $idEspecialidad;
        }
        if (!is_null($criterio)) {
            $arrayWhere[] = "(ni.codigo ilike '{$criterio}%' OR upper(ni.denominacion) ilike upper('{$criterio}%'))";
        }
        if (!is_null($idAlmacen)) {
            $idAlmacenSearch = is_array($idAlmacen) ? implode(',', $idAlmacen) : $idAlmacen;
            $arrayWhere[] = "de.idestructura in (" . $idAlmacenSearch . ")";
        }
        if (!is_null($idNomenclador)) {
            $idNomenclador = is_array($idNomenclador) ? implode(',', $idNomenclador) : $idNomenclador;
            $arrayWhere[] = "ni.idindicador in (" . $idNomenclador . ")";
        }
        $_sqlQuery .= " WHERE " . implode(' AND ', $arrayWhere);
        $count = $this->_sqlConnection->execute($_sqlQuery)->rowCount();
        $_sqlQuery .= " ORDER BY de.idestructura, deop.idestructuraop, ni.idindicador OFFSET "
            . $offset . " LIMIT " . $limit;
        return $this->jsonResponse(array(
            'cantidad' => $count,
            'sql' => func_get_args(),
            'datos' => $this->_sqlConnection->execute($_sqlQuery)->fetchAll(PDO::FETCH_ASSOC)
        ));
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
        $this->setDefaultValue($offset, 0);
        $this->setDefaultValue($limit, 30);
        $_sqlQuery = "SELECT ni.codigo ||' - '||ni.denominacion as tipomedio,ni.denominacion,ns.nroserie,
                        ns.denominacioncolorprim as color, ns.denominacionestatustecnico as estado,ns.idproductonumericoactivo as id
                        ,ni.idindicador,ce.idproducto,eop.idestructuraop as arearesp
                        FROM mod_loganalisis.cub_existencia ce
                        INNER JOIN mod_loganalisis.cub_productonumericoactivo ns on ns.idproducto = ce.idproducto
                        INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = ce.idindicador
                        INNER JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = ce.idestructura
                        INNER JOIN mod_estructuracomp.dat_estructura e on e.idestructura = ce.identidad";
        $arrayWhere[] = "eop.idconcepto = 5";
        if (!is_null($idEspecialidad)) {
            $arrayWhere[] = "ni.idespecialidad = " . $idEspecialidad;
        }
        if (!is_null($criterio)) {
            $arrayWhere[] = "(ni.codigo ilike '{$criterio}%' OR upper(ni.denominacion) ilike upper('{$criterio}%'))";
        }
        if (!is_null($idEntidad)) {
            $idEntidadSearch = is_array($idEntidad) ? implode(',', $idEntidad) : $idEntidad;
            $arrayWhere[] = "e.idestructura in (" . $idEntidadSearch . ")";
        }
        if (!is_null($idNomenclador)) {
            $idNomenclador = is_array($idNomenclador) ? implode(',', $idNomenclador) : $idNomenclador;
            $arrayWhere[] = "ni.idindicador in (" . $idNomenclador . ")";
        }
        $_sqlQuery .= " WHERE " . implode(' AND ', $arrayWhere);
        $count = $this->_sqlConnection->execute($_sqlQuery)->rowCount();
        $_sqlQuery .= " ORDER BY e.idestructura, eop.idestructuraop, ni.idindicador, ns.nroserie OFFSET "
            . $offset . " LIMIT " . $limit;
        $datosProductos = $this->_sqlConnection->execute($_sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $this->jsonResponse(array(
            'cantidad' => $count,
            'datos' => $datosProductos,
        ));
    }

    public function devolverEntidadesActivos($idEspecialidad, $criterio, $idEntidad = null, $idNomenclador = null, $offset = null, $limit = null)
    {
        $this->setDefaultValue($offset, 0);
        $this->setDefaultValue($limit, 30);
        $_sqlQuery = "SELECT e.denominacion ||' - '||eop.denominacion as arearesp,eop.idestructuraop
                        FROM mod_loganalisis.cub_existencia ce
                        INNER JOIN mod_loganalisis.cub_productonumericoactivo ns on ns.idproducto = ce.idproducto
                        INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = ce.idindicador
                        INNER JOIN mod_estructuracomp.dat_estructuraop eop on eop.idestructuraop = ce.idestructura
                        INNER JOIN mod_estructuracomp.dat_estructura e on e.idestructura = ce.identidad";
        $arrayWhere[] = "eop.idconcepto = 5";
        if (!is_null($idEspecialidad)) {
            $arrayWhere[] = "ni.idespecialidad = " . $idEspecialidad;
        }
        if (!is_null($criterio)) {
            $arrayWhere[] = "(ni.codigo ilike '{$criterio}%' OR upper(ni.denominacion) ilike upper('{$criterio}%'))";
        }
        if (!is_null($idEntidad)) {
            $idEntidadSearch = is_array($idEntidad) ? implode(',', $idEntidad) : $idEntidad;
            $arrayWhere[] = "e.idestructura in (" . $idEntidadSearch . ")";
        }
        if (!is_null($idNomenclador)) {
            $idNomenclador = is_array($idNomenclador) ? implode(',', $idNomenclador) : $idNomenclador;
            $arrayWhere[] = "ni.idindicador in (" . $idNomenclador . ")";
        }
        $_sqlQuery .= " WHERE " . implode(' AND ', $arrayWhere);
        $_sqlQuery .= " ORDER BY e.idestructura, eop.idestructuraop, ni.idindicador, ns.nroserie OFFSET "
            . $offset . " LIMIT " . $limit;
        $datosProductos = $this->_sqlConnection->execute($_sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        $cacheEntidades = array();
        foreach ($datosProductos as &$prod) {
            if (!array_key_exists($prod['idestructuraop'], $cacheEntidades)) {
                $cacheEntidades[$prod['idestructuraop']] = $prod['arearesp'];
            }
            $prod['arearesp'] = $prod['idestructuraop'];
        }
        return $this->jsonResponse(array(
            'datos' => $cacheEntidades
        ));
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
        $data = $this->_sqlConnection->execute($sqlMedios)->fetchAll(PDO::FETCH_OBJ);
        return $this->jsonResponse($data);
    }

    /**
     * @param $variable
     * @param null $value
     */
    public function setDefaultValue(&$variable, $value = null)
    {
        if (!is_null($value) && is_null($variable)) {
            $variable = $value;
        }
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
        $datos = $this->_sqlConnection->execute($_sqlQuery)->fetchAll(PDO::FETCH_ASSOC);


        return $this->jsonResponse(
            $datos
        );

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


        $conn = Zend_Registry::get('conexion');
        $respuesta = $conn->fetchAll(
            "SELECT * FROM \"mod_logactivofijotangible\".\"f_listaridentificador\"({$naturaleza})"
        );
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

        return $this->jsonResponse(
            array_values($parents)
        );
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

        $conn = Zend_Registry::get('conexion');
        $respuesta = $conn->fetchAll("SELECT * FROM \"mod_logactivofijotangible\".\"f_devuelveRnAtribDin\"({$activo})");
        $resp = end($respuesta);
        $resp['html'] = $resp['text'];
        $resp['text'] = $resp['denominacion'];

        return $this->jsonResponse(
            $resp
        );


    }
    
    /**
     * 
     * @param type $idregistronumerico
     * @param type $idestructura
     * @param type $codOperaciones
     * @return type
     */
    public function obtenerMovRegNumerico($idregistronumerico, $idestructura, $codOperaciones = array())
    {
        if(!$idregistronumerico || is_null($idregistronumerico)){
            die('Debe pasar por parámetros el idregistronumerico');
        }
        
        $sql = "SELECT dd.idestructuracomun, dd.nrodoc, dd.fechacontable as fechaaprobacion, ndp.denominacion as tipodocumento, nop.denominacion as tipooperacion,
                deop.denominacion as arearesponsabilidad, 
                (
                    SELECT de1.denominacion
                    FROM mod_estructuracomp.dat_estructura de1
                    WHERE de1.idestructura = (
                        SELECT nfe3.idfila
                        FROM mod_estructuracomp.nom_filaestruc nfe3
                        INNER JOIN mod_estructuracomp.dat_estructura de2 on de2.idestructura = nfe3.idfila
                        WHERE 
                            nfe3.lft <= (select nfe4.lft from mod_estructuracomp.nom_filaestruc nfe4 where nfe4.idfila = dd.idestructuracomun) and
                            nfe3.rgt >= (select nfe5.lft from mod_estructuracomp.nom_filaestruc nfe5 where nfe5.idfila = dd.idestructuracomun)

                        ORDER BY nfe3.lft DESC
                        LIMIT 1
                    )             
                    and de1.idconcepto = 3
                    and de1.idproyecto = 0

                ) as entidad

                FROM mod_logactivofijotangible.dat_movregnumerico dmrn
                INNER JOIN mod_logistica.dat_movimiento dm on dm.idmovimiento = dmrn.idmovimiento
                INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
                INNER JOIN mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
                INNER JOIN mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
                INNER JOIN mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
                INNER JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dd.idestructuracomun
                WHERE 
                    dmrn.idregnumerico = $idregistronumerico 
                    AND dd.estado = 3";
        if($idestructura && !is_null($idestructura)){
            $sql .= " AND dd.idestructuracomun in 
                    (
                        SELECT nfe.idfila FROM mod_estructuracomp.nom_filaestruc nfe 
                        WHERE 
                        nfe.lft >= (SELECT nfe1.lft FROM mod_estructuracomp.nom_filaestruc nfe1 WHERE nfe1.idfila = $idestructura) and
                        nfe.rgt <= (SELECT nfe2.rgt FROM mod_estructuracomp.nom_filaestruc nfe2 WHERE nfe2.idfila = $idestructura)
                    )";
        }
        
        
        if(count($codOperaciones) > 0){
            $sql_operaciones = array();
            foreach ($codOperaciones as $key => $value) {
                $sql_operaciones[] = " nop.codigo =  $value ";
            }
            $sql .= " AND " . implode(' AND ', $sql_operaciones);
        }
        
        $datos = $this->_sqlConnection->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $this->jsonResponse(
            $datos
        );
    }
    
    /**
     * 
     * @param type $idestrura
     * @return type
     */
    public function obtenerRegNumDocumentos($idestrura, $idpadre = null){
        $sql = "SELECT 
        drn.idregnumerico, drn.nroserie,
	
        drna.depreciacionacumulada, 
        drna.vidautil, 
        drna.porcientorecuperacion, 
        drna.valorcontable, 
        drna.fechaexpini, 
        drna.fechaexpfin, 
        drna.fechaadq, 
        drna.tasafiscal, 
        deop.denominacion as arearesp,
        ncolprim.denominacion as colorprim,
        ncolsec.denominacion as colorsec,
        drna.valoradquisicion,
        nesttec.denominacion as estadotecnico,  
        deubic.descripcion as ubicacion,
        nact.denominacion as actividad,
        drna.annofabricacion, 
        (person.nombre || ' ' || person.papel || ' ' || person.papel) as responsable,
        drna.valormodulo,
        drna.recursoconsumido,
        drna.cantidadrecursoconsumido,
        drna.nroinventario,
        drna.recursoconsumidomax,
        drna.fechainicialgarantia,
        drna.fechafingarantia,
        drna.esmodulo,
        (CASE 
          WHEN drna.idestadoperacion = 1 THEN 'Registrado'
          WHEN drna.idestadoperacion = 2 THEN 'Alquilado proveedor'
          WHEN drna.idestadoperacion = 3 THEN 'Alquilado cliete'
          WHEN drna.idestadoperacion = 4 THEN 'Prestado'
          WHEN drna.idestadoperacion = 5 THEN 'Reparacion'
          END) AS estado_operacion,
         ni.denominacion as tipomedio,
         marca.denominacion as marca,
         modelo.denominacion as modelo

      FROM mod_logactivofijotangible.dat_registronumerico drn
      INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = drn.idregnumerico
      INNER JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drn.idregnumerico
      INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn on dmrn.idregnumerico = drn.idregnumerico
      INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = drn.idproducto

      LEFT JOIN mod_logactivofijotangible.dat_responsable dresp on dresp.idresponsable = drna.idresponsable
      LEFT JOIN mod_persona.dat_persona person on person.idpersona = dresp.idpersona
      LEFT JOIN mod_logactivofijotangible.nom_actividad nact on nact.idactividad = drna.idactividad
      LEFT JOIN mod_logubicacion.dat_estructuraubicacion deubic on deubic.idestructuraubicacion = drna.idubicacion
      LEFT JOIN mod_logactivofijotangible.nom_estatustecnico nesttec on nesttec.idestatustecnico = drna.idestatustecnico
      LEFT JOIN mod_logactivofijotangible.nom_color ncolprim on ncolprim.idcolor = drna.idcolorprim
      LEFT JOIN mod_logactivofijotangible.nom_color ncolsec on ncolsec.idcolor = drna.idcolorprim
      LEFT JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = drna.idarearesp

      INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
      INNER JOIN mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
      LEFT JOIN mod_datosmaestros.nom_marca marca on marca.idmarca = nih.idmarca
      LEFT JOIN mod_datosmaestros.nom_modelo modelo on modelo.idmodelo = nih.idmodelo

      WHERE 
          drna.idestadoperacion IN (1,2,3,4,5)
          AND drna.idregnumerico = drna.idpadre";
        
        if(!is_null($idestrura)){
            $sql .= " AND dp.idestructuracomun = $idestrura ";
        }
        
        if(!is_null($idpadre)){
            $sql .= " AND drna.idpadre = $idpadre ";
        }
        
        $datos = $this->_sqlConnection->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $this->jsonResponse(
            $datos
        );  
    }

	public function obtenerNaturalezas($naturaleza, $extraParams){
		
		$sql = " SELECT n.idnaturaleza, n.denominacion FROM mod_datosmaestros.nom_naturaleza n ";		
		
		if($naturaleza){
			$where .=" WHERE n.denominacion ilike '%". $naturaleza . "%' ";
		}
		
		if($extraParams['start'])
			$where .= " OFFSET " . $extraParams['start'] . " ";
		if($extraParams['limit'])
			$where .= " LIMIT " . $extraParams['limit'] . " ";
		
		$datos = $this->_sqlConnection->execute($sql . $where)->fetchAll(PDO::FETCH_ASSOC);
		return $this->jsonResponse(
            $datos
        );		
	}
}
