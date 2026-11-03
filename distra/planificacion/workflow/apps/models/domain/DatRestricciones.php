<?php

class DatRestricciones extends BaseDatRestricciones
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'ConfDocDatEstado',
            array('local' => 'idtipodoc', 'foreign' => 'idtipodoc')
        );
        $this->hasOne(
            'ConfDocDatEstado',
            array('local' => 'idestado', 'foreign' => 'idestado')
        );
    }

    public function ObtenerRestriccionesEstadoInicial(
        $idusuario, $arrayidtipodoc
    )
    {
        $connA = Doctrine_Manager:: connection();
        $cadena = "SELECT r.idestado FROM mod_flujotrabajo.dat_restricciones r
                WHERE r.idusuario <> '$idusuario' AND r.estadoinicial = '1' 
                AND r.idtipodoc IN($arrayidtipodoc)";

        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll();
        return $resultado;
    }

    public function ObtenerRestriccionesEstadoFinal($idusuario, $arrayidtipodoc)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena = "SELECT r.idestado FROM mod_flujotrabajo.dat_restricciones r
                WHERE r.idusuario <> '$idusuario' AND r.estadofinal = '1' 
                AND r.idtipodoc IN($arrayidtipodoc)";
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll();
        return $resultado;
    }


}




