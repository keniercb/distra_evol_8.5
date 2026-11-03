<?php

class NomClienteproveedor extends BaseNomClienteproveedor
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
            'NomClasificacioncontable',
            array('local'   => 'idclasificacioncontable',
                'foreign' => 'idclasificacioncontable')
        );
        $this->hasMany(
            'DatCuentaBancoCliente', array('local'   => 'idclienteproveedores',
                'foreign' => 'idclienteproveedores')
        );
        $this->hasMany(
            'NomContacto', array('local'   => 'idclienteproveedores',
                'foreign' => 'idclienteproveedores')
        );
        $this->hasOne(
            'DatClienteProveedorMapa', array('local'   => 'idclienteproveedores',
                'foreign' => 'idclienteproveedores')
        );
        $this->hasMany(
            'DatClienteProveedorEntidad', array('local'   => 'idclienteproveedores',
                'foreign' => 'idclienteproveedor')
        );
        parent::setUp();
    }

    public static function obtenerClientesproveedores(
        $cond = array(), $foto = true, $start = null, $limit = null,
        $existGis = false, $showall = true
    ) {
        //print_r($cond);die;
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $idestructura = $cond['idestructuracomun'];
        $extra = "";
//		print_r($cond);die;
        $distinct = 'DISTINCT';
        if ($idestructura) {
            $caseEnUso
                = "(CASE WHEN cpe.idestructuracomun = $idestructura THEN 1 else 0 END) as enuso,cpe.idespaciotrabajo,cpe.idclienteproveedorentidad,cpe.habilitado,";
            $leftJoinEntidad
                = "LEFT JOIN mod_datosmaestros.dat_clienteproveedorentidad cpe ON (clpr.idclientesproveedores = cpe.idclienteproveedor AND cpe.idestructuracomun = $idestructura)";
            $orderEnUso = "enuso DESC,";
            $colIdestructura = ",cpe.idestructuracomun";
        }

        if($cond['cobrospagos']){
            $innerjoincobrospagos = " INNER JOIN (select DISTINCT idclienteproveedor, idestructura, clasificacion from mod_datosmaestros.dat_clienteproveedorcobropago where idestructura = $idestructura and clasificacion = ".$cond['cobrospagos'].") b ON (b.idclienteproveedor = clpr.idclientesproveedores)";
//            $innerjoincobrospagos = " INNER JOIN mod_datosmaestros.dat_clienteproveedorcobropago cpcp ON (cpcp.idclienteproveedor = clpr.idclientesproveedores AND cpcp.clasificacion = ".$cond['cobrospagos'].")";
        }

        if($cond['habilitado']){
            $innerjoinhabilitado = " INNER JOIN mod_datosmaestros.dat_clienteproveedorentidad cent ON (clpr.idclientesproveedores = cent.idclienteproveedor ) and cent.habilitado=1";
//            $innerjoincobrospagos = " INNER JOIN mod_datosmaestros.dat_clienteproveedorcobropago cpcp ON (cpcp.idclienteproveedor = clpr.idclientesproveedores AND cpcp.clasificacion = ".$cond['cobrospagos'].")";
        }
        $filter = self::getFilter($cond, $showall);

        if (!is_null($start) && !is_null($limit) && !isset($cond['notlimit'])) {
            $extra = " OFFSET $start LIMIT $limit";
        } else {
            if (is_null($start) && !is_null($limit)
                && !isset($cond['notlimit'])
            ) {
                $extra = " OFFSET 0 LIMIT $limit";
            }
        }

        $where = $filter['filter'] ? "where " . $filter['filter'] : "";
        //$where.= ' AND cpe.habilitado = 1';

        $foto = $foto
            ? "COALESCE (encode(clpr.foto,'escape'),ni.icono,'data:image/jpg;base64,'||''||encode(dfoto.foto,'escape')) as foto"
            : "null as foto";
        $joinMapa = $existGis
            ? " LEFT JOIN mod_datosmaestros.dat_clientesproveedormapa tmp ON (clpr.idclientesproveedores = tmp.idclientesproveedores) "
            : "";
        $idmapa = $existGis ? ",tmp.idclientesproveedoresmapa as idmapa " : "";

//        print('/*WHERE:'.$where.'*/');die;
        //COALESCE (clpr.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as nombre,
        //(CASE WHEN clpr.idclasificacion = 1 THEN COALESCE (clpr.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion)
        //                      ELSE COALESCE ((clpr.nombre::json->>'pn')||' '||(clpr.nombre::json->>'sn')||' '||(clpr.nombre::json->>'pa')||' '||(clpr.nombre::json->>'sa')) END) as nombre,

        $query = "SELECT $distinct clpr.idclientesproveedores, clpr.idpadre, clpr.idpais, p.nombrepais as pais, p.codigopais, clpr.fechaaprobacion,
                  COALESCE (clpr2.nombre,estru2.denominacion, per2.nombre||' '||per2.papel||' '||per2.sapel,estruop2.denominacion) as nombrepadre,
                  COALESCE (clpr.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as nombre,
                  (CASE WHEN clpr.nombre_json IS NOT NULL THEN clpr.nombre_json::json->>'pn' ELSE NULL END) as pnombre,
                  (CASE WHEN clpr.nombre_json IS NOT NULL THEN clpr.nombre_json::json->>'sn' ELSE NULL END) as snombre,
                  (CASE WHEN clpr.nombre_json IS NOT NULL THEN clpr.nombre_json::json->>'pa' ELSE NULL END) as papellido,
                  (CASE WHEN clpr.nombre_json IS NOT NULL THEN clpr.nombre_json::json->>'sa' ELSE NULL END) as sapellido,
				  COALESCE (clpr.codigo||' '||clpr.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as nombrecontrato,
                  COALESCE (clpr.codigo,estru.codigo, ident.numero,estruop.codigo) as codigo,
                  COALESCE (clpr.abreviatura,estru.abreviatura,estruop.abreviatura) as abreviatura,
                  COALESCE (clpr.direccion,estru.direccion, direc.direccion) as direccion,clpr.descripcion,
                  COALESCE (clpr.correo,estru.correo) as correo,clpr.idtipo,clpr.idorganismo, clpr.idsector, sect.denominacion as sector, org.nombre as organismo,org.codigo as codorganismo,
                  COALESCE (cast(clpr.telefono as text),estru.telefono) as telefono, clpr.mayorista, 
                  clpr.tipoproveedorproducto, clpr.tipoproveedortiempo,
                  COALESCE (clpr.dpa,estru.iddpt) as dpa,$foto,
                  (CASE WHEN clpr.idclasificacion = 1 THEN TRUE else FALSE END) as entidad,
                  (CASE WHEN clpr.idtipo = 1 THEN 'Cliente' else CASE WHEN clpr.idtipo = 2 THEN 'Proveedor' ELSE 'Cliente y Proveedor' END END) as tipocliente,
                  $caseEnUso clpr.idestructura,clpr.idpersona,clpr.idclasificacion,clpr.idclasificacion,clpr.registrado,clpr.fechainicio,clpr.fechafin,clpr.idusuario,
                  (CASE WHEN clpr.registrado = 0 THEN dpt.denominacion else COALESCE (esdpt.denominacion, null) END) as descripciondpa,clpr.idusuario,su.nombreusuario,
                  clpr.idclasificacioncontable,clpr.codigonit, COALESCE (cph.argumento, null) AS argumento, COALESCE (su2.nombreusuario, null) AS argumentousuario $colIdestructura $idmapa
                  FROM mod_datosmaestros.nom_clientesproveedor clpr
                  $leftJoinEntidad
				  $innerjoinhabilitado
                  LEFT JOIN mod_estructuracomp.dat_estructura estru ON (clpr.idestructura = estru.idestructura and estru.idproyecto=0)
                  LEFT JOIN mod_estructuracomp.dat_estructuraop estruop ON (clpr.idestructura = estruop.idestructuraop and estruop.idproyecto=0)
                  LEFT JOIN mod_datosmaestros.nom_dpt esdpt ON (estru.iddpt = esdpt.iddpt)
                  LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona)
                  LEFT JOIN mod_persona.dat_docidentidad ident ON (clpr.idpersona = ident.idpersona)
                  LEFT JOIN mod_persona.dat_direccion direc ON (clpr.idpersona = direc.idpersona)
                  LEFT JOIN mod_persona.dat_foto dfoto ON (clpr.idpersona = dfoto.idpersona and dfoto.principal = 1)
                  LEFT JOIN mod_datosmaestros.nom_dpt dpt ON (dpa = dpt.iddpt)
                  LEFT JOIN mod_seguridad.seg_usuario su ON (clpr.idusuario = su.idusuario)
				  LEFT JOIN mod_crmclienteproveedor.nom_organismo org ON (clpr.idorganismo = org.idorganismo)
				  LEFT JOIN mod_crmcontratacion.nom_sector sect ON (clpr.idsector = sect.idsector)
                  $joinMapa
                  LEFT JOIN mod_datosmaestros.nom_clasificacioncontable cc on clpr.idclasificacioncontable = cc.idclasificacioncontable
				  LEFT JOIN mod_estructuracomp.nom_icono ni on estru.idicono = ni.idicono
				  $innerjoincobrospagos
                  LEFT JOIN mod_datosmaestros.dat_clienteproveedor_habilitar cph ON (cph.idclienteproveedorentidad=clpr.idclientesproveedores)
                  LEFT JOIN mod_seguridad.seg_usuario su2 ON (cph.idusuario = su2.idusuario)
		          LEFT JOIN mod_datosmaestros.nom_clientesproveedor clpr2 ON (clpr.idpadre=clpr2.idclientesproveedores)
                  LEFT JOIN mod_estructuracomp.dat_estructura estru2 ON (clpr2.idestructura = estru2.idestructura and estru2.idproyecto=0)
                  LEFT JOIN mod_estructuracomp.dat_estructuraop estruop2 ON (clpr2.idestructura = estruop2.idestructuraop and estruop2.idproyecto=0)
                  LEFT JOIN mod_persona.dat_persona per2 ON (clpr2.idpersona = per2.idpersona)
                  LEFT JOIN mod_datosmaestros.nom_pais p ON (p.idpais = clpr.idpais)
                  $where ORDER BY $orderEnUso codigo ASC";
        $query = "SELECT *, count(idclientesproveedores) over() FROM(" . $query . ")a ".
            ($filter['filter1']?"where " . $filter['filter1']:"");

//           (CASE WHEN position('{\"pn\":' IN clpr.nombre)=1 THEN
//          (clpr.nombre::json->>'pn')||' '||(clpr.nombre::json->>'sn')||' '||(clpr.nombre::json->>'pa')||' '||(clpr.nombre::json->>'sa')
//          ELSE COALESCE (clpr.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) END) as nombre,
        $query.= $extra;

        $result = $conexionActual->fetchAll($query);

//        foreach($result as &$r){
//            if(!$r['entidad']){
//                try{
//                    $jsonvalue=json_decode($r['nombre']);
//                    if(!$jsonvalue)continue;
//                    $r['pnombre']=$jsonvalue->{'pn'};
//                    $r['snombre']=$jsonvalue->{'sn'};
//                    $r['papellido']=$jsonvalue->{'pa'};
//                    $r['sapellido']=$jsonvalue->{'sa'};
//                    $r['nombre']=$jsonvalue->{'pn'}.' '.($jsonvalue->{'sn'}==''?'':$jsonvalue->{'sn'}.' ').$jsonvalue->{'pa'}.' '.$jsonvalue->{'sa'};
//                }catch(Exception $e){
//                    continue;
//                }
//            }
//        }

        $cant = count($result) ? $result[0]['count'] : 0;

        $resultado = array('cantidad' => $cant,
            'datos'    => $result);
        return $resultado;
    }

    public function getFilter($cond = array(), $showall)
    {
//        print('/*llega*/');
        $filter = array();
        $filter1 = '';
//        print_r($cond);die;
        $result = array();
//        print('/*filtro*/');
        if ($cond['codigocliente']) {
            $filter[] = "clpr.codigo ILIKE '%" . $cond['codigocliente'] . "%'";
        }
        if ($cond['idlinea']) {
            $filter[] = "(EXISTS(SELECT cpl.idclienteproveedorlinea 
            FROM mod_datosmaestros.dat_clienteproveedorlinea cpl 
            WHERE cpl.idclienteproveedor=clpr.idclientesproveedores AND '".$cond['idlinea']."' = ANY (string_to_array(cpl.idlinea, ',')))) = TRUE";
        }
