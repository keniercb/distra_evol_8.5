<?php

class DatEtapaInversion extends BaseDatEtapaInversion {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatInversion', array('local' => 'idinversion', 'foreign' => 'idinversion'));
        $this->hasOne('DatEtapa', array('local' => 'idetapa', 'foreign' => 'idetapa'));
        $this->hasOne('NomEstadosft', array('local' => 'idestadoft', 'foreign' => 'idestadosft'));
        $this->hasOne('DatEtapainverconsprov', array('local' => 'idetapainversion', 'foreign' => 'idetapainversion'));
		$this->hasMany('DatEtapainversionactespcomportamiento', array('local' => 'idetapainversion', 'foreign' => 'idetapainversion'));
    }

    public function getByid($idetapa) {
        return Doctrine::getTable('DatEtapaInversion')->find($idetapa);
    }

    public function getByidInversion($idinversion) {
        /*return Doctrine::getTable('DatEtapaInversion')->findByDql("idinversion = $idinversion ");*/
        /*$existe = Doctrine::getTable('DatInverscapexplot')->findByDql(
            "iddatcapexplotacion = $value->iddatcapexplotacion AND idinversion= $idinversion"
        );*/

        $conn = Doctrine_Manager::connection();
        $sql = "select et. idetapainversion
                FROM mod_planifinversiones.dat_etapainversion et
                WHERE et.idinversion = $idinversion ";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;

    }

    public function adicionarEtInv($params) {
        $objdato = new DatEtapaInversion();
        $objdato->idinversion = $params['idinversion'];
        $objdato->idetapa = $params['idetapa'];
        $objdato->idestadoft = $params['idestadoflujotrabajo'];
        $objdato->save();
        return $objdato->idetapainversion;
    }

    public function deleteEtInv($parametros) {
        $conn = Doctrine_Manager::connection();
        if ($parametros['idinversion'] != 0) {
            $sql = "DELETE FROM mod_planifinversiones.dat_etapainversion WHERE (idinversion =" . $parametros['idinversion'] . ")";
            $conn->execute($sql);
            return true;
        } else {
            return false;
        }
    }

    public function buscarCmp($idinversion) {
        $conn = Doctrine_Manager::connection();
        $sql = "select et. idetapainversion ,
                et.idinversion ,
                et.idetapa
                FROM mod_planifinversiones.dat_etapainversion et
                WHERE et.idinversion = " . $idinversion . "
                Group by 
                et. idetapainversion ,
                et.idinversion ,
                et.idetapa";
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function cargarPresupuestoInversionXEjercicio($parametros) {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';

        $cadenaSELECT = " SELECT ei.idetapainversion,COALESCE(ieej.valor,0) as ejecutado,COALESCE(iees.valor,0) as estimado,COALESCE(iepl.valor,0) as plan,COALESCE(iepro.valor,0) as proyeccion,ejp.ejercicio/*,
                          CASE WHEN ieej.idmoneda IS NOT NULL THEN ieej.idmoneda
                               WHEN iees.idmoneda IS NOT NULL THEN iees.idmoneda
                               WHEN iepl.idmoneda IS NOT NULL THEN iepl.idmoneda
                               ELSE iepro.idmoneda END as idmoneda*/";
        $cadenaJOIN = " FROM mod_planifinversiones.dat_etapainversion ei
                        LEFT JOIN mod_planifinversiones.dat_inversetapaejecutado ieej ON (ei.idetapainversion = ieej.idetapainversion AND ieej.idejercicio = {$parametros['idejercicio']} AND ieej.idmoneda = {$parametros['idmoneda']})
                        LEFT JOIN mod_planifinversiones.dat_inversetapaestimado iees ON (ei.idetapainversion = iees.idetapainversion AND iees.idejercicio = {$parametros['idejercicio']} AND iees.idmoneda = {$parametros['idmoneda']})
                        LEFT JOIN mod_planifinversiones.dat_inversetapaplan iepl ON (ei.idetapainversion = iepl.idetapainversion AND iepl.idejercicio = {$parametros['idejercicio']} AND iepl.idmoneda = {$parametros['idmoneda']})
                        LEFT JOIN mod_planifinversiones.dat_inversetapaproyectado iepro ON (ei.idetapainversion = iepro.idetapainversion AND iepro.idejercicio = {$parametros['idejercicio']} AND iepro.idmoneda = {$parametros['idmoneda']})
                        LEFT JOIN mod_planificacion.nom_ejercicioplanificacion ejp ON (ejp.idejercicio = {$parametros['idejercicio']})
                        ";
        $cadenaWHERE = " WHERE ei.idetapainversion = {$parametros['idetapa']} ";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
//pre_r($cadenaQUERY);die;
        $conn = Doctrine_Manager::connection();
        $datosListar = $conn->execute($cadenaQUERY);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0];
    }

    public function cargarPreConstInvXEj($parametros) {
        $cadenaSELECT = '';
        $cadenaJOIN = '';
        $cadenaWHERE = '';

        $cadenaSELECT = " SELECT *";
        $cadenaJOIN = " FROM mod_planifinversiones.dat_etapainversion ei
                        LEFT JOIN mod_planifinversiones.dat_inversetapaejecutado ieej ON ei.idetapainversion = ieej.idetapainversion
                        LEFT JOIN mod_planifinversiones.dat_inversetapaestimado iees ON ei.idetapainversion = iees.idetapainversion
                        LEFT JOIN mod_planifinversiones.dat_inversetapaplan iepl ON ei.idetapainversion = iepl.idetapainversion
                        LEFT JOIN mod_planifinversiones.dat_inversetapaproyectado iepro ON ei.idetapainversion = iepro.idetapainversion
                        LEFT JOIN mod_planificacion.nom_ejercicioplanificacion ejp ON ((iepro.idejercicio = ejp.idejercicio OR ieej.idejercicio = ejp.idejercicio
                        OR iepl.idejercicio = ejp.idejercicio OR iees.idejercicio = ejp.idejercicio) AND ejp.ejercicio IN ('{$parametros['cadenaejercicios']}'))
                        ";
        $cadenaWHERE = " WHERE ei.idetapainversion = {$parametros['idetapa']} ";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conn = Doctrine_Manager::connection();
        $datosListar = $conn->execute($cadenaQUERY);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

}
