<?php

class AnalizadorModel extends BaseModel {

  private $producto, $serviciosIddoc, $arrayIddocs, $serviciosDepositos;

  public function __construct()
  {
      parent::ZendExt_Model();
  }

  public function getDatosPorMedidor($params){
      $idmedidor=$params['idmedidor'];
      $medidorScripts = $this->getMedidores($params);
      $sql = $medidorScripts[$idmedidor]['sql'];
      $sql_total = $medidorScripts[$idmedidor]['sql_total'];
      $conn = Zend_Registry::get('conexion');
      $datos = $conn->execute( $sql)
          ->fetchAll(PDO::FETCH_ASSOC);
          $total = $conn->execute( $sql_total)
          ->fetchAll(PDO::FETCH_ASSOC);
      return array(
          'datos' => $datos,
          'total' => $total[0]['cantidad']
      );
  }

  public function getDatos(){

      $medidores = $this->getMedidores();
      $resp = [];
      $conn = Zend_Registry::get('conexion');

      foreach ($medidores as $key => $value) {
          $datos = $conn->execute($value['sql_total'])->fetchAll(PDO::FETCH_ASSOC);
          $resp[] = array(
              'id' => $value['id'],
              'nombre' => $value['nombre'],
              'cantidad' => $datos[0]['cantidad'] ? $datos[0]['cantidad'] : 0,
              'detalles' => $value['detalles']//,
              /*'problemas' => $value['problemas'],
              'solucion' => $value['solucion']*/
          );
      }
      return $resp;
  }

  public function getMedidores($params){

      $sinClasContable = $this->getSinClasifContable($params);
     // $malClasificado = $this->getMalClasificadoAlmacen($params);
      $existSinprecio = $this->getExistenciaSinPrecio($params);
      $sinExistcnSaldo = $this->getSinExistenciaConSaldo($params);
      $dispoyexistNeg =  $this->getExistenciaDisponibleNeg($params);
     // $depoCerrados = $this->getProdDepositoCerrado($params);
      $invInmo = $this->getInmovilizado($params);
      return array(
          0 => array(
              "id" => 0,
              "nombre" => "PRODUCTOS CON CLASIFICACIÓN CONTABLE SIN USAR EN LA ENTIDAD",
              "detalles" => "Muestra todos los productos que tienen especificado clasificación contable y está deshabilitada.",
              "sql" => $sinClasContable['sql'],
              "sql_total" => $sinClasContable['sql_total']
          ),
        //   1 => array(
        //       "id" => 1,
        //       "nombre" => "PRODUCTOS MAL CLASIFICADOS SEGUN ALMACEN",
        //       "detalles" => "Muestra todos los productos cuyo código del ultimo nivel de la clasificación contable no se corresponda con el código del almacén de donde se encuentre el producto.",
        //       "sql" =>  $malClasificado['sql'],
        //       "sql_total" => $malClasificado['sql_total']
        //   ),
          2 => array(
               "id" => 2,
              "nombre" => "PRODUCTOS CON EXISTENCIA SIN PRECIO",
              "detalles" => "Muestra todos los productos que tienen existencia pero que el precio es 0.",
              "sql" =>  $existSinprecio['sql'],
              "sql_total" => $existSinprecio['sql_total']
          ),
          3 => array(
             "id" => 3,
             "nombre" => "PRODUCTOS SIN EXISTENCIAS CON SALDOS",
             "detalles" => "Muestra todos los productos que tienen existencia 0 pero tienen saldo.",
             "sql" =>  $sinExistcnSaldo['sql'],
             "sql_total" => $sinExistcnSaldo['sql_total']
          ),
          4 => array(
              "id" => 4,
              "nombre" => "PRODUCTOS CON DISPONIBLE Y EXISTENCIA NEGATIVO",
              "detalles" => "Muestra todos los productos que tienen existencia y disponible negativo.",
              "sql" =>  $dispoyexistNeg['sql'],
              "sql_total" => $dispoyexistNeg['sql_total']
          ),
        /*  5 => array(
              "id" => 5,
              "nombre" => "PRODUCTOS EN DEPÓSITOS CERRADOS",
              "detalles" => "Productos que quedaron con existencia en depósitos cerrados.",
              "sql" =>  $depoCerrados['sql'],
              "sql_total" => $depoCerrados['sql_total']
          ),*/
          6 => array(
            "id" => 6,
            "nombre" => "INVENTARIO INMOVILIZADO",
            "detalles" => "Muestra agrupado por depósito :
            	Cantidad de documentos: Cantidad total de distribuciones entre estado de elaboración, preparado y aprobado que no han sido cumplimentadas.
            	Cant. Elaboración: Cantidad de distribuciones en elaboración que poseen productos con cantidades registradas.
            	Cant. Preparado: Cantidad de distribuciones en estado de preparado.
            	Aprobados no cumplimentados: Cantidad de distribuciones aprobadas que no han sido cumplimentadas.
                Cant. de productos: Cantidad de productos no repetidos que aparecen en todas estas distribuciones.
            	Importe inmovilizado: Sumatoria de los importes de todas las distribuciones en estado de elaboración, preparado y aprobado que no han sido cumplimentadas.
            	Importe inventario: Importe del submayor de inventario del depósito.
            	% que representa el importe inmovilizado con respecto al Importe del submayor de inventario.
            ",
            "sql" =>  $invInmo['sql'],
            "sql_total" => $invInmo['sql_total']
        )
      );
  }
  public function filtro($params,$sql){
    $conn = Zend_Registry::get('conexion');
      if($params['criterio']){
          $sql .= " AND (
              query.codigo ILIKE '%{$params['criterio']}%'
              OR query.denominacion ILIKE '%{$params['criterio']}%'
          ) ";
      }
      if($params['codigo']){
          $sql .= " AND ( query.codigo ILIKE '%{$params['codigo']}%') ";
      }
      if($params['estructura']){
          $sql .= " AND ( query.estructura  ILIKE '%{$params['estructura']}%' ) ";
      }
      if($params['denominacion']){
          $sql .= " AND  query.denominacion ILIKE '%{$params['denominacion']}%' ";
      }
      if($params['naturaleza']){
          $sql .= " AND  query.idnaturaleza = {$params['naturaleza']} ";
      }
      if($params['iddepositos']){
        //print_r('hjyh');die;
        $sql .= " AND  query.iddeposito IN({$params['iddepositos']}) ";
    }

