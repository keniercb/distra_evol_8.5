<?php

class ConfPagosporresultadoperiodopago extends BaseConfPagosporresultadoperiodopago
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatElaborarPagos', array('local' => 'idelaborarpagos', 'foreign' => 'idelaborarpagos'));
    }

    public function getByid($idpagoporresultadoperiodopago)
    {
        return Doctrine::getTable('ConfPagosporresultadoperiodopago')->find($idpagoporresultadoperiodopago)->toArray();
    }

    /* Devuelve los pagos elaborados que se incluyen el pago por resultado para el Calculo del SBC
     *
     *
     * */

    public function getPeriodosdePagosPorIdPago($idpagoporresultado, $identidad)
    {
        $sql = "SELECT Distinct(m.idpagoporresultadoperiodopago),m.idpagoporresultado , m.idelaborarpagos,m2.idelaborarpagos ,
                 m2.fechapago , m3.idperiodopago, m3.denominacion as denperiodopago,m2.idtipopago,m2.fechainicioperiodo,m2.fechafinperiodo,
                 m2.estado,(m2.fechainicioperiodo || ' al ' || m2.fechafinperiodo) as periodopago,date_part('year',m2.fechainicioperiodo) as anyo
                 FROM mod_nomina.conf_pagosporresultadoperiodopago m
                 INNER JOIN mod_nomina.dat_elaborarpagos m2 ON m.idelaborarpagos = m2.idelaborarpagos
                 INNER JOIN mod_nomina.nom_periodopago m3 ON m3.idperiodopago = m2.idperiodopago
                 INNER JOIN mod_nomina.conf_pagosporresultadofechas cprf ON (cprf.idpagoporresultado = m.idpagoporresultado and cprf.identidad = {$identidad})
                 WHERE (m.idpagoporresultado = $idpagoporresultado)";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function eliminarPeriodosDelPago($idpagoresultado)
    {
        $sql = " delete from mod_nomina.conf_pagosporresultadoperiodopago
            WHERE mod_nomina.conf_pagosporresultadoperiodopago.idpagoporresultado = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idpagoresultado));
    }
}

