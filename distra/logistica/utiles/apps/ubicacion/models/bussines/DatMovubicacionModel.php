<?php

class DatMovubicacionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addDqlCantidadEnMovimientosUbicacion(Doctrine_Query $query, $aliasExternoProd, $aliasLocal = 'mv')
    {
        return $query->addSelect(
            "(SELECT SUM({$aliasLocal}.cantidad) FROM DatMovubicacion $aliasLocal,
                                        {$aliasLocal}.DatMovubicacionproducto dmv,dmv.DatMovimientos dtm
                                         where dtm.idproducto = {$aliasExternoProd}.idproducto) as cantidadubicada"
        );
    }

    /**
     * Funcion que permite ubicar los productos de una factura con documento de origen
     *
     * @param array $parametros Arreglo con parametros necesarios
     *                          para ubicar los productos
     *
     * @return void
     */
    public function ubicarProductosDocOrigen($parametros)
    {
        $objServiceDistrib = new DistribucionService();
        $collectionMU = new Doctrine_Collection('DatMovubicacion');
        foreach ($parametros['movimientos'] as $i => &$value) {
            $parametros['idproducto'] = $value['idproducto'];
            $datosProdorden = $objServiceDistrib->devolverCantidadPendiente($parametros);
            $areas = $datosProdorden[0]['DatProdordenarea'];
            foreach ($areas as $i => $area) {
                if ($value['cantidad'] == 0) {
                    break;
                }
                $guiaArea = $area['ordenadoarea'];
                $ubicaciones = UtilesubicacionService::cargarUbicacionesProducto(
                    array(
                        'idproducto' => $value['idproducto'],
                        'idarea'     => $area['DatAreaproducto']['idarea']
                    )
                );
                foreach ($ubicaciones['datos'] as $ubicacion) {
                    if ($guiaArea == 0) {
                        break;
                    }
                    $limiteUbic = $ubicacion['cantidad'];
                    $cantidad = (($value['cantidad'] < $limiteUbic) ? $value['cantidad'] : $limiteUbic);
                    if ($cantidad != 0) {
                        $mUbicacion = new DatMovubicacion();
                        if ($cantidad < $guiaArea) {
                            $guiaArea -= $cantidad;
                        } else {
                            $cantidad = $guiaArea;
                            $guiaArea = 0;
                        }
                        $mUbicacion->synchronizeWithArray(
                            array(
                                'idestructuraubicacion' => $ubicacion['idestructuraubicacion'],
                                'idmovimiento'          => $value['idmovimiento'],
                                'cantidad'              => $cantidad
                            )
                        );
                        $collectionMU->add($mUbicacion);
                    }
                    $value['cantidad'] -= $cantidad;
                }
            }
        }
        $collectionMU->save();
    }

    /* public function ubicarMovimiento($idproducto, $idubicacion, $cantidad, $validar, $estado)
      {
      $val = -1;
      if ($validar == 'true' && $estado != 'Indefinido') {

      $val = self::validarParametros($idproducto, $idubicacion);
      }

      if ($val == -1 || $estado == 'Indefinido') {
      $cantidadubicadas = DatMovubicacion::devolverCantidadUbicadaP(
      $idproducto
      );
      $cantidadu = $cantidadubicadas[0]['cantidadubicada'];
      if ($cantidadu == '') {
      $cantidadu = 0;
      }
      // a partir de que movieminto voy a empezar a ubicar
      $movimientos = DatMovimientos::devolverMovimientosProducto(
      $idproducto
      );

      $aux = 0;
      foreach ($movimientos as $key => $value) {
      if ($cantidadu >= $value['cantidad']) {
      $cantidadu = $cantidadu - $value['cantidad'];
      } else {

      $resultado[$aux]['idmovimiento'] = $value['idmovimiento'];
      $resultado[$aux]['cantidad'] = $value['cantidad'];

      $aux = $aux + 1;
      }
      }

      $resultado[0]['cantidad'] = $resultado[0]['cantidad'] - $cantidadu;

      $i = 0;
      //mientras que haya que ubicar voy ubicando por los movimientos
      while ($cantidad != 0) {

      $val = DatMovubicacion::existeProductoMov(
      $idubicacion, $resultado[$i]['idmovimiento']
      );
      if ($cantidad > $resultado[$i]['cantidad']) {

      $idmovimiento = $resultado[$i]['idmovimiento'];

      if ($val[0]['idmovubicacion'] != null) {

      $this->actualizarMovimiento(
      $val[0]['idmovubicacion'], $resultado[$i]['cantidad']
      );
      } else {
      $this->adicionarMovimiento(
      $resultado[$i]['cantidad'], $idubicacion, $idmovimiento
      );
      }

      $cantidad = $cantidad - $resultado[$i]['cantidad'];
      $i++;
      } else {

      $idmovimiento = $resultado[$i]['idmovimiento'];

      if ($val[0]['idmovubicacion'] != null) {
      $this->actualizarMovimiento(
      $val[0]['idmovubicacion'], $cantidad
      );
      } else {
      $this->adicionarMovimiento(
      $cantidad, $idubicacion, $idmovimiento
      );
      }
      break;
      }
      }
      return 1;
      } else {
      if ($val == 0) {
      return 2;
      } else {
      return 3;
      }
      }
      }

      public function desubicarProducto($aParametros)
      {
      $existencia = new DatExistenciaubicacionModel();
      $idprod = $existencia->getProducto($aParametros['idproducto']);
      $ramas = DatMovubicacion::obtenerRamasProducto(
      $idprod[0]['idindicador'], $aParametros['tipodesubicacion']
      );
      $aux = $aParametros['cantidad'];
      $i = 0;
      while ($aux != 0) {
      if ($ramas[$i] != null) {
      if ($aux > $ramas[$i]['cantidad']) {
      self::adicionaDesubicacionProducto(
      $ramas[$i], $aParametros
      );
      $i++;
      $aux = $aux - $ramas[$i]['cantidad'];
      } else {
      $ramas[$i]['cantidad'] = $aux;
      self::adicionaDesubicacionProducto(
      $ramas[$i], $aParametros
      );
      break;
      }
      } else {
      return -1;
      }
      }
      return 1;
      }

      public function adicionaDesubicacionProducto($ramas, $aParametros)
      {
      $movubic = new DatMovubicacion();
      $movubic->cantidad = $aParametros['cantidad'];
      $movubic->idestructuraubicacion = $ramas['idestructuraubicacion'];
      $movubic->idramaproducto = $ramas['idramaproducto'];
      $movubic->save();
      $idmov = $movubic->idmovubicacion;
      $movubicproducto = new DatMovubicacionproducto();
      $movubicproducto->idmovubicacion = $idmov;
      $movubicproducto->idmovimiento = $aParametros['idmovimiento'];
      $movubicproducto->save();
      }

      public function eliminarMovimiento($idmovubicacion)
      {
      DatMovubicacion::eliminar($idmovubicacion);
      }

      public function devolverDatosMovimientos($iddocumento)
      {
      $val = DatMovubicacion::devolverDatosMovimientos($iddocumento);
      return $val;
      }

      public function devolverCantidadUbicada($idmovimiento)
      {
      $val = DatMovubicacion::devolverCantidadUbicada($idmovimiento);
      return $val[0]['sum'];
      }

      public function cambiarUbicacionProducto(
      $ubicacionorigen, $ubicaciondestino, $idmovimiento, $idmovubicacion, $cantidad
      )
      {
      $val = DatMovubicacion::existeProductoMov(
      $ubicaciondestino, $idmovimiento
      );
      $movubicacion = Doctrine:: getTable('DatMovubicacion')->find(
      $idmovubicacion
      );
      $cant = $movubicacion->cantidad;

      if ($cant == $cantidad) {
      DatMovubicacion::eliminar($idmovubicacion);
      if ($val[0]['idmovubicacion'] != null) {
      $this->actualizarMovimiento(
      $val[0]['idmovubicacion'], $cantidad
      );
      return 1;
      } else {
      $this->adicionarMovimiento(
      $cantidad, $ubicaciondestino, $idmovimiento
      );
      return 1;
      }
      }
      $cantnueva = $cant - $cantidad;
      $movubicacion->cantidad = $cantnueva;
      $movubicacion->save();
      if ($val[0]['idmovubicacion'] != null) {

      $this->actualizarMovimiento($val[0]['idmovubicacion'], $cantidad);

      return 1;
      } else {

      $this->adicionarMovimiento(
      $cantidad, $ubicaciondestino, $idmovimiento
      );
      }
      return 1;
      }

      public function adicionarMovimiento($cantidad, $idubicacion, $idmovimiento)
      {

      $movubic = new DatMovubicacion();
      $movubic->cantidad = $cantidad;
      $movubic->idestructuraubicacion = $idubicacion;
      $movubic->save();
      $idmov = $movubic->idmovubicacion;

      $movubicproducto = new DatMovubicacionproducto();
      $movubicproducto->idmovubicacion = $idmov;
      $movubicproducto->idmovimiento = $idmovimiento;
      $movubicproducto->save();
      }

      public function actualizarMovimiento($idmovubicacion, $cantidad)
      {

      $movubicacion = Doctrine:: getTable('DatMovubicacion')->find(
      $idmovubicacion
      );

      $canvieja = $movubicacion->cantidad;
      $can = $canvieja + $cantidad;
      $movubicacion->cantidad = $can;
      $movubicacion->save();
      }

      public function actualizarMov($idmovubicacion, $cantidad)
      {
      $movubicacion = Doctrine:: getTable('DatMovubicacion')->find(
      $idmovubicacion
      );
      $canvieja = $movubicacion->cantidad;
      $can = $canvieja - $cantidad;
      $movubicacion->cantidad = $can;
      $movubicacion->save();
      }

      public function validarParametros($idproducto, $idestructuraubicacion)
      {
      $idestructura = $this->global->Estructura->idestructura;

      $regla = new ReglasubicacionModel();
      $tipo = $regla->cargaInicial($idestructura);

      $estructura = new DatEstructuraubicacionModel();
      $parametros = $estructura->devolverParametrosUbicacion(
      $idestructuraubicacion
      );

      $valores = $parametros[0]['NomTipoubicT']['NomCampostipoubicacionT'];

      $param = $estructura->getParametroProducto($idproducto);

      if ($tipo[0]['volumen'] == 1 && $valores['volumen'] == 1) {
      if ($param[0]['volumen'] > 0) {
      return true;
      } else {
      return false;
      }
      }
      if ($tipo[0]['peso'] == 1 && $valores['peso'] == 1) {
      if ($param[0]['peso'] > 0) {
      return true;
      } else {
      return false;
      }
      }

      return true;
      }
     */

    public function devolverEstructuras($params = false)
    {
        return DatMovubicacion::devolverEstructuras($params);
    }

}