//        WHERE cpl.idclienteproveedor=clpr.idclientesproveedores AND cpl.idlinea IN (".$cond['idlinea']."))) = TRUE
//        if($cond['cobrospagos']){
//            $filter[]=" cpcp.clasificacion = ".$cond['cobrospagos'];
//        }
        if ($cond['codigo']) {
            $filter[] = "a.codigo = '" . $cond['codigo'] . "'";
        }
        if ($cond['idpadre']){
            $filter[]="a.idpadre=".$cond['idpadre'];
        }
        if ($cond['nombre']) {
            $filter[] = "clpr.nombre ILIKE '%" . $cond['nombre'] . "%'";
        }

        if ($cond['mayorista']) {
            $filter[] = "clpr.mayorista = " . $cond['mayorista'] . " ";
        }

        if ($cond['idestructuracomun'] && !$showall) {
            $filter[]
                = "cpe.idestructuracomun = '" . $cond['idestructuracomun'] . "'";
        }
        if ($cond['idestructura']) {
            $filter[] = "clpr.idestructura = '" . $cond['idestructura'] . "'";
        }
        if ($cond['idclasificacion']) {
            $filter[] = "clpr.idclasificacion = '" . $cond['idclasificacion'] . "'";
        }
        if (isset($cond['registrado'])) {
            $filter[] = "clpr.registrado = '" . $cond['registrado'] . "'";
        }
        if ($cond['idpersona']) {
            $filter[] = "clpr.idpersona = '" . $cond['idpersona'] . "'";
        }
        if ($cond['idusuario']) {
            $filter[] = "clpr.idusuario = '" . $cond['idusuario'] . "'";
        }
        $idClientes = $cond['idclientesproveedores'];
        if ($idClientes) {
//            print('entro');
            $temp = 'in';
            if (is_array($idClientes)) {
                if ($idClientes['notin'] && $idClientes['notin'] == 1) {
                    $temp = 'not in';
                    $ids = implode(',', $idClientes['ids']);
                } else {
                    $ids = implode(',', $idClientes);
                }
            } else {
                $ids = $idClientes;
            }
//            print('ids'.$ids);die;
            if ($ids) {
                $filter[] = "clpr.idclientesproveedores " . $temp . " (" . $ids . ")";
            }
        }
        if ($cond['idpersonas']) {
            $filter[]
                = "clpr.idpersona not in(" . implode(',', $cond['idpersonas'])
                . ")";
        }
        if ($cond['idestructuras']) {
            $filter[] = "clpr.idestructura not in(" . implode(
                    ',', $cond['idestructuras']
                ) . ")";
        }
        if ($cond['idtipo'] && $cond['idtipo'] != 3) {
            $filter[]
                = "(clpr.idtipo = " . $cond['idtipo'] . " OR clpr.idtipo = 3)";
        }
        if($cond['padres']){
            $filter[]="clpr.idpadre IS NULL ";
//            $filter[]="clpr.idpadre IS NULL AND (SELECT count(*) FROM mod_datosmaestros.nom_clientesproveedor WHERE idpadre=clpr.idclientesproveedores)=0 ";
        }

        if($cond['habilitado']){
            $valor=$cond['habilitado']=='true'?1:0;
            $filter[]="cpe.habilitado = ".$valor;
        }

        //En caso que se utilicen los filtros de las columnas
        if ($cond['filter']) {
//            print('/*filter*/');
            foreach ($cond['filter'] as $value) {

                // Si el tipo de dato es booleano reformatearlo a 0 o 1
                $type = $value['data']['type'];
                if ($type === 'boolean') {
                    $value['data']['value'] = $value['data']['value'] == 'true' ? 1 : 0;
                    $type = 'numeric';
                }

                $field = $value['field'];
//                print_r($value);
                //Definiendo operador ha utilizar en la condicion
                $comparison = $value['data']['comparison'];
                //Definiendo operador
                $operator = " = ";
                if ($comparison) {
                    if ($comparison === 'lt') {
                        $operator = " < ";
                    } else {
                        if ($comparison === 'gt') {
                            $operator = " > ";
                        }
                    }
                }
//                print('/*$type'.$type.'*/');
//                print('/*$field'.$field.'*/');
//                print('/*$comparison'.$comparison.'*/');
                //Verificar que el valor enviado tiene el formato de un array en json (Ej:[1,2])
                $pattern = '/\[(\d\,?)+\]/i';
                preg_match_all($pattern, $value['data']['value'], $isarray, PREG_SET_ORDER);
                $value = $value['data']['value'];
                //Si tiene formato array como json se decodifica para darle tratamiento de array
                if (count($isarray)) {
                    $value = json_decode($value);
                }
                $value = is_array($value) ? $value : array($value);
                if ($field == 'idtipo') {
                    $value[] = 3;
                }
                $w = array();
                //Se recorre cada valor y se agrega a la condicion, si es mas de un valor por filtro
                //se une con un OR
                foreach ($value as $v) {
                    //Creando condicion
                    if ($type === 'numeric' || $type === 'list') {
                        $w[] = $field . "" . $operator . "" . $v;
                    } else {
                        if ($type === 'date') {
                            $date = $v;
                            $w[] = $field . "" . $operator . "'$date'";
                        } else {
                            $w[] = $field . " ILIKE '%" . $v . "%'";
                        }
                    }
                }
                if (count($value) == 1) {
                    $where[] = " " . $w[0];
                } else {
                    $where[] = " ( " . implode(' OR ', $w) . " ) ";
                }

            }
//            print_r($where);
            $filter1[] = " " . implode(' AND ', $where);
        }
        if ($cond['filtro'] && !$cond['filter']) {
            $filter1[] = "(a.nombre ILIKE '%" . $cond['filtro']
                . "%' OR a.codigo ILIKE '%" . $cond['filtro'] . "%')";
        }
        if ($cond['filtronomb']) {
            $filter1[] = " (a.nombre ILIKE '%" . $cond['filtronomb'] .
                "%' OR a.codigo ILIKE '%" . $cond['filtronomb'] . "%')";
        }

        if($cond['filtrocombo']){
            $filter1[] = "(a.nombre ILIKE '%" . $cond['filtrocombo']
                . "%' OR a.abreviatura ILIKE '%" . $cond['filtrocombo'] . "%')";
        }

        if ($cond['filtrocod']) {
            $filter1[] = " a.codigo ILIKE '%" . $cond['filtrocod'] . "%'";
        }

        if($cond['enuso']){
            $valor=$cond['enuso']=='true'?1:0;
            $filter1[]="enuso = ".$valor;
        }

        if (count($filter)) {
            $result['filter'] = implode(' AND ', $filter);
        }

        if ($filter1) {
            $result['filter1'] = implode(' AND ', $filter1);
        }