      $start = ($params['start']) ? $params['start'] : 0;
      $limit = ($params['limit']) ? $params['limit'] : 30;
    $sql_total = "SELECT COUNT(sub.*) AS cantidad FROM ($sql) sub ";
      //$sql_total = "52";

      $sql .= "limit $limit";
      $sql .= " offset $start";

   /* if($params['limit'] && $params['start'] >= 0 ){
         $sql .= " limit {$params['limit']} offset {$params['start']}
          ";
      }*/
     // $result = $conn->fetchAll($sql);
     // print_r($result);die;
       return array(
          'sql' => $sql,
          "sql_total" => $sql_total
      );
  }

  public function getSinClasifContable($params){

    $depositosEntidad = $this->loadDepositos($params, true);

    $sql = "select * from( SELECT distinct
    p.idproducto,
    p.idestructura,
    COALESCE(i.numeropieza, i.codigo) as codigo,
    i.denominacion,
    um.abreviaturaunidadmedida as um,
    n.denominacion as naturaleza,
    n.idnaturaleza,
    p.disponible,
    p.cantidad as existencia,
    p.precio as precio,
    coalesce(p.importe,0) as importe,
    ncc.denominacion as clasificacioncontable,
   (select codigo ||' '|| denominacion from mod_estructuracomp.dat_estructuraop where idproyecto = 0
   and idestructuraop = d.idestructuracomun) as entidad,
    (select codigo ||' '|| denominacion from mod_estructuracomp.dat_estructuraop where idproyecto = 0
   and idestructuraop = p.idestructura) as deposito,
   (
    select idestructuraop
    from mod_estructuracomp.dat_estructuraop
    where idproyecto = 0 and
          idestructuraop = p.idestructura
  ) as iddeposito

  FROM mod_logistica.dat_documento d
  INNER JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = d.iddocumento
  INNER JOIN mod_logistica.dat_producto p ON p.idproducto = dm.idproducto
  LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
  LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
  LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
  INNER JOIN mod_logistica.nom_clasificacioncontable ncc on ncc.idclasificacioncontable = p.idclasificacioncontable
  LEFT  JOIN mod_logistica.dat_clasificacioncontableentidad dce on dce.idclasificacioncontable = ncc.idclasificacioncontable
  WHERE p.idclasificacioncontable not in
  (Select dce1.idclasificacioncontable From mod_logistica.dat_clasificacioncontableentidad dce1 where dce1.idestructuracomun IN ({$this->global->Estructura->idestructura}))
  and p.idestructuracomun IN ({$this->global->Estructura->idestructura}) AND p.cantidad > 0 AND (p.idestructura in ({$depositosEntidad}))
  Group by p.idestructura,p.idproducto,i.numeropieza,i.codigo,i.denominacion,um.abreviaturaunidadmedida,n.denominacion,n.idnaturaleza,ncc.denominacion,d.idestructuracomun
   Order by p.idestructura
  )query where true ";

    return $this->filtro($params,$sql);
  }

  public function getExistenciaSinPrecio($params){
    $depositosEntidad = $this->loadDepositos($params, true);

      $sql = "
     Select * from(  Select
     p.idproducto,
     COALESCE(i.numeropieza, i.codigo) as codigo,
     i.denominacion,
     um.abreviaturaunidadmedida as um,
     n.idnaturaleza,
     n.denominacion as naturaleza,
     p.disponible,
     p.cantidad as existencia,
     p.precio as precio,
    p.importe as importe,
     ncc.denominacion as clasificacioncontable,
      (select codigo ||' '|| denominacion from mod_estructuracomp.dat_estructuraop where idproyecto = 0
     and idestructuraop = p.idestructura) as deposito,
     (
      select idestructuraop
      from mod_estructuracomp.dat_estructuraop
      where idproyecto = 0 and
            idestructuraop = p.idestructura
    ) as iddeposito
     from mod_logistica.dat_producto p
      LEFT JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = p.idestructura
     LEFT JOIN mod_logistica.dat_movimiento dm ON dm.idproducto = p.idproducto
     INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
     LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
     LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
     Left JOIN mod_logistica.nom_clasificacioncontable ncc on ncc.idclasificacioncontable = p.idclasificacioncontable
    LEFT JOIN mod_contabilidad.nom_cuenta nc on nc.idcuenta = ncc.idcuenta
     WHERE p.cantidad > 0 and p.precio is null
     AND (p.idestructura in ({$depositosEntidad})) and p.idestructuracomun IN ({$this->global->Estructura->idestructura})
     Group by p.idestructura, p.idproducto,i.numeropieza,i.codigo,i.denominacion,um.abreviaturaunidadmedida,n.denominacion,n.idnaturaleza,ncc.denominacion
      Order by p.idestructura
     )query where true " ;

          return $this->filtro($params,$sql);
      }

  public function getSinExistenciaConSaldo($params){

       $depositosEntidad = $this->loadDepositos($params, true);
    $sqlWhere .= " AND (query.iddeposito in ({$depositosEntidad})) ";
      $sql = "Select * from(
        Select
        p.idproducto,
        COALESCE(i.numeropieza, i.codigo) as codigo,
        i.denominacion,
        um.abreviaturaunidadmedida as um,
        n.idnaturaleza,
        n.denominacion as naturaleza,
        p.disponible,
        p.cantidad as existencia,
        p.precio as precio,
        p.importe as importe,
   		ncc.denominacion as clasificacioncontable,
    (select codigo ||' '|| denominacion from mod_estructuracomp.dat_estructuraop where idproyecto = 0
   and idestructuraop = p.idestructura) as deposito,
   (
    select idestructuraop
    from mod_estructuracomp.dat_estructuraop
    where idproyecto = 0 and
          idestructuraop = p.idestructura
  ) as iddeposito

        from mod_logistica.dat_producto p
         LEFT JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = p.idestructura
        LEFT JOIN mod_logistica.dat_movimiento dm ON dm.idproducto = p.idproducto
        INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
        LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
        LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
        Left JOIN mod_logistica.nom_clasificacioncontable ncc on ncc.idclasificacioncontable = p.idclasificacioncontable
        LEFT JOIN mod_contabilidad.nom_cuenta nc on nc.idcuenta = ncc.idcuenta
        WHERE p.cantidad is null and p.importe > 0
        AND (p.idestructura in ({$depositosEntidad}))
        and p.idestructuracomun IN ({$this->global->Estructura->idestructura})
        Group by p.idestructura, p.idproducto,i.numeropieza,i.codigo,i.denominacion,um.abreviaturaunidadmedida,n.denominacion,n.idnaturaleza,ncc.denominacion
        Order by p.idestructura
        )query where true ";
      return $this->filtro($params,$sql);

  }
  public function getExistenciaDisponibleNeg($params){

    $depositosEntidad = $this->loadDepositos($params, true);

      $sql = "Select * from (Select
      p.idproducto,
      COALESCE(i.numeropieza, i.codigo) as codigo,
      i.denominacion,
      um.abreviaturaunidadmedida as um,
      n.idnaturaleza,
      n.denominacion as naturaleza,
      p.cantidad -(select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = p.idproducto) as disponible,
      p.cantidad as existencia,
      p.precio as precio,
      p.importe as importe,
    ncc.denominacion as clasificacioncontable,
    (select codigo ||' '|| denominacion from mod_estructuracomp.dat_estructuraop where idproyecto = 0
     and idestructuraop = p.idestructura) as deposito,
     (
      select idestructuraop
      from mod_estructuracomp.dat_estructuraop
      where idproyecto = 0 and
            idestructuraop = p.idestructura
    ) as iddeposito

      from mod_logistica.dat_producto p
       LEFT JOIN mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = p.idestructura
      LEFT JOIN mod_logistica.dat_movimiento dm ON dm.idproducto = p.idproducto
      INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
      LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
      LEFT JOIN mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = i.idnaturaleza
      Left JOIN mod_logistica.nom_clasificacioncontable ncc on ncc.idclasificacioncontable = p.idclasificacioncontable
      LEFT JOIN mod_contabilidad.nom_cuenta nc on nc.idcuenta = ncc.idcuenta

      WHERE (
        (p.cantidad -(select coalesce(sum(cantidad),0) from mod_logistica.dat_cantidadcomprometida where estado = 1 and idproducto = p.idproducto) < 0 or p.cantidad < 0)
      AND (deop.idestructuraop in ({$depositosEntidad}))
       and p.idestructuracomun IN ({$this->global->Estructura->idestructura}))
      Group by deop.idestructuraop, p.idproducto,i.numeropieza,i.codigo,i.denominacion,um.abreviaturaunidadmedida,n.denominacion,n.idnaturaleza,ncc.denominacion
      Order by deop.idestructuraop
     )query where true
      " ;

      return $this->filtro($params,$sql);
  }
  public function getInmovilizado($params){
    $depositosEntidad = $this->loadDepositos($params, true);
    $depositos = 'array[' . ( $depositosEntidad) . ']';

    $idperiodo = $this->global->Periodo->periodoactual;
    $idestructura = $this->global->Estructura->idestructura;

    $sql = "Select * from(
        SELECT * from mod_loginventario.f_inventarioinmovilizado (
            $depositos,
            $idestructura,
            $idperiodo)
        )query where true ";

      return $this->filtro($params,$sql);

  }
  public function loadDepositos($params, $filtro = false) {
    $entidad = $this->global->Estructura->idestructura;
    $depositosEntidad = $this->estructuraHelper->obtenerEstructurasNoFormalesPorEntidad($entidad);

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
    $sql ='';
    $sqlWhere = "";

    $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;

    if($params['idnaturaleza']){
        $sqlWhere = " AND (nn.idnaturaleza = '{$params['idnaturaleza']}') ";
    }
    if($params['denominacion']){
        $sqlWhere .= " AND (
            i.denominacion ILIKE '%{$params['denominacion']}%'
         ) ";
    }
    if($params['criterio']){
        $sqlWhere .= " AND (
           i.codigo ILIKE '%{$params['criterio']}%'
            OR i.denominacion ILIKE '%{$params['criterio']}%'
        ) ";
    }
        $sql = " SELECT DISTINCT
        i.codigo as codigo,
        i.idumedida,
        um.abreviaturaunidadmedida as um,
        i.denominacion,
        dpo.cantidad,
        dpo.idproducto,
        p.importe,
        count (1) over() as cantidadtotal
        FROM mod_logistica.dat_documento d
          LEFt JOIN mod_logdistribucion.dat_distribucion ddist ON ddist.iddistribucion = d.iddocumento
          LEFt JOIN mod_logdistribucion.dat_prodorden dpo on dpo.idorden = d.iddocumento
          LEFt JOIN mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
          INNER JOIN mod_logistica.dat_producto p on p.idproducto = dpo.idproducto
          LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
          LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
        WHERE d.iddocumento = '{$params['iddocumento']}' ".$sqlWhere.
                "GROUP BY i.numeropieza,i.codigo,i.denominacion,i.idumedida,um.abreviaturaunidadmedida,dpo.cantidad,dpo.idproducto,p.importe
                    "
        ;
        $sql .= "limit $limit";
        $sql .= " offset $start";

        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $result[0]['cantidadtotal']);
}

