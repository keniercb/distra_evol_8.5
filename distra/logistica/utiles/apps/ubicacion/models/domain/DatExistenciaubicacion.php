<?php

class DatExistenciaubicacion extends BaseDatExistenciaubicacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEstructuraubicacion', array('local'   => 'idestructuraubicacion',
                                            'foreign' => 'idestructuraubicacion')
        );
        $this->hasOne(
            'DatUbicacionbulto', array('local'   => 'idexistenciaubicacion',
                                       'foreign' => 'idexistenciaubicacion')
        );
        $this->hasOne(
            'DatUbicacionproducto', array('local'   => 'idexistenciaubicacion',
                                          'foreign' => 'idexistenciaubicacion')
        );
        $this->hasOne(
            'DatRamaProducto', array('local' => 'idramaproducto', 'foreign' => 'idramaproducto')
        );
    }

    public function existeProductoUbicacion($idproducto, $idestructuraubicacion)
    {
        $conn = Doctrine_Manager:: connection();
        $sql
            = 'select deu.idexistenciaubicacion
            FROM mod_logubicacion.dat_existenciaubicacion deu, mod_logubicacion.dat_ubicacionproducto dai
            Where deu.idexistenciaubicacion=dai.idexistenciaubicacion and deu.idestructuraubicacion='
            . $idestructuraubicacion . ' and dai.idproducto = ' . $idproducto;
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function estadoCapacidad($idestructuraubicacion)
    {
        $query = new Doctrine_Query();
        return $query->SELECT('sum(deu.cantidad)')
            ->from('DatExistenciaubicacion deu')
            ->where("deu.idestructuraubicacion = {$idestructuraubicacion}")
            ->fetchArray();
    }

    public function cargarUbicacionesExistencia($idproducto)
    {
        $conn = Doctrine_Manager:: connection();
        $sql
            = 'Select deu.idestructuraubicacion,deu.cantidad, de.descripcion, de.idarea, de.idpadre
                FROM mod_logubicacion.dat_existenciaubicacion deu,
                     mod_logubicacion.dat_ubicacionproducto da,
                     mod_logubicacion.dat_estructuraubicacion de
		Where deu.idestructuraubicacion=de.idestructuraubicacion and 
                      deu.idexistenciaubicacion =da.idexistenciaubicacion and  da.idproducto =' . $idproducto;
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function estadoVolumen($idestructuraubicacion)
    {
        $conn = Doctrine_Manager:: connection();
        $sql
            = 'select deu.cantidad, nih.largo, nih.ancho,nih.alto
            FROM mod_logubicacion.dat_existenciaubicacion deu,
                 mod_logubicacion.dat_ubicacionproducto dai,
                 mod_logistica.dat_producto dtp,
                 mod_datosmaestros.nom_indicadorhoja nih
            Where deu.idexistenciaubicacion=dai.idexistenciaubicacion and 
                  deu.idestructuraubicacion=' . $idestructuraubicacion . '
                  and dai.idproducto=dtp.idproducto and dtp.idprod = nih.idindicador';
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function estadoPeso($idestructuraubicacion)
    {
        $conn = Doctrine_Manager:: connection();
        $sql
            = 'Select deu.cantidad, nih.peso
            FROM mod_logubicacion.dat_existenciaubicacion deu, 
                 mod_logubicacion.dat_ubicacionproducto dai,
                 mod_logistica.dat_producto dtp,
                 mod_datosmaestros.nom_indicadorhoja nih
            Where deu.idexistenciaubicacion=dai.idexistenciaubicacion and deu.idestructuraubicacion='
            . $idestructuraubicacion
            . 'and dai.idproducto=dtp.idproducto and dtp.idprod = nih.idindicador';
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }

    public function getProducto($idproducto)
    {
        $conn = Doctrine_Manager:: connection();
        $sql
            = "Select nih.idindicador
               FROM mod_logistica.dat_producto dp, mod_datosmaestros.nom_indicadorhoja nih
               Where dp.idprod =nih.idindicador and dp.idproducto =" . $idproducto;
        $resp = $conn->execute($sql);
        $result = $resp->fetchAll();
        return $result;
    }
}





