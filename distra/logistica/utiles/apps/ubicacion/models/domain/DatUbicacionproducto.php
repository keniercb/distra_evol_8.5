<?php

class DatUbicacionproducto extends BaseDatUbicacionproducto
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idubicacion', 'foreign' => 'idestructuraubicacion'));
        $this->hasOne('DatUbicacionlote', array('local' => 'idubicacion', 'foreign' => 'idubicacion'));
        $this->hasOne('DatMovubicacion', array('local' => 'idubicacion', 'foreign' => 'idestructuraubicacion'));
    }

    public function modificarCantidadExistente($idproducto, $idubicacion, $cantidad, $operacion)
    {
        $existencia = $this->cantidadExistente($idproducto, $idubicacion);

        if (!$existencia) {
            $datUbicacion = new DatUbicacionproducto();
            $datUbicacion->synchronizeWithArray(
                array('idubicacion' => $idubicacion, 'idproducto' => $idproducto, 'cantidad' => 0)
            );
            $datUbicacion->save();
            $existencia = 0;
        }
        if ($operacion == '+') {
            $existencia = $existencia + $cantidad;
            $datEstructuraUbicacion = new DatEstructuraubicacion();
            $idarea = $datEstructuraUbicacion->getIdAreaXIdEstructura($idubicacion);
            $this->aumentarDisponible($idproducto, $idarea, $cantidad);
        } else {
            $existencia = $existencia - $cantidad;
        }
        $query = Doctrine_Query::create();
        $query->update('DatUbicacionproducto')
            ->set('cantidad', ($existencia))
            ->where("idproducto =?", $idproducto)
            ->addWhere("idubicacion = ?", $idubicacion)
            ->execute();
        return $query;
    }

    public function cantidadExistente($idproducto, $idubicacion)
    {
        $query = Doctrine_Query::create();
        $respuesta = $query->select('dup.cantidad')
            ->from('DatUbicacionproducto dup')
            ->where("dup.idproducto =?", $idproducto)
            ->addwhere("dup.idubicacion =?", $idubicacion)
            ->fetchArray();
        return $respuesta[0]['cantidad'];
    }

    public function aumentarDisponible($idproducto, $idarea, $cantidad)
    {
        $query = Doctrine_Query::create();
        $respuesta = $query->select('dap.disponible')
            ->from('DatAreaproducto dap')
            ->where("dap.idproducto =?", $idproducto)
            ->addwhere("dap.idarea =?", $idarea)
            ->fetchArray();
        $existencia = $respuesta[0]['disponible'] + $cantidad;

        $queryDos = Doctrine_Query::create();
        $queryDos->update('DatAreaproducto')
            ->set('disponible', ($existencia))
            ->where("idproducto =?", $idproducto)
            ->addWhere("idarea = ?", $idarea)
            ->execute();
    }

    public function sumarCantidades($idproducto, $idubicacion)
    {
        $conn = Doctrine_Manager:: connection();
        $sql
            = "SELECT SUM(cantidad) as cantidad
                 from mod_logubicacion.dat_ubicacionproducto da
                 where da.idproducto = {$idproducto} and da.idubicacion = {$idubicacion}";
        $resp = $conn->execute($sql);
        return $resp->fetchAll(PDO::FETCH_ASSOC);
    }

}