public function listarDocumentos($params){
    $idperiodo = $this->global->Periodo->periodoactual;

    $conn = Zend_Registry::get('conexion');
    $start = ($params['start']) ? $params['start'] : 0;
    $limit = ($params['limit']) ? $params['limit'] : 30;
    $sql ='';
    $sqlWhere = "";
    if($params['estado']){
            $sqlWhere = " AND (doc.estado = '{$params['estado']}') ";

        }
        if($params['criterio']){
            $sqlWhere .= " AND (
                doc.numeroref  = '{$params['criterio']}'
            ) ";
        }

        $sql = " Select 
        dpo.idorden,doc.iddocumento,
        doc.numeroref,
        doc.fechacontable as fecha,
        doc.estado,
        (CASE WHEN dpoc.pendiente = dpo.cantidad THEN 'En proceso'
        When dpoc.entregado < dpo.cantidad THEN 'No procesado'
        Else null
        END)as estadoejecucion,
        (SELECT SUM(dp1.precio * dpo1.cantidad)
        FROM mod_logdistribucion.dat_prodorden dpo1
        INNER JOIN mod_logistica.dat_producto dp1 on dp1.idproducto = dpo1.idproducto
        WHERE dpo1.idorden = dpo.idorden
         ) as importe,
         count (*) over() as cantidad
        FROM
         mod_logdistribucion.dat_prodorden dpo
         INNER JOIN mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
         INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto
         INNER JOIN mod_logistica.dat_documento doc on doc.iddocumento = dpo.idorden
         INNER JOIN mod_estructuracomp.dat_estructuraop deop ON deop.idproyecto = 0
          and deop.idestructuraop = dp.idestructura
       WHERE
         dpo.cantidad > 0 and (dpoc.pendiente = dpo.cantidad OR
         dpoc.entregado < dpo.cantidad) AND
         dp.idestructura IN ('{$params['iddeposito']}') AND
         /*doc.idperiodo IN ($idperiodo) and*/
         doc.estado in (1, 2, 3)
         group by 1,2,3,4,5,6,7"
         ;

         $sql .= "limit $limit";
         $sql .= " offset $start";

        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $result[0]['cantidad']);


}

}
