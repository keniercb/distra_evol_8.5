<?php

/**
 *  Esta clase
 * @copyright XETID
 * @author Division de Gestion de Entidades
 * @version 1.0
 */
class HojasconteoModel extends RecuperacionesInventarioModel {

    private $producto, $serviciosIddoc, $arrayIddocs, $serviciosDepositos;

    public function __construct() {

        parent::__construct();
        $this->producto = new LogisticaProductoModel();
        $this->serviciosIddoc = LogisticaDocumentosHelper::__init();
        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
        $this->arrayIddocs = array();
    }
   
    
    public function cargarHojasconteo($params){
        //print_r($this->global->Periodo->periodoactual);die;
        $conn = Zend_Registry::get('conexion');
        $start = ($params['start']) ? $params['start'] : 0;
         $limit = ($params['limit']) ? $params['limit'] : 30;
        $sqlWhere = " ";
     
      if(($params['fechainicio']) || ($params['fechafin'])){
        if($params['fechainicio'] && !$params['fechafin']){
            $sqlWhere .= " AND (d.fechacontable >= '{$params['fechainicio']}'::date) ";
        } else if($params['fechafin'] && !$params['fechainicio']){
            $sqlWhere .= " AND (d.fechacontable <= '{$params['fechafin']}'::date) ";
        } else {
            $sqlWhere .= " AND (d.fechacontable BETWEEN '{$params['fechainicio']}'::date AND '{$params['fechafin']}'::date) ";
        }       
      } else {
          $sqlWhere .= "AND d.idperiodo IN ({$this->global->Periodo->periodoactual})";
      }
     
      
     if($params['estructura'] && !$params['checkDeposito']){
        $sqlWhere .= " AND des.idestructuracomun in ({$params['estructura']}) ";
     } else {
        $sqlWhere .= " AND des.idestructuracomun in ({$this->global->Estructura->idestructura}) ";
     }
      if(($params['iddepositos']) && !$params['checkDeposito']){
        $sqlWhere .= " AND d.idestructuracomun IN ({$params['iddepositos']}) ";
    }
    if(($params['estado'])){
        $sqlWhere .= " AND d.estado IN ({$params['estado']}) ";
    }
    if(($params['idnaturaleza'])){
        $sqlWhere .= " AND (nn.idnaturaleza = '{$params['idnaturaleza']}') ";
    }
    if(($params['idproductos'])){
        $sqlWhere .= " AND (dp.idproducto IN( '{$params['idproductos']}')) ";
    }
   
    if($params['tipoinventario']){
        $valor = array_sum($params['tipoinventario']);
        
        if($valor == 1){
            array_push($sqlWhere.= " AND di.tipoinventario = 1 ");
        } else if($valor == 2){
            array_push($sqlWhere.= "AND di.tipoinventario = 2 ");
        }
         else if($valor == 3){
            array_push($sqlWhere.= "AND di.tipoinventario = 3 ");
        }
        else if($valor == 4){
            array_push($sqlWhere.= "AND di.tipoinventario = 4 ");
        }
       
    }
      if(($params['checkDeposito'] == 1)){
        $depositosEntidad = $this->loadDepositos($params, true);  
        $sqlWhere .= " AND (d.idestructuracomun in ({$depositosEntidad})) ";

        //$sqlWhere .= " AND (d.idestructuracomun in (SELECT e.idestructura FROM mod_estructuracomp.v_dametodasestructuras e)) ";
    }



$sql = "with 
w_importetotal_doc as (select sum(dm.importecontable) as importetotal, dm.iddocumento from mod_logistica.dat_movimiento dm
group by dm.iddocumento),

w_productos_doc as (select count (*) as productos, m.iddocumento from mod_logistica.dat_movimiento m 
group by m.iddocumento)
Select 
distinct d.fechacontable, 
(select codigo ||' '|| denominacion as deposito from mod_estructuracomp.dat_estructuraop where idproyecto = 0
and idestructuraop = d.idestructuracomun) as deposito,
d.nrodoc as nrodoc, d.numeroref, d.iddocumento,

(case when (select dea.estado 
from mod_estructuracomp.nom_filaestruc nf 
inner join mod_logistica.dat_estadoalmacen dea on dea.iddeposito = nf.idfila 
where nf.idfila = d.idestructuracomun) = 1 
then 'Abierto' 
else 'Cerrado' 
end
) as estadoop,

(case when di.tipoinventario = 1 then 'Inventario diario'
when di.tipoinventario = 2 then 'Inventario mensual'
when di.tipoinventario = 3 then 'Inventario parcial'
when di.tipoinventario = 4 then 'Inventario general' 
else null 
end
) as tipoinventario,

(case when d.estado = 1 then 'Elaboración'
when d.estado = 2 then 'Preparado'
when d.estado = 3 then 'Aprobado'
when d.estado = 5 then 'Eliminado'
when d.estado = 7 then 'Cancelado'
when d.estado = 9 then 'Cerrado'
else null 
end
) as estado,

w_prod_doc.productos,
(Select 
his.fechacontable
   from mod_logistica.his_bitacora his 
   where his.operacion ilike 'Documento adicionado' and his.iddocumento = d.iddocumento
   group by his.iddocumento, his.fechacontable
   order by his.fechacontable limit 1)as fechaadicionado,
deop.codigo ||' '|| deop.denominacion as denominacion,

(case when d.estado = 3 then d.fechacontable else null end) as fechaaprobado,

(case
 when d.estado = 3 then (select d.fechacontable -(Select 
his.fechacontable
   from mod_logistica.his_bitacora his 
   where his.operacion ilike 'Documento adicionado' and his.iddocumento = d.iddocumento
   group by his.iddocumento, his.fechacontable
   order by his.fechacontable limit 1)
 )else ((  Select current_date
 ) - (Select 
his.fechacontable
   from mod_logistica.his_bitacora his 
   where his.operacion ilike 'Documento adicionado' and his.iddocumento = d.iddocumento
   group by his.iddocumento, his.fechacontable
   order by his.fechacontable limit 1)) end ) as dif,

   (CASE WHEN d.estado = 3
   THEN (SELECT  ROUND(SUM(ROUND(dm1.importecontable, 2)), 2) 
  FROM mod_logistica.dat_documento doc 
  INNER JOIN mod_loginventario.dat_ajuste da ON doc.iddocumento = da.idajuste 
  LEFT JOIN mod_logistica.dat_documento dd2 ON (dd2.iddocumento = da.idinventario) 				 
  INNER JOIN mod_logistica.dat_movimiento dm1 on (dm1.iddocumento = doc.iddocumento)
  INNER JOIN mod_datosmaestros.nom_operacion no on no.idnomoperaciones = doc.idoperacion
  
  Where  da.idinventario = d.iddocumento and no.codigooperacion ilike 'OPER_INV_FALTANTE' 
  )
   ELSE null
   END)as importefaltante,
   
   (CASE WHEN d.estado = 3
   THEN (SELECT  ROUND(SUM(ROUND(dm1.importecontable, 2)), 2) 
  FROM mod_logistica.dat_documento doc 
  INNER JOIN mod_loginventario.dat_ajuste da ON doc.iddocumento = da.idajuste 
  LEFT JOIN mod_logistica.dat_documento dd2 ON (dd2.iddocumento = da.idinventario) 				 
  INNER JOIN mod_logistica.dat_movimiento dm1 on (dm1.iddocumento = doc.iddocumento)
  INNER JOIN mod_datosmaestros.nom_operacion no on no.idnomoperaciones = doc.idoperacion
  
  Where  da.idinventario = d.iddocumento and no.codigooperacion ilike 'OPER_INV_SOBRANTE' 
  )
   ELSE null
   END)as importesobrante,

w_imptotal_doc.importetotal,
(Select vd.idestructura FROM mod_estructuracomp.v_dametodasestructuras vd Where vd.idestructura IN({$this->global->Estructura->idestructura})) as idestructura,
(Select vde.denominacion FROM mod_estructuracomp.v_dametodasestructuras vde Where vde.idestructura IN({$this->global->Estructura->idestructura}))as estructura,

count(1) over() as cantidad
from mod_logistica.dat_documento as d 
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = d.iddoc
left join w_productos_doc as w_prod_doc on w_prod_doc.iddocumento = d.iddocumento
left join w_importetotal_doc as w_imptotal_doc on w_imptotal_doc.iddocumento = d.iddocumento
inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
inner join mod_loginventario.dat_inventario di on d.iddocumento = di.idinventario
inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
INNER Join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = d.idestructuracomun

LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = d.iddocumento
LEFT JOIN mod_logistica.dat_producto dp ON dp.idproducto = dm.idproducto
LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador 
Left JOIN mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = i.idnaturaleza




WHERE ndp.abreviatura = 'inventariogLog'"
 .$sqlWhere. "GROUP BY deop.denominacion,d.fechacontable,d.nrodoc,d.numeroref,d.iddocumento,di.tipoinventario,w_prod_doc.productos,
 w_imptotal_doc.importetotal,deop.codigo,deop.codigo ||' '|| deop.denominacion
	 ORDER BY deop.codigo ||' '|| deop.denominacion,d.iddocumento DESC ";

     $sql .= "limit $limit";
     $sql .= " offset $start";

     $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
     $fechaActual = date('d/m/Y');

    
     return array('datos' => $datos, 'cantidad' => $datos[0]['cantidad'], 'periodo'=> $this->global->Periodo->periodoactual, 'alldepositos'=> ($params['checkDeposito'] == 1) ? $depositosEntidad : null);
    }