//        print_r($result);die;
        return $result;
    }

    static function getDescripcionContable($idClasificacion)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomClasificacioncontable')
            ->where("idclasificacioncontable=?", $idClasificacion)
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        return $result[0]['descripcion'];
    }

    public function getByCondition($condition, $params)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomClienteproveedor clpr')
            ->leftjoin('clpr.DatClienteProveedorEntidad cpe on cpe.idclienteproveedor = clpr.idclientesproveedores')
            ->where($condition, $params)
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    static function getQuery($alias = 'cp')
    {
        return Doctrine_Query::create()->from("NomClienteproveedor {$alias}")
            ->select("{$alias}.idclientesproveedores");
    }

    public function existUser($condClient, $condContact)
    {
        $instance = Doctrine_Manager::getInstance();
        $conexion = $instance->getCurrentConnection();
        $whereClient = $condClient ? " WHERE $condClient" : "";
        $whereContact = $condContact ? " WHERE $condContact" : "";
        $query = "SELECT idusuario FROM mod_datosmaestros.nom_clientesproveedor$whereClient
                  UNION (SELECT idusuario FROM mod_datosmaestros.nom_contacto $whereContact)";

        $result = $conexion->fetchAll($query);

        return count($result) != 0 ? true : false;
    }

    public function getOrganismos($post)
    {
        $denominacion= $post['denominacion'];
        $instance = Doctrine_Manager::getInstance();
        $conexion = $instance->getCurrentConnection();
        $query = "SELECT idorganismo,nombre FROM mod_crmclienteproveedor.nom_organismo
		            where nombre ilike '$denominacion%'
                   ORDER BY nombre ASC ";
        $result = $conexion->fetchAll($query);

        return array('cant' => count ($result), 'data' => $result);

        //return $result;
    }


    public function getSector($post)
    {
        //$denominacion= $post['denominacion'];
        $instance = Doctrine_Manager::getInstance();
        $conexion = $instance->getCurrentConnection();
        $query = "SELECT idsector,denominacion as sector FROM mod_crmcontratacion.nom_sector
		          ORDER BY denominacion ASC ";

        $result = $conexion->fetchAll($query);

        return array('cant' => count ($result), 'data' => $result);

        //return $result;
    }


    public function getModelData($params)
    {
        $agStart = $params[0];
        $agLimit = $params[1];
        $agOrder = $params[2];
        $agOrderDirect = $params[3];
        $agFiltre = $params[4];
        $filter = array();
        foreach ($agFiltre as $f) {
            if ($f['field'] == "nombre") {
                $filter['filtronomb'] = $f['data']['value'];
            } else {
                if ($f['field'] == "codigo") {
                    $filter['filtrocod'] = $f['data']['value'];
                } else {
                    $filter[$f['field']] = $f['data']['value'];
                }
            }
        }
        $result = $this->obtenerClientesproveedores($filter, false, $agStart, $agLimit, false, false);
        return array('cant' => $result['cantidad'], 'data' => $result['datos']);
    }
}
