<?php

class ValeProduccionModel extends DocumentoModel 
{
    private $planificacionService, $configuracionGeneralService, $estructuraCompService;

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatValeProduccion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idvaleproduccion')
        );
        LogisticaDoctrineHelper::__init()->tryInyectRelactions(new DatDocumento(), $relations);
        $this->planificacionService = ServiciosPlanificacionHelper::__init();
        $this->configuracionGeneralService = ServiciosConfiguracionGeneralHelper::__init();
        $this->estructuraCompService = ServiciosEstructuraComposicionHelper::__init();
    }
    /**
     * Instancia para garantizar el acceso singleton a la clase
     *
     * @var ValeProduccionModel
     */
     private static $instance = null;

     /**
      * Metodo que devuelve una nueva instancia de la clase
      *
      * @return ValeProduccionModel Instancia singleton
      */
     public static function getInstance() {
         if (null === self::$instance) {
             self::$instance = new ValeProduccionModel(array('alias' => 'valeProduccionLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_PRODUCCION));
         }
         return self::$instance;
     }

    /**
     * Adicionar un documento.
     * @author Yadrian Aguila
     * @return Numeric
     */
    public function adicionarDocumento($params)
    {
        //print_r($params);die;
        $documento = parent::adicionarDocumento($params);
        $sb = new DatValeProduccion;
        if ($params['iddocumento']) {
            $sb->assignIdentifier($params['iddocumento']);
        }
        $sb->synchronizeWithArray($params);
        if ($params['materiales']) {
            $this->adicionarMateriales($sb, $params['materiales']);
        }
        if ($params['maquinarias']) {
            $this->adicionarMaquinaria($sb, $params['maquinarias']);
        }
        if ($params['manoobra']) {
            $this->adicionarManoObra($sb, $params);
        }
        
        $this->adicionarProductos($sb, $params['productos'], $params['cantidad']);
        $documento->DatValeProduccion = $sb;
        //print_r($sb->toArray());die;
        try {
            $documento->save();
            $iddocumento = $documento->iddocumento;
            $documento->free();
            $documento = null;
            unset($documento);
            $this->trazaDocumento->guardarTraza('Documento adicionado', $iddocumento);
            return array('success' => true, 'iddocumento' => $iddocumento);
        } catch (Exception $e) {
            $documento->free();
            $documento = null;
            unset($documento);
            return array('success' => false, 'mensajes' => $e->getMessage(), 'detalles' => $e->getMessage());
        }
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function devolverDocumentos($params, $dql = false)
    {
        unset($params['idestructura']);
        unset($params['idEntidadComun']);
        $query = $this->getQueryDocumento('d');
        $this->addFiltersQueryDocumento($query, $params, 'd');

        $this->addQuery($query, 'd', $params);
        //  if($params['idordenproduccion']){
        $query->addWhere('dop.idordenproduccion =?', array($params['idordenproduccion']));
        //  }
        if ($dql) {
            return $query;
        }
     
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray()
        );
    }

    /**
     * @param Doctrine_Query $query
     * @param string $aliasExterno
     */
    public function addQuery(Doctrine_Query &$query, $alias = false)
    {
        $query->addSelect('dop.idvaleproduccion AS iddocumento,dop.idvaleproduccion AS idvaleproduccion,
          dop.idordenproduccion as idordenproduccion, dop.cantidad as cantidad, 
          dop.idturnotrabajo as idturnotrabajo, dop.identrega as identrega');

        $query->addSelect(
            "(SELECT COUNT(_dvp.idvaleproducto) FROM DatValeProductos _dvp "
            . "WHERE _dvp.idvaleproduccion = dop.idvaleproduccion) as cantproductos "
        );

        //  $query->addSelect('  (dm.preciopromedio * (sum(dm.cantidad) - COALESCE((SELECT sum(m.cantidad)
        //      FROM mod_logistica.dat_movimiento m
        //      INNER JOIN mod_logistica.dat_documento dvd on dvd.iddocumento = m.iddocumento
        //      INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dvd.iddoc
        //      INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
        //      INNER JOIN mod_logistica.dat_documentopadre ppvd on ppvd.iddocumento = dvd.iddocumento
        //      INNER JOIN mod_logistica.dat_documento dds on ppvd.idpadre = dds.iddocumento
        //      INNER JOIN mod_logistica.dat_documentopadre ppds on ppds.iddocumento = dds.iddocumento
        //      INNER JOIN mod_logistica.dat_documento dso on ppds.idpadre = dso.iddocumento
        //      INNER JOIN mod_logistica.dat_documentopadre ppso on ppso.iddocumento = dso.iddocumento
        //  WHERE ppso.idpadre = 1000190713 AND np.abreviatura = 'valedev' 
        //  AND dvd.estado = 4 AND m.idproducto = pp.idproducto
        //  GROUP BY ppso.idpadre ),0))) AS importeproducto
        // ');


        if ($alias) {
            $query->addSelect(
                'dd.nrodoc AS nrodocgenerado'
            );
            $query->innerJoin("{$alias}.DatValeProduccion dop")
                ->leftJoin("{$alias}.DatDocumentoPadre ddp on ddp.idpadre = {$alias}.iddocumento")
                ->leftJoin("ddp.DatDocumento dd on dd.iddocumento = ddp.iddocumento");
                
        } else {
            $query->from("DatValeProduccion dop");
        }

        return $query;
    }

    public function adicionarMateriales(DatValeProduccion $record, $materiales)
    {
        if (!empty($materiales)) {
            foreach ($materiales as $mat) {
                if ($mat['idmaterialesvaleproduccion']) {
                    $op = Doctrine::getTable('DatValeMateriaPrima')
                        ->find($mat['idmaterialesvaleproduccion']);
                } else {
                    $op = new DatValeMateriaPrima();
                }
                $op->synchronizeWithArray($mat);
                $record->DatValeMateriaPrima->add($op);
            }
        }        
    }

    public function adicionarProductos(DatValeProduccion &$record, $productos, $cantinicial = 0)
    {
        if (!empty($productos)) {
            foreach ($productos as $prod) { 
                $op = new DatValeProductos();
                if ($prod['idvaleproducto']) {
                    $op->assignIdentifier($prod['idvaleproducto']);
                }
                $op->synchronizeWithArray($prod);
        
                //print_r($op->toArray());
                $record->DatValeProductos->add($op);
            }//die;
        } else {
            if (empty($cantinicial)) {
                $cantinicial = 0;
            }
            $op = new DatValeProductos();
            $conn = Doctrine_Manager::connection();
            $query = "SELECT distinct cti.idindicadorsalida as idindicador,COALESCE({$cantinicial},0) as cantidad,cf.idalmacen as iddeposito
                    FROM mod_logproduccion.dat_ordenproduccion op
                    INNER JOIN mod_logproduccion.conf_almacenes cf on cf.idconfalmacen = op.idalmacendestino
                    INNER JOIN mod_planifindustrial.dat_cartatecindustrial cti ON (cti.idcartatecindustrial = op.idcartatecnologica)
                    WHERE op.idordenproduccion = {$record->idordenproduccion}";
            $prod = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            $op->synchronizeWithArray($prod[0]);
            $record->DatValeProductos->add($op);
        }  
    }

    public function cargarMaterialesAll($params)
    {
        $params['idcartatecindustrial'] = !empty($params['idcartatecindustrial']) ? $params['idcartatecindustrial'] : 0;
        $WHERE = " AND p.idestructura IN(SELECT idalmacen FROM mod_logproduccion.conf_almacenes WHERE almacenmpm = 1 AND identidad = {$this->global->Estructura->idestructura})";
        $params['idproducto'] = implode(',', json_decode($params['idproducto'], true));
        if (!empty($params['idproducto'])) {
            $WHERE .= " AND p.idproducto NOT IN({$params['idproducto']})";
        }
        $params['idindicador'] = implode(',', json_decode($params['idindicador'], true));
        if (!empty($params['idindicador'])) {
            $WHERE .= " AND i.idindicador NOT IN({$params['idindicador']})";
        }
        $addSelect = "";
        if ($params['cantidad']) {
            $addSelect = ",((COALESCE(sum(n.necesidad), 0) * COALESCE({$params['cantidad']},0))/cti.cantidad) as cantidad "; //cantidaddemandada = cantidad
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT ON (2) p.idproducto,
                       i.idindicador,                       
                       i.codigo,
                       i.denominacion,
                       ip.precio,
                       i.idnaturaleza,
                       i.idumedida,
                       um.abreviaturaunidadmedida as um,
                       COALESCE(sum(n.necesidad), 0) as norma,
                       cti.cantidad as cantidadun
                       {$addSelect}
                FROM mod_planifindustrial.dat_cartatecindustrial cti
                     INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctia ON (
                     ctia.idcartatecindustrial = cti.idcartatecindustrial)
                     INNER JOIN mod_planificacion.nom_actividad a ON (ctia.idactividad =
                      a.idactividad)
                     INNER JOIN mod_planificacion.dat_norma n ON (a.idactividad = n.idactividad)
                     INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador =
                      n.idindicador)
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador =
                      i.idindicador and ip.nivelplanif = 1 and ip.idaprobacion = 4)
                      INNER JOIN mod_logistica.dat_producto p ON (i.idindicador =
                      p.idindicador)
                     LEFT JOIN mod_datosmaestros.nom_unidadmedida um ON (i.idumedida =
                      um.idunidadmedida)
                      WHERE cti.idcartatecindustrial = {$params['idcartatecindustrial']} {$WHERE}
                      GROUP BY p.idproducto,
                       i.idindicador,                       
                       i.codigo,
                       i.denominacion,
                       ip.precio,
                       i.idnaturaleza,
                       i.idumedida,
                       um.abreviaturaunidadmedida,
                       n.necesidad,
                       cti.cantidad";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['start'] && $params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function cargarMateriales($params)
    {
       
      $conn = Doctrine_Manager::connection();
$porcorte = " AND (CASE WHEN doc.cronologia > 0 THEN (doc.cronologia > ddd.cronologia) ELSE TRUE END)";
$and = "";
if($params['fechacreacion']){
$and = " and ddd.fechacontable = '{$params['fechacreacion']}' ";
}

$query = " SELECT distinct min(ddd.nrodoc), i.idindicador,
pp.idproducto,
pp.precio as preciocontable,
pp.precioalternativo,
(CASE WHEN i.numeropieza IS NULL OR LENGTH(i.numeropieza) = 0 THEN i.codigo ELSE i.numeropieza END) AS codigo,
i.denominacion,
i.idnaturaleza,
i.idumedida,
um.abreviaturaunidadmedida as um,
(sum(dm.cantidad) - COALESCE((SELECT sum(m.cantidad)
FROM mod_logistica.dat_movimiento m
INNER JOIN mod_logistica.dat_documento dvd on dvd.iddocumento = m.iddocumento
INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dvd.iddoc
INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
INNER JOIN mod_logistica.dat_documentopadre ppvd on ppvd.iddocumento = dvd.iddocumento
INNER JOIN mod_logistica.dat_documento dds on ppvd.idpadre = dds.iddocumento
INNER JOIN mod_logistica.dat_documentopadre ppds on ppds.iddocumento = dds.iddocumento
INNER JOIN mod_logistica.dat_documento dso on ppds.idpadre = dso.iddocumento
INNER JOIN mod_logistica.dat_documentopadre ppso on ppso.iddocumento = dso.iddocumento
WHERE ppso.idpadre = {$params['idordenproduccion']} AND np.abreviatura = 'valedev'
AND dvd.estado = 4 AND m.idproducto = pp.idproducto
GROUP BY ppso.idpadre limit 1),0)) AS cantidad
FROM mod_logistica.dat_documento d
LEFT JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = d.iddocumento
LEFT JOIN mod_logistica.dat_documento dd ON dd.iddocumento = ddp.iddocumento
LEFT JOIN mod_logistica.dat_documentopadre ddpp ON ddpp.idpadre = dd.iddocumento
LEFT JOIN mod_logistica.dat_documento ddd ON ddd.iddocumento = ddpp.iddocumento

LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = ddd.iddocumento
LEFT JOIN mod_logistica.dat_producto pp ON pp.idproducto = dm.idproducto

LEFT JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = ddd.iddoc
LEFT JOIN mod_datosmaestros.nom_indicador i ON pp.idindicador = i.idindicador
LEFT JOIN mod_datosmaestros.nom_unidadmedida um ON (i.idumedida =
um.idunidadmedida)
LEFT JOIN mod_logproduccion.dat_valeproduccion vp ON vp.idordenproduccion = d.iddocumento
LEFT JOIN mod_logistica.dat_documento doc ON doc.iddocumento = vp.idvaleproduccion
WHERE ddd.estado = 4 AND dp.sigla LIKE '%valeLog%' AND pp.idindicador = i.idindicador
AND d.iddocumento = {$params['idordenproduccion']} and vp.idvaleproduccion = {$params['idvaleproduccion']}
{$and}
Group by i.idindicador,
pp.idproducto,
um.abreviaturaunidadmedida,
doc.cronologia";

$data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
return array(
'datos' => $data,
'cantidad' => count($data)
);
}

    public function cargarProductosObtenidos($params)
    {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT p.idvaleproducto,coalesce(i.numeropieza,i.codigo) as codigo, i.denominacion, vp.cantidad,
                p.iddeposito, v.codigo||' - '||v.denominacion as deposito,i.idumedida, 
                um.abreviaturaunidadmedida as um, p.idvaleproduccion,i.idindicador
                FROM mod_logproduccion.dat_valeproductos p
                INNER JOIN mod_logproduccion.dat_valeproduccion vp on vp.idvaleproduccion = p.idvaleproduccion
                INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador 
                INNER JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
                INNER JOIN mod_estructuracomp.v_dametodasestructuras v on v.idestructura = p.iddeposito
                INNER JOIN mod_logproduccion.dat_ordenproduccion op on op.idordenproduccion = vp.idordenproduccion
                WHERE vp.idvaleproduccion = {$params['iddocumento']}
                ORDER BY p.idvaleproducto";
         
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function adicionarProductosExtras($params)
    {
        $collProductos = new Doctrine_Collection('DatValeProductos');
        $productos = json_decode($params['productos'],true);
        $conn = Doctrine_Manager::connection();
        $query = "select cat.idalmacen from mod_logproduccion.dat_valeproduccion vp
                    inner join mod_logproduccion.dat_ordenproduccion dop on dop.idordenproduccion = vp.idordenproduccion
                    INNER JOIN mod_logproduccion.conf_almacenes cat ON dop.idalmacendestino = cat.idconfalmacen AND cat.almacenpt = 1
                    where vp.idvaleproduccion = {$params['idvaleproduccion']}";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($productos as $i => $prod) { 
            $prod['idvaleproduccion'] = $params['idvaleproduccion'];
            $prod['iddeposito'] = $data[0]['idalmacen'];
            if ($prod['idvaleproducto']) {
                $collProductos[$i]->assignIdentifier($prod['idvaleproducto']);
            }
            $collProductos[$i]->synchronizeWithArray($prod);
        }
        if(count($collProductos) > 0){
            $collProductos->save();
        }
    }

    public function eliminarMateriales($params)
    {
        try {
            $query = Doctrine_Query::create()->delete("DatValeMateriaPrima dop");
            $params['id'] = json_decode($params['id'], true);
            if (is_array($params['id'])) {
                $query->whereIn('dop.idmaterialesvaleproduccion', $params['id']);
            } else {
                $query->where('dop.idmaterialesvaleproduccion =?', $params['id']);
            }
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'mensajes' => $e->getMessage(),
                'message' => "Failed removed to record"
            );
        }
    }

    public function adicionarManoObra(DatValeProduccion $record, $params)
    {
        foreach ($params ['manoobra'] as $mat) {
            if ($mat['idmanoobra']) {
                $op = Doctrine::getTable('DatManoObra')
                    ->find($mat['idmanoobra']);
            } else {
                $op = new DatManoObra();
            }
             $op->synchronizeWithArray($mat);
            //print_r($op->toArray());die;
            if ($params['actividades']) {
                $this->adicionarActividad($op, $params['actividades']);
            }
            $record->DatManoObra->add($op);
        }
    }

    public function cargarManoObraAll($params)
    {
        $WHERE_IN_PESONA = "";
        if (!empty($params['idpersonas'])) {
            if (is_array($params['idpersonas'])) {
                $params['idpersonas'] = implode(',', $params['idpersonas']);
            }
            $WHERE_IN_PESONA = " AND dp.idpersona NOT IN({$params['idpersonas']})";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT distinct dp.idpersona,
                       dp.nombre,
                       dp.snombre,
                       dp.papel,
                       dp.sapel,
                       nc.denominacion as cargo
                FROM mod_regimentrabajo.conf_calendariopersona cp
                     INNER JOIN mod_regimentrabajo.nom_turnotrabajo tt on tt.idturnotrabajo =
                      cp.idturnotrabajo
                     INNER JOIN mod_persona.dat_persona dp ON dp.idpersona = cp.idpersona
                     LEFT JOIN mod_persona.dat_personaentidad pe ON cp.idpersona = pe.idpersona
                      AND ((pe.fdesde <= now() AND (now() <= pe.fhasta OR pe.fhasta is null)))
                     LEFT JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad =
                      sl.idpersonaentidad AND ((sl.fdesde <= now() AND (now() <= sl.fhasta OR
                       sl.fhasta is null)))
                     LEFT JOIN mod_estructuracomp.dat_cargo dc ON sl.idcargo = dc.idcargo AND (
                     dc.idproyecto = 0)
                     LEFT JOIN mod_estructuracomp.nom_cargo nc ON dc.idnomcargo = nc.idnomcargo
                WHERE cp.idturnotrabajo = {$params['idturnotrabajo']} {$WHERE_IN_PESONA}";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function cargarManoObra($params)
    {
        if (empty($params['idvaleproduccion'])) {
            $params['idvaleproduccion'] = 0;
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT distinct dp.idpersona,
                       dp.nombre,
                       dp.snombre,
                       dp.papel,
                       dp.sapel,
                       nc.denominacion as cargo,
                       mo.idmanoobra,
                       mo.cantidad,
                       mo.idvaleproduccion
                FROM mod_regimentrabajo.conf_calendariopersona cp
                     INNER JOIN mod_regimentrabajo.nom_turnotrabajo tt on tt.idturnotrabajo =
                      cp.idturnotrabajo
                     INNER JOIN mod_persona.dat_persona dp ON dp.idpersona = cp.idpersona
                     LEFT JOIN mod_persona.dat_personaentidad pe ON cp.idpersona = pe.idpersona
                      AND ((pe.fdesde <= now() AND (now() <= pe.fhasta OR pe.fhasta is null)))
                     LEFT JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad =
                      sl.idpersonaentidad AND ((sl.fdesde <= now() AND (now() <= sl.fhasta OR
                       sl.fhasta is null)))
                     LEFT JOIN mod_estructuracomp.dat_cargo dc ON sl.idcargo = dc.idcargo AND (
                     dc.idproyecto = 0)
                     LEFT JOIN mod_estructuracomp.nom_cargo nc ON dc.idnomcargo = nc.idnomcargo
                       INNER JOIN mod_logproduccion.dat_manoobra mo ON dp.idpersona = mo.idpersona
                WHERE cp.idturnotrabajo = {$params['idturnotrabajo']} AND mo.idvaleproduccion = {$params['idvaleproduccion']}
                ORDER BY mo.idmanoobra";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function eliminarManoObra($params)
    {
        $params['id'] = json_decode($params['id'], true);
        try {
            $query = Doctrine_Query::create()->delete("DatManoObra dop");
            if (is_array($params['id'])) {
                $query->whereIn('dop.idmanoobra', $params['id']);
            } else {
                $query->where('dop.idmanoobra =?', $params['id']);
            }
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'message' => "Failed removed to record"
            );
        }
    }

    public function adicionarActividad(DatManoObra $record, $actividades)
    {
        foreach ($actividades as $mat) {
            if ($mat['idmanoobraactividad']) {
                $op = Doctrine::getTable('DatValeActividad')
                    ->find($mat['idmanoobraactividad']);
            } else {
                $op = new DatValeActividad();
            }
            $op->synchronizeWithArray($mat);

            $record->DatValeActividad->add($op);
        }
    }

    public function cargarActividadAll($params)
    {
        $WHERE = "";
        $params['idcartatecindustrialactividad'] = json_decode($params['idcartatecindustrialactividad'], true);
        if(!empty($params['idcartatecindustrialactividad'])){
            if (is_array($params['idcartatecindustrialactividad'])) {
                $params['idcartatecindustrialactividad'] = implode(',', $params['idcartatecindustrialactividad']);
            }
            $WHERE = " AND ctia.idcartatecindustrialactividad NOT IN({$params['idcartatecindustrialactividad']})";
        }


        $conn = Doctrine_Manager::connection();
        $query = "SELECT  
                       ctia.idcartatecindustrialactividad,
                       a.codigo,
                       a.denominacion
                FROM mod_planifindustrial.dat_cartatecindustrialactividad ctia
                INNER JOIN mod_planificacion.nom_actividad a ON (ctia.idactividad = a.idactividad)
                WHERE  ctia.idcartatecindustrial = {$params['idcartatecindustrial']}  {$WHERE}";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function cargarActividad($params)
    {
        if (empty($params['idmanoobra'])) {
            $params['idmanoobra'] = 0;
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                       moa.idmanoobraactividad, 
                       moa.idmanoobra, 
                       ctia.idcartatecindustrialactividad,
                       moa.horas,
                       a.codigo,
                       a.denominacion
                FROM mod_planifindustrial.dat_cartatecindustrialactividad ctia
                INNER JOIN mod_planificacion.nom_actividad a ON (ctia.idactividad = a.idactividad)
                INNER JOIN mod_logproduccion.dat_manoobraactividad moa ON ctia.idcartatecindustrialactividad =
                      moa.idcartatecindustrialactividad
                WHERE moa.idmanoobra = {$params['idmanoobra']}
                ORDER BY moa.idmanoobraactividad";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function eliminarActividad($params)
    {
        try {
            $query = Doctrine_Query::create()->delete("DatValeActividad dop");
            $params['id'] = json_decode($params['id'], true);
            if (is_array($params['id'])) {
                $query->whereIn('dop.idmanoobraactividad', $params['id']);
            } else {
                $query->where('dop.idmanoobraactividad =?', $params['id']);
            }
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'message' => "Failed removed to record"
            );
        }
    }

    public function adicionarMaquinaria(DatValeProduccion $record, $maquinarias)
    {
        if (!empty($maquinarias)) {
            foreach ($maquinarias as $mat) {
                if ($mat['idvaleequipos']) {
                    $op = Doctrine::getTable('DatValeEquipo')
                        ->find($mat['idvaleequipos']);
                } else {
                    $op = new DatValeEquipo();
                }
                $op->synchronizeWithArray($mat);

                $record->DatValeEquipo->add($op);
            }
        }
    }

    public function cargarMaquinariaAll($params)
    {
        $params['idregistrosExcluir'] = json_decode($params['idregistrosExcluir'], true);
        if ($params['idregistrosExcluir']) {
            $params['idregistrosExcluir'] = implode(',', $params['idregistrosExcluir']);
            $WHERE = "WHERE rna.idregnumerico NOT IN({$params['idregistrosExcluir']})";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT 
                  rn.idregnumerico,
                  i.idindicador,
                  i.codigo,
                  i.idnaturaleza,
                  ih.idgruposubgrupo,
                  i.denominacion,
                  rna.nroinventario, 
                  cfgeq.idconfequipos
                FROM mod_logactivofijotangible.dat_registronumerico rn
                INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                INNER JOIN mod_logproduccion.conf_equipos cfgeq on rn.idregnumerico = cfgeq.idregnumerico
                 {$WHERE}";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function cargarMaquinaria($params)
    {
        $WHERE = "";
        if ($params['idregistrosExcluir']) {
            $params['idregistrosExcluir'] = implode(',', json_decode($params['idregistrosExcluir'], true));
            $WHERE .= "AND rna.idregnumerico NOT IN({$params['idregistrosExcluir']})";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT 
                  rn.idregnumerico,
                  i.idindicador,
                  i.codigo,
                  i.idnaturaleza,
                  ih.idgruposubgrupo,
                  i.denominacion,
                  rna.nroinventario,                
                  ve.idvaleequipos,
                  ve.unidadesproducidas,
                  ve.horastrabajo,
                  cfgeq.idconfequipos,
                  ve.idvaleequipos
                FROM mod_logactivofijotangible.dat_registronumerico rn
                INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
                INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                INNER JOIN mod_logproduccion.conf_equipos cfgeq on rn.idregnumerico = cfgeq.idregnumerico
                INNER JOIN mod_logproduccion.dat_valeequipos ve ON ve.idregnumerico = rna.idregnumerico
                WHERE ve.idvaleproduccion = {$params['idvaleproduccion']} {$WHERE}";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function eliminarMaquinaria($params)
    {
        try {
            $query = Doctrine_Query::create()->delete("DatValeEquipo mq");
            $params['id'] = json_decode($params['id'], true);
            if (is_array($params['id'])) {
                $query->whereIn('mq.idvaleequipos', $params['id']);
            } else {
                $query->where('mq.idvaleequipos =?', $params['id']);
            }
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'message' => "Failed removed to record"
            );
        }
    }
    
    public function eliminarProductosObtenidos($params)
    {
        try {
            $query = Doctrine_Query::create()->delete("DatValeProductos vp");
            $params['id'] = json_decode($params['id'], true);
            if (is_array($params['id'])) {
                $query->whereIn('vp.idvaleproducto', $params['id']);
            } else {
                $query->where('vp.idvaleproducto =?', $params['id']);
            }
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Doctrine_Exception $e) {
            return array(
                'success' => false,
                'message' => $e->getMessage()
            );
        }
        catch (Exception $e) {
            return array(
                'success' => false,
                'message' => $e->getMessage()
            );
        }
    }
    

    public function cargarMaquinariaByIndicador($params)
    {
        if (empty($params['idindicador'])) {
            $params['idindicador'] = 0;
        }
        if ($params['idregistrosExcluir']) {
            $params['idregistrosExcluir'] = implode(',', json_decode($params['idregistrosExcluir'], true));
            $WHERE = "AND rna.idregnumerico NOT IN({$params['idregistrosExcluir']})";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT 
                  rn.idregnumerico,
                  i.codigo,
                  i.denominacion,
                  rna.nroinventario
                FROM  mod_logactivofijotangible.dat_registronumerico rn
                INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
                WHERE i.idindicador = {$params['idindicador']}
                 {$WHERE}";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function convertirFecha($fecha){
        $arrayFecha = explode('/', $fecha);
        return "{$arrayFecha[2]}-{$arrayFecha[1]}-{$arrayFecha[0]}";
    }
    
    public function aprobarDocumento($iddocumento)
    {
        $fechaOP = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            $this->idSubsistema)->fecha;
        $fechaInv = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            10)->fecha;
            
        $fechaOrdenProd = $this->convertirFecha($fechaOP);
        $fechaInvent = $this->convertirFecha($fechaInv);
       
        if($fechaInvent != $fechaOrdenProd){
            throw new LogisticaException('LOG_LB_PRO_002');
        }
         $aprob = parent::aprobarDocumento($iddocumento,true);
        if($aprob){
            $conn = Doctrine_Manager::connection();
            $params['idpadre'] = $iddocumento;
            $params['fecha'] =
      
            $query = "SELECT distinct p.iddeposito as idestructura, op.nrolote, d.fechacontable as fechafabricacion,
                    {$iddocumento} as idpadre, 0 as cantidad,d.nrodoc, d.fechacontable, nc.idnomoperaciones, op.idordenproduccion
                    FROM mod_logproduccion.dat_valeproductos p
                    INNER JOIN mod_logproduccion.dat_valeproduccion vp on vp.idvaleproduccion = p.idvaleproduccion
                    INNER JOIN mod_logproduccion.dat_ordenproduccion op on op.idordenproduccion = vp.idordenproduccion
                    INNER JOIN mod_logistica.dat_documento d on d.iddocumento = op.idordenproduccion
                    LEFT JOIN mod_logdistribucion.nom_concepto nc on nc.idnomconcepto = op.idnomconcepto AND nc.estado = 1
                    INNER JOIN mod_logdistribucion.dat_conceptoentidad dce on dce.idnomconcepto = nc.idnomconcepto
                    WHERE vp.idvaleproduccion = {$iddocumento}
                    ORDER BY p.iddeposito";

            $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            $recepcionService = new RecepcionService();
            
            foreach($data as $dep){
                $params['paramsprod'] = $dep;
                $params['paramsprod']['proceso'] = "produccion";
                $params['idestructuracomun'] = $dep['idestructura'];
                $params['nrodocorigen'] = $dep['nrodoc'];
                $params['fechadocorigen'] = $dep['fechacontable'];
                $params['idoperacion'] = $dep['idnomoperaciones'];
                $params['idordenproduccion'] = $dep['idordenproduccion'];
                

                $docAdd[] = $recepcionService->adicionarDocumento($params);
            }    
            
            
             
        }
        return $docAdd;
    }
}
