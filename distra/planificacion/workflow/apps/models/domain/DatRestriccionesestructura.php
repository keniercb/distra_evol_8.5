<?php

class DatRestriccionesestructura extends BaseDatRestriccionesesreuctura
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
        $idestructura, $arrayidtipodoc
    )
    {
        $connA = Doctrine_Manager:: connection();
        $cadena = "SELECT r.idestado FROM mod_flujotrabajo.dat_restriccionesestructura r
                WHERE r.idestructura = '$idestructura' AND r.estadoinicial = '1' 
                AND r.idtipodoc IN($arrayidtipodoc)";
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll();
        return $resultado;
    }

    public function ObtenerRestriccionesEstadoFinal(
        $idestructura, $arrayidtipodoc
    )
    {
        $connA = Doctrine_Manager:: connection();
        $cadena = "SELECT r.idestado FROM mod_flujotrabajo.dat_restriccionesestructura r
                WHERE r.idestructura = '$idestructura' AND r.estadofinal = '1' 
                AND r.idtipodoc IN($arrayidtipodoc)";
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll();
        return $resultado;
    }


}