    public function getEstructuras() {
        $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        return array('datos'=>$estructuras, 'cantidad'=>count($estructuras));
    }

    public function loadDepositos($params, $filtro = false) {
        $entidad = $this->global->Estructura->idestructura;
        if ($params['estructura']) {
            $depositosEntidad = $this->estructuraHelper->obtenerEstructurasNoFormalesPorEntidad($params['estructura']);
        }else{
            $depositosEntidad = $this->estructuraHelper->obtenerEstructurasNoFormalesPorEntidad($entidad); 
        }

            
        foreach ($depositosEntidad as &$dep1) {
            if($dep1->denominacion && $dep1->codigo){
               $dep1->denominacion = ($dep1->codigo. ' ' .$dep1->denominacion);
            }
        }

        if($filtro) {
            $depositos = array();
            foreach ($depositosEntidad as $dep) {
                array_push($depositos, $dep->idestructura);
                $arrayDepositos = implode(",", $depositos);  
            }
            return $arrayDepositos;
        }

         return array('datos'=>$depositosEntidad, 'cantidad'=>count($depositosEntidad));
     }
    public function listarproductos($params){
        $conn = Zend_Registry::get('conexion');
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $sql ='';
        $sqlWhere = "";
        if($params['idnaturaleza']){
            $sqlWhere .= " AND (nn.idnaturaleza = '{$params['idnaturaleza']}') ";
        }
        if($params['text']){
            $sqlWhere .= " AND (i.denominacion ILIKE '%{$params['text']}%') ";
        }
        if($params['codigo']){
            $sqlWhere.= " AND (i.codigo ILIKE '%{$params['codigo']}%')";
        }
       if($params['codigoproveedor']){
            $sqlWhere .= " AND (i.numeropieza ILIKE '%{$params['codigoproveedor']}%') ";
        }
      
      
            $sql = " SELECT i.numeropieza as codigoproveedor, i.codigo as codigo, i.denominacion as text, (CASE WHEN (tp.cantidad >= 0) THEN tp.cantidad ELSE -1 END)as conteo, i.idumedida, 
                        um.abreviaturaunidadmedida as umedida, i.idindicador,nn.denominacion as naturaleza,dp.idproducto, count (1) over() as cantidad
                        FROM mod_logistica.dat_documento doc 
                    LEFT JOIN mod_logistica.dat_movimiento tp ON tp.iddocumento = doc.iddocumento
                    LEFT JOIN mod_logistica.dat_producto dp ON dp.idproducto = tp.idproducto
                    LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador 
                    LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
                    Left JOIN mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = i.idnaturaleza
                    where doc.iddocumento = '{$params['iddocumento']}' ".$sqlWhere.
                    "GROUP BY nn.denominacion,i.numeropieza,i.codigo,i.denominacion,tp.cantidad,i.idumedida,um.abreviaturaunidadmedida,i.idindicador,dp.idproducto
                     ORDER BY nn.denominacion " 
            ;

            $sql .= "limit $limit";
            $sql .= " offset $start";

        $result = $conn->fetchAll($sql);
      
    return array('datos' => $result, 'cantidad' => $result[0]['cantidad']);
    }
    public function crearExcelHojaconteo($params)
   {
    mkdir('tmp');
    $fecha = date("y.m.d");
    $fichero = "tmp/listado_hojasdeconteo_{$fecha}.xls";
    $excel = new ExcelWriter($fichero);
    $data = $this->cargarHojasconteo(['start' => 0,'limit' => 1]);
    $cantidadTotal = $data['cantidad'];
    $aumento = 10000;
    $columns = array(  
        array('header' => '<b>No.de hoja de conteo </b>', 'dataIndex' => 'numeroref'),
        array('header' => '<b>Depósito </b>', 'dataIndex' => 'deposito'),
        array('header' => '<b>Fecha de apertura</b>', 'dataIndex' => 'fechaadicionado'),
        array('header' => '<b>Fecha de aprobación</b>', 'dataIndex' => 'fechaaprobado'),
        array('header' => '<b>Días diferencia</b>', 'dataIndex' => 'dif'),
        array('header' => '<b>Tipo conteo</b>', 'dataIndex' => 'tipoinventario'),           
        array('header' => '<b>Total de items</b>', 'dataIndex' => 'productos'),
        array('header' => '<b>Importe costo total</b>', 'dataIndex' => 'importetotal'),
        array('header' => '<b>Importe sobrante</b>', 'dataIndex' => 'importesobrante'), 
        array('header' => '<b>Importe faltante</b>', 'dataIndex' => 'importefaltante'),
        
    );

    foreach ($columns as $col) {
        $excel->writeCol($col['header']);
       }
    $excel->writeRow();

    for ($i=0; $i < $cantidadTotal; $i = $i + $aumento) { 
        $datos = $this->cargarHojasconteo([
            'start' => $i,
            'limit' => $aumento
        ])['datos'];
        $this->crearExcel($columns,$datos, $excel);
    }

    $excel->close();
    return '/logistica/inventario/recuperaciones/' . $fichero;
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

}
